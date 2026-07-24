import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Users, Layers, Mail, Globe, CreditCard, Receipt, Briefcase, Share2, Wallet, ShoppingBag, History, Settings, FileSignature } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth.user?.role;

    const mainNavItems: NavItem[] = [];

    if (userRole === 'super_admin') {
        mainNavItems.push(
            {
                title: 'Admin Dashboard',
                href: '/super-admin/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Manage Users',
                href: '/super-admin/users',
                icon: Users,
            },
            {
                title: 'Editor Requests',
                href: '/super-admin/editor-requests',
                icon: FileSignature,
            },
            {
                title: 'Manage Templates',
                href: '/super-admin/templates',
                icon: Layers,
            },
            {
                title: 'Create Mini Website',
                href: '/super-admin/mini-website-templates',
                icon: Globe,
            },
            {
                title: 'Subscription Plans',
                href: '/super-admin/business-card-plans',
                icon: Layers,
            },
            // {
            //     title: 'Business Templates',
            //     href: '/super-admin/business-website-templates',
            //     icon: Briefcase,
            // },
            {
                title: 'Payment Settings',
                href: '/super-admin/payment-settings',
                icon: CreditCard,
            },
            {
                title: 'Transactions',
                href: '/super-admin/transactions',
                icon: Receipt,
            },
            {
                title: 'Referral Partners',
                href: '/super-admin/referrals',
                icon: Share2,
            },
            {
                title: 'Wallets & Payouts',
                href: '/super-admin/wallets',
                icon: Wallet,
            },
            {
                title: 'Manage Resellers',
                href: '/super-admin/resellers',
                icon: Users,
            },
            {
                title: 'Settings',
                href: '/super-admin/settings',
                icon: Settings,
            }
        );
    } else if (userRole === 'editor') {
        mainNavItems.push(
            {
                title: 'Manage Templates',
                href: '/super-admin/templates',
                icon: Layers,
            },
            {
                title: 'Create Mini Website',
                href: '/super-admin/mini-website-templates',
                icon: Globe,
            }
        );
    } else if (userRole === 'reseller') {
        mainNavItems.push(
            {
                title: 'Reseller Dashboard',
                href: '/reseller/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Reseller Shop',
                href: '/reseller/shop',
                icon: ShoppingBag,
            },
            {
                title: 'My Invitations',
                href: '/reseller/my-invitations',
                icon: Mail,
            },
            {
                title: 'My Hosted Websites',
                href: '/reseller/websites',
                icon: Globe,
            },
            {
                title: 'My Wallet',
                href: '/reseller/wallet',
                icon: Wallet,
            },
            {
                title: 'Payment History',
                href: '/reseller/payment-history',
                icon: History,
            }
        );
    } else if (userRole === 'referral_partner') {
        mainNavItems.push(
            {
                title: 'Partner Dashboard',
                href: '/referral-partner/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'My Wallet',
                href: '/referral-partner/wallet',
                icon: Wallet,
            },
            {
                title: 'Payment detail',
                href: '/referral-partner/payment-details',
                icon: History,
            }
        );
    } else {
        mainNavItems.push(
            {
                title: 'Customer Dashboard',
                href: '/customer/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Browse Templates',
                href: '/customer/templates',
                icon: Layers,
            },
            {
                title: 'My Invitations',
                href: '/customer/my-invitations',
                icon: Mail,
            },
            {
                title: 'My Mini Websites',
                href: '/customer/mini-websites',
                icon: Globe,
            },
            {
                title: 'My Business Websites',
                href: '/customer/business-websites',
                icon: Briefcase,
            },
            {
                title: 'Subscriptions',
                href: '/customer/subscriptions',
                icon: CreditCard,
            }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
