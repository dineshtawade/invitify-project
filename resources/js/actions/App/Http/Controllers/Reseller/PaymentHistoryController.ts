import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::index
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reseller/payment-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::index
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::index
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::index
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::index
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::index
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reseller\PaymentHistoryController::index
 * @see app/Http/Controllers/Reseller/PaymentHistoryController.php:10
 * @route '/reseller/payment-history'
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
const PaymentHistoryController = { index }

export default PaymentHistoryController