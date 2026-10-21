import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
export const createCard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createCard.url(options),
    method: 'get',
})

createCard.definition = {
    methods: ["get","head"],
    url: '/create-visiting-card',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
createCard.url = (options?: RouteQueryOptions) => {
    return createCard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
createCard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createCard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
createCard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createCard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
    const createCardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createCard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
        createCardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createCard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
        createCardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createCard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createCard.form = createCardForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::builder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
export const builder = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(options),
    method: 'get',
})

builder.definition = {
    methods: ["get","head"],
    url: '/business-cards/builder',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::builder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
builder.url = (options?: RouteQueryOptions) => {
    return builder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::builder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
builder.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::builder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
builder.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: builder.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::builder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
    const builderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: builder.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::builder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
        builderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: builder.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::builder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
        builderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: builder.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    builder.form = builderForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::checkout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:346
 * @route '/business-cards/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/business-cards/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::checkout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:346
 * @route '/business-cards/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::checkout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:346
 * @route '/business-cards/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::checkout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:346
 * @route '/business-cards/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::checkout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:346
 * @route '/business-cards/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCheckout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:523
 * @route '/business-cards/{business_card}/verify-checkout'
 */
export const verifyCheckout = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyCheckout.url(args, options),
    method: 'post',
})

verifyCheckout.definition = {
    methods: ["post"],
    url: '/business-cards/{business_card}/verify-checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCheckout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:523
 * @route '/business-cards/{business_card}/verify-checkout'
 */
verifyCheckout.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_card: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    business_card: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_card: args.business_card,
                }

    return verifyCheckout.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCheckout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:523
 * @route '/business-cards/{business_card}/verify-checkout'
 */
verifyCheckout.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyCheckout.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCheckout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:523
 * @route '/business-cards/{business_card}/verify-checkout'
 */
    const verifyCheckoutForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyCheckout.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCheckout
 * @see app/Http/Controllers/Customer/BusinessCardController.php:523
 * @route '/business-cards/{business_card}/verify-checkout'
 */
        verifyCheckoutForm.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyCheckout.url(args, options),
            method: 'post',
        })
    
    verifyCheckout.form = verifyCheckoutForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::quickLogin
 * @see app/Http/Controllers/Customer/BusinessCardController.php:593
 * @route '/business-cards/quick-login'
 */
export const quickLogin = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickLogin.url(options),
    method: 'post',
})

quickLogin.definition = {
    methods: ["post"],
    url: '/business-cards/quick-login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::quickLogin
 * @see app/Http/Controllers/Customer/BusinessCardController.php:593
 * @route '/business-cards/quick-login'
 */
quickLogin.url = (options?: RouteQueryOptions) => {
    return quickLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::quickLogin
 * @see app/Http/Controllers/Customer/BusinessCardController.php:593
 * @route '/business-cards/quick-login'
 */
quickLogin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickLogin.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::quickLogin
 * @see app/Http/Controllers/Customer/BusinessCardController.php:593
 * @route '/business-cards/quick-login'
 */
    const quickLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: quickLogin.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::quickLogin
 * @see app/Http/Controllers/Customer/BusinessCardController.php:593
 * @route '/business-cards/quick-login'
 */
        quickLoginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: quickLogin.url(options),
            method: 'post',
        })
    
    quickLogin.form = quickLoginForm
const businessCards = {
    createCard: Object.assign(createCard, createCard),
builder: Object.assign(builder, builder),
checkout: Object.assign(checkout, checkout),
verifyCheckout: Object.assign(verifyCheckout, verifyCheckout),
quickLogin: Object.assign(quickLogin, quickLogin),
}

export default businessCards