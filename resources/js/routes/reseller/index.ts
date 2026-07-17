import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import recharge from './recharge'
import purchase from './purchase'
import miniWebsites from './mini-websites'
import businessWebsites from './business-websites'
import templates from './templates'
import userTemplates from './user-templates'
import websites from './websites'
/**
* @see \App\Http\Controllers\Reseller\DashboardController::dashboard
 * @see app/Http/Controllers/Reseller/DashboardController.php:14
 * @route '/reseller/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/reseller/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\DashboardController::dashboard
 * @see app/Http/Controllers/Reseller/DashboardController.php:14
 * @route '/reseller/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\DashboardController::dashboard
 * @see app/Http/Controllers/Reseller/DashboardController.php:14
 * @route '/reseller/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\DashboardController::dashboard
 * @see app/Http/Controllers/Reseller/DashboardController.php:14
 * @route '/reseller/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\DashboardController::dashboard
 * @see app/Http/Controllers/Reseller/DashboardController.php:14
 * @route '/reseller/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\DashboardController::dashboard
 * @see app/Http/Controllers/Reseller/DashboardController.php:14
 * @route '/reseller/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\DashboardController::dashboard
 * @see app/Http/Controllers/Reseller/DashboardController.php:14
 * @route '/reseller/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Reseller\WalletController::wallet
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
export const wallet = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wallet.url(options),
    method: 'get',
})

wallet.definition = {
    methods: ["get","head"],
    url: '/reseller/wallet',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\WalletController::wallet
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
wallet.url = (options?: RouteQueryOptions) => {
    return wallet.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\WalletController::wallet
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
wallet.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wallet.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\WalletController::wallet
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
wallet.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: wallet.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\WalletController::wallet
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
    const walletForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: wallet.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\WalletController::wallet
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
        walletForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wallet.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\WalletController::wallet
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
        walletForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wallet.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    wallet.form = walletForm
/**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::paymentHistory
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
export const paymentHistory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentHistory.url(options),
    method: 'get',
})

paymentHistory.definition = {
    methods: ["get","head"],
    url: '/reseller/payment-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::paymentHistory
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
paymentHistory.url = (options?: RouteQueryOptions) => {
    return paymentHistory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::paymentHistory
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
paymentHistory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentHistory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::paymentHistory
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
paymentHistory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentHistory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::paymentHistory
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
    const paymentHistoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paymentHistory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::paymentHistory
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
        paymentHistoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentHistory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::paymentHistory
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
        paymentHistoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentHistory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paymentHistory.form = paymentHistoryForm
/**
* @see \App\Http\Controllers\Reseller\ShopController::shop
 * @see app/Http/Controllers/Reseller/ShopController.php:13
 * @route '/reseller/shop'
 */
export const shop = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shop.url(options),
    method: 'get',
})

shop.definition = {
    methods: ["get","head"],
    url: '/reseller/shop',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\ShopController::shop
 * @see app/Http/Controllers/Reseller/ShopController.php:13
 * @route '/reseller/shop'
 */
shop.url = (options?: RouteQueryOptions) => {
    return shop.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\ShopController::shop
 * @see app/Http/Controllers/Reseller/ShopController.php:13
 * @route '/reseller/shop'
 */
shop.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shop.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\ShopController::shop
 * @see app/Http/Controllers/Reseller/ShopController.php:13
 * @route '/reseller/shop'
 */
shop.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: shop.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\ShopController::shop
 * @see app/Http/Controllers/Reseller/ShopController.php:13
 * @route '/reseller/shop'
 */
    const shopForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: shop.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\ShopController::shop
 * @see app/Http/Controllers/Reseller/ShopController.php:13
 * @route '/reseller/shop'
 */
        shopForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: shop.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\ShopController::shop
 * @see app/Http/Controllers/Reseller/ShopController.php:13
 * @route '/reseller/shop'
 */
        shopForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: shop.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    shop.form = shopForm
/**
* @see \App\Http\Controllers\Reseller\TemplateController::myInvitations
 * @see app/Http/Controllers/Reseller/TemplateController.php:143
 * @route '/reseller/my-invitations'
 */
export const myInvitations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myInvitations.url(options),
    method: 'get',
})

myInvitations.definition = {
    methods: ["get","head"],
    url: '/reseller/my-invitations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\TemplateController::myInvitations
 * @see app/Http/Controllers/Reseller/TemplateController.php:143
 * @route '/reseller/my-invitations'
 */
myInvitations.url = (options?: RouteQueryOptions) => {
    return myInvitations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\TemplateController::myInvitations
 * @see app/Http/Controllers/Reseller/TemplateController.php:143
 * @route '/reseller/my-invitations'
 */
myInvitations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myInvitations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\TemplateController::myInvitations
 * @see app/Http/Controllers/Reseller/TemplateController.php:143
 * @route '/reseller/my-invitations'
 */
myInvitations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myInvitations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::myInvitations
 * @see app/Http/Controllers/Reseller/TemplateController.php:143
 * @route '/reseller/my-invitations'
 */
    const myInvitationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: myInvitations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::myInvitations
 * @see app/Http/Controllers/Reseller/TemplateController.php:143
 * @route '/reseller/my-invitations'
 */
        myInvitationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myInvitations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\TemplateController::myInvitations
 * @see app/Http/Controllers/Reseller/TemplateController.php:143
 * @route '/reseller/my-invitations'
 */
        myInvitationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myInvitations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    myInvitations.form = myInvitationsForm
const reseller = {
    dashboard: Object.assign(dashboard, dashboard),
wallet: Object.assign(wallet, wallet),
recharge: Object.assign(recharge, recharge),
paymentHistory: Object.assign(paymentHistory, paymentHistory),
shop: Object.assign(shop, shop),
purchase: Object.assign(purchase, purchase),
miniWebsites: Object.assign(miniWebsites, miniWebsites),
businessWebsites: Object.assign(businessWebsites, businessWebsites),
templates: Object.assign(templates, templates),
userTemplates: Object.assign(userTemplates, userTemplates),
myInvitations: Object.assign(myInvitations, myInvitations),
websites: Object.assign(websites, websites),
}

export default reseller