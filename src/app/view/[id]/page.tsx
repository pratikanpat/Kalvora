'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Download, MapPin, Phone, Mail, Building, User, Sparkles, CheckCircle2, MessageSquare, Clock, Send, Loader2, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

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
    tax_rate: number;
    created_at: string;
    rooms: { name: string; square_footage: number }[];
    line_items: { item_name: string; quantity: number; unit_price: number }[];
    proposals: { pdf_url: string }[];
    status: string;
}

interface Comment {
    id: string;
    content: string;
    author_type: string;
    created_at: string;
}

export default function PublicViewPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Separate loading states so they don't interfere
    const [approving, setApproving] = useState(false);
    const [sendingComment, setSendingComment] = useState(false);
    const [clientComment, setClientComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        loadProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const loadProject = async () => {
        try {
            const { data: proj, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();
            if (error || !proj) { setNotFound(true); return; }

            const { data: rooms } = await supabase.from('rooms').select('*').eq('project_id', projectId);
            const { data: items } = await supabase.from('line_items').select('*').eq('project_id', projectId);
            const { data: proposals } = await supabase.from('proposals').select('pdf_url').eq('project_id', projectId).order('created_at', { ascending: false }).limit(1);

            // Load all comments for this project
            const { data: commentsData } = await supabase
                .from('comments')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });

            setComments(commentsData || []);
            setProject({ ...proj, rooms: rooms || [], line_items: items || [], proposals: proposals || [] });

            // Mark as viewed in the background
            if (proj.status !== 'Approved') {
                fetch('/api/respond-proposal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectId,
                        action: 'viewed',
                        clientName: proj.client_name,
                        projectName: proj.project_type
                    })
                }).catch(console.error);
            }
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!project) return;
        setApproving(true);
        try {
            const res = await fetch('/api/respond-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    action: 'approve',
                    clientName: project.client_name,
                    projectName: project.project_type
                })
            });

            if (!res.ok) throw new Error('Failed to approve');

            toast.success('Proposal approved! Redirecting to your invoice...');
            setProject({ ...project, status: 'Approved' });
            setShowApproveModal(false);
            setRedirecting(true);

            // Redirect to invoice page after a brief delay
            setTimeout(() => {
                router.push(`/invoice/${projectId}`);
            }, 800);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setApproving(false);
        }
    };

    const handleSendComment = async () => {
        if (!project || !clientComment.trim()) return;
        setSendingComment(true);
        try {
            const res = await fetch('/api/respond-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    action: 'request_changes',
                    comment: clientComment.trim(),
                    clientName: project.client_name,
                    projectName: project.project_type
                })
            });

            if (!res.ok) throw new Error('Failed to send feedback');

            toast.success('Your feedback has been sent to the designer.');

            // Add the comment locally so it appears instantly
            const newComment: Comment = {
                id: crypto.randomUUID(),
                content: clientComment.trim(),
                author_type: 'Client',
                created_at: new Date().toISOString(),
            };
            setComments(prev => [...prev, newComment]);
            setClientComment('');
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSendingComment(false);
        }
    };

    const formatCurrency = (a: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(a);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const formatCommentTime = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <LoadingSpinner text="Loading proposal..." />
        </div>
    );

    if (notFound || !project) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="text-center px-4">
                <h1 className="text-2xl font-bold text-white mb-2">Proposal Not Found</h1>
                <p className="text-[#5a5a70]">This proposal may have been removed or the link is invalid.</p>
            </div>
        </div>
    );

    const subtotal = project.line_items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const taxAmount = subtotal * (project.tax_rate / 100);
    const grandTotal = subtotal + taxAmount;
    const latestPdf = project.proposals[0];
    const isApproved = project.status === 'Approved';

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Kalvora Branding Bar */}
            <div className="border-b border-[#1a1a2e] bg-[#08080d]/90 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <Link href="/" className="group">
                        <span className="brand-wordmark text-sm group-hover:opacity-80 transition-opacity">Kalvora</span>
                    </Link>
                    <span className="text-[#3a3a50] text-xs">Powered by <span className="brand-wordmark-inline text-[#5a5a70] text-xs">Kalvora</span></span>
                </div>
            </div>

            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        background: `linear-gradient(135deg, ${project.accent_color} 0%, transparent 60%)`,
                    }}
                />
                <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles size={18} className="text-brand-400" />
                        <span className="text-[#5a5a70] text-xs sm:text-sm uppercase tracking-wider font-medium">Interior Design Proposal</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                        Proposal for {project.client_name}
                    </h1>
                    <p className="text-[#8888a0] text-sm sm:text-base mb-2">
                        {project.project_type} Project • {formatDate(project.created_at)}
                    </p>
                    {project.designer_name && (
                        <p className="text-[#5a5a70] text-sm">
                            Prepared by <span className="text-white">{project.designer_name}</span>
                        </p>
                    )}

                    {/* Status Badge */}
                    {isApproved && (
                        <div className="mt-5 inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold">
                            <CheckCircle2 size={16} /> Approved
                        </div>
                    )}

                    {latestPdf && (
                        <div className="mt-5">
                            <a href={latestPdf.pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex text-sm sm:text-base">
                                <Download size={18} /> Download PDF
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-32 space-y-4 sm:space-y-6">
                {/* Project Summary */}
                <div className="glass-card p-4 sm:p-6">
                    <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider mb-4">Project Summary</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-[#5a5a70] flex-shrink-0" />
                            <div><p className="text-xs text-[#5a5a70]">Client</p><p className="text-white text-sm sm:text-base">{project.client_name}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Building size={16} className="text-[#5a5a70] flex-shrink-0" />
                            <div><p className="text-xs text-[#5a5a70]">Type</p><p className="text-white text-sm sm:text-base">{project.project_type}</p></div>
                        </div>
                        {project.project_address && (
                            <div className="flex items-start gap-3 sm:col-span-2">
                                <MapPin size={16} className="text-[#5a5a70] mt-0.5 flex-shrink-0" />
                                <div><p className="text-xs text-[#5a5a70]">Address</p><p className="text-white text-sm sm:text-base">{project.project_address}</p></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rooms */}
                {project.rooms.length > 0 && (
                    <div className="glass-card p-4 sm:p-6">
                        <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider mb-4">Rooms</h2>
                        <div className="space-y-2">
                            {project.rooms.map((r, i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-[#1a1a2e] last:border-0">
                                    <span className="text-white text-sm sm:text-base">{r.name}</span>
                                    <span className="text-[#8888a0] text-xs sm:text-sm">{r.square_footage} sq.ft</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total Cost */}
                <div className="glass-card p-4 sm:p-6" style={{ borderColor: project.accent_color + '30' }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider">Total Project Cost</h2>
                            <p className="text-[#5a5a70] text-xs mt-1">Including {project.tax_rate}% tax</p>
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold" style={{ color: project.accent_color }}>
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>
                </div>

                {/* Designer Contact */}
                {project.designer_name && (
                    <div className="glass-card p-4 sm:p-6">
                        <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider mb-4">Designer Contact</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User size={16} className="text-[#5a5a70] flex-shrink-0" />
                                <span className="text-white text-sm sm:text-base">{project.designer_name}</span>
                            </div>
                            {project.designer_email && (
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-[#5a5a70] flex-shrink-0" />
                                    <a href={`mailto:${project.designer_email}`} className="text-brand-400 hover:text-brand-300 text-sm sm:text-base break-all">{project.designer_email}</a>
                                </div>
                            )}
                            {project.designer_phone && (
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-[#5a5a70] flex-shrink-0" />
                                    <a href={`tel:${project.designer_phone}`} className="text-brand-400 hover:text-brand-300 text-sm sm:text-base">{project.designer_phone}</a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════
                   DISCUSSION / COMMENTS SECTION
                   ═══════════════════════════════════════════════════ */}
                <div className="glass-card p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <MessageSquare size={18} className="text-brand-400" />
                        <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider">
                            Discussion {comments.length > 0 && <span className="text-brand-400 ml-1">({comments.length})</span>}
                        </h2>
                    </div>

                    {/* Existing Comments */}
                    {comments.length > 0 ? (
                        <div className="space-y-4 mb-5">
                            {comments.map((c) => (
                                <div key={c.id} className="pl-3 sm:pl-4 border-l-2 border-[#2a2a40]">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.author_type === 'Client'
                                                ? 'bg-amber-500/15 text-amber-400'
                                                : 'bg-brand-700/20 text-brand-400'
                                            }`}>
                                            {c.author_type === 'Client' ? project.client_name : (project.designer_name || 'Designer')}
                                        </span>
                                        <span className="text-[#5a5a70] text-[11px] flex items-center gap-1">
                                            <Clock size={10} /> {formatCommentTime(c.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-[#c8c8d0] text-sm leading-relaxed whitespace-pre-wrap">{c.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 mb-4">
                            <MessageSquare size={24} className="mx-auto text-[#2a2a40] mb-2" />
                            <p className="text-[#5a5a70] text-sm">No comments yet. Start the conversation below.</p>
                        </div>
                    )}

                    {/* Comment Input */}
                    {!isApproved ? (
                        <div className="border-t border-[#1a1a2e] pt-4">
                            <label className="text-xs text-[#5a5a70] font-semibold uppercase tracking-wider mb-2 block">
                                Have feedback or need changes?
                            </label>
                            <textarea
                                value={clientComment}
                                onChange={(e) => setClientComment(e.target.value)}
                                className="input-field min-h-[80px] sm:min-h-[100px] mb-3 resize-y text-sm"
                                placeholder="I'd like to discuss the pricing for the kitchen tiles..."
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSendComment}
                                    disabled={sendingComment || !clientComment.trim()}
                                    className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendingComment ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} />
                                            Send Feedback
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-t border-[#1a1a2e] pt-4 text-center">
                            <p className="text-[#5a5a70] text-sm">This proposal has been approved. Contact the designer directly for further discussion.</p>
                        </div>
                    )}
                </div>

                {/* Powered by Kalvora — Viral CTA */}
                <div className="text-center pt-6 pb-2">
                    <a
                        href="/try"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-700/10 border border-brand-700/20 hover:bg-brand-700/20 hover:border-brand-700/30 transition-all duration-200 group"
                    >
                        <span className="text-[#5a5a70] text-xs">This proposal was created with</span>
                        <span className="brand-wordmark-inline text-brand-400 text-xs">Kalvora</span>
                        <span className="text-[#5a5a70] text-xs hidden sm:inline">-</span>
                        <span className="text-brand-400 text-xs font-medium hidden sm:inline group-hover:underline">Try it free - no signup needed →</span>
                    </a>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════
               STICKY BOTTOM ACTION BAR
               ═══════════════════════════════════════════════════ */}
            {!isApproved && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#12121a]/95 backdrop-blur-xl border-t border-[#2a2a40] p-3 sm:p-4 z-40">
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
                        <div className="hidden sm:block min-w-0">
                            <h3 className="text-white font-semibold text-sm">Ready to proceed?</h3>
                            <p className="text-[#5a5a70] text-xs">Click to approve this proposal</p>
                        </div>
                        <button
                            onClick={() => setShowApproveModal(true)}
                            disabled={approving}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 py-3 px-6 sm:px-8 text-sm sm:text-base transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {approving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={18} />
                                    Approve Proposal
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Approved Banner */}
            {isApproved && (
                <div className="fixed bottom-0 left-0 right-0 bg-emerald-500/10 backdrop-blur-xl border-t border-emerald-500/20 p-3 sm:p-4 z-40">
                    <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-emerald-400">
                        <CheckCircle2 size={20} />
                        <span className="font-semibold text-sm sm:text-base">This proposal has been approved.</span>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════
               APPROVAL CONFIRMATION MODAL
               ═══════════════════════════════════════════════════ */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#16161f] border border-[#2a2a40] rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button
                            onClick={() => setShowApproveModal(false)}
                            className="absolute top-4 right-4 text-[#5a5a70] hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Icon */}
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 mx-auto mb-5">
                            <FileText size={24} className="text-emerald-400" />
                        </div>

                        <h3 className="text-xl font-bold text-white text-center mb-2">
                            Approve this Proposal?
                        </h3>
                        <p className="text-[#8888a0] text-sm text-center leading-relaxed mb-6">
                            The designer will be notified. You will receive an invoice by email and can view it immediately.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                disabled={approving}
                                className="flex-1 py-3 px-5 rounded-xl border border-[#2a2a40] text-[#8888a0] hover:text-white hover:border-[#3a3a50] transition-all duration-200 font-medium text-sm disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={approving}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-200 text-sm disabled:opacity-60"
                            >
                                {approving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} />
                                        Yes, Approve & Get Invoice
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════
               REDIRECT LOADING OVERLAY
               ═══════════════════════════════════════════════════ */}
            {redirecting && (
                <div className="fixed inset-0 bg-[#0a0a0f]/95 backdrop-blur-md flex flex-col items-center justify-center z-[60] animate-in fade-in duration-300">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                            <Loader2 size={28} className="text-emerald-400 animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">Preparing Your Invoice</h3>
                    <p className="text-[#8888a0] text-sm">Redirecting you in a moment...</p>
                </div>
            )}
        </div>
    );
}
