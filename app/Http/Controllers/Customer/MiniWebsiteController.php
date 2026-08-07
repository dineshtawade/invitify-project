<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MiniWebsite;
use App\Models\MiniWebsiteTemplate;
use App\Models\SystemSetting;
use App\Models\ReferralCode;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MiniWebsiteController extends Controller
{
    public function index()
    {
        $websites = MiniWebsite::where('user_id', auth()->id())
            ->with(['template', 'rsvps', 'contactSubmissions'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($website) {
                return [
                    'id' => $website->id,
                    'title' => $website->title,
                    'slug' => $website->slug,
                    'theme' => $website->theme,
                    'is_published' => $website->is_published,
                    'template' => $website->template,
                    'rsvps_count' => $website->rsvps->count(),
                    'contact_submissions_count' => $website->contactSubmissions->count(),
                    'created_at' => $website->created_at,
                    'is_expired' => $website->isSubscriptionExpired(),
                    'expires_at' => $website->expires_at ? $website->expires_at->toDateTimeString() : null,
                ];
            });

        return Inertia::render('customer/mini-websites/index', [
            'websites' => $websites,
            'templates' => MiniWebsiteTemplate::where('status', 'published')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:mini_website_templates,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:50|unique:mini_websites,slug|alpha_dash',
            'theme' => 'nullable|string|in:cozy,clean,royal,ocean',
        ]);

        $theme = $validated['theme'] ?? 'cozy';
        $template = MiniWebsiteTemplate::findOrFail($validated['template_id']);

        $website = MiniWebsite::create([
            'user_id' => auth()->id(),
            'template_id' => $template->id,
            'type' => 'invitation', // legacy
            'title' => $validated['title'],
            'slug' => strtolower($validated['slug']),
            'theme' => $theme,
            'config' => $template->config,
            'is_published' => false,
            'expires_at' => null,
        ]);

        return redirect()->route('customer.mini-websites.edit', $website);
    }

    public function edit(MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403);
        }

        $mini_website->load('template');

        return Inertia::render('customer/mini-websites/edit', [
            'website' => $mini_website,
            'customBlocks' => \App\Models\CustomBlock::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'theme' => 'required|string|in:cozy,clean,royal,ocean',
            'is_published' => 'required|boolean',
            'config' => 'required',
        ]);

        $mini_website->update($validated);

        return redirect()->back()->with('status', 'Website updated successfully.');
    }

    public function destroy(MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403);
        }

        $mini_website->delete();

        return redirect()->route('customer.mini-websites.index')->with('status', 'Website deleted successfully.');
    }

    /**
     * Create a renewal order.
     */
    public function createRenewalOrder(Request $request, MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'days' => 'required|integer|min:1',
            'referral_code' => 'nullable|string',
        ]);

        $days = (int) $request->input('days');
        $mini_website->load('template');
        
        // End Customers: Template Price (one-time) + Hosting Price (fixed per day)
        $templatePrice = !$mini_website->is_purchased && $mini_website->template ? floatval($mini_website->template->price) : 0.0;
        $dailyHostingRate = floatval(SystemSetting::get('mini_website_hosting_price_customer', '5'));
        $hostingPrice = $dailyHostingRate * $days;
        
        $originalPrice = $templatePrice + $hostingPrice;
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
                }
            }
        }

        $finalPrice = max(0.0, $originalPrice - $discountAmount);
        $amount = (int) round($finalPrice * 100); // Amount in paise

        $keyId = SystemSetting::get('razorpay_key_id');
        $keySecret = SystemSetting::get('razorpay_key_secret');

        // Store referral/payment details in session for verification step
        session(['mini_website_checkout_' . $mini_website->id => [
            'referral_code_id' => $referralCodeId,
            'discount_amount' => $discountAmount,
            'original_price' => $originalPrice,
            'days' => $days,
            'amount' => $finalPrice,
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
            'receipt' => 'receipt_mini_' . $mini_website->id . '_' . time(),
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
            \Illuminate\Support\Facades\Log::error('Razorpay Order API Failed for MiniWebsite. HTTP Code: ' . $httpCode . ' Response: ' . $response . ' cURL Error: ' . $curlError);
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
     * Verify the renewal payment.
     */
    public function verifyRenewalPayment(Request $request, MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        // Retrieve renewal details from session
        $sessionKey = 'mini_website_checkout_' . $mini_website->id;
        $checkoutData = session($sessionKey, [
            'referral_code_id' => null,
            'discount_amount' => 0.0,
            'original_price' => 0.0,
            'days' => 1,
            'amount' => 0.0,
            'global_coupon_code' => null,
        ]);
        session()->forget($sessionKey);

        $referralCodeId = $checkoutData['referral_code_id'];
        $discountAmount = $checkoutData['discount_amount'];
        $globalCouponCode = $checkoutData['global_coupon_code'] ?? null;
        $days = $checkoutData['days'];
        $finalAmount = $checkoutData['amount'];

        // Calculate commission
        $commissionAmount = 0.0;
        if ($referralCodeId) {
            $referralCode = ReferralCode::find($referralCodeId);
            if ($referralCode) {
                $originalPrice = floatval($checkoutData['original_price'] ?? 0.0);
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

            // Extend hosting expiration
            $this->extendHostingExpiration($mini_website, $days);

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'mini_website_template_id' => $mini_website->template_id,
                'mini_website_id' => $mini_website->id,
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

            return redirect('/mini-website/' . $mini_website->slug)
                ->with('status', '🎉 Your website is now live! (Mock checkout)');
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
            // Extend hosting expiration
            $this->extendHostingExpiration($mini_website, $days);

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'mini_website_template_id' => $mini_website->template_id,
                'mini_website_id' => $mini_website->id,
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

            return redirect('/mini-website/' . $mini_website->slug)
                ->with('status', '🎉 Payment successful! Your website is now live.');
        }

        abort(400, 'Payment signature verification failed.');
    }

    /**
     * Download a ZIP package containing:
     * 1. A QR code PNG image pointing to the hosted website.
     * 2. A text file with the hosted website URL.
     * 3. An animation/screen recording preview of the mini-website.
     */
    public function downloadInviteZip(MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        // 1. Determine the hosted URL
        $hostedUrl = url('/mini-website/' . $mini_website->slug);

        // 2. Fetch/Generate QR Code PNG
        $qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' . urlencode($hostedUrl);
        $qrCodeData = null;
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(10)->get($qrCodeUrl);
            if ($response->successful()) {
                $qrCodeData = $response->body();
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('QR Code Generation failed: ' . $e->getMessage());
        }

        // 3. Retrieve or cache the sample website animation video (MP4)
        $sampleVideoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        $localVideoPath = storage_path('app/sample-preview.mp4');
        
        if (!file_exists($localVideoPath)) {
            try {
                $videoResponse = \Illuminate\Support\Facades\Http::timeout(30)->get($sampleVideoUrl);
                if ($videoResponse->successful()) {
                    if (!is_dir(dirname($localVideoPath))) {
                        mkdir(dirname($localVideoPath), 0755, true);
                    }
                    file_put_contents($localVideoPath, $videoResponse->body());
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Sample video download failed: ' . $e->getMessage());
            }
        }

        // 4. Create the ZIP Archive
        $zipFileName = 'website-' . $mini_website->slug . '.zip';
        $tempZipPath = tempnam(sys_get_temp_dir(), 'zip');

        $zip = new \ZipArchive();
        if ($zip->open($tempZipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            // Add QR Code
            if ($qrCodeData) {
                $zip->addFromString('qr-code.png', $qrCodeData);
            } else {
                $zip->addFromString('qr-code-placeholder.txt', "QR Code could not be generated dynamically. Scan Link: " . $hostedUrl);
            }

            // Add Text URL info
            $infoContent = "Invitify Mini Website Package\n";
            $infoContent .= "==============================\n\n";
            $infoContent .= "Website Title: " . $mini_website->title . "\n";
            $infoContent .= "Hosted URL: " . $hostedUrl . "\n\n";
            $infoContent .= "Scan the 'qr-code.png' file or click the URL above to view the live website.\n";
            $zip->addFromString('website-details.txt', $infoContent);

            // Add Video Preview
            if (file_exists($localVideoPath)) {
                $zip->addFile($localVideoPath, 'website-preview.mp4');
            } else {
                $zip->addFromString('preview-instructions.txt', "Animated website preview video. Visit " . $hostedUrl . " to view live animation effects.");
            }

            $zip->close();
        } else {
            abort(500, 'Could not create ZIP archive.');
        }

        // 5. Return the ZIP file download response and delete temp file afterward
        return response()->download($tempZipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    private function extendHostingExpiration(MiniWebsite $mini_website, int $days): void
    {
        $currentExpiry = $mini_website->expires_at;
        if ($currentExpiry && $currentExpiry->isFuture()) {
            $newExpiresAt = $currentExpiry->addDays($days);
        } else {
            $newExpiresAt = now()->addDays($days);
        }
        $mini_website->update([
            'is_purchased'   => true,
            'is_published'   => true,  // Auto-publish on payment
            'expires_at'     => $newExpiresAt
        ]);
    }

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
        if ($partner) {
            $wallet = $partner->getOrCreateWallet();
            $wallet->credit(
                $commissionAmount,
                'Commission from hosting renewal #' . $transaction->id . ' (Code: ' . $referralCode->code . ')',
                $transaction
            );
        }
    }
}
