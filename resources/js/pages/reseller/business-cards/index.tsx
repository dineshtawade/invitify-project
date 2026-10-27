import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    Sparkles, Plus, Edit2, Eye, Trash2, CreditCard, 
    Share2, ExternalLink, ShieldCheck, ShieldAlert,
    Copy, Check, Search, Smartphone, Tablet, Laptop, X, ArrowLeft, ArrowRight, Calendar, CheckCircle2, Loader2,
    TreePine, RefreshCw, Zap, Phone, MessageSquare, MapPin, QrCode, Download,
    Rocket, Bell, DollarSign, Award, Layers, CheckCircle, Globe, Video, Store, HeartHandshake,
    ArrowUpRight, AlertCircle, ShoppingBag
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
    const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'my-cards'>('overview');
    const [notified, setNotified] = useState(false);
    
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
                                <div class="contact_info_text">+91 98765 43210</div>
                            </div>
                            <div class="contact_info_item">
                                <div class="contact_info_icon"><i class="fa fa-envelope"></i></div>
                                <div class="contact_info_text">contact@example.com</div>
                            </div>
                            <div class="contact_info_item">
                                <div class="contact_info_icon"><i class="fa fa-globe"></i></div>
                                <div class="contact_info_text">www.example.com</div>
                            </div>
                            <div class="contact_info_item">
                                <div class="contact_info_icon"><i class="fa fa-map-marker"></i></div>
                                <div class="contact_info_text">123 Tech Hub, Business Park</div>
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
                <title>Digital Business Cards — Coming Soon | Invitify</title>
            </Head>
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/50">
                                <Rocket className="size-3.5 animate-bounce" /> Coming Soon for Resellers
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <TreePine className="size-3 text-emerald-600" /> 100% Eco-Friendly
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mt-1">
                            Smart Digital Business Cards <Sparkles className="size-6 text-amber-500 shrink-0" />
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
                            The modern, paperless solution to network and grow business. Save wood, update details anytime in real-time, and share instantly anywhere in the world!
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => {
                                setNotified(true);
                                setTimeout(() => setNotified(false), 4000);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Bell className="size-4" />
                            {notified ? 'Priority Added! 🎉' : 'Notify Me on Launch'}
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'overview' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                    >
                        <Sparkles className="size-4" />
                        Benefits & Advantages (फायदे)
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'templates' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                    >
                        <Layers className="size-4" />
                        Upcoming Themes ({templates.length > 0 ? templates.length : '100+'})
                    </button>
                    <button
                        onClick={() => setActiveTab('my-cards')}
                        className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'my-cards' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                    >
                        <CreditCard className="size-4" />
                        My Cards ({cards.length})
                    </button>
                </div>

                {/* Notification Banner */}
                {notified && (
                    <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-5 text-emerald-600" />
                            <span>Aap priority early-access list me add ho chuke hain! Jaise hi feature live hoga, sabse pehle aapko notification milega.</span>
                        </div>
                        <button onClick={() => setNotified(false)} className="text-emerald-600 hover:text-emerald-800">
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {/* ========================================================= */}
                {/* TAB 1: OVERVIEW & BENEFITS (COMING SOON SHOWCASE) */}
                {/* ========================================================= */}
                {activeTab === 'overview' && (
                    <div className="flex flex-col gap-10">

                        {/* ===== HERO HIGHLIGHT CARD ===== */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-10 shadow-2xl border border-indigo-700/50">
                            {/* Decorative blur glows */}
                            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                
                                {/* Left Content */}
                                <div className="lg:col-span-7 flex flex-col gap-5">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 w-fit">
                                        <TreePine className="size-4 text-emerald-400" />
                                        <span>Save Wood & Trees • 100% Eco-Friendly Revolution</span>
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                        No More Paper Cards.<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
                                            The Smart Digital Era
                                        </span> Is Here!
                                    </h2>

                                    <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-xl">
                                        Traditional paper business cards are expensive to print, impossible to update, and <strong>88% are thrown away within 7 days</strong>.
                                        Invitify Smart Digital Business Cards enable you and your clients to share contact info, products, portfolio, and payment QR codes with a single tap!
                                    </p>

                                    {/* Key Points Pill List */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-white/90 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
                                            <CheckCircle className="size-4 text-emerald-400 shrink-0" />
                                            <span>🌲 Save Trees & Wood (Zero Paper)</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-white/90 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
                                            <CheckCircle className="size-4 text-emerald-400 shrink-0" />
                                            <span>⚡ 1-Click WhatsApp & QR Share</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-white/90 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
                                            <CheckCircle className="size-4 text-emerald-400 shrink-0" />
                                            <span>🔄 Live Instant Updates Anytime</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-white/90 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
                                            <CheckCircle className="size-4 text-emerald-400 shrink-0" />
                                            <span>📲 1-Tap Save to Phone Contacts</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 pt-4">
                                        <button
                                            onClick={() => setActiveTab('templates')}
                                            className="px-6 py-3 rounded-2xl bg-white text-indigo-900 hover:bg-neutral-100 font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <Eye className="size-4 text-indigo-600" />
                                            Preview 100+ Upcoming Themes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNotified(true);
                                                setTimeout(() => setNotified(false), 4000);
                                            }}
                                            className="px-6 py-3 rounded-2xl bg-indigo-700/60 hover:bg-indigo-700 text-white border border-indigo-500/40 font-bold text-xs sm:text-sm backdrop-blur-sm transition-all"
                                        >
                                            🚀 Join Early Access Reseller List
                                        </button>
                                    </div>
                                </div>

                                {/* Right: Realistic Interactive Phone Mockup */}
                                <div className="lg:col-span-5 flex justify-center">
                                    <div className="w-[280px] sm:w-[320px] rounded-[42px] p-3 bg-neutral-900 border-[7px] border-neutral-800 shadow-2xl relative text-neutral-900">
                                        {/* Camera Notch */}
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-800 rounded-full z-30 flex items-center justify-center">
                                            <div className="size-2.5 rounded-full bg-neutral-950/80 mr-2" />
                                            <div className="size-1.5 rounded-full bg-indigo-500/40" />
                                        </div>

                                        {/* Phone Screen */}
                                        <div className="w-full bg-neutral-50 dark:bg-neutral-950 rounded-[32px] overflow-hidden flex flex-col shadow-inner border border-neutral-200/50">
                                            
                                            {/* Card Banner */}
                                            <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative p-3">
                                                <span className="absolute top-3 right-3 text-[9px] bg-black/40 text-white font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                    ECO CARD
                                                </span>
                                            </div>

                                            {/* Profile Avatar & Info */}
                                            <div className="px-4 pb-4 -mt-10 flex flex-col items-center text-center">
                                                <div className="size-20 rounded-2xl border-4 border-white dark:border-neutral-900 bg-gradient-to-tr from-amber-400 to-pink-500 shadow-md flex items-center justify-center text-white font-black text-2xl">
                                                    VM
                                                </div>

                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">Vikram Malhotra</h3>
                                                    <ShieldCheck className="size-4 text-blue-500" />
                                                </div>
                                                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Founder · Apex Digital Studio</p>
                                                <p className="text-[10px] text-neutral-400 mt-0.5">Mumbai, Maharashtra</p>

                                                {/* Action Buttons Row */}
                                                <div className="grid grid-cols-4 gap-2 w-full mt-3.5">
                                                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 text-[10px] font-bold">
                                                        <Phone className="size-3.5" /> Call
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[10px] font-bold">
                                                        <MessageSquare className="size-3.5" /> WhatsApp
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-[10px] font-bold">
                                                        <MapPin className="size-3.5" /> Map
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 text-[10px] font-bold">
                                                        <QrCode className="size-3.5" /> UPI Pay
                                                    </div>
                                                </div>

                                                {/* Save Contact Button */}
                                                <div className="w-full mt-3">
                                                    <button className="w-full py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm">
                                                        <Download className="size-3" /> Save to Contacts (.vcf)
                                                    </button>
                                                </div>

                                                {/* Mini Products / Services preview */}
                                                <div className="w-full mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-left">
                                                    <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1.5">Services & Products</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        <span className="text-[9px] bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-md font-semibold text-neutral-700 dark:text-neutral-300">Web Design</span>
                                                        <span className="text-[9px] bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-md font-semibold text-neutral-700 dark:text-neutral-300">Digital Marketing</span>
                                                        <span className="text-[9px] bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-md font-semibold text-neutral-700 dark:text-neutral-300">Invitations</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== CORE BENEFITS (फायदे) SECTION ===== */}
                        <div className="flex flex-col gap-6">
                            <div className="text-center max-w-2xl mx-auto">
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200/50">
                                    WHY DIGITAL BUSINESS CARDS?
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 mt-2">
                                    डिजिटल विजिटिंग कार्ड के जबरदस्त फायदे
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                    Traditional paper visiting cards are outdated. Here is why every modern business and reseller is switching to Smart Digital Cards!
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                
                                {/* Benefit 1: Save Trees & Wood */}
                                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-4">
                                            <TreePine className="size-6" />
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                            Save Trees & Wood
                                            <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold px-2 py-0.5 rounded-full">Eco-Friendly</span>
                                        </h4>
                                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-0.5">
                                            पेड़ और पर्यावरण की भारी सुरक्षा
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                                            Har saal laakhon ped sirf paper cards print karne me kaate jaate hain jo 7 din me kude me chale jaate hain. Digital card se <strong>zero paper & wood waste</strong> hota hai aur environment protect hota hai.
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> 100% Tree-Free & Green
                                    </div>
                                </div>

                                {/* Benefit 2: Easily Share Anywhere */}
                                <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-4">
                                            <Share2 className="size-6" />
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                            Easily Share Anywhere
                                            <span className="text-[10px] bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 font-bold px-2 py-0.5 rounded-full">1-Click</span>
                                        </h4>
                                        <p className="text-xs font-bold text-blue-800 dark:text-blue-400 mt-0.5">
                                            कहीं भी, किसी को भी तुरंत शेयर करें
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                                            Pocket me 50 cards leke ghumne ki zaroorat nahi. WhatsApp, QR Code scan, NFC card tap, SMS, Email ya Social Media bio se kisi ko bhi 1-second me share karein bina koi physical limit ke.
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 text-[11px] font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> WhatsApp · QR · NFC · Link
                                    </div>
                                </div>

                                {/* Benefit 3: Update Everything Anytime Anywhere */}
                                <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md mb-4">
                                            <RefreshCw className="size-6" />
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                            Update Everything Anytime
                                            <span className="text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 font-bold px-2 py-0.5 rounded-full">Live Sync</span>
                                        </h4>
                                        <p className="text-xs font-bold text-purple-800 dark:text-purple-400 mt-0.5">
                                            कभी भी डिटेल्स अपडेट करें - नो री-प्रिंटिंग
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                                            Phone number, shop address, bank details ya new products change huye? Dashboard se 10 second me update karo! Purane sabhi shared cards aur QR codes par new details automatically live dikhengi.
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-purple-200/60 dark:border-purple-900/40 text-[11px] font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> Zero Re-Printing Cost
                                    </div>
                                </div>

                                {/* Benefit 4: 1-Tap Save to Phone Contacts */}
                                <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md mb-4">
                                            <Download className="size-6" />
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                            1-Tap Save to Contacts
                                            <span className="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-200 font-bold px-2 py-0.5 rounded-full">.vCard</span>
                                        </h4>
                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-400 mt-0.5">
                                            क्लाइंट के फोन में एक क्लिक में नंबर सेव
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                                            Paper card se number type karne me log aalsi hote hain. Digital Card me ek button tap karte hi complete name, mobile numbers, company, email aur address direct phonebook me save ho jata hai!
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> Never Lose a Business Lead
                                    </div>
                                </div>

                                {/* Benefit 5: Save Huge Money */}
                                <div className="p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-900/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md mb-4">
                                            <DollarSign className="size-6" />
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                            Save Massive Printing Costs
                                            <span className="text-[10px] bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-200 font-bold px-2 py-0.5 rounded-full">Lifetime</span>
                                        </h4>
                                        <p className="text-xs font-bold text-teal-800 dark:text-teal-400 mt-0.5">
                                            हजारों रुपये की री-प्रिंटिंग बचाएं
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                                            Har saal paper cards print karwane me hazaaron rupaye kharch hote hain. Digital Card ek baar banwayiye aur saalo-saal bina kisi extra printing kharche ke unlimited use karein.
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-teal-200/60 dark:border-teal-900/40 text-[11px] font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> High ROI for Every Business
                                    </div>
                                </div>

                                {/* Benefit 6: Interactive Actions (Call, WhatsApp, Maps) */}
                                <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md mb-4">
                                            <Zap className="size-6" />
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                            Interactive Smart Features
                                            <span className="text-[10px] bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold px-2 py-0.5 rounded-full">Direct Action</span>
                                        </h4>
                                        <p className="text-xs font-bold text-indigo-800 dark:text-indigo-400 mt-0.5">
                                            कॉल, व्हाट्सएप, मैप्स और डायरेक्ट यूपीआई
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                                            Click-to-Call, direct WhatsApp chat bina number save kiye, Google Maps GPS directions to your shop/office, aur direct PhonePe/GPay QR code se payment accept karein.
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-indigo-200/60 dark:border-indigo-900/40 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> All-in-One Networking Tool
                                    </div>
                                </div>

                                {/* Benefit 7: Showcase Products & Videos */}
                                <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md mb-4">
                                            <Video className="size-6" />
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                            Products, Gallery & Videos
                                            <span className="text-[10px] bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-200 font-bold px-2 py-0.5 rounded-full">Mini Website</span>
                                        </h4>
                                        <p className="text-xs font-bold text-rose-800 dark:text-rose-400 mt-0.5">
                                            प्रोडक्ट्स, पोर्टफोलियो और वीडियो शोकेस
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                                            Paper card sirf naam aur number dikhata hai. Digital Card par aap YouTube promotional videos, product catalogue with pricing, photo gallery aur client reviews bhi dikha sakte hain.
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 text-[11px] font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> Mini E-Commerce & Portfolio
                                    </div>
                                </div>

                                {/* Benefit 8: High Profit Reseller Opportunity */}
                                <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md mb-4">
                                            <HeartHandshake className="size-6" />
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                            Reseller Earning Power
                                            <span className="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-200 font-bold px-2 py-0.5 rounded-full">High Margin</span>
                                        </h4>
                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-400 mt-0.5">
                                            रीसेलर्स के लिए जबरदस्त कमाई का मौका
                                        </p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                                            Local shops, doctors, lawyers, salons, consultants, aur corporate clients ko ₹499 se ₹1,499 me digital visiting card bechiye aur 80%+ direct profit margin kamaiye!
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-amber-300/60 dark:border-amber-800/40 text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> High Demand B2B Product
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ===== COMPARISON MATRIX TABLE ===== */}
                        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm">
                            <div className="text-center max-w-xl mx-auto mb-6">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    SIDE-BY-SIDE COMPARISON
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
                                    Paper Visiting Card vs Smart Digital Card
                                </h3>
                                <p className="text-xs text-neutral-500 mt-1">
                                    See why traditional cards are disappearing and digital cards are winning.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                                            <th className="py-3 px-4 font-bold">Feature</th>
                                            <th className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">Traditional Paper Card</th>
                                            <th className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-t-xl">
                                                Invitify Smart Digital Card 🌟
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        <tr>
                                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Environmental Impact</td>
                                            <td className="py-3.5 px-4 text-neutral-500">❌ Destroys trees, heavy wood & paper waste</td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10">
                                                ✅ 100% Tree-Free, Zero Paper & Carbon Neutral
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Sharing Method</td>
                                            <td className="py-3.5 px-4 text-neutral-500">❌ Physical handover only (must carry cards)</td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10">
                                                ✅ WhatsApp, QR Code, NFC Tap, Link, SMS, Email
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Update Details (Phone/Address)</td>
                                            <td className="py-3.5 px-4 text-neutral-500">❌ Throw away old cards & pay for 500+ reprints</td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10">
                                                ✅ Instant Real-time edit in 10s (Auto updates everywhere)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Saving Contact in Phone</td>
                                            <td className="py-3.5 px-4 text-neutral-500">❌ Manual typing required (88% get thrown away)</td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10">
                                                ✅ 1-Click "Save to Contacts" (.vcf directly into mobile)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Direct Actions</td>
                                            <td className="py-3.5 px-4 text-neutral-500">❌ None (Static plain text)</td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10">
                                                ✅ Click-to-Call, WhatsApp Chat, Google Maps GPS
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Payment Collection</td>
                                            <td className="py-3.5 px-4 text-neutral-500">❌ Need physical swipe machine or paper QR</td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10">
                                                ✅ Integrated UPI QR (GPay, PhonePe, Paytm, BHIM)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Products & Portfolio</td>
                                            <td className="py-3.5 px-4 text-neutral-500">❌ Impossible on a small paper card</td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10">
                                                ✅ Product catalogue, photo gallery & YouTube videos
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Recurring Cost</td>
                                            <td className="py-3.5 px-4 text-neutral-500">❌ High recurring printing, lamination & design costs</td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10">
                                                ✅ Low one-time cost, unlimited lifetime shares
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ===== COMING SOON LAUNCH ACTION CALLOUT ===== */}
                        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-6 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col gap-2 text-center sm:text-left">
                                <span className="text-xs font-bold uppercase tracking-wider bg-black/20 text-white px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
                                    EARLY ACCESS LAUNCH
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black">
                                    Be the First to Resell Digital Business Cards!
                                </h3>
                                <p className="text-sm text-white/90 max-w-xl">
                                    Our development team is currently finalizing the drag-and-drop live editor and template catalog. Get notified the minute it opens for resellers!
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                                <button
                                    onClick={() => {
                                        setNotified(true);
                                        setTimeout(() => setNotified(false), 4000);
                                    }}
                                    className="px-6 py-3.5 rounded-2xl bg-white text-orange-600 hover:bg-neutral-100 font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                                >
                                    🔔 Notify Me On Launch
                                </button>
                                <button
                                    onClick={() => setActiveTab('templates')}
                                    className="px-5 py-3.5 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/20 transition-all"
                                >
                                    Browse Upcoming Themes →
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: EXPLORE UPCOMING TEMPLATES & THEMES */}
                {/* ========================================================= */}
                {activeTab === 'templates' && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                    Upcoming Digital Card Themes <Sparkles className="size-4 text-amber-500" />
                                </h3>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    Browse through our 100+ professionally designed templates tailored for doctors, lawyers, corporates, shops, and creatives.
                                </p>
                            </div>

                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search template name..."
                                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {filteredTemplates.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-400">
                                <Layers className="size-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-semibold">No templates found matching "{searchQuery}"</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                                    >
                                        <div className="aspect-[9/14] w-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden relative">
                                            <img
                                                src={template.thumbnail}
                                                alt={template.name}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/business-cards/template1.png';
                                                }}
                                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                                                <button
                                                    onClick={() => setPreviewingTemplate(template)}
                                                    className="w-full py-2 rounded-xl bg-white text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-neutral-100 transition-colors"
                                                >
                                                    <Eye className="size-3.5 text-indigo-600" /> Live Preview
                                                </button>
                                                <button
                                                    onClick={() => openPurchaseModal(template)}
                                                    className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-indigo-700 transition-colors"
                                                >
                                                    <CreditCard className="size-3.5" /> Select Theme
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3 flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{template.name}</p>
                                                <p className="text-[10px] text-neutral-400 font-mono">#{template.id}</p>
                                            </div>
                                            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full">
                                                Pro
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================================= */}
                {/* TAB 3: MY CARDS (DRAFTS & ACTIVE) */}
                {/* ========================================================= */}
                {activeTab === 'my-cards' && (
                    <div className="flex flex-col gap-6">
                        {cards.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-12 text-center bg-white dark:bg-neutral-900 shadow-sm">
                                <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-4 text-amber-600 dark:text-amber-400 mb-4">
                                    <Rocket className="size-8 animate-bounce" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Feature Launching Very Soon!</h3>
                                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
                                    Digital Business Cards for Resellers is currently in final testing. Soon you will be able to create, customize, and sell digital visiting cards directly to your clients!
                                </p>
                                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                                    >
                                        <Sparkles className="size-4" /> View Benefits & Advantages
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('templates')}
                                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <Eye className="size-4" /> Explore 100+ Themes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {cards.map((card) => {
                                    const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/card/${card.slug}`;
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
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
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
                                                    className="flex-1 py-3 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-1.5"
                                                >
                                                    <Edit2 className="size-3.5" /> Edit
                                                </Link>
                                                <a
                                                    href={publicUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex-1 py-3 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-1.5"
                                                >
                                                    <Eye className="size-3.5" /> View
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(card.id)}
                                                    className="py-3 px-4 text-center text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center justify-center"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Template Preview Modal */}
            {previewingTemplate && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900">
                            <div>
                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-md">{previewingTemplate.name}</h3>
                                <p className="text-[11px] uppercase tracking-widest font-bold text-neutral-400">Live Interactive CSS Preview</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5">
                                    <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><Smartphone className="size-4" /></button>
                                    <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded ${previewMode === 'tablet' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><Tablet className="size-4" /></button>
                                    <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><Laptop className="size-4" /></button>
                                </div>
                                <button
                                    onClick={() => { setPreviewingTemplate(null); openPurchaseModal(previewingTemplate); }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                                >
                                    <CreditCard className="size-3.5" /> Choose Template
                                </button>
                                <button onClick={() => setPreviewingTemplate(null)} className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
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
                    <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in duration-200">
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
                                                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
                                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                                                    }`}
                                                >
                                                    {selectedPlan?.id === plan.id && (
                                                        <div className="absolute top-3 right-3 text-indigo-600">
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
                                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm disabled:opacity-50"
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
                                    <div className="flex items-center justify-between rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 px-4 py-3">
                                        <div>
                                            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase">{selectedPlan.name}</p>
                                            <p className="text-[11px] text-neutral-500 font-bold">{selectedPlan.duration_months} months</p>
                                        </div>
                                        <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">₹{selectedPlan.price.toLocaleString('en-IN')}</span>
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
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400">Card URL</label>
                                    <div className="flex items-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden focus-within:border-indigo-500">
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
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm disabled:opacity-70"
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
