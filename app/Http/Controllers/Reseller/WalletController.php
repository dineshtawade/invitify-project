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

        // Tax settings for GST calculations
        $taxSettings = \App\Services\TaxService::getSettings();
        $resellerDetails = is_array($user->reseller_details) 
            ? $user->reseller_details 
            : (json_decode($user->reseller_details ?? '', true) ?: []);

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
            'taxSettings' => $taxSettings,
            'resellerDetails' => $resellerDetails,
        ]);
    }

    public function createRazorpayOrder(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:100',
        ]);

        $baseAmount = floatval($validated['amount']);
        $taxSettings = \App\Services\TaxService::getSettings();
        $gstRate = floatval($taxSettings['default_gst_rate'] ?? 18.0);
        $taxAmount = round($baseAmount * ($gstRate / 100), 2);
        $totalPayable = round($baseAmount + $taxAmount, 2);
        $amountPaise = (int) round($totalPayable * 100);

        $keyId = SystemSetting::get('razorpay_key_id');
        $keySecret = SystemSetting::get('razorpay_key_secret');

        // Store target recharge amount and tax breakdown in session
        session([
            'recharge_base_amount' => $baseAmount,
            'recharge_tax_amount' => $taxAmount,
            'recharge_total_payable' => $totalPayable,
            'recharge_gst_rate' => $gstRate,
            'recharge_amount' => $baseAmount,
        ]);

        if (empty($keyId) || empty($keySecret)) {
            return response()->json([
                'order_id' => 'mock_recharge_' . uniqid(),
                'key_id' => null,
                'amount' => $amountPaise,
                'base_amount' => $baseAmount,
                'tax_amount' => $taxAmount,
                'total_payable' => $totalPayable,
                'mock' => true,
            ]);
        }

        // Razorpay order creation via cURL for Total Payable Amount (incl. GST)
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
            'base_amount' => $baseAmount,
            'tax_amount' => $taxAmount,
            'total_payable' => $totalPayable,
            'mock' => false,
        ]);
    }

    public function verifyRazorpayPayment(Request $request)
    {
        $baseAmount = floatval(session('recharge_base_amount', session('recharge_amount', 0)));
        $taxAmount = floatval(session('recharge_tax_amount', 0));
        $totalPayable = floatval(session('recharge_total_payable', $baseAmount + $taxAmount));
        $gstRate = floatval(session('recharge_gst_rate', 18.0));

        session()->forget(['recharge_base_amount', 'recharge_tax_amount', 'recharge_total_payable', 'recharge_gst_rate', 'recharge_amount']);

        if ($baseAmount <= 0) {
            return redirect()->route('reseller.wallet')->with('error', 'Recharge session expired.');
        }

        $mock = $request->input('mock', false);
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        // Calculate bonus on base recharge amount
        $bonusPercentage = floatval(SystemSetting::get('reseller_default_bonus_percentage', '0'));
        $bonusAmount = round($baseAmount * ($bonusPercentage / 100), 2);
        $totalCredit = $baseAmount + $bonusAmount;

        $resellerDetails = is_array($user->reseller_details) 
            ? $user->reseller_details 
            : (json_decode($user->reseller_details ?? '', true) ?: []);

        $resellerState = $resellerDetails['state'] ?? $resellerDetails['business_state'] ?? null;
        $taxSettings = \App\Services\TaxService::getSettings();
        $companyState = trim($taxSettings['company_state'] ?? 'Maharashtra');
        $isInterState = !empty($resellerState) && (strcasecmp(trim($resellerState), $companyState) !== 0);

        $cgstAmount = $isInterState ? 0.0 : round($taxAmount / 2, 2);
        $sgstAmount = $isInterState ? 0.0 : round($taxAmount - $cgstAmount, 2);
        $igstAmount = $isInterState ? $taxAmount : 0.0;

        if ($mock) {
            $keyId = SystemSetting::get('razorpay_key_id');
            $keySecret = SystemSetting::get('razorpay_key_secret');

            if (!empty($keyId) && !empty($keySecret)) {
                abort(400, 'Mock payment is disabled when credentials are set.');
            }

            // Recharge wallet with transaction & tax invoice
            $transaction = \App\Models\Transaction::create([
                'user_id' => $user->id,
                'amount' => $totalPayable,
                'base_amount' => $baseAmount,
                'tax_rate' => $gstRate,
                'tax_amount' => $taxAmount,
                'cgst_amount' => $cgstAmount,
                'sgst_amount' => $sgstAmount,
                'igst_amount' => $igstAmount,
                'is_inter_state' => $isInterState,
                'customer_billing_name' => $resellerDetails['business_name'] ?? $user->name,
                'customer_billing_email' => $resellerDetails['email'] ?? $user->email,
                'customer_billing_phone' => $resellerDetails['mobile_number'] ?? $user->mobile,
                'customer_billing_address' => $resellerDetails['business_address'] ?? null,
                'customer_billing_state' => $resellerState ?: $companyState,
                'customer_gstin' => $resellerDetails['gst_number'] ?? null,
                'status' => 'completed',
                'payment_method' => 'mock_recharge',
                'payment_id' => 'PAY-MOCK-' . uniqid(),
                'order_id' => 'ORD-MOCK-' . uniqid(),
            ]);
            \App\Services\TaxService::ensureInvoice($transaction);

            $wallet->credit($totalCredit, "Online Wallet Recharge (Mock) - Principal: ₹{$baseAmount}, GST: ₹{$taxAmount}, Bonus: ₹{$bonusAmount} ({$bonusPercentage}%)", $transaction);

            return redirect()->route('reseller.wallet')->with('status', "Wallet successfully recharged with ₹{$totalCredit}! (Paid ₹{$totalPayable} incl. GST, includes ₹{$bonusAmount} bonus)");
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
            $transaction = \App\Models\Transaction::create([
                'user_id' => $user->id,
                'amount' => $totalPayable,
                'base_amount' => $baseAmount,
                'tax_rate' => $gstRate,
                'tax_amount' => $taxAmount,
                'cgst_amount' => $cgstAmount,
                'sgst_amount' => $sgstAmount,
                'igst_amount' => $igstAmount,
                'is_inter_state' => $isInterState,
                'customer_billing_name' => $resellerDetails['business_name'] ?? $user->name,
                'customer_billing_email' => $resellerDetails['email'] ?? $user->email,
                'customer_billing_phone' => $resellerDetails['mobile_number'] ?? $user->mobile,
                'customer_billing_address' => $resellerDetails['business_address'] ?? null,
                'customer_billing_state' => $resellerState ?: $companyState,
                'customer_gstin' => $resellerDetails['gst_number'] ?? null,
                'status' => 'completed',
                'payment_method' => 'razorpay',
                'payment_id' => $paymentId,
                'order_id' => $orderId,
            ]);
            \App\Services\TaxService::ensureInvoice($transaction);

            $wallet->credit($totalCredit, "Online Wallet Recharge (Razorpay) - Principal: ₹{$baseAmount}, GST: ₹{$taxAmount}, Bonus: ₹{$bonusAmount} ({$bonusPercentage}%)", $transaction);
            return redirect()->route('reseller.wallet')->with('status', "Wallet successfully recharged with ₹{$totalCredit}! (Paid ₹{$totalPayable} incl. GST, includes ₹{$bonusAmount} bonus)");
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

        $baseAmount = floatval($validated['amount']);
        $taxSettings = \App\Services\TaxService::getSettings();
        $gstRate = floatval($taxSettings['default_gst_rate'] ?? 18.0);
        $taxAmount = round($baseAmount * ($gstRate / 100), 2);
        $totalPayable = round($baseAmount + $taxAmount, 2);

        $file = $request->file('screenshot');
        $filename = $file->hashName();
        $path = $file->storeAs('deposits', $filename, 'public');

        // Mirror to public/storage/deposits if it exists as a separate directory
        $publicDir = public_path('storage/deposits');
        if (!is_dir($publicDir)) {
            @mkdir($publicDir, 0755, true);
        }
        @copy(storage_path('app/public/' . $path), $publicDir . DIRECTORY_SEPARATOR . $filename);

        ManualDeposit::create([
            'user_id' => auth()->id(),
            'amount' => $baseAmount,
            'utr' => strtoupper($validated['utr']),
            'screenshot_path' => '/storage/' . $path,
            'status' => 'pending',
            'bonus_percentage' => floatval(SystemSetting::get('reseller_default_bonus_percentage', '0')),
            'bonus_amount' => 0.00,
            'admin_notes' => "Recharge: ₹{$baseAmount} + 18% GST (₹{$taxAmount}) = Total Paid: ₹{$totalPayable}",
        ]);

        return redirect()->route('reseller.wallet')->with('status', "Manual deposit request for ₹{$baseAmount} (Total Paid with GST: ₹{$totalPayable}) submitted successfully. Super admin will review and approve.");
    }
}
