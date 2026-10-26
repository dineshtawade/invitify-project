<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'category',
        'price',
        'reseller_price',
        'bg_gradient',
        'thumbnail',
        'default_config',
        'status',
        'has_gst',
        'is_trending',
        'gst_rate',
        'platform_fee',
        'platform_fee_type',
        'hsn_sac_code',
        'tax_inclusive',
    ];

    protected $appends = ['encrypted_id'];

    public function getEncryptedIdAttribute()
    {
        return encrypt($this->id);
    }

    protected function casts(): array
    {
        return [
            'default_config' => 'array',
            'price' => 'decimal:2',
            'reseller_price' => 'decimal:2',
            'has_gst' => 'boolean',
            'is_trending' => 'boolean',
            'gst_rate' => 'decimal:2',
            'platform_fee' => 'decimal:2',
            'tax_inclusive' => 'boolean',
        ];
    }

    /**
     * Get Reseller Price, falling back to standard price if reseller_price is null or zero.
     */
    public function getResellerPrice(): float
    {
        $resellerPrice = floatval($this->reseller_price);
        return $resellerPrice > 0 ? $resellerPrice : floatval($this->price);
    }
}
