<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\BusinessWebsite;
use App\Models\BusinessWebsiteTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BusinessWebsiteController extends Controller
{
    public function index()
    {
        $websites = BusinessWebsite::where('user_id', auth()->id())
            ->with(['template'])
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
                    'created_at' => $website->created_at,
                    'is_expired' => $website->isSubscriptionExpired(),
                ];
            });

        return Inertia::render('customer/business-websites/index', [
            'websites' => $websites,
            'templates' => BusinessWebsiteTemplate::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:business_website_templates,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:50|unique:business_websites,slug|alpha_dash',
            'theme' => 'required|string|in:cozy,clean,royal,ocean',
        ]);

        $template = BusinessWebsiteTemplate::findOrFail($validated['template_id']);

        $website = BusinessWebsite::create([
            'user_id' => auth()->id(),
            'template_id' => $template->id,
            'title' => $validated['title'],
            'slug' => strtolower($validated['slug']),
            'theme' => $validated['theme'],
            'pages' => $template->pages,
            'is_published' => false,
            'expires_at' => floatval($template->price) > 0 ? now()->addYear() : null,
        ]);

        return redirect()->route('customer.business-websites.edit', $website);
    }

    public function edit(BusinessWebsite $business_website)
    {
        if ($business_website->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('customer/business-websites/edit', [
            'website' => $business_website,
        ]);
    }

    public function update(Request $request, BusinessWebsite $business_website)
    {
        if ($business_website->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'theme' => 'required|string|in:cozy,clean,royal,ocean',
            'is_published' => 'required|boolean',
            'pages' => 'required|array',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:500',
        ]);

        $business_website->update($validated);

        return redirect()->back()->with('status', 'Business Website updated successfully.');
    }

    public function destroy(BusinessWebsite $business_website)
    {
        if ($business_website->user_id !== auth()->id()) {
            abort(403);
        }

        $business_website->delete();

        return redirect()->route('customer.business-websites.index')->with('status', 'Website deleted successfully.');
    }
}
