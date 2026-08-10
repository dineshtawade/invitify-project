<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralCode extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'discount_percentage',
        'commission_percentage',
        'is_active',
        'start_date',
        'expires_at',
        'usage_count',
    ];

    protected function casts(): array
    {
        return [
            'discount_percentage' => 'decimal:2',
            'commission_percentage' => 'decimal:2',
            'is_active' => 'boolean',
            'start_date' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * The referral partner who owns this code.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Transactions that used this referral code.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Check if the code is currently valid and usable.
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->start_date && $this->start_date->startOfDay()->isFuture()) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->endOfDay()->isPast()) {
            return false;
        }

        return true;
    }
}
