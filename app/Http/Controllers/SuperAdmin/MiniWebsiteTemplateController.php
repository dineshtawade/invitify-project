<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\MiniWebsiteTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MiniWebsiteTemplateController extends Controller
{
    public function index()
    {
        $templates = MiniWebsiteTemplate::orderBy('created_at', 'desc')->get();

        return Inertia::render('super-admin/mini-website-templates/index', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'preview_image' => 'nullable|string',
            'config' => 'required|array',
        ]);

        $validated['type'] = 'invitation'; // legacy fallback

        MiniWebsiteTemplate::create($validated);

        return redirect()->back()->with('status', 'Mini Website Template created successfully.');
    }

    public function update(Request $request, MiniWebsiteTemplate $miniWebsiteTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'preview_image' => 'nullable|string',
            'config' => 'required|array',
        ]);

        $miniWebsiteTemplate->update($validated);

        return redirect()->back()->with('status', 'Mini Website Template updated successfully.');
    }

    public function destroy(MiniWebsiteTemplate $miniWebsiteTemplate)
    {
        $miniWebsiteTemplate->delete();

        return redirect()->back()->with('status', 'Mini Website Template deleted successfully.');
    }
}
