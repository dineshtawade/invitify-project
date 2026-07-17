import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
export const purchaseTemplate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchaseTemplate.url(options),
    method: 'post',
})

purchaseTemplate.definition = {
    methods: ["post"],
    url: '/reseller/purchase/template',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
purchaseTemplate.url = (options?: RouteQueryOptions) => {
    return purchaseTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
purchaseTemplate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchaseTemplate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
    const purchaseTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purchaseTemplate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
        purchaseTemplateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purchaseTemplate.url(options),
            method: 'post',
        })
    
    purchaseTemplate.form = purchaseTemplateForm
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseMiniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
export const purchaseMiniWebsite = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchaseMiniWebsite.url(options),
    method: 'post',
})

purchaseMiniWebsite.definition = {
    methods: ["post"],
    url: '/reseller/purchase/mini-website',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseMiniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
purchaseMiniWebsite.url = (options?: RouteQueryOptions) => {
    return purchaseMiniWebsite.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseMiniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
purchaseMiniWebsite.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchaseMiniWebsite.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseMiniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
    const purchaseMiniWebsiteForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purchaseMiniWebsite.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseMiniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
        purchaseMiniWebsiteForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purchaseMiniWebsite.url(options),
            method: 'post',
        })
    
    purchaseMiniWebsite.form = purchaseMiniWebsiteForm
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseBusinessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
export const purchaseBusinessWebsite = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchaseBusinessWebsite.url(options),
    method: 'post',
})

purchaseBusinessWebsite.definition = {
    methods: ["post"],
    url: '/reseller/purchase/business-website',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseBusinessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
purchaseBusinessWebsite.url = (options?: RouteQueryOptions) => {
    return purchaseBusinessWebsite.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseBusinessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
purchaseBusinessWebsite.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: purchaseBusinessWebsite.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseBusinessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
    const purchaseBusinessWebsiteForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purchaseBusinessWebsite.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::purchaseBusinessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
        purchaseBusinessWebsiteForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purchaseBusinessWebsite.url(options),
            method: 'post',
        })
    
    purchaseBusinessWebsite.form = purchaseBusinessWebsiteForm
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::payMiniWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
export const payMiniWebsiteTemplate = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payMiniWebsiteTemplate.url(args, options),
    method: 'post',
})

payMiniWebsiteTemplate.definition = {
    methods: ["post"],
    url: '/reseller/mini-websites/{mini_website}/purchase-template',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::payMiniWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
payMiniWebsiteTemplate.url = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mini_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mini_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mini_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mini_website: typeof args.mini_website === 'object'
                ? args.mini_website.id
                : args.mini_website,
                }

    return payMiniWebsiteTemplate.definition.url
            .replace('{mini_website}', parsedArgs.mini_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::payMiniWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
payMiniWebsiteTemplate.post = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payMiniWebsiteTemplate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::payMiniWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
    const payMiniWebsiteTemplateForm = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: payMiniWebsiteTemplate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::payMiniWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:114
 * @route '/reseller/mini-websites/{mini_website}/purchase-template'
 */
        payMiniWebsiteTemplateForm.post = (args: { mini_website: number | { id: number } } | [mini_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: payMiniWebsiteTemplate.url(args, options),
            method: 'post',
        })
    
    payMiniWebsiteTemplate.form = payMiniWebsiteTemplateForm
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::payBusinessWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:157
 * @route '/reseller/business-websites/{business_website}/purchase-template'
 */
export const payBusinessWebsiteTemplate = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payBusinessWebsiteTemplate.url(args, options),
    method: 'post',
})

payBusinessWebsiteTemplate.definition = {
    methods: ["post"],
    url: '/reseller/business-websites/{business_website}/purchase-template',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::payBusinessWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:157
 * @route '/reseller/business-websites/{business_website}/purchase-template'
 */
payBusinessWebsiteTemplate.url = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { business_website: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { business_website: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    business_website: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        business_website: typeof args.business_website === 'object'
                ? args.business_website.id
                : args.business_website,
                }

    return payBusinessWebsiteTemplate.definition.url
            .replace('{business_website}', parsedArgs.business_website.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::payBusinessWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:157
 * @route '/reseller/business-websites/{business_website}/purchase-template'
 */
payBusinessWebsiteTemplate.post = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payBusinessWebsiteTemplate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::payBusinessWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:157
 * @route '/reseller/business-websites/{business_website}/purchase-template'
 */
    const payBusinessWebsiteTemplateForm = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: payBusinessWebsiteTemplate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::payBusinessWebsiteTemplate
 * @see app/Http/Controllers/Reseller/PurchaseController.php:157
 * @route '/reseller/business-websites/{business_website}/purchase-template'
 */
        payBusinessWebsiteTemplateForm.post = (args: { business_website: number | { id: number } } | [business_website: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: payBusinessWebsiteTemplate.url(args, options),
            method: 'post',
        })
    
    payBusinessWebsiteTemplate.form = payBusinessWebsiteTemplateForm
const PurchaseController = { purchaseTemplate, purchaseMiniWebsite, purchaseBusinessWebsite, payMiniWebsiteTemplate, payBusinessWebsiteTemplate }

export default PurchaseController