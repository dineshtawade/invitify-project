import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import deposits from './deposits'
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
const resellers = {
    deposits: Object.assign(deposits, deposits),
adjustBalance: Object.assign(adjustBalance, adjustBalance),
updateOnlineBonus: Object.assign(updateOnlineBonus, updateOnlineBonus),
}

export default resellers