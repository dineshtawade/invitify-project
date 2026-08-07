import { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Globe, Save, ExternalLink, CreditCard, Ticket, Check,
    AlertCircle, Loader2, Calendar, ShieldAlert, Sparkles
} from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block, WebsiteConfig } from '@/components/design-editor/types';

interface PageProps {
    wallet: {
        balance: number;
    };
    website: {
        id: number;
        title: string;
        slug: string;
        theme: string;
        is_published: boolean;
        is_purchased: boolean;
        reseller_price: number;
        expires_at: string | null;
        is_expired: boolean;
        config: Block[] | WebsiteConfig;
    };
    customBlocks?: any[];
}

export default function ResellerMiniWebsiteEdit({ wallet, website, customBlocks = [] }: PageProps) {
    const { data, setData, put, processing } = useForm({
        title: website.title,
        theme: website.theme,
        is_published: website.is_published,
        config: (website.config && !Array.isArray(website.config) && (website.config as any).pages)
            ? website.config as unknown as WebsiteConfig
            : { pages: [{ id: 'home', name: 'Home', blocks: Array.isArray(website.config) ? website.config : [] }] } as WebsiteConfig,
    });

    // Checkout Modal States
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [durationUnit, setDurationUnit] = useState<'days' | 'weeks'>('days');
    const [durationMode, setDurationMode] = useState<string>('30');
    const [customDays, setCustomDays] = useState(30);
    const [customWeeks, setCustomWeeks] = useState(4);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Template Purchase Checkout States
    const [isTemplateCheckoutOpen, setIsTemplateCheckoutOpen] = useState(false);
    const [isTemplatePurchasing, setIsTemplatePurchasing] = useState(false);

    const handleTemplatePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTemplatePurchasing(true);
        router.post(`/reseller/mini-websites/${website.id}/purchase-template`, {}, {
            onSuccess: () => {
                setIsTemplateCheckoutOpen(false);
                setIsTemplatePurchasing(false);
            },
            onError: () => {
                setIsTemplatePurchasing(false);
            }
        });
    };

    const handleSave = (callback?: () => void) => {
        put(`/reseller/mini-websites/${website.id}`, {
            onSuccess: () => {
                if (callback) {
                    callback();
                } else {
                    alert('Mini Website configurations saved successfully.');
                }
            }
        });
    };

    const handleBuyClick = () => {
        handleSave(() => {
            setDurationUnit('days');
            setDurationMode('30');
            setCustomDays(30);
            setCustomWeeks(4);
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

    const days = getDaysValue();
    const cost = 2.00 * days; // flat reseller hosting rate
    const hasSufficientBalance = wallet.balance >= cost;

    const handleHostSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsConfirmOpen(false);
        setIsCheckingOut(true);

        router.post(`/reseller/websites/mini/${website.id}/host`, {
            days: days
        }, {
            onSuccess: () => {
                setIsCheckoutOpen(false);
                setIsCheckingOut(false);
                setIsSuccessOpen(true);
                setTimeout(() => {
                    setIsSuccessOpen(false);
                    window.location.href = `/mini-website/${website.slug}`;
                }, 2000);
            },
            onError: () => {
                setIsCheckingOut(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reseller Dashboard', href: '/reseller/dashboard' },
            { title: 'My Hosted Websites', href: '/reseller/websites' },
            { title: website.title, href: `/reseller/mini-websites/${website.id}/edit` },
        ]}>
            <Head title={`Edit: ${website.title}`} />

            <div className="flex flex-col h-[calc(100vh-4rem)]">
                {/* Header Navbar */}
                <div className="border-b px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Globe className="size-6 text-indigo-700" />
                        <div>
                            <h1 className="text-xl font-bold">{website.title}</h1>
                            <a href={`/mini-website/${website.slug}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                                invitify.com/mini-website/{website.slug} <ExternalLink className="size-3" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 border-r pr-6">
                            <Label htmlFor="published" className={`text-sm font-bold ${website.is_purchased ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>Published</Label>
                            <input
                                type="checkbox"
                                id="published"
                                checked={data.is_published}
                                disabled={!website.is_purchased}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="size-4 rounded border-neutral-300 text-indigo-700 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-sm font-bold">Theme</Label>
                            <select
                                value={data.theme}
                                onChange={(e) => setData('theme', e.target.value)}
                                className="h-9 rounded-md border border-neutral-800 text-sm px-3 text-red-800 focus:ring-indigo-500 text-white"
                            >
                                <option value="royal" className='text-red-800'>Royal Event</option>
                                <option value="cozy" className='text-red-800'>Cozy Warm</option>
                                <option value="ocean" className='text-red-800'>Ocean Blue</option>
                                <option value="clean" className='text-red-800'>Clean Minimal</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button onClick={() => handleSave()} disabled={processing} className="bg-neutral-800 hover:bg-neutral-900 text-white shadow-md">
                                <Save className="size-4 mr-2" /> Save Changes
                            </Button>

                            {website.is_purchased ? (
                                <Button
                                    onClick={handleBuyClick}
                                    disabled={processing || isCheckingOut}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 font-bold"
                                >
                                    <CreditCard className="size-4" />
                                    {website.is_expired ? 'Purchase Hosting' : 'Renew Hosting'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setIsTemplateCheckoutOpen(true)}
                                    disabled={processing || isTemplatePurchasing}
                                    className="bg-amber-600 hover:bg-amber-700 text-white shadow-md flex items-center gap-1.5 font-bold animate-pulse"
                                >
                                    <CreditCard className="size-4" /> Buy Template
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Draft Unpaid Notice Banner */}
                {!website.is_purchased && (
                    <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-amber-800 text-xs font-semibold shrink-0">
                        <span className="flex items-center gap-2">
                            <ShieldAlert className="size-4 text-amber-600" />
                            This is an unpaid draft website template. You can customize the content as needed. Please complete your customization and purchase the template license (₹{website.reseller_price.toFixed(2)}) to publish or host it.
                        </span>
                        <Button
                            onClick={() => setIsTemplateCheckoutOpen(true)}
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white h-7 text-[11px] font-bold px-3 shadow-xs"
                        >
                            Complete & Buy Template
                        </Button>
                    </div>
                )}

                {/* Editor Body */}
                <SharedEditor
                    config={data.config as unknown as WebsiteConfig}
                    onChange={(newConfig) => setData('config', newConfig as unknown as Block[] | WebsiteConfig)}
                    isInvitation={true}
                    title={data.title}
                    slug={website.slug}
                    isCustomerMode={true}
                    customBlocks={customBlocks}
                />
            </div>

            {/* Reseller Hosting Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                            <CreditCard className="size-5 text-indigo-700" />
                            Hosting Subscription Checkout
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setIsConfirmOpen(true);
                        }}
                        className="flex flex-col gap-5 py-3 text-sm"
                    >
                        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-150 dark:border-neutral-850 flex flex-col gap-1">
                            <span className="text-xs text-neutral-450 uppercase font-bold">Hosting Website</span>
                            <span className="font-bold text-neutral-850 dark:text-neutral-200">{data.title}</span>
                            <span className="text-xs text-neutral-500 font-mono">/mini-website/{website.slug}</span>
                        </div>

                        {/* Duration Unit Selector */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs text-neutral-450 uppercase font-bold tracking-wider">Select Billing Cycle</Label>
                            <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border">
                                <button
                                    type="button"
                                    onClick={() => handleUnitChange('days')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${durationUnit === 'days'
                                        ? 'bg-white dark:bg-neutral-800 text-indigo-600 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                                        : 'text-neutral-400 hover:text-neutral-850'
                                        }`}
                                >
                                    Daily Billing (Days)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUnitChange('weeks')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${durationUnit === 'weeks'
                                        ? 'bg-white dark:bg-neutral-800 text-indigo-600 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                                        : 'text-neutral-400 hover:text-neutral-850'
                                        }`}
                                >
                                    Weekly Billing (Weeks)
                                </button>
                            </div>
                        </div>

                        {/* Duration Selection */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs text-neutral-450 uppercase font-bold tracking-wider">Select Hosting Duration</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {durationUnit === 'days' ? (
                                    <>
                                        {['1', '2', '3', '7', '30', 'custom'].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setDurationMode(val)}
                                                className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all text-xs ${durationMode === val
                                                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-750 dark:bg-indigo-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                                    }`}
                                            >
                                                <span>{val === 'custom' ? 'Custom Days' : `${val} ${val === '1' ? 'Day' : 'Days'}`}</span>
                                                {val !== 'custom' && <span className="text-[10px] opacity-60">₹{parseInt(val) * 2}</span>}
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
                                                className={`p-3 rounded-lg border text-center font-bold flex flex-col items-center gap-0.5 transition-all text-xs ${durationMode === val
                                                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-750 dark:bg-indigo-950/20'
                                                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800'
                                                    }`}
                                            >
                                                <span>{val === 'custom' ? 'Custom Weeks' : `${val} ${val === '1' ? 'Week' : 'Weeks'}`}</span>
                                                {val !== 'custom' && <span className="text-[10px] opacity-60">₹{parseInt(val) * 7 * 2}</span>}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Custom Input Fields */}
                        {durationMode === 'custom' && (
                            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 flex flex-col gap-4">
                                {durationUnit === 'days' ? (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="edit_custom_days" className="text-xs text-neutral-450 font-bold uppercase tracking-wider">Number of Days</Label>
                                        <div className="flex gap-2">
                                            <select
                                                value={customDays <= 30 ? customDays : 'manual'}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val !== 'manual') setCustomDays(Number(val));
                                                }}
                                                className="flex-1 h-9 rounded-md border border-neutral-200 bg-white text-xs px-3 focus:ring-1 focus:ring-indigo-700"
                                            >
                                                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                                                    <option key={d} value={d}>{d} Days</option>
                                                ))}
                                                <option value="manual">Enter Days Manually</option>
                                            </select>
                                            {(customDays > 30 || !Array.from({ length: 30 }, (_, i) => i + 1).includes(customDays)) && (
                                                <Input
                                                    id="edit_custom_days"
                                                    type="number"
                                                    min="1"
                                                    value={customDays}
                                                    onChange={(e) => setCustomDays(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-24 text-center h-9"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="edit_custom_weeks" className="text-xs text-neutral-450 font-bold uppercase tracking-wider">Number of Weeks</Label>
                                        <div className="flex gap-2">
                                            <select
                                                value={customWeeks <= 12 ? customWeeks : 'manual'}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val !== 'manual') setCustomWeeks(Number(val));
                                                }}
                                                className="flex-1 h-9 rounded-md border border-neutral-200 bg-white text-xs px-3 focus:ring-1 focus:ring-indigo-700"
                                            >
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                                                    <option key={w} value={w}>{w} Weeks</option>
                                                ))}
                                                <option value="manual">Enter Weeks Manually</option>
                                            </select>
                                            {(customWeeks > 12 || !Array.from({ length: 12 }, (_, i) => i + 1).includes(customWeeks)) && (
                                                <Input
                                                    id="edit_custom_weeks"
                                                    type="number"
                                                    min="1"
                                                    value={customWeeks}
                                                    onChange={(e) => setCustomWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-24 text-center h-9"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Invoice & Wallet Breakdown */}
                        <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border flex flex-col gap-2 text-xs">
                            <div className="flex justify-between items-center text-neutral-500">
                                <span>Wallet Balance:</span>
                                <span className="font-bold text-neutral-800 dark:text-neutral-200">₹{wallet.balance.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-neutral-500">
                                <span>Duration:</span>
                                <span className="font-bold text-neutral-800 dark:text-neutral-200">{days} days (Rate: ₹2.00 / day)</span>
                            </div>
                            <div className="flex justify-between items-center text-neutral-500 border-t pt-2.5">
                                <span>Hosting Cost:</span>
                                <span className="font-bold text-neutral-850 dark:text-neutral-100">₹{cost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2.5 text-sm font-black text-neutral-900 dark:text-neutral-100">
                                <span>Remaining Balance:</span>
                                <span className={hasSufficientBalance ? 'text-indigo-600' : 'text-red-500'}>
                                    ₹{(wallet.balance - cost).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Insufficient balance message */}
                        {!hasSufficientBalance && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/50 text-xs text-red-755 dark:text-red-400 rounded-xl flex items-start gap-2">
                                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Insufficient Balance</p>
                                    <p className="mt-0.5">You need to recharge at least ₹{(cost - wallet.balance).toFixed(2)} to host this site.</p>
                                    <Link href="/reseller/wallet" className="underline font-bold mt-1 inline-block hover:text-red-800">
                                        Recharge Wallet Now &rarr;
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Confirm buttons */}
                        <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                disabled={isCheckingOut || !hasSufficientBalance || cost <= 0}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex-1 flex items-center justify-center gap-1.5"
                            >
                                {isCheckingOut ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Confirming server...
                                    </>
                                ) : (
                                    <>
                                        <Check className="size-4" />
                                        Pay from Wallet & Host
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Payment Confirmation Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="w-[95%] sm:max-w-md bg-white border border-neutral-200">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-600">
                            <AlertCircle className="size-5" />
                            Confirm Payment
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-sm text-neutral-600 space-y-4">
                        <p>
                            Are you sure you want to deduct <span className="font-bold text-neutral-900">₹{cost.toFixed(2)}</span> from your wallet balance to host <span className="font-bold text-neutral-900">{website.title}</span> for <span className="font-bold text-neutral-900">{days} days</span>?
                        </p>
                        <div className="rounded-lg bg-neutral-50 p-3 border text-xs flex justify-between">
                            <span>Current Balance: ₹{wallet.balance.toFixed(2)}</span>
                            <span className="font-semibold text-indigo-700">Remaining Balance: ₹{(wallet.balance - cost).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                        <Button
                            type="button"
                            onClick={() => handleHostSubmit()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                        >
                            Confirm & Pay
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Success Message Dialog */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="w-[95%] sm:max-w-md bg-white border border-neutral-200 flex flex-col items-center justify-center p-8 text-center">
                    <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <Check className="size-8 animate-bounce" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-neutral-900">Payment Successful!</DialogTitle>
                    <p className="mt-2 text-sm text-neutral-500">
                        Hosting has been activated for <span className="font-bold text-neutral-800">{website.title}</span>. Redirecting you to your hosted invitation...
                    </p>
                </DialogContent>
            </Dialog>

            {/* Reseller Template Checkout Dialog */}
            <Dialog open={isTemplateCheckoutOpen} onOpenChange={setIsTemplateCheckoutOpen}>
                <DialogContent className="w-[95%] sm:max-w-md bg-white border border-neutral-200">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="size-5 text-amber-600 animate-pulse" />
                            Purchase Template License
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleTemplatePurchase} className="flex flex-col gap-5 py-3 text-sm">
                        <div className="rounded-xl bg-neutral-50 p-4 border flex flex-col gap-1">
                            <span className="text-xs text-neutral-450 uppercase font-bold">Template License</span>
                            <span className="font-bold text-neutral-850">{website.title}</span>
                            <span className="text-xs text-neutral-500 font-mono">/mini-website/{website.slug}</span>
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-xl border flex flex-col gap-2 text-xs">
                            <div className="flex justify-between items-center text-neutral-500">
                                <span>Wallet Balance:</span>
                                <span className="font-bold text-neutral-800">₹{wallet.balance.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-neutral-500 border-t pt-2.5">
                                <span>Template Price:</span>
                                <span className="font-bold text-neutral-850">₹{website.reseller_price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2.5 text-sm font-black text-neutral-900">
                                <span>Remaining Balance:</span>
                                <span className={wallet.balance >= website.reseller_price ? 'text-indigo-600' : 'text-red-500'}>
                                    ₹{(wallet.balance - website.reseller_price).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {wallet.balance < website.reseller_price && (
                            <div className="p-3 bg-red-50 border border-red-150 text-xs text-red-755 rounded-xl flex items-start gap-2">
                                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Insufficient Balance</p>
                                    <p className="mt-0.5">You need to recharge at least ₹{(website.reseller_price - wallet.balance).toFixed(2)} to purchase this template.</p>
                                    <Link href="/reseller/wallet" className="underline font-bold mt-1 inline-block hover:text-red-800">
                                        Recharge Wallet Now &rarr;
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsTemplateCheckoutOpen(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                disabled={isTemplatePurchasing || wallet.balance < website.reseller_price}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex-1 flex items-center justify-center gap-1.5"
                            >
                                {isTemplatePurchasing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Purchasing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="size-4" />
                                        Pay from Wallet & Complete Customization
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
