import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
const deposits = {
    approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
}

export default deposits