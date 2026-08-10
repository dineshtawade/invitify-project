import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicSiteController::show
 * @see app/Http/Controllers/PublicSiteController.php:16
 * @route '/mini-website/{slug}/{page?}'
 */
export const show = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mini-website/{slug}/{page?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSiteController::show
 * @see app/Http/Controllers/PublicSiteController.php:16
 * @route '/mini-website/{slug}/{page?}'
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
* @see \App\Http\Controllers\PublicSiteController::show
 * @see app/Http/Controllers/PublicSiteController.php:16
 * @route '/mini-website/{slug}/{page?}'
 */
show.get = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicSiteController::show
 * @see app/Http/Controllers/PublicSiteController.php:16
 * @route '/mini-website/{slug}/{page?}'
 */
show.head = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicSiteController::show
 * @see app/Http/Controllers/PublicSiteController.php:16
 * @route '/mini-website/{slug}/{page?}'
 */
    const showForm = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicSiteController::show
 * @see app/Http/Controllers/PublicSiteController.php:16
 * @route '/mini-website/{slug}/{page?}'
 */
        showForm.get = (args: { slug: string | number, page?: string | number } | [slug: string | number, page: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicSiteController::show
 * @see app/Http/Controllers/PublicSiteController.php:16
 * @route '/mini-website/{slug}/{page?}'
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
* @see \App\Http\Controllers\PublicSiteController::rsvp
 * @see app/Http/Controllers/PublicSiteController.php:82
 * @route '/mini-website/{slug}/rsvp'
 */
export const rsvp = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rsvp.url(args, options),
    method: 'post',
})

rsvp.definition = {
    methods: ["post"],
    url: '/mini-website/{slug}/rsvp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicSiteController::rsvp
 * @see app/Http/Controllers/PublicSiteController.php:82
 * @route '/mini-website/{slug}/rsvp'
 */
rsvp.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rsvp.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSiteController::rsvp
 * @see app/Http/Controllers/PublicSiteController.php:82
 * @route '/mini-website/{slug}/rsvp'
 */
rsvp.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rsvp.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PublicSiteController::rsvp
 * @see app/Http/Controllers/PublicSiteController.php:82
 * @route '/mini-website/{slug}/rsvp'
 */
    const rsvpForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rsvp.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PublicSiteController::rsvp
 * @see app/Http/Controllers/PublicSiteController.php:82
 * @route '/mini-website/{slug}/rsvp'
 */
        rsvpForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rsvp.url(args, options),
            method: 'post',
        })
    
    rsvp.form = rsvpForm
/**
* @see \App\Http\Controllers\PublicSiteController::contact
 * @see app/Http/Controllers/PublicSiteController.php:102
 * @route '/mini-website/{slug}/contact'
 */
export const contact = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contact.url(args, options),
    method: 'post',
})

contact.definition = {
    methods: ["post"],
    url: '/mini-website/{slug}/contact',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicSiteController::contact
 * @see app/Http/Controllers/PublicSiteController.php:102
 * @route '/mini-website/{slug}/contact'
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
* @see \App\Http\Controllers\PublicSiteController::contact
 * @see app/Http/Controllers/PublicSiteController.php:102
 * @route '/mini-website/{slug}/contact'
 */
contact.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contact.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PublicSiteController::contact
 * @see app/Http/Controllers/PublicSiteController.php:102
 * @route '/mini-website/{slug}/contact'
 */
    const contactForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: contact.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PublicSiteController::contact
 * @see app/Http/Controllers/PublicSiteController.php:102
 * @route '/mini-website/{slug}/contact'
 */
        contactForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: contact.url(args, options),
            method: 'post',
        })
    
    contact.form = contactForm
const site = {
    show: Object.assign(show, show),
rsvp: Object.assign(rsvp, rsvp),
contact: Object.assign(contact, contact),
}

export default site