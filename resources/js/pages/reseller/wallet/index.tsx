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
    ChevronLeft, AlertCircle, Sparkles
} from 'lucide-react';

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
    default_bonus: number;
}

interface WalletPageProps {
    wallet: WalletData;
    pendingDeposits: ManualDeposit[];
    bankDetails: BankDetails;
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

export default function ResellerWallet({ wallet, pendingDeposits = [], bankDetails, auth }: WalletPageProps) {
    const [isRechargeOpen, setIsRechargeOpen] = useState(false);
    const [rechargeMethod, setRechargeMethod] = useState<'online' | 'manual' | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const { props } = usePage<any>();
    const flashStatus = props.flash?.status || (props as any).status;

    const getCsrf = () =>
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

    const onlineForm = useForm({ amount: '' });
    const manualForm = useForm({ amount: '', utr: '', screenshot: null as File | null });
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            const csrfToken = getCsrf();
            if (!csrfToken) {
                throw new Error('Security token missing. Please refresh the page and try again.');
            }

            const response = await fetch('/reseller/recharge/razorpay', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
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
                } catch (_) {}
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
                    description: `Wallet Recharge: ₹${onlineForm.data.amount}`,
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
                    <Button
                        onClick={openRecharge}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md flex items-center gap-2 rounded-xl px-5"
                    >
                        <Plus className="size-4" /> Recharge Wallet
                    </Button>
                </div>

                {/* Top Cards Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ===== Wallet Balance Card ===== */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white p-6 shadow-xl flex flex-col justify-between min-h-[200px]">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 mb-3">
                                <Wallet className="size-4" />
                                Available Balance
                            </div>
                            <div className="text-5xl font-black tracking-tight">
                                ₹{wallet.balance.toFixed(2)}
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
                    <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <Banknote className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Bank Transfer Details</h3>
                                <p className="text-xs text-neutral-400">Transfer funds to any of the below accounts</p>
                            </div>
                        </div>

                        {bankDetails.bank_name ? (
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-4">
                                {[
                                    { label: 'Bank Name', value: bankDetails.bank_name },
                                    { label: 'Account Holder', value: bankDetails.account_holder },
                                    { label: 'Account Number', value: bankDetails.account_number },
                                    { label: 'IFSC Code', value: bankDetails.ifsc_code },
                                ].map(item => (
                                    <div key={item.label}>
                                        <p className="text-xs text-neutral-400 mb-0.5">{item.label}</p>
                                        <p className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center">
                                            {item.value}
                                            <CopyButton value={item.value} />
                                        </p>
                                    </div>
                                ))}
                                {bankDetails.upi_id && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-neutral-400 mb-0.5">UPI ID</p>
                                        <p className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center">
                                            {bankDetails.upi_id}
                                            <CopyButton value={bankDetails.upi_id} />
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-neutral-400 italic bg-neutral-50 dark:bg-neutral-800/50 rounded-xl px-4 py-3 border border-neutral-100 dark:border-neutral-800">
                                <AlertCircle className="size-4 shrink-0" />
                                Bank details have not been configured by the administrator yet.
                            </div>
                        )}
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
                                                    ₹{parseFloat(req.amount).toFixed(2)}
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
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                            <Wallet className="size-5 text-indigo-600" />
                            Recharge Wallet
                        </DialogTitle>
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
                            <form onSubmit={handleOnlineRecharge} className="flex flex-col gap-5">
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
                                        placeholder="Enter amount (min ₹100)"
                                        className="h-11 text-base rounded-xl"
                                    />
                                    {bankDetails.default_bonus > 0 && (
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                                            <Sparkles className="size-3.5" />
                                            You'll get +{bankDetails.default_bonus}% bonus credited!
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl px-4 py-3">
                                    <ShieldCheck className="size-4 text-neutral-400 shrink-0" />
                                    Secure payment powered by Razorpay
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
                                        disabled={isCheckingOut}
                                        className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                                    >
                                        {isCheckingOut ? 'Processing…' : 'Pay Now →'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 2b — Manual Bank Transfer */}
                        {rechargeMethod === 'manual' && (
                            <form onSubmit={handleManualRecharge} className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
                                {/* Bank details reference */}
                                {bankDetails.bank_name && (
                                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 text-xs text-emerald-800 dark:text-emerald-300 flex flex-col gap-2">
                                        <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200 mb-1">Transfer To:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { k: 'Bank', v: bankDetails.bank_name },
                                                { k: 'Holder', v: bankDetails.account_holder },
                                                { k: 'A/C No.', v: bankDetails.account_number },
                                                { k: 'IFSC', v: bankDetails.ifsc_code },
                                            ].map(item => (
                                                <div key={item.k}>
                                                    <span className="opacity-60">{item.k}: </span>
                                                    <span className="font-bold">{item.v || 'N/A'}</span>
                                                </div>
                                            ))}
                                            {bankDetails.upi_id && (
                                                <div className="col-span-2">
                                                    <span className="opacity-60">UPI: </span>
                                                    <span className="font-bold">{bankDetails.upi_id}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="manual_amount" className="text-sm font-semibold">Paid Amount (₹)</Label>
                                    <Input
                                        id="manual_amount"
                                        type="number"
                                        min={100}
                                        value={manualForm.data.amount}
                                        onChange={e => manualForm.setData('amount', e.target.value)}
                                        required
                                        placeholder="Enter deposited amount"
                                        className="h-11 rounded-xl"
                                    />
                                    {manualForm.errors.amount && <p className="text-red-500 text-xs">{manualForm.errors.amount}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="utr" className="text-sm font-semibold">UTR / Transaction Reference</Label>
                                    <Input
                                        id="utr"
                                        value={manualForm.data.utr}
                                        onChange={e => manualForm.setData('utr', e.target.value)}
                                        required
                                        placeholder="12-digit UTR number"
                                        className="h-11 rounded-xl font-mono"
                                    />
                                    {manualForm.errors.utr && <p className="text-red-500 text-xs">{manualForm.errors.utr}</p>}
                                </div>

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
                                        disabled={manualForm.processing}
                                        className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                                    >
                                        {manualForm.processing ? 'Submitting…' : 'Submit Request'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Screenshot Preview Dialog */}
            <Dialog open={screenshotPreview !== null} onOpenChange={() => setScreenshotPreview(null)}>
                <DialogContent className="max-w-2xl p-2 bg-transparent border-0 shadow-none">
                    {screenshotPreview && (
                        <img
                            src={screenshotPreview}
                            alt="Payment Receipt"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-2xl bg-neutral-900"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
