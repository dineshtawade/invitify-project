import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::previewTemplate
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
export const previewTemplate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewTemplate.url(args, options),
    method: 'get',
})

previewTemplate.definition = {
    methods: ["get","head"],
    url: '/mini-websites/template-preview/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::previewTemplate
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
previewTemplate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return previewTemplate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::previewTemplate
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
previewTemplate.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewTemplate.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::previewTemplate
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
previewTemplate.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewTemplate.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::previewTemplate
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
    const previewTemplateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewTemplate.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::previewTemplate
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
        previewTemplateForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewTemplate.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::previewTemplate
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:106
 * @route '/mini-websites/template-preview/{id}'
 */
        previewTemplateForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewTemplate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewTemplate.form = previewTemplateForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createGuestWebsite
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
export const createGuestWebsite = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createGuestWebsite.url(options),
    method: 'get',
})

createGuestWebsite.definition = {
    methods: ["get","head"],
    url: '/create-invitation-website',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createGuestWebsite
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
createGuestWebsite.url = (options?: RouteQueryOptions) => {
    return createGuestWebsite.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createGuestWebsite
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
createGuestWebsite.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createGuestWebsite.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createGuestWebsite
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
createGuestWebsite.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createGuestWebsite.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createGuestWebsite
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
    const createGuestWebsiteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createGuestWebsite.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createGuestWebsite
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
        createGuestWebsiteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createGuestWebsite.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createGuestWebsite
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:29
 * @route '/create-invitation-website'
 */
        createGuestWebsiteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createGuestWebsite.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createGuestWebsite.form = createGuestWebsiteForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickCheckoutAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
export const quickCheckoutAuth = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickCheckoutAuth.url(options),
    method: 'post',
})

quickCheckoutAuth.definition = {
    methods: ["post"],
    url: '/mini-websites/quick-checkout-auth',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickCheckoutAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
quickCheckoutAuth.url = (options?: RouteQueryOptions) => {
    return quickCheckoutAuth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickCheckoutAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
quickCheckoutAuth.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickCheckoutAuth.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickCheckoutAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
    const quickCheckoutAuthForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: quickCheckoutAuth.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::quickCheckoutAuth
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:128
 * @route '/mini-websites/quick-checkout-auth'
 */
        quickCheckoutAuthForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: quickCheckoutAuth.url(options),
            method: 'post',
        })
    
    quickCheckoutAuth.form = quickCheckoutAuthForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadInviteZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:742
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
export const downloadInviteZip = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadInviteZip.url(args, options),
    method: 'get',
})

downloadInviteZip.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites/{mini_website}/download-zip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadInviteZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:742
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
downloadInviteZip.url = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { mini_website: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.uuid
                : args.mini_website,
                }

    return downloadInviteZip.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadInviteZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:742
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
downloadInviteZip.get = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadInviteZip.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadInviteZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:742
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
downloadInviteZip.head = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadInviteZip.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadInviteZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:742
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
    const downloadInviteZipForm = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadInviteZip.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadInviteZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:742
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
        downloadInviteZipForm.get = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadInviteZip.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::downloadInviteZip
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:742
 * @route '/customer/mini-websites/{mini_website}/download-zip'
 */
        downloadInviteZipForm.head = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadInviteZip.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadInviteZip.form = downloadInviteZipForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:198
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:198
 * @route '/customer/mini-websites'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:198
 * @route '/customer/mini-websites'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:198
 * @route '/customer/mini-websites'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:198
 * @route '/customer/mini-websites'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:198
 * @route '/customer/mini-websites'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::index
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:198
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:227
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:227
 * @route '/customer/mini-websites'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::store
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:227
 * @route '/customer/mini-websites'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::store
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:227
 * @route '/customer/mini-websites'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::store
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:227
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:254
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
export const edit = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites/{mini_website}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:254
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
edit.url = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { mini_website: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.uuid
                : args.mini_website,
                }

    return edit.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:254
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
edit.get = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:254
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
edit.head = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:254
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
    const editForm = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:254
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
        editForm.get = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::edit
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:254
 * @route '/customer/mini-websites/{mini_website}/edit'
 */
        editForm.head = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:287
 * @route '/customer/mini-websites/{mini_website}'
 */
export const update = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/customer/mini-websites/{mini_website}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:287
 * @route '/customer/mini-websites/{mini_website}'
 */
update.url = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { mini_website: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.uuid
                : args.mini_website,
                }

    return update.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:287
 * @route '/customer/mini-websites/{mini_website}'
 */
update.put = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:287
 * @route '/customer/mini-websites/{mini_website}'
 */
update.patch = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::update
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:287
 * @route '/customer/mini-websites/{mini_website}'
 */
    const updateForm = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:287
 * @route '/customer/mini-websites/{mini_website}'
 */
        updateForm.put = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:287
 * @route '/customer/mini-websites/{mini_website}'
 */
        updateForm.patch = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:305
 * @route '/customer/mini-websites/{mini_website}'
 */
export const destroy = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customer/mini-websites/{mini_website}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:305
 * @route '/customer/mini-websites/{mini_website}'
 */
destroy.url = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { mini_website: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.uuid
                : args.mini_website,
                }

    return destroy.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:305
 * @route '/customer/mini-websites/{mini_website}'
 */
destroy.delete = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:305
 * @route '/customer/mini-websites/{mini_website}'
 */
    const destroyForm = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:305
 * @route '/customer/mini-websites/{mini_website}'
 */
        destroyForm.delete = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:316
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
export const submissions = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(args, options),
    method: 'get',
})

submissions.definition = {
    methods: ["get","head"],
    url: '/customer/mini-websites/{mini_website}/submissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:316
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
submissions.url = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { mini_website: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.uuid
                : args.mini_website,
                }

    return submissions.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:316
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
submissions.get = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:316
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
submissions.head = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: submissions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:316
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
    const submissionsForm = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: submissions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:316
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
        submissionsForm.get = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: submissions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::submissions
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:316
 * @route '/customer/mini-websites/{mini_website}/submissions'
 */
        submissionsForm.head = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Customer\MiniWebsiteController::allRsvps
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:332
 * @route '/customer/rsvps'
 */
export const allRsvps = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allRsvps.url(options),
    method: 'get',
})

allRsvps.definition = {
    methods: ["get","head"],
    url: '/customer/rsvps',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::allRsvps
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:332
 * @route '/customer/rsvps'
 */
allRsvps.url = (options?: RouteQueryOptions) => {
    return allRsvps.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::allRsvps
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:332
 * @route '/customer/rsvps'
 */
allRsvps.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allRsvps.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::allRsvps
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:332
 * @route '/customer/rsvps'
 */
allRsvps.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: allRsvps.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::allRsvps
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:332
 * @route '/customer/rsvps'
 */
    const allRsvpsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: allRsvps.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::allRsvps
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:332
 * @route '/customer/rsvps'
 */
        allRsvpsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: allRsvps.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::allRsvps
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:332
 * @route '/customer/rsvps'
 */
        allRsvpsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: allRsvps.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    allRsvps.form = allRsvpsForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createRenewalOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:419
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
export const createRenewalOrder = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRenewalOrder.url(args, options),
    method: 'post',
})

createRenewalOrder.definition = {
    methods: ["post"],
    url: '/customer/mini-websites/{mini_website}/create-order',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createRenewalOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:419
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
createRenewalOrder.url = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { mini_website: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.uuid
                : args.mini_website,
                }

    return createRenewalOrder.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createRenewalOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:419
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
createRenewalOrder.post = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRenewalOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createRenewalOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:419
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
    const createRenewalOrderForm = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createRenewalOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::createRenewalOrder
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:419
 * @route '/customer/mini-websites/{mini_website}/create-order'
 */
        createRenewalOrderForm.post = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createRenewalOrder.url(args, options),
            method: 'post',
        })
    
    createRenewalOrder.form = createRenewalOrderForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyRenewalPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:631
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
export const verifyRenewalPayment = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyRenewalPayment.url(args, options),
    method: 'post',
})

verifyRenewalPayment.definition = {
    methods: ["post"],
    url: '/customer/mini-websites/{mini_website}/verify-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyRenewalPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:631
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
verifyRenewalPayment.url = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { mini_website: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.uuid
                : args.mini_website,
                }

    return verifyRenewalPayment.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyRenewalPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:631
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
verifyRenewalPayment.post = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyRenewalPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyRenewalPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:631
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
    const verifyRenewalPaymentForm = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyRenewalPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyRenewalPayment
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:631
 * @route '/customer/mini-websites/{mini_website}/verify-payment'
 */
        verifyRenewalPaymentForm.post = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyRenewalPayment.url(args, options),
            method: 'post',
        })
    
    verifyRenewalPayment.form = verifyRenewalPaymentForm
/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyReferral
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:361
 * @route '/customer/mini-websites/{mini_website}/verify-referral'
 */
export const verifyReferral = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyReferral.url(args, options),
    method: 'post',
})

verifyReferral.definition = {
    methods: ["post"],
    url: '/customer/mini-websites/{mini_website}/verify-referral',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyReferral
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:361
 * @route '/customer/mini-websites/{mini_website}/verify-referral'
 */
verifyReferral.url = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { mini_website: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.uuid
                : args.mini_website,
                }

    return verifyReferral.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyReferral
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:361
 * @route '/customer/mini-websites/{mini_website}/verify-referral'
 */
verifyReferral.post = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyReferral.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyReferral
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:361
 * @route '/customer/mini-websites/{mini_website}/verify-referral'
 */
    const verifyReferralForm = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyReferral.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\MiniWebsiteController::verifyReferral
 * @see app/Http/Controllers/Customer/MiniWebsiteController.php:361
 * @route '/customer/mini-websites/{mini_website}/verify-referral'
 */
        verifyReferralForm.post = (args: { mini_website: string | { uuid: string } } | [mini_website: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyReferral.url(args, options),
            method: 'post',
        })
    
    verifyReferral.form = verifyReferralForm
const MiniWebsiteController = { previewTemplate, createGuestWebsite, quickCheckoutAuth, downloadInviteZip, index, create, store, show, edit, update, destroy, submissions, allRsvps, createRenewalOrder, verifyRenewalPayment, verifyReferral }

export default MiniWebsiteController