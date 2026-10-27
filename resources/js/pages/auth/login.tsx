import { useState, useEffect, useRef } from 'react';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
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

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

// developed by dinesh tawade
export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
    const [intendedUrl, setIntendedUrl] = useState<string | null>(null);
    const [templateNotice, setTemplateNotice] = useState<string | null>(null);

    // OTP Login State
    const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email');
    const [otpEmail, setOtpEmail] = useState('');
    const [otpName, setOtpName] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpPassword, setOtpPassword] = useState('');
    const [showOtpPassword, setShowOtpPassword] = useState(false);

    const [isOtpSending, setIsOtpSending] = useState(false);
    const [isOtpVerifying, setIsOtpVerifying] = useState(false);
    const [isOtpResending, setIsOtpResending] = useState(false);

    const [otpCountdown, setOtpCountdown] = useState(60);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const isVerifyingRef = useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const intended = params.get('intended') || params.get('redirect') || params.get('redirect_url');
        const notice = params.get('notice');
        const templateName = params.get('template_name');

        const pendingRedirect = sessionStorage.getItem('pending_redirect_url') || localStorage.getItem('pending_redirect_url');

        if (intended) {
            setIntendedUrl(intended);
        } else if (pendingRedirect) {
            setIntendedUrl(pendingRedirect);
        }

        if (notice === 'auth_required_to_customize') {
            setLoginMethod('otp');
            setTemplateNotice(
                templateName
                    ? `Please verify your email with OTP to start customizing "${templateName}".`
                    : 'Please verify your email with OTP before customizing this template.'
            );
        }
    }, []);

    // OTP Countdown Timer
    useEffect(() => {
        let timer: any;
        if (otpStep === 'otp' && otpCountdown > 0 && !isOtpVerified) {
            timer = setInterval(() => {
                setOtpCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [otpStep, otpCountdown, isOtpVerified]);

    const getCsrfToken = () => {
        return (
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
            ''
        );
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = otpEmail.trim();
        if (!email) {
            setOtpError('Please enter your email address.');
            return;
        }

        if (otpPassword.trim() && otpPassword.trim().length < 6) {
            setOtpError('Password must be at least 6 characters.');
            return;
        }

        setIsOtpSending(true);
        setOtpError(null);
        setOtpSuccess(null);

        try {
            const res = await fetch('/auth/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    email,
                    name: otpName.trim() || undefined,
                    password: otpPassword.trim() || undefined,
                    redirect_url: intendedUrl || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setOtpError(
                    data.errors?.email?.[0] ||
                    data.message ||
                    'Unable to send verification code. Please check your email.'
                );
                setIsOtpSending(false);
                return;
            }

            setOtpStep('otp');
            setOtpCountdown(60);
            setOtpSuccess(data.message || `Verification code sent to ${email}`);
        } catch (err: any) {
            setOtpError('Network error. Please check your internet connection.');
        } finally {
            setIsOtpSending(false);
        }
    };

    const handleResendOtp = async () => {
        if (otpCountdown > 0 || isOtpResending) return;

        setIsOtpResending(true);
        setOtpError(null);
        setOtpSuccess(null);

        try {
            const res = await fetch('/auth/otp/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    email: otpEmail.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setOtpError(
                    data.errors?.otp?.[0] ||
                    data.errors?.email?.[0] ||
                    data.message ||
                    'Failed to resend code.'
                );
                setIsOtpResending(false);
                return;
            }

            setOtpCountdown(60);
            setOtpSuccess('A new 6-digit verification code has been dispatched.');
        } catch (err: any) {
            setOtpError('Network error. Please try again.');
        } finally {
            setIsOtpResending(false);
        }
    };

    const handleVerifyOtp = async (codeToVerify?: string) => {
        if (isVerifyingRef.current || isOtpVerified) return;

        const finalOtp = codeToVerify || otpCode;
        if (!finalOtp || finalOtp.length !== 6) {
            setOtpError('Please enter the complete 6-digit verification code.');
            return;
        }

        isVerifyingRef.current = true;
        setIsOtpVerifying(true);
        setOtpError(null);
        setOtpSuccess(null);

        try {
            const redirectTarget = intendedUrl || sessionStorage.getItem('pending_redirect_url') || undefined;

            const res = await fetch('/auth/otp/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    email: otpEmail.trim(),
                    otp: finalOtp,
                    name: otpName.trim() || undefined,
                    password: otpPassword.trim() || undefined,
                    redirect_url: redirectTarget,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setOtpError(
                    data.errors?.otp?.[0] ||
                    data.errors?.email?.[0] ||
                    data.message ||
                    'Invalid or expired code. Please try again.'
                );
                setIsOtpVerifying(false);
                isVerifyingRef.current = false;
                return;
            }

            setIsOtpVerified(true);
            setOtpSuccess('Verified successfully! Redirecting...');

            if (sessionStorage.getItem('pending_redirect_url')) {
                sessionStorage.removeItem('pending_redirect_url');
            }
            if (localStorage.getItem('pending_redirect_url')) {
                localStorage.removeItem('pending_redirect_url');
            }

            const target = data.redirect || intendedUrl || '/dashboard';
            setTimeout(() => {
                window.location.href = target;
            }, 500);
        } catch (err: any) {
            setOtpError('Network connection error. Please try again.');
            setIsOtpVerifying(false);
            isVerifyingRef.current = false;
        }
    };

    return (
        <AuthLayout
            title="Log in to Invitify"
            description="Enter your email and password or use quick Email OTP verification"
        >
            <Head title="Log in" />

            {/* Template Customize Notice Banner */}
            {templateNotice && (
                <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm flex items-start gap-2.5">
                    <Sparkles className="size-4 shrink-0 text-amber-600 mt-0.5" />
                    <div className="font-medium leading-relaxed">{templateNotice}</div>
                </div>
            )}

            {/* Authentication Method Switcher Tabs */}
            <div className="mb-6 flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        loginMethod === 'password'
                            ? 'bg-white shadow-xs text-neutral-900 font-bold dark:bg-neutral-900 dark:text-neutral-100'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                >
                    <KeyRound className="size-3.5" /> Password
                </button>
                <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        loginMethod === 'otp'
                            ? 'bg-white shadow-xs text-blue-700 font-bold dark:bg-neutral-900 dark:text-blue-400'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                >
                    <Mail className="size-3.5 text-blue-600" /> Email OTP
                </button>
            </div>

            {loginMethod === 'otp' ? (
                /* ===== EMAIL OTP AUTHENTICATION FLOW ===== */
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                    {otpError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-start gap-2">
                            <AlertCircle className="size-4 shrink-0 mt-0.5" />
                            <div className="font-medium">{otpError}</div>
                        </div>
                    )}

                    {otpSuccess && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 flex items-start gap-2">
                            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                            <div className="font-medium">{otpSuccess}</div>
                        </div>
                    )}

                    {otpStep === 'email' ? (
                        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="otp_name">Your Name (Optional)</Label>
                                <Input
                                    id="otp_name"
                                    type="text"
                                    placeholder="e.g. Rahul Sharma"
                                    value={otpName}
                                    onChange={(e) => setOtpName(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="otp_email">Email address <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                    <Input
                                        id="otp_email"
                                        type="email"
                                        required
                                        autoFocus
                                        placeholder="email@example.com"
                                        value={otpEmail}
                                        onChange={(e) => setOtpEmail(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="otp_password_input">Set Password (Optional / For future logins)</Label>
                                    <span className="text-xs text-neutral-400">Min 6 chars</span>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                    <Input
                                        id="otp_password_input"
                                        type={showOtpPassword ? 'text' : 'password'}
                                        placeholder="Create a password for your account"
                                        value={otpPassword}
                                        onChange={(e) => setOtpPassword(e.target.value)}
                                        className="pl-9 pr-9"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOtpPassword(!showOtpPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                                    >
                                        {showOtpPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-neutral-500">
                                    You can use this password to log in via the "Password" tab next time.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isOtpSending || !otpEmail.trim()}
                                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                                {isOtpSending ? (
                                    <>
                                        <Spinner />
                                        <span>Sending OTP...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Verification Code</span>
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </Button>

                            <p className="text-center text-xs text-neutral-500">
                                We will send a 6-digit one-time password to your email. Existing users log in; new users are registered automatically.
                            </p>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-5">
                            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 truncate">
                                    <Mail className="size-4 text-blue-600 shrink-0" />
                                    <span className="font-medium truncate">{otpEmail}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpStep('email');
                                        setOtpCode('');
                                        setOtpError(null);
                                    }}
                                    className="text-blue-600 hover:underline font-bold flex items-center gap-1 shrink-0 ml-2"
                                >
                                    <Edit3 className="size-3" /> Change
                                </button>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <Label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                                    Enter 6-Digit Verification Code
                                </Label>
                                <InputOTP
                                    maxLength={6}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    value={otpCode}
                                    onChange={(val) => {
                                        setOtpCode(val);
                                        if (val.length === 6) {
                                            handleVerifyOtp(val);
                                        }
                                    }}
                                >
                                    <InputOTPGroup className="gap-2">
                                        <InputOTPSlot index={0} className="size-11 rounded-lg text-base font-bold text-center" />
                                        <InputOTPSlot index={1} className="size-11 rounded-lg text-base font-bold text-center" />
                                        <InputOTPSlot index={2} className="size-11 rounded-lg text-base font-bold text-center" />
                                        <InputOTPSlot index={3} className="size-11 rounded-lg text-base font-bold text-center" />
                                        <InputOTPSlot index={4} className="size-11 rounded-lg text-base font-bold text-center" />
                                        <InputOTPSlot index={5} className="size-11 rounded-lg text-base font-bold text-center" />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <div className="flex items-center justify-between text-xs text-neutral-500">
                                {otpCountdown > 0 ? (
                                    <span>Resend code in <strong>{otpCountdown}s</strong></span>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={isOtpResending}
                                        onClick={handleResendOtp}
                                        className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <RefreshCw className={`size-3 ${isOtpResending ? 'animate-spin' : ''}`} />
                                        Resend Code
                                    </button>
                                )}
                            </div>

                            <Button
                                type="button"
                                onClick={() => handleVerifyOtp()}
                                disabled={isOtpVerifying || otpCode.length !== 6 || isOtpVerified}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                                {isOtpVerifying ? (
                                    <>
                                        <Spinner />
                                        <span>Verifying...</span>
                                    </>
                                ) : isOtpVerified ? (
                                    <>
                                        <CheckCircle2 className="size-4" />
                                        <span>Verified! Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="size-4" />
                                        <span>Verify Code & Continue</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                /* ===== STANDARD PASSWORD LOGIN FORM ===== */
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => {
                        const isRateLimited = errors.email && errors.email.toLowerCase().includes('too many login attempts');
                        
                        const [timeLeft, setTimeLeft] = useState<number | null>(null);

                        useEffect(() => {
                            if (isRateLimited && errors.email && timeLeft === null) {
                                const match = errors.email.match(/(\d+)\s+seconds?/);
                                if (match) {
                                    setTimeLeft(parseInt(match[1]));
                                }
                            }
                        }, [isRateLimited, errors.email]);

                        useEffect(() => {
                            if (timeLeft === null || timeLeft <= 0) return;
                            const timer = setInterval(() => {
                                setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
                            }, 1000);
                            return () => clearInterval(timer);
                        }, [timeLeft]);

                        let formattedError = errors.email;
                        if (timeLeft !== null) {
                            if (timeLeft <= 0) {
                                formattedError = "You can try logging in now. Please refresh.";
                            } else {
                                const h = Math.floor(timeLeft / 3600);
                                const m = Math.floor((timeLeft % 3600) / 60);
                                const s = timeLeft % 60;
                                const timeString = [
                                    h > 0 ? `${h}h` : null,
                                    m > 0 ? `${m}m` : null,
                                    `${s}s`
                                ].filter(Boolean).join(' ');
                                
                                formattedError = `Please try again in ${timeString}`;
                            }
                        } else if (isRateLimited && errors.email) {
                            const match = errors.email.match(/(\d+)\s+seconds?/);
                            if (match) {
                                const totalSeconds = parseInt(match[1]);
                                if (totalSeconds >= 3600) {
                                    const hours = Math.ceil(totalSeconds / 3600);
                                    formattedError = `Too many login attempts. Please try again in ${hours} hour${hours > 1 ? 's' : ''}.`;
                                } else if (totalSeconds >= 60) {
                                    const mins = Math.ceil(totalSeconds / 60);
                                    formattedError = `Too many login attempts. Please try again in ${mins} minute${mins > 1 ? 's' : ''}.`;
                                }
                            }
                        }

                        if (isRateLimited) {
                            return (
                                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                    <div className="size-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                                        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-black text-neutral-900">Too Many Attempts</h2>
                                    <p className="text-sm text-neutral-500 max-w-[280px]">
                                        {formattedError}
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="ml-auto text-sm text-blue-800"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember">Remember me</Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Log in
                                    </Button>
                                </div>

                                {canRegister && (
                                    <div className="text-center text-sm ">
                                        Don't have an account?{' '}
                                        <TextLink href={register()} tabIndex={5} className="text-blue-800">
                                            Sign up
                                        </TextLink>
                                    </div>
                                )}
                            </>
                        );
                    }}
                </Form>
            )}

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
