import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    Shield, Users, DollarSign, Activity, ArrowUpRight, 
    CheckCircle2, Clock, CreditCard, UserCheck, AlertCircle, Coins
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin Dashboard',
        href: '/super-admin/dashboard',
    },
];

interface TransactionItem {
    id: number;
    user_name: string;
    user_email: string;
    product_name: string;
    amount: number;
    status: string;
    payment_method: string;
    date: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    is_approved: boolean;
    date: string;
}

interface MonthlyRevenue {
    label: string;
    value: number;
}

interface RolesDistribution {
    role: string;
    label: string;
    count: number;
}

interface PageProps {
    stats: {
        total_users: number;
        pending_approvals: number;
        platform_revenue: number;
        active_sessions: number;
        pending_redemptions: number;
        pending_deposits: number;
    };
    recentTransactions: TransactionItem[];
    recentUsers: UserItem[];
    charts: {
        monthly_revenue: MonthlyRevenue[];
        roles_distribution: RolesDistribution[];
    };
}

export default function SuperAdminDashboard({ stats, recentTransactions = [], recentUsers = [], charts }: PageProps) {
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

    // Revenue chart calculations
    const revenueData = charts?.monthly_revenue || [];
    const maxRevenue = Math.max(...revenueData.map(d => d.value), 1000);
    const revenueChartWidth = 600;
    const revenueChartHeight = 220;
    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;
    const plotWidth = revenueChartWidth - paddingLeft - paddingRight;
    const plotHeight = revenueChartHeight - paddingTop - paddingBottom;

    const points = revenueData.map((d, i) => {
        const x = paddingLeft + (i / Math.max(revenueData.length - 1, 1)) * plotWidth;
        const y = paddingTop + (1 - d.value / maxRevenue) * plotHeight;
        return { x, y, label: d.label, value: d.value };
    });

    let linePath = '';
    let areaPath = '';
    if (points.length > 0) {
        linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
        areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`;
    }

    // Role Distribution chart calculations
    const roleData = charts?.roles_distribution || [];
    const maxCount = Math.max(...roleData.map(d => d.count), 5);
    const barChartHeight = 220;
    const barChartWidth = 400;
    const barPlotWidth = barChartWidth - 40 - 20;
    const barPlotHeight = barChartHeight - 20 - 40;

    const roleColors: Record<string, string> = {
        super_admin: 'from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700',
        reseller: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
        referral_partner: 'from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700',
        customer: 'from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700',
    };

    const roleTextColors: Record<string, string> = {
        super_admin: 'text-indigo-600 dark:text-indigo-400',
        reseller: 'text-blue-600 dark:text-blue-400',
        referral_partner: 'text-amber-600 dark:text-amber-400',
        customer: 'text-emerald-600 dark:text-emerald-400',
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 bg-neutral-50/50 dark:bg-neutral-950/20">
                {/* Dashboard Title & Operational Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-5">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">Super Admin Panel</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Real-time health, transaction monitoring and partner statistics.</p>
                    </div>
                    <div className="flex items-center gap-2 self-start rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-1.5 border border-emerald-200/50 dark:border-emerald-900/30">
                        <span className="relative flex size-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">System Fully Operational</span>
                    </div>
                </div>

                {/* Critical Attention / Alert Banner */}
                {(stats.pending_approvals > 0 || stats.pending_deposits > 0 || stats.pending_redemptions > 0) && (
                    <div className="flex flex-col gap-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 p-4">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                            <AlertCircle className="size-5 shrink-0" />
                            <h4 className="font-semibold text-sm">Action Required</h4>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            You have pending operations waiting for approval. Please complete them to keep the user balances and access up to date.
                        </p>
                        <div className="flex flex-wrap gap-2.5 mt-1">
                            {stats.pending_approvals > 0 && (
                                <Link 
                                    href="/super-admin/users" 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white font-medium text-xs hover:bg-amber-600 transition"
                                >
                                    <UserCheck className="size-3.5" /> Approve Users ({stats.pending_approvals})
                                </Link>
                            )}
                            {stats.pending_deposits > 0 && (
                                <Link 
                                    href="/super-admin/resellers" 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white font-medium text-xs hover:bg-amber-600 transition"
                                >
                                    <Coins className="size-3.5" /> Manual Deposits ({stats.pending_deposits})
                                </Link>
                            )}
                            {stats.pending_redemptions > 0 && (
                                <Link 
                                    href="/super-admin/wallets" 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white font-medium text-xs hover:bg-amber-600 transition"
                                >
                                    <CreditCard className="size-3.5" /> Redemptions ({stats.pending_redemptions})
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Primary Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Users */}
                    <Link 
                        href="/super-admin/users"
                        className="group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-450 dark:text-neutral-500">Total Registered Users</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">{stats.total_users}</h3>
                            </div>
                            <div className="rounded-xl bg-blue-50 p-3.5 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 group-hover:scale-110 transition duration-300">
                                <Users className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    </Link>

                    {/* Pending Approvals */}
                    <Link 
                        href="/super-admin/users"
                        className="group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-450 dark:text-neutral-500">Pending Approvals</p>
                                <h3 className={`mt-2 text-3xl font-extrabold ${stats.pending_approvals > 0 ? 'text-amber-600 dark:text-amber-400 animate-pulse' : 'text-neutral-900 dark:text-neutral-50'}`}>
                                    {stats.pending_approvals}
                                </h3>
                            </div>
                            <div className={`rounded-xl p-3.5 group-hover:scale-110 transition duration-300 ${
                                stats.pending_approvals > 0 
                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-450' 
                                    : 'bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-450'
                            }`}>
                                <Shield className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                    </Link>

                    {/* Platform Revenue */}
                    <Link 
                        href="/super-admin/transactions"
                        className="group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-450 dark:text-neutral-500">Total Revenue</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">{formatCurrency(stats.platform_revenue)}</h3>
                            </div>
                            <div className="rounded-xl bg-emerald-50 p-3.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 group-hover:scale-110 transition duration-300">
                                <DollarSign className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    </Link>

                    {/* Active Sessions */}
                    <Link 
                        href="/super-admin/users"
                        className="group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-450 dark:text-neutral-500">Active Sessions</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">{stats.active_sessions}</h3>
                            </div>
                            <div className="rounded-xl bg-purple-50 p-3.5 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 group-hover:scale-110 transition duration-300">
                                <Activity className="size-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    </Link>
                </div>

                {/* Analytical Charts Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Line Area Chart: Revenue Trend */}
                    <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Revenue History</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Completed platform sales for the last 6 months.</p>
                            </div>
                            <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md">
                                Max: {formatCurrency(maxRevenue)}
                            </span>
                        </div>

                        <div className="relative mt-6 flex justify-center">
                            {/* Native Custom Interactive SVG Chart */}
                            <svg 
                                viewBox={`0 0 ${revenueChartWidth} ${revenueChartHeight}`} 
                                className="w-full h-auto select-none overflow-visible"
                            >
                                <defs>
                                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.00" />
                                    </linearGradient>
                                </defs>

                                {/* Y-Axis grid lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                    const y = paddingTop + ratio * plotHeight;
                                    const val = maxRevenue * (1 - ratio);
                                    return (
                                        <g key={index} className="opacity-40 dark:opacity-20">
                                            <line 
                                                x1={paddingLeft} 
                                                y1={y} 
                                                x2={revenueChartWidth - paddingRight} 
                                                y2={y} 
                                                stroke="currentColor" 
                                                strokeDasharray="4 4" 
                                                className="text-neutral-400 dark:text-neutral-600"
                                            />
                                            <text 
                                                x={paddingLeft - 8} 
                                                y={y + 4} 
                                                textAnchor="end" 
                                                className="text-[10px] font-semibold fill-neutral-500 dark:fill-neutral-400"
                                            >
                                                {formatCurrency(val)}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Plotted Area */}
                                {areaPath && (
                                    <path d={areaPath} fill="url(#areaGrad)" />
                                )}

                                {/* Plotted line */}
                                {linePath && (
                                    <path 
                                        d={linePath} 
                                        fill="none" 
                                        stroke="rgb(79, 70, 229)" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                    />
                                )}

                                {/* X-Axis labels & points */}
                                {points.map((p, idx) => (
                                    <g key={idx}>
                                        <line 
                                            x1={p.x} 
                                            y1={paddingTop} 
                                            x2={p.x} 
                                            y2={paddingTop + plotHeight} 
                                            stroke="currentColor" 
                                            strokeWidth="1" 
                                            className="text-neutral-200 dark:text-neutral-800 opacity-20 hover:opacity-100 transition-opacity" 
                                        />
                                        
                                        <circle 
                                            cx={p.x} 
                                            cy={p.y} 
                                            r="4.5" 
                                            fill="rgb(79, 70, 229)" 
                                            stroke="white" 
                                            strokeWidth="1.5"
                                            className="cursor-pointer hover:r-6 transition-all duration-150"
                                            onMouseEnter={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setHoveredPoint({
                                                    x: p.x,
                                                    y: p.y,
                                                    label: p.label,
                                                    value: p.value
                                                });
                                            }}
                                            onMouseLeave={() => setHoveredPoint(null)}
                                        />

                                        <text 
                                            x={p.x} 
                                            y={paddingTop + plotHeight + 18} 
                                            textAnchor="middle" 
                                            className="text-[10px] font-bold fill-neutral-500 dark:fill-neutral-450"
                                        >
                                            {p.label}
                                        </text>
                                    </g>
                                ))}

                                {/* Interactive Tooltip Overlay inside SVG */}
                                {hoveredPoint && (
                                    <g>
                                        <rect 
                                            x={Math.max(paddingLeft, hoveredPoint.x - 65)} 
                                            y={hoveredPoint.y - 40} 
                                            width="130" 
                                            height="32" 
                                            rx="6" 
                                            fill="rgba(15, 23, 42, 0.95)" 
                                            className="shadow-xl"
                                        />
                                        <text 
                                            x={Math.max(paddingLeft + 65, hoveredPoint.x)} 
                                            y={hoveredPoint.y - 20} 
                                            textAnchor="middle" 
                                            fill="white" 
                                            className="text-[10px] font-extrabold"
                                        >
                                            {hoveredPoint.label}: {formatCurrency(hoveredPoint.value)}
                                        </text>
                                    </g>
                                )}
                            </svg>
                        </div>
                    </div>

                    {/* Bar Chart: User Roles Distribution */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs">
                        <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">User Breakdown</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total accounts distribution by user roles.</p>
                        </div>

                        <div className="mt-6 flex flex-col justify-between h-[220px]">
                            <div className="flex-1 flex flex-col justify-center gap-3.5">
                                {roleData.map((item, idx) => {
                                    const percent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                                    return (
                                        <div key={idx} className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300">
                                                <span className="flex items-center gap-1.5">
                                                    <span className={`size-2.5 rounded-full bg-gradient-to-br ${roleColors[item.role]}`}></span>
                                                    {item.label}
                                                </span>
                                                <span className="font-extrabold">{item.count}</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full bg-gradient-to-r ${roleColors[item.role]} transition-all duration-500`}
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lists Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Transactions list */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Recent Transactions</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Latest client purchases across all templates.</p>
                            </div>
                            <Link 
                                href="/super-admin/transactions" 
                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                View all <ArrowUpRight className="size-3.5" />
                            </Link>
                        </div>
                        <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[350px] overflow-y-auto pr-1">
                            {recentTransactions.length === 0 ? (
                                <div className="py-8 text-center text-xs text-neutral-450">No transaction logs available.</div>
                            ) : (
                                recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-neutral-50/40 dark:hover:bg-neutral-800/10 px-2 rounded-lg transition">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-extrabold text-xs">
                                                {getInitials(tx.user_name)}
                                            </div>
                                            <div>
                                                <div className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">{tx.user_name}</div>
                                                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold">{tx.product_name}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-neutral-900 dark:text-neutral-100">{formatCurrency(tx.amount)}</div>
                                            <div className="flex items-center gap-1 justify-end text-[9px] text-neutral-400 font-semibold mt-0.5">
                                                <Clock className="size-3" /> {tx.date}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Registrations list */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Recent Registrations</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Newly registered user and partner accounts.</p>
                            </div>
                            <Link 
                                href="/super-admin/users" 
                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Manage Users <ArrowUpRight className="size-3.5" />
                            </Link>
                        </div>
                        <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[350px] overflow-y-auto pr-1">
                            {recentUsers.length === 0 ? (
                                <div className="py-8 text-center text-xs text-neutral-450">No recent registration records.</div>
                            ) : (
                                recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-neutral-50/40 dark:hover:bg-neutral-800/10 px-2 rounded-lg transition">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-extrabold text-xs">
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <div className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                                                    {user.name}
                                                    {user.is_approved ? (
                                                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                                                    ) : (
                                                        <span className="size-2.5 rounded-full bg-amber-500 animate-pulse" title="Pending Approval"></span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${roleTextColors[user.role] || 'text-neutral-500'} bg-neutral-100 dark:bg-neutral-800`}>
                                                {user.role.replace('_', ' ')}
                                            </span>
                                            <div className="text-[9px] text-neutral-400 font-semibold mt-1">{user.date}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
