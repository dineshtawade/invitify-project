<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\MiniWebsite;
use App\Models\BusinessWebsite;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HostingController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        $miniWebsites = MiniWebsite::where('user_id', $user->id)
            ->with(['template'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($website) {
                return [
                    'id' => $website->id,
                    'title' => $website->title,
                    'slug' => $website->slug,
                    'theme' => $website->theme,
                    'is_published' => $website->is_published,
                    'template' => $website->template,
                    'created_at' => $website->created_at,
                    'expires_at' => $website->expires_at ? $website->expires_at->toIso8601String() : null,
                    'is_expired' => $website->isSubscriptionExpired(),
                ];
            });

        $businessWebsites = BusinessWebsite::where('user_id', $user->id)
            ->with(['template'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($website) {
                return [
                    'id' => $website->id,
                    'title' => $website->title,
                    'slug' => $website->slug,
                    'theme' => $website->theme,
                    'is_published' => $website->is_published,
                    'template' => $website->template,
                    'created_at' => $website->created_at,
                    'expires_at' => $website->expires_at ? $website->expires_at->toIso8601String() : null,
                    'is_expired' => $website->isSubscriptionExpired(),
                ];
            });

        return Inertia::render('reseller/websites/index', [
            'wallet' => [
                'balance' => floatval($wallet->balance),
            ],
            'miniWebsites' => $miniWebsites,
            'businessWebsites' => $businessWebsites,
        ]);
    }

    public function host(Request $request, $type, $id)
    {
        $validated = $request->validate([
            'plan' => 'required|string|in:daily,monthly,yearly',
            'days' => 'required_if:plan,daily|nullable|integer|min:5',
        ]);

        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        if ($type === 'mini') {
            $website = MiniWebsite::findOrFail($id);
        } elseif ($type === 'business') {
            $website = BusinessWebsite::findOrFail($id);
        } else {
            return redirect()->back()->with('error', 'Invalid website type.');
        }

        if ($website->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Pricing Configuration
        $price = 0;
        $daysToAdd = 0;

        if ($validated['plan'] === 'daily') {
            $daysToAdd = intval($validated['days']);
            $price = 2.00 * $daysToAdd;
        } elseif ($validated['plan'] === 'monthly') {
            $daysToAdd = 30;
            $price = 50.00;
        } elseif ($validated['plan'] === 'yearly') {
            $daysToAdd = 365;
            $price = 500.00;
        }

        if ($wallet->balance < $price) {
            return redirect()->back()->with('error', 'Insufficient wallet balance. Please recharge.');
        }

        DB::transaction(function () use ($user, $wallet, $website, $type, $price, $daysToAdd, $validated) {
            // Determine base starting date
            $baseDate = ($website->expires_at && $website->expires_at->isFuture()) 
                ? $website->expires_at 
                : now();

            $newExpiry = $baseDate->addDays($daysToAdd);

            // Update website
            $website->expires_at = $newExpiry;
            $website->is_published = true;
            $website->save();

            // Create Transaction record
            $transactionData = [
                'user_id' => $user->id,
                'amount' => $price,
                'status' => 'completed',
                'payment_method' => 'wallet',
            ];

            if ($type === 'mini') {
                $transactionData['mini_website_template_id'] = $website->template_id;
                $transactionData['mini_website_id'] = $website->id;
            } else {
                $transactionData['business_website_template_id'] = $website->template_id;
                $transactionData['business_website_id'] = $website->id;
            }

            $transaction = Transaction::create($transactionData);

            // Debit Wallet
            $desc = "Hosted " . ($type === 'mini' ? 'Mini Website' : 'Business Website') . " [{$website->title}] via {$validated['plan']} plan ({$daysToAdd} days)";
            $wallet->debit($price, $desc, $transaction);
        });

        return redirect()->back()->with('status', 'Website hosting activated/renewed successfully!');
    }
}
