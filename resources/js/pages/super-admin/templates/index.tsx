import { useState, useRef, useEffect } from 'react';
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
    Smile, Link, MapPin, Compass, Gift, Calendar, Clock,
    Music, Wine, Star, Bell, ZoomIn, ZoomOut, Check, ArrowRight,
    Laptop, Tablet, Smartphone, Settings, PlayCircle, Play
} from 'lucide-react';
import { normalizeConfig, ElementConfig, PageConfig, InvitationConfig, ASPECT_RATIOS } from '@/utils/builder-utils';
import VideoTemplateBuilder from '@/components/VideoTemplateBuilder';

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
    type: 'image' | 'video';
    price: string | number;
    bg_gradient: string;
    default_config: any;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PageProps {
    templates: Template[];
    categories: Category[];
}

const fontStyles: Record<string, string> = {
    playfair: "'Playfair Display', serif",
    vibes: "'Great Vibes', cursive",
    montserrat: "'Montserrat', sans-serif",
    cinzel: "'Cinzel', serif",
    dancing: "'Dancing Script', cursive",
    alex: "'Alex Brush', cursive",
    outfit: "'Outfit', sans-serif",
    parisienne: "'Parisienne', cursive",
    cormorant: "'Cormorant Garamond', serif",
    pinyon: "'Pinyon Script', cursive",
};

const fontLabels: Record<string, string> = {
    playfair: "Playfair Display (Serif)",
    vibes: "Great Vibes (Calligraphy)",
    montserrat: "Montserrat (Modern)",
    cinzel: "Cinzel (Classic)",
    dancing: "Dancing Script (Cursive)",
    alex: "Alex Brush (Elegant Calligraphy)",
    outfit: "Outfit (Geometric Sans)",
    parisienne: "Parisienne (Romantic Cursive)",
    cormorant: "Cormorant Garamond (Fine Serif)",
    pinyon: "Pinyon Script (Traditional Script)",
};

const gradientPresets = [
    { name: 'Romantic Blush', value: 'from-stone-100 to-rose-50 text-neutral-800' },
    { name: 'Neon Dreams', value: 'from-zinc-950 to-neutral-900 text-purple-400' },
    { name: 'Summer Splash', value: 'from-cyan-100 to-teal-50 text-cyan-800' },
    { name: 'Sunset Glow', value: 'from-amber-50 to-orange-100 text-amber-900' },
    { name: 'Classic Gold', value: 'from-amber-100 via-yellow-50 to-amber-200 text-neutral-800' },
];

export default function TemplatesIndex({ templates, categories = [] }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [templateMode, setTemplateMode] = useState<'select' | 'editor'>('select');
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [activeTab, setActiveTab] = useState<'pages' | 'text' | 'image' | 'icon' | 'link'>('pages');

    const cardRef = useRef<HTMLDivElement>(null);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [activeMobileView, setActiveMobileView] = useState<'editor' | 'preview'>('editor');

    // Viewport size simulator
    const [previewViewport, setPreviewViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
    const [cardWidth, setCardWidth] = useState(350);

    // Custom background gradient state
    const [customGradStart, setCustomGradStart] = useState('#fff5f5');
    const [customGradEnd, setCustomGradEnd] = useState('#fed7e2');
    const [customGradAngle, setCustomGradAngle] = useState(135);
    const [bgType, setBgType] = useState<'preset' | 'custom'>('preset');

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        type: 'image' as 'image' | 'video',
        category: categories[0]?.slug || 'wedding',
        price: '9.99',
        bg_gradient: 'from-stone-100 to-rose-50 text-neutral-800',
        default_config: normalizeConfig(null),
    });

    const activePage = data.default_config.pages[activePageIndex] || data.default_config.pages[0];
    const selectedElement = activePage?.elements.find(e => e.id === selectedElementId) || null;
    const ratioData = ASPECT_RATIOS[data.default_config.aspectRatio] || ASPECT_RATIOS.standard;

    // Monitor card scale factor dynamically
    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                setCardWidth(entries[0].contentRect.width);
            }
        });
        observer.observe(cardRef.current);

        // Immediate calculation
        setCardWidth(cardRef.current.clientWidth);

        return () => observer.disconnect();
    }, [isOpen, activePageIndex, previewViewport, data.default_config.aspectRatio, data.default_config.width]);

    // Target width for scaling calculation
    const targetWidth = data.default_config.aspectRatio === 'custom'
        ? (data.default_config.width || 350)
        : (ratioData.targetWidth || 350);

    const scaleRatio = cardWidth / targetWidth;

    const renderDecorIcon = (iconName: string, color: string = 'currentColor') => {
        const iconClasses = "size-full object-contain pointer-events-none";
        switch (iconName) {
            case 'heart':
                return <Heart className={iconClasses} style={{ color }} />;
            case 'sparkle':
            case 'sparkles':
                return <Sparkles className={iconClasses} style={{ color }} />;
            case 'cake':
                return <Cake className={iconClasses} style={{ color }} />;
            case 'baby':
                return <Baby className={iconClasses} style={{ color }} />;
            case 'gift':
                return <Gift className={iconClasses} style={{ color }} />;
            case 'calendar':
                return <Calendar className={iconClasses} style={{ color }} />;
            case 'clock':
                return <Clock className={iconClasses} style={{ color }} />;
            case 'music':
                return <Music className={iconClasses} style={{ color }} />;
            case 'wine':
                return <Wine className={iconClasses} style={{ color }} />;
            case 'star':
                return <Star className={iconClasses} style={{ color }} />;
            case 'bell':
                return <Bell className={iconClasses} style={{ color }} />;
            case 'compass':
                return <Compass className={iconClasses} style={{ color }} />;
            case 'flower':
                return <Smile className={iconClasses} style={{ color }} />;
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
            type: 'image',
            category: categories[0]?.slug || 'wedding',
            price: '9.99',
            bg_gradient: 'from-stone-100 to-rose-50 text-neutral-800',
            default_config: normalizeConfig(null),
        });
        setBgType('preset');
        setActivePageIndex(0);
        setSelectedElementId(null);
        setActiveTab('pages');
        setZoom(1);
        setPreviewViewport('mobile');
        setActiveMobileView('editor');
        setTemplateMode('select');
        setIsOpen(true);
    };

    const handleOpenEdit = (template: Template) => {
        setEditingTemplate(template);
        const normConfig = template.type === 'video' 
            ? (template.default_config || { video_url: null, elements: [] }) 
            : normalizeConfig(template.default_config, template.bg_gradient);
        setData({
            name: template.name,
            type: template.type || 'image',
            category: template.category,
            price: String(template.price),
            bg_gradient: template.bg_gradient,
            default_config: normConfig,
        });

        // Detect custom gradient
        if (template.bg_gradient.startsWith('linear-gradient')) {
            setBgType('custom');
            // Extract colors if possible (fallback if match fails)
            const matches = template.bg_gradient.match(/#[a-fA-F0-9]{3,6}/g);
            if (matches && matches.length >= 2) {
                setCustomGradStart(matches[0]);
                setCustomGradEnd(matches[1]);
            }
        } else {
            setBgType('preset');
        }

        setActivePageIndex(0);
        setSelectedElementId(null);
        setActiveTab('pages');
        setZoom(1);
        setPreviewViewport('mobile');
        setActiveMobileView('editor');
        setTemplateMode('editor');
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

    // Canvas layout methods
    const handleRatioChange = (ratio: 'standard' | 'square' | 'landscape' | 'mobile' | 'custom') => {
        const target = ASPECT_RATIOS[ratio];
        setData('default_config', {
            ...data.default_config,
            aspectRatio: ratio,
            width: target.targetWidth,
            height: target.targetHeight,
        });
    };

    const handleCustomDimensionChange = (field: 'width' | 'height', val: number) => {
        setData('default_config', {
            ...data.default_config,
            [field]: Math.max(100, Math.min(2000, val)),
        });
    };

    const handleAddPage = () => {
        const newPage: PageConfig = {
            id: `page-${Math.random().toString(36).substr(2, 9)}`,
            bg_gradient: data.bg_gradient,
            borderStyle: 'none',
            borderColor: '#e4e4e7',
            borderWidth: 1,
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

    const applyCustomGradient = () => {
        const gradVal = `linear-gradient(${customGradAngle}deg, ${customGradStart}, ${customGradEnd})`;
        setData('bg_gradient', gradVal);
        handlePageBgChange(gradVal);
    };

    const handlePageBorderChange = (updates: Partial<Pick<PageConfig, 'borderStyle' | 'borderColor' | 'borderWidth'>>) => {
        const updated = [...data.default_config.pages];
        updated[activePageIndex] = {
            ...updated[activePageIndex],
            ...updates
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
            content: type === 'text' ? 'Design Text Layer' : type === 'link' ? 'Google Maps Button' : undefined,
            url: type === 'image' ? '' : type === 'link' ? 'https://maps.google.com' : undefined,
            iconType: type === 'icon' ? 'heart' : undefined,
            fontSize: type === 'text' ? 14 : undefined,
            fontStyle: type === 'text' ? 'playfair' : undefined,
            textColor: type === 'text' || type === 'link' ? '#1f2937' : undefined,
            color: type === 'icon' || type === 'divider' ? '#1f2937' : undefined,
            textAlign: type === 'text' ? 'center' : undefined,
            fontWeight: 'normal',
            isItalic: false,
            isEditable: true,
            editableLabel: type === 'text' ? 'Edit Text' : type === 'image' ? 'Upload Image' : undefined,
            multiline: false
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
                alert('Failed to upload image. Please check format (PNG, JPG, JPEG, SVG) and try again.');
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

    // Viewport styles configuration
    const getViewportWrapperClass = () => {
        switch (previewViewport) {
            case 'mobile':
                return 'max-w-[320px]';
            case 'tablet':
                return 'max-w-[480px]';
            case 'desktop':
            default:
                return 'max-w-[640px]';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Templates">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&family=Dancing+Script:wght@400..700&family=Alex+Brush&family=Outfit:wght@100..900&family=Parisienne&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&display=swap" rel="stylesheet" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between gap-4 border-b pb-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">Invitation Templates</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Add, edit, or delete invitation layouts and set reseller pricing tiers.</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-indigo-650 hover:bg-indigo-700 text-white flex items-center gap-1.5 rounded-xl">
                        <Plus className="size-4.5" /> Add Design Template
                    </Button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className=" text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-850/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">Category</th>
                                    <th scope="col" className="px-6 py-4">Standard Price</th>
                                    <th scope="col" className="px-6 py-4">Background Styling</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {templates.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-400">
                                            No templates created yet. Click "Add Design Template" to launch the builder.
                                        </td>
                                    </tr>
                                ) : (
                                    templates.map((t) => {
                                        const isCustomBg = t.bg_gradient.startsWith('linear-gradient');
                                        return (
                                            <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/15 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                                    <Layers className="size-4.5 text-neutral-400" /> {t.name}
                                                </td>
                                                <td className="px-6 py-4 capitalize">{t.category.replace('_', ' ')}</td>
                                                <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-450">
                                                    ₹{parseFloat(String(t.price)).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {t.type === 'video' ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-8 bg-neutral-900 rounded border border-neutral-700 flex items-center justify-center">
                                                                <Play className="size-3 text-indigo-400" />
                                                            </div>
                                                            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Video</span>
                                                        </div>
                                                    ) : isCustomBg ? (
                                                        <span
                                                            className="inline-block w-24 h-6 rounded border border-neutral-300 dark:border-neutral-700"
                                                            style={{ background: t.bg_gradient }}
                                                        />
                                                    ) : (
                                                        <span className={`inline-block w-24 h-6 rounded border border-neutral-300 dark:border-neutral-700 bg-gradient-to-tr ${t.bg_gradient.split(' ').slice(0, 2).join(' ')}`} />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            onClick={() => handleOpenEdit(t)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                                                        >
                                                            <Pencil className="size-3.5" /> Edit Builder
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(t.id)}
                                                            variant="destructive"
                                                            size="sm"
                                                            className="flex items-center gap-1 rounded-lg text-xs"
                                                        >
                                                            <Trash className="size-3.5" /> Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Template editor builder inside full screen dialog overlay */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="h-screen w-screen max-w-none m-0 rounded-none bg-white dark:bg-neutral-900 border-none flex flex-col p-0 max-h-none overflow-hidden select-none">
                    
                    {templateMode === 'select' ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6 relative">
                            <Button 
                                onClick={() => setIsOpen(false)} 
                                variant="ghost" 
                                className="absolute top-6 right-6 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                            >
                                Cancel
                            </Button>
                            
                            <h2 className="text-3xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">Create New Template</h2>
                            <p className="text-neutral-500 mb-12 text-center max-w-lg">Choose the format of your invitation template. This will determine the editor tools available to you.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                                <button 
                                    onClick={() => { setData('type', 'image'); setTemplateMode('editor'); }}
                                    className="group flex flex-col items-center p-10 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-[2rem] hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="size-24 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <ImageIcon className="size-12" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Image Template</h3>
                                    <p className="text-neutral-500 text-center text-sm leading-relaxed">
                                        Create a static digital invitation with drag-and-drop text fields, custom fonts, and static background images.
                                    </p>
                                </button>
                                
                                <button 
                                    onClick={() => { setData('type', 'video'); setTemplateMode('editor'); }}
                                    className="group flex flex-col items-center p-10 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-[2rem] hover:border-rose-500 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="size-24 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <PlayCircle className="size-12" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Video Template</h3>
                                    <p className="text-neutral-500 text-center text-sm leading-relaxed">
                                        Create an animated video invitation with a timeline, text animations, and background video sequences.
                                    </p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <DialogHeader className="px-6 pt-5 pb-3 shrink-0 border-b flex flex-row items-center justify-between bg-white dark:bg-neutral-900">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                    <Sparkles className="size-5.5 text-indigo-600 animate-pulse" />
                                    {editingTemplate ? `Edit Template: ${data.name}` : `Invitify ${data.type === 'video' ? 'Video' : 'Image'} Template Creator`}
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">

                        {/* Meta controls panel row */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 pb-3 border-b bg-neutral-50 dark:bg-neutral-950/20 shrink-0">
                            <div className="grid gap-1">
                                <Label htmlFor="name" className="text-xs font-semibold">Template Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Autumn Wedding Invite"
                                    required
                                    className="h-8.5 rounded-lg text-xs"
                                />
                                {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="type" className="text-xs font-semibold flex items-center gap-1 text-indigo-600">Template Type <Sparkles className="size-3" /></Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as 'image' | 'video')}
                                    className="flex h-8.5 w-full rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-xs font-semibold shadow-2xs transition-colors dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-300 focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="image">Image Template (Static)</option>
                                    <option value="video">Video Template (Animated)</option>
                                </select>
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="category" className="text-xs font-semibold">Category</Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="flex h-8.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-xs shadow-2xs transition-colors dark:border-neutral-800 dark:bg-neutral-950 focus:ring-1 focus:ring-indigo-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="price" className="text-xs font-semibold">Standard Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                    className="h-8.5 rounded-lg text-xs"
                                />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="bg_gradient_type" className="text-xs font-semibold">Background Mode</Label>
                                <div className="flex gap-2">
                                    <select
                                        id="bg_gradient_type"
                                        value={bgType}
                                        onChange={(e) => {
                                            const type = e.target.value as 'preset' | 'custom';
                                            setBgType(type);
                                            if (type === 'preset') {
                                                setData('bg_gradient', gradientPresets[0].value);
                                                handlePageBgChange(gradientPresets[0].value);
                                            } else {
                                                applyCustomGradient();
                                            }
                                        }}
                                        className="flex h-8.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-xs shadow-2xs transition-colors dark:border-neutral-800 dark:bg-neutral-950 focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="preset">Presets</option>
                                        <option value="custom">Custom Gradients</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Workspace logic based on type */}
                        {data.type === 'video' ? (
                            <VideoTemplateBuilder data={data} setData={setData} />
                        ) : (
                            /* Split panel workspace for Image Templates */
                            <div className="flex-1 grid lg:grid-cols-[1fr_1.1fr] overflow-hidden min-h-0">

                            {/* Left Panel: Controls Form */}
                            <div className="flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden h-full">
                                {/* Tab Selectors */}
                                <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 shrink-0">
                                    {[
                                        { id: 'pages', label: 'Pages & Borders' },
                                        { id: 'text', label: 'Text layers' },
                                        { id: 'image', label: 'Images' },
                                        { id: 'icon', label: 'Icons & Shapes' },
                                        { id: 'link', label: 'Location Pins' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex-1 py-3 text-[11px] font-bold border-b-2 text-center transition-all ${activeTab === tab.id
                                                ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400 bg-white dark:bg-neutral-900'
                                                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Controls configuration options container */}
                                <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5 min-h-0">
                                    {activeTab === 'pages' && (
                                        <div className="flex flex-col gap-5">
                                            {/* Ratios & Dimensions */}
                                            <div className="flex flex-col gap-2.5">
                                                <h3 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Page Sizing Dimensions</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {(Object.keys(ASPECT_RATIOS) as Array<keyof typeof ASPECT_RATIOS>).map((ratio) => (
                                                        <button
                                                            key={ratio}
                                                            type="button"
                                                            onClick={() => handleRatioChange(ratio)}
                                                            className={`py-1.5 px-3 text-xs border font-bold rounded-lg text-center transition-all ${data.default_config.aspectRatio === ratio
                                                                ? 'border-indigo-650 bg-indigo-50/25 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400 dark:bg-indigo-950/20'
                                                                : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                                                }`}
                                                        >
                                                            {ASPECT_RATIOS[ratio].label}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Custom Size inputs */}
                                                {data.default_config.aspectRatio === 'custom' && (
                                                    <div className="grid grid-cols-2 gap-3 mt-2 bg-neutral-50 dark:bg-neutral-950/40 p-3 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="custWidth" className="text-[10px] uppercase font-bold text-neutral-450">Custom Width (px)</Label>
                                                            <Input
                                                                id="custWidth"
                                                                type="number"
                                                                value={data.default_config.width || 350}
                                                                onChange={(e) => handleCustomDimensionChange('width', parseInt(e.target.value) || 350)}
                                                                className="h-8 text-xs bg-white"
                                                            />
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="custHeight" className="text-[10px] uppercase font-bold text-neutral-450">Custom Height (px)</Label>
                                                            <Input
                                                                id="custHeight"
                                                                type="number"
                                                                value={data.default_config.height || 490}
                                                                onChange={(e) => handleCustomDimensionChange('height', parseInt(e.target.value) || 490)}
                                                                className="h-8 text-xs bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Custom Background selector */}
                                            {bgType === 'custom' && (
                                                <div className="flex flex-col gap-2.5 border-t pt-4 border-neutral-100 dark:border-neutral-800">
                                                    <h3 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Custom Gradient Colors</h3>
                                                    <div className="grid grid-cols-3 gap-2 items-center bg-neutral-50 dark:bg-neutral-950/25 p-3 rounded-xl border border-neutral-150 dark:border-neutral-850">
                                                        <div className="flex flex-col gap-1 text-center">
                                                            <span className="text-[9px] uppercase font-bold text-neutral-400">Start Color</span>
                                                            <input
                                                                type="color"
                                                                value={customGradStart}
                                                                onChange={(e) => { setCustomGradStart(e.target.value); }}
                                                                onBlur={applyCustomGradient}
                                                                className="w-full h-8 cursor-pointer rounded border"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1 text-center">
                                                            <span className="text-[9px] uppercase font-bold text-neutral-400">End Color</span>
                                                            <input
                                                                type="color"
                                                                value={customGradEnd}
                                                                onChange={(e) => { setCustomGradEnd(e.target.value); }}
                                                                onBlur={applyCustomGradient}
                                                                className="w-full h-8 cursor-pointer rounded border"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1 text-center">
                                                            <span className="text-[9px] uppercase font-bold text-neutral-400">Angle (Deg)</span>
                                                            <Input
                                                                type="number"
                                                                value={customGradAngle}
                                                                onChange={(e) => { setCustomGradAngle(parseInt(e.target.value) || 0); }}
                                                                onBlur={applyCustomGradient}
                                                                className="h-8 text-xs text-center"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {bgType === 'preset' && (
                                                <div className="flex flex-col gap-2 border-t pt-4 border-neutral-100 dark:border-neutral-800">
                                                    <Label className="text-xs font-semibold">Select Background Preset</Label>
                                                    <select
                                                        value={activePage?.bg_gradient || ''}
                                                        onChange={(e) => handlePageBgChange(e.target.value)}
                                                        className="flex h-8.5 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-1 text-xs shadow-2xs focus:ring-1 focus:ring-indigo-500"
                                                    >
                                                        {gradientPresets.map((preset) => (
                                                            <option key={preset.value} value={preset.value}>
                                                                {preset.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {/* Border Customizer options */}
                                            <div className="flex flex-col gap-3.5 border-t pt-4 border-neutral-100 dark:border-neutral-800">
                                                <h3 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Decorative Border Styles</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="grid gap-1">
                                                        <Label className="text-[10px] uppercase font-bold text-neutral-450">Border Style</Label>
                                                        <select
                                                            value={activePage?.borderStyle || 'none'}
                                                            onChange={(e) => handlePageBorderChange({ borderStyle: e.target.value as any })}
                                                            className="flex h-8.5 w-full rounded-lg border border-neutral-200 bg-transparent px-2 text-xs focus:ring-1 focus:ring-indigo-500"
                                                        >
                                                            <option value="none">No Border</option>
                                                            <option value="solid">Solid Line</option>
                                                            <option value="dashed">Dashed Line</option>
                                                            <option value="dotted">Dotted Line</option>
                                                            <option value="double">Double Frame</option>
                                                            <option value="floral">Floral Corners</option>
                                                            <option value="classic">Classic Inset</option>
                                                        </select>
                                                    </div>

                                                    {activePage?.borderStyle && activePage.borderStyle !== 'none' && (
                                                        <div className="grid gap-1">
                                                            <Label className="text-[10px] uppercase font-bold text-neutral-450">Border Thickness</Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max="15"
                                                                value={activePage.borderWidth || 1}
                                                                onChange={(e) => handlePageBorderChange({ borderWidth: parseInt(e.target.value) || 1 })}
                                                                className="h-8.5 text-xs"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {activePage?.borderStyle && activePage.borderStyle !== 'none' && (
                                                    <div className="grid gap-1 bg-neutral-50 dark:bg-neutral-950/20 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                                        <Label className="text-[10px] uppercase font-bold text-neutral-450 mb-1">Border Color</Label>
                                                        <div className="flex gap-2 items-center">
                                                            <input
                                                                type="color"
                                                                value={activePage.borderColor || '#e4e4e7'}
                                                                onChange={(e) => handlePageBorderChange({ borderColor: e.target.value })}
                                                                className="w-10 h-8 p-0 cursor-pointer rounded border"
                                                            />
                                                            <Input
                                                                type="text"
                                                                value={activePage.borderColor || '#e4e4e7'}
                                                                onChange={(e) => handlePageBorderChange({ borderColor: e.target.value })}
                                                                className="h-8 text-xs uppercase"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Card Pages management list */}
                                            <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800 flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Card Pages</h3>
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddPage}
                                                        size="sm"
                                                        className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs flex items-center gap-1 py-1 rounded-lg"
                                                    >
                                                        <Plus className="size-3.5" /> Add New Page
                                                    </Button>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    {data.default_config.pages.map((p, idx) => (
                                                        <div
                                                            key={p.id}
                                                            onClick={() => { setActivePageIndex(idx); setSelectedElementId(null); }}
                                                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${activePageIndex === idx
                                                                ? 'border-indigo-650 bg-indigo-50/15 dark:border-indigo-400'
                                                                : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-850'
                                                                }`}
                                                        >
                                                            <span className="text-xs font-bold">Page {idx + 1}</span>
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
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'text' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center pb-2 border-b">
                                                <Label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Text Customization</Label>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleAddElement('text')}
                                                    size="sm"
                                                    className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5 rounded-lg"
                                                >
                                                    <Plus className="size-3.5" /> Add Text Layer
                                                </Button>
                                            </div>

                                            {selectedElement && selectedElement.type === 'text' ? (
                                                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20 flex flex-col gap-4">
                                                    <div className="grid gap-1.5">
                                                        <Label htmlFor="content" className="text-xs font-semibold">Text Content</Label>
                                                        <textarea
                                                            id="content"
                                                            value={selectedElement.content || ''}
                                                            onChange={(e) => handleUpdateElement(selectedElement.id, { content: e.target.value })}
                                                            rows={3}
                                                            className="w-full rounded-md border border-neutral-200 px-3 py-1.5 text-xs shadow-2xs dark:border-neutral-800 dark:bg-neutral-950 bg-white"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="fontStyle" className="text-[10px] uppercase font-bold text-neutral-450">Font Family</Label>
                                                            <select
                                                                id="fontStyle"
                                                                value={selectedElement.fontStyle || 'playfair'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { fontStyle: e.target.value })}
                                                                className="h-8 rounded-md border text-xs bg-white dark:bg-neutral-950 px-2"
                                                            >
                                                                {Object.keys(fontLabels).map((fKey) => (
                                                                    <option key={fKey} value={fKey}>{fontLabels[fKey]}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="fontSize" className="text-[10px] uppercase font-bold text-neutral-450">Font Size (px)</Label>
                                                            <Input
                                                                id="fontSize"
                                                                type="number"
                                                                value={selectedElement.fontSize || 14}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 12 })}
                                                                className="h-8 text-xs bg-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="grid gap-1 bg-white p-2 rounded border">
                                                            <Label htmlFor="textColor" className="text-[10px] uppercase font-bold text-neutral-455">Text Color</Label>
                                                            <div className="flex gap-1.5 items-center mt-1">
                                                                <input
                                                                    type="color"
                                                                    value={selectedElement.textColor || '#1f2937'}
                                                                    onChange={(e) => handleUpdateElement(selectedElement.id, { textColor: e.target.value })}
                                                                    className="w-8 h-8 p-0 cursor-pointer rounded border"
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    value={selectedElement.textColor || '#1f2937'}
                                                                    onChange={(e) => handleUpdateElement(selectedElement.id, { textColor: e.target.value })}
                                                                    className="h-7 text-[10px] px-1 font-mono uppercase"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="textAlign" className="text-[10px] uppercase font-bold text-neutral-450">Alignment</Label>
                                                            <select
                                                                id="textAlign"
                                                                value={selectedElement.textAlign || 'center'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { textAlign: e.target.value as any })}
                                                                className="h-8.5 rounded-md border text-xs bg-white dark:bg-neutral-950 px-2"
                                                            >
                                                                <option value="left">Left</option>
                                                                <option value="center">Center</option>
                                                                <option value="right">Right</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4 pt-2 border-t">
                                                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedElement.fontWeight === 'bold'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { fontWeight: e.target.checked ? 'bold' : 'normal' })}
                                                            />
                                                            Bold
                                                        </label>
                                                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedElement.isItalic}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { isItalic: e.target.checked })}
                                                            />
                                                            Italic
                                                        </label>
                                                    </div>

                                                    <div className="border-t pt-3 flex flex-col gap-2.5">
                                                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer text-indigo-650 dark:text-indigo-400">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedElement.isEditable}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { isEditable: e.target.checked })}
                                                                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 size-3.5"
                                                            />
                                                            User Customizable Field
                                                        </label>

                                                        {selectedElement.isEditable && (
                                                            <>
                                                                <div className="grid gap-1">
                                                                    <Label htmlFor="editableLabel" className="text-[9px] uppercase font-bold text-neutral-450">Editable Label Title</Label>
                                                                    <Input
                                                                        id="editableLabel"
                                                                        type="text"
                                                                        value={selectedElement.editableLabel || ''}
                                                                        onChange={(e) => handleUpdateElement(selectedElement.id, { editableLabel: e.target.value })}
                                                                        placeholder="Bride Name"
                                                                        className="h-8 text-xs bg-white"
                                                                    />
                                                                </div>
                                                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!selectedElement.multiline}
                                                                        onChange={(e) => handleUpdateElement(selectedElement.id, { multiline: e.target.checked })}
                                                                        className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    Enable multi-line paragraph block
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Coordinates Controller */}
                                                    <div className="grid grid-cols-4 gap-2 border-t pt-3 border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 p-2 rounded-lg">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">X (%)</span>
                                                            <input type="number" step="1" value={selectedElement.x} onChange={(e) => handleUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">Y (%)</span>
                                                            <input type="number" step="1" value={selectedElement.y} onChange={(e) => handleUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">W (%)</span>
                                                            <input type="number" step="1" value={selectedElement.w} onChange={(e) => handleUpdateElement(selectedElement.id, { w: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">H (%)</span>
                                                            <input type="number" step="1" value={selectedElement.h} onChange={(e) => handleUpdateElement(selectedElement.id, { h: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteElement(selectedElement.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 text-xs py-1 rounded-lg mt-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete Text Layer
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-450 text-center py-10 italic">
                                                    Select a text layer on the canvas layout or click "Add Text Layer" above.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'image' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center pb-2 border-b">
                                                <Label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Graphic Images</Label>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleAddElement('image')}
                                                    size="sm"
                                                    className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5 rounded-lg"
                                                >
                                                    <Plus className="size-3.5" /> Add Image Box
                                                </Button>
                                            </div>

                                            {selectedElement && selectedElement.type === 'image' ? (
                                                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20 flex flex-col gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="imgUpload" className="text-xs font-semibold">Upload Image File (PNG, JPG, SVG)</Label>
                                                        <Input
                                                            id="imgUpload"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(e, selectedElement.id)}
                                                            className="cursor-pointer bg-white file:text-xs rounded-lg text-xs"
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

                                                    <div className="border-t pt-3 mt-1 flex flex-col gap-2.5">
                                                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer text-indigo-650 dark:text-indigo-400">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedElement.isEditable}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { isEditable: e.target.checked })}
                                                                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 size-3.5"
                                                            />
                                                            Allow user to replace image/photo
                                                        </label>
                                                        {selectedElement.isEditable && (
                                                            <div className="grid gap-1">
                                                                <Label htmlFor="image_editableLabel" className="text-[9px] uppercase font-bold text-neutral-450">Editable Label Title</Label>
                                                                <Input
                                                                    id="image_editableLabel"
                                                                    type="text"
                                                                    value={selectedElement.editableLabel || ''}
                                                                    onChange={(e) => handleUpdateElement(selectedElement.id, { editableLabel: e.target.value })}
                                                                    placeholder="Couple portrait"
                                                                    className="h-8 text-xs bg-white"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Coordinates Controller */}
                                                    <div className="grid grid-cols-4 gap-2 border-t pt-3 border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 p-2 rounded-lg">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">X (%)</span>
                                                            <input type="number" value={selectedElement.x} onChange={(e) => handleUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">Y (%)</span>
                                                            <input type="number" value={selectedElement.y} onChange={(e) => handleUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">W (%)</span>
                                                            <input type="number" value={selectedElement.w} onChange={(e) => handleUpdateElement(selectedElement.id, { w: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">H (%)</span>
                                                            <input type="number" value={selectedElement.h} onChange={(e) => handleUpdateElement(selectedElement.id, { h: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteElement(selectedElement.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 text-xs py-1 rounded-lg mt-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete Image Box
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-450 text-center py-10 italic">
                                                    Select an image element on the canvas or click "Add Image Box" above.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'icon' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center pb-2 border-b">
                                                <Label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Icons, Dividers & Shapes</Label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleAddElement('icon')}
                                                        size="sm"
                                                        className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs flex items-center gap-1 rounded-lg py-1 px-3"
                                                    >
                                                        <Plus className="size-3.5" /> Add Icon
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleAddElement('divider')}
                                                        size="sm"
                                                        className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs flex items-center gap-1 rounded-lg py-1 px-3"
                                                    >
                                                        <Plus className="size-3.5" /> Add Line
                                                    </Button>
                                                </div>
                                            </div>

                                            {selectedElement && (selectedElement.type === 'icon' || selectedElement.type === 'divider') ? (
                                                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20 flex flex-col gap-4">
                                                    {selectedElement.type === 'icon' && (
                                                        <div className="grid gap-1.5">
                                                            <Label htmlFor="iconType" className="text-xs font-semibold">Select Icon Glyphs</Label>
                                                            <select
                                                                id="iconType"
                                                                value={selectedElement.iconType || 'ring'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { iconType: e.target.value })}
                                                                className="h-8.5 rounded-md border text-xs bg-white dark:bg-neutral-950 px-2"
                                                            >
                                                                <option value="ring">Wedding Rings (Award)</option>
                                                                <option value="heart">Heart Shape</option>
                                                                <option value="sparkles">Sparkles Glow</option>
                                                                <option value="cake">Birthday Cake</option>
                                                                <option value="baby">Baby Carriage</option>
                                                                <option value="gift">Gift Box</option>
                                                                <option value="calendar">Calendar Date</option>
                                                                <option value="clock">Clock Time</option>
                                                                <option value="music">Music Note</option>
                                                                <option value="wine">Wine Glasses Cheers</option>
                                                                <option value="star">Shining Star</option>
                                                                <option value="bell">Wedding Bell</option>
                                                                <option value="compass">Compass Navigation</option>
                                                                <option value="flower">Leaf Outline</option>
                                                            </select>
                                                        </div>
                                                    )}

                                                    <div className="grid gap-1 bg-white p-2 rounded border">
                                                        <Label htmlFor="iconColor" className="text-[10px] uppercase font-bold text-neutral-450">Element Color</Label>
                                                        <div className="flex gap-1.5 items-center mt-1">
                                                            <input
                                                                id="iconColor"
                                                                type="color"
                                                                value={selectedElement.color || '#1f2937'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { color: e.target.value })}
                                                                className="w-8 h-8 p-0 cursor-pointer rounded border"
                                                            />
                                                            <Input
                                                                type="text"
                                                                value={selectedElement.color || '#1f2937'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { color: e.target.value })}
                                                                className="h-7 text-[10px] px-1 font-mono uppercase"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Coordinates Controller */}
                                                    <div className="grid grid-cols-4 gap-2 border-t pt-3 border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 p-2 rounded-lg">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">X (%)</span>
                                                            <input type="number" value={selectedElement.x} onChange={(e) => handleUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">Y (%)</span>
                                                            <input type="number" value={selectedElement.y} onChange={(e) => handleUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">W (%)</span>
                                                            <input type="number" value={selectedElement.w} onChange={(e) => handleUpdateElement(selectedElement.id, { w: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">H (%)</span>
                                                            <input type="number" value={selectedElement.h} onChange={(e) => handleUpdateElement(selectedElement.id, { h: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteElement(selectedElement.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 text-xs py-1 rounded-lg mt-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete Element
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-450 text-center py-10 italic">
                                                    Select an icon or line on the canvas or click "Add Icon"/"Add Line" above.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'link' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center pb-2 border-b">
                                                <Label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Maps & Actions Buttons</Label>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleAddElement('link')}
                                                    size="sm"
                                                    className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5 rounded-lg"
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

                                                    <div className="grid gap-1 bg-white p-2 rounded border">
                                                        <Label htmlFor="linkColor" className="text-[10px] uppercase font-bold text-neutral-450">Button Color</Label>
                                                        <div className="flex gap-1.5 items-center mt-1">
                                                            <input
                                                                id="linkColor"
                                                                type="color"
                                                                value={selectedElement.textColor || '#1f2937'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { textColor: e.target.value })}
                                                                className="w-8 h-8 p-0 cursor-pointer rounded border"
                                                            />
                                                            <Input
                                                                type="text"
                                                                value={selectedElement.textColor || '#1f2937'}
                                                                onChange={(e) => handleUpdateElement(selectedElement.id, { textColor: e.target.value })}
                                                                className="h-7 text-[10px] px-1 font-mono uppercase"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Coordinates Controller */}
                                                    <div className="grid grid-cols-4 gap-2 border-t pt-3 border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 p-2 rounded-lg">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">X (%)</span>
                                                            <input type="number" value={selectedElement.x} onChange={(e) => handleUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">Y (%)</span>
                                                            <input type="number" value={selectedElement.y} onChange={(e) => handleUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">W (%)</span>
                                                            <input type="number" value={selectedElement.w} onChange={(e) => handleUpdateElement(selectedElement.id, { w: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] text-neutral-400 font-bold uppercase text-center">H (%)</span>
                                                            <input type="number" value={selectedElement.h} onChange={(e) => handleUpdateElement(selectedElement.id, { h: parseInt(e.target.value) || 0 })} className="w-full h-7 border bg-white rounded text-xs text-center font-bold" />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteElement(selectedElement.id)}
                                                        className="w-full flex items-center justify-center gap-1.5 text-xs py-1 rounded-lg mt-1"
                                                    >
                                                        <Trash className="size-3.5" /> Delete Action Link
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-450 text-center py-10 italic">
                                                    Select a link button on the canvas or click "Add Location Link" above.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel: Bounding Live Preview Canvas */}
                            <div className="flex flex-col items-center justify-start py-6 p-4 md:p-6 bg-neutral-100/50 dark:bg-neutral-950/20 overflow-y-auto overflow-x-auto h-full">

                                {/* Canvas actions toolbar */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-5 justify-between w-full max-w-lg shrink-0 bg-white dark:bg-neutral-900 p-3 rounded-2xl border">
                                    {/* Page navigation */}
                                    <div className="flex items-center gap-1">
                                        {data.default_config.pages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => { setActivePageIndex(idx); setSelectedElementId(null); }}
                                                className={`size-7 text-[10px] font-bold rounded-full border transition-all ${activePageIndex === idx
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-850 dark:text-neutral-400'
                                                    }`}
                                            >
                                                P{idx + 1}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Device Responsive selectors */}
                                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewViewport('mobile')}
                                            className={`p-1 rounded-md transition-all ${previewViewport === 'mobile' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-neutral-450 hover:text-neutral-800'}`}
                                            title="Mobile View"
                                        >
                                            <Smartphone className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewViewport('tablet')}
                                            className={`p-1 rounded-md transition-all ${previewViewport === 'tablet' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-neutral-450 hover:text-neutral-800'}`}
                                            title="Tablet View"
                                        >
                                            <Tablet className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewViewport('desktop')}
                                            className={`p-1 rounded-md transition-all ${previewViewport === 'desktop' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-neutral-450 hover:text-neutral-800'}`}
                                            title="Large Frame View"
                                        >
                                            <Laptop className="size-4" />
                                        </button>
                                    </div>

                                    {/* Zoom controls */}
                                    <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-950 border rounded-lg px-2 py-0.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                        <button
                                            type="button"
                                            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                                            className="px-1 py-0.5 hover:bg-neutral-100 rounded dark:hover:bg-neutral-850 text-sm font-bold"
                                        >
                                            －
                                        </button>
                                        <span className="w-8 text-center font-mono text-[9px]">{Math.round(zoom * 100)}%</span>
                                        <button
                                            type="button"
                                            onClick={() => setZoom(prev => Math.min(2.0, prev + 0.1))}
                                            className="px-1 py-0.5 hover:bg-neutral-100 rounded dark:hover:bg-neutral-850 text-sm font-bold"
                                        >
                                            ＋
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setZoom(1)}
                                            className="px-1.5 py-0.5 hover:bg-neutral-100 rounded dark:hover:bg-neutral-850 text-[9px] text-indigo-600"
                                        >
                                            Rst
                                        </button>
                                    </div>
                                </div>

                                {/* Bounding canvas with viewport widths simulator */}
                                <div className={`w-full ${getViewportWrapperClass()} flex flex-col gap-3 items-center justify-start transition-all duration-300`}>
                                    <div
                                        ref={cardRef}
                                        onClick={() => setSelectedElementId(null)}
                                        style={{
                                            aspectRatio: data.default_config.aspectRatio === 'custom'
                                                ? `${data.default_config.width || 350}/${data.default_config.height || 490}`
                                                : undefined,
                                            // Apply ratio data class inline if not custom size
                                            height: data.default_config.aspectRatio !== 'custom' ? undefined : 'auto',
                                            transform: `scale(${zoom})`,
                                            transformOrigin: 'top center',
                                            background: activePage?.bg_gradient?.startsWith('linear-gradient')
                                                ? activePage.bg_gradient
                                                : undefined,
                                        }}
                                        // Set tailwind background gradient classes if not custom
                                        className={`w-full ${data.default_config.aspectRatio !== 'custom' ? ratioData.class : ''} rounded-3xl shadow-xl border border-neutral-300 dark:border-neutral-850 relative select-none cursor-default overflow-hidden transition-all duration-200 ${!activePage?.bg_gradient?.startsWith('linear-gradient') ? `bg-gradient-to-tr ${activePage?.bg_gradient || 'from-stone-100 to-rose-50 text-neutral-800'}` : ''}`}
                                    >
                                        {/* Decorative Border Overlay */}
                                        {activePage?.borderStyle && activePage.borderStyle !== 'none' && (
                                            <div
                                                className="absolute pointer-events-none rounded-2xl"
                                                style={{
                                                    top: '12px',
                                                    left: '12px',
                                                    right: '12px',
                                                    bottom: '12px',
                                                    borderStyle: activePage.borderStyle === 'floral' || activePage.borderStyle === 'classic' ? 'double' : activePage.borderStyle,
                                                    borderColor: activePage.borderColor || '#e4e4e7',
                                                    borderWidth: `${Math.max(1, (activePage.borderWidth || 1) * scaleRatio)}px`,
                                                    zIndex: 10,
                                                }}
                                            >
                                                {(activePage.borderStyle === 'floral' || activePage.borderStyle === 'classic') && (
                                                    <>
                                                        <div
                                                            className="absolute size-5 border-t border-l"
                                                            style={{
                                                                top: '-1px',
                                                                left: '-1px',
                                                                borderColor: activePage.borderColor || '#d4af37',
                                                                borderTopWidth: `${2 * scaleRatio}px`,
                                                                borderLeftWidth: `${2 * scaleRatio}px`,
                                                                borderTopLeftRadius: '4px',
                                                            }}
                                                        />
                                                        <div
                                                            className="absolute size-5 border-t border-r"
                                                            style={{
                                                                top: '-1px',
                                                                right: '-1px',
                                                                borderColor: activePage.borderColor || '#d4af37',
                                                                borderTopWidth: `${2 * scaleRatio}px`,
                                                                borderRightWidth: `${2 * scaleRatio}px`,
                                                                borderTopRightRadius: '4px',
                                                            }}
                                                        />
                                                        <div
                                                            className="absolute size-5 border-b border-l"
                                                            style={{
                                                                bottom: '-1px',
                                                                left: '-1px',
                                                                borderColor: activePage.borderColor || '#d4af37',
                                                                borderBottomWidth: `${2 * scaleRatio}px`,
                                                                borderLeftWidth: `${2 * scaleRatio}px`,
                                                                borderBottomLeftRadius: '4px',
                                                            }}
                                                        />
                                                        <div
                                                            className="absolute size-5 border-b border-r"
                                                            style={{
                                                                bottom: '-1px',
                                                                right: '-1px',
                                                                borderColor: activePage.borderColor || '#d4af37',
                                                                borderBottomWidth: `${2 * scaleRatio}px`,
                                                                borderRightWidth: `${2 * scaleRatio}px`,
                                                                borderBottomRightRadius: '4px',
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Layer elements */}
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
                                                fontSize: elem.fontSize ? `${elem.fontSize * scaleRatio}px` : undefined,
                                                fontWeight: elem.fontWeight || 'normal',
                                                fontStyle: elem.isItalic ? 'italic' : 'normal',
                                            };

                                            return (
                                                <div
                                                    key={elem.id}
                                                    style={style}
                                                    onMouseDown={(e) => handleCanvasMouseDown(elem.id, e, false)}
                                                    className={`transition-all duration-75 relative group border p-0.5 leading-tight select-none break-words overflow-hidden ${isSelected
                                                        ? 'border-indigo-650 bg-indigo-500/10 shadow-xs z-30'
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
                                                                    <span className="text-[10px] text-indigo-500 flex items-center justify-center h-full animate-pulse">Uploading...</span>
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
                                                            <hr className="w-full border-t" style={{ borderColor: elem.color || '#1f2937', borderWidth: `${scaleRatio * 1.5}px` }} />
                                                        </div>
                                                    )}

                                                    {elem.type === 'link' && (
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1.5 bg-neutral-900/10 border pointer-events-none rounded-full flex items-center justify-center gap-1 shrink-0"
                                                            style={{
                                                                borderColor: elem.textColor || '#1f2937',
                                                                color: elem.textColor || '#1f2937',
                                                                fontSize: `${Math.max(8, 9 * scaleRatio)}px`,
                                                                borderWidth: `${Math.max(1, 1 * scaleRatio)}px`
                                                            }}
                                                        >
                                                            <MapPin className="size-3 shrink-0" style={{ width: `${10 * scaleRatio}px`, height: `${10 * scaleRatio}px` }} />
                                                            <span className="truncate max-w-[80px] font-bold">{elem.content || 'Map Location'}</span>
                                                        </button>
                                                    )}

                                                    {isSelected && (
                                                        <>
                                                            <div className="absolute top-0.5 left-0.5 bg-indigo-650 rounded-full text-white p-0.5 shadow-xs z-40 pointer-events-none opacity-80">
                                                                <Move className="size-2.5" />
                                                            </div>
                                                            <div
                                                                onMouseDown={(e) => handleCanvasMouseDown(elem.id, e, true)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="absolute bottom-0 right-0 size-3 bg-indigo-650 cursor-se-resize flex items-center justify-center text-[7px] text-white font-bold leading-none select-none rounded-tl-xs z-45"
                                                            >
                                                                ⇲
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <span className="text-[10px] text-center text-neutral-400 mt-2 font-medium">
                                        💡 Double-click canvas elements to move, scale, or configure properties. Layout is responsive.
                                    </span>
                                </div>
                            </div>
                            </div>
                        )}

                        {/* Save Actions Footer */}
                        <DialogFooter className="px-6 py-4 border-t gap-2 bg-neutral-50 dark:bg-neutral-950/20 shrink-0">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl px-5">
                                {editingTemplate ? 'Save Layout Modifications' : 'Publish Design Template'}
                            </Button>
                        </DialogFooter>
                            </form>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
