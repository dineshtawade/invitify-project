import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { 
    Sparkles, 
    ArrowRight, 
    Layers, 
    Mail, 
    Heart, 
    Globe, 
    Music, 
    Clock, 
    Tv, 
    MousePointer, 
    Smartphone, 
    Laptop, 
    ShieldCheck, 
    Settings 
} from 'lucide-react';

interface Template {
    id: number;
    name: string;
    category: string;
    price: string | number;
    bg_gradient: string;
    default_config: {
        title: string;
        hosts: string;
        guest_of_honor: string;
        date: string;
        time: string;
        venue: string;
    };
}

interface WelcomeMiniWebsiteTemplate {
    id: number;
    name: string;
    type: 'invitation' | 'business';
    price: string | number;
    preview_image: string | null;
    config: any[];
}

interface WelcomeProps {
    canRegister?: boolean;
    templates?: Template[];
    miniWebsiteTemplates?: WelcomeMiniWebsiteTemplate[];
}

export default function Welcome({ canRegister = true, templates = [], miniWebsiteTemplates = [] }: WelcomeProps) {
    const { auth } = usePage().props;
    
    // View toggle: 'cards' or 'websites'
    const [activeModule, setActiveModule] = useState<'cards' | 'websites'>('cards');
    
    // Legacy card templates states
    const [selectedCategory, setSelectedCategory] = useState('all');
    const categories = ['all', 'wedding', 'birthday', 'party', 'anniversary', 'baby_shower'];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    // Mini Website templates states
    const [selectedWebsiteCategory, setSelectedWebsiteCategory] = useState<'all' | 'invitation' | 'business'>('all');

    const filteredWebsites = selectedWebsiteCategory === 'all'
        ? miniWebsiteTemplates
        : miniWebsiteTemplates.filter(w => w.type === selectedWebsiteCategory);

    return (
        <>
            <Head title="Invitify - Custom Digital Invitations">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans dark:bg-neutral-950 dark:text-neutral-50 selection:bg-blue-600 selection:text-white transition-colors">
                
                {/* Header Navbar */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-neutral-200/50 dark:bg-neutral-950/70 dark:border-neutral-900/50">
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-600 p-2 text-white shadow-md shadow-blue-500/20">
                                <Mail className="size-5" />
                            </div>
                            <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                                Invitify
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                            <a 
                                href="#templates" 
                                onClick={() => setActiveModule('cards')}
                                className={`transition-colors hover:text-neutral-950 dark:hover:text-white ${activeModule === 'cards' ? 'text-blue-600 font-extrabold dark:text-blue-400' : ''}`}
                            >
                                Invitation Cards
                            </a>
                            <a 
                                href="#templates" 
                                onClick={() => setActiveModule('websites')}
                                className={`transition-colors hover:text-neutral-950 dark:hover:text-white ${activeModule === 'websites' ? 'text-blue-600 font-extrabold dark:text-blue-400' : ''}`}
                            >
                                Mini Websites
                            </a>
                        </div>

                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-colors"
                                >
                                    Go to Dashboard <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-sm transition-colors"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center px-6 flex flex-col items-center gap-6">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <Sparkles className="size-3.5" /> Stunning Digital Invitations
                        </span>
                        
                        <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-[1.15] bg-gradient-to-b from-neutral-950 to-neutral-800 bg-clip-text text-transparent dark:from-white dark:to-neutral-350">
                            Pick a Template. Customize Live. <br className="hidden sm:inline" />
                            Invite Your Loved Ones.
                        </h1>

                        <p className="max-w-2xl text-neutral-500 dark:text-neutral-400 text-base sm:text-lg leading-relaxed">
                            Create breathtaking invitations for weddings, birthdays, and private parties. Customize text and themes in real-time, purchase access, and share links directly with your guests.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                            <a
                                href="#templates"
                                className="rounded-lg bg-blue-600 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
                            >
                                Browse Templates <ArrowRight className="size-4" />
                            </a>
                            {!auth.user && (
                                <Link
                                    href={register()}
                                    className="rounded-lg border border-neutral-200 bg-white text-neutral-700 px-6 py-3 text-sm font-semibold hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Create Free Account
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Format Overview Section */}
                <section className="max-w-6xl mx-auto px-6 py-12 border-t border-neutral-200/60 dark:border-neutral-900">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-100">
                            Two Creative Formats. Unlimited Possibilities.
                        </h2>
                        <p className="mt-3 text-neutral-500 dark:text-neutral-400 text-sm">
                            Whether you need a quick, beautiful mobile-canvas greeting card or a comprehensive, multi-device event site, we have you covered.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Invitation Cards Card */}
                        <div className="flex flex-col justify-between p-8 rounded-3xl border border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-900/60 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300 shadow-xs hover:shadow-md group">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Mail className="size-6" />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 px-3 py-1 rounded-full">
                                        Canvas Design
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
                                    Digital Invitation Cards
                                </h3>
                                <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                    Curated visual-first invitation cards designed to fit perfectly on any smartphone display. Share via WhatsApp, SMS, or email in seconds.
                                </p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="rounded-full bg-emerald-50 p-1 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            <Sparkles className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Personalized Styling</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Custom typography, custom details, and premium templates.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="rounded-full bg-emerald-50 p-1 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            <Music className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Atmospheric Audio Tracks</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Embed background audio that plays automatically on load.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="rounded-full bg-emerald-50 p-1 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            <Heart className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Interactive RSVP Count</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Guests submit RSVP forms directly from the link; counts populate in dashboard.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="rounded-full bg-emerald-50 p-1 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            <Clock className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Flat Lifetime Fee</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Pay a low, single-payment price to unlock the card design forever.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#templates"
                                onClick={() => setActiveModule('cards')}
                                className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 px-6 py-3.5 text-sm font-semibold shadow-md transition-all group/btn"
                            >
                                Explore Invitation Cards 
                                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                            </a>
                        </div>

                        {/* Mini Websites Card */}
                        <div className="flex flex-col justify-between p-8 rounded-3xl border border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-900/60 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300 shadow-xs hover:shadow-md group">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Globe className="size-6" />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 px-3 py-1 rounded-full">
                                        Responsive Site
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
                                    Responsive Mini Websites
                                </h3>
                                <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                    State-of-the-art single-page web profiles built with beautiful vertical block grids. Optimized for mobile, desktop, and tablet layouts.
                                </p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="rounded-full bg-indigo-50 p-1 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                                            <Laptop className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Device Independent Layout</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Adapts to all device viewports with robust CSS grid structures.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="rounded-full bg-indigo-50 p-1 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                                            <Tv className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Rich Media & Video Embeds</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Easily insert Swiper slideshows, Youtube embeds, and external link grids.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="rounded-full bg-indigo-50 p-1 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                                            <Smartphone className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Dynamic Pay-Per-Day Pricing</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Pay per-day subscription rates (₹15.00/day). Pay only for what you need.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="rounded-full bg-indigo-50 p-1 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                                            <ShieldCheck className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Auto Disable & Easy Renewal</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Automatically disables when hosting expires, reactivates instantly on renew payment.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#templates"
                                onClick={() => setActiveModule('websites')}
                                className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 text-sm font-semibold shadow-md transition-all group/btn"
                            >
                                Explore Mini Websites 
                                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Showcase Section */}
                <section id="templates" className="max-w-6xl mx-auto px-6 py-16 border-t border-neutral-200/60 dark:border-neutral-900">
                    
                    {/* Primary Showcase Module Selector */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-inner">
                            <button
                                onClick={() => setActiveModule('cards')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    activeModule === 'cards'
                                        ? 'bg-white text-blue-600 shadow-xs dark:bg-neutral-800 dark:text-blue-400'
                                        : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                                }`}
                            >
                                <Mail className="size-3.5" /> Invitation Cards
                            </button>
                            <button
                                onClick={() => setActiveModule('websites')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    activeModule === 'websites'
                                        ? 'bg-white text-blue-600 shadow-xs dark:bg-neutral-800 dark:text-blue-400'
                                        : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                                }`}
                            >
                                <Globe className="size-3.5" /> Mini Websites
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
                                {activeModule === 'cards' ? (
                                    <>Explore Digital Cards <Mail className="size-6 text-blue-600 dark:text-blue-400" /></>
                                ) : (
                                    <>Explore Mini Websites <Globe className="size-6 text-blue-600 dark:text-blue-400" /></>
                                )}
                            </h2>
                            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-sm">
                                {activeModule === 'cards' 
                                    ? "Gorgeous, absolute-canvas digital layouts designed to fit beautifully on any mobile screen. Ideal for fast WhatsApp invites."
                                    : "Fully responsive multi-section single-page websites featuring slideshows, YouTube embeds, links grids, and live RSVP sheets."
                                }
                            </p>
                        </div>

                        {/* Category Selector Tabs based on active module */}
                        {activeModule === 'cards' ? (
                            <div className="flex flex-wrap gap-2 bg-neutral-100/80 p-1.5 rounded-xl dark:bg-neutral-900/80 border border-neutral-200/30 dark:border-neutral-850/30 w-fit">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                                                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                        }`}
                                    >
                                        {cat === 'all' ? 'All Cards' : cat.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 bg-neutral-100/80 p-1.5 rounded-xl dark:bg-neutral-900/80 border border-neutral-200/30 dark:border-neutral-850/30 w-fit">
                                {(['all', 'invitation', 'business'] as const).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedWebsiteCategory(cat)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                                            selectedWebsiteCategory === cat
                                                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                                                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                        }`}
                                    >
                                        {cat === 'all' 
                                            ? 'All Websites' 
                                            : cat === 'invitation' 
                                                ? 'Event Invitations' 
                                                : 'Business Sites'
                                        }
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Invitation Cards Grid Layout */}
                    {activeModule === 'cards' && (
                        filteredTemplates.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
                                <span className="text-neutral-400">No template designs added yet.</span>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredTemplates.map((t) => (
                                    <div
                                        key={t.id}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs transition-all hover:shadow-lg dark:border-neutral-850 dark:bg-neutral-900"
                                    >
                                        {/* Mini Card Preview Canvas */}
                                        <div
                                            className={`relative flex aspect-video flex-col items-center justify-center p-6 bg-gradient-to-tr ${t.bg_gradient} border-b border-neutral-100 dark:border-neutral-850/60`}
                                        >
                                            <div className="text-center pointer-events-none scale-85 opacity-90">
                                                <p className="text-[9px] tracking-widest uppercase font-semibold opacity-70">
                                                    {t.default_config.title}
                                                </p>
                                                <p className="font-serif text-base font-bold my-1 truncate max-w-[170px]">
                                                    {t.default_config.guest_of_honor}
                                                </p>
                                                <p className="text-[7px] opacity-70">
                                                    {t.default_config.date}
                                                </p>
                                            </div>
                                            <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-neutral-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                                                ₹{parseFloat(String(t.price)).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Card Description & CTA */}
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400 transition-colors">
                                                    {t.name}
                                                </h3>
                                                <p className="mt-1 text-xs capitalize text-neutral-400 font-semibold flex items-center gap-1">
                                                    <Layers className="size-3" /> {t.category.replace('_', ' ')} Theme
                                                </p>
                                            </div>

                                            <Link
                                                href={`/templates/${t.id}/customize`}
                                                className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                            >
                                                Customize Card <ArrowRight className="size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* Mini Website Template Showcase */}
                    {activeModule === 'websites' && (
                        filteredWebsites.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
                                <span className="text-neutral-400">No website templates added yet.</span>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredWebsites.map((w) => {
                                    // Parse config blocks count
                                    let blocksCount = 0;
                                    try {
                                        const parsed = Array.isArray(w.config) ? w.config : JSON.parse(w.config);
                                        blocksCount = parsed?.length || 0;
                                    } catch (e) {
                                        blocksCount = 0;
                                    }

                                    return (
                                        <div
                                            key={w.id}
                                            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs transition-all hover:shadow-lg dark:border-neutral-850 dark:bg-neutral-900"
                                        >
                                            {/* Preview Container with custom mockups based on type */}
                                            <div className="relative aspect-video w-full overflow-hidden border-b border-neutral-150 dark:border-neutral-850/60 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                                                {w.preview_image ? (
                                                    <img
                                                        src={w.preview_image}
                                                        alt={w.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    /* Dynamic Premium Mockup Preview placeholder */
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-blue-950/20 flex flex-col items-center justify-center p-6 text-center select-none">
                                                        <Globe className="size-10 text-indigo-500/40 dark:text-indigo-400/40 mb-3 animate-pulse" />
                                                        <p className="text-sm font-serif font-bold text-neutral-850 dark:text-neutral-200">
                                                            {w.name}
                                                        </p>
                                                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-widest font-semibold">
                                                            {w.type === 'invitation' ? 'Event Invitation' : 'Business Site'} Template
                                                        </span>
                                                        
                                                        {/* Visual UI Blocks Simulator Representation */}
                                                        <div className="mt-4 flex gap-1.5 items-center justify-center opacity-40">
                                                            <div className="h-1.5 w-6 bg-indigo-500 rounded-full" />
                                                            <div className="h-1.5 w-8 bg-purple-500 rounded-full" />
                                                            <div className="h-1.5 w-4 bg-blue-500 rounded-full" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Price badge per day */}
                                                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-neutral-950/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xs shadow-md">
                                                    ₹{parseFloat(String(w.price)).toFixed(2)}<span className="text-[10px] font-normal text-neutral-300">/day</span>
                                                </span>
                                            </div>

                                            {/* Info and CTA */}
                                            <div className="flex flex-1 flex-col justify-between p-6">
                                                <div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400 transition-colors truncate">
                                                            {w.name}
                                                        </h3>
                                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                                            w.type === 'invitation'
                                                                ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400'
                                                                : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                                                        }`}>
                                                            {w.type === 'invitation' ? 'Event' : 'Business'}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                                        Equipped with {blocksCount} customizable blocks (RSVP, Swiper, Youtube, Map, Links).
                                                    </p>
                                                </div>

                                                <Link
                                                    href={`/customer/mini-websites?template_id=${w.id}`}
                                                    className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                                >
                                                    Customize Website <ArrowRight className="size-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </section>


                {/* Footer Section */}
                <footer className="bg-white border-t border-neutral-200/50 py-8 text-center text-xs text-neutral-400 dark:bg-neutral-950 dark:border-neutral-900 mt-20">
                    <p>© {new Date().getFullYear()} Invitify. Created with React & Laravel. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
