import { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { 
    Plus, Pencil, Trash, Layers, Sparkles, Heart, 
    Cake, Baby, Award, Move, Type, Image as ImageIcon, 
    Smile, Link, MapPin, Compass
} from 'lucide-react';
import { normalizeConfig, ElementConfig, PageConfig, InvitationConfig, ASPECT_RATIOS } from '@/utils/builder-utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/super-admin/dashboard',
    },
    {
        title: 'Manage Templates',
        href: '/super-admin/templates',
    },
];

interface Template {
    id: number;
    name: string;
    category: string;
    price: string | number;
    bg_gradient: string;
    default_config: any;
}

interface PageProps {
    templates: Template[];
}

const fontStyles: Record<string, string> = {
    playfair: "'Playfair Display', serif",
    vibes: "'Great Vibes', cursive",
    montserrat: "'Montserrat', sans-serif",
    cinzel: "'Cinzel', serif",
};

const gradientPresets = [
    { name: 'Romantic Blush', value: 'from-stone-100 to-rose-50 text-neutral-800' },
    { name: 'Neon Dreams', value: 'from-zinc-950 to-neutral-900 text-purple-400' },
    { name: 'Summer Splash', value: 'from-cyan-100 to-teal-50 text-cyan-800' },
    { name: 'Sunset Glow', value: 'from-amber-50 to-orange-100 text-amber-900' },
    { name: 'Classic Gold', value: 'from-amber-100 via-yellow-50 to-amber-200 text-neutral-800' },
];

export default function TemplatesIndex({ templates }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [activeTab, setActiveTab] = useState<'pages' | 'text' | 'image' | 'icon' | 'link'>('pages');

    const cardRef = useRef<HTMLDivElement>(null);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [activeMobileView, setActiveMobileView] = useState<'editor' | 'preview'>('editor');

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        category: 'wedding',
        price: '9.99',
        bg_gradient: 'from-stone-100 to-rose-50 text-neutral-800',
        default_config: normalizeConfig(null),
    });

    const activePage = data.default_config.pages[activePageIndex] || data.default_config.pages[0];
    const selectedElement = activePage?.elements.find(e => e.id === selectedElementId) || null;
    const ratioData = ASPECT_RATIOS[data.default_config.aspectRatio] || ASPECT_RATIOS.standard;

    const renderDecorIcon = (iconName: string, color: string = 'currentColor') => {
        const iconClasses = "size-full object-contain pointer-events-none";
        switch (iconName) {
            case 'heart':
                return <Heart className={iconClasses} style={{ color }} />;
            case 'balloon':
            case 'sparkle':
                return <Sparkles className={iconClasses} style={{ color }} />;
            case 'cake':
                return <Cake className={iconClasses} style={{ color }} />;
            case 'baby':
                return <Baby className={iconClasses} style={{ color }} />;
            case 'ring':
            default:
                return <Award className={iconClasses} style={{ color }} />;
        }
    };

    const handleOpenAdd = () => {
        setEditingTemplate(null);
        reset();
        setData({
            name: '',
            category: 'wedding',
            price: '9.99',
            bg_gradient: 'from-stone-100 to-rose-50 text-neutral-800',
            default_config: normalizeConfig(null),
        });
        setActivePageIndex(0);
        setSelectedElementId(null);
        setActiveTab('pages');
        setZoom(1);
        setActiveMobileView('editor');
        setIsOpen(true);
    };

    const handleOpenEdit = (template: Template) => {
        setEditingTemplate(template);
        const normConfig = normalizeConfig(template.default_config, template.bg_gradient);
        setData({
            name: template.name,
            category: template.category,
            price: String(template.price),
            bg_gradient: template.bg_gradient,
            default_config: normConfig,
        });
        setActivePageIndex(0);
        setSelectedElementId(null);
        setActiveTab('pages');
        setZoom(1);
        setActiveMobileView('editor');
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            put(`/super-admin/templates/${editingTemplate.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/super-admin/templates', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            router.delete(`/super-admin/templates/${id}`);
        }
    };

    // Canvas functions
    const handleRatioChange = (ratio: 'standard' | 'square' | 'landscape' | 'mobile') => {
        setData('default_config', {
            ...data.default_config,
            aspectRatio: ratio
        });
    };

    const handleAddPage = () => {
        const newPage: PageConfig = {
            id: `page-${Math.random().toString(36).substr(2, 9)}`,
            bg_gradient: data.bg_gradient || 'from-stone-100 to-rose-50 text-neutral-800',
            elements: []
        };
        setData('default_config', {
            ...data.default_config,
            pages: [...data.default_config.pages, newPage]
        });
        setActivePageIndex(data.default_config.pages.length);
        setSelectedElementId(null);
    };

    const handleDeletePage = (index: number) => {
        if (data.default_config.pages.length <= 1) return;
        const filtered = data.default_config.pages.filter((_, i) => i !== index);
        setData('default_config', {
            ...data.default_config,
            pages: filtered
        });
        setActivePageIndex(Math.max(0, index - 1));
        setSelectedElementId(null);
    };

    const handlePageBgChange = (gradient: string) => {
        const updated = [...data.default_config.pages];
        updated[activePageIndex] = {
            ...updated[activePageIndex],
            bg_gradient: gradient
        };
        setData('default_config', {
            ...data.default_config,
            pages: updated
        });
    };

    const handleAddElement = (type: 'text' | 'image' | 'icon' | 'divider' | 'link') => {
        const newElement: ElementConfig = {
            id: `elem-${Math.random().toString(36).substr(2, 9)}`,
            type,
            x: 25,
            y: 35,
            w: 50,
            h: 12,
            content: type === 'text' ? 'Double Click to Edit Text' : type === 'link' ? 'Google Map Location' : undefined,
            url: type === 'image' ? '' : type === 'link' ? 'https://maps.google.com' : undefined,
            iconType: type === 'icon' ? 'heart' : undefined,
            fontSize: type === 'text' ? 14 : undefined,
            fontStyle: type === 'text' ? 'playfair' : undefined,
            textColor: type === 'text' || type === 'link' ? '#1f2937' : undefined,
            color: type === 'icon' || type === 'divider' ? '#1f2937' : undefined,
            textAlign: type === 'text' ? 'center' : undefined,
            fontWeight: 'normal',
            isItalic: false
        };

        const updatedPages = [...data.default_config.pages];
        updatedPages[activePageIndex] = {
            ...activePage,
            elements: [...activePage.elements, newElement]
        };

        setData('default_config', {
            ...data.default_config,
            pages: updatedPages
        });
        setSelectedElementId(newElement.id);
    };

    const handleUpdateElement = (elementId: string, updates: Partial<ElementConfig>) => {
        setData(prev => {
            const updatedPages = [...prev.default_config.pages];
            updatedPages[activePageIndex] = {
                ...updatedPages[activePageIndex],
                elements: updatedPages[activePageIndex].elements.map(e => 
                    e.id === elementId ? { ...e, ...updates } : e
                )
            };
            return {
                ...prev,
                default_config: {
                    ...prev.default_config,
                    pages: updatedPages
                }
            };
        });
    };

    const handleDeleteElement = (elementId: string) => {
        const updatedPages = [...data.default_config.pages];
        updatedPages[activePageIndex] = {
            ...activePage,
            elements: activePage.elements.filter(e => e.id !== elementId)
        };
        setData('default_config', {
            ...data.default_config,
            pages: updatedPages
        });
        setSelectedElementId(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                handleUpdateElement(elementId, { url: 'uploading' });
                
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
                handleUpdateElement(elementId, { url: result.url });
            } catch (err) {
                console.error(err);
                alert('Failed to upload image. Please try again.');
                handleUpdateElement(elementId, { url: '' });
            }
        }
    };

    const handleCanvasMouseDown = (elementId: string, e: React.MouseEvent, resize: boolean = false) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedElementId(elementId);

        const cardRect = cardRef.current?.getBoundingClientRect();
        if (!cardRect) return;

        const elem = activePage.elements.find(el => el.id === elementId);
        if (!elem) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = elem.x;
        const startTop = elem.y;
        const startWidth = elem.w;
        const startHeight = elem.h;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = ((moveEvent.clientX - startX) / cardRect.width) * 100;
            const deltaY = ((moveEvent.clientY - startY) / cardRect.height) * 100;

            if (resize) {
                handleUpdateElement(elementId, {
                    w: Math.max(5, Math.min(100 - startLeft, startWidth + deltaX)),
                    h: Math.max(2, Math.min(100 - startTop, startHeight + deltaY)),
                });
            } else {
                handleUpdateElement(elementId, {
                    x: Math.max(0, Math.min(100 - elem.w, startLeft + deltaX)),
                    y: Math.max(0, Math.min(100 - elem.h, startTop + deltaY)),
                });
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Manage Templates</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&display=swap" rel="stylesheet" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Invitation Templates</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Add, edit, or delete invitation card templates and set pricing.</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
                        <Plus className="size-4" /> Add Template
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-semibold uppercase text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">Category</th>
                                    <th scope="col" className="px-6 py-4">Price</th>
                                    <th scope="col" className="px-6 py-4">Gradient Preset</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {templates.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-neutral-400">
                                            No templates created yet. Click "Add Template" to start.
                                        </td>
                                    </tr>
                                ) : (
                                    templates.map((t) => (
                                        <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                                <Layers className="size-4 text-neutral-400" /> {t.name}
                                            </td>
                                            <td className="px-6 py-4 capitalize">{t.category}</td>
                                            <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                                                ₹{parseFloat(String(t.price)).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block w-24 h-6 rounded border border-neutral-300 dark:border-neutral-700 bg-gradient-to-tr ${t.bg_gradient.split(' ').slice(0, 2).join(' ')}`} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleOpenEdit(t)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800"
                                                    >
                                                        <Pencil className="size-3.5" /> Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(t.id)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Template editor builder inside full height dialog overlay */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="h-screen m-0 rounded-none bg-white dark:bg-neutral-900 border-none flex flex-col p-0 max-h-none">
                    <DialogHeader className="px-6 pt-6 pb-2 shrink-0 border-b">
                        <DialogTitle className="text-xl font-bold">
                            {editingTemplate ? 'Edit Invitation Template' : 'Add New Invitation Template'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        
                        {/* Meta controls row (Name, Category, Price, Base theme bg) */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 pb-3 border-b bg-neutral-50 dark:bg-neutral-950/20">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name">Template Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Autumn Wedding Invite"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors dark:border-neutral-800 dark:bg-neutral-950"
                                >
                                    <option value="wedding">Wedding</option>
                                    <option value="birthday">Birthday</option>
                                    <option value="party">Party</option>
                                    <option value="anniversary">Anniversary</option>
                                    <option value="baby_shower">Baby Shower</option>
                                </select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="bg_gradient">Base Background theme</Label>
                                <select
                                    id="bg_gradient"
                                    value={data.bg_gradient}
                                    onChange={(e) => {
                                        setData('bg_gradient', e.target.value);
                                        // Update first page background as well if single page
                                        if (data.default_config.pages.length === 1) {
                                            handlePageBgChange(e.target.value);
                                        }
                                    }}
                                    className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors dark:border-neutral-800 dark:bg-neutral-950"
                                >
                                    {gradientPresets.map((preset) => (
                                        <option key={preset.value} value={preset.value}>
                                            {preset.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Mobile view toggle */}
                        <div className="flex border-b lg:hidden bg-neutral-100 dark:bg-neutral-950 p-2 gap-2 shrink-0">
                            <button 
                                type="button" 
                                onClick={() => setActiveMobileView('editor')}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center transition-all ${
                                    activeMobileView === 'editor' 
                                        ? 'bg-blue-600 text-white shadow-xs' 
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50'
                                }`}
                            >
                                Editor Form
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setActiveMobileView('preview')}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center transition-all ${
                                    activeMobileView === 'preview' 
                                        ? 'bg-blue-600 text-white shadow-xs' 
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50'
                                }`}
                            >
                                Live Canvas
                            </button>
                        </div>

                        {/* Editor canvas workspace split panel */}
                        <div className="flex-1 grid lg:grid-cols-[1.2fr_1fr] overflow-hidden">
                            
                            {/* Left panel tabs settings */}
                            <div className={`flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden h-full ${activeMobileView === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
                                {/* Tab select */}
                                <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/20">
                                    {[
                                        { id: 'pages', label: 'Pages & Sizing' },
                                        { id: 'text', label: 'Text elements' },
                                        { id: 'image', label: 'Graphic Image' },
                                        { id: 'icon', label: 'Icons' },
                                        { id: 'link', label: 'Location Pins' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex-1 py-3 text-xs font-semibold border-b-2 text-center transition-all ${
                                                activeTab === tab.id
                                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-white dark:bg-neutral-900'
                                                    : 'border-transparent text-neutral-500 hover:text-neutral-855'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab variables panel */}
                                <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6 min-h-0">
                                    {activeTab === 'pages' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <h3 className="font-bold text-sm text-neutral-850 dark:text-neutral-200">Dimensions</h3>
                                                <p className="text-xs text-neutral-400">Set default aspect ratio for card templates</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(Object.keys(ASPECT_RATIOS) as Array<keyof typeof ASPECT_RATIOS>).map((ratio) => (
                                                    <button
                                                        key={ratio}
                                                        type="button"
                                                        onClick={() => handleRatioChange(ratio)}
                                                        className={`py-2 px-3 text-xs border font-semibold rounded-lg text-center transition-all ${
                                                            data.default_config.aspectRatio === ratio
                                                                ? 'border-blue-600 bg-blue-50/20 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                                                : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                                        }`}
                                                    >
                                                        {ASPECT_RATIOS[ratio].label}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="border-t border-neutral-150 pt-4 dark:border-neutral-800 flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Card Pages</h3>
                                                    <Button 
                                                        type="button"
                                                        onClick={handleAddPage}
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1 py-1"
                                                    >
                                                        <Plus className="size-3.5" /> Add Page
                                                    </Button>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    {data.default_config.pages.map((p, idx) => (
                                                        <div 
                                                            key={p.id} 
                                                            onClick={() => { setActivePageIndex(idx); setSelectedElementId(null); }}
                                                            className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                                                                activePageIndex === idx
                                                                    ? 'border-blue-600 bg-blue-50/10 dark:border-blue-400'
                                                                    : 'border-neutral-200 hover:bg-neutral-55 dark:border-neutral-850'
                                                            }`}
                                                        >
                                                            <span className="text-xs font-semibold">Page {idx + 1}</span>
                                                            {data.default_config.pages.length > 1 && (
                                                                <button 
                                                                    type="button" 
                                                                    onClick={(e) => { e.stopPropagation(); handleDeletePage(idx); }}
                                                                    className="text-neutral-400 hover:text-red-500 p-1"
                                                                >
                                                                    <Trash className="size-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex flex-col gap-2 pt-2">
                                                    <Label className="text-xs font-semibold">Page {activePageIndex + 1} Background Style</Label>
                                                    <select
                                                        value={activePage?.bg_gradient || ''}
                                                        onChange={(e) => handlePageBgChange(e.target.value)}
                                                        className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors dark:border-neutral-800 dark:bg-neutral-950"
                                                    >
                                                        {gradientPresets.map((preset) => (
                                                            <option key={preset.value} value={preset.value}>
                                                                {preset.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'text' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Text Customization</Label>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleAddElement('text')}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1"
                                                >
                                                    <Plus className="size-3.5" /> Add Text Layer
                                                </Button>
                                            </div>

                                            {selectedElement && selectedElement.type === 'text' ? (
                                                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20 flex flex-col gap-4">
                                                    <div className="grid gap-1.5">
                                                        <Label htmlFor="content">Text Content</Label>
                                                        <textarea
                                                            id="content"
                                                            value={selectedElement.content || ''}
                                                            onChange={(e) => handleUpdateElement(selectedElement.id, { content: e.target.value })}
                                                            rows={3}
                                                            className="w-full rounded-md border border-neutral-200 px-3 py-1.5 text-xs shadow-xs dark:border-neutral-800 dark:bg-neutral-950"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="fontStyle" className="text-xs">Font Family</Label>
                                                            <select
                                                                id="fontStyle"
                                                                value={selectedElement.fontStyle || 'playfair'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { fontStyle: e.target.value })}
                                                                className="h-8 rounded-md border text-xs bg-transparent px-2"
                                                            >
                                                                <option value="playfair">Playfair Display</option>
                                                                <option value="vibes">Great Vibes</option>
                                                                <option value="montserrat">Montserrat</option>
                                                                <option value="cinzel">Cinzel</option>
                                                            </select>
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="fontSize" className="text-xs">Font Size (px)</Label>
                                                            <Input
                                                                id="fontSize"
                                                                type="number"
                                                                value={selectedElement.fontSize || 14}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 12 })}
                                                                className="h-8 text-xs"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="textColor" className="text-xs">Text Color</Label>
                                                            <div className="flex gap-1.5 items-center">
                                                                <Input
                                                                    type="color"
                                                                    value={selectedElement.textColor || '#1f2937'}
                                                                    onChange={(e) => handleUpdateElement(selectedElement.id, { textColor: e.target.value })}
                                                                    className="w-9 h-8 p-0 cursor-pointer rounded border"
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    value={selectedElement.textColor || '#1f2937'}
                                                                    onChange={(e) => handleUpdateElement(selectedElement.id, { textColor: e.target.value })}
                                                                    className="h-8 text-xs px-1"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="textAlign" className="text-xs">Alignment</Label>
                                                            <select
                                                                id="textAlign"
                                                                value={selectedElement.textAlign || 'center'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { textAlign: e.target.value as any })}
                                                                className="h-8 rounded-md border text-xs bg-transparent px-2"
                                                            >
                                                                <option value="left">Left</option>
                                                                <option value="center">Center</option>
                                                                <option value="right">Right</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4 pt-2">
                                                        <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedElement.fontWeight === 'bold'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { fontWeight: e.target.checked ? 'bold' : 'normal' })}
                                                            />
                                                            Bold
                                                        </label>
                                                        <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedElement.isItalic}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { isItalic: e.target.checked })}
                                                            />
                                                            Italic
                                                        </label>
                                                    </div>

                                                    <div className="border-t pt-3 mt-2 flex flex-col gap-2">
                                                        <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedElement.isEditable}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { isEditable: e.target.checked })}
                                                                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            User Personalized Field
                                                        </label>
                                                        {selectedElement.isEditable && (
                                                            <div className="grid gap-1">
                                                                <Label htmlFor="editableLabel" className="text-[10px] uppercase font-bold text-neutral-450">Field Label (e.g. Bride Name)</Label>
                                                                <Input
                                                                    id="editableLabel"
                                                                    type="text"
                                                                    value={selectedElement.editableLabel || ''}
                                                                    onChange={(e) => handleUpdateElement(selectedElement.id, { editableLabel: e.target.value })}
                                                                    placeholder="e.g. Event Title"
                                                                    className="h-8 text-xs bg-white"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Size Coordinates */}
                                                    <div className="grid grid-cols-4 gap-2 border-t pt-3 border-neutral-200 dark:border-neutral-800">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">X (%)</span>
                                                            <input type="number" value={selectedElement.x} onChange={(e) => handleUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Y (%)</span>
                                                            <input type="number" value={selectedElement.y} onChange={(e) => handleUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Width (%)</span>
                                                            <input type="number" value={selectedElement.w} onChange={(e) => handleUpdateElement(selectedElement.id, { w: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Height (%)</span>
                                                            <input type="number" value={selectedElement.h} onChange={(e) => handleUpdateElement(selectedElement.id, { h: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteElement(selectedElement.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 text-xs py-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete Text Field
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-400 text-center py-6">
                                                    Select a text layer on the card canvas or click "Add Text Layer" above to design.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'image' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Graphic Images</Label>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleAddElement('image')}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1"
                                                >
                                                    <Plus className="size-3.5" /> Add Image Box
                                                </Button>
                                            </div>

                                            {selectedElement && selectedElement.type === 'image' ? (
                                                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20 flex flex-col gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="imgUpload" className="text-xs font-semibold">Upload Image File</Label>
                                                        <Input
                                                            id="imgUpload"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(e, selectedElement.id)}
                                                            className="cursor-pointer bg-white file:text-xs"
                                                        />
                                                    </div>

                                                    <div className="grid gap-1">
                                                        <Label htmlFor="imgUrl" className="text-xs font-semibold">Or Paste Image URL</Label>
                                                        <Input
                                                            id="imgUrl"
                                                            type="url"
                                                            value={selectedElement.url || ''}
                                                            onChange={(e) => handleUpdateElement(selectedElement.id, { url: e.target.value })}
                                                            placeholder="https://example.com/photo.jpg"
                                                            className="h-8 text-xs bg-white"
                                                        />
                                                    </div>

                                                    <div className="border-t pt-3 mt-2 flex flex-col gap-2">
                                                        <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedElement.isEditable}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { isEditable: e.target.checked })}
                                                                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            Allow user to upload/replace photo
                                                        </label>
                                                        {selectedElement.isEditable && (
                                                            <div className="grid gap-1">
                                                                <Label htmlFor="image_editableLabel" className="text-[10px] uppercase font-bold text-neutral-450">Uploader Label (e.g. Couple Photo)</Label>
                                                                <Input
                                                                    id="image_editableLabel"
                                                                    type="text"
                                                                    value={selectedElement.editableLabel || ''}
                                                                    onChange={(e) => handleUpdateElement(selectedElement.id, { editableLabel: e.target.value })}
                                                                    placeholder="e.g. Couple Portrait"
                                                                    className="h-8 text-xs bg-white"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Size Coordinates */}
                                                    <div className="grid grid-cols-4 gap-2 border-t pt-3 border-neutral-200 dark:border-neutral-800">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">X (%)</span>
                                                            <input type="number" value={selectedElement.x} onChange={(e) => handleUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Y (%)</span>
                                                            <input type="number" value={selectedElement.y} onChange={(e) => handleUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Width (%)</span>
                                                            <input type="number" value={selectedElement.w} onChange={(e) => handleUpdateElement(selectedElement.id, { w: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Height (%)</span>
                                                            <input type="number" value={selectedElement.h} onChange={(e) => handleUpdateElement(selectedElement.id, { h: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteElement(selectedElement.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 text-xs py-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete Image Box
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-400 text-center py-6">
                                                    Select an image element on the card canvas or click "Add Image Box" to design.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'icon' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Icons, Dividers & Shapes</Label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleAddElement('icon')}
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1"
                                                    >
                                                        <Plus className="size-3" /> Icon
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleAddElement('divider')}
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1"
                                                    >
                                                        <Plus className="size-3" /> Line
                                                    </Button>
                                                </div>
                                            </div>

                                            {selectedElement && (selectedElement.type === 'icon' || selectedElement.type === 'divider') ? (
                                                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20 flex flex-col gap-4">
                                                    {selectedElement.type === 'icon' && (
                                                        <div className="grid gap-1.5">
                                                            <Label htmlFor="iconType" className="text-xs font-semibold">Select Icon Type</Label>
                                                            <select
                                                                id="iconType"
                                                                value={selectedElement.iconType || 'ring'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { iconType: e.target.value })}
                                                                className="h-8 rounded-md border text-xs bg-transparent px-2"
                                                            >
                                                                <option value="ring">Wedding Rings</option>
                                                                <option value="heart">Heart</option>
                                                                <option value="balloon">Balloons</option>
                                                                <option value="cake">Birthday Cake</option>
                                                                <option value="baby">Baby Carriage</option>
                                                                <option value="sparkle">Sparkles</option>
                                                            </select>
                                                        </div>
                                                    )}

                                                    <div className="grid gap-1.5">
                                                        <Label htmlFor="iconColor" className="text-xs font-semibold">Color</Label>
                                                        <div className="flex gap-1.5 items-center">
                                                            <Input
                                                                id="iconColor"
                                                                type="color"
                                                                value={selectedElement.color || '#1f2937'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { color: e.target.value })}
                                                                className="w-9 h-8 p-0 cursor-pointer rounded border"
                                                            />
                                                            <Input
                                                                type="text"
                                                                value={selectedElement.color || '#1f2937'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { color: e.target.value })}
                                                                className="h-8 text-xs px-1"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Size Coordinates */}
                                                    <div className="grid grid-cols-4 gap-2 border-t pt-3 border-neutral-200 dark:border-neutral-800">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">X (%)</span>
                                                            <input type="number" value={selectedElement.x} onChange={(e) => handleUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Y (%)</span>
                                                            <input type="number" value={selectedElement.y} onChange={(e) => handleUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Width (%)</span>
                                                            <input type="number" value={selectedElement.w} onChange={(e) => handleUpdateElement(selectedElement.id, { w: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Height (%)</span>
                                                            <input type="number" value={selectedElement.h} onChange={(e) => handleUpdateElement(selectedElement.id, { h: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteElement(selectedElement.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 text-xs py-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete Element
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-400 text-center py-6">
                                                    Select an icon or line on the card canvas or click "Icon"/"Line" to design.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'link' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Maps & Action Links</Label>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleAddElement('link')}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1"
                                                >
                                                    <Plus className="size-3.5" /> Add Location Link
                                                </Button>
                                            </div>

                                            {selectedElement && selectedElement.type === 'link' ? (
                                                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20 flex flex-col gap-4">
                                                    <div className="grid gap-1.5">
                                                        <Label htmlFor="linkLabel" className="text-xs">Button Text / Label</Label>
                                                        <Input
                                                            id="linkLabel"
                                                            type="text"
                                                            value={selectedElement.content || ''}
                                                            onChange={(e) => handleUpdateElement(selectedElement.id, { content: e.target.value })}
                                                            placeholder="View on Google Maps"
                                                            className="h-8 text-xs bg-white"
                                                        />
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <Label htmlFor="linkUrl" className="text-xs">Hyperlink / URL Target</Label>
                                                        <Input
                                                            id="linkUrl"
                                                            type="url"
                                                            value={selectedElement.url || ''}
                                                            onChange={(e) => handleUpdateElement(selectedElement.id, { url: e.target.value })}
                                                            placeholder="https://maps.google.com/..."
                                                            className="h-8 text-xs bg-white"
                                                        />
                                                    </div>

                                                    <div className="grid gap-1">
                                                        <Label htmlFor="linkColor" className="text-xs">Border & Text Color</Label>
                                                        <div className="flex gap-1.5 items-center">
                                                            <Input
                                                                id="linkColor"
                                                                type="color"
                                                                value={selectedElement.textColor || '#1f2937'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { textColor: e.target.value })}
                                                                className="w-9 h-8 p-0 cursor-pointer rounded border"
                                                            />
                                                            <Input
                                                                type="text"
                                                                value={selectedElement.textColor || '#1f2937'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { textColor: e.target.value })}
                                                                className="h-8 text-xs px-1"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Size Coordinates */}
                                                    <div className="grid grid-cols-4 gap-2 border-t pt-3 border-neutral-200 dark:border-neutral-800">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">X (%)</span>
                                                            <input type="number" value={selectedElement.x} onChange={(e) => handleUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Y (%)</span>
                                                            <input type="number" value={selectedElement.y} onChange={(e) => handleUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Width (%)</span>
                                                            <input type="number" value={selectedElement.w} onChange={(e) => handleUpdateElement(selectedElement.id, { w: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Height (%)</span>
                                                            <input type="number" value={selectedElement.h} onChange={(e) => handleUpdateElement(selectedElement.id, { h: parseInt(e.target.value) || 0 })} className="w-full h-7 border rounded text-xs text-center" />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteElement(selectedElement.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 text-xs py-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete Action Link
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-400 text-center py-6">
                                                    Select a link element on the card canvas or click "Add Location Link" to design.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right preview canvas */}
                            <div className={`flex flex-col items-center justify-start py-8 p-6 bg-neutral-50/50 dark:bg-neutral-950/20 overflow-y-auto overflow-x-auto h-full ${activeMobileView === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
                                
                                {/* Canvas actions toolbar */}
                                <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 justify-between w-full max-w-[270px] shrink-0">
                                    {/* Page selectors */}
                                    <div className="flex items-center gap-1.5">
                                        {data.default_config.pages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => { setActivePageIndex(idx); setSelectedElementId(null); }}
                                                className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                                                    activePageIndex === idx
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800'
                                                }`}
                                            >
                                                P{idx + 1}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Zoom controls */}
                                    <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border rounded-lg px-2 py-0.5 shadow-xs text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                        <button 
                                            type="button" 
                                            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                                            className="px-1.5 py-0.5 hover:bg-neutral-100 rounded dark:hover:bg-neutral-800 transition-all font-bold"
                                            title="Zoom Out"
                                        >
                                            －
                                        </button>
                                        <span className="w-10 text-center font-mono text-[10px]">{Math.round(zoom * 100)}%</span>
                                        <button 
                                            type="button" 
                                            onClick={() => setZoom(prev => Math.min(2.0, prev + 0.1))}
                                            className="px-1.5 py-0.5 hover:bg-neutral-100 rounded dark:hover:bg-neutral-800 transition-all font-bold"
                                            title="Zoom In"
                                        >
                                            ＋
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setZoom(1)}
                                            className="px-1.5 py-0.5 hover:bg-neutral-100 rounded dark:hover:bg-neutral-800 transition-all text-[9px] text-blue-600 dark:text-blue-400 font-bold"
                                            title="Reset"
                                        >
                                            100%
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full max-w-[270px] flex flex-col gap-3 relative" style={{ minHeight: `${380 * zoom}px` }}>
                                    {/* Actual canvas */}
                                    <div
                                        ref={cardRef}
                                        onClick={() => setSelectedElementId(null)}
                                        className={`w-full ${ratioData.class} rounded-3xl shadow-xl overflow-hidden bg-gradient-to-tr ${activePage?.bg_gradient} border border-neutral-300 dark:border-neutral-850 relative select-none cursor-default transition-transform duration-200 ease-out`}
                                        style={{
                                            transform: `scale(${zoom})`,
                                            transformOrigin: 'top center',
                                        }}
                                    >
                                        {activePage?.elements.map((elem) => {
                                            const isSelected = selectedElementId === elem.id;
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
                                                fontSize: elem.fontSize ? `${elem.fontSize * 0.95}px` : undefined,
                                                fontWeight: elem.fontWeight || 'normal',
                                                fontStyle: elem.isItalic ? 'italic' : 'normal',
                                            };

                                            return (
                                                <div
                                                    key={elem.id}
                                                    style={style}
                                                    onMouseDown={(e) => handleCanvasMouseDown(elem.id, e, false)}
                                                    className={`transition-all duration-75 relative group border p-0.5 leading-tight select-none break-words overflow-hidden ${
                                                        isSelected 
                                                            ? 'border-blue-500 bg-blue-500/10 shadow-xs z-30' 
                                                            : 'border-transparent hover:border-dashed hover:border-neutral-400 hover:z-20 cursor-move'
                                                    }`}
                                                >
                                                    {elem.type === 'text' && (
                                                        <span className="w-full pointer-events-none">{elem.content}</span>
                                                    )}

                                                    {elem.type === 'image' && (
                                                        <div className="w-full h-full rounded-md overflow-hidden bg-neutral-200/50 pointer-events-none">
                                                            {elem.url ? (
                                                                elem.url === 'uploading' ? (
                                                                    <span className="text-[10px] text-blue-500 flex items-center justify-center h-full animate-pulse">Uploading...</span>
                                                                ) : (
                                                                    <img src={elem.url} alt="Uploaded Layer" className="w-full h-full object-cover" />
                                                                )
                                                            ) : (
                                                                <span className="text-[10px] text-neutral-400 flex items-center justify-center h-full">Click to upload photo</span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {elem.type === 'icon' && (
                                                        <span className="w-full h-full pointer-events-none flex items-center justify-center p-0.5">
                                                            {renderDecorIcon(elem.iconType || 'ring', elem.color || elem.textColor)}
                                                        </span>
                                                    )}

                                                    {elem.type === 'divider' && (
                                                        <div className="w-full h-full pointer-events-none flex items-center justify-center px-1">
                                                            <hr className="w-full border-t" style={{ borderColor: elem.color || '#1f2937' }} />
                                                        </div>
                                                    )}

                                                    {elem.type === 'link' && (
                                                        <button 
                                                            type="button" 
                                                            className="px-3 py-1 bg-neutral-900/10 border pointer-events-none rounded-full text-[9px] font-bold flex items-center gap-1 shrink-0"
                                                            style={{ borderColor: elem.textColor || '#1f2937', color: elem.textColor || '#1f2937' }}
                                                        >
                                                            <MapPin className="size-3" />
                                                            <span className="truncate max-w-[80px]">{elem.content || 'Map Location'}</span>
                                                        </button>
                                                    )}

                                                    {isSelected && (
                                                        <>
                                                            <div className="absolute top-0.5 left-0.5 bg-blue-600 rounded-full text-white p-0.5 shadow-xs z-40 pointer-events-none opacity-80">
                                                                <Move className="size-2.5" />
                                                            </div>
                                                            <div
                                                                onMouseDown={(e) => handleCanvasMouseDown(elem.id, e, true)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="absolute bottom-0 right-0 size-3 bg-blue-600 cursor-se-resize flex items-center justify-center text-[7px] text-white font-bold leading-none select-none rounded-tl-xs z-45"
                                                            >
                                                                ⇲
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <span className="text-[9px] text-center text-neutral-400">
                                        💡 Click canvas elements to move, scale, or configure properties.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Save Actions Dialog Footer */}
                        <DialogFooter className="px-6 py-4 border-t gap-2 bg-neutral-50 dark:bg-neutral-950/20">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                                {editingTemplate ? 'Update Template' : 'Create Template'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
