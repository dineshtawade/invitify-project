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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }
}
