'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProjectPipeline from '@/components/ProjectPipeline';
import { getOrCreateShortCode, buildShortUrl } from '@/lib/shortcode';
import {
    Plus, FileText, Send, Eye, CheckCircle2, Clock,
    ArrowRight, Share2, Receipt, ChevronRight,
    Sparkles, Trophy, Building, AlertCircle,
    PartyPopper, IndianRupee, Rocket, Edit3
} from 'lucide-react';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface Project {
    id: string;
    client_name: string;
    project_type: string;
    status: string;
    created_at: string;
    client_viewed_at: string | null;
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 2) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const getDaysAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};


// ─────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────
export default function LoggedInHome() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileName, setProfileName] = useState<string>('');
    const [hasProfile, setHasProfile] = useState(true);
    const [shortCodes, setShortCodes] = useState<Record<string, string>>({});

    // ── Fetch data ──────────────────────────
    const fetchProjects = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('id, client_name, project_type, status, created_at, client_viewed_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('designer_profiles')
                .select('designer_name, studio_name')
                .eq('user_id', user.id)
                .single();
            if (error || !data) {
                setHasProfile(false);
                return;
            }
            setProfileName(data.designer_name || data.studio_name || '');
            setHasProfile(true);
        } catch {
            setHasProfile(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProjects();
        fetchProfile();
    }, [fetchProjects, fetchProfile]);

    // ── Pre-generate short codes for projects needing WhatsApp actions ──
    const actionableProjects = useMemo(() =>
        projects.filter(p => p.status === 'Sent' && !p.client_viewed_at),
        [projects]
    );

    useEffect(() => {
        actionableProjects.forEach(p => {
            if (!shortCodes[p.id]) {
                getOrCreateShortCode(p.id, 'view').then(code => {
                    if (code) setShortCodes(prev => ({ ...prev, [p.id]: code }));
                }).catch(() => { });
            }
        });
    }, [actionableProjects]);

    // ── Computed states ──────────────────────

    // Pipeline counts
    const pipeline = useMemo(() => ({
        draft: projects.filter(p => p.status === 'Draft').length,
        sent: projects.filter(p => p.status === 'Sent' && !p.client_viewed_at).length,
        viewed: projects.filter(p => p.status === 'Sent' && p.client_viewed_at).length,
        approved: projects.filter(p => p.status === 'Approved').length,
        paid: projects.filter(p => p.status === 'Paid').length,
        completed: projects.filter(p => p.status === 'Completed').length,
    }), [projects]);

    const totalActive = pipeline.draft + pipeline.sent + pipeline.viewed + pipeline.approved + pipeline.paid;

    // Primary action determination (priority order)
    const primaryAction = useMemo(() => {
        if (!hasProfile) return { type: 'no-profile' as const, project: null };
        if (projects.length === 0) return { type: 'first-proposal' as const, project: null };

        // Most urgent first: viewed but not approved
        const viewedNotApproved = projects.find(p => p.status === 'Sent' && p.client_viewed_at);
        if (viewedNotApproved) return { type: 'nudge-approval' as const, project: viewedNotApproved };

        // Drafts need finishing
        const draft = projects.find(p => p.status === 'Draft');
        if (draft) return { type: 'resume-draft' as const, project: draft };

        // Sent but not viewed — follow up
        const sentNotViewed = projects.find(p => p.status === 'Sent' && !p.client_viewed_at);
        if (sentNotViewed) return { type: 'follow-up' as const, project: sentNotViewed };

        // Approved — nudge payment
        const approved = projects.find(p => p.status === 'Approved');
        if (approved) return { type: 'invoice-reminder' as const, project: approved };

        return { type: 'create-new' as const, project: null };
    }, [projects, hasProfile]);

    // Needs attention items
    const attentionItems = useMemo(() => {
        const items: Array<{
            type: 'stale' | 'viewed' | 'approved';
            project: Project;
            daysAgo: number;
        }> = [];

        projects.forEach(p => {
            if (p.status === 'Sent' && !p.client_viewed_at && getDaysAgo(p.created_at) >= 3) {
                items.push({ type: 'stale', project: p, daysAgo: getDaysAgo(p.created_at) });
            } else if (p.status === 'Sent' && p.client_viewed_at) {
                items.push({ type: 'viewed', project: p, daysAgo: getDaysAgo(p.client_viewed_at || p.created_at) });
            } else if (p.status === 'Approved') {
                items.push({ type: 'approved', project: p, daysAgo: getDaysAgo(p.created_at) });
            }
        });

        return items.slice(0, 4);
    }, [projects]);

    // Proposal activity feed (recent 5 non-completed)
    const activityFeed = useMemo(() => {
        return projects
            .filter(p => p.status !== 'Completed')
            .slice(0, 5)
            .map(p => {
                let icon: typeof Eye;
                let iconBg: string;
                let iconColor: string;
                let label: string;

                if (p.client_viewed_at && p.status === 'Sent') {
                    // Count views (we only have viewed_at, so we say "viewed")
                    const viewedAgo = getTimeAgo(p.client_viewed_at);
                    icon = Eye;
                    iconBg = 'bg-brand-500/15';
                    iconColor = 'text-brand-400';
                    label = `${p.client_name}'s proposal was viewed ${viewedAgo}`;
                } else if (p.status === 'Sent' && !p.client_viewed_at) {
                    icon = Clock;
                    iconBg = 'bg-amber-500/15';
                    iconColor = 'text-amber-400';
                    const days = getDaysAgo(p.created_at);
                    label = `${p.client_name} hasn't opened your proposal yet${days > 0 ? ` (${days} day${days > 1 ? 's' : ''})` : ''}`;
                } else if (p.status === 'Draft') {
                    icon = Edit3;
                    iconBg = 'bg-gray-500/15';
                    iconColor = 'text-gray-400';
                    label = `${p.client_name}'s proposal is in draft`;
                } else if (p.status === 'Approved') {
                    icon = CheckCircle2;
                    iconBg = 'bg-emerald-500/15';
                    iconColor = 'text-emerald-400';
                    label = `${p.client_name} approved — invoice pending payment`;
                } else if (p.status === 'Paid') {
                    icon = IndianRupee;
                    iconBg = 'bg-brand-500/15';
                    iconColor = 'text-brand-400';
                    label = `${p.client_name} — payment received, project in progress`;
                } else {
                    icon = FileText;
                    iconBg = 'bg-gray-500/15';
                    iconColor = 'text-gray-400';
                    label = `${p.client_name}'s proposal — ${p.status}`;
                }

                return { project: p, icon, iconBg, iconColor, label };
            });
    }, [projects]);

    // Wins (approved, paid, completed — most recent 3)
    const wins = useMemo(() => {
        return projects
            .filter(p => ['Approved', 'Paid', 'Completed'].includes(p.status))
            .slice(0, 3)
            .map(p => {
                if (p.status === 'Completed') {
                    return { project: p, type: 'completed' as const, emoji: '✅', label: `${p.client_name}'s project completed!`, cardClass: 'win-card-completed' };
                }
                if (p.status === 'Paid') {
                    return { project: p, type: 'paid' as const, emoji: '💰', label: `Payment received from ${p.client_name} — Project in progress!`, cardClass: 'win-card-paid' };
                }
                return { project: p, type: 'approved' as const, emoji: '🎉', label: `${p.client_name}'s Proposal Approved — Invoice sent!`, cardClass: 'win-card-approved' };
            });
    }, [projects]);

    // ── WhatsApp reminder helper ──
    const openWhatsAppReminder = (clientName: string, projectId: string) => {
        const link = buildShortUrl(window.location.origin, shortCodes[projectId] || '', 'view', projectId);
        const message = `Hi ${clientName}! Just following up on the proposal I sent. Here's the link again in case you need it: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    // ── Loading state ──
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner text="Loading your workspace..." />
            </div>
        );
    }

    const displayName = profileName || user?.email?.split('@')[0] || '';

    // ─────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-28 sm:pb-24">

            {/* ── Greeting ── */}
            <div className="mb-6 animate-fade-in">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {getGreeting()}{displayName ? `, ${displayName}` : ''} 👋
                </h1>
                <p className="text-[#5a5a70] text-sm mt-1">
                    {totalActive > 0
                        ? `You have ${totalActive} active project${totalActive > 1 ? 's' : ''}`
                        : 'Ready to create something great?'}
                </p>
            </div>

            {/* ═══════════════════════════════════════
                PIPELINE STRIP — At the top per user request
                ═══════════════════════════════════════ */}
            {projects.length > 0 && (
                <div className="mb-8 animate-fade-in" style={{ animationDelay: '50ms' }}>
                    <div className="pipeline-strip">
                        {[
                            { label: 'Draft', count: pipeline.draft, color: 'text-gray-400', bg: 'bg-gray-500/15' },
                            { label: 'Sent', count: pipeline.sent, color: 'text-[#FF9933]', bg: 'bg-[#FF9933]/15' },
                            { label: 'Viewed', count: pipeline.viewed, color: 'text-brand-400', bg: 'bg-brand-500/15' },
                            { label: 'Approved', count: pipeline.approved, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
                            { label: 'Paid', count: pipeline.paid, color: 'text-blue-400', bg: 'bg-blue-500/15' },
                            { label: 'Completed', count: pipeline.completed, color: 'text-purple-400', bg: 'bg-purple-500/15' },
                        ].map((step, i, arr) => (
                            <div key={step.label} className="flex items-center gap-1">
                                <Link
                                    href={`/dashboard`}
                                    className={`pipeline-step ${step.count > 0 ? `border-[#2a2a40] ${step.color}` : ''}`}
                                >
                                    <span className={step.label}>{step.label}</span>
                                    <span className={`pipeline-step-count ${step.count > 0 ? step.bg : 'bg-[#1a1a2e]'} ${step.count > 0 ? step.color : 'text-[#3a3a50]'}`}>
                                        {step.count}
                                    </span>
                                </Link>
                                {i < arr.length - 1 && (
                                    <ChevronRight size={14} className="pipeline-step-arrow" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════
                PRIMARY ACTION STRIP
                Context-aware: shows ONE dominant action
                ═══════════════════════════════════════ */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                {primaryAction.type === 'no-profile' && (
                    <Link href="/profile" className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                <Building size={24} className="text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Complete your studio profile</h2>
                                <p className="text-[#8888a0] text-sm">Add your branding, logo, and payment details to send professional proposals.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#5a5a70] group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'first-proposal' && (
                    <Link href="/create" className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center flex-shrink-0 animate-float">
                                <Rocket size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Create your first proposal</h2>
                                <p className="text-[#8888a0] text-sm">It takes 60 seconds. Pick a template, fill client details, and send a professional link.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#5a5a70] group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'nudge-approval' && primaryAction.project && (
                    <Link href={`/proposals/${primaryAction.project.id}`} className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                                <Eye size={24} className="text-brand-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                                    {primaryAction.project.client_name} viewed your proposal
                                </h2>
                                <p className="text-[#8888a0] text-sm">They've seen it — now's the perfect time to follow up and close.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#5a5a70] group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'resume-draft' && primaryAction.project && (
                    <Link href={`/edit/${primaryAction.project.id}`} className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gray-500/15 border border-gray-500/20 flex items-center justify-center flex-shrink-0">
                                <Edit3 size={24} className="text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                                    Finish your draft for {primaryAction.project.client_name}
                                </h2>
                                <p className="text-[#8888a0] text-sm">Your proposal is almost ready - complete and send it to close faster.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#5a5a70] group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'follow-up' && primaryAction.project && (
                    <div className="action-strip-card">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#FF9933]/15 border border-[#FF9933]/20 flex items-center justify-center flex-shrink-0">
                                <Send size={24} className="text-[#FF9933]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                                    Follow up with {primaryAction.project.client_name}
                                </h2>
                                <p className="text-[#8888a0] text-sm">
                                    Sent {getDaysAgo(primaryAction.project.created_at)} day{getDaysAgo(primaryAction.project.created_at) !== 1 ? 's' : ''} ago — no response yet.
                                </p>
                            </div>
                            <button
                                onClick={() => openWhatsAppReminder(primaryAction.project!.client_name, primaryAction.project!.id)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/20 transition-all flex-shrink-0"
                            >
                                <Share2 size={16} />
                                <span className="hidden sm:inline">Remind on WhatsApp</span>
                                <span className="sm:hidden">Remind</span>
                            </button>
                        </div>
                    </div>
                )}

                {primaryAction.type === 'invoice-reminder' && primaryAction.project && (
                    <Link href={`/proposals/${primaryAction.project.id}`} className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <Receipt size={24} className="text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                                    {primaryAction.project.client_name} approved — send invoice reminder
                                </h2>
                                <p className="text-[#8888a0] text-sm">Invoice is ready. Send a payment reminder to keep the project moving.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#5a5a70] group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'create-new' && (
                    <Link href="/create" className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center flex-shrink-0">
                                <Plus size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Create a new proposal</h2>
                                <p className="text-[#8888a0] text-sm">All projects are on track. Start your next one.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#5a5a70] group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {/* Secondary action — always visible */}
                {primaryAction.type !== 'first-proposal' && primaryAction.type !== 'create-new' && (
                    <div className="mt-3 flex justify-end">
                        <Link
                            href="/create"
                            className="flex items-center gap-2 text-sm text-[#5a5a70] hover:text-brand-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-700/10"
                        >
                            <Plus size={14} />
                            New Proposal
                        </Link>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════
                NEEDS YOUR ATTENTION
                Stuck-project alarm system
                ═══════════════════════════════════════ */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
                <h3 className="engine-section-header">
                    <AlertCircle size={14} />
                    Needs Your Attention
                </h3>

                {attentionItems.length === 0 ? (
                    <div className="all-caught-up">
                        <CheckCircle2 size={28} className="text-emerald-400/60 mx-auto mb-2" />
                        <p className="text-emerald-400/80 text-sm font-medium">All caught up</p>
                        <p className="text-[#5a5a70] text-xs mt-1">No stuck projects right now</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {attentionItems.map((item, i) => (
                            <div
                                key={item.project.id}
                                className={`attention-card ${item.type === 'stale' ? 'attention-card-amber' : item.type === 'viewed' ? 'attention-card-blue' : 'attention-card-emerald'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'stale' ? 'bg-[#FF9933]/15' : item.type === 'viewed' ? 'bg-brand-500/15' : 'bg-emerald-500/15'
                                        }`}>
                                        {item.type === 'stale' && <Clock size={16} className="text-[#FF9933]" />}
                                        {item.type === 'viewed' && <Eye size={16} className="text-brand-400" />}
                                        {item.type === 'approved' && <CheckCircle2 size={16} className="text-emerald-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">
                                            {item.type === 'stale' && `${item.project.client_name} hasn't opened your proposal`}
                                            {item.type === 'viewed' && `${item.project.client_name} viewed your proposal — follow up now`}
                                            {item.type === 'approved' && `${item.project.client_name} approved — invoice pending payment`}
                                        </p>
                                        <p className="text-[#5a5a70] text-xs mt-0.5">
                                            {item.type === 'stale' && `Sent ${item.daysAgo} day${item.daysAgo > 1 ? 's' : ''} ago`}
                                            {item.type === 'viewed' && `Viewed ${getTimeAgo(item.project.client_viewed_at || item.project.created_at)}`}
                                            {item.type === 'approved' && `Approved ${getTimeAgo(item.project.created_at)}`}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {item.type === 'stale' && (
                                            <button
                                                onClick={() => openWhatsAppReminder(item.project.client_name, item.project.id)}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-[#2aea7a] bg-[#25D366]/10 hover:bg-[#25D366]/15 px-3 py-2 rounded-lg transition-all"
                                            >
                                                <Share2 size={12} /> Remind
                                            </button>
                                        )}
                                        {item.type === 'viewed' && (
                                            <Link
                                                href={`/proposals/${item.project.id}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/15 px-3 py-2 rounded-lg transition-all"
                                            >
                                                View <ArrowRight size={12} />
                                            </Link>
                                        )}
                                        {item.type === 'approved' && (
                                            <Link
                                                href={`/proposals/${item.project.id}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 px-3 py-2 rounded-lg transition-all"
                                            >
                                                Invoice <ArrowRight size={12} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════
                PROPOSAL ACTIVITY — Killer Feature Spotlight
                "Client Viewed" is the centerpiece
                ═══════════════════════════════════════ */}
            {activityFeed.length > 0 && (
                <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <h3 className="engine-section-header">
                        <Eye size={14} />
                        Proposal Activity
                    </h3>

                    <div className="space-y-2">
                        {activityFeed.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.project.id}
                                    href={`/proposals/${item.project.id}`}
                                    className="activity-feed-item group"
                                >
                                    <div className={`activity-feed-icon ${item.iconBg}`}>
                                        <IconComponent size={16} className={item.iconColor} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#c0c0d0] text-sm truncate group-hover:text-white transition-colors">
                                            {item.label}
                                        </p>
                                    </div>
                                    <span className="text-[#3a3a50] text-xs flex-shrink-0">
                                        {getTimeAgo(item.project.client_viewed_at || item.project.created_at)}
                                    </span>
                                    <ArrowRight size={14} className="text-[#2a2a40] group-hover:text-brand-400 transition-colors flex-shrink-0" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════
                WINS — Emotional Rewards
                Celebrate approvals, payments, completions
                ═══════════════════════════════════════ */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '250ms' }}>
                <h3 className="engine-section-header">
                    <Trophy size={14} />
                    Wins
                </h3>

                {wins.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <p className="text-[#5a5a70] text-sm">
                            Your first win is one proposal away 🚀
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 text-brand-400 text-sm font-medium mt-2 hover:text-brand-300 transition-colors"
                        >
                            Create Proposal <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {wins.map((win) => (
                            <Link
                                key={win.project.id}
                                href={`/proposals/${win.project.id}`}
                                className={`win-card flex items-center gap-4 group`}
                            >
                                <span className="text-xl flex-shrink-0">{win.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate group-hover:text-brand-300 transition-colors">
                                        {win.label}
                                    </p>
                                    <p className="text-[#5a5a70] text-xs mt-0.5">
                                        {getTimeAgo(win.project.created_at)}
                                    </p>
                                </div>
                                <ArrowRight size={14} className="text-[#2a2a40] group-hover:text-brand-400 transition-colors flex-shrink-0" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Quick nav to full dashboard ── */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-[#5a5a70] hover:text-brand-400 text-sm font-medium transition-colors px-4 py-2 rounded-xl hover:bg-brand-700/10"
                >
                    View all projects in Dashboard
                    <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}
