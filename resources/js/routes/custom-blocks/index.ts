import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::index
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/custom-blocks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::index
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::index
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::index
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::index
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::index
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::index
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks'
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
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::create
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/super-admin/custom-blocks/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::create
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::create
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::create
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::create
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::create
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::create
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/create'
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
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::store
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:12
 * @route '/super-admin/custom-blocks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/super-admin/custom-blocks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::store
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:12
 * @route '/super-admin/custom-blocks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::store
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:12
 * @route '/super-admin/custom-blocks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::store
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:12
 * @route '/super-admin/custom-blocks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::store
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:12
 * @route '/super-admin/custom-blocks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::show
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
export const show = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/super-admin/custom-blocks/{custom_block}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::show
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
show.url = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { custom_block: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    custom_block: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        custom_block: args.custom_block,
                }

    return show.definition.url
            .replace('{custom_block}', parsedArgs.custom_block.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::show
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
show.get = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::show
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
show.head = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::show
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
    const showForm = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::show
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
        showForm.get = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::show
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
        showForm.head = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::edit
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}/edit'
 */
export const edit = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/super-admin/custom-blocks/{custom_block}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::edit
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}/edit'
 */
edit.url = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { custom_block: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    custom_block: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        custom_block: args.custom_block,
                }

    return edit.definition.url
            .replace('{custom_block}', parsedArgs.custom_block.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::edit
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}/edit'
 */
edit.get = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::edit
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}/edit'
 */
edit.head = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::edit
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}/edit'
 */
    const editForm = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::edit
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}/edit'
 */
        editForm.get = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::edit
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:0
 * @route '/super-admin/custom-blocks/{custom_block}/edit'
 */
        editForm.head = (args: { custom_block: string | number } | [custom_block: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::update
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:33
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
export const update = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/super-admin/custom-blocks/{custom_block}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::update
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:33
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
update.url = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { custom_block: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { custom_block: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    custom_block: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        custom_block: typeof args.custom_block === 'object'
                ? args.custom_block.id
                : args.custom_block,
                }

    return update.definition.url
            .replace('{custom_block}', parsedArgs.custom_block.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::update
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:33
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
update.put = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::update
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:33
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
update.patch = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::update
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:33
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
    const updateForm = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::update
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:33
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
        updateForm.put = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::update
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:33
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
        updateForm.patch = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:50
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
export const destroy = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/super-admin/custom-blocks/{custom_block}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:50
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
destroy.url = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { custom_block: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { custom_block: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    custom_block: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        custom_block: typeof args.custom_block === 'object'
                ? args.custom_block.id
                : args.custom_block,
                }

    return destroy.definition.url
            .replace('{custom_block}', parsedArgs.custom_block.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:50
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
destroy.delete = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:50
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
    const destroyForm = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\CustomBlockController::destroy
 * @see app/Http/Controllers/SuperAdmin/CustomBlockController.php:50
 * @route '/super-admin/custom-blocks/{custom_block}'
 */
        destroyForm.delete = (args: { custom_block: number | { id: number } } | [custom_block: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const customBlocks = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default customBlocks