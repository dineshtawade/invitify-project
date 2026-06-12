import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle, Star, Sliders, Type, LayoutGrid } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import type { Block } from './types';

interface BlockSettingsProps {
    block: Block;
    onUpdate: (id: string, updates: Partial<Block>) => void;
    isCustomerMode?: boolean;
}

export function BlockSettings({ block, onUpdate, isCustomerMode = false }: BlockSettingsProps) {
    const handleUpdate = (updates: Partial<Block>) => onUpdate(block.id, updates);

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

    return (
        <div className="p-4 border-t border-neutral-150 dark:border-neutral-850 flex flex-col gap-6 text-xs bg-neutral-50/30 dark:bg-neutral-900/30">
            {/* --- Advanced Global Block Settings --- */}
            {!isCustomerMode && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Type className="size-3"/> Font</Label>
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
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><LayoutGrid className="size-3"/> Grid</Label>
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
                                <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Sliders className="size-3"/> Media Width</Label>
                                <select value={block.media_width || ''} onChange={(e) => handleUpdate({ media_width: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1 dark:bg-neutral-900 dark:border-neutral-800">
                                    <option value="">Default/Full</option>
                                    <option value="max-w-md">Small</option>
                                    <option value="max-w-xl">Medium</option>
                                    <option value="max-w-4xl">Large</option>
                                    <option value="max-w-full">Full Width</option>
                                </select>
                            </div>
                            <div className="grid gap-1">
                                <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Sliders className="size-3"/> Media Height</Label>
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

            {/* --- Block Type Specific Settings --- */}
            {block.type === 'hero' && (
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Main Title</Label>
                        <Input value={block.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} className="h-8 font-medium" />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Subtitle</Label>
                        <Input value={block.subtitle || ''} onChange={(e) => handleUpdate({ subtitle: e.target.value })} className="h-8" />
                    </div>
                    {!isCustomerMode && (
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Background Color/Gradient</Label>
                            <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-8" placeholder="e.g. from-pink-500 to-rose-600 or #ffffff" />
                        </div>
                    )}
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
                </div>
            )}

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
                        <button type="button" onClick={() => handleAddListItem('images', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80')} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Photo</button>
                    </div>
                    {block.images?.map((url: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center bg-white dark:bg-neutral-900 p-2 border rounded-lg">
                            <FileUpload 
                                value={url} 
                                onChange={(newUrl) => { const imgs = [...block.images!]; imgs[idx] = newUrl; handleUpdate({ images: imgs }); }} 
                                className="flex-1" 
                                placeholder="Image URL or Upload..." 
                            />
                            <button type="button" onClick={() => handleRemoveListItem('images', idx)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded">✕</button>
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
                        <button type="button" onClick={() => handleAddListItem('links', { label: 'New Link', url: 'https://', icon: 'link' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Link</button>
                    </div>
                    {block.links?.map((link: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                            <button type="button" onClick={() => handleRemoveListItem('links', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
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
                        <button type="button" onClick={() => handleAddListItem('features', { icon: 'sparkles', title: 'New Item', desc: 'Description' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Item</button>
                    </div>
                    <div className="grid gap-2">
                        {block.features?.map((feat: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                                <button type="button" onClick={() => handleRemoveListItem('features', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
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
                        <button type="button" onClick={() => handleAddListItem('items', { question: 'New Question?', answer: 'Answer here...' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Q&A</button>
                    </div>
                    <div className="grid gap-2">
                        {block.items?.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                                <button type="button" onClick={() => handleRemoveListItem('items', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
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
                        <button type="button" onClick={() => handleAddListItem('items', { name: 'Client Name', role: 'Role/Company', quote: 'Great work!', rating: 5 })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Review</button>
                    </div>
                    <div className="grid gap-2">
                        {block.items?.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                                <button type="button" onClick={() => handleRemoveListItem('items', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
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
                                <div className="grid gap-0.5">
                                    <span className="text-[9px] text-neutral-400 uppercase font-bold">Rating (1-5)</span>
                                    <select value={item.rating || 5} onChange={(e) => handleUpdateListItem('items', idx, 'rating', e.target.value)} className="h-7 rounded-md border border-neutral-200 bg-transparent text-xs px-1">
                                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                    </select>
                                </div>
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
                        <button type="button" onClick={() => handleAddListItem('items', { time: '12:00 PM', title: 'New Event', desc: 'Description of event' })} className="text-[10px] text-blue-600 font-bold hover:underline">+ Add Event</button>
                    </div>
                    <div className="grid gap-2">
                        {block.items?.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-neutral-900 border rounded-lg flex flex-col gap-2 relative shadow-xs">
                                <button type="button" onClick={() => handleRemoveListItem('items', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-0.5 rounded">✕</button>
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
        </div>
    );
}
