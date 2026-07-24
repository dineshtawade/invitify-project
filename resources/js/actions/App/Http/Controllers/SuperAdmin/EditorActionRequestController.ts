import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::index
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:12
 * @route '/super-admin/editor-requests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/editor-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::index
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:12
 * @route '/super-admin/editor-requests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::index
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:12
 * @route '/super-admin/editor-requests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::index
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:12
 * @route '/super-admin/editor-requests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::index
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:12
 * @route '/super-admin/editor-requests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::index
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:12
 * @route '/super-admin/editor-requests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::index
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:12
 * @route '/super-admin/editor-requests'
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
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::store
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:45
 * @route '/super-admin/editor-requests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/super-admin/editor-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::store
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:45
 * @route '/super-admin/editor-requests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::store
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:45
 * @route '/super-admin/editor-requests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::store
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:45
 * @route '/super-admin/editor-requests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::store
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:45
 * @route '/super-admin/editor-requests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::approve
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:89
 * @route '/super-admin/editor-requests/{editorRequest}/approve'
 */
export const approve = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/super-admin/editor-requests/{editorRequest}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::approve
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:89
 * @route '/super-admin/editor-requests/{editorRequest}/approve'
 */
approve.url = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { editorRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { editorRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    editorRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        editorRequest: typeof args.editorRequest === 'object'
                ? args.editorRequest.id
                : args.editorRequest,
                }

    return approve.definition.url
            .replace('{editorRequest}', parsedArgs.editorRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::approve
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:89
 * @route '/super-admin/editor-requests/{editorRequest}/approve'
 */
approve.post = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::approve
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:89
 * @route '/super-admin/editor-requests/{editorRequest}/approve'
 */
    const approveForm = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::approve
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:89
 * @route '/super-admin/editor-requests/{editorRequest}/approve'
 */
        approveForm.post = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::reject
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:95
 * @route '/super-admin/editor-requests/{editorRequest}/reject'
 */
export const reject = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/super-admin/editor-requests/{editorRequest}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::reject
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:95
 * @route '/super-admin/editor-requests/{editorRequest}/reject'
 */
reject.url = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { editorRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { editorRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    editorRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        editorRequest: typeof args.editorRequest === 'object'
                ? args.editorRequest.id
                : args.editorRequest,
                }

    return reject.definition.url
            .replace('{editorRequest}', parsedArgs.editorRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::reject
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:95
 * @route '/super-admin/editor-requests/{editorRequest}/reject'
 */
reject.post = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::reject
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:95
 * @route '/super-admin/editor-requests/{editorRequest}/reject'
 */
    const rejectForm = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdmin\EditorActionRequestController::reject
 * @see app/Http/Controllers/SuperAdmin/EditorActionRequestController.php:95
 * @route '/super-admin/editor-requests/{editorRequest}/reject'
 */
        rejectForm.post = (args: { editorRequest: number | { id: number } } | [editorRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const EditorActionRequestController = { index, store, approve, reject }

export default EditorActionRequestController