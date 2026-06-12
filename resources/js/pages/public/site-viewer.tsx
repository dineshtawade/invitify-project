import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Mail, Sparkles, MapPin, Compass, Play, 
    ChevronLeft, ChevronRight, Globe, CheckCircle, AlertCircle, 
    Instagram, Phone, Calendar, Clock, Heart, Star, Send, HelpCircle
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
    previewMode?: 'draft' | 'expired' | null;
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

// Countdown Timer Component
const CountdownTimer = ({ targetDate }: { targetDate?: string }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const calculate = () => {
            const diff = +new Date(targetDate) - +new Date();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            });
        };
        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex gap-4 justify-center items-center mt-4 text-white">
            <div className="flex flex-col items-center bg-black/60 backdrop-blur-xs rounded-xl p-3 min-w-[64px] shadow-md">
                <span className="font-mono text-xl sm:text-2xl font-black">{timeLeft.days}</span>
                <span className="text-[8px] uppercase font-bold tracking-wider opacity-70">Days</span>
            </div>
            <div className="flex flex-col items-center bg-black/60 backdrop-blur-xs rounded-xl p-3 min-w-[64px] shadow-md">
                <span className="font-mono text-xl sm:text-2xl font-black">{timeLeft.hours}</span>
                <span className="text-[8px] uppercase font-bold tracking-wider opacity-70">Hrs</span>
            </div>
            <div className="flex flex-col items-center bg-black/60 backdrop-blur-xs rounded-xl p-3 min-w-[64px] shadow-md">
                <span className="font-mono text-xl sm:text-2xl font-black">{timeLeft.minutes}</span>
                <span className="text-[8px] uppercase font-bold tracking-wider opacity-70">Mins</span>
            </div>
            <div className="flex flex-col items-center bg-black/60 backdrop-blur-xs rounded-xl p-3 min-w-[64px] shadow-md">
                <span className="font-mono text-xl sm:text-2xl font-black">{timeLeft.seconds}</span>
                <span className="text-[8px] uppercase font-bold tracking-wider opacity-70">Secs</span>
            </div>
        </div>
    );
};

export default function PublicSiteViewer({ website, previewMode = null }: PageProps) {
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
        rsvpForm.post(`/mini-website/${website.slug}/rsvp`, {
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
        contactForm.post(`/mini-website/${website.slug}/contact`, {
            preserveScroll: true,
            onSuccess: () => {
                setContactSubmitted(true);
                contactForm.reset();
            }
        });
    };

    // Advanced block styling functions matching DevicePreview
    const getBlockStyle = (block: any) => {
        const style: React.CSSProperties = {};
        if (block.font_family) style.fontFamily = block.font_family;
        if (block.font_color) style.color = block.font_color;
        
        if (block.bg_color) {
            const bg = block.bg_color.trim();
            if (bg.startsWith('linear-gradient') || bg.startsWith('#') || bg.startsWith('rgb')) {
                style.background = bg;
            }
        }
        return style;
    };

    const getBgClass = (block: any, defaultVal = '') => {
        if (!block.bg_color) return defaultVal;
        const bg = block.bg_color.trim();
        if (bg.startsWith('linear-gradient') || bg.startsWith('#') || bg.startsWith('rgb')) {
            return ''; // Inline custom style applied
        }
        return bg;
    };

    const getSpacingClass = (block: any) => {
        const pad = block.padding_y || 'py-8';
        const mar = block.margin_y || 'my-0';
        return `${pad} ${mar}`;
    };

    const getTextStyleClass = (block: any) => {
        const size = block.font_size || '';
        const weight = block.font_weight === 'bold' ? 'font-bold' : block.font_weight === 'light' ? 'font-light' : 'font-normal';
        const italic = block.font_style === 'italic' ? 'italic' : 'not-italic';
        return `${size} ${weight} ${italic}`;
    };

    return (
        <>
            <Head>
                <title>{website.title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* 10 Google fonts dynamic link integration */}
                <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&family=Dancing+Script:wght@400..700&family=Alex+Brush&family=Parisienne&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </Head>

            <div className={`min-h-screen bg-gradient-to-b pb-20 font-sans transition-all selection:bg-neutral-900 selection:text-white relative ${activeTheme.bg}`}>
                
                {previewMode && (
                    <div className={`w-full py-2.5 px-4 text-xs font-bold text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-white sticky top-0 z-[100] shadow-md ${
                        previewMode === 'draft' ? 'bg-amber-600' : 'bg-rose-600'
                    }`}>
                        <div className="flex items-center gap-1.5 justify-center">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>
                                {previewMode === 'draft' 
                                    ? `This is a preview. Your site is currently in Draft mode.` 
                                    : `This is a preview. Your hosting subscription has expired.`
                                }
                            </span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <Link 
                                href={previewMode === 'draft' 
                                    ? `/customer/mini-websites/${website.id}/edit` 
                                    : `/customer/mini-websites`
                                }
                                className="underline hover:opacity-80 transition-opacity"
                            >
                                {previewMode === 'draft' ? 'Go to Editor to Publish' : 'Renew Hosting Plan'}
                            </Link>
                        </div>
                    </div>
                )}

                {/* Site Header Navigation */}
                <header className={`sticky ${previewMode ? 'top-9.5' : 'top-0'} z-50 border-b backdrop-blur-md px-6 py-4 flex items-center justify-between transition-all ${activeTheme.nav}`}>
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
                        blocks.map((block) => {
                            if (block.is_hidden) return null;

                            return (
                                <div key={block.id} id={block.id} className="scroll-mt-20">
                                    
                                    {/* 1. Hero Block */}
                                    {block.type === 'hero' && (
                                        <div 
                                            className={`rounded-3xl p-10 sm:p-14 text-center bg-gradient-to-tr ${getBgClass(block, 'from-indigo-650 to-purple-600')} text-white shadow-xl flex flex-col gap-6 items-center justify-center min-h-[360px] ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
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
                                            className={`rounded-3xl p-8 sm:p-12 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-4 ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={{ ...getBlockStyle(block), textAlign: (block.align || 'center') as any }}
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
                                        <div 
                                            className={`rounded-3xl p-6 sm:p-10 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-6 ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
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
                                                                        className="absolute left-4 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer border-0"
                                                                    >
                                                                        <ChevronLeft className="size-5" />
                                                                    </button>
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => nextSlide(block.id, block.images.length)}
                                                                        className="absolute right-4 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer border-0"
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
                                        <div 
                                            className={`rounded-3xl p-6 sm:p-10 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-6 ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
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
                                        <div 
                                            className={`rounded-3xl p-8 sm:p-10 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-6 items-center ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
                                            {block.title && (
                                                <h2 className="text-xl font-bold font-serif tracking-tight text-center">{block.title}</h2>
                                            )}
                                            <div className={`grid gap-3 w-full max-w-sm ${block.grid_columns ? `grid-cols-${block.grid_columns}` : 'grid-cols-1'}`}>
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
                                        <div 
                                            className={`rounded-3xl p-8 sm:p-12 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-8 ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
                                            {block.title && (
                                                <h2 className="text-2xl font-bold text-center font-serif tracking-tight">{block.title}</h2>
                                            )}
                                            <div className={`grid gap-6 ${block.grid_columns ? `grid-cols-${block.grid_columns}` : 'grid-cols-2'}`}>
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
                                        <div 
                                            className={`rounded-3xl p-8 sm:p-12 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-8 ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
                                            <h2 className="text-2xl font-bold font-serif tracking-tight text-center">{block.title || 'RSVP Response'}</h2>
                                            
                                            {block.form_type === 'rsvp' ? (
                                                /* RSVP Event Form */
                                                rsvpSubmitted ? (
                                                    <div className="rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-center flex flex-col items-center gap-2 animate-fadeIn">
                                                        <CheckCircle className="size-10 text-emerald-600 dark:text-emerald-400" />
                                                        <h4 className="font-bold text-base">RSVP Submitted!</h4>
                                                        <p className="text-xs">Thank you for letting us know your status. Your response is recorded.</p>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4 text-left">
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
                                                    <div className="rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-center flex flex-col items-center gap-2 animate-fadeIn">
                                                        <CheckCircle className="size-10 text-emerald-600 dark:text-emerald-400" />
                                                        <h4 className="font-bold text-base">Message Transmitted!</h4>
                                                        <p className="text-xs">We have received your message. Our representative will contact you shortly.</p>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-left">
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

                                    {/* 8. FAQ Block */}
                                    {block.type === 'faq' && (
                                        <div 
                                            className={`rounded-3xl p-8 sm:p-12 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-6 ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
                                            {block.title && (
                                                <h2 className="text-2xl font-bold font-serif tracking-tight text-center">{block.title}</h2>
                                            )}
                                            <div className="flex flex-col gap-4 text-left">
                                                {block.items?.map((item: any, i: number) => (
                                                    <div key={i} className="border rounded-2xl p-4 bg-white/40 dark:bg-black/5 border-black/5 dark:border-white/5">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-neutral-800">
                                                            <HelpCircle className="size-4 text-amber-500 shrink-0" />
                                                            {item.question}
                                                        </div>
                                                        <p className="text-xs text-neutral-500 mt-2 ml-6 leading-relaxed">{item.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 9. Testimonials Block */}
                                    {block.type === 'testimonials' && (
                                        <div 
                                            className={`rounded-3xl p-8 sm:p-12 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-6 ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
                                            {block.title && (
                                                <h2 className="text-2xl font-bold font-serif tracking-tight text-center">{block.title}</h2>
                                            )}
                                            <div className="flex flex-col gap-4 text-left">
                                                {block.items?.map((item: any, i: number) => (
                                                    <div key={i} className="border rounded-2xl p-5 bg-white/40 dark:bg-black/5 border-black/5 dark:border-white/5 flex flex-col gap-2">
                                                        <div className="flex gap-0.5">
                                                            {Array.from({ length: Number(item.rating) || 5 }).map((_, s) => (
                                                                <Star key={s} className="size-3.5 text-amber-400 fill-amber-400" />
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-neutral-600 italic leading-relaxed">"{item.quote}"</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                                {item.name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-neutral-800">{item.name}</div>
                                                                <div className="text-[10px] text-neutral-400">{item.role}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 10. Countdown Block */}
                                    {block.type === 'countdown' && (
                                        <div 
                                            className={`rounded-3xl p-10 sm:p-14 text-center bg-gradient-to-tr ${getBgClass(block, 'from-neutral-900 to-neutral-800')} text-white shadow-xl flex flex-col gap-4 items-center justify-center min-h-[180px] ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
                                            <h3 className="text-sm font-bold uppercase tracking-wider">{block.title || 'Event Begins In'}</h3>
                                            <CountdownTimer targetDate={block.event_date} />
                                        </div>
                                    )}

                                    {/* 11. Map Block */}
                                    {block.type === 'map' && (
                                        <div 
                                            className={`rounded-3xl p-6 sm:p-10 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-6 items-center ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
                                            {block.title && (
                                                <h2 className="text-xl font-bold text-center font-serif tracking-tight uppercase tracking-widest w-full">{block.title}</h2>
                                            )}
                                            {block.map_embed_url ? (
                                                <div className="w-full aspect-video rounded-2xl overflow-hidden border bg-neutral-100 shadow-sm">
                                                    <iframe 
                                                        src={block.map_embed_url} 
                                                        className="w-full h-full border-0" 
                                                        title="Embedded Map" 
                                                        allowFullScreen
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full p-8 border border-dashed rounded-2xl flex flex-col items-center justify-center text-neutral-450 gap-2 text-xs">
                                                    <MapPin className="size-6 text-neutral-300" />
                                                    <span>Google Map iframe preview placeholder</span>
                                                </div>
                                            )}
                                            {block.map_link && (
                                                <a 
                                                    href={block.map_link} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="mt-2 px-6 py-2.5 bg-neutral-950 text-white rounded-full font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform"
                                                >
                                                    <MapPin className="size-4" /> Open Maps Location
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* 12. Timeline Block */}
                                    {block.type === 'timeline' && (
                                        <div 
                                            className={`rounded-3xl p-8 sm:p-12 shadow-sm ${getBgClass(block, activeTheme.card)} flex flex-col gap-8 ${getSpacingClass(block)} ${getTextStyleClass(block)}`}
                                            style={getBlockStyle(block)}
                                        >
                                            {block.title && (
                                                <h2 className="text-2xl font-bold text-center font-serif tracking-tight uppercase tracking-wider">{block.title}</h2>
                                            )}
                                            <div className="relative pl-8 border-l-2 border-neutral-200 dark:border-neutral-750 flex flex-col gap-6 max-w-md mx-auto w-full text-left">
                                                {block.items?.map((item: any, i: number) => (
                                                    <div key={i} className="relative flex flex-col gap-1.5">
                                                        <div className="absolute -left-[38px] top-1 size-4 rounded-full border-2 border-indigo-500 bg-white dark:bg-neutral-900 flex items-center justify-center">
                                                            <div className="size-1.5 rounded-full bg-indigo-500" />
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md dark:bg-indigo-950/40 dark:text-indigo-400">
                                                                {item.time}
                                                            </span>
                                                            <h4 className="text-sm font-bold text-neutral-900">{item.title}</h4>
                                                        </div>
                                                        <p className="text-xs text-neutral-500 leading-relaxed pl-1">{item.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            );
                        })
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
