import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Check, Sparkles, CreditCard, Clock, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
    },
    {
        title: 'Subscriptions',
        href: '/customer/subscriptions',
    },
];

interface Subscription {
    id: number;
    plan_type: string;
    price: string | number;
    starts_at: string;
    expires_at: string | null;
    is_active: boolean;
}

interface PageProps {
    activeSubscription: Subscription | null;
}

export default function SubscriptionsIndex({ activeSubscription }: PageProps) {
    const [selectedPlan, setSelectedPlan] = useState<{ type: string; name: string; price: number } | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const { setData, post, processing } = useForm({
        plan_type: '',
        price: 0,
    });

    const plans = [
        {
            type: 'invitation_pro',
            name: 'Invitation Pro',
            price: 299,
            description: 'Best for personal events, weddings, and party hostings.',
            features: [
                'Create dynamic Single-Page invitation websites',
                'Active Countdown timers & Event details',
                'Live guest RSVP form submission',
                'View & export RSVP list',
                'Standard layout themes',
            ],
            color: 'from-pink-500 to-rose-500',
        },
        {
            type: 'business_pro',
            name: 'Business Pro',
            price: 599,
            description: 'Perfect for professionals, freelancers, and small businesses.',
            features: [
                'Create multi-page Business websites (up to 4 pages)',
                'Home, About, Services, & Contact pages',
                'Functional Customer Contact Form',
                'Manage messages inbox in dashboard',
                'Premium professional themes',
            ],
            color: 'from-blue-500 to-indigo-500',
        },
        {
            type: 'unlimited_bundle',
            name: 'Unlimited Bundle',
            price: 999,
            description: 'Unlimited access to all invitation and business features.',
            features: [
                'Unlimited active single-page invitation sites',
                'Unlimited active multi-page business sites',
                'Priority support & premium visual widgets',
                'Ad-free customer experience',
                'All visual themes unlocked',
            ],
            color: 'from-purple-500 to-pink-500',
            popular: true,
        },
    ];

    const handleOpenCheckout = (plan: typeof plans[0]) => {
        setSelectedPlan({
            type: plan.type,
            name: plan.name,
            price: plan.price,
        });
        setData({
            plan_type: plan.type,
            price: plan.price,
        });
        setIsCheckoutOpen(true);
    };

    const handleConfirmPurchase = () => {
        if (!selectedPlan) return;

        post('/customer/subscriptions', {
            onSuccess: () => {
                setIsCheckoutOpen(false);
                setSelectedPlan(null);
            },
        });
    };

    const formatPlanName = (type: string) => {
        switch (type) {
            case 'invitation_pro': return 'Invitation Pro';
            case 'business_pro': return 'Business Pro';
            case 'unlimited_bundle': return 'Unlimited Bundle';
            default: return type;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscriptions" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        Subscription Plans <Sparkles className="size-6 text-amber-500" />
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Choose a premium plan in Rupees (₹) to publish your dynamic invitation cards or multi-page business websites.
                    </p>
                </div>

                {/* Active Plan Banner */}
                {activeSubscription ? (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="size-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg">Active Subscription</h3>
                                <p className="text-sm opacity-90">
                                    You are currently subscribed to the <span className="font-bold capitalize">{formatPlanName(activeSubscription.plan_type)}</span> plan.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1.5 rounded-full text-emerald-700 dark:text-emerald-300">
                            <Clock className="size-3.5" /> Expires on {new Date(activeSubscription.expires_at!).toLocaleDateString()}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 flex flex-col gap-1">
                        <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">No Active Subscription</h3>
                        <p className="text-sm">You are on the Free Draft tier. You can customize websites but need a plan to publish them live.</p>
                    </div>
                )}

                {/* Plans Grid */}
                <div className="grid gap-8 lg:grid-cols-3 mt-4">
                    {plans.map((p) => {
                        const isActive = activeSubscription?.plan_type === p.type && activeSubscription.is_active;

                        return (
                            <div
                                key={p.type}
                                className={`relative flex flex-col justify-between rounded-3xl border bg-white p-8 shadow-xs dark:bg-neutral-900 ${
                                    isActive
                                        ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20'
                                        : p.popular
                                        ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600/30'
                                        : 'border-neutral-200 dark:border-neutral-800'
                                }`}
                            >
                                {p.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-xs">
                                        Popular Value
                                    </span>
                                )}

                                <div>
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{p.name}</h3>
                                        {isActive && (
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                                                Active Plan
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 min-h-[40px]">{p.description}</p>
                                    
                                    <div className="mt-6 flex items-baseline gap-1 text-neutral-900 dark:text-neutral-50">
                                        <span className="text-4xl font-black tracking-tight">₹{p.price}</span>
                                        <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">/ month</span>
                                    </div>

                                    <ul className="mt-8 space-y-4 border-t border-neutral-100 pt-6 dark:border-neutral-800">
                                        {p.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                                                <div className="rounded-full bg-neutral-100 p-0.5 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 mt-0.5">
                                                    <Check className="size-3.5" />
                                                </div>
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8">
                                    <Button
                                        onClick={() => handleOpenCheckout(p)}
                                        disabled={isActive}
                                        className={`w-full font-bold py-6 text-sm rounded-xl transition-all ${
                                            isActive
                                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 cursor-default'
                                                : p.popular
                                                ? 'bg-gradient-to-r ' + p.color + ' hover:opacity-90 text-white'
                                                : 'bg-neutral-900 hover:bg-neutral-850 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100'
                                        }`}
                                    >
                                        {isActive ? 'Current Plan' : 'Subscribe Now'}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Checkout Confirmation Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Checkout Plan <Sparkles className="size-5 text-amber-500" />
                        </DialogTitle>
                    </DialogHeader>

                    {selectedPlan && (
                        <div className="py-4 flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            <p>You are about to subscribe to the plan: <strong className="text-neutral-950 dark:text-neutral-50">{selectedPlan.name}</strong>.</p>
                            
                            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-950 flex flex-col gap-2 border border-neutral-150 dark:border-neutral-850">
                                <div className="flex justify-between font-medium">
                                    <span>Plan Cost</span>
                                    <span className="text-neutral-950 dark:text-neutral-50">₹{selectedPlan.price}.00</span>
                                </div>
                                <div className="flex justify-between text-xs text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 pt-2">
                                    <span>Billing Cycle</span>
                                    <span>30 days (Auto-expires)</span>
                                </div>
                            </div>

                            <p className="text-xs text-neutral-400 leading-normal">
                                *This is a demo payment simulation. Confirming will create your active monthly subscription automatically.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmPurchase}
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            {processing ? 'Processing...' : 'Confirm Subscription'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
