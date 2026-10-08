import { useState, useEffect } from 'react';
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

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

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
                                    For your security, we have temporarily blocked your account due to multiple failed login attempts.
                                </p>
                                <p className="text-lg font-bold text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl w-full font-mono tracking-wider">
                                    {formattedError}
                                </p>
                                <Button 
                                    type="button" 
                                    onClick={() => window.location.reload()} 
                                    className="mt-6 bg-neutral-900 hover:bg-neutral-800 text-white w-full rounded-xl"
                                    disabled={timeLeft !== null && timeLeft > 0}
                                >
                                    {timeLeft !== null && timeLeft > 0 ? 'Wait to Refresh' : 'Refresh & Try Again'}
                                </Button>
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

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
