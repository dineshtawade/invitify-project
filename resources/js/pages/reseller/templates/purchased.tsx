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
import { Mail, Share2, Printer, Sparkles, Download, Video, PlayCircle } from 'lucide-react';
import { normalizeConfig } from '@/utils/builder-utils';
import { toPng } from 'html-to-image';
import VideoGenerator from '@/components/video-generator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reseller Dashboard',
        href: '/reseller/dashboard',
    },
    {
        title: 'My Invitations',
        href: '/reseller/my-invitations',
    },
];

interface UserTemplate {
    id: number;
    user_id: number;
    template_id: number;
    custom_config: any;
    is_purchased: boolean;
    video_path: string | null;
    video_url: string | null;
    template: {
        name: string;
        bg_gradient: string;
        type: 'image' | 'video';
        default_config?: any;
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

    const [selectedDownloadInvitation, setSelectedDownloadInvitation] = useState<UserTemplate | null>(null);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isDownloadingIndex, setIsDownloadingIndex] = useState<number | null>(null);

    // Video Generator states
    const [selectedVideoTemplate, setSelectedVideoTemplate] = useState<UserTemplate | null>(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const handleOpenDownload = (invitation: UserTemplate) => {
        setSelectedDownloadInvitation(invitation);
        setIsDownloadOpen(true);
    };

    const handleDownloadPage = async (pageIdx: number) => {
        if (!selectedDownloadInvitation) return;

        const element = document.getElementById(`download-card-page-${pageIdx}`);
        if (!element) {
            alert('Error generating preview. Please try again.');
            return;
        }

        try {
            setIsDownloadingIndex(pageIdx);

            // Wait slightly for DOM to render
            await new Promise(resolve => setTimeout(resolve, 300));

            const dataUrl = await toPng(element, {
                cacheBust: true,
                pixelRatio: 3, // High quality render
                backgroundColor: 'transparent',
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    width: element.offsetWidth + 'px',
                    height: element.offsetHeight + 'px',
                }
            });

            const link = document.createElement('a');
            link.download = `${selectedDownloadInvitation.template.name}-page-${pageIdx + 1}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Oops, something went wrong!', error);
            alert('Failed to generate PNG image. Please try again.');
        } finally {
            setIsDownloadingIndex(null);
        }
    };

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
                    <p className="">
                        Manage your purchased templates, share links, or print them.
                    </p>
                </div>

                {purchasedTemplates.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 gap-4">
                        <span className="text-neutral-400">You haven't purchased any templates yet.</span>
                        <Link
                            href="/reseller/shop"
                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Browse Templates
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {purchasedTemplates.map((t) => {
                            const isVideo = t.template.type === 'video';
                            let firstPage, titleElem, coupleElem, dateElem;
                            if (!isVideo) {
                                const cfg = normalizeConfig(t.custom_config, t.template.bg_gradient);
                                firstPage = cfg.pages[0];
                                titleElem = firstPage?.elements.find(e => e.id === 'elem-title' || e.type === 'text');
                                coupleElem = firstPage?.elements.find(e => e.id === 'elem-couple' || (e.type === 'text' && e.fontSize && e.fontSize > 18));
                                dateElem = firstPage?.elements.find(e => e.id === 'elem-datetime' || e.type === 'text');
                            }

                            return (
                                <div
                                    key={t.id}
                                    className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    {/* Live Card Graphic Preview */}
                                    <div
                                        className={`relative flex aspect-video flex-col items-center justify-center border-b border-neutral-100 dark:border-neutral-850 overflow-hidden ${isVideo ? 'bg-black' : `p-6 bg-gradient-to-tr ${firstPage?.bg_gradient || t.template.bg_gradient}`}`}
                                    >
                                        {isVideo ? (
                                            <>
                                                {t.custom_config?.video_url || t.template?.default_config?.video_url ? (
                                                    <video
                                                        src={t.custom_config?.video_url || t.template?.default_config?.video_url}
                                                        className="w-full h-full object-cover opacity-75"
                                                        muted
                                                        playsInline
                                                        loop
                                                        autoPlay
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-neutral-900" />
                                                )}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none z-10">
                                                    <div className="w-10 h-10 bg-black/40 backdrop-blur-xs rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                                                        <PlayCircle className="size-5 text-indigo-400" />
                                                    </div>
                                                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/80 drop-shadow-md">Video Template</span>
                                                </div>
                                            </>
                                        ) : (
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
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-1 flex-col justify-between p-5 gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                                {t.template.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-neutral-400 font-medium">
                                                {isVideo ? 'Purchased video invitation' : 'Purchased invitation card'}
                                            </p>
                                        </div>

                                        <div className={`grid gap-1.5 ${isVideo ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                            {!isVideo && (
                                                <>
                                                    <Button
                                                        onClick={() => handlePrint(t)}
                                                        variant="outline"
                                                        className="flex items-center justify-center gap-1 text-[10px] px-1 font-semibold border-neutral-200 dark:border-neutral-850"
                                                        title="Print or Save as PDF"
                                                    >
                                                        <Printer className="size-3" /> Print
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleOpenDownload(t)}
                                                        variant="outline"
                                                        className="flex items-center justify-center gap-1 text-[10px] px-1 font-semibold border-neutral-200 dark:border-neutral-850"
                                                        title="Download as PNG"
                                                    >
                                                        <Download className="size-3" /> PNG
                                                    </Button>
                                                </>
                                            )}
                                            <Link
                                                href={`/reseller/templates/${t.template_id}/customize`}
                                                className={`text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs flex items-center gap-1 mt-1 ${isVideo ? 'justify-center py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100' : ''}`}
                                            >
                                                Edit Design →
                                            </Link>
                                        </div>
                                        <div className={`grid gap-2 mt-2 ${isVideo ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            <Button
                                                onClick={() => handleOpenShare(t)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 text-[10px] px-1 font-semibold"
                                                title="Share guest link"
                                            >
                                                <Share2 className="size-3" /> Share
                                            </Button>

                                            {isVideo && (
                                                t.video_url ? (
                                                    <div className="grid grid-cols-2 gap-1">
                                                        <a
                                                            href={t.video_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 dark:text-indigo-300 flex items-center justify-center gap-1 text-[10px] px-1 py-1.5 rounded-lg font-semibold transition-colors"
                                                        >
                                                            <PlayCircle className="size-3" /> Play
                                                        </a>
                                                        <a
                                                            href={t.video_url}
                                                            download
                                                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 dark:text-indigo-300 flex items-center justify-center gap-1 text-[10px] px-1 py-1.5 rounded-lg font-semibold transition-colors"
                                                        >
                                                            <Download className="size-3" /> Save
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={() => { setSelectedVideoTemplate(t); setIsVideoOpen(true); }}
                                                        className="flex items-center justify-center gap-1 text-[10px] px-1 font-semibold"
                                                    >
                                                        <Video className="size-3" /> Generate MP4
                                                    </Button>
                                                )
                                            )}
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

            {/* PNG Download Dialog */}
            <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
                <DialogContent className="max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-h-[85vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Download Invitation Pages
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 flex-1 overflow-y-auto flex flex-col gap-6 items-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center px-4 leading-normal">
                            Select the page you want to download as a high-resolution PNG image.
                        </p>

                        {selectedDownloadInvitation && (() => {
                            let parsedConfig = selectedDownloadInvitation.custom_config;
                            if (typeof parsedConfig === 'string') {
                                try {
                                    parsedConfig = JSON.parse(parsedConfig);
                                } catch (e) { }
                            }
                            const cfg = normalizeConfig(parsedConfig, selectedDownloadInvitation.template.bg_gradient);
                            return (
                                <div className="flex flex-col gap-8 w-full max-w-[280px]">
                                    {cfg.pages.map((page, idx) => (
                                        <div key={page.id} className="flex flex-col items-center gap-3 w-full">
                                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Page {idx + 1}</span>

                                            {/* Rendered Invitation Card for html2image capture */}
                                            <div
                                                id={`download-card-page-${idx}`}
                                                className={`w-full aspect-[3/4.2] rounded-2xl shadow-md bg-gradient-to-tr ${page.bg_gradient} relative overflow-hidden border border-neutral-200 dark:border-neutral-800`}
                                            >
                                                {page.elements.map((elem) => {
                                                    const style: React.CSSProperties = {
                                                        position: 'absolute',
                                                        left: `${elem.x}%`,
                                                        top: `${elem.y}%`,
                                                        width: `${elem.w}%`,
                                                        height: `${elem.h}%`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: elem.textAlign === 'left' ? 'flex-start' : elem.textAlign === 'right' ? 'flex-end' : 'center',
                                                        textAlign: elem.textAlign || 'center',
                                                        fontFamily: fontStyles[elem.fontStyle || 'playfair'] || fontStyles.playfair,
                                                        color: elem.textColor || '#1f2937',
                                                        fontSize: elem.fontSize ? `${elem.fontSize}px` : '12px',
                                                        fontWeight: elem.fontWeight || 'normal',
                                                        fontStyle: elem.isItalic ? 'italic' : 'normal',
                                                        textShadow: elem.type === 'text' && elem.textShadow && elem.textShadow !== 'none' ? elem.textShadow : undefined,
                                                        opacity: elem.type === 'image' && elem.opacity !== undefined ? elem.opacity / 100 : 1,
                                                        zIndex: elem.isBackground ? 5 : elem.type === 'image' ? 10 : elem.type === 'divider' ? 15 : elem.type === 'text' ? 20 : 25,
                                                    };

                                                    return (
                                                        <div key={elem.id} style={style}>
                                                            {elem.type === 'text' && (
                                                                <span style={{ width: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{elem.content}</span>
                                                            )}

                                                            {elem.type === 'image' && elem.url && (
                                                                <div className="w-full h-full rounded overflow-hidden">
                                                                    <img src={elem.url} alt="Image Layer" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}

                                                            {elem.type === 'icon' && (
                                                                <span className="w-full h-full flex items-center justify-center text-lg">
                                                                    {elem.iconType === 'heart' ? '❤️' : elem.iconType === 'sparkle' ? '✨' : elem.iconType === 'cake' ? '🎂' : elem.iconType === 'baby' ? '👶' : '💍'}
                                                                </span>
                                                            )}

                                                            {elem.type === 'divider' && (
                                                                <div className="w-full h-full flex items-center justify-center px-1">
                                                                    <hr className="w-full border-t" style={{ borderColor: elem.color || '#1f2937' }} />
                                                                </div>
                                                            )}

                                                            {elem.type === 'link' && (
                                                                <span
                                                                    className="px-2 py-0.5 bg-neutral-900/5 border rounded-full text-[8px] font-bold flex items-center gap-0.5"
                                                                    style={{ borderColor: elem.textColor || '#1f2937', color: elem.textColor || '#1f2937' }}
                                                                >
                                                                    📍 {elem.content || 'Location'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={() => handleDownloadPage(idx)}
                                                disabled={isDownloadingIndex !== null}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 text-xs font-semibold"
                                            >
                                                <Download className="size-3.5" />
                                                {isDownloadingIndex === idx ? 'Generating PNG...' : 'Download Page PNG'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>

                    <DialogFooter className="shrink-0 border-t pt-3 mt-2">
                        <Button type="button" variant="outline" onClick={() => setIsDownloadOpen(false)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Video Generator Dialog */}
            {selectedVideoTemplate && (
                <VideoGenerator
                    userTemplate={selectedVideoTemplate}
                    isOpen={isVideoOpen}
                    onClose={() => {
                        setIsVideoOpen(false);
                        setSelectedVideoTemplate(null);
                    }}
                    uploadEndpoint={`/reseller/user-templates/${selectedVideoTemplate.id}/upload-video`}
                    onComplete={(url) => {
                        window.location.reload(); // Reload to show the video URL and buttons
                    }}
                />
            )}
        </AppLayout>
    );
}
