import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Share2, Wallet, TrendingUp, Users, DollarSign, Copy, ArrowDownRight, ArrowUpRight, Clock, CheckCircle, XCircle, Banknote, Plus, Eye, Image, CreditCard } from 'lucide-react';

interface ReferralCode {
    id: number;
    code: string;
    discount_percentage: string;
    commission_percentage: string;
    is_active: boolean;
    expires_at: string | null;
    usage_count: number;
}

interface WalletData {
    id: number;
    balance: number;
    status: string;
    total_earnings: number;
    pending_withdrawals: number;
}

interface RecentTransaction {
    id: number;
    customer_name: string;
    customer_email: string;
    code: string;
    amount: number;
    discount_amount: number;
    commission_amount: number;
    created_at: string;
}

interface WalletHistoryItem {
    id: number;
    type: string;
    amount: string;
    description: string;
    created_at: string;
}

interface RedemptionData {
    id: number;
    amount: string;
    status: string;
    admin_notes: string | null;
    upi_id: string | null;
    bank_name: string | null;
    account_holder_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    qr_code_path: string | null;
    payment_proof_path: string | null;
    created_at: string;
}

interface PartnerConfig {
    referral_discount_percentage: string | null;
    referral_commission_percentage: string | null;
    referral_max_codes: number;
}

export default function ReferralPartnerDashboard({
    codes,
    partner,
    wallet,
    stats,
    recentTransactions,
    walletHistory,
    redemptions,
}: {
    codes: ReferralCode[];
    partner: PartnerConfig;
    wallet: WalletData;
    stats: { total_referrals: number; total_sales: number; total_commission: number };
    recentTransactions: RecentTransaction[];
    walletHistory: WalletHistoryItem[];
    redemptions: RedemptionData[];
}) {
    const [isRedeemOpen, setIsRedeemOpen] = useState(false);
    const [isCreateCodeOpen, setIsCreateCodeOpen] = useState(false);
    const [selectedQR, setSelectedQR] = useState<string | null>(null);
    const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upi' | 'bank' | 'qr'>('upi');

    const redeemForm = useForm({
        amount: '',
        upi_id: '',
        bank_name: '',
        account_holder_name: '',
        account_number: '',
        ifsc_code: '',
        qr_code: null as File | null,
    });

    const codeForm = useForm({
        code: '',
        discount_percentage: '0',
        start_date: '',
        expires_at: '',
    });

    const handleRedemption = (e: React.FormEvent) => {
        e.preventDefault();
        redeemForm.post('/referral-partner/request-redemption', {
            onSuccess: () => {
                setIsRedeemOpen(false);
                redeemForm.reset();
            },
        });
    };

    const handleCreateCode = (e: React.FormEvent) => {
        e.preventDefault();
        codeForm.post('/referral-partner/codes', {
            onSuccess: () => {
                setIsCreateCodeOpen(false);
                codeForm.reset();
            },
        });
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
    };

    const hasPending = redemptions.some(r => r.status === 'pending');
    const hasConfiguredRates = partner.referral_discount_percentage !== null;

    // Remaining allocation for display
    const discountAllocation = Number(partner.referral_discount_percentage || 0);
    const chosenDiscount = Number(codeForm.data.discount_percentage || 0);
    const remainingCommission = Math.max(0, discountAllocation - chosenDiscount);

    return (
        <AppLayout breadcrumbs={[{ title: 'Referral Partner', href: '/referral-partner/dashboard' }]}>
            <Head title="Referral Partner Dashboard" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Share2 className="size-8 text-indigo-600" /> Referral Dashboard
                        </h1>
                        <p className="text-neutral-500 mt-1">Track referrals, request payouts, and create referral codes.</p>
                    </div>
                    {hasConfiguredRates && codes.length < partner.referral_max_codes && (
                        <Button onClick={() => setIsCreateCodeOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="size-4 mr-2" /> Create Referral Code
                        </Button>
                    )}
                </div>

                {!hasConfiguredRates && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800">
                        <h3 className="font-bold text-lg">Rates Not Configured Yet</h3>
                        <p className="text-sm mt-1">Super Admin has not assigned your discount allocation rate yet. You will be able to create codes once they set your rates.</p>
                    </div>
                )}

                {/* Stats + Wallet Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 flex flex-col justify-between col-span-2 lg:col-span-1">
                        <div className="text-xs font-bold uppercase opacity-70 flex items-center gap-1">
                            <Wallet className="size-3" /> Available Balance
                        </div>
                        <div className="text-4xl font-black mt-2">₹{Number(wallet.balance).toFixed(2)}</div>
                        <Button
                            onClick={() => setIsRedeemOpen(true)}
                            disabled={hasPending || Number(wallet.balance) < 100}
                            className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                            size="sm"
                        >
                            <Banknote className="size-4 mr-2" /> Request Withdrawal
                        </Button>
                    </div>
                    <div className="bg-white border rounded-2xl p-5 flex flex-col gap-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                            <TrendingUp className="size-3 text-green-500" /> Total Earnings
                        </div>
                        <div className="text-3xl font-black text-green-600">₹{Number(wallet.total_earnings).toFixed(2)}</div>
                        <span className="text-[10px] text-neutral-400 mt-1">Total commission earned</span>
                    </div>
                    <div className="bg-white border rounded-2xl p-5 flex flex-col gap-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                            <Clock className="size-3 text-amber-500" /> Pending Payouts
                        </div>
                        <div className="text-3xl font-black text-amber-600">₹{Number(wallet.pending_withdrawals).toFixed(2)}</div>
                        <span className="text-[10px] text-neutral-400 mt-1">Awaiting admin manual transfer</span>
                    </div>
                    <div className="bg-white border rounded-2xl p-5 flex flex-col gap-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                            <Users className="size-3 text-indigo-500" /> Total Referrals
                        </div>
                        <div className="text-3xl font-black text-neutral-900">{stats.total_referrals}</div>
                        <span className="text-[10px] text-neutral-400 mt-1">Sales using your codes</span>
                    </div>
                </div>

                {/* My Referral Codes */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">My Referral Codes</h2>
                        {hasConfiguredRates && (
                            <span className="text-xs text-neutral-500">Limit: {codes.length} / {partner.referral_max_codes} codes</span>
                        )}
                    </div>
                    {codes.length === 0 ? (
                        <div className="border-2 border-dashed rounded-2xl p-8 text-center text-neutral-500">
                            <p>No codes generated yet. Click "Create Referral Code" above to generate one.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {codes.map(code => (
                                <div key={code.id} className={`border rounded-2xl p-5 flex flex-col gap-3 ${code.is_active ? 'bg-white' : 'bg-neutral-50 opacity-60'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-black text-2xl text-indigo-700">{code.code}</span>
                                        <button onClick={() => copyCode(code.code)} className="text-neutral-400 hover:text-indigo-600" title="Copy Code">
                                            <Copy className="size-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 text-center text-xs">
                                        <div>
                                            <p className="text-neutral-500">Discount</p>
                                            <p className="font-bold text-lg text-amber-600">{code.discount_percentage}%</p>
                                        </div>
                                        <div>
                                            <p className="text-neutral-500">Commission</p>
                                            <p className="font-bold text-lg text-indigo-600">{code.commission_percentage}%</p>
                                        </div>
                                        <div>
                                            <p className="text-neutral-500">Uses</p>
                                            <p className="font-bold text-lg">{code.usage_count}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={`px-2 py-0.5 rounded-full font-bold ${code.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {code.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                        <span className="text-neutral-400">
                                            {code.expires_at ? `Expires ${new Date(code.expires_at).toLocaleDateString()}` : 'No Expiry'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Code Dialog */}
                {hasConfiguredRates && (
                    <Dialog open={isCreateCodeOpen} onOpenChange={setIsCreateCodeOpen}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create Referral Code</DialogTitle>
                                <DialogDescription>
                                    Create a custom code and split your discount allocation.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateCode} className="flex flex-col gap-4 py-4">
                                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm flex flex-col gap-1.5 text-indigo-800">
                                    <p className="font-bold">Discount Allocation: {partner.referral_discount_percentage}%</p>
                                    <p className="text-xs">Specify how much discount you want to offer to customers. The remaining allocation becomes your dynamic commission percentage.</p>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Custom Code (optional)</Label>
                                    <Input
                                        value={codeForm.data.code}
                                        onChange={e => codeForm.setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g. SAVE10 (Letters & numbers only)"
                                        maxLength={32}
                                    />
                                    {codeForm.errors.code && <p className="text-red-500 text-xs">{codeForm.errors.code}</p>}
                                </div>

                                <div className="grid gap-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Customer Discount Percentage (%)</Label>
                                        <span className="font-bold text-indigo-600">{chosenDiscount}%</span>
                                    </div>
                                    <Input
                                        type="range"
                                        min="0"
                                        max={discountAllocation}
                                        value={codeForm.data.discount_percentage}
                                        onChange={e => codeForm.setData('discount_percentage', e.target.value)}
                                        className="h-2 bg-indigo-100 rounded-lg cursor-pointer"
                                        required
                                    />
                                    <div className="flex justify-between text-xs text-neutral-500 font-medium px-1">
                                        <span>0% (Full Comm)</span>
                                        <span>{discountAllocation}% (No Comm)</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-2 bg-neutral-50 border rounded-xl p-3 text-center">
                                    <div>
                                        <div className="text-xs text-neutral-500 font-bold uppercase">Customer Gets</div>
                                        <div className="text-xl font-black text-amber-600">{chosenDiscount}% Off</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-neutral-500 font-bold uppercase">You Earn</div>
                                        <div className="text-xl font-black text-indigo-700">{remainingCommission}% Comm</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="grid gap-2">
                                        <Label>Start Date (Optional)</Label>
                                        <Input
                                            type="date"
                                            value={codeForm.data.start_date}
                                            onChange={e => codeForm.setData('start_date', e.target.value)}
                                        />
                                        {codeForm.errors.start_date && <p className="text-red-500 text-xs">{codeForm.errors.start_date}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>End Date (Optional)</Label>
                                        <Input
                                            type="date"
                                            value={codeForm.data.expires_at}
                                            onChange={e => codeForm.setData('expires_at', e.target.value)}
                                            min={codeForm.data.start_date || undefined}
                                        />
                                        {codeForm.errors.expires_at && <p className="text-red-500 text-xs">{codeForm.errors.expires_at}</p>}
                                    </div>
                                </div>

                                <DialogFooter className="mt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsCreateCodeOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={codeForm.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">Generate Code</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Recent Referral Sales */}
                {recentTransactions.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Recent Referral Sales</h2>
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Customer</th>
                                        <th className="px-4 py-3 text-center">Code</th>
                                        <th className="px-4 py-3 text-center">Sale Amount</th>
                                        <th className="px-4 py-3 text-center">Discount</th>
                                        <th className="px-4 py-3 text-center">Your Commission</th>
                                        <th className="px-4 py-3 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map(t => (
                                        <tr key={t.id} className="border-t hover:bg-neutral-50/50">
                                            <td className="px-4 py-3">
                                                <p className="font-bold">{t.customer_name}</p>
                                                <p className="text-xs text-neutral-400">{t.customer_email}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono font-bold text-indigo-700">{t.code}</td>
                                            <td className="px-4 py-3 text-center">₹{Number(t.amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center text-amber-600">-₹{Number(t.discount_amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center font-bold text-green-600">+₹{Number(t.commission_amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right text-xs text-neutral-500">{new Date(t.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Wallet History */}
                {walletHistory.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Wallet History</h2>
                        <div className="flex flex-col gap-2">
                            {walletHistory.map(item => (
                                <div key={item.id} className="border rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-8 rounded-full flex items-center justify-center ${item.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {item.type === 'credit' ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{item.description || (item.type === 'credit' ? 'Commission Credit' : 'Wallet Debit')}</p>
                                            <p className="text-xs text-neutral-400">{new Date(item.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-lg ${item.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.type === 'credit' ? '+' : '-'}₹{parseFloat(item.amount).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Redemption Requests / Payout History */}
                {redemptions.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Withdrawal & Payout History</h2>
                        <div className="flex flex-col gap-3">
                            {redemptions.map(r => (
                                <div key={r.id} className=" border rounded-xl p-5 flex flex-col gap-3">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            {r.status === 'pending' && <Clock className="size-5 text-amber-800" />}
                                            {(r.status === 'approved' || r.status === 'paid') && <CheckCircle className="size-5 text-green-600" />}
                                            {r.status === 'rejected' && <XCircle className="size-5 text-red-500" />}
                                            <div>
                                                <p className="font-bold text-lg">₹{parseFloat(r.amount).toFixed(2)} Withdrawal</p>
                                                <p className="text-xs text-neutral-400">{new Date(r.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            (r.status === 'approved' || r.status === 'paid') ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {r.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Show Submitted Payment Details */}
                                    <div className="rounded-xl p-3 text-xs flex flex-col gap-1.5 border">
                                        <p className="text-neutral-500 font-bold uppercase text-[9px] tracking-wider">Submitted Payout Details:</p>
                                        {r.upi_id && <p>• <strong>UPI ID:</strong> {r.upi_id}</p>}
                                        {r.bank_name && (
                                            <p>• <strong>Bank details:</strong> {r.bank_name} | A/C: {r.account_number} | IFSC: {r.ifsc_code} | Name: {r.account_holder_name}</p>
                                        )}
                                        {r.qr_code_path && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span>• <strong>QR Code Image:</strong></span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedQR(r.qr_code_path)}
                                                    className="h-6 px-2 text-[10px]"
                                                >
                                                    <Eye className="size-3 mr-1" /> View QR Code
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Proof Receipt or Notes from Admin */}
                                    {(r.admin_notes || r.payment_proof_path) && (
                                        <div className="border-t pt-3 flex flex-col gap-2">
                                            {r.admin_notes && (
                                                <p className="text-xs ">
                                                    <strong>Admin Note:</strong> {r.admin_notes}
                                                </p>
                                            )}
                                            {r.payment_proof_path && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs "><strong>Payment Receipt:</strong></span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedReceipt(r.payment_proof_path)}
                                                        className="h-6 px-2 text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-100"
                                                    >
                                                        <Eye className="size-3 mr-1" /> View Receipt Proof
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Payout Details (Redemption) Dialog */}
                <Dialog open={isRedeemOpen} onOpenChange={setIsRedeemOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Request Payout Withdrawal</DialogTitle>
                            <DialogDescription>Enter the amount you wish to withdraw and payment details.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRedemption} className="flex flex-col gap-4 py-2">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
                                <p className="text-[10px] text-indigo-500 uppercase font-bold tracking-wider">Available Balance</p>
                                <p className="text-3xl font-black text-indigo-700">₹{Number(wallet.balance).toFixed(2)}</p>
                            </div>

                            <div className="grid gap-2">
                                <Label>Withdrawal Amount (₹)</Label>
                                <Input
                                    type="number"
                                    min={100}
                                    max={wallet.balance}
                                    value={redeemForm.data.amount}
                                    onChange={e => redeemForm.setData('amount', e.target.value)}
                                    required
                                    placeholder="Enter amount (Minimum ₹100)"
                                />
                                {redeemForm.errors.amount && <p className="text-red-500 text-xs">{redeemForm.errors.amount}</p>}
                            </div>

                            {/* Payout Methods Selector */}
                            <div className="mt-2 border-t pt-4">
                                <Label className="mb-2 block font-bold">Select Payout Method (provide at least one)</Label>
                                <div className="grid grid-cols-3 gap-2 bg-neutral-100 p-1 rounded-xl mb-4 text-xs font-medium">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('upi')}
                                        className={`py-1.5 rounded-lg text-center ${activeTab === 'upi' ? 'bg-white shadow' : 'text-neutral-500'}`}
                                    >
                                        UPI ID
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('bank')}
                                        className={`py-1.5 rounded-lg text-center ${activeTab === 'bank' ? 'bg-white shadow' : 'text-neutral-500'}`}
                                    >
                                        Bank Details
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('qr')}
                                        className={`py-1.5 rounded-lg text-center ${activeTab === 'qr' ? 'bg-white shadow' : 'text-neutral-500'}`}
                                    >
                                        QR Code
                                    </button>
                                </div>

                                {/* UPI Tab */}
                                {activeTab === 'upi' && (
                                    <div className="grid gap-2 animate-in fade-in duration-200">
                                        <Label>Your UPI ID</Label>
                                        <Input
                                            value={redeemForm.data.upi_id}
                                            onChange={e => redeemForm.setData('upi_id', e.target.value)}
                                            placeholder="e.g. name@upi"
                                        />
                                        {redeemForm.errors.upi_id && <p className="text-red-500 text-xs">{redeemForm.errors.upi_id}</p>}
                                    </div>
                                )}

                                {/* Bank Tab */}
                                {activeTab === 'bank' && (
                                    <div className="grid gap-3 animate-in fade-in duration-200">
                                        <div className="grid gap-1.5">
                                            <Label>Account Holder Name</Label>
                                            <Input
                                                value={redeemForm.data.account_holder_name}
                                                onChange={e => redeemForm.setData('account_holder_name', e.target.value)}
                                                placeholder="Full name"
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label>Bank Account Number</Label>
                                            <Input
                                                value={redeemForm.data.account_number}
                                                onChange={e => redeemForm.setData('account_number', e.target.value)}
                                                placeholder="Account number"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid gap-1.5">
                                                <Label>Bank Name</Label>
                                                <Input
                                                    value={redeemForm.data.bank_name}
                                                    onChange={e => redeemForm.setData('bank_name', e.target.value)}
                                                    placeholder="e.g. HDFC"
                                                />
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label>IFSC Code</Label>
                                                <Input
                                                    value={redeemForm.data.ifsc_code}
                                                    onChange={e => redeemForm.setData('ifsc_code', e.target.value.toUpperCase())}
                                                    placeholder="IFSC"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* QR Code Tab */}
                                {activeTab === 'qr' && (
                                    <div className="grid gap-2 animate-in fade-in duration-200">
                                        <Label>Upload Payment QR Code Image</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => redeemForm.setData('qr_code', e.target.files?.[0] || null)}
                                        />
                                        <p className="text-[10px] text-neutral-400">Upload a screenshot of your Google Pay/PhonePe/Paytm QR Code.</p>
                                        {redeemForm.errors.qr_code && <p className="text-red-500 text-xs">{redeemForm.errors.qr_code}</p>}
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsRedeemOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={redeemForm.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">Submit Request</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* QR Code Viewer Modal */}
                <Dialog open={selectedQR !== null} onOpenChange={() => setSelectedQR(null)}>
                    <DialogContent className="max-w-xs text-center flex flex-col items-center">
                        <DialogHeader>
                            <DialogTitle>Payout QR Code</DialogTitle>
                        </DialogHeader>
                        {selectedQR && (
                            <img
                                src={selectedQR}
                                alt="Payout QR Code"
                                className="max-w-full max-h-[350px] object-contain border rounded-xl p-2 bg-white mt-4"
                            />
                        )}
                        <Button onClick={() => setSelectedQR(null)} className="mt-4 w-full">Close</Button>
                    </DialogContent>
                </Dialog>

                {/* Receipt Viewer Modal */}
                <Dialog open={selectedReceipt !== null} onOpenChange={() => setSelectedReceipt(null)}>
                    <DialogContent className="max-w-md text-center flex flex-col items-center">
                        <DialogHeader>
                            <DialogTitle>Payment Receipt / Proof</DialogTitle>
                        </DialogHeader>
                        {selectedReceipt && (
                            <img
                                src={selectedReceipt}
                                alt="Payment Receipt"
                                className="max-w-full max-h-[400px] object-contain border rounded-xl p-2 bg-white mt-4"
                            />
                        )}
                        <Button onClick={() => setSelectedReceipt(null)} className="mt-4 w-full">Close</Button>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
