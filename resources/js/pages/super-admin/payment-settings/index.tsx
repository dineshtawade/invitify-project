import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, CreditCard, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin Dashboard',
        href: '/super-admin/dashboard',
    },
    {
        title: 'Payment Settings',
        href: '/super-admin/payment-settings',
    },
];

interface PaymentSettingsProps {
    settings: {
        razorpay_key_id: string;
        has_razorpay_key_secret: boolean;
        reseller_bank_name: string;
        reseller_account_holder: string;
        reseller_account_number: string;
        reseller_ifsc_code: string;
        reseller_upi_id: string;
        reseller_qr_code: string;
        reseller_default_bonus_percentage: string;
    };
}

export default function PaymentSettings({ settings }: PaymentSettingsProps) {
    const [qrPreview, setQrPreview] = useState<string | null>(null);
    const {
        data: configData,
        setData: setConfigData,
        post: postConfig,
        processing: configProcessing,
        recentlySuccessful: configSuccess,
    } = useForm({
        razorpay_key_id: settings.razorpay_key_id || '',
        razorpay_key_secret: '',
        reseller_bank_name: settings.reseller_bank_name || '',
        reseller_account_holder: settings.reseller_account_holder || '',
        reseller_account_number: settings.reseller_account_number || '',
        reseller_ifsc_code: settings.reseller_ifsc_code || '',
        reseller_upi_id: settings.reseller_upi_id || '',
        reseller_qr_code_file: null as File | null,
        reseller_default_bonus_percentage: settings.reseller_default_bonus_percentage || '0',
    });

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        postConfig('/super-admin/payment-settings', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Settings" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 xl:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Payment Settings
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Manage Razorpay credentials and Reseller Wallet bank details.
                    </p>
                </div>

                <form onSubmit={handleSaveConfig} className="flex flex-col gap-6">

                    {/* Razorpay Credentials */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                            <div className="bg-blue-50 p-2.5 text-blue-600 rounded-xl dark:bg-blue-950/40 dark:text-blue-400">
                                <CreditCard className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Razorpay Credentials</h3>
                                <p className="text-xs text-neutral-400">API keys for payment gateway integration</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="razorpay_key_id">Razorpay Key ID</Label>
                                <Input
                                    id="razorpay_key_id"
                                    value={configData.razorpay_key_id}
                                    onChange={(e) => setConfigData('razorpay_key_id', e.target.value)}
                                    placeholder="rzp_live_..."
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="razorpay_key_secret">
                                    Razorpay Key Secret
                                    {settings.has_razorpay_key_secret && <span className="ml-2 text-xs text-emerald-600">(Stored securely)</span>}
                                </Label>
                                <Input
                                    id="razorpay_key_secret"
                                    type="password"
                                    value={configData.razorpay_key_secret}
                                    onChange={(e) => setConfigData('razorpay_key_secret', e.target.value)}
                                    placeholder={settings.has_razorpay_key_secret ? 'Leave empty to keep existing secret' : 'Enter secret key'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reseller Wallet & Bank Details */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                            <div className="bg-emerald-50 p-2.5 text-emerald-600 rounded-xl dark:bg-emerald-950/40 dark:text-emerald-400">
                                <Wallet className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Reseller Wallet & Bank Details</h3>
                                <p className="text-xs text-neutral-400">Manual payment details and wallet bonus configuration</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_bank_name">Bank Name</Label>
                                <Input
                                    id="reseller_bank_name"
                                    value={configData.reseller_bank_name}
                                    onChange={(e) => setConfigData('reseller_bank_name', e.target.value)}
                                    placeholder="e.g. HDFC Bank"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_account_holder">Account Holder Name</Label>
                                <Input
                                    id="reseller_account_holder"
                                    value={configData.reseller_account_holder}
                                    onChange={(e) => setConfigData('reseller_account_holder', e.target.value)}
                                    placeholder="e.g. Invitify Digital Labs"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_account_number">Account Number</Label>
                                <Input
                                    id="reseller_account_number"
                                    value={configData.reseller_account_number}
                                    onChange={(e) => setConfigData('reseller_account_number', e.target.value)}
                                    placeholder="e.g. 50100239402930"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_ifsc_code">IFSC Code</Label>
                                <Input
                                    id="reseller_ifsc_code"
                                    value={configData.reseller_ifsc_code}
                                    onChange={(e) => setConfigData('reseller_ifsc_code', e.target.value)}
                                    placeholder="e.g. HDFC0001203"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_upi_id">UPI ID (Optional)</Label>
                                <Input
                                    id="reseller_upi_id"
                                    value={configData.reseller_upi_id}
                                    onChange={(e) => setConfigData('reseller_upi_id', e.target.value)}
                                    placeholder="e.g. business@upi"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reseller_default_bonus_percentage">Default Recharge Bonus (%)</Label>
                                <Input
                                    id="reseller_default_bonus_percentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={configData.reseller_default_bonus_percentage}
                                    onChange={(e) => setConfigData('reseller_default_bonus_percentage', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-3 col-span-1 md:col-span-2">
                                <Label htmlFor="reseller_qr_code_file" className="font-semibold text-sm">
                                    Bank Payment QR Code
                                </Label>
                                
                                <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30">
                                    {/* Existing Saved QR Code */}
                                    {settings.reseller_qr_code && !qrPreview && (
                                        <div className="flex flex-col items-center gap-1.5 shrink-0 bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
                                            <img
                                                src={settings.reseller_qr_code}
                                                alt="Active Bank QR"
                                                className="w-24 h-24 object-contain rounded-lg"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/placeholder-qr.png';
                                                }}
                                            />
                                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                                                Active QR Code
                                            </span>
                                        </div>
                                    )}

                                    {/* New Selected Preview */}
                                    {qrPreview && (
                                        <div className="flex flex-col items-center gap-1.5 shrink-0 bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl border-2 border-indigo-500 shadow-xs animate-in fade-in">
                                            <img
                                                src={qrPreview}
                                                alt="New Selected QR Preview"
                                                className="w-24 h-24 object-contain rounded-lg"
                                            />
                                            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                                                New QR Selected
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex-1 flex flex-col gap-2 w-full">
                                        <Input
                                            id="reseller_qr_code_file"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setConfigData('reseller_qr_code_file', file);
                                                if (file) {
                                                    setQrPreview(URL.createObjectURL(file));
                                                } else {
                                                    setQrPreview(null);
                                                }
                                            }}
                                            className="h-11 cursor-pointer bg-white dark:bg-neutral-900"
                                        />
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            Upload a clear QR code image (UPI, GPay, PhonePe, or Bank QR in PNG/JPG, Max 2MB). Resellers will scan this exact QR code to transfer wallet funds.
                                        </p>
                                        {qrPreview && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                                Click "Save settings" below to persist the new QR code image.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {configSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400 animate-fade-in">
                            ✓ Payment settings updated successfully.
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={configProcessing} className="font-semibold shadow-md">
                            <Save className="size-4 mr-2" /> Save settings
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
