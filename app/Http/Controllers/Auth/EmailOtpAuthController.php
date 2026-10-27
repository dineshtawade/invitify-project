<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\RegisterOtpMail;
use App\Models\EmailOtp;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class EmailOtpAuthController extends Controller
{
    /**
     * Send 6-digit OTP code to user's email for instant authentication before customize/checkout.
     * developed by dinesh tawade
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:6'],
            'redirect_url' => ['nullable', 'string', 'max:1000'],
        ]);


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

        // Rate limiter: max 5 requests per 5 minutes per email
        $throttleKey = 'send-auth-otp:' . $email;
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => ["Too many requests. Please wait {$seconds} seconds before requesting a new code."],
                ],
                'message' => "Too many requests. Please wait {$seconds} seconds.",
            ], 422);
        }
        RateLimiter::hit($throttleKey, 300);

        // Check if user exists
        $user = User::where('email', $email)->first();
        $name = $user ? $user->name : (trim($validated['name'] ?? '') ?: explode('@', $email)[0]);

        // Generate 6-digit OTP
        $otp = (string) random_int(100000, 999999);

        // Store OTP in database
        EmailOtp::updateOrCreate(
            ['email' => $email],
            [
                'otp' => $otp,
                'registration_data' => [
                    'name' => $name,
                    'email' => $email,
                    'password' => !empty($validated['password']) ? Hash::make($validated['password']) : null,
                    'redirect_url' => $validated['redirect_url'] ?? null,
                    'is_existing_user' => (bool) $user,
                ],
                'expires_at' => now()->addMinutes(10),
            ]
        );

        // Dispatch OTP email
        try {
            Mail::to($email)->send(new RegisterOtpMail($otp, $name));
            Log::info("📧 [AUTH OTP] Code {$otp} dispatched to {$email}");
        } catch (\Throwable $e) {
            Log::error("❌ [AUTH OTP] Mail send failed for {$email}: " . $e->getMessage());

            EmailOtp::where('email', $email)->delete();

            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => ['Mail delivery failed. Please check your email address and try again.'],
                ],
                'message' => 'Unable to send verification email. Please check your email address.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => "A 6-digit verification code has been sent to {$email}",
            'email' => $email,
            'is_existing_user' => (bool) $user,
        ]);
    }

    /**
     * Resend 6-digit OTP code.
     * developed by dinesh tawade
     */
    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $email = strtolower(trim($request->input('email')));

        $record = EmailOtp::where('email', $email)->first();
        if (!$record) {
            return response()->json([
                'errors' => [
                    'email' => ['Verification session expired. Please enter your email again.'],
                ],
            ], 422);
        }

        // Throttle resends (1 per 60 seconds)
        $throttleKey = 'resend-auth-otp:' . $email;
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
            Log::info("📧 [RESEND AUTH OTP] New code {$otp} dispatched to {$email}");
        } catch (\Throwable $e) {
            Log::error("❌ [RESEND AUTH OTP] Failed for {$email}: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => ['Unable to deliver code to this address.'],
                ],
                'message' => 'Unable to send code to your email.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'A new 6-digit code has been sent to your email.',
        ]);
    }

    /**
     * Verify 6-digit OTP and log user in or register new customer.
     * developed by dinesh tawade
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'otp' => ['required', 'string', 'digits:6'],
            'password' => ['nullable', 'string', 'min:6'],
            'redirect_url' => ['nullable', 'string', 'max:1000'],
        ]);

        $email = strtolower(trim($validated['email']));
        $otpInput = trim($validated['otp']);

        $record = EmailOtp::where('email', $email)->first();

        if (!$record) {
            return response()->json([
                'errors' => [
                    'otp' => ['Verification session has expired. Please request a new code.'],
                ],
            ], 422);
        }

        if ($record->isExpired()) {
            return response()->json([
                'errors' => [
                    'otp' => ['Verification code has expired. Please click "Resend Code".'],
                ],
            ], 422);
        }

        if ($record->otp !== $otpInput) {
            return response()->json([
                'errors' => [
                    'otp' => ['Invalid verification code. Please check your email and try again.'],
                ],
            ], 422);
        }

        // OTP is valid!
        $regData = $record->registration_data ?? [];

        // Check if user already exists
        $user = User::where('email', $email)->first();

        // Determine password to set if provided
        $hashedPassword = !empty($validated['password'])
            ? Hash::make($validated['password'])
            : ($regData['password'] ?? null);

        if (!$user) {
            // Create verified customer user with chosen password
            $name = $regData['name'] ?? explode('@', $email)[0];
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'mobile' => null,
                'password' => $hashedPassword ?: Hash::make(Str::random(32)),
                'role' => 'customer',
                'is_approved' => true,
                'email_verified_at' => now(),
            ]);
        } else {
            if ($hashedPassword) {
                $user->password = $hashedPassword;
            }
            if (!$user->email_verified_at) {
                $user->markEmailAsVerified();
            } else if ($hashedPassword) {
                $user->save();
            }
        }

        // Clean up OTP record
        $record->delete();

        // Authenticate user
        Auth::login($user, true);

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // Determine target redirect URL
        $redirectUrl = $validated['redirect_url']
            ?: ($regData['redirect_url'] ?? null)
            ?: session('url.intended')
            ?: route('customer.dashboard');

        // Clear stored intended URL
        session()->forget('url.intended');

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully! Redirecting...',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'redirect' => $redirectUrl,
        ]);
    }

    /**
     * Authenticate user with email and password before customize/checkout.
     * developed by dinesh tawade
     */
    public function loginWithPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'redirect_url' => ['nullable', 'string', 'max:1000'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $email = strtolower(trim($validated['email']));
        $remember = (bool) ($validated['remember'] ?? true);

        if (!Auth::attempt(['email' => $email, 'password' => $validated['password']], $remember)) {
            return response()->json([
                'success' => false,
                'errors' => [
                    'password' => ['Invalid email or password. Please check your credentials.'],
                ],
                'message' => 'Invalid email or password.',
            ], 422);
        }

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        $user = Auth::user();

        $redirectUrl = $validated['redirect_url']
            ?: session('url.intended')
            ?: route('customer.dashboard');

        session()->forget('url.intended');

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully! Redirecting...',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'redirect' => $redirectUrl,
        ]);
    }
}

