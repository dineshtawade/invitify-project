import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { History, Banknote, ArrowDownRight, ArrowUpRight, CheckCircle2, XCircle, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reseller Dashboard',
        href: '/reseller/dashboard',
    },
    {
        title: 'Payment History',
        href: '/reseller/payment-history',
    },
];

interface WalletTransaction {
    id: number;
    type: 'credit' | 'debit';
    amount: string;
    description: string;
    created_at: string;
}

interface ManualDeposit {
    id: number;
    amount: string;
    utr: string;
    screenshot_path: string;
    status: 'pending' | 'approved' | 'rejected';
    bonus_percentage: string;
    bonus_amount: string;
    admin_notes: string | null;
    created_at: string;
}

interface HistoryPageProps {
    wallet: { balance: number };
    transactions: WalletTransaction[];
    manualDeposits: ManualDeposit[];
}

export default function ResellerPaymentHistory({ wallet, transactions = [], manualDeposits = [] }: HistoryPageProps) {
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const processedDeposits = manualDeposits.filter(d => d.status !== 'pending');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reseller Payment History" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <History className="size-8 text-indigo-600" /> Payment & Recharge History
                        </h1>
                        <p className="text-neutral-500 mt-1">Audit log of wallet credits, debits, manual deposits, and purchase deductions.</p>
                    </div>
                    <div className="bg-white border rounded-xl px-4 py-2 flex items-center gap-2 shadow-xs">
                        <span className="text-xs text-neutral-450 uppercase font-semibold">Wallet Balance:</span>
                        <span className="text-lg font-black text-indigo-600">₹{wallet.balance.toFixed(2)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Wallet Ledger Transactions (2/3 width) */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h2 className="text-lg font-bold">Wallet Transaction Ledger</h2>
                        {transactions.length === 0 ? (
                            <div className="border border-dashed rounded-2xl p-12 text-center text-neutral-400">
                                <History className="size-12 mx-auto mb-3 opacity-30 text-neutral-500" />
                                <p>No ledger transactions found.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="bg-white border rounded-xl p-4 flex justify-between items-center text-sm shadow-xs transition-hover hover:border-neutral-300">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-9 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                                }`}>
                                                {tx.type === 'credit' ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-neutral-800">{tx.description}</p>
                                                <p className="text-[10px] text-neutral-400 mt-0.5">{new Date(tx.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className={`font-black text-base shrink-0 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                                            }`}>
                                            {tx.type === 'credit' ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Processed Manual Deposits History (1/3 width) */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold">Manual Deposits Log</h2>
                        {processedDeposits.length === 0 ? (
                            <div className="border border-dashed rounded-2xl p-8 text-center text-neutral-400 text-xs">
                                <Banknote className="size-8 mx-auto mb-2 opacity-30 text-neutral-500" />
                                <p>No processed manual requests logged.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {processedDeposits.map(req => (
                                    <div key={req.id} className="bg-white border rounded-xl p-4 flex flex-col gap-2 text-xs shadow-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-neutral-850">₹{parseFloat(req.amount).toFixed(2)}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 ${req.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                {req.status === 'approved' ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                                                {req.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-neutral-800">UTR: <span className="font-mono">{req.utr}</span></p>
                                        {req.status === 'approved' && parseFloat(req.bonus_amount) > 0 && (
                                            <p className="text-[10px] text-green-600 font-semibold bg-green-50/50 p-1.5 rounded-sm">
                                                Bonus Credited: +₹{parseFloat(req.bonus_amount).toFixed(2)} ({req.bonus_percentage}%)
                                            </p>
                                        )}
                                        {req.admin_notes && (
                                            <p className="text-[10px] text-neutral-800 italic bg-neutral-50 p-1.5 rounded-sm border-l-2">
                                                Note: {req.admin_notes}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center text-[10px] text-neutral-800 border-t pt-2 mt-1">
                                            <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 px-1 text-[10px] text-indigo-600 hover:bg-indigo-50"
                                                onClick={() => setScreenshotPreview(req.screenshot_path)}
                                            >
                                                <Eye className="size-3 mr-0.5" /> View Slip
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Screenshot Preview Modal */}
                <Dialog open={screenshotPreview !== null} onOpenChange={() => setScreenshotPreview(null)}>
                    <DialogContent className="max-w-2xl p-2 bg-transparent border-0 shadow-none">
                        {screenshotPreview && (
                            <img src={screenshotPreview} alt="Payment Receipt Screenshot Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-lg bg-neutral-900" />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
