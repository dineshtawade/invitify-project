<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BusinessCardPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessCardPlanController extends Controller
{
    /**
     * List all plans via Inertia page.
     */
    public function index()
    {
        return Inertia::render('super-admin/business-card-plans/index', [
            'plans' => BusinessCardPlan::orderBy('price')->get()
        ]);
    }

    /**
     * List all plans as JSON (used by settings page via API).
     */
    public function apiIndex()
    {
        return response()->json(BusinessCardPlan::orderBy('price')->get());
    }

    /**
     * Create a new plan.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:100',
            'duration_months' => 'required|integer|min:1|max:120',
            'price'           => 'required|numeric|min:0',
            'description'     => 'nullable|string|max:500',
            'is_active'       => 'boolean',
        ]);

        BusinessCardPlan::create($validated);

        return redirect()->back()->with('status', 'Plan created successfully.');
    }

    /**
     * Update an existing plan.
     */
    public function update(Request $request, BusinessCardPlan $businessCardPlan)
    {
        $validated = $request->validate([
            'name'            => 'sometimes|required|string|max:100',
            'duration_months' => 'sometimes|required|integer|min:1|max:120',
            'price'           => 'sometimes|required|numeric|min:0',
            'description'     => 'nullable|string|max:500',
            'is_active'       => 'boolean',
        ]);

        $businessCardPlan->update($validated);

        return redirect()->back()->with('status', 'Plan updated successfully.');
    }

    /**
     * Delete a plan.
     */
    public function destroy(BusinessCardPlan $businessCardPlan)
    {
        $businessCardPlan->delete();

        return redirect()->back()->with('status', 'Plan deleted successfully.');
    }
}
