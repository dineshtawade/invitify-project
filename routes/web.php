<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'templates' => \App\Models\Template::all(),
        'miniWebsiteTemplates' => \App\Models\MiniWebsiteTemplate::all(),
        'categories' => \App\Models\Category::orderBy('name')->get(),
    ]);
})->name('home');

Route::get('/privacy-policy', function () {
    return Inertia::render('public/privacy-policy');
})->name('privacy-policy');

Route::get('/terms-and-conditions', function () {
    return Inertia::render('public/terms-and-conditions');
})->name('terms-and-conditions');

Route::get('/refund-policy', function () {
    return Inertia::render('public/refund-policy');
})->name('refund-policy');

Route::get('/disclaimer', function () {
    return Inertia::render('public/disclaimer');
})->name('disclaimer');

Route::get('/cookie-policy', function () {
    return Inertia::render('public/cookie-policy');
})->name('cookie-policy');



Route::get('templates/{template}/customize', [\App\Http\Controllers\Customer\TemplateController::class, 'edit'])
    ->name('customer.templates.customize');

Route::get('invitations/view/{userTemplate}', [\App\Http\Controllers\Customer\TemplateController::class, 'viewShared'])
    ->name('invitations.view');

// Public Mini Websites (Invitations) Routing
Route::get('mini-website/{slug}/{page?}', [\App\Http\Controllers\PublicSiteController::class, 'show'])->name('public.site.show');
Route::post('mini-website/{slug}/rsvp', [\App\Http\Controllers\PublicSiteController::class, 'rsvp'])->name('public.site.rsvp');
Route::post('mini-website/{slug}/contact', [\App\Http\Controllers\PublicSiteController::class, 'contact'])->name('public.site.contact');

// Public Business Websites Routing
Route::get('business/{slug}/{page?}', [\App\Http\Controllers\PublicBusinessSiteController::class, 'show'])->name('public.business.show');
Route::post('business/{slug}/contact', [\App\Http\Controllers\PublicBusinessSiteController::class, 'contact'])->name('public.business.contact');

// Public Digital Business Cards Routing
Route::get('card/{slug}', [\App\Http\Controllers\PublicCardController::class, 'show'])->name('public.card.show');
Route::post('card/{slug}/feedback', [\App\Http\Controllers\PublicCardController::class, 'submitFeedback'])->name('public.card.feedback');
Route::get('card/{slug}/vcard', [\App\Http\Controllers\PublicCardController::class, 'downloadVcard'])->name('public.card.vcard');

// Serve storage files directly as a fallback for Windows/XAMPP symlink issues
Route::get('/storage/media/{filename}', function ($filename) {
    $path = storage_path('app/public/media/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path, [
        'Content-Type' => mime_content_type($path),
        'Access-Control-Allow-Origin' => '*',
    ]);
});

Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureApproved::class])->group(function () {
    // Media Upload
    Route::post('/media/upload', [\App\Http\Controllers\MediaUploadController::class, 'upload'])->name('media.upload');

    // Referral Code Validation
    Route::post('/apply-referral', function (\Illuminate\Http\Request $request) {
        $request->validate(['code' => 'required|string']);
        $code = \App\Models\ReferralCode::where('code', strtoupper($request->code))->first();
        if (!$code || !$code->isValid()) {
            return response()->json(['valid' => false, 'message' => 'Invalid or expired referral code.'], 422);
        }
        return response()->json([
            'valid' => true,
            'code' => $code->code,
            'discount_percentage' => $code->discount_percentage,
            'referral_code_id' => $code->id,
        ]);
    })->name('apply-referral');

    // Role-based redirect for /dashboard
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user->role === 'super_admin') {
            return redirect()->route('super-admin.dashboard');
        } elseif ($user->role === 'editor') {
            return redirect()->route('super-admin.templates');
        } elseif ($user->role === 'reseller') {
            return redirect()->route('reseller.dashboard');
        } elseif ($user->role === 'referral_partner') {
            return redirect()->route('referral-partner.dashboard');
        } else {
            return redirect()->route('customer.dashboard');
        }
    })->name('dashboard');

    // Super Admin Routes
    Route::middleware([\App\Http\Middleware\EnsureSuperAdmin::class])->group(function () {
        Route::prefix('super-admin')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\SuperAdmin\DashboardController::class, 'index'])
                ->name('super-admin.dashboard');
            Route::resource('users', \App\Http\Controllers\SuperAdmin\UserController::class);
            Route::resource('mini-website-templates', \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::class);
            Route::resource('business-website-templates', \App\Http\Controllers\SuperAdmin\BusinessWebsiteTemplateController::class);
            Route::resource('transactions', \App\Http\Controllers\SuperAdmin\TransactionController::class);
            Route::resource('categories', \App\Http\Controllers\SuperAdmin\CategoryController::class);
            Route::resource('custom-blocks', \App\Http\Controllers\SuperAdmin\CustomBlockController::class);
        });

        Route::post('super-admin/users/{user}/approve', [\App\Http\Controllers\SuperAdmin\UserController::class, 'approve'])
            ->name('super-admin.users.approve');

        // Editor Action Requests
        Route::get('super-admin/editor-requests', [\App\Http\Controllers\SuperAdmin\EditorActionRequestController::class, 'index'])
            ->name('super-admin.editor-requests.index');
        Route::post('super-admin/editor-requests', [\App\Http\Controllers\SuperAdmin\EditorActionRequestController::class, 'store'])
            ->name('super-admin.editor-requests.store');
        Route::post('super-admin/editor-requests/{editorRequest}/approve', [\App\Http\Controllers\SuperAdmin\EditorActionRequestController::class, 'approve'])
            ->name('super-admin.editor-requests.approve');
        Route::post('super-admin/editor-requests/{editorRequest}/reject', [\App\Http\Controllers\SuperAdmin\EditorActionRequestController::class, 'reject'])
            ->name('super-admin.editor-requests.reject');

        // Template Management
        Route::get('super-admin/templates', [\App\Http\Controllers\SuperAdmin\TemplateController::class, 'index'])
            ->name('super-admin.templates');
        Route::post('super-admin/templates', [\App\Http\Controllers\SuperAdmin\TemplateController::class, 'store'])
            ->name('super-admin.templates.store');
        Route::put('super-admin/templates/{template}', [\App\Http\Controllers\SuperAdmin\TemplateController::class, 'update'])
            ->name('super-admin.templates.update');
        Route::delete('super-admin/templates/{template}', [\App\Http\Controllers\SuperAdmin\TemplateController::class, 'destroy'])
            ->name('super-admin.templates.destroy');

        // Payment Settings
        Route::get('super-admin/payment-settings', [\App\Http\Controllers\SuperAdmin\PaymentSettingsController::class, 'index'])
            ->name('super-admin.payment-settings.index');
        Route::post('super-admin/payment-settings', [\App\Http\Controllers\SuperAdmin\PaymentSettingsController::class, 'update'])
            ->name('super-admin.payment-settings.update');

        // System Settings
        Route::get('super-admin/settings', [\App\Http\Controllers\SuperAdmin\SettingsController::class, 'index'])
            ->name('super-admin.settings');
        Route::post('super-admin/settings', [\App\Http\Controllers\SuperAdmin\SettingsController::class, 'update'])
            ->name('super-admin.settings.update');
        Route::delete('super-admin/settings/{key}', [\App\Http\Controllers\SuperAdmin\SettingsController::class, 'destroy'])
            ->name('super-admin.settings.destroy');

        // Business Card Plan Management
        Route::get('super-admin/business-card-plans', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'index'])
            ->name('super-admin.business-card-plans.index');
        Route::post('super-admin/business-card-plans', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'store'])
            ->name('super-admin.business-card-plans.store');
        Route::put('super-admin/business-card-plans/{businessCardPlan}', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'update'])
            ->name('super-admin.business-card-plans.update');
        Route::delete('super-admin/business-card-plans/{businessCardPlan}', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'destroy'])
            ->name('super-admin.business-card-plans.destroy');

        // Manage Transactions
        Route::get('super-admin/transactions', [\App\Http\Controllers\SuperAdmin\TransactionController::class, 'index'])
            ->name('super-admin.transactions');

        // Referral Management
        Route::get('super-admin/referrals', [\App\Http\Controllers\SuperAdmin\ReferralController::class, 'index'])
            ->name('super-admin.referrals');
        Route::post('super-admin/referrals/codes', [\App\Http\Controllers\SuperAdmin\ReferralController::class, 'storeCode'])
            ->name('super-admin.referrals.store-code');
        Route::post('super-admin/referrals/assign-allocation', [\App\Http\Controllers\SuperAdmin\ReferralController::class, 'assignAllocation'])
            ->name('super-admin.referrals.assign-allocation');
        Route::post('super-admin/referrals/{user}/permissions', [\App\Http\Controllers\SuperAdmin\ReferralController::class, 'updatePermissions'])
            ->name('super-admin.referrals.update-permissions');
        Route::post('super-admin/referrals/codes/{referralCode}/toggle', [\App\Http\Controllers\SuperAdmin\ReferralController::class, 'toggleCode'])
            ->name('super-admin.referrals.toggle-code');
        Route::delete('super-admin/referrals/codes/{referralCode}', [\App\Http\Controllers\SuperAdmin\ReferralController::class, 'destroyCode'])
            ->name('super-admin.referrals.destroy-code');

        // Business Card Subscription Plans Management
        Route::get('super-admin/business-card-plans/api', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'apiIndex'])
            ->name('super-admin.business-card-plans.api');
        Route::get('super-admin/business-card-plans', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'index'])
            ->name('super-admin.business-card-plans.index');
        Route::post('super-admin/business-card-plans', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'store'])
            ->name('super-admin.business-card-plans.store');
        Route::put('super-admin/business-card-plans/{businessCardPlan}', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'update'])
            ->name('super-admin.business-card-plans.update');
        Route::delete('super-admin/business-card-plans/{businessCardPlan}', [\App\Http\Controllers\SuperAdmin\BusinessCardPlanController::class, 'destroy'])
            ->name('super-admin.business-card-plans.destroy');

        // Wallet & Redemption Management
        Route::get('super-admin/wallets', [\App\Http\Controllers\SuperAdmin\WalletController::class, 'index'])
            ->name('super-admin.wallets');
        Route::post('super-admin/wallets/redemptions/{redemptionRequest}/approve', [\App\Http\Controllers\SuperAdmin\WalletController::class, 'approveRedemption'])
            ->name('super-admin.wallets.approve-redemption');
        Route::post('super-admin/wallets/redemptions/{redemptionRequest}/reject', [\App\Http\Controllers\SuperAdmin\WalletController::class, 'rejectRedemption'])
            ->name('super-admin.wallets.reject-redemption');

        // Reseller Wallet & Deposit Management
        Route::get('super-admin/resellers', [\App\Http\Controllers\SuperAdmin\ResellerDepositController::class, 'index'])
            ->name('super-admin.resellers');
        Route::post('super-admin/resellers/deposits/{deposit}/approve', [\App\Http\Controllers\SuperAdmin\ResellerDepositController::class, 'approve'])
            ->name('super-admin.resellers.deposits.approve');
        Route::post('super-admin/resellers/deposits/{deposit}/reject', [\App\Http\Controllers\SuperAdmin\ResellerDepositController::class, 'reject'])
            ->name('super-admin.resellers.deposits.reject');
        Route::post('super-admin/resellers/adjust-balance', [\App\Http\Controllers\SuperAdmin\ResellerDepositController::class, 'adjustBalance'])
            ->name('super-admin.resellers.adjust-balance');
        Route::post('super-admin/resellers/update-online-bonus', [\App\Http\Controllers\SuperAdmin\ResellerDepositController::class, 'updateOnlineBonus'])
            ->name('super-admin.resellers.update-online-bonus');

    });

    // Reseller Routes
    Route::middleware([\App\Http\Middleware\EnsureReseller::class])->group(function () {
        Route::get('reseller/dashboard', [\App\Http\Controllers\Reseller\DashboardController::class, 'index'])
            ->name('reseller.dashboard');
        Route::get('reseller/wallet', [\App\Http\Controllers\Reseller\WalletController::class, 'index'])
            ->name('reseller.wallet');
        Route::post('reseller/recharge/razorpay', [\App\Http\Controllers\Reseller\WalletController::class, 'createRazorpayOrder'])
            ->name('reseller.recharge.razorpay');
        Route::post('reseller/recharge/verify', [\App\Http\Controllers\Reseller\WalletController::class, 'verifyRazorpayPayment'])
            ->name('reseller.recharge.verify');
        Route::post('reseller/recharge/manual', [\App\Http\Controllers\Reseller\WalletController::class, 'submitManualDeposit'])
            ->name('reseller.recharge.manual');
        Route::get('reseller/payment-history', [\App\Http\Controllers\Reseller\PaymentHistoryController::class, 'index'])
            ->name('reseller.payment-history');
        Route::get('reseller/shop', [\App\Http\Controllers\Reseller\ShopController::class, 'index'])
            ->name('reseller.shop');
        Route::post('reseller/purchase/template', [\App\Http\Controllers\Reseller\PurchaseController::class, 'purchaseTemplate'])
            ->name('reseller.purchase.template');
        Route::post('reseller/purchase/mini-website', [\App\Http\Controllers\Reseller\PurchaseController::class, 'purchaseMiniWebsite'])
            ->name('reseller.purchase.mini-website');
        Route::post('reseller/purchase/business-website', [\App\Http\Controllers\Reseller\PurchaseController::class, 'purchaseBusinessWebsite'])
            ->name('reseller.purchase.business-website');
        Route::post('reseller/mini-websites/{mini_website}/purchase-template', [\App\Http\Controllers\Reseller\PurchaseController::class, 'payMiniWebsiteTemplate'])
            ->name('reseller.mini-websites.purchase-template');
        Route::post('reseller/business-websites/{business_website}/purchase-template', [\App\Http\Controllers\Reseller\PurchaseController::class, 'payBusinessWebsiteTemplate'])
            ->name('reseller.business-websites.purchase-template');

        // Reseller Template Customization Flow
        Route::get('reseller/templates/{template}/customize', [\App\Http\Controllers\Reseller\TemplateController::class, 'edit'])
            ->name('reseller.templates.customize');
        Route::put('reseller/user-templates/{userTemplate}/save-draft', [\App\Http\Controllers\Reseller\TemplateController::class, 'saveDraft'])
            ->name('reseller.user-templates.save-draft');
        Route::post('reseller/user-templates/{userTemplate}/purchase', [\App\Http\Controllers\Reseller\TemplateController::class, 'purchase'])
            ->name('reseller.user-templates.purchase');
        Route::post('reseller/user-templates/{userTemplate}/upload-video', [\App\Http\Controllers\Reseller\TemplateController::class, 'uploadVideo'])
            ->name('reseller.user-templates.upload-video');
        Route::get('reseller/my-invitations', [\App\Http\Controllers\Reseller\TemplateController::class, 'purchased'])
            ->name('reseller.my-invitations');

        // Reseller Website Management & Hosting
        Route::get('reseller/websites', [\App\Http\Controllers\Reseller\HostingController::class, 'index'])
            ->name('reseller.websites.index');
        Route::post('reseller/websites/{type}/{id}/host', [\App\Http\Controllers\Reseller\HostingController::class, 'host'])
            ->name('reseller.websites.host');

        // Reseller Mini Websites editor
        Route::get('reseller/mini-websites/{mini_website}/download-zip', [\App\Http\Controllers\Reseller\MiniWebsiteController::class, 'downloadInviteZip'])
            ->name('reseller.mini-websites.download-zip');
        Route::get('reseller/mini-websites/{mini_website}/edit', [\App\Http\Controllers\Reseller\MiniWebsiteController::class, 'edit'])
            ->name('reseller.mini-websites.edit');
        Route::put('reseller/mini-websites/{mini_website}', [\App\Http\Controllers\Reseller\MiniWebsiteController::class, 'update'])
            ->name('reseller.mini-websites.update');
        Route::delete('reseller/mini-websites/{mini_website}', [\App\Http\Controllers\Reseller\MiniWebsiteController::class, 'destroy'])
            ->name('reseller.mini-websites.destroy');

        // Reseller Business Websites editor
        Route::get('reseller/business-websites/{business_website}/edit', [\App\Http\Controllers\Reseller\BusinessWebsiteController::class, 'edit'])
            ->name('reseller.business-websites.edit');
        Route::put('reseller/business-websites/{business_website}', [\App\Http\Controllers\Reseller\BusinessWebsiteController::class, 'update'])
            ->name('reseller.business-websites.update');
        Route::delete('reseller/business-websites/{business_website}', [\App\Http\Controllers\Reseller\BusinessWebsiteController::class, 'destroy'])
            ->name('reseller.business-websites.destroy');
    });

    // Referral Partner Routes
    Route::middleware([\App\Http\Middleware\EnsureReferralPartner::class])->group(function () {
        Route::get('referral-partner/dashboard', [\App\Http\Controllers\ReferralPartner\DashboardController::class, 'index'])
            ->name('referral-partner.dashboard');
        Route::get('referral-partner/wallet', [\App\Http\Controllers\ReferralPartner\DashboardController::class, 'wallet'])
            ->name('referral-partner.wallet');
        Route::get('referral-partner/payment-details', [\App\Http\Controllers\ReferralPartner\DashboardController::class, 'paymentDetails'])
            ->name('referral-partner.payment-details');
        Route::post('referral-partner/request-redemption', [\App\Http\Controllers\ReferralPartner\DashboardController::class, 'requestRedemption'])
            ->name('referral-partner.request-redemption');
        Route::post('referral-partner/codes', [\App\Http\Controllers\ReferralPartner\DashboardController::class, 'storeCode'])
            ->name('referral-partner.store-code');
    });

    // Customer Routes
    Route::middleware([\App\Http\Middleware\EnsureCustomer::class])->group(function () {
        Route::get('customer/dashboard', function () {
            return Inertia::render('customer/dashboard', [
                'templates' => \App\Models\Template::all(),
                'miniWebsites' => \App\Models\MiniWebsite::where('user_id', auth()->id())
                    ->withCount(['rsvps', 'contactSubmissions'])
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(),
            ]);
        })->name('customer.dashboard');

        // Customer templates
        Route::get('customer/templates', [\App\Http\Controllers\Customer\TemplateController::class, 'index'])
            ->name('customer.templates');
        Route::put('customer/user-templates/{userTemplate}/save-draft', [\App\Http\Controllers\Customer\TemplateController::class, 'saveDraft'])
            ->name('customer.user-templates.save-draft');
        Route::post('customer/user-templates/{userTemplate}/purchase', [\App\Http\Controllers\Customer\TemplateController::class, 'purchase'])
            ->name('customer.user-templates.purchase');
        Route::post('customer/user-templates/{userTemplate}/upload-video', [\App\Http\Controllers\Customer\TemplateController::class, 'uploadVideo'])
            ->name('customer.user-templates.upload-video');
        
        // Razorpay Payment Endpoints
        Route::post('customer/user-templates/{userTemplate}/create-order', [\App\Http\Controllers\Customer\TemplateController::class, 'createRazorpayOrder'])
            ->name('customer.user-templates.create-order');
        Route::post('customer/user-templates/{userTemplate}/verify-payment', [\App\Http\Controllers\Customer\TemplateController::class, 'verifyRazorpayPayment'])
            ->name('customer.user-templates.verify-payment');

        Route::post('customer/user-templates/claim', [\App\Http\Controllers\Customer\TemplateController::class, 'claim'])
            ->name('customer.user-templates.claim');
        Route::get('customer/my-invitations', [\App\Http\Controllers\Customer\TemplateController::class, 'purchased'])
            ->name('customer.my-invitations');

        // Customer Subscriptions
        Route::get('customer/subscriptions', [\App\Http\Controllers\Customer\SubscriptionController::class, 'index'])
            ->name('customer.subscriptions');
        Route::post('customer/subscriptions', [\App\Http\Controllers\Customer\SubscriptionController::class, 'subscribe'])
            ->name('customer.subscriptions.subscribe');

        // Customer Mini Websites
        Route::get('customer/mini-websites/{mini_website}/download-zip', [\App\Http\Controllers\Customer\MiniWebsiteController::class, 'downloadInviteZip'])
            ->name('customer.mini-websites.download-zip');
        Route::resource('customer/mini-websites', \App\Http\Controllers\Customer\MiniWebsiteController::class, [
            'names' => 'customer.mini-websites'
        ]);

        // Customer Business Websites
        Route::resource('customer/business-websites', \App\Http\Controllers\Customer\BusinessWebsiteController::class, [
            'names' => 'customer.business-websites'
        ]);

        // Customer Digital Business Cards
        Route::resource('customer/business-cards', \App\Http\Controllers\Customer\BusinessCardController::class, [
            'names' => 'customer.business-cards'
        ]);

        // Business Card Purchase Flow
        Route::get('customer/business-card-plans', [\App\Http\Controllers\Customer\BusinessCardController::class, 'getPlans'])
            ->name('customer.business-card-plans');
        Route::post('customer/business-cards/draft-create', [\App\Http\Controllers\Customer\BusinessCardController::class, 'draftCreate'])
            ->name('customer.business-cards.draft-create');
        Route::post('customer/business-cards/{business_card}/create-order', [\App\Http\Controllers\Customer\BusinessCardController::class, 'payOrder'])
            ->name('customer.business-cards.create-order');
        Route::post('customer/business-cards/{business_card}/verify-payment', [\App\Http\Controllers\Customer\BusinessCardController::class, 'verifyCardPayment'])
            ->name('customer.business-cards.verify-payment');

        Route::get('customer/static-templates', function () {
            $templates = [];
            for ($i = 1; $i <= 100; $i++) {
                $thumbnail = "/images/business-cards/template{$i}.png";
                if ($i >= 36 && $i <= 100) {
                    $thumbnail = "/images/business-cards/pre{$i}.webp";
                }
                $templates[] = [
                    'id' => $i,
                    'name' => "Template {$i}",
                    'css_file' => "card_css{$i}.css",
                    'thumbnail' => $thumbnail
                ];
            }
            $plans = \App\Models\BusinessCardPlan::active()->orderBy('price')->get(['id', 'name', 'duration_months', 'price', 'description']);
            return Inertia::render('customer/static-templates/index', [
                'templates'     => $templates,
                'plans'         => $plans,
                'razorpayKeyId' => \App\Models\SystemSetting::get('razorpay_key_id', ''),
            ]);
        })->name('customer.static-templates.index');

        Route::get('customer/mini-websites/{mini_website}/submissions', [\App\Http\Controllers\Customer\MiniWebsiteController::class, 'submissions'])
            ->name('customer.mini-websites.submissions');
        Route::post('customer/mini-websites/{mini_website}/create-order', [\App\Http\Controllers\Customer\MiniWebsiteController::class, 'createRenewalOrder'])
            ->name('customer.mini-websites.create-order');
        Route::post('customer/mini-websites/{mini_website}/verify-payment', [\App\Http\Controllers\Customer\MiniWebsiteController::class, 'verifyRenewalPayment'])
            ->name('customer.mini-websites.verify-payment');
    });
});

require __DIR__.'/settings.php';
