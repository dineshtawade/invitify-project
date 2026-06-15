import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Store, Users } from 'lucide-react';

export default function Register() {
    const [roleType, setRoleType] = useState<'customer' | 'reseller' | 'referral_partner'>('customer');
    const [socialAccounts, setSocialAccounts] = useState<Array<{ id: number; platform: string; username: string; followers: string }>>([
        { id: Date.now(), platform: 'Instagram', username: '', followers: '' }
    ]);

    const handleSocialChange = (id: number, field: 'platform' | 'username' | 'followers', value: string) => {
        setSocialAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
    };

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <input type="hidden" name="role" value={roleType} />

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Custom Premium Role Selector Option */}
                            <div className="grid gap-3">
                                <Label>Optional Registration Type</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRoleType(roleType === 'reseller' ? 'customer' : 'reseller')}
                                        className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                            roleType === 'reseller'
                                                ? 'border-blue-600 bg-blue-50/10 dark:border-blue-500 dark:bg-blue-950/20 shadow-xs'
                                                : 'border-neutral-200 bg-white/40 hover:bg-neutral-50 dark:border-neutral-850 dark:bg-neutral-900/10 dark:hover:bg-neutral-900/30'
                                        }`}
                                    >
                                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                            roleType === 'reseller'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                                        }`}>
                                            <Store className="size-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100">Register as a Reseller</div>
                                            <p className="text-[10px] text-neutral-450 dark:text-neutral-400 font-medium mt-0.5 leading-tight">Get pricing margins to resell invitation templates.</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRoleType(roleType === 'referral_partner' ? 'customer' : 'referral_partner')}
                                        className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                            roleType === 'referral_partner'
                                                ? 'border-blue-600 bg-blue-50/10 dark:border-blue-500 dark:bg-blue-950/20 shadow-xs'
                                                : 'border-neutral-200 bg-white/40 hover:bg-neutral-50 dark:border-neutral-850 dark:bg-neutral-900/10 dark:hover:bg-neutral-900/30'
                                        }`}
                                    >
                                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                            roleType === 'referral_partner'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                                        }`}>
                                            <Users className="size-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100">Register as a Partner</div>
                                            <p className="text-[10px] text-neutral-450 dark:text-neutral-400 font-medium mt-0.5 leading-tight">Earn commissions using custom referral codes.</p>
                                        </div>
                                    </button>
                                </div>
                                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 italic">
                                    By default, you will register as a standard <strong>End User</strong> if no option above is active.
                                </p>
                            </div>

                            {/* Conditional Reseller Fields */}
                            {roleType === 'reseller' && (
                                <div className="grid gap-4 p-4 rounded-2xl border border-blue-100 dark:border-blue-950 bg-blue-50/5 dark:bg-blue-950/5 animate-fade-in">
                                    <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-850 pb-2 mb-1">
                                        <Store className="size-4 text-blue-600" />
                                        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-650 dark:text-blue-400">Reseller Information</span>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="reseller_business_name">Business Name</Label>
                                        <Input
                                            id="reseller_business_name"
                                            type="text"
                                            required={roleType === 'reseller'}
                                            name="reseller_business_name"
                                            placeholder="Gourmet Invites Ltd."
                                        />
                                        <InputError message={errors.reseller_business_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="reseller_mobile_number">Mobile Number</Label>
                                        <Input
                                            id="reseller_mobile_number"
                                            type="text"
                                            required={roleType === 'reseller'}
                                            name="reseller_mobile_number"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                        <InputError message={errors.reseller_mobile_number} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="reseller_email">Business Email Address</Label>
                                        <Input
                                            id="reseller_email"
                                            type="email"
                                            required={roleType === 'reseller'}
                                            name="reseller_email"
                                            placeholder="business@example.com"
                                        />
                                        <InputError message={errors.reseller_email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="reseller_gst_number">GST Number</Label>
                                        <Input
                                            id="reseller_gst_number"
                                            type="text"
                                            required={roleType === 'reseller'}
                                            name="reseller_gst_number"
                                            placeholder="27AAAAA1111A1Z1"
                                        />
                                        <InputError message={errors.reseller_gst_number} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="reseller_business_address">Business Address (Optional)</Label>
                                        <textarea
                                            id="reseller_business_address"
                                            name="reseller_business_address"
                                            rows={2}
                                            placeholder="123 Creative Studio St, Mumbai, India"
                                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-950"
                                        />
                                        <InputError message={errors.reseller_business_address} />
                                    </div>
                                </div>
                            )}

                            {/* Conditional Referral Partner Fields */}
                            {roleType === 'referral_partner' && (
                                <div className="grid gap-4 p-4 rounded-2xl border border-blue-100 dark:border-blue-950 bg-blue-50/5 dark:bg-blue-950/5 animate-fade-in">
                                    <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-850 pb-2 mb-1">
                                        <Users className="size-4 text-blue-600" />
                                        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-650 dark:text-blue-400">Referral Partner Details</span>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="referral_city">City</Label>
                                        <Input
                                            id="referral_city"
                                            type="text"
                                            required={roleType === 'referral_partner'}
                                            name="referral_city"
                                            placeholder="Mumbai"
                                        />
                                        <InputError message={errors.referral_city} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="referral_email">Contact Email Address</Label>
                                        <Input
                                            id="referral_email"
                                            type="email"
                                            required={roleType === 'referral_partner'}
                                            name="referral_email"
                                            placeholder="partner@example.com"
                                        />
                                        <InputError message={errors.referral_email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="referral_phone_number">Phone Number</Label>
                                        <Input
                                            id="referral_phone_number"
                                            type="text"
                                            required={roleType === 'referral_partner'}
                                            name="referral_phone_number"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                        <InputError message={errors.referral_phone_number} />
                                    </div>

                                    {/* Social Media Section */}
                                    <div className="grid gap-3 mt-1">
                                        <Label className="font-extrabold text-neutral-800 dark:text-neutral-300">Social Media Accounts</Label>
                                        
                                        <div className="space-y-3">
                                            {socialAccounts.map((acc, index) => (
                                                <div key={acc.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/30 relative animate-fade-in">
                                                    <div className="grid gap-1">
                                                        <Label className="text-[10px] uppercase font-bold text-neutral-450">Platform</Label>
                                                        <select
                                                            name={`referral_social_media[${index}][platform]`}
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
                                                            name={`referral_social_media[${index}][username]`}
                                                            value={acc.username}
                                                            onChange={(e) => handleSocialChange(acc.id, 'username', e.target.value)}
                                                            required={roleType === 'referral_partner'}
                                                            className="h-9 text-xs"
                                                        />
                                                    </div>
                                                    <div className="grid gap-1">
                                                        <Label className="text-[10px] uppercase font-bold text-neutral-450">Followers</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="1000"
                                                            name={`referral_social_media[${index}][followers]`}
                                                            value={acc.followers}
                                                            onChange={(e) => handleSocialChange(acc.id, 'followers', e.target.value)}
                                                            required={roleType === 'referral_partner'}
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
                                            className="h-8 text-xs font-bold rounded-lg border-dashed w-full border-neutral-300 dark:border-neutral-850 mt-1 cursor-pointer"
                                        >
                                            + Add Another Social Account
                                        </Button>
                                        <InputError message={errors.referral_social_media} />
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full cursor-pointer"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={7}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
