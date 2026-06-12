import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Edit2, Trash, ToggleLeft, ToggleRight, Copy, TrendingUp, Users, DollarSign, Percent, Settings } from 'lucide-react';

interface ReferralCode {
    id: number;
    code: string;
    discount_percentage: string;
    commission_percentage: string;
    is_active: boolean;
    expires_at: string | null;
    usage_count: number;
}

interface ReferralPartner {
    id: number;
    name: string;
    email: string;
    is_approved: boolean;
    referral_discount_percentage: string | null;
    referral_commission_percentage: string | null;
    referral_max_codes: number;
    referral_codes: ReferralCode[];
    wallet_balance: number;
    total_sales: number;
    total_discount: number;
    total_commission: number;
    created_at: string;
}

export default function ReferralsIndex({ referralPartners }: { referralPartners: ReferralPartner[] }) {
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<ReferralPartner | null>(null);
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        referral_discount_percentage: '30',
        referral_commission_percentage: '50',
        referral_max_codes: '5',
    });

    const assignForm = useForm({
        discount_allocation: '30',
        target: 'all',
        user_id: '',
        max_codes: '5',
    });

    const openPermissionsModal = (partner: ReferralPartner) => {
        setSelectedPartner(partner);
        setData({
            referral_discount_percentage: partner.referral_discount_percentage || '30',
            referral_commission_percentage: partner.referral_commission_percentage || '50',
            referral_max_codes: String(partner.referral_max_codes || 5),
        });
        setIsPermissionsOpen(true);
    };

    const handleUpdatePermissions = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPartner) return;
        post(`/super-admin/referrals/${selectedPartner.id}/permissions`, {
            onSuccess: () => {
                setIsPermissionsOpen(false);
                reset();
                setSelectedPartner(null);
            },
        });
    };

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        assignForm.post('/super-admin/referrals/assign-allocation', {
            onSuccess: () => {
                setIsAssignOpen(false);
                assignForm.reset();
            },
        });
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
    };

    // Aggregates
    const totalPartners = referralPartners.length;
    const totalSales = referralPartners.reduce((s, p) => s + Number(p.total_sales), 0);
    const totalCommission = referralPartners.reduce((s, p) => s + Number(p.total_commission), 0);
    const totalDiscount = referralPartners.reduce((s, p) => s + Number(p.total_discount), 0);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Super Admin', href: '/super-admin/dashboard' },
            { title: 'Referral Partners', href: '/super-admin/referrals' },
        ]}>
            <Head title="Referral Partners" />

            <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Share2 className="size-8 text-indigo-600" /> Referral Partners
                        </h1>
                        <p className="text-neutral-500 mt-1">Configure partner permissions, discount / commission rates, and manage codes.</p>
                    </div>
                    <Button onClick={() => setIsAssignOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Percent className="size-4 mr-2" /> Assign Discount Allocation
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border rounded-2xl p-5 flex flex-col gap-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1"><Users className="size-3" /> Total Partners</div>
                        <div className="text-3xl font-black text-red-900">{totalPartners}</div>
                    </div>
                    <div className="border rounded-2xl p-5 flex flex-col gap-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1"><TrendingUp className="size-3" /> Total Sales</div>
                        <div className="text-3xl font-black text-green-600">₹{totalSales.toFixed(2)}</div>
                    </div>
                    <div className="border rounded-2xl p-5 flex flex-col gap-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1"><Percent className="size-3" /> Discounts Given</div>
                        <div className="text-3xl font-black text-amber-600">₹{totalDiscount.toFixed(2)}</div>
                    </div>
                    <div className="border rounded-2xl p-5 flex flex-col gap-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1"><DollarSign className="size-3" /> Commissions Earned</div>
                        <div className="text-3xl font-black text-indigo-600">₹{totalCommission.toFixed(2)}</div>
                    </div>
                </div>

                {/* Partners List */}
                <div className="flex flex-col gap-4">
                    {referralPartners.length === 0 ? (
                        <div className="border-2 border-dashed rounded-2xl p-12 text-center text-neutral-500">
                            <Share2 className="size-12 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-bold">No Referral Partners Yet</p>
                            <p className="text-sm mt-1">Users with the "referral_partner" role will appear here.</p>
                        </div>
                    ) : (
                        referralPartners.map((partner) => (
                            <div key={partner.id} className=" border rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold">{partner.name}</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openPermissionsModal(partner)}
                                                className="h-7 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                            >
                                                <Settings className="size-3.5 mr-1" /> Config Rates
                                            </Button>
                                        </div>
                                        <p className="text-sm text-neutral-500">{partner.email}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                                            <span>Discount Allocation: <strong>{partner.referral_discount_percentage ? `${partner.referral_discount_percentage}%` : 'Not Configured'}</strong></span>
                                            <span>•</span>
                                            <span>Default Commission: <strong>{partner.referral_commission_percentage ? `${partner.referral_commission_percentage}%` : 'Not Configured'}</strong></span>
                                            <span>•</span>
                                            <span>Max Codes: <strong>{partner.referral_max_codes}</strong></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="text-center">
                                            <div className="text-xs text-neutral-500">Wallet</div>
                                            <div className="font-bold text-green-600">₹{Number(partner.wallet_balance).toFixed(2)}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-neutral-500">Sales</div>
                                            <div className="font-bold">₹{Number(partner.total_sales).toFixed(2)}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-neutral-500">Commission</div>
                                            <div className="font-bold text-indigo-600">₹{Number(partner.total_commission).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Codes Table */}
                                {partner.referral_codes.length > 0 ? (
                                    <div className="border rounded-xl overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">Code</th>
                                                    <th className="px-4 py-3 text-center">Discount %</th>
                                                    <th className="px-4 py-3 text-center">Commission %</th>
                                                    <th className="px-4 py-3 text-center">Uses</th>
                                                    <th className="px-4 py-3 text-center">Status</th>
                                                    <th className="px-4 py-3 text-center">Expires</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {partner.referral_codes.map((code) => (
                                                    <tr key={code.id} className="border-t hover:bg-neutral-50/50">
                                                        <td className="px-4 py-3 font-mono font-bold text-indigo-700 flex items-center gap-2">
                                                            {code.code}
                                                            <button onClick={() => copyCode(code.code)} className="text-neutral-400 hover:text-indigo-600" title="Copy"><Copy className="size-3.5" /></button>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">{code.discount_percentage}%</td>
                                                        <td className="px-4 py-3 text-center">{code.commission_percentage}%</td>
                                                        <td className="px-4 py-3 text-center font-bold">{code.usage_count}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${code.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {code.is_active ? 'ACTIVE' : 'INACTIVE'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-neutral-500 text-xs">
                                                            {code.expires_at ? new Date(code.expires_at).toLocaleDateString() : '∞ Never'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => router.post(`/super-admin/referrals/codes/${code.id}/toggle`)}
                                                                className="p-1.5 rounded-lg hover:bg-neutral-100"
                                                                title={code.is_active ? 'Deactivate' : 'Activate'}
                                                            >
                                                                {code.is_active ? <ToggleRight className="size-4 text-green-600" /> : <ToggleLeft className="size-4 text-neutral-400" />}
                                                            </button>
                                                            <button
                                                                onClick={() => { if (confirm('Delete this referral code?')) router.delete(`/super-admin/referrals/codes/${code.id}`); }}
                                                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                                                            >
                                                                <Trash className="size-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-400 italic">No referral codes created for this partner yet.</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

                {/* Edit Permissions Dialog */}
                <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Configure Referral Rates & Limits</DialogTitle>
                            <DialogDescription>
                                Set the rates for <strong>{selectedPartner?.name}</strong>. The Discount Allocation defines the maximum discount they can allocate to custom codes.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdatePermissions} className="flex flex-col gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Discount Allocation (%)</Label>
                                    <Input type="number" min={1} max={100} value={data.referral_discount_percentage} onChange={e => setData('referral_discount_percentage', e.target.value)} required />
                                    {errors.referral_discount_percentage && <p className="text-red-500 text-xs">{errors.referral_discount_percentage}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label>Commission Rate (%)</Label>
                                    <Input type="number" min={1} max={100} value={data.referral_commission_percentage} onChange={e => setData('referral_commission_percentage', e.target.value)} required />
                                    {errors.referral_commission_percentage && <p className="text-red-500 text-xs">{errors.referral_commission_percentage}</p>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Maximum Allowed Referral Codes</Label>
                                <Input type="number" min={1} max={50} value={data.referral_max_codes} onChange={e => setData('referral_max_codes', e.target.value)} required />
                                {errors.referral_max_codes && <p className="text-red-500 text-xs">{errors.referral_max_codes}</p>}
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsPermissionsOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Configuration</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Assign Discount Allocation Dialog */}
                <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Discount Allocation</DialogTitle>
                            <DialogDescription>
                                Assign a discount allocation that partners can use to create coupon codes.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAssign} className="flex flex-col gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Assign Target</Label>
                                <div className="flex items-center gap-4 mt-1">
                                    <label className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="assign_target" 
                                            value="all" 
                                            checked={assignForm.data.target === 'all'} 
                                            onChange={e => assignForm.setData('target', e.target.value)} 
                                        />
                                        All Partners
                                    </label>
                                    <label className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="assign_target" 
                                            value="specific" 
                                            checked={assignForm.data.target === 'specific'} 
                                            onChange={e => assignForm.setData('target', e.target.value)} 
                                        />
                                        Specific Partner
                                    </label>
                                </div>
                            </div>

                            {assignForm.data.target === 'specific' && (
                                <div className="grid gap-2 animate-in fade-in duration-200">
                                    <Label>Select Referral Partner</Label>
                                    <select 
                                        value={assignForm.data.user_id} 
                                        onChange={e => assignForm.setData('user_id', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="">-- Choose Partner --</option>
                                        {referralPartners.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                                        ))}
                                    </select>
                                    {assignForm.errors.user_id && <p className="text-red-500 text-xs">{assignForm.errors.user_id}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Discount Allocation (%)</Label>
                                    <Input 
                                        type="number" 
                                        min={0} 
                                        max={100} 
                                        value={assignForm.data.discount_allocation} 
                                        onChange={e => assignForm.setData('discount_allocation', e.target.value)} 
                                        required 
                                    />
                                    {assignForm.errors.discount_allocation && <p className="text-red-500 text-xs">{assignForm.errors.discount_allocation}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label>Maximum Allowed Codes</Label>
                                    <Input 
                                        type="number" 
                                        min={1} 
                                        max={50} 
                                        value={assignForm.data.max_codes} 
                                        onChange={e => assignForm.setData('max_codes', e.target.value)} 
                                        required 
                                    />
                                    {assignForm.errors.max_codes && <p className="text-red-500 text-xs">{assignForm.errors.max_codes}</p>}
                                </div>
                            </div>

                            <DialogFooter className="mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={assignForm.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">Assign Allocation</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </AppLayout>
    );
}
