import { Head } from '@inertiajs/react';
import { Mail, ShieldAlert } from 'lucide-react';

interface PageProps {
    title: string;
    reason: string;
}

export default function OfflineSite({ title, reason }: PageProps) {
    return (
        <>
            <Head title={`${title} - Temporarily Offline`} />
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 shadow-xl text-center dark:bg-neutral-900 dark:border-neutral-800 flex flex-col items-center gap-6">
                    
                    <div className="rounded-full bg-amber-50 p-4 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                        <ShieldAlert className="size-10" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold font-serif">{title}</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            This website is temporarily offline or in draft mode.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-150 text-xs text-neutral-600 leading-normal dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-400 w-full">
                        <strong>Status Detail:</strong>
                        <p className="mt-1 font-medium">{reason}</p>
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 w-full flex items-center justify-center gap-1.5 text-xs text-neutral-400 font-semibold">
                        <Mail className="size-4" /> Powered by Invitify
                    </div>
                </div>
            </div>
        </>
    );
}
