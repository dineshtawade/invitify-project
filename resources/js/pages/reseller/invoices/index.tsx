import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Search, FileText, Eye, Calendar,
    Building2, IndianRupee, X, Download, Printer,
    CheckCircle2, Clock, ShieldCheck, ArrowRight,
    ReceiptText, Filter, AlertCircle, ShoppingBag, ExternalLink
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reseller Dashboard', href: '/reseller/dashboard' },
    { title: 'Invoices & Billing', href: '/reseller/invoices' },
];

interface TemplateInfo { id: number; name: string; type?: string; category?: string; hsn_sac_code?: string; }

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
    template?: TemplateInfo;
    businessCard?: { id: number; title: string };
    miniWebsiteTemplate?: { id: number; name: string; hsn_sac_code?: string };
    businessWebsiteTemplate?: { id: number; name: string };
    miniWebsite?: { id: number; title: string };
    businessWebsite?: { id: number; title: string };
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

interface ResellerProfile {
    name: string;
    email: string;
    mobile?: string;
    business_name: string;
    gst_number?: string | null;
    business_address?: string | null;
    mobile_number?: string | null;
    contact_email?: string | null;
}

interface PageProps {
    invoices: Pagination;
    stats: {
        total_invoices: number;
        total_spend: number;
        total_tax_paid: number;
    };
    reseller: ResellerProfile;
    settings: Record<string, string | number | boolean>;
    filters: { search?: string; status?: string; from?: string; to?: string };
}

function fmt(val: string | number | null | undefined): string {
    if (val == null || val === '') return '0.00';
    return parseFloat(String(val)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getItemDetails(inv: Invoice): { name: string; type: string; hsn: string } {
    if (inv.template) {
        return {
            name: inv.template.name,
            type: inv.template.type ? `${inv.template.type.toUpperCase()} Template` : 'Template',
            hsn: inv.template.hsn_sac_code || '998314',
        };
    }
    if (inv.miniWebsiteTemplate) {
        return {
            name: inv.miniWebsiteTemplate.name,
            type: 'Invitation Website',
            hsn: inv.miniWebsiteTemplate.hsn_sac_code || '998314',
        };
    }
    if (inv.businessCard) {
        return {
            name: `Business Card: ${inv.businessCard.title}`,
            type: 'Digital Card',
            hsn: '998314',
        };
    }
    if (inv.businessWebsiteTemplate) {
        return {
            name: inv.businessWebsiteTemplate.name,
            type: 'Business Website',
            hsn: '998314',
        };
    }
    if (inv.miniWebsite) {
        return {
            name: `Hosted Website: ${inv.miniWebsite.title}`,
            type: 'Website Hosting',
            hsn: '998314',
        };
    }
    if (inv.businessWebsite) {
        return {
            name: `Hosted Website: ${inv.businessWebsite.title}`,
            type: 'Business Hosting',
            hsn: '998314',
        };
    }
    if (inv.payment_method === 'razorpay' || inv.payment_method === 'mock_recharge') {
        return {
            name: 'Reseller Wallet Recharge Credits',
            type: 'Wallet Deposit',
            hsn: '998314',
        };
    }
    return {
        name: 'Digital Invitation Service',
        type: 'Digital Product',
        hsn: '998314',
    };
}

function formatDate(d: string | null, fallback: string): string {
    const src = d || fallback;
    return new Date(src).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ResellerInvoiceIndex({ invoices, stats, reseller, settings, filters }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');
    const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/reseller/invoices', { search: searchQuery, status, from, to }, { preserveState: true });
    };

    const handleReset = () => {
        setSearchQuery('');
        setStatus('');
        setFrom('');
        setTo('');
        router.get('/reseller/invoices', {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices & Billing - Reseller Panel" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                            <ReceiptText className="size-8 text-indigo-600" />
                            Invoices & Billing
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Access, review, and download official GST tax invoices for all your purchases and payments.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <a
                            href={`/reseller/invoices/download-all${searchQuery || status || from || to ? `?search=${encodeURIComponent(searchQuery)}&status=${encodeURIComponent(status)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}` : ''}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
                            title="Download all your invoices as a ZIP archive"
                        >
                            <Download className="size-4 text-indigo-600" />
                            Download All (ZIP)
                        </a>
                        <Link
                            href="/reseller/shop"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors"
                        >
                            <ShoppingBag className="size-4" />
                            Browse Shop
                        </Link>
                    </div>
                </div>

                {/* Reseller Business & GST Details Banner */}
                <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/50 p-5 shadow-xs dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-indigo-600 text-white p-3 shadow-xs">
                                <Building2 className="size-6" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                        {reseller.business_name || reseller.name}
                                    </h2>
                                    {reseller.gst_number ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                            <ShieldCheck className="size-3.5" /> GSTIN: {reseller.gst_number}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                            GST Unregistered
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                                    {reseller.business_address && (
                                        <span><strong>Address:</strong> {reseller.business_address}</span>
                                    )}
                                    {reseller.contact_email && (
                                        <span><strong>Email:</strong> {reseller.contact_email}</span>
                                    )}
                                    {reseller.mobile_number && (
                                        <span><strong>Mobile:</strong> {reseller.mobile_number}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-800/80 p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80 max-w-sm">
                            <div className="font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5 mb-0.5">
                                <CheckCircle2 className="size-3.5 text-indigo-600" />
                                Automated GST Invoicing
                            </div>
                            Invoices are automatically issued with your business & GST credentials for full accounting & ITC compliance.
                        </div>
                    </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Invoices */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-neutral-500">Total Invoices</p>
                            <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/50">
                                <FileText className="size-5" />
                            </div>
                        </div>
                        <h3 className="mt-2 text-2xl font-black text-neutral-900 dark:text-neutral-100">
                            {stats.total_invoices}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">Lifetime purchases & recharges</p>
                    </div>

                    {/* Total Spend */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-neutral-500">Total Amount Paid</p>
                            <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/50">
                                <IndianRupee className="size-5" />
                            </div>
                        </div>
                        <h3 className="mt-2 text-2xl font-black text-emerald-600">
                            ₹{fmt(stats.total_spend)}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">Gross spend across services</p>
                    </div>

                    {/* Total Tax Paid */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-neutral-500">Total Tax / GST Paid</p>
                            <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950/50">
                                <ReceiptText className="size-5" />
                            </div>
                        </div>
                        <h3 className="mt-2 text-2xl font-black text-purple-600">
                            ₹{fmt(stats.total_tax_paid)}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">Eligible for input tax credit</p>
                    </div>

                    {/* SAC Code & Compliance */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-neutral-500">Applicable SAC Code</p>
                            <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/50">
                                <ShieldCheck className="size-5" />
                            </div>
                        </div>
                        <h3 className="mt-2 text-2xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
                            {String(settings.default_hsn_sac || '998314')}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">IT & Digital Media Services</p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <form onSubmit={handleSearch} className="flex flex-col gap-4">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {/* Search */}
                            <div className="lg:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by invoice #, order ID, product name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-10 text-sm"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">All Payment Statuses</option>
                                    <option value="completed">Completed / Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            {/* From Date */}
                            <div>
                                <Input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="h-10 text-sm"
                                    placeholder="From Date"
                                />
                            </div>

                            {/* To Date */}
                            <div>
                                <Input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="h-10 text-sm"
                                    placeholder="To Date"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <span className="text-xs text-neutral-500">
                                Showing <strong>{invoices.from ?? 0}–{invoices.to ?? 0}</strong> of <strong>{invoices.total}</strong> invoices
                            </span>
                            <div className="flex items-center gap-2">
                                {(searchQuery || status || from || to) && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleReset}
                                        className="h-9 px-3 text-xs text-neutral-600 hover:text-neutral-900"
                                    >
                                        <X className="size-3.5 mr-1" /> Reset Filters
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5"
                                >
                                    <Filter className="size-3.5" /> Apply Filter
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Invoices Table */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                    {invoices.data.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="mx-auto size-14 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 mb-3">
                                <ReceiptText className="size-7" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">No Invoices Found</h3>
                            <p className="mt-1 text-sm text-neutral-500 max-w-sm mx-auto">
                                No tax invoices match your filter criteria. When you buy templates or recharge your wallet, invoices will show here.
                            </p>
                            {(searchQuery || status || from || to) && (
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 text-xs font-semibold"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/50 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                        <th className="py-3.5 px-4">Invoice # & Date</th>
                                        <th className="py-3.5 px-4">Product / Service</th>
                                        <th className="py-3.5 px-4 text-center">HSN/SAC</th>
                                        <th className="py-3.5 px-4 text-right">Taxable Value</th>
                                        <th className="py-3.5 px-4 text-right">Tax Breakdown</th>
                                        <th className="py-3.5 px-4 text-right">Total Amount</th>
                                        <th className="py-3.5 px-4 text-center">Payment Info</th>
                                        <th className="py-3.5 px-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {invoices.data.map((inv) => {
                                        const item = getItemDetails(inv);
                                        const totalAmt = parseFloat(String(inv.amount || 0));
                                        const taxAmt = parseFloat(String(inv.tax_amount || 0));
                                        const baseAmt = inv.base_amount != null ? parseFloat(String(inv.base_amount)) : (totalAmt - taxAmt);
                                        const isPaid = (inv.status || '').toLowerCase() === 'completed';

                                        return (
                                            <tr key={inv.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                                                {/* Invoice # & Date */}
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <div className="flex flex-col gap-0.5">
                                                        <Link
                                                            href={`/reseller/invoices/${inv.invoice_number}`}
                                                            className="font-mono font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                                                        >
                                                            <FileText className="size-3.5" />
                                                            {inv.invoice_number}
                                                        </Link>
                                                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                                                            <Calendar className="size-3 text-neutral-400" />
                                                            {formatDate(inv.invoice_date, inv.created_at)}
                                                        </span>
                                                        {inv.order_id && (
                                                            <span className="text-[10px] text-neutral-400 font-mono">
                                                                {inv.order_id}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Product / Service */}
                                                <td className="py-4 px-4 max-w-xs">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-neutral-850 dark:text-neutral-100 truncate" title={item.name}>
                                                            {item.name}
                                                        </span>
                                                        <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                                            {item.type}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* HSN/SAC Code */}
                                                <td className="py-4 px-4 text-center whitespace-nowrap">
                                                    <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                                        {item.hsn}
                                                    </span>
                                                </td>

                                                {/* Taxable Value */}
                                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                                        ₹{fmt(baseAmt)}
                                                    </span>
                                                </td>

                                                {/* Tax Breakdown */}
                                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-bold text-purple-600 dark:text-purple-400">
                                                            ₹{fmt(taxAmt)}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400">
                                                            {inv.is_inter_state ? 'IGST @ 18%' : 'CGST(9%) + SGST(9%)'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Total Amount */}
                                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                                    <span className="text-base font-black text-neutral-900 dark:text-neutral-100">
                                                        ₹{fmt(totalAmt)}
                                                    </span>
                                                </td>

                                                {/* Payment Info */}
                                                <td className="py-4 px-4 text-center whitespace-nowrap">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            isPaid
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                        }`}>
                                                            {isPaid ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                                                            {isPaid ? 'Paid' : ucfirst(inv.status)}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-500 capitalize">
                                                            {inv.payment_method === 'wallet' ? 'Reseller Wallet' : inv.payment_method}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-4 text-center whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {/* Quick Preview Modal Button */}
                                                        <button
                                                            onClick={() => setPreviewInvoice(inv)}
                                                            title="Quick Preview Invoice"
                                                            className="p-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-200 transition-colors"
                                                        >
                                                            <Eye className="size-4 text-indigo-600" />
                                                        </button>

                                                        {/* Full Invoice Page */}
                                                        <Link
                                                            href={`/reseller/invoices/${inv.invoice_number}`}
                                                            title="Open Full Tax Invoice"
                                                            className="p-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-200 transition-colors"
                                                        >
                                                            <ExternalLink className="size-4" />
                                                        </Link>

                                                        {/* Download PDF */}
                                                        <a
                                                            href={`/reseller/invoices/${inv.invoice_number}/download`}
                                                            title="Download PDF Invoice"
                                                            download
                                                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors"
                                                        >
                                                            <Download className="size-4" />
                                                        </a>

                                                        {/* Stream / Print PDF */}
                                                        <a
                                                            href={`/reseller/invoices/${inv.invoice_number}/stream`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Print / View PDF in Browser"
                                                            className="p-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-200 transition-colors"
                                                        >
                                                            <Printer className="size-4 text-neutral-600 dark:text-neutral-400" />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {invoices.total > invoices.per_page && (
                        <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 sm:px-6">
                            <div className="text-xs text-neutral-500">
                                Showing <strong>{invoices.from}</strong> to <strong>{invoices.to}</strong> of <strong>{invoices.total}</strong> results
                            </div>
                            <div className="flex items-center gap-1">
                                {invoices.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200'
                                                : 'text-neutral-400 cursor-not-allowed opacity-50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Invoice Preview Modal */}
                {previewInvoice && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50">
                                <div className="flex items-center gap-2">
                                    <ReceiptText className="size-5 text-indigo-600" />
                                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                                        Tax Invoice #{previewInvoice.invoice_number}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setPreviewInvoice(null)}
                                    className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
                                {/* Issuer & Billed To details */}
                                <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">ISSUER</p>
                                        <p className="font-bold text-neutral-900 dark:text-neutral-100">{String(settings.company_name)}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">{String(settings.company_address)}</p>
                                        <p className="text-xs text-neutral-500">{String(settings.company_city)}, {String(settings.company_state)}</p>
                                        <p className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 mt-1">
                                            GSTIN: {String(settings.company_gstin)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">BILLED TO (RESELLER)</p>
                                        <p className="font-bold text-neutral-900 dark:text-neutral-100">
                                            {previewInvoice.customer_billing_name || reseller.business_name || reseller.name}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {previewInvoice.customer_billing_address || reseller.business_address || 'Digital Online Delivery'}
                                        </p>
                                        <p className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 mt-1">
                                            GSTIN: {previewInvoice.customer_gstin || reseller.gst_number || 'Unregistered'}
                                        </p>
                                    </div>
                                </div>

                                {/* Order & Invoice Info */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                    <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                        <span className="text-neutral-400 block text-[10px] uppercase">Invoice Date</span>
                                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                            {formatDate(previewInvoice.invoice_date, previewInvoice.created_at)}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                        <span className="text-neutral-400 block text-[10px] uppercase">Order ID</span>
                                        <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                                            {previewInvoice.order_id || `ORD-${previewInvoice.id}`}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                        <span className="text-neutral-400 block text-[10px] uppercase">Payment Mode</span>
                                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
                                            {previewInvoice.payment_method === 'wallet' ? 'Reseller Wallet' : previewInvoice.payment_method}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                        <span className="text-neutral-400 block text-[10px] uppercase">SAC / HSN</span>
                                        <span className="font-mono font-semibold text-indigo-600">
                                            {getItemDetails(previewInvoice).hsn}
                                        </span>
                                    </div>
                                </div>

                                {/* Line item summary */}
                                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-600 dark:text-neutral-300">
                                            <tr>
                                                <th className="p-3">Description</th>
                                                <th className="p-3 text-center">Qty</th>
                                                <th className="p-3 text-right">Taxable (₹)</th>
                                                <th className="p-3 text-right">GST (₹)</th>
                                                <th className="p-3 text-right">Total (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-3">
                                                    <p className="font-bold text-neutral-900 dark:text-neutral-100">
                                                        {getItemDetails(previewInvoice).name}
                                                    </p>
                                                    <span className="text-[10px] text-neutral-500">
                                                        {getItemDetails(previewInvoice).type}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">1</td>
                                                <td className="p-3 text-right font-medium">
                                                    {fmt(previewInvoice.base_amount || (parseFloat(String(previewInvoice.amount)) - parseFloat(String(previewInvoice.tax_amount || 0))))}
                                                </td>
                                                <td className="p-3 text-right text-purple-600 font-semibold">
                                                    {fmt(previewInvoice.tax_amount)}
                                                </td>
                                                <td className="p-3 text-right font-bold text-neutral-900 dark:text-neutral-100">
                                                    {fmt(previewInvoice.amount)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Calculation summary */}
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-1.5 text-xs">
                                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                            <span>Taxable Value:</span>
                                            <span className="font-medium">
                                                ₹{fmt(previewInvoice.base_amount || (parseFloat(String(previewInvoice.amount)) - parseFloat(String(previewInvoice.tax_amount || 0))))}
                                            </span>
                                        </div>
                                        {previewInvoice.is_inter_state ? (
                                            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                                <span>IGST @ 18%:</span>
                                                <span className="font-medium">₹{fmt(previewInvoice.tax_amount)}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                                    <span>CGST @ 9%:</span>
                                                    <span className="font-medium">₹{fmt(parseFloat(String(previewInvoice.tax_amount || 0)) / 2)}</span>
                                                </div>
                                                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                                    <span>SGST @ 9%:</span>
                                                    <span className="font-medium">₹{fmt(parseFloat(String(previewInvoice.tax_amount || 0)) / 2)}</span>
                                                </div>
                                            </>
                                        )}
                                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between text-sm font-black text-neutral-900 dark:text-neutral-100">
                                            <span>Grand Total:</span>
                                            <span className="text-indigo-600">₹{fmt(previewInvoice.amount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50">
                                <Link
                                    href={`/reseller/invoices/${previewInvoice.invoice_number}`}
                                    className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1"
                                >
                                    Open Full Printable Invoice <ExternalLink className="size-3" />
                                </Link>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={`/reseller/invoices/${previewInvoice.invoice_number}/stream`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 transition-colors"
                                    >
                                        <Printer className="size-3.5" /> Print
                                    </a>
                                    <a
                                        href={`/reseller/invoices/${previewInvoice.invoice_number}/download`}
                                        download
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                                    >
                                        <Download className="size-3.5" /> Download PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function ucfirst(str: string | null | undefined): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
