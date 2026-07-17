import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:19
 * @route '/customer/business-cards'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customer/business-cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:19
 * @route '/customer/business-cards'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:19
 * @route '/customer/business-cards'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:19
 * @route '/customer/business-cards'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:19
 * @route '/customer/business-cards'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:19
 * @route '/customer/business-cards'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::index
 * @see app/Http/Controllers/Customer/BusinessCardController.php:19
 * @route '/customer/business-cards'
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
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/customer/business-cards/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::create
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/create'
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
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customer/business-cards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::store
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
export const show = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/customer/business-cards/{business_card}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
show.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_card: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    business_card: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_card: args.business_card,
                }

    return show.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
show.get = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
show.head = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
    const showForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
        showForm.get = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::show
 * @see app/Http/Controllers/Customer/BusinessCardController.php:0
 * @route '/customer/business-cards/{business_card}'
 */
        showForm.head = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:31
 * @route '/customer/business-cards/{business_card}/edit'
 */
export const edit = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/customer/business-cards/{business_card}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:31
 * @route '/customer/business-cards/{business_card}/edit'
 */
edit.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_card: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    business_card: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_card: args.business_card,
                }

    return edit.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:31
 * @route '/customer/business-cards/{business_card}/edit'
 */
edit.get = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:31
 * @route '/customer/business-cards/{business_card}/edit'
 */
edit.head = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:31
 * @route '/customer/business-cards/{business_card}/edit'
 */
    const editForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:31
 * @route '/customer/business-cards/{business_card}/edit'
 */
        editForm.get = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::edit
 * @see app/Http/Controllers/Customer/BusinessCardController.php:31
 * @route '/customer/business-cards/{business_card}/edit'
 */
        editForm.head = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:42
 * @route '/customer/business-cards/{business_card}'
 */
export const update = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/customer/business-cards/{business_card}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:42
 * @route '/customer/business-cards/{business_card}'
 */
update.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_card: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    business_card: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_card: args.business_card,
                }

    return update.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:42
 * @route '/customer/business-cards/{business_card}'
 */
update.put = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:42
 * @route '/customer/business-cards/{business_card}'
 */
update.patch = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:42
 * @route '/customer/business-cards/{business_card}'
 */
    const updateForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:42
 * @route '/customer/business-cards/{business_card}'
 */
        updateForm.put = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::update
 * @see app/Http/Controllers/Customer/BusinessCardController.php:42
 * @route '/customer/business-cards/{business_card}'
 */
        updateForm.patch = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}'
 */
export const destroy = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customer/business-cards/{business_card}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}'
 */
destroy.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_card: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    business_card: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_card: args.business_card,
                }

    return destroy.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}'
 */
destroy.delete = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}'
 */
    const destroyForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::destroy
 * @see app/Http/Controllers/Customer/BusinessCardController.php:76
 * @route '/customer/business-cards/{business_card}'
 */
        destroyForm.delete = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
export const getPlans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPlans.url(options),
    method: 'get',
})

getPlans.definition = {
    methods: ["get","head"],
    url: '/customer/business-card-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
getPlans.url = (options?: RouteQueryOptions) => {
    return getPlans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
getPlans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPlans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
getPlans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPlans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
    const getPlansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPlans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
        getPlansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPlans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::getPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
        getPlansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPlans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPlans.form = getPlansForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:102
 * @route '/customer/business-cards/draft-create'
 */
export const draftCreate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draftCreate.url(options),
    method: 'post',
})

draftCreate.definition = {
    methods: ["post"],
    url: '/customer/business-cards/draft-create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:102
 * @route '/customer/business-cards/draft-create'
 */
draftCreate.url = (options?: RouteQueryOptions) => {
    return draftCreate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:102
 * @route '/customer/business-cards/draft-create'
 */
draftCreate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draftCreate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:102
 * @route '/customer/business-cards/draft-create'
 */
    const draftCreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: draftCreate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::draftCreate
 * @see app/Http/Controllers/Customer/BusinessCardController.php:102
 * @route '/customer/business-cards/draft-create'
 */
        draftCreateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: draftCreate.url(options),
            method: 'post',
        })
    
    draftCreate.form = draftCreateForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:151
 * @route '/customer/business-cards/{business_card}/create-order'
 */
export const payOrder = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payOrder.url(args, options),
    method: 'post',
})

payOrder.definition = {
    methods: ["post"],
    url: '/customer/business-cards/{business_card}/create-order',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:151
 * @route '/customer/business-cards/{business_card}/create-order'
 */
payOrder.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_card: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    business_card: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_card: args.business_card,
                }

    return payOrder.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:151
 * @route '/customer/business-cards/{business_card}/create-order'
 */
payOrder.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:151
 * @route '/customer/business-cards/{business_card}/create-order'
 */
    const payOrderForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: payOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::payOrder
 * @see app/Http/Controllers/Customer/BusinessCardController.php:151
 * @route '/customer/business-cards/{business_card}/create-order'
 */
        payOrderForm.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: payOrder.url(args, options),
            method: 'post',
        })
    
    payOrder.form = payOrderForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:221
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
export const verifyCardPayment = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyCardPayment.url(args, options),
    method: 'post',
})

verifyCardPayment.definition = {
    methods: ["post"],
    url: '/customer/business-cards/{business_card}/verify-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:221
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
verifyCardPayment.url = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_card: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    business_card: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_card: args.business_card,
                }

    return verifyCardPayment.definition.url
            .replace('{business_card}', parsedArgs.business_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:221
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
verifyCardPayment.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyCardPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:221
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
    const verifyCardPaymentForm = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyCardPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::verifyCardPayment
 * @see app/Http/Controllers/Customer/BusinessCardController.php:221
 * @route '/customer/business-cards/{business_card}/verify-payment'
 */
        verifyCardPaymentForm.post = (args: { business_card: string | number } | [business_card: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyCardPayment.url(args, options),
            method: 'post',
        })
    
    verifyCardPayment.form = verifyCardPaymentForm
const BusinessCardController = { index, create, store, show, edit, update, destroy, getPlans, draftCreate, payOrder, verifyCardPayment }

export default BusinessCardController