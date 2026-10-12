import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
export const customize = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(args, options),
    method: 'get',
})

customize.definition = {
    methods: ["get","head"],
    url: '/reseller/templates/{encryptedId}/customize',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
customize.url = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return customize.definition.url
            .replace('{encryptedId}', parsedArgs.encryptedId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
customize.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
customize.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customize.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
    const customizeForm = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: customize.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
        customizeForm.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customize.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{encryptedId}/customize'
 */
        customizeForm.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customize.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    customize.form = customizeForm
const templates = {
    customize: Object.assign(customize, customize),
}

export default templates