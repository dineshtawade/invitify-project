import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\SubscriptionController::index
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customer/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\SubscriptionController::index
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\SubscriptionController::index
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\SubscriptionController::index
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\SubscriptionController::index
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\SubscriptionController::index
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\SubscriptionController::index
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
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
* @see \App\Http\Controllers\Customer\SubscriptionController::subscribe
 * @see app/Http/Controllers/Customer/SubscriptionController.php:27
 * @route '/customer/subscriptions'
 */
export const subscribe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

subscribe.definition = {
    methods: ["post"],
    url: '/customer/subscriptions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscribe
 * @see app/Http/Controllers/Customer/SubscriptionController.php:27
 * @route '/customer/subscriptions'
 */
subscribe.url = (options?: RouteQueryOptions) => {
    return subscribe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscribe
 * @see app/Http/Controllers/Customer/SubscriptionController.php:27
 * @route '/customer/subscriptions'
 */
subscribe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscribe
 * @see app/Http/Controllers/Customer/SubscriptionController.php:27
 * @route '/customer/subscriptions'
 */
    const subscribeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: subscribe.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscribe
 * @see app/Http/Controllers/Customer/SubscriptionController.php:27
 * @route '/customer/subscriptions'
 */
        subscribeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: subscribe.url(options),
            method: 'post',
        })
    
    subscribe.form = subscribeForm
const SubscriptionController = { index, subscribe }

export default SubscriptionController