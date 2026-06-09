<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MiniWebsite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'template_id',
        'type',
        'title',
        'slug',
        'theme',
        'is_published',
        'expires_at',
        'config',
    ];

    protected $casts = [
        'config' => 'array',
        'is_published' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(MiniWebsiteTemplate::class, 'template_id');
    }

    public function isSubscriptionExpired(): bool
    {
        if ($this->template && floatval($this->template->price) === 0.0) {
            return false;
        }
        return $this->expires_at === null || $this->expires_at->isPast();
    }

    public function rsvps()
    {
        return $this->hasMany(Rsvp::class);
    }

    public function contactSubmissions()
    {
        return $this->hasMany(ContactSubmission::class);
    }
}
