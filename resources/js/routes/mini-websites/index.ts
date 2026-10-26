import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::templatePreview
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
export const templatePreview = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templatePreview.url(args, options),
    method: 'get',
})

templatePreview.definition = {
    methods: ["get","head"],
    url: '/mini-websites/template-preview/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::templatePreview
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
templatePreview.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return templatePreview.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::templatePreview
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
templatePreview.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templatePreview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::templatePreview
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
templatePreview.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: templatePreview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::templatePreview
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
    const templatePreviewForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: templatePreview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::templatePreview
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
        templatePreviewForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: templatePreview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::templatePreview
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
        templatePreviewForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: templatePreview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    templatePreview.form = templatePreviewForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::guestBuilder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
export const guestBuilder = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guestBuilder.url(options),
    method: 'get',
})

guestBuilder.definition = {
    methods: ["get","head"],
    url: '/create-invitation-website',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::guestBuilder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
guestBuilder.url = (options?: RouteQueryOptions) => {
    return guestBuilder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::guestBuilder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
guestBuilder.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guestBuilder.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::guestBuilder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
guestBuilder.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guestBuilder.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::guestBuilder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
    const guestBuilderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: guestBuilder.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::guestBuilder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
        guestBuilderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: guestBuilder.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::guestBuilder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
        guestBuilderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: guestBuilder.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    guestBuilder.form = guestBuilderForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
export const quickAuth = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickAuth.url(options),
    method: 'post',
})

quickAuth.definition = {
    methods: ["post"],
    url: '/mini-websites/quick-checkout-auth',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
quickAuth.url = (options?: RouteQueryOptions) => {
    return quickAuth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
quickAuth.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickAuth.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
    const quickAuthForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: quickAuth.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
        quickAuthForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: quickAuth.url(options),
            method: 'post',
        })
    
    quickAuth.form = quickAuthForm
const miniWebsites = {
    templatePreview: Object.assign(templatePreview, templatePreview),
guestBuilder: Object.assign(guestBuilder, guestBuilder),
quickAuth: Object.assign(quickAuth, quickAuth),
}

export default miniWebsites