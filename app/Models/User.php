<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_approved',
        'referral_discount_percentage',
        'referral_commission_percentage',
        'referral_max_codes',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_approved' => 'boolean',
        ];
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function miniWebsites()
    {
        return $this->hasMany(MiniWebsite::class);
    }

    public function referralCodes()
    {
        return $this->hasMany(ReferralCode::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Get or create the user's wallet.
     */
    public function getOrCreateWallet(): Wallet
    {
        return $this->wallet ?? Wallet::create(['user_id' => $this->id]);
    }

    public function redemptionRequests()
    {
        return $this->hasMany(RedemptionRequest::class);
    }

    public function manualDeposits()
    {
        return $this->hasMany(ManualDeposit::class);
    }

    public function activeSubscription()
    {
        return $this->subscriptions()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->first();
    }

    public function hasActiveSubscription(string $type): bool
    {
        $sub = $this->activeSubscription();
        if (!$sub) {
            return false;
        }

        if ($sub->plan_type === 'unlimited_bundle') {
            return true;
        }

        if ($type === 'invitation' && $sub->plan_type === 'invitation_pro') {
            return true;
        }

        if ($type === 'business' && $sub->plan_type === 'business_pro') {
            return true;
        }

        return false;
    }
}
