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
    ];

    protected function casts(): array
    {
        return [
            'default_config' => 'array',
            'price' => 'decimal:2',
            'reseller_price' => 'decimal:2',
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
