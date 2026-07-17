import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{template}/customize'
 */
export const customize = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(args, options),
    method: 'get',
})

customize.definition = {
    methods: ["get","head"],
    url: '/reseller/templates/{template}/customize',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{template}/customize'
 */
customize.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return customize.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{template}/customize'
 */
customize.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{template}/customize'
 */
customize.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customize.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{template}/customize'
 */
    const customizeForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: customize.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{template}/customize'
 */
        customizeForm.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customize.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\TemplateController::customize
 * @see app/Http/Controllers/Reseller/TemplateController.php:18
 * @route '/reseller/templates/{template}/customize'
 */
        customizeForm.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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