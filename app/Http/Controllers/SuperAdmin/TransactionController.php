<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions.
     */
    public function index()
    {
        $transactions = Transaction::with([
            'user', 
            'template', 
            'businessCard', 
            'miniWebsite', 
            'businessWebsite', 
            'userTemplate'
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('super-admin/transactions/index', [
            'transactions' => $transactions,
        ]);
    }
}
