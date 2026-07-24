<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EditorActionRequest extends Model
{
    protected $fillable = [
        'user_id',
        'target_type',
        'target_id',
        'action',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
