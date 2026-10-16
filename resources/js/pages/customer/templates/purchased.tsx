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
import {
    Mail, Share2, Printer, Sparkles, Download, PlayCircle, Video,
    Copy, Check, QrCode, Loader2, Users, UserCheck, Heart, Phone, Search,
    CheckCircle2, XCircle, HelpCircle, Globe, Layers, ArrowUpRight
} from 'lucide-react';
import { normalizeConfig } from '@/utils/builder-utils';
import { toPng } from 'html-to-image';
import VideoGenerator from '@/components/video-generator';
import { Input } from '@/components/ui/input';
import { getFontFamilyCss, getFontFamilyName, loadGoogleFont } from '@/utils/font-utils';

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
        type: string;
        bg_gradient: string;
    };
    video_url?: string | null;
    edit_count: number;
}

interface BusinessCard {
    id: number;
    company_name: string;
    slug: string;
    theme_css: string;
    created_at: string;
}

interface DashboardMiniWebsite {
    id: number;
    uuid: string;
    type: string;
    title: string;
    slug: string;
    theme: string;
    is_published: boolean;
    rsvps_count?: number;
    created_at: string;
    preview_image?: string | null;
}

interface RSVP {
    id: number;
    mini_website_id: number;
    name: string;
    mobile_number?: string;
    email?: string;
    guests_count: number;
    status: 'yes' | 'no' | 'maybe' | 'attending' | 'declined' | string;
    message: string | null;
    created_at: string;
    mini_website?: {
        id: number;
        title: string;
        slug: string;
        uuid?: string;
    };
}

interface PageProps {
    purchasedTemplates: UserTemplate[];
    businessCards?: BusinessCard[];
    miniWebsites?: DashboardMiniWebsite[];
    rsvps?: RSVP[];
}

const fontStyles: Record<string, string> = {
    playfair: "'Playfair Display', serif",
    vibes: "'Great Vibes', cursive",
    montserrat: "'Montserrat', sans-serif",
    cinzel: "'Cinzel', serif",
};

// developed by dinesh tawade
export default function PurchasedInvitations({ purchasedTemplates, businessCards = [], miniWebsites = [], rsvps = [] }: PageProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'invitations' | 'mini-websites' | 'business-cards' | 'guest-list'>('all');
    const [guestSearch, setGuestSearch] = useState('');
    const [guestStatusFilter, setGuestStatusFilter] = useState<'all' | 'yes' | 'maybe' | 'no'>('all');
    const [selectedWebsiteFilter, setSelectedWebsiteFilter] = useState<string>('all');

    const [selectedInvitation, setSelectedInvitation] = useState<UserTemplate | null>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const [selectedDownloadInvitation, setSelectedDownloadInvitation] = useState<UserTemplate | null>(null);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isDownloadingIndex, setIsDownloadingIndex] = useState<number | null>(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [selectedVideoTemplate, setSelectedVideoTemplate] = useState<UserTemplate | null>(null);

    // QR Code Customizer Modal state
    // developed by dinesh tawade
    interface QRItem {
        id: number;
        title: string;
        url: string;
        slug?: string;
        displayPath?: string;
        badgeText?: string;
        subtitleText?: string;
        type?: 'website' | 'video' | 'card';
    }

    const [isQROpen, setIsQROpen] = useState(false);
    const [selectedQRTarget, setSelectedQRTarget] = useState<QRItem | null>(null);
    const [qrTheme, setQrTheme] = useState<'gold' | 'black'>('gold');
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);

    const handleOpenQRModal = (target: QRItem) => {
        setSelectedQRTarget(target);
        setIsQROpen(true);
    };

    const handleOpenDownload = (invitation: UserTemplate) => {
        setSelectedDownloadInvitation(invitation);
        setIsDownloadOpen(true);
        // Preload any Google Fonts in invitation
        if (invitation.custom_config?.pages) {
            invitation.custom_config.pages.forEach((p: any) => {
                p.elements?.forEach((elem: any) => {
                    if (elem.type === 'text' && elem.fontStyle) {
                        loadGoogleFont(elem.fontStyle);
                    }
                });
            });
        }
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
            const shareUrl = `${window.location.origin}/invitations/view/${selectedInvitation.encrypted_id}`;
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Generate & Download styled QR Code (Luxury Gold or Sleek Black)
    // developed by dinesh tawade
    const downloadQRCode = async (target: QRItem, theme: 'gold' | 'black' = 'gold') => {
        try {
            setIsGeneratingQR(true);
            const url = target.url;
            const title = target.title;
            const badge = target.badgeText || (target.type === 'video' ? '✨ VIDEO INVITATION ✨' : '✨ WEDDING INVITATION ✨');
            const subtitle = target.subtitleText || (target.type === 'video' ? 'Scan to Watch Video Invite' : 'Scan to Open Invite');
            const displayLabel = target.displayPath || (target.slug ? `/${target.slug}` : '/invitation');

            // Generate QR code with matching colors and smooth borders
            // Gold: Dark #d4af37 (rich gold), Light #ffffff (clean white for high scannability)
            // Black: Dark #111111 (deep obsidian), Light #ffffff with rounded corners
            const darkColor = theme === 'gold' ? 'c59b27' : '111111';
            const lightColor = 'ffffff';
            const qrUrl = `https://quickchart.io/qr?size=600&text=${encodeURIComponent(url)}&dark=${darkColor}&light=${lightColor}&margin=1&ecLevel=H`;

            const img = new Image();
            img.crossOrigin = 'Anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = qrUrl;
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas not supported');

            const width = 640;
            const height = 820;
            canvas.width = width;
            canvas.height = height;

            if (theme === 'gold') {
                // LUXURY 3D GOLD CARD THEME
                // Rich background with subtle gradient
                const bgGrad = ctx.createLinearGradient(0, 0, width, height);
                bgGrad.addColorStop(0, '#ffffff');
                bgGrad.addColorStop(0.5, '#fcfaf6');
                bgGrad.addColorStop(1, '#f7f2e7');
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, width, height);

                // Luxury Double Border with Gold Shimmer
                const goldGrad = ctx.createLinearGradient(0, 0, width, height);
                goldGrad.addColorStop(0, '#d4af37');
                goldGrad.addColorStop(0.3, '#f4d068');
                goldGrad.addColorStop(0.6, '#aa7c11');
                goldGrad.addColorStop(1, '#e5c158');

                // Outer decorative border
                ctx.strokeStyle = goldGrad;
                ctx.lineWidth = 4;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(24, 24, width - 48, height - 48, 28);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(24, 24, width - 48, height - 48);
                }

                // Inner fine border
                ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
                ctx.lineWidth = 1.5;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(34, 34, width - 68, height - 68, 22);
                    ctx.stroke();
                }

                // Header Badge
                ctx.fillStyle = '#fbf5e6';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width / 2 - 100, 52, 200, 32, 16);
                    ctx.fill();
                    ctx.strokeStyle = '#ebd9aa';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                ctx.fillStyle = '#9b7824';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(badge, width / 2, 73);

                // Title Text
                ctx.fillStyle = '#1c1712';
                ctx.font = 'bold 30px serif';
                ctx.fillText(subtitle, width / 2, 122);

                ctx.fillStyle = '#84786d';
                ctx.font = '500 16px sans-serif';
                ctx.fillText(title.length > 35 ? title.substring(0, 32) + '...' : title, width / 2, 150);

                // QR Container Card with gold drop shadow
                ctx.shadowColor = 'rgba(212, 175, 55, 0.25)';
                ctx.shadowBlur = 25;
                ctx.shadowOffsetY = 10;
                ctx.fillStyle = '#ffffff';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(85, 185, 470, 470, 24);
                    ctx.fill();
                    ctx.shadowColor = 'transparent';
                    ctx.strokeStyle = goldGrad;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                } else {
                    ctx.fillRect(85, 185, 470, 470);
                }
                ctx.shadowColor = 'transparent';

                // Draw QR Code
                ctx.drawImage(img, 105, 205, 430, 430);

                // URL pill
                ctx.fillStyle = '#f7f4ed';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width / 2 - 160, 680, 320, 36, 18);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
                    ctx.stroke();
                }
                ctx.fillStyle = '#8c702a';
                ctx.font = 'bold 13px monospace';
                ctx.fillText(displayLabel, width / 2, 703);

                // Footer Text
                ctx.fillStyle = '#b3a08b';
                ctx.font = '600 13px sans-serif';
                ctx.fillText('Created with Invitify.com', width / 2, 755);

            } else {
                // SLEEK MODERN BLACK THEME
                // Dark obsidian gradient
                const darkBg = ctx.createLinearGradient(0, 0, width, height);
                darkBg.addColorStop(0, '#141416');
                darkBg.addColorStop(1, '#0a0a0c');
                ctx.fillStyle = darkBg;
                ctx.fillRect(0, 0, width, height);

                // Modern neon-white rim
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.lineWidth = 2;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(24, 24, width - 48, height - 48, 28);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(24, 24, width - 48, height - 48);
                }

                // Header Badge
                ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width / 2 - 100, 52, 200, 32, 16);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                ctx.fillStyle = '#e5e7eb';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(badge.replace(/✨/g, '').trim(), width / 2, 72);

                // Title Text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 30px sans-serif';
                ctx.fillText(subtitle, width / 2, 122);

                ctx.fillStyle = '#9ca3af';
                ctx.font = '500 16px sans-serif';
                ctx.fillText(title.length > 35 ? title.substring(0, 32) + '...' : title, width / 2, 150);

                // QR Container Card (Clean White rounded background for high contrast scanning)
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 30;
                ctx.shadowOffsetY = 12;
                ctx.fillStyle = '#ffffff';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(85, 185, 470, 470, 24);
                    ctx.fill();
                    ctx.shadowColor = 'transparent';
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.fillRect(85, 185, 470, 470);
                }
                ctx.shadowColor = 'transparent';

                // Draw QR Code
                ctx.drawImage(img, 105, 205, 430, 430);

                // URL pill
                ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width / 2 - 160, 680, 320, 36, 18);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
                    ctx.stroke();
                }
                ctx.fillStyle = '#d1d5db';
                ctx.font = 'bold 13px monospace';
                ctx.fillText(displayLabel, width / 2, 703);

                // Footer Text
                ctx.fillStyle = '#6b7280';
                ctx.font = '600 13px sans-serif';
                ctx.fillText('Invitify Digital Invite', width / 2, 755);
            }

            canvas.toBlob((blob) => {
                if (!blob) {
                    setIsGeneratingQR(false);
                    return;
                }
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                const cleanFileBase = (target.slug || target.title || 'invitation').replace(/[^a-zA-Z0-9_-]/g, '_');
                link.download = `${cleanFileBase}-QR-${theme.toUpperCase()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                setIsGeneratingQR(false);
            }, 'image/png');

        } catch (error) {
            console.error('Failed to download QR Code', error);
            setIsGeneratingQR(false);
            alert('Failed to generate QR code. Please check your network and try again.');
        }
    };

    const handlePrint = (invitation: UserTemplate) => {
        const cfg = normalizeConfig(invitation.custom_config, invitation.template.bg_gradient);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            let pagesHtml = '';
            const fontFamilies = Array.from(new Set(cfg.pages.flatMap(p => p.elements.filter(e => e.type === 'text' && e.fontStyle).map(e => getFontFamilyName(e.fontStyle)))));
            const dynamicFontLinks = fontFamilies.map(f => `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,600;0,700;1,400;1,700&display=swap" rel="stylesheet" />`).join('\n');

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
                        font-family: ${getFontFamilyCss(elem.fontStyle)};
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
                        ${dynamicFontLinks}
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

    const isAttending = (s: string) => s === 'yes' || s === 'attending';
    const isDeclined = (s: string) => s === 'no' || s === 'declined';
    const isMaybe = (s: string) => s === 'maybe';

    const filteredRsvps = rsvps.filter(r => {
        if (selectedWebsiteFilter !== 'all' && String(r.mini_website_id) !== selectedWebsiteFilter) {
            return false;
        }
        const q = guestSearch.toLowerCase();
        const matchesSearch = !q ||
            r.name.toLowerCase().includes(q) ||
            (r.mobile_number && r.mobile_number.includes(q)) ||
            (r.message && r.message.toLowerCase().includes(q)) ||
            (r.mini_website?.title && r.mini_website.title.toLowerCase().includes(q));

        if (!matchesSearch) return false;

        if (guestStatusFilter === 'yes') return isAttending(r.status);
        if (guestStatusFilter === 'no') return isDeclined(r.status);
        if (guestStatusFilter === 'maybe') return isMaybe(r.status);
        return true;
    });

    const totalAttendingGuests = rsvps
        .filter(r => isAttending(r.status))
        .reduce((sum, r) => sum + (r.guests_count || 1), 0);

    const yesCount = rsvps.filter(r => isAttending(r.status)).length;
    const maybeCount = rsvps.filter(r => isMaybe(r.status)).length;
    const noCount = rsvps.filter(r => isDeclined(r.status)).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Invitations & Guest List" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white flex items-center gap-2">
                            My Invitations
                        </h1>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mb-2.5 pt-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'all'
                                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                                }`}
                        >
                            <Sparkles className="size-4" />
                            All Items
                        </button>
                        {purchasedTemplates.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setActiveTab('invitations')}
                                className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'invitations'
                                    ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                                    }`}
                            >
                                <Mail className="size-4" />
                                Invitations ({purchasedTemplates.length})
                            </button>
                        )}
                        {miniWebsites.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setActiveTab('mini-websites')}
                                className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'mini-websites'
                                    ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                                    }`}
                            >
                                <Globe className="size-4" />
                                Invitation Website ({miniWebsites.length})
                            </button>
                        )}
                        {businessCards.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setActiveTab('business-cards')}
                                className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'business-cards'
                                    ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                                    }`}
                            >
                                <Sparkles className="size-4" />
                                Business Cards ({businessCards.length})
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setActiveTab('guest-list')}
                            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'guest-list'
                                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                                }`}
                        >
                            <Users className="size-4 text-emerald-600" />
                            Guest List (RSVPs)
                            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                {rsvps.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Invitations Grid */}
                {(activeTab === 'all' || activeTab === 'invitations') && purchasedTemplates.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {purchasedTemplates.map((t) => {
                            const isVideo = t.template.type === 'video';
                            let firstPage, titleElem, coupleElem, dateElem;
                            if (!isVideo) {
                                const cfg = normalizeConfig(t.custom_config, t.template.bg_gradient);
                                firstPage = cfg.pages[0];
                                titleElem = firstPage?.elements.find((e: any) => e.id === 'elem-title' || e.type === 'text');
                                coupleElem = firstPage?.elements.find((e: any) => e.id === 'elem-couple' || (e.type === 'text' && e.fontSize && e.fontSize > 18));
                                dateElem = firstPage?.elements.find((e: any) => e.id === 'elem-datetime' || e.type === 'text');
                            }

                            return (
                                <div
                                    key={t.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-xl shadow-neutral-200/50 hover:shadow-2xl hover:shadow-neutral-200/80 transition-all duration-300 dark:bg-neutral-900/50 dark:shadow-none dark:border dark:border-neutral-800"
                                >
                                    {/* Live Card Graphic Preview */}
                                    <div
                                        className={`relative flex aspect-video flex-col items-center justify-center overflow-hidden ${isVideo ? 'bg-black' : `p-6 bg-gradient-to-tr ${firstPage?.bg_gradient || t.template.bg_gradient}`}`}
                                    >
                                        {isVideo ? (
                                            <>
                                                {t.custom_config?.video_url ? (
                                                    <video
                                                        src={t.custom_config.video_url}
                                                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                                                        muted
                                                        playsInline
                                                        loop
                                                        autoPlay
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                                                        <Video className="size-8 text-neutral-700" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                                                    <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                                                        <PlayCircle className="size-6 text-white" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center scale-90 opacity-95 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 w-full max-w-[200px]">
                                                <p className="text-[9px] tracking-widest uppercase font-semibold text-neutral-500 mb-1">
                                                    {titleElem?.content || 'THE WEDDING OF'}
                                                </p>
                                                <p className="font-serif text-lg font-bold text-neutral-800 my-1 truncate w-full">
                                                    {coupleElem?.content || 'Couple Names'}
                                                </p>
                                                <p className="text-[9px] font-medium text-neutral-500 mt-1">
                                                    {dateElem?.content || ''}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-1 flex-col justify-between p-6 gap-5 bg-white dark:bg-neutral-900">
                                        <div>
                                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                                                {t.template.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                                                    {isVideo ? 'Video' : 'Card'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`grid gap-2 ${isVideo ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                            {!isVideo && (
                                                <>
                                                    <Button
                                                        onClick={() => handlePrint(t)}
                                                        variant="outline"
                                                        className="flex items-center justify-center gap-1.5 text-xs font-semibold h-9 rounded-xl border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                                                        title="Print or Save as PDF"
                                                    >
                                                        <Printer className="size-3.5" /> Print
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleOpenDownload(t)}
                                                        variant="outline"
                                                        className="flex items-center justify-center gap-1.5 text-xs font-semibold h-9 rounded-xl border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                                                        title="Download as PNG"
                                                    >
                                                        <Download className="size-3.5" /> PNG
                                                    </Button>
                                                </>
                                            )}
                                            {isVideo && t.edit_count >= 2 ? (
                                                <div
                                                    className="text-neutral-400 dark:text-neutral-500 font-semibold text-xs flex items-center justify-center gap-1 h-9 bg-neutral-100 dark:bg-neutral-800 rounded-xl cursor-not-allowed"
                                                >
                                                    Limit Reached
                                                </div>
                                            ) : (
                                                <Link
                                                    href={`/templates/${t.template?.encrypted_id || t.template_id}/customize`}
                                                    className={`text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 font-semibold text-xs flex items-center justify-center gap-1.5 h-9 rounded-xl transition-colors ${isVideo ? 'w-full' : ''}`}
                                                >
                                                    Edit <span className="hidden sm:inline">Design</span>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                            <Button
                                                onClick={() => handleOpenShare(t)}
                                                className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white flex items-center justify-center gap-1.5 text-xs font-semibold h-10 rounded-xl shadow-md"
                                            >
                                                <Share2 className="size-3.5" /> Share Link
                                            </Button>

                                            <Button
                                                onClick={() => handleOpenQRModal({
                                                    id: t.id,
                                                    title: t.template.name,
                                                    url: `${window.location.origin}/invitations/view/${t.encrypted_id}`,
                                                    displayPath: `/invitations/view/${t.encrypted_id.substring(0, 10)}...`,
                                                    badgeText: isVideo ? '✨ VIDEO INVITATION ✨' : '✨ WEDDING INVITATION ✨',
                                                    subtitleText: isVideo ? 'Scan to Watch Video' : 'Scan to Open Invite',
                                                    type: isVideo ? 'video' : 'card'
                                                })}
                                                variant="outline"
                                                className="border-amber-400/60 dark:border-amber-600/60 bg-amber-50/60 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50 text-amber-900 dark:text-amber-300 flex items-center justify-center gap-1.5 text-xs font-semibold h-10 rounded-xl shadow-xs"
                                                title="Luxury QR Code Card"
                                            >
                                                <QrCode className="size-3.5 text-amber-600 dark:text-amber-400" /> QR Code
                                            </Button>
                                        </div>

                                        {isVideo && (
                                            <div className="mt-2">
                                                {t.video_url ? (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <a
                                                            href={t.video_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 flex items-center justify-center gap-1.5 text-xs h-10 rounded-xl font-semibold transition-colors shadow-xs"
                                                        >
                                                            <PlayCircle className="size-4" /> Play
                                                        </a>
                                                        <a
                                                            href={t.video_url}
                                                            download
                                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center gap-1.5 text-xs h-10 rounded-xl font-semibold transition-colors shadow-xs"
                                                        >
                                                            <Download className="size-4" /> Save
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={() => { setSelectedVideoTemplate(t); setIsVideoOpen(true); }}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 text-xs font-semibold h-10 rounded-xl shadow-md shadow-indigo-600/20"
                                                    >
                                                        <Video className="size-4" /> Gen MP4
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {(activeTab === 'all' || activeTab === 'business-cards') && businessCards.length > 0 && (
                <div className="flex flex-col gap-6 p-6 pt-0 border-t border-neutral-200 dark:border-neutral-800 mt-6">
                    <div className="flex flex-col gap-2 mt-6">
                        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            My Business Cards <Sparkles className="size-4 text-amber-500" />
                        </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {businessCards.map((card) => (
                            <div
                                key={card.id}
                                className="group flex flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-xl shadow-neutral-200/50 hover:shadow-2xl hover:shadow-neutral-200/80 transition-all duration-300 dark:bg-neutral-900/50 dark:shadow-none dark:border dark:border-neutral-800"
                            >
                                <div className="relative flex aspect-video flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 overflow-hidden">
                                    {/* Mobile Mockup */}
                                    <div className="relative w-28 h-[160px] bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-blue-900/10 border-[6px] border-neutral-100 dark:border-neutral-800 overflow-hidden shrink-0 flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 z-10"></div>

                                        {/* Card content mock */}
                                        <div className="w-full h-full flex flex-col items-center p-3 pt-6 bg-gradient-to-br from-blue-600 to-indigo-700">
                                            <div className="w-10 h-10 rounded-full bg-white/20 mb-3 shadow-inner flex items-center justify-center backdrop-blur-sm">
                                                <Sparkles className="size-5 text-white" />
                                            </div>
                                            <p className="text-[9px] font-bold text-white leading-tight text-center break-words w-full truncate px-2">
                                                {card.company_name}
                                            </p>
                                            <div className="w-12 h-1.5 bg-white/40 rounded-full mt-3"></div>
                                            <div className="w-8 h-1.5 bg-white/30 rounded-full mt-1.5"></div>
                                        </div>
                                    </div>

                                    {/* Background decorative elements */}
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
                                </div>
                                <div className="flex flex-1 flex-col justify-between p-6 gap-5 bg-white dark:bg-neutral-900">
                                    <div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                                            {card.company_name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                                Business Card
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <Link
                                            href={`/customer/business-cards/${card.id}/edit`}
                                            className="flex-1 text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                                        >
                                            Edit Card
                                        </Link>
                                        <a
                                            href={`/card/${card.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center bg-indigo-600 text-white hover:bg-indigo-700 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                                        >
                                            <Share2 className="size-4" /> View
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(activeTab === 'all' || activeTab === 'mini-websites') && miniWebsites.length > 0 && (
                <div className="flex flex-col gap-6 p-6 pt-0 border-t border-neutral-200 dark:border-neutral-800 mt-6">
                    <div className="flex flex-col gap-2 mt-6">
                        <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                            My Invitation Website <Sparkles className="size-4 text-emerald-500" />
                        </h2>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mt-4">
                        <table className="w-full text-left text-sm text-neutral-600 border-collapse">
                            <thead className="bg-neutral-50 text-neutral-900 border-b border-neutral-200 font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold w-[120px]">Preview</th>
                                    <th className="px-6 py-4 font-bold">Website Details</th>
                                    <th className="px-6 py-4 font-bold w-[110px]">RSVPs</th>
                                    <th className="px-6 py-4 font-bold w-[140px]">Status</th>
                                    <th className="px-6 py-4 font-bold text-right w-[200px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {miniWebsites.map((site, index) => {
                                    const gradients = [
                                        'from-emerald-400 to-teal-500',
                                        'from-rose-400 to-red-500',
                                        'from-indigo-400 to-cyan-400',
                                        'from-amber-400 to-orange-500',
                                        'from-fuchsia-400 to-purple-600'
                                    ];
                                    const gradientClass = gradients[index % gradients.length];
                                    const initials = site.title ? site.title.substring(0, 2).toUpperCase() : 'MW';

                                    return (
                                        <tr key={site.id} className="hover:bg-neutral-50/50 transition-colors group align-middle">
                                            <td className="px-6 py-4">
                                                <div className="relative w-24 aspect-video rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200/50">
                                                    {site.preview_image ? (
                                                        <img src={site.preview_image} alt={site.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    ) : (
                                                        <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300`}>
                                                            <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-md shadow-sm border border-white/30 flex items-center justify-center">
                                                                <span className="text-xs font-bold text-white tracking-widest">{initials}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                                                        {site.title}
                                                    </h3>
                                                    <p className="text-xs text-neutral-500 font-mono inline-block">
                                                        /{site.slug}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedWebsiteFilter(String(site.id));
                                                        setActiveTab('guest-list');
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                                    title="Click to view this website's guests"
                                                >
                                                    <Users className="size-3" />
                                                    {site.rsvps_count || 0} Guests
                                                </button>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${site.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-600'}`}>
                                                    {site.is_published ? 'Live' : 'Draft'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/customer/mini-websites/${site.id}/submissions`}
                                                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 border border-amber-200"
                                                        title="View Guest RSVPs"
                                                    >
                                                        RSVPs
                                                    </Link>
                                                    <Link
                                                        href={`/customer/mini-websites/${site.uuid || site.id}/edit`}
                                                        className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <a
                                                        href={`/mini-website/${site.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                                                    >
                                                        <Share2 className="size-3.5" /> View
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenQRModal({
                                                            id: site.id,
                                                            slug: site.slug,
                                                            title: site.title,
                                                            url: `${window.location.origin}/mini-website/${site.slug}`,
                                                            displayPath: `/${site.slug}`,
                                                            badgeText: '✨ WEDDING INVITATION ✨',
                                                            subtitleText: 'Scan to Celebrate',
                                                            type: 'website'
                                                        })}
                                                        className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs shadow-amber-500/20 active:scale-95"
                                                        title="Download QR code in Gold or Black"
                                                    >
                                                        <QrCode className="size-3.5" />
                                                        QR
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Guest List Tab Content */}
            {(activeTab === 'all' || activeTab === 'guest-list') && (
                <div className="flex flex-col gap-6 p-6 pt-0 border-t border-neutral-200 dark:border-neutral-800 mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                Guest List (RSVPs) <Sparkles className="size-4 text-emerald-500" />
                            </h2>
                            <p className="text-xs text-neutral-500 mt-0.5">Guest responses and wishes received from your wedding mini-websites.</p>
                        </div>

                        {/* Metric Chips */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                Total: <span className="font-bold text-neutral-900 dark:text-white">{rsvps.length}</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                Attending: <span className="font-bold">{yesCount}</span> ({totalAttendingGuests} guests)
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-xs font-semibold text-amber-700 border border-amber-200">
                                Maybe: <span className="font-bold">{maybeCount}</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-xs font-semibold text-rose-700 border border-rose-200">
                                Declined: <span className="font-bold">{noCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter toolbar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
                        <div className="relative flex-1 max-w-md">
                            <Search className="size-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Search by guest name, mobile, message..."
                                value={guestSearch}
                                onChange={(e) => setGuestSearch(e.target.value)}
                                className="pl-9 h-9 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            {miniWebsites.length > 1 && (
                                <select
                                    value={selectedWebsiteFilter}
                                    onChange={(e) => setSelectedWebsiteFilter(e.target.value)}
                                    className="h-9 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-xs font-semibold text-neutral-700 dark:text-neutral-200 focus:outline-none"
                                >
                                    <option value="all">All Invitation Website</option>
                                    {miniWebsites.map((w) => (
                                        <option key={w.id} value={String(w.id)}>
                                            {w.title} ({w.rsvps_count || 0})
                                        </option>
                                    ))}
                                </select>
                            )}

                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant={guestStatusFilter === 'all' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setGuestStatusFilter('all')}
                                    className="text-xs h-8 px-2.5 rounded-xl font-semibold"
                                >
                                    All
                                </Button>
                                <Button
                                    type="button"
                                    variant={guestStatusFilter === 'yes' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setGuestStatusFilter('yes')}
                                    className={`text-xs h-8 px-2.5 rounded-xl font-semibold ${guestStatusFilter === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-emerald-700 hover:bg-emerald-50'}`}
                                >
                                    Attending
                                </Button>
                                <Button
                                    type="button"
                                    variant={guestStatusFilter === 'maybe' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setGuestStatusFilter('maybe')}
                                    className={`text-xs h-8 px-2.5 rounded-xl font-semibold ${guestStatusFilter === 'maybe' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'text-amber-700 hover:bg-amber-50'}`}
                                >
                                    Maybe
                                </Button>
                                <Button
                                    type="button"
                                    variant={guestStatusFilter === 'no' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setGuestStatusFilter('no')}
                                    className={`text-xs h-8 px-2.5 rounded-xl font-semibold ${guestStatusFilter === 'no' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'text-rose-700 hover:bg-rose-50'}`}
                                >
                                    Declined
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Guest list table */}
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm text-neutral-600 dark:text-neutral-400">
                                <thead className="bg-neutral-50/80 text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5 font-bold">Guest Name</th>
                                        <th scope="col" className="px-5 py-3.5 font-bold">Mobile Number</th>
                                        <th scope="col" className="px-5 py-3.5 font-bold">Attendance</th>
                                        <th scope="col" className="px-5 py-3.5 font-bold">Guests Count</th>
                                        <th scope="col" className="px-5 py-3.5 font-bold">Message for Couple</th>
                                        <th scope="col" className="px-5 py-3.5 font-bold">Website</th>
                                        <th scope="col" className="px-5 py-3.5 font-bold text-right">Received Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {filteredRsvps.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Users className="size-8 text-neutral-300 dark:text-neutral-600" />
                                                    <p className="font-semibold text-sm">No guest responses found.</p>
                                                    <p className="text-xs text-neutral-400">
                                                        {rsvps.length === 0
                                                            ? "Share your mini-website URL with guests so they can RSVP."
                                                            : "No guests match your search criteria."
                                                        }
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRsvps.map((r) => {
                                            const statusLower = String(r.status || '').toLowerCase();
                                            let badgeClass = 'bg-neutral-100 text-neutral-700';
                                            let statusLabel = 'Maybe';
                                            if (statusLower === 'yes' || statusLower === 'attending') {
                                                badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200';
                                                statusLabel = 'Yes (Attending)';
                                            } else if (statusLower === 'no' || statusLower === 'declined') {
                                                badgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200';
                                                statusLabel = 'No (Declined)';
                                            } else {
                                                badgeClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200';
                                                statusLabel = 'Maybe';
                                            }

                                            return (
                                                <tr key={r.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors">
                                                    <td className="px-5 py-4 font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                                        {r.name}
                                                    </td>
                                                    <td className="px-5 py-4 font-mono font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                                                        {r.mobile_number ? (
                                                            <a href={`tel:${r.mobile_number}`} className="inline-flex items-center gap-1 hover:text-emerald-600">
                                                                <Phone className="size-3 text-neutral-400" />
                                                                {r.mobile_number}
                                                            </a>
                                                        ) : (
                                                            r.email || '-'
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
                                                            {statusLabel}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                                        {r.guests_count || 1}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs italic text-neutral-600 dark:text-neutral-300 max-w-[280px]">
                                                        {r.message ? (
                                                            <div className="flex items-start gap-1" title={r.message}>
                                                                <Heart className="size-3 text-rose-400 shrink-0 mt-0.5" />
                                                                <span className="line-clamp-2">{r.message}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-neutral-300 dark:text-neutral-600">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        {r.mini_website ? (
                                                            <a
                                                                href={`/mini-website/${r.mini_website.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                                                            >
                                                                {r.mini_website.title}
                                                                <Share2 className="size-3" />
                                                            </a>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-right text-xs text-neutral-500 whitespace-nowrap">
                                                        {new Date(r.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {(purchasedTemplates.length > 0 || businessCards.length > 0 || miniWebsites.length > 0) && (
                <div className="flex justify-center p-6 mt-4">
                    <Link
                        href="/customer/templates"
                        className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        Browse More Templates
                    </Link>
                </div>
            )}

            {/* Share invitation link dialog */}
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogContent className="max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl w-[95vw] sm:w-full">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            Share Invitation
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-2 flex flex-col gap-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Copy the guest-link below and send it to your friends and family via WhatsApp, email, or social media.
                        </p>

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <input
                                    readOnly
                                    type="text"
                                    value={selectedInvitation ? `${window.location.origin}/invitations/view/${selectedInvitation.encrypted_id}` : ''}
                                    className="w-full h-10 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-xs font-mono text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    onClick={(e) => e.currentTarget.select()}
                                />
                            </div>
                            <Button
                                type="button"
                                variant={copied ? "secondary" : "default"}
                                onClick={handleCopyLink}
                                className={`h-10 px-4 font-semibold transition-all ${copied ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                {copied ? (
                                    <><Check className="size-4 mr-2" /> Copied</>
                                ) : (
                                    <><Copy className="size-4 mr-2" /> Copy</>
                                )}
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsShareOpen(false)} className="w-full sm:w-auto text-neutral-500">
                            Close
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
                            const cfg = normalizeConfig(selectedDownloadInvitation.custom_config, selectedDownloadInvitation.template.bg_gradient);
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
                                                    if (elem.hidden) return null;
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
                                                        fontFamily: getFontFamilyCss(elem.fontStyle),
                                                        color: elem.textColor || '#1f2937',
                                                        fontSize: elem.fontSize ? `${elem.fontSize * 0.95}px` : '12px',
                                                        fontWeight: elem.fontWeight || 'normal',
                                                        fontStyle: elem.isItalic ? 'italic' : 'normal',
                                                        textShadow: elem.type === 'text' && elem.textShadow && elem.textShadow !== 'none' ? elem.textShadow : undefined,
                                                        opacity: elem.type === 'image' && elem.opacity !== undefined ? elem.opacity / 100 : 1,
                                                        zIndex: elem.isBackground ? 5 : elem.type === 'image' ? 10 : elem.type === 'divider' ? 15 : elem.type === 'text' ? 20 : 25,
                                                    };

                                                    return (
                                                        <div key={elem.id} style={style} className={`p-1 leading-tight select-none break-words overflow-hidden ${elem.animation && elem.animation !== 'none' ? elem.animation : ''}`}>
                                                            {elem.type === 'text' && (
                                                                <span className="w-full">{elem.content}</span>
                                                            )}

                                                            {elem.type === 'image' && elem.url && (
                                                                <div className="w-full h-full rounded overflow-hidden">
                                                                    <img src={elem.url} alt="Image Layer" className="w-full h-full object-contain" />
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

            {/* QR Code Customizer & Download Dialog */}
            {/* developed by dinesh tawade */}
            <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
                <DialogContent className="max-w-md sm:max-w-lg max-h-[92vh] flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-0 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                    <DialogHeader className="p-4 sm:p-5 pb-3 sm:pb-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="size-9 sm:size-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                <QrCode className="size-4 sm:size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                                    Download QR Code
                                </DialogTitle>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                                    Choose color theme for printed invites & digital cards
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedQRTarget && (
                        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
                            {/* Color / Theme Selector Cards */}
                            <div>
                                <label className="text-[11px] sm:text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2 block">
                                    Select QR Color Theme
                                </label>
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                    {/* Gold Theme Option */}
                                    <button
                                        type="button"
                                        onClick={() => setQrTheme('gold')}
                                        className={`group relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${qrTheme === 'gold'
                                            ? 'border-amber-500 bg-gradient-to-b from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-neutral-900 shadow-sm'
                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="size-7 sm:size-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-xs flex items-center justify-center text-white">
                                                <Sparkles className="size-3.5 sm:size-4" />
                                            </div>
                                            {qrTheme === 'gold' && (
                                                <span className="flex size-4 sm:size-5 items-center justify-center rounded-full bg-amber-500 text-white">
                                                    <Check className="size-2.5 sm:size-3 stroke-[3]" />
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                                                Royal Gold
                                                <span className="text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                                                    Luxury
                                                </span>
                                            </p>
                                        </div>
                                    </button>

                                    {/* Black Theme Option */}
                                    <button
                                        type="button"
                                        onClick={() => setQrTheme('black')}
                                        className={`group relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${qrTheme === 'black'
                                            ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="size-7 sm:size-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-xs flex items-center justify-center border border-neutral-700">
                                                <QrCode className="size-3.5 sm:size-4" />
                                            </div>
                                            {qrTheme === 'black' && (
                                                <span className="flex size-4 sm:size-5 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
                                                    <Check className="size-2.5 sm:size-3 stroke-[3]" />
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                                                Sleek Black
                                                <span className="text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                                    Modern
                                                </span>
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Live Card Preview Box */}
                            <div className="flex flex-col items-center justify-center">
                                <div
                                    className={`w-full max-w-[240px] sm:max-w-[260px] p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300 text-center shadow-md relative overflow-hidden ${qrTheme === 'gold'
                                        ? 'bg-gradient-to-b from-white via-[#fcfaf6] to-[#f7f2e7] border-2 border-amber-300/80 shadow-amber-900/10'
                                        : 'bg-gradient-to-b from-[#141416] to-[#0a0a0c] border border-neutral-700 shadow-black/50'
                                        }`}
                                >
                                    {/* Badge */}
                                    <div className="mb-1.5">
                                        <span
                                            className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${qrTheme === 'gold'
                                                ? 'bg-amber-100 text-amber-800 border border-amber-300/60'
                                                : 'bg-white/10 text-neutral-200 border border-white/15'
                                                }`}
                                        >
                                            {selectedQRTarget.badgeText || (selectedQRTarget.type === 'video' ? '✨ Video Invitation ✨' : (qrTheme === 'gold' ? '✨ Wedding Invitation ✨' : 'Digital Invitation'))}
                                        </span>
                                    </div>

                                    <h4
                                        className={`font-bold text-sm sm:text-base line-clamp-1 ${qrTheme === 'gold' ? 'text-amber-950 font-serif' : 'text-white'
                                            }`}
                                    >
                                        {selectedQRTarget.subtitleText || (selectedQRTarget.type === 'video' ? 'Scan to Watch Video' : 'Scan to Celebrate')}
                                    </h4>
                                    <p
                                        className={`text-[11px] truncate max-w-[190px] mx-auto mt-0.5 ${qrTheme === 'gold' ? 'text-amber-800/80' : 'text-neutral-400'
                                            }`}
                                    >
                                        {selectedQRTarget.title}
                                    </p>

                                    {/* QR Image Box */}
                                    <div
                                        className={`my-2.5 p-2 rounded-xl sm:rounded-2xl mx-auto w-[150px] h-[150px] sm:w-[165px] sm:h-[165px] flex items-center justify-center shadow-xs ${qrTheme === 'gold'
                                            ? 'bg-white border-2 border-amber-200'
                                            : 'bg-white border border-neutral-200'
                                            }`}
                                    >
                                        <img
                                            src={`https://quickchart.io/qr?size=300&text=${encodeURIComponent(
                                                selectedQRTarget.url
                                            )}&dark=${qrTheme === 'gold' ? 'c59b27' : '111111'}&light=ffffff&ecLevel=H&margin=1`}
                                            alt="QR Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Slug pill */}
                                    <div
                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-medium truncate max-w-[200px] ${qrTheme === 'gold'
                                            ? 'bg-amber-100/70 text-amber-900 border border-amber-300/50'
                                            : 'bg-white/5 text-neutral-300 border border-white/10'
                                            }`}
                                    >
                                        {selectedQRTarget.displayPath || (selectedQRTarget.slug ? `/${selectedQRTarget.slug}` : '/invitation')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="p-3 sm:p-4 px-4 sm:px-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0 flex flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsQROpen(false)}
                            className="w-full sm:w-auto h-9 text-xs sm:text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={isGeneratingQR}
                            onClick={() => {
                                if (selectedQRTarget) {
                                    downloadQRCode(selectedQRTarget, qrTheme);
                                }
                            }}
                            className={`w-full sm:flex-1 h-9 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 text-white shadow-sm ${qrTheme === 'gold'
                                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/20'
                                : 'bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
                                }`}
                        >
                            {isGeneratingQR ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" /> Generating High-Res PNG...
                                </>
                            ) : (
                                <>
                                    <Download className="size-4" /> Download {qrTheme === 'gold' ? 'Royal Gold' : 'Sleek Black'} QR (PNG)
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Video Generator Modal */}
            {selectedVideoTemplate && (
                <VideoGenerator
                    userTemplate={selectedVideoTemplate}
                    isOpen={isVideoOpen}
                    onClose={() => {
                        setIsVideoOpen(false);
                        setSelectedVideoTemplate(null);
                    }}
                    uploadEndpoint={`/customer/user-templates/${selectedVideoTemplate.id}/upload-video`}
                    onComplete={(url) => {
                        window.location.reload();
                    }}
                />
            )}
        </AppLayout>
    );
}
