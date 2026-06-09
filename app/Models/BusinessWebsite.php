<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessWebsite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'template_id',
        'title',
        'slug',
        'theme',
        'is_published',
        'expires_at',
        'pages',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'pages' => 'array',
        'is_published' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(BusinessWebsiteTemplate::class, 'template_id');
    }

    public function isSubscriptionExpired(): bool
    {
        if ($this->template && floatval($this->template->price) === 0.0) {
            return false;
        }
        return $this->expires_at === null || $this->expires_at->isPast();
    }

    /**
     * Get a specific page config from the pages JSON.
     */
    public function getPage(string $pageSlug): ?array
    {
        if (!is_array($this->pages)) {
            return null;
        }
        return $this->pages[$pageSlug] ?? null;
    }

    /**
     * Get all enabled page slugs.
     */
    public function getEnabledPageSlugs(): array
    {
        if (!is_array($this->pages)) {
            return [];
        }
        $slugs = [];
        foreach ($this->pages as $key => $page) {
            if (!isset($page['enabled']) || $page['enabled']) {
                $slugs[] = $key;
            }
        }
        return $slugs;
    }
}
