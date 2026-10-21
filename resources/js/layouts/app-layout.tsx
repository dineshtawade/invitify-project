import { usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { auth } = usePage().props;
    // developed by dinesh tawade
    const isCustomer = auth?.user?.role === 'customer' || !auth?.user;

    if (isCustomer) {
        return (
            <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppHeaderLayout>
        );
    }

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppSidebarLayout>
    );
};
