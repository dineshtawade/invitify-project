import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import users from './users'
import editorRequests from './editor-requests'
import templatesD41748 from './templates'
import customIcons from './custom-icons'
import paymentSettings from './payment-settings'
import coupons from './coupons'
import settings69f00b from './settings'
import businessCardPlans from './business-card-plans'
import referralsA7ebb0 from './referrals'
import walletsE2845c from './wallets'
import resellers91a8b1 from './resellers'
/**
* @see \App\Http\Controllers\SuperAdmin\DashboardController::dashboard
 * @see app/Http/Controllers/SuperAdmin/DashboardController.php:15
 * @route '/super-admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/super-admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\DashboardController::dashboard
 * @see app/Http/Controllers/SuperAdmin/DashboardController.php:15
 * @route '/super-admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\DashboardController::dashboard
 * @see app/Http/Controllers/SuperAdmin/DashboardController.php:15
 * @route '/super-admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\DashboardController::dashboard
 * @see app/Http/Controllers/SuperAdmin/DashboardController.php:15
 * @route '/super-admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\DashboardController::dashboard
 * @see app/Http/Controllers/SuperAdmin/DashboardController.php:15
 * @route '/super-admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\DashboardController::dashboard
 * @see app/Http/Controllers/SuperAdmin/DashboardController.php:15
 * @route '/super-admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\DashboardController::dashboard
 * @see app/Http/Controllers/SuperAdmin/DashboardController.php:15
 * @route '/super-admin/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\SuperAdmin\TransactionController::transactions
 * @see app/Http/Controllers/SuperAdmin/TransactionController.php:14
 * @route '/super-admin/transactions'
 */
export const transactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/super-admin/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TransactionController::transactions
 * @see app/Http/Controllers/SuperAdmin/TransactionController.php:14
 * @route '/super-admin/transactions'
 */
transactions.url = (options?: RouteQueryOptions) => {
    return transactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TransactionController::transactions
 * @see app/Http/Controllers/SuperAdmin/TransactionController.php:14
 * @route '/super-admin/transactions'
 */
transactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\TransactionController::transactions
 * @see app/Http/Controllers/SuperAdmin/TransactionController.php:14
 * @route '/super-admin/transactions'
 */
transactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TransactionController::transactions
 * @see app/Http/Controllers/SuperAdmin/TransactionController.php:14
 * @route '/super-admin/transactions'
 */
    const transactionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: transactions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TransactionController::transactions
 * @see app/Http/Controllers/SuperAdmin/TransactionController.php:14
 * @route '/super-admin/transactions'
 */
        transactionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transactions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\TransactionController::transactions
 * @see app/Http/Controllers/SuperAdmin/TransactionController.php:14
 * @route '/super-admin/transactions'
 */
        transactionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transactions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    transactions.form = transactionsForm
/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::templates
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
export const templates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

templates.definition = {
    methods: ["get","head"],
    url: '/super-admin/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::templates
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
templates.url = (options?: RouteQueryOptions) => {
    return templates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::templates
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
templates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::templates
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
templates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: templates.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::templates
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
    const templatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: templates.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::templates
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
        templatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: templates.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\TemplateController::templates
 * @see app/Http/Controllers/SuperAdmin/TemplateController.php:15
 * @route '/super-admin/templates'
 */
        templatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: templates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    templates.form = templatesForm
/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::settings
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:16
 * @route '/super-admin/settings'
 */
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/super-admin/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::settings
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:16
 * @route '/super-admin/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::settings
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:16
 * @route '/super-admin/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::settings
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:16
 * @route '/super-admin/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::settings
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:16
 * @route '/super-admin/settings'
 */
    const settingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: settings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::settings
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:16
 * @route '/super-admin/settings'
 */
        settingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\SettingsController::settings
 * @see app/Http/Controllers/SuperAdmin/SettingsController.php:16
 * @route '/super-admin/settings'
 */
        settingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    settings.form = settingsForm
/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::referrals
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:14
 * @route '/super-admin/referrals'
 */
export const referrals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: referrals.url(options),
    method: 'get',
})

referrals.definition = {
    methods: ["get","head"],
    url: '/super-admin/referrals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::referrals
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:14
 * @route '/super-admin/referrals'
 */
referrals.url = (options?: RouteQueryOptions) => {
    return referrals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::referrals
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:14
 * @route '/super-admin/referrals'
 */
referrals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: referrals.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::referrals
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:14
 * @route '/super-admin/referrals'
 */
referrals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: referrals.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::referrals
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:14
 * @route '/super-admin/referrals'
 */
    const referralsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: referrals.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::referrals
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:14
 * @route '/super-admin/referrals'
 */
        referralsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: referrals.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\ReferralController::referrals
 * @see app/Http/Controllers/SuperAdmin/ReferralController.php:14
 * @route '/super-admin/referrals'
 */
        referralsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: referrals.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    referrals.form = referralsForm
/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::wallets
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
export const wallets = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wallets.url(options),
    method: 'get',
})

wallets.definition = {
    methods: ["get","head"],
    url: '/super-admin/wallets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::wallets
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
wallets.url = (options?: RouteQueryOptions) => {
    return wallets.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::wallets
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
wallets.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wallets.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\WalletController::wallets
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
wallets.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: wallets.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::wallets
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
    const walletsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: wallets.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::wallets
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
        walletsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wallets.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\WalletController::wallets
 * @see app/Http/Controllers/SuperAdmin/WalletController.php:14
 * @route '/super-admin/wallets'
 */
        walletsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wallets.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    wallets.form = walletsForm
/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::resellers
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
export const resellers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resellers.url(options),
    method: 'get',
})

resellers.definition = {
    methods: ["get","head"],
    url: '/super-admin/resellers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::resellers
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
resellers.url = (options?: RouteQueryOptions) => {
    return resellers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::resellers
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
resellers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resellers.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::resellers
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
resellers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resellers.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::resellers
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
    const resellersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resellers.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::resellers
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
        resellersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resellers.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\ResellerDepositController::resellers
 * @see app/Http/Controllers/SuperAdmin/ResellerDepositController.php:15
 * @route '/super-admin/resellers'
 */
        resellersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resellers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resellers.form = resellersForm
const superAdmin = {
    dashboard: Object.assign(dashboard, dashboard),
transactions: Object.assign(transactions, transactions),
users: Object.assign(users, users),
editorRequests: Object.assign(editorRequests, editorRequests),
templates: Object.assign(templates, templatesD41748),
customIcons: Object.assign(customIcons, customIcons),
paymentSettings: Object.assign(paymentSettings, paymentSettings),
coupons: Object.assign(coupons, coupons),
settings: Object.assign(settings, settings69f00b),
businessCardPlans: Object.assign(businessCardPlans, businessCardPlans),
referrals: Object.assign(referrals, referralsA7ebb0),
wallets: Object.assign(wallets, walletsE2845c),
resellers: Object.assign(resellers, resellers91a8b1),
}

export default superAdmin