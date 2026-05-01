'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, checkSupabaseConfig } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import ProjectPipeline from '@/components/ProjectPipeline';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/components/AuthProvider';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import { Plus, Trash2, FileText, Search, Calendar, ArrowRight, AlertTriangle, Sparkles, Eye, Send, Clock, CheckCircle2, Share2, BarChart3, TrendingUp, IndianRupee, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOrCreateShortCode, buildShortUrl } from '@/lib/shortcode';
import CustomSelect from '@/components/CustomSelect';

interface Project {
    id: string;
    client_name: string;
    project_type: string;
    status: string;
    created_at: string;
    client_viewed_at: string | null;
}

export default function DashboardPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [deleting, setDeleting] = useState<string | null>(null);
    const [configError, setConfigError] = useState('');
    const [showProfileSetup, setShowProfileSetup] = useState(false);
    const [shortCodes, setShortCodes] = useState<Record<string, string>>({});
    const [fetchError, setFetchError] = useState(false);
    const { user } = useAuth();

    // Removed Analytics state to simplify dashboard
    // Prefetch common routes for instant navigation
    useEffect(() => {
        router.prefetch('/create');
    }, [router]);

    // Prefetch proposal pages once projects load
    useEffect(() => {
        projects.slice(0, 5).forEach(p => {
            router.prefetch(`/proposals/${p.id}`);
        });
    }, [projects, router]);

    const fetchProjects = useCallback(async (retry = 0): Promise<void> => {
        if (!user) return;
        setFetchError(false);
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
            if (retry < 2) {
                await new Promise(r => setTimeout(r, 1500 * (retry + 1)));
                return fetchProjects(retry + 1);
            }
            setFetchError(true);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const { configured, message } = checkSupabaseConfig();
        if (!configured) {
            setConfigError(message);
            setLoading(false);
            return;
        }
        if (user) {
            fetchProjects();
        }
    }, [user, fetchProjects]);



    // Check if profile setup is needed
    useEffect(() => {
        if (!user) return;
        const dismissed = localStorage.getItem('kalvora_profile_dismissed');
        if (dismissed) return;

        supabase
            .from('designer_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
            .then(({ data, error }) => {
                if (error || !data) {
                    setShowProfileSetup(true);
                }
            });
    }, [user]);

    const deleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        setDeleting(id);
        try {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
            setProjects((prev) => prev.filter((p) => p.id !== id));
            toast.success('Project deleted');
        } catch (err) {
            console.error('Error deleting project:', err);
            toast.error('Failed to delete project');
        } finally {
            setDeleting(null);
        }
    };

    const filteredProjects = projects.filter(
        (p) => {
            const matchesSearch = p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  p.project_type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        }
    );

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // ── Action Prompt counts (Feature 6) ─────────────────────
    const awaitingResponse = projects.filter(p => p.status === 'Sent' && !p.client_viewed_at).length;
    const viewedAwaitingApproval = projects.filter(p => p.status === 'Sent' && p.client_viewed_at).length;
    const invoicesPending = projects.filter(p => p.status === 'Approved').length;

    // ── Follow-up reminders (Feature 7) ─────────────────────
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const staleProposals = useMemo(() => projects.filter(
        p => p.status === 'Sent' && !p.client_viewed_at && new Date(p.created_at) < threeDaysAgo
    ), [projects]);

    const getDaysAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    // Pre-generate short codes for stale proposals
    const staleIds = useMemo(() => staleProposals.map(p => p.id).join(','), [staleProposals]);
    useEffect(() => {
        if (!staleIds) return;
        staleProposals.forEach(p => {
            if (!shortCodes[p.id]) {
                getOrCreateShortCode(p.id, 'view').then(code => {
                    if (code) setShortCodes(prev => ({ ...prev, [p.id]: code }));
                }).catch(() => {});
            }
        });
    }, [staleIds]);

    const openWhatsAppReminder = (clientName: string, projectId: string) => {
        const link = buildShortUrl(window.location.origin, shortCodes[projectId] || '', 'view', projectId);
        const message = `Hi ${clientName}! Just following up on the proposal I sent. Here's the link again in case you need it: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pt-2 animate-fade-in">
                <div>
                    <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#1E1E1E] tracking-tight">Projects</h1>
                    <p className="text-[#78716C] text-xs mt-1">
                        Manage your interior design proposals
                    </p>
                </div>
                <Link href="/create" className="btn-primary text-sm px-5 py-2.5">
                    <Plus size={16} />
                    New Project
                </Link>
            </div>



            {configError && (
                <div className="bg-[#F0EBE6] border border-[#E8E3DD] rounded-xl border-l-3 border-l-[#C47A5A] p-6 mb-6 animate-fade-in">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-[10px] bg-[#F0EBE6] flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={20} className="text-[#C47A5A]" />
                        </div>
                        <div>
                            <h3 className="text-[#C47A5A] font-semibold mb-2">Supabase Not Configured</h3>
                            <p className="text-[#6F6A66] text-sm whitespace-pre-wrap">{configError}</p>
                        </div>
                    </div>
                </div>
            )}

            {fetchError && !loading && (
                <div className="bg-[#F0EBE6] border border-[#E8E3DD] rounded-xl flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#FDF2F2] border border-[#F5D0D0] flex items-center justify-center mb-4">
                        <AlertTriangle size={28} className="text-[#B85C5C]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1E1E1E] mb-2">Failed to load projects</h3>
                    <p className="text-[#78716C] text-sm mb-6 max-w-sm">Something went wrong while fetching your projects. Please check your connection and try again.</p>
                    <button onClick={() => { setLoading(true); setFetchError(false); fetchProjects(); }} className="btn-primary">
                        Try Again
                    </button>
                </div>
            )}

            {loading ? (
                <LoadingSpinner text="Loading your projects..." />
            ) : projects.length === 0 && !configError ? (
                /* Empty State */
                <div className="bg-[#F0EBE6] border border-[#E8E3DD] rounded-xl flex flex-col items-center justify-center py-24 px-8 text-center animate-fade-in">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-3xl bg-[#F0EBE6] border border-[#D9D1C9] flex items-center justify-center">
                            <FileText size={40} className="text-[#3E2F2B]" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E1E1E] mb-3">No projects yet</h3>
                    <p className="text-[#78716C] text-sm mb-8 max-w-md leading-relaxed">
                        Create your first interior design proposal and impress your clients with beautiful, branded PDFs.
                    </p>
                    <Link href="/create" className="btn-primary text-base px-8 py-3">
                        <Plus size={20} />
                        Create Your First Proposal
                    </Link>
                </div>
            ) : (
                <>
                    {/* Search and Filter */}
                    <div className="relative z-10 flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="relative flex-1 max-w-sm">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-10 py-2.5 text-sm"
                            />
                        </div>
                        <CustomSelect
                            value={statusFilter}
                            onChange={setStatusFilter}
                            className="w-full sm:w-48"
                            options={[
                                { value: 'All', label: 'All Statuses' },
                                { value: 'Draft', label: 'Draft' },
                                { value: 'Sent', label: 'Sent' },
                                { value: 'Approved', label: 'Approved' },
                                { value: 'Paid', label: 'Paid' },
                                { value: 'Completed', label: 'Completed' },
                            ]}
                        />
                    </div>

                    {/* ── Needs Attention (CRM) ── */}
                    {(awaitingResponse > 0 || viewedAwaitingApproval > 0 || invoicesPending > 0 || staleProposals.length > 0) && (
                        <div className="mb-8 animate-fade-in">
                            <h3 className="text-[10px] font-bold text-[#78716C] uppercase tracking-[0.15em] mb-3">Needs Attention</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {awaitingResponse > 0 && (
                                    <button onClick={() => setStatusFilter('Sent')} className="bg-[#FEF8F4] border border-[#F0EBE6] rounded-xl p-4 sm:p-5 text-left hover:border-[#D9D1C9] transition-colors">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <div className="w-7 h-7 rounded-lg bg-[#F5EDE6] flex items-center justify-center">
                                                <Send size={13} className="text-[#C47A5A]/70" />
                                            </div>
                                            <span className="text-[#1E1E1E] text-xl sm:text-3xl font-extrabold">{awaitingResponse}</span>
                                        </div>
                                        <p className="text-[#78716C] text-[10px] sm:text-xs leading-tight">Awaiting response</p>
                                    </button>
                                )}
                                {viewedAwaitingApproval > 0 && (
                                    <button onClick={() => setStatusFilter('Sent')} className="bg-[#F8F6F3] border border-[#F0EBE6] rounded-xl p-4 sm:p-5 text-left hover:border-[#D9D1C9] transition-colors">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <div className="w-7 h-7 rounded-lg bg-[#F0EBE6] flex items-center justify-center">
                                                <Eye size={13} className="text-[#3E2F2B]/50" />
                                            </div>
                                            <span className="text-[#1E1E1E] text-xl sm:text-3xl font-extrabold">{viewedAwaitingApproval}</span>
                                        </div>
                                        <p className="text-[#78716C] text-[10px] sm:text-xs leading-tight">Viewed — awaiting approval</p>
                                    </button>
                                )}
                                {invoicesPending > 0 && (
                                    <button onClick={() => setStatusFilter('Approved')} className="bg-[#F6FAF8] border border-[#E8F0EC] rounded-xl p-4 sm:p-5 text-left hover:border-[#D0E5DA] transition-colors">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <div className="w-7 h-7 rounded-lg bg-[#EDF5F1] flex items-center justify-center">
                                                <CheckCircle2 size={13} className="text-[#6A9C89]/60" />
                                            </div>
                                            <span className="text-[#1E1E1E] text-xl sm:text-3xl font-extrabold">{invoicesPending}</span>
                                        </div>
                                        <p className="text-[#78716C] text-[10px] sm:text-xs leading-tight">Invoices pending</p>
                                    </button>
                                )}
                                {staleProposals.length > 0 && (
                                    <div className="bg-[#FDFAF6] border border-[#F0EBE6] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2.5 mb-1.5">
                                                <div className="w-7 h-7 rounded-lg bg-[#FEF3E2] flex items-center justify-center">
                                                    <Clock size={13} className="text-[#C08A5D]/60" />
                                                </div>
                                                <span className="text-[#1E1E1E] text-xl sm:text-3xl font-extrabold">{staleProposals.length}</span>
                                            </div>
                                            <p className="text-[#78716C] text-[10px] sm:text-xs leading-tight mb-3">Needs follow-up</p>
                                        </div>
                                        <button onClick={() => openWhatsAppReminder(staleProposals[0].client_name, staleProposals[0].id)} className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#3E2F2B] bg-[#F0EBE6] hover:bg-[#E8E3DD] py-1.5 rounded-lg transition-colors w-full">
                                            <Share2 size={11} />
                                            Remind {staleProposals[0].client_name.split(' ')[0]}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Projects Table (desktop) */}
                    <div className="hidden md:block glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '150ms' }}>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#F0EBE6]">
                                    <th className="text-left text-[10px] font-bold text-[#9A9A9A] uppercase tracking-[0.15em] px-6 py-3.5">
                                        Client
                                    </th>
                                    <th className="text-left text-[10px] font-bold text-[#9A9A9A] uppercase tracking-[0.15em] px-6 py-3.5">
                                        Type
                                    </th>
                                    <th className="text-left text-[10px] font-bold text-[#9A9A9A] uppercase tracking-[0.15em] px-6 py-3.5">
                                        Date
                                    </th>
                                    <th className="text-left text-[10px] font-bold text-[#9A9A9A] uppercase tracking-[0.15em] px-6 py-3.5">
                                        Status
                                    </th>
                                    <th className="text-right text-[10px] font-bold text-[#9A9A9A] uppercase tracking-[0.15em] px-6 py-3.5">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project, index) => (
                                    <tr
                                        key={project.id}
                                        className="border-b border-[#F5F2EE] hover:bg-[#FAFAF8] transition-colors animate-fade-in"
                                        style={{ animationDelay: `${index * 60}ms` }}
                                    >
                                        <td className="px-6 py-5">
                                            <Link href={`/proposals/${project.id}`} className="text-[#1E1E1E] font-bold hover:text-[#3E2F2B] transition-colors">
                                                {project.client_name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[#78716C] text-sm">{project.project_type}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-[#78716C] text-sm">
                                                    <Calendar size={13} className="text-[#9A9A9A]" />
                                                    {formatDate(project.created_at)}
                                                </div>
                                                {project.client_viewed_at && (
                                                    <div className="flex items-center gap-1 text-[#6A9C89] text-xs font-medium" title={`Viewed on ${formatDate(project.client_viewed_at)}`}>
                                                        <Eye size={11} /> Viewed
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <ProjectPipeline status={project.status} clientViewedAt={project.client_viewed_at} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/proposals/${project.id}`}
                                                    className="text-[#9A9A9A] hover:text-[#3E2F2B] transition-colors duration-150 p-2 rounded-[10px] hover:bg-[#F0EBE6]"
                                                    title="View"
                                                >
                                                    <ArrowRight size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    disabled={deleting === project.id}
                                                    className="text-[#9A9A9A] hover:text-[#B85C5C] transition-colors duration-150 p-2 rounded-[10px] hover:bg-[#FDF2F2] disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {filteredProjects.map((project, index) => (
                            <Link
                                key={project.id}
                                href={`/proposals/${project.id}`}
                                className="glass-card-hover block p-4 animate-fade-in"
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <div className="w-[38%] min-w-0">
                                        <h3 className="text-[#1E1E1E] font-semibold text-sm truncate">{project.client_name}</h3>
                                        <p className="text-[#78716C] text-xs truncate">{project.project_type}</p>
                                    </div>
                                    <div className="w-[60%] flex justify-end">
                                        <ProjectPipeline status={project.status} clientViewedAt={project.client_viewed_at} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#78716C] text-xs flex items-center gap-1">
                                            <Calendar size={12} /> {formatDate(project.created_at)}
                                        </span>
                                        {project.client_viewed_at && (
                                            <span className="text-[#6A9C89] text-xs flex items-center gap-1 font-medium">
                                                <Eye size={12} /> Viewed
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteProject(project.id);
                                        }}
                                        className="text-[#78716C] hover:text-[#B85C5C] p-1.5 rounded-lg hover:bg-[#FDF2F2] transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (searchQuery || statusFilter !== 'All') && (
                        <div className="text-center py-16 text-[#78716C]">
                            <Search size={32} className="mx-auto mb-3 opacity-50" />
                            No projects matching your filters
                        </div>
                    )}
                </>
            )}

            <ProfileSetupModal
                isOpen={showProfileSetup}
                onClose={() => setShowProfileSetup(false)}
            />
        </DashboardLayout>
    );
}
