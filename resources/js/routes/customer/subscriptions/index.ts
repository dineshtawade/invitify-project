import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
const subscriptions = {
    subscribe: Object.assign(subscribe, subscribe),
}

export default subscriptions