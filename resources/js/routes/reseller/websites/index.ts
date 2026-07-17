import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\HostingController::index
 * @see app/Http/Controllers/Reseller/HostingController.php:15
 * @route '/reseller/websites'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reseller/websites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\HostingController::index
 * @see app/Http/Controllers/Reseller/HostingController.php:15
 * @route '/reseller/websites'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\HostingController::index
 * @see app/Http/Controllers/Reseller/HostingController.php:15
 * @route '/reseller/websites'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\HostingController::index
 * @see app/Http/Controllers/Reseller/HostingController.php:15
 * @route '/reseller/websites'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\HostingController::index
 * @see app/Http/Controllers/Reseller/HostingController.php:15
 * @route '/reseller/websites'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\HostingController::index
 * @see app/Http/Controllers/Reseller/HostingController.php:15
 * @route '/reseller/websites'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\HostingController::index
 * @see app/Http/Controllers/Reseller/HostingController.php:15
 * @route '/reseller/websites'
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
* @see \App\Http\Controllers\Reseller\HostingController::host
 * @see app/Http/Controllers/Reseller/HostingController.php:69
 * @route '/reseller/websites/{type}/{id}/host'
 */
export const host = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: host.url(args, options),
    method: 'post',
})

host.definition = {
    methods: ["post"],
    url: '/reseller/websites/{type}/{id}/host',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\HostingController::host
 * @see app/Http/Controllers/Reseller/HostingController.php:69
 * @route '/reseller/websites/{type}/{id}/host'
 */
host.url = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    type: args[0],
                    id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        type: args.type,
                                id: args.id,
                }

    return host.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\HostingController::host
 * @see app/Http/Controllers/Reseller/HostingController.php:69
 * @route '/reseller/websites/{type}/{id}/host'
 */
host.post = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: host.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\HostingController::host
 * @see app/Http/Controllers/Reseller/HostingController.php:69
 * @route '/reseller/websites/{type}/{id}/host'
 */
    const hostForm = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: host.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\HostingController::host
 * @see app/Http/Controllers/Reseller/HostingController.php:69
 * @route '/reseller/websites/{type}/{id}/host'
 */
        hostForm.post = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: host.url(args, options),
            method: 'post',
        })
    
    host.form = hostForm
const websites = {
    index: Object.assign(index, index),
host: Object.assign(host, host),
}

export default websites