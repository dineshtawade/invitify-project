<?php

namespace App\Http\Controllers\ReferralPartner;

use App\Http\Controllers\Controller;
use App\Models\ReferralCode;
use App\Models\RedemptionRequest;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();
        $codes = $user->referralCodes()->orderBy('created_at', 'desc')->get();
        $codeIds = $codes->pluck('id');

        // Aggregate stats
        $totalReferrals = Transaction::whereIn('referral_code_id', $codeIds)->where('status', 'completed')->count();
        $totalSales = Transaction::whereIn('referral_code_id', $codeIds)->where('status', 'completed')->sum('amount');
        $totalCommission = Transaction::whereIn('referral_code_id', $codeIds)->where('status', 'completed')->sum('commission_amount');

        // Recent transactions
        $recentTransactions = Transaction::with(['user', 'referralCode'])
            ->whereIn('referral_code_id', $codeIds)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'customer_name' => $t->user->name,
                'customer_email' => $t->user->email,
                'code' => $t->referralCode?->code,
                'amount' => $t->amount,
                'discount_amount' => $t->discount_amount,
                'commission_amount' => $t->commission_amount,
                'created_at' => $t->created_at,
            ]);

        // Wallet history
        $walletHistory = $wallet->transactions()
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        // Redemption requests
        $redemptions = $user->redemptionRequests()->orderBy('created_at', 'desc')->get();

        return Inertia::render('referral-partner/dashboard', [
            'codes' => $codes,
            'partner' => [
                'referral_discount_percentage' => $user->referral_discount_percentage,
                'referral_commission_percentage' => $user->referral_commission_percentage,
                'referral_max_codes' => $user->referral_max_codes ?? 5,
            ],
            'wallet' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'status' => $wallet->status,
                'total_earnings' => $wallet->transactions()->where('type', 'credit')->sum('amount'),
                'pending_withdrawals' => $user->redemptionRequests()->where('status', 'pending')->sum('amount'),
            ],
            'stats' => [
                'total_referrals' => $totalReferrals,
                'total_sales' => $totalSales,
                'total_commission' => $totalCommission,
            ],
            'recentTransactions' => $recentTransactions,
            'walletHistory' => $walletHistory,
            'redemptions' => $redemptions,
        ]);
    }

    public function requestRedemption(Request $request)
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        $validated = $request->validate([
            'amount' => 'required|numeric|min:100', // Minimum ₹100 withdrawal
            'upi_id' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'account_holder_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'ifsc_code' => 'nullable|string|max:255',
            'qr_code' => 'nullable|image|max:2048', // Max 2MB QR Code image
        ]);

        if ($validated['amount'] > $wallet->balance) {
            return redirect()->back()->with('error', 'Insufficient wallet balance.');
        }

        // Check for existing pending requests
        $pending = RedemptionRequest::where('user_id', $user->id)->where('status', 'pending')->first();
        if ($pending) {
            return redirect()->back()->with('error', 'You already have a pending redemption request.');
        }

        // Verify that at least one complete payment method is provided
        $hasUpi = !empty($validated['upi_id']);
        $hasQr = $request->hasFile('qr_code');
        $hasBank = !empty($validated['bank_name']) && 
                    !empty($validated['account_holder_name']) && 
                    !empty($validated['account_number']) && 
                    !empty($validated['ifsc_code']);

        if (!$hasUpi && !$hasQr && !$hasBank) {
            return redirect()->back()->with('error', 'Please provide either a UPI ID, QR Code image, or complete Bank Account Details.');
        }

        $qrCodePath = null;
        if ($request->hasFile('qr_code')) {
            $path = $request->file('qr_code')->store('qr_codes', 'public');
            $qrCodePath = '/storage/' . $path;
        }

        RedemptionRequest::create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->id,
            'amount' => $validated['amount'],
            'status' => 'pending',
            'upi_id' => $validated['upi_id'] ?? null,
            'bank_name' => $validated['bank_name'] ?? null,
            'account_holder_name' => $validated['account_holder_name'] ?? null,
            'account_number' => $validated['account_number'] ?? null,
            'ifsc_code' => $validated['ifsc_code'] ?? null,
            'qr_code_path' => $qrCodePath,
        ]);

        return redirect()->back()->with('status', 'Redemption request submitted. We will process it shortly.');
    }

    public function storeCode(Request $request)
    {
        $user = auth()->user();

        if (is_null($user->referral_discount_percentage)) {
            return redirect()->back()->with('error', 'Super Admin has not configured your discount allocation yet. Please contact support.');
        }

        // Check max codes
        $maxCodes = $user->referral_max_codes ?? 5;
        if ($user->referralCodes()->count() >= $maxCodes) {
            return redirect()->back()->with('error', "You have reached your limit of {$maxCodes} referral codes.");
        }

        $validated = $request->validate([
            'code' => 'nullable|string|alpha_num|max:32|unique:referral_codes,code',
            'discount_percentage' => 'required|numeric|min:0|max:' . floatval($user->referral_discount_percentage),
            'start_date' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:start_date',
        ]);

        $codeStr = strtoupper($validated['code'] ?? '');
        if (empty($codeStr)) {
            // Auto generate
            do {
                $codeStr = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $user->name), 0, 3) . rand(1000, 9999));
            } while (ReferralCode::where('code', $codeStr)->exists());
        }

        $discount = floatval($validated['discount_percentage']);
        $commission = floatval($user->referral_discount_percentage) - $discount;

        ReferralCode::create([
            'user_id' => $user->id,
            'code' => $codeStr,
            'discount_percentage' => $discount,
            'commission_percentage' => $commission,
            'is_active' => true,
            'start_date' => $validated['start_date'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        return redirect()->back()->with('status', 'Referral code created successfully.');
    }

    public function wallet()
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        // Wallet history
        $walletHistory = $wallet->transactions()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('referral-partner/wallet', [
            'wallet' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'status' => $wallet->status,
                'total_earnings' => $wallet->transactions()->where('type', 'credit')->sum('amount'),
                'pending_withdrawals' => $user->redemptionRequests()->where('status', 'pending')->sum('amount'),
            ],
            'walletHistory' => $walletHistory,
        ]);
    }

    public function paymentDetails()
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        // Redemption requests
        $redemptions = $user->redemptionRequests()->orderBy('created_at', 'desc')->get();

        return Inertia::render('referral-partner/payment-details', [
            'wallet' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'status' => $wallet->status,
                'total_earnings' => $wallet->transactions()->where('type', 'credit')->sum('amount'),
                'pending_withdrawals' => $user->redemptionRequests()->where('status', 'pending')->sum('amount'),
            ],
            'redemptions' => $redemptions,
        ]);
    }
}
