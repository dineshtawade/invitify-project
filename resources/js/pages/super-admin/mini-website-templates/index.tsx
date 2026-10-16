import { useState, useMemo } from 'react';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import MiniWebsitePreview from '@/Components/MiniWebsitePreview';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    Plus, Trash, Trash2, Globe, Pencil, Save, ShieldAlert, Clock, Search,
    Monitor, Tablet, Smartphone, Code, Sparkles, ChevronUp, ChevronDown,
    X, Type, AlignLeft, Layers, LayoutGrid, List
} from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block } from '@/components/design-editor/types';
import {
    RsvpOption,
    RsvpQuestion,
    RsvpConfig,
    DEFAULT_RSVP_CONFIG,
    DEFAULT_RSVP_QUESTIONS,
    normalizeRsvpConfig,
    generateRsvpPreviewHtml
} from '@/utils/rsvp-builder';

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
    const [editorTab, setEditorTab] = useState<'html' | 'rsvp'>('html');
    const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
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
        reseller_price: '0.00',
        preview_image: '',
        config: {
            html: '',
            variables: [],
            rsvp: { ...DEFAULT_RSVP_CONFIG }
        },
    });

    // Helper functions for RSVP form management
    // developed by dinesh tawade
    const updateRsvpConfig = (partial: Partial<RsvpConfig>) => {
        const currentRsvp = normalizeRsvpConfig(data.config?.rsvp);
        setData('config', {
            ...data.config,
            rsvp: {
                ...currentRsvp,
                ...partial,
            },
        });
    };

    const toggleRsvpEnabled = (enabled: boolean) => {
        updateRsvpConfig({ enabled });
    };

    const handleAddQuestion = () => {
        const currentRsvp = normalizeRsvpConfig(data.config?.rsvp);
        const currentQuestions = currentRsvp.questions || [];
        const nextNum = currentQuestions.length + 1;
        const newQ: RsvpQuestion = {
            id: `q_${Date.now()}`,
            key: `custom_${Date.now()}`,
            label: `New Question ${nextNum}`,
            type: 'text',
            required: false,
            placeholder: 'Enter answer...',
            display_style: 'cards',
            options: [
                { label: 'Option 1', value: 'opt_1', icon: '✨', subtext: '' },
                { label: 'Option 2', value: 'opt_2', icon: '🌟', subtext: '' },
            ],
            is_system: false,
        };
        updateRsvpConfig({ questions: [...currentQuestions, newQ] });
    };

    const handleUpdateQuestion = (index: number, updated: Partial<RsvpQuestion>) => {
        const currentRsvp = normalizeRsvpConfig(data.config?.rsvp);
        const currentQuestions = [...currentRsvp.questions];
        currentQuestions[index] = { ...currentQuestions[index], ...updated };
        updateRsvpConfig({ questions: currentQuestions });
    };

    const handleDeleteQuestion = (index: number) => {
        const currentRsvp = normalizeRsvpConfig(data.config?.rsvp);
        const currentQuestions = currentRsvp.questions.filter((_, idx) => idx !== index);
        updateRsvpConfig({ questions: currentQuestions });
    };

    const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
        const currentRsvp = normalizeRsvpConfig(data.config?.rsvp);
        const currentQuestions = [...currentRsvp.questions];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentQuestions.length) return;
        const temp = currentQuestions[index];
        currentQuestions[index] = currentQuestions[targetIndex];
        currentQuestions[targetIndex] = temp;
        updateRsvpConfig({ questions: currentQuestions });
    };

    const handleAddOption = (qIndex: number) => {
        const currentRsvp = normalizeRsvpConfig(data.config?.rsvp);
        const currentQuestions = [...currentRsvp.questions];
        const q = currentQuestions[qIndex];
        const currentOptions = q.options || [];
        const nextOptNum = currentOptions.length + 1;
        const newOpt: RsvpOption = {
            label: `Option ${nextOptNum}`,
            value: `opt_${nextOptNum}`,
            icon: '✨',
            subtext: '',
        };
        currentQuestions[qIndex] = {
            ...q,
            options: [...currentOptions, newOpt],
        };
        updateRsvpConfig({ questions: currentQuestions });
    };

    const handleUpdateOption = (qIndex: number, optIndex: number, updated: Partial<RsvpOption>) => {
        const currentRsvp = normalizeRsvpConfig(data.config?.rsvp);
        const currentQuestions = [...currentRsvp.questions];
        const q = currentQuestions[qIndex];
        const currentOptions = [...(q.options || [])];
        currentOptions[optIndex] = { ...currentOptions[optIndex], ...updated };
        currentQuestions[qIndex] = { ...q, options: currentOptions };
        updateRsvpConfig({ questions: currentQuestions });
    };

    const handleDeleteOption = (qIndex: number, optIndex: number) => {
        const currentRsvp = normalizeRsvpConfig(data.config?.rsvp);
        const currentQuestions = [...currentRsvp.questions];
        const q = currentQuestions[qIndex];
        currentQuestions[qIndex] = {
            ...q,
            options: (q.options || []).filter((_, i) => i !== optIndex),
        };
        updateRsvpConfig({ questions: currentQuestions });
    };

    // Live preview generator with RSVP form included/excluded
    const previewDoc = useMemo(() => {
        return generateRsvpPreviewHtml(data.config?.html || '', data.config?.rsvp);
    }, [data.config?.html, data.config?.rsvp]);

    const handleOpenAdd = () => {
        setEditingTemplate(null);
        reset();
        setData({
            name: '',
            status: 'published',
            price: '0.00',
            reseller_price: '0.00',
            preview_image: '',
            config: {
                html: '',
                variables: [],
                rsvp: { ...DEFAULT_RSVP_CONFIG },
            },
        });
        setEditorTab('html');
        setIsOpen(true);
    };

    const handleOpenEdit = (template: any) => {
        setEditingTemplate(template);
        const parsedConfig = typeof template.config === 'string'
            ? JSON.parse(template.config || '{}')
            : (template.config || {});

        const rsvpConfig = normalizeRsvpConfig(parsedConfig.rsvp);

        setData({
            name: template.name,
            status: template.status || 'published',
            price: String(template.price),
            reseller_price: String(template.reseller_price || '0.00'),
            preview_image: template.preview_image || '',
            config: {
                ...parsedConfig,
                html: parsedConfig.html || '',
                variables: parsedConfig.variables || [],
                rsvp: rsvpConfig,
            },
        });
        setEditorTab('html');
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
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-neutral-900 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search templates by name..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="pl-9 h-9 w-full bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-800 text-sm rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="submit" size="sm" className="h-9 rounded-lg px-4 text-xs font-semibold">
                            Filter
                        </Button>
                        {filters.search && (
                            <Button type="button" onClick={handleReset} variant="outline" size="sm" className="h-9 rounded-lg px-3 text-xs">
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
                                                {t.preview_image ? (
                                                    <img src={t.preview_image} alt={t.name} className="size-10 rounded-md object-cover border border-neutral-200" />
                                                ) : (typeof t.config === 'string' ? JSON.parse(t.config || '{}') : (t.config || {})).pages ? (
                                                    <div className="size-10 rounded-md overflow-hidden border border-neutral-200 relative bg-white shrink-0">
                                                        <div className="absolute top-0 left-0 w-[40px] h-[600px] origin-top-left pointer-events-none">
                                                            <MiniWebsitePreview config={typeof t.config === 'string' ? JSON.parse(t.config) : t.config} />
                                                        </div>
                                                    </div>
                                                ) : (typeof t.config === 'string' ? JSON.parse(t.config || '{}') : (t.config || {})).html ? (
                                                    <div className="size-10 rounded-md overflow-hidden border border-neutral-200 relative bg-white shrink-0">
                                                        <div className="absolute inset-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none">
                                                            <iframe srcDoc={(typeof t.config === 'string' ? JSON.parse(t.config) : t.config).html} className="w-full h-full border-none pointer-events-none bg-white" tabIndex={-1} scrolling="no" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="size-10 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 flex items-center justify-center shrink-0">
                                                        <Globe className="size-5 text-neutral-400" />
                                                    </div>
                                                )} {t.name}
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
                                                                        <Button onClick={() => handleOpenEdit(t)} variant="outline" size="sm" className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-md h-7 px-2.5 text-[11px]"><Pencil className="size-3" /> Edit</Button>
                                                                    ) : editReq?.status === 'pending' ? (
                                                                        <Button disabled variant="outline" size="sm" className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-md h-7 px-2.5 text-[11px] opacity-50"><Clock className="size-3" /> Edit Pending</Button>
                                                                    ) : (
                                                                        <Button onClick={() => handleRequestAction(t.id, 'edit')} variant="outline" size="sm" className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-md h-7 px-2.5 text-[11px]"><ShieldAlert className="size-3" /> Request Edit</Button>
                                                                    )}

                                                                    {deleteReq?.status === 'approved' ? (
                                                                        <Button onClick={() => { if (confirm('Delete?')) router.delete(`/super-admin/mini-website-templates/${t.id}`) }} variant="destructive" size="sm" className="flex items-center gap-1 rounded-md h-7 px-2.5 text-[11px]"><Trash className="size-3" /> Delete</Button>
                                                                    ) : deleteReq?.status === 'pending' ? (
                                                                        <Button disabled variant="destructive" size="sm" className="flex items-center gap-1 rounded-md h-7 px-2.5 text-[11px] opacity-50"><Clock className="size-3" /> Delete Pending</Button>
                                                                    ) : (
                                                                        <Button onClick={() => handleRequestAction(t.id, 'delete')} variant="destructive" size="sm" className="flex items-center gap-1 rounded-md h-7 px-2.5 text-[11px]"><ShieldAlert className="size-3" /> Request Delete</Button>
                                                                    )}
                                                                </>
                                                            );
                                                        })()
                                                    ) : (
                                                        <>
                                                            <Button onClick={() => handleOpenEdit(t)} variant="outline" size="sm" className="flex items-center gap-1 border-neutral-200 dark:border-neutral-800 rounded-md h-7 px-2.5 text-[11px]"><Pencil className="size-3" /> Edit</Button>
                                                            <Button onClick={() => { if (confirm('Delete?')) router.delete(`/super-admin/mini-website-templates/${t.id}`) }} variant="destructive" size="sm" className="flex items-center gap-1 rounded-md h-7 px-2.5 text-[11px]"><Trash className="size-3" /> Delete</Button>
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

                        <div className="flex-1 overflow-hidden flex bg-neutral-50 dark:bg-neutral-900">
                            {/* Editor Configuration Left Side */}
                            <div className="w-[460px] max-w-[45vw] shrink-0 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                                {/* Editor Sub-Tabs Header */}
                                <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 p-2 gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setEditorTab('html')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                            editorTab === 'html'
                                                ? 'bg-white dark:bg-neutral-800 text-pink-600 dark:text-pink-400 shadow-2xs border border-neutral-200/80 dark:border-neutral-700'
                                                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                                        }`}
                                    >
                                        <Code className="size-3.5" /> HTML Code
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditorTab('rsvp')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                            editorTab === 'rsvp'
                                                ? 'bg-white dark:bg-neutral-800 text-pink-600 dark:text-pink-400 shadow-2xs border border-neutral-200/80 dark:border-neutral-700'
                                                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                                        }`}
                                    >
                                        <Sparkles className="size-3.5 text-pink-500" />
                                        <span>RSVP Form</span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                                            data.config?.rsvp?.enabled !== false
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                        }`}>
                                            {data.config?.rsvp?.enabled !== false ? 'ON' : 'OFF'}
                                        </span>
                                    </button>
                                </div>

                                {/* Tab 1: HTML Code */}
                                {editorTab === 'html' && (
                                    <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                                                HTML / CSS / JS Template Code
                                            </Label>
                                            <span className="text-[10px] text-neutral-400">Standard single-page code</span>
                                        </div>
                                        <textarea
                                            className="w-full flex-1 p-4 font-mono text-xs border rounded-xl focus:ring-2 focus:ring-pink-500 dark:bg-neutral-900 dark:border-neutral-800 shadow-2xs resize-none"
                                            placeholder="Paste your complete HTML code here..."
                                            value={data.config.html || ''}
                                            onChange={e => setData('config', { ...data.config, html: e.target.value })}
                                        />
                                    </div>
                                )}

                                {/* Tab 2: RSVP Form Builder */}
                                {editorTab === 'rsvp' && (
                                    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
                                        {/* 1. Master Toggle */}
                                        <div className={`p-3.5 rounded-xl border transition-all ${
                                            data.config?.rsvp?.enabled !== false
                                                ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                                                : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800'
                                        }`}>
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.config?.rsvp?.enabled !== false}
                                                    onChange={(e) => toggleRsvpEnabled(e.target.checked)}
                                                    className="mt-1 size-4 rounded border-neutral-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                            Enable RSVP Form on this Website
                                                        </span>
                                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                                            data.config?.rsvp?.enabled !== false
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                                                        }`}>
                                                            {data.config?.rsvp?.enabled !== false ? 'Enabled' : 'Disabled'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                        {data.config?.rsvp?.enabled !== false
                                                            ? 'Visitors can submit RSVP responses which are tracked in the database.'
                                                            : 'No RSVP form will appear on this website template.'}
                                                    </p>
                                                </div>
                                            </label>
                                        </div>

                                        {data.config?.rsvp?.enabled !== false && (
                                            <>
                                                {/* 2. Header & Titles Configuration */}
                                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col gap-3">
                                                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                                                        <Sparkles className="size-3 text-pink-500" /> Form Titles & Header
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <Label className="text-[10px] text-neutral-500 font-bold uppercase">Badge</Label>
                                                            <Input
                                                                value={data.config.rsvp?.badge || ''}
                                                                onChange={(e) => updateRsvpConfig({ badge: e.target.value })}
                                                                placeholder="WEDDING RSVP"
                                                                className="h-8 text-xs bg-white dark:bg-neutral-950 mt-1"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[10px] text-neutral-500 font-bold uppercase">Main Heading</Label>
                                                            <Input
                                                                value={data.config.rsvp?.heading || ''}
                                                                onChange={(e) => updateRsvpConfig({ heading: e.target.value })}
                                                                placeholder="Will You Attend?"
                                                                className="h-8 text-xs bg-white dark:bg-neutral-950 mt-1"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px] text-neutral-500 font-bold uppercase">Subheading Note</Label>
                                                        <Input
                                                            value={data.config.rsvp?.subheading || ''}
                                                            onChange={(e) => updateRsvpConfig({ subheading: e.target.value })}
                                                            placeholder="Please confirm your presence so we can reserve your seat..."
                                                            className="h-8 text-xs bg-white dark:bg-neutral-950 mt-1"
                                                        />
                                                    </div>
                                                </div>

                                                {/* 3. Dynamic Questions Manager */}
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                                                RSVP Questions
                                                            </span>
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300">
                                                                {data.config.rsvp?.questions?.length || 0}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={handleAddQuestion}
                                                            className="h-7 text-xs bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
                                                        >
                                                            <Plus className="size-3.5" /> Add Question
                                                        </Button>
                                                    </div>

                                                    {/* Questions Cards */}
                                                    <div className="flex flex-col gap-3">
                                                        {(data.config.rsvp?.questions || []).map((q: RsvpQuestion, qIdx: number) => (
                                                            <div
                                                                key={q.id || qIdx}
                                                                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xs flex flex-col gap-3 hover:border-pink-300 dark:hover:border-pink-900 transition-all"
                                                            >
                                                                {/* Question Card Top Bar */}
                                                                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-850">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="size-5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                                                                            {qIdx + 1}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">
                                                                            {q.label || `Question ${qIdx + 1}`}
                                                                        </span>
                                                                        {q.is_system && (
                                                                            <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-100 text-neutral-500 font-medium">
                                                                                Core
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            type="button"
                                                                            disabled={qIdx === 0}
                                                                            onClick={() => handleMoveQuestion(qIdx, 'up')}
                                                                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer text-neutral-500"
                                                                            title="Move Up"
                                                                        >
                                                                            <ChevronUp className="size-3.5" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            disabled={qIdx === (data.config.rsvp?.questions?.length || 1) - 1}
                                                                            onClick={() => handleMoveQuestion(qIdx, 'down')}
                                                                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer text-neutral-500"
                                                                            title="Move Down"
                                                                        >
                                                                            <ChevronDown className="size-3.5" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDeleteQuestion(qIdx)}
                                                                            className="p-1 rounded hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                                                                            title="Delete Question"
                                                                        >
                                                                            <Trash2 className="size-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Question Title & Required */}
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1">
                                                                        <Label className="text-[10px] text-neutral-400 font-bold uppercase">Question Title</Label>
                                                                        <Input
                                                                            value={q.label}
                                                                            onChange={(e) => handleUpdateQuestion(qIdx, { label: e.target.value })}
                                                                            placeholder="e.g. Dietary Preferences"
                                                                            className="h-8 text-xs mt-1"
                                                                        />
                                                                    </div>
                                                                    <label className="flex items-center gap-1.5 pt-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer whitespace-nowrap">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={q.required}
                                                                            onChange={(e) => handleUpdateQuestion(qIdx, { required: e.target.checked })}
                                                                            className="size-3.5 rounded border-neutral-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                                                        />
                                                                        Required
                                                                    </label>
                                                                </div>

                                                                {/* Answer Input Type Selection */}
                                                                <div>
                                                                    <Label className="text-[10px] text-neutral-400 font-bold uppercase">Answer Type</Label>
                                                                    <div className="grid grid-cols-3 gap-1.5 mt-1 bg-neutral-100/70 dark:bg-neutral-900 p-1 rounded-lg">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleUpdateQuestion(qIdx, { type: 'text' })}
                                                                            className={`py-1.5 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                                                                q.type === 'text'
                                                                                    ? 'bg-white dark:bg-neutral-800 text-pink-600 dark:text-pink-400 shadow-2xs'
                                                                                    : 'text-neutral-500 hover:text-neutral-800'
                                                                            }`}
                                                                        >
                                                                            <Type className="size-3" /> Input Field
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleUpdateQuestion(qIdx, { type: 'textarea' })}
                                                                            className={`py-1.5 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                                                                q.type === 'textarea'
                                                                                    ? 'bg-white dark:bg-neutral-800 text-pink-600 dark:text-pink-400 shadow-2xs'
                                                                                    : 'text-neutral-500 hover:text-neutral-800'
                                                                            }`}
                                                                        >
                                                                            <AlignLeft className="size-3" /> Textarea
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleUpdateQuestion(qIdx, {
                                                                                type: 'options',
                                                                                options: q.options && q.options.length > 0 ? q.options : [
                                                                                    { label: 'Option 1', value: 'opt_1', icon: '✨', subtext: '' },
                                                                                    { label: 'Option 2', value: 'opt_2', icon: '🌟', subtext: '' }
                                                                                ]
                                                                            })}
                                                                            className={`py-1.5 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                                                                q.type === 'options'
                                                                                    ? 'bg-white dark:bg-neutral-800 text-pink-600 dark:text-pink-400 shadow-2xs'
                                                                                    : 'text-neutral-500 hover:text-neutral-800'
                                                                            }`}
                                                                        >
                                                                            <Layers className="size-3" /> Options
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Placeholder when text/textarea */}
                                                                {(q.type === 'text' || q.type === 'textarea') && (
                                                                    <div>
                                                                        <Label className="text-[10px] text-neutral-400 font-bold uppercase">Placeholder Hint</Label>
                                                                        <Input
                                                                            value={q.placeholder || ''}
                                                                            onChange={(e) => handleUpdateQuestion(qIdx, { placeholder: e.target.value })}
                                                                            placeholder="e.g. Enter your preference..."
                                                                            className="h-8 text-xs mt-1"
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* Options Configuration (Cards vs List) */}
                                                                {q.type === 'options' && (
                                                                    <div className="flex flex-col gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-850">
                                                                        {/* Display Style Toggle (Cards vs List) */}
                                                                        <div className="flex items-center justify-between">
                                                                            <Label className="text-[10px] text-neutral-500 font-bold uppercase">Display Options As</Label>
                                                                            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleUpdateQuestion(qIdx, { display_style: 'cards' })}
                                                                                    className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                                                                        q.display_style !== 'list'
                                                                                            ? 'bg-white dark:bg-neutral-800 text-pink-600 shadow-2xs'
                                                                                            : 'text-neutral-500 hover:text-neutral-800'
                                                                                    }`}
                                                                                >
                                                                                    <LayoutGrid className="size-3" /> Cards
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleUpdateQuestion(qIdx, { display_style: 'list' })}
                                                                                    className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                                                                        q.display_style === 'list'
                                                                                            ? 'bg-white dark:bg-neutral-800 text-pink-600 shadow-2xs'
                                                                                            : 'text-neutral-500 hover:text-neutral-800'
                                                                                    }`}
                                                                                >
                                                                                    <List className="size-3" /> List
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                        {/* Options Rows */}
                                                                        <div className="flex flex-col gap-1.5">
                                                                            <Label className="text-[10px] text-neutral-400 font-bold uppercase">Options List</Label>
                                                                            {(q.options || []).map((opt: RsvpOption, optIdx: number) => (
                                                                                <div key={optIdx} className="flex items-center gap-1.5">
                                                                                    <Input
                                                                                        value={opt.icon || ''}
                                                                                        onChange={(e) => handleUpdateOption(qIdx, optIdx, { icon: e.target.value })}
                                                                                        placeholder="Icon"
                                                                                        className="h-7 w-12 text-center text-xs p-1"
                                                                                        title="Emoji or icon (e.g. 🎉, 🥦, 🏨)"
                                                                                    />
                                                                                    <Input
                                                                                        value={opt.label}
                                                                                        onChange={(e) => handleUpdateOption(qIdx, optIdx, { label: e.target.value, value: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') })}
                                                                                        placeholder="Label (e.g. Vegetarian)"
                                                                                        className="h-7 flex-1 text-xs"
                                                                                    />
                                                                                    <Input
                                                                                        value={opt.subtext || ''}
                                                                                        onChange={(e) => handleUpdateOption(qIdx, optIdx, { subtext: e.target.value })}
                                                                                        placeholder="Subtext"
                                                                                        className="h-7 flex-1 text-xs"
                                                                                    />
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleDeleteOption(qIdx, optIdx)}
                                                                                        className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer"
                                                                                        title="Remove Option"
                                                                                    >
                                                                                        <X className="size-3" />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleAddOption(qIdx)}
                                                                                className="text-[11px] text-pink-600 dark:text-pink-400 font-bold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                                                                            >
                                                                                <Plus className="size-3" /> Add Option
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Preview Side */}
                            <div className="flex-1 bg-neutral-100/50 dark:bg-neutral-900/50 flex flex-col items-center p-8 overflow-y-auto relative">
                                {/* Device Toggle */}
                                <div className="absolute top-4 bg-white dark:bg-neutral-800 p-1.5 rounded-xl flex gap-1 shadow-sm border border-neutral-200 dark:border-neutral-700 z-10">
                                    <button
                                        type="button"
                                        onClick={() => setDeviceType('mobile')}
                                        className={`p-2 rounded-lg transition-colors cursor-pointer ${deviceType === 'mobile' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                                        title="Mobile Preview (375px)"
                                    ><Smartphone className="size-4" /></button>
                                    <button
                                        type="button"
                                        onClick={() => setDeviceType('tablet')}
                                        className={`p-2 rounded-lg transition-colors cursor-pointer ${deviceType === 'tablet' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                                        title="Tablet Preview (768px)"
                                    ><Tablet className="size-4" /></button>
                                    <button
                                        type="button"
                                        onClick={() => setDeviceType('desktop')}
                                        className={`p-2 rounded-lg transition-colors cursor-pointer ${deviceType === 'desktop' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                                        title="Desktop Preview (Full Width)"
                                    ><Monitor className="size-4" /></button>
                                </div>

                                <div
                                    className={`mt-10 h-[800px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden relative transition-all duration-300 ${deviceType === 'mobile' ? 'w-[375px] border border-neutral-200 dark:border-neutral-700' :
                                        deviceType === 'tablet' ? 'w-[768px] rounded-2xl border border-neutral-200 dark:border-neutral-700' :
                                            'w-full rounded-xl border border-neutral-200 dark:border-neutral-700'
                                        }`}
                                >
                                    <iframe
                                        srcDoc={previewDoc}
                                        className="w-full h-full border-0"
                                        sandbox="allow-scripts allow-same-origin"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-neutral-900">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 whitespace-nowrap">Name</Label>
                                    <Input value={data.name} onChange={e => setData('name', e.target.value)} className="h-8 w-48 text-sm" placeholder="Template Name" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 whitespace-nowrap">Price / Day</Label>
                                    <Input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="h-8 w-24 text-sm" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 whitespace-nowrap">Reseller Price</Label>
                                    <Input type="number" step="0.01" value={data.reseller_price} onChange={e => setData('reseller_price', e.target.value)} className="h-8 w-24 text-sm" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsOpen(false)}>Cancel</Button>
                                <Button
                                    type="button"
                                    size="sm"
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
                                    className="h-8 text-xs bg-neutral-800 hover:bg-neutral-900 text-white dark:bg-neutral-700 dark:hover:bg-neutral-600"
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
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
                                    className="h-8 text-xs bg-pink-600 hover:bg-pink-700 text-white"
                                >
                                    <Save className="size-3.5 mr-1.5" /> {editingTemplate ? 'Publish Update' : 'Publish'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
