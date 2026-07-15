import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle, Star, Sliders, Type, LayoutGrid } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import type { Block } from './types';
import { IconPicker } from './IconPicker';

interface BlockSettingsProps {
    block: Block;
    onUpdate: (id: string, updates: Partial<Block>) => void;
    isCustomerMode?: boolean;
    customBlocks?: any[];
}

export function BlockSettings({ block, onUpdate, isCustomerMode = false, customBlocks = [] }: BlockSettingsProps) {
    const handleUpdate = (updates: Partial<Block>) => onUpdate(block.id, updates);
    const customBlock = customBlocks.find(cb => cb.type === block.type);
    const [selectedHeroIdx, setSelectedHeroIdx] = useState<number | null>(null);

    // Auto-migrate legacy hero blocks that don't have hero_elements yet
    const getHeroElements = (): any[] => {
        if (block.type !== 'hero') return [];
        if (block.hero_elements && block.hero_elements.length > 0) return block.hero_elements;
        // Migrate from legacy fields
        const migrated: any[] = [];
        if (block.title) {
            migrated.push({
                id: `el_${Math.random().toString(36).substr(2, 9)}`,
                type: 'text',
                content: block.title,
                font_family: '',
                font_size_px: 36,
                font_weight: '800',
                color: block.title_color || '#1f2937',
                align: 'center'
            });
        }
        if (block.subtitle) {
            migrated.push({
                id: `el_${Math.random().toString(36).substr(2, 9)}`,
                type: 'text',
                content: block.subtitle,
                font_family: '',
                font_size_px: 14,
                font_weight: '400',
                color: block.subtitle_color || '#4b5563',
                align: 'center'
            });
        }
        if (block.cta_text) {
            migrated.push({
                id: `el_${Math.random().toString(36).substr(2, 9)}`,
                type: 'button',
                btn_text: block.cta_text,
                btn_url: block.cta_link || '#',
                btn_bg_color: '#ffffff',
                btn_text_color: '#1f2937',
                btn_radius: 'rounded-full',
                btn_size: 'medium',
                align: 'center'
            });
        }
        // Auto-save migrated elements
        if (migrated.length > 0) {
            setTimeout(() => handleUpdate({ hero_elements: migrated }), 0);
        }
        return migrated;
    };

    const heroAddElement = (elType: string) => {
        const els = [...(block.hero_elements || getHeroElements())];
        let newEl: any = { id: `el_${Math.random().toString(36).substr(2, 9)}`, type: elType };
        if (elType === 'text') {
            newEl = { ...newEl, content: 'New text field', font_family: '', font_size_px: 16, font_weight: '400', color: '#1f2937', align: 'center' };
        } else if (elType === 'image') {
            newEl = { ...newEl, url: '', image_size: 'medium', radius: 'rounded-xl', align: 'center' };
        } else if (elType === 'video') {
            newEl = { ...newEl, video_url: '', video_size: 'medium', autoplay: false, align: 'center' };
        } else if (elType === 'button') {
            newEl = { ...newEl, btn_text: 'Click Here', btn_url: '#', btn_bg_color: '#2563eb', btn_text_color: '#ffffff', btn_radius: 'rounded-full', btn_size: 'medium', align: 'center' };
        }
        els.push(newEl);
        handleUpdate({ hero_elements: els });
        setSelectedHeroIdx(els.length - 1);
    };

    const heroUpdateElement = (index: number, key: string, value: any) => {
        const els = [...(block.hero_elements || getHeroElements())];
        els[index] = { ...els[index], [key]: value };
        handleUpdate({ hero_elements: els });
    };

    const heroRemoveElement = (index: number) => {
        const els = (block.hero_elements || getHeroElements()).filter((_: any, i: number) => i !== index);
        handleUpdate({ hero_elements: els });
        if (selectedHeroIdx === index) setSelectedHeroIdx(null);
        else if (selectedHeroIdx !== null && selectedHeroIdx > index) setSelectedHeroIdx(selectedHeroIdx - 1);
    };

    const heroMoveElement = (index: number, direction: 'up' | 'down') => {
        const els = [...(block.hero_elements || getHeroElements())];
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= els.length) return;
        [els[index], els[target]] = [els[target], els[index]];
        handleUpdate({ hero_elements: els });
        setSelectedHeroIdx(target);
    };

    const handleUpdateListItem = (listKey: keyof Block, index: number, key: string, val: string) => {
        const list = (block[listKey] as any[]) || [];
        const newList = list.map((item, i) => i === index ? { ...item, [key]: val } : item);
        handleUpdate({ [listKey]: newList });
    };

    const handleAddListItem = (listKey: keyof Block, defaultItem: any) => {
        const list = (block[listKey] as any[]) || [];
        handleUpdate({ [listKey]: [...list, defaultItem] });
    };

    const handleRemoveListItem = (listKey: keyof Block, index: number) => {
        const list = (block[listKey] as any[]) || [];
        handleUpdate({ [listKey]: list.filter((_, i) => i !== index) });
    };

    const handleAddItem = (itemType: string) => {
        const list = block.items || [];
        let newItem: any = { id: `item_${Math.random().toString(36).substr(2, 9)}`, type: itemType };
        if (itemType === 'text') {
            newItem = { ...newItem, text: 'Custom text content', font_family: '', font_size: 'text-sm', color: '#1f2937', align: 'center', weight: 'normal' };
        } else if (itemType === 'image') {
            newItem = { ...newItem, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', image_size: 'medium', radius: 'rounded-xl', align: 'center' };
        } else if (itemType === 'video') {
            newItem = { ...newItem, video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', video_size: 'medium', autoplay: false, align: 'center' };
        } else if (itemType === 'button') {
            newItem = { ...newItem, btn_text: 'Click Here', btn_url: '#', btn_bg_color: '#2563eb', btn_text_color: '#ffffff', btn_radius: 'rounded-full', btn_size: 'medium', align: 'center' };
        }
        handleUpdate({ items: [...list, newItem] });
    };

    const handleUpdateItemProperty = (index: number, key: string, value: any) => {
        const list = [...(block.items || [])];
        list[index] = { ...list[index], [key]: value };
        handleUpdate({ items: list });
    };

    const handleRemoveItem = (index: number) => {
        const list = (block.items || []).filter((_, i) => i !== index);
        handleUpdate({ items: list });
    };

    const handleMoveItemUp = (index: number) => {
        if (index === 0) return;
        const list = [...(block.items || [])];
        const temp = list[index];
        list[index] = list[index - 1];
        list[index - 1] = temp;
        handleUpdate({ items: list });
    };

    const handleMoveItemDown = (index: number) => {
        const list = block.items || [];
        if (index >= list.length - 1) return;
        const newList = [...list];
        const temp = newList[index];
        newList[index] = newList[index + 1];
        newList[index + 1] = temp;
        handleUpdate({ items: newList });
    };

    return (
        <div className="p-4 border-t border-neutral-150 dark:border-neutral-850 flex flex-col gap-6 text-xs bg-neutral-50/30 dark:bg-neutral-900/30">
            {/* --- Advanced Global Block Settings --- */}
            {!isCustomerMode && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Type className="size-3" /> Font</Label>
                        <select value={block.font_family || ''} onChange={(e) => handleUpdate({ font_family: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-900 dark:border-neutral-800">
                            <option value="">Default (Inherit)</option>
                            <option value="'Inter', sans-serif">Inter</option>
                            <option value="'Roboto', sans-serif">Roboto</option>
                            <option value="'Playfair Display', serif">Playfair Display</option>
                            <option value="'Outfit', sans-serif">Outfit</option>
                            <option value="'Dancing Script', cursive">Dancing Script</option>
                            <option value="'Alex Brush', cursive">Alex Brush</option>
                            <option value="'Parisienne', cursive">Parisienne</option>
                            <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                            <option value="'Pinyon Script', cursive">Pinyon Script</option>
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">Font Size</Label>
                        <select value={block.font_size || ''} onChange={(e) => handleUpdate({ font_size: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-900 dark:border-neutral-800">
                            <option value="">Default</option>
                            <option value="text-xs">XS</option>
                            <option value="text-sm">SM</option>
                            <option value="text-base">Base</option>
                            <option value="text-lg">LG</option>
                            <option value="text-xl">XL</option>
                            <option value="text-2xl">2XL</option>
                            <option value="text-3xl">3XL</option>
                            <option value="text-4xl">4XL</option>
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">Font Color</Label>
                        <div className="flex gap-1">
                            <Input type="color" value={block.font_color || '#1f2937'} onChange={(e) => handleUpdate({ font_color: e.target.value })} className="h-7 w-8 p-0 border rounded cursor-pointer" />
                            <Input type="text" value={block.font_color || ''} onChange={(e) => handleUpdate({ font_color: e.target.value })} placeholder="#1f2937" className="h-7 flex-1 text-[9px] px-1" />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">Weight & Style</Label>
                        <div className="flex gap-1.5 items-center">
                            <select value={block.font_weight || ''} onChange={(e) => handleUpdate({ font_weight: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 flex-1 dark:bg-neutral-900 dark:border-neutral-800">
                                <option value="">Default</option>
                                <option value="light">Light</option>
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                            </select>
                            <label className="flex items-center gap-1 text-[9px] font-bold uppercase select-none cursor-pointer text-neutral-500">
                                <input type="checkbox" checked={block.font_style === 'italic'} onChange={(e) => handleUpdate({ font_style: e.target.checked ? 'italic' : 'normal' })} className="size-3 rounded border-neutral-350" />
                                Italic
                            </label>
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">Padding Vertical</Label>
                        <select value={block.padding_y || ''} onChange={(e) => handleUpdate({ padding_y: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-900 dark:border-neutral-800">
                            <option value="">Default</option>
                            <option value="py-2">py-2 (Extra Small)</option>
                            <option value="py-4">py-4 (Small)</option>
                            <option value="py-8">py-8 (Medium)</option>
                            <option value="py-12">py-12 (Large)</option>
                            <option value="py-16">py-16 (X-Large)</option>
                            <option value="py-24">py-24 (2X-Large)</option>
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">Margin Vertical</Label>
                        <select value={block.margin_y || ''} onChange={(e) => handleUpdate({ margin_y: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-900 dark:border-neutral-800">
                            <option value="">Default</option>
                            <option value="my-0">my-0 (None)</option>
                            <option value="my-2">my-2 (Small)</option>
                            <option value="my-4">my-4 (Medium)</option>
                            <option value="my-8">my-8 (Large)</option>
                            <option value="my-12">my-12 (X-Large)</option>
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">Visibility</Label>
                        <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase select-none cursor-pointer text-neutral-600 dark:text-neutral-400 mt-1">
                            <input type="checkbox" checked={block.is_hidden || false} onChange={(e) => handleUpdate({ is_hidden: e.target.checked })} className="size-4 rounded border-neutral-355" />
                            Hide Section
                        </label>
                    </div>
                    {(block.type === 'icons_grid' || block.type === 'links' || block.type === 'faq') && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><LayoutGrid className="size-3" /> Grid</Label>
                            <select value={block.grid_columns || ''} onChange={(e) => handleUpdate({ grid_columns: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-900 dark:border-neutral-800">
                                <option value="">Auto/Default</option>
                                <option value="1">1 Column</option>
                                <option value="2">2 Columns</option>
                                <option value="3">3 Columns</option>
                                <option value="4">4 Columns</option>
                            </select>
                        </div>
                    )}
                    {(block.type === 'swiper' || block.type === 'video') && (
                        <>
                            <div className="grid gap-1">
                                <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Sliders className="size-3" /> Media Width</Label>
                                <select value={block.media_width || ''} onChange={(e) => handleUpdate({ media_width: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-900 dark:border-neutral-800">
                                    <option value="">Default/Full</option>
                                    <option value="max-w-md">Small</option>
                                    <option value="max-w-xl">Medium</option>
                                    <option value="max-w-4xl">Large</option>
                                    <option value="max-w-full">Full Width</option>
                                </select>
                            </div>
                            <div className="grid gap-1">
                                <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Sliders className="size-3" /> Media Height</Label>
                                <select value={block.media_height || ''} onChange={(e) => handleUpdate({ media_height: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-900 dark:border-neutral-800">
                                    <option value="">Default</option>
                                    <option value="aspect-square">Square (1:1)</option>
                                    <option value="aspect-video">Video (16:9)</option>
                                    <option value="aspect-[4/5]">Portrait (4:5)</option>
                                    <option value="h-64">Fixed Small (256px)</option>
                                    <option value="h-96">Fixed Large (384px)</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* --- Custom Block Dynamic Settings --- */}
            {customBlock && (
                <div className="flex flex-col gap-4">
                    <div className="border-b pb-2">
                        <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Custom Block Parameters</h4>
                    </div>
                    {customBlock.fields && Array.isArray(customBlock.fields) && customBlock.fields.map((field: any) => {
                        const value = block[field.name] !== undefined ? block[field.name] : field.default;

                        return (
                            <div key={field.name} className="grid gap-1">
                                <Label className="text-[10px] text-neutral-500 uppercase font-bold">{field.label}</Label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={value}
                                        onChange={(e) => handleUpdate({ [field.name]: e.target.value })}
                                        rows={3}
                                        className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-955 dark:bg-neutral-950"
                                    />
                                ) : field.type === 'color' ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={value || '#ffffff'}
                                            onChange={(e) => handleUpdate({ [field.name]: e.target.value })}
                                            className="w-10 h-8 p-0 cursor-pointer rounded border"
                                        />
                                        <Input
                                            type="text"
                                            value={value || ''}
                                            onChange={(e) => handleUpdate({ [field.name]: e.target.value })}
                                            className="h-8"
                                        />
                                    </div>
                                ) : field.type === 'number' ? (
                                    <Input
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleUpdate({ [field.name]: e.target.value })}
                                        className="h-8"
                                    />
                                ) : (
                                    <Input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleUpdate({ [field.name]: e.target.value })}
                                        className="h-8"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- Block Type Specific Settings --- */}
            {block.type === 'hero' && (() => {
                const elements = block.hero_elements && block.hero_elements.length > 0 ? block.hero_elements : getHeroElements();
                const selectedEl = selectedHeroIdx !== null && elements[selectedHeroIdx] ? elements[selectedHeroIdx] : null;

                return (
                    <div className="flex flex-col gap-0">
                        {/* ===== TOOLBAR ===== */}
                        {!isCustomerMode && (
                            <div className="sticky top-0 z-20 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 -mx-4 px-4 py-3 shadow-sm">
                                <div className="flex flex-wrap gap-1.5 mb-2.5">
                                    <button type="button" onClick={() => heroAddElement('text')} className="px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-700 text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-neutral-800 transition-colors">+ Text</button>
                                    <button type="button" onClick={() => heroAddElement('image')} className="px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-700 text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-neutral-800 transition-colors">+ Image</button>
                                    <button type="button" onClick={() => heroAddElement('video')} className="px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-700 text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-neutral-800 transition-colors">+ Video</button>
                                    <button type="button" onClick={() => heroAddElement('button')} className="px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-700 text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-neutral-800 transition-colors">+ Button</button>
                                </div>

                                {/* Contextual formatting bar — only shows when a TEXT element is selected */}
                                {selectedEl && selectedEl.type === 'text' && (
                                    <div className="flex flex-col gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-3 animate-none">
                                        <div className="flex items-center gap-1 mb-0.5">
                                            <span className="text-[9px] text-blue-600 font-extrabold uppercase tracking-widest">Text Formatting</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-blue-500 uppercase font-bold">Font Family</span>
                                                <select
                                                    value={selectedEl.font_family || ''}
                                                    onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'font_family', e.target.value)}
                                                    className="h-7 rounded-lg border border-blue-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5 focus:ring-1 focus:ring-blue-400"
                                                >
                                                    <option value="">Default (Inherit)</option>
                                                    <option value="'Inter', sans-serif">Inter</option>
                                                    <option value="'Roboto', sans-serif">Roboto</option>
                                                    <option value="'Playfair Display', serif">Playfair Display</option>
                                                    <option value="'Outfit', sans-serif">Outfit</option>
                                                    <option value="'Dancing Script', cursive">Dancing Script</option>
                                                    <option value="'Alex Brush', cursive">Alex Brush</option>
                                                    <option value="'Parisienne', cursive">Parisienne</option>
                                                    <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                                                    <option value="'Pinyon Script', cursive">Pinyon Script</option>
                                                    <option value="'Poppins', sans-serif">Poppins</option>
                                                    <option value="'Montserrat', sans-serif">Montserrat</option>
                                                    <option value="'Lato', sans-serif">Lato</option>
                                                    <option value="'Open Sans', sans-serif">Open Sans</option>
                                                    <option value="Georgia, serif">Georgia</option>
                                                    <option value="'Times New Roman', serif">Times New Roman</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-blue-500 uppercase font-bold">Font Size (px)</span>
                                                <Input
                                                    type="number"
                                                    min={8}
                                                    max={200}
                                                    value={selectedEl.font_size_px || 16}
                                                    onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'font_size_px', parseInt(e.target.value) || 16)}
                                                    className="h-7 text-[10px] rounded-lg border-blue-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-blue-500 uppercase font-bold">Weight</span>
                                                <select
                                                    value={selectedEl.font_weight || '400'}
                                                    onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'font_weight', e.target.value)}
                                                    className="h-7 rounded-lg border border-blue-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5"
                                                >
                                                    <option value="100">100 Thin</option>
                                                    <option value="200">200 Extra Light</option>
                                                    <option value="300">300 Light</option>
                                                    <option value="400">400 Normal</option>
                                                    <option value="500">500 Medium</option>
                                                    <option value="600">600 Semi Bold</option>
                                                    <option value="700">700 Bold</option>
                                                    <option value="800">800 Extra Bold</option>
                                                    <option value="900">900 Black</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-blue-500 uppercase font-bold">Alignment</span>
                                                <select
                                                    value={selectedEl.align || 'center'}
                                                    onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'align', e.target.value)}
                                                    className="h-7 rounded-lg border border-blue-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5"
                                                >
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-blue-500 uppercase font-bold">Color</span>
                                                <div className="flex gap-0.5">
                                                    <input type="color" value={selectedEl.color || '#1f2937'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'color', e.target.value)} className="h-7 w-6 p-0 border rounded-lg cursor-pointer" />
                                                    <input type="text" value={selectedEl.color || ''} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'color', e.target.value)} placeholder="#000" className="h-7 flex-1 text-[8px] px-1 border border-blue-200 rounded-lg" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Contextual bar for IMAGE */}
                                {selectedEl && selectedEl.type === 'image' && (
                                    <div className="flex flex-col gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-3">
                                        <span className="text-[9px] text-green-600 font-extrabold uppercase tracking-widest">Image Settings</span>
                                        <div className="grid grid-cols-2 gap-2 mb-1">
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-green-500 uppercase font-bold">Custom Width (px)</span>
                                                <Input
                                                    type="number"
                                                    min={10}
                                                    max={1200}
                                                    value={selectedEl.width_px || ''}
                                                    onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'width_px', e.target.value ? parseInt(e.target.value) : null)}
                                                    className="h-7 text-[10px] rounded-lg border-green-200"
                                                    placeholder="e.g. 300"
                                                />
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-green-500 uppercase font-bold">Custom Height (px)</span>
                                                <Input
                                                    type="number"
                                                    min={10}
                                                    max={1200}
                                                    value={selectedEl.height_px || ''}
                                                    onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'height_px', e.target.value ? parseInt(e.target.value) : null)}
                                                    className="h-7 text-[10px] rounded-lg border-green-200"
                                                    placeholder="e.g. 250"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-green-500 uppercase font-bold">Preset Size</span>
                                                <select value={selectedEl.image_size || 'medium'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'image_size', e.target.value)} className="h-7 rounded-lg border border-green-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5">
                                                    <option value="small">Small</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="large">Large</option>
                                                    <option value="full">Full Width</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-green-500 uppercase font-bold">Radius</span>
                                                <select value={selectedEl.radius || 'rounded-xl'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'radius', e.target.value)} className="h-7 rounded-lg border border-green-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5">
                                                    <option value="rounded-none">None</option>
                                                    <option value="rounded-lg">LG</option>
                                                    <option value="rounded-2xl">2XL</option>
                                                    <option value="rounded-full">Full</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-green-500 uppercase font-bold">Align</span>
                                                <select value={selectedEl.align || 'center'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'align', e.target.value)} className="h-7 rounded-lg border border-green-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5">
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Contextual bar for VIDEO */}
                                {selectedEl && selectedEl.type === 'video' && (
                                    <div className="flex flex-col gap-2 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-xl p-3">
                                        <span className="text-[9px] text-purple-600 font-extrabold uppercase tracking-widest">Video Settings</span>
                                        <div className="grid grid-cols-2 gap-2 mb-1">
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-purple-500 uppercase font-bold">Custom Width (px)</span>
                                                <Input
                                                    type="number"
                                                    min={10}
                                                    max={1200}
                                                    value={selectedEl.width_px || ''}
                                                    onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'width_px', e.target.value ? parseInt(e.target.value) : null)}
                                                    className="h-7 text-[10px] rounded-lg border-purple-200"
                                                    placeholder="e.g. 300"
                                                />
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-purple-500 uppercase font-bold">Custom Height (px)</span>
                                                <Input
                                                    type="number"
                                                    min={10}
                                                    max={1200}
                                                    value={selectedEl.height_px || ''}
                                                    onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'height_px', e.target.value ? parseInt(e.target.value) : null)}
                                                    className="h-7 text-[10px] rounded-lg border-purple-200"
                                                    placeholder="e.g. 250"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-purple-500 uppercase font-bold">Preset Size</span>
                                                <select value={selectedEl.video_size || 'medium'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'video_size', e.target.value)} className="h-7 rounded-lg border border-purple-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5">
                                                    <option value="small">Small</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="large">Large</option>
                                                    <option value="full">Full Width</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-purple-500 uppercase font-bold">Align</span>
                                                <select value={selectedEl.align || 'center'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'align', e.target.value)} className="h-7 rounded-lg border border-purple-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5">
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5 items-center">
                                                <span className="text-[8px] text-purple-500 uppercase font-bold">Autoplay</span>
                                                <input type="checkbox" checked={selectedEl.autoplay || false} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'autoplay', e.target.checked)} className="size-4 mt-0.5 rounded cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Contextual bar for BUTTON */}
                                {selectedEl && selectedEl.type === 'button' && (
                                    <div className="flex flex-col gap-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-xl p-3">
                                        <span className="text-[9px] text-orange-600 font-extrabold uppercase tracking-widest">Button Styling</span>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-orange-500 uppercase font-bold">BG Color</span>
                                                <div className="flex gap-0.5">
                                                    <input type="color" value={selectedEl.btn_bg_color || '#2563eb'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'btn_bg_color', e.target.value)} className="h-6 w-4 p-0 border rounded-lg cursor-pointer" />
                                                    <input type="text" value={selectedEl.btn_bg_color || ''} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'btn_bg_color', e.target.value)} placeholder="#fff" className="h-6 w-full text-[8px] px-1 border border-orange-200 rounded-lg" />
                                                </div>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-orange-500 uppercase font-bold">Text Color</span>
                                                <div className="flex gap-0.5">
                                                    <input type="color" value={selectedEl.btn_text_color || '#ffffff'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'btn_text_color', e.target.value)} className="h-6 w-4 p-0 border rounded-lg cursor-pointer" />
                                                    <input type="text" value={selectedEl.btn_text_color || ''} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'btn_text_color', e.target.value)} placeholder="#000" className="h-6 w-full text-[8px] px-1 border border-orange-200 rounded-lg" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-orange-500 uppercase font-bold">Size</span>
                                                <select value={selectedEl.btn_size || 'medium'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'btn_size', e.target.value)} className="h-7 rounded-lg border border-orange-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5">
                                                    <option value="small">Small</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="large">Large</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <span className="text-[8px] text-orange-500 uppercase font-bold">Radius</span>
                                                <select value={selectedEl.btn_radius || 'rounded-full'} onChange={(e) => heroUpdateElement(selectedHeroIdx!, 'btn_radius', e.target.value)} className="h-7 rounded-lg border border-orange-200 bg-white dark:bg-neutral-900 text-[10px] px-1.5">
                                                    <option value="rounded-none">None</option>
                                                    <option value="rounded-lg">LG</option>
                                                    <option value="rounded-full">Full</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!selectedEl && (
                                    <p className="text-[9px] text-neutral-400 italic mt-1">Click an element below to see its formatting controls here.</p>
                                )}
                            </div>
                        )}

                        {/* ===== BACKGROUND SETTINGS ===== */}
                        {!isCustomerMode && (
                            <div className="flex flex-col gap-2 border-b pb-3 pt-4 px-1">
                                <div className="grid gap-1">
                                    <Label className="text-[10px] text-neutral-500 uppercase font-bold">Background Color / Gradient</Label>
                                    <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-8" placeholder="e.g. from-pink-500 to-rose-600" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[10px] text-neutral-500 uppercase font-bold">Background Image</Label>
                                    <FileUpload value={block.bg_image || ''} onChange={(url) => handleUpdate({ bg_image: url })} placeholder="Upload background image..." />
                                </div>
                            </div>
                        )}

                        {/* ===== ELEMENT LIST ===== */}
                        <div className="flex flex-col gap-2.5 pt-3 px-1">
                            <span className="font-bold text-[10px] uppercase text-neutral-400 tracking-wider">Layout Elements ({elements.length})</span>
                            
                            {elements.map((el: any, idx: number) => {
                                const isSelected = selectedHeroIdx === idx;
                                return (
                                    <div
                                        key={el.id || idx}
                                        onClick={() => setSelectedHeroIdx(isSelected ? null : idx)}
                                        className={`p-3.5 border rounded-xl shadow-xs flex flex-col gap-2.5 relative cursor-pointer transition-all duration-150 ${
                                            isSelected
                                                ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-400/30'
                                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300'
                                        }`}
                                    >
                                        {/* Element header with controls */}
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-[10px] uppercase text-neutral-500 tracking-wider flex items-center gap-1.5">
                                                <span className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold ${
                                                    el.type === 'text' ? 'bg-blue-100 text-blue-600' :
                                                    el.type === 'image' ? 'bg-green-100 text-green-600' :
                                                    el.type === 'video' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-orange-100 text-orange-600'
                                                }`}>{el.type}</span>
                                            </span>
                                            {!isCustomerMode && (
                                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <button type="button" disabled={idx === 0} onClick={() => heroMoveElement(idx, 'up')} className="text-[10px] bg-neutral-50 dark:bg-neutral-950 p-1 border rounded disabled:opacity-30" title="Move Up">▲</button>
                                                    <button type="button" disabled={idx === elements.length - 1} onClick={() => heroMoveElement(idx, 'down')} className="text-[10px] bg-neutral-50 dark:bg-neutral-950 p-1 border rounded disabled:opacity-30" title="Move Down">▼</button>
                                                    <button type="button" onClick={() => heroRemoveElement(idx)} className="text-red-500 bg-red-50 dark:bg-red-950/20 p-1 rounded ml-0.5 text-xs" title="Remove">✕</button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Inline content editing */}
                                        <div onClick={(e) => e.stopPropagation()}>
                                            {el.type === 'text' && (
                                                <textarea
                                                    value={el.content || ''}
                                                    onChange={(e) => heroUpdateElement(idx, 'content', e.target.value)}
                                                    className="flex min-h-[44px] w-full rounded-lg border border-neutral-200 bg-transparent px-2.5 py-1.5 text-xs focus-visible:outline-none focus:border-blue-400 resize-none"
                                                    placeholder="Enter text..."
                                                />
                                            )}
                                            {el.type === 'image' && (
                                                <FileUpload value={el.url || ''} onChange={(url) => heroUpdateElement(idx, 'url', url)} placeholder="Upload image..." />
                                            )}
                                            {el.type === 'video' && (
                                                <FileUpload value={el.video_url || ''} onChange={(url) => heroUpdateElement(idx, 'video_url', url)} placeholder="Upload video..." />
                                            )}
                                            {el.type === 'button' && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input value={el.btn_text || ''} onChange={(e) => heroUpdateElement(idx, 'btn_text', e.target.value)} className="h-7 text-xs font-bold" placeholder="Button text" />
                                                    <Input value={el.btn_url || ''} onChange={(e) => heroUpdateElement(idx, 'btn_url', e.target.value)} className="h-7 text-xs" placeholder="https://..." />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}

            {block.type === 'text' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Heading (Optional)</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8 font-medium" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Text Content</Label>
                        <textarea
                            value={block.content || ''}
                            onChange={(e) => handleUpdate({ content: e.target.value })}
                            className="flex min-h-[100px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm focus-visible:outline-hidden dark:border-neutral-800"
                        />
                    </div>
                    {!isCustomerMode && (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                                <Label className="text-[10px] text-neutral-500 uppercase font-bold">Alignment</Label>
                                <select value={block.align || 'center'} onChange={(e) => handleUpdate({ align: e.target.value })} className="h-8 rounded-md border border-neutral-200 bg-transparent text-xs px-2 dark:border-neutral-800 dark:bg-neutral-900">
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div className="grid gap-1">
                                <Label className="text-[10px] text-neutral-500 uppercase font-bold">Bg Class / Color</Label>
                                <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-8" placeholder="e.g. bg-white or #fafafa" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {block.type === 'swiper' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Photos</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('images', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80')} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Photo</button>
                        )}
                    </div>
                    {block.images?.map((url: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center bg-white dark:bg-neutral-900 p-2 border rounded-lg">
                            <FileUpload
                                value={url}
                                onChange={(newUrl) => { const imgs = [...block.images!]; imgs[idx] = newUrl; handleUpdate({ images: imgs }); }}
                                className="flex-1"
                                placeholder="Image URL or Upload..."
                            />
                            {!isCustomerMode && (
                                <button type="button" onClick={() => handleRemoveListItem('images', idx)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded">✕</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {block.type === 'video' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Video Embed URL or Upload</Label>
                        <FileUpload
                            value={block.video_url || ''}
                            onChange={(url) => handleUpdate({ video_url: url })}
                            placeholder="https://youtube... or Upload Video"
                            accept="video/*"
                        />
                    </div>
                </div>
            )}

            {block.type === 'links' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Action Links</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('links', { label: 'New Link', url: 'https://', icon: 'link' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Link</button>
                        )}
                    </div>
                    {block.links?.map((link: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                            {!isCustomerMode && (
                                <button type="button" onClick={() => handleRemoveListItem('links', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-0.5">
                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Button Label</span>
                                    <Input value={link.label} onChange={(e) => handleUpdateListItem('links', idx, 'label', e.target.value)} className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-0.5">
                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">URL / Link</span>
                                    <Input value={link.url} onChange={(e) => handleUpdateListItem('links', idx, 'url', e.target.value)} className="h-7 text-xs" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {block.type === 'icons_grid' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Grid Items</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('features', { icon: 'sparkles', title: 'New Item', desc: 'Description' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Item</button>
                        )}
                    </div>
                    <div className="grid gap-2">
                        {block.features?.map((feat: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                                {!isCustomerMode && (
                                    <button type="button" onClick={() => handleRemoveListItem('features', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
                                )}
                                <Input value={feat.title} onChange={(e) => handleUpdateListItem('features', idx, 'title', e.target.value)} placeholder="Title" className="h-7 text-xs font-bold" />
                                <Input value={feat.desc} onChange={(e) => handleUpdateListItem('features', idx, 'desc', e.target.value)} placeholder="Short Description" className="h-7 text-xs" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {block.type === 'form' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Form Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    {!isCustomerMode && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Form Type</Label>
                            <select value={block.form_type || 'rsvp'} onChange={(e) => handleUpdate({ form_type: e.target.value })} className="h-8 rounded-md border border-neutral-200 bg-transparent text-xs px-2 dark:border-neutral-800 dark:bg-neutral-900">
                                <option value="rsvp">RSVP Form</option>
                                <option value="contact">Contact Form</option>
                            </select>
                        </div>
                    )}
                </div>
            )}

            {block.type === 'faq' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Questions & Answers</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('items', { question: 'New Question?', answer: 'Answer here...' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Q&A</button>
                        )}
                    </div>
                    <div className="grid gap-2">
                        {block.items?.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                                {!isCustomerMode && (
                                    <button type="button" onClick={() => handleRemoveListItem('items', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
                                )}
                                <div className="grid gap-1 mr-6">
                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Question</span>
                                    <Input value={item.question} onChange={(e) => handleUpdateListItem('items', idx, 'question', e.target.value)} className="h-7 text-xs font-bold text-neutral-800" />
                                </div>
                                <div className="grid gap-1">
                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Answer</span>
                                    <textarea value={item.answer} onChange={(e) => handleUpdateListItem('items', idx, 'answer', e.target.value)} className="flex min-h-[50px] w-full rounded-md border border-neutral-200 bg-transparent px-2 py-1 text-xs focus-visible:outline-hidden" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {block.type === 'testimonials' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Client Reviews</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('items', { name: 'Client Name', role: 'Role/Company', quote: 'Great work!', rating: 5 })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Review</button>
                        )}
                    </div>
                    <div className="grid gap-2">
                        {block.items?.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                                {!isCustomerMode && (
                                    <button type="button" onClick={() => handleRemoveListItem('items', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
                                )}
                                <div className="grid grid-cols-2 gap-2 mr-6">
                                    <div className="grid gap-0.5">
                                        <span className="text-[9px] text-neutral-400 uppercase font-bold">Reviewer Name</span>
                                        <Input value={item.name} onChange={(e) => handleUpdateListItem('items', idx, 'name', e.target.value)} className="h-7 text-xs font-bold" />
                                    </div>
                                    <div className="grid gap-0.5">
                                        <span className="text-[9px] text-neutral-400 uppercase font-bold">Role / Company</span>
                                        <Input value={item.role} onChange={(e) => handleUpdateListItem('items', idx, 'role', e.target.value)} className="h-7 text-xs text-neutral-500" />
                                    </div>
                                </div>
                                <div className="grid gap-0.5">
                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Review Quote</span>
                                    <textarea value={item.quote} onChange={(e) => handleUpdateListItem('items', idx, 'quote', e.target.value)} className="flex min-h-[40px] w-full rounded-md border border-neutral-200 bg-transparent px-2 py-1 text-xs focus-visible:outline-hidden" />
                                </div>
                                {!isCustomerMode && (
                                    <div className="grid gap-0.5">
                                        <span className="text-[9px] text-neutral-400 uppercase font-bold">Rating (1-5)</span>
                                        <select value={item.rating || 5} onChange={(e) => handleUpdateListItem('items', idx, 'rating', e.target.value)} className="h-7 rounded-md border border-neutral-200 bg-transparent text-xs px-1">
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Event Specific Features: Countdown --- */}
            {block.type === 'countdown' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Countdown Title</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8 font-medium" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Target Date and Time</Label>
                        <Input type="datetime-local" value={block.event_date || ''} onChange={(e) => handleUpdate({ event_date: e.target.value })} className="h-8" />
                    </div>
                    {!isCustomerMode && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Bg Gradient / Color</Label>
                            <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-8" placeholder="e.g. from-neutral-900 to-neutral-800 text-white" />
                        </div>
                    )}
                </div>
            )}

            {/* --- Event Specific Features: Map --- */}
            {block.type === 'map' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Google Maps Embed URL (Iframe src)</Label>
                        <Input value={block.map_embed_url || ''} onChange={(e) => handleUpdate({ map_embed_url: e.target.value })} placeholder="https://www.google.com/maps/embed?pb=..." className="h-8" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Direct Map Location URL (Button Link)</Label>
                        <Input value={block.map_link || ''} onChange={(e) => handleUpdate({ map_link: e.target.value })} placeholder="https://maps.google.com/?q=..." className="h-8" />
                    </div>
                </div>
            )}

            {/* --- Event Specific Features: Timeline / Schedule --- */}
            {block.type === 'timeline' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Timeline Schedule Events</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('items', { time: '12:00 PM', title: 'New Event', desc: 'Description of event' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Event</button>
                        )}
                    </div>
                    <div className="grid gap-2">
                        {block.items?.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                                {!isCustomerMode && (
                                    <button type="button" onClick={() => handleRemoveListItem('items', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
                                )}
                                <div className="grid grid-cols-3 gap-2 mr-6">
                                    <div className="grid gap-0.5 col-span-1">
                                        <span className="text-[9px] text-neutral-400 uppercase font-bold">Time</span>
                                        <Input value={item.time} onChange={(e) => handleUpdateListItem('items', idx, 'time', e.target.value)} className="h-7 text-xs font-mono" />
                                    </div>
                                    <div className="grid gap-0.5 col-span-2">
                                        <span className="text-[9px] text-neutral-400 uppercase font-bold">Event Title</span>
                                        <Input value={item.title} onChange={(e) => handleUpdateListItem('items', idx, 'title', e.target.value)} className="h-7 text-xs font-bold" />
                                    </div>
                                </div>
                                <div className="grid gap-0.5">
                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Description</span>
                                    <textarea value={item.desc} onChange={(e) => handleUpdateListItem('items', idx, 'desc', e.target.value)} className="flex min-h-[40px] w-full rounded-md border border-neutral-200 bg-transparent px-2 py-1 text-xs focus-visible:outline-hidden" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {block.type === 'advanced_section' && (
                isCustomerMode ? (
                    <div className="flex flex-col gap-3">
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Header Text</Label>
                            <Input value={block.header_text || ''} onChange={(e) => handleUpdate({ header_text: e.target.value })} className="h-8 text-xs font-semibold" />
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Description Text</Label>
                            <textarea value={block.desc_text || ''} onChange={(e) => handleUpdate({ desc_text: e.target.value })} rows={3} className="flex w-full rounded border border-neutral-200 px-2 py-1 text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                                <Label className="text-[9px] text-neutral-500 font-bold uppercase">Button Text</Label>
                                <Input value={block.btn_text || ''} onChange={(e) => handleUpdate({ btn_text: e.target.value })} className="h-7 text-xs" />
                            </div>
                            <div className="grid gap-1">
                                <Label className="text-[9px] text-neutral-500 font-bold uppercase">Link URL</Label>
                                <Input value={block.btn_url || ''} onChange={(e) => handleUpdate({ btn_url: e.target.value })} className="h-7 text-xs" />
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-[9px] text-neutral-500 font-bold uppercase">Image URL or Upload</Label>
                            <FileUpload value={block.image_url || ''} onChange={(url) => handleUpdate({ image_url: url })} placeholder="Upload image..." />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {/* Background Settings */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">1. Section Background</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Bg Type</Label>
                                    <select value={block.bg_type || 'color'} onChange={(e) => handleUpdate({ bg_type: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="color">Solid Color</option>
                                        <option value="gradient">Gradient</option>
                                        <option value="image">Image Background</option>
                                    </select>
                                </div>
                                {block.bg_type === 'color' && (
                                    <div className="grid gap-1">
                                        <Label className="text-[9px] text-neutral-500 font-bold uppercase">Color (Hex/RGBA)</Label>
                                        <div className="flex gap-1.5 items-center">
                                            <input type="color" value={block.bg_color?.startsWith('#') ? block.bg_color : '#ffffff'} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="size-6 p-0 rounded cursor-pointer border" />
                                            <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-7 text-xs flex-1" />
                                        </div>
                                    </div>
                                )}
                                {block.bg_type === 'gradient' && (
                                    <div className="grid gap-1 col-span-2">
                                        <Label className="text-[9px] text-neutral-500 font-bold uppercase">Tailwind Gradient Classes</Label>
                                        <Input value={block.bg_gradient || ''} onChange={(e) => handleUpdate({ bg_gradient: e.target.value })} placeholder="e.g. from-indigo-500 via-purple-500 to-pink-500" className="h-7 text-xs" />
                                    </div>
                                )}
                            </div>
                            {block.bg_type === 'image' && (
                                <div className="flex flex-col gap-2">
                                    <div className="grid gap-1">
                                        <Label className="text-[9px] text-neutral-500 font-bold uppercase">Background Image URL</Label>
                                        <Input value={block.bg_image || ''} onChange={(e) => handleUpdate({ bg_image: e.target.value })} placeholder="https://..." className="h-7 text-xs" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="grid gap-1">
                                            <Label className="text-[9px] text-neutral-500 font-bold uppercase">Overlay Color</Label>
                                            <Input value={block.bg_overlay_color || '#000000'} onChange={(e) => handleUpdate({ bg_overlay_color: e.target.value })} className="h-7 text-xs" />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-[9px] text-neutral-500 font-bold uppercase">Overlay Opacity</Label>
                                            <Input type="number" min="0" max="1" step="0.1" value={block.bg_overlay_opacity || '0.4'} onChange={(e) => handleUpdate({ bg_overlay_opacity: e.target.value })} className="h-7 text-xs" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Layout Settings */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">2. Layout Controls</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Max Width</Label>
                                    <select value={block.section_width || 'max-w-4xl'} onChange={(e) => handleUpdate({ section_width: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="max-w-md">Small (Mobile)</option>
                                        <option value="max-w-xl">Medium</option>
                                        <option value="max-w-4xl">Large (Default)</option>
                                        <option value="max-w-7xl">X-Large</option>
                                        <option value="max-w-full">Full Width</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Section Height</Label>
                                    <select value={block.section_height || 'auto'} onChange={(e) => handleUpdate({ section_height: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="auto">Auto</option>
                                        <option value="h-64">256px</option>
                                        <option value="h-96">384px</option>
                                        <option value="h-screen">Full Screen</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Padding Vertical</Label>
                                    <select value={block.padding_top || 'py-12'} onChange={(e) => handleUpdate({ padding_top: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="py-0">None (0)</option>
                                        <option value="py-4">Small (16px)</option>
                                        <option value="py-8">Medium (32px)</option>
                                        <option value="py-12">Large (48px)</option>
                                        <option value="py-20">X-Large (80px)</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Padding Horizontal</Label>
                                    <select value={block.padding_left || 'px-6'} onChange={(e) => handleUpdate({ padding_left: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="px-0">None (0)</option>
                                        <option value="px-2">Small (8px)</option>
                                        <option value="px-6">Medium (24px)</option>
                                        <option value="px-12">Large (48px)</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Margin Vertical</Label>
                                    <select value={block.margin_top || 'my-4'} onChange={(e) => handleUpdate({ margin_top: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="my-0">None</option>
                                        <option value="my-2">my-2 (Small)</option>
                                        <option value="my-4">my-4 (Medium)</option>
                                        <option value="my-8">my-8 (Large)</option>
                                        <option value="my-12">my-12 (X-Large)</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Border Width</Label>
                                    <select value={block.border_width || 'border-0'} onChange={(e) => handleUpdate({ border_width: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="border-0">No Border</option>
                                        <option value="border">Border Thin</option>
                                        <option value="border-2">Border 2px</option>
                                        <option value="border-4">Border 4px</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Border Color</Label>
                                    <Input value={block.border_color || '#e5e7eb'} onChange={(e) => handleUpdate({ border_color: e.target.value })} className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Border Style</Label>
                                    <select value={block.border_style || 'solid'} onChange={(e) => handleUpdate({ border_style: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="solid">Solid</option>
                                        <option value="dashed">Dashed</option>
                                        <option value="dotted">Dotted</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Border Radius</Label>
                                    <select value={block.border_radius || 'rounded-2xl'} onChange={(e) => handleUpdate({ border_radius: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="rounded-none">None</option>
                                        <option value="rounded-md">Medium</option>
                                        <option value="rounded-lg">Large</option>
                                        <option value="rounded-2xl">2X-Large</option>
                                        <option value="rounded-3xl">3X-Large</option>
                                        <option value="rounded-full">Circle (Full)</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Box Shadow</Label>
                                    <select value={block.box_shadow || 'shadow-md'} onChange={(e) => handleUpdate({ box_shadow: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="shadow-none">None</option>
                                        <option value="shadow-sm">Small</option>
                                        <option value="shadow-md">Medium</option>
                                        <option value="shadow-lg">Large</option>
                                        <option value="shadow-xl">X-Large</option>
                                        <option value="shadow-2xl">2X-Large</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Header Settings */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">3. Header Settings</h4>
                            <div className="grid gap-1.5">
                                <Label className="text-[9px] text-neutral-500 font-bold uppercase">Header Text</Label>
                                <Input value={block.header_text || ''} onChange={(e) => handleUpdate({ header_text: e.target.value })} className="h-8 text-xs font-semibold" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Heading Tag</Label>
                                    <select value={block.header_tag || 'h2'} onChange={(e) => handleUpdate({ header_tag: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="h1">H1</option>
                                        <option value="h2">H2</option>
                                        <option value="h3">H3</option>
                                        <option value="h4">H4</option>
                                        <option value="h5">H5</option>
                                        <option value="h6">H6</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Font Family</Label>
                                    <select value={block.header_font_family || 'Outfit'} onChange={(e) => handleUpdate({ header_font_family: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="Inter">Inter (Sans)</option>
                                        <option value="Outfit">Outfit (Display)</option>
                                        <option value="Playfair Display">Playfair (Serif)</option>
                                        <option value="Dancing Script">Dancing Script</option>
                                        <option value="Montserrat">Montserrat</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Font Size</Label>
                                    <select value={block.header_font_size || 'text-3xl'} onChange={(e) => handleUpdate({ header_font_size: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="text-sm">Small</option>
                                        <option value="text-base">Base</option>
                                        <option value="text-xl">Large</option>
                                        <option value="text-2xl">X-Large</option>
                                        <option value="text-3xl">2X-Large</option>
                                        <option value="text-4xl">3X-Large</option>
                                        <option value="text-5xl">4X-Large</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Font Weight</Label>
                                    <select value={block.header_font_weight || 'font-bold'} onChange={(e) => handleUpdate({ header_font_weight: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="font-light">Light</option>
                                        <option value="font-normal">Normal</option>
                                        <option value="font-semibold">Semibold</option>
                                        <option value="font-bold">Bold</option>
                                        <option value="font-extrabold">Extra Bold</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Text Color</Label>
                                    <Input value={block.header_color || '#111827'} onChange={(e) => handleUpdate({ header_color: e.target.value })} className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Alignment</Label>
                                    <select value={block.header_align || 'center'} onChange={(e) => handleUpdate({ header_align: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description Settings */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">4. Description Settings</h4>
                            <div className="grid gap-1.5">
                                <Label className="text-[9px] text-neutral-500 font-bold uppercase">Description Text</Label>
                                <textarea value={block.desc_text || ''} onChange={(e) => handleUpdate({ desc_text: e.target.value })} rows={3} className="flex w-full rounded border border-neutral-200 px-2 py-1 text-xs" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Font Family</Label>
                                    <select value={block.desc_font_family || 'Inter'} onChange={(e) => handleUpdate({ desc_font_family: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="Inter">Inter</option>
                                        <option value="Outfit">Outfit</option>
                                        <option value="Playfair Display">Playfair</option>
                                        <option value="Montserrat">Montserrat</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Font Size</Label>
                                    <select value={block.desc_font_size || 'text-sm'} onChange={(e) => handleUpdate({ desc_font_size: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="text-xs">Extra Small</option>
                                        <option value="text-sm">Small</option>
                                        <option value="text-base">Regular</option>
                                        <option value="text-lg">Large</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Line Height</Label>
                                    <select value={block.desc_line_height || 'leading-relaxed'} onChange={(e) => handleUpdate({ desc_line_height: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="leading-none">None</option>
                                        <option value="leading-tight">Tight</option>
                                        <option value="leading-normal">Normal</option>
                                        <option value="leading-relaxed">Relaxed</option>
                                        <option value="leading-loose">Loose</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Text Color</Label>
                                    <Input value={block.desc_color || '#4b5563'} onChange={(e) => handleUpdate({ desc_color: e.target.value })} className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1 col-span-2">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Alignment</Label>
                                    <select value={block.desc_align || 'center'} onChange={(e) => handleUpdate({ desc_align: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                        <option value="justify">Justify</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Button Settings */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">5. CTA Button Controls</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Button Text</Label>
                                    <Input value={block.btn_text || ''} onChange={(e) => handleUpdate({ btn_text: e.target.value })} className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Link URL</Label>
                                    <Input value={block.btn_url || ''} onChange={(e) => handleUpdate({ btn_url: e.target.value })} className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Button BG</Label>
                                    <Input value={block.btn_bg_color || ''} onChange={(e) => handleUpdate({ btn_bg_color: e.target.value })} placeholder="#2563eb" className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Text Color</Label>
                                    <Input value={block.btn_text_color || ''} onChange={(e) => handleUpdate({ btn_text_color: e.target.value })} placeholder="#ffffff" className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Border Radius</Label>
                                    <select value={block.btn_border_radius || 'rounded-full'} onChange={(e) => handleUpdate({ btn_border_radius: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="rounded-none">Square</option>
                                        <option value="rounded-md">Medium</option>
                                        <option value="rounded-lg">Large</option>
                                        <option value="rounded-full">Pill (Full)</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Hover Effect</Label>
                                    <select value={block.btn_hover_effect || 'scale'} onChange={(e) => handleUpdate({ btn_hover_effect: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="none">None</option>
                                        <option value="scale">Zoom (Scale)</option>
                                        <option value="opacity">Opacity Glow</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Icon</Label>
                                    <select value={block.btn_icon || 'none'} onChange={(e) => handleUpdate({ btn_icon: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="none">No Icon</option>
                                        <option value="arrow-right">Arrow Right</option>
                                        <option value="download">Download</option>
                                        <option value="external-link">External Link</option>
                                        <option value="mail">Mail Envelope</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Padding</Label>
                                    <select value={block.btn_padding_x || 'px-6'} onChange={(e) => handleUpdate({ btn_padding_x: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="px-4">px-4 (Normal)</option>
                                        <option value="px-6">px-6 (Wide)</option>
                                        <option value="px-8">px-8 (Extra Wide)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Image Settings */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">6. Image Settings</h4>
                            <div className="grid gap-1">
                                <Label className="text-[9px] text-neutral-500 font-bold uppercase">Image URL</Label>
                                <Input value={block.image_url || ''} onChange={(e) => handleUpdate({ image_url: e.target.value })} className="h-7 text-xs" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Alt Text</Label>
                                    <Input value={block.image_alt || ''} onChange={(e) => handleUpdate({ image_alt: e.target.value })} className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Display Size</Label>
                                    <select value={block.image_size || 'medium'} onChange={(e) => handleUpdate({ image_size: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                        <option value="full">Full Width</option>
                                    </select>
                                </div>
                                <div className="grid gap-1 col-span-2">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Border Radius</Label>
                                    <select value={block.image_radius || 'rounded-xl'} onChange={(e) => handleUpdate({ image_radius: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="rounded-none">Square</option>
                                        <option value="rounded-md">Medium</option>
                                        <option value="rounded-xl">Rounded XL</option>
                                        <option value="rounded-full">Circle</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Structure Alignment & Animations */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">7. Alignment & Animation</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Content Align</Label>
                                    <select value={block.content_align || 'flex-col items-center'} onChange={(e) => handleUpdate({ content_align: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="flex-col items-start">Stack Left</option>
                                        <option value="flex-col items-center">Stack Center</option>
                                        <option value="flex-col items-end">Stack Right</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Intro Animation</Label>
                                    <select value={block.animation_type || 'slide-up'} onChange={(e) => handleUpdate({ animation_type: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="none">None</option>
                                        <option value="fade-in">Fade In</option>
                                        <option value="slide-up">Slide Up</option>
                                        <option value="zoom-in">Zoom In</option>
                                        <option value="bounce">Bounce</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Responsive Settings */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">8. Responsive Settings</h4>
                            <div className="grid grid-cols-3 gap-2 py-1">
                                <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase cursor-pointer">
                                    <input type="checkbox" checked={block.visibility_desktop !== false} onChange={(e) => handleUpdate({ visibility_desktop: e.target.checked })} className="size-3.5 rounded border" />
                                    Desktop
                                </label>
                                <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase cursor-pointer">
                                    <input type="checkbox" checked={block.visibility_tablet !== false} onChange={(e) => handleUpdate({ visibility_tablet: e.target.checked })} className="size-3.5 rounded border" />
                                    Tablet
                                </label>
                                <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase cursor-pointer">
                                    <input type="checkbox" checked={block.visibility_mobile !== false} onChange={(e) => handleUpdate({ visibility_mobile: e.target.checked })} className="size-3.5 rounded border" />
                                    Mobile
                                </label>
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <div className="border border-neutral-150 rounded-xl p-3  flex flex-col gap-2.5">
                            <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider pb-1.5 border-b">9. Advanced CSS Specs</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">CSS class</Label>
                                    <Input value={block.custom_class || ''} onChange={(e) => handleUpdate({ custom_class: e.target.value })} placeholder="e.g. shadow-indigo-200" className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">CSS ID</Label>
                                    <Input value={block.custom_id || ''} onChange={(e) => handleUpdate({ custom_id: e.target.value })} className="h-7 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Positioning</Label>
                                    <select value={block.positioning || 'relative'} onChange={(e) => handleUpdate({ positioning: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="static">Static</option>
                                        <option value="relative">Relative</option>
                                        <option value="absolute">Absolute</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Z-Index</Label>
                                    <select value={block.z_index || 'z-0'} onChange={(e) => handleUpdate({ z_index: e.target.value })} className="h-7 text-xs  border rounded">
                                        <option value="z-0">z-0</option>
                                        <option value="z-10">z-10</option>
                                        <option value="z-20">z-20</option>
                                        <option value="z-50">z-50</option>
                                    </select>
                                </div>
                                <div className="grid gap-1 col-span-2">
                                    <Label className="text-[9px] text-neutral-500 font-bold uppercase">Custom Raw CSS</Label>
                                    <textarea value={block.custom_css || ''} onChange={(e) => handleUpdate({ custom_css: e.target.value })} rows={3} placeholder={`#${block.custom_id || 'sec-id'} { \n  transform: rotate(1deg);\n}`} className="flex w-full rounded border border-neutral-200 px-2 py-1 text-[10px] font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}

            
            {block.type === 'freeform' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1 border-b pb-2">
                        <Label className="text-[10px] text-pink-600 uppercase font-bold">Freeform Canvas Elements</Label>
                        <p className="text-[9px] text-neutral-500 leading-tight">Drag and resize elements directly in the Live Simulator. Edit text or images below.</p>
                    </div>
                    
                    {!isCustomerMode && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            <button type="button" onClick={() => handleAddListItem('items', { type: 'text', content: 'New Text', x: 20, y: 20, w: 200, h: 50, color: '#000000', fontSize: 16, fontWeight: 'normal' })} className="px-2 py-1 bg-white border rounded text-[10px] hover:bg-neutral-50 shadow-sm">+ Add Text</button>
                            <button type="button" onClick={() => handleAddListItem('items', { type: 'image', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80', x: 50, y: 50, w: 150, h: 150, radius: 0 })} className="px-2 py-1 bg-white border rounded text-[10px] hover:bg-neutral-50 shadow-sm">+ Add Image</button>
                            <button type="button" onClick={() => handleAddListItem('items', { type: 'icon', icon: 'Star', x: 100, y: 100, w: 50, h: 50, color: '#ec4899' })} className="px-2 py-1 bg-white border rounded text-[10px] hover:bg-neutral-50 shadow-sm">+ Add Icon</button>
                        </div>
                    )}
                    
                    {block.items?.map((item: any, idx: number) => {
                        // In customer mode, skip icon elements since they are non-editable design elements
                        if (isCustomerMode && item.type === 'icon') return null;

                        return (
                            <div key={idx} className="flex flex-col gap-2 p-3 bg-white dark:bg-neutral-800 border rounded-lg shadow-xs">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-xs capitalize">{item.type} Element</span>
                                    {!isCustomerMode && (
                                        <button type="button" onClick={() => handleRemoveListItem('items', idx)} className="text-red-500 text-[10px] font-bold">Remove</button>
                                    )}
                                </div>
                                
                                {item.type === 'text' && (
                                    <>
                                        <Input value={item.content} onChange={(e) => { const it = [...block.items!]; it[idx].content = e.target.value; handleUpdate({ items: it }); }} placeholder="Text Content" className="h-7 text-xs" />
                                        {!isCustomerMode && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input type="color" value={item.color} onChange={(e) => { const it = [...block.items!]; it[idx].color = e.target.value; handleUpdate({ items: it }); }} className="h-7 w-full p-0 cursor-pointer" />
                                                <Input type="number" value={item.fontSize} onChange={(e) => { const it = [...block.items!]; it[idx].fontSize = parseInt(e.target.value); handleUpdate({ items: it }); }} placeholder="Size (px)" className="h-7 text-xs" />
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {item.type === 'image' && (
                                    <FileUpload value={item.url} onChange={(newUrl) => { const it = [...block.items!]; it[idx].url = newUrl; handleUpdate({ items: it }); }} placeholder="Image URL..." className="h-7 text-xs" />
                                )}
                                
                                {item.type === 'icon' && !isCustomerMode && (
                                    <>
                                        <IconPicker value={item.icon} onChange={(newIcon) => { const it = [...block.items!]; it[idx].icon = newIcon; handleUpdate({ items: it }); }} />
                                        <Input type="color" value={item.color} onChange={(e) => { const it = [...block.items!]; it[idx].color = e.target.value; handleUpdate({ items: it }); }} className="h-7 w-full p-0 cursor-pointer" />
                                    </>
                                )}
                                {!isCustomerMode && (
                                    <div className="text-[8px] text-neutral-400 mt-1 uppercase text-right">Size: {item.w}x{item.h}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {block.type === 'gallery' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Gallery Title</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8 font-medium" />
                    </div>
                    {!isCustomerMode && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Layout Style</Label>
                            <select value={block.layout || 'grid'} onChange={(e) => handleUpdate({ layout: e.target.value })} className="h-8 rounded-md border border-neutral-200 bg-transparent text-xs px-2 dark:border-neutral-800 dark:bg-neutral-900">
                                <option value="grid">Standard Grid</option>
                                <option value="masonry">Masonry</option>
                            </select>
                        </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Photos</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('images', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80')} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Photo</button>
                        )}
                    </div>
                    {block.images?.map((url: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center bg-white dark:bg-neutral-900 p-2 border rounded-lg shadow-sm">
                            <FileUpload
                                value={url}
                                onChange={(newUrl) => { const imgs = [...block.images!]; imgs[idx] = newUrl; handleUpdate({ images: imgs }); }}
                                className="flex-1"
                                placeholder="Image URL..."
                            />
                            {!isCustomerMode && (
                                <button type="button" onClick={() => handleRemoveListItem('images', idx)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded">✕</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {block.type === 'pricing' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Pricing Title</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8 font-medium" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Pricing Plans</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('plans', { name: 'New Plan', price: '0', features: ['Feature 1'], button_text: 'Buy', button_link: '#' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Plan</button>
                        )}
                    </div>
                    {block.plans?.map((plan: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-white dark:bg-neutral-800 border rounded-lg shadow-xs">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs">Plan #{idx + 1}</span>
                                {!isCustomerMode && (
                                    <button type="button" onClick={() => handleRemoveListItem('plans', idx)} className="text-red-500 text-[10px] font-bold">Remove</button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input value={plan.name} onChange={(e) => { const p = [...block.plans!]; p[idx].name = e.target.value; handleUpdate({ plans: p }); }} placeholder="Plan Name" className="h-7 text-xs" />
                                <Input value={plan.price} onChange={(e) => { const p = [...block.plans!]; p[idx].price = e.target.value; handleUpdate({ plans: p }); }} placeholder="Price (e.g. $99)" className="h-7 text-xs" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input value={plan.button_text} onChange={(e) => { const p = [...block.plans!]; p[idx].button_text = e.target.value; handleUpdate({ plans: p }); }} placeholder="Button Text" className="h-7 text-xs" />
                                <Input value={plan.button_link} onChange={(e) => { const p = [...block.plans!]; p[idx].button_link = e.target.value; handleUpdate({ plans: p }); }} placeholder="Button Link" className="h-7 text-xs" />
                            </div>
                            <div className="grid gap-1 mt-1">
                                <Label className="text-[9px] text-neutral-500">Features (Comma separated)</Label>
                                <Input value={plan.features.join(', ')} onChange={(e) => { const p = [...block.plans!]; p[idx].features = e.target.value.split(',').map(s=>s.trim()); handleUpdate({ plans: p }); }} placeholder="Feature 1, Feature 2" className="h-7 text-xs" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {block.type === 'cta' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Headline</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8 font-medium" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Description text</Label>
                        <textarea value={block.content || ''} onChange={(e) => handleUpdate({ content: e.target.value })} className="flex min-h-[60px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm focus-visible:outline-none dark:border-neutral-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Button Text</Label>
                            <Input value={block.cta_text || ''} onChange={(e) => handleUpdate({ cta_text: e.target.value })} className="h-8" />
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Button Link</Label>
                            <Input value={block.cta_link || ''} onChange={(e) => handleUpdate({ cta_link: e.target.value })} className="h-8" />
                        </div>
                    </div>
                    <div className="grid gap-1 border-t pt-3 mt-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex justify-between">
                            Side Image
                        </Label>
                        <FileUpload value={block.image_url || ''} onChange={(newUrl) => handleUpdate({ image_url: newUrl })} placeholder="Image URL..." />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Image Alignment</Label>
                        <select value={block.align || 'left'} onChange={(e) => handleUpdate({ align: e.target.value })} className="h-8 rounded-md border border-neutral-200 bg-transparent text-xs px-2">
                            <option value="left">Image on Left</option>
                            <option value="right">Image on Right</option>
                        </select>
                    </div>
                </div>
            )}

            {block.type === 'html' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Block Title (For Editor Only)</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-pink-600 uppercase font-bold">Raw HTML / Scripts</Label>
                        <textarea 
                            value={block.html_content || ''} 
                            onChange={(e) => handleUpdate({ html_content: e.target.value })} 
                            className="flex min-h-[250px] w-full font-mono text-[11px] rounded-md border border-neutral-300 bg-neutral-900 text-green-400 p-3 focus-visible:outline-none" 
                            placeholder="<div>...</div>"
                        />
                        <p className="text-[9px] text-neutral-500 mt-1">Warning: Scripts will run on the published site. Use carefully.</p>
                    </div>
                </div>
            )}

            {block.type === 'profile' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Title</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8 font-medium" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Profiles</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('profiles', { name: 'New Person', role: 'Role', image: 'https://i.pravatar.cc/150', social: '#' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Profile</button>
                        )}
                    </div>
                    {block.profiles?.map((prof: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-white dark:bg-neutral-800 border rounded-lg shadow-xs">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs">Profile #{idx + 1}</span>
                                {!isCustomerMode && (
                                    <button type="button" onClick={() => handleRemoveListItem('profiles', idx)} className="text-red-500 text-[10px] font-bold">Remove</button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border">
                                    {prof.image ? <img src={prof.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-neutral-100" />}
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <Input value={prof.name} onChange={(e) => { const p = [...block.profiles!]; p[idx].name = e.target.value; handleUpdate({ profiles: p }); }} placeholder="Name" className="h-7 text-xs" />
                                    <Input value={prof.role} onChange={(e) => { const p = [...block.profiles!]; p[idx].role = e.target.value; handleUpdate({ profiles: p }); }} placeholder="Role" className="h-7 text-xs" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <FileUpload value={prof.image} onChange={(newUrl) => { const p = [...block.profiles!]; p[idx].image = newUrl; handleUpdate({ profiles: p }); }} placeholder="Image URL..." className="flex-1 h-7 text-xs" />
                                <Input value={prof.social} onChange={(e) => { const p = [...block.profiles!]; p[idx].social = e.target.value; handleUpdate({ profiles: p }); }} placeholder="Social Link" className="flex-1 h-7 text-xs" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {block.type === 'flexible_layout' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1 border-b pb-2">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Flexible Section Settings</Label>
                        <p className="text-[9px] text-neutral-500 leading-tight">Create dynamic layouts by stacking custom styled elements. Arrange and style them individually below.</p>
                    </div>

                    {!isCustomerMode && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Background Class / Color</Label>
                            <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-8" placeholder="e.g. bg-white or from-indigo-500 to-purple-600" />
                        </div>
                    )}

                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Background Image</Label>
                        <FileUpload value={block.bg_image || ''} onChange={(newUrl) => handleUpdate({ bg_image: newUrl })} placeholder="Upload BG Image or URL..." />
                    </div>

                    {!isCustomerMode && (
                        <div className="grid gap-1 border-t pt-3 mt-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Add Custom Elements</Label>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleAddItem('text')}
                                    className="px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white rounded text-[10px] hover:bg-neutral-800 font-bold shadow-xs transition-colors"
                                >
                                    + Text Element
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddItem('image')}
                                    className="px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white rounded text-[10px] hover:bg-neutral-800 font-bold shadow-xs transition-colors"
                                >
                                    + Image Element
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddItem('video')}
                                    className="px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white rounded text-[10px] hover:bg-neutral-800 font-bold shadow-xs transition-colors"
                                >
                                    + Video Element
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddItem('button')}
                                    className="px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white rounded text-[10px] hover:bg-neutral-800 font-bold shadow-xs transition-colors"
                                >
                                    + Button Element
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-3 border-t pt-3">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Layout Elements Stack</span>
                        
                        <div className="flex flex-col gap-3">
                            {block.items?.map((item: any, idx: number) => (
                                <div key={item.id || idx} className="p-3.5 bg-white dark:bg-neutral-800 border rounded-xl shadow-xs flex flex-col gap-3 relative border-neutral-200 dark:border-neutral-700 animate-none">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="font-bold text-xs uppercase text-neutral-500 tracking-wider flex items-center gap-1">
                                            <span className="bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 rounded px-1.5 py-0.5 text-[9px] font-extrabold">{idx + 1}</span>
                                            {item.type} field
                                        </span>
                                        {!isCustomerMode && (
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    disabled={idx === 0}
                                                    onClick={() => handleMoveItemUp(idx)}
                                                    className="text-[10px] bg-neutral-50 dark:bg-neutral-950 p-1 border rounded disabled:opacity-40"
                                                    title="Move Up"
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={idx === block.items!.length - 1}
                                                    onClick={() => handleMoveItemDown(idx)}
                                                    className="text-[10px] bg-neutral-50 dark:bg-neutral-950 p-1 border rounded disabled:opacity-40"
                                                    title="Move Down"
                                                >
                                                    ▼
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(idx)}
                                                    className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/20 p-1 rounded ml-1 text-xs"
                                                    title="Remove"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {item.type === 'text' && (
                                        <div className="flex flex-col gap-2.5">
                                            <div className="grid gap-0.5">
                                                <span className="text-[9px] text-neutral-400 uppercase font-bold">Text Content</span>
                                                <textarea
                                                    value={item.text || ''}
                                                    onChange={(e) => handleUpdateItemProperty(idx, 'text', e.target.value)}
                                                    className="flex min-h-[50px] w-full rounded border border-neutral-250 bg-transparent px-2.5 py-1 text-xs focus-visible:outline-none"
                                                    placeholder="Enter text..."
                                                />
                                            </div>
                                            {!isCustomerMode && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[9px] text-neutral-400 uppercase font-bold">Font Family</span>
                                                        <select
                                                            value={item.font_family || ''}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'font_family', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[10px] px-1"
                                                        >
                                                            <option value="">Default (Inherit)</option>
                                                            <option value="'Inter', sans-serif">Inter</option>
                                                            <option value="'Roboto', sans-serif">Roboto</option>
                                                            <option value="'Playfair Display', serif">Playfair Display</option>
                                                            <option value="'Outfit', sans-serif">Outfit</option>
                                                            <option value="'Dancing Script', cursive">Dancing Script</option>
                                                            <option value="'Alex Brush', cursive">Alex Brush</option>
                                                            <option value="'Parisienne', cursive">Parisienne</option>
                                                            <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                                                            <option value="'Pinyon Script', cursive">Pinyon Script</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[9px] text-neutral-400 uppercase font-bold">Alignment</span>
                                                        <select
                                                            value={item.align || 'center'}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'align', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[10px] px-1"
                                                        >
                                                            <option value="left">Left</option>
                                                            <option value="center">Center</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                            {!isCustomerMode && (
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold">Size</span>
                                                        <select
                                                            value={item.font_size || 'text-base'}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'font_size', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                        >
                                                            <option value="text-xs">XS</option>
                                                            <option value="text-sm">SM</option>
                                                            <option value="text-base">Base</option>
                                                            <option value="text-lg">LG</option>
                                                            <option value="text-xl">XL</option>
                                                            <option value="text-2xl">2XL</option>
                                                            <option value="text-3xl">3XL</option>
                                                            <option value="text-4xl">4XL</option>
                                                            <option value="text-5xl">5XL</option>
                                                            <option value="text-6xl">6XL</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold">Weight</span>
                                                        <select
                                                            value={item.weight || 'normal'}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'weight', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                        >
                                                            <option value="light">Light</option>
                                                            <option value="normal">Normal</option>
                                                            <option value="bold">Bold</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold">Color</span>
                                                        <div className="flex gap-0.5">
                                                            <input type="color" value={item.color || '#1f2937'} onChange={(e) => handleUpdateItemProperty(idx, 'color', e.target.value)} className="h-7 w-5 p-0 border rounded cursor-pointer" />
                                                            <input type="text" value={item.color || ''} onChange={(e) => handleUpdateItemProperty(idx, 'color', e.target.value)} placeholder="#000" className="h-7 flex-1 text-[8px] px-0.5 w-8 border rounded" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {item.type === 'image' && (
                                        <div className="flex flex-col gap-2.5">
                                            <div className="grid gap-0.5">
                                                <span className="text-[9px] text-neutral-400 uppercase font-bold">Upload Image</span>
                                                <FileUpload
                                                    value={item.url || ''}
                                                    onChange={(url) => handleUpdateItemProperty(idx, 'url', url)}
                                                    placeholder="Upload foreground image..."
                                                />
                                            </div>
                                            {!isCustomerMode && (
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold">Image Size</span>
                                                        <select
                                                            value={item.image_size || 'medium'}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'image_size', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                        >
                                                            <option value="small">Small (150px)</option>
                                                            <option value="medium">Medium (320px)</option>
                                                            <option value="large">Large (500px)</option>
                                                            <option value="full">Full Width</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold">Border Radius</span>
                                                        <select
                                                            value={item.radius || 'rounded-xl'}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'radius', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                        >
                                                            <option value="rounded-none">None</option>
                                                            <option value="rounded-lg">LG</option>
                                                            <option value="rounded-2xl">2XL</option>
                                                            <option value="rounded-full">Full/Circle</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold">Alignment</span>
                                                        <select
                                                            value={item.align || 'center'}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'align', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                        >
                                                            <option value="left">Left</option>
                                                            <option value="center">Center</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {item.type === 'video' && (
                                        <div className="flex flex-col gap-2.5">
                                            <div className="grid gap-0.5">
                                                <span className="text-[9px] text-neutral-400 uppercase font-bold">Upload Video</span>
                                                <FileUpload
                                                    value={item.video_url || ''}
                                                    onChange={(url) => handleUpdateItemProperty(idx, 'video_url', url)}
                                                    placeholder="Upload video..."
                                                    accept="video/*"
                                                />
                                            </div>
                                            {!isCustomerMode && (
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold">Video Size</span>
                                                        <select
                                                            value={item.video_size || 'medium'}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'video_size', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                        >
                                                            <option value="small">Small (150px)</option>
                                                            <option value="medium">Medium (320px)</option>
                                                            <option value="large">Large (500px)</option>
                                                            <option value="full">Full Width</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid gap-0.5">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold">Alignment</span>
                                                        <select
                                                            value={item.align || 'center'}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'align', e.target.value)}
                                                            className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                        >
                                                            <option value="left">Left</option>
                                                            <option value="center">Center</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid gap-0.5 justify-center items-center">
                                                        <span className="text-[8px] text-neutral-400 uppercase font-bold select-none cursor-pointer">Autoplay</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={item.autoplay || false}
                                                            onChange={(e) => handleUpdateItemProperty(idx, 'autoplay', e.target.checked)}
                                                            className="size-4 mt-0.5 rounded border-neutral-350 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {item.type === 'button' && (
                                        <div className="flex flex-col gap-2.5">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="grid gap-0.5">
                                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Button Text</span>
                                                    <Input
                                                        value={item.btn_text || ''}
                                                        onChange={(e) => handleUpdateItemProperty(idx, 'btn_text', e.target.value)}
                                                        className="h-7 text-xs font-bold"
                                                        placeholder="e.g. Visit Us"
                                                    />
                                                </div>
                                                <div className="grid gap-0.5">
                                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Button Link</span>
                                                    <Input
                                                        value={item.btn_url || ''}
                                                        onChange={(e) => handleUpdateItemProperty(idx, 'btn_url', e.target.value)}
                                                        className="h-7 text-xs"
                                                        placeholder="e.g. https://"
                                                    />
                                                </div>
                                            </div>
                                            {!isCustomerMode && (
                                                <>
                                                    <div className="grid grid-cols-3 gap-1.5">
                                                        <div className="grid gap-0.5">
                                                            <span className="text-[8px] text-neutral-400 uppercase font-bold">BG Color</span>
                                                            <div className="flex gap-0.5">
                                                                <input type="color" value={item.btn_bg_color || '#2563eb'} onChange={(e) => handleUpdateItemProperty(idx, 'btn_bg_color', e.target.value)} className="h-6 w-4 p-0 border rounded cursor-pointer" />
                                                                <input type="text" value={item.btn_bg_color || ''} onChange={(e) => handleUpdateItemProperty(idx, 'btn_bg_color', e.target.value)} placeholder="#fff" className="h-6 w-full text-[8px] px-0.5 border rounded" />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-0.5">
                                                            <span className="text-[8px] text-neutral-400 uppercase font-bold">Text Color</span>
                                                            <div className="flex gap-0.5">
                                                                <input type="color" value={item.btn_text_color || '#ffffff'} onChange={(e) => handleUpdateItemProperty(idx, 'btn_text_color', e.target.value)} className="h-6 w-4 p-0 border rounded cursor-pointer" />
                                                                <input type="text" value={item.btn_text_color || ''} onChange={(e) => handleUpdateItemProperty(idx, 'btn_text_color', e.target.value)} placeholder="#000" className="h-6 w-full text-[8px] px-0.5 border rounded" />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-0.5">
                                                            <span className="text-[8px] text-neutral-400 uppercase font-bold">Alignment</span>
                                                            <select
                                                                value={item.align || 'center'}
                                                                onChange={(e) => handleUpdateItemProperty(idx, 'align', e.target.value)}
                                                                className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                            >
                                                                <option value="left">Left</option>
                                                                <option value="center">Center</option>
                                                                <option value="right">Right</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="grid gap-0.5">
                                                            <span className="text-[8px] text-neutral-400 uppercase font-bold">Button Size</span>
                                                            <select
                                                                value={item.btn_size || 'medium'}
                                                                onChange={(e) => handleUpdateItemProperty(idx, 'btn_size', e.target.value)}
                                                                className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                            >
                                                                <option value="small">Small</option>
                                                                <option value="medium">Medium</option>
                                                                <option value="large">Large</option>
                                                            </select>
                                                        </div>
                                                        <div className="grid gap-0.5">
                                                            <span className="text-[8px] text-neutral-400 uppercase font-bold">Button Radius</span>
                                                            <select
                                                                value={item.btn_radius || 'rounded-full'}
                                                                onChange={(e) => handleUpdateItemProperty(idx, 'btn_radius', e.target.value)}
                                                                className="h-7 rounded border border-neutral-200 bg-transparent text-[9px] px-1"
                                                            >
                                                                <option value="rounded-none">None</option>
                                                                <option value="rounded-lg">LG</option>
                                                                <option value="rounded-full">Full/Circle</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {block.type === 'dynamic_layout' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Section Heading (Optional)</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8 font-medium" />
                    </div>

                    {!isCustomerMode && (
                        <div className="grid gap-1 border-t pt-3 mt-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Background Class / Color</Label>
                            <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-8" placeholder="e.g. bg-white or from-pink-500 to-rose-600" />
                        </div>
                    )}

                    <div className="grid gap-1 border-t pt-3 mt-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Background Image</Label>
                        <FileUpload value={block.bg_image || ''} onChange={(newUrl) => handleUpdate({ bg_image: newUrl })} placeholder="Upload BG Image or URL..." />
                    </div>

                    <div className="grid gap-1 border-t pt-3 mt-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Foreground Custom Image</Label>
                        <FileUpload value={block.custom_image_url || ''} onChange={(newUrl) => handleUpdate({ custom_image_url: newUrl })} placeholder="Upload Image or URL..." />
                    </div>

                    {!isCustomerMode && (
                        <div className="grid gap-1 border-t pt-3 mt-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Block Icon</Label>
                            <IconPicker value={block.icon || 'Sparkles'} onChange={(newIcon) => handleUpdate({ icon: newIcon })} />
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t pt-3 mt-1">
                        <span className="font-bold text-[10px] uppercase text-neutral-400">Dynamic Text Lines</span>
                        {!isCustomerMode && (
                            <button type="button" onClick={() => handleAddListItem('text_lines', { text: 'New Text Line', size: 'text-sm', weight: 'normal', color: '#1f2937' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Line</button>
                        )}
                    </div>

                    <div className="grid gap-2">
                        {block.text_lines?.map((line: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-800 border rounded-lg shadow-xs flex flex-col gap-2 relative">
                                {!isCustomerMode && (
                                    <button type="button" onClick={() => handleRemoveListItem('text_lines', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
                                )}
                                
                                <div className="grid gap-1 mr-6">
                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Line Text</span>
                                    <textarea value={line.text} onChange={(e) => handleUpdateListItem('text_lines', idx, 'text', e.target.value)} className="flex min-h-[40px] w-full rounded-md border border-neutral-250 bg-transparent px-2 py-1 text-xs focus-visible:outline-none" />
                                </div>

                                {!isCustomerMode && (
                                    <div className="grid grid-cols-3 gap-1">
                                        <div className="grid gap-0.5">
                                            <span className="text-[8px] text-neutral-400 uppercase font-bold">Size</span>
                                            <select value={line.size || 'text-sm'} onChange={(e) => handleUpdateListItem('text_lines', idx, 'size', e.target.value)} className="h-6 rounded border border-neutral-200 bg-transparent text-[9px] px-1">
                                                <option value="text-xs">XS</option>
                                                <option value="text-sm">SM</option>
                                                <option value="text-base">Base</option>
                                                <option value="text-lg">LG</option>
                                                <option value="text-xl">XL</option>
                                                <option value="text-2xl">2XL</option>
                                                <option value="text-3xl">3XL</option>
                                            </select>
                                        </div>
                                        <div className="grid gap-0.5">
                                            <span className="text-[8px] text-neutral-400 uppercase font-bold">Weight</span>
                                            <select value={line.weight || 'normal'} onChange={(e) => handleUpdateListItem('text_lines', idx, 'weight', e.target.value)} className="h-6 rounded border border-neutral-200 bg-transparent text-[9px] px-1">
                                                <option value="light">Light</option>
                                                <option value="normal">Normal</option>
                                                <option value="bold">Bold</option>
                                            </select>
                                        </div>
                                        <div className="grid gap-0.5">
                                            <span className="text-[8px] text-neutral-400 uppercase font-bold">Color</span>
                                            <div className="flex gap-0.5">
                                                <input type="color" value={line.color || '#1f2937'} onChange={(e) => handleUpdateListItem('text_lines', idx, 'color', e.target.value)} className="h-6 w-5 p-0 border rounded cursor-pointer animate-none" />
                                                <input type="text" value={line.color || ''} onChange={(e) => handleUpdateListItem('text_lines', idx, 'color', e.target.value)} placeholder="#000" className="h-6 flex-1 text-[8px] px-0.5 w-8 border rounded" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
