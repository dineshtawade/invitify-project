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

        // Recent activity
        $recentPurchases = Transaction::with(['template', 'miniWebsiteTemplate', 'businessWebsiteTemplate'])
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
                }

                return [
                    'id' => $t->id,
                    'product_name' => $productName,
                    'amount' => $t->amount,
                    'payment_method' => $t->payment_method,
                    'date' => $t->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('reseller/dashboard', [
            'wallet' => [
                'balance' => floatval($wallet->balance),
            ],
            'stats' => [
                'templates_purchased' => $templatesCount,
                'mini_websites_purchased' => $miniSitesCount,
                'business_websites_purchased' => $businessSitesCount,
                'total_orders' => $templatesCount + $miniSitesCount + $businessSitesCount,
            ],
            'recentPurchases' => $recentPurchases,
        ]);
    }
}
