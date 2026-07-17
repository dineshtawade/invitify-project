import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MediaUploadController::upload
 * @see app/Http/Controllers/MediaUploadController.php:11
 * @route '/media/upload'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/media/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaUploadController::upload
 * @see app/Http/Controllers/MediaUploadController.php:11
 * @route '/media/upload'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaUploadController::upload
 * @see app/Http/Controllers/MediaUploadController.php:11
 * @route '/media/upload'
 */
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MediaUploadController::upload
 * @see app/Http/Controllers/MediaUploadController.php:11
 * @route '/media/upload'
 */
    const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MediaUploadController::upload
 * @see app/Http/Controllers/MediaUploadController.php:11
 * @route '/media/upload'
 */
        uploadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(options),
            method: 'post',
        })
    
    upload.form = uploadForm
const media = {
    upload: Object.assign(upload, upload),
}

export default media