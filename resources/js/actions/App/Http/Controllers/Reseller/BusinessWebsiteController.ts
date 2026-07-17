import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:12
 * @route '/reseller/business-websites/{business_website}/edit'
 */
export const edit = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/reseller/business-websites/{business_website}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:12
 * @route '/reseller/business-websites/{business_website}/edit'
 */
edit.url = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { business_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    business_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_website: typeof args.business_website === 'object'
                ? args.business_website.id
                : args.business_website,
                }

    return edit.definition.url
            .replace('{business_website}', parsedArgs.business_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:12
 * @route '/reseller/business-websites/{business_website}/edit'
 */
edit.get = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:12
 * @route '/reseller/business-websites/{business_website}/edit'
 */
edit.head = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:12
 * @route '/reseller/business-websites/{business_website}/edit'
 */
    const editForm = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:12
 * @route '/reseller/business-websites/{business_website}/edit'
 */
        editForm.get = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:12
 * @route '/reseller/business-websites/{business_website}/edit'
 */
        editForm.head = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::update
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:42
 * @route '/reseller/business-websites/{business_website}'
 */
export const update = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/reseller/business-websites/{business_website}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::update
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:42
 * @route '/reseller/business-websites/{business_website}'
 */
update.url = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { business_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    business_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_website: typeof args.business_website === 'object'
                ? args.business_website.id
                : args.business_website,
                }

    return update.definition.url
            .replace('{business_website}', parsedArgs.business_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::update
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:42
 * @route '/reseller/business-websites/{business_website}'
 */
update.put = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::update
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:42
 * @route '/reseller/business-websites/{business_website}'
 */
    const updateForm = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::update
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:42
 * @route '/reseller/business-websites/{business_website}'
 */
        updateForm.put = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:62
 * @route '/reseller/business-websites/{business_website}'
 */
export const destroy = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/reseller/business-websites/{business_website}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:62
 * @route '/reseller/business-websites/{business_website}'
 */
destroy.url = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { business_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    business_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_website: typeof args.business_website === 'object'
                ? args.business_website.id
                : args.business_website,
                }

    return destroy.definition.url
            .replace('{business_website}', parsedArgs.business_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:62
 * @route '/reseller/business-websites/{business_website}'
 */
destroy.delete = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:62
 * @route '/reseller/business-websites/{business_website}'
 */
    const destroyForm = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/BusinessWebsiteController.php:62
 * @route '/reseller/business-websites/{business_website}'
 */
        destroyForm.delete = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const BusinessWebsiteController = { edit, update, destroy }

export default BusinessWebsiteController