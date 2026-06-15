import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Wallet, Banknote, Clock, CheckCircle, XCircle, Eye, Image, CreditCard, ArrowDownRight, TrendingUp } from 'lucide-react';

interface WalletData {
    id: number;
    balance: number;
    status: string;
    total_earnings: number;
    pending_withdrawals: number;
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

export default function PaymentDetailsPage({
    wallet,
    redemptions,
}: {
    wallet: WalletData;
    redemptions: RedemptionData[];
}) {
    const [isRedeemOpen, setIsRedeemOpen] = useState(false);
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

    const handleRedemption = (e: React.FormEvent) => {
        e.preventDefault();
        redeemForm.post('/referral-partner/request-redemption', {
            onSuccess: () => {
                setIsRedeemOpen(false);
                redeemForm.reset();
            },
        });
    };

    const hasPending = redemptions.some(r => r.status === 'pending');

    return (
        <AppLayout breadcrumbs={[
            { title: 'Referral Partner', href: '/referral-partner/dashboard' },
            { title: 'Payment Details', href: '/referral-partner/payment-details' }
        ]}>
            <Head title="Payment Details" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <CreditCard className="size-8 text-indigo-600" /> Payout & Payment Details
                        </h1>
                        <p className="text-neutral-500 mt-1">Request payouts and check status of approved transfers.</p>
                    </div>
                    <Button
                        onClick={() => setIsRedeemOpen(true)}
                        disabled={hasPending || Number(wallet.balance) < 100}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <Banknote className="size-4 mr-2" /> Request Payout
                    </Button>
                </div>

                {/* Summaries */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                        <div className="text-xs font-bold uppercase opacity-70 flex items-center gap-1">
                            <Wallet className="size-4" /> Available Balance
                        </div>
                        <div className="text-4xl font-black mt-4">₹{Number(wallet.balance).toFixed(2)}</div>
                        <span className="text-[10px] opacity-75 mt-2">Ready to withdraw</span>
                    </div>

                    <div className="bg-white border rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                            <Clock className="size-4 text-amber-500" /> Pending Payouts
                        </div>
                        <div className="text-4xl font-black text-amber-600 mt-2">₹{Number(wallet.pending_withdrawals).toFixed(2)}</div>
                        <span className="text-[10px] text-neutral-400">Under admin review</span>
                    </div>

                    <div className="bg-white border rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                            <CheckCircle className="size-4 text-green-500" /> Status
                        </div>
                        <div className="text-2xl font-black text-green-600 mt-2">ACTIVE</div>
                        <span className="text-[10px] text-neutral-400">Account fully active</span>
                    </div>
                </div>

                {/* Redemption Requests List */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Payout History</h2>
                    {redemptions.length === 0 ? (
                        <div className="border border-dashed rounded-2xl p-12 text-center text-neutral-500 bg-white">
                            <Banknote className="size-12 mx-auto mb-4 opacity-30 text-neutral-400" />
                            <p className="font-semibold text-lg">No Payout Requests Yet</p>
                            <p className="text-sm mt-1">Submit your first request when your balance reaches ₹100.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {redemptions.map(r => (
                                <div key={r.id} className="border rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow transition-shadow">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            {r.status === 'pending' && <Clock className="size-5 text-amber-500" />}
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

                                    {/* Submitted payout details */}
                                    <div className="rounded-xl p-3 text-xs flex flex-col gap-1.5 border">
                                        <p className=" font-bold uppercase text-[9px] tracking-wider">Submitted payout info:</p>
                                        {r.upi_id && <p>• <strong>UPI ID:</strong> {r.upi_id}</p>}
                                        {r.bank_name && (
                                            <p>• <strong>Bank account:</strong> {r.bank_name} | Account: {r.account_number} | IFSC: {r.ifsc_code} | Name: {r.account_holder_name}</p>
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
                                                <p className="text-xs">
                                                    <strong>Admin Note:</strong> {r.admin_notes}
                                                </p>
                                            )}
                                            {r.payment_proof_path && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs"><strong>Payment Receipt:</strong></span>
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
                    )}
                </div>

                {/* Request Payout Dialog */}
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
