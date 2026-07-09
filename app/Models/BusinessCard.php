<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slug',
        'company_name',
        'logo_path',
        'theme_css',
        'plan_id',
        'plan_expires_at',
        'payment_id',
        'order_id',
        'personal_details',
        'social_links',
        'youtube_videos',
        'payment_details',
        'qr_codes',
        'services',
        'ecommerce_products',
        'gallery',
        'status',
        'payment_status',
    ];

    protected $casts = [
        'personal_details'   => 'array',
        'social_links'       => 'array',
        'youtube_videos'     => 'array',
        'payment_details'    => 'array',
        'qr_codes'           => 'array',
        'services'           => 'array',
        'ecommerce_products' => 'array',
        'gallery'            => 'array',
        'plan_expires_at'    => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(BusinessCardPlan::class, 'plan_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'business_card_id');
    }
}
