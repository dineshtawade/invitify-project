<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * View subscriptions page.
     */
    public function index()
    {
        $activeSubscription = auth()->user()->activeSubscription();

        return Inertia::render('customer/subscriptions/index', [
            'activeSubscription' => $activeSubscription,
        ]);
    }

    /**
     * Purchase/upgrade a subscription plan (mock payment).
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan_type' => 'required|string|in:invitation_pro,business_pro,unlimited_bundle',
            'price' => 'required|numeric|min:0',
        ]);

        $user = auth()->user();

        // Expire any existing active subscriptions to upgrade/switch
        Subscription::where('user_id', $user->id)
            ->where('is_active', true)
            ->update(['is_active' => false]);

        Subscription::create([
            'user_id' => $user->id,
            'plan_type' => $validated['plan_type'],
            'price' => $validated['price'],
            'starts_at' => now(),
            'expires_at' => now()->addDays(30),
            'is_active' => true,
        ]);

        return redirect()->back()->with('status', 'Successfully subscribed to the plan!');
    }
}
