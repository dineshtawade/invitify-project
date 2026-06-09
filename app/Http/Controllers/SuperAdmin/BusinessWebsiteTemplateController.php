<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BusinessWebsiteTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessWebsiteTemplateController extends Controller
{
    public function index()
    {
        $templates = BusinessWebsiteTemplate::orderBy('created_at', 'desc')->get();

        return Inertia::render('super-admin/business-website-templates/index', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'preview_image' => 'nullable|string',
            'pages' => 'required|array',
        ]);

        BusinessWebsiteTemplate::create($validated);

        return redirect()->back()->with('status', 'Business Website Template created successfully.');
    }

    public function update(Request $request, BusinessWebsiteTemplate $businessWebsiteTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'preview_image' => 'nullable|string',
            'pages' => 'required|array',
        ]);

        $businessWebsiteTemplate->update($validated);

        return redirect()->back()->with('status', 'Business Website Template updated successfully.');
    }

    public function destroy(BusinessWebsiteTemplate $businessWebsiteTemplate)
    {
        $businessWebsiteTemplate->delete();

        return redirect()->back()->with('status', 'Business Website Template deleted successfully.');
    }
}
