<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\RegisterOtpMail;
use App\Models\EmailOtp;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class RegisterOtpController extends Controller
{
    /**
     * Validate registration fields and send 6-digit OTP to user's email.
     * developed by dinesh tawade
     */
    public function sendOtp(Request $request): JsonResponse
    {
        // 1. Validate registration inputs
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'mobile' => ['required', 'string', 'digits:10'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['nullable', 'string', 'in:customer,reseller,referral_partner'],
        ];

        $role = $request->input('role', 'customer');

        if ($role === 'reseller') {
            $rules['reseller_business_name'] = ['required', 'string', 'max:255'];
            $rules['reseller_mobile_number'] = ['required', 'string', 'digits:10'];
            $rules['reseller_email'] = ['required', 'email', 'max:255'];
            $rules['reseller_gst_number'] = ['required', 'string', 'max:50'];
            $rules['reseller_business_address'] = ['nullable', 'string', 'max:1000'];
        } elseif ($role === 'referral_partner') {
            $rules['referral_city'] = ['required', 'string', 'max:255'];
            $rules['referral_email'] = ['required', 'email', 'max:255'];
            $rules['referral_phone_number'] = ['required', 'string', 'digits:10'];
            $rules['referral_social_media'] = ['nullable', 'array'];
            $rules['referral_social_media.*.platform'] = ['required_with:referral_social_media', 'string', 'max:255'];
            $rules['referral_social_media.*.username'] = ['required_with:referral_social_media', 'string', 'max:255'];
            $rules['referral_social_media.*.followers'] = ['required_with:referral_social_media', 'integer', 'min:0'];
        }

        $validated = $request->validate($rules);

        $email = strtolower(trim($validated['email']));

        // Verify email domain existence via DNS lookup
        $domain = substr(strrchr($email, '@'), 1);
        if (!empty($domain)) {
            if (!checkdnsrr($domain, 'MX') && !checkdnsrr($domain, 'A')) {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'email' => ['Mail not found. Please enter a valid and active email address.'],
                    ],
                    'message' => 'Mail not found. Please enter a valid and active email address.',
                ], 422);
            }
        }

        // 2. Throttle OTP requests (max 5 attempts per 5 minutes per email)
        $throttleKey = 'send-otp:' . $email;
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => ["Too many requests. Please wait {$seconds} seconds before requesting a new code."],
            ]);
        }
        RateLimiter::hit($throttleKey, 300);

        // 3. Prepare role details
        $role = $validated['role'] ?? 'customer';
        $isApproved = !in_array($role, ['reseller', 'referral_partner']);
        $resellerDetails = null;
        $referralDetails = null;

        if ($role === 'reseller') {
            $resellerDetails = [
                'business_name' => $request->input('reseller_business_name'),
                'mobile_number' => $request->input('reseller_mobile_number'),
                'email' => $request->input('reseller_email'),
                'gst_number' => $request->input('reseller_gst_number'),
                'business_address' => $request->input('reseller_business_address'),
            ];
        } elseif ($role === 'referral_partner') {
            $socialMedia = [];
            if (is_array($request->input('referral_social_media'))) {
                foreach ($request->input('referral_social_media') as $item) {
                    if (!empty($item['platform']) && !empty($item['username'])) {
                        $socialMedia[] = [
                            'platform' => $item['platform'],
                            'username' => $item['username'],
                            'followers' => (int)($item['followers'] ?? 0),
                        ];
                    }
                }
            }
            $referralDetails = [
                'city' => $request->input('referral_city'),
                'email' => $request->input('referral_email'),
                'phone_number' => $request->input('referral_phone_number'),
                'social_media' => $socialMedia,
            ];
        }

        $registrationData = [
            'name' => trim($validated['name']),
            'email' => $email,
            'mobile' => trim($validated['mobile']),
            'password' => Hash::make($validated['password']),
            'role' => $role,
            'is_approved' => $isApproved,
            'reseller_details' => $resellerDetails,
            'referral_details' => $referralDetails,
        ];

        // 4. Generate 6-digit OTP
        $otp = (string) random_int(100000, 999999);

        // 5. Store OTP in database
        EmailOtp::updateOrCreate(
            ['email' => $email],
            [
                'otp' => $otp,
                'registration_data' => $registrationData,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        // 6. Send OTP Email
        try {
            Mail::to($email)->send(new RegisterOtpMail($otp, $registrationData['name']));
            Log::info("📧 [REGISTER OTP] Code {$otp} dispatched to {$email}");
        } catch (\Throwable $e) {
            Log::error("❌ [REGISTER OTP] Mail send failed for {$email}: " . $e->getMessage());

            // Delete pending OTP so user can retry with correct email
            EmailOtp::where('email', $email)->delete();

            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => ['Mail not found. Please check your email address and try again.'],
                ],
                'message' => 'Mail not found. Please check your email address.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'A 6-digit verification code has been sent to ' . $email,
            'email' => $email,
        ]);
    }

    /**
     * Resend 6-digit OTP code to user's email.
     * developed by dinesh tawade
     */
    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $email = strtolower(trim($request->input('email')));

        $record = EmailOtp::where('email', $email)->first();
        if (!$record || empty($record->registration_data)) {
            return response()->json([
                'errors' => [
                    'email' => ['Registration session expired. Please fill out the form again.'],
                ],
            ], 422);
        }

        // Throttle resend
        $throttleKey = 'resend-otp:' . $email;
        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'errors' => [
                    'otp' => ["Please wait {$seconds} seconds before requesting another code."],
                ],
            ], 422);
        }
        RateLimiter::hit($throttleKey, 60);

        // Generate new OTP
        $otp = (string) random_int(100000, 999999);
        $record->update([
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        $name = $record->registration_data['name'] ?? 'User';

        try {
            Mail::to($email)->send(new RegisterOtpMail($otp, $name));
            Log::info("📧 [RESEND OTP] New code {$otp} dispatched to {$email}");
        } catch (\Throwable $e) {
            Log::error("❌ [RESEND OTP] Failed for {$email}: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'errors' => [
                    'otp' => ['Mail not found. Unable to deliver code to this address.'],
                    'email' => ['Mail not found. Please check your email address.'],
                ],
                'message' => 'Mail not found. Please check your email address.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'A new 6-digit code has been sent to your email.',
        ]);
    }

    /**
     * Verify the 6-digit OTP and complete user account creation.
     * developed by dinesh tawade
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'otp' => ['required', 'string', 'digits:6'],
        ]);

        $email = strtolower(trim($request->input('email')));
        $otpInput = trim($request->input('otp'));

        $record = EmailOtp::where('email', $email)->first();

        if (!$record || empty($record->registration_data)) {
            return response()->json([
                'errors' => [
                    'otp' => ['Verification session has expired. Please fill out the registration form again.'],
                ],
            ], 422);
        }

        if ($record->isExpired()) {
            return response()->json([
                'errors' => [
                    'otp' => ['Verification code has expired. Please click "Resend Code" to get a new one.'],
                ],
            ], 422);
        }

        if ($record->otp !== $otpInput) {
            return response()->json([
                'errors' => [
                    'otp' => ['Invalid verification code. Please check your email and enter the correct 6-digit code.'],
                ],
            ], 422);
        }

        // OTP is correct! Create user
        $data = $record->registration_data;

        // Double check email uniqueness
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'errors' => [
                    'email' => ['An account with this email address already exists. Please log in.'],
                ],
            ], 422);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'mobile' => $data['mobile'],
            'password' => $data['password'],
            'role' => $data['role'],
            'is_approved' => $data['is_approved'],
            'email_verified_at' => now(), // Email is now verified via OTP!
            'reseller_details' => $data['reseller_details'] ?? null,
            'referral_details' => $data['referral_details'] ?? null,
        ]);

        $user->markEmailAsVerified();

        // Clean up OTP record
        $record->delete();

        // Fire Fortify registered event
        event(new Registered($user));

        // Auto login if approved
        if ($user->is_approved) {
            Auth::login($user);
            if ($request->hasSession()) {
                $request->session()->regenerate();
            }
            $redirectUrl = route('dashboard');
        } else {
            // For reseller / referral_partner pending approval
            $redirectUrl = route('login') . '?status=pending_approval';
        }

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully! Welcome to Invitify.',
            'redirect' => $redirectUrl,
            'is_approved' => $user->is_approved,
        ]);
    }
}
