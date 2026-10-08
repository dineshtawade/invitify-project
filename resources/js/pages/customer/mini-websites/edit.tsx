import { useState, useRef, useEffect, useMemo } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
    Globe, Save, ExternalLink, CreditCard, Ticket,
    Check, AlertCircle, Loader2, Type, ImageIcon,
    Video, Link as LinkIcon, ChevronRight, Eye, Smartphone, Monitor, Tablet, FileText, Clock
} from 'lucide-react';
import type { Block, WebsiteConfig } from '@/components/design-editor/types';
import { getCsrfHeaders } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface PageProps {
    auth: { user: { name: string; email: string; } };
    website: any;
    customBlocks?: any[];
    coupons?: Array<{
        id: number;
        code: string;
        discount: number;
    }>;
}

const pxToCqw = (px?: number | string | null, defaultPx: number = 0) => {
    const val = px !== undefined && px !== null ? Number(px) : defaultPx;
    return `${(val / 384) * 100}cqw`;
};

function normalizeConfig(rawConfig: any): any {
    if (!rawConfig) return { pages: [{ id: 'home', name: 'Home', blocks: [] }] };
    if (rawConfig.html !== undefined) {
        return rawConfig;
    }
    if (Array.isArray(rawConfig)) {
        // Old format: flat array of blocks
        return { pages: [{ id: 'home', name: 'Home', blocks: rawConfig }] };
    }
    if (rawConfig.pages && Array.isArray(rawConfig.pages)) {
        return rawConfig;
    }
    return { pages: [{ id: 'home', name: 'Home', blocks: [] }] };
}

// Renders a single element on the canvas (read-only for customer)
function CanvasElement({ el, pxToCqwFn }: { el: Block; pxToCqwFn: typeof pxToCqw }) {
    let innerContent: React.ReactNode = null;

    if (el.type === 'text') {
        innerContent = <span>{el.content}</span>;
    } else if (el.type === 'button') {
        innerContent = (
            <button
                style={{
                    width: '100%', height: '100%',
                    backgroundColor: el.bgColor, color: el.color,
                    borderRadius: pxToCqwFn(el.borderRadius),
                    fontSize: pxToCqwFn(el.fontSize, 16),
                    fontWeight: el.fontWeight,
                }}
                className="flex items-center justify-center pointer-events-none"
            >
                {el.content}
            </button>
        );
    } else if (el.type === 'image') {
        innerContent = (
            <img
                src={el.src}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: pxToCqwFn(el.borderRadius) }}
                draggable={false}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
        );
    } else if (el.type === 'video') {
        innerContent = (
            <video
                src={el.src}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: pxToCqwFn(el.borderRadius), pointerEvents: 'none' }}
                autoPlay loop muted playsInline
            />
        );
    } else if (el.type === 'icon') {
        const iconKey = el.iconName || (el as any).iconType || (el as any).icon || 'Star';
        const IconComp = (LucideIcons as any)[iconKey] || LucideIcons.Star;
        innerContent = <IconComp style={{ width: '100%', height: '100%', color: el.color }} />;
    } else if (el.type === 'map') {
        innerContent = (
            <iframe
                src={el.src}
                style={{ width: '100%', height: '100%', borderRadius: pxToCqwFn(el.borderRadius), pointerEvents: 'none' }}
                frameBorder="0"
            />
        );
    } else if (el.type === 'carousel') {
        const imgs = el.images && el.images.length > 0 ? el.images : ['https://via.placeholder.com/300x200'];
        innerContent = (
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 2500 }}
                pagination={{ clickable: true }}
                className="w-full h-full"
                style={{ borderRadius: pxToCqwFn(el.borderRadius), pointerEvents: 'none' }}
            >
                {imgs.map((src, idx) => (
                    <SwiperSlide key={idx}>
                        <img src={src} className="w-full h-full object-cover" draggable={false} />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    }

    return (
        <div
            className="absolute"
            style={{
                left: `${el.x}%`,
                top: pxToCqwFn(el.y),
                width: el.w ? pxToCqwFn(el.w) : undefined,
                height: el.h ? pxToCqwFn(el.h) : undefined,
                zIndex: el.zIndex || 1,
                ...(el.type === 'text' || el.type === 'link' || el.type === 'button' ? {
                    fontSize: pxToCqwFn(el.fontSize, 16),
                    fontWeight: el.fontWeight || 'normal',
                    fontFamily: el.fontFamily,
                    color: el.color,
                    textShadow: el.textShadow && el.textShadow !== 'none' ? el.textShadow : undefined,
                    whiteSpace: 'nowrap'
                } : {})
            }}
        >
            {innerContent}
        </div>
    );
}

// Get element label
function getElementLabel(el: Block, idx: number): string {
    if (el.type === 'text') return el.content ? (el.content.length > 40 ? el.content.substring(0, 40) + '...' : el.content) : `Text ${idx + 1}`;
    if (el.type === 'button') return el.content || `Button ${idx + 1}`;
    if (el.type === 'image') return `Image ${idx + 1}`;
    if (el.type === 'video') return `Video ${idx + 1}`;
    if (el.type === 'carousel') return `Photo Gallery ${idx + 1}`;
    if (el.type === 'map') return `Map ${idx + 1}`;
    return `${el.type} ${idx + 1}`;
}

function getCodeTemplateHtml(configData: any) {
    if (!configData || !configData.html) return null;
    let html = configData.html;

    // Inject the script for extracting and updating elements
    const scriptToInject = `
    <script class="invitify-editor-script">
        window.addEventListener('load', function() {
            const items = [];
            let idCounter = 0;
            
            // Store text nodes in memory to update them without altering DOM structure
            window.__invitifyTextNodes = {};

            // 1. Extract Text Nodes using TreeWalker
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let n;
            while(n = walk.nextNode()) {
                if(n.parentElement && !['SCRIPT','STYLE','NOSCRIPT'].includes(n.parentElement.tagName) && n.textContent.trim().length > 0) {
                    textNodes.push(n);
                }
            }
            
            textNodes.forEach(node => {
                const id = 'edit-text-' + idCounter++;
                window.__invitifyTextNodes[id] = node;
                let label = node.parentElement.tagName.toLowerCase();
                if (['h1','h2','h3','h4','h5','h6'].includes(label)) label = 'Heading';
                else if (label === 'p') label = 'Paragraph';
                else if (label === 'a') label = 'Link';
                else if (label === 'button') label = 'Button';
                else label = 'Text';
                
                items.push({ id, type: 'text', label: label, text: node.textContent.trim() });
            });

            // 2. Extract Images
            document.querySelectorAll('img').forEach(el => {
                const id = 'edit-img-' + idCounter++;
                el.setAttribute('data-editable-id', id);
                items.push({ id, type: 'image', label: 'Image', src: el.src });
            });

            // 3. Extract Videos
            document.querySelectorAll('video').forEach(el => {
                const id = 'edit-vid-' + idCounter++;
                el.setAttribute('data-editable-id', id);
                items.push({ id, type: 'video', label: 'Video', src: el.src });
            });

            window.parent.postMessage({ type: 'INIT_EDITABLES', items }, '*');

            window.addEventListener('message', function(e) {
                if (e.data && e.data.type === 'UPDATE_EDITABLE') {
                    if (e.data.elType === 'text') {
                        const node = window.__invitifyTextNodes[e.data.id];
                        if (node) {
                            node.textContent = e.data.value;
                        }
                    } else if (e.data.elType === 'image' || e.data.elType === 'video') {
                        const el = document.querySelector('[data-editable-id="' + e.data.id + '"]');
                        if (el) {
                            el.src = e.data.value;
                        }
                    }
                } else if (e.data && e.data.type === 'GET_HTML') {
                    const clone = document.documentElement.cloneNode(true);
                    clone.querySelectorAll('[data-editable-id]').forEach(el => el.removeAttribute('data-editable-id'));
                    const scripts = clone.querySelectorAll('.invitify-editor-script');
                    scripts.forEach(s => s.remove());
                    window.parent.postMessage({ type: 'SAVE_HTML_RESULT', html: clone.outerHTML }, '*');
                }
            });
        });
    </script>
    `;
    if (html.includes('</body>')) {
        html = html.replace('</body>', scriptToInject + '</body>');
    } else {
        html += scriptToInject;
    }

    return html;
}

function getElementIcon(el: Block) {
    if (el.type === 'text') return <Type className="size-4 text-blue-500 shrink-0" />;
    if (el.type === 'button') return <LinkIcon className="size-4 text-purple-500 shrink-0" />;
    if (el.type === 'image') return <ImageIcon className="size-4 text-green-500 shrink-0" />;
    if (el.type === 'video') return <Video className="size-4 text-red-500 shrink-0" />;
    if (el.type === 'carousel') return <LucideIcons.Images className="size-4 text-orange-500 shrink-0" />;
    if (el.type === 'map') return <LucideIcons.MapPin className="size-4 text-teal-500 shrink-0" />;
    return <FileText className="size-4 text-gray-500 shrink-0" />;
}

export default function MiniWebsiteEdit({ auth, website, customBlocks = [], coupons = [] }: PageProps) {
    const normalizedConfig = useMemo(() => normalizeConfig(website.config), [website.config]);

    const [config, setConfig] = useState<any>(normalizedConfig);
    const [activePageId, setActivePageId] = useState<string>(normalizedConfig.pages?.[0]?.id || 'home');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState<Record<string, boolean>>({});
    const [extractedElements, setExtractedElements] = useState<any[]>([]);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const configRef = useRef(config);
    configRef.current = config;

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === 'INIT_EDITABLES') {
                setExtractedElements(e.data.items);
            } else if (e.data?.type === 'SAVE_HTML_RESULT') {
                const newConfig = { ...configRef.current, html: e.data.html };
                setConfig(newConfig);

                // Proceed with saving
                const callback = (window as any).pendingSaveCallback;
                (window as any).pendingSaveCallback = null;

                router.put(`/customer/mini-websites/${website.uuid || website.id}`, {
                    title: website.title,
                    theme: website.theme || 'cozy',
                    is_published: website.is_published ?? false,
                    config: newConfig,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        if (callback) callback();
                    },
                    onError: () => {
                        alert('Failed to save. Please try again.');
                    },
                    onFinish: () => {
                        setIsSaving(false);
                    }
                });
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [website.id, website.title, website.theme, website.is_published]);

    // Renewal Checkout States
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [durationUnit, setDurationUnit] = useState<'days' | 'weeks'>('days');
    const [durationMode, setDurationMode] = useState<string>('30');
    const [customDays, setCustomDays] = useState(30);
    const [customWeeks, setCustomWeeks] = useState(4);
    const [referralCode, setReferralCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState('');
    const [isValidCoupon, setIsValidCoupon] = useState(false);
    const [isApplyingCode, setIsApplyingCode] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutTimeLeft, setCheckoutTimeLeft] = useState(600);

    useEffect(() => {
        let timer;
        if (isCheckoutOpen && checkoutTimeLeft > 0 && !isCheckingOut) {
            timer = setInterval(() => {
                setCheckoutTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isCheckoutOpen && checkoutTimeLeft === 0) {
            setIsCheckoutOpen(false);
            alert("Payment session expired. Please start the payment process again.");
        }
        return () => clearInterval(timer);
    }, [isCheckoutOpen, checkoutTimeLeft, isCheckingOut]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const activePage = config.pages?.find(p => p.id === activePageId) || config.pages?.[0];
    const allBlocks = activePage?.blocks || [];

    const isCodeTemplate = !!(config as any).html;

    // Filter only content-editable elements for the left panel
    const editableBlocks = allBlocks.filter(el =>
        ['text', 'image', 'video', 'button', 'carousel', 'map'].includes(el.type)
    );
    const bgBlock = allBlocks.find(b => b.type === 'background');

    const bgStyle = bgBlock
        ? (bgBlock.src
            ? { backgroundImage: `url(${bgBlock.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: bgBlock.bgColor })
        : { backgroundColor: '#f9fafb' };

    const getDeviceWidth = () => {
        if (previewDevice === 'mobile') return 'max-w-sm';
        if (previewDevice === 'tablet') return 'max-w-2xl';
        return 'max-w-5xl';
    };

    const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
        setConfig(prev => ({
            ...prev,
            pages: prev.pages.map(page => ({
                ...page,
                blocks: page.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b)
            }))
        }));
    };

    const handleUpdateCarouselImage = (blockId: string, imgIndex: number, newUrl: string) => {
        setConfig(prev => ({
            ...prev,
            pages: prev.pages.map(page => ({
                ...page,
                blocks: page.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    const newImages = [...(b.images || [])];
                    newImages[imgIndex] = newUrl;
                    return { ...b, images: newImages };
                })
            }))
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string, imgIndex?: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const uploadKey = imgIndex !== undefined ? `${blockId}-${imgIndex}` : blockId;
            setIsUploadingImage(prev => ({ ...prev, [uploadKey]: true }));
            const formData = new FormData();
            formData.append('file', file);

            try {
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

                if (imgIndex !== undefined) {
                    handleUpdateCarouselImage(blockId, imgIndex, result.url);
                } else {
                    handleUpdateBlock(blockId, { src: result.url });
                }
            } catch (err) {
                console.error(err);
                alert('Failed to upload file. Please check format (PNG, JPG, JPEG, MP4, WEBM) and try again.');
            } finally {
                setIsUploadingImage(prev => ({ ...prev, [uploadKey]: false }));
            }
        }
    };

    const handleSave = (callback?: () => void) => {
        setIsSaving(true);
        if (isCodeTemplate && iframeRef.current?.contentWindow) {
            (window as any).pendingSaveCallback = callback;
            iframeRef.current.contentWindow.postMessage({ type: 'GET_HTML' }, '*');
        } else {
            router.put(`/customer/mini-websites/${website.uuid || website.id}`, {
                title: website.title,
                theme: website.theme || 'cozy',
                is_published: website.is_published ?? false,
                config: config as any,
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    if (callback) callback();
                },
                onError: () => {
                    alert('Failed to save. Please try again.');
                },
                onFinish: () => {
                    setIsSaving(false);
                }
            });
        }
    };

    const handleUpdateExtracted = (id: string, elType: string, value: string) => {
        setExtractedElements(prev => prev.map(item => item.id === id ? { ...item, [elType === 'text' ? 'text' : 'src']: value } : item));
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_EDITABLE', id, elType, value }, '*');
        }
    };

    const handleBuyClick = () => {
        handleSave(() => {
            setDurationUnit('days');
            setDurationMode('30');
            setCustomDays(30);
            setCustomWeeks(4);
            setReferralCode('');
            setAppliedDiscount(0);
            setCouponMessage('');
            setIsValidCoupon(false);
            setIsCheckoutOpen(true);
        });
    };

    const handleUnitChange = (unit: 'days' | 'weeks') => {
        setDurationUnit(unit);
        if (unit === 'days') { setDurationMode('30'); setCustomDays(30); }
        else { setDurationMode('4'); setCustomWeeks(4); }
    };

    const getDaysValue = () => {
        if (durationUnit === 'days') {
            return durationMode === 'custom' ? Math.max(1, customDays) : parseInt(durationMode, 10);
        }
        const weeks = durationMode === 'custom' ? Math.max(1, customWeeks) : parseInt(durationMode, 10);
        return weeks * 7;
    };

    const templatePrice = !website.is_purchased && website.template ? parseFloat(String(website.template.price)) : 0;
    const dailyPrice = 5;
    const days = getDaysValue();
    const hostingPrice = days * dailyPrice;
    const subtotal = templatePrice + hostingPrice;
    const discountDeduction = appliedDiscount > 0 ? Math.round(subtotal * (appliedDiscount / 100) * 100) / 100 : 0;
    const finalAmount = Math.max(0, subtotal - discountDeduction);

    const handleApplyCoupon = async (code?: string) => {
        const codeToApply = code || referralCode;
        if (!codeToApply) return;
        setIsApplyingCode(true);
        setCouponMessage('');

        // First check locally if it's one of the listed coupons
        const localCoupon = coupons.find(c => c.code.toUpperCase() === codeToApply.toUpperCase());
        if (localCoupon) {
            setAppliedDiscount(parseFloat(String(localCoupon.discount)));
            setIsValidCoupon(true);
            setReferralCode(localCoupon.code);
            setCouponMessage(`Discount of ${parseFloat(String(localCoupon.discount))}% applied!`);
            setIsApplyingCode(false);
            return;
        }

        try {
            const res = await fetch(`/customer/mini-websites/${website.uuid || website.id}/verify-referral`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...getCsrfHeaders()
                },
                body: JSON.stringify({ referral_code: codeToApply, is_global: true })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                setIsValidCoupon(false);
                setAppliedDiscount(0);
                setCouponMessage(err.error || 'Invalid or expired code.');
                setIsApplyingCode(false);
                return;
            }

            const data = await res.json();
            setAppliedDiscount(data.discount_percentage);
            setIsValidCoupon(true);
            setReferralCode(codeToApply);
            setCouponMessage(`Discount of ${data.discount_percentage}% applied!`);
        } catch (e: any) {
            setIsValidCoupon(false);
            setAppliedDiscount(0);
            setCouponMessage(e.message || 'Error verifying code.');
        } finally {
            setIsApplyingCode(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) { resolve(true); return; }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleConfirmRenewal = async () => {
        setIsCheckingOut(true);
        try {
            const response = await fetch(`/customer/mini-websites/${website.uuid || website.id}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...getCsrfHeaders() },
                body: JSON.stringify({ days, referral_code: isValidCoupon ? referralCode : '' })
            });

            if (!response.ok) {
                const resData = await response.json().catch(() => ({}));
                alert(resData.error || 'Failed to initiate payment.');
                setIsCheckingOut(false);
                return;
            }

            const orderData = await response.json();

            if (orderData.mock) {
                router.post(`/customer/mini-websites/${website.uuid || website.id}/verify-payment`, { mock: true }, {
                    onSuccess: () => { setIsCheckoutOpen(false); setIsCheckingOut(false); },
                    onError: () => { setIsCheckingOut(false); }
                });
            } else {
                if (!(window as any).Razorpay) {
                    const loaded = await loadRazorpayScript();
                    if (!loaded) { alert('Failed to load Razorpay payment SDK.'); setIsCheckingOut(false); return; }
                }
                const options = {
                    key: orderData.key_id,
                    amount: orderData.amount,
                    currency: 'INR',
                    name: 'Invitify',
                    description: `Hosting Purchase for ${website.title}`,
                    order_id: orderData.order_id,
                    handler: function (response: any) {
                        router.post(`/customer/mini-websites/${website.uuid || website.id}/verify-payment`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            mock: false
                        }, {
                            onSuccess: () => { setIsCheckoutOpen(false); setIsCheckingOut(false); },
                            onError: () => { setIsCheckingOut(false); }
                        });
                    },
                    prefill: { name: auth?.user?.name || '', email: auth?.user?.email || '' },
                    theme: { color: '#2563eb' },
                    modal: { ondismiss: function () { setIsCheckingOut(false); } }
                };
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            }
        } catch (e: any) {
            alert(e.message || 'An unexpected error occurred.');
            setIsCheckingOut(false);
        }
    };

    const isExpired = !website.expires_at || new Date(website.expires_at) < new Date();
    const isFree = website.template && parseFloat(String(website.template.price)) === 0;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/customer/dashboard' },
            { title: 'My Mini Websites', href: '/customer/mini-websites' },
            { title: website.title, href: `/customer/mini-websites/${website.uuid || website.id}/edit` },
        ]}>
            <Head title={`Customize: ${website.title}`} />

            <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
                {/* Header Navbar */}
                <div className="border-b border-gray-200 bg-white px-4 py-3 flex flex-wrap items-center justify-between shrink-0 shadow-sm gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                            <Globe className="size-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-gray-900">{website.title}</h1>
                            <a
                                href={`/mini-website/${website.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                                /mini-website/{website.slug} <ExternalLink className="size-3" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => handleSave()}
                            disabled={isSaving}
                            variant="outline"
                            className="h-8 px-3 text-xs font-bold border-gray-300 text-white bg-blue-600"
                        >
                            {isSaving ? <Loader2 className="size-3 mr-1.5 animate-spin" /> : <Save className="size-3 mr-1.5" />}
                            Save
                        </Button>

                        {!isFree && (
                            <Button
                                onClick={handleBuyClick}
                                disabled={isSaving || isCheckingOut}
                                className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 font-bold text-xs"
                            >
                                <CreditCard className="size-3" />
                                {!website.is_purchased ? 'Purchase & Host' : (isExpired ? 'Re-Host' : 'Extend Hosting')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Left: Content Editing Panel */}
                    <div className="w-full lg:w-[350px] h-[45%] lg:h-auto shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
                        {/* Panel Header */}
                        <div className="px-5 py-4 border-b border-gray-200 bg-white">
                            <h2 className="text-sm font-bold text-gray-900">Customize Your Content</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Replace the text, images, and videos below to personalize this template.</p>
                        </div>

                        {/* Page Tabs if multi-page */}
                        {config.pages && config.pages.length > 1 && (
                            <div className="flex gap-1 px-3 py-2 border-b border-gray-200 bg-white overflow-x-auto">
                                {config.pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => { setActivePageId(page.id); setSelectedElementId(null); }}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${activePageId === page.id
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Editable Elements List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {!isCodeTemplate && editableBlocks.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    <Globe className="size-8 mx-auto mb-2 opacity-30" />
                                    <p>No editable elements found on this page.</p>
                                </div>
                            )}

                            {isCodeTemplate ? (
                                extractedElements.map((el: any) => {
                                    const isExpanded = selectedElementId === el.id;
                                    return (
                                        <div
                                            key={el.id}
                                            className={`rounded-xl border bg-white transition-all overflow-hidden shadow-sm ${isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200'}`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setSelectedElementId(isExpanded ? null : el.id)}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                {el.type === 'text' ? <Type className="size-4 text-blue-500 shrink-0" /> : el.type === 'video' ? <Video className="size-4 text-red-500 shrink-0" /> : <ImageIcon className="size-4 text-green-500 shrink-0" />}
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-xs font-bold text-gray-800 capitalize">{el.label || el.type}</span>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">{el.type === 'text' ? (el.text.length > 40 ? el.text.substring(0, 40) + '...' : el.text) : (el.src ? el.src.split('/').pop() : 'No media')}</p>
                                                </div>
                                                <ChevronRight className={`size-4 text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                                            </button>

                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
                                                    {el.type === 'text' && (
                                                        <div className="space-y-1">
                                                            <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Text Content</Label>
                                                            {el.text.length > 60 ? (
                                                                <textarea
                                                                    value={el.text}
                                                                    onChange={e => handleUpdateExtracted(el.id, 'text', e.target.value)}
                                                                    rows={3}
                                                                    className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 resize-none text-gray-900"
                                                                />
                                                            ) : (
                                                                <Input
                                                                    value={el.text}
                                                                    onChange={e => handleUpdateExtracted(el.id, 'text', e.target.value)}
                                                                    className="focus-visible:ring-blue-400 border-gray-200"
                                                                />
                                                            )}
                                                        </div>
                                                    )}

                                                    {(el.type === 'image' || el.type === 'video') && (
                                                        <div className="space-y-3">
                                                            <div className="flex flex-col gap-2">
                                                                <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Upload Local {el.type}</Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="file"
                                                                        accept={el.type === 'image' ? "image/*" : "video/*"}
                                                                        onChange={async (e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                setIsUploadingImage(prev => ({ ...prev, [el.id]: true }));
                                                                                const formData = new FormData();
                                                                                formData.append('file', file);
                                                                                try {
                                                                                    const response = await fetch('/media/upload', {
                                                                                        method: 'POST',
                                                                                        headers: { 'Accept': 'application/json', ...getCsrfHeaders() },
                                                                                        body: formData
                                                                                    });
                                                                                    if (response.ok) {
                                                                                        const data = await response.json();
                                                                                        handleUpdateExtracted(el.id, el.type, data.url);
                                                                                    }
                                                                                } finally {
                                                                                    setIsUploadingImage(prev => ({ ...prev, [el.id]: false }));
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="cursor-pointer file:text-xs text-xs h-9 bg-white border-gray-200"
                                                                        disabled={isUploadingImage[el.id]}
                                                                    />
                                                                    {isUploadingImage[el.id] && (
                                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                            <Loader2 className="size-4 animate-spin text-blue-500" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">{el.type} URL</Label>
                                                                <Input
                                                                    value={el.src}
                                                                    onChange={e => handleUpdateExtracted(el.id, el.type, e.target.value)}
                                                                    placeholder={`https://example.com/file.${el.type === 'image' ? 'jpg' : 'mp4'}`}
                                                                    className="focus-visible:ring-blue-400 border-gray-200"
                                                                />
                                                            </div>
                                                            {el.src && (
                                                                <div className="h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                                    {el.type === 'image' ? (
                                                                        <img src={el.src} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <video src={el.src} className="w-full h-full object-cover" controls />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                editableBlocks.map((el, idx) => {
                                    const isExpanded = selectedElementId === el.id;

                                    return (
                                        <div
                                            key={el.id}
                                            className={`rounded-xl border bg-white transition-all overflow-hidden shadow-sm ${isExpanded
                                                ? 'border-blue-300 shadow-md'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            {/* Element Header - Click to expand */}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedElementId(isExpanded ? null : el.id)}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                {getElementIcon(el)}
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-xs font-bold text-gray-800 capitalize">{el.type}</span>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">{getElementLabel(el, idx)}</p>
                                                </div>
                                                <ChevronRight className={`size-4 text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                                            </button>

                                            {/* Expanded Edit Fields */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
                                                    {/* Text Element */}
                                                    {el.type === 'text' && (
                                                        <div className="space-y-1">
                                                            <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Text Content</Label>
                                                            {el.content && el.content.length > 60 ? (
                                                                <textarea
                                                                    value={el.content || ''}
                                                                    onChange={e => handleUpdateBlock(el.id, { content: e.target.value })}
                                                                    rows={3}
                                                                    className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 resize-none text-gray-900"
                                                                    placeholder="Enter your text..."
                                                                />
                                                            ) : (
                                                                <Input
                                                                    value={el.content || ''}
                                                                    onChange={e => handleUpdateBlock(el.id, { content: e.target.value })}
                                                                    placeholder="Enter your text..."
                                                                    className="focus-visible:ring-blue-400 border-gray-200"
                                                                />
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Button Element */}
                                                    {el.type === 'button' && (
                                                        <>
                                                            <div className="space-y-1">
                                                                <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Button Text</Label>
                                                                <Input
                                                                    value={el.content || ''}
                                                                    onChange={e => handleUpdateBlock(el.id, { content: e.target.value })}
                                                                    placeholder="Button label..."
                                                                    className="focus-visible:ring-blue-400 border-gray-200"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Link URL</Label>
                                                                <Input
                                                                    value={el.url || ''}
                                                                    onChange={e => handleUpdateBlock(el.id, { actionType: 'url', url: e.target.value })}
                                                                    placeholder="https://your-website.com"
                                                                    className="focus-visible:ring-blue-400 border-gray-200"
                                                                />
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Image Element */}
                                                    {el.type === 'image' && (
                                                        <div className="space-y-3">
                                                            <div className="flex flex-col gap-2">
                                                                <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Upload Local File</Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageUpload(e, el.id)}
                                                                        disabled={isUploadingImage[el.id]}
                                                                        className="cursor-pointer file:text-xs text-xs h-9 bg-white border-gray-200"
                                                                    />
                                                                    {isUploadingImage[el.id] && (
                                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                            <Loader2 className="size-4 animate-spin text-blue-500" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <hr className="flex-1 border-gray-200" />
                                                                <span className="text-[10px] text-gray-400 font-medium uppercase">OR</span>
                                                                <hr className="flex-1 border-gray-200" />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Image URL</Label>
                                                                <Input
                                                                    value={el.src || ''}
                                                                    onChange={e => handleUpdateBlock(el.id, { src: e.target.value })}
                                                                    placeholder="https://example.com/photo.jpg"
                                                                    className="focus-visible:ring-blue-400 border-gray-200"
                                                                />
                                                            </div>
                                                            {el.src && (
                                                                <div className="h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                                    <img
                                                                        src={el.src}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                                    />
                                                                </div>
                                                            )}
                                                            <p className="text-[10px] text-gray-400">Upload an image or paste a direct URL. Recommended size: at least 800px wide.</p>
                                                        </div>
                                                    )}

                                                    {/* Video Element */}
                                                    {el.type === 'video' && (
                                                        <div className="space-y-3">
                                                            <div className="flex flex-col gap-2">
                                                                <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Upload Local Video</Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="file"
                                                                        accept="video/mp4,video/webm"
                                                                        onChange={(e) => handleImageUpload(e, el.id)}
                                                                        disabled={isUploadingImage[el.id]}
                                                                        className="cursor-pointer file:text-xs text-xs h-9 bg-white border-gray-200"
                                                                    />
                                                                    {isUploadingImage[el.id] && (
                                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                            <Loader2 className="size-4 animate-spin text-blue-500" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <hr className="flex-1 border-gray-200" />
                                                                <span className="text-[10px] text-gray-400 font-medium uppercase">OR</span>
                                                                <hr className="flex-1 border-gray-200" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Video URL</Label>
                                                                <Input
                                                                    value={el.src || ''}
                                                                    onChange={e => handleUpdateBlock(el.id, { src: e.target.value })}
                                                                    placeholder="https://example.com/video.mp4"
                                                                    className="focus-visible:ring-blue-400 border-gray-200"
                                                                />
                                                                <p className="text-[10px] text-gray-400">Paste a direct .mp4 video URL. The video will autoplay silently.</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Carousel Element */}
                                                    {el.type === 'carousel' && (
                                                        <div className="space-y-3">
                                                            <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Gallery Images</Label>
                                                            {(el.images || []).map((imgUrl, imgIdx) => (
                                                                <div key={imgIdx} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-2">
                                                                    <div className="flex gap-2 items-center">
                                                                        <div className="relative flex-1">
                                                                            <Input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(e) => handleImageUpload(e, el.id, imgIdx)}
                                                                                disabled={isUploadingImage[`${el.id}-${imgIdx}`]}
                                                                                className="cursor-pointer file:text-[10px] text-[10px] h-8 bg-white border-gray-200 pr-8"
                                                                            />
                                                                            {isUploadingImage[`${el.id}-${imgIdx}`] && (
                                                                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                                    <Loader2 className="size-3 animate-spin text-blue-500" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 items-center">
                                                                        <Input
                                                                            value={imgUrl}
                                                                            onChange={e => handleUpdateCarouselImage(el.id, imgIdx, e.target.value)}
                                                                            placeholder={`Image URL ${imgIdx + 1}`}
                                                                            className="focus-visible:ring-blue-400 flex-1 text-xs h-8 border-gray-200"
                                                                        />
                                                                        <div className="size-8 shrink-0 rounded overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                                                                            {imgUrl ? (
                                                                                <img src={imgUrl} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                                            ) : (
                                                                                <ImageIcon className="size-3 text-gray-300" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Map Element */}
                                                    {el.type === 'map' && (
                                                        <div className="space-y-2">
                                                            <Label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Google Maps Embed URL</Label>
                                                            <Input
                                                                value={el.src || ''}
                                                                onChange={e => handleUpdateBlock(el.id, { src: e.target.value })}
                                                                placeholder="https://www.google.com/maps/embed?pb=..."
                                                                className="focus-visible:ring-blue-400 border-gray-200"
                                                            />
                                                            <p className="text-[10px] text-gray-400">
                                                                Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }))}
                        </div>

                    </div>

                    {/* Right: Canvas Preview */}
                    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
                        {/* Canvas Topbar */}
                        <div className="flex items-center gap-4 justify-between w-full px-4 py-2.5 text-gray-700 text-xs z-10 bg-white border-b border-gray-200 shrink-0">
                            <span className="font-semibold uppercase tracking-widest flex items-center gap-1.5 text-gray-500">
                                <Eye className="size-4" /> Live Preview
                            </span>
                            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                                <button type="button" onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}><Monitor className="size-4" /></button>
                                <button type="button" onClick={() => setPreviewDevice('tablet')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}><Tablet className="size-4" /></button>
                                <button type="button" onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}><Smartphone className="size-4" /></button>
                            </div>
                        </div>

                        {/* Page Tabs for preview */}
                        {config.pages && config.pages.length > 1 && (
                            <div className="flex gap-2 px-4 py-2 bg-white border-b border-gray-200 shrink-0 overflow-x-auto">
                                {config.pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => { setActivePageId(page.id); setSelectedElementId(null); }}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${activePageId === page.id ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {page.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Canvas Area */}
                        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-100/50">
                            {isCodeTemplate ? (
                                <div className={`relative w-full shadow-2xl transition-all duration-300 ${getDeviceWidth()} overflow-hidden rounded-md bg-white border border-gray-200`} style={{ height: '800px' }}>
                                    <iframe
                                        ref={iframeRef}
                                        srcDoc={getCodeTemplateHtml(config) || ''}
                                        className="w-full h-full border-none"
                                        sandbox="allow-scripts allow-same-origin"
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`relative w-full shadow-2xl transition-all duration-300 ${getDeviceWidth()} overflow-hidden rounded-md bg-white`}
                                    style={{
                                        ...bgStyle,
                                        containerType: 'inline-size' as any,
                                        minHeight: pxToCqw(Math.max(800, allBlocks.filter(b => b.type !== 'background').reduce((max, b) => {
                                            return Math.max(max, (b.y || 0) + (b.h || 100));
                                        }, 0) + 200))
                                    }}
                                >
                                    {allBlocks.filter(b => b.type !== 'background').map(el => (
                                        <CanvasElement key={el.id} el={el} pxToCqwFn={pxToCqw} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hosting Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-gray-900 pr-6">
                            <div className="flex items-center gap-2 text-xl font-bold">
                                <CreditCard className="size-5 text-blue-600 shrink-0" />
                                <span className="truncate">
                                    {!website.is_purchased ? 'Complete Purchase' : 'Renew Hosting'}
                                </span>
                            </div>
                            <div className="bg-red-50 text-red-600 font-mono text-sm px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-red-200 shrink-0 self-start sm:self-auto shadow-sm">
                                <Clock className="size-4 animate-pulse" /> {formatTime(checkoutTimeLeft)}
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-5 py-3 text-sm">
                        {!website.is_purchased && website.template && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="text-sm font-bold text-blue-700 mb-1">One-time Template License</h4>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">{website.template.name}</span>
                                    <span className="font-bold text-gray-900">₹{templatePrice}</span>
                                </div>
                            </div>
                        )}

                        <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 flex flex-col gap-1">
                            <span className="text-xs text-gray-400 uppercase font-bold">Hosting Website</span>
                            <span className="font-bold text-gray-800">{website.title}</span>
                            <span className="text-xs text-gray-500 font-mono">/mini-website/{website.slug}</span>
                        </div>

                        {/* Duration Selector */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs text-gray-500 uppercase font-bold">Select Billing Cycle</Label>
                            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                                <button type="button" onClick={() => handleUnitChange('days')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${durationUnit === 'days' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>Daily (Days)</button>
                                <button type="button" onClick={() => handleUnitChange('weeks')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${durationUnit === 'weeks' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>Weekly (Weeks)</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-xs text-gray-500 uppercase font-bold">Select Hosting Duration</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(durationUnit === 'days' ? [1, 7, 30, 90] : [1, 4, 12, 26]).map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setDurationMode(String(val))}
                                        className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${durationMode === String(val) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        <span className="text-sm">{val} {durationUnit === 'days' ? (val === 1 ? 'Day' : 'Days') : (val === 1 ? 'Week' : 'Weeks')}</span>
                                        <span className="text-[10px] opacity-70 text-gray-500">₹{durationUnit === 'days' ? val * dailyPrice : val * 7 * dailyPrice}</span>
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setDurationMode('custom')}
                                    className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all col-span-3 ${durationMode === 'custom' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                                >
                                    <span className="text-sm">Custom Duration</span>
                                </button>
                            </div>
                            {durationMode === 'custom' && (
                                <div className="flex gap-2 items-center mt-1">
                                    <Input
                                        type="number"
                                        value={durationUnit === 'days' ? customDays : customWeeks}
                                        onChange={(e) => {
                                            const val = Math.max(1, parseInt(e.target.value) || 1);
                                            if (durationUnit === 'days') setCustomDays(val);
                                            else setCustomWeeks(val);
                                        }}
                                        min={1}
                                        className="h-9 font-semibold border-gray-200 focus:ring-blue-400 focus:border-blue-400"
                                    />
                                    <span className="text-sm text-gray-500 shrink-0">{durationUnit}</span>
                                </div>
                            )}
                        </div>

                        {/* Coupon Section */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                                <Ticket className="size-3.5" /> Apply Coupon / Referral Code
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={referralCode}
                                    onChange={(e) => { setReferralCode(e.target.value); setCouponMessage(''); setIsValidCoupon(false); setAppliedDiscount(0); }}
                                    placeholder="E.g., MYCOUPON10"
                                    className="h-9 font-bold uppercase tracking-wider border-gray-200 focus:ring-blue-400 focus:border-blue-400"
                                    disabled={isValidCoupon || isCheckingOut}
                                />
                                {!isValidCoupon ? (
                                    <Button type="button" onClick={() => handleApplyCoupon()} disabled={isApplyingCode || !referralCode.trim()} className="h-9 px-4 shrink-0 bg-gray-900 text-white hover:bg-gray-800">
                                        {isApplyingCode ? <Loader2 className="size-4 animate-spin" /> : 'Apply'}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setReferralCode('');
                                            setIsValidCoupon(false);
                                            setAppliedDiscount(0);
                                            setCouponMessage('');
                                        }}
                                        className="h-9 px-4 shrink-0 border-red-200 text-red-600 hover:bg-red-50"
                                        disabled={isCheckingOut}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>

                            {/* Available Coupons List */}
                            {coupons && coupons.length > 0 && !isValidCoupon && (
                                <div className="mt-2 text-xs flex flex-col gap-1.5 border-t border-gray-200 pt-2">
                                    <span className="font-bold text-gray-500">Available Coupons:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {coupons.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => handleApplyCoupon(c.code)}
                                                className="border border-blue-200 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold hover:bg-blue-100 transition-colors"
                                            >
                                                {c.code} ({parseFloat(String(c.discount))}% OFF)
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {couponMessage && (
                                <p className={`text-xs font-semibold flex items-center gap-1 mt-1 ${isValidCoupon ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {isValidCoupon ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                                    {couponMessage}
                                </p>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="border-t border-gray-200 pt-4 mt-2 flex flex-col gap-2.5">
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Daily Hosting Fee</span>
                                <span className="font-semibold text-gray-700">₹{dailyPrice} / day</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Hosting × {days} day{days !== 1 ? 's' : ''}</span>
                                <span className="font-semibold text-gray-700">₹{hostingPrice}</span>
                            </div>
                            {!website.is_purchased && (
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>Template License (one-time)</span>
                                    <span className="font-semibold text-gray-700">₹{templatePrice}</span>
                                </div>
                            )}
                            {discountDeduction > 0 && (
                                <div className="flex justify-between items-center text-emerald-600">
                                    <span className="flex items-center gap-1"><Ticket className="size-3.5" /> Discount ({appliedDiscount}%)</span>
                                    <span className="font-bold">-₹{discountDeduction}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center border-t border-dashed border-gray-300 pt-3 text-base font-extrabold text-gray-900">
                                <span>Total Payable</span>
                                <span>₹{finalAmount}</span>
                            </div>
                        </div>

                        <DialogFooter className="mt-4 gap-2 border-t border-gray-200 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={isCheckingOut} className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</Button>
                            <Button
                                type="button"
                                onClick={handleConfirmRenewal}
                                disabled={isCheckingOut || finalAmount <= 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                            >
                                {isCheckingOut ? <><Loader2 className="size-4 animate-spin" /> Processing...</> : <><CreditCard className="size-4" /> {!website.is_purchased ? 'Pay & Publish' : 'Pay & Renew'}</>}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
