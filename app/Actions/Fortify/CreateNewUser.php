<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'role' => ['nullable', 'string', 'in:customer,reseller,referral_partner'],
            // Reseller details validations
            'reseller_business_name' => ['required_if:role,reseller', 'nullable', 'string', 'max:255'],
            'reseller_mobile_number' => ['required_if:role,reseller', 'nullable', 'string', 'max:20'],
            'reseller_email' => ['required_if:role,reseller', 'nullable', 'email', 'max:255'],
            'reseller_gst_number' => ['required_if:role,reseller', 'nullable', 'string', 'max:50'],
            'reseller_business_address' => ['nullable', 'string', 'max:1000'],
            // Referral details validations
            'referral_city' => ['required_if:role,referral_partner', 'nullable', 'string', 'max:255'],
            'referral_email' => ['required_if:role,referral_partner', 'nullable', 'email', 'max:255'],
            'referral_phone_number' => ['required_if:role,referral_partner', 'nullable', 'string', 'max:20'],
            'referral_social_media' => ['required_if:role,referral_partner', 'nullable', 'array'],
            'referral_social_media.*.platform' => ['required_with:referral_social_media', 'string', 'max:255'],
            'referral_social_media.*.username' => ['required_with:referral_social_media', 'string', 'max:255'],
            'referral_social_media.*.followers' => ['required_with:referral_social_media', 'integer', 'min:0'],
        ])->validate();

        $role = $input['role'] ?? 'customer';
        $isApproved = !in_array($role, ['reseller', 'referral_partner']);

        $resellerDetails = null;
        $referralDetails = null;

        if ($role === 'reseller') {
            $resellerDetails = [
                'business_name' => $input['reseller_business_name'] ?? null,
                'mobile_number' => $input['reseller_mobile_number'] ?? null,
                'email' => $input['reseller_email'] ?? null,
                'gst_number' => $input['reseller_gst_number'] ?? null,
                'business_address' => $input['reseller_business_address'] ?? null,
            ];
        } elseif ($role === 'referral_partner') {
            // Ensure social media accounts is parsed properly (if sent as array of objects)
            $socialMedia = [];
            if (isset($input['referral_social_media']) && is_array($input['referral_social_media'])) {
                foreach ($input['referral_social_media'] as $item) {
                    if (!empty($item['platform']) && !empty($item['username'])) {
                        $socialMedia[] = [
                            'platform' => $item['platform'],
                            'username' => $item['username'],
                            'followers' => (int)($item['followers'] ?? 0),
                        ];
                    }
                }
            }
            $referralDetails = [
                'city' => $input['referral_city'] ?? null,
                'email' => $input['referral_email'] ?? null,
                'phone_number' => $input['referral_phone_number'] ?? null,
                'social_media' => $socialMedia,
            ];
        }

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => $role,
            'is_approved' => $isApproved,
            'reseller_details' => $resellerDetails,
            'referral_details' => $referralDetails,
        ]);
    }
}
