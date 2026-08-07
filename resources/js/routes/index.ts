import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
 * @see routes/web.php:8
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:8
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:8
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:8
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:8
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:8
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:8
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
 * @see routes/web.php:17
 * @route '/privacy-policy'
 */
export const privacyPolicy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacyPolicy.url(options),
    method: 'get',
})

privacyPolicy.definition = {
    methods: ["get","head"],
    url: '/privacy-policy',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:17
 * @route '/privacy-policy'
 */
privacyPolicy.url = (options?: RouteQueryOptions) => {
    return privacyPolicy.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:17
 * @route '/privacy-policy'
 */
privacyPolicy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacyPolicy.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:17
 * @route '/privacy-policy'
 */
privacyPolicy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: privacyPolicy.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:17
 * @route '/privacy-policy'
 */
    const privacyPolicyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: privacyPolicy.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:17
 * @route '/privacy-policy'
 */
        privacyPolicyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: privacyPolicy.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:17
 * @route '/privacy-policy'
 */
        privacyPolicyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: privacyPolicy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    privacyPolicy.form = privacyPolicyForm
/**
 * @see routes/web.php:21
 * @route '/terms-and-conditions'
 */
export const termsAndConditions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: termsAndConditions.url(options),
    method: 'get',
})

termsAndConditions.definition = {
    methods: ["get","head"],
    url: '/terms-and-conditions',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:21
 * @route '/terms-and-conditions'
 */
termsAndConditions.url = (options?: RouteQueryOptions) => {
    return termsAndConditions.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:21
 * @route '/terms-and-conditions'
 */
termsAndConditions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: termsAndConditions.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:21
 * @route '/terms-and-conditions'
 */
termsAndConditions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: termsAndConditions.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:21
 * @route '/terms-and-conditions'
 */
    const termsAndConditionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: termsAndConditions.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:21
 * @route '/terms-and-conditions'
 */
        termsAndConditionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: termsAndConditions.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:21
 * @route '/terms-and-conditions'
 */
        termsAndConditionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: termsAndConditions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    termsAndConditions.form = termsAndConditionsForm
/**
 * @see routes/web.php:25
 * @route '/refund-policy'
 */
export const refundPolicy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: refundPolicy.url(options),
    method: 'get',
})

refundPolicy.definition = {
    methods: ["get","head"],
    url: '/refund-policy',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:25
 * @route '/refund-policy'
 */
refundPolicy.url = (options?: RouteQueryOptions) => {
    return refundPolicy.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:25
 * @route '/refund-policy'
 */
refundPolicy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: refundPolicy.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:25
 * @route '/refund-policy'
 */
refundPolicy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: refundPolicy.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:25
 * @route '/refund-policy'
 */
    const refundPolicyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: refundPolicy.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:25
 * @route '/refund-policy'
 */
        refundPolicyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: refundPolicy.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:25
 * @route '/refund-policy'
 */
        refundPolicyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: refundPolicy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    refundPolicy.form = refundPolicyForm
/**
 * @see routes/web.php:29
 * @route '/disclaimer'
 */
export const disclaimer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disclaimer.url(options),
    method: 'get',
})

disclaimer.definition = {
    methods: ["get","head"],
    url: '/disclaimer',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:29
 * @route '/disclaimer'
 */
disclaimer.url = (options?: RouteQueryOptions) => {
    return disclaimer.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:29
 * @route '/disclaimer'
 */
disclaimer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disclaimer.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:29
 * @route '/disclaimer'
 */
disclaimer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: disclaimer.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:29
 * @route '/disclaimer'
 */
    const disclaimerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: disclaimer.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:29
 * @route '/disclaimer'
 */
        disclaimerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disclaimer.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:29
 * @route '/disclaimer'
 */
        disclaimerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disclaimer.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    disclaimer.form = disclaimerForm
/**
 * @see routes/web.php:33
 * @route '/cookie-policy'
 */
export const cookiePolicy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cookiePolicy.url(options),
    method: 'get',
})

cookiePolicy.definition = {
    methods: ["get","head"],
    url: '/cookie-policy',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:33
 * @route '/cookie-policy'
 */
cookiePolicy.url = (options?: RouteQueryOptions) => {
    return cookiePolicy.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:33
 * @route '/cookie-policy'
 */
cookiePolicy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cookiePolicy.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:33
 * @route '/cookie-policy'
 */
cookiePolicy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cookiePolicy.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:33
 * @route '/cookie-policy'
 */
    const cookiePolicyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cookiePolicy.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:33
 * @route '/cookie-policy'
 */
        cookiePolicyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cookiePolicy.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:33
 * @route '/cookie-policy'
 */
        cookiePolicyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cookiePolicy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cookiePolicy.form = cookiePolicyForm
/**
 * @see routes/web.php:77
 * @route '/apply-referral'
 */
export const applyReferral = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyReferral.url(options),
    method: 'post',
})

applyReferral.definition = {
    methods: ["post"],
    url: '/apply-referral',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:77
 * @route '/apply-referral'
 */
applyReferral.url = (options?: RouteQueryOptions) => {
    return applyReferral.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:77
 * @route '/apply-referral'
 */
applyReferral.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyReferral.url(options),
    method: 'post',
})

    /**
 * @see routes/web.php:77
 * @route '/apply-referral'
 */
    const applyReferralForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: applyReferral.url(options),
        method: 'post',
    })

            /**
 * @see routes/web.php:77
 * @route '/apply-referral'
 */
        applyReferralForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: applyReferral.url(options),
            method: 'post',
        })
    
    applyReferral.form = applyReferralForm
/**
 * @see routes/web.php:92
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:92
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:92
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:92
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:92
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:92
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:92
 * @route '/dashboard'
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