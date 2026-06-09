import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Banknote, CheckCircle, XCircle, Clock, ArrowDownRight, ArrowUpRight, ShieldAlert, Settings, Eye } from 'lucide-react';

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
}

export default function ResellersIndex({ deposits = [], resellers = [] }: ResellersIndexProps) {
    const [selectedReseller, setSelectedReseller] = useState<ResellerData | null>(null);
    const [isAdjustOpen, setIsAdjustOpen] = useState(false);

    const [selectedDeposit, setSelectedDeposit] = useState<ManualDeposit | null>(null);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const adjustForm = useForm({
        user_id: '',
        type: 'credit',
        amount: '',
        description: '',
    });

    const approveForm = useForm({
        bonus_percentage: '0',
        admin_notes: '',
    });

    const rejectForm = useForm({
        admin_notes: '',
    });

    const openAdjustModal = (reseller: ResellerData) => {
        setSelectedReseller(reseller);
        adjustForm.setData({
            user_id: String(reseller.id),
            type: 'credit',
            amount: '',
            description: '',
        });
        setIsAdjustOpen(true);
    };

    const handleAdjustBalance = (e: React.FormEvent) => {
        e.preventDefault();
        adjustForm.post('/super-admin/resellers/adjust-balance', {
            onSuccess: () => {
                setIsAdjustOpen(false);
                adjustForm.reset();
                setSelectedReseller(null);
            },
        });
    };

    const openApproveModal = (deposit: ManualDeposit) => {
        setSelectedDeposit(deposit);
        approveForm.setData({
            bonus_percentage: String(parseFloat(deposit.bonus_percentage)),
            admin_notes: '',
        });
        setIsApproveOpen(true);
    };

    const handleApproveDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDeposit) return;
        approveForm.post(`/super-admin/resellers/deposits/${selectedDeposit.id}/approve`, {
            onSuccess: () => {
                setIsApproveOpen(false);
                approveForm.reset();
                setSelectedDeposit(null);
            },
        });
    };

    const openRejectModal = (deposit: ManualDeposit) => {
        setSelectedDeposit(deposit);
        rejectForm.setData({
            admin_notes: '',
        });
        setIsRejectOpen(true);
    };

    const handleRejectDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDeposit) return;
        rejectForm.post(`/super-admin/resellers/deposits/${selectedDeposit.id}/reject`, {
            onSuccess: () => {
                setIsRejectOpen(false);
                rejectForm.reset();
                setSelectedDeposit(null);
            },
        });
    };

    const pendingRequests = deposits.filter(d => d.status === 'pending');
    const processedRequests = deposits.filter(d => d.status !== 'pending');

    return (
        <AppLayout breadcrumbs={[
            { title: 'Super Admin', href: '/super-admin/dashboard' },
            { title: 'Manage Resellers', href: '/super-admin/resellers' },
        ]}>
            <Head title="Manage Resellers" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Users className="size-8 text-indigo-600" /> Resellers Management
                    </h1>
                    <p className="text-neutral-500 mt-1">Approve wallet recharge requests, adjust balances, and oversee transactions.</p>
                </div>

                {/* Pending Manual Recharge Requests */}
                {pendingRequests.length > 0 && (
                    <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 flex flex-col gap-4">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-amber-800">
                            <Clock className="size-5" /> Pending Manual Recharges ({pendingRequests.length})
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="bg-white border rounded-xl p-4 flex flex-col justify-between gap-3 shadow-xs">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-neutral-800">{req.user.name}</p>
                                                <p className="text-xs text-neutral-400">{req.user.email}</p>
                                            </div>
                                            <span className="text-lg font-black text-amber-600">₹{parseFloat(req.amount).toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-2">UTR: <span className="font-mono">{req.utr}</span></p>
                                        <p className="text-[10px] text-neutral-400 mt-1">Requested {new Date(req.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-3 gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-indigo-600 hover:bg-indigo-50"
                                            onClick={() => setScreenshotPreview(req.screenshot_path)}
                                        >
                                            <Eye className="size-3.5 mr-1" /> View Slip
                                        </Button>
                                        <div className="flex gap-1.5">
                                            <Button
                                                onClick={() => openApproveModal(req)}
                                                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                                size="sm"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() => openRejectModal(req)}
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                                                size="sm"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resellers list */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Reseller Wallets</h2>
                    {resellers.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic">No registered resellers found.</p>
                    ) : (
                        <div className="border rounded-xl overflow-hidden ">
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Reseller</th>
                                        <th className="px-4 py-3 text-center">Wallet Balance</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resellers.map(reseller => (
                                        <tr key={reseller.id} className="border-t hover:bg-neutral-50/50">
                                            <td className="px-4 py-3">
                                                <p className="font-bold">{reseller.name}</p>
                                                <p className="text-xs text-neutral-450">{reseller.email}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-base text-indigo-600">₹{Number(reseller.wallet_balance).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${reseller.wallet_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {reseller.wallet_status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    onClick={() => openAdjustModal(reseller)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                >
                                                    Adjust Balance
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Processed manual deposit requests */}
                {processedRequests.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Processed Deposits Log</h2>
                        <div className="border rounded-xl overflow-hidden ">
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Reseller</th>
                                        <th className="px-4 py-3 text-center">Amount</th>
                                        <th className="px-4 py-3 text-center">UTR</th>
                                        <th className="px-4 py-3 text-center">Bonus Info</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-right">Processed At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedRequests.map(req => (
                                        <tr key={req.id} className="border-t">
                                            <td className="px-4 py-3">{req.user?.name}</td>
                                            <td className="px-4 py-3 text-center font-bold">₹{parseFloat(req.amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center font-mono text-xs">{req.utr}</td>
                                            <td className="px-4 py-3 text-center text-xs">
                                                {req.status === 'approved' && parseFloat(req.bonus_amount) > 0 ? (
                                                    <span className="text-green-600 font-semibold">₹{parseFloat(req.bonus_amount).toFixed(2)} ({req.bonus_percentage}%)</span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {req.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-neutral-500">
                                                {req.processed_at ? new Date(req.processed_at).toLocaleString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Adjust Balance Dialog */}
                <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adjust Reseller Balance</DialogTitle>
                            <DialogDescription>Manually adjust balance for <strong>{selectedReseller?.name}</strong>.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAdjustBalance} className="flex flex-col gap-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <Label>Adjustment Type</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-xs"
                                        value={adjustForm.data.type}
                                        onChange={e => adjustForm.setData('type', e.target.value)}
                                        required
                                    >
                                        <option value="credit">Credit (Add Funds)</option>
                                        <option value="debit">Debit (Deduct Funds)</option>
                                    </select>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={adjustForm.data.amount}
                                        onChange={e => adjustForm.setData('amount', e.target.value)}
                                        required
                                        placeholder="0.00"
                                    />
                                    {adjustForm.errors.amount && <p className="text-red-555 text-xs">{adjustForm.errors.amount}</p>}
                                </div>
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Reason / Reference Notes</Label>
                                <Input
                                    value={adjustForm.data.description}
                                    onChange={e => adjustForm.setData('description', e.target.value)}
                                    required
                                    placeholder="e.g. Special promotional credit"
                                />
                                {adjustForm.errors.description && <p className="text-red-555 text-xs">{adjustForm.errors.description}</p>}
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsAdjustOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={adjustForm.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Apply Adjustment
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Approve Deposit Dialog */}
                <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Approve Recharge Request</DialogTitle>
                            <DialogDescription>Configure bonus settings before finalizing the deposit.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleApproveDeposit} className="flex flex-col gap-4 py-2">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center text-emerald-900">
                                <div>
                                    <p className="text-xs opacity-75">Deposit Amount</p>
                                    <p className="text-2xl font-black">₹{selectedDeposit ? parseFloat(selectedDeposit.amount).toFixed(2) : '0.00'}</p>
                                </div>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="bonus_percentage">Bonus Percentage (%)</Label>
                                <Input
                                    id="bonus_percentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={approveForm.data.bonus_percentage}
                                    onChange={e => approveForm.setData('bonus_percentage', e.target.value)}
                                    required
                                />
                                {approveForm.errors.bonus_percentage && <p className="text-red-555 text-xs">{approveForm.errors.bonus_percentage}</p>}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="approve_notes">Notes (Optional)</Label>
                                <Input
                                    id="approve_notes"
                                    value={approveForm.data.admin_notes}
                                    onChange={e => approveForm.setData('admin_notes', e.target.value)}
                                    placeholder="Approved manually via bank slip confirmation"
                                />
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={approveForm.processing} className="bg-green-600 hover:bg-green-700 text-white">
                                    Approve & Credit
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Reject Deposit Dialog */}
                <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Recharge Request</DialogTitle>
                            <DialogDescription>Provide a reason for rejecting the deposit request.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRejectDeposit} className="flex flex-col gap-4 py-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="reject_notes">Rejection Note / Reason</Label>
                                <textarea
                                    id="reject_notes"
                                    value={rejectForm.data.admin_notes}
                                    onChange={e => rejectForm.setData('admin_notes', e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="e.g. Transaction slip image is blurry or UTR does not exist in bank statement."
                                    className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1.5 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {rejectForm.errors.admin_notes && <p className="text-red-500 text-xs">{rejectForm.errors.admin_notes}</p>}
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={rejectForm.processing} className="bg-red-650 hover:bg-red-700 text-white">
                                    Reject Request
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

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
