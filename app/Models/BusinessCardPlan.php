<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessCardPlan extends Model
{
    protected $fillable = [
        'name',
        'duration_months',
        'price',
        'description',
        'is_active',
    ];

    protected $casts = [
        'price'           => 'float',
        'duration_months' => 'integer',
        'is_active'       => 'boolean',
    ];

    /**
     * Scope to fetch only active plans.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * BusinessCards purchased under this plan.
     */
    public function businessCards()
    {
        return $this->hasMany(BusinessCard::class, 'plan_id');
    }
}
