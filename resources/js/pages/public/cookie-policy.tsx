import { Head, Link, usePage } from '@inertiajs/react';
import {
    FileText,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    HelpCircle,
    Activity,
    ShieldAlert,
    Settings,
    CheckCircle2,
    RefreshCw,
    AlertTriangle
} from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function CookiePolicy() {
    const { auth } = usePage().props;

    const sections = [
        {
            id: 'what-are-cookies',
            title: '1. What Are Cookies',
            icon: HelpCircle,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    Cookies are small text files stored on your device (computer, tablet, or smartphone) when you visit a website. They are widely used to make websites work more efficiently, improve your browsing experience, and provide analytical information to website owners.
                </p>
            ),
        },
        {
            id: 'how-we-use',
            title: '2. How We Use Cookies',
            icon: Activity,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300 text-sm">
                    <p className="leading-relaxed">We use cookies to enhance your experience on our Platform by:</p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-500 dark:text-neutral-400">
                        <li>Understanding user behavior and preferences on the Platform.</li>
                        <li>Improving overall website performance and loading speeds.</li>
                        <li>Providing a personalized and seamless user experience.</li>
                        <li>Analyzing platform traffic and usage metrics using Google Analytics.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'types-of-cookies',
            title: '3. Types of Cookies We Use',
            icon: Settings,
            content: (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 space-y-2">
                        <h4 className="font-bold text-neutral-800 dark:text-neutral-100 text-sm flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-blue-500"></span> a) Essential Cookies
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            These cookies are strictly necessary for the proper functioning of our website. They enable core utilities such as user login authentication, navigation routing, and session management. Without these cookies, our services cannot be fully accessed.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 space-y-2">
                        <h4 className="font-bold text-neutral-800 dark:text-neutral-100 text-sm flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-indigo-500"></span> b) Analytics Cookies
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            We use cookies provided by Google Analytics to help us measure how visitors interact with platform content. These cookies collect anonymous information about:
                        </p>
                        <ul className="list-disc list-inside text-[11px] text-neutral-450 dark:text-neutral-400 pl-2 space-y-1">
                            <li>Specific pages visited.</li>
                            <li>User interactions and time spent on page blocks.</li>
                            <li>Device viewports, traffic sources, and geographical categories.</li>
                        </ul>
                    </div>
                </div>
            ),
        },
        {
            id: 'third-party-cookies',
            title: '4. Third-Party Cookies',
            icon: ShieldAlert,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    Some cookies stored on your device may be set by third-party services integrated into our Platform, such as Google Analytics. These third parties may collect and process anonymous user data in accordance with their own independent privacy policies.
                </p>
            ),
        },
        {
            id: 'managing-cookies',
            title: '5. Managing Cookies',
            icon: Settings,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">You have full control over cookie storage. Through your web browser, you can:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-550 dark:text-neutral-450 pl-2">
                        <li>Disable or reject cookie storage entirely through browser settings.</li>
                        <li>Delete existing cookies stored on your device storage at any time.</li>
                    </ul>
                    <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed flex items-start gap-2">
                        <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                            <strong>Note:</strong> Disabling cookies completely may affect your experience, and some platform features (such as staying logged into your dashboard) may not function as intended.
                        </span>
                    </div>
                </div>
            ),
        },
        {
            id: 'consent',
            title: '6. Consent',
            icon: CheckCircle2,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    By accessing and using our Platform, you explicitly consent to the use of cookies and other tracking technologies in accordance with the terms of this Cookie Policy.
                </p>
            ),
        },
        {
            id: 'updates',
            title: '7. Updates to Policy',
            icon: RefreshCw,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    We reserve the right to modify or update this Cookie Policy at any time. Any changes will be updated directly on this page with a revised "Effective Date" at the top.
                </p>
            ),
        },
        {
            id: 'contact',
            title: '8. Contact',
            icon: Mail,
            content: (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-200/40 dark:border-blue-900/30">
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-3 text-sm">Avinya Digitech Pvt Ltd</h4>
                    <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                        <p className="flex items-start gap-2 leading-relaxed">
                            <MapPin className="size-4 text-blue-500 shrink-0 mt-0.5" />
                            <span>173, New Vasundhara Society,<br />Besa-Pimpla Road, Nagpur – 440034</span>
                        </p>
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
                <title>Cookie Policy | Invitify</title>
                <meta name="description" content="Invitify Cookie Policy. Learn how we use cookies to improve your experience while creating beautiful wedding invitations and mini websites online." />
                <meta property="og:title" content="Cookie Policy | Invitify" />
                <meta property="og:description" content="Learn how Invitify uses cookies to improve your browsing and template creation experience." />
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
                            <Settings className="size-3.5" /> Cookie Settings & Data
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-neutral-900 dark:text-white">
                            Cookie Policy
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl">
                            Effective Date: June 15, 2026 | Last Updated: June 15, 2026
                        </p>
                        <div className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 font-medium space-y-0.5">
                            <div>Website: <span className="text-neutral-600 dark:text-neutral-350">www.theinvitify.com</span></div>
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
