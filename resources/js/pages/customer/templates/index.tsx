import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Sparkles, ArrowRight } from 'lucide-react';

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

interface PageProps {
    templates: Template[];
}

export default function TemplatesBrowse({ templates }: PageProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', 'wedding', 'birthday', 'party', 'anniversary', 'baby_shower'];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

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
                        Choose Your Invitation Theme <Sparkles className="size-6 text-amber-500" />
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Select a design, customize the text live, and purchase to download or share.
                    </p>
                </div>

                {/* Categories Tabs Selector */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-all -mb-px whitespace-nowrap ${
                                selectedCategory === cat
                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                            }`}
                        >
                            {cat === 'all' ? 'All Templates' : cat.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                {filteredTemplates.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                        <span className="text-neutral-400">No templates available in this category.</span>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTemplates.map((t) => (
                            <div
                                key={t.id}
                                className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs transition-all hover:shadow-md dark:border-neutral-850 dark:bg-neutral-900"
                            >
                                {/* Card Graphic Preview (rendered live based on theme bg_gradient) */}
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

                                    {/* Split style indicator line */}
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
                                        href={`/customer/templates/${t.id}/customize`}
                                        className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                                    >
                                        Customize <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
