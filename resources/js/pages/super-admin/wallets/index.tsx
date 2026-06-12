import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Wallet, CheckCircle, XCircle, Clock, DollarSign, ArrowDownRight, ArrowUpRight, Eye, FileText, Image } from 'lucide-react';

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
    upi_id: string | null;
    bank_name: string | null;
    account_holder_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    qr_code_path: string | null;
    payment_proof_path: string | null;
    created_at: string;
    user: { name: string; email: string };
}

export default function WalletsIndex({ wallets, redemptionRequests }: { wallets: WalletData[]; redemptionRequests: RedemptionRequest[] }) {
    const [selectedRequest, setSelectedRequest] = useState<RedemptionRequest | null>(null);
    const [rejectRequest, setRejectRequest] = useState<RedemptionRequest | null>(null);
    const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
    const [selectedQR, setSelectedQR] = useState<string | null>(null);

    const approveForm = useForm({
        payment_proof: null as File | null,
        admin_notes: '',
        status: 'paid',
    });

    const rejectForm = useForm({
        admin_notes: '',
    });

    const pendingRequests = redemptionRequests.filter(r => r.status === 'pending');
    const processedRequests = redemptionRequests.filter(r => r.status !== 'pending');

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        approveForm.post(`/super-admin/wallets/redemptions/${selectedRequest.id}/approve`, {
            onSuccess: () => {
                setSelectedRequest(null);
                approveForm.reset();
            },
        });
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectRequest) return;

        rejectForm.post(`/super-admin/wallets/redemptions/${rejectRequest.id}/reject`, {
            onSuccess: () => {
                setRejectRequest(null);
                rejectForm.reset();
            },
        });
    };

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
                    <p className="text-neutral-500 mt-1">Oversee referral partner wallets, review payout details, and upload receipts.</p>
                </div>

                {/* Pending Redemption Requests */}
                {pendingRequests.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 flex flex-col gap-4">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-amber-800">
                            <Clock className="size-5 animate-pulse" /> Pending Redemption Requests ({pendingRequests.length})
                        </h2>
                        <div className="flex flex-col gap-3">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-neutral-800">{req.user.name} <span className="text-neutral-400 font-normal text-sm">({req.user.email})</span></p>
                                        <p className="text-sm text-neutral-600 mt-0.5">Requesting <span className="font-bold text-emerald-700">₹{parseFloat(req.amount).toFixed(2)}</span> withdrawal</p>
                                        <p className="text-xs text-neutral-400 mt-1">{new Date(req.created_at).toLocaleString()}</p>
                                        
                                        {/* Quick Payment details preview */}
                                        <div className="mt-2 text-xs text-neutral-500 flex flex-wrap gap-x-4 gap-y-1">
                                            {req.upi_id && <span><strong>UPI:</strong> {req.upi_id}</span>}
                                            {req.bank_name && <span><strong>Bank Account:</strong> {req.bank_name} - {req.account_number}</span>}
                                            {req.qr_code_path && <span className="text-indigo-600 font-semibold flex items-center gap-0.5"><Image className="size-3" /> QR Code attached</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => {
                                                setSelectedRequest(req);
                                                approveForm.setData({
                                                    payment_proof: null,
                                                    admin_notes: '',
                                                    status: 'paid',
                                                });
                                            }}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            size="sm"
                                        >
                                            <CheckCircle className="size-4 mr-1" /> Approve & Payout
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setRejectRequest(req);
                                                rejectForm.setData({ admin_notes: '' });
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
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
                        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
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
                                            <td className="px-4 py-3 text-center text-green-600">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    <ArrowDownRight className="size-3.5" /> ₹{Number(w.total_credited).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-red-500">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    <ArrowUpRight className="size-3.5" /> ₹{Number(w.total_debited).toFixed(2)}
                                                </div>
                                            </td>
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
                        <h2 className="text-lg font-bold mb-4">Processed Requests & History</h2>
                        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Partner</th>
                                        <th className="px-4 py-3 text-center">Amount</th>
                                        <th className="px-4 py-3 text-left">Payout Method details</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-center">Receipt Proof</th>
                                        <th className="px-4 py-3 text-right">Processed Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedRequests.map(req => (
                                        <tr key={req.id} className="border-t hover:bg-neutral-50/50">
                                            <td className="px-4 py-3">
                                                <p className="font-bold">{req.user.name}</p>
                                                <p className="text-xs text-neutral-400">{req.user.email}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-neutral-800">₹{parseFloat(req.amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-left text-xs max-w-xs">
                                                {req.upi_id && <p><strong>UPI:</strong> {req.upi_id}</p>}
                                                {req.bank_name && (
                                                    <p className="text-neutral-500"><strong>Bank:</strong> {req.bank_name} | {req.account_number} | {req.ifsc_code}</p>
                                                )}
                                                {req.admin_notes && <p className="text-amber-700 italic mt-0.5">Note: {req.admin_notes}</p>}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    req.status === 'approved' || req.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {req.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {req.payment_proof_path ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedReceipt(req.payment_proof_path)}
                                                        className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                                    >
                                                        <Eye className="size-4 mr-1" /> View Proof
                                                    </Button>
                                                ) : (
                                                    <span className="text-neutral-400 text-xs italic">None</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-neutral-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Approve Request Modal */}
                <Dialog open={selectedRequest !== null} onOpenChange={() => setSelectedRequest(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Approve Payout Withdrawal</DialogTitle>
                            <DialogDescription>Review payout details, transfer manually, and upload receipt.</DialogDescription>
                        </DialogHeader>
                        {selectedRequest && (
                            <form onSubmit={handleApprove} className="flex flex-col gap-4 py-2">
                                <div className="bg-neutral-50 border rounded-xl p-4 flex flex-col gap-2 text-sm">
                                    <p><strong>Partner:</strong> {selectedRequest.user.name} ({selectedRequest.user.email})</p>
                                    <p><strong>Amount:</strong> <span className="font-bold text-emerald-700">₹{parseFloat(selectedRequest.amount).toFixed(2)}</span></p>
                                    
                                    {/* Partner Payment Details */}
                                    <div className="mt-2 border-t pt-3 flex flex-col gap-2 bg-white p-3 rounded-lg border">
                                        <p className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Payout Details Provided:</p>
                                        
                                        {selectedRequest.upi_id && (
                                            <div>
                                                <p className="text-xs text-neutral-500">UPI ID:</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <code className="font-mono text-sm bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800">{selectedRequest.upi_id}</code>
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => navigator.clipboard.writeText(selectedRequest.upi_id || '')} 
                                                        className="h-6 px-1.5 text-[10px]"
                                                    >
                                                        Copy
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {selectedRequest.bank_name && (
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <p className="text-neutral-400">Account Holder:</p>
                                                    <p className="font-semibold">{selectedRequest.account_holder_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-400">Bank Name:</p>
                                                    <p className="font-semibold">{selectedRequest.bank_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-400">Account Number:</p>
                                                    <p className="font-semibold font-mono">{selectedRequest.account_number}</p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-400">IFSC Code:</p>
                                                    <p className="font-semibold font-mono">{selectedRequest.ifsc_code}</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedRequest.qr_code_path && (
                                            <div className="flex items-center justify-between border-t pt-2 mt-1">
                                                <span className="text-xs text-neutral-600">Attached QR Code:</span>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => setSelectedQR(selectedRequest.qr_code_path)}
                                                    className="h-7 px-2 text-[10px]"
                                                >
                                                    <Eye className="size-3.5 mr-1" /> View QR Code
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-2 mt-2">
                                    <Label>Upload Payment Receipt / Proof *</Label>
                                    <Input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => approveForm.setData('payment_proof', e.target.files?.[0] || null)} 
                                        required 
                                    />
                                    <p className="text-[10px] text-neutral-400">Please transfer payment manually first, then upload proof.</p>
                                    {approveForm.errors.payment_proof && <p className="text-red-500 text-xs">{approveForm.errors.payment_proof}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Admin Notes / Reference ID</Label>
                                    <Input 
                                        placeholder="e.g. Transferred via GPay, Ref ID 12345..." 
                                        value={approveForm.data.admin_notes} 
                                        onChange={e => approveForm.setData('admin_notes', e.target.value)} 
                                    />
                                    {approveForm.errors.admin_notes && <p className="text-red-500 text-xs">{approveForm.errors.admin_notes}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Completion Status</Label>
                                    <div className="flex items-center gap-4 mt-1">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="approve_status" 
                                                value="paid" 
                                                checked={approveForm.data.status === 'paid'} 
                                                onChange={e => approveForm.setData('status', e.target.value)} 
                                            />
                                            PAID (Recommended)
                                        </label>
                                        <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="approve_status" 
                                                value="approved" 
                                                checked={approveForm.data.status === 'approved'} 
                                                onChange={e => approveForm.setData('status', e.target.value)} 
                                            />
                                            APPROVED
                                        </label>
                                    </div>
                                </div>

                                <DialogFooter className="mt-4">
                                    <Button type="button" variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                                    <Button type="submit" disabled={approveForm.processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Deduct Wallet</Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Reject Request Modal */}
                <Dialog open={rejectRequest !== null} onOpenChange={() => setRejectRequest(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Reject Withdrawal Request</DialogTitle>
                            <DialogDescription>Specify why you are rejecting this payout request.</DialogDescription>
                        </DialogHeader>
                        {rejectRequest && (
                            <form onSubmit={handleReject} className="flex flex-col gap-4 py-2">
                                <p className="text-sm">Rejecting payout request of <span className="font-bold text-red-600">₹{parseFloat(rejectRequest.amount).toFixed(2)}</span> for {rejectRequest.user.name}.</p>
                                <div className="grid gap-2">
                                    <Label>Reason for Rejection *</Label>
                                    <Input 
                                        placeholder="e.g. Invalid bank details / name mismatch..." 
                                        value={rejectForm.data.admin_notes} 
                                        onChange={e => rejectForm.setData('admin_notes', e.target.value)} 
                                        required 
                                    />
                                    {rejectForm.errors.admin_notes && <p className="text-red-500 text-xs">{rejectForm.errors.admin_notes}</p>}
                                </div>
                                <DialogFooter className="mt-4">
                                    <Button type="button" variant="outline" onClick={() => setRejectRequest(null)}>Cancel</Button>
                                    <Button type="submit" disabled={rejectForm.processing} variant="destructive">Reject Request</Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* QR Code Zoom Modal */}
                <Dialog open={selectedQR !== null} onOpenChange={() => setSelectedQR(null)}>
                    <DialogContent className="max-w-xs text-center flex flex-col items-center">
                        <DialogHeader>
                            <DialogTitle>Partner QR Code</DialogTitle>
                        </DialogHeader>
                        {selectedQR && (
                            <img 
                                src={selectedQR} 
                                alt="Partner QR Code" 
                                className="max-w-full max-h-[350px] object-contain border rounded-xl p-2 bg-white mt-4" 
                            />
                        )}
                        <Button onClick={() => setSelectedQR(null)} className="mt-4 w-full">Close</Button>
                    </DialogContent>
                </Dialog>

                {/* Receipt Zoom Modal */}
                <Dialog open={selectedReceipt !== null} onOpenChange={() => setSelectedReceipt(null)}>
                    <DialogContent className="max-w-md text-center flex flex-col items-center">
                        <DialogHeader>
                            <DialogTitle>Receipt / Proof of Payment</DialogTitle>
                        </DialogHeader>
                        {selectedReceipt && (
                            <img 
                                src={selectedReceipt} 
                                alt="Payment Proof" 
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
