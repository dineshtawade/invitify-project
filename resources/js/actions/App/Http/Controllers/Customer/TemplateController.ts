import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\TemplateController::edit
 * @see app/Http/Controllers/Customer/TemplateController.php:57
 * @route '/templates/{encryptedId}/customize'
 */
export const edit = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/templates/{encryptedId}/customize',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::edit
 * @see app/Http/Controllers/Customer/TemplateController.php:57
 * @route '/templates/{encryptedId}/customize'
 */
edit.url = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { encryptedId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    encryptedId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        encryptedId: args.encryptedId,
                }

    return edit.definition.url
            .replace('{encryptedId}', parsedArgs.encryptedId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::edit
 * @see app/Http/Controllers/Customer/TemplateController.php:57
 * @route '/templates/{encryptedId}/customize'
 */
edit.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::edit
 * @see app/Http/Controllers/Customer/TemplateController.php:57
 * @route '/templates/{encryptedId}/customize'
 */
edit.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::edit
 * @see app/Http/Controllers/Customer/TemplateController.php:57
 * @route '/templates/{encryptedId}/customize'
 */
    const editForm = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::edit
 * @see app/Http/Controllers/Customer/TemplateController.php:57
 * @route '/templates/{encryptedId}/customize'
 */
        editForm.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::edit
 * @see app/Http/Controllers/Customer/TemplateController.php:57
 * @route '/templates/{encryptedId}/customize'
 */
        editForm.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Customer\TemplateController::viewShared
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
export const viewShared = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewShared.url(args, options),
    method: 'get',
})

viewShared.definition = {
    methods: ["get","head"],
    url: '/invitations/view/{encryptedId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::viewShared
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
viewShared.url = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { encryptedId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    encryptedId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        encryptedId: args.encryptedId,
                }

    return viewShared.definition.url
            .replace('{encryptedId}', parsedArgs.encryptedId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::viewShared
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
viewShared.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewShared.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::viewShared
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
viewShared.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: viewShared.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::viewShared
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
    const viewSharedForm = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: viewShared.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::viewShared
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
        viewSharedForm.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: viewShared.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::viewShared
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
        viewSharedForm.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: viewShared.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    viewShared.form = viewSharedForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::index
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customer/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::index
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::index
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::index
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::index
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::index
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::index
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
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
* @see \App\Http\Controllers\Customer\TemplateController::saveDraft
 * @see app/Http/Controllers/Customer/TemplateController.php:114
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
 * @see app/Http/Controllers/Customer/TemplateController.php:114
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
 * @see app/Http/Controllers/Customer/TemplateController.php:114
 * @route '/customer/user-templates/{userTemplate}/save-draft'
 */
saveDraft.put = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: saveDraft.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::saveDraft
 * @see app/Http/Controllers/Customer/TemplateController.php:114
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
 * @see app/Http/Controllers/Customer/TemplateController.php:114
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
 * @see app/Http/Controllers/Customer/TemplateController.php:168
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
 * @see app/Http/Controllers/Customer/TemplateController.php:168
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
 * @see app/Http/Controllers/Customer/TemplateController.php:168
 * @route '/customer/user-templates/{userTemplate}/purchase'
 */
purchase.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchase.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::purchase
 * @see app/Http/Controllers/Customer/TemplateController.php:168
 * @route '/customer/user-templates/{userTemplate}/purchase'
 */
    const purchaseForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purchase.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::purchase
 * @see app/Http/Controllers/Customer/TemplateController.php:168
 * @route '/customer/user-templates/{userTemplate}/purchase'
 */
        purchaseForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purchase.url(args, options),
            method: 'post',
        })
    
    purchase.form = purchaseForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::uploadVideo
 * @see app/Http/Controllers/Customer/TemplateController.php:134
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
 * @see app/Http/Controllers/Customer/TemplateController.php:134
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
 * @see app/Http/Controllers/Customer/TemplateController.php:134
 * @route '/customer/user-templates/{userTemplate}/upload-video'
 */
uploadVideo.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadVideo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::uploadVideo
 * @see app/Http/Controllers/Customer/TemplateController.php:134
 * @route '/customer/user-templates/{userTemplate}/upload-video'
 */
    const uploadVideoForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadVideo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::uploadVideo
 * @see app/Http/Controllers/Customer/TemplateController.php:134
 * @route '/customer/user-templates/{userTemplate}/upload-video'
 */
        uploadVideoForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadVideo.url(args, options),
            method: 'post',
        })
    
    uploadVideo.form = uploadVideoForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::createRazorpayOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:328
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
export const createRazorpayOrder = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRazorpayOrder.url(args, options),
    method: 'post',
})

createRazorpayOrder.definition = {
    methods: ["post"],
    url: '/customer/user-templates/{userTemplate}/create-order',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::createRazorpayOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:328
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
createRazorpayOrder.url = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return createRazorpayOrder.definition.url
            .replace('{userTemplate}', parsedArgs.userTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::createRazorpayOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:328
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
createRazorpayOrder.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRazorpayOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::createRazorpayOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:328
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
    const createRazorpayOrderForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createRazorpayOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::createRazorpayOrder
 * @see app/Http/Controllers/Customer/TemplateController.php:328
 * @route '/customer/user-templates/{userTemplate}/create-order'
 */
        createRazorpayOrderForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createRazorpayOrder.url(args, options),
            method: 'post',
        })
    
    createRazorpayOrder.form = createRazorpayOrderForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyRazorpayPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:491
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
export const verifyRazorpayPayment = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyRazorpayPayment.url(args, options),
    method: 'post',
})

verifyRazorpayPayment.definition = {
    methods: ["post"],
    url: '/customer/user-templates/{userTemplate}/verify-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyRazorpayPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:491
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
verifyRazorpayPayment.url = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return verifyRazorpayPayment.definition.url
            .replace('{userTemplate}', parsedArgs.userTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyRazorpayPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:491
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
verifyRazorpayPayment.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyRazorpayPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::verifyRazorpayPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:491
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
    const verifyRazorpayPaymentForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyRazorpayPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::verifyRazorpayPayment
 * @see app/Http/Controllers/Customer/TemplateController.php:491
 * @route '/customer/user-templates/{userTemplate}/verify-payment'
 */
        verifyRazorpayPaymentForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyRazorpayPayment.url(args, options),
            method: 'post',
        })
    
    verifyRazorpayPayment.form = verifyRazorpayPaymentForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:270
 * @route '/customer/templates/{template}/verify-referral'
 */
export const verifyReferral = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyReferral.url(args, options),
    method: 'post',
})

verifyReferral.definition = {
    methods: ["post"],
    url: '/customer/templates/{template}/verify-referral',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:270
 * @route '/customer/templates/{template}/verify-referral'
 */
verifyReferral.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return verifyReferral.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:270
 * @route '/customer/templates/{template}/verify-referral'
 */
verifyReferral.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyReferral.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:270
 * @route '/customer/templates/{template}/verify-referral'
 */
    const verifyReferralForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyReferral.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:270
 * @route '/customer/templates/{template}/verify-referral'
 */
        verifyReferralForm.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyReferral.url(args, options),
            method: 'post',
        })
    
    verifyReferral.form = verifyReferralForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:184
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
 * @see app/Http/Controllers/Customer/TemplateController.php:184
 * @route '/customer/user-templates/claim'
 */
claim.url = (options?: RouteQueryOptions) => {
    return claim.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:184
 * @route '/customer/user-templates/claim'
 */
claim.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:184
 * @route '/customer/user-templates/claim'
 */
    const claimForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: claim.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::claim
 * @see app/Http/Controllers/Customer/TemplateController.php:184
 * @route '/customer/user-templates/claim'
 */
        claimForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: claim.url(options),
            method: 'post',
        })
    
    claim.form = claimForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::purchased
 * @see app/Http/Controllers/Customer/TemplateController.php:206
 * @route '/customer/my-invitations'
 */
export const purchased = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: purchased.url(options),
    method: 'get',
})

purchased.definition = {
    methods: ["get","head"],
    url: '/customer/my-invitations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::purchased
 * @see app/Http/Controllers/Customer/TemplateController.php:206
 * @route '/customer/my-invitations'
 */
purchased.url = (options?: RouteQueryOptions) => {
    return purchased.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::purchased
 * @see app/Http/Controllers/Customer/TemplateController.php:206
 * @route '/customer/my-invitations'
 */
purchased.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: purchased.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::purchased
 * @see app/Http/Controllers/Customer/TemplateController.php:206
 * @route '/customer/my-invitations'
 */
purchased.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: purchased.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::purchased
 * @see app/Http/Controllers/Customer/TemplateController.php:206
 * @route '/customer/my-invitations'
 */
    const purchasedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: purchased.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::purchased
 * @see app/Http/Controllers/Customer/TemplateController.php:206
 * @route '/customer/my-invitations'
 */
        purchasedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: purchased.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::purchased
 * @see app/Http/Controllers/Customer/TemplateController.php:206
 * @route '/customer/my-invitations'
 */
        purchasedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: purchased.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    purchased.form = purchasedForm
const TemplateController = { edit, viewShared, index, saveDraft, purchase, uploadVideo, createRazorpayOrder, verifyRazorpayPayment, verifyReferral, claim, purchased }

export default TemplateController