<?php

namespace App\Http\Controllers;

use App\Models\MiniWebsite;
use App\Models\Rsvp;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicSiteController extends Controller
{
    /**
     * Show a published mini website (invitation).
     */
    public function show($slug)
    {
        $website = MiniWebsite::where('slug', $slug)->firstOrFail();
        $website->load('template');

        // Check if draft or expired
        if (!$website->is_published || $website->isSubscriptionExpired()) {
            $reason = !$website->is_published 
                ? 'This website is currently in draft mode.' 
                : 'The hosting subscription for this website has expired. Please contact the owner to renew.';

            return Inertia::render('public/buy', [
                'website' => [
                    'id' => $website->id,
                    'title' => $website->title,
                    'slug' => $website->slug,
                    'theme' => $website->theme,
                    'is_published' => $website->is_published,
                    'user_id' => $website->user_id,
                    'expires_at' => $website->expires_at ? $website->expires_at->toDateTimeString() : null,
                    'template' => $website->template ? [
                        'id' => $website->template->id,
                        'name' => $website->template->name,
                        'price' => $website->template->price,
                    ] : null,
                ],
                'reason' => $reason,
                'auth' => [
                    'user' => auth()->user() ? [
                        'id' => auth()->id(),
                        'name' => auth()->user()->name,
                        'email' => auth()->user()->email,
                        'role' => auth()->user()->role,
                    ] : null,
                ]
            ]);
        }

        // 3. Render block-based design (invitations/legacy)
        if (is_array($website->config) && !empty($website->config) && isset($website->config[0]['type'])) {
            return Inertia::render('public/site-viewer', [
                'website' => $website,
                'customBlocks' => \App\Models\CustomBlock::all(),
            ]);
        }

        // 4. Fallback to legacy static templates
        $owner = $website->user;
        if (!$owner || !$owner->hasActiveSubscription('invitation')) {
            return Inertia::render('public/offline', [
                'title' => $website->title,
                'reason' => 'The subscription for this website has expired or is inactive.',
            ]);
        }

        return Inertia::render('public/invitation', [
            'website' => $website,
        ]);
    }

    /**
     * Submit an RSVP response.
     */
    public function rsvp(Request $request, $slug)
    {
        $website = MiniWebsite::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'attending' => 'required|boolean',
            'guests' => 'required|integer|min:0',
            'message' => 'nullable|string',
        ]);

        $website->rsvps()->create($validated);

        return redirect()->back()->with('status', 'RSVP submitted successfully!');
    }

    /**
     * Submit a contact form.
     */
    public function contact(Request $request, $slug)
    {
        $website = MiniWebsite::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $website->contactSubmissions()->create($validated);

        return redirect()->back()->with('status', 'Message sent successfully!');
    }
}
