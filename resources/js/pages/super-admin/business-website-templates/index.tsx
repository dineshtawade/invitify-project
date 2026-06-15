import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash, Briefcase, Pencil, Save } from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block } from '@/components/design-editor/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/super-admin/dashboard' },
    { title: 'Business Website Templates', href: '/super-admin/business-website-templates' },
];

const DEFAULT_PAGES = {
    home: { title: 'Home', slug: 'home', enabled: true, blocks: [] },
    about: { title: 'About Us', slug: 'about', enabled: true, blocks: [] },
    services: { title: 'Services', slug: 'services', enabled: true, blocks: [] },
    faq: { title: 'FAQ', slug: 'faq', enabled: true, blocks: [] },
    testimonials: { title: 'Testimonials', slug: 'testimonials', enabled: true, blocks: [] },
    contact: { title: 'Contact', slug: 'contact', enabled: true, blocks: [] },
};

export default function BusinessWebsiteTemplatesIndex({ templates = [] }: { templates: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<string>('home');

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        price: '0.00',
        preview_image: '',
        pages: {} as Record<string, any>,
    });

    const handleOpenAdd = () => {
        setEditingTemplate(null);
        reset();
        setData({
            name: '',
            price: '0.00',
            preview_image: '',
            pages: JSON.parse(JSON.stringify(DEFAULT_PAGES)),
        });
        setActiveTab('home');
        setIsOpen(true);
    };

    const handleOpenEdit = (template: any) => {
        setEditingTemplate(template);
        setData({
            name: template.name,
            price: String(template.price),
            preview_image: template.preview_image || '',
            pages: template.pages || JSON.parse(JSON.stringify(DEFAULT_PAGES)),
        });
        setActiveTab('home');
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            put(`/super-admin/business-website-templates/${editingTemplate.id}`, { onSuccess: () => setIsOpen(false) });
        } else {
            post('/super-admin/business-website-templates', { onSuccess: () => setIsOpen(false) });
        }
    };

    const currentBlocks = data.pages[activeTab]?.blocks || [];
    const handleBlocksChange = (newBlocks: Block[]) => {
        setData('pages', {
            ...data.pages,
            [activeTab]: { ...data.pages[activeTab], blocks: newBlocks }
        });
    };

    const togglePageEnabled = (slug: string) => {
        setData('pages', {
            ...data.pages,
            [slug]: { ...data.pages[slug], enabled: !data.pages[slug].enabled }
        });
    };

    const pagesNav = Object.values(data.pages)
        .filter((p: any) => p.enabled)
        .map((p: any) => ({ slug: p.slug, title: p.title, active: p.slug === activeTab }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business Website Templates" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Briefcase className="size-8 text-blue-600" /> Business Website Templates
                        </h1>
                        <p className="text-neutral-500 text-sm">Design multi-page business templates.</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="size-4 mr-2" /> Design Template
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((t) => (
                        <div key={t.id} className="rounded-2xl border p-5 shadow-xs flex flex-col justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Business Site</span>
                                    <span className="text-sm font-bold">₹{parseFloat(String(t.price)).toFixed(2)}</span>
                                </div>
                                <h3 className="text-lg font-bold">{t.name}</h3>
                            </div>
                            <div className="flex gap-2 mt-6 border-t pt-4">
                                <Button onClick={() => handleOpenEdit(t)} variant="outline" size="sm" className="flex-1"><Pencil className="size-3 mr-1" /> Edit</Button>
                                <Button onClick={() => { if (confirm('Delete?')) router.delete(`/super-admin/business-website-templates/${t.id}`) }} variant="destructive" size="sm"><Trash className="size-3" /></Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] flex flex-col p-0">
                        <DialogHeader className="p-4 border-b flex-row justify-between bg-white">
                            <DialogTitle className="text-xl font-bold">
                                {editingTemplate ? `Edit: ${editingTemplate.name}` : 'New Business Template'}
                            </DialogTitle>
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Name</Label>
                                    <Input value={data.name} onChange={e => setData('name', e.target.value)} className="h-8" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Price</Label>
                                    <Input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="h-8 w-24" />
                                </div>
                                <Button onClick={handleSubmit} disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
                                    <Save className="size-4 mr-2" /> Save Template
                                </Button>
                            </div>
                        </DialogHeader>

                        {/* Page Tabs */}
                        <div className="flex bg-neutral-100 border-b px-4 gap-2 py-2 overflow-x-auto">
                            {Object.values(data.pages).map((page: any) => (
                                <button
                                    key={page.slug}
                                    onClick={() => setActiveTab(page.slug)}
                                    className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 border-x border-t transition-all ${activeTab === page.slug
                                        ? 'bg-white text-blue-600 border-neutral-200 border-b-transparent shadow-sm'
                                        : 'bg-neutral-50/50 text-neutral-500 border-transparent hover:bg-neutral-200'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={page.enabled}
                                        onChange={() => togglePageEnabled(page.slug)}
                                        onClick={e => e.stopPropagation()}
                                        className="rounded border-neutral-300 text-blue-600"
                                    />
                                    {page.title}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-hidden bg-white">
                            {!data.pages[activeTab]?.enabled ? (
                                <div className="flex items-center justify-center h-full text-neutral-500">
                                    This page is disabled. Check the box above to enable and edit it.
                                </div>
                            ) : (
                                <SharedEditor
                                    key={activeTab} // Force remount on tab change
                                    blocks={currentBlocks}
                                    onChange={handleBlocksChange}
                                    isInvitation={false}
                                    title={data.name}
                                    pagesNav={pagesNav}
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
