import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
export const purchaseTemplate = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchaseTemplate.url(args, options),
    method: 'post',
})

purchaseTemplate.definition = {
    methods: ["post"],
    url: '/reseller/mini-websites/{mini_website}/purchase-template',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
purchaseTemplate.url = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return purchaseTemplate.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
purchaseTemplate.post = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchaseTemplate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
    const purchaseTemplateForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purchaseTemplate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
        purchaseTemplateForm.post = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purchaseTemplate.url(args, options),
            method: 'post',
        })
    
    purchaseTemplate.form = purchaseTemplateForm
/**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:76
 * @route '/reseller/mini-websites/{mini_website}/download-zip'
 */
export const downloadZip = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadZip.url(args, options),
    method: 'get',
})

downloadZip.definition = {
    methods: ["get","head"],
    url: '/reseller/mini-websites/{mini_website}/download-zip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:76
 * @route '/reseller/mini-websites/{mini_website}/download-zip'
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
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:76
 * @route '/reseller/mini-websites/{mini_website}/download-zip'
 */
downloadZip.get = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadZip.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:76
 * @route '/reseller/mini-websites/{mini_website}/download-zip'
 */
downloadZip.head = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadZip.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:76
 * @route '/reseller/mini-websites/{mini_website}/download-zip'
 */
    const downloadZipForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadZip.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:76
 * @route '/reseller/mini-websites/{mini_website}/download-zip'
 */
        downloadZipForm.get = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadZip.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::downloadZip
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:76
 * @route '/reseller/mini-websites/{mini_website}/download-zip'
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
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::edit
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:12
 * @route '/reseller/mini-websites/{mini_website}/edit'
 */
export const edit = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/reseller/mini-websites/{mini_website}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::edit
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:12
 * @route '/reseller/mini-websites/{mini_website}/edit'
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
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::edit
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:12
 * @route '/reseller/mini-websites/{mini_website}/edit'
 */
edit.get = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::edit
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:12
 * @route '/reseller/mini-websites/{mini_website}/edit'
 */
edit.head = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::edit
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:12
 * @route '/reseller/mini-websites/{mini_website}/edit'
 */
    const editForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::edit
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:12
 * @route '/reseller/mini-websites/{mini_website}/edit'
 */
        editForm.get = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::edit
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:12
 * @route '/reseller/mini-websites/{mini_website}/edit'
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
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::update
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:41
 * @route '/reseller/mini-websites/{mini_website}'
 */
export const update = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/reseller/mini-websites/{mini_website}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::update
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:41
 * @route '/reseller/mini-websites/{mini_website}'
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
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::update
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:41
 * @route '/reseller/mini-websites/{mini_website}'
 */
update.put = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::update
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:41
 * @route '/reseller/mini-websites/{mini_website}'
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
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::update
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:41
 * @route '/reseller/mini-websites/{mini_website}'
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
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:59
 * @route '/reseller/mini-websites/{mini_website}'
 */
export const destroy = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/reseller/mini-websites/{mini_website}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:59
 * @route '/reseller/mini-websites/{mini_website}'
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
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:59
 * @route '/reseller/mini-websites/{mini_website}'
 */
destroy.delete = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:59
 * @route '/reseller/mini-websites/{mini_website}'
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
* @see \App\Http\Controllers\Reseller\MiniWebsiteController::destroy
 * @see app/Http/Controllers/Reseller/MiniWebsiteController.php:59
 * @route '/reseller/mini-websites/{mini_website}'
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
const miniWebsites = {
    purchaseTemplate: Object.assign(purchaseTemplate, purchaseTemplate),
downloadZip: Object.assign(downloadZip, downloadZip),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default miniWebsites