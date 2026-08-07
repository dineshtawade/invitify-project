import { useState } from 'react';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash, Globe, Pencil, Save, ShieldAlert, Clock, Search } from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block } from '@/components/design-editor/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/super-admin/dashboard' },
    { title: 'Mini Website Templates', href: '/super-admin/mini-website-templates' },
];

interface MiniWebsiteTemplate {
    id: number;
    name: string;
    price: number | string;
    status: string;
    preview_image: string;
    config: any;
}

interface EditorRequest {
    id: number;
    target_id: number;
    action: string;
    status: string;
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
    templates: PaginationData<MiniWebsiteTemplate>;
    customBlocks?: any[];
    editorRequests?: EditorRequest[];
    filters?: { search: string };
}

export default function MiniWebsiteTemplatesIndex({ templates, customBlocks = [], editorRequests = [], filters = { search: '' } }: PageProps) {
    const { auth } = usePage().props as any;
    const isEditor = auth?.user?.role === 'editor';

    const [searchVal, setSearchVal] = useState(filters.search || '');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/mini-website-templates', { search: searchVal }, { preserveState: true });
    };

    const handleReset = () => {
        setSearchVal('');
        router.get('/super-admin/mini-website-templates', {}, { preserveState: true });
    };

    const [isOpen, setIsOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<MiniWebsiteTemplate | null>(null);

    const handleRequestAction = (target_id: number, action: 'edit' | 'delete') => {
        router.post('/super-admin/editor-requests', {
            target_type: 'MiniWebsiteTemplate',
            target_id,
            action
        });
    };
    const { data, setData, post, put, reset, processing } = useForm({
        name: '',
        status: 'published',
        price: '0.00',
        preview_image: '',
        config: { pages: [] },
    });

    const handleOpenAdd = () => {
        setEditingTemplate(null);
        reset();
        setData({
            name: '',
            status: 'published',
            price: '0.00',
            preview_image: '',
            config: {
                pages: [{
                    id: 'home',
                    name: 'Home',
                    blocks: [
                        {
                            id: `el_${Math.random().toString(36).substr(2, 9)}`,
                            type: 'text',
                            x: 10,
                            y: 10,
                            zIndex: 1,
                            content: 'Your new template',
                            fontSize: 32,
                            fontWeight: 'bold',
                            color: '#1f2937',
                            fontFamily: "'Inter', sans-serif"
                        }
                    ]
                }]
            },
        });
        setIsOpen(true);
    };

    const handleOpenEdit = (template: any) => {
        setEditingTemplate(template);
        setData({
            name: template.name,
            status: template.status || 'published',
            price: String(template.price),
            preview_image: template.preview_image || '',
            config: template.config ? (Array.isArray(template.config) ? { pages: [{ id: 'home', name: 'Home', blocks: template.config }] } : template.config) : { pages: [] },
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            put(`/super-admin/mini-website-templates/${editingTemplate.id}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/super-admin/mini-website-templates', { onSuccess: () => setIsOpen(false) });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mini Website Templates" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2"> Mini Website Templates
                        </h1>
                        <p className="text-neutral-500 text-sm">Design single-page invitation templates.</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-pink-600 hover:bg-pink-700 text-white">
                        <Plus className="size-4 mr-2" /> Design Template
                    </Button>
                </div>

                {/* Filter and Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search templates by name..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="pl-10 h-10 w-full bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-800 text-sm rounded-xl focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="submit" size="sm" className="h-10 rounded-xl px-5">
                            Filter
                        </Button>
                        {filters.search && (
                            <Button type="button" onClick={handleReset} variant="outline" size="sm" className="h-10 rounded-xl px-4">
                                Clear
                            </Button>
                        )}
                    </div>
                </form>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className=" text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-850/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">Standard Price</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {templates.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-neutral-400">
                                            No mini website templates created yet.
                                        </td>
                                    </tr>
                                ) : (
                                    templates.data.map((t) => (
                                        <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/15 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                                <Globe className="size-4.5 text-pink-600" /> {t.name}
                                                {t.status === 'draft' && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-450">
                                                ₹{parseFloat(String(t.price)).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {isEditor ? (
                                                        (() => {
                                                            const editReq = editorRequests.find(r => r.target_id === t.id && r.action === 'edit');
                                                            const deleteReq = editorRequests.find(r => r.target_id === t.id && r.action === 'delete');
                                                            return (
                                                                <>
                                                                    {editReq?.status === 'approved' ? (
                                                                        <Button onClick={() => handleOpenEdit(t)} variant="outline" size="sm" className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"><Pencil className="size-3.5" /> Edit</Button>
                                                                    ) : editReq?.status === 'pending' ? (
                                                                        <Button disabled variant="outline" size="sm" className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-lg text-xs opacity-50"><Clock className="size-3.5" /> Edit Pending</Button>
                                                                    ) : (
                                                                        <Button onClick={() => handleRequestAction(t.id, 'edit')} variant="outline" size="sm" className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"><ShieldAlert className="size-3.5" /> Request Edit</Button>
                                                                    )}

                                                                    {deleteReq?.status === 'approved' ? (
                                                                        <Button onClick={() => { if (confirm('Delete?')) router.delete(`/super-admin/mini-website-templates/${t.id}`) }} variant="destructive" size="sm" className="flex items-center gap-1 rounded-lg text-xs"><Trash className="size-3.5" /> Delete</Button>
                                                                    ) : deleteReq?.status === 'pending' ? (
                                                                        <Button disabled variant="destructive" size="sm" className="flex items-center gap-1 rounded-lg text-xs opacity-50"><Clock className="size-3.5" /> Delete Pending</Button>
                                                                    ) : (
                                                                        <Button onClick={() => handleRequestAction(t.id, 'delete')} variant="destructive" size="sm" className="flex items-center gap-1 rounded-lg text-xs"><ShieldAlert className="size-3.5" /> Request Delete</Button>
                                                                    )}
                                                                </>
                                                            );
                                                        })()
                                                    ) : (
                                                        <>
                                                            <Button onClick={() => handleOpenEdit(t)} variant="outline" size="sm" className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"><Pencil className="size-3.5" /> Edit</Button>
                                                            <Button onClick={() => { if (confirm('Delete?')) router.delete(`/super-admin/mini-website-templates/${t.id}`) }} variant="destructive" size="sm" className="flex items-center gap-1 rounded-lg text-xs"><Trash className="size-3.5" /> Delete</Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {templates.total > templates.per_page && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                            <div className="text-xs text-neutral-500 dark:text-neutral-450 font-semibold">
                                Showing <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{templates.from}</span> to{' '}
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{templates.to}</span> of{' '}
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{templates.total}</span> templates
                            </div>
                            <div className="flex items-center flex-wrap gap-1">
                                {templates.links.map((link, idx) => {
                                    const cleanLabel = link.label
                                        .replace('&laquo; Previous', '← Prev')
                                        .replace('Next &raquo;', 'Next →');

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="inline-flex h-8 items-center justify-center rounded-lg border border-neutral-200/50 bg-neutral-100/50 px-3 text-xs select-none cursor-not-allowed dark:border-neutral-800/40 dark:bg-neutral-850/40"
                                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-bold transition-all ${link.active
                                                ? 'bg-pink-600 text-white border-pink-600 dark:bg-pink-700 dark:border-pink-700'
                                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent aria-describedby={undefined} className="max-w-[99vw] w-[99vw] h-[99vh] flex flex-col p-0">
                        <DialogHeader className="p-6 border-b flex-row justify-between">
                            <DialogTitle className="text-xl font-bold mt-1.5">
                                {editingTemplate ? `Edit: ${editingTemplate.name}` : 'New Mini Template'}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-hidden">
                            <SharedEditor
                                config={data.config}
                                onChange={(config) => setData('config', config)}
                                isInvitation={true}
                                title={data.name}
                                customBlocks={customBlocks}
                            />
                        </div>

                        <DialogFooter className="p-4 border-t flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs whitespace-nowrap">Name</Label>
                                    <Input value={data.name} onChange={e => setData('name', e.target.value)} className="h-9 w-64" placeholder="Template Name" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs whitespace-nowrap">Price / Day</Label>
                                    <Input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="h-9 w-28" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const payload = { ...data, status: 'draft' };
                                        const options = {
                                            onSuccess: () => setIsOpen(false),
                                            onError: (errs: any) => alert('Error saving draft: \n' + Object.values(errs).join('\n'))
                                        };
                                        if (editingTemplate) {
                                            router.put(`/super-admin/mini-website-templates/${editingTemplate.id}`, payload, options);
                                        } else {
                                            router.post('/super-admin/mini-website-templates', payload, options);
                                        }
                                    }}
                                    className="bg-neutral-800 hover:bg-neutral-900 text-white dark:bg-neutral-700 dark:hover:bg-neutral-600"
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const payload = { ...data, status: 'published' };
                                        const options = {
                                            onSuccess: () => setIsOpen(false),
                                            onError: (errs: any) => alert('Error publishing: \n' + Object.values(errs).join('\n'))
                                        };
                                        if (editingTemplate) {
                                            router.put(`/super-admin/mini-website-templates/${editingTemplate.id}`, payload, options);
                                        } else {
                                            router.post('/super-admin/mini-website-templates', payload, options);
                                        }
                                    }}
                                    className="bg-pink-600 hover:bg-pink-700 text-white"
                                >
                                    <Save className="size-4 mr-2" /> {editingTemplate ? 'Publish Update' : 'Publish'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
