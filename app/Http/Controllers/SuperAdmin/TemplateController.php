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
    public function index(Request $request)
    {
        $query = Template::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('category', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $templates = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $editorRequests = auth()->user()->role === 'editor' 
            ? \App\Models\EditorActionRequest::where('user_id', auth()->id())
                ->where('target_type', 'Template')
                ->get() 
            : collect([]);

        $customIcons = \App\Models\CustomIcon::where('user_id', auth()->id())->latest()->get();

        return Inertia::render('super-admin/templates/index', [
            'templates' => $templates,
            'categories' => \App\Models\Category::orderBy('name')->get(),
            'editorRequests' => $editorRequests,
            'customIcons' => $customIcons,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Create a new template.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:image,video',
            'category' => 'required|string|exists:categories,slug',
            'price' => 'required|numeric|min:0',
            'bg_gradient' => 'required|string',
            'thumbnail' => 'nullable|string',
            'default_config' => 'required|array',
            'status' => 'required|string|in:published,draft',
        ]);

        Template::create($validated);

        return redirect()->back()->with('status', 'Template created successfully.');
    }

    /**
     * Update an existing template.
     */
    public function update(Request $request, Template $template)
    {
        if (auth()->user()->role === 'editor') {
            $approval = \App\Models\EditorActionRequest::where('user_id', auth()->id())
                ->where('target_type', 'Template')
                ->where('target_id', $template->id)
                ->where('action', 'edit')
                ->where('status', 'approved')
                ->first();
                
            if (!$approval) {
                abort(403, 'You do not have an approved request to perform this action.');
            }

            $approval->update(['status' => 'completed']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:image,video',
            'category' => 'required|string|exists:categories,slug',
            'price' => 'required|numeric|min:0',
            'bg_gradient' => 'required|string',
            'thumbnail' => 'nullable|string',
            'default_config' => 'required|array',
            'status' => 'required|string|in:published,draft',
        ]);

        $template->update($validated);

        return redirect()->back()->with('status', 'Template updated successfully.');
    }

    /**
     * Delete a template.
     */
    public function destroy(Template $template)
    {
        if (auth()->user()->role === 'editor') {
            $hasApproval = \App\Models\EditorActionRequest::where('user_id', auth()->id())
                ->where('target_type', 'Template')
                ->where('target_id', $template->id)
                ->where('action', 'delete')
                ->where('status', 'approved')
                ->exists();
                
            if (!$hasApproval) {
                abort(403, 'You do not have an approved request to perform this action.');
            }
        }

        $template->delete();

        return redirect()->back()->with('status', 'Template deleted successfully.');
    }
}
