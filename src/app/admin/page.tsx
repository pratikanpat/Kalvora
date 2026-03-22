'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import {
    Users, FileText, MessageSquare, TrendingUp, Loader2,
    type LucideIcon
} from 'lucide-react';

interface AdminStats {
    totalUsers: number;
    totalProjects: number;
    totalFeedback: number;
    signupsThisWeek: number;
    proposalsThisWeek: number;
    projectsByStatus: Record<string, number>;
    feedbackByType: Record<string, number>;
}

export default function AdminOverviewPage() {
    const { session } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!session?.access_token) return;

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch stats');
                const data = await res.json();
                setStats(data);
            } catch (err) {
                setError('Failed to load admin stats');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [session]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={32} className="animate-spin text-amber-400" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-red-400">{error || 'Something went wrong'}</p>
            </div>
        );
    }

    const statusOrder = ['Draft', 'Sent', 'Approved', 'Paid', 'Completed'];
    const statusColors: Record<string, string> = {
        Draft: 'text-[#8888a0]',
        Sent: 'text-blue-400',
        Approved: 'text-emerald-400',
        Paid: 'text-amber-400',
        Completed: 'text-green-400',
    };

    const feedbackTypeLabels: Record<string, string> = {
        structured: 'Structured (In-app)',
        logout_trigger: 'Logout Modal',
        public_landing: 'Public Landing',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
                <p className="text-[#5a5a70] text-sm">Your Kalvora metrics at a glance</p>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Users}
                    label="Total Users"
                    value={stats.totalUsers}
                    sub={`+${stats.signupsThisWeek} this week`}
                    color="amber"
                />
                <MetricCard
                    icon={FileText}
                    label="Total Proposals"
                    value={stats.totalProjects}
                    sub={`+${stats.proposalsThisWeek} this week`}
                    color="blue"
                />
                <MetricCard
                    icon={MessageSquare}
                    label="Feedback Received"
                    value={stats.totalFeedback}
                    color="emerald"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Approval Rate"
                    value={
                        stats.totalProjects > 0
                            ? `${Math.round(
                                ((stats.projectsByStatus['Approved'] || 0) +
                                    (stats.projectsByStatus['Paid'] || 0) +
                                    (stats.projectsByStatus['Completed'] || 0)) /
                                Math.max(
                                    (stats.projectsByStatus['Sent'] || 0) +
                                    (stats.projectsByStatus['Approved'] || 0) +
                                    (stats.projectsByStatus['Paid'] || 0) +
                                    (stats.projectsByStatus['Completed'] || 0),
                                    1
                                ) * 100
                            )}%`
                            : '0%'
                    }
                    color="purple"
                />
            </div>

            {/* Detail Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Proposals by Status */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" />
                        Proposals by Status
                    </h3>
                    <div className="space-y-3">
                        {statusOrder.map(status => {
                            const count = stats.projectsByStatus[status] || 0;
                            const percent = stats.totalProjects > 0 ? (count / stats.totalProjects) * 100 : 0;
                            return (
                                <div key={status}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-medium ${statusColors[status] || 'text-[#8888a0]'}`}>
                                            {status}
                                        </span>
                                        <span className="text-sm text-[#8888a0]">{count}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#1a1a2e] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400/40 transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback by Type */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <MessageSquare size={16} className="text-emerald-400" />
                        Feedback by Source
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats.feedbackByType).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        type === 'structured' ? 'bg-blue-400' :
                                        type === 'logout_trigger' ? 'bg-amber-400' :
                                        type === 'public_landing' ? 'bg-emerald-400' : 'bg-[#5a5a70]'
                                    }`} />
                                    <span className="text-sm text-[#8888a0]">
                                        {feedbackTypeLabels[type] || type}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-white">{count}</span>
                            </div>
                        ))}
                        {Object.keys(stats.feedbackByType).length === 0 && (
                            <p className="text-[#5a5a70] text-sm">No feedback yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, sub, color }: {
    icon: LucideIcon;
    label: string;
    value: number | string;
    sub?: string;
    color: string;
}) {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
        purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
    };
    const c = colorMap[color] || colorMap.amber;

    return (
        <div className={`glass-card p-5 border ${c.border}`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <Icon size={20} className={c.text} />
                </div>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-xs text-[#5a5a70]">{label}</p>
            {sub && (
                <p className={`text-xs ${c.text} mt-1.5 font-medium`}>{sub}</p>
            )}
        </div>
    );
}
