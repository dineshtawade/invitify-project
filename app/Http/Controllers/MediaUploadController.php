<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:51200|mimetypes:image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm', // 50MB max
        ]);

        $file = $request->file('file');
        
        // Generate a clean filename to prevent issues
        $extension = $file->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;

        // Store the file in the public 'media' directory
        $path = $file->storeAs('media', $filename, 'public');

        // Return the publicly accessible URL
        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
            'type' => Str::before($file->getMimeType(), '/'), // 'image' or 'video'
        ]);
    }
}
