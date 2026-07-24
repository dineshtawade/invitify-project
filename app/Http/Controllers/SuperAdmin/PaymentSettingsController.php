<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentSettingsController extends Controller
{
    /**
     * Display payment settings page.
     */
    public function index()
    {
        $keyId = SystemSetting::get('razorpay_key_id', '');
        $hasSecret = !is_null(SystemSetting::get('razorpay_key_secret'));

        return Inertia::render('super-admin/payment-settings/index', [
            'settings' => [
                'razorpay_key_id'                  => $keyId,
                'has_razorpay_key_secret'          => $hasSecret,
                'reseller_bank_name'               => SystemSetting::get('reseller_bank_name', ''),
                'reseller_account_holder'          => SystemSetting::get('reseller_account_holder', ''),
                'reseller_account_number'          => SystemSetting::get('reseller_account_number', ''),
                'reseller_ifsc_code'               => SystemSetting::get('reseller_ifsc_code', ''),
                'reseller_upi_id'                  => SystemSetting::get('reseller_upi_id', ''),
                'reseller_default_bonus_percentage' => SystemSetting::get('reseller_default_bonus_percentage', '0'),
                'global_coupon_active'             => SystemSetting::get('global_coupon_active', '0'),
                'global_coupon_code'               => SystemSetting::get('global_coupon_code', ''),
                'global_coupon_discount'           => SystemSetting::get('global_coupon_discount', '0'),
            ],
        ]);
    }

    /**
     * Update payment settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'razorpay_key_id' => 'nullable|string|max:255',
            'razorpay_key_secret' => 'nullable|string|max:255',
            'reseller_bank_name' => 'nullable|string|max:255',
            'reseller_account_holder' => 'nullable|string|max:255',
            'reseller_account_number' => 'nullable|string|max:255',
            'reseller_ifsc_code' => 'nullable|string|max:255',
            'reseller_upi_id' => 'nullable|string|max:255',
            'reseller_default_bonus_percentage' => 'nullable|numeric|min:0|max:100',
            'global_coupon_active' => 'nullable|string|in:0,1',
            'global_coupon_code' => 'nullable|string|max:50',
            'global_coupon_discount' => 'nullable|numeric|min:0|max:100',
        ]);

        if (array_key_exists('razorpay_key_id', $validated)) {
            SystemSetting::set('razorpay_key_id', $validated['razorpay_key_id']);
        }

        // Only update secret if a new one is provided (non-empty)
        if (!empty($validated['razorpay_key_secret'])) {
            SystemSetting::set('razorpay_key_secret', $validated['razorpay_key_secret'], true);
        }

        // Reseller manual banking details
        if (array_key_exists('reseller_bank_name', $validated)) {
            SystemSetting::set('reseller_bank_name', $validated['reseller_bank_name']);
        }
        if (array_key_exists('reseller_account_holder', $validated)) {
            SystemSetting::set('reseller_account_holder', $validated['reseller_account_holder']);
        }
        if (array_key_exists('reseller_account_number', $validated)) {
            SystemSetting::set('reseller_account_number', $validated['reseller_account_number']);
        }
        if (array_key_exists('reseller_ifsc_code', $validated)) {
            SystemSetting::set('reseller_ifsc_code', $validated['reseller_ifsc_code']);
        }
        if (array_key_exists('reseller_upi_id', $validated)) {
            SystemSetting::set('reseller_upi_id', $validated['reseller_upi_id']);
        }
        if (array_key_exists('reseller_default_bonus_percentage', $validated)) {
            SystemSetting::set('reseller_default_bonus_percentage', $validated['reseller_default_bonus_percentage']);
        }

        // Global Promotional Coupon
        if (array_key_exists('global_coupon_active', $validated)) {
            SystemSetting::set('global_coupon_active', $validated['global_coupon_active']);
        }
        if (array_key_exists('global_coupon_code', $validated)) {
            SystemSetting::set('global_coupon_code', strtoupper($validated['global_coupon_code']));
        }
        if (array_key_exists('global_coupon_discount', $validated)) {
            SystemSetting::set('global_coupon_discount', $validated['global_coupon_discount']);
        }

        return redirect()->back()->with('status', 'Payment settings updated successfully.');
    }
}
