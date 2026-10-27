<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\UserTemplate;
use App\Models\MiniWebsite;
use App\Models\BusinessWebsite;
use App\Models\Transaction;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        $templatesCount = UserTemplate::where('user_id', $user->id)
            ->where('is_purchased', true)
            ->count();

        $miniSitesCount = MiniWebsite::where('user_id', $user->id)->count();
        $businessSitesCount = BusinessWebsite::where('user_id', $user->id)->count();

        // Ensure invoices exist for completed transactions
        $unInvoiced = Transaction::where('user_id', $user->id)->whereNull('invoice_number')->get();
        foreach ($unInvoiced as $tx) {
            \App\Services\TaxService::ensureInvoice($tx);
        }

        // Recent activity
        $recentPurchases = Transaction::with(['template', 'miniWebsiteTemplate', 'businessWebsiteTemplate', 'businessCard', 'miniWebsite', 'businessWebsite'])
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($t) {
                $productName = 'Unknown Product';
                if ($t->template) {
                    $productName = $t->template->name;
                } elseif ($t->miniWebsiteTemplate) {
                    $productName = $t->miniWebsiteTemplate->name . ' (Mini Website)';
                } elseif ($t->businessWebsiteTemplate) {
                    $productName = $t->businessWebsiteTemplate->name . ' (Business)';
                } elseif ($t->businessCard) {
                    $productName = 'Business Card: ' . $t->businessCard->title;
                } elseif ($t->miniWebsite) {
                    $productName = 'Hosted Mini Website: ' . $t->miniWebsite->title;
                } elseif ($t->businessWebsite) {
                    $productName = 'Hosted Business Website: ' . $t->businessWebsite->title;
                } elseif ($t->payment_method === 'razorpay') {
                    $productName = 'Wallet Recharge';
                }

                return [
                    'id' => $t->id,
                    'invoice_number' => $t->invoice_number,
                    'product_name' => $productName,
                    'amount' => $t->amount,
                    'payment_method' => $t->payment_method,
                    'date' => $t->created_at->diffForHumans(),
                ];
            });

        $invoicesCount = Transaction::where('user_id', $user->id)->count();

        return Inertia::render('reseller/dashboard', [
            'wallet' => [
                'balance' => floatval($wallet->balance),
            ],
            'stats' => [
                'templates_purchased' => $templatesCount,
                'mini_websites_purchased' => $miniSitesCount,
                'business_websites_purchased' => $businessSitesCount,
                'total_orders' => $templatesCount + $miniSitesCount + $businessSitesCount,
                'total_invoices' => $invoicesCount,
            ],
            'recentPurchases' => $recentPurchases,
        ]);
    }
}
