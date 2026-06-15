import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';
import { Store, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit(),
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Handle reseller cast details safely
    const resellerDetails = user.reseller_details as {
        business_name?: string;
        mobile_number?: string;
        email?: string;
        gst_number?: string;
        business_address?: string;
    } | null;

    // Handle referral partner cast details safely
    const referralDetails = user.referral_details as {
        city?: string;
        email?: string;
        phone_number?: string;
        social_media?: Array<{ platform: string; username: string; followers: number }>;
    } | null;

    const initialSocials = referralDetails?.social_media || [];
    const [socialAccounts, setSocialAccounts] = useState<Array<{ id: number; platform: string; username: string; followers: string }>>(
        initialSocials.length > 0
            ? initialSocials.map((s, i) => ({ id: i, platform: s.platform, username: s.username, followers: String(s.followers) }))
            : [{ id: Date.now(), platform: 'Instagram', username: '', followers: '' }]
    );

    const handleSocialChange = (id: number, field: 'platform' | 'username' | 'followers', value: string) => {
        setSocialAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={user.name as string}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={user.email as string}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {/* Custom Profile Settings Fields for Reseller */}
                                {user.role === 'reseller' && resellerDetails && (
                                    <div className="grid gap-4 p-4 rounded-2xl border border-neutral-255 dark:border-neutral-800 bg-neutral-50/20 dark:bg-neutral-900/10">
                                        <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-850 pb-2 mb-1">
                                            <Store className="size-4 text-blue-600" />
                                            <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-300">Reseller Business Details</span>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="reseller_business_name">Business Name</Label>
                                            <Input
                                                id="reseller_business_name"
                                                type="text"
                                                required
                                                className="mt-1 block w-full"
                                                defaultValue={resellerDetails.business_name}
                                                name="reseller_details[business_name]"
                                                placeholder="Business Name"
                                            />
                                            <InputError message={errors['reseller_details.business_name']} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="reseller_mobile_number">Mobile Number</Label>
                                            <Input
                                                id="reseller_mobile_number"
                                                type="text"
                                                required
                                                className="mt-1 block w-full"
                                                defaultValue={resellerDetails.mobile_number}
                                                name="reseller_details[mobile_number]"
                                                placeholder="Mobile Number"
                                            />
                                            <InputError message={errors['reseller_details.mobile_number']} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="reseller_email">Business Email</Label>
                                            <Input
                                                id="reseller_email"
                                                type="email"
                                                required
                                                className="mt-1 block w-full"
                                                defaultValue={resellerDetails.email}
                                                name="reseller_details[email]"
                                                placeholder="Business Email"
                                            />
                                            <InputError message={errors['reseller_details.email']} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="reseller_gst_number">GST Number</Label>
                                            <Input
                                                id="reseller_gst_number"
                                                type="text"
                                                required
                                                className="mt-1 block w-full"
                                                defaultValue={resellerDetails.gst_number}
                                                name="reseller_details[gst_number]"
                                                placeholder="GST Number"
                                            />
                                            <InputError message={errors['reseller_details.gst_number']} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="reseller_business_address">Business Address (Optional)</Label>
                                            <textarea
                                                id="reseller_business_address"
                                                className="mt-1 flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-neutral-950"
                                                defaultValue={resellerDetails.business_address}
                                                name="reseller_details[business_address]"
                                                placeholder="Business Address"
                                                rows={2}
                                            />
                                            <InputError message={errors['reseller_details.business_address']} />
                                        </div>
                                    </div>
                                )}

                                {/* Custom Profile Settings Fields for Referral Partner */}
                                {user.role === 'referral_partner' && referralDetails && (
                                    <div className="grid gap-4 p-4 rounded-2xl border border-neutral-255 dark:border-neutral-800 bg-neutral-50/20 dark:bg-neutral-900/10">
                                        <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-850 pb-2 mb-1">
                                            <Users className="size-4 text-blue-600" />
                                            <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-300">Referral Partner Details</span>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="referral_city">City</Label>
                                            <Input
                                                id="referral_city"
                                                type="text"
                                                required
                                                className="mt-1 block w-full"
                                                defaultValue={referralDetails.city}
                                                name="referral_details[city]"
                                                placeholder="City"
                                            />
                                            <InputError message={errors['referral_details.city']} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="referral_email">Contact Email</Label>
                                            <Input
                                                id="referral_email"
                                                type="email"
                                                required
                                                className="mt-1 block w-full"
                                                defaultValue={referralDetails.email}
                                                name="referral_details[email]"
                                                placeholder="Contact Email"
                                            />
                                            <InputError message={errors['referral_details.email']} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="referral_phone_number">Phone Number</Label>
                                            <Input
                                                id="referral_phone_number"
                                                type="text"
                                                required
                                                className="mt-1 block w-full"
                                                defaultValue={referralDetails.phone_number}
                                                name="referral_details[phone_number]"
                                                placeholder="Phone Number"
                                            />
                                            <InputError message={errors['referral_details.phone_number']} />
                                        </div>

                                        {/* Social Media Section */}
                                        <div className="grid gap-3 mt-1">
                                            <Label className="font-extrabold text-neutral-800 dark:text-neutral-300">Social Media Accounts</Label>
                                            
                                            <div className="space-y-3">
                                                {socialAccounts.map((acc, index) => (
                                                    <div key={acc.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-white/50 dark:bg-neutral-950/20 relative animate-fade-in">
                                                        <div className="grid gap-1">
                                                            <Label className="text-[10px] uppercase font-bold text-neutral-450">Platform</Label>
                                                            <select
                                                                name={`referral_details[social_media][${index}][platform]`}
                                                                value={acc.platform}
                                                                onChange={(e) => handleSocialChange(acc.id, 'platform', e.target.value)}
                                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-neutral-950"
                                                            >
                                                                <option value="Instagram" className="dark:bg-neutral-950">Instagram</option>
                                                                <option value="Facebook" className="dark:bg-neutral-950">Facebook</option>
                                                                <option value="YouTube" className="dark:bg-neutral-950">YouTube</option>
                                                                <option value="Twitter" className="dark:bg-neutral-950">Twitter / X</option>
                                                                <option value="TikTok" className="dark:bg-neutral-950">TikTok</option>
                                                                <option value="Other" className="dark:bg-neutral-950">Other</option>
                                                            </select>
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label className="text-[10px] uppercase font-bold text-neutral-450">Username / ID</Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="@username"
                                                                name={`referral_details[social_media][${index}][username]`}
                                                                value={acc.username}
                                                                onChange={(e) => handleSocialChange(acc.id, 'username', e.target.value)}
                                                                required
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label className="text-[10px] uppercase font-bold text-neutral-450">Followers</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="1000"
                                                                name={`referral_details[social_media][${index}][followers]`}
                                                                value={acc.followers}
                                                                onChange={(e) => handleSocialChange(acc.id, 'followers', e.target.value)}
                                                                required
                                                                min="0"
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>
                                                        {socialAccounts.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setSocialAccounts(prev => prev.filter(a => a.id !== acc.id))}
                                                                className="absolute top-2 right-2 text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSocialAccounts(prev => [...prev, { id: Date.now(), platform: 'Instagram', username: '', followers: '' }])}
                                                className="h-8 text-xs font-bold rounded-lg border-dashed w-full border-neutral-350 dark:border-neutral-750 mt-1 cursor-pointer"
                                            >
                                                + Add Another Social Account
                                            </Button>
                                            <InputError message={errors['referral_details.social_media']} />
                                        </div>
                                    </div>
                                )}

                                {mustVerifyEmail &&
                                    user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="cursor-pointer"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
