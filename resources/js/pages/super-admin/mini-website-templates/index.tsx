import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash, Globe, Pencil, Save } from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block } from '@/components/design-editor/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/super-admin/dashboard' },
    { title: 'Mini Website Templates', href: '/super-admin/mini-website-templates' },
];

export default function MiniWebsiteTemplatesIndex({ templates = [], customBlocks = [] }: { templates: any[], customBlocks?: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        price: '0.00',
        preview_image: '',
        config: [] as Block[],
    });

    const handleOpenAdd = () => {
        setEditingTemplate(null);
        reset();
        setData({
            name: '',
            price: '0.00',
            preview_image: '',
            config: [
                {
                    id: 'block_hero_1',
                    type: 'hero',
                    title: 'You are Invited!',
                    subtitle: 'Join us for a special celebration.',
                    bg_color: 'from-pink-500 to-rose-600',
                    cta_text: 'RSVP Now',
                    cta_link: '#rsvp'
                }
            ],
        });
        setIsOpen(true);
    };

    const handleOpenEdit = (template: any) => {
        setEditingTemplate(template);
        setData({
            name: template.name,
            price: String(template.price),
            preview_image: template.preview_image || '',
            config: template.config || [],
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
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Globe className="size-8 text-pink-600" /> Mini Website Templates
                        </h1>
                        <p className="text-neutral-500 text-sm">Design single-page invitation templates.</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-pink-600 hover:bg-pink-700 text-white">
                        <Plus className="size-4 mr-2" /> Design Template
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((t) => (
                        <div key={t.id} className="rounded-2xl border p-5 shadow-xs flex flex-col justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Mini Site</span>
                                    <span className="text-sm font-bold">₹{parseFloat(String(t.price)).toFixed(2)}</span>
                                </div>
                                <h3 className="text-lg font-bold">{t.name}</h3>
                            </div>
                            <div className="flex gap-2 mt-6 border-t pt-4">
                                <Button onClick={() => handleOpenEdit(t)} variant="outline" size="sm" className="flex-1"><Pencil className="size-3 mr-1" /> Edit</Button>
                                <Button onClick={() => { if (confirm('Delete?')) router.delete(`/super-admin/mini-website-templates/${t.id}`) }} variant="destructive" size="sm"><Trash className="size-3" /></Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] flex flex-col p-0">
                        <DialogHeader className="p-6 border-b flex-row justify-between">
                            <DialogTitle className="text-xl font-bold">
                                {editingTemplate ? `Edit: ${editingTemplate.name}` : 'New Mini Template'}
                            </DialogTitle>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Name</Label>
                                    <Input value={data.name} onChange={e => setData('name', e.target.value)} className="h-8" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Price / Day</Label>
                                    <Input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="h-8 w-24" />
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-hidden">
                            <SharedEditor
                                blocks={data.config}
                                onChange={(blocks) => setData('config', blocks)}
                                isInvitation={true}
                                title={data.name}
                                customBlocks={customBlocks}
                            />
                        </div>

                        <DialogFooter className="p-4 border-t">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={processing} className="bg-pink-600 hover:bg-pink-700 text-white">
                                <Save className="size-4 mr-2" /> Save Template
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
