import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::sendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
export const sendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

sendOtp.definition = {
    methods: ["post"],
    url: '/auth/otp/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::sendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
sendOtp.url = (options?: RouteQueryOptions) => {
    return sendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::sendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
sendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::sendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
    const sendOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::sendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
        sendOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendOtp.url(options),
            method: 'post',
        })
    
    sendOtp.form = sendOtpForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
export const resendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendOtp.url(options),
    method: 'post',
})

resendOtp.definition = {
    methods: ["post"],
    url: '/auth/otp/resend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
resendOtp.url = (options?: RouteQueryOptions) => {
    return resendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
resendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
    const resendOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resendOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resendOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
        resendOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resendOtp.url(options),
            method: 'post',
        })
    
    resendOtp.form = resendOtpForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verifyOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
export const verifyOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

verifyOtp.definition = {
    methods: ["post"],
    url: '/auth/otp/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verifyOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
verifyOtp.url = (options?: RouteQueryOptions) => {
    return verifyOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verifyOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
verifyOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verifyOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
    const verifyOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verifyOtp
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
        verifyOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyOtp.url(options),
            method: 'post',
        })
    
    verifyOtp.form = verifyOtpForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::loginWithPassword
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:288
 * @route '/auth/password/login'
 */
export const loginWithPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: loginWithPassword.url(options),
    method: 'post',
})

loginWithPassword.definition = {
    methods: ["post"],
    url: '/auth/password/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::loginWithPassword
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:288
 * @route '/auth/password/login'
 */
loginWithPassword.url = (options?: RouteQueryOptions) => {
    return loginWithPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::loginWithPassword
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:288
 * @route '/auth/password/login'
 */
loginWithPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: loginWithPassword.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::loginWithPassword
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:288
 * @route '/auth/password/login'
 */
    const loginWithPasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: loginWithPassword.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::loginWithPassword
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:288
 * @route '/auth/password/login'
 */
        loginWithPasswordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: loginWithPassword.url(options),
            method: 'post',
        })
    
    loginWithPassword.form = loginWithPasswordForm
const EmailOtpAuthController = { sendOtp, resendOtp, verifyOtp, loginWithPassword }

export default EmailOtpAuthController