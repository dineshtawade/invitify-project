import { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import * as LucideIcons from 'lucide-react';
import { Play, MapPin, Sparkles, HelpCircle, Star, Compass } from 'lucide-react';
import type { Block } from './types';

interface DevicePreviewProps {
    blocks: Block[];
    activeSectionId: string | null;
    deviceType: 'desktop' | 'tablet' | 'mobile';
    title?: string;
    slug?: string;
    pagesNav?: { slug: string; title: string; active: boolean }[];
    isInvitation?: boolean;
    customBlocks?: any[];
}

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
        <div className="flex gap-3 justify-center items-center mt-2 text-white">
            <div className="flex flex-col items-center bg-black/45 backdrop-blur-xs rounded-lg p-2 min-w-[44px]">
                <span className="font-mono text-sm font-black">{timeLeft.days}</span>
                <span className="text-[6px] uppercase font-bold tracking-wider opacity-60">Days</span>
            </div>
            <div className="flex flex-col items-center bg-black/45 backdrop-blur-xs rounded-lg p-2 min-w-[44px]">
                <span className="font-mono text-sm font-black">{timeLeft.hours}</span>
                <span className="text-[6px] uppercase font-bold tracking-wider opacity-60">Hrs</span>
            </div>
            <div className="flex flex-col items-center bg-black/45 backdrop-blur-xs rounded-lg p-2 min-w-[44px]">
                <span className="font-mono text-sm font-black">{timeLeft.minutes}</span>
                <span className="text-[6px] uppercase font-bold tracking-wider opacity-60">Mins</span>
            </div>
            <div className="flex flex-col items-center bg-black/45 backdrop-blur-xs rounded-lg p-2 min-w-[44px]">
                <span className="font-mono text-sm font-black">{timeLeft.seconds}</span>
                <span className="text-[6px] uppercase font-bold tracking-wider opacity-60">Secs</span>
            </div>
        </div>
    );
};

export function DevicePreview({ blocks, activeSectionId, deviceType, title, slug, pagesNav, isInvitation = false, customBlocks = [] }: DevicePreviewProps) {
    
    const getBlockStyle = (block: Block) => {
        const style: React.CSSProperties = {};
        if (block.font_family) style.fontFamily = block.font_family;
        if (block.font_color) style.color = block.font_color;
        if (block.font_size_px) style.fontSize = `${block.font_size_px}px`;
        if (block.text_shadow) style.textShadow = block.text_shadow;
        
        if (block.bg_color) {
            const bg = block.bg_color.trim();
            if (bg.startsWith('linear-gradient') || bg.startsWith('#') || bg.startsWith('rgb')) {
                style.background = bg;
            }
        }
        if (block.bg_image) {
            style.backgroundImage = `url(${block.bg_image})`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
            style.backgroundRepeat = 'no-repeat';
        }
        return style;
    };

    const getBgClass = (block: Block, defaultVal = '') => {
        if (!block.bg_color) return defaultVal;
        const bg = block.bg_color.trim();
        if (bg.startsWith('linear-gradient') || bg.startsWith('#') || bg.startsWith('rgb')) {
            return ''; // Inline custom style applied
        }
        return bg;
    };

    const getSpacingClass = (block: Block) => {
        const pad = block.padding_y || 'py-8';
        const mar = block.margin_y || 'my-0';
        return `${pad} ${mar}`;
    };

    const getTextStyleClass = (block: Block) => {
        const size = block.font_size || '';
        const weight = block.font_weight === 'bold' ? 'font-bold' : block.font_weight === 'light' ? 'font-light' : 'font-normal';
        const italic = block.font_style === 'italic' ? 'italic' : 'not-italic';
        return `${size} ${weight} ${italic}`;
    };

    const renderPreviewBlock = (block: Block) => {
        const blockStyle = getBlockStyle(block);
        const gridColsClass = block.grid_columns 
            ? `grid-cols-${block.grid_columns}` 
            : 'grid-cols-2';

        const spacingClass = getSpacingClass(block);
        const textStyleClass = getTextStyleClass(block);

        const customBlock = customBlocks.find(cb => cb.type === block.type);
        if (customBlock) {
            let html = customBlock.template_html;
            if (customBlock.fields && Array.isArray(customBlock.fields)) {
                customBlock.fields.forEach((field: any) => {
                    const value = block[field.name] !== undefined ? block[field.name] : field.default;
                    html = html.replaceAll(`{{${field.name}}}`, value);
                });
            }
            return (
                <div 
                    style={blockStyle} 
                    className={`${spacingClass} ${textStyleClass}`}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            );
        }

        return (
            <div style={blockStyle} className={`${spacingClass} ${textStyleClass}`}>
                {block.type === 'advanced_section' && (() => {
                    const bgGradientClass = block.bg_type === 'gradient' ? block.bg_gradient : '';
                    const responsiveClass = [
                        block.visibility_desktop !== false ? '' : 'lg:hidden',
                        block.visibility_tablet !== false ? '' : 'md:hidden sm:max-md:hidden',
                        block.visibility_mobile !== false ? '' : 'max-sm:hidden',
                    ].filter(Boolean).join(' ');

                    const containerClasses = [
                        block.padding_top || 'py-12',
                        block.padding_bottom || '',
                        block.padding_left || 'px-6',
                        block.padding_right || '',
                        block.margin_top || 'my-4',
                        block.margin_bottom || '',
                        block.border_width || 'border-0',
                        block.border_style || 'solid',
                        block.border_radius || 'rounded-2xl',
                        block.box_shadow || 'shadow-md',
                        block.positioning || 'relative',
                        block.z_index || 'z-0',
                        block.custom_class || '',
                        responsiveClass
                    ].filter(Boolean).join(' ');

                    const getBgStyle = () => {
                        const style: React.CSSProperties = {};
                        if (block.bg_type === 'color' && block.bg_color) {
                            style.backgroundColor = block.bg_color;
                        } else if (block.bg_type === 'image' && block.bg_image) {
                            style.backgroundImage = `url(${block.bg_image})`;
                            style.backgroundSize = 'cover';
                            style.backgroundPosition = 'center';
                        }
                        if (block.border_color) style.borderColor = block.border_color;
                        return style;
                    };

                    return (
                        <div 
                            id={block.custom_id}
                            style={getBgStyle()}
                            className={`w-full relative overflow-hidden transition-all ${containerClasses} ${bgGradientClass} ${block.animation_type && block.animation_type !== 'none' ? `animate-${block.animation_type}` : ''}`}
                        >
                            {/* Background Overlay */}
                            {block.bg_type === 'image' && block.bg_overlay_color && (
                                <div 
                                    className="absolute inset-0 z-0 pointer-events-none" 
                                    style={{ 
                                        backgroundColor: block.bg_overlay_color, 
                                        opacity: parseFloat(block.bg_overlay_opacity || '0.4') 
                                    }} 
                                />
                            )}

                            {/* Scoped Custom CSS */}
                            {block.custom_css && (
                                <style dangerouslySetInnerHTML={{ __html: block.custom_css }} />
                            )}

                            {/* Content Container */}
                            <div className={`relative z-10 mx-auto w-full ${block.section_width || 'max-w-4xl'} flex ${block.content_align || 'flex-col items-center'} gap-6`}>
                                
                                {/* Header */}
                                {block.header_text && (() => {
                                    const Tag = block.header_tag || 'h2';
                                    const headerStyle: React.CSSProperties = {};
                                    if (block.header_color) headerStyle.color = block.header_color;
                                    if (block.header_font_family) headerStyle.fontFamily = block.header_font_family;
                                    const className = `${block.header_font_size || 'text-3xl'} ${block.header_font_weight || 'font-bold'} text-${block.header_align || 'center'} w-full tracking-tight`;
                                    
                                    if (Tag === 'h1') return <h1 style={headerStyle} className={className}>{block.header_text}</h1>;
                                    if (Tag === 'h2') return <h2 style={headerStyle} className={className}>{block.header_text}</h2>;
                                    if (Tag === 'h3') return <h3 style={headerStyle} className={className}>{block.header_text}</h3>;
                                    if (Tag === 'h4') return <h4 style={headerStyle} className={className}>{block.header_text}</h4>;
                                    if (Tag === 'h5') return <h5 style={headerStyle} className={className}>{block.header_text}</h5>;
                                    if (Tag === 'h6') return <h6 style={headerStyle} className={className}>{block.header_text}</h6>;
                                    return <h2 style={headerStyle} className={className}>{block.header_text}</h2>;
                                })()}

                                {/* Image */}
                                {block.image_url && (
                                    <div className="flex justify-center w-full">
                                        <img 
                                            src={block.image_url} 
                                            alt={block.image_alt || 'illustration'} 
                                            className={`object-cover ${
                                                block.image_size === 'small' ? 'max-w-[150px]' : 
                                                block.image_size === 'large' ? 'max-w-[500px]' : 
                                                block.image_size === 'full' ? 'w-full' : 'max-w-[320px]'
                                            } ${block.image_radius || 'rounded-xl'} shadow-xs`}
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                {block.desc_text && (
                                    <p 
                                        style={{ 
                                            color: block.desc_color || '#4b5563', 
                                            fontFamily: block.desc_font_family || 'Inter' 
                                        }} 
                                        className={`${block.desc_font_size || 'text-sm'} ${block.desc_font_weight || 'font-normal'} ${block.desc_line_height || 'leading-relaxed'} text-${block.desc_align || 'center'} w-full whitespace-pre-wrap`}
                                    >
                                        {block.desc_text}
                                    </p>
                                )}

                                {/* CTA Button */}
                                {block.btn_text && (
                                    <div className="flex justify-center w-full mt-2">
                                        <a 
                                            href={block.btn_url || '#'} 
                                            style={{ 
                                                backgroundColor: block.btn_bg_color || '#2563eb', 
                                                color: block.btn_text_color || '#ffffff' 
                                            }} 
                                            className={`inline-flex items-center justify-center gap-2 ${block.btn_padding_x || 'px-6'} ${block.btn_padding_y || 'py-2.5'} ${block.btn_font_size || 'text-xs'} font-bold ${block.btn_border_radius || 'rounded-full'} transition-all duration-300 ${
                                                block.btn_hover_effect === 'scale' ? 'hover:scale-105 active:scale-95' : 
                                                block.btn_hover_effect === 'opacity' ? 'hover:opacity-90 active:opacity-100' : ''
                                            } shadow-md`}
                                        >
                                            <span>{block.btn_text}</span>
                                            {block.btn_icon && block.btn_icon !== 'none' && (() => {
                                                if (block.btn_icon === 'arrow-right') return <span>→</span>;
                                                if (block.btn_icon === 'download') return <span>↓</span>;
                                                if (block.btn_icon === 'external-link') return <span>↗</span>;
                                                if (block.btn_icon === 'mail') return <span>✉</span>;
                                                return null;
                                            })()}
                                        </a>
                                    </div>
                                )}

                            </div>
                        </div>
                    );
                })()}
                {block.type === 'dynamic_layout' && (
                    <div 
                        className={`p-8 flex flex-col gap-4 items-center justify-center min-h-[180px] relative ${getSpacingClass(block)}`}
                        style={getBlockStyle(block)}
                    >
                        {block.bg_image && (
                            <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-lg"></div>
                        )}
                        <div className="relative z-10 flex flex-col gap-3 items-center w-full">
                            {block.icon && block.icon !== 'none' && (() => {
                                const IconComponent = (LucideIcons as any)[block.icon];
                                if (IconComponent) {
                                    return <IconComponent className="size-8 text-pink-650 drop-shadow-xs" />;
                                }
                                return null;
                            })()}
                            {block.title && (
                                <h3 className="text-base sm:text-lg font-bold tracking-tight text-center drop-shadow-xs">
                                    {block.title}
                                </h3>
                            )}
                            {block.custom_image_url && (
                                <div className="w-full max-w-[200px] my-1 rounded-lg overflow-hidden border shadow-sm">
                                    <img src={block.custom_image_url} alt="Custom" className="w-full h-auto object-cover" />
                                </div>
                            )}
                            {block.text_lines?.map((line: any, idx: number) => (
                                <p
                                    key={idx}
                                    style={{ color: line.color }}
                                    className={`text-center max-w-md break-words ${line.size || 'text-xs'} ${line.weight === 'bold' ? 'font-bold' : line.weight === 'light' ? 'font-light' : 'font-normal'}`}
                                >
                                    {line.text}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
                {block.type === 'flexible_layout' && (
                    <div 
                        className={`p-8 flex flex-col gap-4 items-center justify-center min-h-[120px] relative ${getSpacingClass(block)}`}
                        style={getBlockStyle(block)}
                    >
                        {block.bg_image && (
                            <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-lg"></div>
                        )}
                        <div className="relative z-10 flex flex-col gap-4 items-center w-full animate-none">
                            {block.items?.map((item: any, idx: number) => {
                                if (item.type === 'text') {
                                    return (
                                        <p
                                            key={item.id || idx}
                                            style={{ color: item.color, fontFamily: item.font_family || undefined }}
                                            className={`max-w-md break-words ${item.font_size || 'text-sm'} ${item.weight === 'bold' ? 'font-bold' : item.weight === 'light' ? 'font-light' : 'font-normal'} text-${item.align || 'center'} w-full whitespace-pre-wrap`}
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
                                            <div className={`overflow-hidden border shadow-sm ${
                                                item.image_size === 'small' ? 'max-w-[150px]' :
                                                item.image_size === 'medium' ? 'max-w-[320px]' :
                                                item.image_size === 'large' ? 'max-w-[500px]' : 'w-full'
                                            } ${item.radius || 'rounded-xl'}`}>
                                                <img src={item.url} alt="Uploaded block element" className="w-full h-auto object-cover" />
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
                                            <div className={`overflow-hidden border shadow-sm ${
                                                item.video_size === 'small' ? 'max-w-[150px]' :
                                                item.video_size === 'medium' ? 'max-w-[320px]' :
                                                item.video_size === 'large' ? 'max-w-[500px]' : 'w-full'
                                            } rounded-xl`}>
                                                <video 
                                                    src={item.video_url} 
                                                    controls 
                                                    autoPlay={item.autoplay} 
                                                    muted={item.autoplay} 
                                                    loop
                                                    className="w-full h-auto"
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
                                                className={`inline-flex items-center justify-center font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md ${
                                                    item.btn_size === 'small' ? 'px-4 py-2 text-xs' :
                                                    item.btn_size === 'large' ? 'px-8 py-3.5 text-base' : 'px-6 py-2.5 text-sm'
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
                {block.type === 'hero' && (() => {
                    const elements = block.hero_elements && block.hero_elements.length > 0 ? block.hero_elements : null;
                    const imgSizeMap: any = { small: 'max-w-[120px]', medium: 'max-w-[200px]', large: 'max-w-[300px]', full: 'w-full' };
                    const btnSizeMap: any = { small: 'px-3 py-1 text-[9px]', medium: 'px-4 py-2 text-[10px]', large: 'px-6 py-2.5 text-xs' };

                    return (
                        <div className={`p-8 text-center bg-gradient-to-tr ${getBgClass(block, 'from-indigo-650 to-purple-600')} flex flex-col gap-3.5 items-center justify-center min-h-[200px]`}
                            style={block.bg_image ? { backgroundImage: `url(${block.bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                        >
                            {elements ? elements.map((el: any, idx: number) => {
                                const alignCls = el.align === 'left' ? 'self-start text-left' : el.align === 'right' ? 'self-end text-right' : 'self-center text-center';
                                if (el.type === 'text') {
                                    return (
                                        <p key={el.id || idx} style={{ color: el.color, fontSize: `${el.font_size_px || 16}px`, fontWeight: el.font_weight || '400', fontFamily: el.font_family || undefined, textAlign: (el.align || 'center') as any }} className={`max-w-sm break-words leading-snug ${alignCls} w-full`}>
                                            {el.content}
                                        </p>
                                    );
                                } else if (el.type === 'image' && el.url) {
                                    return (
                                        <div key={el.id || idx} className={`w-full flex ${el.align === 'left' ? 'justify-start' : el.align === 'right' ? 'justify-end' : 'justify-center'}`}>
                                            <div className={`overflow-hidden border-2 border-white/20 shadow-lg ${el.width_px ? '' : (imgSizeMap[el.image_size] || 'max-w-[200px]')} ${el.radius || 'rounded-xl'}`}
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
                                            <div className={`overflow-hidden border-2 border-white/20 shadow-lg ${el.width_px ? '' : (imgSizeMap[el.video_size] || 'max-w-[200px]')} rounded-xl`}
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
                                            <button type="button" className={`${el.btn_radius || 'rounded-full'} ${btnSizeMap[el.btn_size] || btnSizeMap.medium} font-bold shadow-xs mt-1`} style={{ backgroundColor: el.btn_bg_color || '#fff', color: el.btn_text_color || '#1f2937' }}>
                                                {el.btn_text || 'Button'}
                                            </button>
                                        </div>
                                    );
                                }
                                return null;
                            }) : (
                                <>
                                    <h2 style={{ color: block.title_color }} className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug drop-shadow-xs">{block.title || 'Welcome'}</h2>
                                    <p style={{ color: block.subtitle_color }} className="text-xs opacity-85 max-w-sm">{block.subtitle}</p>
                                    {block.hero_text_lines?.map((line: any, i: number) => (
                                        <p key={i} style={{ color: line.color }} className={`text-center max-w-xs break-words ${line.size || 'text-xs'} ${line.weight === 'bold' ? 'font-bold' : line.weight === 'light' ? 'font-light' : 'font-normal'}`}>{line.text}</p>
                                    ))}
                                    {block.cta_text && <button type="button" className="rounded-full px-4 py-2 bg-white text-neutral-900 font-bold text-[10px] mt-1 shadow-xs">{block.cta_text}</button>}
                                </>
                            )}
                        </div>
                    );
                })()}
                {block.type === 'text' && (
                    <div className={`p-6 text-neutral-800 ${getBgClass(block, 'bg-white')} flex flex-col gap-2`} style={{ textAlign: (block.align || 'center') as any }}>
                        {block.title && <h3 className="text-sm font-bold text-neutral-900">{block.title}</h3>}
                        <p className="text-[11px] leading-relaxed text-neutral-600 whitespace-pre-wrap">{block.content}</p>
                    </div>
                )}
                {block.type === 'swiper' && (
                    <div className="p-6 bg-white flex flex-col gap-3 items-center">
                        {block.title && <h3 className="text-xs font-bold text-neutral-900 text-center uppercase tracking-wider w-full">{block.title}</h3>}
                        <div className={`flex gap-2.5 overflow-x-auto pb-2 select-none w-full ${block.media_width || 'max-w-full'}`}>
                            {block.images?.map((url, i) => (
                                <div key={i} className={`rounded-lg overflow-hidden shrink-0 bg-neutral-200 border relative ${block.media_height || 'aspect-square h-24'}`}>
                                    <img src={url} alt="slide" className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded-sm">{i+1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {block.type === 'video' && (
                    <div className="p-6 bg-neutral-50 flex flex-col gap-3 items-center">
                        {block.title && <h3 className="text-xs font-bold text-neutral-900 text-center uppercase tracking-wider w-full">{block.title}</h3>}
                        <div className={`${block.media_width || 'w-full'} ${block.media_height || 'aspect-video'} rounded-lg bg-neutral-950 flex items-center justify-center text-white overflow-hidden relative`}>
                            {block.video_url && block.video_url.match(/\.(mp4|webm)$/i) ? (
                                <video src={block.video_url} className="w-full h-full object-cover" autoPlay={block.autoplay} muted loop />
                            ) : (
                                <Play className="size-8 text-neutral-400" />
                            )}
                        </div>
                    </div>
                )}
                {block.type === 'links' && (
                    <div className="p-6 bg-white flex flex-col gap-3">
                        {block.title && <h3 className="text-xs font-bold text-neutral-900 text-center">{block.title}</h3>}
                        <div className={`grid gap-2 max-w-sm mx-auto w-full ${block.grid_columns ? `grid-cols-${block.grid_columns}` : 'grid-cols-1'}`}>
                            {block.links?.map((link, i) => (
                                <div key={i} className="px-4 py-2 border rounded-full text-[10px] font-bold text-neutral-800 bg-neutral-50 flex items-center justify-center gap-2">
                                    <MapPin className="size-3 text-neutral-400" /> <span>{link.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {block.type === 'icons_grid' && (
                    <div className="p-6 bg-stone-50 flex flex-col gap-4">
                        {block.title && <h3 className="text-xs font-bold text-neutral-900 text-center uppercase tracking-wider">{block.title}</h3>}
                        <div className={`grid gap-3 ${gridColsClass}`}>
                            {block.features?.map((feat, i) => (
                                <div key={i} className="p-3 border rounded-xl bg-white flex flex-col gap-1">
                                    <Sparkles className="size-4 text-indigo-500 mb-1" />
                                    <h4 className="text-[10px] font-bold text-neutral-900">{feat.title}</h4>
                                    <p className="text-[9px] text-neutral-500 leading-normal">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {block.type === 'form' && (
                    <div className="p-6 bg-white flex flex-col gap-3">
                        <h3 className="text-sm font-bold text-center text-neutral-900">{block.title || 'Contact'}</h3>
                        <div className="border border-neutral-150 p-4 rounded-xl flex flex-col gap-2 bg-neutral-50/50">
                            <div className="h-8 border rounded bg-white text-[9px] text-neutral-400 px-2 flex items-center select-none">Name</div>
                            <div className="h-8 border rounded bg-white text-[9px] text-neutral-400 px-2 flex items-center select-none">Email</div>
                            {block.form_type === 'contact' && <div className="h-8 border rounded bg-white text-[9px] text-neutral-400 px-2 flex items-center select-none">Subject</div>}
                            <div className="h-10 border rounded bg-white text-[9px] text-neutral-400 p-2 select-none">Message...</div>
                            <div className="w-full py-1.5 rounded bg-neutral-900 text-white text-[9px] font-bold text-center mt-1">Submit</div>
                        </div>
                    </div>
                )}
                {block.type === 'faq' && (
                    <div className="p-6 bg-white flex flex-col gap-3">
                        {block.title && <h3 className="text-sm font-bold text-center text-neutral-900">{block.title}</h3>}
                        <div className="flex flex-col gap-2">
                            {block.items?.map((item, i) => (
                                <div key={i} className="border rounded-xl p-3 bg-neutral-50/50">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-800">
                                        <HelpCircle className="size-3.5 text-amber-500 shrink-0" />
                                        {item.question}
                                    </div>
                                    <p className="text-[9px] text-neutral-500 mt-1.5 ml-5.5 leading-relaxed">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {block.type === 'testimonials' && (
                    <div className="p-6 bg-stone-50 flex flex-col gap-3">
                        {block.title && <h3 className="text-sm font-bold text-center text-neutral-900">{block.title}</h3>}
                        <div className="flex flex-col gap-2.5">
                            {block.items?.map((item, i) => (
                                <div key={i} className="border rounded-xl p-3.5 bg-white flex flex-col gap-1.5">
                                    <div className="flex gap-0.5">{Array.from({ length: Number(item.rating) || 5 }).map((_, s) => <Star key={s} className="size-3 text-amber-400 fill-amber-400" />)}</div>
                                    <p className="text-[10px] text-neutral-600 italic leading-relaxed">"{item.quote}"</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="size-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[8px] font-bold">{item.name?.charAt(0)}</div>
                                        <div>
                                            <div className="text-[9px] font-bold text-neutral-800">{item.name}</div>
                                            <div className="text-[8px] text-neutral-400">{item.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {block.type === 'countdown' && (
                    <div className={`p-8 text-center bg-gradient-to-tr ${getBgClass(block, 'from-neutral-900 to-neutral-800')} text-white flex flex-col gap-3 items-center justify-center min-h-[160px]`}>
                        <h3 className="text-xs font-bold uppercase tracking-wider">{block.title || 'Event Begins In'}</h3>
                        <CountdownTimer targetDate={block.event_date} />
                    </div>
                )}
                {block.type === 'map' && (
                    <div className="p-6 bg-white flex flex-col gap-3 items-center">
                        {block.title && <h3 className="text-xs font-bold text-neutral-900 text-center uppercase tracking-wider w-full">{block.title}</h3>}
                        {block.map_embed_url ? (
                            <div className="w-full aspect-video rounded-lg overflow-hidden border bg-neutral-100 shadow-2xs">
                                <iframe src={block.map_embed_url} className="w-full h-full border-0 pointer-events-none" title="Embedded Map" />
                            </div>
                        ) : (
                            <div className="w-full p-4 border border-dashed rounded-lg flex flex-col items-center justify-center text-neutral-450 gap-1 text-[10px]">
                                <MapPin className="size-4 text-neutral-300" />
                                <span>Google Map iframe preview placeholder</span>
                            </div>
                        )}
                        {block.map_link && (
                            <a href={block.map_link} target="_blank" rel="noreferrer" className="mt-1 px-3.5 py-1.5 bg-neutral-950 text-white rounded-full font-bold text-[9px] uppercase flex items-center gap-1 shadow-xs">
                                <MapPin className="size-3" /> Open Maps Location
                            </a>
                        )}
                    </div>
                )}

                {block.type === 'gallery' && (
                    <div className="py-8 px-4 bg-white">
                        {block.title && <h3 className="text-xl font-bold text-neutral-900 text-center mb-6">{block.title}</h3>}
                        <div className={block.layout === 'masonry' ? 'columns-2 gap-4 space-y-4' : 'grid grid-cols-2 gap-4'}>
                            {block.images?.map((img: string, i: number) => (
                                <div key={i} className={`overflow-hidden rounded-xl ${block.layout === 'masonry' ? 'break-inside-avoid' : 'aspect-square'}`}>
                                    <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {block.type === 'pricing' && (
                    <div className="py-10 px-4 bg-neutral-50 flex flex-col gap-6">
                        {block.title && <h3 className="text-2xl font-bold text-center text-neutral-900">{block.title}</h3>}
                        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
                            {block.plans?.map((plan: any, i: number) => (
                                <div key={i} className="bg-white border rounded-2xl p-6 shadow-xl flex flex-col gap-4 text-center">
                                    <h4 className="text-lg font-bold text-neutral-800">{plan.name}</h4>
                                    <div className="text-3xl font-black text-pink-600">{plan.price}</div>
                                    <ul className="flex flex-col gap-2 my-2 text-sm text-neutral-600 text-left">
                                        {plan.features?.map((f: string, j: number) => (
                                            <li key={j} className="flex items-center gap-2"><Sparkles className="size-3 text-pink-500" /> {f}</li>
                                        ))}
                                    </ul>
                                    <a href={plan.button_link} className="bg-neutral-900 text-white font-bold py-3 rounded-full hover:bg-neutral-800 transition-colors w-full inline-block">
                                        {plan.button_text}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {block.type === 'cta' && (
                    <div className="py-12 bg-white flex flex-col md:flex-row items-center gap-6 px-6">
                        {block.image_url && block.align === 'left' && (
                            <img src={block.image_url} className="w-full md:w-1/2 aspect-video object-cover rounded-2xl shadow-lg" alt="CTA" />
                        )}
                        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
                            <h3 className="text-3xl font-black text-neutral-900 leading-tight">{block.title}</h3>
                            <p className="text-neutral-500 leading-relaxed text-sm">{block.content}</p>
                            <a href={block.cta_link} className="bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition-colors self-center md:self-start mt-2 inline-block shadow-lg shadow-pink-500/30">
                                {block.cta_text}
                            </a>
                        </div>
                        {block.image_url && block.align === 'right' && (
                            <img src={block.image_url} className="w-full md:w-1/2 aspect-video object-cover rounded-2xl shadow-lg mt-6 md:mt-0" alt="CTA" />
                        )}
                    </div>
                )}
                {block.type === 'html' && (
                    <div className="w-full overflow-hidden" dangerouslySetInnerHTML={{ __html: block.html_content || '' }} />
                )}
                {block.type === 'profile' && (
                    <div className="py-10 px-4 bg-white">
                        {block.title && <h3 className="text-2xl font-bold text-center text-neutral-900 mb-8">{block.title}</h3>}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-lg mx-auto">
                            {block.profiles?.map((prof: any, i: number) => (
                                <div key={i} className="flex flex-col items-center text-center gap-3">
                                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                                        <img src={prof.image} className="w-full h-full object-cover" alt={prof.name} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-neutral-900 text-sm leading-tight">{prof.name}</h4>
                                        <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wide">{prof.role}</span>
                                    </div>
                                    {prof.social && (
                                        <a href={prof.social} className="text-neutral-400 hover:text-pink-600 transition-colors text-[10px]">Follow</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {block.type === 'freeform' && (
                    <div className="relative w-full h-[600px] bg-white overflow-hidden" style={{ minHeight: '600px' }}>
                        {block.items?.map((item: any, i: number) => {
                            const isSelected = activeSectionId === block.id;
                            
                            // Render specific item types
                            let innerContent = null;
                            if (item.type === 'text') {
                                innerContent = (
                                    <div style={{ color: item.color, fontSize: `${item.fontSize}px`, fontWeight: item.fontWeight, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                        {item.content}
                                    </div>
                                );
                            } else if (item.type === 'image') {
                                innerContent = (
                                    <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: `${item.radius || 0}px` }} alt="Canvas element" draggable="false" />
                                );
                            } else if (item.type === 'icon') {
                                const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Star;
                                innerContent = (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                                        <IconComponent style={{ width: '100%', height: '100%' }} />
                                    </div>
                                );
                            }
                            
                            // If in editor mode, wrap with Rnd to make it draggable/resizable
                            // Note: Since onChange isn't passed down to DevicePreview easily to save positions,
                            // we just allow visual drag/drop for preview. In a real app, you'd pass an update function.
                            if (isSelected) {
                                return (
                                    <Rnd
                                        key={i}
                                        default={{ x: item.x || 0, y: item.y || 0, width: item.w || 100, height: item.h || 100 }}
                                        bounds="parent"
                                        className="border border-dashed border-blue-400 hover:border-solid hover:border-blue-500 bg-white/10 group"
                                    >
                                        <div className="absolute -top-3 -right-3 size-6 bg-white border rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
                                            <LucideIcons.Move className="size-3 text-neutral-400" />
                                        </div>
                                        {innerContent}
                                    </Rnd>
                                );
                            }

                            // Read-only static positioning for preview mode or published site
                            return (
                                <div key={i} style={{ position: 'absolute', left: item.x, top: item.y, width: item.w, height: item.h }}>
                                    {innerContent}
                                </div>
                            );
                        })}
                    </div>
                )}
                {block.type === 'timeline' && (
                    <div className="p-6 bg-stone-50/50 flex flex-col gap-4">
                        {block.title && <h3 className="text-xs font-bold text-neutral-900 text-center uppercase tracking-wider">{block.title}</h3>}
                        <div className="relative pl-6 border-l border-neutral-200 dark:border-neutral-750 flex flex-col gap-5 max-w-sm mx-auto w-full text-left">
                            {block.items?.map((item: any, i: number) => (
                                <div key={i} className="relative flex flex-col gap-1">
                                    <div className="absolute -left-[29px] top-1 size-3 rounded-full border border-indigo-500 bg-white dark:bg-neutral-900 flex items-center justify-center">
                                        <div className="size-1 rounded-full bg-indigo-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-mono font-bold bg-indigo-50 text-indigo-700 px-1 rounded-sm dark:bg-indigo-950/40 dark:text-indigo-400">{item.time}</span>
                                        <h4 className="text-[10px] font-bold text-neutral-900">{item.title}</h4>
                                    </div>
                                    <p className="text-[9px] text-neutral-500 leading-normal pl-0.5">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`transition-all duration-300 w-full max-h-full overflow-hidden ${
            deviceType === 'mobile' 
                ? 'max-w-[340px] aspect-[9/16] border-[8px] border-neutral-950 rounded-[32px] shadow-2xl bg-white relative' 
                : deviceType === 'tablet'
                ? 'max-w-[600px] aspect-[3/4] border-[10px] border-neutral-950 rounded-[24px] shadow-2xl bg-white relative'
                : 'max-w-full h-full border border-neutral-800 rounded-xl shadow-2xl bg-white'
        }`}>
            <div className="w-full h-full flex flex-col bg-neutral-100">
                
                {deviceType === 'desktop' && (
                    <div className="bg-neutral-100 p-2.5 border-b flex items-center gap-1.5 text-neutral-400">
                        <div className="flex gap-1">
                            <span className="size-2 rounded-full bg-red-400" />
                            <span className="size-2 rounded-full bg-yellow-400" />
                            <span className="size-2 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white mx-4 rounded-md text-[9px] py-0.5 select-none font-mono text-center truncate shadow-xs">
                            invitify.com/{isInvitation ? 'mini-website' : 'business'}/{slug || 'preview'}
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="flex flex-col w-full pointer-events-none select-none">
                        
                        {pagesNav && pagesNav.length > 0 && (
                            <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                                <span className="text-sm font-black text-neutral-900">{title || 'Company'}</span>
                                <div className="flex gap-4">
                                    {pagesNav.map(nav => (
                                        <span key={nav.slug} className={`text-[10px] font-bold uppercase tracking-wider ${nav.active ? 'text-blue-600' : 'text-neutral-500'}`}>
                                            {nav.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {blocks.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-neutral-450">
                                <Compass className="size-8 mb-2 opacity-50" />
                                <span className="text-xs">No content blocks on this page.</span>
                            </div>
                        ) : (
                            blocks.map((block) => {
                                const isSelected = activeSectionId === block.id;
                                const isHidden = block.is_hidden;
                                return (
                                    <div key={block.id} className={`relative border-y transition-all ${isSelected ? 'border-blue-500/80 bg-blue-50/10' : 'border-transparent'} ${isHidden ? 'opacity-40 border-dashed border-red-200' : ''}`}>
                                        {isHidden && (
                                            <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider z-20">Hidden Section</span>
                                        )}
                                        {renderPreviewBlock(block)}
                                        {isSelected && (
                                            <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none z-10"></div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
