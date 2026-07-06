import { useState, useMemo } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Users, Banknote, CheckCircle2, XCircle, Clock, ArrowUpRight,
    ArrowDownRight, Eye, Wallet, Sparkles, TrendingUp, ShieldAlert,
    ChevronLeft, AlertCircle, FileText, Zap, Settings2
} from 'lucide-react';

interface ResellerData {
    id: number;
    name: string;
    email: string;
    wallet_balance: number;
    wallet_status: string;
}

interface ManualDeposit {
    id: number;
    user_id: number;
    amount: string;
    utr: string;
    screenshot_path: string;
    status: 'pending' | 'approved' | 'rejected';
    bonus_percentage: string;
    bonus_amount: string;
    admin_notes: string | null;
    processed_at: string | null;
    created_at: string;
    user: { name: string; email: string };
}

interface ResellersIndexProps {
    deposits: ManualDeposit[];
    resellers: ResellerData[];
    defaultOnlineBonus: number;
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
        active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
        inactive: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] || 'bg-neutral-100 text-neutral-600'}`}>
            {status === 'active' || status === 'approved' ? <CheckCircle2 className="size-3" /> : status === 'pending' ? <Clock className="size-3" /> : <XCircle className="size-3" />}
            {status}
        </span>
    );
}

export default function ResellersIndex({ deposits = [], resellers = [], defaultOnlineBonus = 0 }: ResellersIndexProps) {
    const { props } = usePage<any>();
    const flashStatus = props.flash?.status || (props as any).status;
    const flashError = props.flash?.error || (props as any).error;

    const [selectedReseller, setSelectedReseller] = useState<ResellerData | null>(null);
    const [isAdjustOpen, setIsAdjustOpen] = useState(false);
    const [selectedDeposit, setSelectedDeposit] = useState<ManualDeposit | null>(null);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const adjustForm = useForm({ user_id: '', type: 'credit', amount: '', description: '' });
    const approveForm = useForm({ bonus_percentage: '0', admin_notes: '' });
    const rejectForm = useForm({ admin_notes: '' });
    const bonusSettingsForm = useForm({ bonus_percentage: String(defaultOnlineBonus) });

    const handleUpdateOnlineBonus = (e: React.FormEvent) => {
        e.preventDefault();
        bonusSettingsForm.post('/super-admin/resellers/update-online-bonus', {
            preserveScroll: true,
        });
    };

    // Live bonus calculation
    const depositAmount = selectedDeposit ? parseFloat(selectedDeposit.amount) : 0;
    const bonusPct = parseFloat(approveForm.data.bonus_percentage) || 0;
    const bonusAmount = Math.round(depositAmount * (bonusPct / 100) * 100) / 100;
    const totalCredit = depositAmount + bonusAmount;

    const openAdjustModal = (reseller: ResellerData) => {
        setSelectedReseller(reseller);
        adjustForm.setData({ user_id: String(reseller.id), type: 'credit', amount: '', description: '' });
        setIsAdjustOpen(true);
    };

    const handleAdjustBalance = (e: React.FormEvent) => {
        e.preventDefault();
        adjustForm.post('/super-admin/resellers/adjust-balance', {
            onSuccess: () => { setIsAdjustOpen(false); adjustForm.reset(); setSelectedReseller(null); },
        });
    };

    const openApproveModal = (deposit: ManualDeposit) => {
        setSelectedDeposit(deposit);
        approveForm.setData({ bonus_percentage: String(parseFloat(deposit.bonus_percentage) || 0), admin_notes: '' });
        setIsApproveOpen(true);
    };

    const handleApproveDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDeposit) return;
        approveForm.post(`/super-admin/resellers/deposits/${selectedDeposit.id}/approve`, {
            onSuccess: () => { setIsApproveOpen(false); approveForm.reset(); setSelectedDeposit(null); },
        });
    };

    const openRejectModal = (deposit: ManualDeposit) => {
        setSelectedDeposit(deposit);
        rejectForm.setData({ admin_notes: '' });
        setIsRejectOpen(true);
    };

    const handleRejectDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDeposit) return;
        rejectForm.post(`/super-admin/resellers/deposits/${selectedDeposit.id}/reject`, {
            onSuccess: () => { setIsRejectOpen(false); rejectForm.reset(); setSelectedDeposit(null); },
        });
    };

    const pendingRequests = deposits.filter(d => d.status === 'pending');
    const processedRequests = deposits.filter(d => d.status !== 'pending');

    const totalWalletBalance = resellers.reduce((acc, r) => acc + Number(r.wallet_balance), 0);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <AppLayout breadcrumbs={[
            { title: 'Super Admin', href: '/super-admin/dashboard' },
            { title: 'Manage Resellers', href: '/super-admin/resellers' },
        ]}>
            <Head title="Manage Resellers" />

            <div className="p-6 xl:p-8 max-w-7xl mx-auto flex flex-col gap-8 w-full">

                {/* Flash messages */}
                {flashStatus && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5 text-emerald-800 text-sm font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300">
                        <CheckCircle2 className="size-5 shrink-0" /> {flashStatus}
                    </div>
                )}
                {flashError && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 text-red-800 text-sm font-semibold dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300">
                        <AlertCircle className="size-5 shrink-0" /> {flashError}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Users className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Resellers Management
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Approve wallet recharges, adjust balances, and manage all reseller accounts.
                        </p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                        {
                            label: 'Total Resellers', value: resellers.length, icon: Users,
                            color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
                            bar: 'from-indigo-500 to-violet-500',
                        },
                        {
                            label: 'Pending Requests', value: pendingRequests.length, icon: Clock,
                            color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
                            bar: 'from-amber-500 to-orange-500',
                        },
                        {
                            label: 'Total Wallet Float', value: `₹${totalWalletBalance.toFixed(2)}`, icon: Wallet,
                            color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
                            bar: 'from-emerald-500 to-teal-500',
                        },
                    ].map(stat => (
                        <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{stat.label}</p>
                                    <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">{stat.value}</h3>
                                </div>
                                <div className={`rounded-xl p-3.5 ${stat.color}`}>
                                    <stat.icon className="size-6" />
                                </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.bar}`} />
                        </div>
                    ))}
                </div>

                {/* ===== ONLINE PAYMENT BONUS SETTINGS ===== */}
                <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 dark:from-indigo-950/30 dark:to-violet-950/20 overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-indigo-200/60 dark:border-indigo-900/40">
                        <div className="bg-indigo-100 dark:bg-indigo-950/60 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Zap className="size-5" />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                                Online Payment Bonus (Auto)
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                This % bonus is automatically added to every Razorpay online recharge by any reseller.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950/50 px-3 py-1.5 rounded-full">
                            <Sparkles className="size-3.5 text-indigo-500" />
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                Current: {defaultOnlineBonus}%
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateOnlineBonus} className="px-6 py-5">
                        <div className="grid sm:grid-cols-2 gap-6 items-end">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="online_bonus_pct" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                    Set Global Bonus Percentage (%)
                                </Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="online_bonus_pct"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        value={bonusSettingsForm.data.bonus_percentage}
                                        onChange={e => bonusSettingsForm.setData('bonus_percentage', e.target.value)}
                                        className="h-11 text-lg font-bold rounded-xl w-32 text-center"
                                        placeholder="0"
                                    />
                                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">%</span>
                                    <div className="flex-1 text-xs text-neutral-400 dark:text-neutral-500">
                                        e.g. Set 15% → Reseller pays ₹1,00,000 → Gets ₹1,15,000 credited automatically
                                    </div>
                                </div>
                                {bonusSettingsForm.errors.bonus_percentage && (
                                    <p className="text-red-500 text-xs">{bonusSettingsForm.errors.bonus_percentage}</p>
                                )}
                            </div>

                            {/* Live Preview */}
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Live Preview (for ₹10,000 recharge)</p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-indigo-100 dark:border-indigo-900/40 px-3 py-2.5">
                                        <p className="text-[10px] text-neutral-400 mb-1">Paid</p>
                                        <p className="font-black text-base text-neutral-800 dark:text-neutral-200">₹10,000</p>
                                    </div>
                                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-emerald-100 dark:border-emerald-900/40 px-3 py-2.5">
                                        <p className="text-[10px] text-neutral-400 mb-1">Bonus</p>
                                        <p className="font-black text-base text-emerald-600 dark:text-emerald-400">
                                            +₹{(10000 * (parseFloat(bonusSettingsForm.data.bonus_percentage) || 0) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <div className="bg-indigo-600 rounded-xl px-3 py-2.5">
                                        <p className="text-[10px] text-indigo-200 mb-1">Gets</p>
                                        <p className="font-black text-base text-white">
                                            ₹{(10000 + 10000 * (parseFloat(bonusSettingsForm.data.bonus_percentage) || 0) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={bonusSettingsForm.processing}
                                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-1"
                                >
                                    <Settings2 className="size-4 mr-2" />
                                    {bonusSettingsForm.processing ? 'Saving…' : 'Save Online Bonus Settings'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* ===== PENDING MANUAL RECHARGE REQUESTS ===== */}
                {pendingRequests.length > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/10 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200 dark:border-amber-900/40">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-amber-100 dark:bg-amber-950/50 p-2 rounded-xl text-amber-600 dark:text-amber-400">
                                    <Clock className="size-4.5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Pending Manual Recharges</h2>
                                    <p className="text-xs text-neutral-400">Review and approve or reject each request below</p>
                                </div>
                            </div>
                            <span className="bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                                {pendingRequests.length} Pending
                            </span>
                        </div>

                        <div className="p-6 grid md:grid-cols-2 gap-4">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0">
                                                {req.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-neutral-900 dark:text-neutral-100">{req.user.name}</p>
                                                <p className="text-xs text-neutral-400">{req.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                                                ₹{parseFloat(req.amount).toFixed(2)}
                                            </p>
                                            <StatusBadge status={req.status} />
                                        </div>
                                    </div>

                                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl px-4 py-3 text-xs flex flex-col gap-1.5">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">UTR Reference</span>
                                            <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">{req.utr}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">Submitted</span>
                                            <span className="text-neutral-600 dark:text-neutral-400">{formatDate(req.created_at)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">Default Bonus</span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{req.bonus_percentage}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                                            onClick={() => setScreenshotPreview(req.screenshot_path)}
                                        >
                                            <Eye className="size-3.5 mr-1" /> View Slip
                                        </Button>
                                        <div className="flex gap-2 ml-auto">
                                            <Button
                                                onClick={() => openRejectModal(req)}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                <XCircle className="size-3.5 mr-1" /> Reject
                                            </Button>
                                            <Button
                                                onClick={() => openApproveModal(req)}
                                                size="sm"
                                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                            >
                                                <CheckCircle2 className="size-3.5 mr-1" /> Approve
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== RESELLERS WALLET TABLE ===== */}
                <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                                <Wallet className="size-4.5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Reseller Wallets</h2>
                                <p className="text-xs text-neutral-400">View balances and manually adjust funds</p>
                            </div>
                        </div>
                    </div>

                    {resellers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-400">
                            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                <Users className="size-7 text-neutral-300" />
                            </div>
                            <p className="text-sm font-medium">No resellers registered yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse text-left">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-[11px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr>
                                        <th className="px-6 py-4">Reseller</th>
                                        <th className="px-6 py-4 text-center">Wallet Balance</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {resellers.map(reseller => (
                                        <tr key={reseller.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shrink-0">
                                                        {reseller.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{reseller.name}</p>
                                                        <p className="text-xs text-neutral-400">{reseller.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                    ₹{Number(reseller.wallet_balance).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <StatusBadge status={reseller.wallet_status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    onClick={() => openAdjustModal(reseller)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
                                                >
                                                    <TrendingUp className="size-3.5 mr-1" /> Adjust Balance
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ===== PROCESSED DEPOSITS LOG ===== */}
                {processedRequests.length > 0 && (
                    <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-xl text-neutral-500">
                                <FileText className="size-4.5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Processed Deposits Log</h2>
                                <p className="text-xs text-neutral-400">History of all approved and rejected requests</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse text-left">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-[11px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr>
                                        <th className="px-6 py-4">Reseller</th>
                                        <th className="px-6 py-4 text-center">Amount</th>
                                        <th className="px-6 py-4 text-center">UTR</th>
                                        <th className="px-6 py-4 text-center">Bonus</th>
                                        <th className="px-6 py-4 text-center">Total Credited</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Processed At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {processedRequests.map(req => {
                                        const principal = parseFloat(req.amount);
                                        const bonus = parseFloat(req.bonus_amount || '0');
                                        const total = principal + bonus;
                                        return (
                                            <tr key={req.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{req.user?.name}</p>
                                                    <p className="text-xs text-neutral-400">{req.user?.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-neutral-900 dark:text-neutral-100">
                                                    ₹{principal.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-center font-mono text-xs text-neutral-500 dark:text-neutral-400">
                                                    {req.utr}
                                                </td>
                                                <td className="px-6 py-4 text-center text-xs">
                                                    {req.status === 'approved' && bonus > 0 ? (
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                                                            <Sparkles className="size-3" />
                                                            +₹{bonus.toFixed(2)} ({req.bonus_percentage}%)
                                                        </span>
                                                    ) : <span className="text-neutral-300">—</span>}
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                                                    {req.status === 'approved' ? `₹${total.toFixed(2)}` : '—'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <StatusBadge status={req.status} />
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs text-neutral-400 whitespace-nowrap">
                                                    {req.processed_at ? formatDate(req.processed_at) : '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ===== APPROVE DEPOSIT DIALOG ===== */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                            <CheckCircle2 className="size-5 text-emerald-600" />
                            Approve Recharge Request
                        </DialogTitle>
                        <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                            Set bonus percentage. Amount will be auto-calculated.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleApproveDeposit} className="px-6 py-5 flex flex-col gap-5">
                        {/* Reseller Info */}
                        {selectedDeposit && (
                            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl px-4 py-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                    {selectedDeposit.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{selectedDeposit.user.name}</p>
                                    <p className="text-xs text-neutral-400">{selectedDeposit.user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Live Calculation Preview */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 flex flex-col gap-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                <Sparkles className="size-3.5" /> Live Calculation Preview
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40">
                                    <p className="text-[10px] text-neutral-400 mb-1">Deposit</p>
                                    <p className="font-black text-lg text-neutral-900 dark:text-neutral-100">₹{depositAmount.toFixed(0)}</p>
                                </div>
                                <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40">
                                    <p className="text-[10px] text-neutral-400 mb-1">Bonus ({bonusPct}%)</p>
                                    <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">+₹{bonusAmount.toFixed(0)}</p>
                                </div>
                                <div className="bg-emerald-600 rounded-xl p-3">
                                    <p className="text-[10px] text-emerald-100 mb-1">Total Credit</p>
                                    <p className="font-black text-lg text-white">₹{totalCredit.toFixed(0)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="bonus_pct" className="text-sm font-semibold">
                                Bonus Percentage (%)
                            </Label>
                            <Input
                                id="bonus_pct"
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                value={approveForm.data.bonus_percentage}
                                onChange={e => approveForm.setData('bonus_percentage', e.target.value)}
                                className="h-11 text-base rounded-xl"
                                placeholder="e.g. 15 for 15% bonus"
                            />
                            {approveForm.errors.bonus_percentage && <p className="text-red-500 text-xs">{approveForm.errors.bonus_percentage}</p>}
                            <p className="text-xs text-neutral-400">
                                Set 0% for no bonus. You can override the default system bonus here.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="approve_notes" className="text-sm font-semibold">Admin Notes (Optional)</Label>
                            <Input
                                id="approve_notes"
                                value={approveForm.data.admin_notes}
                                onChange={e => approveForm.setData('admin_notes', e.target.value)}
                                placeholder="e.g. Verified via bank statement"
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button type="button" onClick={() => setIsApproveOpen(false)}
                                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                <ChevronLeft className="size-4" /> Cancel
                            </button>
                            <Button type="submit" disabled={approveForm.processing}
                                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
                                {approveForm.processing ? 'Processing…' : `✓ Approve & Credit ₹${totalCredit.toFixed(2)}`}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ===== REJECT DEPOSIT DIALOG ===== */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                            <XCircle className="size-5 text-red-600" />
                            Reject Recharge Request
                        </DialogTitle>
                        <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                            Provide a clear reason for rejection. This will be visible to the reseller.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRejectDeposit} className="px-6 py-5 flex flex-col gap-5">
                        {selectedDeposit && (
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl px-4 py-3 text-sm">
                                <p className="text-xs text-neutral-400 mb-1">Rejecting deposit of</p>
                                <p className="font-black text-xl text-red-600 dark:text-red-400">₹{parseFloat(selectedDeposit.amount).toFixed(2)}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">by {selectedDeposit.user.name}</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="reject_notes" className="text-sm font-semibold">Rejection Reason <span className="text-red-500">*</span></Label>
                            <textarea
                                id="reject_notes"
                                value={rejectForm.data.admin_notes}
                                onChange={e => rejectForm.setData('admin_notes', e.target.value)}
                                required
                                rows={3}
                                placeholder="e.g. Screenshot is blurry / UTR not found in records..."
                                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2.5 text-sm shadow-xs resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 dark:bg-neutral-800/50"
                            />
                            {rejectForm.errors.admin_notes && <p className="text-red-500 text-xs">{rejectForm.errors.admin_notes}</p>}
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setIsRejectOpen(false)}
                                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                <ChevronLeft className="size-4" /> Cancel
                            </button>
                            <Button type="submit" disabled={rejectForm.processing}
                                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">
                                {rejectForm.processing ? 'Rejecting…' : 'Reject Request'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ===== ADJUST BALANCE DIALOG ===== */}
            <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                            <TrendingUp className="size-5 text-indigo-600" />
                            Adjust Reseller Balance
                        </DialogTitle>
                        <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                            Manually credit or debit <strong>{selectedReseller?.name}</strong>'s wallet.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdjustBalance} className="px-6 py-5 flex flex-col gap-5">
                        {selectedReseller && (
                            <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl px-4 py-3">
                                <div>
                                    <p className="text-xs text-neutral-400">Current Balance</p>
                                    <p className="font-black text-xl text-indigo-600 dark:text-indigo-400">₹{Number(selectedReseller.wallet_balance).toFixed(2)}</p>
                                </div>
                                <Wallet className="size-8 text-indigo-300 dark:text-indigo-700" />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-semibold">Adjustment Type</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['credit', 'debit'] as const).map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => adjustForm.setData('type', t)}
                                            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-xs font-bold transition-all ${adjustForm.data.type === t
                                                ? t === 'credit'
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                                                    : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                                                : 'border-neutral-200 dark:border-neutral-700 text-neutral-500'}`}
                                        >
                                            {t === 'credit' ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                                            {t === 'credit' ? 'Credit' : 'Debit'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-semibold">Amount (₹)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={adjustForm.data.amount}
                                    onChange={e => adjustForm.setData('amount', e.target.value)}
                                    required
                                    placeholder="0.00"
                                    className="h-11 rounded-xl"
                                />
                                {adjustForm.errors.amount && <p className="text-red-500 text-xs">{adjustForm.errors.amount}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">Reason / Notes</Label>
                            <Input
                                value={adjustForm.data.description}
                                onChange={e => adjustForm.setData('description', e.target.value)}
                                required
                                placeholder="e.g. Diwali promotional bonus"
                                className="h-11 rounded-xl"
                            />
                            {adjustForm.errors.description && <p className="text-red-500 text-xs">{adjustForm.errors.description}</p>}
                        </div>

                        <div className="flex gap-3">
                            <button type="button" onClick={() => setIsAdjustOpen(false)}
                                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                <ChevronLeft className="size-4" /> Cancel
                            </button>
                            <Button type="submit" disabled={adjustForm.processing}
                                className={`flex-1 h-11 font-bold rounded-xl text-white ${adjustForm.data.type === 'credit' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                {adjustForm.processing ? 'Applying…' : `Apply ${adjustForm.data.type === 'credit' ? 'Credit' : 'Debit'}`}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Screenshot Preview */}
            <Dialog open={screenshotPreview !== null} onOpenChange={() => setScreenshotPreview(null)}>
                <DialogContent className="max-w-2xl p-2 bg-transparent border-0 shadow-none">
                    {screenshotPreview && (
                        <img src={screenshotPreview} alt="Payment Receipt" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl bg-neutral-900" />
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
