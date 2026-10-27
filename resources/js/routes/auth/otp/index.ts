import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::send
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/auth/otp/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::send
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::send
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::send
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::send
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:25
 * @route '/auth/otp/send'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resend
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
export const resend = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

resend.definition = {
    methods: ["post"],
    url: '/auth/otp/resend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resend
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
resend.url = (options?: RouteQueryOptions) => {
    return resend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resend
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
resend.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resend
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
    const resendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resend.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::resend
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:118
 * @route '/auth/otp/resend'
 */
        resendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resend.url(options),
            method: 'post',
        })
    
    resend.form = resendForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verify
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/auth/otp/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verify
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verify
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verify
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpAuthController::verify
 * @see app/Http/Controllers/Auth/EmailOtpAuthController.php:180
 * @route '/auth/otp/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const otp = {
    send: Object.assign(send, send),
resend: Object.assign(resend, resend),
verify: Object.assign(verify, verify),
}

export default otp