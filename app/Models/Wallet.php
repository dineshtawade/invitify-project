<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'balance',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
        ];
    }

    /**
     * The user who owns this wallet.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Wallet transaction log.
     */
    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    /**
     * Redemption requests from this wallet.
     */
    public function redemptionRequests()
    {
        return $this->hasMany(RedemptionRequest::class);
    }

    /**
     * Credit the wallet and log the transaction.
     */
    public function credit(float $amount, string $description, ?Model $reference = null): WalletTransaction
    {
        $this->increment('balance', $amount);

        return $this->transactions()->create([
            'type' => 'credit',
            'amount' => $amount,
            'description' => $description,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id' => $reference?->id,
        ]);
    }

    /**
     * Debit the wallet and log the transaction.
     */
    public function debit(float $amount, string $description, ?Model $reference = null): WalletTransaction
    {
        $this->decrement('balance', $amount);

        return $this->transactions()->create([
            'type' => 'debit',
            'amount' => $amount,
            'description' => $description,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id' => $reference?->id,
        ]);
    }
}
