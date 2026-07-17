import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\PublicCardController::submitFeedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
export const submitFeedback = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitFeedback.url(args, options),
    method: 'post',
})

submitFeedback.definition = {
    methods: ["post"],
    url: '/card/{slug}/feedback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicCardController::submitFeedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
submitFeedback.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return submitFeedback.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicCardController::submitFeedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
submitFeedback.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitFeedback.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PublicCardController::submitFeedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
    const submitFeedbackForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitFeedback.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PublicCardController::submitFeedback
 * @see app/Http/Controllers/PublicCardController.php:26
 * @route '/card/{slug}/feedback'
 */
        submitFeedbackForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitFeedback.url(args, options),
            method: 'post',
        })
    
    submitFeedback.form = submitFeedbackForm
/**
* @see \App\Http\Controllers\PublicCardController::downloadVcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
export const downloadVcard = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadVcard.url(args, options),
    method: 'get',
})

downloadVcard.definition = {
    methods: ["get","head"],
    url: '/card/{slug}/vcard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicCardController::downloadVcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
downloadVcard.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return downloadVcard.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicCardController::downloadVcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
downloadVcard.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadVcard.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicCardController::downloadVcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
downloadVcard.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadVcard.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicCardController::downloadVcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
    const downloadVcardForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadVcard.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicCardController::downloadVcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
        downloadVcardForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadVcard.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicCardController::downloadVcard
 * @see app/Http/Controllers/PublicCardController.php:50
 * @route '/card/{slug}/vcard'
 */
        downloadVcardForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadVcard.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadVcard.form = downloadVcardForm
const PublicCardController = { show, submitFeedback, downloadVcard }

export default PublicCardController