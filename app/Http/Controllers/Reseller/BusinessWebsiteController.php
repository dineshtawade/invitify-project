<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\BusinessWebsite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessWebsiteController extends Controller
{
    public function edit(BusinessWebsite $business_website)
    {
        if ($business_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('reseller/business-websites/edit', [
            'website' => [
                'id' => $business_website->id,
                'title' => $business_website->title,
                'slug' => $business_website->slug,
                'theme' => $business_website->theme,
                'is_published' => $business_website->is_published,
                'pages' => $business_website->pages,
                'meta_description' => $business_website->meta_description,
                'meta_keywords' => $business_website->meta_keywords,
            ]
        ]);
    }

    public function update(Request $request, BusinessWebsite $business_website)
    {
        if ($business_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
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

        return redirect()->back()->with('status', 'Business Website configuration updated successfully.');
    }

    public function destroy(BusinessWebsite $business_website)
    {
        if ($business_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $business_website->delete();

        return redirect()->route('reseller.websites.index')->with('status', 'Website deleted successfully.');
    }
}
