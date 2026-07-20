import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    Sparkles, Plus, Edit2, Eye, Trash2, CreditCard, 
    Share2, ExternalLink, ShieldCheck, ShieldAlert,
    Copy, Check
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
    },
    {
        title: 'Digital Business Cards',
        href: '/customer/business-cards',
    },
];

interface BusinessCard {
    id: number;
    company_name: string;
    slug: string;
    theme_css: string;
    status: string;
    payment_status: string;
    created_at: string;
}

interface PageProps {
    cards: BusinessCard[];
}

export default function BusinessCardIndex({ cards = [] }: PageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [slug, setSlug] = useState('');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCompanyName(val);
        setSlug(generateSlug(val));
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/customer/business-cards', {
            company_name: companyName,
            slug: slug
        }, {
            onSuccess: () => {
                setIsCreateOpen(false);
                setCompanyName('');
                setSlug('');
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this digital business card? This action is permanent.')) {
            router.delete(`/customer/business-cards/${id}`);
        }
    };

    const copyToClipboard = (id: number, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Digital Business Cards</title>
            </Head>
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            My Digital Business Cards <Sparkles className="size-6 text-amber-500" />
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Create, customize, and manage your premium step-by-step smart digital vCards.
                        </p>
                    </div>
                    
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="size-4" /> Create Smart Card
                    </button>
                </div>

                {cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-12 text-center bg-white dark:bg-neutral-900 shadow-sm">
                        <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 p-4 text-blue-600 dark:text-blue-400 mb-4">
                            <Sparkles className="size-8 animate-pulse" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">No Business Cards Yet</h3>
                        <p className="mt-1 text-sm text-neutral-505 dark:text-neutral-400 max-w-sm">
                            Create your first smart business card to showcase your company, products, and contact details.
                        </p>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="size-4" /> Get Started Now
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {cards.map((card) => {
                            const publicUrl = `${window.location.origin}/card/${card.slug}`;
                            return (
                                <div
                                    key={card.id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {card.company_name}
                                                </h3>
                                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                                    ID: #{card.id} • Created {new Date(card.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                card.status === 'active' 
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450' 
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-450'
                                            }`}>
                                                {card.status === 'active' ? (
                                                    <ShieldCheck className="size-3" />
                                                ) : (
                                                    <ShieldAlert className="size-3" />
                                                )}
                                                {card.status}
                                            </span>
                                        </div>
                                        
                                        <div className="mt-4 border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-950/40">
                                            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                                                <span>Payment Status</span>
                                                <span className={`font-semibold ${
                                                    card.payment_status === 'Success' 
                                                        ? 'text-emerald-600 dark:text-emerald-400' 
                                                        : 'text-amber-500'
                                                }`}>
                                                    {card.payment_status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={publicUrl}
                                                    className="w-full text-[11px] font-mono select-all bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-2 py-1 text-neutral-600 dark:text-neutral-400 focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => copyToClipboard(card.id, publicUrl)}
                                                    className="p-1.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-500"
                                                    title="Copy Link"
                                                >
                                                    {copiedId === card.id ? (
                                                        <Check className="size-3.5 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="size-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center border-t border-neutral-100 dark:border-neutral-800 divide-x divide-neutral-100 dark:divide-neutral-800">
                                        <Link
                                            href={`/customer/business-cards/${card.id}/edit`}
                                            className="flex-1 py-3 text-xs font-semibold text-neutral-700 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <Edit2 className="size-3.5" /> Edit Card
                                        </Link>
                                        
                                        <a
                                            href={`/card/${card.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-3 text-xs font-semibold text-blue-650 dark:text-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <Eye className="size-3.5" /> Preview <ExternalLink className="size-3" />
                                        </a>

                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            className="px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-50/30 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center"
                                            title="Delete Card"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Card Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Create Smart Business Card</h2>
                        <p className="text-xs text-neutral-500 mt-1">Initialize your digital card slug and company profile name.</p>
                        
                        <form onSubmit={handleCreateSubmit} className="mt-4 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                                    Company / Business Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={companyName}
                                    onChange={handleCompanyNameChange}
                                    placeholder="e.g. Acme Corporation"
                                    className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                                    URL ID (Slug Link)
                                </label>
                                <div className="mt-1 flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-55 dark:bg-neutral-950 overflow-hidden">
                                    <span className="bg-neutral-100 dark:bg-neutral-900 text-[11px] font-mono px-3 py-2.5 text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">
                                        /card/
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={slug}
                                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                                        placeholder="acme-corporation"
                                        className="w-full bg-transparent p-2.5 text-sm focus:outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-2 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
