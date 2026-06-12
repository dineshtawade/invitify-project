import { useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Mail, Sparkles, Star, Bell, ArrowRight, Layers, Globe, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
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

interface DashboardMiniWebsite {
    id: number;
    type: 'invitation' | 'business';
    title: string;
    slug: string;
    theme: string;
    is_published: boolean;
    rsvps_count: number;
    contact_submissions_count: number;
}

interface PageProps {
    templates?: Template[];
    miniWebsites?: DashboardMiniWebsite[];
}

export default function CustomerDashboard({ templates = [], miniWebsites = [] }: PageProps) {
    useEffect(() => {
        const guestDraft = localStorage.getItem('guest_draft');
        if (guestDraft) {
            try {
                const parsed = JSON.parse(guestDraft);
                localStorage.removeItem('guest_draft');
                router.post('/customer/user-templates/claim', parsed);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Customer Dashboard</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&display=swap" rel="stylesheet" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Customer Space</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Welcome to Invitify! Create invitations, customize your design templates, and track RSVP responses.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">My Invitations</p>
                                <h3 className="mt-2 text-2xl font-bold">2</h3>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <Mail className="size-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total RSVPs</p>
                                <h3 className="mt-2 text-2xl font-bold">148</h3>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Star className="size-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Notifications</p>
                                <h3 className="mt-2 text-2xl font-bold">3</h3>
                            </div>
                            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <Bell className="size-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Sparkles className="size-5 text-amber-500" /> Start a New Invitation
                        </h3>
                        <Link
                            href="/customer/templates"
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Browse Category Filters &rarr;
                        </Link>
                    </div>

                    {templates.length === 0 ? (
                        <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
                            <span className="text-sm text-neutral-400">No template designs available.</span>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {templates.map((t) => (
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
                                            <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400 transition-colors">
                                                {t.name}
                                            </h3>
                                            <p className="mt-1 text-xs capitalize text-neutral-400 font-medium">
                                                Category: {t.category.replace('_', ' ')}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/customer/templates/${t.id}/customize`}
                                            className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                                        >
                                            Customize <ArrowRight className="size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Mini Websites Section */}
                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Globe className="size-5 text-blue-500" /> My Recent Mini Websites
                        </h3>
                        <Link
                            href="/customer/mini-websites"
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Manage All Websites &rarr;
                        </Link>
                    </div>

                    {miniWebsites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900 gap-3">
                            <span className="text-neutral-400 text-sm">You haven't launched any mini-websites yet.</span>
                            <Link
                                href="/customer/mini-websites"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                            >
                                <Plus className="size-3.5" /> Create Your First Website
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left text-xs text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                                        <tr>
                                            <th scope="col" className="px-5 py-3">Website Title</th>
                                            <th scope="col" className="px-5 py-3">Type</th>
                                            <th scope="col" className="px-5 py-3">Status</th>
                                            <th scope="col" className="px-5 py-3">Inbox Submissions</th>
                                            <th scope="col" className="px-5 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                        {miniWebsites.map((w) => (
                                            <tr key={w.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                                                <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                                                    <div>{w.title}</div>
                                                    <div className="text-[10px] text-neutral-450 font-mono mt-0.5 select-all">/mini-website/{w.slug}</div>
                                                </td>
                                                <td className="px-5 py-3 capitalize">{w.type}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                        w.is_published
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                                    }`}>
                                                        {w.is_published ? 'Live' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 font-semibold text-blue-600 dark:text-blue-400">
                                                    {w.type === 'invitation'
                                                        ? `${w.rsvps_count || 0} RSVPs`
                                                        : `${w.contact_submissions_count || 0} Messages`
                                                    }
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <Link
                                                        href={`/customer/mini-websites/${w.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-bold text-neutral-700 shadow-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                    >
                                                        Edit Site
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
