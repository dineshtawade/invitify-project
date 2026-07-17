import { Head, Link, usePage } from '@inertiajs/react';
import {
    FileText,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Shield,
    Lock,
    HelpCircle,
    Settings,
    CreditCard,
    Wallet,
    AlertTriangle,
    UserCheck,
    Briefcase,
    Scale,
    RefreshCw
} from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function TermsAndConditions() {
    const { auth } = usePage().props;

    const sections = [
        {
            id: 'acceptance',
            title: '1. Acceptance of Terms',
            icon: Shield,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    By accessing and using{' '}
                    <a href="https://www.theinvitify.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        www.theinvitify.com
                    </a>{' '}
                    (“Platform”), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Platform.
                </p>
            ),
        },
        {
            id: 'services',
            title: '2. Services Offered',
            icon: Briefcase,
            content: (
                <div className="space-y-3">
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        Invitify provides a variety of digital design and hosting services, including but not limited to:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            'Digital invitation creation & templates',
                            'Single-page responsive Mini Websites',
                            'Custom QR code generation',
                            'Subscription-based event hosting services',
                            'Reseller & Influencer earning systems'
                        ].map((srv, i) => (
                            <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2 font-medium">
                                <span className="size-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                {srv}
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'responsibilities',
            title: '3. User Responsibilities',
            icon: UserCheck,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">As a condition of your use of the Platform, you agree to:</p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <li>Provide accurate, current, and complete information during registration and customize processes.</li>
                        <li>Maintain the security of your account credentials and immediately notify us of any unauthorized usage.</li>
                        <li>Not misuse the Platform, attempt unauthorized access, or interfere with its system integrity.</li>
                        <li>Not upload, post, or share any restricted, illegal, or unauthorized content.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'pricing',
            title: '4. Subscription & Pricing',
            icon: CreditCard,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        Certain services on the Platform are provided on a subscription or pay-per-use basis (e.g., daily hosting rates or fixed template pricing).
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        We reserve the right to modify pricing schedules, subscription packages, and payment terms at any time without prior notice. Continued usage of our services after pricing adjustments constitutes acceptance.
                    </p>
                </div>
            ),
        },
        {
            id: 'payments',
            title: '5. Payments',
            icon: CreditCard,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    All financial transactions, subscriptions, and template purchases are processed securely via third-party payment gateways, including <strong>Razorpay and UPI</strong>. By placing an order, you agree to pay the stated prices along with any applicable transaction or convenience fees levied by the payment gateway providers.
                </p>
            ),
        },
        {
            id: 'refunds',
            title: '6. Refund Policy',
            icon: RefreshCw,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">Our digital assets and subscriptions are governed by the following refund policy:</p>
                    <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <p>
                            <strong className="text-amber-700 dark:text-amber-400">Technical Non-Delivery:</strong> Refunds are applicable <strong>ONLY</strong> if services are not successfully delivered or rendered due to internal technical errors on our Platform.
                        </p>
                        <p>
                            <strong className="text-neutral-800 dark:text-neutral-250">Digital Asset Delivery:</strong> Since our services are purely digital and accessed instantly, delivered card designs or active website hosting plans are non-refundable once unlocked.
                        </p>
                        <p>
                            <strong className="text-red-700 dark:text-red-400">Reseller Wallet Deposits:</strong> Recharges or manual deposits made into Reseller Wallets are strictly non-refundable, non-transferable, and non-withdrawable.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 'wallet',
            title: '7. Wallet System (Reseller & Influencer)',
            icon: Wallet,
            content: (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 space-y-2.5">
                        <h4 className="font-bold text-neutral-800 dark:text-neutral-100 text-sm">a) Wallet Usage</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            Credits added or earned in your account wallets can only be redeemed within the Platform to purchase template cards, mini-website packages, or hosting extensions. Wallet credits cannot be withdrawn to external bank accounts, transferred to other users, or cashed out.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 space-y-2.5">
                        <h4 className="font-bold text-neutral-800 dark:text-neutral-100 text-sm">b) Wallet Expiry</h4>
                        <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                            <li><strong>Influencer credits:</strong> Unused credits expire automatically after <strong>90 days</strong> from the date of credit.</li>
                            <li><strong>Reseller credits:</strong> Credits expire after <strong>365 days of complete inactivity</strong>. Active reseller accounts will continue to retain their credits.</li>
                        </ul>
                    </div>
                </div>
            ),
        },
        {
            id: 'withdrawals',
            title: '8. Commission & Withdrawal',
            icon: Wallet,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        Influencer and Reseller earned commissions are processed under the following withdrawal schedule:
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-150 dark:border-blue-900/30 text-center">
                            <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Request Window</span>
                            <span className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-1">1st to 5th of each month</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-150 dark:border-indigo-900/30 text-center">
                            <span className="block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Processing Cycle</span>
                            <span className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-1">7th to 10th (Working Days)</span>
                        </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 italic">
                        Note: Payout processing dates may experience minor delays due to bank holidays or public holidays.
                    </p>
                </div>
            ),
        },
        {
            id: 'content-restrictions',
            title: '9. Content Restrictions',
            icon: AlertTriangle,
            content: (
                <div className="space-y-3">
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        Users are strictly prohibited from uploading, posting, or transmitting content that falls under the following categories:
                    </p>
                    <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/30 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1">
                        <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Strictly Prohibited:</p>
                        <ul className="list-disc list-inside pl-1 space-y-1">
                            <li>Illegal or unauthorized content.</li>
                            <li>Adult or obscene content.</li>
                            <li>Copyrighted material without proper owner rights or permissions.</li>
                        </ul>
                        <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 italic">
                            Violation of these standards will lead to immediate account suspension or termination, and potentially legal action.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 'intellectual-property',
            title: '10. Intellectual Property',
            icon: Scale,
            content: (
                <div className="space-y-2.5 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        All content, code, custom template files, design parameters, graphics, logos, and hosting technologies compiled on the Platform are the intellectual property of <strong>Avinya Digitech Pvt Ltd</strong> and are protected by applicable trademark, copyright, and patent laws.
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        Users retain full rights to their uploaded text details, custom photos, and event materials, but grant Invitify a non-exclusive, worldwide, royalty-free license to host, display, and distribute this content solely to deliver our services.
                    </p>
                </div>
            ),
        },
        {
            id: 'termination',
            title: '11. Account Termination',
            icon: AlertTriangle,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    We reserve the right, in our sole discretion, to suspend or terminate your account access to the Platform at any time, without notice or liability, for violations of our policies, fraudulent transactions, or any activity that harms or threatens to harm the operational integrity of the Platform.
                </p>
            ),
        },
        {
            id: 'liability',
            title: '12. Limitation of Liability',
            icon: Lock,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        In no event shall Avinya Digitech Pvt Ltd, its directors, employees, or third-party service providers be liable to you for:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-neutral-550 dark:text-neutral-450 pl-2">
                        <li>Accidental data loss, service outages, or temporary interruptions.</li>
                        <li>Any indirect, incidental, or consequential damages resulting from Platform use.</li>
                        <li>Failures, server latency, or outages from our third-party infrastructure hosts (e.g., Hostinger).</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'jurisdiction',
            title: '13. Jurisdiction',
            icon: Scale,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising from or relating to the use of the Platform shall be subject to the exclusive jurisdiction of the courts located in <strong>Nagpur, Maharashtra, India</strong>.
                </p>
            ),
        },
        {
            id: 'modifications',
            title: '14. Modifications to Terms',
            icon: FileText,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    We may update or revise these Terms & Conditions at any time to reflect changing regulations or platform functionalities. The updated version will be published here with an updated "Effective Date". Your continued use of the Platform after changes are published constitutes your acceptance of the revised terms.
                </p>
            ),
        },
        {
            id: 'contact',
            title: '15. Contact Information',
            icon: Mail,
            content: (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-200/40 dark:border-blue-900/30">
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-3 text-sm">Avinya Digitech Private Limited</h4>
                    <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                        <p className="flex items-start gap-2 leading-relaxed">
                            <MapPin className="size-4 text-blue-500 shrink-0 mt-0.5" />
                            <span>173, New Vasundhara Society,<br />Besa-Pimpla Road, Nagpur – 440034</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail className="size-4 text-blue-500 shrink-0" />
                            <a href="mailto:support@avinyadigitech.in" className="hover:underline text-blue-600 dark:text-blue-400">
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
                <title>Terms & Conditions | Invitify</title>
                <meta name="description" content="Review the Terms and Conditions for using Invitify. Find out our guidelines for creating digital business cards, wedding invitations, and mini websites." />
                <meta property="og:title" content="Terms & Conditions | Invitify" />
                <meta property="og:description" content="Review the guidelines and rules for using Invitify's digital templates and services." />
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
                            <FileText className="size-3.5" /> Platform Rules & Policies
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-neutral-900 dark:text-white">
                            Terms & Conditions
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl">
                            Effective Date: June 13, 2026 | Last Updated: June 13, 2026
                        </p>
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
                        <p>© {new Date().getFullYear()} Invitify. Created by Avinya Digitech Pvt Ltd. All rights reserved.</p>
                        <p className="text-[10px] text-neutral-500">Beside Besa-Pimpla Road, Nagpur – 440034</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
