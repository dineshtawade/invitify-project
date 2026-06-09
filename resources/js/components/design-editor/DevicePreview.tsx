import { Play, MapPin, Sparkles, HelpCircle, Star, Compass } from 'lucide-react';
import type { Block } from './types';

interface DevicePreviewProps {
    blocks: Block[];
    activeSectionId: string | null;
    deviceType: 'desktop' | 'mobile';
    title?: string;
    slug?: string;
    pagesNav?: { slug: string; title: string; active: boolean }[];
}

export function DevicePreview({ blocks, activeSectionId, deviceType, title, slug, pagesNav }: DevicePreviewProps) {
    
    const renderPreviewBlock = (block: Block) => {
        const blockStyle = block.font_family ? { fontFamily: block.font_family } : {};
        const gridColsClass = block.grid_columns 
            ? `grid-cols-${block.grid_columns}` 
            : 'grid-cols-2';

        return (
        <div style={blockStyle}>
            {block.type === 'hero' && (
                <div className={`p-8 text-center bg-gradient-to-tr ${block.bg_color || 'from-indigo-650 to-purple-600'} text-white flex flex-col gap-3.5 items-center justify-center min-h-[200px]`}>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug drop-shadow-xs">{block.title || 'Welcome'}</h2>
                    <p className="text-xs opacity-85 max-w-sm">{block.subtitle}</p>
                    {block.cta_text && <button type="button" className="rounded-full px-4 py-2 bg-white text-neutral-900 font-bold text-[10px] mt-1">{block.cta_text}</button>}
                </div>
            )}
            {block.type === 'text' && (
                <div className={`p-6 text-neutral-800 ${block.bg_color || 'bg-white'} flex flex-col gap-2`} style={{ textAlign: block.align as any }}>
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
        </div>
        );
    };

    return (
        <div className={`transition-all duration-300 w-full overflow-hidden ${
            deviceType === 'mobile' 
                ? 'max-w-[340px] aspect-[9/16] border-[8px] border-neutral-950 rounded-[32px] shadow-2xl bg-white relative' 
                : 'max-w-full h-full min-h-[60vh] border border-neutral-800 rounded-xl shadow-2xl bg-white'
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
                            invitify.com/sites/{slug || 'preview'}
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
                            <div className="py-12 flex flex-col items-center justify-center text-neutral-400">
                                <Compass className="size-8 mb-2 opacity-50" />
                                <span className="text-xs">No content blocks on this page.</span>
                            </div>
                        ) : (
                            blocks.map((block) => {
                                const isSelected = activeSectionId === block.id;
                                return (
                                    <div key={block.id} className={`relative border-y transition-all ${isSelected ? 'border-blue-500/80 bg-blue-50/10' : 'border-transparent'}`}>
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
