import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\WalletController::index
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reseller/wallet',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\WalletController::index
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\WalletController::index
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\WalletController::index
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\WalletController::index
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\WalletController::index
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\WalletController::index
 * @see app/Http/Controllers/Reseller/WalletController.php:15
 * @route '/reseller/wallet'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Reseller\WalletController::createRazorpayOrder
 * @see app/Http/Controllers/Reseller/WalletController.php:47
 * @route '/reseller/recharge/razorpay'
 */
export const createRazorpayOrder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRazorpayOrder.url(options),
    method: 'post',
})

createRazorpayOrder.definition = {
    methods: ["post"],
    url: '/reseller/recharge/razorpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\WalletController::createRazorpayOrder
 * @see app/Http/Controllers/Reseller/WalletController.php:47
 * @route '/reseller/recharge/razorpay'
 */
createRazorpayOrder.url = (options?: RouteQueryOptions) => {
    return createRazorpayOrder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\WalletController::createRazorpayOrder
 * @see app/Http/Controllers/Reseller/WalletController.php:47
 * @route '/reseller/recharge/razorpay'
 */
createRazorpayOrder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRazorpayOrder.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\WalletController::createRazorpayOrder
 * @see app/Http/Controllers/Reseller/WalletController.php:47
 * @route '/reseller/recharge/razorpay'
 */
    const createRazorpayOrderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createRazorpayOrder.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\WalletController::createRazorpayOrder
 * @see app/Http/Controllers/Reseller/WalletController.php:47
 * @route '/reseller/recharge/razorpay'
 */
        createRazorpayOrderForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createRazorpayOrder.url(options),
            method: 'post',
        })
    
    createRazorpayOrder.form = createRazorpayOrderForm
/**
* @see \App\Http\Controllers\Reseller\WalletController::verifyRazorpayPayment
 * @see app/Http/Controllers/Reseller/WalletController.php:109
 * @route '/reseller/recharge/verify'
 */
export const verifyRazorpayPayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyRazorpayPayment.url(options),
    method: 'post',
})

verifyRazorpayPayment.definition = {
    methods: ["post"],
    url: '/reseller/recharge/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\WalletController::verifyRazorpayPayment
 * @see app/Http/Controllers/Reseller/WalletController.php:109
 * @route '/reseller/recharge/verify'
 */
verifyRazorpayPayment.url = (options?: RouteQueryOptions) => {
    return verifyRazorpayPayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\WalletController::verifyRazorpayPayment
 * @see app/Http/Controllers/Reseller/WalletController.php:109
 * @route '/reseller/recharge/verify'
 */
verifyRazorpayPayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyRazorpayPayment.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\WalletController::verifyRazorpayPayment
 * @see app/Http/Controllers/Reseller/WalletController.php:109
 * @route '/reseller/recharge/verify'
 */
    const verifyRazorpayPaymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyRazorpayPayment.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\WalletController::verifyRazorpayPayment
 * @see app/Http/Controllers/Reseller/WalletController.php:109
 * @route '/reseller/recharge/verify'
 */
        verifyRazorpayPaymentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyRazorpayPayment.url(options),
            method: 'post',
        })
    
    verifyRazorpayPayment.form = verifyRazorpayPaymentForm
/**
* @see \App\Http\Controllers\Reseller\WalletController::submitManualDeposit
 * @see app/Http/Controllers/Reseller/WalletController.php:160
 * @route '/reseller/recharge/manual'
 */
export const submitManualDeposit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitManualDeposit.url(options),
    method: 'post',
})

submitManualDeposit.definition = {
    methods: ["post"],
    url: '/reseller/recharge/manual',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\WalletController::submitManualDeposit
 * @see app/Http/Controllers/Reseller/WalletController.php:160
 * @route '/reseller/recharge/manual'
 */
submitManualDeposit.url = (options?: RouteQueryOptions) => {
    return submitManualDeposit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\WalletController::submitManualDeposit
 * @see app/Http/Controllers/Reseller/WalletController.php:160
 * @route '/reseller/recharge/manual'
 */
submitManualDeposit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitManualDeposit.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\WalletController::submitManualDeposit
 * @see app/Http/Controllers/Reseller/WalletController.php:160
 * @route '/reseller/recharge/manual'
 */
    const submitManualDepositForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitManualDeposit.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\WalletController::submitManualDeposit
 * @see app/Http/Controllers/Reseller/WalletController.php:160
 * @route '/reseller/recharge/manual'
 */
        submitManualDepositForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitManualDeposit.url(options),
            method: 'post',
        })
    
    submitManualDeposit.form = submitManualDepositForm
const WalletController = { index, createRazorpayOrder, verifyRazorpayPayment, submitManualDeposit }

export default WalletController