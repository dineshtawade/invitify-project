import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::index
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:18
 * @route '/super-admin/payment-settings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/payment-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::index
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:18
 * @route '/super-admin/payment-settings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::index
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:18
 * @route '/super-admin/payment-settings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::index
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:18
 * @route '/super-admin/payment-settings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::index
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:18
 * @route '/super-admin/payment-settings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::index
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:18
 * @route '/super-admin/payment-settings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::index
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:18
 * @route '/super-admin/payment-settings'
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
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::update
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:41
 * @route '/super-admin/payment-settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/super-admin/payment-settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::update
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:41
 * @route '/super-admin/payment-settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::update
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:41
 * @route '/super-admin/payment-settings'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::update
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:41
 * @route '/super-admin/payment-settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\PaymentSettingsController::update
 * @see app/Http/Controllers/SuperAdmin/PaymentSettingsController.php:41
 * @route '/super-admin/payment-settings'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const PaymentSettingsController = { index, update }

export default PaymentSettingsController