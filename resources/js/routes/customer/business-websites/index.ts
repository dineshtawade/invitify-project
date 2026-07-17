import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::index
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:14
 * @route '/customer/business-websites'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customer/business-websites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::index
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:14
 * @route '/customer/business-websites'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::index
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:14
 * @route '/customer/business-websites'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::index
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:14
 * @route '/customer/business-websites'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::index
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:14
 * @route '/customer/business-websites'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::index
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:14
 * @route '/customer/business-websites'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::index
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:14
 * @route '/customer/business-websites'
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
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::create
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/customer/business-websites/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::create
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::create
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::create
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::create
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::create
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::create
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::store
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:39
 * @route '/customer/business-websites'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customer/business-websites',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::store
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:39
 * @route '/customer/business-websites'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::store
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:39
 * @route '/customer/business-websites'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::store
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:39
 * @route '/customer/business-websites'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::store
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:39
 * @route '/customer/business-websites'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::show
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/{business_website}'
 */
export const show = (args: { business_website: string | number } | [business_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/customer/business-websites/{business_website}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::show
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/{business_website}'
 */
show.url = (args: { business_website: string | number } | [business_website: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_website: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    business_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_website: args.business_website,
                }

    return show.definition.url
            .replace('{business_website}', parsedArgs.business_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::show
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/{business_website}'
 */
show.get = (args: { business_website: string | number } | [business_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::show
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/{business_website}'
 */
show.head = (args: { business_website: string | number } | [business_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::show
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/{business_website}'
 */
    const showForm = (args: { business_website: string | number } | [business_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::show
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/{business_website}'
 */
        showForm.get = (args: { business_website: string | number } | [business_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::show
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:0
 * @route '/customer/business-websites/{business_website}'
 */
        showForm.head = (args: { business_website: string | number } | [business_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:64
 * @route '/customer/business-websites/{business_website}/edit'
 */
export const edit = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/customer/business-websites/{business_website}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:64
 * @route '/customer/business-websites/{business_website}/edit'
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
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:64
 * @route '/customer/business-websites/{business_website}/edit'
 */
edit.get = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:64
 * @route '/customer/business-websites/{business_website}/edit'
 */
edit.head = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:64
 * @route '/customer/business-websites/{business_website}/edit'
 */
    const editForm = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:64
 * @route '/customer/business-websites/{business_website}/edit'
 */
        editForm.get = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::edit
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:64
 * @route '/customer/business-websites/{business_website}/edit'
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
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::update
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:75
 * @route '/customer/business-websites/{business_website}'
 */
export const update = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/customer/business-websites/{business_website}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::update
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:75
 * @route '/customer/business-websites/{business_website}'
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
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::update
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:75
 * @route '/customer/business-websites/{business_website}'
 */
update.put = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::update
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:75
 * @route '/customer/business-websites/{business_website}'
 */
update.patch = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::update
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:75
 * @route '/customer/business-websites/{business_website}'
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
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::update
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:75
 * @route '/customer/business-websites/{business_website}'
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
            /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::update
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:75
 * @route '/customer/business-websites/{business_website}'
 */
        updateForm.patch = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:95
 * @route '/customer/business-websites/{business_website}'
 */
export const destroy = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customer/business-websites/{business_website}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:95
 * @route '/customer/business-websites/{business_website}'
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
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:95
 * @route '/customer/business-websites/{business_website}'
 */
destroy.delete = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:95
 * @route '/customer/business-websites/{business_website}'
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
* @see \App\Http\Controllers\Customer\BusinessWebsiteController::destroy
 * @see app/Http/Controllers/Customer/BusinessWebsiteController.php:95
 * @route '/customer/business-websites/{business_website}'
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
const businessWebsites = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default businessWebsites