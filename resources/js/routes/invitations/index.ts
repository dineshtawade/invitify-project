import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:242
 * @route '/invitations/view/{userTemplate}'
 */
export const view = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/invitations/view/{userTemplate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:242
 * @route '/invitations/view/{userTemplate}'
 */
view.url = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return view.definition.url
            .replace('{userTemplate}', parsedArgs.userTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:242
 * @route '/invitations/view/{userTemplate}'
 */
view.get = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:242
 * @route '/invitations/view/{userTemplate}'
 */
view.head = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:242
 * @route '/invitations/view/{userTemplate}'
 */
    const viewForm = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:242
 * @route '/invitations/view/{userTemplate}'
 */
        viewForm.get = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::view
 * @see app/Http/Controllers/Customer/TemplateController.php:242
 * @route '/invitations/view/{userTemplate}'
 */
        viewForm.head = (args: { userTemplate: number | { id: number } } | [userTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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