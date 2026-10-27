import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
 * @route '/register'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::sendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:25
 * @route '/register/send-otp'
 */
export const sendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

sendOtp.definition = {
    methods: ["post"],
    url: '/register/send-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::sendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:25
 * @route '/register/send-otp'
 */
sendOtp.url = (options?: RouteQueryOptions) => {
    return sendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::sendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:25
 * @route '/register/send-otp'
 */
sendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\RegisterOtpController::sendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:25
 * @route '/register/send-otp'
 */
    const sendOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\RegisterOtpController::sendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:25
 * @route '/register/send-otp'
 */
        sendOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendOtp.url(options),
            method: 'post',
        })
    
    sendOtp.form = sendOtpForm
/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::resendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:171
 * @route '/register/resend-otp'
 */
export const resendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendOtp.url(options),
    method: 'post',
})

resendOtp.definition = {
    methods: ["post"],
    url: '/register/resend-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::resendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:171
 * @route '/register/resend-otp'
 */
resendOtp.url = (options?: RouteQueryOptions) => {
    return resendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::resendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:171
 * @route '/register/resend-otp'
 */
resendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\RegisterOtpController::resendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:171
 * @route '/register/resend-otp'
 */
    const resendOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resendOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\RegisterOtpController::resendOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:171
 * @route '/register/resend-otp'
 */
        resendOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resendOtp.url(options),
            method: 'post',
        })
    
    resendOtp.form = resendOtpForm
/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::verifyOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:234
 * @route '/register/verify-otp'
 */
export const verifyOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

verifyOtp.definition = {
    methods: ["post"],
    url: '/register/verify-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::verifyOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:234
 * @route '/register/verify-otp'
 */
verifyOtp.url = (options?: RouteQueryOptions) => {
    return verifyOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisterOtpController::verifyOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:234
 * @route '/register/verify-otp'
 */
verifyOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\RegisterOtpController::verifyOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:234
 * @route '/register/verify-otp'
 */
    const verifyOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\RegisterOtpController::verifyOtp
 * @see app/Http/Controllers/Auth/RegisterOtpController.php:234
 * @route '/register/verify-otp'
 */
        verifyOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyOtp.url(options),
            method: 'post',
        })
    
    verifyOtp.form = verifyOtpForm
const register = {
    store: Object.assign(store, store),
sendOtp: Object.assign(sendOtp, sendOtp),
resendOtp: Object.assign(resendOtp, resendOtp),
verifyOtp: Object.assign(verifyOtp, verifyOtp),
}

export default register