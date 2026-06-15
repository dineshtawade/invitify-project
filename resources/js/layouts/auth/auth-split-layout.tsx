import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative min-h-screen grid lg:grid-cols-12 bg-neutral-50 dark:bg-neutral-950 transition-colors overflow-hidden">
            
            {/* Left Side Panel (Desktop only - hidden on mobile) */}
            <div className="col-span-5 hidden lg:flex flex-col justify-between p-10 bg-neutral-950 text-white relative border-r border-neutral-900 overflow-hidden select-none">
                
                {/* Decorative Glowing Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-blue-500/10 blur-[130px] z-0 pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-indigo-500/10 blur-[130px] z-0 pointer-events-none"></div>
                
                {/* Decorative Dot Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none z-0"></div>

                {/* Top Header Logo */}
                <Link href={home()} className="relative z-10 flex items-center gap-2 group self-start">
                    <div className="rounded-lg bg-blue-600 p-2 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-all flex items-center justify-center">
                        <AppLogoIcon className="size-5 fill-current text-white" />
                    </div>
                    <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Invitify
                    </span>
                </Link>

                {/* Center Content Section */}
                <div className="relative z-10 my-auto space-y-8 max-w-sm self-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-950/50 border border-blue-900/40 px-3.5 py-1.5 text-xs font-bold text-blue-400">
                        <Sparkles className="size-3.5" /> Start Crafting Today
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-[1.2] text-white">
                        Create Beautiful <br />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                            Digital Invitations
                        </span>
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                        Design custom wedding invitations and mini websites in minutes. Access gorgeous templates, configure RSVPs, and share your event seamlessly.
                    </p>

                    {/* Smartphone Mockup */}
                    <div className="relative pt-6 max-w-[210px] mx-auto sm:mx-0">
                        <div className="relative rounded-[22px] border-[5px] border-neutral-850 bg-neutral-900 p-1.5 shadow-2xl overflow-hidden aspect-[9/19]">
                            {/* Device Notch */}
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-neutral-900 rounded-full z-20 flex items-center justify-center">
                                <div className="size-1 rounded-full bg-neutral-950 mr-1.5"></div>
                                <div className="w-4 h-0.5 bg-neutral-955 rounded-full"></div>
                            </div>
                            
                            {/* Invitation Screen */}
                            <div className="h-full bg-gradient-to-br from-indigo-900 via-purple-950 to-pink-900 p-3.5 flex flex-col justify-between items-center text-center text-white relative pt-6 rounded-[14px] overflow-hidden select-none">
                                <div className="absolute inset-0 bg-black/15"></div>
                                <div className="z-10 mt-1">
                                    <span className="text-[5px] uppercase tracking-widest font-bold opacity-80">Wedding Invitation</span>
                                    <h4 className="font-serif text-[10px] font-bold mt-0.5 text-white leading-tight">Priya & Karan</h4>
                                    <p className="text-[5px] opacity-75 mt-0.5">Are getting married</p>
                                </div>
                                <div className="z-10 my-2 bg-white/10 backdrop-blur-xs rounded-lg p-1.5 w-full border border-white/10 shadow-lg">
                                    <p className="text-[7px] font-bold">December 28, 2026</p>
                                    <p className="text-[5px] opacity-75 mt-0.5">The Gateway Palace</p>
                                </div>
                                <div className="z-10 w-full mb-1">
                                    <div className="h-4 rounded bg-white text-neutral-950 text-[5px] font-bold flex items-center justify-center shadow-md">
                                        View Invitation
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <div className="absolute -right-10 top-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1 text-[9px] font-bold shadow-lg text-white flex items-center gap-1 transform rotate-3 z-20">
                            <CheckCircle2 className="size-3 text-emerald-450" /> Live RSVP Tracker
                        </div>
                        <div className="absolute -left-12 bottom-16 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1 text-[9px] font-bold shadow-lg text-white flex items-center gap-1 transform -rotate-3 z-20">
                            <Sparkles className="size-3 text-pink-400" /> 100+ Templates
                        </div>
                    </div>
                </div>

                {/* Footer Copy */}
                <div className="relative z-10 text-[10px] font-semibold text-neutral-500">
                    &copy; {new Date().getFullYear()} Avinya Digitech Private Limited.
                </div>
            </div>

            {/* Right Side Form (All devices) */}
            <div className="col-span-7 flex flex-col justify-center items-center p-6 sm:p-10 md:p-16 min-h-screen relative">
                
                {/* Background ambient light */}
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none dark:bg-blue-600/5 z-0"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none dark:bg-indigo-600/5 z-0"></div>
                
                {/* Header for Mobile Devices */}
                <div className="w-full max-w-md flex justify-between items-center mb-8 lg:hidden z-10">
                    <Link href={home()} className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="size-3.5" /> Back
                    </Link>
                    <Link href={home()} className="flex items-center gap-1.5 font-serif text-lg font-black tracking-tight text-blue-600 dark:text-blue-400">
                        <AppLogoIcon className="size-6 fill-current" />
                        Invitify
                    </Link>
                </div>

                {/* Back to Home Link for Desktop Devices */}
                <Link href={home()} className="absolute top-8 right-8 hidden lg:flex items-center gap-1.5 text-xs font-bold text-neutral-550 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors z-10">
                    <ArrowLeft className="size-3.5" /> Back to Home
                </Link>

                {/* Main Glass Card Form Container */}
                <div className="w-full max-w-md bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-850 p-6 sm:p-8 rounded-3xl shadow-xl shadow-neutral-100/40 dark:shadow-none relative z-10 flex flex-col gap-5">
                    <div className="flex flex-col gap-1 border-b border-neutral-100/50 dark:border-neutral-850 pb-4">
                        <h1 className="text-2xl font-serif font-black tracking-tight text-neutral-900 dark:text-white leading-tight">{title}</h1>
                        <p className="text-xs font-semibold text-neutral-450 dark:text-neutral-400 mt-1">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
