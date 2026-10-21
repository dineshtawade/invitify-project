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
        $search = $request->query('search');

        $query = Media::query();

        // If not super admin or admin, only show own uploads
        if (!in_array(auth()->user()->role ?? '', ['super_admin', 'admin'])) {
            $query->where('user_id', auth()->id());
        }

        if ($type) {
            $query->where('type', $type);
        }

        if ($search) {
            $query->where('filename', 'like', "%{$search}%");
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
        $originalFilename = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        $type = Str::before($mimeType, '/');

        // Calculate unique MD5 hash for deduplication
        $fileHash = md5_file($file->getRealPath());

        // Check if an identical file has already been uploaded
        $existingMedia = Media::where('file_hash', $fileHash)->first();

        // Fallback for older media without file_hash
        if (!$existingMedia) {
            $candidates = Media::where('size', $size)
                ->where('mime_type', $mimeType)
                ->get();

            foreach ($candidates as $cand) {
                if (Storage::disk('public')->exists($cand->path)) {
                    $candFullPath = Storage::disk('public')->path($cand->path);
                    if (file_exists($candFullPath) && md5_file($candFullPath) === $fileHash) {
                        $cand->update(['file_hash' => $fileHash]);
                        $existingMedia = $cand;
                        break;
                    }
                }
            }
        }

        // If duplicate found and still exists on disk, reuse it!
        if ($existingMedia && Storage::disk('public')->exists($existingMedia->path)) {
            return response()->json([
                'id' => $existingMedia->id,
                'url' => $existingMedia->url,
                'path' => $existingMedia->path,
                'type' => $existingMedia->type,
                'filename' => $existingMedia->filename,
                'size' => $existingMedia->size,
                'is_duplicate' => true,
                'message' => 'Asset already exists in library ("' . $existingMedia->filename . '"). Reused without duplicate.',
            ]);
        }

        // Store new unique file
        $extension = $file->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;
        $path = $file->storeAs('media', $filename, 'public');
        $url = Storage::disk('public')->url($path);

        $media = Media::create([
            'user_id' => auth()->id(),
            'filename' => $originalFilename,
            'file_hash' => $fileHash,
            'path' => $path,
            'url' => $url,
            'mime_type' => $mimeType,
            'size' => $size,
            'type' => $type,
        ]);

        return response()->json([
            'id' => $media->id,
            'url' => $url,
            'path' => $path,
            'type' => $type,
            'filename' => $originalFilename,
            'size' => $size,
            'is_duplicate' => false,
            'message' => 'Asset uploaded and saved to library successfully.',
        ]);
    }

    /**
     * Delete an asset from media library.
     */
    public function destroy(Media $media)
    {
        $user = auth()->user();

        // Only owner or super admin/admin can delete
        if ($media->user_id && $media->user_id !== $user->id && !in_array($user->role ?? '', ['super_admin', 'admin'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Only delete file from disk if no other media row points to the same file path
        $isShared = Media::where('path', $media->path)->where('id', '!=', $media->id)->exists();
        if (!$isShared && Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }

        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Asset deleted successfully from library.'
        ]);
    }
}
