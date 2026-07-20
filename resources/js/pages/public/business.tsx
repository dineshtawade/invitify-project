import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Phone, MapPin, Building, Globe, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface PublicBusinessWebsite {
    id: number;
    title: string;
    slug: string;
    theme: 'cozy' | 'clean' | 'royal' | 'ocean';
    config: {
        home: {
            hero_title: string;
            hero_subtitle: string;
            cta_text: string;
        };
        about: {
            title: string;
            description: string;
            vision: string;
        };
        services: {
            title: string;
            list: Array<{ title: string; description: string }>;
        };
        contact: {
            phone: string;
            email: string;
            address: string;
        };
    };
}

interface PageProps {
    website: PublicBusinessWebsite;
    currentPage: 'home' | 'about' | 'services' | 'contact';
}

const themePresets = {
    royal: {
        bg: 'bg-amber-50/40 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
        nav: 'bg-white/90 border-amber-200/50 backdrop-blur-md shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800',
        hero: 'from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400',
        accent: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/10',
        secondary: 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50/50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-amber-400',
        card: 'bg-white border-amber-100 dark:bg-neutral-900 dark:border-neutral-800',
        footer: 'bg-neutral-900 text-neutral-400 dark:bg-neutral-950',
        decor: 'text-amber-600 dark:text-amber-400',
    },
    cozy: {
        bg: 'bg-stone-50/40 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
        nav: 'bg-white/90 border-rose-200/50 backdrop-blur-md shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800',
        hero: 'from-rose-600 to-stone-800 bg-clip-text text-transparent dark:from-rose-400 dark:to-stone-200',
        accent: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/10',
        secondary: 'bg-white border-rose-200 text-rose-950 hover:bg-rose-50/50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-rose-400',
        card: 'bg-white border-rose-100 dark:bg-neutral-900 dark:border-neutral-800',
        footer: 'bg-stone-900 text-stone-400 dark:bg-neutral-950',
        decor: 'text-rose-500 dark:text-rose-400',
    },
    ocean: {
        bg: 'bg-cyan-50/30 text-cyan-950 dark:bg-neutral-950 dark:text-neutral-50',
        nav: 'bg-white/90 border-teal-200/50 backdrop-blur-md shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800',
        hero: 'from-cyan-750 to-teal-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-teal-400',
        accent: 'bg-teal-700 hover:bg-teal-700 text-white shadow-teal-500/10',
        secondary: 'bg-white border-teal-200 text-teal-950 hover:bg-teal-50/50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-teal-400',
        card: 'bg-white border-teal-100 dark:bg-neutral-900 dark:border-teal-800',
        footer: 'bg-slate-900 text-slate-400 dark:bg-neutral-950',
        decor: 'text-teal-600 dark:text-teal-400',
    },
    clean: {
        bg: 'bg-zinc-50 text-zinc-900 dark:bg-neutral-950 dark:text-neutral-50',
        nav: 'bg-white/90 border-zinc-200 backdrop-blur-md shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800',
        hero: 'from-zinc-900 to-zinc-700 bg-clip-text text-transparent dark:from-white dark:to-zinc-400',
        accent: 'bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-neutral-100',
        secondary: 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50/50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-zinc-300',
        card: 'bg-white border-zinc-200 dark:bg-neutral-900 dark:border-neutral-800',
        footer: 'bg-zinc-950 text-zinc-400 dark:bg-neutral-950',
        decor: 'text-zinc-900 dark:text-zinc-100',
    },
};

export default function PublicBusinessSite({ website, currentPage }: PageProps) {
    const { home, about, services, contact } = website.config;
    const activeTheme = themePresets[website.theme] || themePresets.royal;

    // Contact Form
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/business/${website.slug}/contact`, {
            preserveScroll: true,
            onSuccess: () => {
                setFormSubmitted(true);
                reset();
            },
        });
    };

    return (
        <>
            <Head title={`${website.title} - ${currentPage.toUpperCase()}`} />

            <div className={`min-h-screen flex flex-col font-sans selection:bg-neutral-950 selection:text-white transition-colors ${activeTheme.bg}`}>

                {/* Navbar Header */}
                <header className={`sticky top-0 z-50 border-b ${activeTheme.nav}`}>
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href={`/business/${website.slug}`} className="flex items-center gap-2 font-serif font-black tracking-tight text-lg">
                            <Building className="size-5 shrink-0" /> {website.title}
                        </Link>

                        <nav className="flex gap-1.5 sm:gap-4">
                            {(['home', 'about', 'services', 'contact'] as const).map((tab) => {
                                const isHome = tab === 'home';
                                const linkUrl = isHome ? `/business/${website.slug}` : `/business/${website.slug}/${tab}`;
                                return (
                                    <Link
                                        key={tab}
                                        href={linkUrl}
                                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold capitalize transition-all ${currentPage === tab
                                                ? 'bg-neutral-950/5 text-neutral-950 dark:bg-white/5 dark:text-white'
                                                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-450 dark:hover:text-neutral-200'
                                            }`}
                                    >
                                        {tab}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </header>

                {/* Main Content Sections */}
                <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 sm:py-20">

                    {/* HOME PAGE */}
                    {currentPage === 'home' && (
                        <div className="flex flex-col items-center justify-center text-center gap-6 max-w-3xl mx-auto py-10">
                            <h2 className={`text-4xl sm:text-6xl font-serif font-extrabold tracking-tight leading-tight uppercase ${activeTheme.hero}`}>
                                {home.hero_title}
                            </h2>
                            <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl dark:text-neutral-400">
                                {home.hero_subtitle}
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <Link
                                    href={`/business/${website.slug}/contact`}
                                    className={`rounded-xl px-6 py-3.5 text-sm font-bold shadow-md transition-all flex items-center gap-1.5 ${activeTheme.accent}`}
                                >
                                    {home.cta_text} <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href={`/business/${website.slug}/services`}
                                    className={`rounded-xl border px-6 py-3.5 text-sm font-bold transition-all ${activeTheme.secondary}`}
                                >
                                    Explore Services
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ABOUT PAGE */}
                    {currentPage === 'about' && (
                        <div className="grid gap-12 lg:grid-cols-12 items-start py-6">
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                <h2 className={`text-3xl font-serif font-bold ${activeTheme.decor}`}>{about.title}</h2>
                                <p className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                                    {about.description}
                                </p>
                            </div>
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                <div className={`rounded-3xl border p-8 shadow-xs flex flex-col gap-4 ${activeTheme.card}`}>
                                    <h4 className="text-xs uppercase tracking-widest font-black opacity-40">Core Mission & Vision</h4>
                                    <p className="font-serif italic text-lg leading-relaxed font-semibold">
                                        "{about.vision}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SERVICES PAGE */}
                    {currentPage === 'services' && (
                        <div className="flex flex-col gap-10 py-6">
                            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
                                <h2 className={`text-3xl font-serif font-bold ${activeTheme.decor}`}>{services.title}</h2>
                                <p className="text-xs sm:text-sm text-neutral-400 font-semibold uppercase tracking-widest">Premium services designed to empower your business solutions.</p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-3 mt-4">
                                {services.list.map((serv, idx) => (
                                    <div
                                        key={idx}
                                        className={`rounded-3xl border p-8 shadow-xs flex flex-col gap-4 hover:shadow-md transition-all ${activeTheme.card}`}
                                    >
                                        <div className={`rounded-2xl bg-neutral-100 p-3 text-neutral-900 w-fit dark:bg-neutral-800 dark:text-white`}>
                                            <Sparkles className="size-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">{serv.title}</h3>
                                        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">
                                            {serv.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CONTACT PAGE */}
                    {currentPage === 'contact' && (
                        <div className="grid gap-12 lg:grid-cols-12 items-start py-6">

                            {/* Left Contact Info */}
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <h2 className={`text-3xl font-serif font-bold ${activeTheme.decor}`}>Contact Us</h2>
                                    <p className="text-sm text-neutral-500">Reach out today to discuss how we can work together.</p>
                                </div>

                                <div className="flex flex-col gap-4 mt-4 text-sm font-semibold">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-black/5 p-2.5 shrink-0 dark:bg-white/5">
                                            <Phone className="size-5 text-neutral-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs opacity-50 uppercase tracking-widest">Call Us</div>
                                            <div className="mt-0.5">{contact.phone}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-black/5 p-2.5 shrink-0 dark:bg-white/5">
                                            <Mail className="size-5 text-neutral-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs opacity-50 uppercase tracking-widest">Email Address</div>
                                            <div className="mt-0.5">{contact.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-black/5 p-2.5 shrink-0 dark:bg-white/5">
                                            <MapPin className="size-5 text-neutral-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs opacity-50 uppercase tracking-widest">Headquarters</div>
                                            <div className="mt-0.5 leading-relaxed font-normal whitespace-pre-wrap">{contact.address}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Contact Form */}
                            <div className="lg:col-span-7">
                                <div className={`rounded-3xl border p-8 sm:p-10 shadow-xs ${activeTheme.card}`}>
                                    <h3 className="text-xl font-bold mb-1">Send a Message</h3>
                                    <p className="text-xs text-neutral-500 mb-6">Drop us a line and our executive will reach out to you within 24 hours.</p>

                                    {formSubmitted ? (
                                        <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-center flex flex-col items-center gap-3">
                                            <CheckCircle className="size-10 text-emerald-600" />
                                            <div>
                                                <h4 className="font-bold text-sm">Message Sent!</h4>
                                                <p className="text-xs mt-1 leading-normal">Your message details were successfully submitted to our executive portal.</p>
                                            </div>
                                            <button
                                                onClick={() => setFormSubmitted(false)}
                                                className={`mt-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all ${activeTheme.accent}`}
                                            >
                                                Send Another Message
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                            <div className="grid gap-1.5">
                                                <label className="text-xs font-bold opacity-60">Your Name</label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="E.g., Rohan Deshmukh"
                                                    required
                                                    className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 dark:bg-neutral-950 focus:ring-neutral-900 border-neutral-200 dark:border-neutral-800`}
                                                />
                                            </div>

                                            <div className="grid gap-1.5">
                                                <label className="text-xs font-bold opacity-60">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="E.g., rohan@company.com"
                                                    required
                                                    className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 dark:bg-neutral-950 focus:ring-neutral-900 border-neutral-200 dark:border-neutral-800`}
                                                />
                                            </div>

                                            <div className="grid gap-1.5">
                                                <label className="text-xs font-bold opacity-60">Subject</label>
                                                <input
                                                    type="text"
                                                    value={data.subject}
                                                    onChange={(e) => setData('subject', e.target.value)}
                                                    placeholder="E.g., Inquiry about web development service"
                                                    required
                                                    className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 dark:bg-neutral-950 focus:ring-neutral-900 border-neutral-200 dark:border-neutral-800`}
                                                />
                                            </div>

                                            <div className="grid gap-1.5">
                                                <label className="text-xs font-bold opacity-60">Message Details</label>
                                                <textarea
                                                    value={data.message}
                                                    onChange={(e) => setData('message', e.target.value)}
                                                    placeholder="Describe your project, request or feedback here..."
                                                    required
                                                    className={`flex min-h-[100px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 dark:bg-neutral-950 focus:ring-neutral-900 border-neutral-200 dark:border-neutral-800`}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`w-full py-3.5 mt-2 rounded-xl text-sm font-bold shadow-md transition-all ${activeTheme.accent}`}
                                            >
                                                {processing ? 'Submitting...' : 'Send Message'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </main>

                {/* Footer Section */}
                <footer className={`py-10 border-t border-black/5 dark:border-white/5 text-center text-xs ${activeTheme.footer}`}>
                    <p>© {new Date().getFullYear()} {website.title}. All rights reserved.</p>
                    <p className="mt-1 opacity-50 flex items-center justify-center gap-1"><Globe className="size-3.5" /> Powered by Invitify</p>
                </footer>
            </div>
        </>
    );
}
