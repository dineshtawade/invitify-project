import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::login
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:305
 * @route '/auth/password/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/auth/password/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::login
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:305
 * @route '/auth/password/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::login
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:305
 * @route '/auth/password/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::login
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:305
 * @route '/auth/password/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: login.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::login
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:305
 * @route '/auth/password/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
    
    login.form = loginForm
const password = {
    login: Object.assign(login, login),
}

export default password