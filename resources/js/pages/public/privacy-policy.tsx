import { Head, Link, usePage } from '@inertiajs/react';
import {
    Shield,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    FileText,
    Lock,
    Eye,
    UserCheck,
    Globe,
    CreditCard,
    AlertTriangle
} from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function PrivacyPolicy() {
    const { auth } = usePage().props;

    const sections = [
        {
            id: 'introduction',
            title: '1. Introduction',
            icon: FileText,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    Avinya Digitech Pvt Ltd (“Company”, “We”, “Our”, “Us”) operates{' '}
                    <a href="https://www.theinvitify.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        www.theinvitify.com
                    </a>{' '}
                    (“Platform”). This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
                    By using the Platform, you agree to this Privacy Policy.
                </p>
            ),
        },
        {
            id: 'information-collected',
            title: '2. Information We Collect',
            icon: Eye,
            content: (
                <div className="space-y-4">
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        We collect information from and about our users in various ways when they interact with our Platform.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
                            <h4 className="font-bold text-neutral-800 dark:text-neutral-100 mb-2 text-sm flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-500"></span> Personal Information
                            </h4>
                            <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                                <li>Name</li>
                                <li>Email Address</li>
                                <li>Phone Number</li>
                                <li>Location details</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
                            <h4 className="font-bold text-neutral-800 dark:text-neutral-100 mb-2 text-sm flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-purple-500"></span> Account & Usage Data
                            </h4>
                            <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                                <li>Login credentials</li>
                                <li>Activity on the platform</li>
                                <li>IP address and device information</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
                            <h4 className="font-bold text-neutral-800 dark:text-neutral-100 mb-2 text-sm flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-emerald-500"></span> Payment Information
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Payment details are processed securely via <strong>Razorpay / UPI</strong>.
                                <span className="block mt-1 text-neutral-400 italic">Note: We do not store sensitive card or banking data on our servers.</span>
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
                            <h4 className="font-bold text-neutral-800 dark:text-neutral-100 mb-2 text-sm flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-amber-500"></span> User Content
                            </h4>
                            <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                                <li>Uploaded images & videos</li>
                                <li>Custom invitation details</li>
                                <li>Guest and contact lists</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'how-we-use-information',
            title: '3. How We Use Your Information',
            icon: UserCheck,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300 text-sm">
                    <p className="leading-relaxed">We use the data collected for the following business purposes:</p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-500 dark:text-neutral-400">
                        <li>Create and manage user accounts seamlessly.</li>
                        <li>Provide digital invitation & mini-website customization services.</li>
                        <li>Generate QR codes and shareable event links.</li>
                        <li>Process payments and subscription renewals.</li>
                        <li>Send transactions/account notifications via Email, SMS, or WhatsApp (if applicable).</li>
                        <li>Improve platform performance and user experience.</li>
                        <li>Send optional marketing and promotional communications.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'third-party-services',
            title: '4. Third-Party Services',
            icon: Globe,
            content: (
                <div className="space-y-3">
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        We leverage trusted third-party providers to enhance our service delivery. These external services may collect and process your information in accordance with their respective privacy policies:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            { name: 'Google Analytics', role: 'Traffic & platform analytics' },
                            { name: 'Razorpay / UPI', role: 'Payment gateway integration' },
                            { name: 'Hostinger', role: 'Secure cloud hosting infrastructure' }
                        ].map((provider, i) => (
                            <div key={i} className="p-3.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center">
                                <div className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{provider.name}</div>
                                <div className="text-[11px] text-neutral-400 mt-1">{provider.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'data-sharing',
            title: '5. Data Sharing',
            icon: Shield,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        <strong>We do NOT sell your personal data.</strong> Your trust is our priority.
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        We may share information only under the following circumstances:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 pl-2">
                        <li>With third-party payment gateways (Razorpay) to complete secure transactions.</li>
                        <li>When required by law, regulation, or legal subpoena.</li>
                        <li>To protect the rights, property, and safety of the Company, our users, or others.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'data-security',
            title: '6. Data Security',
            icon: Lock,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    We implement industry-standard physical, electronic, and administrative security measures to guard your information. However, please remember that no transmission method over the Internet or digital storage method is 100% secure.
                </p>
            ),
        },
        {
            id: 'user-content-policy',
            title: '7. User-Generated Content Policy',
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
                            <li>Copyrighted material uploaded without proper owner permission.</li>
                            <li>Obscene, adult, or sexually explicit material.</li>
                        </ul>
                        <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 italic">
                            Violation of these standards may lead to immediate suspension or termination of your account without prior notice.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 'data-retention',
            title: '8. Data Retention',
            icon: FileText,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    We retain your personal data and uploaded content only for as long as is necessary to provide the services you requested, fulfill transaction requirements, or comply with prevailing legal and tax regulations.
                </p>
            ),
        },
        {
            id: 'your-rights',
            title: '9. Your Rights',
            icon: UserCheck,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">Depending on your location, you may have specific rights regarding your personal information:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 pl-2">
                        <li><strong>Access:</strong> Request copies of personal data we hold about you.</li>
                        <li><strong>Correction/Deletion:</strong> Request that we correct inaccurate data or delete your account information completely.</li>
                        <li><strong>Opt-out:</strong> Withdraw consent for marketing emails or promotional notifications.</li>
                    </ul>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        Please contact us via the emails listed in the Contact section to invoke any of your rights.
                    </p>
                </div>
            ),
        },
        {
            id: 'childrens-policy',
            title: '10. Children’s Policy',
            icon: Shield,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    There is no strict age restriction to view invitations or mini websites on our platform. However, to register an account and purchase templates/subscriptions, users must be capable of understanding and accepting our terms and utilizing the platform responsibly.
                </p>
            ),
        },
        {
            id: 'changes-to-policy',
            title: '11. Changes to Policy',
            icon: FileText,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    We reserve the right to modify or update this Privacy Policy at any time. Any updates will be posted directly to this page with a revised "Effective Date". Your continued use of the platform after updates indicates consent.
                </p>
            ),
        },
        {
            id: 'contact-us',
            title: '12. Contact Us',
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
                <title>Privacy Policy | Invitify</title>
                <meta name="description" content="Read the Privacy Policy of Invitify. Learn how we securely collect, use, and protect your personal data when you create invitations and mini websites with us." />
                <meta property="og:title" content="Privacy Policy | Invitify" />
                <meta property="og:description" content="Learn how we securely collect, use, and protect your personal data at Invitify." />
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
                            <Shield className="size-3.5" /> Security & Trust
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-neutral-900 dark:text-white">
                            Privacy Policy
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl">
                            Effective Date: June 13, 2026 | Last Updated: June 13, 2026
                        </p>
                        <div className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 font-medium space-y-0.5">
                            <div>Website: <span className="text-neutral-600 dark:text-neutral-350">www.theinvitify.com</span></div>
                            <div>Company: <span className="text-neutral-600 dark:text-neutral-350">Avinya Digitech Private Limited</span></div>
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
                        </div>
                        <p>© {new Date().getFullYear()} Invitify. Created by Avinya Digitech Pvt Ltd. All rights reserved.</p>
                        <p className="text-[10px] text-neutral-500">Beside Besa-Pimpla Road, Nagpur – 440034</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
