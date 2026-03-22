'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import {
    MessageSquare, Loader2, Filter, Calendar, Mail, User
} from 'lucide-react';

interface FeedbackEntry {
    id: string;
    name: string | null;
    email: string | null;
    message: string | null;
    prior_tools: string[] | null;
    ease_rating: number | null;
    best_feature: string | null;
    frustrations: string | null;
    feature_wish: string | null;
    pmf_answer: string | null;
    feedback_type: string;
    created_at: string;
}

const TYPE_OPTIONS = [
    { value: 'all', label: 'All Feedback' },
    { value: 'structured', label: 'Structured (In-app)' },
    { value: 'logout_trigger', label: 'Logout Modal' },
    { value: 'public_landing', label: 'Public Landing' },
];

const typeBadgeColors: Record<string, string> = {
    structured: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    logout_trigger: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    public_landing: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
};

export default function AdminFeedbackPage() {
    const { session } = useAuth();
    const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.access_token) return;

        const fetchFeedback = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/feedback?type=${filter}`, {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setFeedback(data.feedback || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [session, filter]);

    const formatDate = (d: string) => {
        const date = new Date(d);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Feedback</h1>
                    <p className="text-[#5a5a70] text-sm">{feedback.length} entries</p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-[#5a5a70]" />
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="input-field text-sm py-2 px-3 w-auto min-w-[180px]"
                    >
                        {TYPE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={28} className="animate-spin text-amber-400" />
                </div>
            ) : feedback.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <MessageSquare size={40} className="text-[#2a2a40] mx-auto mb-3" />
                    <p className="text-[#5a5a70] text-sm">No feedback found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {feedback.map(entry => (
                        <div
                            key={entry.id}
                            className="glass-card p-5 cursor-pointer hover:border-[#3a3a55] transition-colors"
                            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        >
                            {/* Top row */}
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${typeBadgeColors[entry.feedback_type] || 'bg-[#1a1a2e] text-[#5a5a70] border-[#2a2a40]'}`}>
                                    {entry.feedback_type === 'structured' ? 'In-app' :
                                     entry.feedback_type === 'logout_trigger' ? 'Logout' :
                                     entry.feedback_type === 'public_landing' ? 'Public' : entry.feedback_type}
                                </span>
                                <span className="text-xs text-[#5a5a70] flex items-center gap-1">
                                    <Calendar size={12} />
                                    {formatDate(entry.created_at)}
                                </span>
                                {entry.name && (
                                    <span className="text-xs text-[#8888a0] flex items-center gap-1">
                                        <User size={12} />
                                        {entry.name}
                                    </span>
                                )}
                                {entry.email && (
                                    <span className="text-xs text-[#5a5a70] flex items-center gap-1">
                                        <Mail size={12} />
                                        {entry.email}
                                    </span>
                                )}
                            </div>

                            {/* Blockers / Prior Tools */}
                            {entry.prior_tools && entry.prior_tools.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {entry.prior_tools.map((tool, i) => (
                                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#1a1a2e] border border-[#2a2a40] text-[#8888a0]">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Message preview */}
                            {entry.message && (
                                <p className="text-sm text-[#8888a0] line-clamp-2">{entry.message}</p>
                            )}

                            {/* Expanded details */}
                            {expandedId === entry.id && (
                                <div className="mt-4 pt-4 border-t border-[#1a1a2e] space-y-3 animate-fade-in">
                                    {entry.ease_rating && (
                                        <DetailRow label="Ease Rating" value={`${entry.ease_rating} / 5`} />
                                    )}
                                    {entry.best_feature && (
                                        <DetailRow label="Best Feature" value={entry.best_feature} />
                                    )}
                                    {entry.frustrations && (
                                        <DetailRow label="Frustrations" value={entry.frustrations} />
                                    )}
                                    {entry.feature_wish && (
                                        <DetailRow label="Feature Wish" value={entry.feature_wish} />
                                    )}
                                    {entry.pmf_answer && (
                                        <DetailRow label="PMF Answer" value={
                                            entry.pmf_answer === 'very_disappointed' ? '😭 Very Disappointed' :
                                            entry.pmf_answer === 'somewhat_disappointed' ? '😕 Somewhat Disappointed' :
                                            '😐 Not Disappointed'
                                        } />
                                    )}
                                    {entry.message && (
                                        <DetailRow label="Full Message" value={entry.message} />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5a5a70]">{label}</span>
            <p className="text-sm text-[#8888a0] mt-0.5">{value}</p>
        </div>
    );
}
