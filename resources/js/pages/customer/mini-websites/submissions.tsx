import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ChevronLeft, MessageSquare, Users, UserCheck, Mail, Calendar } from 'lucide-react';

interface RSVP {
    id: number;
    name: string;
    email: string;
    guests_count: number;
    status: 'attending' | 'declined';
    message: string | null;
    created_at: string;
}

interface ContactSubmission {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

interface SubmissionsMiniWebsite {
    id: number;
    type: 'invitation' | 'business';
    title: string;
    slug: string;
    rsvps?: RSVP[];
    contact_submissions?: ContactSubmission[];
}

interface PageProps {
    website: SubmissionsMiniWebsite;
}

export default function SubmissionsIndex({ website }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My Mini Websites', href: '/customer/mini-websites' },
        { title: `${website.title} Submissions`, href: `/customer/mini-websites/${website.id}/submissions` },
    ];

    const isInvitation = website.type === 'invitation';
    const rsvps = website.rsvps || [];
    const submissions = website.contact_submissions || [];

    // Calculate metrics for invitations
    const totalAttendingGuests = rsvps
        .filter(r => r.status === 'attending')
        .reduce((sum, r) => sum + (r.guests_count || 1), 0);

    const attendingRsvps = rsvps.filter(r => r.status === 'attending').length;
    const declinedRsvps = rsvps.filter(r => r.status === 'declined').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${website.title} - Inbox`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                {/* Header Actions */}
                <div className="flex items-center gap-1 border-b border-neutral-150 pb-4 dark:border-neutral-850">
                    <div className="flex flex-col gap-1">
                        <Link
                            href="/customer/mini-websites"
                            className="flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        >
                            <ChevronLeft className="size-4" /> Back to My Websites
                        </Link>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                            {website.title} - {isInvitation ? 'RSVP Responses' : 'Contact Messages'}
                        </h1>
                    </div>
                </div>

                {/* 1. Rendering Invitation RSVPs */}
                {isInvitation && (
                    <div className="flex flex-col gap-6">
                        
                        {/* Summary Widgets */}
                        <div className="grid gap-6 sm:grid-cols-3">
                            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Total Attending Guests</p>
                                    <h3 className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalAttendingGuests}</h3>
                                </div>
                                <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <Users className="size-6" />
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Attending RSVPs</p>
                                    <h3 className="mt-1 text-3xl font-black text-blue-600 dark:text-blue-400">{attendingRsvps}</h3>
                                </div>
                                <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <UserCheck className="size-6" />
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Declined RSVPs</p>
                                    <h3 className="mt-1 text-3xl font-black text-red-600 dark:text-red-400">{declinedRsvps}</h3>
                                </div>
                                <div className="rounded-lg bg-red-50 p-2.5 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                    <Users className="size-6" />
                                </div>
                            </div>
                        </div>

                        {/* RSVPs Table */}
                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs font-semibold uppercase text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Guest Name</th>
                                            <th scope="col" className="px-6 py-4">Email</th>
                                            <th scope="col" className="px-6 py-4">Guests Count</th>
                                            <th scope="col" className="px-6 py-4">Status</th>
                                            <th scope="col" className="px-6 py-4">Message</th>
                                            <th scope="col" className="px-6 py-4 text-right">Received</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                        {rsvps.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-10 text-center text-neutral-400">
                                                    No RSVP responses received yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            rsvps.map((r) => (
                                                <tr key={r.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                                                    <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">{r.name}</td>
                                                    <td className="px-6 py-4">{r.email}</td>
                                                    <td className="px-6 py-4 font-semibold">{r.guests_count}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                                                            r.status === 'attending'
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                                : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                                        }`}>
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 italic text-neutral-400 max-w-[200px] truncate" title={r.message || ''}>
                                                        {r.message || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        {new Date(r.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Rendering Business Messages */}
                {!isInvitation && (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">Inbox Feed</h3>
                            <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full font-semibold">
                                {submissions.length} Messages
                            </span>
                        </div>

                        {submissions.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
                                <span className="text-neutral-400">Your customer messages inbox is empty.</span>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {submissions.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-4"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                                            <div className="flex flex-col gap-0.5">
                                                <h4 className="font-extrabold text-neutral-900 dark:text-neutral-100 text-base flex items-center gap-1.5">
                                                    <Mail className="size-4 text-blue-500" /> {sub.subject}
                                                </h4>
                                                <span className="text-xs text-neutral-400">
                                                    From: <strong className="text-neutral-500 dark:text-neutral-300">{sub.name}</strong> ({sub.email})
                                                </span>
                                            </div>
                                            <span className="text-xs text-neutral-400 flex items-center gap-1">
                                                <Calendar className="size-3.5" /> {new Date(sub.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                                            {sub.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
