<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RedemptionRequest extends Model
{
    protected $fillable = [
        'user_id',
        'wallet_id',
        'amount',
        'status',
        'admin_notes',
        'upi_id',
        'bank_name',
        'account_holder_name',
        'account_number',
        'ifsc_code',
        'qr_code_path',
        'payment_proof_path',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
}
