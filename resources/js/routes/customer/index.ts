import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import userTemplates from './user-templates'
import subscriptionsF46e2f from './subscriptions'
import miniWebsites from './mini-websites'
import businessWebsites from './business-websites'
import businessCards from './business-cards'
import staticTemplates from './static-templates'
/**
 * @see routes/web.php:286
 * @route '/customer/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/customer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:286
 * @route '/customer/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:286
 * @route '/customer/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:286
 * @route '/customer/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:286
 * @route '/customer/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:286
 * @route '/customer/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:286
 * @route '/customer/dashboard'
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
* @see \App\Http\Controllers\Customer\TemplateController::templates
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
export const templates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

templates.definition = {
    methods: ["get","head"],
    url: '/customer/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::templates
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
templates.url = (options?: RouteQueryOptions) => {
    return templates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::templates
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
templates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::templates
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
templates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: templates.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::templates
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
    const templatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: templates.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::templates
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
 */
        templatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: templates.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::templates
 * @see app/Http/Controllers/Customer/TemplateController.php:19
 * @route '/customer/templates'
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
* @see \App\Http\Controllers\Customer\TemplateController::myInvitations
 * @see app/Http/Controllers/Customer/TemplateController.php:180
 * @route '/customer/my-invitations'
 */
export const myInvitations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myInvitations.url(options),
    method: 'get',
})

myInvitations.definition = {
    methods: ["get","head"],
    url: '/customer/my-invitations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::myInvitations
 * @see app/Http/Controllers/Customer/TemplateController.php:180
 * @route '/customer/my-invitations'
 */
myInvitations.url = (options?: RouteQueryOptions) => {
    return myInvitations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::myInvitations
 * @see app/Http/Controllers/Customer/TemplateController.php:180
 * @route '/customer/my-invitations'
 */
myInvitations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myInvitations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::myInvitations
 * @see app/Http/Controllers/Customer/TemplateController.php:180
 * @route '/customer/my-invitations'
 */
myInvitations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myInvitations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::myInvitations
 * @see app/Http/Controllers/Customer/TemplateController.php:180
 * @route '/customer/my-invitations'
 */
    const myInvitationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: myInvitations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::myInvitations
 * @see app/Http/Controllers/Customer/TemplateController.php:180
 * @route '/customer/my-invitations'
 */
        myInvitationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myInvitations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::myInvitations
 * @see app/Http/Controllers/Customer/TemplateController.php:180
 * @route '/customer/my-invitations'
 */
        myInvitationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myInvitations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    myInvitations.form = myInvitationsForm
/**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscriptions
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
export const subscriptions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subscriptions.url(options),
    method: 'get',
})

subscriptions.definition = {
    methods: ["get","head"],
    url: '/customer/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscriptions
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
subscriptions.url = (options?: RouteQueryOptions) => {
    return subscriptions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscriptions
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
subscriptions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subscriptions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscriptions
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
subscriptions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: subscriptions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscriptions
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
    const subscriptionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: subscriptions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscriptions
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
        subscriptionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subscriptions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\SubscriptionController::subscriptions
 * @see app/Http/Controllers/Customer/SubscriptionController.php:15
 * @route '/customer/subscriptions'
 */
        subscriptionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subscriptions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    subscriptions.form = subscriptionsForm
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::businessCardPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
export const businessCardPlans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: businessCardPlans.url(options),
    method: 'get',
})

businessCardPlans.definition = {
    methods: ["get","head"],
    url: '/customer/business-card-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::businessCardPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
businessCardPlans.url = (options?: RouteQueryOptions) => {
    return businessCardPlans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\BusinessCardController::businessCardPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
businessCardPlans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: businessCardPlans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\BusinessCardController::businessCardPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
businessCardPlans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: businessCardPlans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\BusinessCardController::businessCardPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
    const businessCardPlansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: businessCardPlans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::businessCardPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
        businessCardPlansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: businessCardPlans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\BusinessCardController::businessCardPlans
 * @see app/Http/Controllers/Customer/BusinessCardController.php:90
 * @route '/customer/business-card-plans'
 */
        businessCardPlansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: businessCardPlans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    businessCardPlans.form = businessCardPlansForm
const customer = {
    templates: Object.assign(templates, templates),
dashboard: Object.assign(dashboard, dashboard),
userTemplates: Object.assign(userTemplates, userTemplates),
myInvitations: Object.assign(myInvitations, myInvitations),
subscriptions: Object.assign(subscriptions, subscriptionsF46e2f),
miniWebsites: Object.assign(miniWebsites, miniWebsites),
businessWebsites: Object.assign(businessWebsites, businessWebsites),
businessCards: Object.assign(businessCards, businessCards),
businessCardPlans: Object.assign(businessCardPlans, businessCardPlans),
staticTemplates: Object.assign(staticTemplates, staticTemplates),
}

export default customer