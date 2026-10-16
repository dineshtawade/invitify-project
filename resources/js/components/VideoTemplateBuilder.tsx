import React, { useState, useRef, useEffect } from 'react';
import { 
    Play, Pause, Upload, Plus, SkipBack, Trash2, Trash, Type, Image as ImageIcon, 
    Loader2, X, Check, Grid, List, Search, Sparkles, Layers, UploadCloud, Film, 
    RotateCcw, Sliders, CheckCircle2, ChevronRight, SlidersHorizontal, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';
import GoogleFontPicker from '@/components/GoogleFontPicker';
import { getFontFamilyCss, loadGoogleFont } from '@/utils/font-utils';

const animationStyles = `
@keyframes vtbFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes vtbFadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes vtbZoomIn { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: scale(1); } }
@keyframes vtbZoomOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.2); } }
@keyframes vtbSlideUp { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
@keyframes vtbSlideDown { from { opacity: 0; transform: translateY(-60px); } to { opacity: 1; transform: translateY(0); } }
@keyframes vtbSlideLeft { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
@keyframes vtbSlideRight { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
@keyframes vtbBounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.08); } 70% { transform: scale(0.92); } 100% { transform: scale(1); } }
@keyframes vtbRotateIn { from { opacity: 0; transform: rotate(-180deg) scale(0.3); } to { opacity: 1; transform: rotate(0deg) scale(1); } }
@keyframes vtbFlipIn { from { opacity: 0; transform: perspective(400px) rotateY(90deg); } to { opacity: 1; transform: perspective(400px) rotateY(0deg); } }
@keyframes vtbFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
@keyframes vtbPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
@keyframes vtbShimmer { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.35); } }
`;

interface VideoTemplateBuilderProps {
    data: any;
    setData?: (field: string, value: any) => void;
    isCustomerMode?: boolean;
    isPreviewOnly?: boolean;
}

export default function VideoTemplateBuilder({ data, setData, isCustomerMode = false, isPreviewOnly = false }: VideoTemplateBuilderProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(data.default_config?.video_url || null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Elements logic
    const elements = data.default_config?.elements || [];
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragPos, setDragPos] = useState<{ id: string, x: number, y: number } | null>(null);
    const [timelineDrag, setTimelineDrag] = useState<{ id: string, type: 'start' | 'end', time: number } | null>(null);

    const updateConfig = (newElements: any[]) => {
        setData?.('default_config', { ...data.default_config, elements: newElements });
    };

    // Preload Google Fonts used in video elements
    // developed by dinesh tawade
    useEffect(() => {
        if (elements && Array.isArray(elements)) {
            elements.forEach((el: any) => {
                if (el.type === 'text' && el.fontFamily) {
                    loadGoogleFont(el.fontFamily);
                }
            });
        }
    }, [elements]);

    const [isUploading, setIsUploading] = useState(false);
    const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
    const [isLoadingMedia, setIsLoadingMedia] = useState(false);
    const [mediaViewMode, setMediaViewMode] = useState<'grid' | 'list'>('grid');
    const [mediaSearch, setMediaSearch] = useState('');
    const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
    const [assetTab, setAssetTab] = useState<'all' | 'png' | 'svg' | 'jpg' | 'video'>('all');

    // Enhanced Asset Library & Animation Testing States
    // developed by dinesh tawade
    const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
    const [targetElementForAsset, setTargetElementForAsset] = useState<string | null>(null);
    const [assetUploadNotice, setAssetUploadNotice] = useState<{ message: string; isDuplicate?: boolean } | null>(null);
    const [isUploadingAsset, setIsUploadingAsset] = useState(false);
    const [previewAnimationElementId, setPreviewAnimationElementId] = useState<string | null>(null);

    const fetchMediaLibrary = async () => {
        try {
            setIsLoadingMedia(true);
            const response = await axios.get('/media');
            setMediaLibrary(response.data.media || []);
        } catch (error) {
            console.error("Failed to fetch media library:", error);
        } finally {
            setIsLoadingMedia(false);
        }
    };

    useEffect(() => {
        fetchMediaLibrary();
    }, []);

    // Asset upload with deduplication check
    // developed by dinesh tawade
    const handleUploadNewAsset = async (file: File, targetId?: string) => {
        setIsUploadingAsset(true);
        setAssetUploadNotice(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const response = await axios.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            const isDup = Boolean(response.data.is_duplicate);
            setAssetUploadNotice({
                message: isDup
                    ? `Notice: Existing asset "${response.data.filename}" reused without duplicates.`
                    : `Success: "${response.data.filename}" uploaded and saved to library.`,
                isDuplicate: isDup,
            });

            await fetchMediaLibrary();

            // If a target element was specified, apply this newly uploaded asset to it
            if (targetId) {
                const isVideo = file.type.startsWith('video/');
                const updated = elements.map((e: any) => {
                    if (e.id === targetId) {
                        return {
                            ...e,
                            type: isVideo ? 'video' : 'image',
                            src: response.data.url,
                            customName: response.data.filename,
                        };
                    }
                    return e;
                });
                updateConfig(updated);
            }

            return response.data;
        } catch (err) {
            console.error('Upload asset error:', err);
            alert('Failed to upload file. Please check format and try again.');
        } finally {
            setIsUploadingAsset(false);
        }
    };

    // Delete asset from library
    // developed by dinesh tawade
    const handleDeleteAsset = async (media: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm(`Delete asset "${media.filename || 'Untitled'}" from library? This cannot be undone.`)) {
            return;
        }
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            await axios.delete(`/media/${media.id}`, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });
            setMediaLibrary(prev => prev.filter(m => m.id !== media.id));
            setAssetUploadNotice({
                message: `Asset "${media.filename || 'Untitled'}" deleted from library.`,
                isDuplicate: false,
            });
        } catch (err) {
            console.error('Delete asset error:', err);
            alert('Failed to delete asset.');
        }
    };

    // Apply or add asset to canvas
    // developed by dinesh tawade
    const handleApplyAsset = (media: any) => {
        const isVideo = media.type === 'video';
        const isSvg = (media.filename || '').toLowerCase().endsWith('.svg');

        const targetId = targetElementForAsset || (selectedElementId && elements.find((e: any) => e.id === selectedElementId)?.type !== 'text' ? selectedElementId : null);
        
        if (targetId) {
            const updated = elements.map((e: any) => {
                if (e.id === targetId) {
                    return {
                        ...e,
                        type: isVideo ? 'video' : 'image',
                        src: media.url,
                        customName: media.filename,
                    };
                }
                return e;
            });
            updateConfig(updated);
            setAssetUploadNotice({
                message: `Applied "${media.filename}" to selected layer.`,
                isDuplicate: false
            });
        } else {
            const newId = `${isVideo ? 'video' : 'image'}_${Date.now()}`;
            const newElement = {
                id: newId,
                type: isVideo ? 'video' : 'image',
                src: media.url,
                customName: media.filename,
                x: 50,
                y: 50,
                zIndex: 10,
                width: isSvg ? 120 : 150,
                height: isSvg ? 120 : 150,
                startTime: parseFloat(currentTime.toFixed(1)),
                endTime: parseFloat(Math.min(duration > 0 ? duration : 10, currentTime + 5).toFixed(1)),
                animationIn: 'fade',
                animationOut: 'fade',
                animationDuration: 0.5,
                loopAnimation: 'none',
            };
            updateConfig([...elements, newElement]);
            setSelectedElementId(newId);
        }
        setIsAssetDialogOpen(false);
        setTargetElementForAsset(null);
    };

    // Live instant test animation trigger
    // developed by dinesh tawade
    const handleTestAnimation = (elementId: string) => {
        setPreviewAnimationElementId(elementId);
        setTimeout(() => {
            setPreviewAnimationElementId(null);
        }, 1500);
    };

    // Compute keyframe animation string based on current playback time or test trigger
    // developed by dinesh tawade
    const getComputedElementAnimation = (el: any, time: number, isTesting: boolean) => {
        const animDuration = el.animationDuration || 0.5;
        const isEntering = isTesting || (time >= el.startTime && time < el.startTime + animDuration);
        const isExiting = !isTesting && (time <= el.endTime && time > el.endTime - animDuration);

        if (isEntering && el.animationIn && el.animationIn !== 'none') {
            const inMap: Record<string, string> = {
                'fade': `vtbFadeIn ${animDuration}s ease forwards`,
                'zoom': `vtbZoomIn ${animDuration}s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                'slide': `vtbSlideUp ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                'slide-up': `vtbSlideUp ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                'slide-down': `vtbSlideDown ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                'slide-left': `vtbSlideLeft ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                'slide-right': `vtbSlideRight ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                'bounce': `vtbBounceIn ${animDuration}s ease forwards`,
                'rotate': `vtbRotateIn ${animDuration}s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                'flip': `vtbFlipIn ${animDuration}s ease-out forwards`,
            };
            return inMap[el.animationIn] || '';
        }

        if (isExiting && el.animationOut && el.animationOut !== 'none') {
            const outMap: Record<string, string> = {
                'fade': `vtbFadeOut ${animDuration}s ease forwards`,
                'zoom': `vtbZoomOut ${animDuration}s ease forwards`,
                'slide-up': `vtbSlideUp ${animDuration}s ease reverse forwards`,
                'slide-down': `vtbSlideDown ${animDuration}s ease reverse forwards`,
                'slide-left': `vtbSlideLeft ${animDuration}s ease reverse forwards`,
                'slide-right': `vtbSlideRight ${animDuration}s ease reverse forwards`,
                'rotate': `vtbRotateIn ${animDuration}s ease reverse forwards`,
                'flip': `vtbFlipIn ${animDuration}s ease reverse forwards`,
            };
            return outMap[el.animationOut] || '';
        }

        if (el.loopAnimation && el.loopAnimation !== 'none') {
            if (el.loopAnimation === 'float') return 'vtbFloat 3s ease-in-out infinite';
            if (el.loopAnimation === 'pulse') return 'vtbPulse 2s ease-in-out infinite';
            if (el.loopAnimation === 'shimmer') return 'vtbShimmer 2.5s ease-in-out infinite';
        }

        return '';
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsUploading(true);
                const formData = new FormData();
                formData.append('file', file);
                const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
                const response = await axios.post('/media/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRF-TOKEN': csrfToken
                    }
                });
                const url = response.data.url;
                setVideoUrl(url);
                setData('default_config', { ...data.default_config, video_url: url });
                await fetchMediaLibrary();
            } catch (error) {
                console.error("Failed to upload video:", error);
                alert("Failed to upload video. Please ensure it is under 50MB and a valid format.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSelectDemo = () => {
        const demoUrl = '/video-template.mp4';
        setVideoUrl(demoUrl);
        setData('default_config', { ...data.default_config, video_url: demoUrl });
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const filteredMedia = mediaLibrary.filter(media =>
        media.type === 'video' &&
        (media.filename?.toLowerCase().includes(mediaSearch.toLowerCase()) ||
        media.title?.toLowerCase().includes(mediaSearch.toLowerCase()))
    );

    // Upload Section Component
    const UploadSection = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 bg-white">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="size-16 bg-indigo-100 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
                        <Upload className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Upload Video</h3>
                    <p className="text-gray-500 text-sm">Upload your background video or choose from library</p>
                </div>

                <div className="space-y-3">
                    <label className={`flex items-center justify-center gap-3 w-full py-4 px-4 font-semibold rounded-xl transition-all cursor-pointer ${isUploading ? 'bg-indigo-400 cursor-not-allowed opacity-50' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'}`}>
                        {isUploading ? (
                            <><Loader2 className="size-5 animate-spin" /> Uploading Video...</>
                        ) : (
                            <><Upload className="size-5" /> Upload MP4 Video</>
                        )}
                        <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoUpload} disabled={isUploading} />
                    </label>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <Button type="button" onClick={handleSelectDemo} variant="outline" className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold transition-all">
                        Use Demo Video
                    </Button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400 text-center">
                        Supported formats: MP4, WebM • Max size: 50MB
                    </p>
                </div>
            </div>
        </div>
    );

    // Media Library Section Component
    const MediaLibrarySection = () => (
        <div className="flex-1 flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50">
            {/* Library Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Media Library</h4>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {mediaLibrary.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search media..."
                                value={mediaSearch}
                                onChange={(e) => setMediaSearch(e.target.value)}
                                className="w-32 lg:w-40 h-8 bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                            <button
                                onClick={() => setMediaViewMode('grid')}
                                className={`p-1.5 transition-colors ${mediaViewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Grid className="size-3.5" />
                            </button>
                            <button
                                onClick={() => setMediaViewMode('list')}
                                className={`p-1.5 transition-colors ${mediaViewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List className="size-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Library Content */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                {isLoadingMedia ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="size-6 text-indigo-600 animate-spin" />
                    </div>
                ) : filteredMedia.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <div className="size-12 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                            <ImageIcon className="size-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                            {mediaSearch ? 'No matching videos found' : 'No videos in library'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Upload your first video to get started
                        </p>
                    </div>
                ) : mediaViewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredMedia.map((media) => (
                            <div
                                key={media.id}
                                onClick={() => {
                                    setVideoUrl(media.url);
                                    setData?.('default_config', { ...data.default_config, video_url: media.url });
                                    setSelectedMediaId(media.id);
                                }}
                                className={`relative aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden cursor-pointer transition-all group ${selectedMediaId === media.id ? 'ring-2 ring-indigo-600 shadow-lg' : 'hover:ring-1 hover:ring-gray-300 shadow-sm'}`}
                            >
                                {media.thumbnail ? (
                                    <img src={media.thumbnail} alt={media.filename} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={media.url} className="w-full h-full object-cover" />
                                )}
                                <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-all ${selectedMediaId === media.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {selectedMediaId === media.id ? (
                                        <Check className="size-6 text-white drop-shadow-lg" />
                                    ) : (
                                        <Play className="size-6 text-white drop-shadow-lg" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                    <p className="text-[10px] text-white truncate font-medium">{media.filename || 'Untitled'}</p>
                                    {media.duration && (
                                        <p className="text-[9px] text-gray-300">{Math.round(media.duration)}s</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredMedia.map((media) => (
                            <div
                                key={media.id}
                                onClick={() => {
                                    setVideoUrl(media.url);
                                    setData?.('default_config', { ...data.default_config, video_url: media.url });
                                    setSelectedMediaId(media.id);
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all bg-white border ${selectedMediaId === media.id ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
                            >
                                <div className="size-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {media.thumbnail ? (
                                        <img src={media.thumbnail} alt={media.filename} className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={media.url} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 truncate font-medium">{media.filename || 'Untitled'}</p>
                                    <p className="text-xs text-gray-500">
                                        {media.duration ? `${Math.round(media.duration)}s` : 'Unknown duration'}
                                    </p>
                                </div>
                                {selectedMediaId === media.id && (
                                    <Check className="size-4 text-indigo-600 shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (!videoUrl) {
        if (isCustomerMode) {
            return (
                <div className="flex-1 flex items-center justify-center bg-white text-gray-500 p-8 text-center rounded-2xl">
                    <p>No video background has been configured for this template.</p>
                </div>
            );
        }
        return (
            <div className="flex-1 flex flex-col min-h-0 lg:flex-row bg-white overflow-hidden">
                {/* Upload Section - Half Screen */}
                <UploadSection />

                {/* Media Library Section - Half Screen */}
                <MediaLibrarySection />
            </div>
        );
    }

    if (isPreviewOnly) {
        return (
            <div className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center" style={{ containerType: 'size' }}>
                <style>{animationStyles}</style>
                <div 
                    ref={containerRef} 
                    className="relative shadow-2xl bg-neutral-900 group shrink-0"
                    style={{
                        width: '450px',
                        height: '800px',
                        transform: 'scale(min(calc(100cqw / 450), calc(100cqh / 800)))',
                        transformOrigin: 'center center'
                    }}
                >
                    <video
                        ref={videoRef}
                        src={videoUrl || undefined}
                        className="w-full h-full object-cover"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        loop
                        playsInline
                    />

                    {/* Animated Overlay Elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {elements.map((el: any) => {
                            const isVisible = currentTime >= el.startTime && currentTime <= el.endTime;
                            if (!isVisible) return null;

                            const animStyle = getComputedElementAnimation(el, currentTime, false);

                            return (
                                <div
                                    key={el.id}
                                    className="absolute"
                                    style={{
                                        zIndex: el.zIndex || 10,
                                        left: `${el.x}%`,
                                        top: `${el.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <div
                                        style={{
                                            animation: animStyle,
                                        }}
                                    >
                                        {el.type === 'text' ? (
                                            <div
                                                style={{
                                                    fontFamily: getFontFamilyCss(el.fontFamily),
                                                    fontSize: el.fontSize || '24px',
                                                    color: el.color || '#ffffff',
                                                    fontWeight: el.fontWeight || 'normal',
                                                    textShadow: el.textShadow && el.textShadow !== 'none' ? el.textShadow : undefined,
                                                }}
                                                className="text-center whitespace-pre-wrap w-max max-w-xs"
                                            >
                                                {el.content}
                                            </div>
                                        ) : el.type === 'video' ? (
                                            <video
                                                src={el.src}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                style={{ width: el.width || 100, height: el.height || 100 }}
                                                className="object-contain pointer-events-none"
                                            />
                                        ) : (
                                            <img
                                                src={el.src}
                                                alt={el.customName || ''}
                                                style={{ width: el.width || 100, height: el.height || 100 }}
                                                className="object-contain pointer-events-none"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Play Overlay */}
                    <button
                        onClick={togglePlay}
                        className={`absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
                    >
                        {!isPlaying && (
                            <div className="size-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-white/30 transition-all">
                                <Play className="size-8 text-white ml-1 shadow-lg" />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 grid lg:grid-cols-2 h-full bg-white text-gray-900 overflow-hidden relative">
            {/* Left Column: Tools + Timeline */}
            <div className="w-full border-r border-gray-200 bg-gray-50/50 flex flex-col overflow-hidden min-h-0">

                {/* Tools & Properties (Scrollable) */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 shrink-0 bg-white">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">
                                    {isCustomerMode ? "Personalize Content" : "Video Elements & Layers"}
                                </h3>
                                <p className="text-[11px] text-gray-500">
                                    {isCustomerMode ? "Replace placeholder content easily" : "Add text, graphics, icons, or videos with animations"}
                                </p>
                            </div>
                            {!isCustomerMode && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setTargetElementForAsset(null);
                                        setIsAssetDialogOpen(true);
                                    }}
                                    className="h-8 text-xs font-semibold border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-sm gap-1.5"
                                >
                                    <ImageIcon className="size-3.5" />
                                    Asset Library
                                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full font-bold">
                                        {mediaLibrary.length}
                                    </span>
                                </Button>
                            )}
                        </div>

                        {/* Top quick actions */}
                        {!isCustomerMode && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const newId = `text_${Date.now()}`;
                                        const newElement = {
                                            id: newId,
                                            type: 'text',
                                            content: 'New Text Layer',
                                            x: 50,
                                            y: 40,
                                            zIndex: 10,
                                            fontFamily: 'Playfair Display',
                                            fontSize: '28px',
                                            color: '#ffffff',
                                            fontWeight: 'bold',
                                            startTime: parseFloat(currentTime.toFixed(1)),
                                            endTime: parseFloat(Math.min(duration > 0 ? duration : 10, currentTime + 5).toFixed(1)),
                                            animationIn: 'fade',
                                            animationOut: 'fade',
                                            animationDuration: 0.5,
                                            loopAnimation: 'none',
                                        };
                                        updateConfig([...elements, newElement]);
                                        setSelectedElementId(newId);
                                    }}
                                    className="w-full bg-gray-900 text-white hover:bg-gray-800 font-semibold gap-2 h-9 rounded-xl text-xs shadow-sm"
                                >
                                    <Type className="size-4 shrink-0" /> Add Text
                                </Button>

                                <label className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold gap-1.5 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all text-xs shadow-sm shadow-indigo-100">
                                    {isUploadingAsset ? (
                                        <><Loader2 className="size-3.5 animate-spin" /> Uploading...</>
                                    ) : (
                                        <><UploadCloud className="size-3.5 shrink-0" /> Upload Asset</>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml, video/mp4, video/webm"
                                        className="hidden"
                                        disabled={isUploadingAsset}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const res = await handleUploadNewAsset(file);
                                                if (res) {
                                                    handleApplyAsset({
                                                        id: res.id,
                                                        url: res.url,
                                                        filename: res.filename,
                                                        type: file.type.startsWith('video/') ? 'video' : 'image'
                                                    });
                                                }
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Modern Asset Library Dialog */}
                    {/* developed by dinesh tawade */}
                    <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
                        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white rounded-2xl shadow-2xl">
                            {/* Modal Header */}
                            <div className="p-5 border-b border-gray-100 bg-white shrink-0 flex items-center justify-between">
                                <div>
                                    <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <ImageIcon className="size-5 text-indigo-600" />
                                        Invitify Asset Library
                                    </DialogTitle>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Search, upload, or remove PNGs, SVGs, stickers, photos, and video overlays.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-colors">
                                        {isUploadingAsset ? (
                                            <><Loader2 className="size-3.5 animate-spin" /> Uploading...</>
                                        ) : (
                                            <><UploadCloud className="size-3.5" /> Upload New Asset</>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml, video/mp4, video/webm"
                                            className="hidden"
                                            disabled={isUploadingAsset}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    await handleUploadNewAsset(file, targetElementForAsset || undefined);
                                                }
                                                e.target.value = '';
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Notice / Feedback Banner */}
                            {assetUploadNotice && (
                                <div className={`px-5 py-2.5 text-xs flex items-center justify-between border-b ${
                                    assetUploadNotice.isDuplicate 
                                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}>
                                    <div className="flex items-center gap-2 font-medium">
                                        <CheckCircle2 className="size-4 shrink-0" />
                                        <span>{assetUploadNotice.message}</span>
                                    </div>
                                    <button
                                        onClick={() => setAssetUploadNotice(null)}
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            )}

                            {/* Search & Filter Bar */}
                            <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                {/* Filter Tabs */}
                                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
                                    {[
                                        { id: 'all', label: 'All Assets' },
                                        { id: 'png', label: 'PNG / Stickers' },
                                        { id: 'svg', label: 'SVG Icons' },
                                        { id: 'jpg', label: 'JPG / WebP' },
                                        { id: 'video', label: 'Videos' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setAssetTab(tab.id as any)}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                                                assetTab === tab.id
                                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Search Input */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by asset name..."
                                        value={mediaSearch}
                                        onChange={(e) => setMediaSearch(e.target.value)}
                                        className="w-full h-8.5 bg-white border border-gray-200 rounded-xl pl-8.5 pr-8 text-xs text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                    />
                                    {mediaSearch && (
                                        <button
                                            onClick={() => setMediaSearch('')}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Assets Grid */}
                            <div className="flex-1 overflow-y-auto p-5 min-h-[300px]">
                                {isLoadingMedia ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                                        <Loader2 className="size-8 text-indigo-600 animate-spin" />
                                        <span className="text-xs">Loading asset library...</span>
                                    </div>
                                ) : (
                                    (() => {
                                        const filtered = mediaLibrary.filter(media => {
                                            const matchesSearch = !mediaSearch || 
                                                (media.filename?.toLowerCase().includes(mediaSearch.toLowerCase())) ||
                                                (media.title?.toLowerCase().includes(mediaSearch.toLowerCase()));
                                            if (!matchesSearch) return false;

                                            const fn = (media.filename || '').toLowerCase();
                                            if (assetTab === 'all') return true;
                                            if (assetTab === 'video') return media.type === 'video' || fn.endsWith('.mp4') || fn.endsWith('.webm');
                                            if (assetTab === 'png') return fn.endsWith('.png') || fn.endsWith('.webp');
                                            if (assetTab === 'svg') return fn.endsWith('.svg');
                                            if (assetTab === 'jpg') return fn.endsWith('.jpg') || fn.endsWith('.jpeg');
                                            return true;
                                        });

                                        if (filtered.length === 0) {
                                            return (
                                                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                                    <div className="size-12 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center text-gray-400 mb-3">
                                                        <ImageIcon className="size-6" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-700">No matching assets found</p>
                                                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                                                        {mediaSearch ? `No assets matching "${mediaSearch}" in this filter.` : "Upload PNGs, SVGs or MP4s to build your reusable asset library."}
                                                    </p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
                                                {filtered.map(media => {
                                                    const isVideo = media.type === 'video';
                                                    const ext = (media.filename || '').split('.').pop()?.toUpperCase() || 'FILE';

                                                    return (
                                                        <div
                                                            key={media.id}
                                                            onClick={() => handleApplyAsset(media)}
                                                            className="group relative aspect-square bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-100/50 transition-all cursor-pointer flex flex-col justify-between p-2 overflow-hidden"
                                                            title={media.filename}
                                                        >
                                                            {/* Asset Preview */}
                                                            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                                                                {isVideo ? (
                                                                    <video src={media.url} className="max-h-full max-w-full object-contain pointer-events-none" />
                                                                ) : (
                                                                    <img src={media.url} alt={media.filename} className="max-h-full max-w-full object-contain pointer-events-none" />
                                                                )}
                                                            </div>

                                                            {/* Badge & Info footer */}
                                                            <div className="w-full flex items-center justify-between pt-1.5 border-t border-gray-100/70 bg-white/80 backdrop-blur-sm -mx-2 -mb-2 px-2 pb-1.5">
                                                                <span className="text-[10px] text-gray-700 font-medium truncate max-w-[70%]">
                                                                    {media.filename || 'Untitled'}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                                                    {ext}
                                                                </span>
                                                            </div>

                                                            {/* Hover Overlay with Insert Action & Delete */}
                                                            <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleApplyAsset(media);
                                                                    }}
                                                                    className="px-2.5 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-bold shadow-md hover:bg-indigo-50 flex items-center gap-1"
                                                                >
                                                                    <Plus className="size-3.5" />
                                                                    {targetElementForAsset ? 'Replace' : 'Use'}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => handleDeleteAsset(media, e)}
                                                                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
                                                                    title="Delete from Library"
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                                <span>{mediaLibrary.length} assets available in storage</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsAssetDialogOpen(false)}
                                    className="h-8 text-xs font-semibold"
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="p-5 space-y-4">
                        {/* Customer Mode Personalization Panel */}
                        {isCustomerMode ? (
                            <div className="space-y-4">
                                {elements.map((el: any, idx: number) => (
                                    <div key={el.id} className="grid gap-2 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-gray-300" onClick={() => setSelectedElementId(el.id)}>
                                        <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                                            <span>{el.type !== 'text' ? 'Upload Media' : 'Text Content'}</span>
                                            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Layer {idx + 1}</span>
                                        </label>
                                        {el.type !== 'text' ? (
                                            <div className="flex gap-4 items-center mt-1">
                                                <div className="size-16 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                                                    {el.src ? (
                                                        el.type === 'video' ? (
                                                            <video src={el.src} className="size-full object-cover" />
                                                        ) : (
                                                            <img src={el.src} alt="Custom" className="size-full object-cover" />
                                                        )
                                                    ) : (
                                                        <ImageIcon className="size-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col gap-1.5">
                                                    <input
                                                        type="file"
                                                        accept="image/*, video/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                try {
                                                                    const formData = new FormData();
                                                                    formData.append('file', file);
                                                                    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
                                                                    const response = await axios.post('/media/upload', formData, {
                                                                        headers: {
                                                                            'Content-Type': 'multipart/form-data',
                                                                            'X-CSRF-TOKEN': csrfToken
                                                                        }
                                                                    });
                                                                    const isVideo = file.type.startsWith('video/');
                                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, src: response.data.url, type: isVideo ? 'video' : 'image' } : x);
                                                                    updateConfig(newEls);
                                                                } catch (error) {
                                                                    console.error("Failed to upload image:", error);
                                                                    alert("Failed to upload image.");
                                                                }
                                                            }
                                                        }}
                                                        className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 file:border-0 file:bg-transparent file:text-xs file:font-semibold file:text-gray-600 file:cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <Input
                                                value={el.content || ''}
                                                onChange={(e) => {
                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, content: e.target.value } : x);
                                                    updateConfig(newEls);
                                                }}
                                                className="bg-white border-gray-200 h-9.5 text-xs text-gray-900 rounded-lg"
                                            />
                                        )}
                                    </div>
                                ))}
                                {elements.length === 0 && (
                                    <p className="text-xs text-gray-400 italic text-center py-12">No personalization layers found.</p>
                                )}
                            </div>
                        ) : selectedElementId && (
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Properties</h4>
                                {(() => {
                                    const el = elements.find((e: any) => e.id === selectedElementId);
                                    if (!el) return null;

                                    const isText = el.type === 'text';
                                    const isVideo = el.type === 'video';
                                    const isSvg = (el.src || '').toLowerCase().endsWith('.svg') || (el.customName || '').toLowerCase().endsWith('.svg');

                                    return (
                                        <div className="space-y-4">
                                            {/* Layer Header Badge */}
                                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                                        isText ? 'bg-blue-100 text-blue-700' :
                                                        isSvg ? 'bg-purple-100 text-purple-700' :
                                                        isVideo ? 'bg-amber-100 text-amber-700' :
                                                        'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                        {isText ? 'Text Layer' : isSvg ? 'SVG Icon' : isVideo ? 'Video Overlay' : 'Graphic / Sticker'}
                                                    </span>
                                                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                                                        {isText ? (el.content || 'Text') : (el.customName || el.type)}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        updateConfig(elements.filter((x: any) => x.id !== el.id));
                                                        setSelectedElementId(null);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete this layer"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>

                                            {/* Media Replace Card (for Image/SVG/Video) */}
                                            {!isText && (
                                                <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                                    <label className="text-xs font-bold text-gray-700 block">Graphic Asset</label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-16 rounded-xl border border-gray-200 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                                            {isVideo ? (
                                                                <video src={el.src} className="size-full object-contain pointer-events-none" />
                                                            ) : (
                                                                <img src={el.src} alt="Asset" className="size-full object-contain pointer-events-none" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setTargetElementForAsset(el.id);
                                                                    setIsAssetDialogOpen(true);
                                                                }}
                                                                className="w-full h-8 text-xs font-semibold border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-sm gap-1.5"
                                                            >
                                                                <ImageIcon className="size-3.5" />
                                                                Choose from Library
                                                            </Button>

                                                            <label className="w-full h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg flex items-center justify-center cursor-pointer text-xs transition-colors gap-1.5">
                                                                <UploadCloud className="size-3.5" />
                                                                Replace File
                                                                <input
                                                                    type="file"
                                                                    accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml, video/mp4, video/webm"
                                                                    className="hidden"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            await handleUploadNewAsset(file, el.id);
                                                                        }
                                                                        e.target.value = '';
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Text Content & Typography (for Text) */}
                                            {isText && (
                                                <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block font-medium">Text Content</label>
                                                        <Input
                                                            value={el.content || ''}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, content: e.target.value } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-white border-gray-200 text-xs font-medium"
                                                            placeholder="Enter invitation text..."
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="text-xs text-gray-500 font-medium">Font Family</label>
                                                            <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                                                                <Sparkles className="size-2.5" /> 1,950+ Fonts
                                                            </span>
                                                        </div>
                                                        <GoogleFontPicker
                                                            value={el.fontFamily || 'Playfair Display'}
                                                            sampleText={el.content || 'The Wedding of Sarah & Alex'}
                                                            onChange={(newFont) => {
                                                                loadGoogleFont(newFont);
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, fontFamily: newFont } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="text-xs text-gray-500 mb-1 block">Color & Size</label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="color"
                                                                    value={el.color || '#ffffff'}
                                                                    onChange={(e) => {
                                                                        const newEls = elements.map((x: any) => x.id === el.id ? { ...x, color: e.target.value } : x);
                                                                        updateConfig(newEls);
                                                                    }}
                                                                    className="w-10 h-9 p-0.5 bg-white border-gray-200 cursor-pointer rounded-md"
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    value={el.fontSize || '24px'}
                                                                    onChange={(e) => {
                                                                        const newEls = elements.map((x: any) => x.id === el.id ? { ...x, fontSize: e.target.value } : x);
                                                                        updateConfig(newEls);
                                                                    }}
                                                                    placeholder="24px"
                                                                    className="w-20 bg-white border-gray-200 text-xs h-9"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-500 mb-1 block">Weight</label>
                                                            <select
                                                                value={el.fontWeight || 'normal'}
                                                                onChange={(e) => {
                                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, fontWeight: e.target.value } : x);
                                                                    updateConfig(newEls);
                                                                }}
                                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                            >
                                                                <option value="lighter">Light</option>
                                                                <option value="normal">Regular</option>
                                                                <option value="bold">Bold</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Text Shadow</label>
                                                        <select
                                                            value={el.textShadow || 'none'}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, textShadow: e.target.value } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        >
                                                            <option value="none">None</option>
                                                            <option value="1px 1px 2px rgba(0,0,0,0.8)">Soft Shadow</option>
                                                            <option value="2px 2px 4px rgba(0,0,0,0.9)">Strong Shadow</option>
                                                            <option value="0px 0px 8px rgba(255,255,255,0.8)">White Glow</option>
                                                            <option value="0px 0px 8px rgba(0,0,0,0.8)">Dark Glow</option>
                                                            <option value="0 0 5px #fff, 0 0 10px #fff, 0 0 20px #0ff, 0 0 30px #0ff">Neon Glow</option>
                                                            <option value="1px 1px 0 #999, 2px 2px 0 #888, 3px 3px 0 #777">3D Block</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Z-Index & Layer Depth Stepper */}
                                            {/* developed by dinesh tawade */}
                                            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                        <Layers className="size-3.5 text-indigo-600" />
                                                        Layer Depth / Z-Index
                                                    </label>
                                                    <span className="text-[11px] font-mono text-gray-400">
                                                        Current: {el.zIndex || 10}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const currentZ = el.zIndex || 10;
                                                            const newZ = Math.max(1, currentZ - 1);
                                                            const newEls = elements.map((x: any) => x.id === el.id ? { ...x, zIndex: newZ } : x);
                                                            updateConfig(newEls);
                                                        }}
                                                        className="h-8 px-2.5 text-xs font-bold border-gray-200 hover:bg-gray-50"
                                                        title="Lower Layer"
                                                    >
                                                        -
                                                    </Button>
                                                    <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg h-8 border border-gray-200">
                                                        <span className="text-xs font-bold font-mono text-gray-800">
                                                            Z: {el.zIndex || 10}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const currentZ = el.zIndex || 10;
                                                            const newZ = currentZ + 1;
                                                            const newEls = elements.map((x: any) => x.id === el.id ? { ...x, zIndex: newZ } : x);
                                                            updateConfig(newEls);
                                                        }}
                                                        className="h-8 px-2.5 text-xs font-bold border-gray-200 hover:bg-gray-50"
                                                        title="Raise Layer"
                                                    >
                                                        +
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newEls = elements.map((x: any) => x.id === el.id ? { ...x, zIndex: 1 } : x);
                                                            updateConfig(newEls);
                                                        }}
                                                        className="h-8 text-[11px] px-2 text-gray-500 hover:text-gray-900 border-gray-200"
                                                        title="Send to Bottom"
                                                    >
                                                        Min
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const maxZ = Math.max(...elements.map((e: any) => e.zIndex || 10), 10);
                                                            const newEls = elements.map((x: any) => x.id === el.id ? { ...x, zIndex: maxZ + 5 } : x);
                                                            updateConfig(newEls);
                                                        }}
                                                        className="h-8 text-[11px] px-2 text-indigo-600 font-semibold border-indigo-200 hover:bg-indigo-50"
                                                        title="Bring to Front"
                                                    >
                                                        Top
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Layer Motion & Animations Card */}
                                            {/* developed by dinesh tawade */}
                                            <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-3.5 rounded-xl border border-indigo-100 shadow-sm space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <Sliders className="size-4 text-indigo-600" />
                                                        <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                            Motion & Animations
                                                        </h5>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTestAnimation(el.id)}
                                                        className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all"
                                                        title="Preview entrance animation immediately on the video"
                                                    >
                                                        <Play className="size-3 fill-white" />
                                                        Test Live
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2.5">
                                                    <div>
                                                        <label className="text-[11px] font-semibold text-gray-600 mb-1 block">Entrance Motion</label>
                                                        <select
                                                            value={el.animationIn || 'none'}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, animationIn: e.target.value } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="flex h-8.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        >
                                                            <option value="none">None</option>
                                                            <option value="fade">Fade In</option>
                                                            <option value="zoom">Zoom In</option>
                                                            <option value="slide-up">Slide Up</option>
                                                            <option value="slide-down">Slide Down</option>
                                                            <option value="slide-left">Slide Left</option>
                                                            <option value="slide-right">Slide Right</option>
                                                            <option value="bounce">Bounce In</option>
                                                            <option value="rotate">Rotate In</option>
                                                            <option value="flip">3D Flip In</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[11px] font-semibold text-gray-600 mb-1 block">Exit Motion</label>
                                                        <select
                                                            value={el.animationOut || 'none'}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, animationOut: e.target.value } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="flex h-8.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        >
                                                            <option value="none">None</option>
                                                            <option value="fade">Fade Out</option>
                                                            <option value="zoom">Zoom Out</option>
                                                            <option value="slide-up">Slide Up Out</option>
                                                            <option value="slide-down">Slide Down Out</option>
                                                            <option value="slide-left">Slide Left Out</option>
                                                            <option value="slide-right">Slide Right Out</option>
                                                            <option value="rotate">Rotate Out</option>
                                                            <option value="flip">3D Flip Out</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2.5">
                                                    <div>
                                                        <label className="text-[11px] font-semibold text-gray-600 mb-1 block">Animation Speed</label>
                                                        <select
                                                            value={el.animationDuration || 0.5}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, animationDuration: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="flex h-8.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        >
                                                            <option value={0.3}>0.3s (Snappy)</option>
                                                            <option value={0.5}>0.5s (Standard)</option>
                                                            <option value={0.8}>0.8s (Smooth)</option>
                                                            <option value={1.2}>1.2s (Cinematic)</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[11px] font-semibold text-gray-600 mb-1 block">Continuous Loop</label>
                                                        <select
                                                            value={el.loopAnimation || 'none'}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, loopAnimation: e.target.value } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="flex h-8.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        >
                                                            <option value="none">None</option>
                                                            <option value="float">Floating Effect</option>
                                                            <option value="pulse">Pulse Effect</option>
                                                            <option value="shimmer">Shimmer Glow</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timing & Coordinates */}
                                            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                                <label className="text-xs font-bold text-gray-700 block">Timing & Placement</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Start (s)</label>
                                                        <Input
                                                            type="number" step="0.1"
                                                            value={el.startTime}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, startTime: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-white border-gray-200 h-8.5 text-xs px-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">End (s)</label>
                                                        <Input
                                                            type="number" step="0.1"
                                                            value={el.endTime}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, endTime: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-white border-gray-200 h-8.5 text-xs px-2"
                                                        />
                                                    </div>
                                                </div>

                                                {!isText && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="text-xs text-gray-500 mb-1 block">Width (px)</label>
                                                            <Input
                                                                type="number"
                                                                value={el.width || 100}
                                                                onChange={(e) => {
                                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, width: parseFloat(e.target.value) } : x);
                                                                    updateConfig(newEls);
                                                                }}
                                                                className="bg-white border-gray-200 h-8.5 text-xs px-2"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-500 mb-1 block">Height (px)</label>
                                                            <Input
                                                                type="number"
                                                                value={el.height || 100}
                                                                onChange={(e) => {
                                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, height: parseFloat(e.target.value) } : x);
                                                                    updateConfig(newEls);
                                                                }}
                                                                className="bg-white border-gray-200 h-8.5 text-xs px-2"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Position X (%)</label>
                                                        <Input
                                                            type="number"
                                                            value={el.x}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, x: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-white border-gray-200 h-8.5 text-xs px-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Position Y (%)</label>
                                                        <Input
                                                            type="number"
                                                            value={el.y}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, y: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-white border-gray-200 h-8.5 text-xs px-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => {
                                                    updateConfig(elements.filter((x: any) => x.id !== el.id));
                                                    setSelectedElementId(null);
                                                }}
                                                className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-9 font-semibold"
                                            >
                                                <Trash2 className="size-4" /> Delete Layer
                                            </Button>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Timeline (inside Left Column) */}
                <div className="h-56 border-t border-gray-200 bg-white flex flex-col shrink-0 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    {/* Timeline Controls */}
                    <div className="flex items-center gap-4 p-3 border-b border-gray-200 px-6 bg-gray-50/50">
                        <Button type="button" onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; } }} variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100 text-gray-700">
                            <SkipBack className="size-4" />
                        </Button>
                        <Button type="button" onClick={togglePlay} variant="ghost" size="sm" className="h-11 w-11 p-0 rounded-full bg-gray-900 text-white hover:bg-gray-800">
                            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-1" />}
                        </Button>
                        <div className="font-mono text-sm text-gray-400 tracking-wider">
                            <span className="text-gray-900 font-medium">{currentTime.toFixed(1)}s</span> / {duration.toFixed(1)}s
                        </div>
                    </div>

                    {/* Timeline Tracks */}
                    <div className="flex-1 overflow-x-auto p-6 relative">
                        <div className="space-y-3 min-w-[500px]">
                            {/* Main Video Track */}
                            <div className="flex items-center gap-4">
                                <div className="w-24 text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Background</div>
                                <div className="flex-1 h-14 bg-indigo-50 rounded-xl border border-indigo-200 overflow-hidden relative">
                                    <div
                                        className="absolute top-0 left-0 bottom-0 bg-indigo-200/50 border-r-2 border-indigo-400"
                                        style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                                    />
                                    <div className="absolute inset-0 flex items-center px-4">
                                        <span className="text-xs font-mono text-indigo-600">video-template.mp4</span>
                                    </div>
                                </div>
                            </div>
                            {/* Text Tracks */}
                            {elements.map((el: any) => {
                                const currentStartTime = timelineDrag?.id === el.id && timelineDrag.type === 'start' ? timelineDrag.time : el.startTime;
                                const currentEndTime = timelineDrag?.id === el.id && timelineDrag.type === 'end' ? timelineDrag.time : el.endTime;

                                return (
                                    <div key={el.id} className="flex items-center gap-4" onClick={() => setSelectedElementId(el.id)}>
                                        <div className={`w-24 text-xs font-bold truncate tracking-wider shrink-0 cursor-pointer transition-colors ${selectedElementId === el.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            {el.type === 'image' ? 'Image Layer' : el.type === 'video' ? 'Video Layer' : (el.content || 'Text Layer')}
                                        </div>
                                        <div className="flex-1 h-10 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 cursor-pointer hover:border-gray-300">
                                            <div
                                                className={`absolute top-0 bottom-0 rounded-lg group ${selectedElementId === el.id ? 'bg-indigo-500' : 'bg-gray-400'}`}
                                                style={{
                                                    left: duration > 0 ? `${(currentStartTime / duration) * 100}%` : '0%',
                                                    width: duration > 0 ? `${((currentEndTime - currentStartTime) / duration) * 100}%` : '0%',
                                                }}
                                            >
                                                {/* Left Handle (Start Time) */}
                                                {!isCustomerMode && (
                                                    <div
                                                        onMouseDown={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedElementId(el.id);
                                                            const container = e.currentTarget.parentElement?.parentElement;
                                                            if (!container) return;
                                                            const rect = container.getBoundingClientRect();
                                                            let currentTimeValue = el.startTime;

                                                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                                                let newX = moveEvent.clientX - rect.left;
                                                                newX = Math.max(0, Math.min(newX, rect.width));
                                                                let newTime = (newX / rect.width) * duration;
                                                                newTime = Math.min(newTime, el.endTime - 0.5);
                                                                currentTimeValue = newTime;
                                                                setTimelineDrag({ id: el.id, type: 'start', time: newTime });
                                                            };

                                                            const handleMouseUp = () => {
                                                                document.removeEventListener('mousemove', handleMouseMove);
                                                                document.removeEventListener('mouseup', handleMouseUp);
                                                                setTimelineDrag(null);
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, startTime: parseFloat(currentTimeValue.toFixed(1)) } : x);
                                                                updateConfig(newEls);
                                                            };

                                                            document.addEventListener('mousemove', handleMouseMove);
                                                            document.addEventListener('mouseup', handleMouseUp);
                                                        }}
                                                        className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    />
                                                )}
                                                {/* Right Handle (End Time) */}
                                                {!isCustomerMode && (
                                                    <div
                                                        onMouseDown={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedElementId(el.id);
                                                            const container = e.currentTarget.parentElement?.parentElement;
                                                            if (!container) return;
                                                            const rect = container.getBoundingClientRect();
                                                            let currentTimeValue = el.endTime;

                                                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                                                let newX = moveEvent.clientX - rect.left;
                                                                newX = Math.max(0, Math.min(newX, rect.width));
                                                                let newTime = (newX / rect.width) * duration;
                                                                newTime = Math.max(newTime, el.startTime + 0.5);
                                                                currentTimeValue = newTime;
                                                                setTimelineDrag({ id: el.id, type: 'end', time: newTime });
                                                            };

                                                            const handleMouseUp = () => {
                                                                document.removeEventListener('mousemove', handleMouseMove);
                                                                document.removeEventListener('mouseup', handleMouseUp);
                                                                setTimelineDrag(null);
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, endTime: parseFloat(currentTimeValue.toFixed(1)) } : x);
                                                                updateConfig(newEls);
                                                            };

                                                            document.addEventListener('mousemove', handleMouseMove);
                                                            document.addEventListener('mouseup', handleMouseUp);
                                                        }}
                                                        className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Live Preview */}
            <div className="flex-1 flex items-center justify-center relative p-4 lg:p-8 overflow-hidden" style={{ containerType: 'size' }}>
                <style>{animationStyles}</style>
                <div 
                    ref={containerRef} 
                    className="video-template-preview-container relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-neutral-900 shrink-0"
                    style={{
                        width: '450px',
                        height: '800px',
                        transform: 'scale(min(calc(100cqw / 450), calc(100cqh / 800)))',
                        transformOrigin: 'center center'
                    }}
                >
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onClick={togglePlay}
                        loop
                    />
                    {/* Play Overlay */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-50">
                            <div className="size-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Play className="size-8 text-white ml-1 shadow-sm" />
                            </div>
                        </div>
                    )}
                    {/* Overlay elements */}
                    {elements.map((el: any) => {
                        const isVisible = currentTime >= el.startTime && currentTime <= el.endTime;
                        const isTesting = previewAnimationElementId === el.id;
                        if (!isVisible && !isTesting) return null;

                        const displayX = dragPos?.id === el.id ? dragPos.x : el.x;
                        const displayY = dragPos?.id === el.id ? dragPos.y : el.y;

                        const animStyle = getComputedElementAnimation(el, currentTime, isTesting);

                        return (
                            <div
                                key={el.id}
                                onMouseDown={(e) => {
                                    if (isCustomerMode) return;
                                    e.stopPropagation();
                                    setSelectedElementId(el.id);

                                    const container = containerRef.current;
                                    if (!container) return;
                                    const rect = container.getBoundingClientRect();

                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const startLeft = el.x;
                                    const startTop = el.y;

                                    let currentX = startLeft;
                                    let currentY = startTop;

                                    const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
                                        const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
                                        currentX = Math.max(0, Math.min(100, startLeft + deltaX));
                                        currentY = Math.max(0, Math.min(100, startTop + deltaY));
                                        setDragPos({ id: el.id, x: currentX, y: currentY });
                                    };

                                    const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                        setDragPos(null);
                                        const newEls = elements.map((x: any) => x.id === el.id ? { ...x, x: currentX, y: currentY } : x);
                                        updateConfig(newEls);
                                    };

                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                                className={`absolute ${isCustomerMode ? '' : 'cursor-pointer'} p-2 select-none ${!dragPos ? 'transition-all duration-150' : ''} ${selectedElementId === el.id && !isCustomerMode ? 'ring-2 ring-indigo-500 bg-indigo-500/10 border border-indigo-400 border-dashed rounded-xl cursor-move' : ''}`}
                                style={{
                                    zIndex: el.zIndex || 10,
                                    left: `${displayX}%`,
                                    top: `${displayY}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div
                                    style={{
                                        animation: animStyle,
                                        ...(el.type === 'text' ? {
                                            fontFamily: getFontFamilyCss(el.fontFamily),
                                            fontSize: el.fontSize || '24px',
                                            fontWeight: el.fontWeight || 'normal',
                                            color: el.color || '#ffffff',
                                            textShadow: el.textShadow && el.textShadow !== 'none' ? el.textShadow : undefined,
                                        } : {}),
                                    }}
                                >
                                    {el.type === 'image' ? (
                                        <img
                                            src={el.src}
                                            alt={el.customName || ''}
                                            style={{ width: el.width || 100, height: el.height || 100 }}
                                            className="object-contain pointer-events-none"
                                        />
                                    ) : el.type === 'video' ? (
                                        <video
                                            src={el.src}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            style={{ width: el.width || 100, height: el.height || 100 }}
                                            className="object-contain pointer-events-none"
                                        />
                                    ) : (
                                        <span className="whitespace-pre-wrap">{el.content}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}