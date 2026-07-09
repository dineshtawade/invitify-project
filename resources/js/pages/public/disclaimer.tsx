import { Head, Link, usePage } from '@inertiajs/react';
import { 
    AlertTriangle, 
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    FileText, 
    HelpCircle, 
    ServerOff, 
    UserCheck, 
    ShieldAlert, 
    ExternalLink, 
    DollarSign, 
    Scale 
} from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function Disclaimer() {
    const { auth } = usePage().props;

    const sections = [
        {
            id: 'general',
            title: '1. General Disclaimer',
            icon: HelpCircle,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    The information and services provided by TheInvitify are for general digital service purposes only. While we strive for accuracy and reliability, we make no guarantees or warranties of any kind, express or implied, regarding the completeness, accuracy, reliability, or suitability of the Platform.
                </p>
            ),
        },
        {
            id: 'availability',
            title: '2. Service Availability',
            icon: ServerOff,
            content: (
                <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        We do not guarantee or warrant:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-neutral-500 dark:text-neutral-400 pl-2">
                        <li>Uninterrupted service at all times.</li>
                        <li>Error-free platform functionalities.</li>
                        <li>Continuous, round-the-clock availability of the Platform.</li>
                    </ul>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        Services may be temporarily offline or unavailable due to system maintenance, critical updates, network latency, or unexpected technical issues.
                    </p>
                </div>
            ),
        },
        {
            id: 'user-responsibility',
            title: '3. User Responsibility',
            icon: UserCheck,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">Users are solely responsible for all actions taken on the Platform, including:</p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <li>Any files, images, details, or other content uploaded on the Platform.</li>
                        <li>The accuracy, validity, and formatting of event details inside invitations.</li>
                        <li>Sharing generated links, websites, or QR codes responsibly and legally.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'content',
            title: '4. Content Disclaimer',
            icon: ShieldAlert,
            content: (
                <div className="space-y-2.5 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        We do not pre-verify or review all user-generated content created on the Platform.
                    </p>
                    <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Therefore, we are not responsible or liable for any user-generated content. Any misuse of the templates, incorrect data displays, or policy violations remain the sole responsibility of the user who published the content.
                    </div>
                </div>
            ),
        },
        {
            id: 'external-links',
            title: '5. External Links Disclaimer',
            icon: ExternalLink,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        Our Platform may contain hyperlinks to external websites, payment gateways, or third-party resources that are not owned or controlled by us.
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        We have no control over, and assume no responsibility for, the content, privacy policies, practices, or security protocols of any third-party websites or services.
                    </p>
                </div>
            ),
        },
        {
            id: 'financial',
            title: '6. Financial Disclaimer',
            icon: DollarSign,
            content: (
                <div className="space-y-2.5 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        We do not guarantee or promise any specific financial income or earnings from participating in our:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-neutral-500 dark:text-neutral-400 pl-2">
                        <li>Reseller program</li>
                        <li>Influencer earning systems</li>
                    </ul>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                        All commissions, earnings, and returns depend entirely on individual marketing performance, efforts, and conversions.
                    </p>
                </div>
            ),
        },
        {
            id: 'liability',
            title: '7. Limitation of Liability',
            icon: AlertTriangle,
            content: (
                <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <p className="leading-relaxed">
                        Under no circumstances shall Avinya Digitech Pvt Ltd, its directors, employees, or partners be liable for:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-neutral-550 dark:text-neutral-450 pl-2">
                        <li>Any loss of data, digital files, or account credentials.</li>
                        <li>Business losses, drop in profits, or loss of goodwill.</li>
                        <li>Temporary platform interruptions or server outages.</li>
                        <li>Any indirect, special, incidental, or consequential damages resulting from Platform use.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'legal-compliance',
            title: '8. Legal Compliance',
            icon: Scale,
            content: (
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    Users are responsible for ensuring that their use of our digital invitation templates and mini-website services complies with the local, national, and international laws applicable to them.
                </p>
            ),
        },
        {
            id: 'contact',
            title: '9. Contact',
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
                <title>Disclaimer | Invitify</title>
                <meta name="description" content="General disclaimer for Invitify. Information regarding the use of our digital invitation templates, mini website builder, and business card services." />
                <meta property="og:title" content="Disclaimer | Invitify" />
                <meta property="og:description" content="General disclaimer and liability limitations for the use of Invitify services." />
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
                            <AlertTriangle className="size-3.5" /> Legal Notice & Limitations
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-neutral-900 dark:text-white">
                            Disclaimer
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
