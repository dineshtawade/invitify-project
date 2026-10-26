<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'template_id',
        'user_template_id',
        'mini_website_template_id',
        'mini_website_id',
        'business_website_template_id',
        'business_website_id',
        'business_card_id',
        'amount',
        'payment_id',
        'order_id',
        'status',
        'payment_method',
        'referral_code_id',
        'discount_amount',
        'commission_amount',
        'base_amount',
        'platform_fee',
        'tax_rate',
        'tax_amount',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'is_inter_state',
        'invoice_number',
        'invoice_date',
        'customer_billing_name',
        'customer_billing_email',
        'customer_billing_phone',
        'customer_billing_address',
        'customer_billing_state',
        'customer_gstin',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'base_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'platform_fee' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'cgst_amount' => 'decimal:2',
        'sgst_amount' => 'decimal:2',
        'igst_amount' => 'decimal:2',
        'is_inter_state' => 'boolean',
        'invoice_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function userTemplate()
    {
        return $this->belongsTo(UserTemplate::class);
    }

    public function miniWebsiteTemplate()
    {
        return $this->belongsTo(MiniWebsiteTemplate::class, 'mini_website_template_id');
    }

    public function miniWebsite()
    {
        return $this->belongsTo(MiniWebsite::class, 'mini_website_id');
    }

    public function businessWebsiteTemplate()
    {
        return $this->belongsTo(BusinessWebsiteTemplate::class, 'business_website_template_id');
    }

    public function businessWebsite()
    {
        return $this->belongsTo(BusinessWebsite::class, 'business_website_id');
    }

    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class, 'business_card_id');
    }

    public function referralCode()
    {
        return $this->belongsTo(ReferralCode::class);
    }
}
