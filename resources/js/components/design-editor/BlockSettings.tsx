import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Type, ImageIcon, Layers, Move, Palette } from 'lucide-react';
import type { Block, PageConfig } from './types';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlockSettingsProps {
    block: Block;
    onUpdate: (id: string, updates: Partial<Block>) => void;
    isCustomerMode?: boolean;
    pages?: PageConfig[];
}

export function BlockSettings({ block, onUpdate, isCustomerMode, pages = [] }: BlockSettingsProps) {
    const [isUploading, setIsUploading] = React.useState(false);

    if (!block) return null;


    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'src' | string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);

        try {
            const axios = (await import('axios')).default;
            const res = await axios.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.url;
            
            if (field === 'src') {
                // If it's a background block and they upload an image, we should probably set src
                onUpdate(block.id, { src: url });
            } else if (field.startsWith('images.')) {
                const idx = parseInt(field.split('.')[1]);
                const newImgs = [...(block.images || [])];
                newImgs[idx] = url;
                onUpdate(block.id, { images: newImgs });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('File upload failed. Ensure the file is an image or video and under 50MB.');
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = ''; // Reset input
        }
    };
    
    return (
        <div className="p-4 flex flex-col gap-6 text-xs h-full bg-neutral-50/50 dark:bg-neutral-900/30">
            {/* Position and Dimensions (For all elements except background) */}
            {!isCustomerMode && block.type !== 'background' && (
                <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5"><Move className="size-3" /> Layout & Position</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500">X Position (%)</Label>
                        <Input type="number" value={block.x.toFixed(1)} onChange={(e) => onUpdate(block.id, { x: Number(e.target.value) })} className="h-7 text-xs bg-white dark:bg-neutral-950" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500">Y Position (%)</Label>
                        <Input type="number" value={block.y.toFixed(1)} onChange={(e) => onUpdate(block.id, { y: Number(e.target.value) })} className="h-7 text-xs bg-white dark:bg-neutral-950" />
                    </div>
                    {block.w !== undefined && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500">Width (px)</Label>
                            <Input type="number" value={block.w} onChange={(e) => onUpdate(block.id, { w: Number(e.target.value) })} className="h-7 text-xs bg-white dark:bg-neutral-950" />
                        </div>
                    )}
                    {block.h !== undefined && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500">Height (px)</Label>
                            <Input type="number" value={block.h} onChange={(e) => onUpdate(block.id, { h: Number(e.target.value) })} className="h-7 text-xs bg-white dark:bg-neutral-950" />
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500">Z-Index (Layer)</Label>
                        <Input type="number" value={block.zIndex || 1} onChange={(e) => onUpdate(block.id, { zIndex: Number(e.target.value) })} className="h-7 text-xs bg-white dark:bg-neutral-950" />
                    </div>
                    {(block.type === 'image' || block.type === 'video' || block.type === 'button' || block.type === 'map') && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500">Border Radius (px)</Label>
                            <Input type="number" value={block.borderRadius || 0} onChange={(e) => onUpdate(block.id, { borderRadius: Number(e.target.value) })} className="h-7 text-xs bg-white dark:bg-neutral-950" />
                        </div>
                    )}
                </div>
            </div>
            )}

            {/* Element Specific Content */}
            <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5"><Layers className="size-3" /> Properties</h4>
                
                {(block.type === 'text' || block.type === 'button' || block.type === 'link') && (
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500">Text Content</Label>
                        <Input value={block.content || ''} onChange={(e) => onUpdate(block.id, { content: e.target.value })} className="h-8 bg-white dark:bg-neutral-950" />
                    </div>
                )}

                {(block.type === 'image' || block.type === 'video' || block.type === 'map' || block.type === 'background') && (
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500">{block.type === 'background' ? 'Background Image URL (Optional)' : 'Source URL'}</Label>
                        <div className="flex gap-1 items-center">
                            <Input value={block.src || ''} onChange={(e) => onUpdate(block.id, { src: e.target.value })} className="h-8 bg-white dark:bg-neutral-950 flex-1" placeholder="https://..." />
                            {block.type !== 'map' && (
                                <div className="relative">
                                    <Button type="button" variant="outline" size="sm" className="h-8 px-2" disabled={isUploading}>
                                        {isUploading ? <LucideIcons.Loader2 className="size-4 animate-spin" /> : <LucideIcons.Upload className="size-4" />}
                                    </Button>
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                                        accept={block.type === 'video' ? 'video/mp4,video/webm' : 'image/*'} 
                                        onChange={(e) => handleUpload(e, 'src')} 
                                        disabled={isUploading}
                                        title="Upload from device"
                                    />
                                </div>
                            )}
                        </div>
                        {block.type === 'background' && (
                            <span className="text-[9px] text-neutral-400 italic">An image URL overrides the background color below.</span>
                        )}
                    </div>
                )}

                {block.type === 'carousel' && (
                    <div className="grid gap-2">
                        <Label className="text-[10px] text-neutral-500">Carousel Images</Label>
                        {(block.images || []).map((img, idx) => (
                            <div key={idx} className="flex gap-1 items-center">
                                <Input value={img} onChange={(e) => {
                                    const newImgs = [...(block.images || [])];
                                    newImgs[idx] = e.target.value;
                                    onUpdate(block.id, { images: newImgs });
                                }} className="h-7 text-xs bg-white dark:bg-neutral-950 flex-1" placeholder="Image URL" />
                                <div className="relative">
                                    <Button type="button" variant="outline" size="sm" className="h-7 px-1.5" disabled={isUploading}>
                                        {isUploading ? <LucideIcons.Loader2 className="size-3 animate-spin" /> : <LucideIcons.Upload className="size-3" />}
                                    </Button>
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                                        accept="image/*" 
                                        onChange={(e) => handleUpload(e, `images.${idx}`)} 
                                        disabled={isUploading}
                                        title="Upload from device"
                                    />
                                </div>
                                <button type="button" onClick={() => {
                                    const newImgs = [...(block.images || [])];
                                    newImgs.splice(idx, 1);
                                    onUpdate(block.id, { images: newImgs });
                                }} className="text-red-500 hover:text-red-600 p-1">
                                    <LucideIcons.Trash className="size-3" />
                                </button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => {
                            const newImgs = [...(block.images || []), 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'];
                            onUpdate(block.id, { images: newImgs });
                        }} className="text-xs h-7 mt-1">Add Image</Button>
                    </div>
                )}

                {/* Button/Link Properties */}
                {(block.type === 'button' || block.type === 'link') && (
                    <>
                        <div>
                            <Label className="text-xs text-neutral-500 uppercase font-bold mb-2 block">Action</Label>
                            <select
                                value={block.actionType || 'url'}
                                onChange={(e) => onUpdate(block.id, { actionType: e.target.value as 'url' | 'page' })}
                                className="w-full text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-neutral-100"
                            >
                                <option value="url">External Link</option>
                                <option value="page">Go to Page</option>
                            </select>
                        </div>
                        
                        {block.actionType === 'page' ? (
                            <div>
                                <Label className="text-xs text-neutral-500 uppercase font-bold mb-2 block">Target Page</Label>
                                <select
                                    value={block.targetPageId || ''}
                                    onChange={(e) => onUpdate(block.id, { targetPageId: e.target.value })}
                                    className="w-full text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-neutral-100"
                                >
                                    <option value="">Select a page...</option>
                                    {pages.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <Label className="text-xs text-neutral-500 uppercase font-bold mb-2 block">Link URL</Label>
                                <Input
                                    value={block.url || ''}
                                    onChange={(e) => onUpdate(block.id, { url: e.target.value })}
                                    className="w-full text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        )}
                    </>
                )}

                {block.type === 'icon' && (
                    <div className="grid gap-2">
                        <Label className="text-[10px] text-neutral-500">Select Icon (Search)</Label>
                        <div className="relative">
                            <LucideIcons.Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
                            <Input 
                                placeholder="Search icons..." 
                                onChange={(e) => {
                                    const val = e.target.value.toLowerCase();
                                    const allKeys = Object.keys(LucideIcons).filter(key => typeof (LucideIcons as any)[key] === 'function' && key !== 'createLucideIcon');
                                    const matches = allKeys.filter(k => k.toLowerCase().includes(val)).slice(0, 20);
                                    // Normally we'd use state for this, but to keep it simple, we can just allow direct input and show suggestions
                                }} 
                                defaultValue={block.iconName || 'Star'}
                                onBlur={(e) => onUpdate(block.id, { iconName: e.target.value })}
                                className="h-8 pl-7 bg-white dark:bg-neutral-950 text-xs" 
                            />
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {['Star', 'Heart', 'Camera', 'Check', 'MapPin', 'Globe', 'Play', 'Mail', 'Phone', 'Calendar', 'Clock', 'Instagram', 'Users', 'Music', 'Gift', 'Cake'].map(name => {
                                const Icon = (LucideIcons as any)[name];
                                if (!Icon) return null;
                                return (
                                    <button 
                                        key={name} 
                                        onClick={() => onUpdate(block.id, { iconName: name })}
                                        className={`p-1.5 border rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${block.iconName === name ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/30' : 'bg-white border-neutral-200 text-neutral-500 dark:bg-neutral-950 dark:border-neutral-800'}`}
                                        title={name}
                                    >
                                        <Icon className="size-3.5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Appearance (Typography & Color) */}
            {!isCustomerMode && (
                <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                <h4 className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5"><Palette className="size-3" /> Appearance</h4>
                
                <div className="grid grid-cols-2 gap-2">
                    {block.color !== undefined && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500">Text/Icon Color</Label>
                            <div className="flex gap-1">
                                <Input type="color" value={block.color} onChange={(e) => onUpdate(block.id, { color: e.target.value })} className="h-7 w-8 p-0 cursor-pointer rounded border" />
                                <Input type="text" value={block.color} onChange={(e) => onUpdate(block.id, { color: e.target.value })} className="h-7 flex-1 text-[10px] bg-white dark:bg-neutral-950" />
                            </div>
                        </div>
                    )}
                    {block.bgColor !== undefined && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500">Background Color</Label>
                            <div className="flex gap-1">
                                <Input type="color" value={block.bgColor} onChange={(e) => onUpdate(block.id, { bgColor: e.target.value })} className="h-7 w-8 p-0 cursor-pointer rounded border" />
                                <Input type="text" value={block.bgColor} onChange={(e) => onUpdate(block.id, { bgColor: e.target.value })} className="h-7 flex-1 text-[10px] bg-white dark:bg-neutral-950" />
                            </div>
                        </div>
                    )}
                </div>

                {block.type === 'background' && (
                    <div className="col-span-2 space-y-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                        <div>
                            <Label className="text-[10px] text-neutral-500 mb-2 block">Preset Gradients</Label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'linear-gradient(to right, #ff7e5f, #feb47b)',
                                    'linear-gradient(to right, #4facfe, #00f2fe)',
                                    'linear-gradient(to right, #43e97b, #38f9d7)',
                                    'linear-gradient(to right, #fa709a, #fee140)',
                                    'linear-gradient(to right, #f83600, #f9d423)',
                                    'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
                                    'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                    'linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                                    'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
                                    'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
                                    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                                    'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'
                                ].map((grad, i) => (
                                    <button 
                                        key={`grad-${i}`} 
                                        type="button" 
                                        className="size-7 rounded-full border border-neutral-300 shadow-sm hover:scale-110 transition-transform"
                                        style={{ background: grad }}
                                        onClick={() => onUpdate(block.id, { bgColor: grad, src: '' })}
                                        title="Apply Gradient"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="text-[10px] text-neutral-500 mb-2 block">Design Patterns</Label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Grid', bg: 'radial-gradient(circle, #00000020 1px, transparent 1px) 0 0 / 20px 20px #ffffff' },
                                    { name: 'Graph', bg: 'linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px) 0 0 / 20px 20px #ffffff' },
                                    { name: 'Dots', bg: 'radial-gradient(#00000015 2px, transparent 2px) 0 0 / 15px 15px #ffffff' },
                                    { name: 'Lines', bg: 'repeating-linear-gradient(45deg, #00000005 0, #00000005 1px, transparent 0, transparent 50%) 0 0 / 10px 10px #ffffff' },
                                    { name: 'Checker', bg: 'conic-gradient(#00000008 90deg, transparent 90deg 180deg, #00000008 180deg 270deg, transparent 270deg) 0 0 / 40px 40px #ffffff' }
                                ].map((pattern, i) => (
                                    <button
                                        key={`pattern-${i}`}
                                        type="button"
                                        className="h-8 px-3 rounded-lg border border-neutral-300 bg-white text-[10px] font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm"
                                        onClick={() => onUpdate(block.id, { bgColor: pattern.bg, src: '' })}
                                    >
                                        {pattern.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {block.fontSize !== undefined && (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500">Font Size (px)</Label>
                            <Input type="number" value={block.fontSize} onChange={(e) => onUpdate(block.id, { fontSize: Number(e.target.value) })} className="h-7 bg-white dark:bg-neutral-950" />
                        </div>
                        {block.fontWeight !== undefined && (
                            <div className="grid gap-1">
                                <Label className="text-[10px] text-neutral-500">Font Weight</Label>
                                <select value={block.fontWeight || 'normal'} onChange={(e) => onUpdate(block.id, { fontWeight: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-950 dark:border-neutral-800">
                                    <option value="normal">Normal</option>
                                    <option value="medium">Medium</option>
                                    <option value="bold">Bold</option>
                                    <option value="800">Extra Bold</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}
                
                {(block.type === 'text' || block.type === 'link') && (
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500">Text Shadow</Label>
                        <select value={block.textShadow || 'none'} onChange={(e) => onUpdate(block.id, { textShadow: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-950 dark:border-neutral-800">
                            <option value="none">None</option>
                            <option value="1px 1px 2px rgba(0,0,0,0.3)">Light Drop</option>
                            <option value="2px 2px 4px rgba(0,0,0,0.5)">Medium Drop</option>
                            <option value="0 0 8px rgba(0,0,0,0.5)">Soft Glow</option>
                            <option value="1px 1px 0 #ccc, 2px 2px 0 #c9c9c9, 3px 3px 0 #bbb, 4px 4px 0 #b9b9b9, 5px 5px 0 #aaa, 6px 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 1px 1px 3px rgba(0,0,0,.3), 3px 3px 5px rgba(0,0,0,.2), 5px 5px 10px rgba(0,0,0,.25), 10px 10px 10px rgba(0,0,0,.2), 20px 20px 20px rgba(0,0,0,.15)">3D Pop</option>
                            <option value="0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)">3D Drop Down</option>
                        </select>
                    </div>
                )}
            </div>
            )}

            {/* Animations & Effects */}
            {!isCustomerMode && (
                <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                    <h4 className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5"><LucideIcons.Wand2 className="size-3" /> Page Effects</h4>
                
                {block.type === 'background' && (
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 font-bold uppercase">Scrolling Animation</Label>
                        <select 
                            value={block.animationType || 'none'} 
                            onChange={(e) => onUpdate(block.id, { animationType: e.target.value as Block['animationType'] })} 
                            className="h-8 rounded border border-neutral-200 bg-white text-xs px-2 shadow-sm dark:bg-neutral-950 dark:border-neutral-800"
                        >
                            <option value="none">None</option>
                            <option value="fade-in">Fade In All</option>
                            <option value="slide-up">Slide Up All</option>
                            <option value="slide-right">Slide Right All</option>
                            <option value="zoom-in">Zoom In All</option>
                            <option value="bounce">Bounce All</option>
                        </select>
                    </div>
                )}

                {block.type === 'background' && (
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 font-bold uppercase">Celebration Overlay</Label>
                        <select 
                            value={block.celebrationType || 'none'} 
                            onChange={(e) => onUpdate(block.id, { celebrationType: e.target.value as Block['celebrationType'] })} 
                            className="h-8 rounded border border-neutral-200 bg-white text-xs px-2 shadow-sm dark:bg-neutral-950 dark:border-neutral-800"
                        >
                            <option value="none">None</option>
                            <option value="confetti">Confetti Explosion</option>
                        </select>
                        <span className="text-[9px] text-neutral-400 italic">This effect covers the entire page when viewed.</span>
                    </div>
                )}
            </div>
            )}
        </div>
    );
}
