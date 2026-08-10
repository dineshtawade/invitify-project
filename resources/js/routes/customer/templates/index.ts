import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\TemplateController::customize
 * @see app/Http/Controllers/Customer/TemplateController.php:56
 * @route '/templates/{template}/customize'
 */
export const customize = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(args, options),
    method: 'get',
})

customize.definition = {
    methods: ["get","head"],
    url: '/templates/{template}/customize',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::customize
 * @see app/Http/Controllers/Customer/TemplateController.php:56
 * @route '/templates/{template}/customize'
 */
customize.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return customize.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::customize
 * @see app/Http/Controllers/Customer/TemplateController.php:56
 * @route '/templates/{template}/customize'
 */
customize.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\TemplateController::customize
 * @see app/Http/Controllers/Customer/TemplateController.php:56
 * @route '/templates/{template}/customize'
 */
customize.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customize.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::customize
 * @see app/Http/Controllers/Customer/TemplateController.php:56
 * @route '/templates/{template}/customize'
 */
    const customizeForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: customize.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::customize
 * @see app/Http/Controllers/Customer/TemplateController.php:56
 * @route '/templates/{template}/customize'
 */
        customizeForm.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customize.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\TemplateController::customize
 * @see app/Http/Controllers/Customer/TemplateController.php:56
 * @route '/templates/{template}/customize'
 */
        customizeForm.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customize.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    customize.form = customizeForm
/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:254
 * @route '/customer/templates/{template}/verify-referral'
 */
export const verifyReferral = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyReferral.url(args, options),
    method: 'post',
})

verifyReferral.definition = {
    methods: ["post"],
    url: '/customer/templates/{template}/verify-referral',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:254
 * @route '/customer/templates/{template}/verify-referral'
 */
verifyReferral.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return verifyReferral.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:254
 * @route '/customer/templates/{template}/verify-referral'
 */
verifyReferral.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyReferral.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:254
 * @route '/customer/templates/{template}/verify-referral'
 */
    const verifyReferralForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyReferral.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\TemplateController::verifyReferral
 * @see app/Http/Controllers/Customer/TemplateController.php:254
 * @route '/customer/templates/{template}/verify-referral'
 */
        verifyReferralForm.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyReferral.url(args, options),
            method: 'post',
        })
    
    verifyReferral.form = verifyReferralForm
const templates = {
    verifyReferral: Object.assign(verifyReferral, verifyReferral),
}

export default templates