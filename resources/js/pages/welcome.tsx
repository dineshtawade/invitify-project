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
    Smartphone,
    Laptop,
    ShieldCheck,
    Settings,
    CheckCircle,
    Sliders,
    PlayCircle,
    Calendar,
    Users,
    Activity
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

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

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface WelcomeProps {
    canRegister?: boolean;
    templates?: Template[];
    miniWebsiteTemplates?: WelcomeMiniWebsiteTemplate[];
    categories?: Category[];
}

export default function Welcome({ canRegister = true, templates = [], miniWebsiteTemplates = [], categories = [] }: WelcomeProps) {
    const { auth } = usePage().props;

    // View toggle: 'cards' or 'websites'
    const [activeModule, setActiveModule] = useState<'cards' | 'websites'>('cards');

    // Card templates category states
    const [selectedCategory, setSelectedCategory] = useState('all');
    const categoriesList = ['all', ...categories.map(c => c.slug)];

    const getCategoryName = (slug: string) => {
        if (slug === 'all') return 'All Cards';
        const found = categories.find(c => c.slug === slug);
        return found ? found.name : slug.replace('_', ' ');
    };

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    // Mini Website templates category states
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

            <div className="relative min-h-screen bg-neutral-50 text-neutral-900 font-sans dark:bg-neutral-950 dark:text-neutral-50 selection:bg-blue-600 selection:text-white transition-colors overflow-hidden">

                {/* Decorative Background Grid Pattern & Orbs */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none dark:bg-blue-600/5 z-0"></div>
                <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none dark:bg-indigo-600/5 z-0"></div>

                {/* Header Navbar */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-neutral-200/50 dark:bg-neutral-950/75 dark:border-neutral-900/50 transition-colors">
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="text-white ">
                                {/* <Mail className="size-5" /> */}
                                <AppLogoIcon className="size-16 mt-4 fill-current text-white dark:text-black" />
                            </div>
                            <span className="font-['Cinzel'] text-3xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-700 bg-clip-text text-transparent drop-shadow-sm">
                                Invitify
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                            <a
                                href="#templates"
                                onClick={() => setActiveModule('cards')}
                                className={`transition-colors hover:text-neutral-950 dark:hover:text-white ${activeModule === 'cards' ? 'text-blue-650 font-bold dark:text-blue-400' : ''}`}
                            >
                                Invitation Cards
                            </a>
                            <a
                                href="#templates"
                                onClick={() => setActiveModule('websites')}
                                className={`transition-colors hover:text-neutral-950 dark:hover:text-white ${activeModule === 'websites' ? 'text-blue-650 font-bold dark:text-blue-400' : ''}`}
                            >
                                Mini Websites
                            </a>
                            <a href="#how-it-works" className="transition-colors hover:text-neutral-950 dark:hover:text-white">
                                How It Works
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
                                        className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-105 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-sm transition-all"
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
                <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Left Content */}
                        <div className="lg:col-span-7 flex flex-col gap-6 text-left items-start">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30 px-3.5 py-1.5 text-xs font-bold text-blue-650 dark:text-blue-400 animate-pulse">
                                <Sparkles className="size-3.5" /> Gorgeous Digital Invitations
                            </span>

                            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-[1.15] text-neutral-900 dark:text-white">
                                Pick a Template. <br />
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                                    Customize Live.
                                </span> <br />
                                Share Instantly.
                            </h1>

                            <p className="max-w-xl text-neutral-500 dark:text-neutral-400 text-base sm:text-lg leading-relaxed">
                                Create breathtaking invitations for weddings, birthdays, and private parties. Customize layout blocks, text, and themes in real-time, and share direct links with your guests.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                <a
                                    href="#templates"
                                    className="group rounded-lg bg-blue-600 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center gap-1.5"
                                >
                                    Browse Templates
                                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                                {!auth.user && (
                                    <Link
                                        href={register()}
                                        className="rounded-lg border border-neutral-200 bg-white text-neutral-700 px-6 py-3 text-sm font-semibold hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-805 transition-colors"
                                    >
                                        Create Free Account
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Hero Right Mockups (Tailwind Built Devices) */}
                        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[350px] w-full mt-8 lg:mt-0 select-none">
                            {/* Decorative Blur Background under mockups */}
                            <div className="absolute w-72 h-72 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] z-0"></div>

                            {/* Browser Mockup */}
                            <div className="absolute left-4 top-4 w-72 sm:w-80 rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900 transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
                                <div className="h-7 border-b border-neutral-100 dark:border-neutral-800 px-3 flex items-center gap-1 bg-neutral-50 dark:bg-neutral-950 rounded-t-2xl">
                                    <span className="size-2 rounded-full bg-red-400"></span>
                                    <span className="size-2 rounded-full bg-yellow-400"></span>
                                    <span className="size-2 rounded-full bg-green-400"></span>
                                    <div className="ml-2 w-36 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-sm text-[8px] flex items-center justify-center text-neutral-450 dark:text-neutral-550 font-mono">invitify.com/rohit-wedding</div>
                                </div>
                                <div className="p-4 flex flex-col gap-2.5">
                                    <div className="h-24 rounded-lg bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 flex flex-col justify-center items-center text-center p-3 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 p-1 text-[8px] bg-pink-500 text-white font-bold uppercase rounded-bl-lg">Event Website</div>
                                        <p className="text-[7px] tracking-wider uppercase font-bold text-pink-600 dark:text-pink-400">Save the Date</p>
                                        <p className="font-serif text-sm font-bold text-neutral-800 dark:text-white mt-1">Rohit & Shreya</p>
                                    </div>
                                    <div className="flex gap-2 justify-between">
                                        <div className="flex-1 h-10 rounded-lg bg-neutral-50 border border-neutral-150 dark:bg-neutral-950 dark:border-neutral-850 p-2 flex flex-col justify-center">
                                            <span className="text-[6px] text-neutral-400 font-bold uppercase">Date</span>
                                            <span className="text-[8px] text-neutral-800 dark:text-white font-bold">Dec 18, 2026</span>
                                        </div>
                                        <div className="flex-1 h-10 rounded-lg bg-neutral-50 border border-neutral-150 dark:bg-neutral-950 dark:border-neutral-850 p-2 flex flex-col justify-center">
                                            <span className="text-[6px] text-neutral-400 font-bold uppercase">Venue</span>
                                            <span className="text-[8px] text-neutral-800 dark:text-white font-bold truncate">Nagpur, IN</span>
                                        </div>
                                    </div>
                                    <div className="h-6 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[8px] font-bold flex items-center justify-center gap-1">
                                        Submit RSVP
                                    </div>
                                </div>
                            </div>

                            {/* Smartphone Mockup */}
                            <div className="absolute right-4 bottom-4 w-44 rounded-[32px] border-[5px] border-neutral-900 bg-neutral-950 shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-500 z-20">
                                {/* Bezel & Speaker bar */}
                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-neutral-900 rounded-full flex items-center justify-center z-30">
                                    <div className="size-1 rounded-full bg-neutral-800 mr-2"></div>
                                    <div className="w-6 h-0.5 bg-neutral-800 rounded-full"></div>
                                </div>

                                <div className="aspect-[9/19] bg-gradient-to-br from-indigo-650 via-purple-650 to-pink-600 p-4 flex flex-col justify-between items-center text-center text-white relative pt-8">
                                    <div className="absolute inset-0 bg-black/10"></div>

                                    <div className="z-10 mt-2">
                                        <span className="text-[6px] uppercase tracking-widest font-bold opacity-80">Wedding Invitation</span>
                                        <h4 className="font-serif text-sm font-bold mt-1 text-white leading-tight">Join Us to Celebrate</h4>
                                    </div>

                                    <div className="z-10 my-4 bg-white/10 backdrop-blur-xs rounded-xl p-2.5 w-full border border-white/10 shadow-lg">
                                        <p className="text-[10px] font-bold">Karan & Priya</p>
                                        <p className="text-[6px] opacity-75 mt-0.5">December 28, 2026</p>
                                    </div>

                                    <div className="z-10 w-full">
                                        <div className="h-5 rounded bg-white text-neutral-950 text-[7px] font-bold flex items-center justify-center shadow-md">
                                            Open Invitation
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Statistics Summary */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-y border-neutral-250/50 dark:border-neutral-900/50 bg-white/40 dark:bg-neutral-900/20 backdrop-blur-xs">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">12,000+</span>
                            <span className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wide">Invitations Sent</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">₹15.00</span>
                            <span className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wide">Hosting Rate / Day</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">99.9%</span>
                            <span className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wide">Delivery Uptime</span>
                        </div>
                    </div>
                </section>

                {/* Format Overview Section */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-28">
                    <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-900/30 px-3 py-1.5 text-xs font-bold text-indigo-650 dark:text-indigo-400 mx-auto">
                            <Sliders className="size-3.5" /> Flexible Formats
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-100">
                            Two Creative Formats. Unlimited Possibilities.
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                            Whether you need a quick, beautiful mobile-canvas greeting card or a comprehensive, multi-device event site, we have you covered.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Invitation Cards Card */}
                        <div className="flex flex-col justify-between p-8 rounded-3xl border border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-900/40 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300 shadow-xs hover:shadow-lg group">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Smartphone className="size-6" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 px-3 py-1 rounded-full">
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
                                            <CheckCircle className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Personalized Styling</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Custom typography, details, and premium preset templates.</p>
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
                        <div className="flex flex-col justify-between p-8 rounded-3xl border border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-900/40 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300 shadow-xs hover:shadow-lg group">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Globe className="size-6" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 px-3 py-1 rounded-full">
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
                                            <Clock className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Pay-Per-Day Hosting</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Pay only for the days you need hosting (₹15.00/day). Auto-disables on expiry.</p>
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

                {/* How It Works Section */}
                <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-neutral-200/50 dark:border-neutral-900/50">
                    <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30 px-3 py-1.5 text-xs font-bold text-blue-650 dark:text-blue-400 mx-auto">
                            <Activity className="size-3.5" /> Simple Workflow
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-100">
                            Three Simple Steps to Launch
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                            Get your digital invites online in less than 5 minutes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line on Desktop */}
                        <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-neutral-200 dark:bg-neutral-850 z-0"></div>

                        {[
                            { step: '01', title: 'Pick a Template', desc: 'Browse our curated collection of digital cards and mini website layouts tailored for any occasion.' },
                            { step: '02', title: 'Customize Live', desc: 'Customize headers, hosts, images, maps, music, and configure your RSVP preferences in our dashboard editor.' },
                            { step: '03', title: 'Publish & Share', desc: 'Complete payments via UPI/Razorpay, generate your invite link/QR code, and send it to your guests instantly.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center relative z-10 group">
                                <div className="size-16 rounded-2xl border-2 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 flex items-center justify-center text-lg font-black text-blue-600 dark:text-blue-400 group-hover:border-blue-600 group-hover:scale-105 transition-all shadow-md">
                                    {item.step}
                                </div>
                                <h4 className="font-serif font-bold text-lg text-neutral-900 dark:text-white mt-5">{item.title}</h4>
                                <p className="text-xs text-neutral-550 dark:text-neutral-400 mt-2 max-w-[240px] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Showcase Section */}
                <section id="templates" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-neutral-200/50 dark:border-neutral-900/50">

                    {/* Primary Showcase Module Selector */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200/50 dark:border-neutral-850 shadow-inner">
                            <button
                                onClick={() => setActiveModule('cards')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeModule === 'cards'
                                    ? 'bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-400 font-black'
                                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                                    }`}
                            >
                                <Smartphone className="size-3.5" /> Invitation Cards
                            </button>
                            <button
                                onClick={() => setActiveModule('websites')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeModule === 'websites'
                                    ? 'bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-400 font-black'
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
                                    <>Explore Digital Cards <Smartphone className="size-6 text-blue-600 dark:text-blue-400" /></>
                                ) : (
                                    <>Explore Mini Websites <Globe className="size-6 text-blue-600 dark:text-blue-400" /></>
                                )}
                            </h2>
                            <p className="text-neutral-550 dark:text-neutral-400 max-w-xl text-sm leading-relaxed">
                                {activeModule === 'cards'
                                    ? "Gorgeous, absolute-canvas digital layouts designed to fit beautifully on any mobile screen. Ideal for fast WhatsApp invites."
                                    : "Fully responsive multi-section single-page websites featuring slideshows, YouTube embeds, links grids, and live RSVP sheets."
                                }
                            </p>
                        </div>

                        {/* Category Selector Tabs based on active module */}
                        {activeModule === 'cards' ? (
                            <div className="flex flex-wrap gap-2 bg-neutral-100/80 p-1 rounded-xl dark:bg-neutral-900/80 border border-neutral-200/30 dark:border-neutral-850/30 w-fit">
                                {categoriesList.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${selectedCategory === cat
                                            ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white font-bold'
                                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                            }`}
                                    >
                                        {getCategoryName(cat)}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 bg-neutral-100/80 p-1 rounded-xl dark:bg-neutral-900/80 border border-neutral-200/30 dark:border-neutral-850/30 w-fit">
                                {(['all', 'invitation', 'business'] as const).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedWebsiteCategory(cat)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${selectedWebsiteCategory === cat
                                            ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white font-bold'
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
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/40 dark:bg-neutral-900/10">
                                <span className="text-neutral-400 text-sm">No template designs added yet.</span>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredTemplates.map((t) => (
                                    <div
                                        key={t.id}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs hover:shadow-lg dark:border-neutral-850 dark:bg-neutral-900 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* Mini Card Preview Canvas */}
                                        <div
                                            className={`relative flex aspect-video flex-col items-center justify-center p-6 bg-gradient-to-tr ${t.bg_gradient} border-b border-neutral-100 dark:border-neutral-850/60 overflow-hidden`}
                                        >
                                            <div className="absolute inset-0 bg-neutral-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="text-center pointer-events-none scale-85 opacity-90 transition-transform duration-300 group-hover:scale-90">
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
                                            <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-neutral-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs shadow-xs">
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
                                                className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
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
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/40 dark:bg-neutral-900/10">
                                <span className="text-neutral-400 text-sm">No website templates added yet.</span>
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
                                            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs hover:shadow-lg dark:border-neutral-850 dark:bg-neutral-900 hover:-translate-y-1 transition-all duration-300"
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
                                                        <span className="text-[10px] text-neutral-400 dark:text-neutral-550 mt-1 uppercase tracking-widest font-semibold">
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
                                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${w.type === 'invitation'
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
                                                    className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
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

                {/* Bottom Footer Section */}
                <footer className="bg-white border-t border-neutral-200/50 py-12 text-center text-xs text-neutral-400 dark:bg-neutral-950 dark:border-neutral-900 mt-20 transition-colors">
                    <div className="max-w-6xl mx-auto px-6 space-y-4">
                        <div className="flex justify-center gap-6 text-neutral-500 dark:text-neutral-450 font-semibold mb-4 flex-wrap">
                            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                            <Link href="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            <Link href="/terms-and-conditions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms & Conditions</Link>
                            <Link href="/refund-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Refund Policy</Link>
                            <Link href="/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Disclaimer</Link>
                            <Link href="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link>
                        </div>
                        <p className="text-neutral-450 dark:text-neutral-500">© {new Date().getFullYear()} Invitify. Created with React & Laravel. All rights reserved.</p>
                        <p className="text-[10px] text-neutral-500">Avinya Digitech Pvt Ltd. Beside Besa-Pimpla Road, Nagpur – 440034</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
