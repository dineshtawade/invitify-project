import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { 
    ArrowLeft, Globe, Sparkles, Smartphone, Tablet, Laptop, 
    ShieldCheck, CheckCircle2, ExternalLink
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import MiniWebsitePreview from '@/Components/MiniWebsitePreview';

interface PageProps {
    template: {
        id: number;
        name: string;
        type: 'invitation' | 'business';
        price: number | string;
        preview_image: string | null;
        config: any;
    };
    customizeUrl: string;
}

// developed by dinesh tawade
export default function WebsiteTemplatePreview({ template, customizeUrl }: PageProps) {
    const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

    const parsedConfig = typeof template.config === 'string'
        ? (() => {
            try { return JSON.parse(template.config); } catch(e) { return {}; }
        })()
        : (template.config || {});

    const hasHtml = Boolean(parsedConfig?.html);
    const hasPages = Boolean(parsedConfig?.pages && parsedConfig.pages.length > 0);

    return (
        <>
            <Head>
                <title>{`${template.name} - Invitation Website Live Preview | Invitify`}</title>
                <meta name="description" content={`Preview ${template.name} invitation website on Invitify. Customize interactive RSVP, Google Maps, event timeline, and photo gallery.`} />
            </Head>

            <div className="min-h-screen bg-[#0e1013] text-[#f2efe9] flex flex-col justify-between selection:bg-[#3d5644] selection:text-white">
                
                {/* Top Control Bar */}
                <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#16181c]/95 border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
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
                                <span className="text-[10px] text-white/50 -mt-1 font-sans">Website Preview</span>
                            </div>
                        </div>
                        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-serif font-bold text-sm sm:text-base text-white truncate max-w-[180px] sm:max-w-xs">
                                    {template.name}
                                </h1>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider hidden sm:inline-block">
                                    {template.type === 'invitation' ? 'Event Website' : 'Business Site'}
                                </span>
                            </div>
                            <p className="text-[11px] text-white/60 font-sans hidden sm:block">
                                Live Interactive Demo • Mobile, Tablet & Desktop Responsive
                            </p>
                        </div>
                    </div>

                    {/* Center Device Switcher */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            type="button"
                            onClick={() => setDevice('mobile')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                device === 'mobile'
                                    ? 'bg-[#3d5644] text-white shadow-sm'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Smartphone className="size-3.5" /> Mobile
                        </button>
                        <button
                            type="button"
                            onClick={() => setDevice('tablet')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                device === 'tablet'
                                    ? 'bg-[#3d5644] text-white shadow-sm'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Tablet className="size-3.5" /> Tablet
                        </button>
                        <button
                            type="button"
                            onClick={() => setDevice('desktop')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                device === 'desktop'
                                    ? 'bg-[#3d5644] text-white shadow-sm'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Laptop className="size-3.5" /> Desktop
                        </button>
                    </div>

                    {/* Right CTA */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <span className="text-[10px] uppercase font-bold text-white/50 block">Pricing</span>
                            <span className="font-serif font-extrabold text-base text-emerald-400">
                                {template.price && Number(template.price) > 0 ? `₹${Number(template.price).toFixed(2)}/day` : 'Free to Customize'}
                            </span>
                        </div>
                        <a
                            href={customizeUrl}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3d5644] to-[#2c3e2e] hover:from-[#476550] hover:to-[#354b38] text-white text-xs sm:text-sm font-bold font-serif shadow-lg hover:shadow-emerald-900/40 hover:scale-105 transition-all flex items-center gap-2 border border-emerald-400/20 active:scale-95"
                        >
                            <Globe className="size-4 text-emerald-300 animate-pulse" />
                            <span>Customize & Buy</span>
                        </a>
                    </div>
                </header>

                {/* Preview Viewport Container */}
                <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden relative">
                    
                    {/* Device Bezel Frame */}
                    <div
                        className={`transition-all duration-300 bg-white overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative ${
                            device === 'mobile'
                                ? 'w-[390px] max-w-[95vw] h-[844px] max-h-[85vh] rounded-[44px] border-[10px] border-[#22262c]'
                                : device === 'tablet'
                                    ? 'w-[768px] max-w-[96vw] h-[850px] max-h-[85vh] rounded-[32px] border-[10px] border-[#22262c]'
                                    : 'w-full max-w-6xl h-[850px] max-h-[85vh] rounded-2xl border-2 border-white/10'
                        }`}
                    >
                        {/* Mobile Speaker / Notch */}
                        {device === 'mobile' && (
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#22262c] rounded-full z-30 flex items-center justify-center pointer-events-none">
                                <div className="w-10 h-1 bg-neutral-700 rounded-full" />
                            </div>
                        )}

                        {/* Live Site Renderer */}
                        <div className="w-full h-full overflow-y-auto">
                            {hasHtml ? (
                                <iframe
                                    srcDoc={parsedConfig.html}
                                    title={template.name}
                                    className="w-full h-full border-none bg-white"
                                    sandbox="allow-scripts allow-same-origin allow-forms"
                                />
                            ) : hasPages ? (
                                <div className="w-full min-h-full bg-white">
                                    <MiniWebsitePreview config={parsedConfig} />
                                </div>
                            ) : template.preview_image ? (
                                <img
                                    src={template.preview_image}
                                    alt={template.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-neutral-600 bg-neutral-50">
                                    <Globe className="size-16 text-[#3d5644] mb-3 animate-pulse" />
                                    <h3 className="font-serif font-bold text-xl text-[#3e3832]">{template.name}</h3>
                                    <p className="text-sm mt-1 text-neutral-500">Interactive live demo preview is ready for customization.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-white/50 text-center mt-3 hidden sm:flex items-center gap-1.5">
                        <ShieldCheck className="size-3.5 text-emerald-400" />
                        Includes Live RSVP, Google Maps Location, Countdown Timer & Custom Domain Sharing
                    </p>
                </main>

                {/* Bottom Bar on Mobile */}
                <footer className="w-full sm:hidden sticky bottom-0 z-50 bg-[#16181c]/95 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between gap-3 shadow-2xl">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-white/50 block">Price</span>
                        <span className="font-serif font-extrabold text-sm text-emerald-400">
                            {template.price && Number(template.price) > 0 ? `₹${Number(template.price).toFixed(2)}/day` : 'Free to Customize'}
                        </span>
                    </div>
                    <a
                        href={customizeUrl}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3d5644] to-[#2c3e2e] text-white text-xs font-bold font-serif shadow-lg flex items-center justify-center gap-2"
                    >
                        <Globe className="size-4 text-emerald-300" />
                        <span>Customize & Buy</span>
                    </a>
                </footer>

            </div>
        </>
    );
}
