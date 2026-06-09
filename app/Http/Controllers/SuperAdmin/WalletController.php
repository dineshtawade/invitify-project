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

    public function approveRedemption(RedemptionRequest $redemptionRequest)
    {
        if ($redemptionRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'This request has already been processed.');
        }

        $redemptionRequest->update(['status' => 'approved']);

        // Debit the wallet
        $wallet = $redemptionRequest->wallet;
        $wallet->debit($redemptionRequest->amount, 'Wallet redemption approved (Request #' . $redemptionRequest->id . ')', $redemptionRequest);

        return redirect()->back()->with('status', 'Redemption approved. Wallet debited by ₹' . $redemptionRequest->amount);
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
