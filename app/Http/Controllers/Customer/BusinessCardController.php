<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\BusinessCard;
use App\Models\BusinessCardPlan;
use App\Models\SystemSetting;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

    /**
     * Public Digital Visiting Card Designer / Builder
     * Accessible without login (guests) as well as authenticated users.
     * developed by dinesh tawade
     */
    public function createCard(Request $request)
    {
        $templateId = (int) $request->query('template', 1);
        if ($templateId < 1 || $templateId > 100) {
            $templateId = 1;
        }

        $plans = BusinessCardPlan::active()->orderBy('price')->get();
        $now = now();
        $coupons = \App\Models\Coupon::where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->whereIn('target_type', ['all', 'virtual_cards'])
            ->get()->values();

        $card = null;
        if (auth()->check()) {
            $cardId = $request->query('card_id');
            if ($cardId) {
                $card = BusinessCard::where('user_id', auth()->id())->find($cardId);
            }
        }

        return Inertia::render('customer/business-cards/edit', [
            'card'                => $card,
            'templates'           => $this->getTemplatesList(),
            'plans'               => $plans,
            'razorpayKeyId'       => SystemSetting::get('razorpay_key_id', ''),
            'coupons'             => $coupons,
            'preselectedTemplate' => $templateId,
        ]);
    }

    public function edit($id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);

        $now = now();
        $coupons = \App\Models\Coupon::where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->whereIn('target_type', ['all', 'virtual_cards'])
            ->get()
            ->filter(function ($coupon) use ($card) {
                if (empty($coupon->target_ids)) {
                    return true;
                }
                return in_array($card->plan_id, $coupon->target_ids);
            })->values();

        return Inertia::render('customer/business-cards/edit', [
            'card'          => $card,
            'templates'     => $this->getTemplatesList(),
            'plans'         => BusinessCardPlan::active()->orderBy('price')->get(),
            'razorpayKeyId' => SystemSetting::get('razorpay_key_id', ''),
            'coupons'       => $coupons,
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

        $keyId = SystemSetting::get('razorpay_key_id') ?: env('RAZORPAY_KEY_ID', env('RAZORPAY_KEY'));
        $keySecret = SystemSetting::get('razorpay_key_secret') ?: env('RAZORPAY_KEY_SECRET', env('RAZORPAY_SECRET'));

        if (empty($keyId) || empty($keySecret)) {
            return response()->json([
                'error' => 'Razorpay credentials (Key ID / Secret) are not configured. Please enter your Razorpay Key ID and Secret in Super Admin -> Payment Settings or in your .env file.',
            ], 422);
        }

        $data = [
            'amount'   => $amount,
            'currency' => 'INR',
            'receipt'  => 'card_pay_' . $card->id . '_' . auth()->id(),
        ];

        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($data),
            CURLOPT_USERPWD        => $keyId . ':' . $keySecret,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($httpCode !== 200) {
            Log::error('Razorpay order creation failed for card. HTTP Code: ' . $httpCode . ' Response: ' . $response . ' cURL Error: ' . $curlError);
            
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
            $keySecret = SystemSetting::get('razorpay_key_secret') ?: env('RAZORPAY_KEY_SECRET', env('RAZORPAY_SECRET'));
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

    /**
     * Checkout handler: creates or logs in guest, creates or updates draft card, initiates Razorpay order
     * developed by dinesh tawade
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'plan_id'            => 'required|exists:business_card_plans,id',
            'company_name'       => 'required|string|max:199',
            'theme_css'          => 'required|string',
            'card_id'            => 'nullable|integer',
            'logo_path'          => 'nullable|string',
            'personal_details'   => 'nullable|array',
            'social_links'       => 'nullable|array',
            'youtube_videos'     => 'nullable|array',
            'payment_details'    => 'nullable|array',
            'qr_codes'           => 'nullable|array',
            'services'           => 'nullable|array',
            'ecommerce_products' => 'nullable|array',
            'gallery'            => 'nullable|array',
            // User Auth Details (required if not logged in)
            'guest_name'         => 'nullable|string|max:255',
            'guest_email'        => 'nullable|email|max:255',
            'guest_phone'        => 'nullable|string|max:20',
            'guest_password'     => 'nullable|string|min:6',
        ]);

        $user = auth()->user();

        // If not authenticated, handle guest user registration or login
        if (!$user) {
            if (empty($validated['guest_name']) || empty($validated['guest_email'])) {
                return response()->json(['error' => 'Please provide your Full Name and Email to activate your card.'], 422);
            }

            $existingUser = User::where('email', $validated['guest_email'])->first();
            if ($existingUser) {
                if (!empty($validated['guest_password'])) {
                    if (Hash::check($validated['guest_password'], $existingUser->password)) {
                        Auth::login($existingUser);
                        $user = $existingUser;
                    } else {
                        return response()->json(['error' => 'An account with this email already exists. Please enter your correct password or log in.'], 422);
                    }
                } else {
                    return response()->json(['error' => 'An account with this email already exists. Please provide your password to proceed.'], 422);
                }
            } else {
                if (empty($validated['guest_password'])) {
                    return response()->json(['error' => 'Please provide a password for your account so you can manage your card.'], 422);
                }

                $user = User::create([
                    'name'        => $validated['guest_name'],
                    'email'       => $validated['guest_email'],
                    'mobile'      => $validated['guest_phone'] ?? null,
                    'password'    => Hash::make($validated['guest_password']),
                    'role'        => 'customer',
                    'is_approved' => true,
                ]);

                Auth::login($user);
            }
        }

        $plan = BusinessCardPlan::findOrFail($validated['plan_id']);

        // Generate unique slug
        $baseSlug = Str::slug($validated['company_name'] ?: 'my-card');
        if (empty($baseSlug)) {
            $baseSlug = 'card-' . Str::random(6);
        }

        $card = null;
        if (!empty($validated['card_id'])) {
            $card = BusinessCard::where('user_id', $user->id)->find($validated['card_id']);
        }

        if (!$card) {
            $slug = $baseSlug;
            $counter = 1;
            while (BusinessCard::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $card = BusinessCard::create([
                'user_id'            => $user->id,
                'company_name'       => $validated['company_name'],
                'slug'               => $slug,
                'theme_css'          => $validated['theme_css'],
                'logo_path'          => $validated['logo_path'] ?? null,
                'plan_id'            => $plan->id,
                'plan_expires_at'    => now()->addMonths($plan->duration_months),
                'payment_status'     => 'Pending',
                'status'             => 'draft',
                'personal_details'   => $validated['personal_details'] ?? [],
                'social_links'       => $validated['social_links'] ?? [],
                'youtube_videos'     => $validated['youtube_videos'] ?? [],
                'payment_details'    => $validated['payment_details'] ?? [],
                'qr_codes'           => $validated['qr_codes'] ?? [],
                'services'           => $validated['services'] ?? [],
                'ecommerce_products' => $validated['ecommerce_products'] ?? [],
                'gallery'            => $validated['gallery'] ?? [],
            ]);
        } else {
            $card->update([
                'company_name'       => $validated['company_name'],
                'theme_css'          => $validated['theme_css'],
                'logo_path'          => $validated['logo_path'] ?? $card->logo_path,
                'plan_id'            => $plan->id,
                'plan_expires_at'    => now()->addMonths($plan->duration_months),
                'personal_details'   => $validated['personal_details'] ?? $card->personal_details,
                'social_links'       => $validated['social_links'] ?? $card->social_links,
                'youtube_videos'     => $validated['youtube_videos'] ?? $card->youtube_videos,
                'payment_details'    => $validated['payment_details'] ?? $card->payment_details,
                'qr_codes'           => $validated['qr_codes'] ?? $card->qr_codes,
                'services'           => $validated['services'] ?? $card->services,
                'ecommerce_products' => $validated['ecommerce_products'] ?? $card->ecommerce_products,
                'gallery'            => $validated['gallery'] ?? $card->gallery,
            ]);
        }

        $amount = (int) round($plan->price * 100);
        $keyId = SystemSetting::get('razorpay_key_id');
        $keySecret = SystemSetting::get('razorpay_key_secret');

        if (empty($keyId) || empty($keySecret)) {
            return response()->json([
                'order_id'    => 'mock_order_' . uniqid(),
                'key_id'      => null,
                'amount'      => $amount,
                'plan_name'   => $plan->name,
                'card_id'     => $card->id,
                'card_slug'   => $card->slug,
                'mock'        => true,
            ]);
        }

        $data = [
            'amount'   => $amount,
            'currency' => 'INR',
            'receipt'  => 'card_pay_' . $card->id . '_' . $user->id,
        ];

        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($data),
            CURLOPT_USERPWD        => $keyId . ':' . $keySecret,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($httpCode !== 200) {
            Log::error('Razorpay order creation failed. HTTP Code: ' . $httpCode . ' Response: ' . $response . ' cURL: ' . $curlError);
            return response()->json(['error' => 'Failed to initialize payment gateway order.'], 400);
        }

        $orderData = json_decode($response, true);

        return response()->json([
            'order_id'  => $orderData['id'],
            'key_id'    => $keyId,
            'amount'    => $amount,
            'plan_name' => $plan->name,
            'card_id'   => $card->id,
            'card_slug' => $card->slug,
            'mock'      => false,
        ]);
    }

    /**
     * Verify payment and activate card
     * developed by dinesh tawade
     */
    public function verifyCheckout(Request $request, $id)
    {
        $card = BusinessCard::findOrFail($id);

        if ($card->payment_status === 'Success') {
            return response()->json([
                'success'  => true,
                'slug'     => $card->slug,
                'card_url' => url('/card/' . $card->slug),
            ]);
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

        $plan = $card->plan ?: BusinessCardPlan::first();
        $durationMonths = $plan ? $plan->duration_months : 12;

        $card->update([
            'payment_status'  => 'Success',
            'status'          => 'active',
            'payment_id'      => $paymentId,
            'order_id'        => $orderId,
            'plan_expires_at' => now()->addMonths($durationMonths),
        ]);

        Transaction::create([
            'user_id'          => $card->user_id,
            'business_card_id' => $card->id,
            'amount'           => $plan ? $plan->price : 0,
            'payment_id'       => $paymentId,
            'order_id'         => $orderId,
            'status'           => 'completed',
            'payment_method'   => $isMock ? 'mock' : 'razorpay',
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'Payment verified successfully! Card is now active.',
            'slug'      => $card->slug,
            'card_url'  => url('/card/' . $card->slug),
        ]);
    }

    /**
     * Quick login during checkout without page reload
     * developed by dinesh tawade
     */
    public function quickLogin(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json([
                'success' => true,
                'user'    => auth()->user(),
                'message' => 'Logged in successfully!',
            ]);
        }

        return response()->json([
            'error' => 'Invalid email or password.',
        ], 422);
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
