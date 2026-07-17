import { useState, useRef, useEffect } from 'react';
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
    Cake, Baby, Award, Link, MapPin, ChevronRight,
    ImageIcon, Star, Compass, Gift, Calendar, Clock,
    Music, Wine, Bell, XCircle, Smile
} from 'lucide-react';
import { normalizeConfig, ElementConfig, PageConfig, InvitationConfig, ASPECT_RATIOS } from '@/utils/builder-utils';
import { getCsrfHeaders } from '@/lib/utils';
import VideoTemplateBuilder from '@/components/VideoTemplateBuilder';

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
    dancing: "'Dancing Script', cursive",
    alex: "'Alex Brush', cursive",
    outfit: "'Outfit', sans-serif",
    parisienne: "'Parisienne', cursive",
    cormorant: "'Cormorant Garamond', serif",
    pinyon: "'Pinyon Script', cursive",
};

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

    const cardRef = useRef<HTMLDivElement>(null);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(350);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Browse Templates',
            href: '/customer/templates',
        },
        {
            title: `Customize ${template.name}`,
            href: `/templates/${template.id}/customize`,
        },
    ];

    // Normalize initial state with fallback for old layouts
    const initialConfig = template.type === 'video'
        ? (userTemplate.custom_config || template.default_config || { video_url: null, elements: [] })
        : normalizeConfig(userTemplate.custom_config, template.bg_gradient);

    const { data, setData, put, processing } = useForm({
        custom_config: initialConfig,
    });

    const activePage = data.custom_config.pages[activePageIndex] || data.custom_config.pages[0];
    const ratioData = ASPECT_RATIOS[data.custom_config.aspectRatio] || ASPECT_RATIOS.standard;

    // Track card dimensions dynamically for font scaling
    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                setCardWidth(entries[0].contentRect.width);
            }
        });
        observer.observe(cardRef.current);

        // Initial measurement
        setCardWidth(cardRef.current.clientWidth);

        return () => observer.disconnect();
    }, [activePageIndex]);

    const targetWidth = data.custom_config.aspectRatio === 'custom'
        ? (data.custom_config.width || 350)
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
                            ...getCsrfHeaders()
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

    // Client personalization updates
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
                // Set to uploading status
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
                        ...getCsrfHeaders()
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
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&family=Dancing+Script:wght@400..700&family=Alex+Brush&family=Outfit:wght@100..900&family=Parisienne&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&display=swap" rel="stylesheet" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 bg-neutral-50/40 dark:bg-neutral-950/10">

                {/* Actions Header bar */}
                <div className="flex items-center justify-between gap-4 border-b pb-4">
                    <a
                        href="/customer/templates"
                        className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:text-neutral-450 dark:hover:text-neutral-50"
                    >
                        <ChevronLeft className="size-4" /> Back to Templates
                    </a>

                    <div className="flex items-center gap-3.5">
                        <Button
                            onClick={handleSaveDraft}
                            disabled={processing}
                            variant="outline"
                            className="flex items-center gap-1.5 border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold"
                        >
                            <Save className="size-4" /> Save Draft
                        </Button>
                        <Button
                            onClick={handleBuyClick}
                            className="flex items-center gap-1.5 shadow-sm rounded-xl text-xs font-bold px-5"
                        >
                            <CreditCard className="size-4" /> Purchase Design Card
                        </Button>
                    </div>
                </div>

                {/* Editor Split Personalized Panel */}
                {template.type === 'video' ? (
                    <div className="flex-1 overflow-hidden h-[800px] border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col">
                        <VideoTemplateBuilder
                            data={{ default_config: data.custom_config }}
                            setData={(field, value) => {
                                setData('custom_config', value);
                            }}
                            isCustomerMode={true}
                        />
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] flex-1">

                        {/* Left side Personalization form ONLY (All layouts and styling locked) */}
                        <div className="rounded-2xl border border-neutral-200 bg-white shadow-2xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col min-h-[500px] overflow-hidden">
                            <div className="p-5 border-b bg-neutral-50 dark:bg-neutral-950/20">
                                <h2 className="text-md font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
                                    <Sparkles className="size-5 text-indigo-650 dark:text-indigo-400" />
                                    Personalize Invitation Content
                                </h2>
                                <p className="text-[11px] text-neutral-450 mt-1">Replace placeholder contents inside editable text and photo frames. Overall card structures, themes, borders, and layouts are secured.</p>
                            </div>

                            <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5">
                                {(() => {
                                    const editableElements: { pageIndex: number; element: ElementConfig }[] = [];
                                    data.custom_config.pages.forEach((page: PageConfig, pageIdx: number) => {
                                        page.elements.forEach((elem: ElementConfig) => {
                                            if (elem.isEditable && (elem.type === 'text' || elem.type === 'image')) {
                                                editableElements.push({ pageIndex: pageIdx, element: elem });
                                            }
                                        });
                                    });

                                    if (editableElements.length === 0) {
                                        return (
                                            <p className="text-xs text-neutral-450 italic text-center py-12">
                                                This card design template has no personalized text/image fields configured by the admin.
                                            </p>
                                        );
                                    }

                                    return editableElements.map(({ pageIndex, element }) => {
                                        if (element.type === 'text') {
                                            return (
                                                <div key={element.id} className="grid gap-1.5 bg-neutral-50/50 dark:bg-neutral-950/20 p-3.5 rounded-xl border">
                                                    <Label htmlFor={element.id} className="text-xs font-bold text-white dark:text-neutral-200 flex items-center justify-between">
                                                        <span className='dark:text-neutral-100'>{element.editableLabel || 'Text Field'}</span>
                                                        <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-800">Page {pageIndex + 1}</span>
                                                    </Label>
                                                    {element.multiline ? (
                                                        <textarea
                                                            id={element.id}
                                                            value={element.content || ''}
                                                            onChange={(e) => handlePersonalizeText(pageIndex, element.id, e.target.value)}
                                                            rows={3}
                                                            className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-xs shadow-2xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                        />
                                                    ) : (
                                                        <Input
                                                            id={element.id}
                                                            type="text"
                                                            value={element.content || ''}
                                                            onChange={(e) => handlePersonalizeText(pageIndex, element.id, e.target.value)}
                                                            className="h-9.5 text-xs rounded-lg"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        }
                                        if (element.type === 'image') {
                                            return (
                                                <div key={element.id} className="grid gap-2 bg-neutral-50/50 dark:bg-neutral-950/20 p-3.5 rounded-xl border">
                                                    <Label className="text-xs font-bold text-neutral-805 dark:text-neutral-200 dark:text-neutral-100 flex items-center justify-between">
                                                        <span>{element.editableLabel || 'Upload Image'}</span>
                                                        <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Page {pageIndex + 1}</span>
                                                    </Label>
                                                    <div className="flex gap-4 items-center mt-1">
                                                        <div className="size-16 rounded-xl border bg-white overflow-hidden flex items-center justify-center shrink-0">
                                                            {element.url ? (
                                                                element.url === 'uploading' ? (
                                                                    <span className="text-[9px] text-indigo-500 font-extrabold animate-pulse">Uploading</span>
                                                                ) : (
                                                                    <img src={element.url} alt="Custom Preview" className="size-full object-cover" />
                                                                )
                                                            ) : (
                                                                <ImageIcon className="size-6 text-neutral-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 flex flex-col gap-1.5">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handlePersonalizeImage(pageIndex, element.id, e)}
                                                                className="flex h-9 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs shadow-2xs file:border-0 file:bg-transparent file:text-xs file:font-semibold text-neutral-500 file:cursor-pointer"
                                                            />
                                                            <p className="text-[9px] text-neutral-450 font-medium">PNG, JPG, JPEG formats accepted.</p>
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

                        {/* Right side locked Live Card Preview (Zero Selection Outline or resizing handles) */}
                        <div className="flex flex-col items-center justify-start p-6 rounded-2xl border border-neutral-200 bg-neutral-100/50 dark:border-neutral-800 dark:bg-neutral-950/20 min-h-[500px]">

                            {/* Page Selector Tabs */}
                            <div className="flex items-center gap-2.5 mb-5 w-full justify-center">
                                {data.custom_config.pages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActivePageIndex(idx)}
                                        className={`px-3.5 py-1 text-xs font-bold rounded-full border transition-all ${activePageIndex === idx
                                            ? 'bg-indigo-700 text-white border-indigo-700'
                                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-850 dark:text-neutral-400'
                                            }`}
                                    >
                                        Page {idx + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Card frame simulator wrapper */}
                            <div className="w-full max-w-[310px] flex flex-col gap-3.5 relative">
                                <span className="text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest text-center mb-1 flex items-center justify-center gap-1.5">
                                    <Star className="size-3.5 text-amber-500" /> Personalized Live view
                                </span>

                                {/* Canvas body (Securely locked: No element outlines, click selections, or drags) */}
                                <div
                                    ref={cardRef}
                                    style={{
                                        aspectRatio: data.custom_config.aspectRatio === 'custom'
                                            ? `${data.custom_config.width || 350}/${data.custom_config.height || 490}`
                                            : undefined,
                                        height: data.custom_config.aspectRatio !== 'custom' ? undefined : 'auto',
                                        background: activePage?.bg_gradient?.startsWith('linear-gradient')
                                            ? activePage.bg_gradient
                                            : undefined,
                                    }}
                                    className={`w-full ${data.custom_config.aspectRatio !== 'custom' ? ratioData.class : ''} rounded-3xl shadow-xl border border-neutral-300 dark:border-neutral-850 relative select-none cursor-default overflow-hidden transition-all duration-300 ${!activePage?.bg_gradient?.startsWith('linear-gradient') ? `bg-gradient-to-tr ${activePage?.bg_gradient || 'from-stone-100 to-rose-50 text-neutral-800'}` : ''}`}
                                >
                                    {/* Decorative border overlays */}
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

                                    {/* Renders elements in canvas (Locked preview) */}
                                    {activePage?.elements.map((elem) => {
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
                                                className="transition-all duration-75 relative p-0.5 leading-tight select-none break-words overflow-hidden border border-transparent"
                                            >
                                                {elem.type === 'text' && (
                                                    <span className="w-full pointer-events-none">{elem.content}</span>
                                                )}

                                                {elem.type === 'image' && (
                                                    <div className="w-full h-full rounded-md overflow-hidden bg-neutral-255/50 pointer-events-none">
                                                        {elem.url ? (
                                                            elem.url === 'uploading' ? (
                                                                <span className="text-[10px] text-indigo-500 flex items-center justify-center h-full animate-pulse font-extrabold">Uploading...</span>
                                                            ) : (
                                                                <img src={elem.url} alt="Graphic Frame" className="w-full h-full object-cover pointer-events-none" />
                                                            )
                                                        ) : (
                                                            <span className="text-[9px] text-neutral-400 flex items-center justify-center h-full">No image uploaded</span>
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
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Help tips */}
                                <span className="text-[9px] text-center text-neutral-400">
                                    🔒 Invitation layout and design styling parameters are secured by Invitify.
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Confirmation Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Checkout Confirmation <Sparkles className="size-5 text-amber-500" />
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <p>You are about to purchase the invitation card: <strong className="text-neutral-950 dark:text-neutral-50">{template.name}</strong>.</p>

                        <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-950 flex flex-col gap-2 border border-neutral-150 dark:border-neutral-850">
                            <div className="flex justify-between font-bold">
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
                        <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={isCheckingOut} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmPurchase}
                            disabled={isCheckingOut}
                            className="font-bold rounded-xl px-5"
                        >
                            {isCheckingOut ? 'Processing...' : 'Confirm Checkout'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Guest Action Dialog */}
            <Dialog open={isGuestAlertOpen} onOpenChange={setIsGuestAlertOpen}>
                <DialogContent className="max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Save Your Invitation <Sparkles className="size-5 text-amber-500" />
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <p>
                            To save your progress or purchase this template, you'll need to create an account or log in.
                        </p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-450">
                            Don't worry! We will automatically save your customized edits so you don't lose them.
                        </p>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" className="w-full sm:w-auto rounded-xl" onClick={() => setIsGuestAlertOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleGuestRedirect('/login')}
                            className="w-full sm:w-auto border border-neutral-250 text-neutral-850 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-850 rounded-xl font-bold"
                        >
                            Log In
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleGuestRedirect('/register')}
                            className="w-full sm:w-auto bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl px-5"
                        >
                            Register
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
