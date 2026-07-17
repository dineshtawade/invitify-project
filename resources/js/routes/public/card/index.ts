import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicCardController::show
 * @see app/Http/Controllers/PublicCardController.php:12
 * @route '/card/{slug}'
 */
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/card/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicCardController::show
 * @see app/Http/Controllers/PublicCardController.php:12
 * @route '/card/{slug}'
 */
show.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicCardController::show
 * @see app/Http/Controllers/PublicCardController.php:12
 * @route '/card/{slug}'
 */
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicCardController::show
 * @see app/Http/Controllers/PublicCardController.php:12
 * @route '/card/{slug}'
 */
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicCardController::show
 * @see app/Http/Controllers/PublicCardController.php:12
 * @route '/card/{slug}'
 */
    const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicCardController::show
 * @see app/Http/Controllers/PublicCardController.php:12
 * @route '/card/{slug}'
 */
        showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicCardController::show
 * @see app/Http/Controllers/PublicCardController.php:12
 * @route '/card/{slug}'
 */
        showForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PublicCardController::feedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
export const feedback = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feedback.url(args, options),
    method: 'post',
})

feedback.definition = {
    methods: ["post"],
    url: '/card/{slug}/feedback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicCardController::feedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
feedback.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return feedback.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicCardController::feedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
feedback.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feedback.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PublicCardController::feedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
    const feedbackForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: feedback.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PublicCardController::feedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
        feedbackForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: feedback.url(args, options),
            method: 'post',
        })
    
    feedback.form = feedbackForm
/**
* @see \App\Http\Controllers\PublicCardController::vcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
export const vcard = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vcard.url(args, options),
    method: 'get',
})

vcard.definition = {
    methods: ["get","head"],
    url: '/card/{slug}/vcard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicCardController::vcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
vcard.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return vcard.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicCardController::vcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
vcard.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vcard.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicCardController::vcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
vcard.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vcard.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicCardController::vcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
    const vcardForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vcard.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicCardController::vcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
        vcardForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vcard.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicCardController::vcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
        vcardForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vcard.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vcard.form = vcardForm
const card = {
    show: Object.assign(show, show),
feedback: Object.assign(feedback, feedback),
vcard: Object.assign(vcard, vcard),
}

export default card