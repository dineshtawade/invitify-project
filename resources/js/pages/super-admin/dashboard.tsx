import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Shield, Users, DollarSign, Activity } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin Dashboard',
        href: '/super-admin/dashboard',
    },
];

export default function SuperAdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Super Admin Panel</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Welcome back! Manage users, resellers, partners and monitor platform activity.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Users</p>
                                <h3 className="mt-2 text-2xl font-bold">1,248</h3>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <Users className="size-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pending Approvals</p>
                                <h3 className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">4</h3>
                            </div>
                            <div className="rounded-lg bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <Shield className="size-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Platform Revenue</p>
                                <h3 className="mt-2 text-2xl font-bold">₹1,24,500</h3>
                            </div>
                            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <DollarSign className="size-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Sessions</p>
                                <h3 className="mt-2 text-2xl font-bold">89</h3>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Activity className="size-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-[300px] flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">System Logs & Activity</h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Select options on the sidebar to inspect detailed metrics.</p>
                    <div className="mt-6 flex h-48 items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
                        <span className="text-sm text-neutral-400">Activity monitor is fully operational.</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
