import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Store, Users, ShoppingCart, Sparkles, Wallet, History, ArrowRight, ReceiptText, FileText } from 'lucide-react';

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
    total_invoices?: number;
}

interface RecentPurchase {
    id: number;
    invoice_number?: string;
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Reseller Dashboard</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Welcome to your Reseller hub. Manage store purchases, check wallet status, and view your tax invoices.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/reseller/invoices"
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
                        >
                            <ReceiptText className="size-4 text-indigo-600" />
                            My Invoices
                        </Link>
                        <Link
                            href="/reseller/shop"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors"
                        >
                            <Store className="size-4" />
                            Reseller Shop
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-6 md:grid-cols-5">
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

                    {/* Invoices */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Tax Invoices</p>
                                <h3 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.total_invoices ?? stats.total_orders}</h3>
                            </div>
                            <div className="rounded-lg bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/50">
                                <ReceiptText className="size-6" />
                            </div>
                        </div>
                        <Link href="/reseller/invoices" className="text-xs text-amber-600 font-bold mt-4 flex items-center gap-1 hover:underline">
                            View Invoices <ArrowRight className="size-3" />
                        </Link>
                    </div>

                    {/* Invitation Website */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Invitation Website</p>
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
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <History className="size-5 text-indigo-600" /> Recent Purchase Orders
                            </h3>
                            <Link href="/reseller/invoices" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                                View Invoices <ArrowRight className="size-3" />
                            </Link>
                        </div>
                        {recentPurchases.length === 0 ? (
                            <p className="text-sm text-neutral-500 italic">No purchase history yet.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {recentPurchases.map(purchase => (
                                    <div key={purchase.id} className="border-b pb-3 last:border-0 last:pb-0 flex justify-between items-center text-sm">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="font-bold text-neutral-850 dark:text-neutral-200">{purchase.product_name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-neutral-450">Paid via {purchase.payment_method}</span>
                                                {purchase.invoice_number && (
                                                    <Link
                                                        href={`/reseller/invoices/${purchase.invoice_number}`}
                                                        className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded"
                                                    >
                                                        <FileText className="size-3" />
                                                        {purchase.invoice_number}
                                                    </Link>
                                                )}
                                            </div>
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

                    {/* Reseller Info Status & Billing */}
                    <div className="flex flex-col gap-6">
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                    <ReceiptText className="size-5 text-indigo-600" /> Invoices & GST Billing
                                </h3>
                                <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                                    Access all your official GST tax invoices for template purchases, hosting fees, and wallet recharges with PDF download.
                                </p>
                            </div>
                            <Link href="/reseller/invoices" className="w-full mt-6 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 flex justify-center py-2 rounded-lg text-sm font-semibold gap-1.5 transition-colors">
                                View Invoices
                            </Link>
                        </div>

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
            </div>
        </AppLayout>
    );
}
