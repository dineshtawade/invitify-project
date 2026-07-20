import { useState } from 'react';
import { Eye, Smartphone, Monitor, Tablet, ArrowUp, ArrowDown, Trash, Compass, Plus, GripVertical, Image, Tag, Code, Users, Type } from 'lucide-react';
import { BlockSettings } from './BlockSettings';
import { DevicePreview } from './DevicePreview';
import { getNewBlockDefaults, type Block } from './types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface SharedEditorProps {
    blocks: Block[];
    onChange: (blocks: Block[]) => void;
    title?: string;
    slug?: string;
    pagesNav?: { slug: string; title: string; active: boolean }[];
    isInvitation?: boolean;
    isCustomerMode?: boolean;
    customBlocks?: any[];
}

export function SharedEditor({ blocks, onChange, title, slug, pagesNav, isInvitation = false, isCustomerMode = false, customBlocks = [] }: SharedEditorProps) {
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const handleAddBlock = (type: string) => {
        if (!type) return;
        const customBlock = customBlocks.find(cb => cb.type === type);
        if (customBlock) {
            const defaults: Record<string, any> = {};
            if (customBlock.fields && Array.isArray(customBlock.fields)) {
                customBlock.fields.forEach((f: any) => {
                    defaults[f.name] = f.default || '';
                });
            }
            const newBlock = {
                id: `block_${type}_${Math.random().toString(36).substring(2, 9)}`,
                type,
                ...defaults
            } as Block;
            onChange([...blocks, newBlock]);
            setActiveSectionId(newBlock.id);
        } else {
            const newBlock = getNewBlockDefaults(type, isInvitation);
            onChange([...blocks, newBlock]);
            setActiveSectionId(newBlock.id);
        }
    };

    const handleUpdateBlock = (id: string, updates: Partial<Block>) => {
        onChange(blocks.map((b) => b.id === id ? { ...b, ...updates } : b));
    };

    const handleDeleteBlock = (id: string) => {
        onChange(blocks.filter((b) => b.id !== id));
        if (activeSectionId === id) setActiveSectionId(null);
    };

    const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks];
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === newBlocks.length - 1) return;
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
        onChange(newBlocks);
    };

    return (
        <div className="flex-1 overflow-hidden grid lg:grid-cols-12 h-full">
            {/* Left Editor Panel */}
            <div className="lg:col-span-5 border-r border-neutral-150 dark:border-neutral-850 flex flex-col overflow-y-auto p-6 gap-6 bg-neutral-50/30 dark:bg-neutral-950/20">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h4 className="text-xs uppercase tracking-widest font-black text-neutral-400">Layout Blocks</h4>
                        {!isCustomerMode && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" className="h-8 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-md shadow-pink-500/20 px-4 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                                        <Plus className="size-4 mr-1.5" /> Add Block
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-pink-100 dark:border-neutral-800 shadow-2xl">
                                    <DropdownMenuLabel className="text-[10px] font-extrabold tracking-widest uppercase text-pink-500/80 px-2">Standard Blocks</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-pink-50/50 dark:bg-neutral-800" />
                                    <DropdownMenuGroup className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-1">
                                        <DropdownMenuItem onClick={() => handleAddBlock('advanced_section')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-pink-50 hover:text-pink-700">
                                            <span className="bg-pink-100 text-pink-600 rounded mr-2 p-1"><Compass className="size-3" /></span> Advanced Section
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('dynamic_layout')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            <span className="bg-neutral-100 rounded mr-2 p-1"><Type className="size-3" /></span> Dynamic Layout
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('flexible_layout')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50 hover:text-pink-600">
                                            <span className="bg-pink-100 text-pink-600 rounded mr-2 p-1"><Compass className="size-3" /></span> Flexible Section
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('hero')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            <span className="bg-neutral-100 rounded mr-2 p-1"><Eye className="size-3" /></span> Hero Section
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('cta')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            <span className="bg-neutral-100 rounded mr-2 p-1"><Smartphone className="size-3" /></span> Call to Action
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('gallery')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            <span className="bg-neutral-100 rounded mr-2 p-1"><Image className="size-3" /></span> Photo Gallery
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('pricing')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            <span className="bg-neutral-100 rounded mr-2 p-1"><Tag className="size-3" /></span> Pricing Table
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('profile')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            <span className="bg-neutral-100 rounded mr-2 p-1"><Users className="size-3" /></span> Team Profiles
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('html')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                            <span className="bg-neutral-100 dark:bg-neutral-800 rounded mr-2 p-1"><Code className="size-3" /></span> Custom HTML
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('freeform')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                            <span className="bg-pink-100 text-pink-600 rounded mr-2 p-1"><Compass className="size-3" /></span> Freeform Canvas
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuSeparator className="my-1" />
                                        
                                        <DropdownMenuItem onClick={() => handleAddBlock('text')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            Text Section
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('swiper')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            Photo Slider
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('video')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            Video Embed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('links')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            Button Links
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('icons_grid')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            Features Grid
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('form')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            {isInvitation ? 'RSVP Form' : 'Contact Form'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('countdown')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            Countdown Timer
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('map')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            Google Map
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddBlock('timeline')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">
                                            Timeline Schedule
                                        </DropdownMenuItem>
                                        {!isInvitation && <DropdownMenuItem onClick={() => handleAddBlock('faq')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">FAQ Accordion</DropdownMenuItem>}
                                        {!isInvitation && <DropdownMenuItem onClick={() => handleAddBlock('testimonials')} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-neutral-50">Testimonials</DropdownMenuItem>}
                                    </DropdownMenuGroup>
                                    
                                    {customBlocks.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator className="my-1 bg-pink-50/50" />
                                            <DropdownMenuLabel className="text-[10px] font-extrabold tracking-widest uppercase text-pink-500/80 px-2 pt-2">Custom Blocks</DropdownMenuLabel>
                                            <DropdownMenuGroup className="grid grid-cols-1 gap-1">
                                                {customBlocks.map(cb => (
                                                    <DropdownMenuItem key={cb.id} onClick={() => handleAddBlock(cb.type)} className="cursor-pointer rounded-xl font-medium text-xs py-2 px-3 hover:bg-pink-50">
                                                        {cb.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuGroup>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        {blocks.map((block, idx) => {
                            const isActive = activeSectionId === block.id;
                            return (
                                <div 
                                    key={block.id} 
                                    draggable={!isCustomerMode}
                                    onDragStart={(e) => {
                                        if (isCustomerMode) return;
                                        e.dataTransfer.setData('text/plain', String(idx));
                                    }}
                                    onDragOver={(e) => {
                                        if (isCustomerMode) return;
                                        e.preventDefault();
                                    }}
                                    onDrop={(e) => {
                                        if (isCustomerMode) return;
                                        e.preventDefault();
                                        const fromIndex = Number(e.dataTransfer.getData('text/plain'));
                                        if (isNaN(fromIndex) || fromIndex === idx) return;
                                        const updatedBlocks = [...blocks];
                                        const [draggedItem] = updatedBlocks.splice(fromIndex, 1);
                                        updatedBlocks.splice(idx, 0, draggedItem);
                                        onChange(updatedBlocks);
                                    }}
                                    className={`rounded-2xl border transition-all duration-300 backdrop-blur-md shadow-sm dark:bg-neutral-900/80 ${isActive ? 'bg-white dark:bg-neutral-900 border-pink-500 ring-4 ring-pink-500/20 shadow-lg scale-[1.01]' : 'bg-white/70 border-white dark:border-neutral-800 hover:border-pink-300 dark:hover:border-neutral-700 hover:bg-white dark:hover:bg-neutral-900'} ${!isCustomerMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                >
                                    <div onClick={() => setActiveSectionId(isActive ? null : block.id)} className="p-3.5 flex items-center justify-between cursor-pointer select-none">
                                        <div className="flex items-center gap-3">
                                            {!isCustomerMode && <GripVertical className="size-4 text-neutral-300 dark:text-neutral-600" />}
                                            <div className="rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2.5 py-1.5 font-bold text-[10px] uppercase tracking-wider">{block.type}</div>
                                            <span className="font-bold text-sm text-neutral-700 dark:text-neutral-200 capitalize">{block.title || `${block.type} section`}</span>
                                            {block.is_hidden && <span className="text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-black uppercase tracking-wider shadow-sm">Hidden</span>}
                                        </div>
                                        {!isCustomerMode && (
                                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                <button type="button" disabled={idx === 0} onClick={() => handleMoveBlock(idx, 'up')} className="p-1 rounded text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"><ArrowUp className="size-4" /></button>
                                                <button type="button" disabled={idx === blocks.length - 1} onClick={() => handleMoveBlock(idx, 'down')} className="p-1 rounded text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"><ArrowDown className="size-4" /></button>
                                                <button type="button" onClick={() => handleDeleteBlock(block.id)} className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"><Trash className="size-4" /></button>
                                            </div>
                                        )}
                                    </div>
                                    {isActive && <BlockSettings block={block} onUpdate={handleUpdateBlock} isCustomerMode={isCustomerMode} customBlocks={customBlocks} />}
                                </div>
                            );
                        })}
                        {blocks.length === 0 && (
                            <div className="py-8 text-center text-neutral-400 text-xs border border-dashed rounded-xl">
                                No blocks added.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Simulator Panel */}
            <div className="lg:col-span-7 flex flex-col items-center justify-start p-6 bg-neutral-900 relative h-full max-h-full overflow-hidden">
                <div className="flex items-center gap-4 mb-4 justify-between w-full text-white text-xs z-10 shrink-0">
                    <span className="font-semibold uppercase tracking-widest flex items-center gap-1.5 opacity-80">
                        <Eye className="size-4" /> Live Simulator
                    </span>
                    <div className="flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-750">
                        <button type="button" onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                            <Monitor className="size-4" />
                        </button>
                        <button type="button" onClick={() => setPreviewDevice('tablet')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                            <Tablet className="size-4" />
                        </button>
                        <button type="button" onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                            <Smartphone className="size-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden">
                    <DevicePreview 
                        blocks={blocks} 
                        activeSectionId={activeSectionId} 
                        deviceType={previewDevice}
                        title={title}
                        slug={slug}
                        pagesNav={pagesNav}
                        isInvitation={isInvitation}
                        customBlocks={customBlocks}
                    />
                </div>
            </div>
        </div>
    );
}
