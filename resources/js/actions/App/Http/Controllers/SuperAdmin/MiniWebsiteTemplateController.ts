import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::index
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:12
 * @route '/super-admin/mini-website-templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/mini-website-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::index
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:12
 * @route '/super-admin/mini-website-templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::index
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:12
 * @route '/super-admin/mini-website-templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::index
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:12
 * @route '/super-admin/mini-website-templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::index
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:12
 * @route '/super-admin/mini-website-templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::index
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:12
 * @route '/super-admin/mini-website-templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::index
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:12
 * @route '/super-admin/mini-website-templates'
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
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::create
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/super-admin/mini-website-templates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::create
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::create
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::create
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::create
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::create
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::create
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/create'
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
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::store
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:37
 * @route '/super-admin/mini-website-templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/super-admin/mini-website-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::store
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:37
 * @route '/super-admin/mini-website-templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::store
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:37
 * @route '/super-admin/mini-website-templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::store
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:37
 * @route '/super-admin/mini-website-templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::store
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:37
 * @route '/super-admin/mini-website-templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::show
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
export const show = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/super-admin/mini-website-templates/{mini_website_template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::show
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
show.url = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mini_website_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website_template: args.mini_website_template,
                }

    return show.definition.url
            .replace('{mini_website_template}', parsedArgs.mini_website_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::show
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
show.get = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::show
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
show.head = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::show
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
    const showForm = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::show
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
        showForm.get = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::show
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
        showForm.head = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::edit
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}/edit'
 */
export const edit = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/super-admin/mini-website-templates/{mini_website_template}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::edit
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}/edit'
 */
edit.url = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mini_website_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website_template: args.mini_website_template,
                }

    return edit.definition.url
            .replace('{mini_website_template}', parsedArgs.mini_website_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::edit
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}/edit'
 */
edit.get = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::edit
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}/edit'
 */
edit.head = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::edit
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}/edit'
 */
    const editForm = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::edit
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}/edit'
 */
        editForm.get = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::edit
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:0
 * @route '/super-admin/mini-website-templates/{mini_website_template}/edit'
 */
        editForm.head = (args: { mini_website_template: string | number } | [mini_website_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::update
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:53
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
export const update = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/super-admin/mini-website-templates/{mini_website_template}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::update
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:53
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
update.url = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website_template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website_template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website_template: typeof args.mini_website_template === 'object'
                ? args.mini_website_template.id
                : args.mini_website_template,
                }

    return update.definition.url
            .replace('{mini_website_template}', parsedArgs.mini_website_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::update
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:53
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
update.put = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::update
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:53
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
update.patch = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::update
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:53
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
    const updateForm = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::update
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:53
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
        updateForm.put = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::update
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:53
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
        updateForm.patch = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:82
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
export const destroy = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/super-admin/mini-website-templates/{mini_website_template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:82
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
destroy.url = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website_template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website_template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website_template: typeof args.mini_website_template === 'object'
                ? args.mini_website_template.id
                : args.mini_website_template,
                }

    return destroy.definition.url
            .replace('{mini_website_template}', parsedArgs.mini_website_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:82
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
destroy.delete = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:82
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
    const destroyForm = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\MiniWebsiteTemplateController::destroy
 * @see app/Http/Controllers/SuperAdmin/MiniWebsiteTemplateController.php:82
 * @route '/super-admin/mini-website-templates/{mini_website_template}'
 */
        destroyForm.delete = (args: { mini_website_template: number | { id: number } } | [mini_website_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const MiniWebsiteTemplateController = { index, create, store, show, edit, update, destroy }

export default MiniWebsiteTemplateController