import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, FileSignature, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin Dashboard',
        href: '/super-admin/dashboard',
    },
    {
        title: 'Editor Requests',
        href: '/super-admin/editor-requests',
    },
];

interface User {
    id: number;
    name: string;
}

interface EditorRequest {
    id: number;
    user: User;
    target_type: string;
    target_name: string;
    action: string;
    status: string;
    created_at: string;
}

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: LinkItem[];
    from: number;
    to: number;
}

interface PageProps {
    editorRequests: PaginationData<EditorRequest>;
    filters?: { search: string };
}

export default function EditorRequests({ editorRequests, filters = { search: '' } }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/editor-requests', { search: searchQuery }, { preserveState: true });
    };

    const handleReset = () => {
        setSearchQuery('');
        router.get('/super-admin/editor-requests', {}, { preserveState: true });
    };
    const handleApprove = (id: number) => {
        router.post(`/super-admin/editor-requests/${id}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = (id: number) => {
        router.post(`/super-admin/editor-requests/${id}/reject`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editor Requests" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 bg-neutral-50/50 dark:bg-neutral-950/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-5">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-3">
                            <FileSignature className="size-8 text-indigo-500" />
                            Editor Requests
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Review requests from editors to edit or delete templates.</p>
                    </div>
                </div>

                {/* Filter and Search */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search by editor name, email, action, status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 w-full bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-800 text-sm rounded-xl focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="submit" className="h-10 rounded-xl px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                            Search
                        </Button>
                        {filters.search && (
                            <Button type="button" onClick={handleReset} variant="outline" className="h-10 rounded-xl px-4 border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 font-bold">
                                Clear
                            </Button>
                        )}
                    </div>
                </form>

                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-neutral-500 dark:text-neutral-400 uppercase bg-neutral-50/80 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Editor</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Template</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Type</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Action</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {editorRequests.data.map(req => (
                                    <tr key={req.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                            {req.user.name}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {req.target_name}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                                            {req.target_type === 'Template' ? 'Main Template' : 'Mini Website'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                req.action === 'edit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {req.action.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                req.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                req.status === 'rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                                                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {req.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button onClick={() => handleApprove(req.id)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-8">
                                                        <CheckCircle2 className="size-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button onClick={() => handleReject(req.id)} size="sm" variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl h-8">
                                                        <XCircle className="size-4 mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {editorRequests.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                                            No requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                        <div className="text-xs text-neutral-500 dark:text-neutral-450 font-semibold">
                            Showing <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{editorRequests.from || 0}</span> to{' '}
                            <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{editorRequests.to || 0}</span> of{' '}
                            <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{editorRequests.total || 0}</span> requests
                        </div>
                        {editorRequests.last_page > 1 && (
                            <div className="flex items-center flex-wrap gap-1">
                                {editorRequests.links.map((link, idx) => {
                                    const cleanLabel = link.label
                                        .replace('&laquo; Previous', '← Prev')
                                        .replace('Next &raquo;', 'Next →');

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="inline-flex h-8 items-center justify-center rounded-lg border border-neutral-200/50 bg-neutral-100/50 px-3 text-xs text-neutral-400 select-none cursor-not-allowed dark:border-neutral-800/40 dark:bg-neutral-850/40"
                                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-bold transition-all ${link.active
                                                ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700'
                                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
