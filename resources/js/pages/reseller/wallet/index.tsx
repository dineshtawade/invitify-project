import { useState, useRef } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
    Wallet, CreditCard, Banknote, Clock, Eye, Plus,
    ArrowRight, CheckCircle2, Copy, TrendingUp, ShieldCheck,
    ChevronLeft, AlertCircle, Sparkles, Lock, Receipt, FileText
} from 'lucide-react';
import { getCsrfHeaders } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reseller Dashboard', href: '/reseller/dashboard' },
    { title: 'My Wallet', href: '/reseller/wallet' },
];

interface WalletData { balance: number; status: string; }

interface ManualDeposit {
    id: number;
    amount: string;
    utr: string;
    screenshot_path: string;
    status: 'pending' | 'approved' | 'rejected';
    bonus_percentage: string;
    bonus_amount: string;
    admin_notes: string | null;
    created_at: string;
}

interface BankDetails {
    bank_name: string;
    account_holder: string;
    account_number: string;
    ifsc_code: string;
    upi_id: string;
    qr_code?: string;
    default_bonus: number;
}

interface TaxSettings {
    gst_enabled?: boolean;
    default_gst_rate?: number;
    cgst_percent?: number;
    sgst_percent?: number;
    company_state?: string;
}

interface WalletPageProps {
    wallet: WalletData;
    pendingDeposits: ManualDeposit[];
    bankDetails: BankDetails;
    taxSettings?: TaxSettings;
    resellerDetails?: any;
    auth: { user: { id: number; name: string; email: string } };
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} title="Copy" className="ml-1.5 text-emerald-400 hover:text-white transition-colors">
            {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
    );
}

export default function ResellerWallet({ wallet, pendingDeposits = [], bankDetails, taxSettings, resellerDetails, auth }: WalletPageProps) {
    const [isRechargeOpen, setIsRechargeOpen] = useState(false);
    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const [rechargeMethod, setRechargeMethod] = useState<'online' | 'manual' | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const { props } = usePage<any>();
    const flashStatus = props.flash?.status || (props as any).status;

    const onlineForm = useForm({ amount: '' });
    const manualForm = useForm({ amount: '', utr: '', screenshot: null as File | null });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // GST & Tax Configuration
    const resellerState = resellerDetails?.state || resellerDetails?.business_state || '';
    const companyState = taxSettings?.company_state || 'Maharashtra';
    const isInterState = Boolean(resellerState && resellerState.trim().toLowerCase() !== companyState.trim().toLowerCase());
    const gstRate = taxSettings?.default_gst_rate ? Number(taxSettings.default_gst_rate) : 18;
    const cgstPercent = taxSettings?.cgst_percent ? Number(taxSettings.cgst_percent) : (gstRate / 2);
    const sgstPercent = taxSettings?.sgst_percent ? Number(taxSettings.sgst_percent) : (gstRate / 2);

    const calculateGst = (amountVal: string | number) => {
        const num = parseFloat(String(amountVal)) || 0;
        if (num <= 0) {
            return {
                base: 0,
                tax: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
                total: 0,
                bonus: 0,
                bonusPercent: bankDetails.default_bonus || 0,
                totalCredit: 0,
                isValid: false,
            };
        }
        const base = num;
        const tax = Math.round(base * (gstRate / 100) * 100) / 100;
        const cgst = isInterState ? 0 : Math.round(base * (cgstPercent / 100) * 100) / 100;
        const sgst = isInterState ? 0 : Math.round((tax - cgst) * 100) / 100;
        const igst = isInterState ? tax : 0;
        const total = Math.round((base + tax) * 100) / 100;

        const bonusPercent = bankDetails.default_bonus || 0;
        const bonus = bonusPercent > 0 ? Math.round(base * (bonusPercent / 100) * 100) / 100 : 0;
        const totalCredit = Math.round((base + bonus) * 100) / 100;

        return {
            base,
            tax,
            cgst,
            sgst,
            igst,
            total,
            bonus,
            bonusPercent,
            totalCredit,
            isValid: num >= 100,
        };
    };

    const onlineGst = calculateGst(onlineForm.data.amount);
    const manualGst = calculateGst(manualForm.data.amount);

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            if ((window as any).Razorpay) { resolve(true); return; }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleOnlineRecharge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isCheckingOut) return;
        setIsCheckingOut(true);
        try {
            const response = await fetch('/reseller/recharge/razorpay', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({ amount: onlineForm.data.amount }),
            });
            if (!response.ok) {
                let msg = 'Failed to create payment order.';
                try {
                    const ct = response.headers.get('content-type');
                    if (ct?.includes('application/json')) {
                        const err = await response.json();
                        msg = err.error || msg;
                    }
                } catch (_) { }
                throw new Error(msg);
            }
            const orderData = await response.json();
            if (orderData.mock) {
                router.post('/reseller/recharge/verify', { mock: true }, {
                    onSuccess: () => { setIsRechargeOpen(false); onlineForm.reset(); setIsCheckingOut(false); },
                });
            } else {
                if (!(window as any).Razorpay) {
                    const loaded = await loadRazorpayScript();
                    if (!loaded) { alert('Failed to load Razorpay payment SDK.'); setIsCheckingOut(false); return; }
                }
                const rzp = new (window as any).Razorpay({
                    key: orderData.key_id,
                    amount: orderData.amount,
                    currency: 'INR',
                    name: 'Invitify Reseller Wallet',
                    description: `Wallet Recharge: ₹${onlineForm.data.amount} (+ GST = ₹${orderData.total_payable || (orderData.amount / 100)})`,
                    order_id: orderData.order_id,
                    handler: (response: any) => {
                        router.post('/reseller/recharge/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            mock: false,
                        }, {
                            onSuccess: () => { setIsRechargeOpen(false); onlineForm.reset(); setIsCheckingOut(false); },
                        });
                    },
                    prefill: { name: auth.user.name, email: auth.user.email },
                    theme: { color: '#6366f1' },
                    modal: { ondismiss: () => setIsCheckingOut(false) },
                });
                rzp.open();
            }
        } catch (error: any) {
            alert(error.message || 'An unexpected error occurred.');
            setIsCheckingOut(false);
        }
    };

    const handleManualRecharge = (e: React.FormEvent) => {
        e.preventDefault();
        manualForm.post('/reseller/recharge/manual', {
            onSuccess: () => { setIsRechargeOpen(false); manualForm.reset(); if (fileInputRef.current) fileInputRef.current.value = ''; },
        });
    };

    const openRecharge = () => { setRechargeMethod(null); setIsRechargeOpen(true); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Reseller Wallet" />

            <div className="p-6 xl:p-8 max-w-7xl mx-auto flex flex-col gap-8 w-full">

                {/* Flash success */}
                {flashStatus && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5 text-emerald-800 text-sm font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300">
                        <CheckCircle2 className="size-5 shrink-0" />
                        {flashStatus}
                    </div>
                )}

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Wallet className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Reseller Wallet
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Manage your wallet balance, recharge, and track deposit requests.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <Button
                            variant="outline"
                            onClick={() => setIsRulesOpen(true)}
                            className="border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-semibold shadow-sm flex items-center gap-2 rounded-xl px-4"
                        >
                            <Eye className="size-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Wallet Recharge Rules</span>
                        </Button>
                        <Button
                            onClick={openRecharge}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md flex items-center gap-2 rounded-xl px-5"
                        >
                            <Plus className="size-4" /> Recharge Wallet
                        </Button>
                    </div>
                </div>

                {/* Top Cards Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ===== Wallet Balance Card ===== */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white p-6 shadow-xl flex flex-col justify-between min-h-[200px]">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70">
                                    <Wallet className="size-4" />
                                    Available Balance
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsRulesOpen(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                                    title="View Wallet Recharge Rules"
                                >
                                    <Eye className="size-3.5" />
                                    Rules
                                </button>
                            </div>
                            <div className="text-5xl font-black tracking-tight">
                                Credits{wallet.balance.toFixed(2)}
                            </div>
                            {bankDetails.default_bonus > 0 && (
                                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <Sparkles className="size-3" />
                                    +{bankDetails.default_bonus}% bonus on every recharge
                                </div>
                            )}
                        </div>

                        <div className="relative z-10 mt-6">
                            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${wallet.status === 'active' ? 'bg-emerald-500/30 text-emerald-200' : 'bg-amber-500/30 text-amber-200'}`}>
                                <div className={`size-1.5 rounded-full ${wallet.status === 'active' ? 'bg-emerald-300' : 'bg-amber-300'} animate-pulse`} />
                                {wallet.status === 'active' ? 'Wallet Active' : wallet.status}
                            </div>
                        </div>
                    </div>

                    {/* ===== Bank Details Card ===== */}
                    <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-6 flex flex-col justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                                    <Banknote className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Bank Transfer & GST Billing</h3>
                                    <p className="text-xs text-neutral-400">Add funds with official GST tax invoice via NEFT · IMPS · UPI</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => { setRechargeMethod('manual'); setIsRechargeOpen(true); }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm flex items-center gap-2 rounded-xl text-xs px-4 self-start sm:self-auto"
                            >
                                <Banknote className="size-3.5" /> Transfer via Bank →
                            </Button>
                        </div>

                        <div className="rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 flex flex-col gap-3">
                            <div className="flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
                                <ShieldCheck className="size-4.5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Transparent GST Billing on Every Deposit</p>
                                    <p className="opacity-80 mt-0.5">
                                        When you recharge your wallet, enter your desired recharge amount. The system will calculate GST ({gstRate}%) and display the exact bank account details to complete the transfer.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-emerald-200/50 dark:border-emerald-900/30 text-[11px]">
                                <div className="flex items-center gap-2 bg-white/70 dark:bg-neutral-900/50 p-2 rounded-lg">
                                    <span className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">1</span>
                                    <span>Enter recharge amount</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/70 dark:bg-neutral-900/50 p-2 rounded-lg">
                                    <span className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">2</span>
                                    <span>Review GST billing breakdown</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/70 dark:bg-neutral-900/50 p-2 rounded-lg">
                                    <span className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">3</span>
                                    <span>Transfer & submit UTR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== Pending Manual Deposits ===== */}
                <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl text-amber-600 dark:text-amber-400">
                                <Clock className="size-4.5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Pending Deposit Requests</h2>
                                <p className="text-xs text-neutral-400">Awaiting admin approval</p>
                            </div>
                        </div>
                        {pendingDeposits.length > 0 && (
                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
                                {pendingDeposits.length} Pending
                            </span>
                        )}
                    </div>

                    {pendingDeposits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 gap-3 text-neutral-400">
                            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                <CheckCircle2 className="size-7 text-emerald-400" />
                            </div>
                            <p className="text-sm font-medium">No pending deposit requests</p>
                            <p className="text-xs text-neutral-400">All your submissions have been processed.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {pendingDeposits.map(req => (
                                <div key={req.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                            <TrendingUp className="size-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                                                    Credits{parseFloat(req.amount).toFixed(2)}
                                                </span>
                                                <span className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                    {req.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-0.5">
                                                UTR: <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">{req.utr}</span>
                                            </p>
                                            <p className="text-[10px] text-neutral-400 mt-0.5">
                                                Submitted {new Date(req.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-900 shrink-0"
                                        onClick={() => setScreenshotPreview(req.screenshot_path)}
                                    >
                                        <Eye className="size-3.5 mr-1" /> View Slip
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ===== RECHARGE DIALOG ===== */}
            <Dialog open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                                <Wallet className="size-5 text-indigo-600" />
                                Recharge Wallet
                            </DialogTitle>
                            <button
                                type="button"
                                onClick={() => setIsRulesOpen(true)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                                <Eye className="size-3.5" /> View Rules
                            </button>
                        </div>
                        <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                            {!rechargeMethod
                                ? 'Choose a payment method to add funds to your wallet.'
                                : rechargeMethod === 'online'
                                    ? 'Pay instantly via Razorpay — UPI, Card, or Net Banking.'
                                    : 'Make a bank transfer and submit the payment proof below.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 py-5">
                        {/* Step 1 — Choose Method */}
                        {!rechargeMethod && (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setRechargeMethod('online')}
                                    className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-500 p-6 transition-all duration-200 text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 flex items-center justify-center transition-colors">
                                        <CreditCard className="size-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm">Online Payment</p>
                                        <p className="text-xs text-neutral-400 mt-0.5">UPI · Card · Net Banking</p>
                                    </div>
                                    <ArrowRight className="absolute right-3 top-3 size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>

                                <button
                                    onClick={() => setRechargeMethod('manual')}
                                    className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 p-6 transition-all duration-200 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 flex items-center justify-center transition-colors">
                                        <Banknote className="size-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm">Bank Transfer</p>
                                        <p className="text-xs text-neutral-400 mt-0.5">NEFT · IMPS · UPI</p>
                                    </div>
                                    <ArrowRight className="absolute right-3 top-3 size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        )}

                        {/* Step 2a — Online Recharge */}
                        {rechargeMethod === 'online' && (
                            <form onSubmit={handleOnlineRecharge} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="online_amount" className="text-sm font-semibold">
                                        Recharge Amount (₹)
                                    </Label>
                                    <Input
                                        id="online_amount"
                                        type="number"
                                        min={100}
                                        value={onlineForm.data.amount}
                                        onChange={e => onlineForm.setData('amount', e.target.value)}
                                        required
                                        placeholder="Enter amount to add to wallet (min ₹100)"
                                        className="h-11 text-base rounded-xl"
                                    />
                                    {bankDetails.default_bonus > 0 && (
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                                            <Sparkles className="size-3.5" />
                                            +{bankDetails.default_bonus}% bonus will be added to your wallet!
                                        </p>
                                    )}
                                </div>

                                {/* GST Billing Breakdown Card */}
                                {onlineGst.isValid && (
                                    <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 dark:bg-indigo-950/30 dark:border-indigo-900/50 p-4 space-y-2 text-xs animate-in fade-in duration-200">
                                        <div className="flex items-center justify-between font-bold text-indigo-900 dark:text-indigo-200 pb-1 border-b border-indigo-200/50 dark:border-indigo-900/30">
                                            <span className="flex items-center gap-1.5">
                                                <Receipt className="size-3.5 text-indigo-600" /> GST Billing Breakdown
                                            </span>
                                            <span className="text-[10px] font-normal uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                                                {isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST+SGST)'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-neutral-700 dark:text-neutral-300 pt-1">
                                            <span>Wallet Recharge Credit:</span>
                                            <span className="font-bold">Credits{onlineGst.base.toFixed(2)}</span>
                                        </div>

                                        {onlineGst.bonus > 0 && (
                                            <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Sparkles className="size-3" /> Bonus Credited (+{onlineGst.bonusPercent}%):
                                                </span>
                                                <span className="font-bold">+₹{onlineGst.bonus.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div className="border-t border-indigo-200/40 dark:border-indigo-900/30 pt-1.5 space-y-1 text-neutral-600 dark:text-neutral-400">
                                            {isInterState ? (
                                                <div className="flex justify-between items-center">
                                                    <span>IGST ({gstRate}%):</span>
                                                    <span>₹{onlineGst.igst.toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between items-center">
                                                        <span>CGST ({cgstPercent}%):</span>
                                                        <span>₹{onlineGst.cgst.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>SGST ({sgstPercent}%):</span>
                                                        <span>₹{onlineGst.sgst.toFixed(2)}</span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex justify-between items-center font-semibold text-neutral-800 dark:text-neutral-200">
                                                <span>Total Tax ({gstRate}%):</span>
                                                <span>₹{onlineGst.tax.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-sm font-black text-indigo-900 dark:text-indigo-100 border-t border-indigo-300 dark:border-indigo-800 pt-2">
                                            <span>Total Payable Amount:</span>
                                            <span className="text-base text-indigo-700 dark:text-indigo-300">₹{onlineGst.total.toFixed(2)}</span>
                                        </div>

                                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                                            * ₹{onlineGst.base.toFixed(2)} {onlineGst.bonus > 0 ? `(+ ₹${onlineGst.bonus.toFixed(2)} bonus = ₹${onlineGst.totalCredit.toFixed(2)})` : ''} will be credited to your wallet balance. An official GST tax invoice will be generated upon payment.
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl px-4 py-3">
                                    <ShieldCheck className="size-4 text-neutral-400 shrink-0" />
                                    Secure instant payment powered by Razorpay
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRechargeMethod(null)}
                                        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <ChevronLeft className="size-4" /> Back
                                    </button>
                                    <Button
                                        type="submit"
                                        disabled={isCheckingOut || !onlineGst.isValid}
                                        className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                                    >
                                        {isCheckingOut ? 'Processing…' : onlineGst.isValid ? `Pay ₹${onlineGst.total.toFixed(2)} via Razorpay →` : 'Pay Now →'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 2b — Manual Bank Transfer */}
                        {rechargeMethod === 'manual' && (
                            <form onSubmit={handleManualRecharge} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                                {/* Amount Input First */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="manual_amount" className="text-sm font-semibold">
                                        Wallet Recharge Amount (₹)
                                    </Label>
                                    <Input
                                        id="manual_amount"
                                        type="number"
                                        min={100}
                                        value={manualForm.data.amount}
                                        onChange={e => manualForm.setData('amount', e.target.value)}
                                        required
                                        placeholder="Enter desired wallet amount (min ₹100)"
                                        className="h-11 rounded-xl text-base"
                                    />
                                    {manualForm.errors.amount && <p className="text-red-500 text-xs">{manualForm.errors.amount}</p>}
                                    {bankDetails.default_bonus > 0 && (
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                                            <Sparkles className="size-3.5" />
                                            +{bankDetails.default_bonus}% bonus will be added to your wallet!
                                        </p>
                                    )}
                                </div>

                                {/* When Amount is NOT entered or < 100: Bank Details Locked */}
                                {!manualGst.isValid && (
                                    <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 p-5 text-center flex flex-col items-center justify-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500">
                                            <Lock className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                                                Bank Transfer Details Locked
                                            </p>
                                            <p className="text-[11px] text-neutral-400 mt-0.5 max-w-xs">
                                                Please enter your recharge amount (min ₹100) above to calculate GST and view official Bank Transfer & UPI details.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* When Amount is Entered & Valid: Show GST Breakdown & Reveal Bank Details */}
                                {manualGst.isValid && (
                                    <>
                                        {/* GST Breakdown Card */}
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/30 dark:border-emerald-900/50 p-4 space-y-2 text-xs animate-in fade-in duration-200">
                                            <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200 pb-1 border-b border-emerald-200/50 dark:border-emerald-900/30">
                                                <span className="flex items-center gap-1.5">
                                                    <Receipt className="size-3.5 text-emerald-600" /> GST Billing Summary
                                                </span>
                                                <span className="text-[10px] font-normal uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                                                    {isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST+SGST)'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center text-neutral-700 dark:text-neutral-300 pt-1">
                                                <span>Wallet Credit Amount:</span>
                                                <span className="font-bold">₹{manualGst.base.toFixed(2)}</span>
                                            </div>

                                            {manualGst.bonus > 0 && (
                                                <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Sparkles className="size-3" /> Bonus Credited (+{manualGst.bonusPercent}%):
                                                    </span>
                                                    <span className="font-bold">+₹{manualGst.bonus.toFixed(2)} (Total Wallet: ₹{manualGst.totalCredit.toFixed(2)})</span>
                                                </div>
                                            )}

                                            <div className="border-t border-emerald-200/40 dark:border-emerald-900/30 pt-1.5 space-y-1 text-neutral-600 dark:text-neutral-400">
                                                {isInterState ? (
                                                    <div className="flex justify-between items-center">
                                                        <span>IGST ({gstRate}%):</span>
                                                        <span>₹{manualGst.igst.toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-center">
                                                            <span>CGST ({cgstPercent}%):</span>
                                                            <span>₹{manualGst.cgst.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span>SGST ({sgstPercent}%):</span>
                                                            <span>₹{manualGst.sgst.toFixed(2)}</span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex justify-between items-center font-semibold text-neutral-800 dark:text-neutral-200">
                                                    <span>Total Tax ({gstRate}%):</span>
                                                    <span>₹{manualGst.tax.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center text-sm font-black text-emerald-950 dark:text-emerald-100 border-t border-emerald-300 dark:border-emerald-800 pt-2">
                                                <span>Total Amount to Transfer:</span>
                                                <span className="text-base text-emerald-700 dark:text-emerald-300 flex items-center">
                                                    ₹{manualGst.total.toFixed(2)}
                                                    <CopyButton value={manualGst.total.toFixed(2)} />
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bank Details Card (Revealed) */}
                                        {bankDetails.bank_name && (
                                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 text-xs text-emerald-800 dark:text-emerald-300 flex flex-col gap-3 animate-in fade-in duration-300">
                                                <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/50 dark:border-emerald-900/40">
                                                    <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                                                        <Banknote className="size-4 text-emerald-600" />
                                                        Transfer Exactly ₹{manualGst.total.toFixed(2)} to:
                                                    </p>
                                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                        Details Unlocked
                                                    </span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                                                        {[
                                                            { k: 'Bank', v: bankDetails.bank_name },
                                                            { k: 'Holder', v: bankDetails.account_holder },
                                                            { k: 'A/C No.', v: bankDetails.account_number },
                                                            { k: 'IFSC', v: bankDetails.ifsc_code },
                                                        ].map(item => (
                                                            <div key={item.k} className="bg-white/60 dark:bg-neutral-900/40 p-2 rounded-lg">
                                                                <span className="opacity-60 block text-[10px]">{item.k}</span>
                                                                <span className="font-bold flex items-center">
                                                                    {item.v || 'N/A'}
                                                                    {item.v && <CopyButton value={item.v} />}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {bankDetails.upi_id && (
                                                            <div className="col-span-2 bg-white/60 dark:bg-neutral-900/40 p-2 rounded-lg">
                                                                <span className="opacity-60 block text-[10px]">UPI ID</span>
                                                                <span className="font-bold flex items-center">
                                                                    {bankDetails.upi_id}
                                                                    <CopyButton value={bankDetails.upi_id} />
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {bankDetails.qr_code && (
                                                        <div className="shrink-0 p-2.5 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900 self-center sm:self-start text-center">
                                                            <img
                                                                src={bankDetails.qr_code.startsWith('http') || bankDetails.qr_code.startsWith('/') ? bankDetails.qr_code : `/${bankDetails.qr_code}`}
                                                                alt="Payment QR"
                                                                className="w-28 h-28 object-contain mx-auto rounded-lg cursor-pointer hover:scale-105 transition-transform"
                                                                title="Click to zoom QR Code"
                                                                onClick={() => setScreenshotPreview(bankDetails.qr_code?.startsWith('http') || bankDetails.qr_code?.startsWith('/') ? bankDetails.qr_code : `/${bankDetails.qr_code}`)}
                                                                onError={(e) => {
                                                                    (e.target as HTMLElement).style.display = 'none';
                                                                }}
                                                            />
                                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold block mt-1">Scan & Pay ₹{manualGst.total.toFixed(2)}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setScreenshotPreview(bankDetails.qr_code?.startsWith('http') || bankDetails.qr_code?.startsWith('/') ? bankDetails.qr_code : `/${bankDetails.qr_code}`)}
                                                                className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold mt-0.5 inline-block"
                                                            >
                                                                🔍 View Full QR
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* UTR Input */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="utr" className="text-sm font-semibold">UTR / Transaction Reference (12 digits)</Label>
                                            <Input
                                                id="utr"
                                                value={manualForm.data.utr}
                                                onChange={e => manualForm.setData('utr', e.target.value)}
                                                required
                                                placeholder="Enter 12-digit UTR reference number"
                                                className="h-11 rounded-xl font-mono"
                                            />
                                            {manualForm.errors.utr && <p className="text-red-500 text-xs">{manualForm.errors.utr}</p>}
                                        </div>

                                        {/* Screenshot Upload */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="screenshot" className="text-sm font-semibold">Payment Receipt Screenshot</Label>
                                            <div className="relative">
                                                <input
                                                    ref={fileInputRef}
                                                    id="screenshot"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => manualForm.setData('screenshot', e.target.files?.[0] || null)}
                                                    required
                                                    className="flex h-11 w-full rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 file:border-0 file:bg-transparent file:text-sm file:font-medium cursor-pointer hover:border-indigo-400 transition-colors"
                                                />
                                            </div>
                                            {manualForm.errors.screenshot && <p className="text-red-500 text-xs">{manualForm.errors.screenshot}</p>}
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setRechargeMethod(null)}
                                        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <ChevronLeft className="size-4" /> Back
                                    </button>
                                    <Button
                                        type="submit"
                                        disabled={manualForm.processing || !manualGst.isValid}
                                        className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                                    >
                                        {manualForm.processing ? 'Submitting…' : manualGst.isValid ? `Submit Deposit (₹${manualGst.total.toFixed(2)}) →` : 'Submit Request'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ===== RECHARGE RULES DIALOG ===== */}
            <Dialog open={isRulesOpen} onOpenChange={setIsRulesOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-transparent dark:from-indigo-950/30 dark:via-purple-950/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                                <Eye className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    Wallet Recharge Rules & Guidelines
                                </DialogTitle>
                                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                    वॉलेट रिचार्ज नियम एवं दिशा-निर्देश — कृपया रिचार्ज करने से पहले ध्यानपूर्वक पढ़ें
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6 space-y-3.5 text-sm">
                        {/* Rule 1: Minimum Amount */}
                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60">
                            <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                1
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                                        Minimum Recharge Amount (न्यूनतम रिचार्ज राशि)
                                    </h4>
                                    <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                                        Min ₹100
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                    Wallet recharge ke liye minimum amount <strong className="text-neutral-900 dark:text-neutral-100">₹100</strong> hai. Maximum limit koi nahi hai, aap apni zaroorat ke mutabiq recharge kar sakte hain.
                                </p>
                            </div>
                        </div>

                        {/* Rule 2: 18% GST & Invoicing */}
                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                            <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                2
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                                        18% GST Applicable & Official Tax Invoice
                                    </h4>
                                    <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                                        SAC: 998439
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                    Govt tax rules ke anusaar, sabhi wallet recharges par <strong className="text-neutral-900 dark:text-neutral-100">18% GST</strong> lagta hai (Maharashtra resellers ke liye 9% CGST + 9% SGST, aur other states ke liye 18% IGST).
                                </p>
                                <div className="mt-2 text-xs bg-white/90 dark:bg-neutral-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-neutral-600 dark:text-neutral-300 space-y-1">
                                    <p>• <strong>Net Balance:</strong> Aapke wallet me Base Recharge Amount (+ Bonus if applicable) credit hota hai. GST amount government remittance ke liye hota hai.</p>
                                    <p>• <strong>Tax Invoice:</strong> Har recharge ke baad official GST Tax Invoice generate hota hai jise aap apne <strong>Invoices</strong> section se PDF format me download kar sakte hain.</p>
                                </div>
                            </div>
                        </div>

                        {/* Rule 3: Online Recharge (Razorpay) */}
                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60">
                            <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                3
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                                        Online Payment (Instant Credit 24x7)
                                    </h4>
                                    <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                                        Instant 24x7
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                    Razorpay ke through UPI (GPay, PhonePe, Paytm), Debit/Credit Cards ya Net Banking se payment karne par wallet balance <strong className="text-neutral-900 dark:text-neutral-100">turant instant credit</strong> ho jata hai bina kisi manual approval ke.
                                </p>
                            </div>
                        </div>

                        {/* Rule 4: Bank Transfer / Manual Verification */}
                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                            <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                4
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                                        Bank Transfer (NEFT / IMPS / QR Code)
                                    </h4>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                                        15-60 Mins Approval
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 space-y-1 leading-relaxed">
                                    <p>• Recharge amount enter karne par screen par aayi exact <strong className="text-neutral-900 dark:text-neutral-100">Total Payable Amount (with GST)</strong> company bank account ya QR code par transfer karein.</p>
                                    <p>• Payment ke baad correct <strong>12-digit UTR Reference Number</strong> dalein aur payment receipt ka clear screenshot upload karein.</p>
                                    <p>• Admin verification <strong>15 se 60 minutes</strong> me (Working Hours 10 AM – 8 PM) complete ho jata hai aur wallet credit ho jata hai.</p>
                                </div>
                            </div>
                        </div>

                        {/* Rule 5: Tier Bonus Credits */}
                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                            <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                5
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                                        Recharge Bonus (अतिरिक्त बोनस क्रेडिट)
                                    </h4>
                                    <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full">
                                        +{bankDetails.default_bonus || 0}% Bonus
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                    Recharge bonus percentage aapke wallet credit me automatically add ho jata hai jisse aapko extra balance milta hai templates buy karne ke liye.
                                </p>
                            </div>
                        </div>

                        {/* Rule 6: Wallet Validity & Non-Refundable */}
                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60">
                            <div className="w-7 h-7 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0 font-bold text-xs">
                                6
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                                        Lifetime Validity & Usage (उपयोग एवं वैधता)
                                    </h4>
                                    <span className="text-[10px] bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 font-bold px-2 py-0.5 rounded-full">
                                        Lifetime
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                    • <strong>No Expiry:</strong> Wallet balance kabhi expire nahi hota. Aap jab chahein tab invitation templates, mini-websites, aur video builds buy karne ke liye use kar sakte hain.<br />
                                    • <strong>Non-Refundable:</strong> Wallet me add kiye gaye credits bank account me withdraw ya transfer nahi kiye ja sakte.
                                </p>
                            </div>
                        </div>

                        {/* Rule 7: Fraud Prevention & Dispute Support */}
                        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                            <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                7
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                                    Security & Support (सुरक्षा एवं सहायता)
                                </h4>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                    Fake ya duplicate UTR proof submit karne par reseller account permanently suspend ho sakta hai. Agar account se paise kat gaye hain aur wallet me add nahi huye, to Payment ID ya UTR ke saath support se sampark karein.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900 flex justify-end">
                        <Button
                            onClick={() => setIsRulesOpen(false)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-5 text-xs h-9"
                        >
                            I Understand (समझ गया)
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Screenshot / QR Preview Dialog */}
            <Dialog open={screenshotPreview !== null} onOpenChange={() => setScreenshotPreview(null)}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="text-base font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                                <Receipt className="size-4.5 text-indigo-600 dark:text-indigo-400" />
                                Payment Document Preview
                            </DialogTitle>
                            <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                                Bank payment slip / QR code document
                            </DialogDescription>
                        </div>
                        {screenshotPreview && (
                            <div className="flex items-center gap-2">
                                <a
                                    href={screenshotPreview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors inline-flex items-center gap-1.5"
                                >
                                    <Eye className="size-3.5" /> Full Size
                                </a>
                                <a
                                    href={screenshotPreview}
                                    download
                                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
                                >
                                    Download
                                </a>
                            </div>
                        )}
                    </DialogHeader>
                    <div className="p-4 bg-neutral-950 flex items-center justify-center min-h-[300px] max-h-[75vh] overflow-auto">
                        {screenshotPreview && (
                            <img
                                src={screenshotPreview.startsWith('http') || screenshotPreview.startsWith('/') ? screenshotPreview : `/${screenshotPreview}`}
                                alt="Payment Document"
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.alt = 'Document image could not be loaded';
                                }}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
