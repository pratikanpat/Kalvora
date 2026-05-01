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
    PartyPopper, IndianRupee, Rocket, Edit3,
    Check, BarChart3, PenTool
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
                    iconBg = 'bg-[#3E2F2B]/15';
                    iconColor = 'text-[#3E2F2B]';
                    label = `${p.client_name}'s proposal was viewed ${viewedAgo}`;
                } else if (p.status === 'Sent' && !p.client_viewed_at) {
                    icon = Clock;
                    iconBg = 'bg-[#F0EBE6]';
                    iconColor = 'text-[#C47A5A]';
                    const days = getDaysAgo(p.created_at);
                    label = `${p.client_name} hasn't opened your proposal yet${days > 0 ? ` (${days} day${days > 1 ? 's' : ''})` : ''}`;
                } else if (p.status === 'Draft') {
                    icon = Edit3;
                    iconBg = 'bg-[#F0EBE6]';
                    iconColor = 'text-[#78716C]';
                    label = `${p.client_name}'s proposal is in draft`;
                } else if (p.status === 'Approved') {
                    icon = CheckCircle2;
                    iconBg = 'bg-[#EDF5F1]';
                    iconColor = 'text-[#6A9C89]';
                    label = `${p.client_name} approved — invoice pending payment`;
                } else if (p.status === 'Paid') {
                    icon = IndianRupee;
                    iconBg = 'bg-[#3E2F2B]/15';
                    iconColor = 'text-[#3E2F2B]';
                    label = `${p.client_name} — payment received, project in progress`;
                } else {
                    icon = FileText;
                    iconBg = 'bg-[#F0EBE6]';
                    iconColor = 'text-[#78716C]';
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
                    {projects.length === 0
                        ? <>Welcome to Kalvora{displayName ? `, ${displayName}` : ''} 👋</>
                        : <>{getGreeting()}{displayName ? `, ${displayName}` : ''} 👋</>}
                </h1>
                <p className="text-[#6F6A66] text-sm mt-1">
                    {projects.length === 0
                        ? "Let's get your studio set up and send your first proposal."
                        : totalActive > 0
                            ? `You have ${totalActive} active project${totalActive > 1 ? 's' : ''}`
                            : 'Ready to create something great?'}
                </p>
            </div>

            {/* ═══════════════════════════════════════
                PIPELINE STRIP — At the top per user request
                ═══════════════════════════════════════ */}
            {projects.length > 0 ? (<>
                <div className="mb-8 animate-fade-in" style={{ animationDelay: '50ms' }}>
                    <div className="pipeline-strip">
                        {[
                            { label: 'Draft', count: pipeline.draft, color: 'text-[#3E2F2B]', bg: 'bg-[#D9D1C9]' },
                            { label: 'Sent', count: pipeline.sent, color: 'text-[#3E2F2B]', bg: 'bg-[#D9D1C9]' },
                            { label: 'Viewed', count: pipeline.viewed, color: 'text-[#3E2F2B]', bg: 'bg-[#D9D1C9]' },
                            { label: 'Approved', count: pipeline.approved, color: 'text-[#3E2F2B]', bg: 'bg-[#D9D1C9]' },
                            { label: 'Paid', count: pipeline.paid, color: 'text-[#3E2F2B]', bg: 'bg-[#D9D1C9]' },
                            { label: 'Completed', count: pipeline.completed, color: 'text-[#3E2F2B]', bg: 'bg-[#D9D1C9]' },
                        ].map((step, i, arr) => (
                            <div key={step.label} className="flex items-center gap-1">
                                <Link
                                    href={`/dashboard`}
                                    className={`pipeline-step ${step.count > 0 ? step.color : ''}`}
                                >
                                    <span>{step.label}</span>
                                    <span className={`pipeline-step-count ${step.count > 0 ? step.bg : 'bg-[#D9D1C9]'} ${step.count > 0 ? step.color : 'text-[#6F6A66]'}`}>
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

            {/* ═══════════════════════════════════════
                PRIMARY ACTION STRIP
                Context-aware: shows ONE dominant action
                ═══════════════════════════════════════ */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                {primaryAction.type === 'no-profile' && (
                    <Link href="/profile" className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#F0EBE6] border border-[#E8E3DD] flex items-center justify-center flex-shrink-0">
                                <Building size={24} className="text-[#C47A5A]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">Complete your studio profile</h2>
                                <p className="text-[#57534E] text-sm">Add your branding, logo, and payment details to send professional proposals.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#78716C] group-hover:text-[#3E2F2B] group-hover:translate-x-1 transition-colors flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'first-proposal' && (
                    <Link href="/create" className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#3E2F2B] flex items-center justify-center flex-shrink-0 ">
                                <Rocket size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">Create your first proposal</h2>
                                <p className="text-[#57534E] text-sm">It takes 60 seconds. Pick a template, fill client details, and send a professional link.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#78716C] group-hover:text-[#3E2F2B] group-hover:translate-x-1 transition-colors flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'nudge-approval' && primaryAction.project && (
                    <Link href={`/proposals/${primaryAction.project.id}`} className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#3E2F2B]/15 border border-[#3E2F2B]/20 flex items-center justify-center flex-shrink-0">
                                <Eye size={24} className="text-[#3E2F2B]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">
                                    {primaryAction.project.client_name} viewed your proposal
                                </h2>
                                <p className="text-[#57534E] text-sm">They've seen it — now's the perfect time to follow up and close.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#78716C] group-hover:text-[#3E2F2B] group-hover:translate-x-1 transition-colors flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'resume-draft' && primaryAction.project && (
                    <Link href={`/edit/${primaryAction.project.id}`} className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#F0EBE6] border border-[#E8E3DD] flex items-center justify-center flex-shrink-0">
                                <Edit3 size={24} className="text-[#78716C]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">
                                    Finish your draft for {primaryAction.project.client_name}
                                </h2>
                                <p className="text-[#57534E] text-sm">Your proposal is almost ready - complete and send it to close faster.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#78716C] group-hover:text-[#3E2F2B] group-hover:translate-x-1 transition-colors flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'follow-up' && primaryAction.project && (
                    <div className="action-strip-card">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#C08A5D]/15 border border-[#C08A5D]/20 flex items-center justify-center flex-shrink-0">
                                <Send size={24} className="text-[#C08A5D]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">
                                    Follow up with {primaryAction.project.client_name}
                                </h2>
                                <p className="text-[#6F6A66] text-sm">
                                    Sent {getDaysAgo(primaryAction.project.created_at)} day{getDaysAgo(primaryAction.project.created_at) !== 1 ? 's' : ''} ago — no response yet.
                                </p>
                            </div>
                            <button
                                onClick={() => openWhatsAppReminder(primaryAction.project!.client_name, primaryAction.project!.id)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3E2F2B]/10 border border-[#3E2F2B]/20 text-[#3E2F2B] text-sm font-semibold hover:bg-[#3E2F2B]/20 transition-colors flex-shrink-0"
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
                            <div className="w-14 h-14 rounded-2xl bg-[#EDF5F1] border border-[#D0E5DA] flex items-center justify-center flex-shrink-0">
                                <Receipt size={24} className="text-[#6A9C89]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">
                                    {primaryAction.project.client_name} approved — send invoice reminder
                                </h2>
                                <p className="text-[#57534E] text-sm">Invoice is ready. Send a payment reminder to keep the project moving.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#78716C] group-hover:text-[#3E2F2B] group-hover:translate-x-1 transition-colors flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {primaryAction.type === 'create-new' && (
                    <Link href="/create" className="action-strip-card block group">
                        <div className="relative flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#3E2F2B] flex items-center justify-center flex-shrink-0">
                                <Plus size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">Create a new proposal</h2>
                                <p className="text-[#57534E] text-sm">All projects are on track. Start your next one.</p>
                            </div>
                            <ArrowRight size={20} className="text-[#78716C] group-hover:text-[#3E2F2B] group-hover:translate-x-1 transition-colors flex-shrink-0" />
                        </div>
                    </Link>
                )}

                {/* Secondary action — always visible */}
                {primaryAction.type !== 'first-proposal' && primaryAction.type !== 'create-new' && (
                    <div className="mt-3 flex justify-end">
                        <Link
                            href="/create"
                            className="flex items-center gap-2 text-sm text-[#78716C] hover:text-[#3E2F2B] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#3E2F2B]/10"
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
                        <CheckCircle2 size={28} className="text-[#6A9C89]/60 mx-auto mb-2" />
                        <p className="text-[#6A9C89]/80 text-sm font-medium">All caught up</p>
                        <p className="text-[#78716C] text-xs mt-1">No stuck projects right now</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {attentionItems.map((item, i) => (
                            <div
                                key={item.project.id}
                                className={`attention-card ${item.type === 'stale' ? 'attention-card-amber' : item.type === 'viewed' ? 'attention-card-brand' : 'attention-card-emerald'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'stale' ? 'bg-[#C08A5D]/15' : item.type === 'viewed' ? 'bg-[#3E2F2B]/15' : 'bg-[#EDF5F1]'
                                        }`}>
                                        {item.type === 'stale' && <Clock size={16} className="text-[#C08A5D]" />}
                                        {item.type === 'viewed' && <Eye size={16} className="text-[#3E2F2B]" />}
                                        {item.type === 'approved' && <CheckCircle2 size={16} className="text-[#6A9C89]" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#1E1E1E] text-sm font-medium truncate">
                                            {item.type === 'stale' && `${item.project.client_name} hasn't opened your proposal`}
                                            {item.type === 'viewed' && `${item.project.client_name} viewed your proposal — follow up now`}
                                            {item.type === 'approved' && `${item.project.client_name} approved — invoice pending payment`}
                                        </p>
                                        <p className="text-[#78716C] text-xs mt-0.5">
                                            {item.type === 'stale' && `Sent ${item.daysAgo} day${item.daysAgo > 1 ? 's' : ''} ago`}
                                            {item.type === 'viewed' && `Viewed ${getTimeAgo(item.project.client_viewed_at || item.project.created_at)}`}
                                            {item.type === 'approved' && `Approved ${getTimeAgo(item.project.created_at)}`}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {item.type === 'stale' && (
                                            <button
                                                onClick={() => openWhatsAppReminder(item.project.client_name, item.project.id)}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-[#3E2F2B] hover:text-[#2F2421] bg-[#3E2F2B]/10 hover:bg-[#3E2F2B]/15 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                <Share2 size={12} /> Remind
                                            </button>
                                        )}
                                        {item.type === 'viewed' && (
                                            <Link
                                                href={`/proposals/${item.project.id}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-[#3E2F2B] hover:text-[#2F2421] bg-[#3E2F2B]/10 hover:bg-[#2F2421]/15 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                View <ArrowRight size={12} />
                                            </Link>
                                        )}
                                        {item.type === 'approved' && (
                                            <Link
                                                href={`/proposals/${item.project.id}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-[#6A9C89] hover:text-[#6A9C89] bg-[#EDF5F1] hover:bg-[#D0E5DA] px-3 py-2 rounded-lg transition-colors"
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
                                        <p className="text-[#6F6A66] text-sm truncate group-hover:text-[#1E1E1E] transition-colors">
                                            {item.label}
                                        </p>
                                    </div>
                                    <span className="text-[#6F6A66] text-xs flex-shrink-0">
                                        {getTimeAgo(item.project.client_viewed_at || item.project.created_at)}
                                    </span>
                                    <ArrowRight size={14} className="text-[#78716C] group-hover:text-[#3E2F2B] transition-colors flex-shrink-0" />
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
                        <p className="text-[#78716C] text-sm">
                            Your first win is one proposal away 🚀
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 text-[#3E2F2B] text-sm font-medium mt-2 hover:text-[#2F2421] transition-colors"
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
                                    <p className="text-[#1E1E1E] text-sm font-medium truncate group-hover:text-[#2F2421] transition-colors">
                                        {win.label}
                                    </p>
                                    <p className="text-[#78716C] text-xs mt-0.5">
                                        {getTimeAgo(win.project.created_at)}
                                    </p>
                                </div>
                                <ArrowRight size={14} className="text-[#78716C] group-hover:text-[#3E2F2B] transition-colors flex-shrink-0" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Quick nav to full dashboard ── */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-[#78716C] hover:text-[#3E2F2B] text-sm font-medium transition-colors px-4 py-2 rounded-xl hover:bg-[#3E2F2B]/10"
                >
                    View all projects in Dashboard
                    <ArrowRight size={14} />
                </Link>
            </div>
            </>) : (
            /* ═══════════════════════════════════════
               ONBOARDING FLOW — New users (0 projects)
               ═══════════════════════════════════════ */
            <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
                {/* Progress */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2">
                        Your Setup Checklist · {hasProfile ? '1' : '0'} of 3 complete
                    </p>
                    <div className="onboarding-progress-bar">
                        <div className="onboarding-progress-fill" style={{ width: hasProfile ? '33%' : '0%' }} />
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-3 mb-8">
                    {/* Step 1 */}
                    <Link href="/profile" className={`onboarding-step ${hasProfile ? 'onboarding-step-completed' : 'onboarding-step-active'}`}>
                        <div className={`onboarding-step-number ${hasProfile ? 'onboarding-step-number-completed' : 'onboarding-step-number-active'}`}>
                            {hasProfile ? <Check size={14} /> : '1'}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-[#1E1E1E]">Complete your studio profile</p>
                            <p className="text-xs text-[#78716C] mt-0.5">Add logo, branding, payment terms</p>
                            {!hasProfile && <span className="text-[10px] text-[#C47A5A] font-semibold mt-1 inline-block">Takes 2 minutes</span>}
                        </div>
                        {!hasProfile && <ArrowRight size={16} className="text-[#78716C] flex-shrink-0 mt-1" />}
                    </Link>

                    {/* Step 2 */}
                    {hasProfile ? (
                        <Link href="/create" className="onboarding-step onboarding-step-active">
                            <div className="onboarding-step-number onboarding-step-number-active">2</div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#1E1E1E]">Create your first proposal</p>
                                <p className="text-xs text-[#78716C] mt-0.5">Pick a template, fill details, generate a professional link</p>
                            </div>
                            <ArrowRight size={16} className="text-[#78716C] flex-shrink-0 mt-1" />
                        </Link>
                    ) : (
                        <div className="onboarding-step onboarding-step-dimmed">
                            <div className="onboarding-step-number onboarding-step-number-dimmed">2</div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#1E1E1E]">Create your first proposal</p>
                                <p className="text-xs text-[#78716C] mt-0.5">Pick a template, fill details, generate a professional link</p>
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    <div className="onboarding-step onboarding-step-dimmed">
                        <div className="onboarding-step-number onboarding-step-number-dimmed">3</div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-[#1E1E1E]">Send & track</p>
                            <p className="text-xs text-[#78716C] mt-0.5">Share via WhatsApp, track views, get approvals</p>
                        </div>
                    </div>
                </div>

                {/* Hero CTA */}
                <div className="text-center mb-10">
                    <Link href={hasProfile ? '/create' : '/profile'} className="btn-primary inline-flex text-base px-8 py-4">
                        {hasProfile ? <><PenTool size={18} /> Create Your First Proposal</> : <><Building size={18} /> Set Up Your Studio</>}
                    </Link>
                    <p className="text-xs text-[#78716C] mt-3">Takes less than 2 minutes</p>
                </div>

                {/* How Kalvora Works strip */}
                <div>
                    <h3 className="engine-section-header justify-center mb-4">
                        <Sparkles size={14} />
                        How Kalvora Works
                    </h3>
                    <div className="onboarding-flow-strip">
                        {[
                            { icon: PenTool, label: 'Create', desc: 'Build a stunning proposal', bg: 'bg-[#F0EBE6]', color: 'text-[#3E2F2B]' },
                            { icon: Send, label: 'Send', desc: 'Share link with client', bg: 'bg-[#F0EBE6]', color: 'text-[#C47A5A]' },
                            { icon: BarChart3, label: 'Track', desc: 'See when they view it', bg: 'bg-[#F0EBE6]', color: 'text-[#3E2F2B]' },
                            { icon: IndianRupee, label: 'Get Paid', desc: 'Approve & invoice', bg: 'bg-[#EDF5F1]', color: 'text-[#6A9C89]' },
                        ].map((step, i) => (
                            <div key={step.label} className="onboarding-flow-item">
                                <div className={`onboarding-flow-icon ${step.bg}`}>
                                    <step.icon size={18} className={step.color} />
                                </div>
                                <p className="text-sm font-bold text-[#1E1E1E]">{step.label}</p>
                                <p className="text-xs text-[#78716C] mt-0.5">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
