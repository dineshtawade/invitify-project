import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Mail,
    KeyRound,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Lock,
    Edit3,
    Eye,
    EyeOff
} from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

interface EmailOtpAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: {
        id: number | string;
        encrypted_id?: string;
        name: string;
        category?: string;
        type?: string;
        price?: string | number;
        bg_gradient?: string;
        default_config?: any;
    } | null;
    onSuccess?: (redirectUrl: string) => void;
}

// developed by dinesh tawade
export default function EmailOtpAuthModal({
    isOpen,
    onClose,
    template,
    onSuccess,
}: EmailOtpAuthModalProps) {
    const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

    // Common State
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);

    // Password Login State
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoggingInWithPassword, setIsLoggingInWithPassword] = useState(false);

    // Password Setup for OTP Flow
    const [otpSetupPassword, setOtpSetupPassword] = useState('');
    const [showOtpSetupPassword, setShowOtpSetupPassword] = useState(false);

    // OTP State
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [otp, setOtp] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);

    // Reset state on open/close
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setAuthMode('otp');
                setStep('email');
                setEmail('');
                setName('');
                setPassword('');
                setOtpSetupPassword('');
                setShowOtpSetupPassword(false);
                setOtp('');
                setErrorMessage(null);
                setSuccessMessage(null);
                setIsVerified(false);
            }, 300);
        }
    }, [isOpen]);

    // Resend countdown timer
    useEffect(() => {
        let timer: any;
        if (authMode === 'otp' && step === 'otp' && countdown > 0 && !isVerified) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [authMode, step, countdown, isVerified]);

    const getCsrfToken = () => {
        return (
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
            ''
        );
    };

    const targetCustomizeUrl = template
        ? `/templates/${template.encrypted_id || template.id}/customize`
        : '/customer/templates';

    const handleSuccessRedirect = (redirectUrl: string) => {
        setIsVerified(true);
        setTimeout(() => {
            if (onSuccess) {
                onSuccess(redirectUrl);
            } else {
                window.location.href = redirectUrl;
            }
        }, 700);
    };

    // ===== PASSWORD LOGIN HANDLER =====
    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setErrorMessage('Please enter your email address.');
            return;
        }
        if (!password) {
            setErrorMessage('Please enter your password.');
            return;
        }

        setIsLoggingInWithPassword(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch('/auth/password/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    password: password,
                    remember: rememberMe,
                    redirect_url: targetCustomizeUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const msg =
                    data.errors?.password?.[0] ||
                    data.errors?.email?.[0] ||
                    data.message ||
                    'Invalid email or password. Please try again.';
                setErrorMessage(msg);
                setIsLoggingInWithPassword(false);
                return;
            }

            setSuccessMessage('Logged in successfully! Opening editor...');
            handleSuccessRedirect(data.redirect || targetCustomizeUrl);
        } catch (err: any) {
            setErrorMessage('Network connection error. Please try again.');
            setIsLoggingInWithPassword(false);
        }
    };

    // ===== OTP HANDLER (STEP 1: SEND OTP) =====
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setErrorMessage('Please enter your email address.');
            return;
        }

        if (otpSetupPassword.trim() && otpSetupPassword.trim().length < 6) {
            setErrorMessage('Password must be at least 6 characters.');
            return;
        }

        setIsSending(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch('/auth/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    name: name.trim() || undefined,
                    password: otpSetupPassword.trim() || undefined,
                    redirect_url: targetCustomizeUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const msg =
                    data.errors?.email?.[0] ||
                    data.message ||
                    'Unable to send verification code. Please check your email.';
                setErrorMessage(msg);
                setIsSending(false);
                return;
            }

            setStep('otp');
            setCountdown(60);
            setSuccessMessage(data.message || `Verification code sent to ${trimmedEmail}`);
        } catch (err: any) {
            setErrorMessage('Network connection error. Please check your internet connection.');
        } finally {
            setIsSending(false);
        }
    };

    // ===== OTP HANDLER (RESEND OTP) =====
    const handleResendOtp = async () => {
        if (countdown > 0 || isResending) return;

        setIsResending(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch('/auth/otp/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    email: email.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(
                    data.errors?.otp?.[0] ||
                    data.errors?.email?.[0] ||
                    data.message ||
                    'Failed to resend code.'
                );
                setIsResending(false);
                return;
            }

            setCountdown(60);
            setSuccessMessage('A new verification code has been dispatched.');
        } catch (err: any) {
            setErrorMessage('Network error. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    // ===== OTP HANDLER (STEP 2: VERIFY OTP) =====
    const handleVerifyOtp = async (codeToVerify?: string) => {
        const finalOtp = codeToVerify || otp;
        if (!finalOtp || finalOtp.length !== 6) {
            setErrorMessage('Please enter the complete 6-digit verification code.');
            return;
        }

        setIsVerifying(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch('/auth/otp/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: finalOtp,
                    password: otpSetupPassword.trim() || undefined,
                    redirect_url: targetCustomizeUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const msg =
                    data.errors?.otp?.[0] ||
                    data.errors?.email?.[0] ||
                    data.message ||
                    'Invalid or expired code. Please try again.';
                setErrorMessage(msg);
                setIsVerifying(false);
                return;
            }

            setSuccessMessage('Verified successfully! Opening editor...');
            handleSuccessRedirect(data.redirect || targetCustomizeUrl);
        } catch (err: any) {
            setErrorMessage('Network error. Please try again.');
            setIsVerifying(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isVerifying && !isLoggingInWithPassword) onClose(); }}>
            <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-[#fdfbf7] dark:bg-neutral-900 border border-[#ebd9c1] dark:border-neutral-800 shadow-2xl rounded-2xl">
                {/* Header Banner */}
                <div className="relative bg-gradient-to-r from-[#3d5644] to-[#25362a] p-6 text-white overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 size-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
                            <Sparkles className="size-5" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] uppercase font-bold tracking-widest text-emerald-200 mb-1">
                                <ShieldCheck className="size-3" /> Login Required to Customize
                            </div>
                            <DialogTitle className="text-xl font-bold font-serif text-white tracking-wide">
                                Sign In to Continue
                            </DialogTitle>
                        </div>
                    </div>

                    {template && (
                        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/90 font-serif">
                            <span className="truncate max-w-[260px] font-medium">
                                Template: <strong className="text-white font-bold">{template.name}</strong>
                            </span>
                            {template.price && (
                                <span className="shrink-0 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded font-mono font-bold text-white text-[11px]">
                                    ₹{parseFloat(String(template.price)).toFixed(2)}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-4">
                    {/* Method Switcher Tabs (OTP vs Password) */}
                    <div className="flex rounded-xl bg-[#ebd9c1]/30 dark:bg-neutral-800 p-1 border border-[#ebd9c1] dark:border-neutral-700">
                        <button
                            type="button"
                            onClick={() => {
                                setAuthMode('otp');
                                setErrorMessage(null);
                            }}
                            className={`flex-1 py-2 text-xs font-serif font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                authMode === 'otp'
                                    ? 'bg-[#3d5644] text-white shadow-sm'
                                    : 'text-[#706557] hover:text-[#3e3832] dark:hover:text-neutral-200'
                            }`}
                        >
                            <Mail className="size-3.5" /> Email OTP (Quick)
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setAuthMode('password');
                                setErrorMessage(null);
                            }}
                            className={`flex-1 py-2 text-xs font-serif font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                authMode === 'password'
                                    ? 'bg-[#3d5644] text-white shadow-sm'
                                    : 'text-[#706557] hover:text-[#3e3832] dark:hover:text-neutral-200'
                            }`}
                        >
                            <KeyRound className="size-3.5" /> Password Login
                        </button>
                    </div>

                    {/* Error Alert */}
                    {errorMessage && (
                        <div className="rounded-xl border border-red-200 bg-red-50/90 dark:border-red-900/40 dark:bg-red-950/30 p-3.5 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in zoom-in-95 duration-200">
                            <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                            <div className="flex-1 font-medium">{errorMessage}</div>
                        </div>
                    )}

                    {/* Success Alert */}
                    {successMessage && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 dark:border-emerald-900/40 dark:bg-emerald-950/30 p-3.5 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in zoom-in-95 duration-200">
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                            <div className="flex-1 font-medium">{successMessage}</div>
                        </div>
                    )}

                    {authMode === 'password' ? (
                        /* ===== OPTION 1: PASSWORD LOGIN ===== */
                        <form onSubmit={handlePasswordLogin} className="space-y-4 animate-in fade-in duration-200">
                            <div className="space-y-1.5">
                                <Label htmlFor="pwd_email" className="text-xs font-serif font-bold text-[#4a4238] dark:text-neutral-300">
                                    Email Address <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#a89b8c]" />
                                    <Input
                                        id="pwd_email"
                                        type="email"
                                        required
                                        autoFocus
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-white dark:bg-neutral-800 border-[#ebd9c1] dark:border-neutral-700 rounded-xl h-11 text-sm focus:border-[#3d5644] focus:ring-[#3d5644]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="pwd_password" className="text-xs font-serif font-bold text-[#4a4238] dark:text-neutral-300">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <a
                                        href="/forgot-password"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-[#3d5644] hover:underline font-serif font-semibold"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="pwd_password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10 bg-white dark:bg-neutral-800 border-[#ebd9c1] dark:border-neutral-700 rounded-xl h-11 text-sm focus:border-[#3d5644] focus:ring-[#3d5644]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a89b8c] hover:text-[#4a4238]"
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                                <Checkbox
                                    id="modal_remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                                />
                                <Label htmlFor="modal_remember" className="text-xs font-serif text-[#706557] cursor-pointer">
                                    Remember me on this browser
                                </Label>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isLoggingInWithPassword || !email.trim() || !password}
                                    className="w-full h-11 bg-[#3d5644] hover:bg-[#2c3e2e] text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isLoggingInWithPassword ? (
                                        <>
                                            <Spinner className="size-4 animate-spin" />
                                            <span>Logging in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="size-4" />
                                            <span>Log In & Start Customizing</span>
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="text-center text-[11px] text-[#706557] font-serif">
                                Don't remember password? Switch to{' '}
                                <button
                                    type="button"
                                    onClick={() => setAuthMode('otp')}
                                    className="text-[#3d5644] font-bold underline cursor-pointer"
                                >
                                    Email OTP Login
                                </button>
                            </p>
                        </form>
                    ) : (
                        /* ===== OPTION 2: EMAIL OTP AUTHENTICATION ===== */
                        step === 'email' ? (
                            <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in duration-200">
                                <div className="space-y-1.5">
                                    <Label htmlFor="user_name" className="text-xs font-serif font-bold text-[#4a4238] dark:text-neutral-300">
                                        Your Full Name <span className="text-[#a89b8c] font-normal text-[11px]">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="user_name"
                                        type="text"
                                        placeholder="e.g. Rahul Sharma"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-white dark:bg-neutral-800 border-[#ebd9c1] dark:border-neutral-700 rounded-xl h-11 text-sm focus:border-[#3d5644] focus:ring-[#3d5644]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="user_email" className="text-xs font-serif font-bold text-[#4a4238] dark:text-neutral-300 flex items-center justify-between">
                                        <span>Email Address <span className="text-red-500">*</span></span>
                                        <span className="text-[11px] font-normal text-[#706557]">6-digit OTP will be sent</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#a89b8c]" />
                                        <Input
                                            id="user_email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 bg-white dark:bg-neutral-800 border-[#ebd9c1] dark:border-neutral-700 rounded-xl h-11 text-sm focus:border-[#3d5644] focus:ring-[#3d5644]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="otp_setup_password" className="text-xs font-serif font-bold text-[#4a4238] dark:text-neutral-300">
                                            Set Password <span className="text-[#a89b8c] font-normal text-[11px]">(Optional / For future logins)</span>
                                        </Label>
                                        <span className="text-[11px] text-[#706557]">Min 6 chars</span>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#a89b8c]" />
                                        <Input
                                            id="otp_setup_password"
                                            type={showOtpSetupPassword ? 'text' : 'password'}
                                            placeholder="Create password to log in directly next time"
                                            value={otpSetupPassword}
                                            onChange={(e) => setOtpSetupPassword(e.target.value)}
                                            className="pl-10 pr-10 bg-white dark:bg-neutral-800 border-[#ebd9c1] dark:border-neutral-700 rounded-xl h-11 text-sm focus:border-[#3d5644] focus:ring-[#3d5644]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOtpSetupPassword(!showOtpSetupPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a89b8c] hover:text-[#4a4238] cursor-pointer"
                                        >
                                            {showOtpSetupPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-[#706557] font-serif leading-tight">
                                        Set a password here so you can log in via the <strong>Password Login</strong> tab anytime in future!
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isSending || !email.trim()}
                                        className="w-full h-11 bg-[#3d5644] hover:bg-[#2c3e2e] text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {isSending ? (
                                            <>
                                                <Spinner className="size-4 animate-spin" />
                                                <span>Sending 6-Digit OTP...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Verification Code</span>
                                                <ArrowRight className="size-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <p className="text-center text-[11px] text-[#706557] dark:text-neutral-400 font-serif leading-relaxed">
                                    Fast passwordless login. New accounts are automatically registered and verified.
                                </p>
                            </form>
                        ) : (
                            <div className="space-y-5 animate-in fade-in duration-300">
                                <div className="rounded-xl bg-[#ebd9c1]/20 dark:bg-neutral-800/50 p-3.5 flex items-center justify-between border border-[#ebd9c1]/60">
                                    <div className="flex items-center gap-2 truncate">
                                        <Mail className="size-4 text-[#3d5644] shrink-0" />
                                        <span className="text-xs font-serif font-semibold text-[#3e3832] dark:text-neutral-200 truncate">
                                            {email}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep('email');
                                            setOtp('');
                                            setErrorMessage(null);
                                        }}
                                        className="text-xs text-[#3d5644] hover:text-[#25362a] font-serif font-bold underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                                    >
                                        <Edit3 className="size-3" /> Change
                                    </button>
                                </div>

                                <div className="space-y-2 flex flex-col items-center">
                                    <Label className="text-xs font-serif font-bold text-[#4a4238] dark:text-neutral-300">
                                        Enter 6-Digit Verification Code
                                    </Label>
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        value={otp}
                                        onChange={(val) => {
                                            setOtp(val);
                                            if (val.length === 6) {
                                                handleVerifyOtp(val);
                                            }
                                        }}
                                    >
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={0} className="size-11 rounded-lg border-[#ebd9c1] dark:border-neutral-700 text-base font-bold text-center bg-white dark:bg-neutral-800 shadow-xs" />
                                            <InputOTPSlot index={1} className="size-11 rounded-lg border-[#ebd9c1] dark:border-neutral-700 text-base font-bold text-center bg-white dark:bg-neutral-800 shadow-xs" />
                                            <InputOTPSlot index={2} className="size-11 rounded-lg border-[#ebd9c1] dark:border-neutral-700 text-base font-bold text-center bg-white dark:bg-neutral-800 shadow-xs" />
                                            <InputOTPSlot index={3} className="size-11 rounded-lg border-[#ebd9c1] dark:border-neutral-700 text-base font-bold text-center bg-white dark:bg-neutral-800 shadow-xs" />
                                            <InputOTPSlot index={4} className="size-11 rounded-lg border-[#ebd9c1] dark:border-neutral-700 text-base font-bold text-center bg-white dark:bg-neutral-800 shadow-xs" />
                                            <InputOTPSlot index={5} className="size-11 rounded-lg border-[#ebd9c1] dark:border-neutral-700 text-base font-bold text-center bg-white dark:bg-neutral-800 shadow-xs" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="text-xs text-[#706557] font-serif">
                                        {countdown > 0 ? (
                                            <span>Resend code in <strong className="text-[#3e3832]">{countdown}s</strong></span>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={isResending}
                                                onClick={handleResendOtp}
                                                className="text-[#3d5644] hover:text-[#25362a] font-bold underline inline-flex items-center gap-1 cursor-pointer"
                                            >
                                                <RefreshCw className={`size-3 ${isResending ? 'animate-spin' : ''}`} />
                                                Resend Code
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => handleVerifyOtp()}
                                    disabled={isVerifying || otp.length !== 6 || isVerified}
                                    className="w-full h-11 bg-[#3d5644] hover:bg-[#2c3e2e] text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isVerifying ? (
                                        <>
                                            <Spinner className="size-4 animate-spin" />
                                            <span>Verifying & Opening Editor...</span>
                                        </>
                                    ) : isVerified ? (
                                        <>
                                            <CheckCircle2 className="size-4 text-emerald-300" />
                                            <span>Verified! Opening Editor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="size-4" />
                                            <span>Verify Code & Customize</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        )
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
