'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/components/AuthProvider';
import {
    Download, Copy, Check, Edit, MapPin, Phone, Mail,
    Building, Calendar, ArrowLeft, DollarSign, ExternalLink, User, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ProjectData {
    id: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    project_address: string;
    project_type: string;
    designer_name: string;
    designer_email: string;
    designer_phone: string;
    accent_color: string;
    notes: string;
    payment_terms: string;
    template: string;
    tax_rate: number;
    status: string;
    created_at: string;
    rooms: { name: string; square_footage: number }[];
    line_items: { item_name: string; quantity: number; unit_price: number }[];
    proposals: { id: string; pdf_url: string; created_at: string }[];
}

export default function ProposalViewPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) loadProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, user]);

    const loadProject = async () => {
        try {
            // Run ALL queries in parallel — they only depend on projectId/user.id
            const [projectResult, roomsResult, itemsResult, proposalsResult] = await Promise.all([
                supabase.from('projects').select('*').eq('id', projectId).eq('user_id', user!.id).single(),
                supabase.from('rooms').select('*').eq('project_id', projectId),
                supabase.from('line_items').select('*').eq('project_id', projectId),
                supabase.from('proposals').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
            ]);

            if (projectResult.error || !projectResult.data) throw projectResult.error || new Error('Not found');

            setProject({
                ...projectResult.data,
                rooms: roomsResult.data || [],
                line_items: itemsResult.data || [],
                proposals: proposalsResult.data || [],
            });
        } catch (err) {
            console.error(err);
            toast.error('Project not found');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!project) return;
        setStatusUpdating(true);
        try {
            const { error } = await supabase
                .from('projects')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', projectId);
            if (error) throw error;
            setProject({ ...project, status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
        } catch {
            toast.error('Failed to update status');
        } finally {
            setStatusUpdating(false);
        }
    };

    const copyShareLink = async () => {
        const link = `${window.location.origin}/view/${projectId}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Link copied!');
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const formatCurrency = (a: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(a);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (loading) return <DashboardLayout><LoadingSpinner text="Loading proposal..." /></DashboardLayout>;
    if (!project) return <DashboardLayout><div className="text-center py-20 text-[#5a5a70]">Project not found</div></DashboardLayout>;

    const subtotal = project.line_items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const taxAmount = subtotal * (project.tax_rate / 100);
    const grandTotal = subtotal + taxAmount;
    const latestPdf = project.proposals[0];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#5a5a70] hover:text-white text-sm mb-6 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Dashboard
                </Link>

                {/* Header Card */}
                <div className="glass-card p-6 mb-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">{project.client_name}</h1>
                            <p className="text-[#5a5a70] text-sm mt-1">
                                {project.project_type} · {project.project_address || 'No address'}
                            </p>
                            <p className="text-[#3a3a50] text-xs mt-1">Created {formatDate(project.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={project.status}
                                onChange={(e) => updateStatus(e.target.value)}
                                disabled={statusUpdating}
                                className="input-field w-auto text-sm py-2 px-3"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Sent">Sent</option>
                                <option value="Approved">Approved</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[#2a2a40]">
                        <button onClick={copyShareLink} className="btn-secondary text-sm py-2">
                            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                            {copied ? 'Copied!' : 'Copy Shareable Link'}
                        </button>
                        {latestPdf && (
                            <a href={latestPdf.pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2">
                                <Download size={15} /> Download PDF
                            </a>
                        )}
                        <Link href={`/edit/${projectId}`} className="btn-secondary text-sm py-2">
                            <Edit size={15} /> Edit Project
                        </Link>
                    </div>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Client Info */}
                    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <h3 className="text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] mb-5">Client Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-700/10 flex items-center justify-center">
                                    <User size={14} className="text-brand-400" />
                                </div>
                                <span className="text-white font-medium">{project.client_name}</span>
                            </div>
                            {project.client_email && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#12121a] flex items-center justify-center">
                                        <Mail size={14} className="text-[#5a5a70]" />
                                    </div>
                                    <span className="text-[#8888a0] text-sm">{project.client_email}</span>
                                </div>
                            )}
                            {project.client_phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#12121a] flex items-center justify-center">
                                        <Phone size={14} className="text-[#5a5a70]" />
                                    </div>
                                    <span className="text-[#8888a0] text-sm">{project.client_phone}</span>
                                </div>
                            )}
                            {project.project_address && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#12121a] flex items-center justify-center flex-shrink-0">
                                        <MapPin size={14} className="text-[#5a5a70]" />
                                    </div>
                                    <span className="text-[#8888a0] text-sm">{project.project_address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rooms */}
                    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
                        <h3 className="text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] mb-5">Rooms</h3>
                        {project.rooms.length > 0 ? (
                            <div className="space-y-2">
                                {project.rooms.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#12121a]/50 border border-[#1a1a2e]">
                                        <span className="text-white text-sm flex items-center gap-2.5">
                                            <Building size={14} className="text-[#5a5a70]" />
                                            {r.name}
                                        </span>
                                        <span className="text-[#6a6a80] text-xs font-medium bg-[#1a1a2e] px-2.5 py-1 rounded-lg">{r.square_footage} sq.ft</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#5a5a70] text-sm">No rooms added</p>
                        )}
                    </div>
                </div>

                {/* Pricing */}
                <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] mb-5">Pricing Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a40]">
                                    <th className="text-left text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] py-3">Item</th>
                                    <th className="text-center text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] py-3 w-20">Qty</th>
                                    <th className="text-right text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] py-3">Unit Price</th>
                                    <th className="text-right text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] py-3">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.line_items.map((item, i) => (
                                    <tr key={i} className="border-b border-[#1a1a2e]/60 table-row-hover">
                                        <td className="py-3.5 text-white text-sm font-medium">{item.item_name}</td>
                                        <td className="py-3.5 text-center text-[#8888a0] text-sm">{item.quantity}</td>
                                        <td className="py-3.5 text-right text-[#8888a0] text-sm">{formatCurrency(item.unit_price)}</td>
                                        <td className="py-3.5 text-right text-white text-sm font-semibold">{formatCurrency(item.quantity * item.unit_price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-[#2a2a40] pt-4 mt-2 space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#6a6a80]">Subtotal</span>
                            <span className="text-[#c0c0d0] font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#6a6a80]">Tax ({project.tax_rate}%)</span>
                            <span className="text-[#c0c0d0] font-medium">{formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-[#2a2a40]">
                            <span className="text-white font-bold flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-brand-700/15 flex items-center justify-center">
                                    <DollarSign size={14} className="text-brand-400" />
                                </div>
                                Grand Total
                            </span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                                {formatCurrency(grandTotal)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(project.notes || project.payment_terms) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {project.notes && (
                            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '250ms' }}>
                                <h3 className="text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] mb-3">Project Notes</h3>
                                <p className="text-[#8888a0] text-sm whitespace-pre-wrap leading-relaxed">{project.notes}</p>
                            </div>
                        )}
                        {project.payment_terms && (
                            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
                                <h3 className="text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] mb-3">Payment Terms</h3>
                                <p className="text-[#8888a0] text-sm whitespace-pre-wrap leading-relaxed">{project.payment_terms}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Generated PDFs History */}
                {project.proposals.length > 0 && (
                    <div className="glass-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '350ms' }}>
                        <h3 className="text-[10px] font-bold text-[#5a5a70] uppercase tracking-[0.15em] mb-4">Generated PDFs</h3>
                        <div className="space-y-2">
                            {project.proposals.map((p) => (
                                <div key={p.id} className="flex items-center justify-between py-3 px-3 rounded-xl bg-[#12121a]/50 border border-[#1a1a2e]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-700/10 flex items-center justify-center">
                                            <FileText size={14} className="text-brand-400" />
                                        </div>
                                        <span className="text-[#8888a0] text-sm">{formatDate(p.created_at)}</span>
                                    </div>
                                    <a href={p.pdf_url} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1.5 transition-colors">
                                        <ExternalLink size={14} /> View PDF
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
