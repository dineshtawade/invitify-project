import { useState } from 'react';
import { Eye, Smartphone, Monitor, Tablet, ArrowUp, ArrowDown, Trash, Compass } from 'lucide-react';
import { BlockSettings } from './BlockSettings';
import { DevicePreview } from './DevicePreview';
import { getNewBlockDefaults, type Block } from './types';

interface SharedEditorProps {
    blocks: Block[];
    onChange: (blocks: Block[]) => void;
    title?: string;
    slug?: string;
    pagesNav?: { slug: string; title: string; active: boolean }[];
    isInvitation?: boolean;
    isCustomerMode?: boolean;
}

export function SharedEditor({ blocks, onChange, title, slug, pagesNav, isInvitation = false, isCustomerMode = false }: SharedEditorProps) {
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const handleAddBlock = (type: string) => {
        if (!type) return;
        const newBlock = getNewBlockDefaults(type, isInvitation);
        onChange([...blocks, newBlock]);
        setActiveSectionId(newBlock.id);
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
                            <select 
                                onChange={(e) => { handleAddBlock(e.target.value); e.target.value = ''; }} 
                                className="h-8 rounded-md border border-neutral-200 bg-white text-xs px-2 shadow-xs dark:bg-neutral-900 dark:border-neutral-800"
                            >
                                <option value="">+ Add Block</option>
                                <option value="hero">Hero Section</option>
                                <option value="text">Text Section</option>
                                <option value="swiper">Photo Slider</option>
                                <option value="video">Video Embed</option>
                                <option value="links">Button Links</option>
                                <option value="icons_grid">Features Grid</option>
                                <option value="form">{isInvitation ? 'RSVP Form' : 'Contact Form'}</option>
                                <option value="countdown">Countdown Timer</option>
                                <option value="map">Google Map</option>
                                <option value="timeline">Timeline Schedule</option>
                                {!isInvitation && <option value="faq">FAQ Accordion</option>}
                                {!isInvitation && <option value="testimonials">Testimonials</option>}
                            </select>
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
                                    className={`rounded-xl border transition-all duration-200 bg-white dark:bg-neutral-900 shadow-xs ${isActive ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'} ${!isCustomerMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                >
                                    <div onClick={() => setActiveSectionId(isActive ? null : block.id)} className="p-4 flex items-center justify-between cursor-pointer select-none">
                                        <div className="flex items-center gap-2.5">
                                            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-2 text-neutral-500 font-bold text-[9px] uppercase">{block.type}</div>
                                            <span className="font-semibold text-sm text-neutral-850 dark:text-neutral-100 capitalize">{block.title || `${block.type} section`}</span>
                                            {block.is_hidden && <span className="text-[8px] bg-red-105 text-red-700 dark:bg-red-950/40 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">Hidden</span>}
                                        </div>
                                        {!isCustomerMode && (
                                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                <button type="button" disabled={idx === 0} onClick={() => handleMoveBlock(idx, 'up')} className="p-1 rounded text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"><ArrowUp className="size-4" /></button>
                                                <button type="button" disabled={idx === blocks.length - 1} onClick={() => handleMoveBlock(idx, 'down')} className="p-1 rounded text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"><ArrowDown className="size-4" /></button>
                                                <button type="button" onClick={() => handleDeleteBlock(block.id)} className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"><Trash className="size-4" /></button>
                                            </div>
                                        )}
                                    </div>
                                    {isActive && <BlockSettings block={block} onUpdate={handleUpdateBlock} isCustomerMode={isCustomerMode} />}
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
                    />
                </div>
            </div>
        </div>
    );
}
