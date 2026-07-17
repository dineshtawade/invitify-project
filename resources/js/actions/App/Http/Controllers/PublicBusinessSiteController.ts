import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicBusinessSiteController::show
 * @see app/Http/Controllers/PublicBusinessSiteController.php:14
 * @route '/business/{slug}/{page?}'
 */
export const show = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/business/{slug}/{page?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicBusinessSiteController::show
 * @see app/Http/Controllers/PublicBusinessSiteController.php:14
 * @route '/business/{slug}/{page?}'
 */
show.url = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    slug: args[0],
                    page: args[1],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "page",
        ])

    const parsedArgs = {
                        slug: args.slug,
                                page: args.page,
                }

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{page?}', parsedArgs.page?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicBusinessSiteController::show
 * @see app/Http/Controllers/PublicBusinessSiteController.php:14
 * @route '/business/{slug}/{page?}'
 */
show.get = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicBusinessSiteController::show
 * @see app/Http/Controllers/PublicBusinessSiteController.php:14
 * @route '/business/{slug}/{page?}'
 */
show.head = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicBusinessSiteController::show
 * @see app/Http/Controllers/PublicBusinessSiteController.php:14
 * @route '/business/{slug}/{page?}'
 */
    const showForm = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicBusinessSiteController::show
 * @see app/Http/Controllers/PublicBusinessSiteController.php:14
 * @route '/business/{slug}/{page?}'
 */
        showForm.get = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicBusinessSiteController::show
 * @see app/Http/Controllers/PublicBusinessSiteController.php:14
 * @route '/business/{slug}/{page?}'
 */
        showForm.head = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PublicBusinessSiteController::contact
 * @see app/Http/Controllers/PublicBusinessSiteController.php:52
 * @route '/business/{slug}/contact'
 */
export const contact = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contact.url(args, options),
    method: 'post',
})

contact.definition = {
    methods: ["post"],
    url: '/business/{slug}/contact',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicBusinessSiteController::contact
 * @see app/Http/Controllers/PublicBusinessSiteController.php:52
 * @route '/business/{slug}/contact'
 */
contact.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    slug: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        slug: args.slug,
                }

    return contact.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicBusinessSiteController::contact
 * @see app/Http/Controllers/PublicBusinessSiteController.php:52
 * @route '/business/{slug}/contact'
 */
contact.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contact.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PublicBusinessSiteController::contact
 * @see app/Http/Controllers/PublicBusinessSiteController.php:52
 * @route '/business/{slug}/contact'
 */
    const contactForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: contact.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PublicBusinessSiteController::contact
 * @see app/Http/Controllers/PublicBusinessSiteController.php:52
 * @route '/business/{slug}/contact'
 */
        contactForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: contact.url(args, options),
            method: 'post',
        })
    
    contact.form = contactForm
const PublicBusinessSiteController = { show, contact }

export default PublicBusinessSiteController