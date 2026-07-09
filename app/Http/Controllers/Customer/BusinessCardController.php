<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\BusinessCard;
use App\Models\BusinessCardPlan;
use App\Models\SystemSetting;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BusinessCardController extends Controller
{
    // ─── Listing & Editing Existing Cards ─────────────────────────────────────

    public function index()
    {
        $cards = BusinessCard::where('user_id', auth()->id())
            ->with('plan')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('customer/business-cards/index', [
            'cards' => $cards
        ]);
    }

    public function edit($id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);

        return Inertia::render('customer/business-cards/edit', [
            'card'          => $card,
            'templates'     => $this->getTemplatesList(),
            'razorpayKeyId' => SystemSetting::get('razorpay_key_id', '')
        ]);
    }

    public function update(Request $request, $id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'company_name'       => 'sometimes|required|string|max:199',
            'slug'               => 'sometimes|required|string|max:100|unique:business_cards,slug,' . $card->id,
            'theme_css'          => 'sometimes|string',
            'logo_path'          => 'nullable|string',
            'personal_details'   => 'nullable|array',
            'social_links'       => 'nullable|array',
            'youtube_videos'     => 'nullable|array',
            'payment_details'    => 'nullable|array',
            'qr_codes'           => 'nullable|array',
            'services'           => 'nullable|array',
            'ecommerce_products' => 'nullable|array',
            'gallery'            => 'nullable|array',
            'status'             => 'sometimes|string',
            'payment_status'     => 'sometimes|string',
        ]);

        if (isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        $card->update($validated);

        return response()->json([
            'success' => true,
            'card'    => $card,
            'message' => 'Card draft saved successfully!'
        ]);
    }

    public function destroy($id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);
        $card->delete();

        return redirect()->route('customer.business-cards.index')
            ->with('success', 'Business Card deleted successfully!');
    }

    // ─── Purchase Flow ─────────────────────────────────────────────────────────

    /**
     * Return active plans as JSON (called from static-templates route).
     */
    public function getPlans()
    {
        $plans = BusinessCardPlan::active()
            ->orderBy('price')
            ->get(['id', 'name', 'duration_months', 'price', 'description']);

        return response()->json($plans);
    }

    /**
     * Create a draft Business Card without payment, and redirect to editor.
     */
    public function draftCreate(Request $request)
    {
        $validated = $request->validate([
            'template_id'  => 'required|integer|min:1|max:100',
            'plan_id'      => 'required|exists:business_card_plans,id',
            'company_name' => 'required|string|max:199',
            'slug'         => 'required|string|max:100',
        ]);

        $plan = BusinessCardPlan::findOrFail($validated['plan_id']);
        $slugBase = Str::slug($validated['slug'] ?: $validated['company_name']);

        // Ensure slug is unique
        $slug = $slugBase;
        $i = 1;
        while (BusinessCard::where('slug', $slug)->exists()) {
            $slug = $slugBase . '-' . $i++;
        }

        // Create the draft BusinessCard
        $card = BusinessCard::create([
            'user_id'            => auth()->id(),
            'company_name'       => $validated['company_name'],
            'slug'               => $slug,
            'theme_css'          => "card_css{$validated['template_id']}.css",
            'plan_id'            => $plan->id,
            'plan_expires_at'    => now()->addMonths($plan->duration_months),
            'payment_status'     => 'Pending',
            'status'             => 'draft',
            'personal_details'   => [],
            'social_links'       => [],
            'youtube_videos'     => [],
            'payment_details'    => [],
            'qr_codes'           => [],
            'services'           => [],
            'ecommerce_products' => [],
            'gallery'            => [],
        ]);

        return response()->json([
            'success'  => true,
            'card_id'  => $card->id,
            'redirect' => route('customer.business-cards.edit', $card->id),
        ]);
    }

    /**
     * Create Razorpay order for an existing draft card.
     */
    public function payOrder(Request $request, $id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);
        
        if ($card->payment_status === 'Success') {
            return response()->json(['error' => 'Card is already paid.'], 400);
        }

        $plan = $card->plan;
        $amount = (int) round($plan->price * 100);

        $keyId = SystemSetting::get('razorpay_key_id');
        $keySecret = SystemSetting::get('razorpay_key_secret');

        if (empty($keyId) || empty($keySecret)) {
            return response()->json([
                'order_id'    => 'mock_order_' . uniqid(),
                'key_id'      => null,
                'amount'      => $amount,
                'plan_name'   => $plan->name,
                'mock'        => true,
            ]);
        }

        $data = [
            'amount'   => $amount,
            'currency' => 'INR',
            'receipt'  => 'card_pay_' . $card->id . '_' . auth()->id(),
        ];

        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($data),
            CURLOPT_USERPWD        => $keyId . ':' . $keySecret,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            Log::error('Razorpay order creation failed for card: ' . $response);
            
            $errorMsg = 'Failed to create payment order.';
            if (str_contains($response, 'Authentication failed')) {
                $errorMsg = 'Invalid Razorpay API Keys. Please check Payment Settings in SuperAdmin.';
            }
            
            return response()->json(['error' => $errorMsg], 400);
        }

        $orderData = json_decode($response, true);

        return response()->json([
            'order_id'  => $orderData['id'],
            'key_id'    => $keyId,
            'amount'    => $amount,
            'plan_name' => $plan->name,
            'mock'      => false,
        ]);
    }

    /**
     * Verify payment for a draft card.
     */
    public function verifyCardPayment(Request $request, $id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);

        if ($card->payment_status === 'Success') {
            return response()->json(['success' => true]);
        }

        $validated = $request->validate([
            'razorpay_payment_id' => 'nullable|string',
            'razorpay_order_id'   => 'nullable|string',
            'razorpay_signature'  => 'nullable|string',
            'mock'                => 'boolean',
        ]);

        $isMock = $validated['mock'] ?? false;
        $paymentId = $validated['razorpay_payment_id'] ?? ('mock_pay_' . uniqid());
        $orderId   = $validated['razorpay_order_id']   ?? ('mock_ord_' . uniqid());

        if (!$isMock) {
            $keySecret = SystemSetting::get('razorpay_key_secret');
            $signature = $validated['razorpay_signature'] ?? '';

            if (empty($keySecret) || empty($signature)) {
                return response()->json(['error' => 'Payment verification failed.'], 400);
            }

            $expected = hash_hmac('sha256', $orderId . '|' . $paymentId, $keySecret);
            if (!hash_equals($expected, $signature)) {
                return response()->json(['error' => 'Invalid payment signature.'], 400);
            }
        }

        $card->update([
            'payment_status'  => 'Success',
            'status'          => 'active',
            'payment_id'      => $paymentId,
            'order_id'        => $orderId,
            'plan_expires_at' => now()->addMonths($card->plan->duration_months),
        ]);

        Transaction::create([
            'user_id'          => auth()->id(),
            'business_card_id' => $card->id,
            'amount'           => $card->plan->price,
            'payment_id'       => $paymentId,
            'order_id'         => $orderId,
            'status'           => 'completed',
            'payment_method'   => $isMock ? 'mock' : 'razorpay',
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Payment verified successfully.'
        ]);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private function getTemplatesList()
    {
        $templates = [];
        for ($i = 1; $i <= 100; $i++) {
            $thumbnail = "/images/business-cards/template{$i}.png";
            if ($i >= 36 && $i <= 100) {
                $thumbnail = "/images/business-cards/pre{$i}.webp";
            }

            $templates[] = [
                'id'        => $i,
                'name'      => "Template {$i}",
                'css_file'  => "card_css{$i}.css",
                'thumbnail' => $thumbnail
            ];
        }
        return $templates;
    }
}
