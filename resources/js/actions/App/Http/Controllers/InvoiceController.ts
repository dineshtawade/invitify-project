import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:20
 * @route '/super-admin/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:20
 * @route '/super-admin/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:20
 * @route '/super-admin/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:20
 * @route '/super-admin/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:20
 * @route '/super-admin/invoices'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:20
 * @route '/super-admin/invoices'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:20
 * @route '/super-admin/invoices'
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
* @see \App\Http\Controllers\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/InvoiceController.php:69
 * @route '/super-admin/invoices/download-all'
 */
export const downloadAllPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAllPdf.url(options),
    method: 'get',
})

downloadAllPdf.definition = {
    methods: ["get","head"],
    url: '/super-admin/invoices/download-all',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/InvoiceController.php:69
 * @route '/super-admin/invoices/download-all'
 */
downloadAllPdf.url = (options?: RouteQueryOptions) => {
    return downloadAllPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/InvoiceController.php:69
 * @route '/super-admin/invoices/download-all'
 */
downloadAllPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAllPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/InvoiceController.php:69
 * @route '/super-admin/invoices/download-all'
 */
downloadAllPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAllPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/InvoiceController.php:69
 * @route '/super-admin/invoices/download-all'
 */
    const downloadAllPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadAllPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/InvoiceController.php:69
 * @route '/super-admin/invoices/download-all'
 */
        downloadAllPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAllPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/InvoiceController.php:69
 * @route '/super-admin/invoices/download-all'
 */
        downloadAllPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAllPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadAllPdf.form = downloadAllPdfForm
/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/super-admin/invoices/{invoiceNumber}'
 */
const showff314d60d44bfc6e4656b4917945983d = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showff314d60d44bfc6e4656b4917945983d.url(args, options),
    method: 'get',
})

showff314d60d44bfc6e4656b4917945983d.definition = {
    methods: ["get","head"],
    url: '/super-admin/invoices/{invoiceNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/super-admin/invoices/{invoiceNumber}'
 */
showff314d60d44bfc6e4656b4917945983d.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    invoiceNumber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoiceNumber: args.invoiceNumber,
                }

    return showff314d60d44bfc6e4656b4917945983d.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/super-admin/invoices/{invoiceNumber}'
 */
showff314d60d44bfc6e4656b4917945983d.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showff314d60d44bfc6e4656b4917945983d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/super-admin/invoices/{invoiceNumber}'
 */
showff314d60d44bfc6e4656b4917945983d.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showff314d60d44bfc6e4656b4917945983d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/super-admin/invoices/{invoiceNumber}'
 */
    const showff314d60d44bfc6e4656b4917945983dForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showff314d60d44bfc6e4656b4917945983d.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/super-admin/invoices/{invoiceNumber}'
 */
        showff314d60d44bfc6e4656b4917945983dForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showff314d60d44bfc6e4656b4917945983d.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/super-admin/invoices/{invoiceNumber}'
 */
        showff314d60d44bfc6e4656b4917945983dForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showff314d60d44bfc6e4656b4917945983d.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showff314d60d44bfc6e4656b4917945983d.form = showff314d60d44bfc6e4656b4917945983dForm
    /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
const showeda1b8ca89ef3e6e2541fc8b740fb832 = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showeda1b8ca89ef3e6e2541fc8b740fb832.url(args, options),
    method: 'get',
})

showeda1b8ca89ef3e6e2541fc8b740fb832.definition = {
    methods: ["get","head"],
    url: '/customer/invoices/{invoiceNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
showeda1b8ca89ef3e6e2541fc8b740fb832.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    invoiceNumber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoiceNumber: args.invoiceNumber,
                }

    return showeda1b8ca89ef3e6e2541fc8b740fb832.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
showeda1b8ca89ef3e6e2541fc8b740fb832.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showeda1b8ca89ef3e6e2541fc8b740fb832.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
showeda1b8ca89ef3e6e2541fc8b740fb832.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showeda1b8ca89ef3e6e2541fc8b740fb832.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
    const showeda1b8ca89ef3e6e2541fc8b740fb832Form = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showeda1b8ca89ef3e6e2541fc8b740fb832.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
        showeda1b8ca89ef3e6e2541fc8b740fb832Form.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showeda1b8ca89ef3e6e2541fc8b740fb832.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
        showeda1b8ca89ef3e6e2541fc8b740fb832Form.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showeda1b8ca89ef3e6e2541fc8b740fb832.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showeda1b8ca89ef3e6e2541fc8b740fb832.form = showeda1b8ca89ef3e6e2541fc8b740fb832Form

/**
* Multiple routes resolve to \App\Http\Controllers\InvoiceController::show, so this export is a
* dictionary keyed by URI rather than a callable, with the verbs prefixed where two routes share a URI.
* Call a specific route with `show['<key>'](...)`, or import the route by name from your
* generated `routes/` directory.
*/
export const show = {
    '/super-admin/invoices/{invoiceNumber}': showff314d60d44bfc6e4656b4917945983d,
    '/customer/invoices/{invoiceNumber}': showeda1b8ca89ef3e6e2541fc8b740fb832,
}

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/super-admin/invoices/{invoiceNumber}/download'
 */
const downloadPdfa14074835ad6e974e6a1bf9cb11d4773 = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdfa14074835ad6e974e6a1bf9cb11d4773.url(args, options),
    method: 'get',
})

downloadPdfa14074835ad6e974e6a1bf9cb11d4773.definition = {
    methods: ["get","head"],
    url: '/super-admin/invoices/{invoiceNumber}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/super-admin/invoices/{invoiceNumber}/download'
 */
downloadPdfa14074835ad6e974e6a1bf9cb11d4773.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    invoiceNumber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoiceNumber: args.invoiceNumber,
                }

    return downloadPdfa14074835ad6e974e6a1bf9cb11d4773.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/super-admin/invoices/{invoiceNumber}/download'
 */
downloadPdfa14074835ad6e974e6a1bf9cb11d4773.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdfa14074835ad6e974e6a1bf9cb11d4773.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/super-admin/invoices/{invoiceNumber}/download'
 */
downloadPdfa14074835ad6e974e6a1bf9cb11d4773.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdfa14074835ad6e974e6a1bf9cb11d4773.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/super-admin/invoices/{invoiceNumber}/download'
 */
    const downloadPdfa14074835ad6e974e6a1bf9cb11d4773Form = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadPdfa14074835ad6e974e6a1bf9cb11d4773.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/super-admin/invoices/{invoiceNumber}/download'
 */
        downloadPdfa14074835ad6e974e6a1bf9cb11d4773Form.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdfa14074835ad6e974e6a1bf9cb11d4773.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/super-admin/invoices/{invoiceNumber}/download'
 */
        downloadPdfa14074835ad6e974e6a1bf9cb11d4773Form.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdfa14074835ad6e974e6a1bf9cb11d4773.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadPdfa14074835ad6e974e6a1bf9cb11d4773.form = downloadPdfa14074835ad6e974e6a1bf9cb11d4773Form
    /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
const downloadPdfb221976105d43f510e4792af7fa4032c = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdfb221976105d43f510e4792af7fa4032c.url(args, options),
    method: 'get',
})

downloadPdfb221976105d43f510e4792af7fa4032c.definition = {
    methods: ["get","head"],
    url: '/customer/invoices/{invoiceNumber}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
downloadPdfb221976105d43f510e4792af7fa4032c.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    invoiceNumber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoiceNumber: args.invoiceNumber,
                }

    return downloadPdfb221976105d43f510e4792af7fa4032c.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
downloadPdfb221976105d43f510e4792af7fa4032c.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdfb221976105d43f510e4792af7fa4032c.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
downloadPdfb221976105d43f510e4792af7fa4032c.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdfb221976105d43f510e4792af7fa4032c.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
    const downloadPdfb221976105d43f510e4792af7fa4032cForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadPdfb221976105d43f510e4792af7fa4032c.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
        downloadPdfb221976105d43f510e4792af7fa4032cForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdfb221976105d43f510e4792af7fa4032c.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
        downloadPdfb221976105d43f510e4792af7fa4032cForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdfb221976105d43f510e4792af7fa4032c.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadPdfb221976105d43f510e4792af7fa4032c.form = downloadPdfb221976105d43f510e4792af7fa4032cForm

/**
* Multiple routes resolve to \App\Http\Controllers\InvoiceController::downloadPdf, so this export is a
* dictionary keyed by URI rather than a callable, with the verbs prefixed where two routes share a URI.
* Call a specific route with `downloadPdf['<key>'](...)`, or import the route by name from your
* generated `routes/` directory.
*/
export const downloadPdf = {
    '/super-admin/invoices/{invoiceNumber}/download': downloadPdfa14074835ad6e974e6a1bf9cb11d4773,
    '/customer/invoices/{invoiceNumber}/download': downloadPdfb221976105d43f510e4792af7fa4032c,
}

/**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/super-admin/invoices/{invoiceNumber}/stream'
 */
const streamPdf8ba0d90137aeb109c1315cccc136d44e = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamPdf8ba0d90137aeb109c1315cccc136d44e.url(args, options),
    method: 'get',
})

streamPdf8ba0d90137aeb109c1315cccc136d44e.definition = {
    methods: ["get","head"],
    url: '/super-admin/invoices/{invoiceNumber}/stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/super-admin/invoices/{invoiceNumber}/stream'
 */
streamPdf8ba0d90137aeb109c1315cccc136d44e.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    invoiceNumber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoiceNumber: args.invoiceNumber,
                }

    return streamPdf8ba0d90137aeb109c1315cccc136d44e.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/super-admin/invoices/{invoiceNumber}/stream'
 */
streamPdf8ba0d90137aeb109c1315cccc136d44e.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamPdf8ba0d90137aeb109c1315cccc136d44e.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/super-admin/invoices/{invoiceNumber}/stream'
 */
streamPdf8ba0d90137aeb109c1315cccc136d44e.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streamPdf8ba0d90137aeb109c1315cccc136d44e.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/super-admin/invoices/{invoiceNumber}/stream'
 */
    const streamPdf8ba0d90137aeb109c1315cccc136d44eForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: streamPdf8ba0d90137aeb109c1315cccc136d44e.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/super-admin/invoices/{invoiceNumber}/stream'
 */
        streamPdf8ba0d90137aeb109c1315cccc136d44eForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamPdf8ba0d90137aeb109c1315cccc136d44e.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/super-admin/invoices/{invoiceNumber}/stream'
 */
        streamPdf8ba0d90137aeb109c1315cccc136d44eForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamPdf8ba0d90137aeb109c1315cccc136d44e.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    streamPdf8ba0d90137aeb109c1315cccc136d44e.form = streamPdf8ba0d90137aeb109c1315cccc136d44eForm
    /**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
const streamPdf43074ae1d9be47d2b99e1e3baae0344f = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamPdf43074ae1d9be47d2b99e1e3baae0344f.url(args, options),
    method: 'get',
})

streamPdf43074ae1d9be47d2b99e1e3baae0344f.definition = {
    methods: ["get","head"],
    url: '/customer/invoices/{invoiceNumber}/stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
streamPdf43074ae1d9be47d2b99e1e3baae0344f.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    invoiceNumber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoiceNumber: args.invoiceNumber,
                }

    return streamPdf43074ae1d9be47d2b99e1e3baae0344f.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
streamPdf43074ae1d9be47d2b99e1e3baae0344f.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamPdf43074ae1d9be47d2b99e1e3baae0344f.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
streamPdf43074ae1d9be47d2b99e1e3baae0344f.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streamPdf43074ae1d9be47d2b99e1e3baae0344f.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
    const streamPdf43074ae1d9be47d2b99e1e3baae0344fForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: streamPdf43074ae1d9be47d2b99e1e3baae0344f.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
        streamPdf43074ae1d9be47d2b99e1e3baae0344fForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamPdf43074ae1d9be47d2b99e1e3baae0344f.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::streamPdf
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
        streamPdf43074ae1d9be47d2b99e1e3baae0344fForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamPdf43074ae1d9be47d2b99e1e3baae0344f.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    streamPdf43074ae1d9be47d2b99e1e3baae0344f.form = streamPdf43074ae1d9be47d2b99e1e3baae0344fForm

/**
* Multiple routes resolve to \App\Http\Controllers\InvoiceController::streamPdf, so this export is a
* dictionary keyed by URI rather than a callable, with the verbs prefixed where two routes share a URI.
* Call a specific route with `streamPdf['<key>'](...)`, or import the route by name from your
* generated `routes/` directory.
*/
export const streamPdf = {
    '/super-admin/invoices/{invoiceNumber}/stream': streamPdf8ba0d90137aeb109c1315cccc136d44e,
    '/customer/invoices/{invoiceNumber}/stream': streamPdf43074ae1d9be47d2b99e1e3baae0344f,
}

const InvoiceController = { index, downloadAllPdf, show, downloadPdf, streamPdf }

export default InvoiceController