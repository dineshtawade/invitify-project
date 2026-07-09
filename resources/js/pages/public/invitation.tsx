import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Sparkles, MapPin, Calendar, Users, MessageSquare, CheckCircle, Heart, Cake, Baby, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PublicInvitationWebsite {
    id: number;
    title: string;
    slug: string;
    theme: 'cozy' | 'clean' | 'royal' | 'ocean';
    config: {
        event_name: string;
        couple_name: string;
        date: string;
        time: string;
        countdown_target: string;
        venue: string;
        intro: string;
        rsvp_heading: string;
        font_style?: string;
        layout_style?: string;
        image_url?: string;
        text_color?: string;
        border_color?: string;
        image_size?: string;
        image_position?: string;
        icon_type?: string;
        language?: string;
        positions?: any;
    };
}

interface PageProps {
    website: PublicInvitationWebsite;
    flash?: {
        status?: string;
    };
    previewMode?: 'draft' | 'expired' | null;
}

const themePresets = {
    royal: {
        bg: 'from-amber-50 via-orange-50 to-amber-100 text-amber-900',
        accent: 'bg-amber-700 hover:bg-amber-800 text-white shadow-amber-500/10',
        card: 'bg-white/90 border-amber-200/50 shadow-amber-500/5',
        input: 'border-amber-200 focus:ring-amber-500 focus:border-amber-500',
        badge: 'bg-amber-100/80 text-amber-900 border border-amber-200',
        decor: 'text-amber-500',
    },
    cozy: {
        bg: 'from-stone-50 via-rose-50 to-stone-100 text-neutral-800',
        accent: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/10',
        card: 'bg-white/95 border-rose-200/50 shadow-rose-500/5',
        input: 'border-rose-200 focus:ring-rose-500 focus:border-rose-500',
        badge: 'bg-rose-100/80 text-rose-900 border border-rose-200',
        decor: 'text-rose-400',
    },
    ocean: {
        bg: 'from-cyan-50 via-teal-50/50 to-cyan-100 text-cyan-900',
        accent: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/10',
        card: 'bg-white/90 border-teal-200/50 shadow-teal-500/5',
        input: 'border-teal-200 focus:ring-teal-500 focus:border-teal-500',
        badge: 'bg-teal-100/80 text-teal-900 border border-teal-200',
        decor: 'text-teal-500',
    },
    clean: {
        bg: 'from-zinc-50 via-neutral-100 to-zinc-200 text-zinc-900',
        accent: 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950',
        card: 'bg-white border-zinc-200 shadow-zinc-500/5',
        input: 'border-zinc-300 focus:ring-zinc-900 focus:border-zinc-900',
        badge: 'bg-zinc-200 text-zinc-900 border border-zinc-300',
        decor: 'text-zinc-400',
    },
};

export default function PublicInvitationSite({ website, flash, previewMode = null }: PageProps) {
    const fontStyles: Record<string, string> = {
        playfair: "'Playfair Display', serif",
        vibes: "'Great Vibes', cursive",
        montserrat: "'Montserrat', sans-serif",
        cinzel: "'Cinzel', serif",
    };

    const languageDict: Record<string, Record<string, string>> = {
        en: {
            invited: "You are cordially invited to the celebration of",
            save_date: "Save the Date",
            date_time: "Date & Time",
            venue: "Venue Location",
            starts_in: "Event Starts In",
            days: "Days",
            hours: "Hours",
            mins: "Mins",
            secs: "Secs",
        },
        hi: {
            invited: "सप्रेम आमंत्रण - आप सादर आमंत्रित हैं",
            save_date: "शुभ विवाह / मंगल बेला",
            date_time: "तिथि एवं समय",
            venue: "उत्सव स्थल",
            starts_in: "शुभ घड़ी प्रारंभ होने में",
            days: "दिन",
            hours: "घंटे",
            mins: "मिनट",
            secs: "सेकंड",
        },
        mr: {
            invited: "स्नेह निमंत्रण - तुम्हाला आग्रहाचे आमंत्रण",
            save_date: "तारीख लक्षात ठेवा",
            date_time: "दिनांक आणि वेळ",
            venue: "कार्यक्रम स्थळ",
            starts_in: "सुरू होण्यास वेळ",
            days: "दिवस",
            hours: "तास",
            mins: "मिनिटे",
            secs: "सेकंद",
        },
        es: {
            invited: "Estás cordialmente invitado a la celebración de",
            save_date: "Reserva la Fecha",
            date_time: "Fecha y Hora",
            venue: "Lugar del Evento",
            starts_in: "Comienza En",
            days: "Días",
            hours: "Horas",
            mins: "Minutos",
            secs: "Segundos",
        }
    };

    const renderDecorIcon = (iconName: string, color: string = 'currentColor') => {
        switch (iconName) {
            case 'heart':
                return <Heart className="size-8 shrink-0" style={{ color }} />;
            case 'balloon':
                return <Sparkles className="size-8 shrink-0" style={{ color }} />;
            case 'cake':
                return <Cake className="size-8 shrink-0" style={{ color }} />;
            case 'baby':
                return <Baby className="size-8 shrink-0" style={{ color }} />;
            case 'sparkle':
                return <Sparkles className="size-8 shrink-0" style={{ color }} />;
            case 'ring':
            default:
                return <Award className="size-8 shrink-0" style={{ color }} />;
        }
    };

    const { 
        event_name, 
        couple_name, 
        date, 
        time, 
        countdown_target, 
        venue, 
        intro, 
        rsvp_heading,
        font_style = 'playfair',
        layout_style = 'card-classic',
        image_url = '',
        text_color = '#1f2937',
        border_color = '#e4e4e7',
        image_size = 'medium',
        image_position = 'bg',
        icon_type = 'ring',
        language = 'en'
    } = website.config;

    const activeFont = fontStyles[font_style] || fontStyles.playfair;
    const activeTheme = themePresets[website.theme] || themePresets.royal;
    const tLang = languageDict[language] || languageDict.en;

    // Countdown logic
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(countdown_target) - +new Date();
            let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            setTimeLeft(newTimeLeft);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [countdown_target]);

    // RSVP form
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        guests_count: 1,
        status: 'attending' as 'attending' | 'declined',
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/mini-website/${website.slug}/rsvp`, {
            preserveScroll: true,
            onSuccess: () => {
                setFormSubmitted(true);
                reset();
            },
        });
    };

    return (
        <>
            <Head title={`${couple_name} - Invitation`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&display=swap" rel="stylesheet" />
            </Head>
            <div className={`min-h-screen bg-gradient-to-b py-16 px-4 sm:px-6 font-sans selection:bg-neutral-900 selection:text-white transition-colors relative ${activeTheme.bg}`}>
                
                {previewMode && (
                    <div className={`w-full max-w-xl mx-auto mb-6 py-2.5 px-4 text-xs font-bold text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-white rounded-2xl shadow-md ${
                        previewMode === 'draft' ? 'bg-amber-600' : 'bg-rose-600'
                    }`}>
                        <div className="flex items-center gap-1.5 justify-center">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>
                                {previewMode === 'draft' 
                                    ? `Draft Mode Preview` 
                                    : `Hosting Expired Preview`
                                }
                            </span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <Link 
                                href={previewMode === 'draft' 
                                    ? `/customer/mini-websites/${website.id}/edit` 
                                    : `/customer/mini-websites`
                                }
                                className="underline hover:opacity-80 transition-opacity font-bold"
                            >
                                {previewMode === 'draft' ? 'Publish Website' : 'Purchase Hosting'}
                            </Link>
                        </div>
                    </div>
                )}

                <div className="max-w-xl mx-auto flex flex-col gap-10">
                    
                    {/* Visual Card Wrapper */}
                    <div 
                        className={`rounded-3xl border text-center backdrop-blur-md shadow-2xl overflow-hidden flex flex-col justify-between relative transition-all duration-300 border-4 ${activeTheme.card} ${layout_style === 'drag-custom' ? 'aspect-[3/4.2] w-full' : 'min-h-[500px]'}`}
                        style={{ 
                            fontFamily: activeFont,
                            borderColor: border_color || '#e4e4e7',
                            color: text_color || '#1f2937'
                        }}
                    >
                        {layout_style === 'drag-custom' ? (
                            <div className="relative w-full h-full">
                                {(((layout_style as string) === 'photo-bg' || image_position === 'bg') && image_url) && (
                                    <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${image_url})` }} />
                                )}
                                {(((layout_style as string) === 'photo-bg' || image_position === 'bg')) && (
                                    <div className="absolute inset-0 bg-black/30 z-10" />
                                )}
                                
                                {/* Header */}
                                <div 
                                    className="absolute flex flex-col items-center justify-center text-center overflow-hidden"
                                    style={{
                                        left: `${(website.config.positions?.header?.x) ?? 10}%`,
                                        top: `${(website.config.positions?.header?.y) ?? 5}%`,
                                        width: `${(website.config.positions?.header?.w) ?? 80}%`,
                                        height: `${(website.config.positions?.header?.h) ?? 12}%`,
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        {renderDecorIcon(icon_type, border_color)}
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full`} style={{ border: `1px solid ${border_color}`, color: text_color }}>
                                            {event_name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] opacity-75 font-serif mt-1">{tLang.invited}</span>
                                </div>

                                {/* Hosts */}
                                <div 
                                    className="absolute flex items-center justify-center text-center italic text-xs opacity-75 overflow-hidden"
                                    style={{
                                        left: `${(website.config.positions?.hosts?.x) ?? 10}%`,
                                        top: `${(website.config.positions?.hosts?.y) ?? 20}%`,
                                        width: `${(website.config.positions?.hosts?.w) ?? 80}%`,
                                        height: `${(website.config.positions?.hosts?.h) ?? 6}%`,
                                    }}
                                >
                                    {intro || 'Together with their families'}
                                </div>

                                {/* Couple Names */}
                                <div 
                                    className="absolute flex items-center justify-center text-center overflow-hidden"
                                    style={{
                                        left: `${(website.config.positions?.couple?.x) ?? 10}%`,
                                        top: `${(website.config.positions?.couple?.y) ?? 28}%`,
                                        width: `${(website.config.positions?.couple?.w) ?? 80}%`,
                                        height: `${(website.config.positions?.couple?.h) ?? 18}%`,
                                    }}
                                >
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide leading-tight break-words">
                                        {couple_name}
                                    </h1>
                                </div>

                                {/* Date & Time */}
                                <div 
                                    className="absolute flex flex-col items-center justify-center text-center text-xs font-semibold overflow-hidden"
                                    style={{
                                        left: `${(website.config.positions?.datetime?.x) ?? 10}%`,
                                        top: `${(website.config.positions?.datetime?.y) ?? 50}%`,
                                        width: `${(website.config.positions?.datetime?.w) ?? 80}%`,
                                        height: `${(website.config.positions?.datetime?.h) ?? 10}%`,
                                    }}
                                >
                                    <div className="opacity-60 text-[10px]">{tLang.date_time}</div>
                                    <div className="mt-0.5 leading-normal">{date}</div>
                                    <div className="text-[10px] opacity-75">{time}</div>
                                </div>

                                {/* Venue */}
                                <div 
                                    className="absolute flex flex-col items-center justify-center text-center text-xs opacity-80 leading-normal px-2 overflow-hidden"
                                    style={{
                                        left: `${(website.config.positions?.venue?.x) ?? 10}%`,
                                        top: `${(website.config.positions?.venue?.y) ?? 64}%`,
                                        width: `${(website.config.positions?.venue?.w) ?? 80}%`,
                                        height: `${(website.config.positions?.venue?.h) ?? 12}%`,
                                    }}
                                >
                                    <div className="opacity-60 text-[10px]">{tLang.venue}</div>
                                    <p className="mt-0.5 leading-normal line-clamp-2">{venue}</p>
                                </div>

                                {/* Graphic Illustration Image */}
                                <div 
                                    className="absolute bg-neutral-150 dark:bg-neutral-850 overflow-hidden rounded-xl flex items-center justify-center"
                                    style={{
                                        left: `${(website.config.positions?.image?.x) ?? 20}%`,
                                        top: `${(website.config.positions?.image?.y) ?? 78}%`,
                                        width: `${(website.config.positions?.image?.w) ?? 60}%`,
                                        height: `${(website.config.positions?.image?.h) ?? 18}%`,
                                    }}
                                >
                                    {image_url ? (
                                        <img src={image_url} alt="Wedding Couple" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center p-4 bg-neutral-200 dark:bg-neutral-850 text-neutral-400 text-center text-xs">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : layout_style === 'split-hero' || ['left', 'right', 'top', 'bottom'].includes(image_position) ? (
                            <div 
                                className={`grid w-full h-full text-left z-20 relative min-h-[500px] ${
                                    (image_position === 'top' || image_position === 'bottom') ? 'grid-rows-2' : 'md:grid-cols-2'
                                }`}
                            >
                                {/* Left Content */}
                                <div 
                                    className="p-8 sm:p-12 flex flex-col justify-between bg-white/95 dark:bg-neutral-900/95"
                                    style={{ color: text_color || '#1f2937' }}
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            {renderDecorIcon(icon_type, border_color)}
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full`} style={{ border: `1px solid ${border_color}`, color: text_color }}>
                                                {event_name}
                                            </span>
                                        </div>
                                        <span className="text-xs opacity-75 font-serif">{tLang.invited}</span>
                                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide leading-tight break-words py-1">
                                            {couple_name}
                                        </h1>
                                        <p className="text-xs opacity-80 leading-relaxed font-medium">
                                            "{intro}"
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-4 border-t pt-4 mt-6" style={{ borderColor: `${border_color}30` }}>
                                        <div className="grid gap-3 text-xs font-semibold">
                                            <div className="flex items-start gap-2.5">
                                                <Calendar className="size-4.5 mt-0.5 text-neutral-400 shrink-0" />
                                                <div>
                                                    <div className="opacity-60 text-[10px]">{tLang.date_time}</div>
                                                    <div className="mt-0.5 leading-normal">{date}</div>
                                                    <div className="text-[10px] opacity-75">{time}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <MapPin className="size-4.5 mt-0.5 text-neutral-400 shrink-0" />
                                                <div>
                                                    <div className="opacity-60 text-[10px]">{tLang.venue}</div>
                                                    <div className="mt-0.5 leading-normal">{venue}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Countdown inside Left Side */}
                                        <div className="flex flex-col gap-1.5 mt-2">
                                            <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">{tLang.starts_in}</div>
                                            <div className="flex gap-2.5 text-center text-neutral-900 dark:text-neutral-100">
                                                <div className="p-2 bg-neutral-100 dark:bg-neutral-850 rounded-xl w-12">
                                                    <div className="text-sm font-bold">{timeLeft.days}</div>
                                                    <div className="text-[8px] uppercase opacity-70">{tLang.days}</div>
                                                </div>
                                                <div className="p-2 bg-neutral-100 dark:bg-neutral-850 rounded-xl w-12">
                                                    <div className="text-sm font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                                                    <div className="text-[8px] uppercase opacity-70">{tLang.hours}</div>
                                                </div>
                                                <div className="p-2 bg-neutral-100 dark:bg-neutral-850 rounded-xl w-12">
                                                    <div className="text-sm font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                                    <div className="text-[8px] uppercase opacity-70">{tLang.mins}</div>
                                                </div>
                                                <div className="p-2 bg-neutral-100 dark:bg-neutral-850 rounded-xl w-12">
                                                    <div className="text-sm font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                                    <div className="text-[8px] uppercase opacity-70">{tLang.secs}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Image */}
                                <div 
                                    className={`relative bg-neutral-150 dark:bg-neutral-850 overflow-hidden shrink-0 flex items-center justify-center ${
                                        image_size === 'small' ? 'w-1/4 h-1/4 max-md:w-full max-md:h-[120px]' :
                                        image_size === 'large' ? 'w-2/3 h-2/3 max-md:w-full max-md:h-[220px]' : 'w-full h-full'
                                    }`}
                                    style={{
                                        order: (image_position === 'left' || image_position === 'top') ? -1 : 1
                                    }}
                                >
                                    {image_url ? (
                                        <img src={image_url} alt="Wedding Couple" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center p-8 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 font-semibold text-center text-sm">
                                            Celebration Invitation
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : layout_style === 'minimalist-arch' ? (
                            <div className="w-full h-full p-6 sm:p-8 z-20 relative">
                                <div 
                                    className="w-full h-full border-2 border-dashed rounded-t-[160px] p-8 sm:p-12 flex flex-col gap-8 items-center justify-between"
                                    style={{ borderColor: `${border_color}60` || 'rgba(0,0,0,0.15)' }}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        {renderDecorIcon(icon_type, border_color)}
                                        <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-1`} style={{ border: `1px solid ${border_color}`, color: text_color }}>
                                            {event_name}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <span className="text-xs italic opacity-70">{tLang.invited}</span>
                                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide leading-tight break-words py-2">
                                            {couple_name}
                                        </h1>
                                        <p className="max-w-md mx-auto text-sm opacity-80 leading-relaxed font-medium">
                                            "{intro}"
                                        </p>
                                    </div>

                                    <div className="relative flex py-2 items-center w-full max-w-xs">
                                        <div className="flex-grow border-t" style={{ borderColor: `${border_color}20` }}></div>
                                        <span className="flex-shrink mx-4 text-xs italic opacity-50">{tLang.save_date}</span>
                                        <div className="flex-grow border-t" style={{ borderColor: `${border_color}20` }}></div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 text-left text-sm font-semibold w-full">
                                        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 flex items-start gap-3">
                                            <Calendar className="size-5 mt-0.5 text-neutral-500 shrink-0" />
                                            <div>
                                                <div className="opacity-60 text-xs">{tLang.date_time}</div>
                                                <div className="mt-1 leading-normal">{date}</div>
                                                <div className="text-xs opacity-75">{time}</div>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 flex items-start gap-3">
                                            <MapPin className="size-5 mt-0.5 text-neutral-500 shrink-0" />
                                            <div>
                                                <div className="opacity-60 text-xs">{tLang.venue}</div>
                                                <div className="mt-1 leading-normal">{venue}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="text-xs uppercase tracking-widest font-bold opacity-60">{tLang.starts_in}</div>
                                        <div className="flex justify-center gap-4 text-center mt-1">
                                            <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl w-16">
                                                <div className="text-xl sm:text-2xl font-black tracking-tight">{timeLeft.days}</div>
                                                <div className="text-[9px] uppercase font-semibold opacity-70">{tLang.days}</div>
                                            </div>
                                            <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl w-16">
                                                <div className="text-xl sm:text-2xl font-black tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</div>
                                                <div className="text-[9px] uppercase font-semibold opacity-70">{tLang.hours}</div>
                                            </div>
                                            <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl w-16">
                                                <div className="text-xl sm:text-2xl font-black tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                                <div className="text-[9px] uppercase font-semibold opacity-70">{tLang.mins}</div>
                                            </div>
                                            <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl w-16">
                                                <div className="text-xl sm:text-2xl font-black tracking-tight">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                                <div className="text-[9px] uppercase font-semibold opacity-70">{tLang.secs}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : layout_style === 'photo-bg' ? (
                            <div className="w-full h-full p-8 sm:p-12 flex flex-col gap-8 text-white relative z-20 min-h-[500px] justify-between">
                                <div className="flex flex-col items-center gap-2">
                                    {renderDecorIcon(icon_type, '#ffffff')}
                                    <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-xs mt-1">
                                        {event_name}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <span className="text-xs italic opacity-85 font-serif text-neutral-100">{tLang.invited}</span>
                                    <h1 className="text-4xl sm:text-5xl font-black tracking-wide leading-tight break-words py-2 drop-shadow-md">
                                        {couple_name}
                                    </h1>
                                    <p className="max-w-md mx-auto text-sm opacity-90 leading-relaxed font-semibold drop-shadow-sm text-neutral-100">
                                        "{intro}"
                                    </p>
                                </div>

                                <div className="relative flex py-2 items-center w-full max-w-xs mx-auto">
                                    <div className="flex-grow border-t border-white/20"></div>
                                    <span className="flex-shrink mx-4 text-xs italic opacity-75">{tLang.save_date}</span>
                                    <div className="flex-grow border-t border-white/20"></div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 text-left text-sm font-semibold w-full">
                                    <div className="p-4 rounded-2xl bg-black/35 border border-white/10 flex items-start gap-3">
                                        <Calendar className="size-5 mt-0.5 text-neutral-200 shrink-0" />
                                        <div>
                                            <div className="opacity-75 text-xs">{tLang.date_time}</div>
                                            <div className="mt-1 leading-normal text-white">{date}</div>
                                            <div className="text-xs opacity-85 text-neutral-100">{time}</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-black/35 border border-white/10 flex items-start gap-3">
                                        <MapPin className="size-5 mt-0.5 text-neutral-200 shrink-0" />
                                        <div>
                                            <div className="opacity-75 text-xs">{tLang.venue}</div>
                                            <div className="mt-1 leading-normal text-white">{venue}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="text-xs uppercase tracking-widest font-bold opacity-75">{tLang.starts_in}</div>
                                    <div className="flex justify-center gap-4 text-center mt-1">
                                        <div className="p-3 bg-black/35 border border-white/10 rounded-2xl w-16">
                                            <div className="text-xl sm:text-2xl font-black tracking-tight text-white">{timeLeft.days}</div>
                                            <div className="text-[9px] uppercase font-semibold opacity-75">{tLang.days}</div>
                                        </div>
                                        <div className="p-3 bg-black/35 border border-white/10 rounded-2xl w-16">
                                            <div className="text-xl sm:text-2xl font-black tracking-tight text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                                            <div className="text-[9px] uppercase font-semibold opacity-75">{tLang.hours}</div>
                                        </div>
                                        <div className="p-3 bg-black/35 border border-white/10 rounded-2xl w-16">
                                            <div className="text-xl sm:text-2xl font-black tracking-tight text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                            <div className="text-[9px] uppercase font-semibold opacity-75">{tLang.mins}</div>
                                        </div>
                                        <div className="p-3 bg-black/35 border border-white/10 rounded-2xl w-16">
                                            <div className="text-xl sm:text-2xl font-black tracking-tight text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                            <div className="text-[9px] uppercase font-semibold opacity-75">{tLang.secs}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Classic Card */
                            <div className="p-8 sm:p-12 flex flex-col gap-8 relative z-20">
                                <div className="flex flex-col items-center gap-2">
                                    {renderDecorIcon(icon_type, border_color)}
                                    <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-1`} style={{ border: `1px solid ${border_color}`, color: text_color }}>
                                        {event_name}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <span className="text-sm italic font-serif opacity-70">{tLang.invited}</span>
                                    <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-wide leading-tight break-words py-2 px-1">
                                        {couple_name}
                                    </h1>
                                    <p className="max-w-md mx-auto text-sm opacity-80 leading-relaxed font-medium">
                                        "{intro}"
                                    </p>
                                </div>

                                <div className="relative flex py-4 items-center">
                                    <div className="flex-grow border-t" style={{ borderColor: `${border_color}20` }}></div>
                                    <span className="flex-shrink mx-4 text-xs italic font-serif opacity-50">{tLang.save_date}</span>
                                    <div className="flex-grow border-t" style={{ borderColor: `${border_color}20` }}></div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 text-left text-sm font-semibold">
                                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 flex items-start gap-3">
                                        <Calendar className="size-5 mt-0.5 text-neutral-500 shrink-0" />
                                        <div>
                                            <div className="opacity-60 text-xs">{tLang.date_time}</div>
                                            <div className="mt-1 leading-normal">{date}</div>
                                            <div className="text-xs opacity-75">{time}</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 flex items-start gap-3">
                                        <MapPin className="size-5 mt-0.5 text-neutral-500 shrink-0" />
                                        <div>
                                            <div className="opacity-60 text-xs">{tLang.venue}</div>
                                            <div className="mt-1 leading-normal">{venue}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="text-xs uppercase tracking-widest font-bold opacity-60">{tLang.starts_in}</div>
                                    <div className="flex justify-center gap-4 text-center mt-1">
                                        <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl w-16">
                                            <div className="text-xl sm:text-2xl font-black tracking-tight">{timeLeft.days}</div>
                                            <div className="text-[9px] uppercase font-semibold opacity-70">{tLang.days}</div>
                                        </div>
                                        <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl w-16">
                                            <div className="text-xl sm:text-2xl font-black tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</div>
                                            <div className="text-[9px] uppercase font-semibold opacity-70">{tLang.hours}</div>
                                        </div>
                                        <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl w-16">
                                            <div className="text-xl sm:text-2xl font-black tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                            <div className="text-[9px] uppercase font-semibold opacity-70">{tLang.mins}</div>
                                        </div>
                                        <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl w-16">
                                            <div className="text-xl sm:text-2xl font-black tracking-tight">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                            <div className="text-[9px] uppercase font-semibold opacity-70">{tLang.secs}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RSVP Response Form Panel */}
                    <div className={`rounded-3xl border p-8 sm:p-10 shadow-xl backdrop-blur-md ${activeTheme.card}`}>
                        <div className="text-center mb-6 flex flex-col gap-1.5">
                            <h3 className="font-serif text-2xl font-bold">{rsvp_heading}</h3>
                            <p className="text-xs opacity-75">Let us know if you can attend our event. Please fill out details below.</p>
                        </div>

                        {formSubmitted ? (
                            <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-center flex flex-col items-center gap-3">
                                <CheckCircle className="size-10 text-emerald-600" />
                                <div>
                                    <h4 className="font-bold text-sm">Response Sent!</h4>
                                    <p className="text-xs mt-1 leading-normal">Thank you for submitting your RSVP details. Your host has been updated.</p>
                                </div>
                                <Button
                                    onClick={() => setFormSubmitted(false)}
                                    variant="outline"
                                    size="sm"
                                    className="border-emerald-200 text-emerald-800 bg-white mt-2 hover:bg-emerald-50 text-xs font-semibold"
                                >
                                    Submit Another RSVP
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="E.g., Priya Sharma"
                                        required
                                        className={activeTheme.input}
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="E.g., priya@example.com"
                                        required
                                        className={activeTheme.input}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="status">Attending Status</Label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('status', e.target.value as any)}
                                            className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-neutral-950 ${activeTheme.input}`}
                                        >
                                            <option value="attending">Joyfully Attend</option>
                                            <option value="declined">Regretfully Decline</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="guests">Number of Guests</Label>
                                        <select
                                            id="guests"
                                            value={data.guests_count}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('guests_count', parseInt(e.target.value))}
                                            disabled={data.status === 'declined'}
                                            className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-neutral-950 ${activeTheme.input}`}
                                        >
                                            <option value={1}>1 Guest</option>
                                            <option value={2}>2 Guests</option>
                                            <option value={3}>3 Guests</option>
                                            <option value={4}>4 Guests</option>
                                            <option value={5}>5 Guests</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="message">Congratulatory Message / Greeting</Label>
                                    <textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="E.g., Congratulations! We are excited to celebrate with you guys."
                                        className={`flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-neutral-400 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-neutral-950 ${activeTheme.input}`}
                                    />
                                    {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full py-6 mt-2 rounded-xl text-sm font-bold transition-all ${activeTheme.accent}`}
                                >
                                    {processing ? 'Submitting...' : 'Send RSVP Details'}
                                </Button>
                            </form>
                        )}
                    </div>

                    <div className="text-center text-xs text-neutral-400 font-semibold flex items-center justify-center gap-1.5">
                        <Mail className="size-4" /> Powered by Invitify
                    </div>
                </div>
            </div>
        </>
    );
}
