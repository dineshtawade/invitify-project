<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\ManualDeposit;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class WalletController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        // Bank details from system settings
        $bankDetails = [
            'bank_name' => SystemSetting::get('reseller_bank_name', ''),
            'account_holder' => SystemSetting::get('reseller_account_holder', ''),
            'account_number' => SystemSetting::get('reseller_account_number', ''),
            'ifsc_code' => SystemSetting::get('reseller_ifsc_code', ''),
            'upi_id' => SystemSetting::get('reseller_upi_id', ''),
            'qr_code' => SystemSetting::get('reseller_qr_code', ''),
            'default_bonus' => floatval(SystemSetting::get('reseller_default_bonus_percentage', '0')),
        ];

        // Only active/pending manual deposit requests for this page
        $pendingDeposits = $user->manualDeposits()
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('reseller/wallet/index', [
            'wallet' => [
                'balance' => floatval($wallet->balance),
                'status' => $wallet->status,
            ],
            'pendingDeposits' => $pendingDeposits,
            'bankDetails' => $bankDetails,
        ]);
    }

    public function createRazorpayOrder(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:100',
        ]);

        $amountPaise = (int) round($validated['amount'] * 100);

        $keyId = SystemSetting::get('razorpay_key_id');
        $keySecret = SystemSetting::get('razorpay_key_secret');

        // Store target recharge amount in session
        session(['recharge_amount' => $validated['amount']]);

        if (empty($keyId) || empty($keySecret)) {
            return response()->json([
                'order_id' => 'mock_recharge_' . uniqid(),
                'key_id' => null,
                'amount' => $amountPaise,
                'mock' => true,
            ]);
        }

        // Razorpay order creation via cURL
        $url = 'https://api.razorpay.com/v1/orders';
        $data = [
            'amount' => $amountPaise,
            'currency' => 'INR',
            'receipt' => 'receipt_rec_' . auth()->id() . '_' . time(),
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
            Log::error('Razorpay Recharge Order API Failed. HTTP Code: ' . $httpCode . ' Response: ' . $response . ' cURL Error: ' . $curlError);
            return response()->json(['error' => 'Failed to initiate payment. Please check gateway configuration.'], 500);
        }

        $orderData = json_decode($response, true);

        return response()->json([
            'order_id' => $orderData['id'],
            'key_id' => $keyId,
            'amount' => $amountPaise,
            'mock' => false,
        ]);
    }

    public function verifyRazorpayPayment(Request $request)
    {
        $amount = session('recharge_amount', 0);
        session()->forget('recharge_amount');

        if ($amount <= 0) {
            return redirect()->route('reseller.wallet')->with('error', 'Recharge session expired.');
        }

        $mock = $request->input('mock', false);
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        // Calculate bonus
        $bonusPercentage = floatval(SystemSetting::get('reseller_default_bonus_percentage', '0'));
        $bonusAmount = round($amount * ($bonusPercentage / 100), 2);
        $totalCredit = $amount + $bonusAmount;

        if ($mock) {
            $keyId = SystemSetting::get('razorpay_key_id');
            $keySecret = SystemSetting::get('razorpay_key_secret');

            if (!empty($keyId) && !empty($keySecret)) {
                abort(400, 'Mock payment is disabled when credentials are set.');
            }

            // Recharge wallet
            $wallet->credit($totalCredit, "Online Wallet Recharge (Mock) - Principal: ₹{$amount}, Bonus: ₹{$bonusAmount} ({$bonusPercentage}%)");

            return redirect()->route('reseller.wallet')->with('status', "Wallet successfully recharged with ₹{$totalCredit}! (Includes ₹{$bonusAmount} bonus)");
        }

        $paymentId = $request->input('razorpay_payment_id');
        $orderId = $request->input('razorpay_order_id');
        $signature = $request->input('razorpay_signature');
        $keySecret = SystemSetting::get('razorpay_key_secret');

        if (empty($paymentId) || empty($orderId) || empty($signature) || empty($keySecret)) {
            abort(400, 'Invalid recharge payment details.');
        }

        $generatedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, $keySecret);

        if ($generatedSignature === $signature) {
            $wallet->credit($totalCredit, "Online Wallet Recharge (Razorpay) - Principal: ₹{$amount}, Bonus: ₹{$bonusAmount} ({$bonusPercentage}%)");
            return redirect()->route('reseller.wallet')->with('status', "Wallet successfully recharged with ₹{$totalCredit}! (Includes ₹{$bonusAmount} bonus)");
        }

        abort(400, 'Recharge payment verification failed.');
    }

    public function submitManualDeposit(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:100',
            'utr' => 'required|string|max:100|unique:manual_deposits,utr',
            'screenshot' => 'required|image|max:5120', // Max 5MB
        ]);

        $path = $request->file('screenshot')->store('deposits', 'public');

        ManualDeposit::create([
            'user_id' => auth()->id(),
            'amount' => $validated['amount'],
            'utr' => strtoupper($validated['utr']),
            'screenshot_path' => '/storage/' . $path,
            'status' => 'pending',
            'bonus_percentage' => floatval(SystemSetting::get('reseller_default_bonus_percentage', '0')),
            'bonus_amount' => 0.00,
        ]);

        return redirect()->route('reseller.wallet')->with('status', 'Manual deposit request submitted successfully. Super admin will review it.');
    }
}
