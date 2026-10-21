<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\User;
use App\Models\UserTemplate;
use App\Models\SystemSetting;
use App\Models\Transaction;
use App\Models\ReferralCode;
use App\Mail\TemplatePurchaseMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * Browse all templates.
     */
    public function index()
    {
        $templates = Template::where('status', 'published')->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
            'price' => floatval($t->price),
            'bg_gradient' => $t->bg_gradient,
            'default_config' => $t->default_config,
        ]);

        $miniTemplates = \App\Models\MiniWebsiteTemplate::where('status', 'published')->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'type' => $t->type,
            'price' => floatval($t->price),
            'preview_image' => $t->preview_image,
            'config' => $t->default_config,
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
            'categories' => \App\Models\Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Start customizing a template (creates/retrieves draft and loads editor).
     */
    public function edit($encryptedId)
    {
        try {
            $id = decrypt($encryptedId);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            if (is_numeric($encryptedId)) {
                $id = intval($encryptedId);
            } else {
                abort(404);
            }
        }

        $template = Template::findOrFail($id);
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

        $now = now();
        $coupons = \App\Models\Coupon::where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->whereIn('target_type', ['all', 'templates', 'image_templates'])
            ->get()
            ->filter(function ($coupon) use ($template) {
                if (empty($coupon->target_ids)) {
                    return true;
                }
                return in_array($template->id, $coupon->target_ids);
            })->values();

        return Inertia::render('customer/templates/edit', [
            'template' => $template,
            'userTemplate' => $userTemplate,
            'coupons' => $coupons,
            'autoOpenCheckout' => session('auto_open_checkout', false),
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
     * Upload a generated video for the purchased template.
     */
    public function uploadVideo(Request $request, UserTemplate $userTemplate)
    {
        if ($userTemplate->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'video' => 'required|file|mimetypes:video/mp4',
        ]);

        $file = $request->file('video');
        $filename = 'invitation_' . $userTemplate->id . '_' . time() . '.mp4';
        
        $path = $file->storeAs('videos', $filename, 'public');

        // Delete old video if exists
        if ($userTemplate->video_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($userTemplate->video_path);
        }

        $userTemplate->update([
            'video_path' => $path,
            'edit_count' => $userTemplate->edit_count + 1,
        ]);

        return response()->json([
            'message' => 'Video generated successfully.',
            'video_url' => asset('storage/' . $path),
        ]);
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

        $this->sendPurchaseEmail($userTemplate);

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

        $template = Template::findOrFail($validated['template_id']);

        return redirect()->route('customer.templates.customize', $template->encrypted_id)
            ->with('status', 'Your customized design has been restored successfully!')
            ->with('auto_open_checkout', true);
    }

    /**
     * Authenticate or register a guest user directly during checkout,
     * claim their customized draft, and return user details to immediately open payment.
     * developed by dinesh tawade
     */
    public function quickCheckoutAuth(Request $request)
    {
        $validated = $request->validate([
            'mode' => 'required|in:login,register',
            'template_id' => 'required|exists:templates,id',
            'custom_config' => 'required|array',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'name' => 'nullable|string|max:255',
        ]);

        if ($validated['mode'] === 'register') {
            if (User::where('email', $validated['email'])->exists()) {
                return response()->json(['error' => 'An account with this email already exists. Please select "Sign In".'], 422);
            }

            $user = User::create([
                'name' => $validated['name'] ?? explode('@', $validated['email'])[0],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'customer',
                'is_approved' => true,
            ]);

            Auth::login($user);
        } else {
            if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
                return response()->json(['error' => 'Invalid email or password.'], 422);
            }
        }

        $request->session()->regenerate();

        // Save/Claim user template with their exact custom config!
        $userTemplate = UserTemplate::updateOrCreate([
            'user_id' => auth()->id(),
            'template_id' => $validated['template_id'],
        ], [
            'custom_config' => $validated['custom_config'],
            'is_purchased' => false,
        ]);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => auth()->user()->id,
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
            ],
            'user_template_id' => $userTemplate->id,
            'message' => 'Logged in and design saved successfully!',
        ]);
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
            ->get()
            ->map(function ($ut) {
                return [
                    'id' => $ut->id,
                    'encrypted_id' => $ut->encrypted_id,
                    'template_id' => $ut->template_id,
                    'template' => $ut->template,
                    'custom_config' => $ut->custom_config,
                    'is_purchased' => $ut->is_purchased,
                    'created_at' => $ut->created_at->format('M d, Y'),
                    'video_path' => $ut->video_path,
                    'video_url' => $ut->video_path ? asset('storage/' . $ut->video_path) : null,
                    'edit_count' => $ut->edit_count,
                ];
            });

        $businessCards = \App\Models\BusinessCard::where('user_id', auth()->id())
            ->where('payment_status', 'Success')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($card) {
                return [
                    'id' => $card->id,
                    'company_name' => $card->company_name,
                    'slug' => $card->slug,
                    'theme_css' => $card->theme_css,
                    'created_at' => $card->created_at->format('M d, Y'),
                ];
            });

        // Fetch all RSVPs for customer's Invitation Website
        // developed by dinesh tawade
        $userMiniWebsites = \App\Models\MiniWebsite::where('user_id', auth()->id())->get();
        $allRsvps = \App\Models\Rsvp::whereIn('mini_website_id', $userMiniWebsites->pluck('id'))
            ->with(['miniWebsite:id,title,slug,uuid'])
            ->orderBy('created_at', 'desc')
            ->get();

        $miniWebsites = \App\Models\MiniWebsite::with('template')
            ->withCount('rsvps')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($w) {
                return [
                    'id' => $w->id,
                    'uuid' => $w->uuid,
                    'title' => $w->title,
                    'slug' => $w->slug,
                    'theme' => $w->theme,
                    'type' => $w->type,
                    'is_published' => $w->is_published,
                    'rsvps_count' => $w->rsvps_count,
                    'created_at' => $w->created_at->format('M d, Y'),
                    'preview_image' => $w->template && $w->template->preview_image ? asset('storage/' . $w->template->preview_image) : null,
                ];
            });

        if ($purchasedTemplates->isEmpty() && $businessCards->isEmpty() && $miniWebsites->isEmpty()) {
            return redirect('/customer/templates');
        }

        return Inertia::render('customer/templates/purchased', [
            'purchasedTemplates' => $purchasedTemplates,
            'businessCards' => $businessCards,
            'miniWebsites' => $miniWebsites,
            'rsvps' => $allRsvps,
        ]);
    }

    /**
     * View a shared invitation card.
     */
    public function viewShared($encryptedId)
    {
        try {
            $id = decrypt($encryptedId);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            abort(404);
        }

        $userTemplate = UserTemplate::findOrFail($id);
        $userTemplate->load('template');

        return Inertia::render('public/view', [
            'userTemplate' => $userTemplate,
        ]);
    }

    /**
     * Verify a referral code or coupon for a template.
     */
    public function verifyReferral(Request $request, \App\Models\Template $template)
    {
        $code = strtoupper($request->input('referral_code'));
        if (!$code) {
            return response()->json(['error' => 'No code provided.'], 400);
        }

        // First check Referral Code
        $referralCode = ReferralCode::where('code', $code)->first();
        if ($referralCode && $referralCode->isValid()) {
            return response()->json([
                'valid' => true,
                'discount_percentage' => $referralCode->discount_percentage,
                'type' => 'referral'
            ]);
        }

        // Then check Standard Coupon
        $coupon = \App\Models\Coupon::where('code', $code)
            ->where('is_active', true)
            ->first();

        if ($coupon) {
            $now = \Carbon\Carbon::now();
            $isValidDate = true;
            if ($coupon->start_date && $now->lt($coupon->start_date)) $isValidDate = false;
            if ($coupon->end_date && $now->gt($coupon->end_date)) $isValidDate = false;

            $isValidTarget = in_array($coupon->target_type, ['all', 'templates', 'image_templates']);
            if ($isValidTarget && !empty($coupon->target_ids) && !in_array($template->id, $coupon->target_ids)) {
                $isValidTarget = false;
            }

            if ($isValidDate && $isValidTarget) {
                // Check if user already used this coupon
                $hasUsed = \App\Models\Transaction::where('user_id', auth()->id())
                    ->where('global_coupon_code', $coupon->code)
                    ->where('status', 'completed')
                    ->exists();

                if (!$hasUsed) {
                    return response()->json([
                        'valid' => true,
                        'discount_percentage' => $coupon->discount,
                        'type' => 'coupon'
                    ]);
                } else {
                    return response()->json(['error' => 'You have already used this coupon.'], 400);
                }
            }
        }

        return response()->json(['error' => 'Invalid or expired code.'], 400);
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
        $globalCouponUsed = null;

        // Apply referral code discount if provided
        $referralCodeInput = $request->input('referral_code');
        if ($referralCodeInput) {
            $globalCouponActive = SystemSetting::get('global_coupon_active', '0');
            $globalCouponCode = SystemSetting::get('global_coupon_code', '');
            $startDateStr = SystemSetting::get('global_coupon_start_date', '');
            $endDateStr = SystemSetting::get('global_coupon_end_date', '');

            $isDateValid = true;
            $now = \Carbon\Carbon::now();

            if (!empty($startDateStr)) {
                $startDate = \Carbon\Carbon::parse($startDateStr);
                if ($now->lt($startDate)) $isDateValid = false;
            }
            if (!empty($endDateStr)) {
                $endDate = \Carbon\Carbon::parse($endDateStr);
                if ($now->gt($endDate)) $isDateValid = false;
            }

            if ($globalCouponActive === '1' && !empty($globalCouponCode) && strtoupper($referralCodeInput) === strtoupper($globalCouponCode)) {
                if (!$isDateValid) {
                    return response()->json(['error' => 'This coupon is expired or not yet active.'], 400);
                }

                // Check if user already used the global coupon
                $hasUsed = \App\Models\Transaction::where('user_id', auth()->id())
                    ->where('global_coupon_code', strtoupper($globalCouponCode))
                    ->where('status', 'completed')
                    ->exists();

                if (!$hasUsed) {
                    $discountPercentage = (float) SystemSetting::get('global_coupon_discount', '0');
                    $discountAmount = round($originalPrice * ($discountPercentage / 100), 2);
                    $globalCouponUsed = strtoupper($globalCouponCode);
                } else {
                    return response()->json(['error' => 'You have already used this coupon.'], 400);
                }
            } else {
                $referralCode = ReferralCode::where('code', strtoupper($referralCodeInput))->first();
                if ($referralCode && $referralCode->isValid()) {
                    $discountAmount = round($originalPrice * ($referralCode->discount_percentage / 100), 2);
                    $referralCodeId = $referralCode->id;
                } else {
                    // Check standard Coupon table
                    $coupon = \App\Models\Coupon::where('code', strtoupper($referralCodeInput))
                        ->where('is_active', true)
                        ->first();
                    
                    if ($coupon) {
                        $isValidDate = true;
                        if ($coupon->start_date && $now->lt($coupon->start_date)) $isValidDate = false;
                        if ($coupon->end_date && $now->gt($coupon->end_date)) $isValidDate = false;
                        
                        $isValidTarget = in_array($coupon->target_type, ['all', 'templates', 'image_templates']);
                        if ($isValidTarget && !empty($coupon->target_ids) && !in_array($userTemplate->template_id, $coupon->target_ids)) {
                            $isValidTarget = false;
                        }

                        if ($isValidDate && $isValidTarget) {
                            // Check if user already used this coupon
                            $hasUsed = \App\Models\Transaction::where('user_id', auth()->id())
                                ->where('global_coupon_code', strtoupper($coupon->code))
                                ->where('status', 'completed')
                                ->exists();

                            if (!$hasUsed) {
                                // Assume discount is a percentage
                                $discountAmount = round($originalPrice * ($coupon->discount / 100), 2);
                                $globalCouponUsed = strtoupper($coupon->code);
                            } else {
                                return response()->json(['error' => 'You have already used this coupon.'], 400);
                            }
                        } else {
                            return response()->json(['error' => 'This coupon is expired, not yet active, or not applicable to this template.'], 400);
                        }
                    } else {
                        return response()->json(['error' => 'Invalid coupon or referral code.'], 400);
                    }
                }
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
            'global_coupon_code' => $globalCouponUsed,
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
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_USERPWD, $keyId . ':' . $keySecret);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($httpCode !== 200) {
            \Illuminate\Support\Facades\Log::error('Razorpay Order API Failed. HTTP Code: ' . $httpCode . ' Response: ' . $response . ' cURL Error: ' . $curlError);
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
            'global_coupon_code' => null,
        ]);
        session()->forget('checkout_referral');

        $referralCodeId = $referralData['referral_code_id'];
        $discountAmount = $referralData['discount_amount'];
        $globalCouponCode = $referralData['global_coupon_code'] ?? null;

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
                'global_coupon_code' => $globalCouponCode,
            ]);

            // Credit commission to referral partner's wallet
            $this->creditReferralCommission($referralCodeId, $commissionAmount, $transaction);

            // Send congratulatory purchase email with invitation link
            // developed by dinesh tawade
            $mailStatus = $this->sendPurchaseEmail($userTemplate, $transaction->order_id, (float) $finalAmount);

            return redirect()->route('customer.my-invitations')
                ->with('status', 'Template purchased successfully! (Mock checkout)')
                ->with('mail_status', $mailStatus);
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
                'global_coupon_code' => $globalCouponCode,
            ]);

            // Credit commission to referral partner's wallet
            $this->creditReferralCommission($referralCodeId, $commissionAmount, $transaction);

            // Send congratulatory purchase email with invitation link
            // developed by dinesh tawade
            $mailStatus = $this->sendPurchaseEmail($userTemplate, $orderId, (float) $finalAmount);

            return redirect()->route('customer.my-invitations')
                ->with('status', 'Template purchased successfully!')
                ->with('mail_status', $mailStatus);
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

    /**
     * Send congratulatory purchase email to customer with their live invitation URL.
     * developed by dinesh tawade
     */
    private function sendPurchaseEmail(UserTemplate $userTemplate, ?string $orderId = null, ?float $amount = null): array
    {
        $user = auth()->user() ?? $userTemplate->user;
        $recipientEmail = $user?->email;

        if (!$user || empty($recipientEmail)) {
            $status = [
                'sent' => false,
                'to' => null,
                'from' => config('mail.from.address'),
                'error' => 'No authenticated user or email found for this purchase.',
                'message' => 'User email is missing.'
            ];
            session()->flash('mail_status', $status);
            Log::warning("Purchase email skipped - no user email found: ", $status);
            return $status;
        }

        $userTemplate->loadMissing('template');
        $invitationUrl = route('invitations.view', $userTemplate->encrypted_id);
        $templateName = $userTemplate->template?->name ?? 'Digital Invitation';
        $templateType = ucfirst($userTemplate->template?->type ?? 'Card');

        try {
            $mail = new TemplatePurchaseMail($user, $userTemplate, $invitationUrl, $orderId, $amount);

            $fromAddress = config('mail.from.address');
            Mail::to($recipientEmail)->send($mail);

            $status = [
                'sent' => true,
                'to' => $recipientEmail,
                'from' => $fromAddress,
                'item' => "{$templateName} ({$templateType})",
                'template' => $templateName,
                'type' => $templateType,
                'order_id' => $orderId,
                'amount' => $amount,
                'url' => $invitationUrl,
                'timestamp' => now()->toDateTimeString(),
                'message' => "Congratulations email successfully sent to {$recipientEmail}"
            ];
            Log::info("📧 Template Purchase Email Sent: ", $status);
        } catch (\Throwable $e) {
            $status = [
                'sent' => false,
                'to' => $recipientEmail,
                'from' => config('mail.from.address'),
                'item' => $templateName,
                'order_id' => $orderId,
                'error' => $e->getMessage(),
                'timestamp' => now()->toDateTimeString(),
                'message' => "Failed to deliver email: " . $e->getMessage()
            ];
            Log::error("❌ Template Purchase Email Failed: ", $status);
        }

        session()->flash('mail_status', $status);
        return $status;
    }
}
