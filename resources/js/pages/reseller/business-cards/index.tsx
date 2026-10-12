import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    Sparkles, Plus, Edit2, Eye, Trash2, CreditCard, 
    Share2, ExternalLink, ShieldCheck, ShieldAlert,
    Copy, Check, Search, Smartphone, Tablet, Laptop, X, ArrowLeft, ArrowRight, Calendar, CheckCircle2, Loader2
} from 'lucide-react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reseller Dashboard',
        href: '/reseller/dashboard',
    },
    {
        title: 'Digital Business Cards',
        href: '/reseller/business-cards',
    },
];

interface BusinessCard {
    id: number;
    company_name: string;
    slug: string;
    theme_css: string;
    status: string;
    payment_status: string;
    created_at: string;
}

interface Template {
    id: number;
    name: string;
    css_file: string;
    thumbnail: string;
}

interface Plan {
    id: number;
    name: string;
    duration_months: number;
    price: number;
    description: string | null;
}

interface PageProps {
    cards: BusinessCard[];
    templates?: Template[];
    plans?: Plan[];
}

export default function BusinessCardIndex({ cards = [], templates = [], plans = [] }: PageProps) {
    const [activeTab, setActiveTab] = useState<'my-cards' | 'templates'>('my-cards');
    
    // My Cards State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Templates State
    const [searchQuery, setSearchQuery] = useState('');
    const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null);
    const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

    // Purchase flow
    const [purchaseTemplate, setPurchaseTemplate] = useState<Template | null>(null);
    const [purchaseStep, setPurchaseStep] = useState<'plan' | 'details'>('plan');
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [companyName, setCompanyName] = useState('');
    const [slug, setSlug] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [payError, setPayError] = useState('');

    const generateSlug = (val: string) => {
        return val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    };

    const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCompanyName(val);
        setSlug(generateSlug(val));
    };

    // Original Create (Blank)
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/reseller/business-cards', {
            company_name: companyName,
            slug: slug
        }, {
            onSuccess: () => {
                setIsCreateOpen(false);
                setCompanyName('');
                setSlug('');
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this digital business card? This action is permanent.')) {
            router.delete(`/reseller/business-cards/${id}`);
        }
    };

    const copyToClipboard = (id: number, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Template Store Functions
    const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const openPurchaseModal = (template: Template) => {
        setPurchaseTemplate(template);
        setPurchaseStep('plan');
        setSelectedPlan(plans.length > 0 ? plans[0] : null);
        setCompanyName('');
        setSlug('');
        setPayError('');
    };

    const closePurchaseModal = () => {
        setPurchaseTemplate(null);
        setSelectedPlan(null);
        setIsPaying(false);
        setPayError('');
    };

    const handleProceedToDetails = () => {
        if (!selectedPlan) { setPayError('Please select a plan.'); return; }
        setPayError('');
        setPurchaseStep('details');
    };

    const handlePayNow = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!purchaseTemplate || !selectedPlan) return;
        setIsPaying(true);
        setPayError('');

        try {
            const res = await axios.post('/reseller/business-cards/draft-create', {
                template_id: purchaseTemplate.id,
                plan_id: selectedPlan.id,
                company_name: companyName,
                slug: slug,
            });
            const data = res.data;
            if (data.success && data.redirect) {
                window.location.href = data.redirect;
            } else {
                setPayError(data.error || 'Something went wrong.');
                setIsPaying(false);
            }
        } catch (err: any) {
            setIsPaying(false);
            if (err.response?.data?.message) {
                setPayError(err.response.data.message);
            } else if (err.response?.data?.error) {
                setPayError(err.response.data.error);
            } else {
                setPayError('Failed to create card. Please check inputs.');
            }
        }
    };

    const getPreviewHtml = (cssFile: string) => {
        const themeUrl = `/css/business-cards/${cssFile}`;
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700,900|Ubuntu:400,500,700" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                    <link rel="stylesheet" href="${themeUrl}">
                </head>
                <body>
                    <div class="card_container">
                        <div class="header" id="home">
                            <div class="header_top">
                                <div class="header_top_left">
                                    <div class="company_name">Company Name</div>
                                    <div class="company_tagline">Your Professional Tagline</div>
                                </div>
                                <div class="header_top_right">
                                    <div class="company_logo">Logo</div>
                                </div>
                            </div>
                            <div class="header_bottom">
                                <h2>John Doe</h2>
                                <p>Managing Director</p>
                            </div>
                        </div>
                        <div class="contact_info">
                            <div class="contact_info_item">
                                <div class="contact_info_icon"><i class="fa fa-phone"></i></div>
                                <div class="contact_info_text">+1 234 567 8900</div>
                            </div>
                            <div class="contact_info_item">
                                <div class="contact_info_icon"><i class="fa fa-envelope"></i></div>
                                <div class="contact_info_text">john@example.com</div>
                            </div>
                            <div class="contact_info_item">
                                <div class="contact_info_icon"><i class="fa fa-globe"></i></div>
                                <div class="contact_info_text">www.example.com</div>
                            </div>
                            <div class="contact_info_item">
                                <div class="contact_info_icon"><i class="fa fa-map-marker"></i></div>
                                <div class="contact_info_text">123 Business Avenue, Tech Park</div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Digital Business Cards</title>
            </Head>
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            Digital Business Cards <Sparkles className="size-6 text-amber-500" />
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Create, customize, and manage your premium step-by-step smart digital vCards.
                        </p>
                    </div>
                    
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="size-4" /> Blank Card
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800">
                    <button
                        onClick={() => setActiveTab('my-cards')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'my-cards' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                    >
                        My Cards
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'templates' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                    >
                        Explore Themes
                    </button>
                </div>

                {/* Tab Content: My Cards */}
                {activeTab === 'my-cards' && (
                    <>
                        {cards.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-12 text-center bg-white dark:bg-neutral-900 shadow-sm mt-4">
                                <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 p-4 text-blue-600 dark:text-blue-400 mb-4">
                                    <Sparkles className="size-8 animate-pulse" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">No Business Cards Yet</h3>
                                <p className="mt-1 text-sm text-neutral-505 dark:text-neutral-400 max-w-sm">
                                    Create your first smart business card to showcase your company, products, and contact details.
                                </p>
                                <button
                                    onClick={() => setActiveTab('templates')}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                                >
                                    Explore Themes Now
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                                {cards.map((card) => {
                                    const publicUrl = `${window.location.origin}/card/${card.slug}`;
                                    return (
                                        <div
                                            key={card.id}
                                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all dark:border-neutral-800 dark:bg-neutral-900"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {card.company_name}
                                                        </h3>
                                                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                                            ID: #{card.id} • Created {new Date(card.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        card.status === 'active' 
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450' 
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-450'
                                                    }`}>
                                                        {card.status === 'active' ? (
                                                            <ShieldCheck className="size-3" />
                                                        ) : (
                                                            <ShieldAlert className="size-3" />
                                                        )}
                                                        {card.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="mt-4 border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-950/40">
                                                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                                                        <span>Payment Status</span>
                                                        <span className={`font-semibold ${
                                                            card.payment_status === 'Success' 
                                                                ? 'text-emerald-600 dark:text-emerald-400' 
                                                                : 'text-amber-500'
                                                        }`}>
                                                            {card.payment_status}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={publicUrl}
                                                            className="w-full text-[11px] font-mono select-all bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-2 py-1 text-neutral-600 dark:text-neutral-400 focus:outline-none"
                                                        />
                                                        <button
                                                            onClick={() => copyToClipboard(card.id, publicUrl)}
                                                            className="p-1.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-500"
                                                            title="Copy Link"
                                                        >
                                                            {copiedId === card.id ? (
                                                                <Check className="size-3.5 text-emerald-500" />
                                                            ) : (
                                                                <Copy className="size-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center border-t border-neutral-100 dark:border-neutral-800 divide-x divide-neutral-100 dark:divide-neutral-800">
                                                <Link
                                                    href={`/reseller/business-cards/${card.id}/edit`}
                                                    className="flex-1 py-3 text-xs font-semibold text-neutral-700 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-center gap-1.5 transition-colors"
                                                >
                                                    <Edit2 className="size-3.5" /> Edit Card
                                                </Link>
                                                
                                                <a
                                                    href={`/card/${card.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 py-3 text-xs font-semibold text-blue-650 dark:text-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 flex items-center justify-center gap-1.5 transition-colors"
                                                >
                                                    <Eye className="size-3.5" /> Preview <ExternalLink className="size-3" />
                                                </a>

                                                <button
                                                    onClick={() => handleDelete(card.id)}
                                                    className="px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-50/30 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center"
                                                    title="Delete Card"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* Tab Content: Explore Themes */}
                {activeTab === 'templates' && (
                    <div className="mt-4 flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Select from our premium designs to create your next digital business card.
                            </p>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search themes..."
                                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-10 pr-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-blue-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {filteredTemplates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                                <p className="text-neutral-500 text-sm">No templates match your search query.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {filteredTemplates.map((temp) => (
                                    <div
                                        key={temp.id}
                                        className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900"
                                    >
                                        <div className="relative w-full aspect-[9/18] bg-[#1a1a1a] rounded-[24px] overflow-hidden border-[4px] border-[#1a1a1a] shadow-lg flex flex-col p-1 transition-all">
                                            <div className="relative w-full h-full bg-white rounded-[18px] overflow-hidden">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1a1a1a] rounded-b-xl z-10 flex justify-center items-center">
                                                    <div className="w-2 h-2 rounded-full bg-black shadow-inner"></div>
                                                </div>
                                                <img
                                                    src={temp.thumbnail}
                                                    alt={temp.name}
                                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/images/business-cards/template1.png';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 px-1 text-center">
                                            <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 block mb-4 truncate">
                                                {temp.name}
                                            </span>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setPreviewingTemplate(temp)}
                                                    className="w-full inline-flex items-center justify-center py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-[11px] font-bold shadow-sm transition-colors"
                                                >
                                                    <Eye className="size-3.5 mr-1" /> Preview
                                                </button>
                                                <button
                                                    onClick={() => openPurchaseModal(temp)}
                                                    className="w-full inline-flex items-center justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition-colors"
                                                >
                                                    <CreditCard className="size-3.5 mr-1" /> Select
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Blank Card Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Create Smart Business Card</h2>
                        <p className="text-xs text-neutral-500 mt-1">Initialize your digital card slug and company profile name.</p>
                        
                        <form onSubmit={handleCreateSubmit} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                                    Company / Business Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={companyName}
                                    onChange={handleCompanyNameChange}
                                    placeholder="e.g. Acme Corporation"
                                    className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                                    URL ID (Slug Link)
                                </label>
                                <div className="mt-1 flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
                                    <span className="bg-neutral-100 dark:bg-neutral-900 text-[11px] font-mono px-3 py-2.5 text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">
                                        /card/
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={slug}
                                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                                        placeholder="acme-corporation"
                                        className="w-full bg-transparent p-2.5 text-sm focus:outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-2 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Template Preview Modal */}
            {previewingTemplate && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900">
                            <div>
                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-md">{previewingTemplate.name}</h3>
                                <p className="text-[11px] uppercase tracking-widest font-bold">Live CSS preview</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5">
                                    <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><Smartphone className="size-4" /></button>
                                    <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded ${previewMode === 'tablet' ? 'bg-blue-600 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><Tablet className="size-4" /></button>
                                    <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><Laptop className="size-4" /></button>
                                </div>
                                <button
                                    onClick={() => { setPreviewingTemplate(null); openPurchaseModal(previewingTemplate); }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                                >
                                    <CreditCard className="size-3.5" /> Choose Template
                                </button>
                                <button onClick={() => setPreviewingTemplate(null)} className="p-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    <X className="size-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 w-full flex items-center justify-center p-6 overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                            <div className={`shadow-2xl flex flex-col transition-all duration-300 relative shrink-0 ${previewMode === 'mobile' ? 'w-[375px] aspect-[9/19.5] max-h-full bg-[#1a1a1a] border-[6px] border-[#1a1a1a] rounded-[44px] p-2' : previewMode === 'tablet' ? 'w-[768px] aspect-[3/4] max-h-full bg-[#1a1a1a] border-[8px] border-[#1a1a1a] rounded-[32px] p-2' : 'w-full h-full bg-white rounded-xl shadow-none'}`}>
                                {previewMode !== 'desktop' && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-20 flex justify-center items-center">
                                        <div className="size-2 bg-black/80 shadow-inner rounded-full"></div>
                                    </div>
                                )}
                                <div className={`w-full h-full bg-white overflow-hidden relative ${previewMode === 'mobile' ? 'rounded-[34px]' : previewMode === 'tablet' ? 'rounded-[22px]' : 'rounded-xl border border-neutral-200'}`}>
                                    <iframe srcDoc={getPreviewHtml(previewingTemplate.css_file)} className="w-full h-full border-0 select-none overflow-y-auto bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Template Purchase / Select Modal */}
            {purchaseTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                                {purchaseStep === 'details' && (
                                    <button onClick={() => setPurchaseStep('plan')} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-500">
                                        <ArrowLeft className="size-4" />
                                    </button>
                                )}
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                        {purchaseStep === 'plan' ? 'Choose a Subscription Plan' : 'Your Card Details'}
                                    </h2>
                                    <p className="text-xs text-neutral-500 font-bold uppercase">{purchaseTemplate.name} — {purchaseTemplate.css_file}</p>
                                </div>
                            </div>
                            <button onClick={closePurchaseModal} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500">
                                <X className="size-4" />
                            </button>
                        </div>

                        {purchaseStep === 'plan' && (
                            <div className="p-6 flex flex-col gap-5">
                                {plans.length === 0 ? (
                                    <div className="text-center py-10 text-neutral-500">
                                        No subscription plans configured.
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {plans.map((plan) => (
                                                <button
                                                    key={plan.id}
                                                    onClick={() => setSelectedPlan(plan)}
                                                    className={`relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                                                        selectedPlan?.id === plan.id
                                                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-800'
                                                    }`}
                                                >
                                                    {selectedPlan?.id === plan.id && (
                                                        <div className="absolute top-3 right-3 text-blue-600">
                                                            <CheckCircle2 className="size-5" />
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-neutral-500">
                                                        <Calendar className="size-4" />
                                                        <span className="text-xs font-semibold uppercase">
                                                            {plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
                                                        ₹{plan.price.toLocaleString('en-IN')}
                                                    </div>
                                                    <p className="font-bold text-sm text-neutral-700 dark:text-neutral-300 mt-1">{plan.name}</p>
                                                    {plan.description && (
                                                        <p className="text-xs text-neutral-500 mt-2">{plan.description}</p>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {payError && <p className="text-red-500 text-xs text-center font-bold">{payError}</p>}

                                        <div className="flex gap-3 justify-end mt-4">
                                            <button onClick={closePurchaseModal} className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800">Cancel</button>
                                            <button
                                                onClick={handleProceedToDetails}
                                                disabled={!selectedPlan}
                                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm disabled:opacity-50"
                                            >
                                                Next <ArrowRight className="size-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {purchaseStep === 'details' && (
                            <form onSubmit={handlePayNow} className="p-6 flex flex-col gap-5">
                                {selectedPlan && (
                                    <div className="flex items-center justify-between rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-3">
                                        <div>
                                            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase">{selectedPlan.name}</p>
                                            <p className="text-[11px] text-neutral-500 font-bold">{selectedPlan.duration_months} months</p>
                                        </div>
                                        <span className="text-xl font-black text-blue-600 dark:text-blue-400">₹{selectedPlan.price.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400">Company / Business Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={companyName}
                                        onChange={handleCompanyNameChange}
                                        placeholder="e.g. Acme Corporation"
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400">Card URL</label>
                                    <div className="flex items-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden focus-within:border-blue-500">
                                        <span className="px-3 py-2.5 text-[11px] font-mono bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">/card/</span>
                                        <input
                                            type="text"
                                            required
                                            value={slug}
                                            onChange={e => setSlug(generateSlug(e.target.value))}
                                            placeholder="acme-corporation"
                                            className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {payError && <p className="text-red-500 text-xs text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3 font-bold">{payError}</p>}

                                <div className="flex gap-3 justify-end mt-2">
                                    <button type="button" onClick={closePurchaseModal} className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={isPaying}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm disabled:opacity-70"
                                    >
                                        {isPaying ? <><Loader2 className="size-4 animate-spin" /> Creating...</> : <><ArrowRight className="size-4" /> Create & Checkout</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
