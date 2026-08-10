import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\TemplateController::saveDraft
 * @see app/Http/Controllers/Customer/TemplateController.php:106
 * @route '/customer/user-templates/{userTemplate}/save-draft'
 */
export const saveDraft = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: saveDraft.url(args, options),
    method: 'put',
})

saveDraft.definition = {
    methods: ["put"],
    url: '/customer/user-templates/{userTemplate}/save-draft',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::saveDraft
 * @see app/Http/Controllers/Customer/TemplateController.php:106
 * @route '/customer/user-templates/{userTemplate}/save-draft'
 */
saveDraft.url = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { userTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    userTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userTemplate: typeof args.userTemplate === 'object'
                ? args.userTemplate.id
                : args.userTemplate,
                }

    return saveDraft.definition.url
            .replace('{userTemplate}', parsedArgs.userTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::saveDraft
 * @see app/Http/Controllers/Customer/TemplateController.php:106
 * @route '/customer/user-templates/{userTemplate}/save-draft'
 */
saveDraft.put = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: saveDraft.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::saveDraft
 * @see app/Http/Controllers/Customer/TemplateController.php:106
 * @route '/customer/user-templates/{userTemplate}/save-draft'
 */
    const saveDraftForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveDraft.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::saveDraft
 * @see app/Http/Controllers/Customer/TemplateController.php:106
 * @route '/customer/user-templates/{userTemplate}/save-draft'
 */
        saveDraftForm.put = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveDraft.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    saveDraft.form = saveDraftForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::purchase
 * @see app/Http/Controllers/Customer/TemplateController.php:160
 * @route '/customer/user-templates/{userTemplate}/purchase'
 */
export const purchase = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchase.url(args, options),
    method: 'post',
})

purchase.definition = {
    methods: ["post"],
    url: '/customer/user-templates/{userTemplate}/purchase',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::purchase
 * @see app/Http/Controllers/Customer/TemplateController.php:160
 * @route '/customer/user-templates/{userTemplate}/purchase'
 */
purchase.url = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { userTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    userTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userTemplate: typeof args.userTemplate === 'object'
                ? args.userTemplate.id
                : args.userTemplate,
                }

    return purchase.definition.url
            .replace('{userTemplate}', parsedArgs.userTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::purchase
 * @see app/Http/Controllers/Customer/TemplateController.php:160
 * @route '/customer/user-templates/{userTemplate}/purchase'
 */
purchase.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchase.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::purchase
 * @see app/Http/Controllers/Customer/TemplateController.php:160
 * @route '/customer/user-templates/{userTemplate}/purchase'
 */
    const purchaseForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purchase.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::purchase
 * @see app/Http/Controllers/Customer/TemplateController.php:160
 * @route '/customer/user-templates/{userTemplate}/purchase'
 */
        purchaseForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purchase.url(args, options),
            method: 'post',
        })
    
    purchase.form = purchaseForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::uploadVideo
 * @see app/Http/Controllers/Customer/TemplateController.php:126
 * @route '/customer/user-templates/{userTemplate}/upload-video'
 */
export const uploadVideo = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadVideo.url(args, options),
    method: 'post',
})

uploadVideo.definition = {
    methods: ["post"],
    url: '/customer/user-templates/{userTemplate}/upload-video',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::uploadVideo
 * @see app/Http/Controllers/Customer/TemplateController.php:126
 * @route '/customer/user-templates/{userTemplate}/upload-video'
 */
uploadVideo.url = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { userTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    userTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userTemplate: typeof args.userTemplate === 'object'
                ? args.userTemplate.id
                : args.userTemplate,
                }

    return uploadVideo.definition.url
            .replace('{userTemplate}', parsedArgs.userTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::uploadVideo
 * @see app/Http/Controllers/Customer/TemplateController.php:126
 * @route '/customer/user-templates/{userTemplate}/upload-video'
 */
uploadVideo.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadVideo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::uploadVideo
 * @see app/Http/Controllers/Customer/TemplateController.php:126
 * @route '/customer/user-templates/{userTemplate}/upload-video'
 */
    const uploadVideoForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadVideo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::uploadVideo
 * @see app/Http/Controllers/Customer/TemplateController.php:126
 * @route '/customer/user-templates/{userTemplate}/upload-video'
 */
        uploadVideoForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadVideo.url(args, options),
            method: 'post',
        })
    
    uploadVideo.form = uploadVideoForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::createOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:312
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
export const createOrder = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createOrder.url(args, options),
    method: 'post',
})

createOrder.definition = {
    methods: ["post"],
    url: '/customer/user-templates/{userTemplate}/create-order',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::createOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:312
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
createOrder.url = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { userTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    userTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userTemplate: typeof args.userTemplate === 'object'
                ? args.userTemplate.id
                : args.userTemplate,
                }

    return createOrder.definition.url
            .replace('{userTemplate}', parsedArgs.userTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::createOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:312
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
createOrder.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::createOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:312
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
    const createOrderForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::createOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:312
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
        createOrderForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createOrder.url(args, options),
            method: 'post',
        })
    
    createOrder.form = createOrderForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:475
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
export const verifyPayment = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(args, options),
    method: 'post',
})

verifyPayment.definition = {
    methods: ["post"],
    url: '/customer/user-templates/{userTemplate}/verify-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:475
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
verifyPayment.url = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { userTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    userTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userTemplate: typeof args.userTemplate === 'object'
                ? args.userTemplate.id
                : args.userTemplate,
                }

    return verifyPayment.definition.url
            .replace('{userTemplate}', parsedArgs.userTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:475
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
verifyPayment.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::verifyPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:475
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
    const verifyPaymentForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::verifyPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:475
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
        verifyPaymentForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyPayment.url(args, options),
            method: 'post',
        })
    
    verifyPayment.form = verifyPaymentForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:176
 * @route '/customer/user-templates/claim'
 */
export const claim = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(options),
    method: 'post',
})

claim.definition = {
    methods: ["post"],
    url: '/customer/user-templates/claim',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:176
 * @route '/customer/user-templates/claim'
 */
claim.url = (options?: RouteQueryOptions) => {
    return claim.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:176
 * @route '/customer/user-templates/claim'
 */
claim.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:176
 * @route '/customer/user-templates/claim'
 */
    const claimForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: claim.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:176
 * @route '/customer/user-templates/claim'
 */
        claimForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: claim.url(options),
            method: 'post',
        })
    
    claim.form = claimForm
const userTemplates = {
    saveDraft: Object.assign(saveDraft, saveDraft),
purchase: Object.assign(purchase, purchase),
uploadVideo: Object.assign(uploadVideo, uploadVideo),
createOrder: Object.assign(createOrder, createOrder),
verifyPayment: Object.assign(verifyPayment, verifyPayment),
claim: Object.assign(claim, claim),
}

export default userTemplates