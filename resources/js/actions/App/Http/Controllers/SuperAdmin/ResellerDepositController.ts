import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::index
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/resellers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::index
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::index
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::index
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::index
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::index
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::index
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
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
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::approve
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:52
 * @route '/super-admin/resellers/deposits/{deposit}/approve'
 */
export const approve = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/super-admin/resellers/deposits/{deposit}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::approve
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:52
 * @route '/super-admin/resellers/deposits/{deposit}/approve'
 */
approve.url = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { deposit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { deposit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    deposit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        deposit: typeof args.deposit === 'object'
                ? args.deposit.id
                : args.deposit,
                }

    return approve.definition.url
            .replace('{deposit}', parsedArgs.deposit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::approve
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:52
 * @route '/super-admin/resellers/deposits/{deposit}/approve'
 */
approve.post = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::approve
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:52
 * @route '/super-admin/resellers/deposits/{deposit}/approve'
 */
    const approveForm = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::approve
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:52
 * @route '/super-admin/resellers/deposits/{deposit}/approve'
 */
        approveForm.post = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::reject
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:82
 * @route '/super-admin/resellers/deposits/{deposit}/reject'
 */
export const reject = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/super-admin/resellers/deposits/{deposit}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::reject
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:82
 * @route '/super-admin/resellers/deposits/{deposit}/reject'
 */
reject.url = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { deposit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { deposit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    deposit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        deposit: typeof args.deposit === 'object'
                ? args.deposit.id
                : args.deposit,
                }

    return reject.definition.url
            .replace('{deposit}', parsedArgs.deposit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::reject
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:82
 * @route '/super-admin/resellers/deposits/{deposit}/reject'
 */
reject.post = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::reject
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:82
 * @route '/super-admin/resellers/deposits/{deposit}/reject'
 */
    const rejectForm = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::reject
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:82
 * @route '/super-admin/resellers/deposits/{deposit}/reject'
 */
        rejectForm.post = (args: { deposit: number | { id: number } } | [deposit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::adjustBalance
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:101
 * @route '/super-admin/resellers/adjust-balance'
 */
export const adjustBalance = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjustBalance.url(options),
    method: 'post',
})

adjustBalance.definition = {
    methods: ["post"],
    url: '/super-admin/resellers/adjust-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::adjustBalance
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:101
 * @route '/super-admin/resellers/adjust-balance'
 */
adjustBalance.url = (options?: RouteQueryOptions) => {
    return adjustBalance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::adjustBalance
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:101
 * @route '/super-admin/resellers/adjust-balance'
 */
adjustBalance.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjustBalance.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::adjustBalance
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:101
 * @route '/super-admin/resellers/adjust-balance'
 */
    const adjustBalanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: adjustBalance.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::adjustBalance
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:101
 * @route '/super-admin/resellers/adjust-balance'
 */
        adjustBalanceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: adjustBalance.url(options),
            method: 'post',
        })
    
    adjustBalance.form = adjustBalanceForm
/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::updateOnlineBonus
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:41
 * @route '/super-admin/resellers/update-online-bonus'
 */
export const updateOnlineBonus = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateOnlineBonus.url(options),
    method: 'post',
})

updateOnlineBonus.definition = {
    methods: ["post"],
    url: '/super-admin/resellers/update-online-bonus',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::updateOnlineBonus
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:41
 * @route '/super-admin/resellers/update-online-bonus'
 */
updateOnlineBonus.url = (options?: RouteQueryOptions) => {
    return updateOnlineBonus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::updateOnlineBonus
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:41
 * @route '/super-admin/resellers/update-online-bonus'
 */
updateOnlineBonus.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateOnlineBonus.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::updateOnlineBonus
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:41
 * @route '/super-admin/resellers/update-online-bonus'
 */
    const updateOnlineBonusForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateOnlineBonus.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::updateOnlineBonus
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:41
 * @route '/super-admin/resellers/update-online-bonus'
 */
        updateOnlineBonusForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateOnlineBonus.url(options),
            method: 'post',
        })
    
    updateOnlineBonus.form = updateOnlineBonusForm
const ResellerDepositController = { index, approve, reject, adjustBalance, updateOnlineBonus }

export default ResellerDepositController