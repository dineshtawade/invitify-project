<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\EditorActionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EditorActionRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = EditorActionRequest::with('user')->orderBy('created_at', 'desc');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            })->orWhere('action', 'like', '%' . $search . '%')
              ->orWhere('status', 'like', '%' . $search . '%')
              ->orWhere('target_type', 'like', '%' . $search . '%');
        }

        $requests = $query->paginate(15)->withQueryString();
            
        $requests->getCollection()->transform(function ($req) {
            if ($req->target_type === 'Template') {
                $target = \App\Models\Template::find($req->target_id);
                $req->target_name = $target ? $target->name : 'Deleted Template';
            } else {
                $target = \App\Models\MiniWebsiteTemplate::find($req->target_id);
                $req->target_name = $target ? $target->name : 'Deleted Mini Website Template';
            }
            return $req;
        });

        return Inertia::render('super-admin/editor-requests', [
            'editorRequests' => $requests,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_type' => 'required|string|in:Template,MiniWebsiteTemplate',
            'target_id' => 'required|integer',
            'action' => 'required|string|in:edit,delete',
        ]);

        if ($validated['action'] === 'edit') {
            $recentCompleted = EditorActionRequest::where('user_id', auth()->id())
                ->where('target_type', $validated['target_type'])
                ->where('target_id', $validated['target_id'])
                ->where('action', 'edit')
                ->where('status', 'completed')
                ->where('updated_at', '>=', now()->subMinutes(30))
                ->first();

            if ($recentCompleted) {
                return redirect()->back()->with('error', 'You must wait 30 minutes after your last edit before requesting another edit.');
            }
        }

        $existing = EditorActionRequest::where('user_id', auth()->id())
            ->where('target_type', $validated['target_type'])
            ->where('target_id', $validated['target_id'])
            ->where('action', $validated['action'])
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'You already have an active request for this action.');
        }

        EditorActionRequest::create([
            'user_id' => auth()->id(),
            'target_type' => $validated['target_type'],
            'target_id' => $validated['target_id'],
            'action' => $validated['action'],
            'status' => 'pending'
        ]);

        return redirect()->back()->with('status', 'Request sent to super admin.');
    }

    public function approve(EditorActionRequest $editorRequest)
    {
        $editorRequest->update(['status' => 'approved']);
        return redirect()->back()->with('status', 'Request approved.');
    }

    public function reject(EditorActionRequest $editorRequest)
    {
        $editorRequest->update(['status' => 'rejected']);
        return redirect()->back()->with('status', 'Request rejected.');
    }
}
