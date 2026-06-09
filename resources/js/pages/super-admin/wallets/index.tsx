import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle, XCircle, Clock, DollarSign, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface WalletData {
    id: number;
    user_name: string;
    user_email: string;
    balance: number;
    status: string;
    total_credited: number;
    total_debited: number;
}

interface RedemptionRequest {
    id: number;
    user_id: number;
    wallet_id: number;
    amount: string;
    status: string;
    admin_notes: string | null;
    created_at: string;
    user: { name: string; email: string };
}

export default function WalletsIndex({ wallets, redemptionRequests }: { wallets: WalletData[]; redemptionRequests: RedemptionRequest[] }) {
    const pendingRequests = redemptionRequests.filter(r => r.status === 'pending');
    const processedRequests = redemptionRequests.filter(r => r.status !== 'pending');

    return (
        <AppLayout breadcrumbs={[
            { title: 'Super Admin', href: '/super-admin/dashboard' },
            { title: 'Wallets & Payouts', href: '/super-admin/wallets' },
        ]}>
            <Head title="Wallets & Payouts" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Wallet className="size-8 text-emerald-600" /> Wallets & Payouts
                    </h1>
                    <p className="text-neutral-500 mt-1">Oversee referral partner wallets and process redemption requests.</p>
                </div>

                {/* Pending Redemption Requests */}
                {pendingRequests.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col gap-4">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-amber-800">
                            <Clock className="size-5" /> Pending Redemption Requests ({pendingRequests.length})
                        </h2>
                        <div className="flex flex-col gap-3">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">{req.user.name} <span className="text-neutral-400 font-normal text-sm">({req.user.email})</span></p>
                                        <p className="text-sm text-neutral-500">Requesting <span className="font-bold text-emerald-700">₹{parseFloat(req.amount).toFixed(2)}</span> withdrawal</p>
                                        <p className="text-xs text-neutral-400 mt-1">{new Date(req.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => router.post(`/super-admin/wallets/redemptions/${req.id}/approve`)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            size="sm"
                                        >
                                            <CheckCircle className="size-4 mr-1" /> Approve & Debit
                                        </Button>
                                        <Button
                                            onClick={() => { if (confirm('Reject this redemption?')) router.post(`/super-admin/wallets/redemptions/${req.id}/reject`); }}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <XCircle className="size-4 mr-1" /> Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Wallets */}
                <div>
                    <h2 className="text-lg font-bold mb-4">All Partner Wallets</h2>
                    {wallets.length === 0 ? (
                        <div className="border-2 border-dashed rounded-2xl p-12 text-center text-neutral-500">
                            <Wallet className="size-12 mx-auto mb-4 opacity-30" />
                            <p>No wallets have been created yet.</p>
                        </div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Partner</th>
                                        <th className="px-4 py-3 text-center">Balance</th>
                                        <th className="px-4 py-3 text-center">Total Credited</th>
                                        <th className="px-4 py-3 text-center">Total Debited</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wallets.map(w => (
                                        <tr key={w.id} className="border-t hover:bg-neutral-50/50">
                                            <td className="px-4 py-3">
                                                <p className="font-bold">{w.user_name}</p>
                                                <p className="text-xs text-neutral-400">{w.user_email}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-lg text-emerald-700">₹{Number(w.balance).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center text-green-600 flex items-center justify-center gap-1"><ArrowDownRight className="size-3.5" /> ₹{Number(w.total_credited).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center text-red-500"><ArrowUpRight className="size-3.5 inline mr-1" />₹{Number(w.total_debited).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {w.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Processed History */}
                {processedRequests.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Processed Requests</h2>
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Partner</th>
                                        <th className="px-4 py-3 text-center">Amount</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedRequests.map(req => (
                                        <tr key={req.id} className="border-t">
                                            <td className="px-4 py-3">{req.user.name}</td>
                                            <td className="px-4 py-3 text-center font-bold">₹{parseFloat(req.amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {req.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-neutral-500">{new Date(req.created_at).toLocaleString()}</td>
                                        </tr>
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
