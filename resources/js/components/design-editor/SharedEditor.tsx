import React, { useState, useRef, useEffect } from 'react';
import { Eye, Smartphone, Monitor, Tablet, Type, Image as ImageIcon, Video, Link as LinkIcon, MapPin, MousePointer2, Trash } from 'lucide-react';
import { BlockSettings } from './BlockSettings';
import { getNewElementDefaults, type Block, type WebsiteConfig } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as LucideIcons from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface SharedEditorProps {
    // New format: WebsiteConfig with pages
    config?: WebsiteConfig;
    onChange?: (config: WebsiteConfig) => void;
    // Legacy format: flat Block[] (used by business-website pages)
    blocks?: Block[];
    title?: string;
    slug?: string;
    pagesNav?: { slug: string; title: string; active: boolean }[];
    isInvitation?: boolean;
    isCustomerMode?: boolean;
    customBlocks?: any[];
}



const pxToCqw = (px?: number | string | null, defaultPx: number = 0) => {
    const val = px !== undefined && px !== null ? Number(px) : defaultPx;
    return `${(val / 384) * 100}cqw`;
};

function normalizeToConfig(props: SharedEditorProps): WebsiteConfig {
    if (props.config && props.config.pages) return props.config;
    if (props.blocks) return { pages: [{ id: 'home', name: 'Home', blocks: props.blocks }] };
    return { pages: [{ id: 'home', name: 'Home', blocks: [] }] };
}

export function SharedEditor(props: SharedEditorProps) {
    const { title, slug, pagesNav, isInvitation = false, isCustomerMode = false, customBlocks = [] } = props;
    const config = normalizeToConfig(props);
    const onChange = (newConfig: WebsiteConfig) => {
        if (props.onChange) props.onChange(newConfig);
        // Legacy: if caller passes blocks + onChange that expects Block[]
        // they should migrate to config/onChange pattern
    };
    const [activePageId, setActivePageId] = useState<string>(config?.pages?.[0]?.id || 'home');
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragPos, setDragPos] = useState<{ id: string, x: number, y: number } | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState<Record<string, boolean>>({});

    const activePage = config?.pages?.find(p => p.id === activePageId) || config?.pages?.[0];
    const blocks = activePage?.blocks || [];

    const handleUpdateBlocks = (newBlocks: Block[]) => {
        if (!activePage) return;
        onChange({
            ...config,
            pages: config.pages.map(p => p.id === activePage.id ? { ...p, blocks: newBlocks } : p)
        });
    };

    const handleAddElement = (type: string) => {
        if (type === 'background') {
            const existingBg = blocks.find(b => b.type === 'background');
            if (existingBg) {
                setSelectedElementId(existingBg.id);
                return;
            }
        }
        const newEl = getNewElementDefaults(type);
        handleUpdateBlocks([...blocks, newEl]);
        setSelectedElementId(newEl.id);
    };

    const handleUpdateElement = (id: string, updates: Partial<Block>) => {
        handleUpdateBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const handleDeleteElement = (id: string) => {
        handleUpdateBlocks(blocks.filter(b => b.id !== id));
        if (selectedElementId === id) setSelectedElementId(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploadingImage(prev => ({ ...prev, [elementId]: true }));
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/media/upload', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const result = await response.json();
                handleUpdateElement(elementId, { src: result.url });
            } catch (err) {
                console.error(err);
                alert('Failed to upload file. Please check format (PNG, JPG, JPEG, MP4, WEBM) and try again.');
            } finally {
                setIsUploadingImage(prev => ({ ...prev, [elementId]: false }));
            }
        }
    };

    const getDeviceWidth = () => {
        if (previewDevice === 'mobile') return 'max-w-sm';
        if (previewDevice === 'tablet') return 'max-w-2xl';
        return 'max-w-5xl';
    };

    const bgBlock = blocks.find(b => b.type === 'background');
    const bgStyle = bgBlock ? (bgBlock.src ? { backgroundImage: `url(${bgBlock.src})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: bgBlock.bgColor }) : { backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #00000010 1px, transparent 1px)', backgroundColor: 'white' };

    return (
        <div className="flex-1 overflow-hidden flex h-full">
            {/* Left Toolbar (Elements & Layers / Customer Content Editor) */}
            {!isCustomerMode ? (
                <div className="w-[300px] shrink-0 border-r border-neutral-150 dark:border-neutral-850 flex flex-col overflow-y-auto bg-neutral-50 dark:bg-neutral-950 custom-scrollbar">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <h4 className="text-xs uppercase tracking-widest font-black text-neutral-400 mb-3">Add Elements</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('text')} className="h-10 justify-start"><Type className="size-4 mr-2" /> Text</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('image')} className="h-10 justify-start"><ImageIcon className="size-4 mr-2" /> Image</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('button')} className="h-10 justify-start"><MousePointer2 className="size-4 mr-2" /> Button</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('icon')} className="h-10 justify-start"><LucideIcons.Star className="size-4 mr-2" /> Icon</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('video')} className="h-10 justify-start"><Video className="size-4 mr-2" /> Video</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('map')} className="h-10 justify-start"><MapPin className="size-4 mr-2" /> Map</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('carousel')} className="h-10 justify-start"><LucideIcons.Images className="size-4 mr-2" /> Carousel</Button>
                        <Button variant="outline" size="sm" onClick={() => {
                            if (!bgBlock) handleAddElement('background');
                            setTimeout(() => {
                                const bg = blocks.find(b => b.type === 'background');
                                if (bg) setSelectedElementId(bg.id);
                            }, 50);
                        }} className="h-10 justify-start border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 hover:text-pink-800 dark:bg-pink-950/20 dark:border-pink-900/50 dark:text-pink-400"><LucideIcons.PaintBucket className="size-4 mr-2" /> Canvas BG</Button>

                        {/* Effects as buttons in the grid */}
                        <Button variant="outline" size="sm" onClick={() => {
                            if (!bgBlock) handleAddElement('background');
                            setTimeout(() => {
                                const bg = blocks.find(b => b.type === 'background');
                                if (bg) setSelectedElementId(bg.id);
                            }, 50);
                        }} className="h-10 justify-start border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-400"><LucideIcons.Wand2 className="size-4 mr-2" /> Animations</Button>
                        
                        <Button variant="outline" size="sm" onClick={() => {
                            if (!bgBlock) handleAddElement('background');
                            setTimeout(() => {
                                const bg = blocks.find(b => b.type === 'background');
                                if (bg) setSelectedElementId(bg.id);
                            }, 50);
                        }} className="h-10 justify-start border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800 dark:bg-orange-950/20 dark:border-orange-900/50 dark:text-orange-400"><LucideIcons.PartyPopper className="size-4 mr-2" /> Celebrations</Button>
                    </div>
                </div>

                {/* Layer List */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <h4 className="text-xs uppercase tracking-widest font-black text-neutral-400 mb-3">Layers</h4>
                    <div className="space-y-2">
                        {blocks.map((el, i) => (
                            <div 
                                key={el.id} 
                                onClick={() => setSelectedElementId(el.id)}
                                className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${selectedElementId === el.id ? 'bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-950/30 dark:border-pink-900/50 dark:text-pink-400' : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300'}`}
                            >
                                <span className="font-semibold capitalize truncate">{el.content || el.type}</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }} className="text-neutral-400 hover:text-red-500">
                                    <Trash className="size-3" />
                                </button>
                            </div>
                        ))}
                        {blocks.length === 0 && <div className="text-center text-xs text-neutral-400 py-4">No layers yet.</div>}
                    </div>
                </div>
            </div>
            ) : (
                <div className="w-[350px] shrink-0 border-r border-neutral-150 dark:border-neutral-850 flex flex-col overflow-y-auto bg-white dark:bg-neutral-950 custom-scrollbar p-6">
                    <h3 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">Customize Content</h3>
                    <div className="space-y-6">
                        {blocks.filter(el => ['text', 'image', 'video', 'button', 'background'].includes(el.type)).map((el, idx) => {
                            if (el.type === 'text' || el.type === 'button') {
                                return (
                                    <div key={el.id} className="space-y-2 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                                        <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold block">{el.type} Field {idx + 1}</label>
                                        {el.type === 'text' && el.content && el.content.length > 50 ? (
                                            <textarea 
                                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
                                                value={el.content || ''}
                                                onChange={e => handleUpdateElement(el.id, { content: e.target.value })}
                                            />
                                        ) : (
                                            <Input 
                                                value={el.content || ''}
                                                onChange={e => handleUpdateElement(el.id, { content: e.target.value })}
                                            />
                                        )}
                                        {el.type === 'button' && (
                                            <div className="mt-2">
                                                <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">Link URL</label>
                                                <Input 
                                                    value={el.actionType === 'url' ? el.url : ''}
                                                    onChange={e => handleUpdateElement(el.id, { actionType: 'url', url: e.target.value })}
                                                    placeholder="https://"
                                                    className="h-8"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            } else if (el.type === 'image' || el.type === 'video' || el.type === 'background') {
                                return (
                                    <div key={el.id} className="space-y-3 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                                        <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold capitalize block">{el.type} File {idx + 1}</label>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Upload Local File</Label>
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    accept={el.type === 'video' ? 'video/mp4,video/webm' : 'image/*'}
                                                    onChange={(e) => handleImageUpload(e, el.id)}
                                                    disabled={isUploadingImage[el.id]}
                                                    className="cursor-pointer file:text-[10px] text-[10px] h-8 bg-white pr-8"
                                                />
                                                {isUploadingImage[el.id] && (
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                        <Loader2 className="size-3 animate-spin text-indigo-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <hr className="flex-1" />
                                            <span className="text-[9px] text-neutral-400 font-medium uppercase">OR Paste URL</span>
                                            <hr className="flex-1" />
                                        </div>
                                        <Input 
                                            value={el.src || ''}
                                            onChange={e => handleUpdateElement(el.id, { src: e.target.value })}
                                            placeholder={`https://example.com/your-${el.type}.jpg`}
                                            className="h-8 text-xs bg-white dark:bg-neutral-950"
                                        />
                                        {el.src && (el.type === 'image' || el.type === 'background') && (
                                            <div className="mt-2 h-24 rounded overflow-hidden border border-neutral-200">
                                                <img src={el.src} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            )}

            {/* Central Canvas */}
            <div className="flex-1 flex flex-col bg-neutral-900 relative h-full max-h-full overflow-hidden">
                {/* Topbar */}
                <div className="flex items-center gap-4 justify-between w-full p-4 text-white text-xs z-10 bg-neutral-950/50 backdrop-blur-md shrink-0 border-b border-neutral-800">
                    <span className="font-semibold uppercase tracking-widest flex items-center gap-1.5 opacity-80">
                        <Eye className="size-4" /> Canvas
                    </span>
                    <div className="flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-750">
                        <button type="button" onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}><Monitor className="size-4" /></button>
                        <button type="button" onClick={() => setPreviewDevice('tablet')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}><Tablet className="size-4" /></button>
                        <button type="button" onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}><Smartphone className="size-4" /></button>
                    </div>
                </div>

                {/* Page Manager Tab Bar */}
                <div className="flex items-center gap-2 w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0 overflow-x-auto custom-scrollbar">
                    {config?.pages?.map(page => (
                        <div key={page.id} className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${activePageId === page.id ? 'bg-white shadow-sm border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700' : 'bg-transparent border border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}>
                            <button
                                onClick={() => {
                                    setActivePageId(page.id);
                                    setSelectedElementId(null);
                                }}
                                className={`text-xs font-semibold whitespace-nowrap ${activePageId === page.id ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}`}
                            >
                                {page.name}
                            </button>
                            {!isCustomerMode && config.pages.length > 1 && (
                                <button 
                                    onClick={() => {
                                        const newPages = config.pages.filter(p => p.id !== page.id);
                                        onChange({ ...config, pages: newPages });
                                        if (activePageId === page.id) {
                                            setActivePageId(newPages[0].id);
                                            setSelectedElementId(null);
                                        }
                                    }}
                                    className="ml-1 text-neutral-400 hover:text-red-500 transition-colors"
                                >
                                    <LucideIcons.X className="size-3" />
                                </button>
                            )}
                        </div>
                    ))}
                    {!isCustomerMode && (
                        <button 
                            onClick={() => {
                                const newId = `page_${Math.random().toString(36).substr(2, 9)}`;
                                const newPageName = `Page ${(config?.pages?.length || 0) + 1}`;
                                
                                const navBtn = getNewElementDefaults('button');
                                navBtn.content = `Go to ${newPageName}`;
                                navBtn.actionType = 'page';
                                navBtn.targetPageId = newId;
                                navBtn.y = 80; // place near bottom to avoid overlap with top elements
                                
                                const newPages = config?.pages ? [...config.pages] : [];
                                if (newPages.length > 0) {
                                    newPages[0] = {
                                        ...newPages[0],
                                        blocks: [...newPages[0].blocks, navBtn]
                                    };
                                }
                                
                                newPages.push({ id: newId, name: newPageName, blocks: [] });
                                
                                onChange({
                                    ...config,
                                    pages: newPages
                                });
                                setActivePageId(newId);
                                setSelectedElementId(null);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20 whitespace-nowrap flex items-center gap-1 ml-2"
                        >
                            <LucideIcons.Plus className="size-3" /> Add Page
                        </button>
                    )}
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-neutral-100/50 dark:bg-neutral-900/50 custom-scrollbar" onClick={() => setSelectedElementId(null)}>
                    <div 
                        ref={containerRef}
                        className={`relative w-full shadow-2xl transition-all duration-300 ${getDeviceWidth()} overflow-hidden rounded-md`}
                        style={{
                            ...bgStyle,
                            containerType: 'inline-size' as any,
                            minHeight: pxToCqw(Math.max(800, blocks.filter(b => b.type !== 'background').reduce((max, b) => {
                                const bY = dragPos?.id === b.id ? dragPos.y : b.y;
                                return Math.max(max, bY + (b.h || 100));
                            }, 0) + 200))
                        }}
                    >
                        {blocks.filter(b => b.type !== 'background').map(el => {
                            const displayX = dragPos?.id === el.id ? dragPos.x : el.x;
                            const displayY = dragPos?.id === el.id ? dragPos.y : el.y;
                            const isSelected = selectedElementId === el.id;

                            let innerContent = null;
                            if (el.type === 'text') innerContent = el.content;
                            else if (el.type === 'image') innerContent = <img src={el.src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: pxToCqw(el.borderRadius) }} draggable="false" />;
                            else if (el.type === 'video') innerContent = <video src={el.src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: pxToCqw(el.borderRadius), pointerEvents: 'none' }} autoPlay loop muted playsInline />;
                            else if (el.type === 'button') innerContent = <button style={{ width: '100%', height: '100%', backgroundColor: el.bgColor, color: el.color, borderRadius: pxToCqw(el.borderRadius), fontSize: pxToCqw(el.fontSize, 16), fontWeight: el.fontWeight }} className="flex items-center justify-center pointer-events-none">{el.content}</button>;
                            else if (el.type === 'icon') {
                                const iconKey = el.iconName || (el as any).iconType || (el as any).icon || 'Star';
                                const IconComp = (LucideIcons as any)[iconKey] || LucideIcons.Star;
                                innerContent = <IconComp style={{ width: '100%', height: '100%', color: el.color }} />;
                            } else if (el.type === 'map') innerContent = <iframe src={el.src} style={{ width: '100%', height: '100%', borderRadius: pxToCqw(el.borderRadius), pointerEvents: isSelected ? 'none' : 'auto' }} frameBorder="0" />;
                            else if (el.type === 'carousel') {
                                const imgs = el.images && el.images.length > 0 ? el.images : ['https://via.placeholder.com/300x200'];
                                innerContent = (
                                    <Swiper 
                                        modules={[Autoplay, Pagination]} 
                                        autoplay={{ delay: 2500 }} 
                                        pagination={{ clickable: true }}
                                        className="w-full h-full"
                                        style={{ borderRadius: pxToCqw(el.borderRadius), pointerEvents: isSelected ? 'none' : 'auto' }}
                                    >
                                        {imgs.map((src, idx) => (
                                            <SwiperSlide key={idx}>
                                                <img src={src} className="w-full h-full object-cover" draggable="false" />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                );
                            }

                            return (
                                <React.Fragment key={el.id}>
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            setSelectedElementId(el.id);
                                            if (isCustomerMode) return;
                                            
                                            const container = containerRef.current;
                                            if (!container) return;
                                            const rect = container.getBoundingClientRect();
                                            const startX = e.clientX;
                                            const startY = e.clientY;
                                            const startLeft = el.x;
                                            const startTop = el.y;

                                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                                const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
                                                const scaleRatio = 384 / rect.width;
                                                const deltaY = (moveEvent.clientY - startY) * scaleRatio;
                                                setDragPos({ 
                                                    id: el.id, 
                                                    x: Math.max(0, Math.min(100, startLeft + deltaX)), 
                                                    y: Math.max(0, startTop + deltaY)
                                                });
                                            };
                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                                setDragPos(current => {
                                                    if (current) {
                                                        handleUpdateElement(el.id, { x: current.x, y: current.y });
                                                    }
                                                    return null;
                                                });
                                            };
                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                        className={`absolute ${!isCustomerMode ? 'cursor-move' : ''} ${isSelected && !isCustomerMode ? 'ring-2 ring-indigo-500 shadow-xl z-50' : ''}`}

                                        style={{
                                            left: `${displayX}%`,
                                            top: pxToCqw(displayY),
                                            width: el.w ? pxToCqw(el.w) : undefined,
                                            height: el.h ? pxToCqw(el.h) : undefined,
                                            zIndex: el.zIndex || 1,
                                            ...(el.type === 'text' || el.type === 'link' || el.type === 'button' ? {
                                                fontSize: pxToCqw(el.fontSize, 16),
                                                fontWeight: el.fontWeight || 'normal',
                                                fontFamily: el.fontFamily,
                                                color: el.color,
                                                textShadow: el.textShadow && el.textShadow !== 'none' ? el.textShadow : undefined,
                                                whiteSpace: 'nowrap'
                                            } : {})
                                        }}
                                    >
                                        {innerContent}
                                        {isSelected && (el.w !== undefined) && (
                                            <div className="absolute right-0 bottom-0 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-se-resize translate-x-1/2 translate-y-1/2" />
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Right Toolbar (Properties) */}
            {!isCustomerMode && selectedElementId && blocks.find(b => b.id === selectedElementId) && (
                <div className="w-80 shrink-0 border-l border-neutral-200 dark:border-neutral-800 flex flex-col overflow-y-auto bg-white dark:bg-neutral-950 shadow-xl custom-scrollbar z-20">
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md z-10">
                        <h4 className="text-xs uppercase tracking-widest font-black text-neutral-400">Properties</h4>
                        <button type="button" onClick={() => setSelectedElementId(null)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                            <LucideIcons.X className="size-4" />
                        </button>
                    </div>
                    <BlockSettings 
                        block={blocks.find(b => b.id === selectedElementId)!} 
                        onUpdate={handleUpdateElement} 
                        pages={config?.pages || []}
                        isCustomerMode={isCustomerMode} 
                    />
                </div>
            )}
        </div>
    );
}
