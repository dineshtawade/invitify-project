import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import { Sparkles, MapPin, Play, Heart, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const getAnimationProps = (type?: string) => {
    switch (type) {
        case 'fade-in':
            return { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.8 } };
        case 'slide-up':
            return { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
        case 'slide-right':
            return { initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6 } };
        case 'zoom-in':
            return { initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 }, transition: { duration: 0.5 } };
        case 'bounce':
            return { initial: { opacity: 0, y: -50 }, whileInView: { opacity: 1, y: 0 }, transition: { type: 'spring', bounce: 0.5, duration: 0.8 } };
        default:
            return {};
    }
};

interface ViewerMiniWebsite {
    id: number;
    title: string;
    slug: string;
    theme: string;
    type: string;
    config: any[];
}

interface PageProps {
    website: ViewerMiniWebsite;
    previewMode?: 'draft' | 'expired' | null;
}

const pxToCqw = (px?: number | string | null, defaultPx: number = 0) => {
    const val = px !== undefined && px !== null ? Number(px) : defaultPx;
    return `${(val / 384) * 100}cqw`;
};

export default function SiteViewer({ website, previewMode }: PageProps) {
    // Handle backward compatibility for old array-based config
    const configPages = Array.isArray(website.config) 
        ? [{ id: 'home', name: 'Home', blocks: website.config }]
        : (website.config?.pages || []);
        
    const [currentPageId, setCurrentPageId] = useState(configPages[0]?.id || 'home');
    const activePage = configPages.find((p: any) => p.id === currentPageId) || configPages[0];
    const blocks = activePage?.blocks || [];
    
    // Find background block if any
    const bgBlock = blocks.find(b => b.type === 'background');
    const bgStyle = bgBlock ? (bgBlock.src ? { backgroundImage: `url(${bgBlock.src})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: bgBlock.bgColor }) : { backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #00000010 1px, transparent 1px)', backgroundColor: 'white' };
    
    const maxBottom = blocks.filter(b => b.type !== 'background').reduce((max, b) => {
        return Math.max(max, (b.y || 0) + (b.h || 100));
    }, 0);
    const dynamicHeight = Math.max(800, maxBottom + 200);

    return (
        <>
            <Head title={website.title}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
            </Head>

            {bgBlock?.celebrationType === 'confetti' && (
                <Confetti 
                    recycle={false} 
                    numberOfPieces={500} 
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }} 
                />
            )}

            <div className="min-h-screen bg-neutral-900 flex justify-center w-full">
                {/* Mobile simulator container */}
                <div 
                    className="w-full max-w-sm md:max-w-md lg:max-w-2xl bg-white relative overflow-hidden shadow-2xl"
                    style={{
                        ...bgStyle,
                        containerType: 'inline-size' as any,
                        minHeight: pxToCqw(dynamicHeight)
                    }}
                >
                    {blocks.filter(b => b.type !== 'background').map((el) => {
                        let innerContent = null;
                        
                        if (el.type === 'text') innerContent = el.content;
                        else if (el.type === 'image') innerContent = <img src={el.src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: pxToCqw(el.borderRadius) }} draggable="false" />;
                        else if (el.type === 'video') innerContent = <video src={el.src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: pxToCqw(el.borderRadius), pointerEvents: 'none' }} autoPlay loop muted playsInline />;
                        else if (el.type === 'button') {
                            if (el.actionType === 'page' && el.targetPageId) {
                                innerContent = (
                                    <button onClick={() => setCurrentPageId(el.targetPageId!)} style={{ width: '100%', height: '100%', backgroundColor: el.bgColor, color: el.color, borderRadius: pxToCqw(el.borderRadius), fontSize: pxToCqw(el.fontSize, 16), fontWeight: el.fontWeight, border: 'none', cursor: 'pointer' }} className="flex items-center justify-center text-center transition-transform hover:scale-105 active:scale-95">
                                        {el.content}
                                    </button>
                                );
                            } else {
                                innerContent = <a href={el.url || '#'} style={{ width: '100%', height: '100%', backgroundColor: el.bgColor, color: el.color, borderRadius: pxToCqw(el.borderRadius), fontSize: pxToCqw(el.fontSize, 16), fontWeight: el.fontWeight }} className="flex items-center justify-center text-center">{el.content}</a>;
                            }
                        }
                        else if (el.type === 'link') {
                            if (el.actionType === 'page' && el.targetPageId) {
                                innerContent = <button onClick={() => setCurrentPageId(el.targetPageId!)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: el.color || 'inherit' }} className="hover:underline">{el.content}</button>;
                            } else {
                                innerContent = <a href={el.url || '#'}>{el.content}</a>;
                            }
                        }
                        else if (el.type === 'icon') {
                            const IconComp = (LucideIcons as any)[el.iconName || 'Star'] || Star;
                            innerContent = <IconComp style={{ width: '100%', height: '100%', color: el.color }} />;
                        } else if (el.type === 'map') innerContent = <iframe src={el.src} style={{ width: '100%', height: '100%', borderRadius: pxToCqw(el.borderRadius) }} frameBorder="0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />;
                        else if (el.type === 'carousel') {
                            const imgs = el.images && el.images.length > 0 ? el.images : ['https://via.placeholder.com/300x200'];
                            innerContent = (
                                <Swiper 
                                    modules={[Autoplay, Pagination]} 
                                    autoplay={{ delay: 2500 }} 
                                    pagination={{ clickable: true }}
                                    className="w-full h-full"
                                    style={{ borderRadius: pxToCqw(el.borderRadius) }}
                                >
                                    {imgs.map((src, idx) => (
                                        <SwiperSlide key={idx}>
                                            <img src={src} className="w-full h-full object-cover" draggable="false" />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            );
                        }

                        return (
                            <motion.div
                                key={el.id}
                                className="absolute"
                                viewport={{ once: true, margin: "-50px" }}
                                {...getAnimationProps(el.animationType || bgBlock?.animationType)}
                                style={{
                                    left: `${el.x}%`,
                                    top: pxToCqw(el.y),
                                    width: el.w ? pxToCqw(el.w) : undefined,
                                    height: el.h ? pxToCqw(el.h) : undefined,
                                    zIndex: el.zIndex || 1,
                                    ...(el.type === 'text' || el.type === 'link' || el.type === 'button' ? {
                                        fontSize: pxToCqw(el.fontSize, 16),
                                        fontWeight: el.fontWeight || 'normal',
                                        fontFamily: el.fontFamily,
                                        color: el.color,
                                        textShadow: el.textShadow && el.textShadow !== 'none' ? el.textShadow : undefined,
                                        whiteSpace: 'nowrap'
                                    } : {})
                                }}
                            >
                                {innerContent}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Floating Badges */}
            {previewMode === 'draft' && (
                <div className="fixed bottom-4 left-4 bg-amber-500 text-white px-4 py-2 rounded-full font-bold shadow-lg z-[9999] text-sm flex items-center gap-2">
                    <Sparkles className="size-4" /> Previewing Draft
                </div>
            )}
        </>
    );
}
