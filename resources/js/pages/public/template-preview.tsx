import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { 
    Heart, Sparkles, Cake, Baby, Award, 
    ChevronLeft, ChevronRight, PlayCircle,
    ArrowLeft, Eye, ShieldCheck, Flame, Smartphone, Laptop,
    MapPin, ExternalLink, Calendar, Clock, Music, Wine, Bell, Smile, Gift
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { normalizeConfig, ASPECT_RATIOS, ElementConfig, PageConfig, InvitationConfig } from '@/utils/builder-utils';
import VideoTemplateBuilder from '@/components/VideoTemplateBuilder';
import { getFontFamilyCss, loadGoogleFont } from '@/utils/font-utils';
import AppLogoIcon from '@/components/app-logo-icon';

interface Template {
    id: number;
    name: string;
    type: string;
    category: string;
    price: number | string;
    bg_gradient: string;
    encrypted_id: string;
    is_trending?: boolean;
    default_config: any;
}

interface PageProps {
    template: Template;
    userTemplate: {
        id: number;
        custom_config: any;
        video_path?: string | null;
        template: any;
    };
    customizeUrl: string;
}

// developed by dinesh tawade
export default function TemplatePublicPreview({ template, userTemplate, customizeUrl }: PageProps) {
    const isVideo = template.type === 'video';
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState(380);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const config: InvitationConfig = normalizeConfig(userTemplate.custom_config, template.bg_gradient);

    // Track card dimensions dynamically for font scaling
    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                setCardWidth(entries[0].contentRect.width);
            }
        });
        observer.observe(cardRef.current);
        setCardWidth(cardRef.current.clientWidth);
        return () => observer.disconnect();
    }, [currentPageIndex]);

    // Preload Google Fonts used across all pages of the template
    useEffect(() => {
        if (!config?.pages) return;
        config.pages.forEach((p: PageConfig) => {
            p.elements?.forEach((elem: ElementConfig) => {
                if (elem.type === 'text' && elem.fontStyle) {
                    loadGoogleFont(elem.fontStyle);
                }
            });
        });
    }, [config]);

    const activePage: PageConfig | null = config.pages ? (config.pages[currentPageIndex] || config.pages[0]) : null;
    const totalPages = config.pages ? config.pages.length : 1;
    const ratioData = ASPECT_RATIOS[config.aspectRatio] || ASPECT_RATIOS.standard;

    const targetWidth = config.aspectRatio === 'custom' 
        ? (config.width || 350) 
        : (ratioData.targetWidth || 350);

    const scaleRatio = cardWidth / targetWidth;

    const renderDecorIcon = (iconName?: string, color: string = 'currentColor') => {
        const safeName = (iconName || 'ring').trim().toLowerCase();
        const iconClasses = "size-full object-contain pointer-events-none";
        const legacyMap: Record<string, any> = {
            'heart': Heart, 'sparkle': Sparkles, 'sparkles': Sparkles,
            'cake': Cake, 'baby': Baby, 'gift': Gift, 'ring': Award,
            'bell': Bell, 'wine': Wine, 'music': Music, 'clock': Clock,
            'calendar': Calendar, 'smile': Smile
        };

        if (legacyMap[safeName]) {
            const LegacyIcon = legacyMap[safeName];
            return <LegacyIcon className={iconClasses} style={{ color }} />;
        }

        const normalizedName = safeName.charAt(0).toUpperCase() + safeName.slice(1);
        const IconComponent = (LucideIcons as any)[normalizedName] || (LucideIcons as any)[safeName] || Award;
        return <IconComponent className={iconClasses} style={{ color }} />;
    };

    return (
        <>
            <Head>
                <title>{`${template.name} - Live Preview | Invitify`}</title>
                <meta name="description" content={`Preview ${template.name} on Invitify. Customize text, photos, and music, then buy with instant download.`} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&family=Dancing+Script:wght@400..700&family=Alex+Brush&family=Outfit:wght@100..900&family=Parisienne&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,300..900;1,300..900&family=Poppins:ital,wght@0,100..900;1,100..900&family=Pacifico&family=Sacramento&display=swap" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-[#111315] text-[#f2efe9] flex flex-col justify-between selection:bg-[#3d5644] selection:text-white">
                
                {/* Top Floating Header Bar */}
                <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#181b1e]/90 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-3">
                        <a 
                            href="/" 
                            className="size-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all text-white/80 hover:text-white group"
                            title="Back to Home"
                        >
                            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                        </a>
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="size-6 text-[#ebd9c1]" />
                            <div className="hidden sm:flex flex-col">
                                <span className="font-serif font-black text-sm tracking-wide text-white">Invitify</span>
                                <span className="text-[10px] text-white/50 -mt-1 font-sans">Live Template Preview</span>
                            </div>
                        </div>
                        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-serif font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-xs">
                                    {template.name}
                                </h1>
                                {Boolean(template.is_trending) && (
                                    <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                                        <Flame className="size-2.5 fill-white" /> Trending
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-white/60 font-sans hidden sm:block">
                                {isVideo ? 'High-Definition Video Invitation' : `Digital Invitation Card • ${template.category}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <span className="text-[10px] uppercase font-bold text-white/50 block">Pricing</span>
                            <span className="font-serif font-extrabold text-base text-emerald-400">
                                {template.price && Number(template.price) > 0 ? `₹${Number(template.price).toFixed(2)}` : 'Free to Customize'}
                            </span>
                        </div>
                        <a
                            href={customizeUrl}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3d5644] to-[#2c3e2e] hover:from-[#476550] hover:to-[#354b38] text-white text-xs sm:text-sm font-bold font-serif shadow-lg hover:shadow-emerald-900/40 hover:scale-105 transition-all flex items-center gap-2 border border-emerald-400/20 active:scale-95"
                        >
                            <Sparkles className="size-4 text-yellow-300 animate-pulse" />
                            <span>Customize & Buy</span>
                        </a>
                    </div>
                </header>

                {/* Main Preview Stage */}
                <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
                    
                    {/* Atmospheric Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#3d5644]/15 rounded-full blur-[140px] pointer-events-none" />

                    {isVideo ? (
                        /* VIDEO TEMPLATE PREVIEW */
                        <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center gap-4 z-10">
                            <div className="relative w-full aspect-[9/16] rounded-[32px] overflow-hidden bg-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 border-neutral-800 flex items-center justify-center">
                                {template.default_config?.video_url ? (
                                    <video
                                        src={template.default_config.video_url}
                                        controls
                                        autoPlay
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <VideoTemplateBuilder 
                                        data={{ default_config: userTemplate.custom_config || template.default_config }} 
                                        isPreviewOnly={true} 
                                    />
                                )}
                            </div>
                            <p className="text-xs text-white/50 text-center flex items-center gap-1.5">
                                <ShieldCheck className="size-3.5 text-emerald-400" />
                                High-Definition 1080p Video • Instant MP4 Export
                            </p>
                        </div>
                    ) : (
                        /* IMAGE INVITATION CARD PREVIEW */
                        <div className="relative w-full max-w-md flex flex-col items-center gap-4 z-10">
                            
                            {/* Multi-page indicator */}
                            {totalPages > 1 && (
                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-serif font-bold">
                                    <button 
                                        onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentPageIndex === 0}
                                        className="p-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <span>Page {currentPageIndex + 1} of {totalPages}</span>
                                    <button 
                                        onClick={() => setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPageIndex === totalPages - 1}
                                        className="p-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            )}

                            {/* Card Canvas - 100% Identical to Editor and Public View */}
                            <div
                                ref={cardRef}
                                style={{
                                    aspectRatio: config.aspectRatio === 'custom' 
                                        ? `${config.width || 350}/${config.height || 490}` 
                                        : undefined,
                                    height: config.aspectRatio !== 'custom' ? undefined : 'auto',
                                    background: activePage?.bg_gradient?.startsWith('linear-gradient') 
                                        ? activePage.bg_gradient 
                                        : undefined,
                                }}
                                className={`w-full ${config.aspectRatio !== 'custom' ? ratioData.class : ''} rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden select-none border border-white/15 transition-all duration-500 ${!activePage?.bg_gradient?.startsWith('linear-gradient') ? `bg-gradient-to-tr ${activePage?.bg_gradient || template.bg_gradient || 'from-stone-100 to-rose-50 text-neutral-800'}` : ''}`}
                            >
                                {/* Decorative border overlays */}
                                {activePage?.borderStyle && activePage.borderStyle !== 'none' && (
                                    <div 
                                        className="absolute pointer-events-none rounded-2xl"
                                        style={{
                                            top: '12px',
                                            left: '12px',
                                            right: '12px',
                                            bottom: '12px',
                                            borderStyle: activePage.borderStyle === 'floral' || activePage.borderStyle === 'classic' ? 'double' : activePage.borderStyle,
                                            borderColor: activePage.borderColor || '#e4e4e7',
                                            borderWidth: `${Math.max(1, (activePage.borderWidth || 1) * scaleRatio)}px`,
                                            zIndex: 10,
                                        }}
                                    >
                                        {(activePage.borderStyle === 'floral' || activePage.borderStyle === 'classic') && (
                                            <>
                                                <div 
                                                    className="absolute size-5 border-t border-l"
                                                    style={{
                                                        top: '-1px',
                                                        left: '-1px',
                                                        borderColor: activePage.borderColor || '#d4af37',
                                                        borderTopWidth: `${2 * scaleRatio}px`,
                                                        borderLeftWidth: `${2 * scaleRatio}px`,
                                                        borderTopLeftRadius: '4px',
                                                    }}
                                                />
                                                <div 
                                                    className="absolute size-5 border-t border-r"
                                                    style={{
                                                        top: '-1px',
                                                        right: '-1px',
                                                        borderColor: activePage.borderColor || '#d4af37',
                                                        borderTopWidth: `${2 * scaleRatio}px`,
                                                        borderRightWidth: `${2 * scaleRatio}px`,
                                                        borderTopRightRadius: '4px',
                                                    }}
                                                />
                                                <div 
                                                    className="absolute size-5 border-b border-l"
                                                    style={{
                                                        bottom: '-1px',
                                                        left: '-1px',
                                                        borderColor: activePage.borderColor || '#d4af37',
                                                        borderBottomWidth: `${2 * scaleRatio}px`,
                                                        borderLeftWidth: `${2 * scaleRatio}px`,
                                                        borderBottomLeftRadius: '4px',
                                                    }}
                                                />
                                                <div 
                                                    className="absolute size-5 border-b border-r"
                                                    style={{
                                                        bottom: '-1px',
                                                        right: '-1px',
                                                        borderColor: activePage.borderColor || '#d4af37',
                                                        borderBottomWidth: `${2 * scaleRatio}px`,
                                                        borderRightWidth: `${2 * scaleRatio}px`,
                                                        borderBottomRightRadius: '4px',
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Elements rendered with EXACT percentage coordinates */}
                                {activePage?.elements?.map((elem: ElementConfig) => {
                                    if (elem.hidden) return null;
                                    const style: React.CSSProperties = {
                                        position: 'absolute',
                                        left: `${elem.x}%`,
                                        top: `${elem.y}%`,
                                        width: `${elem.w}%`,
                                        height: `${elem.h}%`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: elem.textAlign === 'left' ? 'flex-start' : elem.textAlign === 'right' ? 'flex-end' : 'center',
                                        textAlign: elem.textAlign || 'center',
                                        fontFamily: getFontFamilyCss(elem.fontStyle),
                                        color: elem.textColor || '#1f2937',
                                        fontSize: elem.fontSize ? `${elem.fontSize * scaleRatio}px` : undefined,
                                        fontWeight: elem.fontWeight || 'normal',
                                        fontStyle: (elem as any).isItalic ? 'italic' : 'normal',
                                        textShadow: elem.type === 'text' && elem.textShadow && elem.textShadow !== 'none' ? elem.textShadow : undefined,
                                        opacity: elem.type === 'image' && elem.opacity !== undefined ? elem.opacity / 100 : 1,
                                        zIndex: elem.zIndex !== undefined ? elem.zIndex : (elem.isBackground ? 5 : elem.type === 'image' ? 10 : elem.type === 'divider' ? 15 : elem.type === 'text' ? 20 : 25),
                                    };

                                    if (elem.type === 'text') {
                                        return (
                                            <div 
                                                key={elem.id} 
                                                style={style} 
                                                className={`p-1 break-words leading-tight whitespace-pre-wrap overflow-hidden ${elem.animation && elem.animation !== 'none' ? elem.animation : ''}`}
                                            >
                                                <span className="w-full">{elem.content}</span>
                                            </div>
                                        );
                                    }

                                    if (elem.type === 'image') {
                                        return (
                                            <div 
                                                key={elem.id} 
                                                style={style} 
                                                className={`overflow-hidden ${elem.isBackground ? '' : 'rounded-lg'} ${elem.animation && elem.animation !== 'none' ? elem.animation : ''}`}
                                            >
                                                {elem.url ? (
                                                    <img 
                                                        src={elem.url} 
                                                        alt="Graphic" 
                                                        className={`w-full h-full ${elem.isBackground ? 'object-cover' : 'object-contain'} pointer-events-none`} 
                                                        onError={(e) => {
                                                            e.currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-neutral-200/40 flex items-center justify-center text-xs text-neutral-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    if (elem.type === 'icon') {
                                        return (
                                            <div key={elem.id} style={style} className="p-0.5">
                                                {renderDecorIcon(elem.iconType || 'ring', elem.color || elem.textColor)}
                                            </div>
                                        );
                                    }

                                    if (elem.type === 'divider') {
                                        return (
                                            <div key={elem.id} style={style} className={`p-1 flex items-center justify-center overflow-hidden ${elem.animation && elem.animation !== 'none' ? elem.animation : ''}`}>
                                                <hr className="w-full border-t" style={{ borderColor: elem.color || '#1f2937', borderWidth: `${scaleRatio * 1.5}px` }} />
                                            </div>
                                        );
                                    }

                                    if (elem.type === 'link') {
                                        return (
                                            <div key={elem.id} style={style} className="p-1">
                                                <span 
                                                    className="px-3 py-1.5 bg-neutral-900/10 backdrop-blur-xs border rounded-full flex items-center justify-center gap-1 shrink-0 transition-all shadow-xs"
                                                    style={{ 
                                                        borderColor: elem.textColor || '#1f2937', 
                                                        color: elem.textColor || '#1f2937',
                                                        fontSize: `${Math.max(8, 9 * scaleRatio)}px`,
                                                        borderWidth: `${Math.max(1, 1 * scaleRatio)}px`
                                                    }}
                                                >
                                                    <MapPin className="shrink-0" style={{ width: `${10 * scaleRatio}px`, height: `${10 * scaleRatio}px` }} />
                                                    <span className="truncate max-w-[80px] font-bold">{elem.content || 'Location'}</span>
                                                </span>
                                            </div>
                                        );
                                    }

                                    return null;
                                })}
                            </div>

                            <p className="text-xs text-white/50 text-center flex items-center gap-1.5">
                                <ShieldCheck className="size-3.5 text-emerald-400" />
                                100% Customizable • Instant Digital Card & HD Download
                            </p>
                        </div>
                    )}
                </main>

                {/* Bottom Bar on Mobile */}
                <footer className="w-full sm:hidden sticky bottom-0 z-50 bg-[#181b1e]/95 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between gap-3 shadow-2xl">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-white/50 block">Price</span>
                        <span className="font-serif font-extrabold text-sm text-emerald-400">
                            {template.price && Number(template.price) > 0 ? `₹${Number(template.price).toFixed(2)}` : 'Free to Customize'}
                        </span>
                    </div>
                    <a
                        href={customizeUrl}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3d5644] to-[#2c3e2e] text-white text-xs font-bold font-serif shadow-lg flex items-center justify-center gap-2"
                    >
                        <Sparkles className="size-4 text-yellow-300" />
                        <span>Customize & Buy</span>
                    </a>
                </footer>

            </div>
        </>
    );
}
