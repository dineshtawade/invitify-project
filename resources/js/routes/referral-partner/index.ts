import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::dashboard
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:15
 * @route '/referral-partner/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/referral-partner/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::dashboard
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:15
 * @route '/referral-partner/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::dashboard
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:15
 * @route '/referral-partner/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::dashboard
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:15
 * @route '/referral-partner/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::dashboard
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:15
 * @route '/referral-partner/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::dashboard
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:15
 * @route '/referral-partner/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::dashboard
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:15
 * @route '/referral-partner/dashboard'
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
* @see \App\Http\Controllers\ReferralPartner\DashboardController::wallet
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:183
 * @route '/referral-partner/wallet'
 */
export const wallet = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wallet.url(options),
    method: 'get',
})

wallet.definition = {
    methods: ["get","head"],
    url: '/referral-partner/wallet',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::wallet
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:183
 * @route '/referral-partner/wallet'
 */
wallet.url = (options?: RouteQueryOptions) => {
    return wallet.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::wallet
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:183
 * @route '/referral-partner/wallet'
 */
wallet.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wallet.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::wallet
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:183
 * @route '/referral-partner/wallet'
 */
wallet.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: wallet.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::wallet
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:183
 * @route '/referral-partner/wallet'
 */
    const walletForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: wallet.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::wallet
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:183
 * @route '/referral-partner/wallet'
 */
        walletForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wallet.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::wallet
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:183
 * @route '/referral-partner/wallet'
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
* @see \App\Http\Controllers\ReferralPartner\DashboardController::paymentDetails
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:205
 * @route '/referral-partner/payment-details'
 */
export const paymentDetails = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentDetails.url(options),
    method: 'get',
})

paymentDetails.definition = {
    methods: ["get","head"],
    url: '/referral-partner/payment-details',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::paymentDetails
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:205
 * @route '/referral-partner/payment-details'
 */
paymentDetails.url = (options?: RouteQueryOptions) => {
    return paymentDetails.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::paymentDetails
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:205
 * @route '/referral-partner/payment-details'
 */
paymentDetails.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentDetails.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::paymentDetails
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:205
 * @route '/referral-partner/payment-details'
 */
paymentDetails.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentDetails.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::paymentDetails
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:205
 * @route '/referral-partner/payment-details'
 */
    const paymentDetailsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paymentDetails.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::paymentDetails
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:205
 * @route '/referral-partner/payment-details'
 */
        paymentDetailsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentDetails.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::paymentDetails
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:205
 * @route '/referral-partner/payment-details'
 */
        paymentDetailsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentDetails.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paymentDetails.form = paymentDetailsForm
/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::requestRedemption
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:79
 * @route '/referral-partner/request-redemption'
 */
export const requestRedemption = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestRedemption.url(options),
    method: 'post',
})

requestRedemption.definition = {
    methods: ["post"],
    url: '/referral-partner/request-redemption',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::requestRedemption
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:79
 * @route '/referral-partner/request-redemption'
 */
requestRedemption.url = (options?: RouteQueryOptions) => {
    return requestRedemption.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::requestRedemption
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:79
 * @route '/referral-partner/request-redemption'
 */
requestRedemption.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestRedemption.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::requestRedemption
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:79
 * @route '/referral-partner/request-redemption'
 */
    const requestRedemptionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: requestRedemption.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::requestRedemption
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:79
 * @route '/referral-partner/request-redemption'
 */
        requestRedemptionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: requestRedemption.url(options),
            method: 'post',
        })
    
    requestRedemption.form = requestRedemptionForm
/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::storeCode
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:138
 * @route '/referral-partner/codes'
 */
export const storeCode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCode.url(options),
    method: 'post',
})

storeCode.definition = {
    methods: ["post"],
    url: '/referral-partner/codes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::storeCode
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:138
 * @route '/referral-partner/codes'
 */
storeCode.url = (options?: RouteQueryOptions) => {
    return storeCode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::storeCode
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:138
 * @route '/referral-partner/codes'
 */
storeCode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCode.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::storeCode
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:138
 * @route '/referral-partner/codes'
 */
    const storeCodeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCode.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReferralPartner\DashboardController::storeCode
 * @see app/Http/Controllers/ReferralPartner/DashboardController.php:138
 * @route '/referral-partner/codes'
 */
        storeCodeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCode.url(options),
            method: 'post',
        })
    
    storeCode.form = storeCodeForm
const referralPartner = {
    dashboard: Object.assign(dashboard, dashboard),
wallet: Object.assign(wallet, wallet),
paymentDetails: Object.assign(paymentDetails, paymentDetails),
requestRedemption: Object.assign(requestRedemption, requestRedemption),
storeCode: Object.assign(storeCode, storeCode),
}

export default referralPartner