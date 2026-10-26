import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::index
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::index
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::index
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::index
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::index
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::index
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::index
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
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
* @see \App\Http\Controllers\SuperAdmin\TemplateController::store
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:53
 * @route '/super-admin/templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/super-admin/templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::store
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:53
 * @route '/super-admin/templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::store
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:53
 * @route '/super-admin/templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::store
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:53
 * @route '/super-admin/templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::store
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:53
 * @route '/super-admin/templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::clone
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:88
 * @route '/super-admin/templates/{template}/clone'
 */
export const clone = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

clone.definition = {
    methods: ["post"],
    url: '/super-admin/templates/{template}/clone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::clone
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:88
 * @route '/super-admin/templates/{template}/clone'
 */
clone.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return clone.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::clone
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:88
 * @route '/super-admin/templates/{template}/clone'
 */
clone.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::clone
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:88
 * @route '/super-admin/templates/{template}/clone'
 */
    const cloneForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clone.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::clone
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:88
 * @route '/super-admin/templates/{template}/clone'
 */
        cloneForm.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clone.url(args, options),
            method: 'post',
        })
    
    clone.form = cloneForm
/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::toggleTrending
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:136
 * @route '/super-admin/templates/{template}/toggle-trending'
 */
export const toggleTrending = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTrending.url(args, options),
    method: 'post',
})

toggleTrending.definition = {
    methods: ["post"],
    url: '/super-admin/templates/{template}/toggle-trending',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::toggleTrending
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:136
 * @route '/super-admin/templates/{template}/toggle-trending'
 */
toggleTrending.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleTrending.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::toggleTrending
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:136
 * @route '/super-admin/templates/{template}/toggle-trending'
 */
toggleTrending.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTrending.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::toggleTrending
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:136
 * @route '/super-admin/templates/{template}/toggle-trending'
 */
    const toggleTrendingForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleTrending.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::toggleTrending
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:136
 * @route '/super-admin/templates/{template}/toggle-trending'
 */
        toggleTrendingForm.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleTrending.url(args, options),
            method: 'post',
        })
    
    toggleTrending.form = toggleTrendingForm
/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::update
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:152
 * @route '/super-admin/templates/{template}'
 */
export const update = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/super-admin/templates/{template}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::update
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:152
 * @route '/super-admin/templates/{template}'
 */
update.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::update
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:152
 * @route '/super-admin/templates/{template}'
 */
update.put = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::update
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:152
 * @route '/super-admin/templates/{template}'
 */
    const updateForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::update
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:152
 * @route '/super-admin/templates/{template}'
 */
        updateForm.put = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SuperAdmin\TemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:202
 * @route '/super-admin/templates/{template}'
 */
export const destroy = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/super-admin/templates/{template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:202
 * @route '/super-admin/templates/{template}'
 */
destroy.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:202
 * @route '/super-admin/templates/{template}'
 */
destroy.delete = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:202
 * @route '/super-admin/templates/{template}'
 */
    const destroyForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:202
 * @route '/super-admin/templates/{template}'
 */
        destroyForm.delete = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TemplateController = { index, store, clone, toggleTrending, update, destroy }

export default TemplateController