import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Save, ExternalLink } from 'lucide-react';
import { SharedEditor } from '@/components/design-editor/SharedEditor';
import type { Block } from '@/components/design-editor/types';

export default function MiniWebsiteEdit({ website }: { website: any }) {
    const { data, setData, put, processing } = useForm({
        title: website.title,
        theme: website.theme,
        is_published: website.is_published,
        config: website.config || [] as Block[],
    });

    const handleSave = () => {
        put(`/customer/mini-websites/${website.id}`);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/customer/dashboard' },
            { title: 'My Mini Websites', href: '/customer/mini-websites' },
            { title: website.title, href: `/customer/mini-websites/${website.id}/edit` },
        ]}>
            <Head title={`Edit: ${website.title}`} />
            
            <div className="flex flex-col h-[calc(100vh-4rem)]">
                {/* Header Navbar */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Globe className="size-6 text-pink-600" />
                        <div>
                            <h1 className="text-xl font-bold">{website.title}</h1>
                            <a href={`/sites/${website.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                invitify.com/sites/{website.slug} <ExternalLink className="size-3" />
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
                                className="size-4 rounded border-neutral-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-sm font-bold">Theme</Label>
                            <select 
                                value={data.theme} 
                                onChange={(e) => setData('theme', e.target.value)}
                                className="h-9 rounded-md border border-neutral-200 text-sm px-3 focus:ring-pink-500"
                            >
                                <option value="royal">Royal Event</option>
                                <option value="cozy">Cozy Warm</option>
                                <option value="ocean">Ocean Blue</option>
                                <option value="clean">Clean Minimal</option>
                            </select>
                        </div>

                        <Button onClick={handleSave} disabled={processing} className="bg-pink-600 hover:bg-pink-700 text-white shadow-md">
                            <Save className="size-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>

                {/* Editor Body */}
                <SharedEditor 
                    blocks={data.config} 
                    onChange={(blocks) => setData('config', blocks)}
                    isInvitation={true}
                    title={data.title}
                    slug={website.slug}
                />
            </div>
        </AppLayout>
    );
}
