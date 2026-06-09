import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin Dashboard',
        href: '/super-admin/dashboard',
    },
    {
        title: 'Manage Users',
        href: '/super-admin/users',
    },
];

interface UsersPageProps {
    users: User[];
}

export default function UsersList({ users }: UsersPageProps) {
    const handleApprove = (userId: number) => {
        router.post(`/super-admin/users/${userId}/approve`);
    };

    const formatRole = (role: string) => {
        if (role === 'reseller') return 'Reseller';
        if (role === 'referral_partner') return 'Referral Partner';
        if (role === 'customer') return 'End User (Customer)';
        return role;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Manage Users & Approvals</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Review newly registered Resellers and Referral Partners, and grant login permissions.</p>
                </div>

                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-semibold uppercase text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">Email</th>
                                    <th scope="col" className="px-6 py-4">Role</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-neutral-400">
                                            No registered users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                {u.name}
                                            </td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                                    {formatRole(u.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.is_approved ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        <ShieldCheck className="size-4" /> Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                                        <ShieldAlert className="size-4" /> Pending Approval
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {!u.is_approved && (
                                                    <Button
                                                        onClick={() => handleApprove(u.id)}
                                                        size="sm"
                                                        className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
