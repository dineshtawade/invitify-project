<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\UserTemplate;
use App\Models\MiniWebsite;
use App\Models\MiniWebsiteTemplate;
use App\Models\BusinessWebsite;
use App\Models\BusinessWebsiteTemplate;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function purchaseTemplate(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:templates,id',
        ]);

        $template = Template::findOrFail($validated['template_id']);
        $price = $template->getResellerPrice();
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        if ($wallet->balance < $price) {
            return redirect()->back()->with('error', 'Insufficient wallet balance. Please recharge.');
        }

        DB::transaction(function () use ($user, $wallet, $template, $price) {
            // 1. Create UserTemplate
            $userTemplate = UserTemplate::create([
                'user_id' => $user->id,
                'template_id' => $template->id,
                'custom_config' => $template->default_config,
                'is_purchased' => true,
            ]);

            // 2. Create Transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'template_id' => $template->id,
                'user_template_id' => $userTemplate->id,
                'amount' => $price,
                'status' => 'completed',
                'payment_method' => 'wallet',
            ]);

            // 3. Debit Wallet
            $wallet->debit($price, "Purchased Template: " . $template->name, $transaction);
        });

        return redirect()->route('reseller.shop')->with('status', 'Template purchased successfully using wallet balance!');
    }

    public function purchaseMiniWebsite(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:mini_website_templates,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:50|unique:mini_websites,slug|alpha_dash',
            'theme' => 'required|string|in:cozy,clean,royal,ocean',
        ]);

        $template = MiniWebsiteTemplate::findOrFail($validated['template_id']);
        $price = $template->getResellerPrice();
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        if ($wallet->balance < $price) {
            return redirect()->back()->with('error', 'Insufficient wallet balance. Please recharge.');
        }

        DB::transaction(function () use ($user, $wallet, $template, $price, $validated) {
            // 1. Create MiniWebsite
            $website = MiniWebsite::create([
                'user_id' => $user->id,
                'template_id' => $template->id,
                'type' => 'invitation',
                'title' => $validated['title'],
                'slug' => strtolower($validated['slug']),
                'theme' => $validated['theme'],
                'config' => $template->config,
                'is_published' => false,
                'expires_at' => now()->addYear(),
            ]);

            // 2. Create Transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'mini_website_template_id' => $template->id,
                'mini_website_id' => $website->id,
                'amount' => $price,
                'status' => 'completed',
                'payment_method' => 'wallet',
            ]);

            // 3. Debit Wallet
            $wallet->debit($price, "Purchased Mini Website: " . $website->title, $transaction);
        });

        return redirect()->route('reseller.shop')->with('status', 'Mini Website template purchased successfully using wallet balance!');
    }

    public function purchaseBusinessWebsite(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:business_website_templates,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:50|unique:business_websites,slug|alpha_dash',
            'theme' => 'required|string|in:cozy,clean,royal,ocean',
        ]);

        $template = BusinessWebsiteTemplate::findOrFail($validated['template_id']);
        $price = $template->getResellerPrice();
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        if ($wallet->balance < $price) {
            return redirect()->back()->with('error', 'Insufficient wallet balance. Please recharge.');
        }

        DB::transaction(function () use ($user, $wallet, $template, $price, $validated) {
            // 1. Create BusinessWebsite
            $website = BusinessWebsite::create([
                'user_id' => $user->id,
                'template_id' => $template->id,
                'title' => $validated['title'],
                'slug' => strtolower($validated['slug']),
                'theme' => $validated['theme'],
                'pages' => $template->pages,
                'is_published' => false,
                'expires_at' => now()->addYear(),
            ]);

            // 2. Create Transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'business_website_template_id' => $template->id,
                'business_website_id' => $website->id,
                'amount' => $price,
                'status' => 'completed',
                'payment_method' => 'wallet',
            ]);

            // 3. Debit Wallet
            $wallet->debit($price, "Purchased Business Website: " . $website->title, $transaction);
        });

        return redirect()->route('reseller.shop')->with('status', 'Business Website template purchased successfully using wallet balance!');
    }
}
