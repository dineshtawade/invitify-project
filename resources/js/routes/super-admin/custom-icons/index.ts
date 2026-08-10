import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::store
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:16
 * @route '/super-admin/custom-icons'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/super-admin/custom-icons',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::store
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:16
 * @route '/super-admin/custom-icons'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::store
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:16
 * @route '/super-admin/custom-icons'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::store
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:16
 * @route '/super-admin/custom-icons'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::store
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:16
 * @route '/super-admin/custom-icons'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:45
 * @route '/super-admin/custom-icons/{customIcon}'
 */
export const destroy = (args: { customIcon: number | { id: number } } | [customIcon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/super-admin/custom-icons/{customIcon}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:45
 * @route '/super-admin/custom-icons/{customIcon}'
 */
destroy.url = (args: { customIcon: number | { id: number } } | [customIcon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customIcon: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { customIcon: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    customIcon: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customIcon: typeof args.customIcon === 'object'
                ? args.customIcon.id
                : args.customIcon,
                }

    return destroy.definition.url
            .replace('{customIcon}', parsedArgs.customIcon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:45
 * @route '/super-admin/custom-icons/{customIcon}'
 */
destroy.delete = (args: { customIcon: number | { id: number } } | [customIcon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:45
 * @route '/super-admin/custom-icons/{customIcon}'
 */
    const destroyForm = (args: { customIcon: number | { id: number } } | [customIcon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomIconController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomIconController.php:45
 * @route '/super-admin/custom-icons/{customIcon}'
 */
        destroyForm.delete = (args: { customIcon: number | { id: number } } | [customIcon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const customIcons = {
    store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default customIcons