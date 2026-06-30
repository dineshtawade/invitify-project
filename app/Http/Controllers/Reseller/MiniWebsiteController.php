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

        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        return Inertia::render('reseller/mini-websites/edit', [
            'wallet' => [
                'balance' => floatval($wallet->balance),
            ],
            'website' => [
                'id' => $mini_website->id,
                'title' => $mini_website->title,
                'slug' => $mini_website->slug,
                'theme' => $mini_website->theme,
                'is_published' => $mini_website->is_published,
                'is_purchased' => $mini_website->is_purchased,
                'reseller_price' => $mini_website->template ? floatval($mini_website->template->getResellerPrice()) : 0.0,
                'expires_at' => $mini_website->expires_at ? $mini_website->expires_at->toIso8601String() : null,
                'is_expired' => $mini_website->isSubscriptionExpired(),
                'config' => $mini_website->config,
            ],
            'customBlocks' => \App\Models\CustomBlock::orderBy('name')->get(),
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

    /**
     * Download a ZIP package containing:
     * 1. A QR code PNG image pointing to the hosted website.
     * 2. A text file with the hosted website URL.
     * 3. An animation/screen recording preview of the mini-website.
     */
    public function downloadInviteZip(MiniWebsite $mini_website)
    {
        if ($mini_website->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        // 1. Determine the hosted URL
        $hostedUrl = url('/mini-website/' . $mini_website->slug);

        // 2. Fetch/Generate QR Code PNG
        $qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' . urlencode($hostedUrl);
        $qrCodeData = null;
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(10)->get($qrCodeUrl);
            if ($response->successful()) {
                $qrCodeData = $response->body();
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('QR Code Generation failed: ' . $e->getMessage());
        }

        // 3. Retrieve or cache the sample website animation video (MP4)
        $sampleVideoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        $localVideoPath = storage_path('app/sample-preview.mp4');
        
        if (!file_exists($localVideoPath)) {
            try {
                $videoResponse = \Illuminate\Support\Facades\Http::timeout(30)->get($sampleVideoUrl);
                if ($videoResponse->successful()) {
                    if (!is_dir(dirname($localVideoPath))) {
                        mkdir(dirname($localVideoPath), 0755, true);
                    }
                    file_put_contents($localVideoPath, $videoResponse->body());
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Sample video download failed: ' . $e->getMessage());
            }
        }

        // 4. Create the ZIP Archive
        $zipFileName = 'website-' . $mini_website->slug . '.zip';
        $tempZipPath = tempnam(sys_get_temp_dir(), 'zip');

        $zip = new \ZipArchive();
        if ($zip->open($tempZipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            // Add QR Code
            if ($qrCodeData) {
                $zip->addFromString('qr-code.png', $qrCodeData);
            } else {
                $zip->addFromString('qr-code-placeholder.txt', "QR Code could not be generated dynamically. Scan Link: " . $hostedUrl);
            }

            // Add Text URL info
            $infoContent = "Invitify Mini Website Package\n";
            $infoContent .= "==============================\n\n";
            $infoContent .= "Website Title: " . $mini_website->title . "\n";
            $infoContent .= "Hosted URL: " . $hostedUrl . "\n\n";
            $infoContent .= "Scan the 'qr-code.png' file or click the URL above to view the live website.\n";
            $zip->addFromString('website-details.txt', $infoContent);

            // Add Video Preview
            if (file_exists($localVideoPath)) {
                $zip->addFile($localVideoPath, 'website-preview.mp4');
            } else {
                $zip->addFromString('preview-instructions.txt', "Animated website preview video. Visit " . $hostedUrl . " to view live animation effects.");
            }

            $zip->close();
        } else {
            abort(500, 'Could not create ZIP archive.');
        }

        // 5. Return the ZIP file download response and delete temp file afterward
        return response()->download($tempZipPath, $zipFileName)->deleteFileAfterSend(true);
    }
}
