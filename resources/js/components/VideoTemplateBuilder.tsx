import React, { useState, useRef } from 'react';
import { Play, Pause, Upload, Plus, SkipBack, Trash, Type, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

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
        setData('default_config', { ...data.default_config, elements: newElements });
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsUploading(true);
                const formData = new FormData();
                formData.append('file', file);
                const response = await axios.post('/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const url = response.data.url;
                setVideoUrl(url);
                setData('default_config', { ...data.default_config, video_url: url });
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

    if (!videoUrl) {
        if (isCustomerMode) {
            return (
                <div className="flex-1 flex items-center justify-center bg-neutral-950 text-neutral-400 p-8 text-center rounded-2xl">
                    <p>No video background has been configured for this template.</p>
                </div>
            );
        }
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-neutral-950 text-white p-8">
                <div className="max-w-md w-full bg-neutral-900 rounded-[2rem] p-10 text-center space-y-6 shadow-2xl border border-neutral-800">
                    <div className="size-20 bg-indigo-500/20 text-indigo-400 rounded-3xl mx-auto flex items-center justify-center">
                        <Upload className="size-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Start Video Project</h2>
                        <p className="text-neutral-400 text-sm">Upload a background video or start with our beautiful default template.</p>
                    </div>
                    <div className="space-y-4 pt-4">
                        <label className={`flex items-center justify-center gap-2 w-full py-4 px-4 font-semibold rounded-2xl transition-colors shadow-lg shadow-indigo-900/20 ${isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white'}`}>
                            {isUploading ? (
                                <><Loader2 className="size-5 animate-spin" /> Uploading Video...</>
                            ) : (
                                <><Upload className="size-5" /> Upload MP4 Video</>
                            )}
                            <input type="file" accept="video/mp4" className="hidden" onChange={handleVideoUpload} disabled={isUploading} />
                        </label>
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-neutral-800"></div>
                            <span className="flex-shrink-0 mx-4 text-neutral-600 text-xs font-bold uppercase">OR</span>
                            <div className="flex-grow border-t border-neutral-800"></div>
                        </div>
                        <Button type="button" onClick={handleSelectDemo} variant="outline" className="w-full h-14 border-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600 hover:text-white rounded-2xl font-semibold transition-all">
                            Use Demo Video
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (isPreviewOnly) {
        return (
            <div className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center">
                <div ref={containerRef} className="relative shadow-2xl aspect-[9/16] h-full max-h-[80vh] sm:max-h-full sm:h-[800px] bg-neutral-900 group">
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
                            const isEntering = currentTime >= el.startTime && currentTime < el.startTime + 0.5;
                            const isExiting = currentTime <= el.endTime && currentTime > el.endTime - 0.5;

                            let opacity = 1;
                            let transform = 'translateY(0) scale(1)';

                            if (el.animationIn === 'fade' && isEntering) opacity = (currentTime - el.startTime) / 0.5;
                            else if (el.animationOut === 'fade' && isExiting) opacity = (el.endTime - currentTime) / 0.5;
                            else if (el.animationIn === 'slide' && isEntering) transform = `translateY(${(0.5 - (currentTime - el.startTime)) * 100}px)`;
                            else if (el.animationOut === 'slide' && isExiting) transform = `translateY(${-(0.5 - (el.endTime - currentTime)) * 100}px)`;
                            else if (el.animationIn === 'zoom' && isEntering) transform = `scale(${0.5 + (currentTime - el.startTime)})`;
                            else if (el.animationOut === 'zoom' && isExiting) transform = `scale(${0.5 + (el.endTime - currentTime)})`;

                            if (!isVisible) return null;

                            return (
                                <div
                                    key={el.id}
                                    className="absolute flex items-center justify-center"
                                    style={{
                                        left: `${el.x}%`,
                                        top: `${el.y}%`,
                                        width: `${el.w}%`,
                                        height: `${el.h}%`,
                                        opacity,
                                        transform,
                                        transition: 'opacity 0.1s linear, transform 0.1s linear'
                                    }}
                                >
                                    {el.type === 'text' ? (
                                        <div
                                            style={{
                                                fontFamily: el.fontFamily || 'Playfair Display',
                                                fontSize: el.fontSize || '24px',
                                                color: el.color || '#ffffff',
                                                fontWeight: el.fontWeight || 'normal',
                                            }}
                                            className="text-center w-full break-words"
                                        >
                                            {el.content}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            {el.src ? (
                                                <img src={el.src} alt="" className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <ImageIcon className="size-10 text-neutral-600/50" />
                                            )}
                                        </div>
                                    )}
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
        <div className="flex-1 grid lg:grid-cols-2 h-full bg-neutral-950 text-neutral-200 overflow-hidden relative">
            {/* Left Column: Tools + Timeline */}
            <div className="w-full border-r border-neutral-800 bg-neutral-900/50 flex flex-col overflow-hidden min-h-0">

                {/* Tools & Properties (Scrollable) */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <div className="p-5 border-b border-neutral-800 shrink-0">
                        <h3 className="font-bold text-white text-lg">
                            {isCustomerMode ? "Personalize Content" : "Video Elements"}
                        </h3>
                        {isCustomerMode && (
                            <p className="text-[11px] text-neutral-400 mt-1">Replace placeholder contents. Overall styling and timings are secured.</p>
                        )}
                    </div>
                    <div className="p-5 space-y-4">
                        {!isCustomerMode && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                type="button"
                                onClick={() => {
                                    const newId = `text_${Date.now()}`;
                                    const newElement = {
                                        id: newId,
                                        type: 'text',
                                        content: 'New Text Layer',
                                        x: 20, y: 40,
                                        fontFamily: 'Playfair Display',
                                        fontSize: '24px',
                                        color: '#ffffff',
                                        startTime: 0,
                                        endTime: duration > 0 ? duration : 5,
                                        animationIn: 'fade',
                                        animationOut: 'fade',
                                    };
                                    updateConfig([...elements, newElement]);
                                    setSelectedElementId(newId);
                                }}
                                className="w-full bg-white text-black hover:bg-neutral-200 font-bold gap-2 h-12 rounded-xl text-xs px-2"
                            >
                                <Type className="size-4 shrink-0" /> Add Text
                            </Button>

                            <label className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-bold gap-2 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-colors text-xs px-2">
                                <ImageIcon className="size-4 shrink-0" /> Add Image
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/webp" 
                                    className="hidden" 
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                const response = await axios.post('/media/upload', formData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                
                                                const newId = `image_${Date.now()}`;
                                                const newElement = {
                                                    id: newId,
                                                    type: 'image',
                                                    src: response.data.url,
                                                    x: 50, y: 50,
                                                    width: 100, height: 100, // starting size in px
                                                    startTime: 0,
                                                    endTime: duration > 0 ? duration : 5,
                                                    animationIn: 'fade',
                                                    animationOut: 'fade',
                                                };
                                                updateConfig([...elements, newElement]);
                                                setSelectedElementId(newId);
                                            } catch (error) {
                                                console.error("Failed to upload image:", error);
                                                alert("Failed to upload image. Please check format and size.");
                                            }
                                        }
                                        e.target.value = ''; // reset
                                    }}
                                />
                            </label>
                        </div>
                        )}

                        {/* Customer Mode Personalization Panel */}
                        {isCustomerMode ? (
                            <div className="space-y-4">
                                {elements.map((el: any, idx: number) => (
                                    <div key={el.id} className="grid gap-2 bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-700 cursor-pointer" onClick={() => setSelectedElementId(el.id)}>
                                        <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                                            <span>{el.type === 'image' ? 'Upload Image' : 'Text Content'}</span>
                                            <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Layer {idx + 1}</span>
                                        </label>
                                        {el.type === 'image' ? (
                                            <div className="flex gap-4 items-center mt-1">
                                                <div className="size-16 rounded-xl border border-neutral-600 bg-neutral-900 overflow-hidden flex items-center justify-center shrink-0">
                                                    {el.src ? (
                                                        <img src={el.src} alt="Custom" className="size-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="size-6 text-neutral-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col gap-1.5">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                try {
                                                                    const formData = new FormData();
                                                                    formData.append('file', file);
                                                                    const response = await axios.post('/media/upload', formData, {
                                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                                    });
                                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, src: response.data.url } : x);
                                                                    updateConfig(newEls);
                                                                } catch (error) {
                                                                    console.error("Failed to upload image:", error);
                                                                    alert("Failed to upload image.");
                                                                }
                                                            }
                                                        }}
                                                        className="flex h-9 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-300 file:border-0 file:bg-transparent file:text-xs file:font-semibold file:text-neutral-400 file:cursor-pointer"
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
                                                className="bg-neutral-900 border-neutral-700 h-9.5 text-xs text-white rounded-lg"
                                            />
                                        )}
                                    </div>
                                ))}
                                {elements.length === 0 && (
                                    <p className="text-xs text-neutral-500 italic text-center py-12">No personalization layers found.</p>
                                )}
                            </div>
                        ) : selectedElementId && (
                            <div className="space-y-4 pt-4 border-t border-neutral-800">
                                <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Properties</h4>
                                {(() => {
                                    const el = elements.find((e: any) => e.id === selectedElementId);
                                    if (!el) return null;
                                    return (
                                        <div className="space-y-3">
                                            {el.type !== 'image' && (
                                                <Input
                                                    value={el.content || ''}
                                                    onChange={(e) => {
                                                        const newEls = elements.map((x: any) => x.id === el.id ? { ...x, content: e.target.value } : x);
                                                        updateConfig(newEls);
                                                    }}
                                                    className="bg-neutral-900 border-neutral-700"
                                                    placeholder="Text content"
                                                />
                                            )}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-xs text-neutral-500 mb-1 block">Start Time (s)</label>
                                                    <Input
                                                        type="number" step="0.1"
                                                        value={el.startTime}
                                                        onChange={(e) => {
                                                            const newEls = elements.map((x: any) => x.id === el.id ? { ...x, startTime: parseFloat(e.target.value) } : x);
                                                            updateConfig(newEls);
                                                        }}
                                                        className="bg-neutral-900 border-neutral-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-neutral-500 mb-1 block">End Time (s)</label>
                                                    <Input
                                                        type="number" step="0.1"
                                                        value={el.endTime}
                                                        onChange={(e) => {
                                                            const newEls = elements.map((x: any) => x.id === el.id ? { ...x, endTime: parseFloat(e.target.value) } : x);
                                                            updateConfig(newEls);
                                                        }}
                                                        className="bg-neutral-900 border-neutral-700 h-9"
                                                    />
                                                </div>
                                            </div>

                                            {el.type !== 'image' ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">Font</label>
                                                        <select
                                                            value={el.fontFamily}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, fontFamily: e.target.value } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs shadow-sm transition-colors focus:border-indigo-500"
                                                        >
                                                            <option value="Playfair Display">Playfair Display</option>
                                                            <option value="Great Vibes">Great Vibes</option>
                                                            <option value="Montserrat">Montserrat</option>
                                                            <option value="Cinzel">Cinzel</option>
                                                            <option value="Dancing Script">Dancing Script</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">Color & Size</label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                type="color"
                                                                value={el.color}
                                                                onChange={(e) => {
                                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, color: e.target.value } : x);
                                                                    updateConfig(newEls);
                                                                }}
                                                                className="w-10 h-9 p-0.5 bg-neutral-900 border-neutral-700 cursor-pointer rounded-md"
                                                            />
                                                            <Input
                                                                type="text"
                                                                value={el.fontSize}
                                                                onChange={(e) => {
                                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, fontSize: e.target.value } : x);
                                                                    updateConfig(newEls);
                                                                }}
                                                                placeholder="Size (24px)"
                                                                title="Font Size"
                                                                className="w-16 bg-neutral-900 border-neutral-700 text-xs h-9"
                                                            />
                                                            <select
                                                                value={el.fontWeight || 'normal'}
                                                                onChange={(e) => {
                                                                    const newEls = elements.map((x: any) => x.id === el.id ? { ...x, fontWeight: e.target.value } : x);
                                                                    updateConfig(newEls);
                                                                }}
                                                                title="Font Weight"
                                                                className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs shadow-sm focus:border-indigo-500"
                                                            >
                                                                <option value="normal">Normal</option>
                                                                <option value="bold">Bold</option>
                                                                <option value="lighter">Light</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">Width (px)</label>
                                                        <Input
                                                            type="number"
                                                            value={el.width || 100}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, width: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-neutral-900 border-neutral-700"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">Height (px)</label>
                                                        <Input
                                                            type="number"
                                                            value={el.height || 100}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, height: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-neutral-900 border-neutral-700"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-xs text-neutral-500 mb-1 block">Animation</label>
                                                    <select
                                                        value={el.animationIn}
                                                        onChange={(e) => {
                                                            const newEls = elements.map((x: any) => x.id === el.id ? { ...x, animationIn: e.target.value, animationOut: e.target.value } : x);
                                                            updateConfig(newEls);
                                                        }}
                                                        className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm shadow-sm transition-colors focus:border-indigo-500"
                                                    >
                                                        <option value="none">None</option>
                                                        <option value="fade">Fade In/Out</option>
                                                        <option value="slide">Slide In/Out</option>
                                                        <option value="zoom">Zoom In/Out</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">X (%)</label>
                                                        <Input
                                                            type="number"
                                                            value={el.x}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, x: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-neutral-900 border-neutral-700"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">Y (%)</label>
                                                        <Input
                                                            type="number"
                                                            value={el.y}
                                                            onChange={(e) => {
                                                                const newEls = elements.map((x: any) => x.id === el.id ? { ...x, y: parseFloat(e.target.value) } : x);
                                                                updateConfig(newEls);
                                                            }}
                                                            className="bg-neutral-900 border-neutral-700"
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
                                                className="w-full gap-2"
                                            >
                                                <Trash className="size-4" /> Delete Layer
                                            </Button>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Timeline (inside Left Column) */}
                <div className="h-56 border-t border-neutral-800 bg-neutral-900 flex flex-col shrink-0 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    {/* Timeline Controls */}
                    <div className="flex items-center gap-4 p-3 border-b border-neutral-800 px-6 bg-neutral-950/50">
                        <Button type="button" onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; } }} variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-neutral-800">
                            <SkipBack className="size-4" />
                        </Button>
                        <Button type="button" onClick={togglePlay} variant="ghost" size="sm" className="h-11 w-11 p-0 rounded-full bg-white text-black hover:bg-neutral-200">
                            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-1" />}
                        </Button>
                        <div className="font-mono text-sm text-neutral-400 tracking-wider">
                            <span className="text-white font-medium">{currentTime.toFixed(1)}s</span> / {duration.toFixed(1)}s
                        </div>
                    </div>

                    {/* Timeline Tracks */}
                    <div className="flex-1 overflow-x-auto p-6 relative">
                        <div className="space-y-3 min-w-[500px]">
                            {/* Main Video Track */}
                            <div className="flex items-center gap-4">
                                <div className="w-24 text-xs font-bold text-neutral-500 uppercase tracking-wider shrink-0">Background</div>
                                <div className="flex-1 h-14 bg-indigo-900/30 rounded-xl border border-indigo-500/20 overflow-hidden relative">
                                    <div
                                        className="absolute top-0 left-0 bottom-0 bg-indigo-500/20 border-r-2 border-indigo-400"
                                        style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                                    />
                                    <div className="absolute inset-0 flex items-center px-4">
                                        <span className="text-xs font-mono text-indigo-300">video-template.mp4</span>
                                    </div>
                                </div>
                            </div>
                            {/* Text Tracks */}
                            {elements.map((el: any) => {
                                const currentStartTime = timelineDrag?.id === el.id && timelineDrag.type === 'start' ? timelineDrag.time : el.startTime;
                                const currentEndTime = timelineDrag?.id === el.id && timelineDrag.type === 'end' ? timelineDrag.time : el.endTime;

                                return (
                                    <div key={el.id} className="flex items-center gap-4" onClick={() => setSelectedElementId(el.id)}>
                                        <div className={`w-24 text-xs font-bold truncate tracking-wider shrink-0 cursor-pointer transition-colors ${selectedElementId === el.id ? 'text-indigo-400' : 'text-neutral-500'}`}>
                                            {el.type === 'image' ? 'Image Layer' : (el.content || 'Text Layer')}
                                        </div>
                                        <div className="flex-1 h-10 bg-neutral-800/50 rounded-xl overflow-hidden relative border border-neutral-700 cursor-pointer hover:border-neutral-500">
                                            <div
                                                className={`absolute top-0 bottom-0 rounded-lg group ${selectedElementId === el.id ? 'bg-indigo-500' : 'bg-neutral-600'}`}
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
                                                            newTime = Math.min(newTime, el.endTime - 0.5); // Constraint
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
                                                            newTime = Math.max(newTime, el.startTime + 0.5); // Constraint
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
            <div className="flex-1 flex items-center justify-center bg-black relative p-4 lg:p-8 overflow-hidden">
                <div ref={containerRef} className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 aspect-[9/16] h-full bg-neutral-900 max-h-full">
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
                        // Determine if element should be visible based on current time
                        const isVisible = currentTime >= el.startTime && currentTime <= el.endTime;
                        if (!isVisible) return null; // Strictly respect timeline duration

                        const displayX = dragPos?.id === el.id ? dragPos.x : el.x;
                        const displayY = dragPos?.id === el.id ? dragPos.y : el.y;

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
                                        // Final save to config
                                        const newEls = elements.map((x: any) => x.id === el.id ? { ...x, x: currentX, y: currentY } : x);
                                        updateConfig(newEls);
                                    };

                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                                className={`absolute ${isCustomerMode ? '' : 'cursor-pointer'} p-2 ${!dragPos ? 'transition-colors duration-300' : ''} ${selectedElementId === el.id && !isCustomerMode ? 'ring-2 ring-indigo-500 bg-indigo-500/10 border border-indigo-400 border-dashed cursor-move' : ''}`}
                                style={{
                                    left: `${displayX}%`,
                                    top: `${displayY}%`,
                                    ...(el.type !== 'image' ? {
                                        fontFamily: el.fontFamily,
                                        fontSize: el.fontSize,
                                        fontWeight: el.fontWeight || 'normal',
                                        color: el.color,
                                    } : {}),
                                    transform: 'translate(-50%, -50%)',
                                    animation: el.animationIn === 'fade' ? 'fadeIn 0.5s ease'
                                        : el.animationIn === 'slide' ? 'slideIn 0.5s ease'
                                            : el.animationIn === 'zoom' ? 'zoomIn 0.5s ease'
                                                : undefined
                                }}
                            >
                                {el.type === 'image' ? (
                                    <img 
                                        src={el.src} 
                                        alt="" 
                                        style={{ width: el.width || 100, height: el.height || 100 }} 
                                        className="object-contain pointer-events-none" 
                                    />
                                ) : (
                                    el.content
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
