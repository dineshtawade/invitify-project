import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    Mail, Sparkles, MapPin, Compass, Play, 
    ChevronLeft, ChevronRight, Globe, CheckCircle, AlertCircle, 
    Instagram, Phone, Calendar, Clock, Heart, Star, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ViewerMiniWebsite {
    id: number;
    title: string;
    slug: string;
    theme: 'cozy' | 'clean' | 'royal' | 'ocean';
    type: 'invitation' | 'business';
    config: any[];
}

interface PageProps {
    website: ViewerMiniWebsite;
}

const themePresets = {
    royal: {
        bg: 'from-amber-50 via-orange-50 to-amber-100 text-amber-900',
        accent: 'bg-amber-700 hover:bg-amber-800 text-white shadow-lg shadow-amber-500/10',
        card: 'bg-white/95 border border-amber-200/50 shadow-md shadow-amber-500/5',
        input: 'border-amber-200 focus:ring-amber-500 focus:border-amber-500',
        badge: 'bg-amber-100 text-amber-900 border border-amber-200',
        iconColor: 'text-amber-600',
        nav: 'bg-white/80 backdrop-blur-md border-amber-100'
    },
    cozy: {
        bg: 'from-stone-50 via-rose-50 to-stone-100 text-rose-950',
        accent: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/10',
        card: 'bg-white/95 border border-rose-200/50 shadow-md shadow-rose-500/5',
        input: 'border-rose-200 focus:ring-rose-500 focus:border-rose-500',
        badge: 'bg-rose-100 text-rose-900 border border-rose-200',
        iconColor: 'text-rose-500',
        nav: 'bg-white/80 backdrop-blur-md border-rose-100'
    },
    ocean: {
        bg: 'from-cyan-50 via-teal-50/50 to-cyan-100 text-cyan-950',
        accent: 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/10',
        card: 'bg-white/95 border border-teal-200/50 shadow-md shadow-teal-500/5',
        input: 'border-teal-200 focus:ring-teal-500 focus:border-teal-500',
        badge: 'bg-teal-100 text-teal-900 border border-teal-200',
        iconColor: 'text-teal-600',
        nav: 'bg-white/80 backdrop-blur-md border-teal-100'
    },
    clean: {
        bg: 'from-zinc-50 via-neutral-100 to-zinc-200 text-zinc-900',
        accent: 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-lg shadow-zinc-500/10',
        card: 'bg-white border border-zinc-200 shadow-md shadow-zinc-500/5',
        input: 'border-zinc-300 focus:ring-zinc-900 focus:border-zinc-900',
        badge: 'bg-zinc-200 text-zinc-900 border border-zinc-300',
        iconColor: 'text-zinc-700',
        nav: 'bg-white/80 backdrop-blur-md border-zinc-200'
    },
};

// Lucide icon helper
const DynamicIcon = ({ name, className }: { name: string; className: string }) => {
    switch (name?.toLowerCase()) {
        case 'instagram': return <Instagram className={className} />;
        case 'phone': return <Phone className={className} />;
        case 'map-pin': return <MapPin className={className} />;
        case 'calendar': return <Calendar className={className} />;
        case 'clock': return <Clock className={className} />;
        case 'heart': return <Heart className={className} />;
        case 'star': return <Star className={className} />;
        case 'globe': return <Globe className={className} />;
        default: return <Sparkles className={className} />;
    }
};

// YouTube embed parser
const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        videoId = match[2];
    } else {
        return url;
    }
    return `https://www.youtube.com/embed/${videoId}`;
};

export default function PublicSiteViewer({ website }: PageProps) {
    const activeTheme = themePresets[website.theme] || themePresets.royal;
    const blocks = Array.isArray(website.config) ? website.config : [];

    // Swiper Carousels State
    const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});
    const nextSlide = (blockId: string, max: number) => {
        setCarouselIndices((prev) => ({
            ...prev,
            [blockId]: ((prev[blockId] || 0) + 1) % max
        }));
    };
    const prevSlide = (blockId: string, max: number) => {
        setCarouselIndices((prev) => ({
            ...prev,
            [blockId]: ((prev[blockId] || 0) - 1 + max) % max
        }));
    };

    // RSVP Form Logic
    const rsvpForm = useForm({
        name: '',
        email: '',
        guests_count: 1,
        status: 'attending' as 'attending' | 'declined',
        message: '',
    });
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
    const handleRsvpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        rsvpForm.post(`/sites/${website.slug}/rsvp`, {
            preserveScroll: true,
            onSuccess: () => {
                setRsvpSubmitted(true);
                rsvpForm.reset();
            }
        });
    };

    // Contact Form Logic
    const contactForm = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        contactForm.post(`/sites/${website.slug}/contact`, {
            preserveScroll: true,
            onSuccess: () => {
                setContactSubmitted(true);
                contactForm.reset();
            }
        });
    };

    return (
        <>
            <Head>
                <title>{website.title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </Head>

            <div className={`min-h-screen bg-gradient-to-b pb-20 font-sans transition-all selection:bg-neutral-900 selection:text-white ${activeTheme.bg}`}>
                
                {/* Site Header Navigation */}
                <header className={`sticky top-0 z-50 border-b backdrop-blur-md px-6 py-4 flex items-center justify-between ${activeTheme.nav}`}>
                    <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
                        <span className="font-serif font-black tracking-tight text-xl">{website.title}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider rounded-full px-3 py-1 bg-black/5 dark:bg-white/10">
                            {website.type}
                        </span>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-16 mt-8">
                    {blocks.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                            <Compass className="size-12 text-neutral-300 animate-spin" />
                            <p className="text-neutral-400 font-medium">This website does not contain any sections yet.</p>
                        </div>
                    ) : (
                        blocks.map((block) => (
                            <div key={block.id} id={block.id} className="scroll-mt-20">
                                
                                {/* 1. Hero Block */}
                                {block.type === 'hero' && (
                                    <div className={`rounded-3xl p-10 sm:p-14 text-center bg-gradient-to-tr ${block.bg_color || 'from-blue-650 to-indigo-650'} text-white shadow-xl flex flex-col gap-6 items-center justify-center min-h-[360px]`}>
                                        <Sparkles className="size-10 text-white/40 animate-pulse" />
                                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md font-serif">
                                            {block.title || 'Welcome'}
                                        </h1>
                                        <p className="text-sm sm:text-base opacity-90 max-w-lg leading-relaxed">
                                            {block.subtitle}
                                        </p>
                                        {block.cta_text && (
                                            <a 
                                                href={block.cta_link || '#'}
                                                className="rounded-full px-8 py-3 bg-white text-neutral-900 font-extrabold text-xs tracking-wider uppercase hover:scale-105 hover:shadow-lg transition-all active:scale-95 duration-200 mt-2"
                                            >
                                                {block.cta_text}
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* 2. Text Block */}
                                {block.type === 'text' && (
                                    <div 
                                        className={`rounded-3xl p-8 sm:p-12 shadow-sm ${activeTheme.card} flex flex-col gap-4`} 
                                        style={{ textAlign: (block.align || 'center') as any }}
                                    >
                                        {block.title && (
                                            <h2 className="text-2xl font-bold font-serif tracking-tight">{block.title}</h2>
                                        )}
                                        <p className="text-sm sm:text-base leading-relaxed opacity-85 whitespace-pre-wrap">
                                            {block.content}
                                        </p>
                                    </div>
                                )}

                                {/* 3. Swiper Photo Slideshow */}
                                {block.type === 'swiper' && block.images && block.images.length > 0 && (
                                    <div className={`rounded-3xl p-6 sm:p-10 shadow-sm ${activeTheme.card} flex flex-col gap-6`}>
                                        {block.title && (
                                            <h2 className="text-xl font-bold text-center font-serif tracking-tight uppercase tracking-widest">{block.title}</h2>
                                        )}
                                        
                                        {/* Slider Body */}
                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden group shadow-lg bg-neutral-950">
                                            {(() => {
                                                const activeIdx = carouselIndices[block.id] || 0;
                                                return (
                                                    <>
                                                        <img 
                                                            src={block.images[activeIdx]} 
                                                            alt="slideshow" 
                                                            className="size-full object-cover transition-all duration-500 ease-in-out transform scale-100 group-hover:scale-102"
                                                        />
                                                        
                                                        {block.images.length > 1 && (
                                                            <>
                                                                {/* Arrow controls */}
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => prevSlide(block.id, block.images.length)}
                                                                    className="absolute left-4 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                                                                >
                                                                    <ChevronLeft className="size-5" />
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => nextSlide(block.id, block.images.length)}
                                                                    className="absolute right-4 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                                                                >
                                                                    <ChevronRight className="size-5" />
                                                                </button>

                                                                {/* Bottom Pagination Indicators */}
                                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-xs">
                                                                    {block.images.map((_: any, idx: number) => (
                                                                        <span 
                                                                            key={idx}
                                                                            className={`size-2 rounded-full transition-all ${
                                                                                idx === activeIdx ? 'bg-white w-4' : 'bg-white/50'
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* 4. Video Embed Block */}
                                {block.type === 'video' && block.video_url && (
                                    <div className={`rounded-3xl p-6 sm:p-10 shadow-sm ${activeTheme.card} flex flex-col gap-6`}>
                                        {block.title && (
                                            <h2 className="text-xl font-bold text-center font-serif tracking-tight">{block.title}</h2>
                                        )}
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-neutral-900 border">
                                            <iframe
                                                src={getEmbedUrl(block.video_url)}
                                                className="size-full"
                                                title={block.title || "video showcase"}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 5. Buttons / Links Stack */}
                                {block.type === 'links' && block.links && block.links.length > 0 && (
                                    <div className={`rounded-3xl p-8 sm:p-10 shadow-sm ${activeTheme.card} flex flex-col gap-6 items-center`}>
                                        {block.title && (
                                            <h2 className="text-xl font-bold font-serif tracking-tight text-center">{block.title}</h2>
                                        )}
                                        <div className="flex flex-col gap-3 w-full max-w-sm">
                                            {block.links.map((link: any, i: number) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`w-full py-3.5 px-6 rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border shadow-xs transition-all hover:scale-102 duration-200 ${activeTheme.accent}`}
                                                >
                                                    <DynamicIcon name={link.icon || 'link'} className="size-4 shrink-0" />
                                                    <span>{link.label}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 6. Key Features / Icon Grid */}
                                {block.type === 'icons_grid' && block.features && block.features.length > 0 && (
                                    <div className={`rounded-3xl p-8 sm:p-12 shadow-sm ${activeTheme.card} flex flex-col gap-8`}>
                                        {block.title && (
                                            <h2 className="text-2xl font-bold text-center font-serif tracking-tight">{block.title}</h2>
                                        )}
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            {block.features.map((feat: any, i: number) => (
                                                <div key={i} className="rounded-2xl border p-5 bg-white/40 dark:bg-black/5 border-black/5 dark:border-white/5 flex gap-4 items-start shadow-2xs hover:shadow-xs transition-shadow">
                                                    <div className={`rounded-xl p-2.5 bg-white dark:bg-neutral-800 shadow-xs ${activeTheme.iconColor}`}>
                                                        <DynamicIcon name={feat.icon || 'sparkles'} className="size-5" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <h4 className="font-bold text-sm tracking-tight">{feat.title}</h4>
                                                        <p className="text-xs opacity-75 leading-relaxed">{feat.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 7. Contact / RSVP Form */}
                                {block.type === 'form' && (
                                    <div className={`rounded-3xl p-8 sm:p-12 shadow-sm ${activeTheme.card} flex flex-col gap-8`}>
                                        <h2 className="text-2xl font-bold font-serif tracking-tight text-center">{block.title || 'RSVP Response'}</h2>
                                        
                                        {block.form_type === 'rsvp' ? (
                                            /* RSVP Event Form */
                                            rsvpSubmitted ? (
                                                <div className="rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-center flex flex-col items-center gap-2">
                                                    <CheckCircle className="size-10 text-emerald-600 dark:text-emerald-400" />
                                                    <h4 className="font-bold text-base">RSVP Submitted!</h4>
                                                    <p className="text-xs">Thank you for letting us know your status. Your response is recorded.</p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4">
                                                    <div className="grid gap-1.5">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Full Name</label>
                                                        <Input 
                                                            value={rsvpForm.data.name} 
                                                            onChange={(e) => rsvpForm.setData('name', e.target.value)} 
                                                            required 
                                                            placeholder="Guest Name"
                                                            className={activeTheme.input}
                                                        />
                                                        {rsvpForm.errors.name && <p className="text-xs text-red-500">{rsvpForm.errors.name}</p>}
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email Address</label>
                                                        <Input 
                                                            type="email" 
                                                            value={rsvpForm.data.email} 
                                                            onChange={(e) => rsvpForm.setData('email', e.target.value)} 
                                                            required 
                                                            placeholder="guest@example.com"
                                                            className={activeTheme.input}
                                                        />
                                                        {rsvpForm.errors.email && <p className="text-xs text-red-500">{rsvpForm.errors.email}</p>}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-1.5">
                                                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Guests Count</label>
                                                            <select
                                                                value={rsvpForm.data.guests_count}
                                                                onChange={(e) => rsvpForm.setData('guests_count', parseInt(e.target.value))}
                                                                className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden ${activeTheme.input}`}
                                                            >
                                                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                                                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="grid gap-1.5">
                                                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Will You Attend?</label>
                                                            <select
                                                                value={rsvpForm.data.status}
                                                                onChange={(e) => rsvpForm.setData('status', e.target.value as any)}
                                                                className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden ${activeTheme.input}`}
                                                            >
                                                                <option value="attending">Accepts with Pleasure</option>
                                                                <option value="declined">Declines with Regret</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Special Notes / Message</label>
                                                        <textarea 
                                                            value={rsvpForm.data.message} 
                                                            onChange={(e) => rsvpForm.setData('message', e.target.value)} 
                                                            placeholder="Dietary requests or congratulations..."
                                                            className={`flex min-h-[75px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden ${activeTheme.input}`}
                                                        />
                                                    </div>

                                                    <Button 
                                                        type="submit" 
                                                        disabled={rsvpForm.processing}
                                                        className={`w-full py-3 rounded-full font-bold uppercase text-xs tracking-wider transition-all mt-2 ${activeTheme.accent}`}
                                                    >
                                                        {rsvpForm.processing ? 'Submitting response...' : 'Confirm RSVP Invitation'}
                                                    </Button>
                                                </form>
                                            )
                                        ) : (
                                            /* Business Contact Form */
                                            contactSubmitted ? (
                                                <div className="rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-center flex flex-col items-center gap-2">
                                                    <CheckCircle className="size-10 text-emerald-600 dark:text-emerald-400" />
                                                    <h4 className="font-bold text-base">Message Transmitted!</h4>
                                                    <p className="text-xs">We have received your message. Our representative will contact you shortly.</p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                                                    <div className="grid gap-1.5">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Your Name</label>
                                                        <Input 
                                                            value={contactForm.data.name} 
                                                            onChange={(e) => contactForm.setData('name', e.target.value)} 
                                                            required 
                                                            placeholder="John Doe"
                                                            className={activeTheme.input}
                                                        />
                                                        {contactForm.errors.name && <p className="text-xs text-red-500">{contactForm.errors.name}</p>}
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email Address</label>
                                                        <Input 
                                                            type="email" 
                                                            value={contactForm.data.email} 
                                                            onChange={(e) => contactForm.setData('email', e.target.value)} 
                                                            required 
                                                            placeholder="john@example.com"
                                                            className={activeTheme.input}
                                                        />
                                                        {contactForm.errors.email && <p className="text-xs text-red-500">{contactForm.errors.email}</p>}
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Subject</label>
                                                        <Input 
                                                            value={contactForm.data.subject} 
                                                            onChange={(e) => contactForm.setData('subject', e.target.value)} 
                                                            required 
                                                            placeholder="Inquiry / Partnership details"
                                                            className={activeTheme.input}
                                                        />
                                                        {contactForm.errors.subject && <p className="text-xs text-red-500">{contactForm.errors.subject}</p>}
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Write Message</label>
                                                        <textarea 
                                                            value={contactForm.data.message} 
                                                            onChange={(e) => contactForm.setData('message', e.target.value)} 
                                                            required
                                                            placeholder="Write details of your message..."
                                                            className={`flex min-h-[100px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden ${activeTheme.input}`}
                                                        />
                                                        {contactForm.errors.message && <p className="text-xs text-red-500">{contactForm.errors.message}</p>}
                                                    </div>

                                                    <Button 
                                                        type="submit" 
                                                        disabled={contactForm.processing}
                                                        className={`w-full py-3 rounded-full font-bold uppercase text-xs tracking-wider transition-all mt-2 ${activeTheme.accent}`}
                                                    >
                                                        <Send className="size-3.5 inline mr-1" /> {contactForm.processing ? 'Transmitting message...' : 'Transmit Message'}
                                                    </Button>
                                                </form>
                                            )
                                        )}
                                    </div>
                                )}

                            </div>
                        ))
                    )}
                </div>

                {/* Footer Credits */}
                <footer className="mt-24 text-center text-xs opacity-60 flex flex-col gap-1.5">
                    <p className="font-semibold">{website.title} &copy; {new Date().getFullYear()}</p>
                    <p className="flex items-center justify-center gap-1">
                        <Mail className="size-3.5" /> Powered by Invitify
                    </p>
                </footer>

            </div>
        </>
    );
}
