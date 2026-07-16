<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'template_id',
        'custom_config',
        'is_purchased',
    ];

    protected function casts(): array
    {
        return [
            'custom_config' => 'array',
            'is_purchased' => 'boolean',
        ];
    }

    protected static function booted()
    {
        static::saving(function ($userTemplate) {
            if ($userTemplate->is_purchased) {
                $userTemplate->localizeVideoBackground();
            }
        });
    }

    public function localizeVideoBackground(): void
    {
        $template = $this->template;
        if (!$template || $template->type !== 'video') {
            return;
        }

        $config = $this->custom_config;
        $videoUrl = $config['video_url'] ?? $template->default_config['video_url'] ?? null;

        if (!$videoUrl) {
            return;
        }

        // Avoid localizing if it's already localized (e.g. points to local backgrounds storage)
        if (str_contains($videoUrl, '/storage/backgrounds/')) {
            return;
        }

        try {
            $filename = 'bg_' . $this->id . '_' . time() . '.mp4';
            $directory = 'backgrounds';
            $relativeStoragePath = $directory . '/' . $filename;

            // Ensure directory exists
            \Illuminate\Support\Facades\Storage::disk('public')->makeDirectory($directory);

            $downloaded = false;
            $isLocal = false;
            $relativePath = null;

            if (str_starts_with($videoUrl, '/')) {
                $isLocal = true;
                $relativePath = $videoUrl;
            } else {
                $parsed = parse_url($videoUrl);
                $host = $parsed['host'] ?? null;
                if ($host && in_array($host, ['127.0.0.1', 'localhost', request()->getHost()])) {
                    $isLocal = true;
                    $relativePath = $parsed['path'] ?? null;
                }
            }

            if ($isLocal && $relativePath) {
                $cleanPath = str_replace('/storage/', '', $relativePath);
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($cleanPath)) {
                    if (\Illuminate\Support\Facades\Storage::disk('public')->copy($cleanPath, $relativeStoragePath)) {
                        $downloaded = true;
                    }
                } else {
                    $sourcePath = public_path($relativePath);
                    if (file_exists($sourcePath)) {
                        if (copy($sourcePath, storage_path('app/public/' . $relativeStoragePath))) {
                            $downloaded = true;
                        }
                    }
                }
            }

            if (!$downloaded) {
                // Fallback to HTTP download
                $contents = @file_get_contents($videoUrl);
                if ($contents) {
                    \Illuminate\Support\Facades\Storage::disk('public')->put($relativeStoragePath, $contents);
                    $downloaded = true;
                }
            }

            if ($downloaded) {
                $config['video_url'] = asset('storage/' . $relativeStoragePath);
                $this->custom_config = $config;
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to localize video background: ' . $e->getMessage());
        }
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }
}
