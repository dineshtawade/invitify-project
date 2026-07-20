import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::index
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:15
 * @route '/super-admin/business-card-plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/business-card-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::index
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:15
 * @route '/super-admin/business-card-plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::index
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:15
 * @route '/super-admin/business-card-plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::index
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:15
 * @route '/super-admin/business-card-plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::index
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:15
 * @route '/super-admin/business-card-plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::index
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:15
 * @route '/super-admin/business-card-plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::index
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:15
 * @route '/super-admin/business-card-plans'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::store
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:33
 * @route '/super-admin/business-card-plans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/super-admin/business-card-plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::store
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:33
 * @route '/super-admin/business-card-plans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::store
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:33
 * @route '/super-admin/business-card-plans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::store
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:33
 * @route '/super-admin/business-card-plans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::store
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:33
 * @route '/super-admin/business-card-plans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::update
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:51
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
export const update = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/super-admin/business-card-plans/{businessCardPlan}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::update
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:51
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
update.url = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { businessCardPlan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { businessCardPlan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    businessCardPlan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        businessCardPlan: typeof args.businessCardPlan === 'object'
                ? args.businessCardPlan.id
                : args.businessCardPlan,
                }

    return update.definition.url
            .replace('{businessCardPlan}', parsedArgs.businessCardPlan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::update
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:51
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
update.put = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::update
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:51
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
    const updateForm = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::update
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:51
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
        updateForm.put = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::destroy
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:69
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
export const destroy = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/super-admin/business-card-plans/{businessCardPlan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::destroy
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:69
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
destroy.url = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { businessCardPlan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { businessCardPlan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    businessCardPlan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        businessCardPlan: typeof args.businessCardPlan === 'object'
                ? args.businessCardPlan.id
                : args.businessCardPlan,
                }

    return destroy.definition.url
            .replace('{businessCardPlan}', parsedArgs.businessCardPlan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::destroy
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:69
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
destroy.delete = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::destroy
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:69
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
    const destroyForm = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::destroy
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:69
 * @route '/super-admin/business-card-plans/{businessCardPlan}'
 */
        destroyForm.delete = (args: { businessCardPlan: number | { id: number } } | [businessCardPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::apiIndex
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:25
 * @route '/super-admin/business-card-plans/api'
 */
export const apiIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

apiIndex.definition = {
    methods: ["get","head"],
    url: '/super-admin/business-card-plans/api',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::apiIndex
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:25
 * @route '/super-admin/business-card-plans/api'
 */
apiIndex.url = (options?: RouteQueryOptions) => {
    return apiIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::apiIndex
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:25
 * @route '/super-admin/business-card-plans/api'
 */
apiIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::apiIndex
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:25
 * @route '/super-admin/business-card-plans/api'
 */
apiIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::apiIndex
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:25
 * @route '/super-admin/business-card-plans/api'
 */
    const apiIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apiIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::apiIndex
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:25
 * @route '/super-admin/business-card-plans/api'
 */
        apiIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\BusinessCardPlanController::apiIndex
 * @see app/Http/Controllers/SuperAdmin/BusinessCardPlanController.php:25
 * @route '/super-admin/business-card-plans/api'
 */
        apiIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apiIndex.form = apiIndexForm
const BusinessCardPlanController = { index, store, update, destroy, apiIndex }

export default BusinessCardPlanController