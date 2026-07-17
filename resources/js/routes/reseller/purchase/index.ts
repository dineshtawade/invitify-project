import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::template
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: template.url(options),
    method: 'post',
})

template.definition = {
    methods: ["post"],
    url: '/reseller/purchase/template',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::template
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::template
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
template.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: template.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::template
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
    const templateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: template.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::template
 * @see app/Http/Controllers/Reseller/PurchaseController.php:18
 * @route '/reseller/purchase/template'
 */
        templateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: template.url(options),
            method: 'post',
        })
    
    template.form = templateForm
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::miniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
export const miniWebsite = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: miniWebsite.url(options),
    method: 'post',
})

miniWebsite.definition = {
    methods: ["post"],
    url: '/reseller/purchase/mini-website',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::miniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
miniWebsite.url = (options?: RouteQueryOptions) => {
    return miniWebsite.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::miniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
miniWebsite.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: miniWebsite.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::miniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
    const miniWebsiteForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: miniWebsite.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::miniWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:59
 * @route '/reseller/purchase/mini-website'
 */
        miniWebsiteForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: miniWebsite.url(options),
            method: 'post',
        })
    
    miniWebsite.form = miniWebsiteForm
/**
* @see \App\Http\Controllers\Reseller\PurchaseController::businessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
export const businessWebsite = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: businessWebsite.url(options),
    method: 'post',
})

businessWebsite.definition = {
    methods: ["post"],
    url: '/reseller/purchase/business-website',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::businessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
businessWebsite.url = (options?: RouteQueryOptions) => {
    return businessWebsite.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reseller\PurchaseController::businessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
businessWebsite.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: businessWebsite.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reseller\PurchaseController::businessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
    const businessWebsiteForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: businessWebsite.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reseller\PurchaseController::businessWebsite
 * @see app/Http/Controllers/Reseller/PurchaseController.php:87
 * @route '/reseller/purchase/business-website'
 */
        businessWebsiteForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: businessWebsite.url(options),
            method: 'post',
        })
    
    businessWebsite.form = businessWebsiteForm
const purchase = {
    template: Object.assign(template, template),
miniWebsite: Object.assign(miniWebsite, miniWebsite),
businessWebsite: Object.assign(businessWebsite, businessWebsite),
}

export default purchase