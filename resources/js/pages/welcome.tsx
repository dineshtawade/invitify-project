import { useState, useMemo, useEffect, useRef } from 'react';
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
    Activity,
    CreditCard,
    Eye,
    FileText,
    Phone,
    Edit3,
    Menu,
    X
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

interface Template {
    id: number;
    name: string;
    category: string;
    price: string | number;
    bg_gradient: string;
    type?: string;
    default_config: {
        title: string;
        hosts: string;
        guest_of_honor: string;
        date: string;
        time: string;
        venue: string;
        video_url?: string;
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const imageScrollRef = useRef<HTMLDivElement>(null);
    const videoScrollRef = useRef<HTMLDivElement>(null);
    const businessCardsScrollRef = useRef<HTMLDivElement>(null);

    // Auto swipe effect for mobile
    useEffect(() => {
        const interval = setInterval(() => {
            const swipe = (ref: React.RefObject<HTMLDivElement>) => {
                if (ref.current && window.innerWidth < 640) {
                    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
                    if (scrollLeft + clientWidth >= scrollWidth - 10) {
                        ref.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        ref.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
                    }
                }
            };
            swipe(imageScrollRef);
            swipe(videoScrollRef);
            swipe(businessCardsScrollRef);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // View toggle: 'cards' or 'websites'
    const [activeModule, setActiveModule] = useState<'cards' | 'websites'>('cards');

    // Build static 100 digital business card templates
    const businessCardTemplates = useMemo(() => {
        return Array.from({ length: 100 }, (_, i) => {
            const num = i + 1;
            return {
                id: num,
                name: `Template ${num}`,
                css_file: `card_css${num}.css`,
                thumbnail: num >= 36 ? `/images/business-cards/pre${num}.webp` : `/images/business-cards/template${num}.png`,
            };
        });
    }, []);

    // Show only first 12 on landing page; user can see all on the dedicated page
    const showcasedDigitalCards = businessCardTemplates.slice(0, 12);

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
            <Head>
                <title>Create Digital Invitations & Mini Websites | Invitify India</title>
                <meta name="description" content="Design stunning wedding invitations, digital business cards, and mini websites in minutes. India's best online invitation maker and digital template builder." />
                <meta name="keywords" content="digital invitation maker, wedding invitation templates india, mini website builder, digital business cards, online e-invites, create wedding card online" />
                <meta property="og:title" content="Create Digital Invitations & Mini Websites | Invitify India" />
                <meta property="og:description" content="Design stunning wedding invitations, digital business cards, and mini websites in minutes. India's best online invitation maker and digital template builder." />
                <meta property="og:url" content="https://theinvitify.com/" />
                <meta property="og:type" content="website" />
            </Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />


            <div className="relative min-h-screen bg-[#fdfbf7] text-[#4a4238] font-sans selection:bg-[#3d5644] selection:text-white transition-colors overflow-hidden">

                {/* Decorative Background Grid Pattern & Orbs */}
                <div className="absolute inset-0 bg-[#f4efe6] bg-[radial-gradient(#d3c0a3_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none z-0"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ebd9c1]/40 blur-[120px] pointer-events-none z-0"></div>
                <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#d3c0a3]/20 blur-[120px] pointer-events-none z-0"></div>

                {/* Header Navbar */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-[#fdfbf7]/80 border-b border-[#ebd9c1]/50 transition-colors">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="text-[#3d5644]">
                                <AppLogoIcon className="size-8 md:size-10 fill-current text-[#3d5644]" />
                            </div>
                            <span className="font-serif text-xl md:text-3xl font-bold tracking-wide text-[#3e3832]">
                                Invitify
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8 text-[15px] font-serif font-medium text-[#706557]">
                            <a
                                href="#templates"
                                onClick={() => setActiveModule('cards')}
                                className={`transition-colors hover:text-[#3d5644] ${activeModule === 'cards' ? 'text-[#3d5644] font-bold' : ''}`}
                            >
                                Templates
                            </a>
                            <a
                                href="#how-it-works"
                                className="transition-colors hover:text-[#3d5644]"
                            >
                                Features
                            </a>
                            <a
                                href="#digital-business-cards"
                                className="transition-colors hover:text-[#3d5644]"
                            >
                                Pricing
                            </a>
                        </div>

                        {/* Desktop Actions */}
                        <nav className="hidden md:flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 rounded bg-[#ebd9c1] px-5 py-2 text-sm font-serif font-bold text-[#4a4238] border border-[#d3c0a3] hover:bg-[#e0ccb2] transition-colors"
                                >
                                    Go to Dashboard <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-serif font-semibold text-[#706557] hover:text-[#3d5644] transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded bg-[#ebd9c1] border border-[#d3c0a3] text-[#4a4238] px-5 py-2 text-sm font-serif font-bold hover:bg-[#e0ccb2] shadow-sm transition-all"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-[#706557] hover:text-[#3d5644] focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden absolute top-16 left-0 w-full bg-[#fdfbf7] border-b border-[#ebd9c1] shadow-lg flex flex-col p-4 gap-4 transition-all z-50">
                            <a
                                href="#templates"
                                onClick={() => { setActiveModule('cards'); setIsMobileMenuOpen(false); }}
                                className={`text-base font-serif font-medium ${activeModule === 'cards' ? 'text-[#3d5644] font-bold' : 'text-[#706557]'} hover:text-[#3d5644]`}
                            >
                                Templates
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-serif font-medium text-[#706557] hover:text-[#3d5644]"
                            >
                                Features
                            </a>
                            <a
                                href="#digital-business-cards"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-serif font-medium text-[#706557] hover:text-[#3d5644]"
                            >
                                Pricing
                            </a>
                            <hr className="border-[#ebd9c1]" />
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="w-full inline-flex justify-center items-center gap-1.5 rounded bg-[#ebd9c1] px-5 py-2 text-base font-serif font-bold text-[#4a4238] border border-[#d3c0a3] hover:bg-[#e0ccb2] transition-colors"
                                >
                                    Go to Dashboard <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={login()}
                                        className="w-full text-center text-base font-serif font-semibold text-[#706557] hover:text-[#3d5644]"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="w-full text-center rounded bg-[#ebd9c1] border border-[#d3c0a3] text-[#4a4238] px-5 py-2 text-base font-serif font-bold hover:bg-[#e0ccb2] shadow-sm transition-all"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </header>

                {/* Hero Section */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-28">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Left Content */}
                        <div className="lg:col-span-7 flex flex-col gap-5 text-center items-center lg:text-left lg:items-start relative">
                            <h1 className="text-5xl sm:text-7xl font-serif text-[#3e3832] leading-[1.1]">
                                <span className="italic font-light tracking-wide block mb-2">Create Stunning</span>
                                <span className="font-bold">Digital Invitations</span>
                            </h1>

                            <p className="max-w-md mx-auto lg:mx-0 text-[#706557] font-serif text-lg sm:text-xl leading-relaxed mt-2 border-b border-[#ebd9c1] pb-6">
                                Elegant Designs for Every Occasion
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                                <a
                                    href="#templates"
                                    className="rounded bg-[#3d5644] text-white px-8 py-3.5 text-base font-serif font-medium hover:bg-[#2c3e2e] shadow-md transition-all"
                                >
                                    Browse Templates
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="rounded bg-[#fdfbf7] border border-[#d3c0a3] text-[#4a4238] px-8 py-3.5 text-base font-serif font-medium hover:bg-[#ebd9c1] shadow-sm transition-colors flex items-center gap-2"
                                >
                                    <PlayCircle className="size-5" /> Watch Demo
                                </a>
                            </div>
                        </div>

                        {/* Hero Right Mockups */}
                        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[450px] w-full mt-8 lg:mt-0 select-none">

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                <div className="size-72 rounded-full border border-[#ebd9c1] absolute"></div>
                                <div className="size-96 rounded-full border border-[#ebd9c1]/50 absolute"></div>
                            </div>

                            <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 bg-[#fdfbf7] size-16 rounded-full border border-[#ebd9c1] flex items-center justify-center shadow-sm z-30">
                                <span className="font-serif italic text-xl text-[#706557]">OR</span>
                            </div>

                            {/* Back Mockup (Card style) */}
                            <div className="absolute right-0 top-10 w-64 rounded-xl border border-[#ebd9c1] bg-[#fdfbf7] shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500 z-10 flex flex-col items-center">
                                <div className="size-20 rounded-full overflow-hidden border-2 border-[#d3c0a3] p-1 mb-3">
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-[#3e3832]">Emma Wilson</h3>
                                <p className="text-[9px] uppercase tracking-widest text-[#706557] mb-6">Marketing Specialist</p>

                                <div className="w-full space-y-3">
                                    <div className="flex items-center gap-3 text-xs text-[#706557]"><Phone className="size-3.5 text-[#3d5644]" /> +23 123 58239</div>
                                    <div className="flex items-center gap-3 text-xs text-[#706557]"><Mail className="size-3.5 text-[#3d5644]" /> hello@emma.com</div>
                                    <div className="flex items-center gap-3 text-[10px] text-[#706557]"><Globe className="size-3.5 text-[#3d5644]" /> www.emmawilson.com</div>
                                </div>

                                <div className="mt-8 w-full py-2 bg-[#3d5644] text-white text-center rounded text-[10px] font-bold">
                                    View Mini Website &rarr;
                                </div>
                            </div>

                            {/* Front Smartphone Mockup */}
                            <div className="absolute left-8 bottom-4 w-52 rounded-[32px] border-[6px] border-[#3e3832] bg-[#fdfbf7] shadow-2xl overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
                                {/* Bezel & Speaker bar */}
                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#3e3832] rounded-b-xl flex items-center justify-center z-30">
                                </div>
                                {/* Bezel & Speaker bar */}
                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-neutral-900 rounded-full flex items-center justify-center z-30">
                                    <div className="size-1 rounded-full bg-neutral-800 mr-2"></div>
                                    <div className="w-6 h-0.5 bg-neutral-800 rounded-full"></div>
                                </div>

                                <div className="aspect-[9/19] bg-[#fdfbf7] p-4 flex flex-col items-center text-center relative pt-10 border border-[#ebd9c1] m-1 rounded-[22px]">
                                    <div className="absolute inset-0 bg-[radial-gradient(#ebd9c1_1px,transparent_1px)] [background-size:10px_10px] opacity-30 pointer-events-none"></div>

                                    <div className="size-16 rounded-full overflow-hidden border-2 border-[#d3c0a3] p-1 mb-2 z-10">
                                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                    </div>

                                    <div className="z-10">
                                        <h4 className="font-serif text-lg font-bold text-[#3e3832] leading-tight">Emma Wilson</h4>
                                        <span className="text-[7px] uppercase tracking-widest text-[#706557]">Marketing Specialist</span>
                                    </div>

                                    <div className="z-10 mt-6 w-full space-y-2 text-left">
                                        <div className="flex items-center gap-2 text-[10px] text-[#706557] border-b border-[#ebd9c1] pb-2"><Phone className="size-3 text-[#3d5644]" /> +23 123 58239</div>
                                        <div className="flex items-center gap-2 text-[10px] text-[#706557] border-b border-[#ebd9c1] pb-2"><Mail className="size-3 text-[#3d5644]" /> hello@emma.com</div>
                                        <div className="flex items-center gap-2 text-[9px] text-[#706557] border-b border-[#ebd9c1] pb-2"><Globe className="size-3 text-[#3d5644]" /> www.emmawilson.com</div>
                                    </div>

                                    <div className="z-10 mt-auto w-full">
                                        <div className="h-7 rounded bg-[#3d5644] text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                                            ✓ View Mini Website
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative z-10 w-full bg-[#f4efe6]/50 border-y border-[#ebd9c1] py-8 shadow-[inset_0_0_20px_rgba(235,217,193,0.3)]">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#ebd9c1]">

                            {/* Feature 1 */}
                            <div className="flex flex-col items-center text-center pt-4 md:pt-0">
                                <div className="text-[#d3c0a3] mb-3">
                                    <Heart className="size-8" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-lg font-bold text-[#3e3832] mb-1">Beautiful Designs</h3>
                                <p className="text-xs text-[#706557]">Exquisite Templates for Every Event</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex flex-col items-center text-center pt-8 md:pt-0">
                                <div className="text-[#d3c0a3] mb-3">
                                    <Edit3 className="size-8" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-lg font-bold text-[#3e3832] mb-1">Easy to Customize</h3>
                                <p className="text-xs text-[#706557]">Personalize with Ease</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex flex-col items-center text-center pt-8 md:pt-0">
                                <div className="text-[#d3c0a3] mb-3">
                                    <Mail className="size-8" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-lg font-bold text-[#3e3832] mb-1">Send Effortlessly</h3>
                                <p className="text-xs text-[#706557]">Send via Email, SMS & More</p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Showcase Section */}
                <section id="templates" className="relative z-10 max-w-6xl mx-auto px-6 py-16">

                    <div className="flex flex-col items-center justify-center text-center gap-2 mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#3e3832]">
                            Explore Our Popular Templates
                        </h2>
                        <p className="text-[#706557] font-serif text-sm">
                            Stunning Digital Invitations for All Your Special Moments
                        </p>
                    </div>

                    {/* Primary Showcase Module Selector — 2 Tabs */}
                    <div className="flex justify-center mb-10">
                        <div className="inline-flex p-1 bg-[#fdfbf7] rounded-xl border border-[#ebd9c1] shadow-sm">
                            <button
                                onClick={() => setActiveModule('cards')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-serif font-bold transition-all ${activeModule === 'cards'
                                    ? 'bg-[#ebd9c1] text-[#4a4238] shadow-sm'
                                    : 'text-[#706557] hover:text-[#4a4238]'
                                    }`}
                            >
                                <Smartphone className="size-4" /> Invitation Cards
                            </button>
                            <button
                                onClick={() => setActiveModule('websites')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-serif font-bold transition-all ${activeModule === 'websites'
                                    ? 'bg-[#ebd9c1] text-[#4a4238] shadow-sm'
                                    : 'text-[#706557] hover:text-[#4a4238]'
                                    }`}
                            >
                                <Globe className="size-4" /> Mini Websites
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center mb-10">
                        {activeModule === 'cards' ? (
                            <div className="flex flex-wrap gap-2 justify-center w-full">
                                {categoriesList.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest transition-all border ${selectedCategory === cat
                                            ? 'bg-[#4a4238] text-[#fdfbf7] border-[#4a4238]'
                                            : 'bg-transparent text-[#706557] border-[#ebd9c1] hover:bg-[#ebd9c1]'
                                            }`}
                                    >
                                        {getCategoryName(cat)}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 justify-center w-full">
                                {(['all', 'invitation', 'business'] as const).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedWebsiteCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest transition-all border ${selectedWebsiteCategory === cat
                                            ? 'bg-[#4a4238] text-[#fdfbf7] border-[#4a4238]'
                                            : 'bg-transparent text-[#706557] border-[#ebd9c1] hover:bg-[#ebd9c1]'
                                            }`}
                                    >
                                        {cat === 'all' ? 'All Websites' : cat === 'invitation' ? 'Event Invitations' : 'Business Sites'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Invitation Cards Grid */}
                    {activeModule === 'cards' && (
                        filteredTemplates.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#ebd9c1] bg-[#fcfaf5]">
                                <span className="text-[#706557] font-serif">No template designs added yet.</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-12 w-full max-w-full overflow-hidden">
                                {filteredTemplates.filter((t) => t.type !== 'video').length > 0 && (
                                    <div className="w-full max-w-full">
                                        <h3 className="text-2xl font-serif font-bold text-[#3e3832] mb-6 text-center lg:text-left">Image Templates</h3>
                                        <div ref={imageScrollRef} className="flex overflow-x-auto pb-6 snap-x snap-mandatory gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 sm:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 sm:px-0">
                                            {filteredTemplates.filter((t) => t.type !== 'video').map((t) => (
                                                <div key={t.id} className="w-[60vw] max-w-[260px] sm:w-auto sm:min-w-0 shrink-0 snap-center sm:snap-align-none group relative flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                                                    <div className={`relative w-full aspect-[4/5] p-6 ${t.type !== 'video' ? `bg-gradient-to-tr ${t.bg_gradient}` : 'bg-neutral-900'} rounded-t-xl rounded-b shadow-md overflow-hidden flex flex-col items-center justify-center`}>
                                                        <div className="absolute inset-0 bg-[#3e3832]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <div className="text-center pointer-events-none scale-90 opacity-90 transition-transform duration-300 group-hover:scale-95 relative z-10">
                                                            <p className="text-[10px] tracking-widest uppercase font-serif font-bold text-neutral-800">{t.default_config.title}</p>
                                                            <p className="font-serif text-2xl font-black my-2 truncate text-neutral-900 max-w-[170px]">{t.default_config.guest_of_honor}</p>
                                                            <p className="text-[8px] opacity-80 uppercase tracking-wider">{t.default_config.date}</p>
                                                        </div>
                                                        <Link href={`/templates/${t.id}/customize`} className="absolute inset-0 z-20" />
                                                    </div>
                                                    <div className="w-[90%] -mt-6 z-20 bg-[#fdfbf7] border border-[#ebd9c1] rounded p-3 text-center shadow-sm relative pointer-events-none group-hover:border-[#d3c0a3] transition-colors">
                                                        <h3 className="text-sm font-serif font-bold text-[#3e3832] truncate">{t.name}</h3>
                                                        <p className="text-[10px] uppercase font-bold text-[#706557] tracking-widest mt-0.5">{getCategoryName(t.category)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {filteredTemplates.filter((t) => t.type === 'video').length > 0 && (
                                    <div className="w-full max-w-full">
                                        <h3 className="text-2xl font-serif font-bold text-[#3e3832] mb-6 text-center lg:text-left">Video Templates</h3>
                                        <div ref={videoScrollRef} className="flex overflow-x-auto pb-6 snap-x snap-mandatory gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 sm:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 sm:px-0">
                                            {filteredTemplates.filter((t) => t.type === 'video').map((t) => (
                                                <div key={t.id} className="w-[60vw] max-w-[260px] sm:w-auto sm:min-w-0 shrink-0 snap-center sm:snap-align-none group relative flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                                                    <div className={`relative w-full aspect-[4/5] p-6 bg-neutral-900 rounded-t-xl rounded-b shadow-md overflow-hidden flex flex-col items-center justify-center`}>
                                                        {t.default_config?.video_url && (
                                                            <video
                                                                src={t.default_config.video_url}
                                                                autoPlay
                                                                loop
                                                                muted
                                                                playsInline
                                                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-[#3e3832]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <div className="text-center pointer-events-none scale-90 opacity-90 transition-transform duration-300 group-hover:scale-95 relative z-10">
                                                            <PlayCircle className="size-12 text-white/80 mx-auto" />
                                                        </div>
                                                        <Link href={`/templates/${t.id}/customize`} className="absolute inset-0 z-20" />
                                                    </div>
                                                    <div className="w-[90%] -mt-6 z-20 bg-[#fdfbf7] border border-[#ebd9c1] rounded p-3 text-center shadow-sm relative pointer-events-none group-hover:border-[#d3c0a3] transition-colors">
                                                        <h3 className="text-sm font-serif font-bold text-[#3e3832] truncate">{t.name}</h3>
                                                        <p className="text-[10px] uppercase font-bold text-[#706557] tracking-widest mt-0.5">{getCategoryName(t.category)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    )}

                    {/* Mini Website Template Showcase */}
                    {activeModule === 'websites' && (
                        filteredWebsites.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#ebd9c1] bg-[#fcfaf5]">
                                <span className="text-[#706557] font-serif">No website templates added yet.</span>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {filteredWebsites.map((w) => {
                                    return (
                                        <div key={w.id} className="group relative flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e0d6c8] flex items-center justify-center rounded-t-xl rounded-b shadow-md">
                                                {w.preview_image ? (
                                                    <img src={w.preview_image} alt={w.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[#ebd9c1]/20 flex flex-col items-center justify-center p-6 text-center select-none">
                                                        <Globe className="size-8 text-[#d3c0a3] mb-3" />
                                                        <p className="text-sm font-serif font-bold text-[#3e3832]">{w.name}</p>
                                                    </div>
                                                )}
                                                <Link href={`/customer/mini-websites?template_id=${w.id}`} className="absolute inset-0 z-10" />
                                            </div>
                                            <div className="w-[90%] -mt-6 z-20 bg-[#fdfbf7] border border-[#ebd9c1] rounded p-3 text-center shadow-sm relative pointer-events-none group-hover:border-[#d3c0a3] transition-colors">
                                                <h3 className="text-sm font-serif font-bold text-[#3e3832] truncate">{w.name}</h3>
                                                <p className="text-[10px] uppercase font-bold text-[#706557] tracking-widest mt-0.5">{w.type === 'invitation' ? 'Event Website' : 'Business Site'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </section>

                {/* ===== DIGITAL BUSINESS CARDS SECTION (always visible below showcase) ===== */}
                <section id="digital-business-cards" className="relative z-10 max-w-6xl mx-auto px-6 py-16">

                    <div className="flex flex-col items-center justify-center text-center gap-2 mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#3e3832]">
                            Digital Visiting Cards with Mini Website
                        </h2>
                        <p className="text-[#706557] font-serif text-sm">
                            Create Professional & Interactive E-Visiting Cards
                        </p>
                    </div>


                    <div ref={businessCardsScrollRef} className="flex overflow-x-auto pb-10 snap-x snap-mandatory gap-6 sm:grid sm:grid-cols-3 lg:grid-cols-5 relative w-full max-w-5xl mx-auto sm:overflow-visible sm:pb-0 sm:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 sm:px-0">
                        {showcasedDigitalCards.slice(0, 5).map((t, idx) => (
                            <div
                                key={t.id}
                                className={`w-[55vw] max-w-[220px] sm:w-auto sm:min-w-0 shrink-0 snap-center sm:snap-align-none group flex flex-col items-center hover:-translate-y-1 transition-all duration-300 relative ${idx === 2 ? 'sm:z-20 sm:transform sm:scale-110 sm:-translate-y-4' : 'z-10'}`}
                            >
                                {/* Mobile Phone Mockup */}
                                <div className="relative w-[85%] aspect-[9/19] rounded-[24px] border-[6px] border-[#2c3238] bg-white shadow-xl overflow-hidden">

                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-4 bg-[#2c3238] rounded-b-xl z-20 flex items-center justify-center">
                                        <div className="size-1 rounded-full bg-gray-900/50 mr-1.5"></div>
                                        <div className="w-6 h-0.5 bg-gray-900/50 rounded-full"></div>
                                    </div>

                                    {/* Side Buttons (Visual Only) */}
                                    <div className="absolute -left-[6px] top-12 w-1 h-6 bg-[#2c3238] rounded-r-none rounded-l-sm"></div>
                                    <div className="absolute -left-[6px] top-20 w-1 h-10 bg-[#2c3238] rounded-r-none rounded-l-sm"></div>
                                    <div className="absolute -left-[6px] top-32 w-1 h-10 bg-[#2c3238] rounded-r-none rounded-l-sm"></div>
                                    <div className="absolute -right-[6px] top-24 w-1 h-12 bg-[#2c3238] rounded-l-none rounded-r-sm"></div>

                                    {/* Screen Content */}
                                    <div className="relative w-full h-full bg-white rounded-[18px] overflow-hidden border-[2px] border-white/50">
                                        <img
                                            src={t.thumbnail}
                                            alt={t.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/business-cards/template1.png'; }}
                                        />
                                        <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                            <div className="w-full text-center py-2.5 bg-[#3d5644]/95 text-white text-[10px] font-bold font-serif uppercase tracking-wider backdrop-blur-md">View Mini Website</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-[80%] ${idx === 2 ? 'mt-3' : 'mt-3'} z-20 bg-[#fdfbf7] border border-[#ebd9c1] rounded-lg p-2.5 text-center shadow-sm`}>
                                    <p className="font-serif font-bold text-xs text-[#3e3832] truncate">{t.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Dropdown Button */}
                    <div className="mt-14 flex justify-center pb-8">
                        <Link
                            href={(auth as any)?.user ? '/customer/static-templates' : '/login'}
                            className="inline-flex items-center justify-center gap-2 bg-[#ebd9c1] text-[#4a4238] font-serif font-bold px-8 py-3 rounded text-sm shadow-md border border-[#d3c0a3] hover:bg-[#e0ccb2] transition-colors"
                        >
                            {(auth as any)?.user ? 'Create Visiting Card ▾' : 'Login to Create Visiting Card'}
                        </Link>
                    </div>
                </section>

                <footer className="bg-[#fdfbf7] border-t border-[#ebd9c1] pt-12 pb-6 text-center text-xs text-[#706557] mt-20 transition-colors">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col text-left gap-1">
                            <div className="flex items-center gap-1.5 opacity-80 mb-2">
                                <AppLogoIcon className="size-6 fill-current text-[#3d5644]" />
                                <span className="font-serif font-bold text-base text-[#3e3832]">Invitify</span>
                            </div>
                            <p className="text-[10px]">© {new Date().getFullYear()} Invitify. Created with React & Laravel. All rights reserved.</p>
                            <p className="text-[10px]">Avinya Digitech Pvt Ltd. Beside Besa-Pimpla Road, Nagpur – 440034</p>
                        </div>
                        <div className="flex justify-center gap-4 text-[#706557] font-serif font-semibold flex-wrap">
                            <Link href="/" className="hover:text-[#3d5644] transition-colors">Home</Link>
                            <Link href="/privacy-policy" className="hover:text-[#3d5644] transition-colors">Privacy Policy</Link>
                            <Link href="/terms-and-conditions" className="hover:text-[#3d5644] transition-colors">Terms & Conditions</Link>
                            <Link href="/refund-policy" className="hover:text-[#3d5644] transition-colors">Refund Policy</Link>
                            <Link href="/disclaimer" className="hover:text-[#3d5644] transition-colors">Disclaimer</Link>
                            <Link href="/cookie-policy" className="hover:text-[#3d5644] transition-colors">Cookie Policy</Link>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-[#ebd9c1]/50 text-center">
                        <p className="text-sm">
                            Developed and Designed by{' '}
                            <a 
                                href="https://globalinfotechindia.com/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-bold text-[#3d5644] hover:underline transition-colors"
                            >
                                Global India Infotech Pvt Ltd
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
