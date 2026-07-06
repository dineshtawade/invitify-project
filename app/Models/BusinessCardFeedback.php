<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessCardFeedback extends Model
{
    use HasFactory;

    protected $table = 'business_card_feedback';

    protected $fillable = [
        'business_card_id',
        'r_name',
        'r_email',
        'r_contact',
        'r_star',
        'r_msg'
    ];

    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class);
    }
}
