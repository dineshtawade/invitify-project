import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
export const view = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/invitations/view/{encryptedId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
view.url = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return view.definition.url
            .replace('{encryptedId}', parsedArgs.encryptedId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
view.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
view.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
    const viewForm = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
        viewForm.get = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:251
 * @route '/invitations/view/{encryptedId}'
 */
        viewForm.head = (args: { encryptedId: string | number } | [encryptedId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm
const invitations = {
    view: Object.assign(view, view),
}

export default invitations