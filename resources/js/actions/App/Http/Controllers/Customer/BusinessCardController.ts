import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
const createCard406ea3c77c01be6d8744815edae48faa = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createCard406ea3c77c01be6d8744815edae48faa.url(options),
    method: 'get',
})

createCard406ea3c77c01be6d8744815edae48faa.definition = {
    methods: ["get","head"],
    url: '/create-visiting-card',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
createCard406ea3c77c01be6d8744815edae48faa.url = (options?: RouteQueryOptions) => {
    return createCard406ea3c77c01be6d8744815edae48faa.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
createCard406ea3c77c01be6d8744815edae48faa.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createCard406ea3c77c01be6d8744815edae48faa.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
createCard406ea3c77c01be6d8744815edae48faa.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createCard406ea3c77c01be6d8744815edae48faa.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
    const createCard406ea3c77c01be6d8744815edae48faaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createCard406ea3c77c01be6d8744815edae48faa.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
        createCard406ea3c77c01be6d8744815edae48faaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createCard406ea3c77c01be6d8744815edae48faa.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/create-visiting-card'
 */
        createCard406ea3c77c01be6d8744815edae48faaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createCard406ea3c77c01be6d8744815edae48faa.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createCard406ea3c77c01be6d8744815edae48faa.form = createCard406ea3c77c01be6d8744815edae48faaForm
    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
const createCardd164dc48c601e24bc6fe3d8074750b33 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createCardd164dc48c601e24bc6fe3d8074750b33.url(options),
    method: 'get',
})

createCardd164dc48c601e24bc6fe3d8074750b33.definition = {
    methods: ["get","head"],
    url: '/business-cards/builder',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
createCardd164dc48c601e24bc6fe3d8074750b33.url = (options?: RouteQueryOptions) => {
    return createCardd164dc48c601e24bc6fe3d8074750b33.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
createCardd164dc48c601e24bc6fe3d8074750b33.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createCardd164dc48c601e24bc6fe3d8074750b33.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
createCardd164dc48c601e24bc6fe3d8074750b33.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createCardd164dc48c601e24bc6fe3d8074750b33.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
    const createCardd164dc48c601e24bc6fe3d8074750b33Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createCardd164dc48c601e24bc6fe3d8074750b33.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
        createCardd164dc48c601e24bc6fe3d8074750b33Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createCardd164dc48c601e24bc6fe3d8074750b33.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::createCard
 * @see app/Http/Controllers/Customer/BusinessCardController.php:39
 * @route '/business-cards/builder'
 */
        createCardd164dc48c601e24bc6fe3d8074750b33Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createCardd164dc48c601e24bc6fe3d8074750b33.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createCardd164dc48c601e24bc6fe3d8074750b33.form = createCardd164dc48c601e24bc6fe3d8074750b33Form

/**
* Multiple routes resolve to \App\Http\Controllers\Customer\BusinessCardController::createCard, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `createCard['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const createCard = {
    '/create-visiting-card': createCard406ea3c77c01be6d8744815edae48faa,
    '/business-cards/builder': createCardd164dc48c601e24bc6fe3d8074750b33,
}

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
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:22
 * @route '/customer/business-cards'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customer/business-cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:22
 * @route '/customer/business-cards'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:22
 * @route '/customer/business-cards'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:22
 * @route '/customer/business-cards'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:22
 * @route '/customer/business-cards'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:22
 * @route '/customer/business-cards'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:22
 * @route '/customer/business-cards'
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
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/customer/business-cards/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customer/business-cards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
export const show = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/customer/business-cards/{business_card}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
show.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
show.get = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
show.head = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
    const showForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
        showForm.get = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
        showForm.head = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}/edit'
 */
export const edit = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/customer/business-cards/{business_card}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}/edit'
 */
edit.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}/edit'
 */
edit.get = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}/edit'
 */
edit.head = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}/edit'
 */
    const editForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}/edit'
 */
        editForm.get = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}/edit'
 */
        editForm.head = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:106
 * @route '/customer/business-cards/{business_card}'
 */
export const update = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/customer/business-cards/{business_card}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:106
 * @route '/customer/business-cards/{business_card}'
 */
update.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:106
 * @route '/customer/business-cards/{business_card}'
 */
update.put = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:106
 * @route '/customer/business-cards/{business_card}'
 */
update.patch = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:106
 * @route '/customer/business-cards/{business_card}'
 */
    const updateForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:106
 * @route '/customer/business-cards/{business_card}'
 */
        updateForm.put = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:106
 * @route '/customer/business-cards/{business_card}'
 */
        updateForm.patch = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:140
 * @route '/customer/business-cards/{business_card}'
 */
export const destroy = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customer/business-cards/{business_card}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:140
 * @route '/customer/business-cards/{business_card}'
 */
destroy.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:140
 * @route '/customer/business-cards/{business_card}'
 */
destroy.delete = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:140
 * @route '/customer/business-cards/{business_card}'
 */
    const destroyForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:140
 * @route '/customer/business-cards/{business_card}'
 */
        destroyForm.delete = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:154
 * @route '/customer/business-card-plans'
 */
export const getPlans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPlans.url(options),
    method: 'get',
})

getPlans.definition = {
    methods: ["get","head"],
    url: '/customer/business-card-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:154
 * @route '/customer/business-card-plans'
 */
getPlans.url = (options?: RouteQueryOptions) => {
    return getPlans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:154
 * @route '/customer/business-card-plans'
 */
getPlans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPlans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:154
 * @route '/customer/business-card-plans'
 */
getPlans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPlans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:154
 * @route '/customer/business-card-plans'
 */
    const getPlansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPlans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:154
 * @route '/customer/business-card-plans'
 */
        getPlansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPlans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:154
 * @route '/customer/business-card-plans'
 */
        getPlansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPlans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPlans.form = getPlansForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:166
 * @route '/customer/business-cards/draft-create'
 */
export const draftCreate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draftCreate.url(options),
    method: 'post',
})

draftCreate.definition = {
    methods: ["post"],
    url: '/customer/business-cards/draft-create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:166
 * @route '/customer/business-cards/draft-create'
 */
draftCreate.url = (options?: RouteQueryOptions) => {
    return draftCreate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:166
 * @route '/customer/business-cards/draft-create'
 */
draftCreate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draftCreate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:166
 * @route '/customer/business-cards/draft-create'
 */
    const draftCreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: draftCreate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:166
 * @route '/customer/business-cards/draft-create'
 */
        draftCreateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: draftCreate.url(options),
            method: 'post',
        })
    
    draftCreate.form = draftCreateForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:215
 * @route '/customer/business-cards/{business_card}/create-order'
 */
export const payOrder = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payOrder.url(args, options),
    method: 'post',
})

payOrder.definition = {
    methods: ["post"],
    url: '/customer/business-cards/{business_card}/create-order',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:215
 * @route '/customer/business-cards/{business_card}/create-order'
 */
payOrder.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return payOrder.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:215
 * @route '/customer/business-cards/{business_card}/create-order'
 */
payOrder.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:215
 * @route '/customer/business-cards/{business_card}/create-order'
 */
    const payOrderForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: payOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:215
 * @route '/customer/business-cards/{business_card}/create-order'
 */
        payOrderForm.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: payOrder.url(args, options),
            method: 'post',
        })
    
    payOrder.form = payOrderForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:285
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
export const verifyCardPayment = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyCardPayment.url(args, options),
    method: 'post',
})

verifyCardPayment.definition = {
    methods: ["post"],
    url: '/customer/business-cards/{business_card}/verify-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:285
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
verifyCardPayment.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return verifyCardPayment.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:285
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
verifyCardPayment.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyCardPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:285
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
    const verifyCardPaymentForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyCardPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:285
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
        verifyCardPaymentForm.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyCardPayment.url(args, options),
            method: 'post',
        })
    
    verifyCardPayment.form = verifyCardPaymentForm
const BusinessCardController = { createCard, checkout, verifyCheckout, quickLogin, index, create, store, show, edit, update, destroy, getPlans, draftCreate, payOrder, verifyCardPayment }

export default BusinessCardController