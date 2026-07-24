<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $globalCoupon = null;
        $globalCouponActive = \App\Models\SystemSetting::get('global_coupon_active', '0');
        if ($globalCouponActive === '1') {
            $code = \App\Models\SystemSetting::get('global_coupon_code', '');
            $discount = \App\Models\SystemSetting::get('global_coupon_discount', '0');
            
            $hasUsed = false;
            if ($request->user() && !empty($code)) {
                $hasUsed = \App\Models\Transaction::where('user_id', $request->user()->id)
                    ->where('global_coupon_code', strtoupper($code))
                    ->where('status', 'completed')
                    ->exists();
            }

            if (!empty($code) && !$hasUsed) {
                $globalCoupon = [
                    'code' => $code,
                    'discount' => $discount,
                ];
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'global_coupon' => $globalCoupon,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
