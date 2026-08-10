<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Template;
use App\Models\MiniWebsiteTemplate;
use App\Models\BusinessCardPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::latest()->get();

        return Inertia::render('super-admin/coupons/index', [
            'coupons' => $coupons,
            'templates' => Template::select('id', 'name', 'status')->where('type', 'video')->get(),
            'imageTemplates' => Template::select('id', 'name', 'status')->where('type', 'image')->get(),
            'miniWebsites' => MiniWebsiteTemplate::select('id', 'name', 'status')->get(),
            'virtualCards' => BusinessCardPlan::select('id', 'name', 'is_active')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons',
            'discount' => 'required|numeric|min:0|max:99',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'target_type' => 'required|string|in:all,templates,image_templates,mini_websites,virtual_cards',
            'target_ids' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        $validated['is_active'] = $request->boolean('is_active', true);

        Coupon::create($validated);

        return redirect()->back()->with('status', 'Coupon created successfully.');
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'discount' => 'required|numeric|min:0|max:99',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'target_type' => 'required|string|in:all,templates,image_templates,mini_websites,virtual_cards',
            'target_ids' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        $validated['is_active'] = $request->boolean('is_active', true);

        $coupon->update($validated);

        return redirect()->back()->with('status', 'Coupon updated successfully.');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->back()->with('status', 'Coupon deleted successfully.');
    }
}
