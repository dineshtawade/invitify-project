import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Globe, Plus, Trash2, Edit2, Calendar, CheckCircle, Clock, ShieldAlert, Sparkles, ExternalLink, Briefcase } from 'lucide-react';

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
    } | null>(null);

    // Renew/Host form
    const renewForm = useForm({
        plan: 'monthly' as 'daily' | 'monthly' | 'yearly',
        days: '10', // Default if daily is chosen
    });

    const handleDelete = (type: 'mini' | 'business', id: number) => {
        if (confirm('Are you absolutely sure you want to delete this website? All customized content will be permanently lost.')) {
            const url = type === 'mini' 
                ? `/reseller/mini-websites/${id}` 
                : `/reseller/business-websites/${id}`;
            
            renewForm.delete(url);
        }
    };

    const handleOpenHostModal = (id: number, title: string, type: 'mini' | 'business') => {
        setHostingTarget({ id, title, type });
        renewForm.setData({
            plan: 'monthly',
            days: '10',
        });
    };

    const handleHostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hostingTarget) return;

        renewForm.post(`/reseller/websites/${hostingTarget.type}/${hostingTarget.id}/host`, {
            onSuccess: () => {
                setHostingTarget(null);
            },
        });
    };

    // Calculate dynamic cost based on selected form data
    const getHostingCost = () => {
        if (renewForm.data.plan === 'daily') {
            return 2.00 * (parseInt(renewForm.data.days) || 0);
        }
        if (renewForm.data.plan === 'monthly') {
            return 50.00;
        }
        if (renewForm.data.plan === 'yearly') {
            return 500.00;
        }
        return 0;
    };

    const cost = getHostingCost();
    const hasSufficientBalance = wallet.balance >= cost;

    const renderStatusBadge = (site: WebsiteData) => {
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
        if (!site.expires_at) {
            return <p className="text-[10px] text-neutral-400 italic">No hosting active</p>;
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

    const currentList = activeTab === 'mini' ? miniWebsites : businessWebsites;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Hosted Websites" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Globe className="size-8 text-indigo-650" /> My Hosted Websites
                        </h1>
                        <p className="text-neutral-500 mt-1">Manage and edit your reseller client sites. Top up hosting periods using your wallet balance.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Wallet Balance widget */}
                        <div className="bg-white border rounded-xl px-4 py-2 flex items-center gap-2 shadow-xs">
                            <span className="text-xs text-neutral-450 uppercase font-semibold">Wallet:</span>
                            <span className="text-lg font-black text-indigo-600">₹{wallet.balance.toFixed(2)}</span>
                        </div>
                        <Link href="/reseller/shop">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                                <Plus className="size-4 mr-1.5" /> Buy New Site
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b pb-px">
                    <button
                        onClick={() => setActiveTab('mini')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'mini'
                                ? 'border-indigo-600 text-indigo-650'
                                : 'border-transparent text-neutral-500 hover:text-neutral-800'
                        }`}
                    >
                        <Globe className="size-4" />
                        Mini Websites ({miniWebsites.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('business')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'business'
                                ? 'border-indigo-600 text-indigo-650'
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
                                            <p className="text-[11px] text-neutral-450 mt-1 capitalize">Theme: {site.theme}</p>
                                        </div>
                                        {renderStatusBadge(site)}
                                    </div>

                                    {/* Link and Template info */}
                                    <div className="bg-neutral-50 rounded-xl p-3 border text-xs flex flex-col gap-1.5">
                                        <div className="flex justify-between text-neutral-500">
                                            <span>Template:</span>
                                            <span className="font-semibold text-neutral-850">{site.template?.name || 'Custom'}</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-500 items-center">
                                            <span>URL:</span>
                                            <a 
                                                href={activeTab === 'mini' ? `/sites/${site.slug}` : `/business/${site.slug}`} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-blue-600 hover:underline flex items-center gap-0.5"
                                            >
                                                {site.slug} <ExternalLink className="size-3" />
                                            </a>
                                        </div>
                                    </div>
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
                                    <div className="grid grid-cols-3 gap-2 mt-1">
                                        {/* Edit link */}
                                        <Link 
                                            href={activeTab === 'mini' ? `/reseller/mini-websites/${site.id}/edit` : `/reseller/business-websites/${site.id}/edit`}
                                            className="w-full"
                                        >
                                            <Button variant="outline" size="sm" className="w-full text-xs font-semibold px-2">
                                                <Edit2 className="size-3 mr-1" /> Edit
                                            </Button>
                                        </Link>

                                        {/* Host / Renew button */}
                                        <Button 
                                            onClick={() => handleOpenHostModal(site.id, site.title, activeTab)}
                                            variant="outline" 
                                            size="sm" 
                                            className="text-xs font-semibold px-2 text-indigo-650 border-indigo-200 hover:bg-indigo-50"
                                        >
                                            <Globe className="size-3 mr-1" /> Host/Renew
                                        </Button>

                                        {/* Delete button */}
                                        <Button 
                                            onClick={() => handleDelete(activeTab, site.id)}
                                            variant="outline" 
                                            size="sm" 
                                            className="text-xs font-semibold px-2 text-red-650 hover:bg-red-50 hover:border-red-200"
                                        >
                                            <Trash2 className="size-3 mr-1" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hosting Setup / Extend dialog */}
                <Dialog open={hostingTarget !== null} onOpenChange={() => setHostingTarget(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Sparkles className="size-5 text-indigo-600 animate-pulse" /> Hosting & Deployment
                            </DialogTitle>
                            <DialogDescription>
                                Activate hosting or extend active server registration for client site: <strong className="text-neutral-800">{hostingTarget?.title}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        {hostingTarget && (
                            <form onSubmit={handleHostSubmit} className="flex flex-col gap-4 py-2">
                                {/* Plan Selection */}
                                <div className="grid gap-2">
                                    <Label htmlFor="hosting_plan">Choose Hosting Plan</Label>
                                    <select
                                        id="hosting_plan"
                                        value={renewForm.data.plan}
                                        onChange={e => renewForm.setData('plan', e.target.value as any)}
                                        className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-650"
                                        required
                                    >
                                        <option value="daily">Daily Hosting (₹2.00 / day)</option>
                                        <option value="monthly">Monthly Subscription (₹50.00 / 30 days)</option>
                                        <option value="yearly">Yearly Subscription (₹500.00 / 365 days)</option>
                                    </select>
                                </div>

                                {/* Custom Days input for Daily Plan */}
                                {renewForm.data.plan === 'daily' && (
                                    <div className="grid gap-1.5 animate-fadeIn">
                                        <Label htmlFor="daily_days">Hosting Duration (Days)</Label>
                                        <Input
                                            id="daily_days"
                                            type="number"
                                            min={5}
                                            max={120}
                                            value={renewForm.data.days}
                                            onChange={e => renewForm.setData('days', e.target.value)}
                                            required
                                            placeholder="Enter days (minimum 5)"
                                        />
                                        <p className="text-[10px] text-neutral-400">Select between 5 and 120 days of custom deployment.</p>
                                    </div>
                                )}

                                {/* Cost & Balance Summary */}
                                <div className="border rounded-xl p-4 bg-neutral-50/50 flex flex-col gap-2 mt-2">
                                    <div className="flex justify-between items-center text-sm border-b pb-2">
                                        <span className="text-neutral-500">Wallet Balance:</span>
                                        <span className="font-bold text-neutral-800">₹{wallet.balance.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b pb-2">
                                        <span className="text-neutral-500">Hosting Cost:</span>
                                        <span className="font-extrabold text-neutral-800">₹{cost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-indigo-700 font-bold">Remaining Balance:</span>
                                        <span className={`font-black text-base ${hasSufficientBalance ? 'text-indigo-750' : 'text-red-500'}`}>
                                            ₹{(wallet.balance - cost).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Insufficient Wallet Warning */}
                                {!hasSufficientBalance && (
                                    <div className="p-3.5 bg-red-50 border border-red-150 text-xs text-red-700 rounded-xl flex items-start gap-2">
                                        <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">Insufficient Balance</p>
                                            <p className="mt-0.5">Please recharge your wallet with at least ₹{(cost - wallet.balance).toFixed(2)} to host this site.</p>
                                            <Link href="/reseller/wallet" className="underline font-bold mt-1.5 inline-block hover:text-red-850">
                                                Recharge Wallet Now &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                                    <Button type="button" variant="outline" onClick={() => setHostingTarget(null)}>Cancel</Button>
                                    <Button 
                                        type="submit" 
                                        disabled={renewForm.processing || !hasSufficientBalance || cost <= 0} 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex-1"
                                    >
                                        {renewForm.processing ? 'Activating server...' : 'Confirm & Host Site'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
