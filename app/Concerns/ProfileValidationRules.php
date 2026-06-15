<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        $rules = [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
        ];

        $user = request()->user();
        if ($user) {
            if ($user->role === 'reseller') {
                $rules['reseller_details'] = ['required', 'array'];
                $rules['reseller_details.business_name'] = ['required', 'string', 'max:255'];
                $rules['reseller_details.mobile_number'] = ['required', 'string', 'max:20'];
                $rules['reseller_details.email'] = ['required', 'email', 'max:255'];
                $rules['reseller_details.gst_number'] = ['required', 'string', 'max:50'];
                $rules['reseller_details.business_address'] = ['nullable', 'string', 'max:1000'];
            } elseif ($user->role === 'referral_partner') {
                $rules['referral_details'] = ['required', 'array'];
                $rules['referral_details.city'] = ['required', 'string', 'max:255'];
                $rules['referral_details.email'] = ['required', 'email', 'max:255'];
                $rules['referral_details.phone_number'] = ['required', 'string', 'max:20'];
                $rules['referral_details.social_media'] = ['required', 'array', 'min:1'];
                $rules['referral_details.social_media.*.platform'] = ['required', 'string', 'max:255'];
                $rules['referral_details.social_media.*.username'] = ['required', 'string', 'max:255'];
                $rules['referral_details.social_media.*.followers'] = ['required', 'integer', 'min:0'];
            }
        }

        return $rules;
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }
}
