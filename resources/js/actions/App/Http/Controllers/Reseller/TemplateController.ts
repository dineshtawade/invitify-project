import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\TemplateController::edit
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
export const edit = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/reseller/templates/{encryptedId}/customize',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\TemplateController::edit
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
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
* @see \App\Http\Controllers\Reseller\TemplateController::edit
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
edit.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\TemplateController::edit
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
edit.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::edit
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
    const editForm = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::edit
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
        editForm.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\TemplateController::edit
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
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
* @see \App\Http\Controllers\Reseller\TemplateController::saveDraft
 * @see app/Http/Controllers/Reseller/TemplateController.php:47
 * @route '/reseller/user-templates/{userTemplate}/save-draft'
 */
export const saveDraft = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: saveDraft.url(args, options),
    method: 'put',
})

saveDraft.definition = {
    methods: ["put"],
    url: '/reseller/user-templates/{userTemplate}/save-draft',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Reseller\TemplateController::saveDraft
 * @see app/Http/Controllers/Reseller/TemplateController.php:47
 * @route '/reseller/user-templates/{userTemplate}/save-draft'
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
* @see \App\Http\Controllers\Reseller\TemplateController::saveDraft
 * @see app/Http/Controllers/Reseller/TemplateController.php:47
 * @route '/reseller/user-templates/{userTemplate}/save-draft'
 */
saveDraft.put = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: saveDraft.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::saveDraft
 * @see app/Http/Controllers/Reseller/TemplateController.php:47
 * @route '/reseller/user-templates/{userTemplate}/save-draft'
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
* @see \App\Http\Controllers\Reseller\TemplateController::saveDraft
 * @see app/Http/Controllers/Reseller/TemplateController.php:47
 * @route '/reseller/user-templates/{userTemplate}/save-draft'
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
* @see \App\Http\Controllers\Reseller\TemplateController::purchase
 * @see app/Http/Controllers/Reseller/TemplateController.php:67
 * @route '/reseller/user-templates/{userTemplate}/purchase'
 */
export const purchase = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchase.url(args, options),
    method: 'post',
})

purchase.definition = {
    methods: ["post"],
    url: '/reseller/user-templates/{userTemplate}/purchase',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\TemplateController::purchase
 * @see app/Http/Controllers/Reseller/TemplateController.php:67
 * @route '/reseller/user-templates/{userTemplate}/purchase'
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
* @see \App\Http\Controllers\Reseller\TemplateController::purchase
 * @see app/Http/Controllers/Reseller/TemplateController.php:67
 * @route '/reseller/user-templates/{userTemplate}/purchase'
 */
purchase.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchase.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::purchase
 * @see app/Http/Controllers/Reseller/TemplateController.php:67
 * @route '/reseller/user-templates/{userTemplate}/purchase'
 */
    const purchaseForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purchase.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::purchase
 * @see app/Http/Controllers/Reseller/TemplateController.php:67
 * @route '/reseller/user-templates/{userTemplate}/purchase'
 */
        purchaseForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purchase.url(args, options),
            method: 'post',
        })
    
    purchase.form = purchaseForm
/**
* @see \App\Http\Controllers\Reseller\TemplateController::uploadVideo
 * @see app/Http/Controllers/Reseller/TemplateController.php:117
 * @route '/reseller/user-templates/{userTemplate}/upload-video'
 */
export const uploadVideo = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadVideo.url(args, options),
    method: 'post',
})

uploadVideo.definition = {
    methods: ["post"],
    url: '/reseller/user-templates/{userTemplate}/upload-video',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\TemplateController::uploadVideo
 * @see app/Http/Controllers/Reseller/TemplateController.php:117
 * @route '/reseller/user-templates/{userTemplate}/upload-video'
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
* @see \App\Http\Controllers\Reseller\TemplateController::uploadVideo
 * @see app/Http/Controllers/Reseller/TemplateController.php:117
 * @route '/reseller/user-templates/{userTemplate}/upload-video'
 */
uploadVideo.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadVideo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::uploadVideo
 * @see app/Http/Controllers/Reseller/TemplateController.php:117
 * @route '/reseller/user-templates/{userTemplate}/upload-video'
 */
    const uploadVideoForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadVideo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::uploadVideo
 * @see app/Http/Controllers/Reseller/TemplateController.php:117
 * @route '/reseller/user-templates/{userTemplate}/upload-video'
 */
        uploadVideoForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadVideo.url(args, options),
            method: 'post',
        })
    
    uploadVideo.form = uploadVideoForm
/**
* @see \App\Http\Controllers\Reseller\TemplateController::purchased
 * @see app/Http/Controllers/Reseller/TemplateController.php:150
 * @route '/reseller/my-invitations'
 */
export const purchased = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: purchased.url(options),
    method: 'get',
})

purchased.definition = {
    methods: ["get","head"],
    url: '/reseller/my-invitations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\TemplateController::purchased
 * @see app/Http/Controllers/Reseller/TemplateController.php:150
 * @route '/reseller/my-invitations'
 */
purchased.url = (options?: RouteQueryOptions) => {
    return purchased.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\TemplateController::purchased
 * @see app/Http/Controllers/Reseller/TemplateController.php:150
 * @route '/reseller/my-invitations'
 */
purchased.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: purchased.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\TemplateController::purchased
 * @see app/Http/Controllers/Reseller/TemplateController.php:150
 * @route '/reseller/my-invitations'
 */
purchased.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: purchased.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::purchased
 * @see app/Http/Controllers/Reseller/TemplateController.php:150
 * @route '/reseller/my-invitations'
 */
    const purchasedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: purchased.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::purchased
 * @see app/Http/Controllers/Reseller/TemplateController.php:150
 * @route '/reseller/my-invitations'
 */
        purchasedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: purchased.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\TemplateController::purchased
 * @see app/Http/Controllers/Reseller/TemplateController.php:150
 * @route '/reseller/my-invitations'
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
const TemplateController = { edit, saveDraft, purchase, uploadVideo, purchased }

export default TemplateController