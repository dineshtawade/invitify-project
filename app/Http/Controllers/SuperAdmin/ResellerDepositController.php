<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ManualDeposit;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResellerDepositController extends Controller
{
    public function index()
    {
        $deposits = ManualDeposit::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $resellers = User::where('role', 'reseller')
            ->with('wallet')
            ->get()
            ->map(function ($reseller) {
                return [
                    'id' => $reseller->id,
                    'name' => $reseller->name,
                    'email' => $reseller->email,
                    'wallet_balance' => $reseller->wallet?->balance ?? 0.00,
                    'wallet_status' => $reseller->wallet?->status ?? 'active',
                ];
            });

        return Inertia::render('super-admin/resellers/index', [
            'deposits' => $deposits,
            'resellers' => $resellers,
            'defaultOnlineBonus' => floatval(SystemSetting::get('reseller_default_bonus_percentage', '0')),
        ]);
    }

    public function updateOnlineBonus(Request $request)
    {
        $validated = $request->validate([
            'bonus_percentage' => 'required|numeric|min:0|max:100',
        ]);

        SystemSetting::set('reseller_default_bonus_percentage', (string) $validated['bonus_percentage']);

        return redirect()->back()->with('status', 'Online payment bonus updated to ' . $validated['bonus_percentage'] . '%. All future Razorpay recharges will include this bonus automatically.');
    }

    public function approve(Request $request, ManualDeposit $deposit)
    {
        if ($deposit->status !== 'pending') {
            return redirect()->back()->with('error', 'This deposit request has already been processed.');
        }

        $validated = $request->validate([
            'bonus_percentage' => 'nullable|numeric|min:0|max:100',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $bonusPercentage = floatval($validated['bonus_percentage'] ?? $deposit->bonus_percentage);
        $bonusAmount = round($deposit->amount * ($bonusPercentage / 100), 2);
        $totalAmount = $deposit->amount + $bonusAmount;

        $deposit->update([
            'status' => 'approved',
            'bonus_percentage' => $bonusPercentage,
            'bonus_amount' => $bonusAmount,
            'admin_notes' => $validated['admin_notes'] ?? null,
            'processed_at' => now(),
        ]);

        // Credit the wallet
        $wallet = $deposit->user->getOrCreateWallet();
        $wallet->credit($totalAmount, "Manual Wallet Deposit Approved - Principal: ₹{$deposit->amount}, Bonus: ₹{$bonusAmount} ({$bonusPercentage}%)");

        return redirect()->back()->with('status', "Deposit request for ₹{$deposit->amount} approved! Wallet credited with ₹{$totalAmount}.");
    }

    public function reject(Request $request, ManualDeposit $deposit)
    {
        if ($deposit->status !== 'pending') {
            return redirect()->back()->with('error', 'This deposit request has already been processed.');
        }

        $validated = $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        $deposit->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'processed_at' => now(),
        ]);

        return redirect()->back()->with('status', 'Manual deposit request rejected.');
    }

    public function adjustBalance(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:credit,debit',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $reseller = User::findOrFail($validated['user_id']);
        if ($reseller->role !== 'reseller') {
            abort(400, 'User is not a reseller.');
        }

        $wallet = $reseller->getOrCreateWallet();
        $amount = floatval($validated['amount']);

        if ($validated['type'] === 'credit') {
            $wallet->credit($amount, "Admin Manual Balance Adjustment: " . $validated['description']);
        } else {
            if ($wallet->balance < $amount) {
                return redirect()->back()->with('error', 'Cannot debit. Insufficient wallet balance.');
            }
            $wallet->debit($amount, "Admin Manual Balance Adjustment: " . $validated['description']);
        }

        return redirect()->back()->with('status', 'Reseller wallet balance adjusted successfully.');
    }
}
