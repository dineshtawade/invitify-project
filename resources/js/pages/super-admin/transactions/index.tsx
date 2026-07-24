import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { 
    Search, CreditCard, Receipt, Calendar, User, 
    Layers, Landmark, TrendingUp 
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Template {
    id: number;
    name: string;
    category: string;
}

interface Transaction {
    id: number;
    user_id: number;
    template_id: number;
    amount: string | number;
    payment_id: string;
    order_id: string;
    status: string;
    payment_method: string;
    created_at: string;
    user: User;
    template?: Template;
    businessCard?: any;
    miniWebsite?: any;
    businessWebsite?: any;
    userTemplate?: any;
}

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: LinkItem[];
    from: number;
    to: number;
}

interface PageProps {
    transactions: PaginationData<Transaction>;
    filters?: { search: string };
    metrics: {
        total_transactions: number;
        total_revenue: number;
        avg_transaction_value: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/super-admin/dashboard',
    },
    {
        title: 'Transactions',
        href: '/super-admin/transactions',
    },
];

export default function TransactionsIndex({ transactions, filters = { search: '' }, metrics }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/transactions', { search: searchQuery }, { preserveState: true });
    };

    const handleReset = () => {
        setSearchQuery('');
        router.get('/super-admin/transactions', {}, { preserveState: true });
    };

    // Use metrics from backend
    const { total_transactions, total_revenue, avg_transaction_value } = metrics;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions History" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <Receipt className="size-8 text-blue-600 dark:text-blue-400" />
                        Transactions History
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        View and track all user template purchases, payments, and transaction details.
                    </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Total Revenue</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">₹{parseFloat(String(total_revenue)).toFixed(2)}</h3>
                            </div>
                            <div className="rounded-xl bg-blue-50 p-3.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <TrendingUp className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Total Purchases</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">{total_transactions}</h3>
                            </div>
                            <div className="rounded-xl bg-emerald-50 p-3.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <Landmark className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Avg. Ticket Price</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">₹{parseFloat(String(avg_transaction_value)).toFixed(2)}</h3>
                            </div>
                            <div className="rounded-xl bg-amber-50 p-3.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <CreditCard className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                    </div>
                </div>

                {/* Filter and Search */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-50/50 dark:bg-neutral-950/30 p-4 rounded-2xl border border-neutral-150 dark:border-neutral-850">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search by ID, customer name, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 w-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm rounded-xl focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="submit" className="h-10 rounded-xl px-5 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                            Search
                        </button>
                        {filters.search && (
                            <button type="button" onClick={handleReset} className="h-10 rounded-xl px-4 border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 font-semibold dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors">
                                Clear
                            </button>
                        )}
                    </div>
                </form>

                {/* Transactions Table */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Customer Details</th>
                                    <th scope="col" className="px-6 py-4">Template details</th>
                                    <th scope="col" className="px-6 py-4">Price Paid</th>
                                    <th scope="col" className="px-6 py-4">Gateway Reference</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4 text-right">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {transactions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-400 dark:text-neutral-500">
                                            No transactions found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.data.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/15 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                                        <User className="size-4.5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">{tx.user?.name || 'Deleted User'}</div>
                                                        <div className="text-xs text-neutral-400">{tx.user?.email || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                                                        <Layers className="size-4.5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                            {tx.businessCard?.company_name || 
                                                             tx.miniWebsite?.title || 
                                                             tx.businessWebsite?.company_name || 
                                                             tx.template?.name || 
                                                             'Deleted Template'}
                                                        </div>
                                                        <div className="text-xs text-neutral-400 capitalize">
                                                            {tx.businessCard ? 'Business Card' : 
                                                             tx.miniWebsite ? 'Mini Website' : 
                                                             tx.businessWebsite ? 'Business Website' : 
                                                             tx.template?.category ? tx.template.category.replace('_', ' ') : 'N/A'}
                                                        </div>
                                                        
                                                        <div className="mt-1 flex flex-col gap-1">
                                                            {tx.businessCard && (
                                                                <a href={`/card/${tx.businessCard.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                                    View Card ↗
                                                                </a>
                                                            )}
                                                            {tx.miniWebsite && (
                                                                <a href={`/mini-website/${tx.miniWebsite.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                                    View Mini Site ↗
                                                                </a>
                                                            )}
                                                            {tx.businessWebsite && (
                                                                <a href={`/business/${tx.businessWebsite.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                                    View Business Site ↗
                                                                </a>
                                                            )}
                                                            {tx.userTemplate && (
                                                                <a href={`/invitations/view/${tx.userTemplate.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                                    View Invitation ↗
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">
                                                ₹{parseFloat(String(tx.amount)).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-neutral-900 dark:text-neutral-100 font-semibold select-all">{tx.payment_id || 'N/A'}</span>
                                                    <span className="text-neutral-400 select-all">{tx.order_id || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30">
                                                        {tx.status}
                                                    </span>
                                                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                                        tx.payment_method === 'razorpay'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                                                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                                    }`}>
                                                        {tx.payment_method}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs text-neutral-400 font-medium whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Calendar className="size-3.5" />
                                                    {formatDate(tx.created_at)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {transactions.total > transactions.per_page && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                            <div className="text-xs text-neutral-500 dark:text-neutral-450 font-semibold">
                                Showing <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{transactions.from}</span> to{' '}
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{transactions.to}</span> of{' '}
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{transactions.total}</span> transactions
                            </div>
                            <div className="flex items-center flex-wrap gap-1">
                                {transactions.links.map((link, idx) => {
                                    const cleanLabel = link.label
                                        .replace('&laquo; Previous', '← Prev')
                                        .replace('Next &raquo;', 'Next →');

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="inline-flex h-8 items-center justify-center rounded-lg border border-neutral-200/50 bg-neutral-100/50 px-3 text-xs select-none cursor-not-allowed dark:border-neutral-800/40 dark:bg-neutral-850/40 text-neutral-400"
                                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-bold transition-all ${link.active
                                                ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700'
                                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
