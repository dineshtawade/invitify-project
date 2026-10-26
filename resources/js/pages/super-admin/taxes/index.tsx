import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Percent, Building2, Save, Receipt,
    FileText, Layers, TrendingUp, Calculator,
    Info
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/super-admin/dashboard' },
    { title: 'GST Management', href: '/super-admin/taxes' },
];

interface GstSettings {
    gst_enabled: boolean;
    default_gst_rate: number;
    cgst_percent: number;
    sgst_percent: number;
    platform_fee_enabled: boolean;
    default_platform_fee: number;
    default_platform_fee_type: string;
    default_hsn_sac: string;
    company_name: string;
    company_gstin: string;
    company_pan: string;
    company_address: string;
    company_state: string;
    company_state_code: string;
    company_email: string;
    company_phone: string;
    invoice_prefix: string;
    invoice_terms: string;
}

interface Template {
    id: number;
    name: string;
    type: string;
    category?: string;
    price: string | number;
    gst_rate: string | number | null;
    platform_fee: string | number | null;
    platform_fee_type: string;
    hsn_sac_code: string | null;
    tax_inclusive: boolean;
}

interface RecentInvoice {
    id: number;
    invoice_number: string;
    amount: string | number;
    status: string;
    created_at: string;
    user?: { name: string; email: string };
}

interface PageProps {
    settings: GstSettings;
    cardTemplates: Template[];
    websiteTemplates: Template[];
    recentInvoices: RecentInvoice[];
    [key: string]: any;
}

export default function TaxIndex({ settings, cardTemplates, websiteTemplates, recentInvoices }: PageProps) {
    const { props } = usePage<PageProps>();
    const flash = (props as any).flash as { status?: string } | undefined;

    const [form, setForm] = useState({
        gst_enabled: settings.gst_enabled ? '1' : '0',
        cgst_percent: String(settings.cgst_percent ?? 9),
        sgst_percent: String(settings.sgst_percent ?? 9),
        platform_fee_enabled: settings.platform_fee_enabled ? '1' : '0',
        default_platform_fee: String(settings.default_platform_fee),
        default_platform_fee_type: settings.default_platform_fee_type,
        default_hsn_sac: settings.default_hsn_sac,
        company_name: settings.company_name,
        company_gstin: settings.company_gstin,
        company_pan: settings.company_pan,
        company_address: settings.company_address,
        company_state: settings.company_state,
        company_state_code: settings.company_state_code,
        company_email: settings.company_email,
        company_phone: settings.company_phone,
        invoice_prefix: settings.invoice_prefix,
        invoice_terms: settings.invoice_terms,
    });

    const [saving, setSaving] = useState(false);

    const cgst = parseFloat(form.cgst_percent) || 0;
    const sgst = parseFloat(form.sgst_percent) || 0;
    const totalGst = cgst + sgst;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.post('/super-admin/taxes/settings', {
            ...form,
            gst_enabled: form.gst_enabled === '1',
            platform_fee_enabled: form.platform_fee_enabled === '1',
            cgst_percent: parseFloat(form.cgst_percent) || 0,
            sgst_percent: parseFloat(form.sgst_percent) || 0,
            default_platform_fee: parseFloat(form.default_platform_fee) || 0,
        }, {
            onFinish: () => setSaving(false),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="GST Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 xl:p-8">

                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <Percent className="size-7 text-violet-600 dark:text-violet-400" />
                        GST Management
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Configure CGST, SGST rates, company billing details, platform fees, and invoice settings.
                    </p>
                </div>

                {/* Flash message */}
                {flash?.status && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
                        ✓ {flash.status}
                    </div>
                )}

                {/* Summary Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-4">
                    {/* CGST */}
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">CGST Rate</p>
                                <h3 className="mt-1.5 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">{cgst}%</h3>
                            </div>
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <Percent className="size-5" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    </div>

                    {/* SGST */}
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">SGST Rate</p>
                                <h3 className="mt-1.5 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">{sgst}%</h3>
                            </div>
                            <div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                                <Percent className="size-5" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                    </div>

                    {/* Total GST */}
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Total GST</p>
                                <h3 className="mt-1.5 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalGst}%</h3>
                                <p className="text-xs text-neutral-400 mt-0.5">CGST + SGST</p>
                            </div>
                            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <Calculator className="size-5" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>

                    {/* GST Status */}
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">GST Status</p>
                                <h3 className={`mt-1.5 text-2xl font-extrabold ${form.gst_enabled === '1' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                                    {form.gst_enabled === '1' ? 'Enabled' : 'Disabled'}
                                </h3>
                            </div>
                            <div className={`rounded-xl p-3 ${form.gst_enabled === '1' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400'}`}>
                                <TrendingUp className="size-5" />
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${form.gst_enabled === '1' ? 'from-emerald-500 to-teal-500' : 'from-red-400 to-red-600'}`} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* === Section 1: GST Rate Configuration === */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                            <div className="bg-violet-50 p-2.5 text-violet-600 rounded-xl dark:bg-violet-950/40 dark:text-violet-400">
                                <Percent className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">GST Rate Configuration</h3>
                                <p className="text-xs text-neutral-400">Set CGST and SGST rates individually. Total GST is calculated automatically.</p>
                            </div>
                        </div>

                        {/* GST Enable Toggle */}
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={form.gst_enabled === '1'}
                                    onChange={e => setForm({ ...form, gst_enabled: e.target.checked ? '1' : '0' })}
                                />
                                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                            </label>
                            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                GST {form.gst_enabled === '1' ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5">
                            {/* CGST */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="cgst_percent">CGST (%)</Label>
                                <Input
                                    id="cgst_percent"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={form.cgst_percent}
                                    onChange={e => setForm({ ...form, cgst_percent: e.target.value })}
                                    placeholder="e.g. 9"
                                />
                                <p className="text-xs text-neutral-400">Central GST component</p>
                            </div>

                            {/* SGST */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="sgst_percent">SGST (%)</Label>
                                <Input
                                    id="sgst_percent"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={form.sgst_percent}
                                    onChange={e => setForm({ ...form, sgst_percent: e.target.value })}
                                    placeholder="e.g. 9"
                                />
                                <p className="text-xs text-neutral-400">State GST component</p>
                            </div>

                            {/* Total GST (read-only) */}
                            <div className="flex flex-col gap-2">
                                <Label>Total GST (CGST + SGST)</Label>
                                <div className="flex h-9 w-full rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50 px-3 py-1 items-center gap-2">
                                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalGst}%</span>
                                    <span className="text-xs text-neutral-400">= {cgst}% + {sgst}%</span>
                                </div>
                                <p className="text-xs text-neutral-400 flex items-center gap-1">
                                    <Info className="size-3" /> Auto-calculated. Applies to intra-state purchases.
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="default_hsn_sac">Default HSN / SAC Code</Label>
                                <Input
                                    id="default_hsn_sac"
                                    value={form.default_hsn_sac}
                                    onChange={e => setForm({ ...form, default_hsn_sac: e.target.value })}
                                    placeholder="e.g. 998314"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="invoice_prefix">Invoice Number Prefix</Label>
                                <Input
                                    id="invoice_prefix"
                                    value={form.invoice_prefix}
                                    onChange={e => setForm({ ...form, invoice_prefix: e.target.value })}
                                    placeholder="e.g. INV-"
                                />
                            </div>
                        </div>
                    </div>

                    {/* === Section 2: Platform Fee === */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                            <div className="bg-amber-50 p-2.5 text-amber-600 rounded-xl dark:bg-amber-950/40 dark:text-amber-400">
                                <TrendingUp className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Platform Fee Settings</h3>
                                <p className="text-xs text-neutral-400">Optional platform convenience fee added on top of template price</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={form.platform_fee_enabled === '1'}
                                    onChange={e => setForm({ ...form, platform_fee_enabled: e.target.checked ? '1' : '0' })}
                                />
                                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                            </label>
                            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                Platform Fee {form.platform_fee_enabled === '1' ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="default_platform_fee">Default Platform Fee</Label>
                                <Input
                                    id="default_platform_fee"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.default_platform_fee}
                                    onChange={e => setForm({ ...form, default_platform_fee: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="default_platform_fee_type">Fee Type</Label>
                                <select
                                    id="default_platform_fee_type"
                                    value={form.default_platform_fee_type}
                                    onChange={e => setForm({ ...form, default_platform_fee_type: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent dark:border-neutral-800 px-3 py-1 text-sm shadow-xs transition-colors outline-none focus:ring-1 focus:ring-neutral-400"
                                >
                                    <option value="fixed">Fixed Amount (₹)</option>
                                    <option value="percent">Percentage (%)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* === Section 3: Company Details === */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                            <div className="bg-blue-50 p-2.5 text-blue-600 rounded-xl dark:bg-blue-950/40 dark:text-blue-400">
                                <Building2 className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Company / Billing Details</h3>
                                <p className="text-xs text-neutral-400">These details appear on all GST tax invoices issued to customers</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="company_name">Company Name</Label>
                                <Input id="company_name" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Your Company Pvt. Ltd." />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="company_gstin">GSTIN</Label>
                                <Input id="company_gstin" value={form.company_gstin} onChange={e => setForm({ ...form, company_gstin: e.target.value })} placeholder="27AAAAA0000A1Z5" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="company_pan">PAN Number</Label>
                                <Input id="company_pan" value={form.company_pan} onChange={e => setForm({ ...form, company_pan: e.target.value })} placeholder="AAAAA0000A" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="company_state">State</Label>
                                <Input id="company_state" value={form.company_state} onChange={e => setForm({ ...form, company_state: e.target.value })} placeholder="Maharashtra" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="company_state_code">State Code</Label>
                                <Input id="company_state_code" value={form.company_state_code} onChange={e => setForm({ ...form, company_state_code: e.target.value })} placeholder="27" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="company_email">Billing Email</Label>
                                <Input id="company_email" type="email" value={form.company_email} onChange={e => setForm({ ...form, company_email: e.target.value })} placeholder="billing@yourcompany.com" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="company_phone">Phone</Label>
                                <Input id="company_phone" value={form.company_phone} onChange={e => setForm({ ...form, company_phone: e.target.value })} placeholder="+91 98765 43210" />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label htmlFor="company_address">Address</Label>
                                <textarea
                                    id="company_address"
                                    rows={2}
                                    value={form.company_address}
                                    onChange={e => setForm({ ...form, company_address: e.target.value })}
                                    placeholder="Full registered address"
                                    className="flex w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus:ring-1 focus:ring-neutral-400 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* === Section 4: Invoice Terms === */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-4">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                            <div className="bg-emerald-50 p-2.5 text-emerald-600 rounded-xl dark:bg-emerald-950/40 dark:text-emerald-400">
                                <FileText className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Invoice Terms &amp; Conditions</h3>
                                <p className="text-xs text-neutral-400">Printed at the bottom of every tax invoice</p>
                            </div>
                        </div>
                        <textarea
                            id="invoice_terms"
                            rows={4}
                            value={form.invoice_terms}
                            onChange={e => setForm({ ...form, invoice_terms: e.target.value })}
                            className="flex w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus:ring-1 focus:ring-neutral-400 resize-none"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={saving} className="font-semibold shadow-md">
                            <Save className="size-4 mr-2" />
                            {saving ? 'Saving…' : 'Save GST Settings'}
                        </Button>
                    </div>
                </form>

                {/* Recent Invoices */}
                <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-blue-50 p-2 text-blue-600 rounded-xl dark:bg-blue-950/40 dark:text-blue-400">
                                <Receipt className="size-4" />
                            </div>
                            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Recent Invoices</h3>
                        </div>
                        <a
                            href="/super-admin/invoices"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            View All →
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-6 py-3">Invoice #</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {recentInvoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-neutral-400 dark:text-neutral-500 text-sm">
                                            No invoices generated yet.
                                        </td>
                                    </tr>
                                ) : recentInvoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/15 transition-colors">
                                        <td className="px-6 py-3 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                                            {inv.invoice_number}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">{inv.user?.name ?? '—'}</div>
                                            <div className="text-neutral-400 text-xs">{inv.user?.email ?? ''}</div>
                                        </td>
                                        <td className="px-6 py-3 font-bold text-neutral-900 dark:text-neutral-100">
                                            ₹{parseFloat(String(inv.amount)).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-3">
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
                                        <td className="px-6 py-3 text-right text-xs text-neutral-400">
                                            {new Date(inv.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Template Tax Overrides */}
                {cardTemplates.length > 0 && (
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="bg-purple-50 p-2 text-purple-600 rounded-xl dark:bg-purple-950/40 dark:text-purple-400">
                                <Layers className="size-4" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Template-level Tax Overrides</h3>
                                <p className="text-xs text-neutral-400">Override GST rate per template (leave blank to use global rate)</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                                <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr>
                                        <th className="px-6 py-3">Template</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">GST Override</th>
                                        <th className="px-6 py-3">HSN/SAC</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {cardTemplates.map(t => (
                                        <TemplateRow key={t.id} template={t} type="card" />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}

function TemplateRow({ template, type }: { template: Template; type: 'card' | 'website' }) {
    const [editing, setEditing] = useState(false);
    const [vals, setVals] = useState({
        gst_rate: template.gst_rate != null ? String(template.gst_rate) : '',
        platform_fee: template.platform_fee != null ? String(template.platform_fee) : '',
        platform_fee_type: template.platform_fee_type || 'fixed',
        hsn_sac_code: template.hsn_sac_code ?? '',
        tax_inclusive: template.tax_inclusive,
    });
    const [saving, setSaving] = useState(false);

    const save = () => {
        setSaving(true);
        const url = type === 'card'
            ? `/super-admin/taxes/templates/${template.id}`
            : `/super-admin/taxes/website-templates/${template.id}`;
        router.post(url, {
            gst_rate: vals.gst_rate === '' ? null : parseFloat(vals.gst_rate),
            platform_fee: vals.platform_fee === '' ? null : parseFloat(vals.platform_fee),
            platform_fee_type: vals.platform_fee_type,
            hsn_sac_code: vals.hsn_sac_code,
            tax_inclusive: vals.tax_inclusive,
        }, {
            onSuccess: () => { setEditing(false); setSaving(false); },
            onError: () => setSaving(false),
            preserveScroll: true,
        });
    };

    return (
        <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/15 transition-colors">
            <td className="px-6 py-3">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{template.name}</div>
                <div className="text-xs text-neutral-400 capitalize">{template.category || template.type}</div>
            </td>
            <td className="px-6 py-3 font-bold text-neutral-900 dark:text-neutral-100">
                ₹{parseFloat(String(template.price)).toFixed(2)}
            </td>
            <td className="px-6 py-3">
                {editing ? (
                    <Input
                        type="number" step="0.01" min="0" max="100"
                        value={vals.gst_rate}
                        onChange={e => setVals({ ...vals, gst_rate: e.target.value })}
                        placeholder="Global default"
                        className="w-28 h-8 text-xs"
                    />
                ) : (
                    <span className={`text-sm font-semibold ${template.gst_rate != null ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-300 dark:text-neutral-600'}`}>
                        {template.gst_rate != null ? `${template.gst_rate}%` : '— Global'}
                    </span>
                )}
            </td>
            <td className="px-6 py-3">
                {editing ? (
                    <Input
                        type="text"
                        value={vals.hsn_sac_code}
                        onChange={e => setVals({ ...vals, hsn_sac_code: e.target.value })}
                        placeholder="998314"
                        className="w-28 h-8 text-xs font-mono"
                    />
                ) : (
                    <span className="font-mono text-xs text-neutral-500">{template.hsn_sac_code || '—'}</span>
                )}
            </td>
            <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                    {editing ? (
                        <>
                            <Button size="sm" onClick={save} disabled={saving} className="h-7 text-xs px-3">
                                {saving ? '…' : 'Save'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="h-7 text-xs px-3">
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="h-7 text-xs px-3">
                            Edit
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );
}
