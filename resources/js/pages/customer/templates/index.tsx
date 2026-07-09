import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Sparkles, ArrowRight, Globe, Layers, Briefcase } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
    },
    {
        title: 'Browse Templates',
        href: '/customer/templates',
    },
];

interface Template {
    id: number;
    name: string;
    category: string;
    price: string | number;
    bg_gradient: string;
    default_config: any;
}

interface MiniTemplate {
    id: number;
    name: string;
    type: string;
    price: number;
    preview_image: string | null;
}

interface BusinessTemplate {
    id: number;
    name: string;
    price: number;
    preview_image: string | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PageProps {
    templates: Template[];
    miniTemplates?: MiniTemplate[];
    businessTemplates?: BusinessTemplate[];
    categories: Category[];
}

export default function TemplatesBrowse({ templates, miniTemplates = [], businessTemplates = [], categories = [] }: PageProps) {
    const [activeTab, setActiveTab] = useState<'invitations' | 'mini-websites' | 'business-websites'>('invitations');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedWebsiteCategory, setSelectedWebsiteCategory] = useState<'all' | 'invitation' | 'business'>('all');

    const categoriesList = ['all', ...categories.map(c => c.slug)];

    const getCategoryName = (slug: string) => {
        if (slug === 'all') return 'All Cards';
        const found = categories.find(c => c.slug === slug);
        return found ? found.name : slug.replace('_', ' ');
    };

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    const filteredWebsites = selectedWebsiteCategory === 'all'
        ? miniTemplates
        : miniTemplates.filter(w => w.type === selectedWebsiteCategory);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Browse Templates</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&display=swap" rel="stylesheet" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        Choose Your Theme Design <Sparkles className="size-6 text-amber-500" />
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Select a template structure, customize the content live, and publish your design.
                    </p>
                </div>

                {/* Formats Tabs */}
                <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-px overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('invitations')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'invitations'
                                ? 'border-blue-600 text-blue-650 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-neutral-205'
                        }`}
                    >
                        <Layers className="size-4" />
                        Invitation Cards ({templates.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('mini-websites')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'mini-websites'
                                ? 'border-blue-600 text-blue-650 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-neutral-205'
                        }`}
                    >
                        <Globe className="size-4" />
                        Mini Websites ({miniTemplates.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('business-websites')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'business-websites'
                                ? 'border-blue-600 text-blue-650 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-neutral-205'
                        }`}
                    >
                        <Briefcase className="size-4" />
                        Business Websites ({businessTemplates.length})
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === 'invitations' && (
                    <>
                        {/* Categories Tabs Selector */}
                        <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto scrollbar-none">
                            {categoriesList.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-all -mb-px whitespace-nowrap ${
                                        selectedCategory === cat
                                            ? 'border-blue-600 text-blue-650 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    {getCategoryName(cat)}
                                </button>
                            ))}
                        </div>

                        {/* Invitation Cards Grid */}
                        {filteredTemplates.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                                <span className="text-neutral-400">No card templates available.</span>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredTemplates.map((t) => (
                                    <div
                                        key={t.id}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs transition-all hover:shadow-md dark:border-neutral-850 dark:bg-neutral-900"
                                    >
                                        {/* Card Graphic Preview */}
                                        <div
                                            className={`relative flex aspect-video flex-col items-center justify-center p-6 bg-gradient-to-tr ${t.bg_gradient} border-b border-neutral-100 dark:border-neutral-850 overflow-hidden`}
                                            style={{
                                                fontFamily: t.default_config.font_style === 'vibes' ? "'Great Vibes', cursive" : t.default_config.font_style === 'cinzel' ? "'Cinzel', serif" : t.default_config.font_style === 'montserrat' ? "'Montserrat', sans-serif" : "'Playfair Display', serif",
                                                backgroundImage: t.default_config.layout_style === 'photo-bg' && t.default_config.image_url ? `url(${t.default_config.image_url})` : undefined,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        >
                                            {t.default_config.layout_style === 'photo-bg' && t.default_config.image_url && (
                                                <div className="absolute inset-0 bg-black/45" />
                                            )}

                                            {t.default_config.layout_style === 'split-hero' && (
                                                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-neutral-200/90 dark:bg-neutral-800/90 border-l border-neutral-200 flex items-center justify-center text-[8px] font-bold text-neutral-400 select-none">IMAGE</div>
                                            )}

                                            <div 
                                                className="text-center pointer-events-none scale-85 opacity-90 z-10 relative"
                                                style={{ color: t.default_config.layout_style === 'photo-bg' && t.default_config.image_url ? '#ffffff' : undefined }}
                                            >
                                                <p className="text-[10px] tracking-wider uppercase font-semibold opacity-70">
                                                    {t.default_config.title}
                                                </p>
                                                <p className="text-lg font-bold my-1 truncate max-w-[180px]">
                                                    {t.default_config.guest_of_honor}
                                                </p>
                                                <p className="text-[8px] opacity-70">
                                                    {t.default_config.date}
                                                </p>
                                            </div>
                                            <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs z-20">
                                                ₹{parseFloat(String(t.price)).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Card Details */}
                                        <div className="flex flex-1 flex-col justify-between p-5">
                                            <div>
                                                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400 transition-colors">
                                                    {t.name}
                                                </h3>
                                                <p className="mt-1 text-xs capitalize text-neutral-400 font-medium">
                                                    Category: {t.category.replace('_', ' ')}
                                                </p>
                                            </div>

                                            <Link
                                                href={`/templates/${t.id}/customize`}
                                                className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                                            >
                                                Customize <ArrowRight className="size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'mini-websites' && (
                    <>
                        {/* Mini Website Category Filter */}
                        <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto scrollbar-none">
                            {(['all', 'invitation', 'business'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedWebsiteCategory(cat)}
                                    className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-all -mb-px whitespace-nowrap ${
                                        selectedWebsiteCategory === cat
                                            ? 'border-blue-600 text-blue-650 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    {cat === 'all' 
                                        ? 'All Websites' 
                                        : cat === 'invitation' 
                                            ? 'Event Invitations' 
                                            : 'Business Sites'
                                    }
                                </button>
                            ))}
                        </div>

                        {/* Mini Websites Grid */}
                        {filteredWebsites.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                                <span className="text-neutral-400">No mini website templates available.</span>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredWebsites.map((w) => (
                                    <div
                                        key={w.id}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs transition-all hover:shadow-md dark:border-neutral-850 dark:bg-neutral-900"
                                    >
                                        <div className="relative aspect-video w-full overflow-hidden border-b border-neutral-150 dark:border-neutral-850/60 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                                            {w.preview_image ? (
                                                <img
                                                    src={w.preview_image}
                                                    alt={w.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-blue-950/20 flex flex-col items-center justify-center p-6 text-center select-none">
                                                    <Globe className="size-10 text-indigo-500/40 dark:text-indigo-400/40 mb-3 animate-pulse" />
                                                    <p className="text-sm font-serif font-bold text-neutral-850 dark:text-neutral-200">
                                                        {w.name}
                                                    </p>
                                                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-widest font-semibold">
                                                        {w.type === 'invitation' ? 'Event Invitation' : 'Business Site'} Template
                                                    </span>
                                                </div>
                                            )}

                                            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-neutral-950/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xs shadow-md">
                                                ₹{parseFloat(String(w.price)).toFixed(2)}<span className="text-[10px] font-normal text-neutral-300">/day</span>
                                            </span>
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between p-5">
                                            <div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400 transition-colors truncate">
                                                        {w.name}
                                                    </h3>
                                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                                        w.type === 'invitation'
                                                            ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400'
                                                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                                                    }`}>
                                                        {w.type === 'invitation' ? 'Event' : 'Business'}
                                                    </span>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/customer/mini-websites?template_id=${w.id}`}
                                                className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                                            >
                                                Customize Website <ArrowRight className="size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'business-websites' && (
                    <>
                        {/* Business Websites Grid */}
                        {businessTemplates.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                                <span className="text-neutral-400">No business website templates available.</span>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {businessTemplates.map((w) => (
                                    <div
                                        key={w.id}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs transition-all hover:shadow-md dark:border-neutral-850 dark:bg-neutral-900"
                                    >
                                        <div className="relative aspect-video w-full overflow-hidden border-b border-neutral-150 dark:border-neutral-850/60 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                                            {w.preview_image ? (
                                                <img
                                                    src={w.preview_image}
                                                    alt={w.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 flex flex-col items-center justify-center p-6 text-center select-none">
                                                    <Briefcase className="size-10 text-blue-500/40 dark:text-blue-400/40 mb-3 animate-pulse" />
                                                    <p className="text-sm font-serif font-bold text-neutral-850 dark:text-neutral-200">
                                                        {w.name}
                                                    </p>
                                                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-widest font-semibold">
                                                        Business Website Template
                                                    </span>
                                                </div>
                                            )}

                                            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-neutral-950/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xs shadow-md">
                                                ₹{parseFloat(String(w.price)).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between p-5">
                                            <div>
                                                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400 transition-colors truncate">
                                                    {w.name}
                                                </h3>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Multi-page responsive professional business layout.
                                                </p>
                                            </div>

                                            <Link
                                                href={`/customer/business-websites?template_id=${w.id}`}
                                                className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                                            >
                                                Customize & Buy Site <ArrowRight className="size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
