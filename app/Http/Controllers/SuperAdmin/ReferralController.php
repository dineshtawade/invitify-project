<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ReferralCode;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReferralController extends Controller
{
    public function index()
    {
        $referralPartners = User::where('role', 'referral_partner')
            ->with(['referralCodes', 'wallet'])
            ->get()
            ->map(function ($user) {
                $totalSales = Transaction::whereIn('referral_code_id', $user->referralCodes->pluck('id'))
                    ->where('status', 'completed')
                    ->sum('amount');
                $totalDiscount = Transaction::whereIn('referral_code_id', $user->referralCodes->pluck('id'))
                    ->where('status', 'completed')
                    ->sum('discount_amount');
                $totalCommission = Transaction::whereIn('referral_code_id', $user->referralCodes->pluck('id'))
                    ->where('status', 'completed')
                    ->sum('commission_amount');

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_approved' => $user->is_approved,
                    'referral_discount_percentage' => $user->referral_discount_percentage,
                    'referral_commission_percentage' => $user->referral_commission_percentage,
                    'referral_max_codes' => $user->referral_max_codes,
                    'referral_codes' => $user->referralCodes,
                    'wallet_balance' => $user->wallet?->balance ?? 0,
                    'total_sales' => $totalSales,
                    'total_discount' => $totalDiscount,
                    'total_commission' => $totalCommission,
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('super-admin/referrals/index', [
            'referralPartners' => $referralPartners,
        ]);
    }

    /**
     * Super Admin sets the discount %, commission %, and max codes for a referral partner.
     */
    public function updatePermissions(Request $request, User $user)
    {
        if ($user->role !== 'referral_partner') {
            abort(400, 'User is not a referral partner.');
        }

        $validated = $request->validate([
            'referral_discount_percentage' => 'required|numeric|min:1|max:100',
            'referral_commission_percentage' => 'required|numeric|min:1|max:100',
            'referral_max_codes' => 'required|integer|min:1|max:50',
        ]);

        $user->update($validated);

        return redirect()->back()->with('status', 'Permissions updated for ' . $user->name);
    }

    public function toggleCode(ReferralCode $referralCode)
    {
        $referralCode->update(['is_active' => !$referralCode->is_active]);

        return redirect()->back()->with('status', 'Referral code status updated.');
    }

    public function destroyCode(ReferralCode $referralCode)
    {
        $referralCode->delete();

        return redirect()->back()->with('status', 'Referral code deleted.');
    }
}
