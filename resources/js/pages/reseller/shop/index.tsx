import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
    Store, ShoppingBag, Globe, LayoutGrid, Sparkles, ShieldAlert,
    ChevronLeft, Search, Wallet, X, ArrowRight, CheckCircle2
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reseller Dashboard', href: '/reseller/dashboard' },
    { title: 'Shop', href: '/reseller/shop' },
];

interface Template {
    id: number;
    name: string;
    category: string;
    price: number;
    reseller_price: number;
    bg_gradient: string | null;
    thumbnail: string | null;
    default_config: any;
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
    wallet: { balance: number };
    catalog: {
        templates: Template[];
        miniTemplates: MiniTemplate[];
        businessTemplates: BusinessTemplate[];
    };
}

export default function ResellerShop({ wallet, catalog }: ShopPageProps) {
    const [activeTab, setActiveTab] = useState<'invitations' | 'mini-websites' | 'business-websites'>('invitations');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Cards');

    const [selectedTemplate, setSelectedTemplate] = useState<{
        id: number;
        name: string;
        price: number;
        reseller_price: number;
        type: 'invitation' | 'mini-website' | 'business-website';
    } | null>(null);

    const invitationForm = useForm({ template_id: '' });
    const websiteForm = useForm({
        template_id: '',
        title: '',
        slug: '',
        theme: 'clean' as 'cozy' | 'clean' | 'royal' | 'ocean',
    });

    const handleSelectTemplate = (template: any, type: 'invitation' | 'mini-website' | 'business-website') => {
        setSelectedTemplate({ id: template.id, name: template.name, price: template.price, reseller_price: template.reseller_price, type });
        if (type === 'invitation') {
            invitationForm.setData('template_id', String(template.id));
        } else {
            websiteForm.setData({ template_id: String(template.id), title: '', slug: '', theme: 'clean' });
            websiteForm.clearErrors();
        }
    };

    const handleInvitationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        invitationForm.post('/reseller/purchase/template', {
            onSuccess: () => { setSelectedTemplate(null); invitationForm.reset(); },
        });
    };

    const handleWebsiteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const route = selectedTemplate?.type === 'mini-website' ? '/reseller/purchase/mini-website' : '/reseller/purchase/business-website';
        websiteForm.post(route, {
            onSuccess: () => { setSelectedTemplate(null); websiteForm.reset(); },
        });
    };

    const handleSlugChange = (val: string) => {
        websiteForm.setData('slug', val.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-'));
    };

    const hasSufficientBalance = selectedTemplate ? wallet.balance >= selectedTemplate.reseller_price : true;

    // Category tabs from invitation templates
    const invCategories = ['All Cards', ...Array.from(new Set(catalog.templates.map(t => t.category || 'Other')))];

    const filteredTemplates = catalog.templates.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = activeCategory === 'All Cards' || t.category === activeCategory;
        return matchSearch && matchCat;
    });

    const tabs = [
        { key: 'invitations', label: 'Invitation Cards', count: catalog.templates.length, icon: LayoutGrid },
        { key: 'mini-websites', label: 'Mini Websites', count: catalog.miniTemplates.length, icon: Store },
        { key: 'business-websites', label: 'Business Websites', count: catalog.businessTemplates.length, icon: Globe },
    ] as const;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reseller Shop" />

            <div className="p-6 xl:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full">

                {/* ===== PAGE HEADER ===== */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <ShoppingBag className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Reseller Shop
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Purchase templates at exclusive reseller prices and start selling to your clients.
                        </p>
                    </div>

                    {/* Wallet Balance Widget */}
                    <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl px-5 py-3 shadow-lg shadow-indigo-200/50 dark:shadow-none">
                        <Wallet className="size-5 opacity-80" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Wallet Balance</p>
                            <p className="text-xl font-black">₹{wallet.balance.toFixed(2)}</p>
                        </div>
                        <Link
                            href="/reseller/wallet"
                            className="ml-2 text-xs font-bold bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1.5 rounded-xl transition-all"
                        >
                            Add Funds
                        </Link>
                    </div>
                </div>

                {/* ===== MAIN TABS ===== */}
                <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto pb-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setSearchQuery(''); setActiveCategory('All Cards'); }}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.key
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
                        >
                            <tab.icon className="size-4" />
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* ===== INVITATION CARDS ===== */}
                {activeTab === 'invitations' && (
                    <div className="flex flex-col gap-5">
                        {/* Search + Category Filter */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 h-9 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                            </div>
                            {/* Category pills */}
                            <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
                                {invCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${activeCategory === cat
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cards Grid — same layout as customer static-templates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {filteredTemplates.map(tpl => (
                                <div
                                    key={tpl.id}
                                    className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs transition-all hover:shadow-md dark:border-neutral-850 dark:bg-neutral-900"
                                >
                                    {/* Card Graphic Preview */}
                                    <div
                                        className={`relative flex aspect-video flex-col items-center justify-center p-6 bg-gradient-to-tr ${tpl.bg_gradient || 'from-neutral-100 to-neutral-200'} border-b border-neutral-100 dark:border-neutral-850 overflow-hidden`}
                                        style={{
                                            fontFamily: tpl.default_config?.font_style === 'vibes' ? "'Great Vibes', cursive" : tpl.default_config?.font_style === 'cinzel' ? "'Cinzel', serif" : tpl.default_config?.font_style === 'montserrat' ? "'Montserrat', sans-serif" : "'Playfair Display', serif",
                                            backgroundImage: tpl.default_config?.layout_style === 'photo-bg' && tpl.default_config?.image_url ? `url(${tpl.default_config.image_url})` : undefined,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    >
                                        {tpl.default_config?.layout_style === 'photo-bg' && tpl.default_config?.image_url && (
                                            <div className="absolute inset-0 bg-black/45" />
                                        )}

                                        {tpl.default_config?.layout_style === 'split-hero' && (
                                            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-neutral-200/90 dark:bg-neutral-800/90 border-l border-neutral-200 flex items-center justify-center text-[8px] font-bold text-neutral-400 select-none">IMAGE</div>
                                        )}

                                        <div 
                                            className="text-center pointer-events-none scale-85 opacity-90 z-10 relative"
                                            style={{ color: tpl.default_config?.layout_style === 'photo-bg' && tpl.default_config?.image_url ? '#ffffff' : undefined }}
                                        >
                                            <p className="text-[10px] tracking-wider uppercase font-semibold opacity-70">
                                                {tpl.default_config?.title}
                                            </p>
                                            <p className="text-lg font-bold my-1 truncate max-w-[180px]">
                                                {tpl.default_config?.guest_of_honor}
                                            </p>
                                            <p className="text-[8px] opacity-70">
                                                {tpl.default_config?.date}
                                            </p>
                                        </div>
                                        <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs z-20">
                                            ₹{parseFloat(String(tpl.reseller_price)).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Card Details - Dark Theme */}
                                    <div className="flex flex-1 flex-col justify-between p-5 bg-[#171717]">
                                        <div>
                                            <h3 className="text-lg font-bold text-blue-400">
                                                {tpl.name}
                                            </h3>
                                            <p className="mt-1 text-xs capitalize text-neutral-400 font-medium">
                                                Category: {tpl.category ? tpl.category.replace('_', ' ') : 'Other'}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/reseller/templates/${tpl.id}/customize`}
                                            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                                        >
                                            Customize & Buy <ArrowRight className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {filteredTemplates.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3 text-neutral-400">
                                    <Search className="size-10 stroke-1" />
                                    <p className="text-sm">No templates found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== MINI WEBSITES ===== */}
                {activeTab === 'mini-websites' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {catalog.miniTemplates.map(tpl => (
                            <div key={tpl.id} className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
                                <div className="relative h-52 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                    {tpl.preview_image ? (
                                        <img src={tpl.preview_image} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-neutral-400">
                                            <Store className="size-10 stroke-1 opacity-50" />
                                            <span className="text-xs">No preview</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                                        {tpl.type.toUpperCase()}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1 gap-3">
                                    <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{tpl.name}</h3>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div>
                                            <p className="text-[10px] text-neutral-400 line-through">Retail ₹{tpl.price.toFixed(2)}</p>
                                            <p className="text-base font-black text-indigo-600 dark:text-indigo-400">₹{tpl.reseller_price.toFixed(2)}</p>
                                        </div>
                                        <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded-full">Reseller Price</span>
                                    </div>
                                    <Button onClick={() => handleSelectTemplate(tpl, 'mini-website')} className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">
                                        Configure & Buy →
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {catalog.miniTemplates.length === 0 && (
                            <div className="col-span-full border-2 border-dashed rounded-2xl p-14 text-center text-neutral-400">
                                <Globe className="size-10 stroke-1 mx-auto mb-3" />
                                <p className="text-sm italic">No Mini Website templates available yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== BUSINESS WEBSITES ===== */}
                {activeTab === 'business-websites' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {catalog.businessTemplates.filter(t => t.is_active).map(tpl => (
                            <div key={tpl.id} className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
                                <div className="relative h-52 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                    {tpl.preview_image ? (
                                        <img src={tpl.preview_image} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-neutral-400">
                                            <Globe className="size-10 stroke-1 opacity-50" />
                                            <span className="text-xs">No preview</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1 gap-3">
                                    <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{tpl.name}</h3>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div>
                                            <p className="text-[10px] text-neutral-400 line-through">Retail ₹{tpl.price.toFixed(2)}</p>
                                            <p className="text-base font-black text-indigo-600 dark:text-indigo-400">₹{tpl.reseller_price.toFixed(2)}</p>
                                        </div>
                                        <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded-full">Reseller Price</span>
                                    </div>
                                    <Button onClick={() => handleSelectTemplate(tpl, 'business-website')} className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">
                                        Configure & Buy →
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {catalog.businessTemplates.filter(t => t.is_active).length === 0 && (
                            <div className="col-span-full border-2 border-dashed rounded-2xl p-14 text-center text-neutral-400">
                                <Globe className="size-10 stroke-1 mx-auto mb-3" />
                                <p className="text-sm italic">No Business Website templates available yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ===== PURCHASE DIALOG ===== */}
            <Dialog open={selectedTemplate !== null} onOpenChange={() => setSelectedTemplate(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                            <Sparkles className="size-5 text-indigo-600" />
                            {selectedTemplate?.type === 'invitation' ? 'Confirm Purchase' : 'Configure Website'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                            {selectedTemplate?.type === 'invitation'
                                ? 'Purchase this template using your wallet balance.'
                                : 'Set up title, slug and theme. You can customize content before final payment.'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTemplate && (
                        <div className="px-6 py-5 flex flex-col gap-4">
                            {/* Summary */}
                            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-neutral-400 mb-0.5">Template</p>
                                    <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{selectedTemplate.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-neutral-400 line-through">₹{selectedTemplate.price.toFixed(2)}</p>
                                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">₹{selectedTemplate.reseller_price.toFixed(2)}</p>
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Reseller Price</span>
                                </div>
                            </div>

                            {/* Insufficient balance warning */}
                            {selectedTemplate.type === 'invitation' && !hasSufficientBalance && (
                                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400">
                                    <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Insufficient Wallet Balance</p>
                                        <p className="mt-0.5">You need ₹{(selectedTemplate.reseller_price - wallet.balance).toFixed(2)} more.</p>
                                        <Link href="/reseller/wallet" className="mt-1.5 inline-block font-bold underline hover:text-red-800">
                                            Add Funds →
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Wallet balance info */}
                            {selectedTemplate.type === 'invitation' && hasSufficientBalance && (
                                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl px-4 py-2.5">
                                    <CheckCircle2 className="size-4 shrink-0" />
                                    <span>Wallet balance: <strong>₹{wallet.balance.toFixed(2)}</strong> — sufficient for this purchase</span>
                                </div>
                            )}

                            {/* Invitation: simple confirm */}
                            {selectedTemplate.type === 'invitation' ? (
                                <form onSubmit={handleInvitationSubmit} className="flex gap-3 mt-1">
                                    <button type="button" onClick={() => setSelectedTemplate(null)}
                                        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 font-medium px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors">
                                        <ChevronLeft className="size-4" /> Cancel
                                    </button>
                                    <Button
                                        type="submit"
                                        disabled={invitationForm.processing || !hasSufficientBalance}
                                        className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                                    >
                                        {invitationForm.processing ? 'Processing…' : '✓ Confirm Wallet Purchase'}
                                    </Button>
                                </form>
                            ) : (
                                /* Mini / Business Website: require title, slug, theme */
                                <form onSubmit={handleWebsiteSubmit} className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-1">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="site_title" className="text-sm font-semibold">Website Title</Label>
                                        <Input
                                            id="site_title"
                                            type="text"
                                            placeholder="e.g. Rahul & Preeti's Wedding"
                                            value={websiteForm.data.title}
                                            onChange={e => websiteForm.setData('title', e.target.value)}
                                            required
                                            className="h-11 rounded-xl"
                                        />
                                        {websiteForm.errors.title && <p className="text-red-500 text-xs">{websiteForm.errors.title}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="site_slug" className="text-sm font-semibold">URL Slug</Label>
                                        <div className="flex items-center rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                                            <span className="bg-neutral-100 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 px-3 h-11 flex items-center text-xs text-neutral-500 shrink-0">
                                                /site/
                                            </span>
                                            <input
                                                id="site_slug"
                                                type="text"
                                                placeholder="rahul-preeti-2026"
                                                value={websiteForm.data.slug}
                                                onChange={e => handleSlugChange(e.target.value)}
                                                className="flex-1 h-11 px-3 text-sm bg-white dark:bg-neutral-900 outline-none"
                                                required
                                            />
                                        </div>
                                        <p className="text-[10px] text-neutral-400">Lowercase letters, numbers, dashes only.</p>
                                        {websiteForm.errors.slug && <p className="text-red-500 text-xs">{websiteForm.errors.slug}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="site_theme" className="text-sm font-semibold">Base Theme</Label>
                                        <select
                                            id="site_theme"
                                            value={websiteForm.data.theme}
                                            onChange={e => websiteForm.setData('theme', e.target.value as any)}
                                            className="flex h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 text-sm outline-none"
                                            required
                                        >
                                            <option value="clean">Clean — Modern minimalist</option>
                                            <option value="cozy">Cozy — Warm & intimate</option>
                                            <option value="royal">Royal — Luxury & elegant</option>
                                            <option value="ocean">Ocean — Cool & fresh</option>
                                        </select>
                                        {websiteForm.errors.theme && <p className="text-red-500 text-xs">{websiteForm.errors.theme}</p>}
                                    </div>

                                    <div className="flex gap-3 mt-2">
                                        <button type="button" onClick={() => setSelectedTemplate(null)}
                                            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 font-medium px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors">
                                            <ChevronLeft className="size-4" /> Cancel
                                        </button>
                                        <Button
                                            type="submit"
                                            disabled={websiteForm.processing}
                                            className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                                        >
                                            {websiteForm.processing ? 'Configuring…' : 'Customize & Edit →'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
