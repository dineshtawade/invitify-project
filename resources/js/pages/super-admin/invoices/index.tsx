import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import {
    Search, FileText, Eye, Calendar,
    User, Layers, TrendingUp, IndianRupee, X
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/super-admin/dashboard' },
    { title: 'Invoice Management', href: '/super-admin/invoices' },
];

interface UserInfo { id: number; name: string; email: string; }
interface TemplateInfo { id: number; name: string; }

interface Invoice {
    id: number;
    invoice_number: string;
    amount: string | number;
    base_amount: string | number | null;
    tax_amount: string | number | null;
    cgst_amount: string | number | null;
    sgst_amount: string | number | null;
    igst_amount: string | number | null;
    tax_rate: string | number | null;
    platform_fee: string | number | null;
    status: string;
    payment_method: string;
    payment_id: string;
    order_id: string;
    invoice_date: string | null;
    customer_billing_name: string | null;
    customer_billing_email: string | null;
    customer_billing_phone: string | null;
    customer_billing_address: string | null;
    customer_billing_state: string | null;
    customer_gstin: string | null;
    is_inter_state: boolean;
    created_at: string;
    user?: UserInfo;
    template?: TemplateInfo;
    businessCard?: { id: number; title: string };
    miniWebsiteTemplate?: { id: number; name: string };
    businessWebsiteTemplate?: { id: number; name: string };
}

interface Pagination {
    data: Invoice[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface PageProps {
    invoices: Pagination;
    filters: { search?: string; status?: string; from?: string; to?: string };
    settings: Record<string, string | number | boolean>;
}

function fmt(val: string | number | null | undefined): string {
    if (val == null) return '0.00';
    return parseFloat(String(val)).toFixed(2);
}

function getItemName(inv: Invoice): string {
    if (inv.template) return inv.template.name;
    if (inv.businessCard) return `Business Card: ${inv.businessCard.title}`;
    if (inv.miniWebsiteTemplate) return `Website: ${inv.miniWebsiteTemplate.name}`;
    if (inv.businessWebsiteTemplate) return `Biz Website: ${inv.businessWebsiteTemplate.name}`;
    return '—';
}

function formatDate(d: string | null, fallback: string): string {
    const src = d || fallback;
    return new Date(src).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function InvoiceIndex({ invoices, filters, settings }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');
    const [selected, setSelected] = useState<Invoice | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/invoices', { search: searchQuery, status, from, to }, { preserveState: true });
    };

    const handleReset = () => {
        setSearchQuery(''); setStatus(''); setFrom(''); setTo('');
        router.get('/super-admin/invoices', {}, { preserveState: true });
    };

    const hasFilters = searchQuery || status || from || to;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoice Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Page Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <FileText className="size-8 text-blue-600 dark:text-blue-400" />
                        Invoice Management
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        View and manage all GST tax invoices generated for template purchases.
                    </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Total Invoices</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">{invoices.total}</h3>
                            </div>
                            <div className="rounded-xl bg-blue-50 p-3.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <FileText className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Showing</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                                    {invoices.from ?? 0}–{invoices.to ?? 0}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-emerald-50 p-3.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <TrendingUp className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Invoice Prefix</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                                    {String(settings.invoice_prefix || 'INV-')}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-amber-50 p-3.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <IndianRupee className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                    </div>
                </div>

                {/* Filter & Search */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-3 bg-neutral-50/50 dark:bg-neutral-950/30 p-4 rounded-2xl border border-neutral-150 dark:border-neutral-850 flex-wrap">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Invoice #, name, email, GSTIN…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 w-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm rounded-xl"
                        />
                    </div>
                    <div className="flex flex-col gap-1 min-w-[130px]">
                        <span className="text-xs font-semibold text-neutral-400 uppercase">Status</span>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 text-sm outline-none text-neutral-800 dark:text-neutral-200"
                        >
                            <option value="">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[130px]">
                        <span className="text-xs font-semibold text-neutral-400 uppercase">From Date</span>
                        <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="h-10 bg-white dark:bg-neutral-900 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-[130px]">
                        <span className="text-xs font-semibold text-neutral-400 uppercase">To Date</span>
                        <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="h-10 bg-white dark:bg-neutral-900 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="submit" className="h-10 rounded-xl px-5 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm">
                            Search
                        </button>
                        {hasFilters && (
                            <button type="button" onClick={handleReset} className="h-10 rounded-xl px-4 border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 font-semibold dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 text-sm transition-colors">
                                Clear
                            </button>
                        )}
                    </div>
                </form>

                {/* Invoices Table */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4">Invoice #</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Base</th>
                                    <th className="px-6 py-4">CGST</th>
                                    <th className="px-6 py-4">SGST</th>
                                    <th className="px-6 py-4">Total GST</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {invoices.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-12 text-center text-sm text-neutral-400 dark:text-neutral-500">
                                            No invoices found matching your criteria.
                                        </td>
                                    </tr>
                                ) : invoices.data.map(inv => {
                                    const cgst = parseFloat(String(inv.cgst_amount ?? 0));
                                    const sgst = parseFloat(String(inv.sgst_amount ?? 0));
                                    const igst = parseFloat(String(inv.igst_amount ?? 0));
                                    const totalGst = cgst + sgst + igst;

                                    return (
                                        <tr key={inv.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/15 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                    {inv.invoice_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                                        <User className="size-4.5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                                            {inv.customer_billing_name || inv.user?.name || '—'}
                                                        </div>
                                                        <div className="text-xs text-neutral-400">
                                                            {inv.customer_billing_email || inv.user?.email || ''}
                                                        </div>
                                                        {inv.customer_gstin && (
                                                            <div className="text-xs text-neutral-500 font-mono mt-0.5">
                                                                {inv.customer_gstin}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                                                        <Layers className="size-4" />
                                                    </div>
                                                    <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium max-w-[120px] truncate">
                                                        {getItemName(inv)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-800 dark:text-neutral-200">
                                                ₹{fmt(inv.base_amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {cgst > 0
                                                    ? <span className="text-blue-600 dark:text-blue-400 font-semibold">₹{cgst.toFixed(2)}</span>
                                                    : <span className="text-neutral-300 dark:text-neutral-600">—</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {sgst > 0
                                                    ? <span className="text-violet-600 dark:text-violet-400 font-semibold">₹{sgst.toFixed(2)}</span>
                                                    : <span className="text-neutral-300 dark:text-neutral-600">—</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {totalGst > 0
                                                    ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{totalGst.toFixed(2)}</span>
                                                    : <span className="text-neutral-300 dark:text-neutral-600">—</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">
                                                ₹{fmt(inv.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${
                                                    inv.status === 'completed'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30'
                                                        : inv.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30'
                                                        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30'
                                                }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs text-neutral-400 font-medium whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Calendar className="size-3.5" />
                                                    {formatDate(inv.invoice_date, inv.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelected(inv)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/60 transition-colors"
                                                >
                                                    <Eye className="size-3.5" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {invoices.total > invoices.per_page && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                            <div className="text-xs text-neutral-500 dark:text-neutral-450 font-semibold">
                                Showing <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{invoices.from}</span> to{' '}
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{invoices.to}</span> of{' '}
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{invoices.total}</span> invoices
                            </div>
                            <div className="flex items-center flex-wrap gap-1">
                                {invoices.links.map((link, idx) => {
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
                                            className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-bold transition-all ${
                                                link.active
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
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

            {/* Invoice Detail Modal */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
                            <div>
                                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Tax Invoice</p>
                                <h2 className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                                    {selected.invoice_number}
                                </h2>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    {formatDate(selected.invoice_date, selected.created_at)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 flex flex-col gap-5">
                            {/* Customer */}
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Customer Details</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-neutral-400">Name</p>
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                            {selected.customer_billing_name || selected.user?.name || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Email</p>
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                            {selected.customer_billing_email || selected.user?.email || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Phone</p>
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">{selected.customer_billing_phone || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">GSTIN</p>
                                        <p className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">{selected.customer_gstin || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">State</p>
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">{selected.customer_billing_state || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">GST Type</p>
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                            {selected.is_inter_state ? 'IGST (Inter-state)' : 'CGST + SGST (Intra-state)'}
                                        </p>
                                    </div>
                                    {selected.customer_billing_address && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-neutral-400">Address</p>
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">{selected.customer_billing_address}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Purchase */}
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Purchase Details</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-neutral-400">Item</p>
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">{getItemName(selected)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Payment Method</p>
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200 capitalize">{selected.payment_method}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Order ID</p>
                                        <p className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200 select-all">{selected.order_id || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Payment ID</p>
                                        <p className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200 select-all">{selected.payment_id || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Amount Breakdown */}
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Amount Breakdown</p>
                                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                                    {[
                                        { label: 'Base Amount', value: fmt(selected.base_amount), color: '' },
                                        ...(parseFloat(String(selected.platform_fee ?? 0)) > 0
                                            ? [{ label: 'Platform Fee', value: fmt(selected.platform_fee), color: '' }]
                                            : []),
                                        ...(parseFloat(String(selected.cgst_amount ?? 0)) > 0
                                            ? [{ label: `CGST (${parseFloat(String(selected.tax_rate ?? 0)) / 2}%)`, value: fmt(selected.cgst_amount), color: 'text-blue-600 dark:text-blue-400' }]
                                            : []),
                                        ...(parseFloat(String(selected.sgst_amount ?? 0)) > 0
                                            ? [{ label: `SGST (${parseFloat(String(selected.tax_rate ?? 0)) / 2}%)`, value: fmt(selected.sgst_amount), color: 'text-violet-600 dark:text-violet-400' }]
                                            : []),
                                        ...(parseFloat(String(selected.igst_amount ?? 0)) > 0
                                            ? [{ label: `IGST (${fmt(selected.tax_rate)}%)`, value: fmt(selected.igst_amount), color: 'text-orange-600 dark:text-orange-400' }]
                                            : []),
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 text-sm last:border-0">
                                            <span className="text-neutral-500 dark:text-neutral-400">{row.label}</span>
                                            <span className={`font-semibold ${row.color || 'text-neutral-800 dark:text-neutral-200'}`}>₹{row.value}</span>
                                        </div>
                                    ))}
                                    {/* Total GST line */}
                                    {(parseFloat(String(selected.cgst_amount ?? 0)) + parseFloat(String(selected.sgst_amount ?? 0)) + parseFloat(String(selected.igst_amount ?? 0))) > 0 && (
                                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-emerald-50/60 dark:bg-emerald-950/20 text-sm">
                                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Total GST</span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                ₹{(
                                                    parseFloat(String(selected.cgst_amount ?? 0)) +
                                                    parseFloat(String(selected.sgst_amount ?? 0)) +
                                                    parseFloat(String(selected.igst_amount ?? 0))
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {/* Grand Total */}
                                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60">
                                        <span className="font-bold text-neutral-900 dark:text-neutral-100">Total Payable</span>
                                        <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">₹{fmt(selected.amount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-1">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${
                                    selected.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30'
                                        : selected.status === 'pending'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30'
                                        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30'
                                }`}>
                                    {selected.status.toUpperCase()}
                                </span>

                                <a
                                    href={`/super-admin/invoices/${selected.invoice_number}`}
                                    target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                                >
                                    <Eye className="size-4" /> Full Invoice View
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
