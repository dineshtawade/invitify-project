import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ShieldAlert, ShieldCheck, Search, Eye, Wallet,
    Calendar, Mail, User, CheckCircle2, XCircle, ArrowRight,
    Tag, Landmark, Globe, Layers, Award
} from 'lucide-react';

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

interface WalletInfo {
    id: number;
    balance: string | number;
    status: string;
}

interface ReferralCodeInfo {
    id: number;
    code: string;
    discount_percentage: number;
    commission_percentage: number;
    is_active: boolean;
}

interface SubscriptionInfo {
    id: number;
    plan_type: string;
    is_active: boolean;
    expires_at: string | null;
}

interface UserDetail {
    id: number;
    name: string;
    email: string;
    role: string;
    is_approved: boolean;
    created_at: string;
    wallet: WalletInfo | null;
    referral_codes: ReferralCodeInfo[];
    subscriptions: SubscriptionInfo[];
    purchased_templates_count: number;
    mini_websites_count: number;
    business_websites_count: number;
    reseller_details: {
        business_name: string;
        mobile_number: string;
        email: string;
        gst_number: string;
        business_address?: string;
    } | null;
    referral_details: {
        city: string;
        email: string;
        phone_number: string;
        social_media?: Array<{
            platform: string;
            username: string;
            followers: number;
        }>;
    } | null;
}

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: LinkItem[];
    from: number;
    to: number;
}

interface UsersPageProps {
    users: PaginationData<UserDetail>;
    filters: {
        search: string;
    };
}

export default function UsersList({ users, filters }: UsersPageProps) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Apply filter search
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/users', { search: searchVal }, { preserveState: true });
    };

    // Reset search
    const handleReset = () => {
        setSearchVal('');
        router.get('/super-admin/users', {}, { preserveState: true });
    };

    const handleApprove = (userId: number) => {
        router.post(`/super-admin/users/${userId}/approve`, {}, {
            onSuccess: (page) => {
                // If a user was open in the modal, update their status in local state too
                if (selectedUser && selectedUser.id === userId) {
                    setSelectedUser({
                        ...selectedUser,
                        is_approved: true
                    });
                }
            }
        });
    };

    const formatRole = (role: string) => {
        if (role === 'reseller') return 'Reseller';
        if (role === 'referral_partner') return 'Referral Partner';
        if (role === 'customer') return 'End User (Customer)';
        return role.replace('_', ' ');
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'reseller':
                return 'bg-blue-50 text-blue-750 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30';
            case 'referral_partner':
                return 'bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-450 dark:border-amber-900/30';
            case 'customer':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30';
            default:
                return 'bg-neutral-50 text-neutral-850 border-neutral-200/60 dark:bg-neutral-900 dark:text-neutral-300';
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (val: string | number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(String(val)));
    };

    const handleViewDetails = (user: UserDetail) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 bg-neutral-50/50 dark:bg-neutral-950/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-5">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">Users & Approvals</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Approve newly registered resellers/partners, review transactions, and audit account states.</p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search by name, email or role..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="pl-10 h-10 w-full bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="submit" size="sm" className="h-10 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl px-5">
                            Filter
                        </Button>
                        {filters.search && (
                            <Button type="button" onClick={handleReset} variant="outline" size="sm" className="h-10 rounded-xl px-4">
                                Clear
                            </Button>
                        )}
                    </div>
                </form>

                {/* Users Table */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className=" text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-850/60 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4">User Details</th>
                                    <th scope="col" className="px-6 py-4">Role</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4">Registration Date</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-450 dark:text-neutral-500">
                                            No registered users found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/15 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-extrabold text-xs">
                                                        {getInitials(u.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-neutral-900 dark:text-neutral-100">{u.name}</div>
                                                        <div className="text-xs text-neutral-450 dark:text-neutral-400 font-medium">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize tracking-wide ${getRoleBadgeClass(u.role)}`}>
                                                    {formatRole(u.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.is_approved ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-450">
                                                        <CheckCircle2 className="size-4" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-450">
                                                        <ShieldAlert className="size-4 animate-pulse" /> Pending Approval
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="size-3.5 text-neutral-405" />
                                                    {formatDate(u.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleViewDetails(u)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 rounded-lg text-xs font-bold border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                                    >
                                                        <Eye className="size-3.5 mr-1" /> View Details
                                                    </Button>
                                                    {!u.is_approved && (
                                                        <Button
                                                            onClick={() => handleApprove(u.id)}
                                                            size="sm"
                                                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 text-xs font-bold rounded-lg"
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {users.total > users.per_page && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                            <div className="text-xs text-neutral-500 dark:text-neutral-450 font-semibold">
                                Showing <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{users.from}</span> to{' '}
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{users.to}</span> of{' '}
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{users.total}</span> users
                            </div>
                            <div className="flex items-center flex-wrap gap-1">
                                {users.links.map((link, idx) => {
                                    // Make links cleaner: Replace &laquo; and &raquo; tags with neat arrows
                                    const cleanLabel = link.label
                                        .replace('&laquo; Previous', '← Prev')
                                        .replace('Next &raquo;', 'Next →');

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="inline-flex h-8 items-center justify-center rounded-lg border border-neutral-200/50 bg-neutral-100/50 px-3 text-xs text-neutral-400 select-none cursor-not-allowed dark:border-neutral-800/40 dark:bg-neutral-850/40"
                                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-bold transition-all ${link.active
                                                ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700'
                                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Slide-out Sheet or Modal for Profile Details */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
                    <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 font-black text-sm">
                                    {getInitials(selectedUser.name)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                                        {selectedUser.name}
                                    </h2>
                                    <p className="text-xs font-medium text-neutral-450 dark:text-neutral-400">{selectedUser.email}</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => { setShowModal(false); setSelectedUser(null); }}
                                variant="ghost"
                                size="sm"
                                className="rounded-xl size-8 p-0"
                            >
                                <XCircle className="size-5 text-neutral-400 hover:text-neutral-600" />
                            </Button>
                        </div>

                        {/* Modal Body (Scrollable content) */}
                        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
                            {/* Grid 1: Basic Info and Role Status */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/20 p-4">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
                                        <User className="size-3.5 text-indigo-600" /> Account Context
                                    </h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-neutral-450">Registered Role:</span>
                                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${getRoleBadgeClass(selectedUser.role)}`}>
                                                {formatRole(selectedUser.role)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-neutral-450">Approval Status:</span>
                                            {selectedUser.is_approved ? (
                                                <span className="text-emerald-600 font-extrabold flex items-center gap-1"><CheckCircle2 className="size-3.5" /> Approved / Active</span>
                                            ) : (
                                                <span className="text-amber-600 font-extrabold flex items-center gap-1 animate-pulse"><ShieldAlert className="size-3.5" /> Pending Review</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-neutral-450">Join Date:</span>
                                            <span className="text-neutral-800 dark:text-neutral-200">{formatDate(selectedUser.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Wallet details */}
                                <div className="rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/20 p-4">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
                                        <Wallet className="size-3.5 text-indigo-600" /> Wallet Balance
                                    </h4>
                                    <div className="flex flex-col justify-center items-center h-full min-h-[60px]">
                                        {selectedUser.wallet ? (
                                            <>
                                                <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
                                                    {formatCurrency(selectedUser.wallet.balance)}
                                                </div>
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-450 mt-1">
                                                    Status: {selectedUser.wallet.status}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-neutral-400 font-medium">No active wallet configured.</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Reseller Details */}
                            {selectedUser.role === 'reseller' && selectedUser.reseller_details && (
                                <div className="rounded-xl border border-neutral-150 dark:border-neutral-800 p-4 bg-blue-50/5 dark:bg-blue-950/5">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                                        <CheckCircle2 className="size-3.5 text-blue-600" /> Reseller Business Profile
                                    </h4>
                                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                                        <div>
                                            <span className="text-neutral-450 font-bold block">Business Name</span>
                                            <span className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm">{selectedUser.reseller_details.business_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-neutral-450 font-bold block">GST Number</span>
                                            <span className="text-neutral-900 dark:text-neutral-100 font-mono font-bold">{selectedUser.reseller_details.gst_number}</span>
                                        </div>
                                        <div>
                                            <span className="text-neutral-450 font-bold block">Contact Email</span>
                                            <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{selectedUser.reseller_details.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-neutral-450 font-bold block">Mobile Number</span>
                                            <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{selectedUser.reseller_details.mobile_number}</span>
                                        </div>
                                        {selectedUser.reseller_details.business_address && (
                                            <div className="sm:col-span-2">
                                                <span className="text-neutral-450 font-bold block">Business Address</span>
                                                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{selectedUser.reseller_details.business_address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Conditional Referral Partner Details */}
                            {selectedUser.role === 'referral_partner' && selectedUser.referral_details && (
                                <div className="rounded-xl border border-neutral-150 dark:border-neutral-800 p-4 bg-amber-50/5 dark:bg-amber-950/5">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-450 mb-3 flex items-center gap-1.5">
                                        <Award className="size-3.5 text-amber-600" /> Referral Partner Profile
                                    </h4>
                                    <div className="grid gap-3 sm:grid-cols-3 text-xs mb-4">
                                        <div>
                                            <span className="text-neutral-450 font-bold block">City</span>
                                            <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{selectedUser.referral_details.city}</span>
                                        </div>
                                        <div>
                                            <span className="text-neutral-450 font-bold block">Contact Email</span>
                                            <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{selectedUser.referral_details.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-neutral-450 font-bold block">Phone Number</span>
                                            <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{selectedUser.referral_details.phone_number}</span>
                                        </div>
                                    </div>

                                    {selectedUser.referral_details.social_media && selectedUser.referral_details.social_media.length > 0 && (
                                        <div className="mt-3">
                                            <span className="text-neutral-450 font-bold text-xs block mb-2">Social Media Accounts</span>
                                            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                                <table className="w-full text-left text-xs text-neutral-500 dark:text-neutral-455">
                                                    <thead className="bg-neutral-50 dark:bg-neutral-850/50 text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-305 border-b border-neutral-200 dark:border-neutral-800">
                                                        <tr>
                                                            <th className="px-4 py-2">Platform</th>
                                                            <th className="px-4 py-2">Username / ID</th>
                                                            <th className="px-4 py-2 text-right">Followers</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                                        {selectedUser.referral_details.social_media.map((social, idx) => (
                                                            <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/15">
                                                                <td className="px-4 py-2 font-bold text-neutral-900 dark:text-neutral-150">{social.platform}</td>
                                                                <td className="px-4 py-2 font-semibold text-indigo-650 dark:text-indigo-400 select-all">{social.username}</td>
                                                                <td className="px-4 py-2 text-right font-bold text-neutral-900 dark:text-neutral-200">
                                                                    {new Intl.NumberFormat('en-IN').format(social.followers)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Grid 2: Platform Stats */}
                            <div className="rounded-xl border border-neutral-150 dark:border-neutral-800 p-4">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-4 flex items-center gap-1.5">
                                    <Award className="size-3.5 text-indigo-600" /> Product Licences & Hosting Activity
                                </h4>
                                <div className="grid gap-3.5 grid-cols-3 text-center">
                                    <div className="bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-100 dark:border-neutral-850 p-3.5 rounded-xl">
                                        <div className="flex justify-center mb-1 text-indigo-650 dark:text-indigo-400"><Layers className="size-5" /></div>
                                        <div className="text-lg font-black text-neutral-900 dark:text-neutral-50">{selectedUser.purchased_templates_count}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 mt-0.5">Purchased Cards</div>
                                    </div>
                                    <div className="bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-100 dark:border-neutral-850 p-3.5 rounded-xl">
                                        <div className="flex justify-center mb-1 text-indigo-650 dark:text-indigo-400"><Globe className="size-5" /></div>
                                        <div className="text-lg font-black text-neutral-900 dark:text-neutral-50">{selectedUser.mini_websites_count}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 mt-0.5">Mini Sites</div>
                                    </div>
                                    <div className="bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-100 dark:border-neutral-850 p-3.5 rounded-xl">
                                        <div className="flex justify-center mb-1 text-indigo-650 dark:text-indigo-400"><Landmark className="size-5" /></div>
                                        <div className="text-lg font-black text-neutral-900 dark:text-neutral-50">{selectedUser.business_websites_count}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 mt-0.5">Business Sites</div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Subscriptions */}
                            <div className="rounded-xl border border-neutral-150 dark:border-neutral-800 p-4">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3.5 text-indigo-600" /> Active Subscription Plans
                                </h4>
                                {selectedUser.subscriptions.length === 0 ? (
                                    <div className="text-xs text-neutral-450 py-2 font-medium">This user is currently on the pay-as-you-go model and has no active subscription package.</div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {selectedUser.subscriptions.map((sub) => (
                                            <div key={sub.id} className="flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/10 p-3 rounded-xl border border-neutral-100 dark:border-neutral-850 text-xs font-semibold">
                                                <div>
                                                    <span className="font-extrabold text-neutral-950 dark:text-neutral-50 uppercase">{sub.plan_type.replace('_', ' ')}</span>
                                                    <div className="text-[10px] text-neutral-400 font-medium mt-0.5">
                                                        {sub.expires_at ? `Expires: ${formatDate(sub.expires_at)}` : 'Lifetime Access'}
                                                    </div>
                                                </div>
                                                {sub.is_active ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50">Active</span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-extrabold text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50">Expired</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Referral Codes (Only visible if Referral Partner) */}
                            {selectedUser.role === 'referral_partner' && (
                                <div className="rounded-xl border border-neutral-150 dark:border-neutral-800 p-4">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
                                        <Tag className="size-3.5 text-indigo-600" /> Active Referral Coupons
                                    </h4>
                                    {selectedUser.referral_codes.length === 0 ? (
                                        <div className="text-xs text-neutral-450 py-2 font-medium">No referral codes configured for this partner yet.</div>
                                    ) : (
                                        <div className="grid gap-2.5 sm:grid-cols-2">
                                            {selectedUser.referral_codes.map((code) => (
                                                <div key={code.id} className="bg-neutral-50/50 dark:bg-neutral-950/10 p-3 rounded-xl border border-neutral-100 dark:border-neutral-850 text-xs flex justify-between items-center font-bold">
                                                    <div>
                                                        <span className="font-extrabold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md text-[11px] select-all tracking-wider">{code.code}</span>
                                                        <div className="text-[10px] text-neutral-400 mt-2 flex flex-col gap-0.5 font-medium">
                                                            <span>Discount: {code.discount_percentage}%</span>
                                                            <span>Commission: {code.commission_percentage}%</span>
                                                        </div>
                                                    </div>
                                                    {code.is_active ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600"><CheckCircle2 className="size-3.5" /> Live</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-neutral-400"><XCircle className="size-3.5" /> Paused</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex items-center justify-end gap-2.5">
                            {!selectedUser.is_approved ? (
                                <>
                                    <Button
                                        onClick={() => { setShowModal(false); setSelectedUser(null); }}
                                        variant="outline"
                                        size="sm"
                                        className="h-9 rounded-xl text-xs font-bold"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => handleApprove(selectedUser.id)}
                                        size="sm"
                                        className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 text-xs font-bold rounded-xl px-5"
                                    >
                                        Approve & Activate Account
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => { setShowModal(false); setSelectedUser(null); }}
                                    size="sm"
                                    className="h-9 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-white text-xs font-bold rounded-xl px-5"
                                >
                                    Close
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
