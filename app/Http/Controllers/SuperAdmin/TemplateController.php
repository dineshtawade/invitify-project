<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * List all templates for admin management.
     */
    public function index()
    {
        $templates = Template::orderBy('created_at', 'desc')->get();

        return Inertia::render('super-admin/templates/index', [
            'templates' => $templates,
            'categories' => \App\Models\Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Create a new template.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|exists:categories,slug',
            'price' => 'required|numeric|min:0',
            'bg_gradient' => 'required|string',
            'default_config' => 'required|array',
        ]);

        Template::create($validated);

        return redirect()->back()->with('status', 'Template created successfully.');
    }

    /**
     * Update an existing template.
     */
    public function update(Request $request, Template $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|exists:categories,slug',
            'price' => 'required|numeric|min:0',
            'bg_gradient' => 'required|string',
            'default_config' => 'required|array',
        ]);

        $template->update($validated);

        return redirect()->back()->with('status', 'Template updated successfully.');
    }

    /**
     * Delete a template.
     */
    public function destroy(Template $template)
    {
        $template->delete();

        return redirect()->back()->with('status', 'Template deleted successfully.');
    }
}
