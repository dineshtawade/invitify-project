import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:91
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:91
 * @route '/mini-websites/quick-checkout-auth'
 */
quickAuth.url = (options?: RouteQueryOptions) => {
    return quickAuth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:91
 * @route '/mini-websites/quick-checkout-auth'
 */
quickAuth.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickAuth.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:91
 * @route '/mini-websites/quick-checkout-auth'
 */
    const quickAuthForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: quickAuth.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:91
 * @route '/mini-websites/quick-checkout-auth'
 */
        quickAuthForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: quickAuth.url(options),
            method: 'post',
        })
    
    quickAuth.form = quickAuthForm
const miniWebsites = {
    guestBuilder: Object.assign(guestBuilder, guestBuilder),
quickAuth: Object.assign(quickAuth, quickAuth),
}

export default miniWebsites