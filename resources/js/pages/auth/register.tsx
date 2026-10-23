import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Store, Users, Mail, ShieldCheck, Edit3, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

// developed by dinesh tawade
export default function Register() {
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [roleType, setRoleType] = useState<'customer' | 'reseller' | 'referral_partner'>('customer');

    // Form fields state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        password_confirmation: '',
        // Reseller fields
        reseller_business_name: '',
        reseller_mobile_number: '',
        reseller_email: '',
        reseller_gst_number: '',
        reseller_business_address: '',
        // Referral fields
        referral_city: '',
        referral_email: '',
        referral_phone_number: '',
    });

    const [socialAccounts, setSocialAccounts] = useState<Array<{ id: number; platform: string; username: string; followers: string }>>([
        { id: Date.now(), platform: 'Instagram', username: '', followers: '' }
    ]);

    // OTP & Verification State
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otpError, setOtpError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const role = params.get('role');
        if (role === 'reseller' || role === 'referral_partner' || role === 'customer') {
            setRoleType(role as any);
        }
    }, []);

    // 60-second countdown for OTP resend
    useEffect(() => {
        let timer: any;
        if (step === 'otp' && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handleSocialChange = (id: number, field: 'platform' | 'username' | 'followers', value: string) => {
        setSocialAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
    };

    const getCsrfToken = () => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    };

    // Step 1: Send OTP to user's email
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setOtpError(null);
        setStatusMessage(null);
        try {
            const payload: Record<string, any> = {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                role: roleType,
            };

            if (roleType === 'reseller') {
                payload.reseller_business_name = formData.reseller_business_name;
                payload.reseller_mobile_number = formData.reseller_mobile_number;
                payload.reseller_email = formData.reseller_email;
                payload.reseller_gst_number = formData.reseller_gst_number;
                payload.reseller_business_address = formData.reseller_business_address;
            } else if (roleType === 'referral_partner') {
                payload.referral_city = formData.referral_city;
                payload.referral_email = formData.referral_email;
                payload.referral_phone_number = formData.referral_phone_number;
                payload.referral_social_media = socialAccounts.map(a => ({
                    platform: a.platform,
                    username: a.username,
                    followers: parseInt(a.followers) || 0,
                }));
            }

            const res = await fetch('/register/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    const formattedErrors: Record<string, string> = {};
                    const firstErrorVal = Object.values(data.errors)[0];
                    const firstMsg = Array.isArray(firstErrorVal) ? firstErrorVal[0] : (firstErrorVal as string);
                    Object.keys(data.errors).forEach(key => {
                        formattedErrors[key] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
                    });
                    setErrors({
                        ...formattedErrors,
                        general: firstMsg || 'Validation failed. Please verify your inputs.',
                    });
                } else {
                    setErrors({ general: data.message || 'Validation failed. Please verify all inputs.' });
                }
                setIsSubmitting(false);
                return;
            }

            // OTP sent successfully! Switch to verification step
            setStep('otp');
            setOtp('');
            setCountdown(60);
            setStatusMessage(data.message || `A 6-digit verification code has been sent to ${formData.email}`);
        } catch (err: any) {
            setErrors({ general: 'Network connection error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 2: Verify OTP and activate account
    const handleVerifyOtp = async (codeToVerify?: string) => {
        const finalOtp = codeToVerify || otp;
        if (!finalOtp || finalOtp.length !== 6) {
            setOtpError('Please enter the full 6-digit verification code.');
            return;
        }

        setIsVerifying(true);
        setOtpError(null);

        try {
            const res = await fetch('/register/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: finalOtp,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors?.otp) {
                    setOtpError(Array.isArray(data.errors.otp) ? data.errors.otp[0] : data.errors.otp);
                } else if (data.errors?.email) {
                    setOtpError(Array.isArray(data.errors.email) ? data.errors.email[0] : data.errors.email);
                } else {
                    setOtpError(data.message || 'Invalid or expired code. Please try again.');
                }
                setIsVerifying(false);
                return;
            }

            setStatusMessage('Email verified successfully! Redirecting to your dashboard...');
            // Redirect to dashboard or approval page
            window.location.href = data.redirect || '/dashboard';
        } catch (err: any) {
            setOtpError('Unable to verify code. Please check your network connection.');
            setIsVerifying(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0 || isResending) return;
        setIsResending(true);
        setOtpError(null);
        setStatusMessage(null);

        try {
            const res = await fetch('/register/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setOtpError(data.errors?.otp?.[0] || data.errors?.email?.[0] || data.message || 'Failed to resend code.');
                setIsResending(false);
                return;
            }

            setCountdown(60);
            setStatusMessage('A fresh verification code has been dispatched to your email.');
            setOtp('');
        } catch (err: any) {
            setOtpError('Network error while resending code.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AuthLayout
            title={step === 'form' ? 'Create an account' : 'Verify Your Email'}
            description={
                step === 'form'
                    ? 'Enter your details below to create your account'
                    : 'Enter the 6-digit verification code sent to your email'
            }
        >
            <Head title={step === 'form' ? 'Register' : 'Verify Email OTP'} />

            {/* STEP 1: REGISTRATION FORM */}
            {step === 'form' ? (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                    <div className="grid gap-5">
                        <input type="hidden" name="role" value={roleType} />

                        {errors.general && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                                {errors.general}
                            </div>
                        )}

                        {/* Name */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="name" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Name</Label>
                            <Input
                                className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Email */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Email address</Label>
                            <Input
                                className={`bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80 ${
                                    errors.email ? '!border-red-500 !ring-2 !ring-red-500/20 bg-red-50/30' : ''
                                }`}
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                            {errors.email && (
                                <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5 mt-1 pl-1">
                                    <AlertCircle className="size-3.5 shrink-0" />
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="mobile" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Mobile Number</Label>
                            <Input
                                className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                id="mobile"
                                type="text"
                                required
                                pattern="[0-9]{10}"
                                maxLength={10}
                                title="Please enter exactly 10 digits"
                                tabIndex={3}
                                autoComplete="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={(e) => handleFieldChange('mobile', e.target.value)}
                                placeholder="9876543210"
                            />
                            <InputError message={errors.mobile} className="mt-1" />
                        </div>

                        {/* Password */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Password</Label>
                            <PasswordInput
                                className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                id="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                name="password"
                                value={formData.password}
                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                placeholder="Password (min 8 characters)"
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="password_confirmation" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">
                                Confirm password
                            </Label>
                            <PasswordInput
                                className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                id="password_confirmation"
                                required
                                tabIndex={5}
                                autoComplete="new-password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={(e) => handleFieldChange('password_confirmation', e.target.value)}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        {/* Conditional Reseller Fields */}
                        {roleType === 'reseller' && (
                            <div className="grid gap-4 p-4 rounded-2xl border border-[#ebd9c1]/50 bg-[#ebd9c1]/10 animate-fade-in">
                                <div className="flex items-center gap-1.5 border-b border-[#ebd9c1]/50 pb-2 mb-1">
                                    <Store className="size-4 text-[#3d5644]" />
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#3d5644]">Reseller Information</span>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="reseller_business_name" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Business Name</Label>
                                    <Input
                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                        id="reseller_business_name"
                                        type="text"
                                        required={roleType === 'reseller'}
                                        name="reseller_business_name"
                                        value={formData.reseller_business_name}
                                        onChange={(e) => handleFieldChange('reseller_business_name', e.target.value)}
                                        placeholder="Gourmet Invites Ltd."
                                    />
                                    <InputError message={errors.reseller_business_name} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="reseller_mobile_number" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Mobile Number</Label>
                                    <Input
                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                        id="reseller_mobile_number"
                                        type="text"
                                        required={roleType === 'reseller'}
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        title="Please enter exactly 10 digits"
                                        name="reseller_mobile_number"
                                        value={formData.reseller_mobile_number}
                                        onChange={(e) => handleFieldChange('reseller_mobile_number', e.target.value)}
                                        placeholder="9876543210"
                                    />
                                    <InputError message={errors.reseller_mobile_number} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="reseller_email" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Business Email Address</Label>
                                    <Input
                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                        id="reseller_email"
                                        type="email"
                                        required={roleType === 'reseller'}
                                        name="reseller_email"
                                        value={formData.reseller_email}
                                        onChange={(e) => handleFieldChange('reseller_email', e.target.value)}
                                        placeholder="business@example.com"
                                    />
                                    <InputError message={errors.reseller_email} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="reseller_gst_number" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">GST Number</Label>
                                    <Input
                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                        id="reseller_gst_number"
                                        type="text"
                                        required={roleType === 'reseller'}
                                        name="reseller_gst_number"
                                        value={formData.reseller_gst_number}
                                        onChange={(e) => handleFieldChange('reseller_gst_number', e.target.value)}
                                        placeholder="27AAAAA1111A1Z1"
                                    />
                                    <InputError message={errors.reseller_gst_number} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="reseller_business_address" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Business Address (Optional)</Label>
                                    <textarea
                                        id="reseller_business_address"
                                        name="reseller_business_address"
                                        rows={2}
                                        value={formData.reseller_business_address}
                                        onChange={(e) => handleFieldChange('reseller_business_address', e.target.value)}
                                        placeholder="123 Creative Studio St, Mumbai, India"
                                        className="flex min-h-[60px] w-full bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-3 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80 text-xs"
                                    />
                                    <InputError message={errors.reseller_business_address} />
                                </div>
                            </div>
                        )}

                        {/* Conditional Referral Partner Fields */}
                        {roleType === 'referral_partner' && (
                            <div className="grid gap-4 p-4 rounded-2xl border border-[#ebd9c1]/50 bg-[#ebd9c1]/10 animate-fade-in">
                                <div className="flex items-center gap-1.5 border-b border-[#ebd9c1]/50 pb-2 mb-1">
                                    <Users className="size-4 text-[#3d5644]" />
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#3d5644]">Referral Partner Details</span>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="referral_city" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">City</Label>
                                    <Input
                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                        id="referral_city"
                                        type="text"
                                        required={roleType === 'referral_partner'}
                                        name="referral_city"
                                        value={formData.referral_city}
                                        onChange={(e) => handleFieldChange('referral_city', e.target.value)}
                                        placeholder="Mumbai"
                                    />
                                    <InputError message={errors.referral_city} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="referral_email" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Contact Email Address</Label>
                                    <Input
                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                        id="referral_email"
                                        type="email"
                                        required={roleType === 'referral_partner'}
                                        name="referral_email"
                                        value={formData.referral_email}
                                        onChange={(e) => handleFieldChange('referral_email', e.target.value)}
                                        placeholder="partner@example.com"
                                    />
                                    <InputError message={errors.referral_email} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="referral_phone_number" className="text-[10px] font-extrabold text-[#4a4238] uppercase tracking-wider pl-1">Phone Number</Label>
                                    <Input
                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80"
                                        id="referral_phone_number"
                                        type="text"
                                        required={roleType === 'referral_partner'}
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        title="Please enter exactly 10 digits"
                                        name="referral_phone_number"
                                        value={formData.referral_phone_number}
                                        onChange={(e) => handleFieldChange('referral_phone_number', e.target.value)}
                                        placeholder="9876543210"
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
                                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-blue-400"
                                                    >
                                                        <option value="Instagram" className="dark:bg-blue-600 text-white">Instagram</option>
                                                        <option value="Facebook" className="dark:bg-blue-600 text-white">Facebook</option>
                                                        <option value="YouTube" className="dark:bg-blue-600 text-white">YouTube</option>
                                                        <option value="Twitter/X" className="dark:bg-blue-600 text-white">Twitter/X</option>
                                                        <option value="LinkedIn" className="dark:bg-blue-600 text-white">LinkedIn</option>
                                                    </select>
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px] uppercase font-bold text-neutral-450">Username</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="@username"
                                                        name={`referral_social_media[${index}][username]`}
                                                        value={acc.username}
                                                        onChange={(e) => handleSocialChange(acc.id, 'username', e.target.value)}
                                                        required={roleType === 'referral_partner'}
                                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80 h-9 text-xs"
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
                                                        className="bg-white/60 backdrop-blur-md border-[#ebd9c1]/80 rounded-xl px-4 py-5 text-[#3e3832] focus-visible:ring-[#3d5644]/20 focus-visible:border-[#3d5644] placeholder:text-[#4a4238]/40 shadow-sm transition-all hover:bg-white/80 h-9 text-xs"
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
                                        className="h-8 text-xs font-bold rounded-lg border-dashed w-full border-neutral-300 dark:border-neutral-850 bg-blue-400 mt-1 cursor-pointer"
                                    >
                                        + Add Another Social Account
                                    </Button>
                                    <InputError message={errors.referral_social_media} />
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-6 w-full cursor-pointer bg-gradient-to-r from-[#3d5644] to-[#2a3c30] hover:from-[#2a3c30] hover:to-[#1a2c20] text-white border-0 rounded-xl py-6 text-sm font-bold shadow-lg shadow-[#3d5644]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            tabIndex={6}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner className="size-4" />
                                    <span>Sending Verification Code...</span>
                                </>
                            ) : (
                                <span>Create account & Verify Email →</span>
                            )}
                        </Button>
                    </div>

                    <div className="text-center text-sm text-[#4a4238]/80 font-medium">
                        Already have an account?{' '}
                        <TextLink href={login()} tabIndex={7} className="font-bold text-[#3d5644] hover:text-[#2a3c30] underline underline-offset-4">
                            Log in
                        </TextLink>
                    </div>
                </form>
            ) : (
                /* STEP 2: EMAIL OTP VERIFICATION SCREEN */
                <div className="flex flex-col gap-6 animate-fade-in">
                    {/* Header badge */}
                    <div className="flex flex-col items-center justify-center text-center gap-2 -mt-2">
                        <div className="size-14 rounded-2xl bg-[#3d5644]/10 border border-[#3d5644]/20 flex items-center justify-center text-[#3d5644] shadow-sm">
                            <ShieldCheck className="size-7" />
                        </div>
                        <p className="text-xs text-[#706557]">
                            We sent a 6-digit confirmation code to:
                        </p>
                    </div>

                    {/* Email badge with edit button */}
                    <div className="flex items-center justify-between p-3.5 bg-white/70 backdrop-blur-md border border-[#ebd9c1] rounded-xl shadow-xs">
                        <div className="flex items-center gap-2.5 text-[#3e3832] font-semibold text-sm truncate">
                            <Mail className="size-4 text-[#3d5644] shrink-0" />
                            <span className="truncate">{formData.email}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setStep('form');
                                setOtpError(null);
                                setStatusMessage(null);
                            }}
                            className="text-xs font-bold text-[#3d5644] hover:text-[#2a3c30] flex items-center gap-1 cursor-pointer underline shrink-0 ml-2"
                        >
                            <Edit3 className="size-3.5" /> Edit
                        </button>
                    </div>

                    {/* Status Alert */}
                    {statusMessage && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                            <span>{statusMessage}</span>
                        </div>
                    )}

                    {/* Error Alert */}
                    {otpError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-start gap-2 shadow-sm">
                            <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold">{otpError}</p>
                                {otpError.toLowerCase().includes('mail not found') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep('form');
                                            setOtpError(null);
                                        }}
                                        className="mt-1.5 text-xs font-bold text-red-800 underline hover:text-red-950 cursor-pointer block"
                                    >
                                        Click here to change email address →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 6-Digit OTP Input */}
                    <div className="flex flex-col items-center justify-center space-y-4 my-2">
                        <Label className="text-xs font-bold text-[#4a4238] uppercase tracking-wider">
                            Enter 6-Digit Verification Code
                        </Label>
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(val) => {
                                setOtp(val);
                                setOtpError(null);
                                if (val.length === 6) {
                                    handleVerifyOtp(val);
                                }
                            }}
                            disabled={isVerifying}
                            pattern={REGEXP_ONLY_DIGITS}
                            autoFocus
                        >
                            <InputOTPGroup className="gap-2 sm:gap-3">
                                {Array.from({ length: 6 }, (_, index) => (
                                    <InputOTPSlot
                                        key={index}
                                        index={index}
                                        className="h-13 w-11 sm:h-14 sm:w-12 text-xl font-bold bg-white/80 border-[#ebd9c1] text-[#3e3832] rounded-xl shadow-xs focus:border-[#3d5644] focus:ring-2 focus:ring-[#3d5644]/20 transition-all"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                        <p className="text-[11px] text-[#8c7e6d]">
                            Check your inbox or spam folder for the email from Invitify
                        </p>
                    </div>

                    {/* Verify Button */}
                    <Button
                        type="button"
                        onClick={() => handleVerifyOtp()}
                        disabled={isVerifying || otp.length !== 6}
                        className="w-full cursor-pointer bg-gradient-to-r from-[#3d5644] to-[#2a3c30] hover:from-[#2a3c30] hover:to-[#1a2c20] text-white border-0 rounded-xl py-6 text-sm font-bold shadow-lg shadow-[#3d5644]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isVerifying ? (
                            <>
                                <Spinner className="size-4" />
                                <span>Verifying Code & Activating Account...</span>
                            </>
                        ) : (
                            <span>Verify & Complete Registration →</span>
                        )}
                    </Button>

                    {/* Resend Code Section */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#ebd9c1]/60">
                        <button
                            type="button"
                            onClick={() => {
                                setStep('form');
                                setOtpError(null);
                            }}
                            className="font-semibold text-[#8c7e6d] hover:text-[#3e3832] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <ArrowLeft className="size-3.5" /> Back to details
                        </button>

                        <div>
                            {countdown > 0 ? (
                                <span className="text-[#8c7e6d]">
                                    Resend code in <strong className="font-mono text-[#3e3832]">{countdown}s</strong>
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isResending}
                                    className="font-bold text-[#3d5644] hover:text-[#2a3c30] flex items-center gap-1 cursor-pointer underline disabled:opacity-50"
                                >
                                    {isResending ? (
                                        <>
                                            <RefreshCw className="size-3.5 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <span>Resend Verification Code</span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
