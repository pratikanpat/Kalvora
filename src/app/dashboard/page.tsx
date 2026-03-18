'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, checkSupabaseConfig } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import ProjectPipeline from '@/components/ProjectPipeline';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/components/AuthProvider';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import { Plus, Trash2, FileText, Search, Calendar, ArrowRight, AlertTriangle, Sparkles, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

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
    const { user } = useAuth();

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

    useEffect(() => {
        const { configured, message } = checkSupabaseConfig();
        if (!configured) {
            setConfigError(message);
            setLoading(false);
            return;
        }
        if (user) fetchProjects();
    }, [user]);

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

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('id, client_name, project_type, status, created_at, client_viewed_at')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
                    <p className="text-[#5a5a70] text-sm mt-1">
                        Manage your interior design proposals
                    </p>
                </div>
                <Link href="/create" className="btn-primary">
                    <Plus size={18} />
                    New Project
                </Link>
            </div>

            {configError && (
                <div className="glass-card border-yellow-500/30 p-6 mb-6 animate-fade-in">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={20} className="text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-yellow-400 font-semibold mb-2">Supabase Not Configured</h3>
                            <p className="text-[#8888a0] text-sm whitespace-pre-wrap">{configError}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <LoadingSpinner text="Loading your projects..." />
            ) : projects.length === 0 && !configError ? (
                /* Empty State */
                <div className="glass-card flex flex-col items-center justify-center py-24 px-8 text-center animate-slide-up">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-700/20 to-brand-500/10 border border-brand-700/20 flex items-center justify-center animate-float">
                            <FileText size={40} className="text-brand-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center animate-pulse-glow">
                            <Sparkles size={12} className="text-white" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">No projects yet</h3>
                    <p className="text-[#6a6a80] text-sm mb-8 max-w-md leading-relaxed">
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
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="relative flex-1 max-w-sm">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-11"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field w-full sm:w-48 appearance-none bg-[#0d0d14] border-[#2a2a40] text-sm"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Approved">Approved</option>
                            <option value="Paid">Paid</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Projects Table (desktop) */}
                    <div className="hidden md:block glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '150ms' }}>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a40]">
                                    <th className="text-left text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] px-6 py-4">
                                        Client
                                    </th>
                                    <th className="text-left text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] px-6 py-4">
                                        Type
                                    </th>
                                    <th className="text-left text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] px-6 py-4">
                                        Date
                                    </th>
                                    <th className="text-left text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] px-6 py-4">
                                        Status
                                    </th>
                                    <th className="text-right text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] px-6 py-4">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project, index) => (
                                    <tr
                                        key={project.id}
                                        className="border-b border-[#1a1a2e]/60 table-row-hover animate-fade-in"
                                        style={{ animationDelay: `${index * 60}ms` }}
                                    >
                                        <td className="px-6 py-4">
                                            <Link href={`/proposals/${project.id}`} className="text-white font-semibold hover:text-brand-400 transition-colors">
                                                {project.client_name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[#8888a0] text-sm bg-[#12121a] px-2.5 py-1 rounded-lg">{project.project_type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-[#8888a0] text-sm">
                                                    <Calendar size={14} className="text-[#5a5a70]" />
                                                    {formatDate(project.created_at)}
                                                </div>
                                                {project.client_viewed_at && (
                                                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium" title={`Viewed on ${formatDate(project.client_viewed_at)}`}>
                                                        <Eye size={12} /> Viewed
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ProjectPipeline status={project.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/proposals/${project.id}`}
                                                    className="text-[#5a5a70] hover:text-brand-400 transition-all duration-200 p-2 rounded-xl hover:bg-brand-700/10"
                                                    title="View"
                                                >
                                                    <ArrowRight size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    disabled={deleting === project.id}
                                                    className="text-[#5a5a70] hover:text-red-400 transition-all duration-200 p-2 rounded-xl hover:bg-red-500/10 disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
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
                                className="glass-card-hover block p-5 animate-fade-in"
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-white font-semibold">{project.client_name}</h3>
                                        <p className="text-[#5a5a70] text-sm">{project.project_type}</p>
                                    </div>
                                    <ProjectPipeline status={project.status} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#5a5a70] text-xs flex items-center gap-1">
                                            <Calendar size={12} /> {formatDate(project.created_at)}
                                        </span>
                                        {project.client_viewed_at && (
                                            <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                                                <Eye size={12} /> Viewed
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteProject(project.id);
                                        }}
                                        className="text-[#5a5a70] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (searchQuery || statusFilter !== 'All') && (
                        <div className="text-center py-16 text-[#5a5a70]">
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
