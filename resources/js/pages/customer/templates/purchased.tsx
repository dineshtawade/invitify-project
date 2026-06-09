import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Mail, Share2, Printer, Sparkles } from 'lucide-react';
import { normalizeConfig } from '@/utils/builder-utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
    },
    {
        title: 'My Invitations',
        href: '/customer/my-invitations',
    },
];

interface UserTemplate {
    id: number;
    user_id: number;
    template_id: number;
    custom_config: any;
    is_purchased: boolean;
    template: {
        name: string;
        bg_gradient: string;
    };
}

interface PageProps {
    purchasedTemplates: UserTemplate[];
}

const fontStyles: Record<string, string> = {
    playfair: "'Playfair Display', serif",
    vibes: "'Great Vibes', cursive",
    montserrat: "'Montserrat', sans-serif",
    cinzel: "'Cinzel', serif",
};

export default function PurchasedInvitations({ purchasedTemplates }: PageProps) {
    const [selectedInvitation, setSelectedInvitation] = useState<UserTemplate | null>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleOpenShare = (invitation: UserTemplate) => {
        setSelectedInvitation(invitation);
        setIsShareOpen(true);
        setCopied(false);
    };

    const handleCopyLink = () => {
        if (selectedInvitation) {
            const shareUrl = `${window.location.origin}/invitations/view/${selectedInvitation.id}`;
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePrint = (invitation: UserTemplate) => {
        const cfg = normalizeConfig(invitation.custom_config, invitation.template.bg_gradient);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            let pagesHtml = '';
            cfg.pages.forEach((page) => {
                let elementsHtml = '';
                page.elements.forEach(elem => {
                    const style = `
                        position: absolute;
                        left: ${elem.x}%;
                        top: ${elem.y}%;
                        width: ${elem.w}%;
                        height: ${elem.h}%;
                        display: flex;
                        align-items: center;
                        justify-content: ${elem.textAlign === 'left' ? 'flex-start' : elem.textAlign === 'right' ? 'flex-end' : 'center'};
                        text-align: ${elem.textAlign || 'center'};
                        font-family: ${fontStyles[elem.fontStyle || 'playfair'] || fontStyles.playfair};
                        color: ${elem.textColor || '#1f2937'};
                        font-size: ${elem.fontSize ? elem.fontSize + 'px' : '12px'};
                        font-weight: ${elem.fontWeight || 'normal'};
                        font-style: ${elem.isItalic ? 'italic' : 'normal'};
                    `;
                    if (elem.type === 'text') {
                        elementsHtml += `<div style="${style}">${elem.content}</div>`;
                    } else if (elem.type === 'image' && elem.url) {
                        elementsHtml += `<div style="${style} overflow:hidden; border-radius:4px;"><img src="${elem.url}" style="width:100%; height:100%; object-fit:cover;" /></div>`;
                    } else if (elem.type === 'icon') {
                        elementsHtml += `<div style="${style} font-size: 20px;">💖</div>`;
                    } else if (elem.type === 'divider') {
                        elementsHtml += `<div style="${style}"><hr style="width:100%; border-top: 1px solid ${elem.color || '#1f2937'};" /></div>`;
                    } else if (elem.type === 'link') {
                        elementsHtml += `<div style="${style}"><span style="padding: 2px 8px; border: 1px solid ${elem.textColor || '#1f2937'}; border-radius: 99px;">📍 ${elem.content}</span></div>`;
                    }
                });

                pagesHtml += `
                    <div class="page-container w-full max-w-sm aspect-[3/4.2] rounded-2xl shadow-xl bg-gradient-to-tr ${page.bg_gradient} p-8 relative overflow-hidden border border-black/5 mb-8">
                        ${elementsHtml}
                    </div>
                `;
            });

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Invitation - ${invitation.template.name}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&display=swap" rel="stylesheet" />
                        <style>
                            @media print {
                                body { margin: 0; padding: 0; background: none; }
                                .no-print { display: none; }
                                .page-container { page-break-after: always; box-shadow: none; border: none; margin: 0; }
                            }
                        </style>
                    </head>
                    <body class="flex flex-col items-center py-8 bg-neutral-50 min-h-screen">
                        ${pagesHtml}
                        <div class="fixed top-4 left-4 no-print">
                            <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded font-semibold text-sm shadow hover:bg-blue-750">Print Invitation</button>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Invitations" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        My Invitations <Sparkles className="size-6 text-amber-500" />
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Manage your purchased templates, share links, or print them.
                    </p>
                </div>

                {purchasedTemplates.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 gap-4">
                        <span className="text-neutral-400">You haven't purchased any templates yet.</span>
                        <Link
                            href="/customer/templates"
                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Browse Templates
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {purchasedTemplates.map((t) => {
                            const cfg = normalizeConfig(t.custom_config, t.template.bg_gradient);
                            const firstPage = cfg.pages[0];
                            const titleElem = firstPage?.elements.find(e => e.id === 'elem-title' || e.type === 'text');
                            const coupleElem = firstPage?.elements.find(e => e.id === 'elem-couple' || (e.type === 'text' && e.fontSize && e.fontSize > 18));
                            const dateElem = firstPage?.elements.find(e => e.id === 'elem-datetime' || e.type === 'text');

                            return (
                                <div
                                    key={t.id}
                                    className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    {/* Live Card Graphic Preview */}
                                    <div
                                        className={`relative flex aspect-video flex-col items-center justify-center p-6 bg-gradient-to-tr ${firstPage?.bg_gradient || t.template.bg_gradient} border-b border-neutral-100 dark:border-neutral-850`}
                                    >
                                        <div className="text-center scale-85 opacity-90">
                                            <p className="text-[10px] tracking-wider uppercase font-semibold opacity-70">
                                                {titleElem?.content || 'THE WEDDING OF'}
                                            </p>
                                            <p className="font-serif text-lg font-bold my-1 truncate max-w-[180px]">
                                                {coupleElem?.content || 'Couple Names'}
                                            </p>
                                            <p className="text-[8px] opacity-70">
                                                {dateElem?.content || ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-1 flex-col justify-between p-5 gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                                {t.template.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-neutral-400 font-medium">
                                                Purchased invitation card
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handlePrint(t)}
                                                variant="outline"
                                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border-neutral-200 dark:border-neutral-850"
                                            >
                                                <Printer className="size-3.5" /> Print / PDF
                                            </Button>
                                            <Button
                                                onClick={() => handleOpenShare(t)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 text-xs font-semibold"
                                            >
                                                <Share2 className="size-3.5" /> Share Link
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Share invitation link dialog */}
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogContent className="max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Share Invitation
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 flex flex-col gap-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-normal">
                            Copy the guest-link below and send it to your friends and family via WhatsApp, email, or social media.
                        </p>

                        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
                            <span className="truncate text-xs font-mono text-neutral-600 dark:text-neutral-400 select-all flex-1">
                                {selectedInvitation ? `${window.location.origin}/invitations/view/${selectedInvitation.id}` : ''}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsShareOpen(false)}>
                            Close
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCopyLink}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            {copied ? 'Copied!' : 'Copy Link'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
