import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Plus, Settings, Trash, ExternalLink, RefreshCw } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function BusinessWebsitesIndex({ websites, templates }: { websites: any[], templates: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        template_id: '',
        title: '',
        slug: '',
        theme: 'royal',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customer/business-websites', {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/customer/dashboard' },
            { title: 'My Business Websites', href: '/customer/business-websites' },
        ]}>
            <Head title="My Business Websites" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Briefcase className="size-8 text-blue-600" /> My Business Websites
                        </h1>
                        <p className="text-neutral-500 mt-1">Manage your multi-page professional business sites.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="size-4 mr-2" /> Create New Site
                    </Button>
                </div>

                {websites.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed p-12 text-center flex flex-col items-center justify-center bg-white/50">
                        <div className="size-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                            <Briefcase className="size-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Business Sites Yet</h3>
                        <p className="text-neutral-500 max-w-md mx-auto mb-6">Create a stunning multi-page website for your business in minutes using our premium templates.</p>
                        <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">Create Your First Site</Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {websites.map(site => (
                            <div key={site.id} className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
                                {site.is_expired && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                        EXPIRED
                                    </div>
                                )}
                                
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`size-3 rounded-full ${site.is_published ? 'bg-green-500' : 'bg-neutral-300'}`} title={site.is_published ? 'Published' : 'Draft'} />
                                        <h3 className="font-bold text-lg leading-tight truncate">{site.title}</h3>
                                    </div>
                                    <a href={`/business/${site.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-4 truncate">
                                        invitify.com/business/{site.slug} <ExternalLink className="size-3" />
                                    </a>
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                    <Link href={`/customer/business-websites/${site.id}/edit`} className="flex-1">
                                        <Button variant="outline" className="w-full bg-neutral-50 hover:bg-neutral-100">
                                            <Settings className="size-4 mr-2" /> Editor
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Business Website</DialogTitle>
                            <DialogDescription>Select a multi-page template to start building.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreate} className="flex flex-col gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Template</Label>
                                <select 
                                    className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950"
                                    value={data.template_id}
                                    onChange={e => setData('template_id', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select a template...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} (₹{parseFloat(t.price).toFixed(2)})</option>
                                    ))}
                                </select>
                                {errors.template_id && <p className="text-red-500 text-xs">{errors.template_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label>Website Title</Label>
                                <Input value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Acme Corp" required />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label>URL Slug</Label>
                                <div className="flex items-center">
                                    <span className="bg-neutral-100 border border-r-0 border-neutral-200 px-3 py-2 rounded-l-md text-sm text-neutral-500">invitify.com/business/</span>
                                    <Input value={data.slug} onChange={e => setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="rounded-l-none" placeholder="acme-corp" required />
                                </div>
                                {errors.slug && <p className="text-red-500 text-xs">{errors.slug}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label>Theme Preset</Label>
                                <select 
                                    className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950"
                                    value={data.theme}
                                    onChange={e => setData('theme', e.target.value)}
                                    required
                                >
                                    <option value="royal">Royal Professional (Amber/Dark)</option>
                                    <option value="ocean">Ocean Tech (Blue/Cyan)</option>
                                    <option value="clean">Clean Minimal (Monochrome)</option>
                                    <option value="cozy">Cozy Warm (Rose/Stone)</option>
                                </select>
                            </div>

                            <DialogFooter className="mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">Create Website</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
