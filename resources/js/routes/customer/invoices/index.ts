import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
export const show = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/customer/invoices/{invoiceNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
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
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
show.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
show.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
    const showForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
 */
        showForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:159
 * @route '/customer/invoices/{invoiceNumber}'
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
* @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
export const download = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/customer/invoices/{invoiceNumber}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
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
* @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
download.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
download.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
    const downloadForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
 */
        downloadForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:212
 * @route '/customer/invoices/{invoiceNumber}/download'
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
* @see \App\Http\Controllers\InvoiceController::stream
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
export const stream = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ["get","head"],
    url: '/customer/invoices/{invoiceNumber}/stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::stream
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
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
* @see \App\Http\Controllers\InvoiceController::stream
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
stream.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::stream
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
stream.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::stream
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
    const streamForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stream.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::stream
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
 */
        streamForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::stream
 * @see app/Http/Controllers/InvoiceController.php:236
 * @route '/customer/invoices/{invoiceNumber}/stream'
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
    show: Object.assign(show, show),
download: Object.assign(download, download),
stream: Object.assign(stream, stream),
}

export default invoices