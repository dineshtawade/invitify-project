import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { 
    Heart, Sparkles, Cake, Baby, Award, 
    ExternalLink, ChevronLeft, ChevronRight, MapPin, Mail,
    Star, Compass, Gift, Calendar, Clock, Music, Wine, Bell, Smile
} from 'lucide-react';
import { normalizeConfig, ASPECT_RATIOS } from '@/utils/builder-utils';

interface PageProps {
    userTemplate: {
        id: number;
        custom_config: any;
        template: {
            name: string;
            bg_gradient: string;
        };
    };
}

const fontStyles: Record<string, string> = {
    playfair: "'Playfair Display', serif",
    vibes: "'Great Vibes', cursive",
    montserrat: "'Montserrat', sans-serif",
    cinzel: "'Cinzel', serif",
    dancing: "'Dancing Script', cursive",
    alex: "'Alex Brush', cursive",
    outfit: "'Outfit', sans-serif",
    parisienne: "'Parisienne', cursive",
    cormorant: "'Cormorant Garamond', serif",
    pinyon: "'Pinyon Script', cursive",
};

export default function PublicSharedView({ userTemplate }: PageProps) {
    const config = normalizeConfig(userTemplate.custom_config, userTemplate.template.bg_gradient);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState(350);

    // Track card dimensions dynamically for font scaling
    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                setCardWidth(entries[0].contentRect.width);
            }
        });
        observer.observe(cardRef.current);
        
        // Initial measurement
        setCardWidth(cardRef.current.clientWidth);
        
        return () => observer.disconnect();
    }, [currentPageIndex]);

    const activePage = config.pages[currentPageIndex] || config.pages[0];
    const totalPages = config.pages.length;
    const ratioData = ASPECT_RATIOS[config.aspectRatio] || ASPECT_RATIOS.standard;

    const targetWidth = config.aspectRatio === 'custom' 
        ? (config.width || 350) 
        : (ratioData.targetWidth || 350);

    const scaleRatio = cardWidth / targetWidth;

    const renderDecorIcon = (iconName: string, color: string = 'currentColor') => {
        const iconClasses = "size-full object-contain pointer-events-none";
        switch (iconName) {
            case 'heart':
                return <Heart className={iconClasses} style={{ color }} />;
            case 'sparkle':
            case 'sparkles':
                return <Sparkles className={iconClasses} style={{ color }} />;
            case 'cake':
                return <Cake className={iconClasses} style={{ color }} />;
            case 'baby':
                return <Baby className={iconClasses} style={{ color }} />;
            case 'gift':
                return <Gift className={iconClasses} style={{ color }} />;
            case 'calendar':
                return <Calendar className={iconClasses} style={{ color }} />;
            case 'clock':
                return <Clock className={iconClasses} style={{ color }} />;
            case 'music':
                return <Music className={iconClasses} style={{ color }} />;
            case 'wine':
                return <Wine className={iconClasses} style={{ color }} />;
            case 'star':
                return <Star className={iconClasses} style={{ color }} />;
            case 'bell':
                return <Bell className={iconClasses} style={{ color }} />;
            case 'compass':
                return <Compass className={iconClasses} style={{ color }} />;
            case 'flower':
                return <Smile className={iconClasses} style={{ color }} />;
            case 'ring':
            default:
                return <Award className={iconClasses} style={{ color }} />;
        }
    };

    const handleNextPage = () => {
        if (currentPageIndex < totalPages - 1) {
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
        }
    };

    return (
        <>
            <Head title={userTemplate.template.name}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&family=Dancing+Script:wght@400..700&family=Alex+Brush&family=Outfit:wght@100..900&family=Parisienne&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&display=swap" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-6 text-neutral-100">
                {/* Main Card Frame */}
                <div className="w-full max-w-sm flex flex-col items-center gap-4">
                    {/* Page counter & title */}
                    <div className="text-center flex flex-col gap-1 w-full">
                        <span className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">
                            Invitation Card
                        </span>
                        <h2 className="text-sm text-neutral-500 truncate px-4">
                            {userTemplate.template.name}
                        </h2>
                    </div>

                    {/* The Card Element Wrapper */}
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
                        className={`w-full ${config.aspectRatio !== 'custom' ? ratioData.class : ''} rounded-3xl shadow-2xl relative overflow-hidden select-none border border-neutral-800 transition-all duration-500 ${!activePage?.bg_gradient?.startsWith('linear-gradient') ? `bg-gradient-to-tr ${activePage?.bg_gradient || 'from-stone-100 to-rose-50 text-neutral-800'}` : ''}`}
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

                        {activePage?.elements.map((elem) => {
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
                                fontFamily: fontStyles[elem.fontStyle || 'playfair'] || fontStyles.playfair,
                                color: elem.textColor || '#1f2937',
                                fontSize: elem.fontSize ? `${elem.fontSize * scaleRatio}px` : undefined,
                                fontWeight: elem.fontWeight || 'normal',
                                fontStyle: elem.isItalic ? 'italic' : 'normal',
                            };

                            if (elem.type === 'text') {
                                return (
                                    <div key={elem.id} style={style} className="p-1 break-words leading-tight overflow-hidden">
                                        {elem.content}
                                    </div>
                                );
                            }

                            if (elem.type === 'image') {
                                return (
                                    <div key={elem.id} style={style} className="overflow-hidden rounded-lg">
                                        {elem.url ? (
                                            <img src={elem.url} alt="Element Graphic" className="w-full h-full object-cover pointer-events-none" />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-400">
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
                                    <div key={elem.id} style={style} className="flex items-center justify-center px-2">
                                        <hr className="w-full border-t" style={{ borderColor: elem.color || '#1f2937', borderWidth: `${scaleRatio * 1.5}px` }} />
                                    </div>
                                );
                            }

                            if (elem.type === 'link') {
                                return (
                                    <div key={elem.id} style={style} className="p-1">
                                        <a 
                                            href={elem.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-neutral-900/10 hover:bg-neutral-900/20 backdrop-blur-xs border rounded-full flex items-center justify-center gap-1 shrink-0 transition-all shadow-xs"
                                            style={{ 
                                                borderColor: elem.textColor || '#1f2937', 
                                                color: elem.textColor || '#1f2937',
                                                fontSize: `${Math.max(8, 9 * scaleRatio)}px`,
                                                borderWidth: `${Math.max(1, 1 * scaleRatio)}px`
                                            }}
                                        >
                                            <MapPin className="shrink-0" style={{ width: `${10 * scaleRatio}px`, height: `${10 * scaleRatio}px` }} />
                                            <span className="truncate max-w-[80px] font-bold">{elem.content || 'Location'}</span>
                                            <ExternalLink className="shrink-0" style={{ width: `${8 * scaleRatio}px`, height: `${8 * scaleRatio}px` }} />
                                        </a>
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-6 bg-neutral-900 border border-neutral-800 rounded-full px-6 py-2 shadow-lg w-full">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPageIndex === 0}
                                className={`p-1.5 rounded-full border transition-all ${
                                    currentPageIndex === 0 
                                        ? 'border-neutral-850 text-neutral-600 cursor-not-allowed' 
                                        : 'border-neutral-700 hover:bg-neutral-800 text-white'
                                }`}
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <span className="text-xs font-semibold tracking-widest text-neutral-400">
                                PAGE {currentPageIndex + 1} OF {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPageIndex === totalPages - 1}
                                className={`p-1.5 rounded-full border transition-all ${
                                    currentPageIndex === totalPages - 1 
                                        ? 'border-neutral-850 text-neutral-600 cursor-not-allowed' 
                                        : 'border-neutral-700 hover:bg-neutral-800 text-white'
                                }`}
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </div>
                    )}

                    {/* Branding footer */}
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 font-semibold tracking-wider pt-4">
                        <Mail className="size-3.5" /> Powered by Invitify
                    </div>
                </div>
            </div>
        </>
    );
}
