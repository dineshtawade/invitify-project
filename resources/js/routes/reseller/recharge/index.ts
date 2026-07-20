import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\WalletController::razorpay
 * @see app/Http/Controllers/Reseller/WalletController.php:46
 * @route '/reseller/recharge/razorpay'
 */
export const razorpay = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: razorpay.url(options),
    method: 'post',
})

razorpay.definition = {
    methods: ["post"],
    url: '/reseller/recharge/razorpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\WalletController::razorpay
 * @see app/Http/Controllers/Reseller/WalletController.php:46
 * @route '/reseller/recharge/razorpay'
 */
razorpay.url = (options?: RouteQueryOptions) => {
    return razorpay.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\WalletController::razorpay
 * @see app/Http/Controllers/Reseller/WalletController.php:46
 * @route '/reseller/recharge/razorpay'
 */
razorpay.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: razorpay.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\WalletController::razorpay
 * @see app/Http/Controllers/Reseller/WalletController.php:46
 * @route '/reseller/recharge/razorpay'
 */
    const razorpayForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: razorpay.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\WalletController::razorpay
 * @see app/Http/Controllers/Reseller/WalletController.php:46
 * @route '/reseller/recharge/razorpay'
 */
        razorpayForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: razorpay.url(options),
            method: 'post',
        })
    
    razorpay.form = razorpayForm
/**
* @see \App\Http\Controllers\Reseller\WalletController::verify
 * @see app/Http/Controllers/Reseller/WalletController.php:108
 * @route '/reseller/recharge/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/reseller/recharge/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\WalletController::verify
 * @see app/Http/Controllers/Reseller/WalletController.php:108
 * @route '/reseller/recharge/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\WalletController::verify
 * @see app/Http/Controllers/Reseller/WalletController.php:108
 * @route '/reseller/recharge/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\WalletController::verify
 * @see app/Http/Controllers/Reseller/WalletController.php:108
 * @route '/reseller/recharge/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\WalletController::verify
 * @see app/Http/Controllers/Reseller/WalletController.php:108
 * @route '/reseller/recharge/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\Reseller\WalletController::manual
 * @see app/Http/Controllers/Reseller/WalletController.php:159
 * @route '/reseller/recharge/manual'
 */
export const manual = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: manual.url(options),
    method: 'post',
})

manual.definition = {
    methods: ["post"],
    url: '/reseller/recharge/manual',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\WalletController::manual
 * @see app/Http/Controllers/Reseller/WalletController.php:159
 * @route '/reseller/recharge/manual'
 */
manual.url = (options?: RouteQueryOptions) => {
    return manual.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\WalletController::manual
 * @see app/Http/Controllers/Reseller/WalletController.php:159
 * @route '/reseller/recharge/manual'
 */
manual.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: manual.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\WalletController::manual
 * @see app/Http/Controllers/Reseller/WalletController.php:159
 * @route '/reseller/recharge/manual'
 */
    const manualForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: manual.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\WalletController::manual
 * @see app/Http/Controllers/Reseller/WalletController.php:159
 * @route '/reseller/recharge/manual'
 */
        manualForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: manual.url(options),
            method: 'post',
        })
    
    manual.form = manualForm
const recharge = {
    razorpay: Object.assign(razorpay, razorpay),
verify: Object.assign(verify, verify),
manual: Object.assign(manual, manual),
}

export default recharge