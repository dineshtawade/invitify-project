import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Store, Users, ShoppingCart, Sparkles, Wallet, History, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reseller Dashboard',
        href: '/reseller/dashboard',
    },
];

interface Stats {
    templates_purchased: number;
    mini_websites_purchased: number;
    business_websites_purchased: number;
    total_orders: number;
}

interface RecentPurchase {
    id: number;
    product_name: string;
    amount: number;
    payment_method: string;
    date: string;
}

interface DashboardProps {
    wallet: { balance: number };
    stats: Stats;
    recentPurchases: RecentPurchase[];
}

export default function ResellerDashboard({ wallet, stats, recentPurchases = [] }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reseller Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Reseller Dashboard</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Welcome to your Reseller hub. Manage store purchases, check wallet status, and view recent orders.</p>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-6 md:grid-cols-4">
                    {/* Wallet balance */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Wallet Balance</p>
                                <h3 className="mt-2 text-2xl font-black text-indigo-600">₹{wallet.balance.toFixed(2)}</h3>
                            </div>
                            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/50">
                                <Wallet className="size-6" />
                            </div>
                        </div>
                        <Link href="/reseller/wallet" className="text-xs text-indigo-600 font-bold mt-4 flex items-center gap-1 hover:underline">
                            Manage Wallet <ArrowRight className="size-3" />
                        </Link>
                    </div>

                    {/* Total orders */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Total Purchases</p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.total_orders}</h3>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50">
                                <ShoppingCart className="size-6" />
                            </div>
                        </div>
                    </div>

                    {/* Mini websites */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Mini Websites</p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.mini_websites_purchased}</h3>
                            </div>
                            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50">
                                <Store className="size-6" />
                            </div>
                        </div>
                    </div>

                    {/* Business websites */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Business Websites</p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.business_websites_purchased}</h3>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/50">
                                <Users className="size-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Recent purchases log (2/3 width) */}
                    <div className="md:col-span-2 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-4">
                            <History className="size-5 text-indigo-600" /> Recent Purchase Orders
                        </h3>
                        {recentPurchases.length === 0 ? (
                            <p className="text-sm text-neutral-500 italic">No purchase history yet.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {recentPurchases.map(purchase => (
                                    <div key={purchase.id} className="border-b pb-3 last:border-0 last:pb-0 flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-bold text-neutral-850 dark:text-neutral-200">{purchase.product_name}</p>
                                            <p className="text-xs text-neutral-450 mt-0.5">Paid via {purchase.payment_method}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-indigo-600">₹{parseFloat(String(purchase.amount)).toFixed(2)}</p>
                                            <p className="text-[10px] text-neutral-400">{purchase.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reseller Info Status */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <Sparkles className="size-5 text-amber-500" /> Reseller Benefits
                            </h3>
                            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                                You are approved for locked reseller rates. Browse the Shop to buy templates or launch mini/business websites directly.
                            </p>
                        </div>
                        <Link href="/reseller/shop" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white flex justify-center py-2 rounded-lg text-sm font-semibold gap-1.5 transition-colors">
                            Go to Reseller Shop
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
