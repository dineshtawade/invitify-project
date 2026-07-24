import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { global_coupon } = usePage().props as { global_coupon?: any };

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                {global_coupon && (
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 text-center text-sm font-medium shadow-sm flex items-center justify-center gap-2">
                        <Sparkles className="size-4 text-purple-200" />
                        <span>
                            Special Offer! Use code <strong className="bg-white/20 px-2 py-0.5 rounded tracking-wide">{global_coupon.code}</strong> at checkout for <strong>{global_coupon.discount}%</strong> off your purchase!
                        </span>
                        <Sparkles className="size-4 text-indigo-200" />
                    </div>
                )}
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
