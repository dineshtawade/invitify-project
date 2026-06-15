import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Store, CreditCard, ShoppingBag, Eye, ShieldAlert, Sparkles, Check, Globe, LayoutGrid, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reseller Dashboard',
        href: '/reseller/dashboard',
    },
    {
        title: 'Shop',
        href: '/reseller/shop',
    },
];

interface Template {
    id: number;
    name: string;
    category: string;
    price: number;
    reseller_price: number;
    bg_gradient: string | null;
}

interface MiniTemplate {
    id: number;
    name: string;
    type: string;
    price: number;
    reseller_price: number;
    preview_image: string | null;
}

interface BusinessTemplate {
    id: number;
    name: string;
    price: number;
    reseller_price: number;
    preview_image: string | null;
    is_active: boolean;
}

interface ShopPageProps {
    wallet: {
        balance: number;
    };
    catalog: {
        templates: Template[];
        miniTemplates: MiniTemplate[];
        businessTemplates: BusinessTemplate[];
    };
}

export default function ResellerShop({ wallet, catalog }: ShopPageProps) {
    const [activeTab, setActiveTab] = useState<'invitations' | 'mini-websites' | 'business-websites'>('invitations');

    // Purchase dialogs state
    const [selectedTemplate, setSelectedTemplate] = useState<{
        id: number;
        name: string;
        price: number;
        reseller_price: number;
        type: 'invitation' | 'mini-website' | 'business-website';
    } | null>(null);

    // Form for purchasing invitation templates
    const invitationForm = useForm({
        template_id: '',
    });

    // Form for purchasing websites (mini / business)
    const websiteForm = useForm({
        template_id: '',
        title: '',
        slug: '',
        theme: 'clean' as 'cozy' | 'clean' | 'royal' | 'ocean',
    });

    const handleSelectTemplate = (template: any, type: 'invitation' | 'mini-website' | 'business-website') => {
        setSelectedTemplate({
            id: template.id,
            name: template.name,
            price: template.price,
            reseller_price: template.reseller_price,
            type,
        });

        if (type === 'invitation') {
            invitationForm.setData('template_id', String(template.id));
        } else {
            websiteForm.setData({
                template_id: String(template.id),
                title: '',
                slug: '',
                theme: 'clean',
            });
            websiteForm.clearErrors();
        }
    };

    const handleInvitationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        invitationForm.post('/reseller/purchase/template', {
            onSuccess: () => {
                setSelectedTemplate(null);
                invitationForm.reset();
            },
        });
    };

    const handleWebsiteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const route = selectedTemplate?.type === 'mini-website'
            ? '/reseller/purchase/mini-website'
            : '/reseller/purchase/business-website';

        websiteForm.post(route, {
            onSuccess: () => {
                setSelectedTemplate(null);
                websiteForm.reset();
            },
        });
    };

    // Auto slugify helper
    const handleSlugChange = (val: string) => {
        const slugified = val
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '-')
            .replace(/-+/g, '-');
        websiteForm.setData('slug', slugified);
    };

    const hasSufficientBalance = selectedTemplate
        ? wallet.balance >= selectedTemplate.reseller_price
        : true;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reseller Shop" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <ShoppingBag className="size-8 text-indigo-600 animate-pulse" /> Reseller Shop
                        </h1>
                        <p className="text-neutral-500 mt-1">Browse invitation cards, mini websites, and business websites at exclusive locked reseller prices.</p>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-100 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xs">
                        <div className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Store className="size-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider">Wallet Balance</p>
                            <p className="text-xl font-black text-indigo-950">₹{wallet.balance.toFixed(2)}</p>
                        </div>
                        <Link
                            href="/reseller/wallet"
                            className="ml-4 text-xs font-bold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            Add Funds
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b pb-px overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('invitations')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'invitations'
                            ? 'border-indigo-600 text-indigo-650'
                            : 'border-transparent text-neutral-500 hover:text-neutral-800'
                            }`}
                    >
                        <LayoutGrid className="size-4" />
                        Invitation Cards ({catalog.templates.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('mini-websites')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'mini-websites'
                            ? 'border-indigo-600 text-indigo-650'
                            : 'border-transparent text-neutral-500 hover:text-neutral-800'
                            }`}
                    >
                        <Store className="size-4" />
                        Mini Websites ({catalog.miniTemplates.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('business-websites')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'business-websites'
                            ? 'border-indigo-600 text-indigo-650'
                            : 'border-transparent text-neutral-500 hover:text-neutral-800'
                            }`}
                    >
                        <Globe className="size-4" />
                        Business Websites ({catalog.businessTemplates.length})
                    </button>
                </div>

                {/* Catalog Sections */}
                {activeTab === 'invitations' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {catalog.templates.map(tpl => (
                            <div key={tpl.id} className="group relative  border border-neutral-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-200 transition-all flex flex-col justify-between">
                                {/* Visual Card Body */}
                                <div className="p-5 flex flex-col gap-4">
                                    <div
                                        className={`h-40 w-full rounded-xl flex items-center justify-center p-4 text-center font-bold text-white text-lg shadow-inner ${tpl.bg_gradient || 'bg-gradient-to-br from-indigo-500 to-purple-650'
                                            }`}
                                    >
                                        <div className="bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
                                            {tpl.name}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] bg-indigo-500 text-indigo-650 font-bold px-2 py-0.5 rounded-full uppercase">
                                            {tpl.category || 'Invitation'}
                                        </span>
                                        <h3 className="font-bold text-base mt-2">{tpl.name}</h3>
                                        <div className="flex items-center gap-2.5 mt-3">
                                            <div>
                                                <p className="text-[10px] text-neutral-400 line-through">Retail: ₹{tpl.price.toFixed(2)}</p>
                                                <p className="text-lg font-black text-indigo-600">₹{tpl.reseller_price.toFixed(2)}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                                                Reseller Price
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Footer Action */}
                                <div className="border-t p-4 bg-neutral-50/50">
                                    <Button
                                        onClick={() => handleSelectTemplate(tpl, 'invitation')}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all group-hover:scale-[1.01]"
                                    >
                                        Buy Template
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {catalog.templates.length === 0 && (
                            <div className="col-span-full border border-dashed rounded-2xl p-12 text-center text-neutral-400">
                                <p className="italic">No invitation card templates found.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'mini-websites' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {catalog.miniTemplates.map(tpl => (
                            <div key={tpl.id} className="group relative border border-neutral-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-200 transition-all flex flex-col justify-between">
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="h-48 w-full rounded-xl overflow-hidden relative border flex items-center justify-center">
                                        {tpl.preview_image ? (
                                            <img
                                                src={tpl.preview_image}
                                                alt={tpl.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1.5 text-neutral-400">
                                                <Store className="size-10 stroke-1 opacity-70" />
                                                <span className="text-xs">No preview image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-extrabold text-indigo-700 shadow-xs border">
                                            {tpl.type.toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base">{tpl.name}</h3>
                                        <div className="flex items-center gap-2.5 mt-3">
                                            <div>
                                                <p className="text-[10px] text-neutral-400 line-through">Retail: ₹{tpl.price.toFixed(2)}</p>
                                                <p className="text-lg font-black text-indigo-600">₹{tpl.reseller_price.toFixed(2)}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                                                Reseller Price
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t p-4 bg-neutral-50/50">
                                    <Button
                                        onClick={() => handleSelectTemplate(tpl, 'mini-website')}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all group-hover:scale-[1.01]"
                                    >
                                        Configure & Customize
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {catalog.miniTemplates.length === 0 && (
                            <div className="col-span-full border border-dashed rounded-2xl p-12 text-center text-neutral-400">
                                <p className="italic">No Mini Website templates found.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'business-websites' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {catalog.businessTemplates.filter(t => t.is_active).map(tpl => (
                            <div key={tpl.id} className="group relative border border-neutral-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-200 transition-all flex flex-col justify-between">
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="h-48 w-full bg-neutral-100 rounded-xl overflow-hidden relative border flex items-center justify-center">
                                        {tpl.preview_image ? (
                                            <img
                                                src={tpl.preview_image}
                                                alt={tpl.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1.5 text-neutral-400">
                                                <Globe className="size-10 stroke-1 opacity-70" />
                                                <span className="text-xs">No preview image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-800 text-base">{tpl.name}</h3>
                                        <div className="flex items-center gap-2.5 mt-3">
                                            <div>
                                                <p className="text-[10px] text-neutral-400 line-through">Retail: ₹{tpl.price.toFixed(2)}</p>
                                                <p className="text-lg font-black text-indigo-600">₹{tpl.reseller_price.toFixed(2)}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                                                Reseller Price
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t p-4 bg-neutral-50/50">
                                    <Button
                                        onClick={() => handleSelectTemplate(tpl, 'business-website')}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all group-hover:scale-[1.01]"
                                    >
                                        Configure & Customize
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {catalog.businessTemplates.filter(t => t.is_active).length === 0 && (
                            <div className="col-span-full border border-dashed rounded-2xl p-12 text-center text-neutral-400">
                                <p className="italic">No Business Website templates found.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Purchase Confirmation/Setup Dialog */}
                <Dialog open={selectedTemplate !== null} onOpenChange={() => setSelectedTemplate(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Sparkles className="size-5 text-indigo-600 animate-pulse" />
                                {selectedTemplate?.type === 'invitation' ? 'Confirm Purchase' : 'Configure & Customize Website'}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedTemplate?.type === 'invitation'
                                    ? 'Verify details below to purchase this template using your wallet balance.'
                                    : 'Choose a title, slug and theme to initialize this website template. You will customize the content as a draft first, then buy it when customization is complete.'}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedTemplate && (
                            <div className="py-2">
                                {/* Purchase Summary Card */}
                                <div className="border rounded-xl p-4 bg-neutral-50/50 flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-sm border-b pb-2">
                                        <span className="text-neutral-500">Template Name:</span>
                                        <span className="font-bold text-neutral-900">{selectedTemplate.name}</span>
                                    </div>
                                    {selectedTemplate.type === 'invitation' ? (
                                        <>
                                            <div className="flex justify-between items-center text-sm border-b pb-2">
                                                <span className="text-neutral-500">Retail Value:</span>
                                                <span className="text-neutral-400 line-through">₹{selectedTemplate.price.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-indigo-700 font-bold">Reseller Price:</span>
                                                <span className="text-lg font-black text-indigo-700">₹{selectedTemplate.reseller_price.toFixed(2)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-500">Template Reseller Price:</span>
                                            <span className="font-bold text-indigo-700">₹{selectedTemplate.reseller_price.toFixed(2)} (Pay after customization)</span>
                                        </div>
                                    )}
                                </div>

                                {/* Balance Warning if needed */}
                                {selectedTemplate.type === 'invitation' && !hasSufficientBalance && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-start gap-2">
                                        <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">Insufficient Wallet Balance</p>
                                            <p className="mt-0.5">You need an additional ₹{(selectedTemplate.reseller_price - wallet.balance).toFixed(2)} to complete this checkout.</p>
                                            <Link
                                                href="/reseller/wallet"
                                                className="mt-2 inline-block font-bold underline hover:text-red-800"
                                            >
                                                Go to Wallet Recharge &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* If Invitation Card: simple form */}
                                {selectedTemplate.type === 'invitation' ? (
                                    <form onSubmit={handleInvitationSubmit} className="mt-4 flex flex-col gap-4">
                                        <div className="flex justify-end gap-3 mt-2">
                                            <Button type="button" variant="outline" onClick={() => setSelectedTemplate(null)}>Cancel</Button>
                                            <Button
                                                type="submit"
                                                disabled={invitationForm.processing || !hasSufficientBalance}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6"
                                            >
                                                {invitationForm.processing ? 'Processing...' : 'Confirm Wallet Purchase'}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    /* If Mini / Business Website: require title, slug, theme */
                                    <form onSubmit={handleWebsiteSubmit} className="mt-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-1">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="site_title">Website Title</Label>
                                            <Input
                                                id="site_title"
                                                type="text"
                                                placeholder="e.g. Rahul & Preeti's Wedding"
                                                value={websiteForm.data.title}
                                                onChange={e => websiteForm.setData('title', e.target.value)}
                                                required
                                            />
                                            {websiteForm.errors.title && <p className="text-red-500 text-xs">{websiteForm.errors.title}</p>}
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="site_slug">Custom Slug (URL suffix)</Label>
                                            <div className="flex items-center">
                                                <span className="bg-neutral-100 border border-r-0 rounded-l-md px-3 py-1.5 text-xs text-neutral-500 select-none">
                                                    invitify.in/site/
                                                </span>
                                                <Input
                                                    id="site_slug"
                                                    type="text"
                                                    placeholder="rahul-preeti-2026"
                                                    value={websiteForm.data.slug}
                                                    onChange={e => handleSlugChange(e.target.value)}
                                                    className="rounded-l-none"
                                                    required
                                                />
                                            </div>
                                            <p className="text-[10px] text-neutral-400">Lowercase letters, numbers, dashes, and underscores only.</p>
                                            {websiteForm.errors.slug && <p className="text-red-500 text-xs">{websiteForm.errors.slug}</p>}
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="site_theme">Select Base Style / Theme</Label>
                                            <select
                                                id="site_theme"
                                                value={websiteForm.data.theme}
                                                onChange={e => websiteForm.setData('theme', e.target.value as any)}
                                                className="flex h-9 w-full rounded-md border border-neutral-200 bg-blue-800 px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-650"
                                                required
                                            >
                                                <option value="clean">Clean (Modern minimalist)</option>
                                                <option value="cozy">Cozy (Warm & intimate)</option>
                                                <option value="royal">Royal (Luxury & elegant)</option>
                                                <option value="ocean">Ocean (Cool & fresh)</option>
                                            </select>
                                            {websiteForm.errors.theme && <p className="text-red-500 text-xs">{websiteForm.errors.theme}</p>}
                                        </div>

                                        <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                                            <Button type="button" variant="outline" onClick={() => setSelectedTemplate(null)}>Cancel</Button>
                                            <Button
                                                type="submit"
                                                disabled={websiteForm.processing}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex-1"
                                            >
                                                {websiteForm.processing ? 'Configuring...' : 'Customize Template & Edit'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
