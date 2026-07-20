import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import {
    Menu, X, MapPin, Sparkles, Play, Globe,
    HelpCircle, Star, Quote, ChevronDown, Check, ArrowRight
} from 'lucide-react';

interface Block {
    id: string;
    type: string;
    title?: string;
    subtitle?: string;
    content?: string;
    bg_color?: string;
    cta_text?: string;
    cta_link?: string;
    align?: string;
    images?: string[];
    video_url?: string;
    links?: { label: string; url: string; icon: string }[];
    features?: { title: string; desc: string; icon: string }[];
    items?: any[];
    form_type?: string;

    // --- Advanced Features ---
    font_family?: string;
    grid_columns?: string;
    media_width?: string;
    media_height?: string;
    object_fit?: 'cover' | 'contain' | 'fill';
    autoplay?: boolean;
    show_arrows?: boolean;
}

interface PageProps {
    website: {
        id: number;
        title: string;
        slug: string;
        theme: 'cozy' | 'clean' | 'royal' | 'ocean';
        meta_description?: string;
        meta_keywords?: string;
        pages: Record<string, { title: string; slug: string; enabled: boolean }>;
    };
    currentPageSlug: string;
    pageData: {
        title: string;
        seo_title?: string;
        seo_description?: string;
        blocks: Block[];
    };
    navigation: string[];
}

const themePresets = {
    royal: {
        bg: 'bg-amber-50/30 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
        nav: 'bg-white/90 border-amber-200/50 backdrop-blur-md shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800',
        hero: 'from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400',
        accent: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/10',
        card: 'bg-white border-amber-100 shadow-amber-900/5 dark:bg-neutral-900 dark:border-neutral-800',
    },
    cozy: {
        bg: 'bg-stone-50/40 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
        nav: 'bg-white/90 border-rose-200/50 backdrop-blur-md shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800',
        hero: 'from-rose-600 to-stone-800 bg-clip-text text-transparent dark:from-rose-400 dark:to-stone-200',
        accent: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/10',
        card: 'bg-white border-rose-100 shadow-rose-900/5 dark:bg-neutral-900 dark:border-neutral-800',
    },
    ocean: {
        bg: 'bg-cyan-50/30 text-cyan-950 dark:bg-neutral-950 dark:text-neutral-50',
        nav: 'bg-white/90 border-cyan-200/50 backdrop-blur-md shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800',
        hero: 'from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400',
        accent: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/10',
        card: 'bg-white border-cyan-100 shadow-cyan-900/5 dark:bg-neutral-900 dark:border-neutral-800',
    },
    clean: {
        bg: 'bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50',
        nav: 'bg-white/95 border-zinc-200/80 backdrop-blur-sm shadow-xs dark:bg-zinc-900/95 dark:border-zinc-800',
        hero: 'text-zinc-900 dark:text-zinc-50',
        accent: 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 shadow-black/5',
        card: 'bg-white border-zinc-200 shadow-zinc-900/5 dark:bg-zinc-900 dark:border-zinc-800',
    },
};

// Reusable FAQ Accordion Item Component
function FaqItem({ item, theme }: { item: any, theme: any }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`rounded-2xl border transition-all duration-300 ${isOpen ? theme.card + ' shadow-md' : 'bg-transparent border-neutral-200 dark:border-neutral-800'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-hidden"
            >
                <span className="font-bold text-lg">{item.question}</span>
                <ChevronDown className={`size-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5 pt-0 text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {item.answer}
                </div>
            </div>
        </div>
    );
}

export default function BusinessViewer({ website, currentPageSlug, pageData, navigation }: PageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const theme = themePresets[website.theme] || themePresets.royal;

    const pageTitle = pageData.seo_title || `${pageData.title} | ${website.title}`;
    const pageDescription = pageData.seo_description || website.meta_description || '';

    return (
        <div className={`min-h-screen font-sans ${theme.bg}`}>
            <Head>
                <title>{pageTitle}</title>
                {pageDescription && <meta name="description" content={pageDescription} />}
                {website.meta_keywords && <meta name="keywords" content={website.meta_keywords} />}
            </Head>

            {/* Header Navigation */}
            <header className={`fixed top-0 inset-x-0 z-50 ${theme.nav} border-b`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href={`/business/${website.slug}`} className="font-black text-xl tracking-tight">
                        {website.title}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navigation.map(slug => {
                            const navPage = website.pages[slug];
                            if (!navPage) return null;
                            const isActive = slug === currentPageSlug;
                            return (
                                <Link
                                    key={slug}
                                    href={`/business/${website.slug}/${slug}`}
                                    className={`text-sm font-bold uppercase tracking-wider transition-all hover:opacity-100 ${isActive ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-60'}`}
                                >
                                    {navPage.title}
                                </Link>
                            );
                        })}
                    </nav>

                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-neutral-900 border-b shadow-xl px-4 py-6 flex flex-col gap-4">
                        {navigation.map(slug => {
                            const navPage = website.pages[slug];
                            if (!navPage) return null;
                            const isActive = slug === currentPageSlug;
                            return (
                                <Link
                                    key={slug}
                                    href={`/business/${website.slug}/${slug}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`p-3 rounded-xl text-center font-bold tracking-widest uppercase text-sm ${isActive ? theme.accent : 'bg-neutral-50 dark:bg-neutral-800'}`}
                                >
                                    {navPage.title}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="pt-16 pb-24">
                {pageData.blocks?.map((block: Block, index: number) => {
                    const isFirst = index === 0;
                    const blockStyle: React.CSSProperties = block.font_family ? { fontFamily: block.font_family } : {};
                    if (block.bg_color) {
                        const bg = block.bg_color.trim();
                        if (bg.startsWith('linear-gradient') || bg.startsWith('#') || bg.startsWith('rgb')) {
                            blockStyle.background = bg;
                        }
                    }
                    if (block.bg_image) {
                        blockStyle.backgroundImage = `url(${block.bg_image})`;
                        blockStyle.backgroundSize = 'cover';
                        blockStyle.backgroundPosition = 'center';
                        blockStyle.backgroundRepeat = 'no-repeat';
                    }
                    const gridColsClass = block.grid_columns
                        ? `sm:grid-cols-${block.grid_columns}`
                        : 'sm:grid-cols-2 lg:grid-cols-4';

                    const getBgClass = (b: Block) => {
                        if (!b.bg_color) return '';
                        const bg = b.bg_color.trim();
                        if (bg.startsWith('linear-gradient') || bg.startsWith('#') || bg.startsWith('rgb')) {
                            return '';
                        }
                        return bg.includes('from-') ? `bg-gradient-to-tr ${bg}` : bg;
                    };

                    return (
                        <section key={block.id} className={`${isFirst ? 'pt-16 pb-24' : 'py-20'} relative`} style={blockStyle}>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                                {/* Dynamic Layout Block */}
                                {block.type === 'dynamic_layout' && (
                                    <div
                                        className={`rounded-3xl p-8 sm:p-16 lg:p-24 flex flex-col gap-8 items-center justify-center min-h-[260px] relative overflow-hidden shadow-xl ${getBgClass(block)}`}
                                        style={blockStyle}
                                    >
                                        {block.bg_image && (
                                            <div className="absolute inset-0 bg-black/15 pointer-events-none rounded-3xl"></div>
                                        )}
                                        <div className="relative z-10 flex flex-col gap-6 items-center w-full max-w-4xl mx-auto">
                                            {block.icon && block.icon !== 'none' && (() => {
                                                const IconComponent = (LucideIcons as any)[block.icon];
                                                if (IconComponent) {
                                                    return <IconComponent className="size-12 text-indigo-700 drop-shadow-md animate-pulse" />;
                                                }
                                                return null;
                                            })()}
                                            {block.title && (
                                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-center leading-tight">
                                                    {block.title}
                                                </h1>
                                            )}
                                            {block.custom_image_url && (
                                                <div className="w-full max-w-[400px] my-3 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                                                    <img src={block.custom_image_url} alt="Custom Content" className="w-full h-auto object-cover" />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-4 items-center w-full">
                                                {block.text_lines?.map((line: any, idx: number) => (
                                                    <p
                                                        key={idx}
                                                        style={{ color: line.color }}
                                                        className={`text-center max-w-2xl break-words leading-relaxed ${line.size === 'text-xs' ? 'text-sm' :
                                                                line.size === 'text-sm' ? 'text-base' :
                                                                    line.size === 'text-base' ? 'text-lg' :
                                                                        line.size === 'text-lg' ? 'text-xl' :
                                                                            line.size === 'text-xl' ? 'text-2xl' :
                                                                                line.size === 'text-2xl' ? 'text-3xl lg:text-4xl' : 'text-base'
                                                            } ${line.weight === 'bold' ? 'font-bold' : line.weight === 'light' ? 'font-light' : 'font-normal'}`}
                                                    >
                                                        {line.text}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Flexible Layout Block */}
                                {block.type === 'flexible_layout' && (
                                    <div
                                        className={`rounded-3xl p-8 sm:p-16 lg:p-24 flex flex-col gap-8 items-center justify-center min-h-[120px] relative overflow-hidden shadow-xl ${getBgClass(block)}`}
                                        style={blockStyle}
                                    >
                                        {block.bg_image && (
                                            <div className="absolute inset-0 bg-black/15 pointer-events-none rounded-3xl"></div>
                                        )}
                                        <div className="relative z-10 flex flex-col gap-6 items-center w-full max-w-4xl mx-auto">
                                            {block.items?.map((item: any, idx: number) => {
                                                if (item.type === 'text') {
                                                    return (
                                                        <p
                                                            key={item.id || idx}
                                                            style={{ color: item.color, fontFamily: item.font_family || undefined }}
                                                            className={`max-w-3xl break-words leading-relaxed ${item.font_size === 'text-xs' ? 'text-sm' :
                                                                    item.font_size === 'text-sm' ? 'text-base' :
                                                                        item.font_size === 'text-base' ? 'text-lg' :
                                                                            item.font_size === 'text-lg' ? 'text-xl' :
                                                                                item.font_size === 'text-xl' ? 'text-2xl' :
                                                                                    item.font_size === 'text-2xl' ? 'text-3xl lg:text-4xl' :
                                                                                        item.font_size === 'text-3xl' ? 'text-4xl lg:text-5xl' :
                                                                                            item.font_size === 'text-4xl' ? 'text-5xl lg:text-6xl' :
                                                                                                item.font_size === 'text-5xl' ? 'text-6xl lg:text-7xl' :
                                                                                                    item.font_size === 'text-6xl' ? 'text-7xl lg:text-8xl' : 'text-lg'
                                                                } ${item.weight === 'bold' ? 'font-bold' : item.weight === 'light' ? 'font-light' : 'font-normal'} text-${item.align || 'center'} w-full whitespace-pre-wrap`}
                                                        >
                                                            {item.text}
                                                        </p>
                                                    );
                                                }
                                                if (item.type === 'image') {
                                                    return (
                                                        <div
                                                            key={item.id || idx}
                                                            className={`w-full flex justify-${item.align === 'left' ? 'start' : item.align === 'right' ? 'end' : 'center'}`}
                                                        >
                                                            <div className={`overflow-hidden border-4 border-white/20 shadow-2xl ${item.image_size === 'small' ? 'max-w-[200px]' :
                                                                    item.image_size === 'medium' ? 'max-w-[450px]' :
                                                                        item.image_size === 'large' ? 'max-w-[700px]' : 'w-full'
                                                                } ${item.radius || 'rounded-2xl'}`}>
                                                                <img src={item.url} alt="Foreground content" className="w-full h-auto object-cover" />
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (item.type === 'video') {
                                                    return (
                                                        <div
                                                            key={item.id || idx}
                                                            className={`w-full flex justify-${item.align === 'left' ? 'start' : item.align === 'right' ? 'end' : 'center'}`}
                                                        >
                                                            <div className={`overflow-hidden border-4 border-white/20 shadow-2xl ${item.video_size === 'small' ? 'max-w-[200px]' :
                                                                    item.video_size === 'medium' ? 'max-w-[450px]' :
                                                                        item.video_size === 'large' ? 'max-w-[700px]' : 'w-full'
                                                                } rounded-2xl`}>
                                                                <video
                                                                    src={item.video_url}
                                                                    controls
                                                                    autoPlay={item.autoplay}
                                                                    muted={item.autoplay}
                                                                    loop
                                                                    className="w-full h-auto"
                                                                    playsInline
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (item.type === 'button') {
                                                    return (
                                                        <div
                                                            key={item.id || idx}
                                                            className={`w-full flex justify-${item.align === 'left' ? 'start' : item.align === 'right' ? 'end' : 'center'}`}
                                                        >
                                                            <a
                                                                href={item.btn_url || '#'}
                                                                style={{
                                                                    backgroundColor: item.btn_bg_color || '#2563eb',
                                                                    color: item.btn_text_color || '#ffffff'
                                                                }}
                                                                className={`inline-flex items-center justify-center font-black tracking-wider uppercase transition-transform hover:scale-105 shadow-2xl ${item.btn_size === 'small' ? 'px-6 py-3 text-xs' :
                                                                        item.btn_size === 'large' ? 'px-12 py-5 text-base' : 'px-9 py-4 text-sm'
                                                                    } ${item.btn_radius || 'rounded-full'}`}
                                                            >
                                                                {item.btn_text}
                                                            </a>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* 1. Hero Block */}
                                {block.type === 'hero' && (() => {
                                    const elements = block.hero_elements && block.hero_elements.length > 0 ? block.hero_elements : null;
                                    const imgSizeMap: any = { small: 'max-w-[150px]', medium: 'max-w-[400px]', large: 'max-w-[600px]', full: 'w-full' };
                                    const btnSizeMap: any = { small: 'px-6 py-2.5 text-xs', medium: 'px-8 py-4 text-sm', large: 'px-12 py-5 text-base' };

                                    return (
                                        <div
                                            className={`rounded-3xl p-8 sm:p-16 lg:p-24 text-center text-white bg-gradient-to-br ${block.bg_color || 'from-indigo-600 to-purple-700'} shadow-2xl relative overflow-hidden`}
                                            style={block.bg_image ? { backgroundImage: `url(${block.bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                        >
                                            <div className="absolute inset-0 bg-black/10"></div>
                                            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
                                                {elements ? elements.map((el: any, idx: number) => {
                                                    const alignCls = el.align === 'left' ? 'self-start text-left' : el.align === 'right' ? 'self-end text-right' : 'self-center text-center';
                                                    if (el.type === 'text') {
                                                        return (
                                                            <p key={el.id || idx} style={{ color: el.color, fontSize: `${el.font_size_px || 16}px`, fontWeight: el.font_weight || '400', fontFamily: el.font_family || undefined, textAlign: (el.align || 'center') as any }} className={`max-w-2xl break-words leading-relaxed ${alignCls} w-full`}>
                                                                {el.content}
                                                            </p>
                                                        );
                                                    } else if (el.type === 'image' && el.url) {
                                                        return (
                                                            <div key={el.id || idx} className={`w-full flex ${el.align === 'left' ? 'justify-start' : el.align === 'right' ? 'justify-end' : 'justify-center'}`}>
                                                                <div className={`overflow-hidden border-2 border-white/20 shadow-lg ${el.width_px ? '' : (imgSizeMap[el.image_size] || 'max-w-[400px]')} ${el.radius || 'rounded-2xl'}`}
                                                                    style={{
                                                                        width: el.width_px ? `${el.width_px}px` : undefined,
                                                                        height: el.height_px ? `${el.height_px}px` : undefined
                                                                    }}
                                                                >
                                                                    <img src={el.url} alt="" className={`w-full object-cover ${el.height_px ? 'h-full' : 'h-auto'}`} />
                                                                </div>
                                                            </div>
                                                        );
                                                    } else if (el.type === 'video' && el.video_url) {
                                                        return (
                                                            <div key={el.id || idx} className={`w-full flex ${el.align === 'left' ? 'justify-start' : el.align === 'right' ? 'justify-end' : 'justify-center'}`}>
                                                                <div className={`overflow-hidden border-2 border-white/20 shadow-lg ${el.width_px ? '' : (imgSizeMap[el.video_size] || 'max-w-[400px]')} rounded-2xl`}
                                                                    style={{
                                                                        width: el.width_px ? `${el.width_px}px` : undefined,
                                                                        height: el.height_px ? `${el.height_px}px` : undefined
                                                                    }}
                                                                >
                                                                    <video src={el.video_url} controls={!el.autoplay} autoPlay={el.autoplay} muted={el.autoplay} loop={el.autoplay} className={`w-full object-cover ${el.height_px ? 'h-full' : 'h-auto'}`} />
                                                                </div>
                                                            </div>
                                                        );
                                                    } else if (el.type === 'button') {
                                                        return (
                                                            <div key={el.id || idx} className={`w-full flex ${el.align === 'left' ? 'justify-start' : el.align === 'right' ? 'justify-end' : 'justify-center'}`}>
                                                                <a
                                                                    href={el.btn_url || '#'}
                                                                    style={{ backgroundColor: el.btn_bg_color || '#ffffff', color: el.btn_text_color || '#1f2937' }}
                                                                    className={`inline-flex items-center justify-center font-black tracking-wider uppercase transition-transform hover:scale-105 shadow-xl ${btnSizeMap[el.btn_size] || btnSizeMap.medium} ${el.btn_radius || 'rounded-full'} mt-6`}
                                                                >
                                                                    {el.btn_text || 'Button'}
                                                                </a>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }) : (
                                                    <>
                                                        {block.title && <h1 style={{ color: block.title_color }} className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight">{block.title}</h1>}
                                                        {block.subtitle && <p style={{ color: block.subtitle_color }} className="text-lg sm:text-xl opacity-90 max-w-2xl">{block.subtitle}</p>}
                                                        {block.hero_text_lines?.map((line: any, i: number) => (
                                                            <p key={i} style={{ color: line.color }} className={`text-center max-w-2xl break-words leading-relaxed ${line.size || 'text-base'} ${line.weight === 'bold' ? 'font-bold' : line.weight === 'light' ? 'font-light' : 'font-normal'}`}>{line.text}</p>
                                                        ))}
                                                        {block.cta_text && (
                                                            <a href={block.cta_link || '#'} className="mt-6 px-8 py-4 bg-white text-neutral-900 rounded-full font-black tracking-wider uppercase text-sm hover:scale-105 transition-transform shadow-xl">
                                                                {block.cta_text}
                                                            </a>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* 2. Text Block */}
                                {block.type === 'text' && (
                                    <div className="max-w-4xl mx-auto" style={{ textAlign: (block.align as any) || 'left' }}>
                                        {block.title && <h2 className="text-3xl sm:text-4xl font-black mb-8">{block.title}</h2>}
                                        {block.content && <div className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">{block.content}</div>}
                                    </div>
                                )}

                                {/* 3. Swiper / Gallery */}
                                {block.type === 'swiper' && (
                                    <div className="flex flex-col gap-10 items-center">
                                        {block.title && <h2 className="text-3xl font-black text-center w-full">{block.title}</h2>}
                                        <div className={`flex gap-4 overflow-x-auto pb-8 snap-x w-full ${block.media_width || 'max-w-full'}`}>
                                            {block.images?.map((url, i) => (
                                                <div key={i} className={`snap-center shrink-0 w-80 sm:w-96 rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-neutral-800 ${block.media_height || 'aspect-square'}`}>
                                                    <img src={url} alt={`Gallery image ${i + 1}`} className="size-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4. Features / Icons Grid */}
                                {block.type === 'icons_grid' && (
                                    <div className="flex flex-col gap-12">
                                        {block.title && <h2 className="text-3xl font-black text-center">{block.title}</h2>}
                                        <div className={`grid gap-6 ${gridColsClass}`}>
                                            {block.features?.map((feat, i) => (
                                                <div key={i} className={`${theme.card} p-8 rounded-3xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300`}>
                                                    <div className="size-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                        {feat.icon === 'globe' ? <Globe className="size-7" /> : <Sparkles className="size-7" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                                                        <p className="text-neutral-500 leading-relaxed">{feat.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4.5 Video */}
                                {block.type === 'video' && (
                                    <div className="flex flex-col gap-10 items-center">
                                        {block.title && <h2 className="text-3xl font-black text-center w-full">{block.title}</h2>}
                                        <div className={`${block.media_width || 'w-full max-w-5xl'} ${block.media_height || 'aspect-video'} rounded-3xl bg-neutral-950 flex items-center justify-center text-white overflow-hidden shadow-2xl relative`}>
                                            {block.video_url && block.video_url.match(/\.(mp4|webm)$/i) ? (
                                                <video src={block.video_url} className="w-full h-full object-cover" autoPlay={block.autoplay} muted loop controls={!block.autoplay} />
                                            ) : (
                                                <Play className="size-16 text-neutral-400" />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 5. FAQ Accordion */}
                                {block.type === 'faq' && (
                                    <div className="max-w-3xl mx-auto flex flex-col gap-10">
                                        {block.title && <h2 className="text-3xl sm:text-4xl font-black text-center">{block.title}</h2>}
                                        <div className="flex flex-col gap-4">
                                            {block.items?.map((item, i) => (
                                                <FaqItem key={i} item={item} theme={theme} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 6. Testimonials Carousel */}
                                {block.type === 'testimonials' && (
                                    <div className="flex flex-col gap-12 overflow-hidden">
                                        {block.title && <h2 className="text-3xl sm:text-4xl font-black text-center">{block.title}</h2>}
                                        <div className="flex gap-6 overflow-x-auto pb-8 snap-x px-4">
                                            {block.items?.map((item, i) => (
                                                <div key={i} className={`snap-center shrink-0 w-[340px] sm:w-[400px] ${theme.card} p-8 rounded-3xl flex flex-col gap-6`}>
                                                    <div className="flex gap-1">
                                                        {Array.from({ length: Number(item.rating) || 5 }).map((_, s) => (
                                                            <Star key={s} className="size-5 text-amber-400 fill-amber-400" />
                                                        ))}
                                                    </div>
                                                    <p className="text-lg italic text-neutral-600 dark:text-neutral-400 leading-relaxed grow">
                                                        "{item.quote}"
                                                    </p>
                                                    <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                                        <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                            {item.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-neutral-900 dark:text-white">{item.name}</h4>
                                                            <p className="text-sm text-neutral-500">{item.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 7. Contact Form */}
                                {block.type === 'form' && (
                                    <div className="max-w-2xl mx-auto">
                                        <div className={`${theme.card} p-8 sm:p-12 rounded-[2.5rem] flex flex-col gap-8`}>
                                            {block.title && <h2 className="text-3xl font-black text-center">{block.title}</h2>}
                                            <form className="flex flex-col gap-5">
                                                <div className="grid sm:grid-cols-2 gap-5">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-2">Name</label>
                                                        <input type="text" className="bg-neutral-50 dark:bg-neutral-950 border-0 ring-1 ring-inset ring-neutral-200 dark:ring-neutral-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-600" />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-2">Email</label>
                                                        <input type="email" className="bg-neutral-50 dark:bg-neutral-950 border-0 ring-1 ring-inset ring-neutral-200 dark:ring-neutral-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-600" />
                                                    </div>
                                                </div>
                                                {block.form_type === 'contact' && (
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-2">Subject</label>
                                                        <input type="text" className="bg-neutral-50 dark:bg-neutral-950 border-0 ring-1 ring-inset ring-neutral-200 dark:ring-neutral-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-600" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-2">Message</label>
                                                    <textarea rows={4} className="bg-neutral-50 dark:bg-neutral-950 border-0 ring-1 ring-inset ring-neutral-200 dark:ring-neutral-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-600 resize-none"></textarea>
                                                </div>
                                                <button type="button" className={`mt-4 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 ${theme.accent} transition-transform hover:-translate-y-1`}>
                                                    Send Message <ArrowRight className="size-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </section>
                    );
                })}
            </main>

            {/* Footer */}
            <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link href={`/business/${website.slug}`} className="font-black text-2xl tracking-tight text-white">
                            {website.title}
                        </Link>
                        <p className="text-sm">© {new Date().getFullYear()} All rights reserved.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        {navigation.map(slug => {
                            const navPage = website.pages[slug];
                            if (!navPage) return null;
                            return (
                                <Link
                                    key={slug}
                                    href={`/business/${website.slug}/${slug}`}
                                    className="text-sm font-bold uppercase tracking-wider hover:text-white transition-colors"
                                >
                                    {navPage.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </footer>
        </div>
    );
}
