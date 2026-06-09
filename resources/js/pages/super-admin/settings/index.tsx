import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, Trash2, CheckCircle2, ShieldAlert, Wallet, Building } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin Dashboard',
        href: '/super-admin/dashboard',
    },
    {
        title: 'Payment Settings',
        href: '/super-admin/settings',
    },
];

interface SettingsData {
    razorpay_key_id: string;
    has_razorpay_key_secret: boolean;
    reseller_bank_name: string;
    reseller_account_holder: string;
    reseller_account_number: string;
    reseller_ifsc_code: string;
    reseller_upi_id: string;
    reseller_default_bonus_percentage: string;
}

interface PageProps {
    settings: SettingsData;
}

export default function SettingsIndex({ settings }: PageProps) {
    const [showSecret, setShowSecret] = useState(false);

    const { data, setData, post, delete: destroy, processing, reset, wasSuccessful } = useForm({
        razorpay_key_id: settings.razorpay_key_id || '',
        razorpay_key_secret: '',
        reseller_bank_name: settings.reseller_bank_name || '',
        reseller_account_holder: settings.reseller_account_holder || '',
        reseller_account_number: settings.reseller_account_number || '',
        reseller_ifsc_code: settings.reseller_ifsc_code || '',
        reseller_upi_id: settings.reseller_upi_id || '',
        reseller_default_bonus_percentage: settings.reseller_default_bonus_percentage || '0',
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/settings', {
            onSuccess: () => {
                reset('razorpay_key_secret');
            }
        });
    };

    const handleDeleteKey = (keyName: 'razorpay_key_id' | 'razorpay_key_secret') => {
        if (confirm(`Are you sure you want to delete this key setting: ${keyName.replace(/_/g, ' ')}?`)) {
            destroy(`/super-admin/settings/${keyName}`, {
                onSuccess: () => {
                    if (keyName === 'razorpay_key_id') {
                        setData('razorpay_key_id', '');
                    }
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System settings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-4xl">
                
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        System Configuration Settings
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Configure payment gateways, manual reseller bank details, and default wallet bonus percentages.
                    </p>
                </div>

                <form onSubmit={handleSave} className="flex flex-col gap-8">
                    {/* Settings Card: Razorpay */}
                    <div className="w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                            <div className="bg-blue-50 p-2.5 text-blue-600 rounded-xl dark:bg-blue-950/40 dark:text-blue-400">
                                <Key className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Razorpay API Credentials</h3>
                                <p className="text-xs text-neutral-400">Used for customer checkouts and reseller online recharges</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            {/* Razorpay Key ID */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="razorpay_key_id">Razorpay Key ID</Label>
                                    {settings.razorpay_key_id && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteKey('razorpay_key_id')}
                                            className="text-[10px] text-red-500 hover:underline flex items-center gap-1 font-semibold"
                                        >
                                            <Trash2 className="size-3" /> Delete Key
                                        </button>
                                    )}
                                </div>
                                <Input
                                    id="razorpay_key_id"
                                    value={data.razorpay_key_id}
                                    onChange={(e) => setData('razorpay_key_id', e.target.value)}
                                    placeholder="E.g., rzp_test_R7xzyaqsmw9C9O"
                                    className="font-mono bg-neutral-50/50"
                                />
                            </div>

                            {/* Razorpay Key Secret */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Label htmlFor="razorpay_key_secret">Razorpay Key Secret</Label>
                                        {settings.has_razorpay_key_secret ? (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold dark:bg-emerald-950/35 dark:text-emerald-400">
                                                <CheckCircle2 className="size-3" /> Configured
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-bold dark:bg-amber-950/35 dark:text-amber-400">
                                                <ShieldAlert className="size-3" /> Not Configured
                                            </span>
                                        )}
                                    </div>

                                    {settings.has_razorpay_key_secret && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteKey('razorpay_key_secret')}
                                            className="text-[10px] text-red-500 hover:underline flex items-center gap-1 font-semibold"
                                        >
                                            <Trash2 className="size-3" /> Delete Secret
                                        </button>
                                    )}
                                </div>
                                
                                <div className="relative">
                                    <Input
                                        id="razorpay_key_secret"
                                        type={showSecret ? 'text' : 'password'}
                                        value={data.razorpay_key_secret}
                                        onChange={(e) => setData('razorpay_key_secret', e.target.value)}
                                        placeholder={settings.has_razorpay_key_secret ? "••••••••••••••••••••••••" : "Paste your Razorpay Key Secret here"}
                                        className="font-mono bg-neutral-50/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                    >
                                        {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Card: Reseller Manual Bank & Bonus Configuration */}
                    <div className="w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                            <div className="bg-emerald-50 p-2.5 text-emerald-600 rounded-xl dark:bg-emerald-950/40 dark:text-emerald-400">
                                <Wallet className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Reseller Wallet & Bank Details</h3>
                                <p className="text-xs text-neutral-400">Bank instructions for reseller manual deposits and wallet bonus %</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_bank_name">Bank Name</Label>
                                <Input
                                    id="reseller_bank_name"
                                    value={data.reseller_bank_name}
                                    onChange={(e) => setData('reseller_bank_name', e.target.value)}
                                    placeholder="e.g. State Bank of India"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_account_holder">Account Holder Name</Label>
                                <Input
                                    id="reseller_account_holder"
                                    value={data.reseller_account_holder}
                                    onChange={(e) => setData('reseller_account_holder', e.target.value)}
                                    placeholder="e.g. Invitify Private Limited"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_account_number">Account Number</Label>
                                <Input
                                    id="reseller_account_number"
                                    value={data.reseller_account_number}
                                    onChange={(e) => setData('reseller_account_number', e.target.value)}
                                    placeholder="e.g. 3829029302830"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_ifsc_code">IFSC Code</Label>
                                <Input
                                    id="reseller_ifsc_code"
                                    value={data.reseller_ifsc_code}
                                    onChange={(e) => setData('reseller_ifsc_code', e.target.value)}
                                    placeholder="e.g. SBIN0004820"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_upi_id">UPI ID (Optional)</Label>
                                <Input
                                    id="reseller_upi_id"
                                    value={data.reseller_upi_id}
                                    onChange={(e) => setData('reseller_upi_id', e.target.value)}
                                    placeholder="e.g. pay@invitify"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_default_bonus_percentage">Default Recharge Bonus (%)</Label>
                                <Input
                                    id="reseller_default_bonus_percentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.reseller_default_bonus_percentage}
                                    onChange={(e) => setData('reseller_default_bonus_percentage', e.target.value)}
                                    placeholder="e.g. 10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status notification success alert */}
                    {wasSuccessful && (
                        <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
                            ✓ System configuration settings updated successfully.
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1"
                        >
                            Save configuration
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
