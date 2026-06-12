import { useState, useEffect } from 'react';
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
    Check, AlertCircle, Loader2 
} from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block } from '@/components/design-editor/types';

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    website: any;
}

export default function MiniWebsiteEdit({ auth, website }: PageProps) {
    const { data, setData, put, processing } = useForm({
        title: website.title,
        theme: website.theme,
        is_published: website.is_published,
        config: website.config || [] as Block[],
    });

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

    const handleSave = (callback?: () => void) => {
        put(`/customer/mini-websites/${website.id}`, {
            onSuccess: () => {
                if (callback) {
                    callback();
                } else {
                    alert('Website updated successfully.');
                }
            }
        });
    };

    // Trigger Save, then open checkout dialog
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

    const dailyPrice = website.template?.price ? parseFloat(String(website.template.price)) : 0;
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
            const resData = await response.json();
            if (response.ok && resData.valid) {
                setAppliedDiscount(parseFloat(String(resData.discount_percentage)));
                setCouponMessage(`Success! Code ${resData.code} applied. (${resData.discount_percentage}% discount)`);
                setIsValidCoupon(true);
            } else {
                setAppliedDiscount(0);
                setCouponMessage(resData.message || 'Invalid or expired referral code.');
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
        setIsCheckingOut(true);
        try {
            const response = await fetch(`/customer/mini-websites/${website.id}/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    days: days,
                    referral_code: isValidCoupon ? referralCode : ''
                })
            });

            if (!response.ok) {
                let errorMsg = 'Failed to initiate payment.';
                try {
                    const resData = await response.json();
                    errorMsg = resData.error || errorMsg;
                } catch (e) {}
                alert(errorMsg);
                setIsCheckingOut(false);
                return;
            }

            const orderData = await response.json();

            if (orderData.mock) {
                router.post(`/customer/mini-websites/${website.id}/verify-payment`, {
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
                    description: `Hosting Purchase for ${data.title}`,
                    order_id: orderData.order_id,
                    handler: function (response: any) {
                        router.post(`/customer/mini-websites/${website.id}/verify-payment`, {
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

    const isExpired = !website.expires_at || new Date(website.expires_at) < new Date();
    const isFree = website.template && parseFloat(String(website.template.price)) === 0;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/customer/dashboard' },
            { title: 'My Mini Websites', href: '/customer/mini-websites' },
            { title: website.title, href: `/customer/mini-websites/${website.id}/edit` },
        ]}>
            <Head title={`Edit: ${website.title}`} />
            
            <div className="flex flex-col h-[calc(100vh-4rem)]">
                {/* Header Navbar */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Globe className="size-6 text-pink-600" />
                        <div>
                            <h1 className="text-xl font-bold">{website.title}</h1>
                            <a href={`/mini-website/${website.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                invitify.com/mini-website/{website.slug} <ExternalLink className="size-3" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 border-r pr-6">
                            <Label htmlFor="published" className="text-sm font-bold cursor-pointer">Published</Label>
                            <input 
                                type="checkbox"
                                id="published"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="size-4 rounded border-neutral-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-sm font-bold">Theme</Label>
                            <select 
                                value={data.theme} 
                                onChange={(e) => setData('theme', e.target.value)}
                                className="h-9 rounded-md border border-neutral-200 text-sm px-3 focus:ring-pink-500"
                            >
                                <option value="royal">Royal Event</option>
                                <option value="cozy">Cozy Warm</option>
                                <option value="ocean">Ocean Blue</option>
                                <option value="clean">Clean Minimal</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button onClick={() => handleSave()} disabled={processing} className="bg-neutral-800 hover:bg-neutral-900 text-white shadow-md">
                                <Save className="size-4 mr-2" /> Save Changes
                            </Button>

                            {!isFree && website.template && (
                                <Button 
                                    onClick={handleBuyClick} 
                                    disabled={processing || isCheckingOut} 
                                    className="bg-pink-600 hover:bg-pink-700 text-white shadow-md flex items-center gap-1.5 font-bold"
                                >
                                    <CreditCard className="size-4" /> 
                                    {isExpired ? 'Purchase Hosting' : 'Renew Hosting'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Body */}
                <SharedEditor 
                    blocks={data.config} 
                    onChange={(blocks) => setData('config', blocks)}
                    isInvitation={true}
                    title={data.title}
                    slug={website.slug}
                    isCustomerMode={true}
                />
            </div>

            {/* Hosting Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                            <CreditCard className="size-5 text-blue-600" />
                            Hosting Subscription Checkout
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-5 py-3 text-sm">
                        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-150 dark:border-neutral-850 flex flex-col gap-1">
                            <span className="text-xs text-neutral-400 uppercase font-bold">Hosting Website</span>
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">{data.title}</span>
                            <span className="text-xs text-neutral-500 font-mono">/mini-website/{website.slug}</span>
                        </div>

                        {/* Duration Unit Selector */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs text-neutral-500 uppercase font-bold">Select Billing Cycle</Label>
                            <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border">
                                <button
                                    type="button"
                                    onClick={() => handleUnitChange('days')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                        durationUnit === 'days'
                                            ? 'bg-white dark:bg-neutral-800 text-blue-600 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                                            : 'text-neutral-500 hover:text-neutral-850'
                                    }`}
                                >
                                    Daily Billing (Days)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUnitChange('weeks')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                        durationUnit === 'weeks'
                                            ? 'bg-white dark:bg-neutral-800 text-blue-600 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                                            : 'text-neutral-500 hover:text-neutral-850'
                                    }`}
                                >
                                    Weekly Billing (Weeks)
                                </button>
                            </div>
                        </div>

                        {/* Duration Selection */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs text-neutral-500 uppercase font-bold">Select Hosting Duration</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {durationUnit === 'days' ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('1')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '1'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">1 Day</span>
                                            <span className="text-[10px] opacity-70">₹{1 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('2')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '2'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">2 Days</span>
                                            <span className="text-[10px] opacity-70">₹{2 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('3')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '3'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">3 Days</span>
                                            <span className="text-[10px] opacity-70">₹{3 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('7')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '7'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">7 Days</span>
                                            <span className="text-[10px] opacity-70">₹{7 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('30')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '30'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">30 Days</span>
                                            <span className="text-[10px] opacity-70">₹{30 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('90')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '90'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">90 Days</span>
                                            <span className="text-[10px] opacity-70">₹{90 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('custom')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === 'custom'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">Custom Days</span>
                                            <span className="text-[10px] opacity-70">Flexible duration</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('1')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '1'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">1 Week</span>
                                            <span className="text-[10px] opacity-70">₹{1 * 7 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('2')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '2'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">2 Weeks</span>
                                            <span className="text-[10px] opacity-70">₹{2 * 7 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('4')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '4'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">4 Weeks</span>
                                            <span className="text-[10px] opacity-70">₹{4 * 7 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('12')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '12'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">12 Weeks</span>
                                            <span className="text-[10px] opacity-70">₹{12 * 7 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('26')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === '26'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">26 Weeks</span>
                                            <span className="text-[10px] opacity-70">₹{26 * 7 * dailyPrice}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationMode('custom')}
                                            className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                                                durationMode === 'custom'
                                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                            }`}
                                        >
                                            <span className="text-sm">Custom Weeks</span>
                                            <span className="text-[10px] opacity-70">Flexible duration</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="mt-3 flex flex-col gap-2 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-neutral-505 dark:text-neutral-400 font-bold uppercase">Or enter manually ({durationUnit === 'days' ? 'Days' : 'Weeks'})</Label>
                                    {durationMode !== 'custom' && (
                                        <span className="text-[10px] text-neutral-400 font-semibold">
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
                                        className="flex h-9 w-full rounded-md border border-neutral-200 bg-white dark:bg-neutral-900 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold cursor-pointer"
                                    >
                                        {durationUnit === 'days' ? (
                                            Array.from({ length: 30 }, (_, i) => i + 1)
                                                .concat([45, 60, 90, 120, 180, 270, 365])
                                                .map(d => (
                                                    <option key={d} value={d} className="dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
                                                        {d} {d === 1 ? 'Day' : 'Days'}
                                                    </option>
                                                ))
                                        ) : (
                                            Array.from({ length: 12 }, (_, i) => i + 1)
                                                .concat([16, 20, 24, 26, 36, 52])
                                                .map(w => (
                                                    <option key={w} value={w} className="dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
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
                                        className={`h-9 w-32 shrink-0 font-semibold bg-white dark:bg-neutral-900 transition-all ${
                                            durationMode === 'custom' 
                                                ? 'border-blue-500 bg-blue-50/10 text-blue-700 dark:text-blue-400' 
                                                : 'border-neutral-200'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Coupon Section */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs text-neutral-500 uppercase font-bold flex items-center gap-1">
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
                                    className="h-9 font-bold uppercase tracking-wider"
                                />
                                <Button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={isApplyingCode || !referralCode.trim()}
                                    className="h-9 px-4 shrink-0 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
                                >
                                    {isApplyingCode ? <Loader2 className="size-4 animate-spin" /> : 'Apply'}
                                </Button>
                            </div>
                            {couponMessage && (
                                <p className={`text-xs font-semibold flex items-center gap-1 mt-1 ${
                                    isValidCoupon ? 'text-emerald-600 dark:text-emerald-450' : 'text-red-500'
                                }`}>
                                    {isValidCoupon ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                                    {couponMessage}
                                </p>
                            )}
                        </div>

                        {/* Cost breakdown invoice */}
                        <div className="border-t pt-4 mt-2 flex flex-col gap-2.5">
                            <div className="flex justify-between items-center text-neutral-500">
                                <span>Daily Hosting Fee</span>
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">₹{dailyPrice} / day</span>
                            </div>
                            <div className="flex justify-between items-center text-neutral-500">
                                <span>Subtotal ({durationUnit === 'weeks' ? `${days / 7} Weeks (${days} Days)` : `${days} Days`})</span>
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">₹{subtotal}</span>
                            </div>
                            {discountDeduction > 0 && (
                                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-450">
                                    <span className="flex items-center gap-1"><Ticket className="size-3.5"/> Referral Discount ({appliedDiscount}%)</span>
                                    <span className="font-bold">-₹{discountDeduction}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center border-t border-dashed pt-3 text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                <span>Total Payable</span>
                                <span>₹{finalAmount}</span>
                            </div>
                        </div>

                        <DialogFooter className="mt-4 gap-2 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={isCheckingOut}>
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
                                        <CreditCard className="size-4" /> Pay & Purchase Hosting
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
