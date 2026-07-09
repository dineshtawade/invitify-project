<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomBlock extends Model
{
    protected $fillable = ['name', 'type', 'description', 'fields', 'template_html'];

    protected $casts = [
        'fields' => 'array',
    ];
}
