<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PaymentHistoryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        // Wallet transactions ledger logs
        $transactions = $wallet->transactions()
            ->orderBy('created_at', 'desc')
            ->get();

        // Manual deposit requests (both pending and processed)
        $manualDeposits = $user->manualDeposits()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('reseller/payment-history/index', [
            'wallet' => [
                'balance' => floatval($wallet->balance),
            ],
            'transactions' => $transactions,
            'manualDeposits' => $manualDeposits,
        ]);
    }
}
