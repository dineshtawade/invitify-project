import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle, Star, Sliders, Type, LayoutGrid } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import type { Block } from './types';

interface BlockSettingsProps {
    block: Block;
    onUpdate: (id: string, updates: Partial<Block>) => void;
}

export function BlockSettings({ block, onUpdate }: BlockSettingsProps) {
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="grid gap-1">
                    <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Type className="size-3"/> Font</Label>
                    <select value={block.font_family || ''} onChange={(e) => handleUpdate({ font_family: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1">
                        <option value="">Default (Inherit)</option>
                        <option value="'Inter', sans-serif">Inter</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Playfair Display', serif">Playfair Display</option>
                        <option value="'Outfit', sans-serif">Outfit</option>
                    </select>
                </div>
                {(block.type === 'icons_grid' || block.type === 'links' || block.type === 'faq') && (
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><LayoutGrid className="size-3"/> Grid</Label>
                        <select value={block.grid_columns || ''} onChange={(e) => handleUpdate({ grid_columns: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1">
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
                            <select value={block.media_width || ''} onChange={(e) => handleUpdate({ media_width: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1">
                                <option value="">Default/Full</option>
                                <option value="max-w-md">Small</option>
                                <option value="max-w-xl">Medium</option>
                                <option value="max-w-4xl">Large</option>
                                <option value="max-w-full">Full Width</option>
                            </select>
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Sliders className="size-3"/> Media Height</Label>
                            <select value={block.media_height || ''} onChange={(e) => handleUpdate({ media_height: e.target.value })} className="h-7 rounded border border-neutral-200 bg-white text-[10px] px-1">
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
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Background Color/Gradient</Label>
                        <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-8" placeholder="e.from-amber-100 to-white" />
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
                            <Label className="text-[10px] text-neutral-500 uppercase font-bold">Bg Class</Label>
                            <Input value={block.bg_color || ''} onChange={(e) => handleUpdate({ bg_color: e.target.value })} className="h-8" />
                        </div>
                    </div>
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
                    <div className="grid gap-1">
                        <Label className="text-[10px] text-neutral-500 uppercase font-bold">Form Type</Label>
                        <select value={block.form_type || 'rsvp'} onChange={(e) => handleUpdate({ form_type: e.target.value })} className="h-8 rounded-md border border-neutral-200 bg-transparent text-xs px-2 dark:border-neutral-800 dark:bg-neutral-900">
                            <option value="rsvp">RSVP Form</option>
                            <option value="contact">Contact Form</option>
                        </select>
                    </div>
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
        </div>
    );
}
