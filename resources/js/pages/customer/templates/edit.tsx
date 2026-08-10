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
    Music, Wine, Bell, XCircle, Smile, Shield,
    Layers, Palette, PenTool, Eye, CheckCircle2,
    Loader2, Copy, Share2, Download, Crown
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
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
    coupons?: Array<{
        id: number;
        code: string;
        discount: number;
    }>;
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

export default function TemplateCustomize({ template, userTemplate, coupons = [] }: PageProps) {
    const { auth } = usePage().props;
    const isGuest = !auth.user;

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isGuestAlertOpen, setIsGuestAlertOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(350);
    const [isSaved, setIsSaved] = useState(false);
    const [saveAnimation, setSaveAnimation] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Browse Templates', href: '/customer/templates' },
        { title: `Customize ${template.name}`, href: `/templates/${template.id}/customize` },
    ];

    const initialConfig = template.type === 'video'
        ? (userTemplate.custom_config || template.default_config || { video_url: null, elements: [] })
        : normalizeConfig(userTemplate.custom_config, template.bg_gradient);

    const { data, setData, put, processing } = useForm({
        custom_config: initialConfig,
    });

    const activePage = data.custom_config.pages[activePageIndex] || data.custom_config.pages[0];
    const ratioData = ASPECT_RATIOS[data.custom_config.aspectRatio] || ASPECT_RATIOS.standard;

    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                setCardWidth(entries[0].contentRect.width);
            }
        });
        observer.observe(cardRef.current);
        setCardWidth(cardRef.current.clientWidth);
        return () => observer.disconnect();
    }, [activePageIndex]);

    const targetWidth = data.custom_config.aspectRatio === 'custom'
        ? (data.custom_config.width || 350)
        : (ratioData.targetWidth || 350);

    const scaleRatio = cardWidth / targetWidth;

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

    const renderDecorIcon = (iconName: string, color: string = 'currentColor') => {
        const iconClasses = "size-full object-contain pointer-events-none";
        const legacyMap: Record<string, any> = {
            'heart': Heart, 'sparkle': Sparkles, 'sparkles': Sparkles,
            'cake': Cake, 'baby': Baby, 'gift': Gift, 'calendar': Calendar,
            'clock': Clock, 'music': Music, 'wine': Wine, 'star': Star,
            'bell': Bell, 'compass': Compass, 'flower': Smile, 'ring': Award
        };

        if (legacyMap[iconName]) {
            const LegacyIcon = legacyMap[iconName];
            return <LegacyIcon className={iconClasses} style={{ color }} />;
        }

        const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
        const IconComponent = (LucideIcons as any)[normalizedName] || (LucideIcons as any)[iconName] || Award;
        return <IconComponent className={iconClasses} style={{ color }} />;
    };

    const handleApplyCoupon = (code: string) => {
        const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (found) {
            setAppliedCoupon(found);
            setCouponCode(found.code);
            setCouponError('');
        } else {
            setCouponError('Invalid or inapplicable coupon code.');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (isGuest) {
            setIsGuestAlertOpen(true);
            return;
        }
        setSaveAnimation(true);
        put(`/customer/user-templates/${userTemplate.id}/save-draft`, {
            onSuccess: () => {
                setIsSaved(true);
                setSaveAnimation(false);
                setTimeout(() => setIsSaved(false), 3000);
            },
            onError: () => setSaveAnimation(false)
        });
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
                        },
                        body: JSON.stringify({
                            referral_code: couponCode || undefined,
                        })
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
                                color: '#000000',
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
                    headers: { ...getCsrfHeaders() },
                    body: formData,
                });

                if (!response.ok) throw new Error('Upload failed');
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
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&family=Dancing+Script:wght@400..700&family=Alex+Brush&family=Outfit:wght@100..900&family=Parisienne&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,300..900;1,300..900&family=Poppins:ital,wght@0,100..900;1,100..900&family=Pacifico&family=Sacramento&display=swap" rel="stylesheet" />
            </Head>

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 bg-white">

                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                        <a
                            href="/customer/templates"
                            className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-all duration-200"
                        >
                            <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                                <ChevronLeft className="size-4" />
                            </div>
                            <span className="hidden sm:inline">Back to Templates</span>
                        </a>

                        <div className="flex items-center gap-3">
                            <div className="h-8 w-px bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-gray-100 border border-gray-200">
                                    <Crown className="size-4 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold tracking-tight text-black">
                                        {template.name}
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                        {template.category}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                            <Shield className="size-3.5 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">Design Locked</span>
                        </div>

                        <Button
                            onClick={handleSaveDraft}
                            disabled={processing || saveAnimation}
                            variant="outline"
                            className={`group relative flex items-center gap-2 border-gray-300  rounded-xl text-sm font-semibold px-4 py-2.5 transition-all duration-300 text-black ${isSaved ? 'border-green-400 bg-green-50' : ''
                                }`}
                        >
                            {saveAnimation ? (
                                <Loader2 className="size-4 animate-spin text-white" />
                            ) : isSaved ? (
                                <CheckCircle2 className="size-4 text-green-600 text-white" />
                            ) : (
                                <Save className="size-4 group-hover:scale-110 transition-transform text-white" />
                            )}
                            <span className='text-white'>{isSaved ? 'Saved!' : 'Save Draft'}</span>
                        </Button>

                        <Button
                            onClick={handleBuyClick}
                            className="group relative flex items-center gap-2 bg-black hover:bg-gray-800 shadow-lg shadow-black/20 hover:shadow-black/30 rounded-xl text-sm font-semibold px-5 py-2.5 transition-all duration-300 text-white"
                        >
                            <CreditCard className="size-4 group-hover:scale-110 transition-transform" />
                            <span>Purchase</span>
                            <span className="ml-1 text-xs opacity-80">₹{parseFloat(String(template.price)).toFixed(0)}</span>
                        </Button>
                    </div>
                </div>

                {/* Editor Section */}
                {template.type === 'video' ? (
                    <div className="flex-1 overflow-hidden h-[800px] border border-gray-200 rounded-2xl bg-white shadow-lg">
                        <VideoTemplateBuilder
                            data={{ default_config: data.custom_config }}
                            setData={(field, value) => {
                                setData('custom_config', value);
                            }}
                            isCustomerMode={true}
                        />
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] flex-1">

                        {/* Left Panel - Personalization Form */}
                        <div className="rounded-2xl bg-white border border-gray-200 shadow-lg flex flex-col min-h-[600px] overflow-hidden">
                            <div className="p-5 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gray-100 border border-gray-200">
                                        <PenTool className="size-5 text-black" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-black flex items-center gap-2">
                                            Personalize Content
                                            <Sparkles className="size-4 text-black" />
                                        </h2>
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            Customize editable fields below
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 flex-1 overflow-y-auto space-y-4">
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
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <div className="p-4 rounded-full bg-gray-100">
                                                    <Layers className="size-8 text-gray-400" />
                                                </div>
                                                <p className="text-sm text-gray-500 mt-4 font-medium">
                                                    No editable fields configured
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    This template has no customizable content
                                                </p>
                                            </div>
                                        );
                                    }

                                    return editableElements.map(({ pageIndex, element }) => {
                                        if (element.type === 'text') {
                                            return (
                                                <div key={element.id} className="group space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-400 transition-all duration-200">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-semibold text-black flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                                            {element.editableLabel || 'Text Field'}
                                                        </Label>
                                                        <span className="text-[10px] font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                                            Page {pageIndex + 1}
                                                        </span>
                                                    </div>
                                                    {element.multiline ? (
                                                        <textarea
                                                            id={element.id}
                                                            value={element.content || ''}
                                                            onChange={(e) => handlePersonalizeText(pageIndex, element.id, e.target.value)}
                                                            rows={3}
                                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black shadow-sm focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-200 resize-none"
                                                            placeholder="Enter text..."
                                                        />
                                                    ) : (
                                                        <Input
                                                            id={element.id}
                                                            type="text"
                                                            value={element.content || ''}
                                                            onChange={(e) => handlePersonalizeText(pageIndex, element.id, e.target.value)}
                                                            className="h-10 text-sm text-black rounded-lg focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-200"
                                                            placeholder="Enter text..."
                                                        />
                                                    )}
                                                </div>
                                            );
                                        }
                                        if (element.type === 'image') {
                                            return (
                                                <div key={element.id} className="group space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-400 transition-all duration-200">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-semibold text-black flex items-center gap-2">
                                                            <ImageIcon className="size-3.5" />
                                                            {element.editableLabel || 'Upload Image'}
                                                        </Label>
                                                        <span className="text-[10px] font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                                            Page {pageIndex + 1}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-4 items-start">
                                                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-white overflow-hidden flex items-center justify-center shrink-0 transition-all duration-200 group-hover:border-black">
                                                            {element.url ? (
                                                                element.url === 'uploading' ? (
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <Loader2 className="size-6 text-black animate-spin" />
                                                                        <span className="text-[8px] text-black font-semibold">Uploading</span>
                                                                    </div>
                                                                ) : (
                                                                    <img src={element.url} alt="Custom Preview" className="w-full h-full object-cover" />
                                                                )
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <ImageIcon className="size-6 text-gray-300" />
                                                                    <span className="text-[8px] text-gray-400">No image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handlePersonalizeImage(pageIndex, element.id, e)}
                                                                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-black file:cursor-pointer focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-200"
                                                            />
                                                            <p className="text-[10px] text-gray-400 mt-1.5">
                                                                PNG, JPG, JPEG • Max 5MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    });
                                })()}

                                <div className="pt-2 text-center">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                                        <Palette className="size-3.5 text-gray-600" />
                                        <span className="text-[10px] font-medium text-gray-700">
                                            Design elements are locked
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Live Preview */}
                        <div className="flex flex-col items-center justify-start p-6 rounded-2xl bg-white border border-gray-200 shadow-lg min-h-[600px]">

                            {/* Page Selector */}
                            <div className="flex items-center gap-2 mb-6 w-full justify-center">
                                {data.custom_config.pages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActivePageIndex(idx)}
                                        className={`group relative px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${activePageIndex === idx
                                            ? 'bg-black text-white border-black shadow-lg shadow-black/25 scale-105'
                                            : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-600 hover:border-black'
                                            }`}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                            Page {idx + 1}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Preview Card */}
                            <div className="w-full max-w-[340px] flex flex-col gap-4">
                                <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                                    <Eye className="size-3.5" />
                                    <span>Live Preview</span>
                                    <Star className="size-3 text-black" />
                                </div>

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
                                    className={`w-full ${data.custom_config.aspectRatio !== 'custom' ? ratioData.class : ''} rounded-3xl shadow-2xl border-2 border-gray-200 relative select-none cursor-default overflow-hidden transition-all duration-500 hover:shadow-3xl ${!activePage?.bg_gradient?.startsWith('linear-gradient')
                                        ? `bg-gradient-to-br ${activePage?.bg_gradient || 'from-gray-100 to-gray-50 text-black'}`
                                        : ''
                                        }`}
                                >
                                    {/* Decorative border */}
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
                                                    <div className="absolute size-5 border-t border-l" style={{ top: '-1px', left: '-1px', borderColor: activePage.borderColor || '#d4af37', borderTopWidth: `${2 * scaleRatio}px`, borderLeftWidth: `${2 * scaleRatio}px`, borderTopLeftRadius: '4px' }} />
                                                    <div className="absolute size-5 border-t border-r" style={{ top: '-1px', right: '-1px', borderColor: activePage.borderColor || '#d4af37', borderTopWidth: `${2 * scaleRatio}px`, borderRightWidth: `${2 * scaleRatio}px`, borderTopRightRadius: '4px' }} />
                                                    <div className="absolute size-5 border-b border-l" style={{ bottom: '-1px', left: '-1px', borderColor: activePage.borderColor || '#d4af37', borderBottomWidth: `${2 * scaleRatio}px`, borderLeftWidth: `${2 * scaleRatio}px`, borderBottomLeftRadius: '4px' }} />
                                                    <div className="absolute size-5 border-b border-r" style={{ bottom: '-1px', right: '-1px', borderColor: activePage.borderColor || '#d4af37', borderBottomWidth: `${2 * scaleRatio}px`, borderRightWidth: `${2 * scaleRatio}px`, borderBottomRightRadius: '4px' }} />
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Elements */}
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
                                            textShadow: elem.type === 'text' && elem.textShadow && elem.textShadow !== 'none' ? elem.textShadow : undefined,
                                            opacity: elem.type === 'image' && elem.opacity !== undefined ? elem.opacity / 100 : 1,
                                            zIndex: elem.isBackground ? 5 : elem.type === 'image' ? 10 : elem.type === 'divider' ? 15 : elem.type === 'text' ? 20 : 25,
                                        };

                                        return (
                                            <div
                                                key={elem.id}
                                                style={style}
                                                className={`transition-all duration-300 relative overflow-hidden rounded-lg ${elem.animation && elem.animation !== 'none' ? elem.animation : ''
                                                    }`}
                                            >
                                                {elem.type === 'text' && (
                                                    <span className="w-full pointer-events-none leading-tight">{elem.content}</span>
                                                )}
                                                {elem.type === 'image' && (
                                                    <div className="w-full h-full rounded-md overflow-hidden bg-gray-100 pointer-events-none">
                                                        {elem.url ? (
                                                            elem.url === 'uploading' ? (
                                                                <div className="flex items-center justify-center h-full">
                                                                    <Loader2 className="size-5 text-black animate-spin" />
                                                                </div>
                                                            ) : (
                                                                <img src={elem.url} alt="Graphic" className="w-full h-full object-contain pointer-events-none" />
                                                            )
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full">
                                                                <span className="text-[8px] text-gray-400">No image</span>
                                                            </div>
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
                                                        className="px-3 py-1.5 bg-black/5 border pointer-events-none rounded-full flex items-center justify-center gap-1 shrink-0"
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

                                <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Shield className="size-3" />
                                        Secured Layout
                                    </span>
                                    <span className="w-px h-3 bg-gray-300" />
                                    <span className="flex items-center gap-1">
                                        <Copy className="size-3" />
                                        Design Locked
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-black">
                                <CreditCard className="size-5 text-black" />
                                Checkout
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Complete your purchase of <span className="font-semibold text-black">{template.name}</span>
                            </p>
                        </DialogHeader>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="rounded-xl bg-gray-50 p-5 border border-gray-200 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Template Price</span>
                                <span className={`text-sm font-bold ${appliedCoupon ? 'line-through text-gray-400' : 'text-black'}`}>
                                    ₹{parseFloat(String(template.price)).toFixed(2)}
                                </span>
                            </div>

                            {/* Coupon */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="h-9 text-sm rounded-lg flex-1 text-black focus:ring-2 focus:ring-black/20 focus:border-black"
                                        disabled={!!appliedCoupon || isCheckingOut}
                                    />
                                    {!appliedCoupon ? (
                                        <Button
                                            type="button"
                                            onClick={() => handleApplyCoupon(couponCode)}
                                            className="h-9 text-sm px-4 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold"
                                            disabled={!couponCode || isCheckingOut}
                                        >
                                            Apply
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleRemoveCoupon}
                                            className="h-9 text-sm px-4 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                                            disabled={isCheckingOut}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                            </div>

                            {coupons && coupons.length > 0 && !appliedCoupon && (
                                <div className="space-y-2 pt-2 border-t border-gray-200">
                                    <span className="text-xs font-semibold text-gray-500">Available Coupons</span>
                                    <div className="flex flex-wrap gap-2">
                                        {coupons.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => handleApplyCoupon(c.code)}
                                                className="border border-gray-300 bg-gray-50 text-black px-3 py-1 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                                            >
                                                {c.code} ({parseFloat(String(c.discount))}% OFF)
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600 font-semibold text-sm border-t border-green-200 pt-2">
                                    <span>Discount ({parseFloat(String(appliedCoupon.discount))}%)</span>
                                    <span>-₹{(parseFloat(String(template.price)) * parseFloat(String(appliedCoupon.discount)) / 100).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="text-base font-bold text-black">Total</span>
                                <span className="text-xl font-extrabold text-black">
                                    ₹{appliedCoupon
                                        ? (parseFloat(String(template.price)) - (parseFloat(String(template.price)) * parseFloat(String(appliedCoupon.discount)) / 100)).toFixed(2)
                                        : parseFloat(String(template.price)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Shield className="size-3.5" />
                            <span>Secure payment • Lifetime access</span>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-0 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCheckoutOpen(false)}
                            disabled={isCheckingOut}
                            className="rounded-xl text-sm font-medium border-gray-300 text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmPurchase}
                            disabled={isCheckingOut}
                            className="rounded-xl text-sm font-semibold px-6 bg-black hover:bg-gray-800 shadow-lg shadow-black/25 text-white"
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="size-4 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm Purchase'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Guest Dialog */}
            <Dialog open={isGuestAlertOpen} onOpenChange={setIsGuestAlertOpen}>
                <DialogContent className="max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-black">
                                <Save className="size-5 text-black" />
                                Save Your Invitation
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <div className="p-6 space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            To save your progress or purchase this template, you'll need to create an account or log in.
                        </p>
                        <div className="rounded-xl bg-green-50 p-4 border border-green-200 flex items-start gap-3">
                            <CheckCircle2 className="size-5 text-green-600 mt-0.5 shrink-0" />
                            <p className="text-sm font-medium text-green-700">
                                Your customized edits will be automatically saved!
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto rounded-xl text-sm font-medium border-gray-300 text-black hover:bg-gray-50"
                            onClick={() => setIsGuestAlertOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleGuestRedirect('/login')}
                            className="w-full sm:w-auto rounded-xl text-sm font-medium border-2 border-gray-300 text-black hover:bg-gray-50"
                        >
                            Log In
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleGuestRedirect('/register')}
                            className="w-full sm:w-auto rounded-xl text-sm font-semibold bg-black hover:bg-gray-800 shadow-lg shadow-black/25 text-white"
                        >
                            Create Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}