import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\TemplateController::saveDraft
 * @see app/Http/Controllers/Reseller/TemplateController.php:40
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
 * @see app/Http/Controllers/Reseller/TemplateController.php:40
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
 * @see app/Http/Controllers/Reseller/TemplateController.php:40
 * @route '/reseller/user-templates/{userTemplate}/save-draft'
 */
saveDraft.put = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: saveDraft.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::saveDraft
 * @see app/Http/Controllers/Reseller/TemplateController.php:40
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
 * @see app/Http/Controllers/Reseller/TemplateController.php:40
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
 * @see app/Http/Controllers/Reseller/TemplateController.php:60
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
 * @see app/Http/Controllers/Reseller/TemplateController.php:60
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
 * @see app/Http/Controllers/Reseller/TemplateController.php:60
 * @route '/reseller/user-templates/{userTemplate}/purchase'
 */
purchase.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchase.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::purchase
 * @see app/Http/Controllers/Reseller/TemplateController.php:60
 * @route '/reseller/user-templates/{userTemplate}/purchase'
 */
    const purchaseForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purchase.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::purchase
 * @see app/Http/Controllers/Reseller/TemplateController.php:60
 * @route '/reseller/user-templates/{userTemplate}/purchase'
 */
        purchaseForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purchase.url(args, options),
            method: 'post',
        })
    
    purchase.form = purchaseForm
/**
* @see \App\Http\Controllers\Reseller\TemplateController::uploadVideo
 * @see app/Http/Controllers/Reseller/TemplateController.php:110
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
 * @see app/Http/Controllers/Reseller/TemplateController.php:110
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
 * @see app/Http/Controllers/Reseller/TemplateController.php:110
 * @route '/reseller/user-templates/{userTemplate}/upload-video'
 */
uploadVideo.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadVideo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::uploadVideo
 * @see app/Http/Controllers/Reseller/TemplateController.php:110
 * @route '/reseller/user-templates/{userTemplate}/upload-video'
 */
    const uploadVideoForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadVideo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::uploadVideo
 * @see app/Http/Controllers/Reseller/TemplateController.php:110
 * @route '/reseller/user-templates/{userTemplate}/upload-video'
 */
        uploadVideoForm.post = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadVideo.url(args, options),
            method: 'post',
        })
    
    uploadVideo.form = uploadVideoForm
const userTemplates = {
    saveDraft: Object.assign(saveDraft, saveDraft),
purchase: Object.assign(purchase, purchase),
uploadVideo: Object.assign(uploadVideo, uploadVideo),
}

export default userTemplates