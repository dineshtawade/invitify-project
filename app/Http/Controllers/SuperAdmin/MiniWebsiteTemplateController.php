<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\MiniWebsiteTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MiniWebsiteTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = MiniWebsiteTemplate::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', '%' . $search . '%');
        }

        $templates = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $editorRequests = auth()->user()->role === 'editor' 
            ? \App\Models\EditorActionRequest::where('user_id', auth()->id())
                ->where('target_type', 'MiniWebsiteTemplate')
                ->get() 
            : collect([]);

        return Inertia::render('super-admin/mini-website-templates/index', [
            'templates' => $templates,
            'customBlocks' => \App\Models\CustomBlock::orderBy('name')->get(),
            'editorRequests' => $editorRequests,
            'filters' => $request->only('search'),
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
        if (auth()->user()->role === 'editor') {
            $approval = \App\Models\EditorActionRequest::where('user_id', auth()->id())
                ->where('target_type', 'MiniWebsiteTemplate')
                ->where('target_id', $miniWebsiteTemplate->id)
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
            'price' => 'required|numeric|min:0',
            'preview_image' => 'nullable|string',
            'config' => 'required|array',
        ]);

        $miniWebsiteTemplate->update($validated);

        return redirect()->back()->with('status', 'Mini Website Template updated successfully.');
    }

    public function destroy(MiniWebsiteTemplate $miniWebsiteTemplate)
    {
        if (auth()->user()->role === 'editor') {
            $hasApproval = \App\Models\EditorActionRequest::where('user_id', auth()->id())
                ->where('target_type', 'MiniWebsiteTemplate')
                ->where('target_id', $miniWebsiteTemplate->id)
                ->where('action', 'delete')
                ->where('status', 'approved')
                ->exists();
                
            if (!$hasApproval) {
                abort(403, 'You do not have an approved request to perform this action.');
            }
        }

        $miniWebsiteTemplate->delete();

        return redirect()->back()->with('status', 'Mini Website Template deleted successfully.');
    }
}
