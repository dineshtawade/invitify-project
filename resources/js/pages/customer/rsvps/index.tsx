// developed by dinesh tawade
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    Users, UserCheck, MessageSquare, ExternalLink, Calendar,
    Phone, Mail, Heart, Filter, ArrowUpRight, Search, CheckCircle2, XCircle, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RSVP {
    id: number;
    mini_website_id: number;
    name: string;
    mobile_number?: string;
    email?: string;
    guests_count: number;
    status: 'yes' | 'no' | 'maybe' | 'attending' | 'declined' | string;
    message: string | null;
    created_at: string;
    mini_website?: {
        id: number;
        title: string;
        slug: string;
        uuid?: string;
    };
}

interface MiniWebsiteItem {
    id: number;
    title: string;
    slug: string;
    uuid?: string;
    rsvps_count?: number;
}

interface PageProps {
    websites: MiniWebsiteItem[];
    rsvps: RSVP[];
    selectedWebsiteId?: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/customer/dashboard' },
    { title: 'My Invitation Website', href: '/customer/mini-websites' },
    { title: 'RSVP Responses', href: '/customer/rsvps' },
];

export default function RsvpsIndex({ websites = [], rsvps = [], selectedWebsiteId = null }: PageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'yes' | 'maybe' | 'no'>('all');

    const handleWebsiteChange = (websiteId: string) => {
        if (websiteId) {
            router.get('/customer/rsvps', { website_id: websiteId }, { preserveState: true });
        } else {
            router.get('/customer/rsvps', {}, { preserveState: true });
        }
    };

    const isAttending = (s: string) => s === 'yes' || s === 'attending';
    const isDeclined = (s: string) => s === 'no' || s === 'declined';
    const isMaybe = (s: string) => s === 'maybe';

    // Metrics for all current filtered list
    const totalAttendingGuests = rsvps
        .filter(r => isAttending(r.status))
        .reduce((sum, r) => sum + (r.guests_count || 1), 0);

    const yesCount = rsvps.filter(r => isAttending(r.status)).length;
    const maybeCount = rsvps.filter(r => isMaybe(r.status)).length;
    const noCount = rsvps.filter(r => isDeclined(r.status)).length;

    const filteredRsvps = rsvps.filter(r => {
        const matchesSearch =
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.mobile_number && r.mobile_number.includes(searchQuery)) ||
            (r.message && r.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (r.mini_website?.title && r.mini_website.title.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (statusFilter === 'yes') return isAttending(r.status);
        if (statusFilter === 'no') return isDeclined(r.status);
        if (statusFilter === 'maybe') return isMaybe(r.status);
        return true;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guest RSVP Responses - Invitify" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

                {/* Header section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
                            <UserCheck className="size-7 text-emerald-600" />
                            Guest RSVP Responses
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Live guest list and wishes submitted directly from your wedding Invitation Website.
                        </p>
                    </div>

                    {/* Website selector filter */}
                    {websites.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap">Filter Website:</span>
                            <select
                                value={selectedWebsiteId || ''}
                                onChange={(e) => handleWebsiteChange(e.target.value)}
                                className="h-10 text-xs sm:text-sm font-semibold rounded-xl border-neutral-300 bg-white px-3 py-2 shadow-xs focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                <option value="">All Websites ({websites.length})</option>
                                {websites.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.title} ({w.rsvps_count || 0})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Total Guests Attending</p>
                            <h3 className="mt-1 text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalAttendingGuests}</h3>
                            <span className="text-[10px] text-neutral-400 mt-0.5 block">Sum of guest counts</span>
                        </div>
                        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <Users className="size-5 sm:size-6" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Attending (Yes)</p>
                            <h3 className="mt-1 text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{yesCount}</h3>
                            <span className="text-[10px] text-neutral-400 mt-0.5 block">Confirmed RSVPs</span>
                        </div>
                        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <CheckCircle2 className="size-5 sm:size-6" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Tentative (Maybe)</p>
                            <h3 className="mt-1 text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">{maybeCount}</h3>
                            <span className="text-[10px] text-neutral-400 mt-0.5 block">Not yet confirmed</span>
                        </div>
                        <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <HelpCircle className="size-5 sm:size-6" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Declined (No)</p>
                            <h3 className="mt-1 text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">{noCount}</h3>
                            <span className="text-[10px] text-neutral-400 mt-0.5 block">Cannot attend</span>
                        </div>
                        <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <XCircle className="size-5 sm:size-6" />
                        </div>
                    </div>
                </div>

                {/* Filters toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
                    <div className="relative flex-1 max-w-md">
                        <Search className="size-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Search by guest name, mobile, message..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                        />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                        <Button
                            variant={statusFilter === 'all' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('all')}
                            className="text-xs h-8 px-3 rounded-xl font-semibold"
                        >
                            All ({rsvps.length})
                        </Button>
                        <Button
                            variant={statusFilter === 'yes' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('yes')}
                            className={`text-xs h-8 px-3 rounded-xl font-semibold ${statusFilter === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-emerald-700 hover:bg-emerald-50'}`}
                        >
                            Attending ({yesCount})
                        </Button>
                        <Button
                            variant={statusFilter === 'maybe' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('maybe')}
                            className={`text-xs h-8 px-3 rounded-xl font-semibold ${statusFilter === 'maybe' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'text-amber-700 hover:bg-amber-50'}`}
                        >
                            Maybe ({maybeCount})
                        </Button>
                        <Button
                            variant={statusFilter === 'no' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('no')}
                            className={`text-xs h-8 px-3 rounded-xl font-semibold ${statusFilter === 'no' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'text-rose-700 hover:bg-rose-50'}`}
                        >
                            Declined ({noCount})
                        </Button>
                    </div>
                </div>

                {/* Table card */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-600 dark:text-neutral-400">
                            <thead className="bg-neutral-50/80 text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th scope="col" className="px-5 py-3.5">Guest Name</th>
                                    <th scope="col" className="px-5 py-3.5">Mobile Number</th>
                                    <th scope="col" className="px-5 py-3.5">Attendance</th>
                                    <th scope="col" className="px-5 py-3.5">Guests Count</th>
                                    <th scope="col" className="px-5 py-3.5">Message for Couple</th>
                                    <th scope="col" className="px-5 py-3.5">Website</th>
                                    <th scope="col" className="px-5 py-3.5 text-right">Received Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredRsvps.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="size-8 text-neutral-300 dark:text-neutral-600" />
                                                <p className="font-semibold text-sm">No RSVP responses found.</p>
                                                <p className="text-xs text-neutral-400">Share your mini website link with guests to start receiving RSVPs.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRsvps.map((r) => {
                                        const statusLower = String(r.status || '').toLowerCase();
                                        let badgeClass = 'bg-neutral-100 text-neutral-700';
                                        let statusLabel = 'Maybe';
                                        if (statusLower === 'yes' || statusLower === 'attending') {
                                            badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200';
                                            statusLabel = 'Yes (Attending)';
                                        } else if (statusLower === 'no' || statusLower === 'declined') {
                                            badgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200';
                                            statusLabel = 'No (Declined)';
                                        } else {
                                            badgeClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200';
                                            statusLabel = 'Maybe';
                                        }

                                        return (
                                            <tr key={r.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors">
                                                <td className="px-5 py-4 font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                                    {r.name}
                                                </td>
                                                <td className="px-5 py-4 font-mono font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                                                    {r.mobile_number ? (
                                                        <a href={`tel:${r.mobile_number}`} className="inline-flex items-center gap-1 hover:text-emerald-600">
                                                            <Phone className="size-3 text-neutral-400" />
                                                            {r.mobile_number}
                                                        </a>
                                                    ) : (
                                                        r.email || '-'
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                                    {r.guests_count || 1}
                                                </td>
                                                <td className="px-5 py-4 text-xs italic text-neutral-600 dark:text-neutral-300 max-w-[280px]">
                                                    {r.message ? (
                                                        <div className="flex items-start gap-1" title={r.message}>
                                                            <Heart className="size-3 text-rose-400 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{r.message}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-neutral-300 dark:text-neutral-600">-</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    {r.mini_website ? (
                                                        <a
                                                            href={`/mini-website/${r.mini_website.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                                                        >
                                                            {r.mini_website.title}
                                                            <ExternalLink className="size-3" />
                                                        </a>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-right whitespace-nowrap text-xs text-neutral-400 font-mono">
                                                    {new Date(r.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
