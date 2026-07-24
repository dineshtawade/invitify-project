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
    public function index(\Illuminate\Http\Request $request)
    {
        $query = Transaction::with([
            'user', 
            'template', 
            'businessCard', 
            'miniWebsite', 
            'businessWebsite', 
            'userTemplate'
        ]);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('transaction_id', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                  });
        }

        $totalTransactions = $query->count();
        $totalRevenue = $query->sum('amount');
        $avgTransactionValue = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;

        $transactions = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('super-admin/transactions/index', [
            'transactions' => $transactions,
            'filters' => $request->only('search'),
            'metrics' => [
                'total_transactions' => $totalTransactions,
                'total_revenue' => $totalRevenue,
                'avg_transaction_value' => $avgTransactionValue,
            ]
        ]);
    }
}
