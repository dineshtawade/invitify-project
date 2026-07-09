import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { toJpeg, toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { normalizeConfig } from '@/utils/builder-utils';

interface VideoGeneratorProps {
    userTemplate: any;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (videoUrl: string) => void;
    uploadEndpoint: string;
}

const fontStyles: Record<string, string> = {
    playfair: "'Playfair Display', serif",
    vibes: "'Great Vibes', cursive",
    montserrat: "'Montserrat', sans-serif",
    cinzel: "'Cinzel', serif",
};

export default function VideoGenerator({ userTemplate, isOpen, onClose, onComplete, uploadEndpoint }: VideoGeneratorProps) {
    const [status, setStatus] = useState<string>('idle');
    const [progress, setProgress] = useState<number>(0);
    const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [errorMsg, setErrorMsg] = useState<string>('');
    
    const isVideoTemplate = userTemplate.template?.type === 'video';
    const DURATION_SECONDS = isVideoTemplate ? (userTemplate.custom_config.duration || 5) : 5;
    const FPS = 15; // 15 FPS for faster generation
    const TOTAL_FRAMES = Math.floor(DURATION_SECONDS * FPS);

    // Animation states
    const [currentTimeMs, setCurrentTimeMs] = useState(DURATION_SECONDS * 1000);

    useEffect(() => {
        const loadFFmpeg = async () => {
            const baseURL = '/ffmpeg';
            
            // Dynamically load ffmpeg UMD script
            if (!(window as any).FFmpegWASM) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = `${baseURL}/ffmpeg.js`;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }

            const ff = new (window as any).FFmpegWASM.FFmpeg();
            ff.on('progress', ({ progress, time }: any) => {
                if (status !== 'capturing') {
                    setStatus('encoding');
                    setProgress(Math.round(progress * 100));
                }
            });
            await ff.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setFFmpeg(ff);
        };
        
        if (isOpen && !ffmpeg) {
            loadFFmpeg().catch(err => {
                console.error("FFmpeg load failed", err);
                setErrorMsg(err.message || 'Failed to load video engine');
                setStatus('error');
            });
        }
    }, [isOpen, ffmpeg, status]);

    const startGeneration = async () => {
        if (!ffmpeg || !containerRef.current) return;
        
        setStatus('capturing');
        setProgress(0);
        setErrorMsg('');
        
        try {
            // Setup recording loop
            for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
                const timeMs = (frame / FPS) * 1000;
                
                flushSync(() => {
                    setCurrentTimeMs(timeMs);
                });
                
                // Allow browser to paint
                await new Promise(resolve => setTimeout(resolve, 50));

                let dataUrl;
                if (isVideoTemplate) {
                    dataUrl = await toPng(containerRef.current, {
                        pixelRatio: 1.5,
                        cacheBust: true,
                        backgroundColor: 'transparent',
                        style: {
                            transform: 'scale(1)',
                            transformOrigin: 'top left',
                        }
                    });
                    ffmpeg.writeFile(`frame_${frame.toString().padStart(4, '0')}.png`, await fetchFile(dataUrl));
                } else {
                    dataUrl = await toJpeg(containerRef.current, {
                        quality: 0.8,
                        pixelRatio: 1.5,
                        cacheBust: true,
                        style: {
                            transform: 'scale(1)',
                            transformOrigin: 'top left',
                        }
                    });
                    ffmpeg.writeFile(`frame_${frame.toString().padStart(4, '0')}.jpg`, await fetchFile(dataUrl));
                }
                
                setProgress(Math.round((frame / TOTAL_FRAMES) * 100));
            }

            setStatus('encoding');
            setProgress(0);

            if (isVideoTemplate && userTemplate.custom_config.video_url) {
                setStatus('downloading background video...');
                await ffmpeg.writeFile('bg.mp4', await fetchFile(userTemplate.custom_config.video_url));

                setStatus('encoding');
                await ffmpeg.exec([
                    '-i', 'bg.mp4',
                    '-framerate', `${FPS}`,
                    '-i', 'frame_%04d.png',
                    '-filter_complex', '[1:v][0:v]scale2ref=w=iw:h=ih[ovl][bg];[bg][ovl]overlay=0:0',
                    '-c:a', 'copy',
                    '-preset', 'ultrafast',
                    '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p',
                    'output.mp4'
                ]);
            } else {
                await ffmpeg.exec([
                    '-framerate', `${FPS}`,
                    '-i', 'frame_%04d.jpg',
                    '-preset', 'ultrafast',
                    '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p',
                    'output.mp4'
                ]);
            }

            const fileData = await ffmpeg.readFile('output.mp4');
            const blob = new Blob([fileData as any], { type: 'video/mp4' });

            // Trigger auto-download
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `invitation_${userTemplate.id}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            setStatus('uploading');
            await uploadVideo(blob);

            // Cleanup frames
            for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
                ffmpeg.deleteFile(`frame_${frame.toString().padStart(4, '0')}.${isVideoTemplate ? 'png' : 'jpg'}`);
            }
            if (isVideoTemplate) ffmpeg.deleteFile('bg.mp4');
            ffmpeg.deleteFile('output.mp4');

        } catch (error: any) {
            console.error("Video generation failed:", error);
            setErrorMsg(error.message || 'Unknown error occurred during generation');
            setStatus('error');
        } finally {
            flushSync(() => {
                setCurrentTimeMs(DURATION_SECONDS * 1000); // Reset preview to final state
            });
        }
    };

    const uploadVideo = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('video', blob, `invitation_${userTemplate.id}.mp4`);

        try {
            const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(uploadEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Upload failed: ${response.status} ${text}`);
            }
            
            const data = await response.json();
            setStatus('success');
            setTimeout(() => {
                onComplete(data.video_url);
            }, 1500);

        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Failed to upload video');
            setStatus('error');
            throw error; // Rethrow to be caught by startGeneration
        }
    };

    const renderTemplate = () => {
        if (isVideoTemplate) {
            const elements = userTemplate.custom_config.elements || [];
            const currentTime = currentTimeMs / 1000;

            return (
                <div 
                    ref={containerRef}
                    className="relative w-[450px] h-[800px] bg-transparent overflow-hidden"
                    style={{ transform: 'scale(0.8)', transformOrigin: 'top center', marginBottom: '-160px' }}
                >
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
                                        {el.src && <img src={el.src} className="max-w-full max-h-full object-contain" />}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        const cfg = normalizeConfig(userTemplate.custom_config, userTemplate.template.bg_gradient);
        const page = cfg.pages[0];

        return (
            <div 
                ref={containerRef}
                className="relative w-[360px] h-[640px] bg-white overflow-hidden shadow-2xl rounded-3xl"
                style={{ background: page.bg_gradient }}
            >
                {page.elements.map((elem: any) => {
                    const style: React.CSSProperties = {
                        position: 'absolute',
                        left: `${elem.x}%`,
                        top: `${elem.y}%`,
                        width: `${elem.w}%`,
                        height: `${elem.h}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: elem.textAlign === 'left' ? 'flex-start' : elem.textAlign === 'right' ? 'flex-end' : 'center',
                        textAlign: elem.textAlign || 'center',
                        fontFamily: fontStyles[elem.fontStyle || 'playfair'] || fontStyles.playfair,
                        color: elem.textColor || '#1f2937',
                        fontSize: elem.fontSize ? `${elem.fontSize}px` : undefined,
                        fontWeight: elem.fontWeight || 'normal',
                        fontStyle: elem.isItalic ? 'italic' : 'normal',
                    };

                    const animationStyle = computeAnimation(elem, currentTimeMs);

                    return (
                        <div key={elem.id} style={{ ...style, ...animationStyle }}>
                            {elem.type === 'text' && (
                                <span>{getTypingEffectText(elem.content, currentTimeMs, elem.id)}</span>
                            )}
                            {elem.type === 'image' && elem.url && (
                                <img src={elem.url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const computeAnimation = (elem: any, timeMs: number) => {
        const delayMs = (elem.y / 100) * 1500; 
        
        if (timeMs < delayMs) {
            return { opacity: 0, transform: 'translateY(20px) scale(0.95)' };
        }

        const elapsed = timeMs - delayMs;
        const progress = Math.min(elapsed / 1000, 1); 
        const easeOut = progress * (2 - progress);

        return {
            opacity: easeOut,
            transform: `translateY(${20 - (20 * easeOut)}px) scale(${0.95 + (0.05 * easeOut)})`,
        };
    };

    const getTypingEffectText = (fullText: string, timeMs: number, id: string) => {
        if (!fullText) return '';
        
        const startDelayMs = (parseInt(id.replace(/\D/g, '') || '0') % 5) * 500 + 1000;
        
        if (timeMs < startDelayMs) return '';
        
        const charsPerSecond = 20;
        const elapsedSinceStart = timeMs - startDelayMs;
        const charsToShow = Math.floor((elapsedSinceStart / 1000) * charsPerSecond);
        
        return fullText.substring(0, charsToShow);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if(!open && status !== 'capturing' && status !== 'encoding') onClose(); }}>
            <DialogContent aria-describedby={undefined} className="max-w-4xl p-0 overflow-hidden bg-neutral-950 border-neutral-800 text-white flex h-[80vh]">
                
                {/* Left side: Video Rendering Canvas */}
                <div className="flex-1 bg-black flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="scale-90 transform-gpu">
                        {renderTemplate()}
                    </div>
                </div>

                {/* Right side: Controls & Status */}
                <div className="w-80 bg-neutral-900 border-l border-neutral-800 p-8 flex flex-col justify-center">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                            <Video className="size-5 text-indigo-400" /> Video Generator
                        </DialogTitle>
                        <p className="text-sm text-neutral-400 mt-2">
                            Generate a premium cinematic MP4 video of your invitation card.
                        </p>
                    </DialogHeader>

                    <div className="flex flex-col gap-6">
                        {status === 'idle' && (
                            <Button 
                                onClick={startGeneration} 
                                disabled={!ffmpeg}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold"
                            >
                                {ffmpeg ? 'Start Generating Video' : 'Loading Engine...'}
                            </Button>
                        )}

                        {status === 'capturing' && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-amber-400 font-bold">
                                    <Loader2 className="size-4 animate-spin" /> Capturing Frames...
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="text-xs text-neutral-500 text-right">{progress}%</span>
                            </div>
                        )}

                        {status === 'encoding' && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                                    <Loader2 className="size-4 animate-spin" /> Encoding to MP4...
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="text-xs text-neutral-500 text-right">{progress}%</span>
                            </div>
                        )}

                        {status === 'uploading' && (
                            <div className="flex items-center gap-2 text-emerald-400 font-bold animate-pulse">
                                <Loader2 className="size-4 animate-spin" /> Saving to Server...
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="flex flex-col items-center justify-center gap-3 text-emerald-400 p-4 border border-emerald-900/50 bg-emerald-950/20 rounded-xl">
                                <CheckCircle2 className="size-8" />
                                <span className="font-bold">Video Created Successfully!</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex flex-col items-center justify-center gap-3 text-red-400 p-4 border border-red-900/50 bg-red-950/20 rounded-xl text-center">
                                <AlertCircle className="size-8" />
                                <span className="font-bold">Failed to generate video.</span>
                                {errorMsg && <span className="text-xs text-red-300 mt-2 break-all">{errorMsg}</span>}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
