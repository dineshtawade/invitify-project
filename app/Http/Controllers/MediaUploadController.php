<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $query = Media::where('user_id', auth()->id());
        
        if ($type) {
            $query->where('type', $type);
        }

        return response()->json([
            'media' => $query->latest()->get()
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:51200|mimetypes:image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm', // 50MB max
        ]);

        $file = $request->file('file');
        
        // Generate a clean filename to prevent issues
        $extension = $file->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;
        $originalFilename = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        $type = Str::before($mimeType, '/');

        // Store the file in the public 'media' directory
        $path = $file->storeAs('media', $filename, 'public');
        $url = Storage::disk('public')->url($path);

        $media = Media::create([
            'user_id' => auth()->id(),
            'filename' => $originalFilename,
            'path' => $path,
            'url' => $url,
            'mime_type' => $mimeType,
            'size' => $size,
            'type' => $type,
        ]);

        // Return the publicly accessible URL
        return response()->json([
            'id' => $media->id,
            'url' => $url,
            'path' => $path,
            'type' => $type,
        ]);
    }
}
