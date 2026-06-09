<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\MiniWebsite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MiniWebsiteController extends Controller
{
    public function edit(MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('reseller/mini-websites/edit', [
            'website' => [
                'id' => $mini_website->id,
                'title' => $mini_website->title,
                'slug' => $mini_website->slug,
                'theme' => $mini_website->theme,
                'is_published' => $mini_website->is_published,
                'config' => $mini_website->config,
            ]
        ]);
    }

    public function update(Request $request, MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'theme' => 'required|string|in:cozy,clean,royal,ocean',
            'is_published' => 'required|boolean',
            'config' => 'required|array',
        ]);

        $mini_website->update($validated);

        return redirect()->back()->with('status', 'Mini Website configuration updated successfully.');
    }

    public function destroy(MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $mini_website->delete();

        return redirect()->route('reseller.websites.index')->with('status', 'Website deleted successfully.');
    }
}
