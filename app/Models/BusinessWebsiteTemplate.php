<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessWebsiteTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'reseller_price',
        'preview_image',
        'pages',
        'is_active',
    ];

    protected $casts = [
        'pages' => 'array',
        'price' => 'decimal:2',
        'reseller_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get Reseller Price, falling back to standard price if reseller_price is null or zero.
     */
    public function getResellerPrice(): float
    {
        $resellerPrice = floatval($this->reseller_price);
        return $resellerPrice > 0 ? $resellerPrice : floatval($this->price);
    }
}
