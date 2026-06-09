import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Save, ExternalLink } from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block } from '@/components/design-editor/types';

export default function ResellerBusinessWebsiteEdit({ website }: { website: any }) {
    const [activeTab, setActiveTab] = useState<string>('home');

    const { data, setData, put, processing } = useForm({
        title: website.title,
        theme: website.theme,
        is_published: website.is_published,
        pages: website.pages || {},
        meta_description: website.meta_description || '',
        meta_keywords: website.meta_keywords || '',
    });

    const handleSave = () => {
        put(`/reseller/business-websites/${website.id}`);
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
        <AppLayout breadcrumbs={[
            { title: 'Reseller Dashboard', href: '/reseller/dashboard' },
            { title: 'My Hosted Websites', href: '/reseller/websites' },
            { title: website.title, href: `/reseller/business-websites/${website.id}/edit` },
        ]}>
            <Head title={`Edit: ${website.title}`} />
            
            <div className="flex flex-col h-[calc(100vh-4rem)]">
                {/* Header Navbar */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Briefcase className="size-6 text-indigo-650" />
                        <div>
                            <h1 className="text-xl font-bold">{website.title}</h1>
                            <a href={`/business/${website.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                invitify.com/business/{website.slug} <ExternalLink className="size-3" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 border-r pr-6">
                            <Label htmlFor="published" className="text-sm font-bold cursor-pointer">Published</Label>
                            <input 
                                type="checkbox"
                                id="published"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="size-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-2 border-r pr-6">
                            <Label className="text-sm font-bold">Theme</Label>
                            <select 
                                value={data.theme} 
                                onChange={(e) => setData('theme', e.target.value)}
                                className="h-9 rounded-md border border-neutral-200 text-sm px-3 focus:ring-indigo-500"
                            >
                                <option value="royal">Royal Professional</option>
                                <option value="cozy">Cozy Warm</option>
                                <option value="ocean">Ocean Tech</option>
                                <option value="clean">Clean Minimal</option>
                            </select>
                        </div>

                        <Button onClick={handleSave} disabled={processing} className="bg-indigo-600 hover:bg-indigo-750 text-white shadow-md">
                            <Save className="size-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>

                {/* SEO & Meta Tools */}
                <div className="bg-neutral-50 border-b px-6 py-3 flex gap-6 shrink-0 text-sm">
                    <div className="flex-1 flex items-center gap-2">
                        <Label className="font-bold whitespace-nowrap text-xs uppercase text-neutral-500">Site Description</Label>
                        <Input value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} placeholder="Global SEO Description for search engines" className="h-8 bg-white" />
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                        <Label className="font-bold whitespace-nowrap text-xs uppercase text-neutral-500">Keywords</Label>
                        <Input value={data.meta_keywords} onChange={e => setData('meta_keywords', e.target.value)} placeholder="comma, separated, keywords" className="h-8 bg-white" />
                    </div>
                </div>

                {/* Page Tabs */}
                <div className="flex bg-neutral-100 border-b px-4 gap-2 pt-2 shrink-0 overflow-x-auto">
                    {Object.values(data.pages).map((page: any) => (
                        <button
                            key={page.slug}
                            onClick={() => setActiveTab(page.slug)}
                            className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 border-x border-t transition-all ${
                                activeTab === page.slug 
                                    ? 'bg-white text-indigo-650 border-neutral-200 border-b-transparent shadow-sm' 
                                    : 'bg-neutral-50/50 text-neutral-500 border-transparent hover:bg-neutral-200'
                            }`}
                        >
                            <input 
                                type="checkbox" 
                                checked={page.enabled} 
                                onChange={() => togglePageEnabled(page.slug)}
                                onClick={e => e.stopPropagation()}
                                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            {page.title}
                        </button>
                    ))}
                </div>

                {/* Editor Body */}
                <div className="flex-1 overflow-hidden bg-white">
                    {!data.pages[activeTab]?.enabled ? (
                        <div className="flex items-center justify-center h-full text-neutral-500">
                            This page is disabled. Check the box above to enable and edit it.
                        </div>
                    ) : (
                        <SharedEditor 
                            key={activeTab}
                            blocks={currentBlocks} 
                            onChange={handleBlocksChange}
                            isInvitation={false}
                            title={data.title}
                            slug={website.slug}
                            pagesNav={pagesNav}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
