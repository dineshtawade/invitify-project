import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceData {
    invoice_no: string;
    invoice_date: string;
    order_id: string;
    payment_id: string;
    payment_method: string;
    payment_status: string;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    buyer_address: string;
    buyer_state: string;
    buyer_state_code: string;
    buyer_gstin: string;
    place_of_supply: string;
    item_name: string;
    item_type: string;
    sac_code: string;
    taxable_value: number;
    gst_rate: number;
    total_gst: number;
    line_total: number;
    cgst_rate: number;
    cgst_amount: number;
    sgst_rate: number;
    sgst_amount: number;
    igst_rate: number;
    igst_amount: number;
    discount_amount: number;
    round_off: number;
    grand_total: number;
    amount_in_words: string;
    validity_period: string;
    settings: {
        company_name: string;
        company_address: string;
        company_city: string;
        company_state: string;
        company_country?: string;
        company_gstin: string;
        company_pan: string;
        company_cin: string;
        company_email: string;
        company_website: string;
        company_phone: string;
    };
}

interface PageProps {
    invoice: InvoiceData;
    downloadUrl: string;
    streamUrl?: string;
}

function fmt(n: number | null | undefined): string {
    if (n === null || n === undefined) return '0.00';
    return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InvoiceShow({ invoice, downloadUrl }: PageProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-neutral-100/70 py-8 px-4 sm:px-6 lg:px-8 text-neutral-800 font-sans print:p-0 print:bg-white print:min-h-0">
            <Head title={`Tax Invoice #${invoice.invoice_no} - ${invoice.settings.company_name}`} />

            {/* Action Bar (Hidden when printing) */}
            <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back
                </button>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handlePrint}
                        variant="outline"
                        className="flex items-center gap-2 bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-700 font-semibold shadow-xs"
                    >
                        <Printer className="size-4" /> Print Invoice
                    </Button>

                    <a
                        href={downloadUrl}
                        download
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
                    >
                        <Download className="size-4" /> Download PDF
                    </a>
                </div>
            </div>

            {/* Invoice Sheet matching exact format from user image */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-neutral-200/80 p-8 sm:p-12 print:shadow-none print:border-none print:p-0 print:max-w-none print:rounded-none">

                {/* Company Header & Invoice Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    {/* Left: Company Details */}
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-600">
                            {invoice.settings.company_name}
                        </h1>
                        <div className="mt-1 text-xs text-neutral-600 leading-relaxed">
                            <p>{invoice.settings.company_address}</p>
                            <p>{invoice.settings.company_city}, {invoice.settings.company_state}, {invoice.settings.company_country || 'India'}</p>
                            <p className="mt-1">
                                <span className="font-semibold text-neutral-700">GSTIN:</span> {invoice.settings.company_gstin} &nbsp;|&nbsp;
                                <span className="font-semibold text-neutral-700">PAN:</span> {invoice.settings.company_pan}
                            </p>
                            <p>
                                <span className="font-semibold text-neutral-700">CIN:</span> {invoice.settings.company_cin}
                            </p>
                            <p className="mt-1 text-neutral-500">
                                {invoice.settings.company_email} &nbsp;|&nbsp; {invoice.settings.company_website}
                            </p>
                        </div>
                    </div>

                    {/* Right: Tax Invoice Details */}
                    <div className="text-left sm:text-right">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-neutral-900">
                            TAX INVOICE
                        </h2>
                        <div className="mt-2 text-xs text-neutral-700 space-y-1">
                            <p><span className="font-bold text-neutral-900">Invoice No:</span> <span className="font-mono font-semibold">{invoice.invoice_no}</span></p>
                            <p><span className="font-bold text-neutral-900">Date:</span> {invoice.invoice_date}</p>
                            <p><span className="font-bold text-neutral-900">Order ID:</span> <span className="font-mono">{invoice.order_id}</span></p>
                            <p><span className="font-bold text-neutral-900">Payment ID:</span> <span className="font-mono">{invoice.payment_id}</span></p>
                        </div>
                    </div>
                </div>

                {/* Solid Purple Divider */}
                <div className="my-5 h-[3px] bg-indigo-600 rounded-full" />

                {/* Billed To & Supply Details (Two Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    {/* Billed To Card */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 text-xs">
                        <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
                            BILLED TO
                        </p>
                        <h3 className="text-sm font-bold text-neutral-900">
                            {invoice.buyer_name}
                        </h3>
                        <p className="text-neutral-600 mt-0.5">
                            {invoice.buyer_email} {invoice.buyer_phone ? `• ${invoice.buyer_phone}` : ''}
                        </p>
                        <p className="text-neutral-600 mt-1">
                            {invoice.buyer_address}
                        </p>
                        <p className="text-neutral-600 mt-1">
                            <span className="font-semibold text-neutral-700">State:</span> {invoice.buyer_state} ({invoice.buyer_state_code})
                        </p>
                        <p className="text-neutral-600 mt-0.5">
                            <span className="font-semibold text-neutral-700">GSTIN:</span> {invoice.buyer_gstin}
                        </p>
                    </div>

                    {/* Supply Details Card */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 text-xs">
                        <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
                            SUPPLY DETAILS
                        </p>
                        <div className="space-y-1.5 text-neutral-700">
                            <p><span className="font-semibold text-neutral-900">Place of Supply:</span> {invoice.place_of_supply}</p>
                            <p><span className="font-semibold text-neutral-900">Supply Type:</span> Digital service (online delivery)</p>
                            <p><span className="font-semibold text-neutral-900">Reverse Charge:</span> No</p>
                            <p><span className="font-semibold text-neutral-900">Payment Mode:</span> {invoice.payment_method} (via Razorpay)</p>
                            <p><span className="font-semibold text-neutral-900">Payment Status:</span> <span className="font-semibold text-emerald-600">{invoice.payment_status}</span></p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto my-6 rounded-xl border border-neutral-200">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-700 uppercase font-bold text-[10px] tracking-wider">
                                <th className="p-3 text-center w-10">#</th>
                                <th className="p-3">DESCRIPTION</th>
                                <th className="p-3 text-center">SAC</th>
                                <th className="p-3 text-center">QTY</th>
                                <th className="p-3 text-right">TAXABLE VALUE (₹)</th>
                                <th className="p-3 text-center">GST %</th>
                                <th className="p-3 text-right">GST AMOUNT (₹)</th>
                                <th className="p-3 text-right">TOTAL (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            <tr>
                                <td className="p-3 text-center font-semibold text-neutral-500">1</td>
                                <td className="p-3">
                                    <div className="font-bold text-neutral-900 text-sm">{invoice.item_name}</div>
                                    <div className="text-[11px] text-neutral-500 mt-0.5">
                                        Digital invitation template ({invoice.item_type}) – access/download via TheInvitify
                                    </div>
                                </td>
                                <td className="p-3 text-center font-mono text-neutral-600">{invoice.sac_code}</td>
                                <td className="p-3 text-center font-semibold text-neutral-800">1</td>
                                <td className="p-3 text-right font-semibold text-neutral-800">₹{fmt(invoice.taxable_value)}</td>
                                <td className="p-3 text-center font-semibold text-neutral-700">{invoice.gst_rate}%</td>
                                <td className="p-3 text-right font-semibold text-neutral-800">₹{fmt(invoice.total_gst)}</td>
                                <td className="p-3 text-right font-bold text-neutral-900">₹{fmt(invoice.line_total)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Amount Calculation & Terms & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 items-start">
                    {/* Left: Amount in words & Terms */}
                    <div className="space-y-4">
                        {/* Amount in words */}
                        <div className="border-l-4 border-indigo-600 bg-indigo-50/40 pl-3 py-2 text-xs font-semibold text-neutral-800 rounded-r-lg">
                            Amount in words: <span className="font-bold">{invoice.amount_in_words}</span>
                        </div>

                        {/* Terms & Notes */}
                        <div className="text-xs text-neutral-600">
                            <p className="font-bold text-neutral-800 mb-1.5">Terms &amp; Notes</p>
                            <ul className="list-disc pl-4 space-y-1 text-[11px] text-neutral-600 leading-relaxed">
                                <li>This is a digital product delivered electronically; no physical goods are shipped.</li>
                                <li>Refunds/cancellations are governed by the policy at theinvitify.com/refund-policy.</li>
                                <li>Hosted invitation links remain active for {invoice.validity_period} from the date of purchase.</li>
                                <li>Subject to Nagpur jurisdiction.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Calculations Breakdown */}
                    <div>
                        <div className="rounded-xl border border-neutral-200 overflow-hidden text-xs">
                            <div className="flex justify-between p-2.5 border-b border-neutral-100">
                                <span className="text-neutral-600">Taxable Value</span>
                                <span className="font-semibold text-neutral-800">₹ {fmt(invoice.taxable_value)}</span>
                            </div>

                            {(invoice.cgst_amount > 0 || invoice.igst_amount === 0) && (
                                <>
                                    <div className="flex justify-between p-2.5 border-b border-neutral-100">
                                        <span className="text-neutral-600">CGST @ {invoice.cgst_rate}%</span>
                                        <span className="font-semibold text-neutral-800">₹ {fmt(invoice.cgst_amount)}</span>
                                    </div>
                                    <div className="flex justify-between p-2.5 border-b border-neutral-100">
                                        <span className="text-neutral-600">SGST @ {invoice.sgst_rate}%</span>
                                        <span className="font-semibold text-neutral-800">₹ {fmt(invoice.sgst_amount)}</span>
                                    </div>
                                </>
                            )}

                            {invoice.igst_amount > 0 && (
                                <div className="flex justify-between p-2.5 border-b border-neutral-100">
                                    <span className="text-neutral-600">IGST @ {invoice.igst_rate}%</span>
                                    <span className="font-semibold text-neutral-800">₹ {fmt(invoice.igst_amount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between p-2.5 border-b border-neutral-100">
                                <span className="text-neutral-600">Discount (if any)</span>
                                <span className="font-semibold text-emerald-600">- ₹ {fmt(invoice.discount_amount)}</span>
                            </div>

                            <div className="flex justify-between p-2.5 border-b border-neutral-100">
                                <span className="text-neutral-600">Round off</span>
                                <span className="font-semibold text-neutral-800">₹ {fmt(invoice.round_off)}</span>
                            </div>

                            {/* Total Amount Paid (Solid Purple Box) */}
                            <div className="flex justify-between items-center p-3.5 bg-indigo-600 text-white font-bold">
                                <span className="text-sm">Total Amount Paid</span>
                                <span className="text-lg">₹ {fmt(invoice.grand_total)}</span>
                            </div>
                        </div>

                        {/* Signatory */}
                        <div className="text-right mt-6 pr-2">
                            <p className="text-xs text-neutral-700">
                                For <span className="font-bold">{invoice.settings.company_name}</span>
                            </p>
                            <div className="h-12 flex items-center justify-end">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                                    <ShieldCheck className="size-3" /> Digitally Verified
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-neutral-800 mt-1">Authorised Signatory</p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 pt-4 border-t border-neutral-100 text-center text-[10px] text-neutral-400 leading-relaxed">
                    <p>This is a computer-generated invoice and does not require a physical signature.</p>
                    <p>Need help? Write to <span className="text-neutral-600">{invoice.settings.company_email}</span> with your Order ID.</p>
                </div>
            </div>
        </div>
    );
}
