import { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
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
    Plus, Globe, ExternalLink, MessageSquare, Trash, Pencil,
    ShieldAlert, Download, Package, Loader2, CreditCard, Ticket, Check, AlertCircle, QrCode, Sparkles
} from 'lucide-react';
import { getCsrfHeaders } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
    },
    {
        title: 'My Invitation Website',
        href: '/customer/mini-websites',
    },
];

interface CustomerMiniWebsite {
    id: number;
    uuid?: string;
    type: 'invitation' | 'business';
    title: string;
    slug: string;
    theme: string;
    is_published: boolean;
    expires_at: string | null;
    template?: {
        id: number;
        uuid?: string;
        name: string;
        price: string | number;
    };
    rsvps_count: number;
    contact_submissions_count: number;
}

interface MiniWebTemplate {
    id: number;
    uuid?: string;
    name: string;
    type: 'invitation' | 'business';
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    websites: CustomerMiniWebsite[];
    templates: MiniWebTemplate[];
}

export default function MiniWebsitesIndex({ auth, websites, templates = [] }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    // QR Code Customizer Modal state
    // developed by dinesh tawade
    const [isQROpen, setIsQROpen] = useState(false);
    const [selectedQRWebsite, setSelectedQRWebsite] = useState<CustomerMiniWebsite | null>(null);
    const [qrTheme, setQrTheme] = useState<'gold' | 'black'>('gold');
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);

    const handleOpenQRModal = (website: CustomerMiniWebsite) => {
        setSelectedQRWebsite(website);
        setIsQROpen(true);
    };

    // Renewal Checkout States
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutWebsite, setCheckoutWebsite] = useState<CustomerMiniWebsite | null>(null);
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

    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        template_id: templates[0]?.id || '',
        slug: '',
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('template_id');
        if (templateId && templates.some(tpl => tpl.id === Number(templateId))) {
            setData((prev) => ({
                ...prev,
                template_id: Number(templateId),
            }));
            setIsOpen(true);
            // Clear URL parameter so refreshing doesn't reopen it
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [templates]);

    const handleTitleChange = (val: string) => {
        const cleanSlug = val
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-')         // Replace spaces with dash
            .replace(/-+/g, '-')          // Replace duplicate dashes
            .trim();

        setData((prev) => ({
            ...prev,
            title: val,
            slug: cleanSlug,
        }));
    };

    const handleOpenAdd = () => {
        reset();
        if (templates.length > 0) {
            setData('template_id', templates[0].id);
        }
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customer/mini-websites', {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (id: string | number) => {
        if (confirm('Are you sure you want to delete this website? All submission data (RSVPs/Messages) will be permanently lost.')) {
            router.delete(`/customer/mini-websites/${id}`);
        }
    };

    // Generate & Download styled QR Code (Royal Gold or Sleek Black)
    // developed by dinesh tawade
    const handleDownloadQR = async (w: CustomerMiniWebsite, theme: 'gold' | 'black' = 'gold') => {
        try {
            setIsGeneratingQR(true);
            const url = `${window.location.origin}/mini-website/${w.slug}`;

            // High error correction (ecLevel=H) with custom dark color
            const darkColor = theme === 'gold' ? 'c59b27' : '111111';
            const qrUrl = `https://quickchart.io/qr?size=600&text=${encodeURIComponent(url)}&dark=${darkColor}&light=ffffff&margin=1&ecLevel=H`;

            const img = new Image();
            img.crossOrigin = 'Anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = qrUrl;
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas not supported');

            const width = 640;
            const height = 820;
            canvas.width = width;
            canvas.height = height;

            if (theme === 'gold') {
                // ROYAL 3D GOLD THEME
                const bgGrad = ctx.createLinearGradient(0, 0, width, height);
                bgGrad.addColorStop(0, '#ffffff');
                bgGrad.addColorStop(0.5, '#fcfaf6');
                bgGrad.addColorStop(1, '#f7f2e7');
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, width, height);

                // Luxury Double Border with Gold Shimmer
                const goldGrad = ctx.createLinearGradient(0, 0, width, height);
                goldGrad.addColorStop(0, '#d4af37');
                goldGrad.addColorStop(0.3, '#f4d068');
                goldGrad.addColorStop(0.6, '#aa7c11');
                goldGrad.addColorStop(1, '#e5c158');

                ctx.strokeStyle = goldGrad;
                ctx.lineWidth = 4;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(24, 24, width - 48, height - 48, 28);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(24, 24, width - 48, height - 48);
                }

                ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
                ctx.lineWidth = 1;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(32, 32, width - 64, height - 64, 22);
                    ctx.stroke();
                }

                // Header Badge
                ctx.fillStyle = '#f7ecc9';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width / 2 - 95, 52, 190, 32, 16);
                    ctx.fill();
                    ctx.strokeStyle = '#d4af37';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
                ctx.fillStyle = '#7a5b10';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('✨ WEDDING INVITATION ✨', width / 2, 72);

                // Title Text
                ctx.fillStyle = '#2b210e';
                ctx.font = 'bold 30px "Playfair Display", Georgia, serif';
                ctx.fillText('Scan to Celebrate', width / 2, 122);

                ctx.fillStyle = '#80683a';
                ctx.font = '500 16px sans-serif';
                ctx.fillText(w.title.length > 35 ? w.title.substring(0, 32) + '...' : w.title, width / 2, 150);

                // QR Container Card
                ctx.shadowColor = 'rgba(180, 140, 60, 0.2)';
                ctx.shadowBlur = 24;
                ctx.shadowOffsetY = 10;
                ctx.fillStyle = '#ffffff';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(85, 185, 470, 470, 24);
                    ctx.fill();
                    ctx.shadowColor = 'transparent';
                    ctx.strokeStyle = '#e6c875';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.fillRect(85, 185, 470, 470);
                }
                ctx.shadowColor = 'transparent';

                // Draw QR Code
                ctx.drawImage(img, 105, 205, 430, 430);

                // Slug Pill
                ctx.fillStyle = '#fbf5e6';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width / 2 - 160, 680, 320, 36, 18);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
                    ctx.stroke();
                }
                ctx.fillStyle = '#8c702a';
                ctx.font = 'bold 13px monospace';
                ctx.fillText(`/${w.slug}`, width / 2, 703);

                // Footer Text
                ctx.fillStyle = '#b3a08b';
                ctx.font = '600 13px sans-serif';
                ctx.fillText('Created with Invitify.com', width / 2, 755);

            } else {
                // SLEEK MODERN BLACK THEME
                const darkBg = ctx.createLinearGradient(0, 0, width, height);
                darkBg.addColorStop(0, '#141416');
                darkBg.addColorStop(1, '#0a0a0c');
                ctx.fillStyle = darkBg;
                ctx.fillRect(0, 0, width, height);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.lineWidth = 2;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(24, 24, width - 48, height - 48, 28);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(24, 24, width - 48, height - 48);
                }

                // Header Badge
                ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width / 2 - 80, 52, 160, 32, 16);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                ctx.fillStyle = '#e5e7eb';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('DIGITAL INVITATION', width / 2, 72);

                // Title Text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 30px sans-serif';
                ctx.fillText('Scan to View', width / 2, 122);

                ctx.fillStyle = '#9ca3af';
                ctx.font = '500 16px sans-serif';
                ctx.fillText(w.title.length > 35 ? w.title.substring(0, 32) + '...' : w.title, width / 2, 150);

                // QR Container Card
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 30;
                ctx.shadowOffsetY = 12;
                ctx.fillStyle = '#ffffff';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(85, 185, 470, 470, 24);
                    ctx.fill();
                    ctx.shadowColor = 'transparent';
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.fillRect(85, 185, 470, 470);
                }
                ctx.shadowColor = 'transparent';

                // Draw QR Code
                ctx.drawImage(img, 105, 205, 430, 430);

                // URL pill
                ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width / 2 - 160, 680, 320, 36, 18);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
                    ctx.stroke();
                }
                ctx.fillStyle = '#d1d5db';
                ctx.font = 'bold 13px monospace';
                ctx.fillText(`/${w.slug}`, width / 2, 703);

                // Footer Text
                ctx.fillStyle = '#6b7280';
                ctx.font = '600 13px sans-serif';
                ctx.fillText('Invitify Digital Invite', width / 2, 755);
            }

            canvas.toBlob((blob) => {
                if (!blob) {
                    setIsGeneratingQR(false);
                    return;
                }
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${w.slug}-QR-${theme.toUpperCase()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                setIsGeneratingQR(false);
            }, 'image/png');

        } catch (error) {
            console.error('Failed to download QR Code', error);
            setIsGeneratingQR(false);
            alert('Failed to generate QR code. Please check your network and try again.');
        }
    };

    const isWebsiteActive = (w: CustomerMiniWebsite) => {
        const isFree = w.template && parseFloat(String(w.template.price)) === 0;
        const isNotExpired = w.expires_at && new Date(w.expires_at) >= new Date();
        return isFree || isNotExpired;
    };

    // Renewal Checkout Logic
    const handleOpenCheckout = (website: CustomerMiniWebsite) => {
        setCheckoutWebsite(website);
        setDurationUnit('days');
        setDurationMode('30');
        setCustomDays(30);
        setCustomWeeks(4);
        setReferralCode('');
        setAppliedDiscount(0);
        setCouponMessage('');
        setIsValidCoupon(false);
        setIsCheckoutOpen(true);
    };

    const handleUnitChange = (unit: 'days' | 'weeks') => {
        setDurationUnit(unit);
        if (unit === 'days') {
            setDurationMode('30');
            setCustomDays(30);
        } else {
            setDurationMode('4');
            setCustomWeeks(4);
        }
    };

    const getDaysValue = () => {
        if (durationUnit === 'days') {
            if (durationMode === 'custom') {
                return Math.max(1, customDays);
            }
            return parseInt(durationMode, 10);
        } else {
            const weeks = durationMode === 'custom' ? Math.max(1, customWeeks) : parseInt(durationMode, 10);
            return weeks * 7;
        }
    };

    // developed by dinesh tawade
    const dailyPrice = checkoutWebsite?.template?.price ? parseFloat(String(checkoutWebsite.template.price)) : 100;
    const days = getDaysValue();
    const subtotal = days * dailyPrice;
    const discountDeduction = appliedDiscount > 0 ? Math.round(subtotal * (appliedDiscount / 100) * 100) / 100 : 0;
    const finalAmount = Math.max(0, subtotal - discountDeduction);

    const handleApplyCoupon = async () => {
        if (!referralCode.trim()) return;
        setIsApplyingCode(true);
        setCouponMessage('');
        try {
            const response = await fetch('/apply-referral', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ code: referralCode.trim() })
            });
            const data = await response.json();
            if (response.ok && data.valid) {
                setAppliedDiscount(parseFloat(String(data.discount_percentage)));
                setCouponMessage(`Success! Code ${data.code} applied. (${data.discount_percentage}% discount)`);
                setIsValidCoupon(true);
            } else {
                setAppliedDiscount(0);
                setCouponMessage(data.message || 'Invalid or expired referral code.');
                setIsValidCoupon(false);
            }
        } catch (e) {
            setAppliedDiscount(0);
            setCouponMessage('Error validating referral code.');
            setIsValidCoupon(false);
        } finally {
            setIsApplyingCode(false);
        }
    };

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

    const handleConfirmRenewal = async () => {
        if (!checkoutWebsite) return;
        setIsCheckingOut(true);
        try {
            const response = await fetch(`/customer/mini-websites/${checkoutWebsite.id}/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...getCsrfHeaders()
                },
                body: JSON.stringify({
                    days: days,
                    referral_code: isValidCoupon ? referralCode : ''
                })
            });

            if (!response.ok) {
                let errorMsg = 'Failed to initiate payment.';
                try {
                    const data = await response.json();
                    errorMsg = data.error || errorMsg;
                } catch (e) { }
                alert(errorMsg);
                setIsCheckingOut(false);
                return;
            }

            const orderData = await response.json();

            if (orderData.mock) {
                router.post(`/customer/mini-websites/${checkoutWebsite.id}/verify-payment`, {
                    mock: true
                }, {
                    onSuccess: () => {
                        setIsCheckoutOpen(false);
                        setIsCheckingOut(false);
                    },
                    onError: () => {
                        setIsCheckingOut(false);
                    }
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
                    description: `Hosting Renewal for ${checkoutWebsite.title}`,
                    order_id: orderData.order_id,
                    handler: function (response: any) {
                        router.post(`/customer/mini-websites/${checkoutWebsite.id}/verify-payment`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            mock: false
                        }, {
                            onSuccess: () => {
                                setIsCheckoutOpen(false);
                                setIsCheckingOut(false);
                            },
                            onError: () => {
                                setIsCheckingOut(false);
                            }
                        });
                    },
                    prefill: {
                        name: auth?.user?.name || '',
                        email: auth?.user?.email || '',
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
        } catch (e: any) {
            alert(e.message || 'An unexpected error occurred.');
            setIsCheckingOut(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Invitation Website" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-white">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                            My Invitation Website <Globe className="size-6 text-blue-600" />
                        </h1>
                        <p className="text-gray-500">
                            Build, customize and host single-page invitations or multi-page business websites.
                        </p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 font-semibold">
                        <Plus className="size-4.5" /> Create Website
                    </Button>
                </div>

                {/* Listing Grid */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Title & Slug</th>
                                    <th scope="col" className="px-6 py-4">Type</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4">Hosting Status</th>
                                    <th scope="col" className="px-6 py-4">Submissions</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {websites.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            No mini-websites created yet. Click "Create Website" to launch your first site.
                                        </td>
                                    </tr>
                                ) : (
                                    websites.map((w) => (
                                        <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{w.title}</div>
                                                <div className="text-xs text-gray-400 font-mono mt-0.5 select-all">
                                                    /mini-website/{w.slug}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${w.type === 'invitation'
                                                    ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                    }`}>
                                                    {w.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${w.is_published
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                    }`}>
                                                    <span className={`size-1.5 rounded-full ${w.is_published ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                                    {w.is_published ? 'Live' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {w.template && parseFloat(String(w.template.price)) === 0 ? (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200">
                                                        Lifetime Free
                                                    </span>
                                                ) : (
                                                    (() => {
                                                        const isExpired = !w.expires_at || new Date(w.expires_at) < new Date();
                                                        return (
                                                            <div className="flex flex-col gap-1.5 items-start">
                                                                {isExpired ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                                                        <ShieldAlert className="size-3.5 text-red-500" /> Expired
                                                                    </span>
                                                                ) : (
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs font-semibold text-gray-700">Active</span>
                                                                        <span className="text-[10px] text-gray-400">Expires: {new Date(w.expires_at!).toLocaleDateString()}</span>
                                                                    </div>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleOpenCheckout(w)}
                                                                    className="text-[10px] h-6 px-2 py-0.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-extrabold flex items-center justify-center transition-colors shadow-sm"
                                                                >
                                                                    {isExpired ? 'Purchase Hosting' : 'Renew Hosting'}
                                                                </button>
                                                            </div>
                                                        );
                                                    })()
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/customer/mini-websites/${w.uuid || w.id}/submissions`}
                                                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                                >
                                                    <MessageSquare className="size-4" />
                                                    {w.type === 'invitation'
                                                        ? `${w.rsvps_count || 0} RSVPs`
                                                        : `${w.contact_submissions_count || 0} Messages`
                                                    }
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-wrap justify-end gap-2 items-center">
                                                    {w.is_published && (
                                                        <a
                                                            href={`/mini-website/${w.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                                            title="View live site"
                                                        >
                                                            <ExternalLink className="size-3.5" /> View
                                                        </a>
                                                    )}
                                                    {isWebsiteActive(w) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenQRModal(w)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100/70 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-xs hover:border-amber-400 hover:bg-amber-100 transition-all active:scale-95"
                                                            title="Download QR code in Gold or Black"
                                                        >
                                                            <QrCode className="size-3.5 text-amber-600" /> Download QR
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/customer/mini-websites/${w.uuid || w.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                                    >
                                                        <Pencil className="size-3.5" /> Edit
                                                    </Link>

                                                    <Button
                                                        onClick={() => handleDelete(w.uuid || w.id)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700"
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

            {/* Creation Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
                            Create Mini Website
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-3">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-gray-700 font-semibold">Website Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="E.g., Alexander & Sophia Wedding or Alpha Tech Consultancy"
                                required
                                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="template_id" className="text-gray-700 font-semibold">Choose Design Layout Template</Label>
                            <select
                                id="template_id"
                                value={data.template_id}
                                onChange={(e) => setData('template_id', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            >
                                {templates.map((tpl) => (
                                    <option key={tpl.id} value={tpl.id}>
                                        {tpl.name} ({tpl.type === 'invitation' ? 'Event RSVP' : 'Business'})
                                    </option>
                                ))}
                            </select>
                            {errors.template_id && <p className="text-xs text-red-500 mt-1">{errors.template_id}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug" className="text-gray-700 font-semibold">Desired URL Slug</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-2.5 rounded-md border border-gray-200">
                                    /mini-website/
                                </span>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    placeholder="alex-sophia-wedding"
                                    required
                                    className="font-mono border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                            <p className="text-[11px] text-gray-400">
                                Slugs should only contain letters, numbers, and dashes. E.g. `/mini-website/wedding-invitation-2026`.
                            </p>
                        </div>

                        <DialogFooter className="mt-4 gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                                {processing ? 'Creating...' : 'Create Website'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Hosting Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
                            <CreditCard className="size-5 text-blue-600" />
                            Hosting Subscription Checkout
                        </DialogTitle>
                    </DialogHeader>

                    {checkoutWebsite && (
                        <div className="flex flex-col gap-5 py-3 text-sm">
                            <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 flex flex-col gap-1">
                                <span className="text-xs text-gray-400 uppercase font-bold">Hosting Website</span>
                                <span className="font-bold text-gray-800">{checkoutWebsite.title}</span>
                                <span className="text-xs text-gray-500 font-mono">/mini-website/{checkoutWebsite.slug}</span>
                            </div>

                            {/* Duration Unit Selector */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs text-gray-500 uppercase font-bold">Select Billing Cycle</Label>
                                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => handleUnitChange('days')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${durationUnit === 'days'
                                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Daily Billing (Days)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUnitChange('weeks')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${durationUnit === 'weeks'
                                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Weekly Billing (Weeks)
                                    </button>
                                </div>
                            </div>

                            {/* Duration Selection */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs text-gray-500 uppercase font-bold">Select Hosting Duration</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {durationUnit === 'days' ? (
                                        <>
                                            {[1, 2, 3, 7, 30, 90].map((day) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => setDurationMode(String(day))}
                                                    className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${durationMode === String(day)
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className="text-sm">{day} Day{day > 1 ? 's' : ''}</span>
                                                    <span className="text-[10px] opacity-70 text-gray-500">₹{day * dailyPrice}</span>
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setDurationMode('custom')}
                                                className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${durationMode === 'custom'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                    }`}
                                            >
                                                <span className="text-sm">Custom Days</span>
                                                <span className="text-[10px] opacity-70 text-gray-500">Flexible</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {[1, 2, 4, 12, 26, 52].map((week) => (
                                                <button
                                                    key={week}
                                                    type="button"
                                                    onClick={() => setDurationMode(String(week))}
                                                    className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${durationMode === String(week)
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className="text-sm">{week} Week{week > 1 ? 's' : ''}</span>
                                                    <span className="text-[10px] opacity-70 text-gray-500">₹{week * 7 * dailyPrice}</span>
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setDurationMode('custom')}
                                                className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${durationMode === 'custom'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                    }`}
                                            >
                                                <span className="text-sm">Custom Weeks</span>
                                                <span className="text-[10px] opacity-70 text-gray-500">Flexible</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="mt-3 flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 animate-fadeIn">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-gray-500 font-bold uppercase">Or enter manually ({durationUnit === 'days' ? 'Days' : 'Weeks'})</Label>
                                        {durationMode !== 'custom' && (
                                            <span className="text-[10px] text-gray-400 font-semibold">
                                                (Currently using preset)
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={durationMode === 'custom' ? (durationUnit === 'days' ? customDays : customWeeks) : (durationUnit === 'days' ? days : days / 7)}
                                            onChange={(e) => {
                                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                                if (durationUnit === 'days') {
                                                    setCustomDays(val);
                                                } else {
                                                    setCustomWeeks(val);
                                                }
                                                setDurationMode('custom');
                                            }}
                                            className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 font-semibold cursor-pointer"
                                        >
                                            {durationUnit === 'days' ? (
                                                Array.from({ length: 30 }, (_, i) => i + 1)
                                                    .concat([45, 60, 90, 120, 180, 270, 365])
                                                    .map(d => (
                                                        <option key={d} value={d}>
                                                            {d} {d === 1 ? 'Day' : 'Days'}
                                                        </option>
                                                    ))
                                            ) : (
                                                Array.from({ length: 12 }, (_, i) => i + 1)
                                                    .concat([16, 20, 24, 26, 36, 52])
                                                    .map(w => (
                                                        <option key={w} value={w}>
                                                            {w} {w === 1 ? 'Week' : 'Weeks'}
                                                        </option>
                                                    ))
                                            )}
                                        </select>

                                        <Input
                                            type="number"
                                            value={durationMode === 'custom' ? (durationUnit === 'days' ? customDays : customWeeks) : ''}
                                            onChange={(e) => {
                                                const val = Math.max(1, parseInt(e.target.value) || 0);
                                                if (durationUnit === 'days') {
                                                    setCustomDays(val || 1);
                                                } else {
                                                    setCustomWeeks(val || 1);
                                                }
                                                setDurationMode('custom');
                                            }}
                                            placeholder={durationMode === 'custom' ? "Custom" : "Type manual..."}
                                            min={1}
                                            className={`h-9 w-32 shrink-0 font-semibold bg-white transition-all ${durationMode === 'custom'
                                                ? 'border-blue-500 bg-blue-50/10 text-blue-700 focus:ring-blue-500'
                                                : 'border-gray-200'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                                    <Ticket className="size-3.5" /> Apply Referral/Coupon Code
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={referralCode}
                                        onChange={(e) => {
                                            setReferralCode(e.target.value);
                                            setCouponMessage('');
                                            setIsValidCoupon(false);
                                            setAppliedDiscount(0);
                                        }}
                                        placeholder="E.g., MYCOUPON10"
                                        className="h-9 font-bold uppercase tracking-wider border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={isApplyingCode || !referralCode.trim()}
                                        className="h-9 px-4 shrink-0 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                                    >
                                        {isApplyingCode ? <Loader2 className="size-4 animate-spin" /> : 'Apply'}
                                    </Button>
                                </div>
                                {couponMessage && (
                                    <p className={`text-xs font-semibold flex items-center gap-1 mt-1 ${isValidCoupon ? 'text-emerald-600' : 'text-red-500'
                                        }`}>
                                        {isValidCoupon ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                                        {couponMessage}
                                    </p>
                                )}
                            </div>

                            {/* Cost breakdown invoice */}
                            <div className="border-t border-gray-200 pt-4 mt-2 flex flex-col gap-2.5">
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>Daily Hosting Fee</span>
                                    <span className="font-semibold text-gray-700">₹{dailyPrice} / day</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>Subtotal ({durationUnit === 'weeks' ? `${days / 7} Weeks (${days} Days)` : `${days} Days`})</span>
                                    <span className="font-semibold text-gray-700">₹{subtotal}</span>
                                </div>
                                {discountDeduction > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600">
                                        <span className="flex items-center gap-1"><Ticket className="size-3.5" /> Referral Discount ({appliedDiscount}%)</span>
                                        <span className="font-bold">-₹{discountDeduction}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center border-t border-dashed border-gray-300 pt-3 text-base font-extrabold text-gray-900">
                                    <span>Total Payable</span>
                                    <span>₹{finalAmount}</span>
                                </div>
                            </div>

                            <DialogFooter className="mt-4 gap-2 border-t border-gray-200 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={isCheckingOut} className="border-gray-200 text-white hover:bg-gray-50">
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmRenewal}
                                    disabled={isCheckingOut || finalAmount <= 0}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" /> Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="size-4" /> Pay & Renew Hosting
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* QR Code Customizer & Download Dialog */}
            {/* developed by dinesh tawade */}
            <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
                <DialogContent className="max-w-md sm:max-w-lg max-h-[92vh] flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-0 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                    <DialogHeader className="p-4 sm:p-5 pb-3 sm:pb-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="size-9 sm:size-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                <QrCode className="size-4 sm:size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                                    Download QR Code
                                </DialogTitle>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                                    Choose color theme for printed invites & digital cards
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedQRWebsite && (
                        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
                            {/* Color / Theme Selector Cards */}
                            <div>
                                <label className="text-[11px] sm:text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2 block">
                                    Select QR Color Theme
                                </label>
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                    {/* Gold Theme Option */}
                                    <button
                                        type="button"
                                        onClick={() => setQrTheme('gold')}
                                        className={`group relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${qrTheme === 'gold'
                                            ? 'border-amber-500 bg-gradient-to-b from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-neutral-900 shadow-sm'
                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="size-7 sm:size-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-xs flex items-center justify-center text-white">
                                                <Sparkles className="size-3.5 sm:size-4" />
                                            </div>
                                            {qrTheme === 'gold' && (
                                                <span className="flex size-4 sm:size-5 items-center justify-center rounded-full bg-amber-500 text-white">
                                                    <Check className="size-2.5 sm:size-3 stroke-[3]" />
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                                                Royal Gold
                                                <span className="text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                                                    Luxury
                                                </span>
                                            </p>
                                        </div>
                                    </button>

                                    {/* Black Theme Option */}
                                    <button
                                        type="button"
                                        onClick={() => setQrTheme('black')}
                                        className={`group relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${qrTheme === 'black'
                                            ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="size-7 sm:size-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-xs flex items-center justify-center border border-neutral-700">
                                                <QrCode className="size-3.5 sm:size-4" />
                                            </div>
                                            {qrTheme === 'black' && (
                                                <span className="flex size-4 sm:size-5 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
                                                    <Check className="size-2.5 sm:size-3 stroke-[3]" />
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                                                Sleek Black
                                                <span className="text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                                    Modern
                                                </span>
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Live Card Preview Box */}
                            <div className="flex flex-col items-center justify-center">
                                <div
                                    className={`w-full max-w-[240px] sm:max-w-[260px] p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300 text-center shadow-md relative overflow-hidden ${qrTheme === 'gold'
                                        ? 'bg-gradient-to-b from-white via-[#fcfaf6] to-[#f7f2e7] border-2 border-amber-300/80 shadow-amber-900/10'
                                        : 'bg-gradient-to-b from-[#141416] to-[#0a0a0c] border border-neutral-700 shadow-black/50'
                                        }`}
                                >
                                    {/* Badge */}
                                    <div className="mb-1.5">
                                        <span
                                            className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${qrTheme === 'gold'
                                                ? 'bg-amber-100 text-amber-800 border border-amber-300/60'
                                                : 'bg-white/10 text-neutral-200 border border-white/15'
                                                }`}
                                        >
                                            {qrTheme === 'gold' ? '✨ Wedding Invitation ✨' : 'Digital Invitation'}
                                        </span>
                                    </div>

                                    <h4
                                        className={`font-bold text-sm sm:text-base line-clamp-1 ${qrTheme === 'gold' ? 'text-amber-950 font-serif' : 'text-white'
                                            }`}
                                    >
                                        Scan to Celebrate
                                    </h4>
                                    <p
                                        className={`text-[11px] truncate max-w-[190px] mx-auto mt-0.5 ${qrTheme === 'gold' ? 'text-amber-800/80' : 'text-neutral-400'
                                            }`}
                                    >
                                        {selectedQRWebsite.title}
                                    </p>

                                    {/* QR Image Box */}
                                    <div
                                        className={`my-2.5 p-2 rounded-xl sm:rounded-2xl mx-auto w-[150px] h-[150px] sm:w-[165px] sm:h-[165px] flex items-center justify-center shadow-xs ${qrTheme === 'gold'
                                            ? 'bg-white border-2 border-amber-200'
                                            : 'bg-white border border-neutral-200'
                                            }`}
                                    >
                                        <img
                                            src={`https://quickchart.io/qr?size=300&text=${encodeURIComponent(
                                                `${typeof window !== 'undefined' ? window.location.origin : ''}/mini-website/${selectedQRWebsite.slug}`
                                            )}&dark=${qrTheme === 'gold' ? 'c59b27' : '111111'}&light=ffffff&ecLevel=H&margin=1`}
                                            alt="QR Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Slug pill */}
                                    <div
                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-medium truncate max-w-[200px] ${qrTheme === 'gold'
                                            ? 'bg-amber-100/70 text-amber-900 border border-amber-300/50'
                                            : 'bg-white/5 text-neutral-300 border border-white/10'
                                            }`}
                                    >
                                        /{selectedQRWebsite.slug}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="p-3 sm:p-4 px-4 sm:px-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0 flex flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsQROpen(false)}
                            className="w-full sm:w-auto h-9 text-xs sm:text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={isGeneratingQR}
                            onClick={() => {
                                if (selectedQRWebsite) {
                                    handleDownloadQR(selectedQRWebsite, qrTheme);
                                }
                            }}
                            className={`w-full sm:flex-1 h-9 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 text-white shadow-sm ${qrTheme === 'gold'
                                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/20'
                                : 'bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
                                }`}
                        >
                            {isGeneratingQR ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" /> Generating High-Res PNG...
                                </>
                            ) : (
                                <>
                                    <Download className="size-4" /> Download {qrTheme === 'gold' ? 'Royal Gold' : 'Sleek Black'} QR (PNG)
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}