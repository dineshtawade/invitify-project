import { Head, Link, usePage } from '@inertiajs/react';
import { 
    RefreshCw, 
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    FileText, 
    AlertCircle, 
    CheckCircle2, 
    XCircle, 
    Wallet, 
    TrendingUp, 
    Clock, 
    HelpCircle 
} from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function RefundPolicy() {
    const { auth } = usePage().props;

    const sections = [
        {
            id: 'overview',
            title: '1. Overview',
            icon: HelpCircle,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    At TheInvitify, we provide digital services including invitation creation, mini websites, and subscription-based access. Due to the nature of digital products, refunds are limited and governed by this policy.
                </p>
            ),
        },
        {
            id: 'general-policy',
            title: '2. General Refund Policy',
            icon: FileText,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        All purchases made on the platform are non-refundable once the service is successfully delivered.
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        By purchasing any service on our Platform, you explicitly agree to the terms of this Refund Policy.
                    </p>
                </div>
            ),
        },
        {
            id: 'eligible-conditions',
            title: '3. Eligible Refund Conditions',
            icon: CheckCircle2,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">Refunds will <strong>ONLY</strong> be processed under the following strict condition:</p>
                    <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-250 dark:border-emerald-900/30 text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
                        <p className="font-semibold text-emerald-800 dark:text-emerald-400">Verified Technical Issues:</p>
                        <p>If the user has successfully made a payment, but the digital service or template access is not delivered due to a verified internal technical issue from our side.</p>
                        <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-900/50 space-y-1">
                            <p className="font-medium">To initiate a request, users must:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-neutral-500 dark:text-neutral-400 pl-1">
                                <li>Raise a support request within <strong>3 days</strong> of the payment date.</li>
                                <li>Provide payment gateway transaction details and proof of transaction failure.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'non-refundable-cases',
            title: '4. Non-Refundable Cases',
            icon: XCircle,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">Refunds will <strong>NOT</strong> be provided under the following situations:</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            { title: 'Change of Mind', desc: 'Deciding you no longer need the invite or event site after purchase.' },
                            { title: 'Partial Usage', desc: 'Requesting a partial refund for unused subscription days or tools.' },
                            { title: 'Incorrect Data Entry', desc: 'Typographical errors or mistakes made during template customization.' },
                            { title: 'Personal Expectation', desc: 'Dissatisfaction due to subjective personal design tastes or expectations.' },
                            { title: 'Failure to Use Service', desc: 'Failing to share or utilize the generated links or QR codes.' },
                            { title: 'Activated Subscriptions', desc: 'Any hosting subscription that has already been activated and made accessible.' }
                        ].map((item, i) => (
                            <div key={i} className="p-3.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                                <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-xs flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-red-500"></span> {item.title}
                                </h4>
                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'reseller-wallet',
            title: '5. Reseller Wallet Policy',
            icon: Wallet,
            content: (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1.5">
                    <p>Wallet systems are governed by these strict operational rules:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1 font-medium text-neutral-700 dark:text-neutral-300">
                        <li>Wallet recharges are strictly non-refundable.</li>
                        <li>Wallet balance is non-transferable between reseller accounts.</li>
                        <li>Wallet funds cannot be withdrawn to external bank accounts.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'influencer-earnings',
            title: '6. Influencer Earnings',
            icon: TrendingUp,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        Earnings and commissions processed through our referral programs are final and non-refundable.
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        All withdrawal requests, schedules, and minimum thresholds are governed strictly by our primary Terms & Conditions document.
                    </p>
                </div>
            ),
        },
        {
            id: 'processing',
            title: '7. Processing of Refunds',
            icon: Clock,
            content: (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-150 dark:border-blue-900/30 text-xs text-neutral-650 dark:text-neutral-350 space-y-2">
                    <p className="leading-relaxed">
                        If a refund is approved by our administration, the transaction will be processed accordingly:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                        <li>Refunds are processed within <strong>7–10 working days</strong> from the date of approval.</li>
                        <li>The refund will be credited directly back to the <strong>original payment method</strong> used during checkout.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'contact',
            title: '8. Contact for Refund Requests',
            icon: Mail,
            content: (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-200/40 dark:border-blue-900/30">
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-3 text-sm">Avinya Digitech Pvt Ltd</h4>
                    <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                        <p className="flex items-center gap-2">
                            <Mail className="size-4 text-blue-500 shrink-0" />
                            <a href="mailto:support@avinyadigitech.in" className="hover:underline text-blue-600 dark:text-blue-400 font-medium">
                                support@avinyadigitech.in
                            </a>
                        </p>
                        <p className="flex items-center gap-2">
                            <Phone className="size-4 text-blue-500 shrink-0" />
                            <a href="tel:+919004261009" className="hover:underline">
                                +91 9004261009
                            </a>
                        </p>
                    </div>
                </div>
            ),
        }
    ];

    return (
        <>
            <Head>
                <title>Refund & Cancellation Policy | Invitify</title>
                <meta name="description" content="Understand the Refund and Cancellation Policy of Invitify. Read our terms regarding payments for premium invitation templates, business cards, and subscriptions." />
                <meta property="og:title" content="Refund & Cancellation Policy | Invitify" />
                <meta property="og:description" content="Read our terms regarding payments, cancellations, and refunds for premium digital products at Invitify." />
            </Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />


            <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans dark:bg-neutral-950 dark:text-neutral-50 transition-colors">
                
                {/* Header Navbar */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-neutral-200/50 dark:bg-neutral-950/70 dark:border-neutral-900/50">
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="rounded-lg bg-blue-600 p-2 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                                <ArrowLeft className="size-4" />
                            </div>
                            <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                                Invitify
                            </span>
                        </Link>

                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="text-sm font-semibold text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                                >
                                    Log in
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero / Banner */}
                <div className="relative overflow-hidden bg-white dark:bg-neutral-900 border-b border-neutral-200/50 dark:border-neutral-900 py-12 sm:py-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
                    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center gap-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/30 dark:border-blue-900/20 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <RefreshCw className="size-3.5" /> Return & Payout Policies
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-neutral-900 dark:text-white">
                            Refund Policy
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl">
                            Effective Date: June 15, 2026 | Last Updated: June 15, 2026
                        </p>
                        <div className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 font-medium space-y-0.5">
                            <div>Website: <span className="text-neutral-600 dark:text-neutral-350">www.theinvitify.com</span></div>
                            <div>Company: <span className="text-neutral-600 dark:text-neutral-350">Avinya Digitech Pvt Ltd</span></div>
                        </div>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
                    <div className="grid gap-10 lg:grid-cols-12 items-start">
                        
                        {/* Sticky Left Sidebar Navigation */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 hidden lg:block space-y-4">
                            <div className="p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-900 bg-white dark:bg-neutral-900/60 backdrop-blur-xs">
                                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                                    Table of Contents
                                </h3>
                                <nav className="space-y-1">
                                    {sections.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                        >
                                            <section.icon className="size-3.5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                                            <span className="truncate">{section.title.split('. ')[1]}</span>
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="lg:col-span-8 space-y-10">
                            {sections.map((section) => (
                                <section 
                                    key={section.id} 
                                    id={section.id} 
                                    className="p-6 sm:p-8 rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-900 dark:bg-neutral-900/40 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-4 mb-5">
                                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <section.icon className="size-5" />
                                        </div>
                                        <h2 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <div className="text-sm">
                                        {section.content}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Section */}
                <footer className="bg-white border-t border-neutral-200/50 py-10 text-center text-xs text-neutral-400 dark:bg-neutral-950 dark:border-neutral-900 mt-20">
                    <div className="max-w-6xl mx-auto px-6 space-y-4">
                        <div className="flex justify-center gap-6 text-neutral-500 dark:text-neutral-400 font-semibold mb-4 flex-wrap">
                            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                            <Link href="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            <Link href="/terms-and-conditions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms & Conditions</Link>
                            <Link href="/refund-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Refund Policy</Link>
                            <Link href="/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Disclaimer</Link>
                            <Link href="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link>
                        </div>
                        <p>© {new Date().getFullYear()} Invitify. Created with React & Laravel. All rights reserved.</p>
                        <p className="text-[10px] text-neutral-500">Avinya Digitech Pvt Ltd. Beside Besa-Pimpla Road, Nagpur – 440034</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
