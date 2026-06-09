<?php

namespace App\Http\Controllers;

use App\Models\BusinessWebsite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicBusinessSiteController extends Controller
{
    /**
     * Show a published multi-page business website.
     */
    public function show($slug, $page = 'home')
    {
        $website = BusinessWebsite::where('slug', $slug)->firstOrFail();

        // 1. Check if published
        if (!$website->is_published) {
            return Inertia::render('public/offline', [
                'title' => $website->title,
                'reason' => 'This website is currently in draft mode.',
            ]);
        }

        // 2. Check if hosting is expired
        if ($website->isSubscriptionExpired()) {
            return Inertia::render('public/offline', [
                'title' => $website->title,
                'reason' => 'The hosting subscription for this website has expired. Please contact the owner to renew.',
            ]);
        }

        // 3. Handle multi-page business templates
        $pageData = $website->getPage($page);
        
        if (!$pageData || (isset($pageData['enabled']) && !$pageData['enabled'])) {
            abort(404, 'Page not found or disabled.');
        }

        return Inertia::render('public/business-viewer', [
            'website' => $website,
            'currentPageSlug' => $page,
            'pageData' => $pageData,
            'navigation' => $website->getEnabledPageSlugs(),
        ]);
    }

    /**
     * Submit a contact form for business.
     */
    public function contact(Request $request, $slug)
    {
        $website = BusinessWebsite::where('slug', $slug)->firstOrFail();

        // TODO: Store contact submission if a model is created later
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        return redirect()->back()->with('status', 'Message sent successfully!');
    }
}
