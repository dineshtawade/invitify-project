<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\UserTemplate;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * Start customizing a template (creates/retrieves draft and loads editor).
     */
    public function edit(Template $template)
    {
        $user = auth()->user();

        // Create or retrieve draft for reseller
        $userTemplate = UserTemplate::firstOrCreate([
            'user_id' => $user->id,
            'template_id' => $template->id,
        ], [
            'custom_config' => $template->default_config,
            'is_purchased' => false,
        ]);

        return Inertia::render('reseller/templates/edit', [
            'template' => $template,
            'userTemplate' => $userTemplate,
        ]);
    }

    /**
     * Save the customized configuration as draft.
     */
    public function saveDraft(Request $request, UserTemplate $userTemplate)
    {
        if ($userTemplate->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'custom_config' => 'required|array',
        ]);

        $userTemplate->update([
            'custom_config' => $validated['custom_config'],
        ]);

        return redirect()->back()->with('status', 'Draft saved successfully.');
    }

    /**
     * Finalize purchase from Wallet
     */
    public function purchase(Request $request, UserTemplate $userTemplate)
    {
        if ($userTemplate->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        if ($userTemplate->is_purchased) {
            return response()->json(['error' => 'Template already purchased.'], 400);
        }

        $template = $userTemplate->template;
        $price = $template->getResellerPrice();
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        if ($wallet->balance < $price) {
            return response()->json(['error' => 'Insufficient wallet balance.'], 400);
        }

        DB::transaction(function () use ($user, $wallet, $template, $userTemplate, $price) {
            // Update UserTemplate
            $userTemplate->update([
                'is_purchased' => true,
            ]);

            // Create Transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'template_id' => $template->id,
                'user_template_id' => $userTemplate->id,
                'amount' => $price,
                'status' => 'completed',
                'payment_method' => 'wallet',
            ]);

            // Debit Wallet
            $wallet->debit($price, "Purchased Template: " . $template->name, $transaction);
        });

        // Add success flash message in session for redirect
        session()->flash('status', 'Template customized and purchased successfully using wallet balance!');
        
        return response()->json([
            'redirect' => route('reseller.my-invitations') // Redirect to the new My Invitations page
        ]);
    }

    /**
     * Upload the generated MP4 video.
     */
    public function uploadVideo(Request $request, UserTemplate $userTemplate)
    {
        if ($userTemplate->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'video' => 'required|file|mimetypes:video/mp4',
        ]);

        $file = $request->file('video');
        $filename = 'invitation_' . $userTemplate->id . '_' . time() . '.mp4';
        
        $path = $file->storeAs('videos', $filename, 'public');

        // Delete old video if exists
        if ($userTemplate->video_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($userTemplate->video_path);
        }

        $userTemplate->update([
            'video_path' => $path,
        ]);

        return response()->json([
            'message' => 'Video generated successfully.',
            'video_url' => asset('storage/' . $path),
        ]);
    }

    /**
     * Display purchased templates for the reseller.
     */
    public function purchased()
    {
        $userTemplates = UserTemplate::where('user_id', auth()->id())
            ->where('is_purchased', true)
            ->with('template')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($ut) {
                return [
                    'id' => $ut->id,
                    'template_id' => $ut->template_id,
                    'template' => $ut->template,
                    'custom_config' => $ut->custom_config,
                    'is_purchased' => $ut->is_purchased,
                    'created_at' => $ut->created_at->format('M d, Y'),
                    'video_path' => $ut->video_path,
                    'video_url' => $ut->video_path ? asset('storage/' . $ut->video_path) : null,
                ];
            });

        return Inertia::render('reseller/templates/purchased', [
            'purchasedTemplates' => $userTemplates,
        ]);
    }
}
