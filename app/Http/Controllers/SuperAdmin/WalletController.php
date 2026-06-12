<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\RedemptionRequest;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        $redemptionRequests = RedemptionRequest::with(['user', 'wallet'])
            ->orderBy('created_at', 'desc')
            ->get();

        $wallets = Wallet::with('user')
            ->get()
            ->map(function ($wallet) {
                return [
                    'id' => $wallet->id,
                    'user_name' => $wallet->user->name,
                    'user_email' => $wallet->user->email,
                    'balance' => $wallet->balance,
                    'status' => $wallet->status,
                    'total_credited' => $wallet->transactions()->where('type', 'credit')->sum('amount'),
                    'total_debited' => $wallet->transactions()->where('type', 'debit')->sum('amount'),
                ];
            });

        return Inertia::render('super-admin/wallets/index', [
            'wallets' => $wallets,
            'redemptionRequests' => $redemptionRequests,
        ]);
    }

    public function approveRedemption(Request $request, RedemptionRequest $redemptionRequest)
    {
        if ($redemptionRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'This request has already been processed.');
        }

        $validated = $request->validate([
            'payment_proof' => 'required|image|max:2048', // Proof is required for approval
            'admin_notes' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:approved,paid',
        ]);

        $proofPath = null;
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('receipts', 'public');
            $proofPath = '/storage/' . $path;
        }

        $status = $request->input('status', 'paid');

        $redemptionRequest->update([
            'status' => $status,
            'payment_proof_path' => $proofPath,
            'admin_notes' => $request->input('admin_notes') ?: 'Approved by Admin.',
        ]);

        // Debit the wallet
        $wallet = $redemptionRequest->wallet;
        $wallet->debit($redemptionRequest->amount, 'Wallet redemption ' . $status . ' (Request #' . $redemptionRequest->id . ')', $redemptionRequest);

        return redirect()->back()->with('status', 'Redemption approved and marked as ' . $status . '. Wallet debited by ₹' . $redemptionRequest->amount);
    }

    public function rejectRedemption(Request $request, RedemptionRequest $redemptionRequest)
    {
        if ($redemptionRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'This request has already been processed.');
        }

        $redemptionRequest->update([
            'status' => 'rejected',
            'admin_notes' => $request->input('admin_notes', 'Rejected by admin.'),
        ]);

        return redirect()->back()->with('status', 'Redemption request rejected.');
    }
}
