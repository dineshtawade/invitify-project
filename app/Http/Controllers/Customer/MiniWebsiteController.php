<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MiniWebsite;
use App\Models\MiniWebsiteTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MiniWebsiteController extends Controller
{
    public function index()
    {
        $websites = MiniWebsite::where('user_id', auth()->id())
            ->with(['template', 'rsvps', 'contactSubmissions'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($website) {
                return [
                    'id' => $website->id,
                    'title' => $website->title,
                    'slug' => $website->slug,
                    'theme' => $website->theme,
                    'is_published' => $website->is_published,
                    'template' => $website->template,
                    'rsvps_count' => $website->rsvps->count(),
                    'contact_submissions_count' => $website->contactSubmissions->count(),
                    'created_at' => $website->created_at,
                    'is_expired' => $website->isSubscriptionExpired(),
                ];
            });

        return Inertia::render('customer/mini-websites/index', [
            'websites' => $websites,
            'templates' => MiniWebsiteTemplate::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:mini_website_templates,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:50|unique:mini_websites,slug|alpha_dash',
            'theme' => 'required|string|in:cozy,clean,royal,ocean',
        ]);

        $template = MiniWebsiteTemplate::findOrFail($validated['template_id']);

        $website = MiniWebsite::create([
            'user_id' => auth()->id(),
            'template_id' => $template->id,
            'type' => 'invitation', // legacy
            'title' => $validated['title'],
            'slug' => strtolower($validated['slug']),
            'theme' => $validated['theme'],
            'config' => $template->config,
            'is_published' => false,
            'expires_at' => floatval($template->price) > 0 ? now()->addYear() : null,
        ]);

        return redirect()->route('customer.mini-websites.edit', $website);
    }

    public function edit(MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('customer/mini-websites/edit', [
            'website' => $mini_website,
        ]);
    }

    public function update(Request $request, MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'theme' => 'required|string|in:cozy,clean,royal,ocean',
            'is_published' => 'required|boolean',
            'config' => 'required|array',
        ]);

        $mini_website->update($validated);

        return redirect()->back()->with('status', 'Website updated successfully.');
    }

    public function destroy(MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403);
        }

        $mini_website->delete();

        return redirect()->route('customer.mini-websites.index')->with('status', 'Website deleted successfully.');
    }
}
