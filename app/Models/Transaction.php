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
        'amount',
        'payment_id',
        'order_id',
        'status',
        'payment_method',
        'referral_code_id',
        'discount_amount',
        'commission_amount',
    ];

    /**
     * Get the user that made the transaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the purchased template design.
     */
    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Get the customer user-customized template.
     */
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

    public function referralCode()
    {
        return $this->belongsTo(ReferralCode::class);
    }
}
