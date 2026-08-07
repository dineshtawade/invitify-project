<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CustomIcon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomIconController extends Controller
{
    /**
     * Store a newly uploaded custom icon.
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimetypes:image/jpeg,image/png,image/webp,image/svg+xml', // 10MB max, images only
        ]);

        $file = $request->file('file');
        
        $extension = $file->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;

        // Store in public media directory
        $path = $file->storeAs('media', $filename, 'public');
        $url = Storage::disk('public')->url($path);

        $customIcon = CustomIcon::create([
            'user_id' => auth()->id(),
            'url' => $url,
        ]);

        return response()->json([
            'success' => true,
            'icon' => $customIcon
        ]);
    }

    /**
     * Remove the specified custom icon.
     */
    public function destroy(CustomIcon $customIcon)
    {
        // Only allow deleting own icons
        if ($customIcon->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Try to delete the file from storage
        $path = str_replace(Storage::disk('public')->url(''), '', $customIcon->url);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        $customIcon->delete();

        return response()->json(['success' => true]);
    }
}
