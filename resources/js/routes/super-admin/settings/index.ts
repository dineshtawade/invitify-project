import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::update
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:27
 * @route '/super-admin/settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/super-admin/settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::update
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:27
 * @route '/super-admin/settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::update
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:27
 * @route '/super-admin/settings'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::update
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:27
 * @route '/super-admin/settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::update
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:27
 * @route '/super-admin/settings'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::destroy
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:40
 * @route '/super-admin/settings/{key}'
 */
export const destroy = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/super-admin/settings/{key}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::destroy
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:40
 * @route '/super-admin/settings/{key}'
 */
destroy.url = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { key: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    key: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        key: args.key,
                }

    return destroy.definition.url
            .replace('{key}', parsedArgs.key.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::destroy
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:40
 * @route '/super-admin/settings/{key}'
 */
destroy.delete = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::destroy
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:40
 * @route '/super-admin/settings/{key}'
 */
    const destroyForm = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::destroy
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:40
 * @route '/super-admin/settings/{key}'
 */
        destroyForm.delete = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const settings = {
    update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default settings