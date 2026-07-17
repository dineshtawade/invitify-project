import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:326
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
export const downloadZip = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadZip.url(args, options),
    method: 'get',
})

downloadZip.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites/{mini_website}/download-zip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:326
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
downloadZip.url = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.id
                : args.mini_website,
                }

    return downloadZip.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:326
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
downloadZip.get = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadZip.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:326
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
downloadZip.head = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadZip.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:326
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
    const downloadZipForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadZip.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:326
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
        downloadZipForm.get = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadZip.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:326
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
        downloadZipForm.head = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadZip.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadZip.form = downloadZipForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:17
 * @route '/customer/mini-websites'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:17
 * @route '/customer/mini-websites'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:17
 * @route '/customer/mini-websites'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:17
 * @route '/customer/mini-websites'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:17
 * @route '/customer/mini-websites'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:17
 * @route '/customer/mini-websites'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:17
 * @route '/customer/mini-websites'
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
* @see \App\Http\Controllers\Customer\MiniWebsiteController::create
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::create
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::create
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::create
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::create
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::create
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::create
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/create'
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
* @see \App\Http\Controllers\Customer\MiniWebsiteController::store
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:45
 * @route '/customer/mini-websites'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customer/mini-websites',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::store
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:45
 * @route '/customer/mini-websites'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::store
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:45
 * @route '/customer/mini-websites'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::store
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:45
 * @route '/customer/mini-websites'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::store
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:45
 * @route '/customer/mini-websites'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::show
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}'
 */
export const show = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites/{mini_website}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::show
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}'
 */
show.url = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: args.mini_website,
                }

    return show.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::show
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}'
 */
show.get = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::show
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}'
 */
show.head = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::show
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}'
 */
    const showForm = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::show
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}'
 */
        showForm.get = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::show
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}'
 */
        showForm.head = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:72
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
export const edit = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites/{mini_website}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:72
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
edit.url = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.id
                : args.mini_website,
                }

    return edit.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:72
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
edit.get = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:72
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
edit.head = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:72
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
    const editForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:72
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
        editForm.get = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:72
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
        editForm.head = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:86
 * @route '/customer/mini-websites/{mini_website}'
 */
export const update = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/customer/mini-websites/{mini_website}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:86
 * @route '/customer/mini-websites/{mini_website}'
 */
update.url = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.id
                : args.mini_website,
                }

    return update.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:86
 * @route '/customer/mini-websites/{mini_website}'
 */
update.put = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:86
 * @route '/customer/mini-websites/{mini_website}'
 */
update.patch = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:86
 * @route '/customer/mini-websites/{mini_website}'
 */
    const updateForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:86
 * @route '/customer/mini-websites/{mini_website}'
 */
        updateForm.put = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:86
 * @route '/customer/mini-websites/{mini_website}'
 */
        updateForm.patch = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Customer\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:104
 * @route '/customer/mini-websites/{mini_website}'
 */
export const destroy = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customer/mini-websites/{mini_website}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:104
 * @route '/customer/mini-websites/{mini_website}'
 */
destroy.url = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.id
                : args.mini_website,
                }

    return destroy.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:104
 * @route '/customer/mini-websites/{mini_website}'
 */
destroy.delete = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:104
 * @route '/customer/mini-websites/{mini_website}'
 */
    const destroyForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:104
 * @route '/customer/mini-websites/{mini_website}'
 */
        destroyForm.delete = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
export const submissions = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(args, options),
    method: 'get',
})

submissions.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites/{mini_website}/submissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
submissions.url = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: args.mini_website,
                }

    return submissions.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
submissions.get = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
submissions.head = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: submissions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
    const submissionsForm = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: submissions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
        submissionsForm.get = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: submissions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:0
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
        submissionsForm.head = (args: { mini_website: string | number } | [mini_website: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: submissions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    submissions.form = submissionsForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:118
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
export const createOrder = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createOrder.url(args, options),
    method: 'post',
})

createOrder.definition = {
    methods: ["post"],
    url: '/customer/mini-websites/{mini_website}/create-order',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:118
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
createOrder.url = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.id
                : args.mini_website,
                }

    return createOrder.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:118
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
createOrder.post = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:118
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
    const createOrderForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:118
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
        createOrderForm.post = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createOrder.url(args, options),
            method: 'post',
        })
    
    createOrder.form = createOrderForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:216
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
export const verifyPayment = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(args, options),
    method: 'post',
})

verifyPayment.definition = {
    methods: ["post"],
    url: '/customer/mini-websites/{mini_website}/verify-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:216
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
verifyPayment.url = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.id
                : args.mini_website,
                }

    return verifyPayment.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:216
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
verifyPayment.post = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:216
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
    const verifyPaymentForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:216
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
        verifyPaymentForm.post = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyPayment.url(args, options),
            method: 'post',
        })
    
    verifyPayment.form = verifyPaymentForm
const miniWebsites = {
    downloadZip: Object.assign(downloadZip, downloadZip),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
submissions: Object.assign(submissions, submissions),
createOrder: Object.assign(createOrder, createOrder),
verifyPayment: Object.assign(verifyPayment, verifyPayment),
}

export default miniWebsites