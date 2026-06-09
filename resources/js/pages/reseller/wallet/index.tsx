import { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Wallet, CreditCard, Banknote, Clock, Eye, ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reseller Dashboard',
        href: '/reseller/dashboard',
    },
    {
        title: 'My Wallet',
        href: '/reseller/wallet',
    },
];

interface WalletData {
    balance: number;
    status: string;
}

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
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function ResellerWallet({ wallet, pendingDeposits = [], bankDetails, auth }: WalletPageProps) {
    const [isRechargeOpen, setIsRechargeOpen] = useState(false);
    const [rechargeMethod, setRechargeMethod] = useState<'online' | 'manual' | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const onlineForm = useForm({
        amount: '',
    });

    const manualForm = useForm({
        amount: '',
        utr: '',
        screenshot: null as File | null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleOnlineRecharge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isCheckingOut) return;
        setIsCheckingOut(true);

        try {
            const response = await fetch('/reseller/recharge/razorpay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    amount: onlineForm.data.amount,
                }),
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
                throw new Error(errorMessage);
            }

            const orderData = await response.json();

            if (orderData.mock) {
                router.post('/reseller/recharge/verify', {
                    mock: true,
                }, {
                    onSuccess: () => {
                        setIsRechargeOpen(false);
                        onlineForm.reset();
                        setIsCheckingOut(false);
                    },
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
                    name: 'Invitify Reseller Wallet',
                    description: `Wallet Recharge: ₹${onlineForm.data.amount}`,
                    order_id: orderData.order_id,
                    handler: function (response: any) {
                        router.post('/reseller/recharge/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            mock: false,
                        }, {
                            onSuccess: () => {
                                setIsRechargeOpen(false);
                                onlineForm.reset();
                                setIsCheckingOut(false);
                            },
                        });
                    },
                    prefill: {
                        name: auth.user.name,
                        email: auth.user.email,
                    },
                    theme: {
                        color: '#6366f1',
                    },
                    modal: {
                        ondismiss: function () {
                            setIsCheckingOut(false);
                        },
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            }
        } catch (error: any) {
            console.error('Wallet recharge checkout error:', error);
            alert(error.message || 'An unexpected error occurred during recharge.');
            setIsCheckingOut(false);
        }
    };

    const handleManualRecharge = (e: React.FormEvent) => {
        e.preventDefault();
        manualForm.post('/reseller/recharge/manual', {
            onSuccess: () => {
                setIsRechargeOpen(false);
                manualForm.reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Reseller Wallet" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Wallet className="size-8 text-indigo-600" /> Wallet Manager
                        </h1>
                        <p className="text-neutral-500 mt-1">Recharge your reseller wallet and manage pending deposit requests.</p>
                    </div>
                </div>

                {/* Dashboard Stats / Wallet info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Wallet card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                        <div>
                            <div className="text-xs font-bold uppercase opacity-80 flex items-center gap-1">
                                <Wallet className="size-4" /> Available Balance
                            </div>
                            <div className="text-4xl font-black mt-2">₹{wallet.balance.toFixed(2)}</div>
                            {bankDetails.default_bonus > 0 && (
                                <div className="mt-1 text-xs bg-white/20 inline-block px-2 py-0.5 rounded-full backdrop-blur-xs">
                                    + {bankDetails.default_bonus}% Bonus on Recharges!
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={() => { setRechargeMethod(null); setIsRechargeOpen(true); }}
                            className="mt-6 bg-white text-indigo-700 hover:bg-neutral-50 border-0"
                        >
                            <Plus className="size-4 mr-2" /> Recharge Wallet
                        </Button>
                    </div>

                    {/* Bank Transfer Reference Panel */}
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 col-span-2">
                        <h3 className="text-base font-bold text-emerald-800 flex items-center gap-2">
                            <Banknote className="size-5" /> Bank Transfer payment Instructions
                        </h3>
                        {bankDetails.bank_name ? (
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-emerald-800">
                                <div>
                                    <p className="text-xs opacity-70">Bank Name</p>
                                    <p className="font-bold">{bankDetails.bank_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs opacity-70">Account Holder</p>
                                    <p className="font-bold">{bankDetails.account_holder}</p>
                                </div>
                                <div>
                                    <p className="text-xs opacity-70">Account Number</p>
                                    <p className="font-bold">{bankDetails.account_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs opacity-70">IFSC Code</p>
                                    <p className="font-bold">{bankDetails.ifsc_code}</p>
                                </div>
                                {bankDetails.upi_id && (
                                    <div className="col-span-2">
                                        <p className="text-xs opacity-70">UPI ID</p>
                                        <p className="font-bold">{bankDetails.upi_id}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-500 italic mt-3">Bank details not configured by administrator yet.</p>
                        )}
                    </div>
                </div>

                {/* Manual Deposit requests status */}
                <div className="border rounded-2xl p-6 max-w-4xl">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                        <Clock className="size-5 text-neutral-600" /> Pending Manual Recharge Requests
                    </h2>
                    {pendingDeposits.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic">No pending requests at the moment.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {pendingDeposits.map(req => (
                                <div key={req.id} className="border rounded-xl p-4 flex justify-between items-center text-sm gap-4 bg-neutral-50/50">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-indigo-700 text-lg">₹{parseFloat(req.amount).toFixed(2)}</span>
                                            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                {req.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-1">UTR: <span className="font-mono">{req.utr}</span></p>
                                        <p className="text-[10px] text-neutral-400 mt-0.5">Submitted {new Date(req.created_at).toLocaleString()}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs text-neutral-600 bg-white"
                                        onClick={() => setScreenshotPreview(req.screenshot_path)}
                                    >
                                        <Eye className="size-3.5 mr-1" /> View Slip
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recharge Dialog */}
                <Dialog open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Recharge Reseller Wallet</DialogTitle>
                            <DialogDescription>Choose a payment method to recharge your wallet balance.</DialogDescription>
                        </DialogHeader>

                        {!rechargeMethod ? (
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <Button
                                    onClick={() => setRechargeMethod('online')}
                                    variant="outline"
                                    className="h-28 flex flex-col gap-2 hover:border-indigo-600 hover:text-indigo-600"
                                >
                                    <CreditCard className="size-8" />
                                    <span>Online (Razorpay)</span>
                                </Button>
                                <Button
                                    onClick={() => setRechargeMethod('manual')}
                                    variant="outline"
                                    className="h-28 flex flex-col gap-2 hover:border-emerald-600 hover:text-emerald-600"
                                >
                                    <Banknote className="size-8" />
                                    <span>Manual Bank Transfer</span>
                                </Button>
                            </div>
                        ) : rechargeMethod === 'online' ? (
                            <form onSubmit={handleOnlineRecharge} className="flex flex-col gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="online_amount">Recharge Amount (₹)</Label>
                                    <Input
                                        id="online_amount"
                                        type="number"
                                        min={100}
                                        value={onlineForm.data.amount}
                                        onChange={e => onlineForm.setData('amount', e.target.value)}
                                        required
                                        placeholder="Enter amount (min ₹100)"
                                    />
                                </div>
                                <div className="flex justify-between gap-3 mt-4">
                                    <Button type="button" variant="outline" onClick={() => setRechargeMethod(null)}>Back</Button>
                                    <Button type="submit" disabled={isCheckingOut} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">
                                        {isCheckingOut ? 'Loading...' : 'Pay Online'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleManualRecharge} className="flex flex-col gap-4 py-4 max-h-[75vh] overflow-y-auto px-1">
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800 flex flex-col gap-1">
                                    <p className="font-bold mb-1">Super Admin Payment Details:</p>
                                    <p>Bank: <strong>{bankDetails.bank_name || 'N/A'}</strong></p>
                                    <p>Holder: <strong>{bankDetails.account_holder || 'N/A'}</strong></p>
                                    <p>A/C No: <strong>{bankDetails.account_number || 'N/A'}</strong></p>
                                    <p>IFSC Code: <strong>{bankDetails.ifsc_code || 'N/A'}</strong></p>
                                    {bankDetails.upi_id && <p>UPI ID: <strong>{bankDetails.upi_id}</strong></p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="manual_amount">Paid Amount (₹)</Label>
                                    <Input
                                        id="manual_amount"
                                        type="number"
                                        min={100}
                                        value={manualForm.data.amount}
                                        onChange={e => manualForm.setData('amount', e.target.value)}
                                        required
                                        placeholder="Enter deposited amount"
                                    />
                                    {manualForm.errors.amount && <p className="text-red-500 text-xs">{manualForm.errors.amount}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="utr">UTR / Transaction Reference Number</Label>
                                    <Input
                                        id="utr"
                                        value={manualForm.data.utr}
                                        onChange={e => manualForm.setData('utr', e.target.value)}
                                        required
                                        placeholder="Enter UTR reference"
                                    />
                                    {manualForm.errors.utr && <p className="text-red-500 text-xs">{manualForm.errors.utr}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="screenshot">Payment Receipt Screenshot</Label>
                                    <input
                                        ref={fileInputRef}
                                        id="screenshot"
                                        type="file"
                                        accept="image/*"
                                        onChange={e => manualForm.setData('screenshot', e.target.files?.[0] || null)}
                                        required
                                        className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium text-neutral-500"
                                    />
                                    {manualForm.errors.screenshot && <p className="text-red-500 text-xs">{manualForm.errors.screenshot}</p>}
                                </div>
                                <div className="flex justify-between gap-3 mt-4">
                                    <Button type="button" variant="outline" onClick={() => setRechargeMethod(null)}>Back</Button>
                                    <Button type="submit" disabled={manualForm.processing} className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                                        Submit Request
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Image Screenshot Preview Modal */}
                <Dialog open={screenshotPreview !== null} onOpenChange={() => setScreenshotPreview(null)}>
                    <DialogContent className="max-w-2xl p-2 bg-transparent border-0 shadow-none">
                        {screenshotPreview && (
                            <img src={screenshotPreview} alt="Payment Receipt Screenshot Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-lg bg-neutral-900" />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
