<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Transaction;
use App\Models\RedemptionRequest;
use App\Models\ManualDeposit;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $usersCount = User::count();
        $pendingApprovalsCount = User::where('is_approved', false)->count();
        
        $totalRevenue = Transaction::where('status', 'completed')->sum('amount');
        
        // Count active sessions
        $activeSessionsCount = 0;
        try {
            $activeSessionsCount = DB::table('sessions')->count();
        } catch (\Exception $e) {
            // Fallback if sessions table doesn't exist or is not readable
            $activeSessionsCount = User::where('updated_at', '>=', now()->subMinutes(15))->count();
        }

        // Pending items needing attention
        $pendingRedemptionsCount = RedemptionRequest::where('status', 'pending')->count();
        $pendingDepositsCount = ManualDeposit::where('status', 'pending')->count();

        // Recent activity
        $recentTransactions = Transaction::with(['user', 'template', 'miniWebsiteTemplate', 'businessWebsiteTemplate'])
            ->latest()
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
                    'user_name' => $t->user?->name ?? 'Unknown User',
                    'user_email' => $t->user?->email ?? 'N/A',
                    'product_name' => $productName,
                    'amount' => floatval($t->amount),
                    'status' => $t->status,
                    'payment_method' => $t->payment_method,
                    'date' => $t->created_at->diffForHumans(),
                ];
            });

        $recentUsers = User::latest()
            ->limit(5)
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'is_approved' => $u->is_approved,
                'date' => $u->created_at->diffForHumans(),
            ]);

        // Monthly Revenue Data (Last 6 Months)
        $revenueData = Transaction::where('status', 'completed')
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw("SUM(amount) as total")
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthKey = now()->subMonths($i)->format('Y-m');
            $monthName = now()->subMonths($i)->format('M');
            $found = $revenueData->firstWhere('month', $monthKey);
            $monthlyRevenue[] = [
                'label' => $monthName,
                'value' => $found ? floatval($found->total) : 0.0,
            ];
        }

        // User Roles Distribution
        $rolesData = User::select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->get();
        
        $rolesDistribution = [];
        foreach (['super_admin', 'reseller', 'referral_partner', 'customer'] as $role) {
            $found = $rolesData->firstWhere('role', $role);
            $rolesDistribution[] = [
                'role' => $role,
                'label' => ucwords(str_replace('_', ' ', $role)),
                'count' => $found ? intval($found->total) : 0,
            ];
        }

        return Inertia::render('super-admin/dashboard', [
            'stats' => [
                'total_users' => $usersCount,
                'pending_approvals' => $pendingApprovalsCount,
                'platform_revenue' => floatval($totalRevenue),
                'active_sessions' => $activeSessionsCount,
                'pending_redemptions' => $pendingRedemptionsCount,
                'pending_deposits' => $pendingDepositsCount,
            ],
            'recentTransactions' => $recentTransactions,
            'recentUsers' => $recentUsers,
            'charts' => [
                'monthly_revenue' => $monthlyRevenue,
                'roles_distribution' => $rolesDistribution,
            ],
        ]);
    }
}
