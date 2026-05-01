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
                <Loader2 size={32} className="animate-spin text-[#78716C]" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="bg-[#F6F3EF] border border-[#E8E3DD] rounded-xl p-8 text-center">
                <p className="text-[#B85C5C]">{error || 'Something went wrong'}</p>
            </div>
        );
    }

    const statusOrder = ['Draft', 'Sent', 'Approved', 'Paid', 'Completed'];
    const statusColors: Record<string, string> = {
        Draft: 'text-[#78716C]',
        Sent: 'text-[#C08A5D]',
        Approved: 'text-[#3E2F2B]',
        Paid: 'text-[#6A9C89]',
        Completed: 'text-[#1E1E1E]',
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
                <h1 className="text-2xl font-bold text-[#1E1E1E] mb-1">Dashboard Overview</h1>
                <p className="text-[#78716C] text-sm">Your Kalvora metrics at a glance</p>
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
                    color="brand"
                />
                <MetricCard
                    icon={MessageSquare}
                    label="Feedback Received"
                    value={stats.totalFeedback}
                    color="brand"
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
                    color="accent"
                />
            </div>

            {/* Detail Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Proposals by Status */}
                <div className="bg-[#F6F3EF] border border-[#E8E3DD] rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-[#1E1E1E] mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-[#6F6A66]" />
                        Proposals by Status
                    </h3>
                    <div className="space-y-3">
                        {statusOrder.map(status => {
                            const count = stats.projectsByStatus[status] || 0;
                            const percent = stats.totalProjects > 0 ? (count / stats.totalProjects) * 100 : 0;
                            return (
                                <div key={status}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-medium ${statusColors[status] || 'text-[#6F6A66]'}`}>
                                            {status}
                                        </span>
                                        <span className="text-sm text-[#6F6A66]">{count}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#F0EBE6] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#3E2F2B] transition-colors duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback by Type */}
                <div className="bg-[#F6F3EF] border border-[#E8E3DD] rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-[#1E1E1E] mb-4 flex items-center gap-2">
                        <MessageSquare size={16} className="text-[#6A9C89]" />
                        Feedback by Source
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats.feedbackByType).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        type === 'structured' ? 'bg-[#6F6A66]' :
                                        type === 'logout_trigger' ? 'bg-[#C47A5A]' :
                                        type === 'public_landing' ? 'bg-[#6A9C89]' : 'bg-[#9C9C9C]'
                                    }`} />
                                    <span className="text-sm text-[#6F6A66]">
                                        {feedbackTypeLabels[type] || type}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-[#1E1E1E]">{count}</span>
                            </div>
                        ))}
                        {Object.keys(stats.feedbackByType).length === 0 && (
                            <p className="text-[#78716C] text-sm">No feedback yet</p>
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
        amber: { bg: 'bg-[#C47A5A]/10', border: 'border-[#D9D1C9]', text: 'text-[#6F6A66]' },
        brand: { bg: 'bg-[#3E2F2B]/10', border: 'border-[#3E2F2B]/20', text: 'text-[#3E2F2B]' },
        emerald: { bg: 'bg-[#EDF5F1]', border: 'border-[#D0E5DA]', text: 'text-[#6A9C89]' },
        accent: { bg: 'bg-[#3E2F2B]/10', border: 'border-[#3E2F2B]/20', text: 'text-[#3E2F2B]' },
    };
    const c = colorMap[color] || colorMap.amber;

    return (
        <div className={`bg-[#F6F3EF] border border-[#E8E3DD] rounded-xl p-5 border ${c.border}`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <Icon size={20} className={c.text} />
                </div>
            </div>
            <p className="text-2xl font-bold text-[#1E1E1E] mb-0.5">{value}</p>
            <p className="text-xs text-[#78716C]">{label}</p>
            {sub && (
                <p className={`text-xs ${c.text} mt-1.5 font-medium`}>{sub}</p>
            )}
        </div>
    );
}
