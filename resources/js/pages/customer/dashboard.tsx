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
                    <h1 className="text-3xl font-bold tracking-tight text-[#3e3832] font-serif">Customer Space</h1>
                    <p className="text-[#706557]">Welcome to Invitify! Create invitations, customize your design templates.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-[#ebd9c1] bg-[#fdfbf7] p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#706557] font-serif">My Invitations</p>
                                <h3 className="mt-2 text-2xl font-bold text-[#3e3832]">2</h3>
                            </div>
                            <div className="rounded-lg bg-[#ebd9c1] p-3 text-[#3d5644]">
                                <Mail className="size-6" />
                            </div>
                        </div>
                    </div>

                    {/* <div className="rounded-xl border border-[#ebd9c1] bg-[#fdfbf7] p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#706557] font-serif">Total RSVPs</p>
                                <h3 className="mt-2 text-2xl font-bold text-[#3e3832]">148</h3>
                            </div>
                            <div className="rounded-lg bg-[#ebd9c1] p-3 text-[#3d5644]">
                                <Star className="size-6" />
                            </div>
                        </div>
                    </div> */}

                    <div className="rounded-xl border border-[#ebd9c1] bg-[#fdfbf7] p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#706557] font-serif">Notifications</p>
                                <h3 className="mt-2 text-2xl font-bold text-[#3e3832]">3</h3>
                            </div>
                            <div className="rounded-lg bg-[#ebd9c1] p-3 text-[#3d5644]">
                                <Bell className="size-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-bold font-serif text-[#3e3832] flex items-center gap-2">
                            <Sparkles className="size-5 text-[#d3c0a3]" /> Start a New Invitation
                        </h3>
                        <Link
                            href="/customer/templates"
                            className="text-xs font-bold text-[#3d5644] hover:text-[#2d4033] font-serif tracking-widest uppercase"
                        >
                            Browse Category Filters &rarr;
                        </Link>
                    </div>

                    {templates.length === 0 ? (
                        <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-[#ebd9c1] bg-[#fdfbf7]">
                            <span className="text-sm text-[#706557]">No template designs available.</span>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {templates.map((t) => (
                                <div
                                    key={t.id}
                                    className="group relative flex flex-col items-center hover:-translate-y-1 transition-transform duration-300"
                                >
                                    {/* Card Graphic Preview */}
                                    <div
                                        className={`relative w-full aspect-[4/5] p-6 bg-gradient-to-tr ${t.bg_gradient} rounded-t-xl rounded-b shadow-md overflow-hidden flex flex-col items-center justify-center`}
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
                                            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#fdfbf7]/90 border-l border-[#ebd9c1] flex items-center justify-center text-[8px] font-bold text-[#706557] select-none">IMAGE</div>
                                        )}

                                        <div
                                            className="text-center pointer-events-none scale-90 opacity-90 transition-transform duration-300 group-hover:scale-95 relative z-10"
                                            style={{ color: t.default_config.layout_style === 'photo-bg' && t.default_config.image_url ? '#ffffff' : '#3e3832' }}
                                        >
                                            <p className="text-[10px] tracking-widest uppercase font-serif font-bold opacity-80">
                                                {t.default_config.title}
                                            </p>
                                            <p className="font-serif text-2xl font-black my-2 truncate max-w-[180px]">
                                                {t.default_config.guest_of_honor}
                                            </p>
                                            <p className="text-[8px] uppercase tracking-wider opacity-80">
                                                {t.default_config.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Details */}
                                    <div className="w-[90%] -mt-6 z-20 bg-[#fdfbf7] border border-[#ebd9c1] rounded p-3 text-center shadow-sm relative pointer-events-none group-hover:border-[#d3c0a3] transition-colors">
                                        <h3 className="text-sm font-serif font-bold text-[#3e3832] truncate">
                                            {t.name}
                                        </h3>
                                        <p className="text-[10px] uppercase font-bold text-[#706557] tracking-widest mt-0.5">
                                            {t.category.replace('_', ' ')}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/templates/${t.id}/customize`}
                                        className="absolute inset-0 z-30"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Mini Websites Section */}
                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-bold font-serif text-[#3e3832] flex items-center gap-2">
                            <Globe className="size-5 text-[#d3c0a3]" /> My Recent Mini Websites
                        </h3>
                        <Link
                            href="/customer/mini-websites"
                            className="text-xs font-bold text-[#3d5644] hover:text-[#2d4033] font-serif tracking-widest uppercase"
                        >
                            Manage All Websites &rarr;
                        </Link>
                    </div>

                    {miniWebsites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-[#ebd9c1] bg-[#fdfbf7] gap-3">
                            <span className="text-[#706557] font-serif text-sm">You haven't launched any mini-websites yet.</span>
                            <Link
                                href="/customer/mini-websites"
                                className="inline-flex items-center justify-center gap-2 bg-[#ebd9c1] text-[#4a4238] font-serif font-bold px-5 py-2.5 rounded text-xs shadow-sm border border-[#d3c0a3] hover:bg-[#e0ccb2] transition-colors"
                            >
                                <Plus className="size-3.5" /> Create Your First Website
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-[#ebd9c1] bg-[#fdfbf7] shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left text-xs text-[#706557]">
                                    <thead className="bg-[#ebd9c1]/30 text-[10px] font-bold font-serif uppercase tracking-wider text-[#3e3832]">
                                        <tr>
                                            <th scope="col" className="px-5 py-3">Website Title</th>
                                            <th scope="col" className="px-5 py-3">Type</th>
                                            <th scope="col" className="px-5 py-3">Status</th>
                                            <th scope="col" className="px-5 py-3">Inbox Submissions</th>
                                            <th scope="col" className="px-5 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#ebd9c1]">
                                        {miniWebsites.map((w) => (
                                            <tr key={w.id} className="hover:bg-[#ebd9c1]/10">
                                                <td className="px-5 py-3 font-semibold text-[#4a4238]">
                                                    <div className="font-serif text-sm">{w.title}</div>
                                                    <div className="text-[10px] text-[#706557] font-mono mt-0.5 select-all">/mini-website/{w.slug}</div>
                                                </td>
                                                <td className="px-5 py-3 capitalize">{w.type}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${w.is_published
                                                        ? 'bg-[#3d5644] text-[#fdfbf7]'
                                                        : 'bg-[#ebd9c1] text-[#4a4238]'
                                                        }`}>
                                                        {w.is_published ? 'Live' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 font-semibold text-[#3d5644]">
                                                    {w.type === 'invitation'
                                                        ? `${w.rsvps_count || 0} RSVPs`
                                                        : `${w.contact_submissions_count || 0} Messages`
                                                    }
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <Link
                                                        href={`/customer/mini-websites/${w.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded border border-[#ebd9c1] bg-[#fdfbf7] px-2.5 py-1 text-[10px] font-bold text-[#3d5644] shadow-xs hover:bg-[#ebd9c1]"
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
