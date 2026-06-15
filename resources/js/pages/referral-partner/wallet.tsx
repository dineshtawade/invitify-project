import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Wallet, TrendingUp, Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface WalletData {
    id: number;
    balance: number;
    status: string;
    total_earnings: number;
    pending_withdrawals: number;
}

interface WalletHistoryItem {
    id: number;
    type: string;
    amount: string;
    description: string;
    created_at: string;
}

export default function WalletPage({
    wallet,
    walletHistory,
}: {
    wallet: WalletData;
    walletHistory: WalletHistoryItem[];
}) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Referral Partner', href: '/referral-partner/dashboard' },
            { title: 'My Wallet', href: '/referral-partner/wallet' }
        ]}>
            <Head title="My Wallet" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Wallet className="size-8 text-indigo-600" /> My Wallet
                    </h1>
                    <p className="text-neutral-500 mt-1">Review your available balance, total earnings, and transaction log.</p>
                </div>

                {/* Summaries */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 flex flex-col justify-between">
                        <div className="text-xs font-bold uppercase opacity-70 flex items-center gap-1">
                            <Wallet className="size-4" /> Available Balance
                        </div>
                        <div className="text-4xl font-black mt-4">₹{Number(wallet.balance).toFixed(2)}</div>
                        <span className="text-[10px] opacity-75 mt-2">Ready for withdrawal</span>
                    </div>

                    <div className="bg-white border rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                            <TrendingUp className="size-4 text-green-500" /> Total Earnings
                        </div>
                        <div className="text-4xl font-black text-green-600 mt-2">₹{Number(wallet.total_earnings).toFixed(2)}</div>
                        <span className="text-[10px] text-neutral-400">Lifetime commission earned</span>
                    </div>

                    <div className="bg-white border rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                            <Clock className="size-4 text-amber-500" /> Pending Withdrawals
                        </div>
                        <div className="text-4xl font-black text-amber-600 mt-2">₹{Number(wallet.pending_withdrawals).toFixed(2)}</div>
                        <span className="text-[10px] text-neutral-400">Processing by admin</span>
                    </div>
                </div>

                {/* Earnings History */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Transaction History</h2>
                    {walletHistory.length === 0 ? (
                        <div className="border border-dashed rounded-2xl p-12 text-center text-neutral-500 bg-white">
                            <Wallet className="size-12 mx-auto mb-4 opacity-30 text-neutral-400" />
                            <p className="font-semibold text-lg">No Transactions Yet</p>
                            <p className="text-sm mt-1">Earnings from template purchase referrals will show here.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {walletHistory.map(item => (
                                <div key={item.id} className="border rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-full flex items-center justify-center ${item.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {item.type === 'credit' ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{item.description || (item.type === 'credit' ? 'Commission Credit' : 'Wallet Debit')}</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">{new Date(item.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-lg ${item.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.type === 'credit' ? '+' : '-'}₹{parseFloat(item.amount).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
