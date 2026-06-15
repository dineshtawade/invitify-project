import { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Save, ExternalLink, ShieldAlert, Sparkles, Check, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block } from '@/components/design-editor/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
        pages: any;
        meta_description: string | null;
        meta_keywords: string | null;
    };
}

export default function ResellerBusinessWebsiteEdit({ wallet, website }: PageProps) {
    const [activeTab, setActiveTab] = useState<string>('home');

    const { data, setData, put, processing } = useForm({
        title: website.title,
        theme: website.theme,
        is_published: website.is_published,
        pages: website.pages || {},
        meta_description: website.meta_description || '',
        meta_keywords: website.meta_keywords || '',
    });

    // Checkout Modal States
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [durationUnit, setDurationUnit] = useState<'days' | 'weeks'>('days');
    const [durationMode, setDurationMode] = useState<string>('30');
    const [customDays, setCustomDays] = useState(30);
    const [customWeeks, setCustomWeeks] = useState(4);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Template Purchase Checkout States
    const [isTemplateCheckoutOpen, setIsTemplateCheckoutOpen] = useState(false);
    const [isTemplatePurchasing, setIsTemplatePurchasing] = useState(false);

    const handleTemplatePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTemplatePurchasing(true);
        router.post(`/reseller/business-websites/${website.id}/purchase-template`, {}, {
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
        put(`/reseller/business-websites/${website.id}`, {
            onSuccess: () => {
                if (callback) {
                    callback();
                } else {
                    alert('Business Website configurations saved successfully.');
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

    const handleHostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCheckingOut(true);

        router.post(`/reseller/websites/business/${website.id}/host`, {
            days: days
        }, {
            onSuccess: () => {
                setIsCheckoutOpen(false);
                setIsCheckingOut(false);
            },
            onError: () => {
                setIsCheckingOut(false);
            }
        });
    };

    const currentBlocks = data.pages[activeTab]?.blocks || [];
    const handleBlocksChange = (newBlocks: Block[]) => {
        setData('pages', {
            ...data.pages,
            [activeTab]: { ...data.pages[activeTab], blocks: newBlocks }
        });
    };

    const togglePageEnabled = (slug: string) => {
        setData('pages', {
            ...data.pages,
            [slug]: { ...data.pages[slug], enabled: !data.pages[slug].enabled }
        });
    };

    const pagesNav = Object.values(data.pages)
        .filter((p: any) => p.enabled)
        .map((p: any) => ({ slug: p.slug, title: p.title, active: p.slug === activeTab }));

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reseller Dashboard', href: '/reseller/dashboard' },
            { title: 'My Hosted Websites', href: '/reseller/websites' },
            { title: website.title, href: `/reseller/business-websites/${website.id}/edit` },
        ]}>
            <Head title={`Edit: ${website.title}`} />

            <div className="flex flex-col h-[calc(100vh-4rem)]">
                {/* Header Navbar */}
                <div className=" border-b px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Briefcase className="size-6 text-indigo-650" />
                        <div>
                            <h1 className="text-xl font-bold">{website.title}</h1>
                            <a href={`/business/${website.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                invitify.com/business/{website.slug} <ExternalLink className="size-3" />
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
                                className="size-4 rounded border-neutral-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="flex items-center gap-2 border-r pr-6">
                            <Label className="text-sm font-bold">Theme</Label>
                            <select
                                value={data.theme}
                                onChange={(e) => setData('theme', e.target.value)}
                                className="h-9 rounded-md border border-neutral-200 text-sm px-3 focus:ring-indigo-500"
                            >
                                <option value="royal">Royal Professional</option>
                                <option value="cozy">Cozy Warm</option>
                                <option value="ocean">Ocean Tech</option>
                                <option value="clean">Clean Minimal</option>
                            </select>
                        </div>

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

                {/* SEO & Meta Tools */}
                <div className="bg-neutral-50 border-b px-6 py-3 flex gap-6 shrink-0 text-sm">
                    <div className="flex-1 flex items-center gap-2">
                        <Label className="font-bold whitespace-nowrap text-xs uppercase text-neutral-500">Site Description</Label>
                        <Input value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} placeholder="Global SEO Description for search engines" className="h-8 bg-white" />
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                        <Label className="font-bold whitespace-nowrap text-xs uppercase text-neutral-500">Keywords</Label>
                        <Input value={data.meta_keywords} onChange={e => setData('meta_keywords', e.target.value)} placeholder="comma, separated, keywords" className="h-8 bg-white" />
                    </div>
                </div>

                {/* Page Tabs */}
                <div className="flex bg-neutral-100 border-b px-4 gap-2 pt-2 shrink-0 overflow-x-auto">
                    {Object.values(data.pages).map((page: any) => (
                        <button
                            key={page.slug}
                            onClick={() => setActiveTab(page.slug)}
                            className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 border-x border-t transition-all ${activeTab === page.slug
                                ? 'bg-white text-indigo-650 border-neutral-200 border-b-transparent shadow-sm'
                                : 'bg-neutral-50/50 text-neutral-500 border-transparent hover:bg-neutral-200'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={page.enabled}
                                onChange={() => togglePageEnabled(page.slug)}
                                onClick={e => e.stopPropagation()}
                                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            {page.title}
                        </button>
                    ))}
                </div>

                {/* Editor Body */}
                <div className="flex-1 overflow-hidden bg-white">
                    {!data.pages[activeTab]?.enabled ? (
                        <div className="flex items-center justify-center h-full text-neutral-500">
                            This page is disabled. Check the box above to enable and edit it.
                        </div>
                    ) : (
                        <SharedEditor
                            key={activeTab}
                            blocks={currentBlocks}
                            onChange={handleBlocksChange}
                            isInvitation={false}
                            title={data.title}
                            slug={website.slug}
                            pagesNav={pagesNav}
                            isCustomerMode={true}
                        />
                    )}
                </div>
            </div>

            {/* Reseller Hosting Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                            <CreditCard className="size-5 text-indigo-650" />
                            Hosting Subscription Checkout
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleHostSubmit} className="flex flex-col gap-5 py-3 text-sm">
                        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-150 dark:border-neutral-850 flex flex-col gap-1">
                            <span className="text-xs text-neutral-450 uppercase font-bold">Hosting Website</span>
                            <span className="font-bold text-neutral-850 dark:text-neutral-200">{data.title}</span>
                            <span className="text-xs text-neutral-500 font-mono">/business/{website.slug}</span>
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
                                                className="flex-1 h-9 rounded-md border border-neutral-200 bg-white text-xs px-3 focus:ring-1 focus:ring-indigo-650"
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
                                                className="flex-1 h-9 rounded-md border border-neutral-200 bg-white text-xs px-3 focus:ring-1 focus:ring-indigo-650"
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
                            <span className="text-xs text-neutral-500 font-mono">/business/{website.slug}</span>
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
                                <span className={wallet.balance >= website.reseller_price ? 'text-indigo-650' : 'text-red-500'}>
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
                                className="bg-indigo-600 hover:bg-indigo-755 text-white font-semibold flex-1 flex items-center justify-center gap-1.5"
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
