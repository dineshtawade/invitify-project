import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle, Star, Sliders, Type, LayoutGrid } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import type { Block } from './types';

interface BlockSettingsProps {
    block: Block;
    onUpdate: (id: string, updates: Partial<Block>) => void;
    isCustomerMode?: boolean;
    customBlocks?: any[];
}

export function BlockSettings({ block, onUpdate, isCustomerMode = false, customBlocks = [] }: BlockSettingsProps) {
    const handleUpdate = (updates: Partial<Block>) => onUpdate(block.id, updates);
    const customBlock = customBlocks.find(cb => cb.type === block.type);

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
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
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

            {/* --- Advanced Customizable Section Controls --- */}
            {block.type === 'advanced_section' && (
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
            )}
        </div>
    );
}
