<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rsvp extends Model
{
    use HasFactory;

    protected $fillable = [
        'mini_website_id',
        'name',
        'email',
        'guests_count',
        'status',
        'message',
    ];

    public function miniWebsite()
    {
        return $this->belongsTo(MiniWebsite::class);
    }
}
