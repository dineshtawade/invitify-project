<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManualDeposit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'utr',
        'screenshot_path',
        'status',
        'bonus_percentage',
        'bonus_amount',
        'admin_notes',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'bonus_percentage' => 'decimal:2',
        'bonus_amount' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
