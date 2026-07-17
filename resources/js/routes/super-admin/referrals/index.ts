import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::storeCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:0
 * @route '/super-admin/referrals/codes'
 */
export const storeCode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCode.url(options),
    method: 'post',
})

storeCode.definition = {
    methods: ["post"],
    url: '/super-admin/referrals/codes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::storeCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:0
 * @route '/super-admin/referrals/codes'
 */
storeCode.url = (options?: RouteQueryOptions) => {
    return storeCode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::storeCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:0
 * @route '/super-admin/referrals/codes'
 */
storeCode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCode.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::storeCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:0
 * @route '/super-admin/referrals/codes'
 */
    const storeCodeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCode.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::storeCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:0
 * @route '/super-admin/referrals/codes'
 */
        storeCodeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCode.url(options),
            method: 'post',
        })
    
    storeCode.form = storeCodeForm
/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::assignAllocation
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:52
 * @route '/super-admin/referrals/assign-allocation'
 */
export const assignAllocation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignAllocation.url(options),
    method: 'post',
})

assignAllocation.definition = {
    methods: ["post"],
    url: '/super-admin/referrals/assign-allocation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::assignAllocation
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:52
 * @route '/super-admin/referrals/assign-allocation'
 */
assignAllocation.url = (options?: RouteQueryOptions) => {
    return assignAllocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::assignAllocation
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:52
 * @route '/super-admin/referrals/assign-allocation'
 */
assignAllocation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignAllocation.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::assignAllocation
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:52
 * @route '/super-admin/referrals/assign-allocation'
 */
    const assignAllocationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignAllocation.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::assignAllocation
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:52
 * @route '/super-admin/referrals/assign-allocation'
 */
        assignAllocationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignAllocation.url(options),
            method: 'post',
        })
    
    assignAllocation.form = assignAllocationForm
/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::updatePermissions
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:88
 * @route '/super-admin/referrals/{user}/permissions'
 */
export const updatePermissions = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePermissions.url(args, options),
    method: 'post',
})

updatePermissions.definition = {
    methods: ["post"],
    url: '/super-admin/referrals/{user}/permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::updatePermissions
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:88
 * @route '/super-admin/referrals/{user}/permissions'
 */
updatePermissions.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return updatePermissions.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::updatePermissions
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:88
 * @route '/super-admin/referrals/{user}/permissions'
 */
updatePermissions.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePermissions.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::updatePermissions
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:88
 * @route '/super-admin/referrals/{user}/permissions'
 */
    const updatePermissionsForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePermissions.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::updatePermissions
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:88
 * @route '/super-admin/referrals/{user}/permissions'
 */
        updatePermissionsForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePermissions.url(args, options),
            method: 'post',
        })
    
    updatePermissions.form = updatePermissionsForm
/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::toggleCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:105
 * @route '/super-admin/referrals/codes/{referralCode}/toggle'
 */
export const toggleCode = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCode.url(args, options),
    method: 'post',
})

toggleCode.definition = {
    methods: ["post"],
    url: '/super-admin/referrals/codes/{referralCode}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::toggleCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:105
 * @route '/super-admin/referrals/codes/{referralCode}/toggle'
 */
toggleCode.url = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { referralCode: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { referralCode: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    referralCode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        referralCode: typeof args.referralCode === 'object'
                ? args.referralCode.id
                : args.referralCode,
                }

    return toggleCode.definition.url
            .replace('{referralCode}', parsedArgs.referralCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::toggleCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:105
 * @route '/super-admin/referrals/codes/{referralCode}/toggle'
 */
toggleCode.post = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCode.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::toggleCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:105
 * @route '/super-admin/referrals/codes/{referralCode}/toggle'
 */
    const toggleCodeForm = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleCode.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::toggleCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:105
 * @route '/super-admin/referrals/codes/{referralCode}/toggle'
 */
        toggleCodeForm.post = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleCode.url(args, options),
            method: 'post',
        })
    
    toggleCode.form = toggleCodeForm
/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::destroyCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:112
 * @route '/super-admin/referrals/codes/{referralCode}'
 */
export const destroyCode = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyCode.url(args, options),
    method: 'delete',
})

destroyCode.definition = {
    methods: ["delete"],
    url: '/super-admin/referrals/codes/{referralCode}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::destroyCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:112
 * @route '/super-admin/referrals/codes/{referralCode}'
 */
destroyCode.url = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { referralCode: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { referralCode: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    referralCode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        referralCode: typeof args.referralCode === 'object'
                ? args.referralCode.id
                : args.referralCode,
                }

    return destroyCode.definition.url
            .replace('{referralCode}', parsedArgs.referralCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::destroyCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:112
 * @route '/super-admin/referrals/codes/{referralCode}'
 */
destroyCode.delete = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyCode.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::destroyCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:112
 * @route '/super-admin/referrals/codes/{referralCode}'
 */
    const destroyCodeForm = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyCode.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::destroyCode
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:112
 * @route '/super-admin/referrals/codes/{referralCode}'
 */
        destroyCodeForm.delete = (args: { referralCode: number | { id: number } } | [referralCode: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyCode.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyCode.form = destroyCodeForm
const referrals = {
    storeCode: Object.assign(storeCode, storeCode),
assignAllocation: Object.assign(assignAllocation, assignAllocation),
updatePermissions: Object.assign(updatePermissions, updatePermissions),
toggleCode: Object.assign(toggleCode, toggleCode),
destroyCode: Object.assign(destroyCode, destroyCode),
}

export default referrals