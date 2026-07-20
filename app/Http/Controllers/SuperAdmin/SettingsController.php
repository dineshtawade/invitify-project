<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BusinessCardPlan;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display settings page.
     */
    public function index()
    {
        return Inertia::render('super-admin/settings/index', [
            'categories'        => \App\Models\Category::orderBy('name')->get(),
            'customBlocks'      => \App\Models\CustomBlock::orderBy('name')->get(),
        ]);
    }

    /**
     * Update settings keys.
     */
    public function update(Request $request)
    {
        // Settings are now only for Category and Blocks if needed, but the current 
        // SettingsController was primarily for system settings. If categories/blocks 
        // have their own CRUD, this update method might not be used for them directly.
        // We'll leave it empty or handle generic config if any.

        return redirect()->back()->with('status', 'Settings updated successfully.');
    }

    /**
     * Delete a setting key.
     */
    public function destroy($key)
    {
        abort(400, 'Invalid setting key.');
    }
}
