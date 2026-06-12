import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    CreditCard, Ticket, Check, AlertCircle, Loader2, 
    Globe, LogIn, ShieldAlert, ArrowLeft, ExternalLink, Sparkles 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PageProps {
    website: {
        id: number;
        title: string;
        slug: string;
        theme: string;
        is_published: boolean;
        user_id: number;
        expires_at: string | null;
        template?: {
            id: number;
            name: string;
            price: string | number;
        } | null;
    };
    reason: string;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
}

export default function BuyHosting({ website, reason, auth }: PageProps) {
    const isOwner = auth.user && auth.user.id === website.user_id;

    // Checkout states
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
    const isFree = website.template && parseFloat(String(website.template.price)) === 0;

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
                    const data = await response.json();
                    errorMsg = data.error || errorMsg;
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
                    description: `Hosting Purchase for ${website.title}`,
                    order_id: orderData.order_id,
                    handler: function (res: any) {
                        router.post(`/customer/mini-websites/${website.id}/verify-payment`, {
                            razorpay_payment_id: res.razorpay_payment_id,
                            razorpay_order_id: res.razorpay_order_id,
                            razorpay_signature: res.razorpay_signature,
                            mock: false
                        }, {
                            onSuccess: () => {
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
                        color: '#db2777',
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
        <>
            <Head title={`${website.title} - Activate Hosting`} />
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden selection:bg-pink-600 selection:text-white">
                
                {/* Background Decor */}
                <div className="absolute top-1/4 left-1/4 size-96 bg-pink-600/10 rounded-full blur-3xl -z-10 animate-pulse duration-4000" />
                <div className="absolute bottom-1/4 right-1/4 size-96 bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse duration-6000" />

                <div className="w-full max-w-4xl bg-neutral-900/60 backdrop-blur-md rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden grid md:grid-cols-12">
                    
                    {/* Left Column: Website Details & Status */}
                    <div className="md:col-span-5 p-8 flex flex-col justify-between bg-neutral-950/40 border-b md:border-b-0 md:border-r border-neutral-800">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2 text-pink-500 font-extrabold text-sm uppercase tracking-widest">
                                <Globe className="size-4.5" />
                                invitify
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <h1 className="text-3xl font-black tracking-tight leading-tight">{website.title}</h1>
                                <a 
                                    href={`/mini-website/${website.slug}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 w-fit"
                                >
                                    invitify.com/mini-website/{website.slug} <ExternalLink className="size-3" />
                                </a>
                            </div>

                            <div className="rounded-2xl bg-neutral-900 border border-neutral-850 p-4 flex flex-col gap-2.5">
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Status details</span>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-amber-500/15 p-1.5 text-amber-500">
                                        <ShieldAlert className="size-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-neutral-250">{reason}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-850 text-xs text-neutral-400">
                            {auth.user ? (
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-emerald-500" />
                                    <span>Logged in as <strong>{auth.user.name}</strong></span>
                                </div>
                            ) : (
                                <span>Are you the owner of this website?</span>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Checkout or Access Gateway */}
                    <div className="md:col-span-7 p-8">
                        {isOwner ? (
                            isFree ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-10">
                                    <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                        <Sparkles className="size-8 animate-bounce" />
                                    </div>
                                    <div className="flex flex-col gap-2 max-w-sm">
                                        <h2 className="text-xl font-bold">Free Lifetime Website</h2>
                                        <p className="text-sm text-neutral-400 leading-normal">
                                            This website template is free and does not require hosting subscription payments.
                                        </p>
                                    </div>
                                    <Link 
                                        href={`/customer/mini-websites/${website.id}/edit`}
                                        className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm px-6 py-3 shadow-md flex items-center gap-2 transition-all"
                                    >
                                        Go to Editor & Publish Site
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <CreditCard className="size-5 text-pink-500" />
                                            Activate Website Hosting
                                        </h2>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Select your hosting plan duration to publish and make your website live.
                                        </p>
                                    </div>

                                    {/* Billing Cycle Tab */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Select Billing Cycle</Label>
                                        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                                            <button
                                                type="button"
                                                onClick={() => handleUnitChange('days')}
                                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                                    durationUnit === 'days'
                                                        ? 'bg-neutral-850 text-pink-500 shadow-sm border border-neutral-800'
                                                        : 'text-neutral-400 hover:text-neutral-250'
                                                }`}
                                            >
                                                Daily Billing (Days)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUnitChange('weeks')}
                                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                                    durationUnit === 'weeks'
                                                        ? 'bg-neutral-850 text-pink-500 shadow-sm border border-neutral-800'
                                                        : 'text-neutral-400 hover:text-neutral-250'
                                                }`}
                                            >
                                                Weekly Billing (Weeks)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Presets Grid */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Select Hosting Duration</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {durationUnit === 'days' ? (
                                                <>
                                                    {['1', '2', '3', '7', '30', 'custom'].map((val) => (
                                                        <button
                                                            key={val}
                                                            type="button"
                                                            onClick={() => setDurationMode(val)}
                                                            className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center justify-center gap-0.5 transition-all text-xs ${
                                                                durationMode === val
                                                                    ? 'border-pink-600 bg-pink-950/20 text-pink-400'
                                                                    : 'border-neutral-800 hover:bg-neutral-850'
                                                            }`}
                                                        >
                                                            <span>{val === 'custom' ? 'Custom Days' : `${val} ${val === '1' ? 'Day' : 'Days'}`}</span>
                                                            {val !== 'custom' && <span className="text-[10px] opacity-60">₹{parseInt(val) * dailyPrice}</span>}
                                                        </button>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    {['1', '2', '4', '12', '26', 'custom'].map((val) => (
                                                        <button
                                                            key={val}
                                                            type="button"
                                                            onClick={() => setDurationMode(val)}
                                                            className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center justify-center gap-0.5 transition-all text-xs ${
                                                                durationMode === val
                                                                    ? 'border-pink-600 bg-pink-950/20 text-pink-400'
                                                                    : 'border-neutral-800 hover:bg-neutral-850'
                                                            }`}
                                                        >
                                                            <span>{val === 'custom' ? 'Custom Weeks' : `${val} ${val === '1' ? 'Week' : 'Weeks'}`}</span>
                                                            {val !== 'custom' && <span className="text-[10px] opacity-60">₹{parseInt(val) * 7 * dailyPrice}</span>}
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom Input Fields */}
                                    {durationMode === 'custom' && (
                                        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/40 flex flex-col gap-4">
                                            {durationUnit === 'days' ? (
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="c_days" className="text-xs text-neutral-450 font-bold uppercase tracking-wider">Number of Days</Label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={customDays <= 30 ? customDays : 'manual'}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val !== 'manual') setCustomDays(Number(val));
                                                            }}
                                                            className="flex-1 h-10 rounded-lg border border-neutral-800 bg-neutral-900 text-xs px-3"
                                                        >
                                                            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                                                                <option key={d} value={d}>{d} Days</option>
                                                            ))}
                                                            <option value="manual">Enter Days Manually</option>
                                                        </select>
                                                        {(customDays > 30 || !Array.from({ length: 30 }, (_, i) => i + 1).includes(customDays)) && (
                                                            <Input
                                                                id="c_days"
                                                                type="number"
                                                                min="1"
                                                                value={customDays}
                                                                onChange={(e) => setCustomDays(Math.max(1, parseInt(e.target.value) || 1))}
                                                                className="w-24 text-center border-neutral-800 bg-neutral-900 h-10"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="c_weeks" className="text-xs text-neutral-450 font-bold uppercase tracking-wider">Number of Weeks</Label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={customWeeks <= 12 ? customWeeks : 'manual'}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val !== 'manual') setCustomWeeks(Number(val));
                                                            }}
                                                            className="flex-1 h-10 rounded-lg border border-neutral-800 bg-neutral-900 text-xs px-3"
                                                        >
                                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                                                                <option key={w} value={w}>{w} Weeks</option>
                                                            ))}
                                                            <option value="manual">Enter Weeks Manually</option>
                                                        </select>
                                                        {(customWeeks > 12 || !Array.from({ length: 12 }, (_, i) => i + 1).includes(customWeeks)) && (
                                                            <Input
                                                                id="c_weeks"
                                                                type="number"
                                                                min="1"
                                                                value={customWeeks}
                                                                onChange={(e) => setCustomWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                                                                className="w-24 text-center border-neutral-800 bg-neutral-900 h-10"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Coupon application */}
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="referral" className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Referral Code / Coupon</Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    id="referral"
                                                    type="text"
                                                    placeholder="ENTER CODE (e.g. PARTNER50)"
                                                    value={referralCode}
                                                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                                    disabled={isValidCoupon}
                                                    className="uppercase pr-10 border-neutral-800 bg-neutral-950 tracking-wider text-xs h-10"
                                                />
                                                {isValidCoupon && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                                                        <Check className="size-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                disabled={isApplyingCode || isValidCoupon || !referralCode.trim()}
                                                className="bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-lg px-4 border border-neutral-750 transition-colors disabled:opacity-50 h-10"
                                            >
                                                {isApplyingCode ? <Loader2 className="size-3.5 animate-spin" /> : 'Apply'}
                                            </button>
                                        </div>
                                        {couponMessage && (
                                            <span className={`text-[10px] font-semibold flex items-center gap-1 ${isValidCoupon ? 'text-emerald-400' : 'text-rose-455'}`}>
                                                <AlertCircle className="size-3" /> {couponMessage}
                                            </span>
                                        )}
                                    </div>

                                    {/* Invoice Summary */}
                                    <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col gap-2.5 text-xs text-neutral-400">
                                        <div className="flex justify-between">
                                            <span>Daily rate:</span>
                                            <span className="font-bold text-neutral-200">₹{dailyPrice} / day</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Duration:</span>
                                            <span className="font-bold text-neutral-200">{days} days</span>
                                        </div>
                                        <div className="flex justify-between border-t border-neutral-850 pt-2.5">
                                            <span>Subtotal:</span>
                                            <span className="font-semibold text-neutral-300">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        {discountDeduction > 0 && (
                                            <div className="flex justify-between text-emerald-400">
                                                <span>Coupon Discount ({appliedDiscount}%):</span>
                                                <span>- ₹{discountDeduction.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between border-t border-neutral-800 pt-2.5 text-sm font-black text-neutral-100">
                                            <span>Total Amount:</span>
                                            <span className="text-pink-500 text-base">₹{finalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Pay button */}
                                    <button
                                        type="button"
                                        onClick={handleConfirmRenewal}
                                        disabled={isCheckingOut || finalAmount < 0}
                                        className="w-full bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white font-bold text-sm py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {isCheckingOut ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Processing Order...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="size-4" />
                                                Pay & Activate Hosting
                                            </>
                                        )}
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-8 py-10">
                                <div className="rounded-full bg-neutral-950 p-6 border border-neutral-800 text-pink-500 shadow-inner">
                                    <LogIn className="size-12 animate-pulse" />
                                </div>

                                <div className="flex flex-col gap-2.5 max-w-sm">
                                    <h2 className="text-xl font-bold">Owner Access Required</h2>
                                    <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed">
                                        Only the creator of this website can activate hosting or modify the draft settings.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <a 
                                        href={`/login`}
                                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        <LogIn className="size-4" />
                                        Log In to Activate Hosting
                                    </a>
                                    <Link 
                                        href="/" 
                                        className="text-xs text-neutral-500 hover:text-neutral-350 font-bold transition-all flex items-center justify-center gap-1"
                                    >
                                        <ArrowLeft className="size-3.5" /> Back to Home
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
