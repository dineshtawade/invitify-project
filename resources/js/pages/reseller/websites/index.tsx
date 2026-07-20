import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Globe, Plus, Trash2, Edit2, Calendar, CheckCircle, Clock,
    ShieldAlert, Sparkles, ExternalLink, Briefcase, Package, Loader2, Check, AlertCircle, CreditCard
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reseller Dashboard',
        href: '/reseller/dashboard',
    },
    {
        title: 'My Hosted Websites',
        href: '/reseller/websites',
    },
];

interface WebsiteData {
    id: number;
    title: string;
    slug: string;
    theme: string;
    is_published: boolean;
    is_purchased: boolean;
    created_at: string;
    expires_at: string | null;
    is_expired: boolean;
    template?: {
        name: string;
    } | null;
}

interface PageProps {
    wallet: {
        balance: number;
    };
    miniWebsites: WebsiteData[];
    businessWebsites: WebsiteData[];
}

export default function ResellerWebsitesIndex({ wallet, miniWebsites = [], businessWebsites = [] }: PageProps) {
    const [activeTab, setActiveTab] = useState<'mini' | 'business'>('mini');
    const [hostingTarget, setHostingTarget] = useState<{
        id: number;
        title: string;
        type: 'mini' | 'business';
        slug: string;
    } | null>(null);

    // ZIP downloading state
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    // Checkout configurations
    const [durationUnit, setDurationUnit] = useState<'days' | 'weeks'>('days');
    const [durationMode, setDurationMode] = useState<string>('30');
    const [customDays, setCustomDays] = useState(30);
    const [customWeeks, setCustomWeeks] = useState(4);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const handleDelete = (type: 'mini' | 'business', id: number) => {
        if (confirm('Are you absolutely sure you want to delete this website? All customized content will be permanently lost.')) {
            const url = type === 'mini'
                ? `/reseller/mini-websites/${id}`
                : `/reseller/business-websites/${id}`;

            router.delete(url);
        }
    };

    const handleDownloadZip = async (websiteId: number) => {
        setDownloadingId(websiteId);
        try {
            const link = document.createElement('a');
            link.href = `/reseller/mini-websites/${websiteId}/download-zip`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => {
                setDownloadingId(null);
            }, 3000);
        } catch (err) {
            console.error('Download failed:', err);
            setDownloadingId(null);
        }
    };

    const handleOpenHostModal = (id: number, title: string, slug: string, type: 'mini' | 'business') => {
        setHostingTarget({ id, title, type, slug });
        setDurationUnit('days');
        setDurationMode('30');
        setCustomDays(30);
        setCustomWeeks(4);
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
        if (!hostingTarget) return;
        setIsConfirmOpen(false);
        setIsCheckingOut(true);

        router.post(`/reseller/websites/${hostingTarget.type}/${hostingTarget.id}/host`, {
            days: days
        }, {
            onSuccess: () => {
                const targetSlug = hostingTarget.slug;
                const targetType = hostingTarget.type;
                setHostingTarget(null);
                setIsCheckingOut(false);
                setIsSuccessOpen(true);
                setTimeout(() => {
                    setIsSuccessOpen(false);
                    if (targetType === 'mini') {
                        window.location.href = `/mini-website/${targetSlug}`;
                    } else {
                        window.location.href = `/business/${targetSlug}`;
                    }
                }, 2000);
            },
            onError: () => {
                setIsCheckingOut(false);
            }
        });
    };

    const renderStatusBadge = (site: WebsiteData) => {
        if (!site.is_purchased) {
            return (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border border-amber-100">
                    <ShieldAlert className="size-3" /> Unpaid Draft
                </span>
            );
        }
        if (site.is_expired) {
            return (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border border-red-100">
                    <Clock className="size-3" /> Expired
                </span>
            );
        }
        if (site.is_published) {
            return (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border border-emerald-100 animate-pulse">
                    <CheckCircle className="size-3" /> Active / Hosted
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-600 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border">
                <Edit2 className="size-3" /> Draft
            </span>
        );
    };

    const renderExpiryMessage = (site: WebsiteData) => {
        if (!site.is_purchased) {
            return <p className="text-[10px] text-amber-600 font-semibold italic">Template unpaid</p>;
        }
        if (!site.expires_at) {
            return <p className="text-[10px] text-neutral-450 italic">No hosting active</p>;
        }
        const expiry = new Date(site.expires_at);
        if (site.is_expired) {
            return (
                <p className="text-[10px] text-red-500 font-semibold">
                    Expired on {expiry.toLocaleDateString()}
                </p>
            );
        }
        return (
            <p className="text-[10px] text-neutral-500">
                Expires: <span className="font-semibold text-neutral-700">{expiry.toLocaleDateString()}</span>
            </p>
        );
    };

    const isSiteActive = (site: WebsiteData) => {
        return !site.is_expired && site.expires_at !== null;
    };

    const currentList = activeTab === 'mini' ? miniWebsites : businessWebsites;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Hosted Websites" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Globe className="size-8 text-indigo-600" /> My Hosted Websites
                        </h1>
                        <p className="text-neutral-500 mt-1">Manage and edit your reseller client sites. Top up hosting periods using your wallet balance.</p>
                    </div>

                    <div className="flex items-center gap-3 font-semibold">
                        {/* Wallet Balance widget */}
                        <div className="bg-white border rounded-xl px-4 py-2 flex items-center gap-2 shadow-xs">
                            <span className="text-xs text-neutral-450 uppercase font-semibold">Wallet:</span>
                            <span className="text-lg font-black text-indigo-600">₹{wallet.balance.toFixed(2)}</span>
                        </div>
                        <Link href="/reseller/shop">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 font-semibold">
                                <Plus className="size-4" /> Buy New Site
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b pb-px">
                    <button
                        onClick={() => setActiveTab('mini')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'mini'
                            ? 'border-indigo-600 text-indigo-700'
                            : 'border-transparent text-neutral-500 hover:text-neutral-800'
                            }`}
                    >
                        <Globe className="size-4" />
                        Mini Websites ({miniWebsites.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('business')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'business'
                            ? 'border-indigo-600 text-indigo-700'
                            : 'border-transparent text-neutral-500 hover:text-neutral-800'
                            }`}
                    >
                        <Briefcase className="size-4" />
                        Business Websites ({businessWebsites.length})
                    </button>
                </div>

                {/* Catalog Listing */}
                {currentList.length === 0 ? (
                    <div className="border border-dashed rounded-2xl p-16 text-center text-neutral-400 bg-white">
                        <Globe className="size-16 mx-auto mb-4 opacity-20 text-neutral-600" />
                        <h3 className="font-bold text-neutral-700 text-base">No websites created yet</h3>
                        <p className="text-sm mt-1 mb-4">Go to the Reseller Shop to buy a template and instantiate a client website.</p>
                        <Link href="/reseller/shop">
                            <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                Browse Shop &rarr;
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentList.map(site => (
                            <div key={site.id} className="bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-neutral-200 transition-all flex flex-col justify-between gap-5">
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-black text-neutral-900 text-lg leading-tight">{site.title}</h3>
                                            <p className="text-[11px] text-neutral-455 mt-1 capitalize">Theme: {site.theme}</p>
                                        </div>
                                        {renderStatusBadge(site)}
                                    </div>

                                    {/* Link and Template info */}
                                    <div className="bg-neutral-50 rounded-xl p-3 border text-xs flex flex-col gap-1.5">
                                        <div className="flex justify-between text-neutral-500">
                                            <span>Template:</span>
                                            <span className="font-semibold text-neutral-800">{site.template?.name || 'Custom'}</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-500 items-center">
                                            <span>URL:</span>
                                            <a
                                                href={activeTab === 'mini' ? `/mini-website/${site.slug}` : `/business/${site.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline flex items-center gap-0.5"
                                            >
                                                /mini-website/{site.slug} <ExternalLink className="size-3" />
                                            </a>
                                        </div>
                                    </div>

                                    {!site.is_purchased && (
                                        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 text-[10px] text-amber-800 flex gap-1.5 items-start">
                                            <ShieldAlert className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                                            <p>This website is an unpaid draft. Open the editor to customize content and complete the purchase.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 pt-3 border-t">
                                    {/* Expiry detail */}
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-neutral-500 flex items-center gap-1">
                                            <Calendar className="size-3.5" /> Expiry Status:
                                        </span>
                                        {renderExpiryMessage(site)}
                                    </div>

                                    {/* Action button bar */}
                                    <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Edit link */}
                                            <Link
                                                href={activeTab === 'mini' ? `/reseller/mini-websites/${site.id}/edit` : `/reseller/business-websites/${site.id}/edit`}
                                                className="w-full"
                                            >
                                                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                                                    <Edit2 className="size-3 mr-1.5" /> Edit Template
                                                </Button>
                                            </Link>

                                            {/* Host / Renew button */}
                                            <Button
                                                onClick={() => handleOpenHostModal(site.id, site.title, site.slug || '', activeTab)}
                                                disabled={!site.is_purchased}
                                                variant="outline"
                                                size="sm"
                                                className={`text-xs font-semibold ${site.is_purchased
                                                    ? 'text-indigo-700 border-indigo-200 hover:bg-indigo-700'
                                                    : 'text-neutral-400 border-neutral-200 cursor-not-allowed opacity-50'
                                                    }`}
                                            >
                                                <Globe className="size-3 mr-1.5" /> Host/Renew
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Download ZIP (Mini Website only & active) */}
                                            {activeTab === 'mini' && isSiteActive(site) ? (
                                                <Button
                                                    onClick={() => handleDownloadZip(site.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={downloadingId === site.id}
                                                    className="text-xs font-bold text-violet-700 border-violet-200 bg-violet-50 hover:bg-violet-100 disabled:opacity-60"
                                                >
                                                    {downloadingId === site.id ? (
                                                        <>
                                                            <Loader2 className="size-3 animate-spin mr-1" /> Preparing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Package className="size-3 mr-1" /> Download ZIP
                                                        </>
                                                    )}
                                                </Button>
                                            ) : (
                                                <div className="w-full" />
                                            )}

                                            {/* Delete button */}
                                            <Button
                                                onClick={() => handleDelete(activeTab, site.id)}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs font-semibold text-red-700 hover:bg-red-500 hover:border-red-200"
                                            >
                                                <Trash2 className="size-3 mr-1.5" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hosting Setup / Extend dialog */}
                <Dialog open={hostingTarget !== null} onOpenChange={() => setHostingTarget(null)}>
                    <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                                <CreditCard className="size-5 text-indigo-700" />
                                Hosting Subscription Checkout
                            </DialogTitle>
                        </DialogHeader>

                        {hostingTarget && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setIsConfirmOpen(true);
                                }}
                                className="flex flex-col gap-5 py-3 text-sm"
                            >
                                <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-150 dark:border-neutral-850 flex flex-col gap-1">
                                    <span className="text-xs text-neutral-450 uppercase font-bold">Hosting Website</span>
                                    <span className="font-bold text-neutral-850 dark:text-neutral-200">{hostingTarget.title}</span>
                                    <span className="text-xs text-neutral-500 font-mono">/{hostingTarget.type === 'mini' ? 'mini-website' : 'business'}/{hostingTarget.id}</span>
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
                                                : 'text-neutral-500 hover:text-neutral-850'
                                                }`}
                                        >
                                            Daily Billing (Days)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUnitChange('weeks')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${durationUnit === 'weeks'
                                                ? 'bg-white dark:bg-neutral-800 text-indigo-600 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                                                : 'text-neutral-500 hover:text-neutral-850'
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

                                {/* Custom Input Selection */}
                                {durationMode === 'custom' && (
                                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 flex flex-col gap-4">
                                        {durationUnit === 'days' ? (
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="custom_reseller_days" className="text-xs text-neutral-450 font-bold uppercase tracking-wider">Number of Days</Label>
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
                                                            id="custom_reseller_days"
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
                                                <Label htmlFor="custom_reseller_weeks" className="text-xs text-neutral-450 font-bold uppercase tracking-wider">Number of Weeks</Label>
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
                                                            id="custom_reseller_weeks"
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

                                {/* Cost & Balance breakdown */}
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
                                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/50 text-xs text-red-750 dark:text-red-400 rounded-xl flex items-start gap-2">
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
                                    <Button type="button" variant="outline" onClick={() => setHostingTarget(null)}>Cancel</Button>
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
                        )}
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
                        {hostingTarget && (
                            <>
                                <div className="py-4 text-sm text-neutral-600 space-y-4">
                                    <p>
                                        Are you sure you want to deduct <span className="font-bold text-neutral-900">₹{cost.toFixed(2)}</span> from your wallet balance to host <span className="font-bold text-neutral-900">{hostingTarget.title}</span> for <span className="font-bold text-neutral-900">{days} days</span>?
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
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Success Message Dialog */}
                <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                    <DialogContent className="w-[95%] sm:max-w-md bg-white border border-neutral-200 flex flex-col items-center justify-center p-8 text-center">
                        <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Check className="size-8 animate-bounce" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">Hosting Activated!</h3>
                        <p className="text-sm text-neutral-500 mb-6">Your website is now live. Redirecting to your hosted website...</p>
                        <Loader2 className="size-5 animate-spin text-indigo-500" />
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
