import { useState, useRef } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
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
    Sparkles, Save, CreditCard, ChevronLeft, Heart,
    Cake, Baby, Award, Plus, Trash2, Link, MapPin,
    ChevronRight, Move, Maximize, Type, Image as ImageIcon,
    Smile, Star, Compass
} from 'lucide-react';
import { normalizeConfig, ElementConfig, PageConfig, InvitationConfig, ASPECT_RATIOS } from '@/utils/builder-utils';

interface Template {
    id: number;
    name: string;
    category: string;
    price: string | number;
    bg_gradient: string;
    default_config: any;
}

interface UserTemplate {
    id: number;
    user_id: number;
    template_id: number;
    custom_config: any;
    is_purchased: boolean;
}

interface PageProps {
    template: Template;
    userTemplate: UserTemplate;
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

export default function TemplateCustomize({ template, userTemplate }: PageProps) {
    const { auth } = usePage().props;
    const isGuest = !auth.user;

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isGuestAlertOpen, setIsGuestAlertOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };
    const [activeTab, setActiveTab] = useState<'pages' | 'text' | 'image' | 'icon' | 'link'>('pages');

    const cardRef = useRef<HTMLDivElement>(null);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Browse Templates',
            href: '/customer/templates',
        },
        {
            title: `Customize ${template.name}`,
            href: `/customer/templates/${template.id}/customize`,
        },
    ];

    // Normalize initial state with fallback for old layouts
    const initialConfig = normalizeConfig(userTemplate.custom_config, template.bg_gradient);

    const { data, setData, put, post, processing } = useForm({
        custom_config: initialConfig,
    });

    const activePage = data.custom_config.pages[activePageIndex] || data.custom_config.pages[0];
    const selectedElement = activePage?.elements.find(e => e.id === selectedElementId) || null;
    const ratioData = ASPECT_RATIOS[data.custom_config.aspectRatio] || ASPECT_RATIOS.standard;

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

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (isGuest) {
            setIsGuestAlertOpen(true);
            return;
        }
        put(`/customer/user-templates/${userTemplate.id}/save-draft`);
    };

    const handleBuyClick = () => {
        if (isGuest) {
            setIsGuestAlertOpen(true);
            return;
        }
        setIsCheckoutOpen(true);
    };

    const handleConfirmPurchase = () => {
        setIsCheckingOut(true);
        put(`/customer/user-templates/${userTemplate.id}/save-draft`, {
            onSuccess: async () => {
                try {
                    const response = await fetch(`/customer/user-templates/${userTemplate.id}/create-order`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                        }
                    });

                    if (!response.ok) {
                        let errorMessage = 'Failed to create payment order.';
                        try {
                            const contentType = response.headers.get('content-type');
                            if (contentType && contentType.includes('application/json')) {
                                const errData = await response.json();
                                errorMessage = errData.error || errorMessage;
                            } else {
                                const textData = await response.text();
                                errorMessage = `Server Error (${response.status}): ${textData.substring(0, 100)}`;
                            }
                        } catch (e) {
                            errorMessage = `Error (${response.status}): ${response.statusText}`;
                        }
                        alert(errorMessage);
                        setIsCheckingOut(false);
                        return;
                    }

                    const orderData = await response.json();

                    if (orderData.mock) {
                        router.post(`/customer/user-templates/${userTemplate.id}/verify-payment`, {
                            mock: true
                        });
                    } else {
                        if (!(window as any).Razorpay) {
                            const loaded = await loadRazorpayScript();
                            if (!loaded) {
                                alert('Failed to load Razorpay payment SDK.');
                                setIsCheckingOut(false);
                                return;
                            }
                        }

                        const options = {
                            key: orderData.key_id,
                            amount: orderData.amount,
                            currency: 'INR',
                            name: 'Invitify',
                            description: `Purchase Template: ${template.name}`,
                            order_id: orderData.order_id,
                            handler: function (response: any) {
                                router.post(`/customer/user-templates/${userTemplate.id}/verify-payment`, {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                    mock: false
                                });
                            },
                            prefill: {
                                name: auth.user?.name || '',
                                email: auth.user?.email || '',
                            },
                            theme: {
                                color: '#2563eb',
                            },
                            modal: {
                                ondismiss: function () {
                                    setIsCheckingOut(false);
                                }
                            }
                        };

                        const rzp = new (window as any).Razorpay(options);
                        rzp.open();
                    }
                } catch (error: any) {
                    console.error('Payment checkout error:', error);
                    alert(error.message || 'An unexpected error occurred during checkout.');
                    setIsCheckingOut(false);
                }
            },
            onError: () => {
                setIsCheckingOut(false);
            }
        });
    };

    const handleGuestRedirect = (targetPath: '/register' | '/login') => {
        const guestDraft = {
            template_id: template.id,
            custom_config: data.custom_config,
        };
        localStorage.setItem('guest_draft', JSON.stringify(guestDraft));
        window.location.href = targetPath;
    };

    // Card builder functions
    const handleRatioChange = (ratio: 'standard' | 'square' | 'landscape' | 'mobile') => {
        setData('custom_config', {
            ...data.custom_config,
            aspectRatio: ratio
        });
    };

    const handleAddPage = () => {
        const newPage: PageConfig = {
            id: `page-${Math.random().toString(36).substr(2, 9)}`,
            bg_gradient: template.bg_gradient || 'from-stone-100 to-rose-50 text-neutral-800',
            elements: []
        };
        setData('custom_config', {
            ...data.custom_config,
            pages: [...data.custom_config.pages, newPage]
        });
        setActivePageIndex(data.custom_config.pages.length);
        setSelectedElementId(null);
    };

    const handleDeletePage = (index: number) => {
        if (data.custom_config.pages.length <= 1) return;
        const filtered = data.custom_config.pages.filter((_, i) => i !== index);
        setData('custom_config', {
            ...data.custom_config,
            pages: filtered
        });
        setActivePageIndex(Math.max(0, index - 1));
        setSelectedElementId(null);
    };

    const handlePageBgChange = (gradient: string) => {
        const updated = [...data.custom_config.pages];
        updated[activePageIndex] = {
            ...updated[activePageIndex],
            bg_gradient: gradient
        };
        setData('custom_config', {
            ...data.custom_config,
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

        const updatedPages = [...data.custom_config.pages];
        updatedPages[activePageIndex] = {
            ...activePage,
            elements: [...activePage.elements, newElement]
        };

        setData('custom_config', {
            ...data.custom_config,
            pages: updatedPages
        });
        setSelectedElementId(newElement.id);
    };

    const handleUpdateElement = (elementId: string, updates: Partial<ElementConfig>) => {
        setData(prev => {
            const updatedPages = [...prev.custom_config.pages];
            updatedPages[activePageIndex] = {
                ...updatedPages[activePageIndex],
                elements: updatedPages[activePageIndex].elements.map(e =>
                    e.id === elementId ? { ...e, ...updates } : e
                )
            };
            return {
                ...prev,
                custom_config: {
                    ...prev.custom_config,
                    pages: updatedPages
                }
            };
        });
    };

    const handleDeleteElement = (elementId: string) => {
        const updatedPages = [...data.custom_config.pages];
        updatedPages[activePageIndex] = {
            ...activePage,
            elements: activePage.elements.filter(e => e.id !== elementId)
        };
        setData('custom_config', {
            ...data.custom_config,
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

    const handlePersonalizeText = (pageIndex: number, elementId: string, value: string) => {
        const updatedPages = [...data.custom_config.pages];
        updatedPages[pageIndex] = {
            ...updatedPages[pageIndex],
            elements: updatedPages[pageIndex].elements.map(e =>
                e.id === elementId ? { ...e, content: value } : e
            )
        };
        setData('custom_config', {
            ...data.custom_config,
            pages: updatedPages
        });
    };

    const handlePersonalizeImage = async (pageIndex: number, elementId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Set to uploading
                setData(prev => {
                    const updatedPages = [...prev.custom_config.pages];
                    updatedPages[pageIndex] = {
                        ...updatedPages[pageIndex],
                        elements: updatedPages[pageIndex].elements.map(elem =>
                            elem.id === elementId ? { ...elem, url: 'uploading' } : elem
                        )
                    };
                    return {
                        ...prev,
                        custom_config: {
                            ...prev.custom_config,
                            pages: updatedPages
                        }
                    };
                });

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

                setData(prev => {
                    const updatedPages = [...prev.custom_config.pages];
                    updatedPages[pageIndex] = {
                        ...updatedPages[pageIndex],
                        elements: updatedPages[pageIndex].elements.map(elem =>
                            elem.id === elementId ? { ...elem, url: result.url } : elem
                        )
                    };
                    return {
                        ...prev,
                        custom_config: {
                            ...prev.custom_config,
                            pages: updatedPages
                        }
                    };
                });
            } catch (err) {
                console.error(err);
                alert('Failed to upload image. Please try again.');
                setData(prev => {
                    const updatedPages = [...prev.custom_config.pages];
                    updatedPages[pageIndex] = {
                        ...updatedPages[pageIndex],
                        elements: updatedPages[pageIndex].elements.map(elem =>
                            elem.id === elementId ? { ...elem, url: '' } : elem
                        )
                    };
                    return {
                        ...prev,
                        custom_config: {
                            ...prev.custom_config,
                            pages: updatedPages
                        }
                    };
                });
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>{`Customize ${template.name}`}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&display=swap" rel="stylesheet" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between gap-4">
                    <a
                        href="/customer/templates"
                        className="flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                        <ChevronLeft className="size-4" /> Back to Templates
                    </a>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleSaveDraft}
                            disabled={processing}
                            variant="outline"
                            className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800"
                        >
                            <Save className="size-4" /> Save Draft
                        </Button>
                        <Button
                            onClick={handleBuyClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-sm"
                        >
                            <CreditCard className="size-4" /> Buy Template
                        </Button>
                    </div>
                </div>

                {/* Editor Split-Screen Layout */}
                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] flex-1">

                    {/* Left Form Editor Controls */}
                    <div className="rounded-xl border border-neutral-250 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col min-h-[550px] overflow-hidden">
                        <div className="p-6 border-b bg-neutral-50 dark:bg-neutral-950/20">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Sparkles className="size-5 text-indigo-650" /> Personalize Invitation Card
                            </h2>
                            <p className="text-xs text-neutral-500 mt-1">Replace the content in the fields below. Card layout, borders, themes, fonts, and designs are secured.</p>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
                            {(() => {
                                const editableElements: { pageIndex: number; element: any }[] = [];
                                data.custom_config.pages.forEach((page: any, pageIdx: number) => {
                                    page.elements.forEach((elem: any) => {
                                        if (elem.type === 'text' || elem.type === 'image') {
                                            editableElements.push({ pageIndex: pageIdx, element: elem });
                                        }
                                    });
                                });

                                if (editableElements.length === 0) {
                                    return (
                                        <p className="text-sm text-neutral-450 italic text-center py-12">
                                            This card template does not have any personalized fields enabled by the admin.
                                        </p>
                                    );
                                }

                                return editableElements.map(({ pageIndex, element }) => {
                                    if (element.type === 'text') {
                                        const isMultiLine = element.content?.includes('\n') || (element.content && element.content.length > 40);
                                        return (
                                            <div key={element.id} className="grid gap-1.5">
                                                <Label htmlFor={element.id} className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                                                    {element.editableLabel || `Text Field ${element.content ? `("${element.content.substring(0, 20)}")` : ''} (Page ${pageIndex + 1})`}
                                                </Label>
                                                {isMultiLine ? (
                                                    <textarea
                                                        id={element.id}
                                                        value={element.content || ''}
                                                        onChange={(e) => handlePersonalizeText(pageIndex, element.id, e.target.value)}
                                                        rows={3}
                                                        className="w-full rounded-md border border-neutral-200 px-3 py-1.5 text-xs shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                    />
                                                ) : (
                                                    <Input
                                                        id={element.id}
                                                        type="text"
                                                        value={element.content || ''}
                                                        onChange={(e) => handlePersonalizeText(pageIndex, element.id, e.target.value)}
                                                        className="h-9 text-xs"
                                                    />
                                                )}
                                            </div>
                                        );
                                    }
                                    if (element.type === 'image') {
                                        return (
                                            <div key={element.id} className="grid gap-2 border-t pt-4 border-dashed first:border-0 first:pt-0">
                                                <Label className="text-xs font-bold text-neutral-750">
                                                    {element.editableLabel || `Image Field (Page ${pageIndex + 1})`}
                                                </Label>
                                                <div className="flex gap-4 items-center">
                                                    <div className="size-16 rounded border bg-neutral-50 overflow-hidden flex items-center justify-center shrink-0">
                                                        {element.url ? (
                                                            <img src={element.url} alt="Preview" className="size-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="size-6 text-neutral-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-1.5">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handlePersonalizeImage(pageIndex, element.id, e)}
                                                            className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-xs shadow-xs file:border-0 file:bg-transparent file:text-xs file:font-semibold text-neutral-550 file:cursor-pointer"
                                                        />
                                                        <p className="text-[10px] text-neutral-450">Upload a replacement image (JPG, PNG, WebP).</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                });
                            })()}
                        </div>
                    </div>

                    {/* Right Live Card Preview (rendered inside a high premium canvas) */}
                    <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-neutral-250 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20 min-h-[550px] relative">

                        {/* Page Selector Tabs over Canvas */}
                        <div className="flex items-center gap-2 mb-4 w-full justify-center">
                            {data.custom_config.pages.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => { setActivePageIndex(idx); setSelectedElementId(null); }}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${activePageIndex === idx
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400'
                                        }`}
                                >
                                    Page {idx + 1}
                                </button>
                            ))}
                        </div>

                        {/* Visual Canvas Container */}
                        <div className="w-full max-w-[310px] flex flex-col gap-3 relative">
                            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center mb-1 flex items-center justify-center gap-1">
                                <Star className="size-3 text-amber-500" /> Real-time Card Canvas
                            </span>

                            {/* Canvas body */}
                            <div
                                ref={cardRef}
                                onClick={() => setSelectedElementId(null)}
                                className={`w-full ${ratioData.class} rounded-3xl shadow-xl overflow-hidden bg-gradient-to-tr ${activePage?.bg_gradient} border border-neutral-300 dark:border-neutral-850 relative select-none cursor-default transition-all duration-350`}
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
                                        fontSize: elem.fontSize ? `${elem.fontSize * 0.95}px` : undefined, // slight scale down in editor
                                        fontWeight: elem.fontWeight || 'normal',
                                        fontStyle: elem.isItalic ? 'italic' : 'normal',
                                    };

                                    return (
                                        <div
                                            key={elem.id}
                                            style={style}
                                            className="transition-all duration-75 relative p-0.5 leading-tight select-none break-words overflow-hidden border border-transparent"
                                        >
                                            {elem.type === 'text' && (
                                                <span className="w-full pointer-events-none">{elem.content !== 'uploading' ? elem.content : ''}</span>
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
                                                        <span className="text-[10px] text-neutral-405 flex items-center justify-center h-full">No image uploaded</span>
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
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Canvas Help tips */}
                            <span className="text-[9px] text-center text-neutral-400">
                                🔒 Template design styling, formatting, and layout are secured by admin.
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Confirmation Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Checkout Confirmation <Sparkles className="size-5 text-amber-500" />
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <p>You are about to purchase the invitation card: <strong className="text-neutral-950 dark:text-neutral-50">{template.name}</strong>.</p>

                        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-950 flex flex-col gap-2 border border-neutral-150 dark:border-neutral-850">
                            <div className="flex justify-between font-medium">
                                <span>Template Price</span>
                                <span className="text-neutral-950 dark:text-neutral-50">₹{parseFloat(String(template.price)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 pt-2">
                                <span>Access</span>
                                <span>Lifetime edits & shares</span>
                            </div>
                        </div>

                        <p className="text-xs text-neutral-400 leading-normal">
                            *Clicking confirm will launch the payment gateway or process the checkout to register your purchase and unlock downloads.
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={isCheckingOut}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmPurchase}
                            disabled={isCheckingOut}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                        >
                            {isCheckingOut ? 'Processing...' : 'Confirm Checkout'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Guest Action Dialog */}
            <Dialog open={isGuestAlertOpen} onOpenChange={setIsGuestAlertOpen}>
                <DialogContent className="max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Save Your Invitation <Sparkles className="size-5 text-amber-500" />
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <p>
                            To save your progress or purchase this template, you'll need to create an account or log in.
                        </p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Don't worry! We will automatically save your customized edits so you don't lose them.
                        </p>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setIsGuestAlertOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleGuestRedirect('/login')}
                            className="w-full sm:w-auto border border-neutral-250 text-neutral-850 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-850"
                        >
                            Log In
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleGuestRedirect('/register')}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            Register
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
