import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::index
 * @see app/Http/Controllers/Reseller/InvoiceController.php:20
 * @route '/reseller/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reseller/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::index
 * @see app/Http/Controllers/Reseller/InvoiceController.php:20
 * @route '/reseller/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::index
 * @see app/Http/Controllers/Reseller/InvoiceController.php:20
 * @route '/reseller/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::index
 * @see app/Http/Controllers/Reseller/InvoiceController.php:20
 * @route '/reseller/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\InvoiceController::index
 * @see app/Http/Controllers/Reseller/InvoiceController.php:20
 * @route '/reseller/invoices'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::index
 * @see app/Http/Controllers/Reseller/InvoiceController.php:20
 * @route '/reseller/invoices'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::index
 * @see app/Http/Controllers/Reseller/InvoiceController.php:20
 * @route '/reseller/invoices'
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
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
export const downloadAllPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAllPdf.url(options),
    method: 'get',
})

downloadAllPdf.definition = {
    methods: ["get","head"],
    url: '/reseller/invoices/download-all',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
downloadAllPdf.url = (options?: RouteQueryOptions) => {
    return downloadAllPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
downloadAllPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAllPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
downloadAllPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAllPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
    const downloadAllPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadAllPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
        downloadAllPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAllPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAllPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
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
* @see \App\Http\Controllers\Reseller\InvoiceController::show
 * @see app/Http/Controllers/Reseller/InvoiceController.php:109
 * @route '/reseller/invoices/{invoiceNumber}'
 */
export const show = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/reseller/invoices/{invoiceNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::show
 * @see app/Http/Controllers/Reseller/InvoiceController.php:109
 * @route '/reseller/invoices/{invoiceNumber}'
 */
show.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::show
 * @see app/Http/Controllers/Reseller/InvoiceController.php:109
 * @route '/reseller/invoices/{invoiceNumber}'
 */
show.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::show
 * @see app/Http/Controllers/Reseller/InvoiceController.php:109
 * @route '/reseller/invoices/{invoiceNumber}'
 */
show.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\InvoiceController::show
 * @see app/Http/Controllers/Reseller/InvoiceController.php:109
 * @route '/reseller/invoices/{invoiceNumber}'
 */
    const showForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::show
 * @see app/Http/Controllers/Reseller/InvoiceController.php:109
 * @route '/reseller/invoices/{invoiceNumber}'
 */
        showForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::show
 * @see app/Http/Controllers/Reseller/InvoiceController.php:109
 * @route '/reseller/invoices/{invoiceNumber}'
 */
        showForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
export const downloadPdf = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

downloadPdf.definition = {
    methods: ["get","head"],
    url: '/reseller/invoices/{invoiceNumber}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
downloadPdf.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return downloadPdf.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
downloadPdf.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
downloadPdf.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
    const downloadPdfForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
        downloadPdfForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
        downloadPdfForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadPdf.form = downloadPdfForm
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::streamPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
export const streamPdf = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamPdf.url(args, options),
    method: 'get',
})

streamPdf.definition = {
    methods: ["get","head"],
    url: '/reseller/invoices/{invoiceNumber}/stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::streamPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
streamPdf.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return streamPdf.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::streamPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
streamPdf.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::streamPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
streamPdf.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streamPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\InvoiceController::streamPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
    const streamPdfForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: streamPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::streamPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
        streamPdfForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::streamPdf
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
        streamPdfForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    streamPdf.form = streamPdfForm
const InvoiceController = { index, downloadAllPdf, show, downloadPdf, streamPdf }

export default InvoiceController