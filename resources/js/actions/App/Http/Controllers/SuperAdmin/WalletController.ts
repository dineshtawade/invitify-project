import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::index
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/wallets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::index
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::index
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::index
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::index
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::index
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::index
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
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
* @see \App\Http\Controllers\SuperAdmin\WalletController::approveRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:40
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/approve'
 */
export const approveRedemption = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRedemption.url(args, options),
    method: 'post',
})

approveRedemption.definition = {
    methods: ["post"],
    url: '/super-admin/wallets/redemptions/{redemptionRequest}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::approveRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:40
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/approve'
 */
approveRedemption.url = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { redemptionRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { redemptionRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    redemptionRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        redemptionRequest: typeof args.redemptionRequest === 'object'
                ? args.redemptionRequest.id
                : args.redemptionRequest,
                }

    return approveRedemption.definition.url
            .replace('{redemptionRequest}', parsedArgs.redemptionRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::approveRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:40
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/approve'
 */
approveRedemption.post = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRedemption.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::approveRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:40
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/approve'
 */
    const approveRedemptionForm = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approveRedemption.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::approveRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:40
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/approve'
 */
        approveRedemptionForm.post = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approveRedemption.url(args, options),
            method: 'post',
        })
    
    approveRedemption.form = approveRedemptionForm
/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::rejectRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:73
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/reject'
 */
export const rejectRedemption = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectRedemption.url(args, options),
    method: 'post',
})

rejectRedemption.definition = {
    methods: ["post"],
    url: '/super-admin/wallets/redemptions/{redemptionRequest}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::rejectRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:73
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/reject'
 */
rejectRedemption.url = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { redemptionRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { redemptionRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    redemptionRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        redemptionRequest: typeof args.redemptionRequest === 'object'
                ? args.redemptionRequest.id
                : args.redemptionRequest,
                }

    return rejectRedemption.definition.url
            .replace('{redemptionRequest}', parsedArgs.redemptionRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::rejectRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:73
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/reject'
 */
rejectRedemption.post = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectRedemption.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::rejectRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:73
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/reject'
 */
    const rejectRedemptionForm = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rejectRedemption.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::rejectRedemption
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:73
 * @route '/super-admin/wallets/redemptions/{redemptionRequest}/reject'
 */
        rejectRedemptionForm.post = (args: { redemptionRequest: number | { id: number } } | [redemptionRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rejectRedemption.url(args, options),
            method: 'post',
        })
    
    rejectRedemption.form = rejectRedemptionForm
const WalletController = { index, approveRedemption, rejectRedemption }

export default WalletController