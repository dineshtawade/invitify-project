<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\BusinessCard;
use App\Models\BusinessCardPlan;
use App\Models\SystemSetting;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BusinessCardController extends Controller
{
    // ─── Listing & Editing Existing Cards ─────────────────────────────────────

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:199',
            'slug'         => 'required|string|max:100',
        ]);

        $slugBase = Str::slug($validated['slug'] ?: $validated['company_name']);

        // Ensure slug is unique
        $slug = $slugBase;
        $i = 1;
        while (BusinessCard::where('slug', $slug)->exists()) {
            $slug = $slugBase . '-' . $i++;
        }

        $plan = BusinessCardPlan::first();

        // Create the draft BusinessCard
        $card = BusinessCard::create([
            'user_id'      => auth()->id(),
            'plan_id'      => $plan ? $plan->id : 1, // Fallback to 1 if no plan exists
            'company_name' => $validated['company_name'],
            'slug'         => $slug,
            'theme_css'    => 'indigo',
            'status'       => 'draft',
            'payment_status' => 'Pending',
        ]);

        return redirect()->route('reseller.business-cards.index')
            ->with('success', 'Digital Business Card created successfully!');
    }

    public function index()
    {
        $cards = BusinessCard::where('user_id', auth()->id())
            ->with('plan')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('reseller/business-cards/index', [
            'cards' => $cards
        ]);
    }

    public function edit($id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);

        $now = now();
        $coupons = \App\Models\Coupon::where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->whereIn('target_type', ['all', 'virtual_cards'])
            ->get()
            ->filter(function ($coupon) use ($card) {
                if (empty($coupon->target_ids)) {
                    return true;
                }
                return in_array($card->plan_id, $coupon->target_ids);
            })->values();

        return Inertia::render('reseller/business-cards/edit', [
            'card'          => $card,
            'templates'     => $this->getTemplatesList(),
            'razorpayKeyId' => SystemSetting::get('razorpay_key_id', ''),
            'coupons'       => $coupons,
        ]);
    }

    public function update(Request $request, $id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'company_name'       => 'sometimes|required|string|max:199',
            'slug'               => 'sometimes|required|string|max:100|unique:business_cards,slug,' . $card->id,
            'theme_css'          => 'sometimes|string',
            'logo_path'          => 'nullable|string',
            'personal_details'   => 'nullable|array',
            'social_links'       => 'nullable|array',
            'youtube_videos'     => 'nullable|array',
            'payment_details'    => 'nullable|array',
            'qr_codes'           => 'nullable|array',
            'services'           => 'nullable|array',
            'ecommerce_products' => 'nullable|array',
            'gallery'            => 'nullable|array',
            'status'             => 'sometimes|string',
            'payment_status'     => 'sometimes|string',
        ]);

        if (isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        $card->update($validated);

        return response()->json([
            'success' => true,
            'card'    => $card,
            'message' => 'Card draft saved successfully!'
        ]);
    }

    public function destroy($id)
    {
        $card = BusinessCard::where('user_id', auth()->id())->findOrFail($id);
        $card->delete();

        return redirect()->route('reseller.business-cards.index')
            ->with('success', 'Business Card deleted successfully!');
    }

    // ─── Purchase Flow ─────────────────────────────────────────────────────────

    /**
     * Return active plans as JSON (called from static-templates route).
     */
    public function getPlans()
    {
        $plans = BusinessCardPlan::active()
            ->orderBy('price')
            ->get(['id', 'name', 'duration_months', 'price', 'description']);

        return response()->json($plans);
    }

    /**
     * Create a draft Business Card without payment, and redirect to editor.
     */
    public function draftCreate(Request $request)
    {
        $validated = $request->validate([
            'template_id'  => 'required|integer|min:1|max:100',
            'plan_id'      => 'required|exists:business_card_plans,id',
            'company_name' => 'required|string|max:199',
            'slug'         => 'required|string|max:100',
        ]);

        $plan = BusinessCardPlan::findOrFail($validated['plan_id']);
        $slugBase = Str::slug($validated['slug'] ?: $validated['company_name']);

        // Ensure slug is unique
        $slug = $slugBase;
        $i = 1;
        while (BusinessCard::where('slug', $slug)->exists()) {
            $slug = $slugBase . '-' . $i++;
        }

        // Create the draft BusinessCard
        $card = BusinessCard::create([
            'user_id'            => auth()->id(),
            'company_name'       => $validated['company_name'],
            'slug'               => $slug,
            'theme_css'          => "card_css{$validated['template_id']}.css",
            'plan_id'            => $plan->id,
            'plan_expires_at'    => now()->addMonths($plan->duration_months),
            'payment_status'     => 'Pending',
            'status'             => 'draft',
            'personal_details'   => [],
            'social_links'       => [],
            'youtube_videos'     => [],
            'payment_details'    => [],
            'qr_codes'           => [],
            'services'           => [],
            'ecommerce_products' => [],
            'gallery'            => [],
        ]);

        return response()->json([
            'success'  => true,
            'card_id'  => $card->id,
            'redirect' => route('reseller.business-cards.edit', $card->id),
        ]);
    }

    /**
     * Create Razorpay order for an existing draft card.
     */
    

    /**
     * Verify payment for a draft card.
     */
    

    // ─── Helpers ───────────────────────────────────────────────────────────────

        public function purchase(Request $request, $id)
    {
        $card = \App\Models\BusinessCard::where('user_id', auth()->id())->findOrFail($id);
        $user = auth()->user();
        $wallet = $user->wallet;

        if (!$wallet) {
            return response()->json(['error' => 'Wallet not found'], 400);
        }

        $plan = $card->plan;
        $price = floatval($plan->reseller_price) > 0 ? floatval($plan->reseller_price) : floatval($plan->price);

        if ($wallet->balance < $price) {
            return response()->json(['error' => 'Insufficient wallet balance'], 400);
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($card, $user, $wallet, $price) {
            $card->update([
                'payment_status'  => 'Success',
                'status'          => 'active',
                'plan_expires_at' => now()->addMonths($card->plan->duration_months),
            ]);

            $transaction = \App\Models\Transaction::create([
                'user_id'          => $user->id,
                'business_card_id' => $card->id,
                'amount'           => $price,
                'status'           => 'completed',
                'payment_method'   => 'wallet',
            ]);

            $wallet->debit($price, "Purchased Business Card: " . $card->company_name, $transaction);
        });

        return response()->json(['success' => true]);
    }

    private function getTemplatesList()
    {
        $templates = [];
        for ($i = 1; $i <= 100; $i++) {
            $thumbnail = "/images/business-cards/template{$i}.png";
            if ($i >= 36 && $i <= 100) {
                $thumbnail = "/images/business-cards/pre{$i}.webp";
            }

            $templates[] = [
                'id'        => $i,
                'name'      => "Template {$i}",
                'css_file'  => "card_css{$i}.css",
                'thumbnail' => $thumbnail
            ];
        }
        return $templates;
    }
}
