import { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Globe, ExternalLink, MessageSquare, Trash, Pencil, ShieldAlert, Download, Package, Loader2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
    },
    {
        title: 'My Mini Websites',
        href: '/customer/mini-websites',
    },
];

interface CustomerMiniWebsite {
    id: number;
    type: 'invitation' | 'business';
    title: string;
    slug: string;
    theme: string;
    is_published: boolean;
    expires_at: string | null;
    template?: {
        id: number;
        name: string;
        price: string | number;
    };
    rsvps_count: number;
    contact_submissions_count: number;
}

interface MiniWebTemplate {
    id: number;
    name: string;
    type: 'invitation' | 'business';
}

interface PageProps {
    websites: CustomerMiniWebsite[];
    templates: MiniWebTemplate[];
}

export default function MiniWebsitesIndex({ websites, templates = [] }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        template_id: templates[0]?.id || '',
        slug: '',
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('template_id');
        if (templateId && templates.some(tpl => tpl.id === Number(templateId))) {
            setData((prev) => ({
                ...prev,
                template_id: Number(templateId),
            }));
            setIsOpen(true);
            // Clear URL parameter so refreshing doesn't reopen it
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [templates]);

    const handleTitleChange = (val: string) => {
        const cleanSlug = val
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-')         // Replace spaces with dash
            .replace(/-+/g, '-')          // Replace duplicate dashes
            .trim();
        
        setData((prev) => ({
            ...prev,
            title: val,
            slug: cleanSlug,
        }));
    };

    const handleOpenAdd = () => {
        reset();
        if (templates.length > 0) {
            setData('template_id', templates[0].id);
        }
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customer/mini-websites', {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this website? All submission data (RSVPs/Messages) will be permanently lost.')) {
            router.delete(`/customer/mini-websites/${id}`);
        }
    };

    const handleDownloadZip = async (websiteId: number) => {
        setDownloadingId(websiteId);
        try {
            // Use a hidden anchor + fetch to trigger the download properly
            const link = document.createElement('a');
            link.href = `/customer/mini-websites/${websiteId}/download-zip`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Small delay for the browser to start the download
            setTimeout(() => {
                setDownloadingId(null);
            }, 3000);
        } catch (err) {
            console.error('Download failed:', err);
            setDownloadingId(null);
        }
    };

    const isWebsiteActive = (w: CustomerMiniWebsite) => {
        const isFree = w.template && parseFloat(String(w.template.price)) === 0;
        const isNotExpired = w.expires_at && new Date(w.expires_at) >= new Date();
        return isFree || isNotExpired;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Mini Websites" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            My Mini Websites <Globe className="size-6 text-blue-500" />
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Build, customize and host single-page invitations or multi-page business websites.
                        </p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 font-semibold">
                        <Plus className="size-4.5" /> Create Website
                    </Button>
                </div>

                {/* Listing Grid */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-semibold uppercase text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Title & Slug</th>
                                    <th scope="col" className="px-6 py-4">Type</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4">Hosting Status</th>
                                    <th scope="col" className="px-6 py-4">Submissions</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {websites.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                                            No mini-websites created yet. Click "Create Website" to launch your first site.
                                        </td>
                                    </tr>
                                ) : (
                                    websites.map((w) => (
                                        <tr key={w.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900 dark:text-neutral-100">{w.title}</div>
                                                <div className="text-xs text-neutral-400 font-mono mt-0.5 select-all">
                                                    /sites/{w.slug}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                                                    w.type === 'invitation'
                                                        ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400'
                                                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                                                }`}>
                                                    {w.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    w.is_published
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                                }`}>
                                                    <span className={`size-1.5 rounded-full ${w.is_published ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                                                    {w.is_published ? 'Live' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {w.template && parseFloat(String(w.template.price)) === 0 ? (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-950/30 dark:text-green-400">
                                                        Lifetime Free
                                                    </span>
                                                ) : (
                                                    (() => {
                                                        const isExpired = !w.expires_at || new Date(w.expires_at) < new Date();
                                                        return isExpired ? (
                                                            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-950/30 dark:text-rose-450">
                                                                <ShieldAlert className="size-3.5 text-rose-500" /> Expired
                                                            </span>
                                                        ) : (
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Active</span>
                                                                <span className="text-[10px] text-neutral-400">Expires: {new Date(w.expires_at!).toLocaleDateString()}</span>
                                                            </div>
                                                        );
                                                    })()
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/customer/mini-websites/${w.id}/submissions`}
                                                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                                                >
                                                    <MessageSquare className="size-4" />
                                                    {w.type === 'invitation'
                                                        ? `${w.rsvps_count || 0} RSVPs`
                                                        : `${w.contact_submissions_count || 0} Messages`
                                                    }
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {w.is_published && (
                                                        <a
                                                            href={`/sites/${w.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800 transition-colors"
                                                            title="View live site"
                                                        >
                                                            <ExternalLink className="size-3.5" /> View
                                                        </a>
                                                    )}
                                                    {isWebsiteActive(w) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDownloadZip(w.id)}
                                                            disabled={downloadingId === w.id}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-xs hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-400 dark:hover:bg-violet-900 transition-all disabled:opacity-60 disabled:cursor-wait"
                                                            title="Download ZIP package with QR code & invite card"
                                                        >
                                                            {downloadingId === w.id ? (
                                                                <>
                                                                    <Loader2 className="size-3.5 animate-spin" /> Preparing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Package className="size-3.5" /> Download ZIP
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/customer/mini-websites/${w.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800 transition-colors"
                                                    >
                                                        <Pencil className="size-3.5" /> Edit
                                                    </Link>

                                                    <Button
                                                        onClick={() => handleDelete(w.id)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex items-center gap-1 text-xs px-3 py-1.5"
                                                    >
                                                        <Trash className="size-3.5" /> Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Creation Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Create Mini Website
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-3">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Website Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="E.g., Alexander & Sophia Wedding or Alpha Tech Consultancy"
                                required
                            />
                            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="template_id">Choose Design Layout Template</Label>
                            <select
                                id="template_id"
                                value={data.template_id}
                                onChange={(e) => setData('template_id', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:border-neutral-800 dark:bg-neutral-950"
                            >
                                {templates.map((tpl) => (
                                    <option key={tpl.id} value={tpl.id} className="dark:bg-neutral-950">
                                        {tpl.name} ({tpl.type === 'invitation' ? 'Event RSVP' : 'Business'})
                                    </option>
                                ))}
                            </select>
                            {errors.template_id && <p className="text-xs text-red-500 mt-1">{errors.template_id}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Desired URL Slug</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-neutral-400 bg-neutral-50 px-2 py-2.5 rounded-md border border-neutral-150 dark:bg-neutral-950 dark:border-neutral-850">
                                    /sites/
                                </span>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    placeholder="alex-sophia-wedding"
                                    required
                                    className="font-mono"
                                />
                            </div>
                            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                            <p className="text-[11px] text-neutral-400">
                                Slugs should only contain letters, numbers, and dashes. E.g. `/sites/wedding-invitation-2026`.
                            </p>
                        </div>

                        <DialogFooter className="mt-4 gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                                {processing ? 'Creating...' : 'Create Website'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
