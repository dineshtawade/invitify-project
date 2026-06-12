<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\UserTemplate;
use App\Models\SystemSetting;
use App\Models\Transaction;
use App\Models\ReferralCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * Browse all templates.
     */
    public function index()
    {
        $templates = Template::all()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
            'price' => floatval($t->price),
            'bg_gradient' => $t->bg_gradient,
            'default_config' => $t->default_config,
        ]);

        $miniTemplates = \App\Models\MiniWebsiteTemplate::all()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'type' => $t->type,
            'price' => floatval($t->price),
            'preview_image' => $t->preview_image,
        ]);

        $businessTemplates = \App\Models\BusinessWebsiteTemplate::all()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'price' => floatval($t->price),
            'preview_image' => $t->preview_image,
        ]);

        return Inertia::render('customer/templates/index', [
            'templates' => $templates,
            'miniTemplates' => $miniTemplates,
            'businessTemplates' => $businessTemplates,
        ]);
    }

    /**
     * Start customizing a template (creates/retrieves draft and loads editor).
     */
    public function edit(Template $template)
    {
        $userTemplate = null;

        if (auth()->check()) {
            $userTemplate = UserTemplate::firstOrCreate([
                'user_id' => auth()->id(),
                'template_id' => $template->id,
            ], [
                'custom_config' => $template->default_config,
                'is_purchased' => false,
            ]);
        } else {
            // Mock object for guest users
            $userTemplate = [
                'id' => null,
                'user_id' => null,
                'template_id' => $template->id,
                'custom_config' => $template->default_config,
                'is_purchased' => false,
            ];
        }

        return Inertia::render('customer/templates/edit', [
            'template' => $template,
            'userTemplate' => $userTemplate,
        ]);
    }

    /**
     * Save the customized configuration as draft.
     */
    public function saveDraft(Request $request, UserTemplate $userTemplate)
    {
        if ($userTemplate->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'custom_config' => 'required|array',
        ]);

        $userTemplate->update([
            'custom_config' => $validated['custom_config'],
        ]);

        return redirect()->back()->with('status', 'Draft saved successfully.');
    }

    /**
     * Finalize purchasing a template.
     */
    public function purchase(Request $request, UserTemplate $userTemplate)
    {
        if ($userTemplate->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $userTemplate->update([
            'is_purchased' => true,
        ]);

        return redirect()->route('customer.my-invitations')->with('status', 'Template purchased successfully!');
    }

    /**
     * Claim a guest-customized template after they log in or register.
     */
    public function claim(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:templates,id',
            'custom_config' => 'required|array',
        ]);

        $userTemplate = UserTemplate::updateOrCreate([
            'user_id' => auth()->id(),
            'template_id' => $validated['template_id'],
        ], [
            'custom_config' => $validated['custom_config'],
            'is_purchased' => false,
        ]);

        return redirect()->route('customer.templates.customize', $validated['template_id'])
            ->with('status', 'Your draft has been successfully restored!');
    }

    /**
     * View all purchased invitations.
     */
    public function purchased()
    {
        $purchasedTemplates = UserTemplate::with('template')
            ->where('user_id', auth()->id())
            ->where('is_purchased', true)
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('customer/templates/purchased', [
            'purchasedTemplates' => $purchasedTemplates,
        ]);
    }

    /**
     * View a shared invitation card.
     */
    public function viewShared(UserTemplate $userTemplate)
    {
        $userTemplate->load('template');

        return Inertia::render('public/view', [
            'userTemplate' => $userTemplate,
        ]);
    }

    /**
     * Create a Razorpay order or fallback to mock order if credentials are not configured.
     */
    public function createRazorpayOrder(Request $request, UserTemplate $userTemplate)
    {
        if ($userTemplate->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $userTemplate->load('template');
        $originalPrice = floatval($userTemplate->template->price);
        $discountAmount = 0;
        $referralCodeId = null;

        // Apply referral code discount if provided
        $referralCodeInput = $request->input('referral_code');
        if ($referralCodeInput) {
            $referralCode = ReferralCode::where('code', strtoupper($referralCodeInput))->first();
            if ($referralCode && $referralCode->isValid()) {
                $discountAmount = round($originalPrice * ($referralCode->discount_percentage / 100), 2);
                $referralCodeId = $referralCode->id;
            }
        }

        $finalPrice = max(0, $originalPrice - $discountAmount);
        $amount = (int) round($finalPrice * 100); // Amount in paise

        $keyId = SystemSetting::get('razorpay_key_id');
        $keySecret = SystemSetting::get('razorpay_key_secret');

        // Store referral info in session for verification step
        session(['checkout_referral' => [
            'referral_code_id' => $referralCodeId,
            'discount_amount' => $discountAmount,
            'original_price' => $originalPrice,
        ]]);

        // If credentials are not set, fallback to mock order
        if (empty($keyId) || empty($keySecret)) {
            return response()->json([
                'order_id' => 'mock_order_' . uniqid(),
                'key_id' => null,
                'amount' => $amount,
                'mock' => true,
                'discount_amount' => $discountAmount,
            ]);
        }

        // Create Razorpay Order using cURL
        $url = 'https://api.razorpay.com/v1/orders';
        $data = [
            'amount' => $amount,
            'currency' => 'INR',
            'receipt' => 'receipt_inv_' . $userTemplate->id,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_USERPWD, $keyId . ':' . $keySecret);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            \Illuminate\Support\Facades\Log::error('Razorpay Order API Failed: ' . $response);
            return response()->json(['error' => 'Failed to create payment order. Please check credentials.'], 500);
        }

        $orderData = json_decode($response, true);

        return response()->json([
            'order_id' => $orderData['id'],
            'key_id' => $keyId,
            'amount' => $amount,
            'mock' => false,
            'discount_amount' => $discountAmount,
        ]);
    }

    /**
     * Verify Razorpay payment signature.
     */
    public function verifyRazorpayPayment(Request $request, UserTemplate $userTemplate)
    {
        if ($userTemplate->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        // Retrieve referral info from session
        $referralData = session('checkout_referral', [
            'referral_code_id' => null,
            'discount_amount' => 0,
            'original_price' => 0,
        ]);
        session()->forget('checkout_referral');

        $referralCodeId = $referralData['referral_code_id'];
        $discountAmount = $referralData['discount_amount'];

        // Calculate commission
        $commissionAmount = 0;
        if ($referralCodeId) {
            $referralCode = ReferralCode::find($referralCodeId);
            if ($referralCode) {
                $originalPrice = floatval($referralData['original_price'] ?? 0);
                $commissionAmount = round($originalPrice * ($referralCode->commission_percentage / 100), 2);
            }
        }

        $mock = $request->input('mock', false);

        if ($mock) {
            $keyId = SystemSetting::get('razorpay_key_id');
            $keySecret = SystemSetting::get('razorpay_key_secret');

            if (!empty($keyId) && !empty($keySecret)) {
                abort(400, 'Mock payment is disabled when credentials are set.');
            }

            $userTemplate->load('template');
            $finalAmount = floatval($userTemplate->template->price) - $discountAmount;
            $userTemplate->update(['is_purchased' => true]);

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'template_id' => $userTemplate->template_id,
                'user_template_id' => $userTemplate->id,
                'amount' => $finalAmount,
                'payment_id' => 'mock_pay_' . uniqid(),
                'order_id' => 'mock_ord_' . uniqid(),
                'status' => 'completed',
                'payment_method' => 'mock',
                'referral_code_id' => $referralCodeId,
                'discount_amount' => $discountAmount,
                'commission_amount' => $commissionAmount,
            ]);

            // Credit commission to referral partner's wallet
            $this->creditReferralCommission($referralCodeId, $commissionAmount, $transaction);

            return redirect()->route('customer.my-invitations')->with('status', 'Template purchased successfully! (Mock checkout)');
        }

        // Verify Razorpay Payment Signature
        $paymentId = $request->input('razorpay_payment_id');
        $orderId = $request->input('razorpay_order_id');
        $signature = $request->input('razorpay_signature');
        $keySecret = SystemSetting::get('razorpay_key_secret');

        if (empty($paymentId) || empty($orderId) || empty($signature) || empty($keySecret)) {
            abort(400, 'Invalid payment details or secret not found.');
        }

        $generatedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, $keySecret);

        if ($generatedSignature === $signature) {
            $userTemplate->load('template');
            $finalAmount = floatval($userTemplate->template->price) - $discountAmount;
            $userTemplate->update(['is_purchased' => true]);

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'template_id' => $userTemplate->template_id,
                'user_template_id' => $userTemplate->id,
                'amount' => $finalAmount,
                'payment_id' => $paymentId,
                'order_id' => $orderId,
                'status' => 'completed',
                'payment_method' => 'razorpay',
                'referral_code_id' => $referralCodeId,
                'discount_amount' => $discountAmount,
                'commission_amount' => $commissionAmount,
            ]);

            // Credit commission to referral partner's wallet
            $this->creditReferralCommission($referralCodeId, $commissionAmount, $transaction);

            return redirect()->route('customer.my-invitations')->with('status', 'Template purchased successfully!');
        }

        abort(400, 'Payment signature verification failed.');
    }

    /**
     * Credit the referral partner's wallet with the commission.
     */
    private function creditReferralCommission(?int $referralCodeId, float $commissionAmount, Transaction $transaction): void
    {
        if (!$referralCodeId || $commissionAmount <= 0) {
            return;
        }

        $referralCode = ReferralCode::find($referralCodeId);
        if (!$referralCode) {
            return;
        }

        // Increment the usage count
        $referralCode->increment('usage_count');

        // Credit the wallet
        $partner = $referralCode->user;
        $wallet = $partner->getOrCreateWallet();
        $wallet->credit(
            $commissionAmount,
            'Commission from sale #' . $transaction->id . ' (Code: ' . $referralCode->code . ')',
            $transaction
        );
    }
}
