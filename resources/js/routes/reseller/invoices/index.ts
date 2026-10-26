import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAll
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
export const downloadAll = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAll.url(options),
    method: 'get',
})

downloadAll.definition = {
    methods: ["get","head"],
    url: '/reseller/invoices/download-all',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAll
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
downloadAll.url = (options?: RouteQueryOptions) => {
    return downloadAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAll
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
downloadAll.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAll.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAll
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
downloadAll.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAll.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAll
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
    const downloadAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadAll.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAll
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
        downloadAllForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAll.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::downloadAll
 * @see app/Http/Controllers/Reseller/InvoiceController.php:153
 * @route '/reseller/invoices/download-all'
 */
        downloadAllForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAll.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadAll.form = downloadAllForm
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
* @see \App\Http\Controllers\Reseller\InvoiceController::download
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
export const download = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/reseller/invoices/{invoiceNumber}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::download
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
download.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::download
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
download.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::download
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
download.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\InvoiceController::download
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
    const downloadForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::download
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
        downloadForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::download
 * @see app/Http/Controllers/Reseller/InvoiceController.php:127
 * @route '/reseller/invoices/{invoiceNumber}/download'
 */
        downloadForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::stream
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
export const stream = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ["get","head"],
    url: '/reseller/invoices/{invoiceNumber}/stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::stream
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
stream.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return stream.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\InvoiceController::stream
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
stream.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\InvoiceController::stream
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
stream.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\InvoiceController::stream
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
    const streamForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stream.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::stream
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
        streamForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\InvoiceController::stream
 * @see app/Http/Controllers/Reseller/InvoiceController.php:140
 * @route '/reseller/invoices/{invoiceNumber}/stream'
 */
        streamForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stream.form = streamForm
const invoices = {
    index: Object.assign(index, index),
downloadAll: Object.assign(downloadAll, downloadAll),
show: Object.assign(show, show),
download: Object.assign(download, download),
stream: Object.assign(stream, stream),
}

export default invoices