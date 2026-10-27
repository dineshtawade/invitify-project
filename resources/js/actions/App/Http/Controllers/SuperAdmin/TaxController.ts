import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::index
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:23
 * @route '/super-admin/taxes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/taxes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::index
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:23
 * @route '/super-admin/taxes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::index
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:23
 * @route '/super-admin/taxes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::index
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:23
 * @route '/super-admin/taxes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::index
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:23
 * @route '/super-admin/taxes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::index
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:23
 * @route '/super-admin/taxes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::index
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:23
 * @route '/super-admin/taxes'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateSettings
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:54
 * @route '/super-admin/taxes/settings'
 */
export const updateSettings = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSettings.url(options),
    method: 'post',
})

updateSettings.definition = {
    methods: ["post"],
    url: '/super-admin/taxes/settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateSettings
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:54
 * @route '/super-admin/taxes/settings'
 */
updateSettings.url = (options?: RouteQueryOptions) => {
    return updateSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateSettings
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:54
 * @route '/super-admin/taxes/settings'
 */
updateSettings.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSettings.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateSettings
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:54
 * @route '/super-admin/taxes/settings'
 */
    const updateSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSettings.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateSettings
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:54
 * @route '/super-admin/taxes/settings'
 */
        updateSettingsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSettings.url(options),
            method: 'post',
        })
    
    updateSettings.form = updateSettingsForm
/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:89
 * @route '/super-admin/taxes/templates/{id}'
 */
export const updateTemplateTax = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTemplateTax.url(args, options),
    method: 'post',
})

updateTemplateTax.definition = {
    methods: ["post"],
    url: '/super-admin/taxes/templates/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:89
 * @route '/super-admin/taxes/templates/{id}'
 */
updateTemplateTax.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updateTemplateTax.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:89
 * @route '/super-admin/taxes/templates/{id}'
 */
updateTemplateTax.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTemplateTax.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:89
 * @route '/super-admin/taxes/templates/{id}'
 */
    const updateTemplateTaxForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateTemplateTax.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:89
 * @route '/super-admin/taxes/templates/{id}'
 */
        updateTemplateTaxForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateTemplateTax.url(args, options),
            method: 'post',
        })
    
    updateTemplateTax.form = updateTemplateTaxForm
/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateWebsiteTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:109
 * @route '/super-admin/taxes/website-templates/{id}'
 */
export const updateWebsiteTemplateTax = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWebsiteTemplateTax.url(args, options),
    method: 'post',
})

updateWebsiteTemplateTax.definition = {
    methods: ["post"],
    url: '/super-admin/taxes/website-templates/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateWebsiteTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:109
 * @route '/super-admin/taxes/website-templates/{id}'
 */
updateWebsiteTemplateTax.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updateWebsiteTemplateTax.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateWebsiteTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:109
 * @route '/super-admin/taxes/website-templates/{id}'
 */
updateWebsiteTemplateTax.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWebsiteTemplateTax.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateWebsiteTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:109
 * @route '/super-admin/taxes/website-templates/{id}'
 */
    const updateWebsiteTemplateTaxForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateWebsiteTemplateTax.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\TaxController::updateWebsiteTemplateTax
 * @see app/Http/Controllers/SuperAdmin/TaxController.php:109
 * @route '/super-admin/taxes/website-templates/{id}'
 */
        updateWebsiteTemplateTaxForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateWebsiteTemplateTax.url(args, options),
            method: 'post',
        })
    
    updateWebsiteTemplateTax.form = updateWebsiteTemplateTaxForm
const TaxController = { index, updateSettings, updateTemplateTax, updateWebsiteTemplateTax }

export default TaxController