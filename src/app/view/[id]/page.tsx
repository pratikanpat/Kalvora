'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Download, MapPin, Phone, Mail, Building, User, Sparkles } from 'lucide-react';

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
}

export default function PublicViewPage() {
    const params = useParams();
    const projectId = params.id as string;
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

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

            setProject({ ...proj, rooms: rooms || [], line_items: items || [], proposals: proposals || [] });
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (a: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(a);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <LoadingSpinner text="Loading proposal..." />
        </div>
    );

    if (notFound || !project) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Proposal Not Found</h1>
                <p className="text-[#5a5a70]">This proposal may have been removed or the link is invalid.</p>
            </div>
        </div>
    );

    const subtotal = project.line_items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const taxAmount = subtotal * (project.tax_rate / 100);
    const grandTotal = subtotal + taxAmount;
    const latestPdf = project.proposals[0];

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        background: `linear-gradient(135deg, ${project.accent_color} 0%, transparent 60%)`,
                    }}
                />
                <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles size={18} className="text-brand-400" />
                        <span className="text-[#5a5a70] text-sm uppercase tracking-wider font-medium">Interior Design Proposal</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Proposal for {project.client_name}
                    </h1>
                    <p className="text-[#8888a0] mb-2">
                        {project.project_type} Project • {formatDate(project.created_at)}
                    </p>
                    {project.designer_name && (
                        <p className="text-[#5a5a70] text-sm">
                            Prepared by <span className="text-white">{project.designer_name}</span>
                        </p>
                    )}

                    {latestPdf && (
                        <a href={latestPdf.pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex mt-8">
                            <Download size={18} /> Download Full Proposal (PDF)
                        </a>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 pb-16 space-y-6">
                {/* Project Summary */}
                <div className="glass-card p-6">
                    <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider mb-4">Project Summary</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-[#5a5a70]" />
                            <div><p className="text-xs text-[#5a5a70]">Client</p><p className="text-white">{project.client_name}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Building size={16} className="text-[#5a5a70]" />
                            <div><p className="text-xs text-[#5a5a70]">Type</p><p className="text-white">{project.project_type}</p></div>
                        </div>
                        {project.project_address && (
                            <div className="flex items-start gap-3 sm:col-span-2">
                                <MapPin size={16} className="text-[#5a5a70] mt-0.5" />
                                <div><p className="text-xs text-[#5a5a70]">Address</p><p className="text-white">{project.project_address}</p></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rooms */}
                {project.rooms.length > 0 && (
                    <div className="glass-card p-6">
                        <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider mb-4">Rooms</h2>
                        <div className="space-y-2">
                            {project.rooms.map((r, i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-[#1a1a2e] last:border-0">
                                    <span className="text-white">{r.name}</span>
                                    <span className="text-[#8888a0] text-sm">{r.square_footage} sq.ft</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total Cost */}
                <div className="glass-card p-6" style={{ borderColor: project.accent_color + '30' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider">Total Project Cost</h2>
                            <p className="text-[#5a5a70] text-xs mt-1">Including {project.tax_rate}% tax</p>
                        </div>
                        <span className="text-3xl font-bold" style={{ color: project.accent_color }}>
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>
                </div>

                {/* Designer Contact */}
                {project.designer_name && (
                    <div className="glass-card p-6">
                        <h2 className="text-sm font-semibold text-[#5a5a70] uppercase tracking-wider mb-4">Designer Contact</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User size={16} className="text-[#5a5a70]" />
                                <span className="text-white">{project.designer_name}</span>
                            </div>
                            {project.designer_email && (
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-[#5a5a70]" />
                                    <a href={`mailto:${project.designer_email}`} className="text-brand-400 hover:text-brand-300">{project.designer_email}</a>
                                </div>
                            )}
                            {project.designer_phone && (
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-[#5a5a70]" />
                                    <a href={`tel:${project.designer_phone}`} className="text-brand-400 hover:text-brand-300">{project.designer_phone}</a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center pt-4">
                    <p className="text-[#5a5a70] text-xs">
                        Generated with <span className="text-brand-400">K A L V O R A</span> • Professional Interior Design Proposals
                    </p>
                </div>
            </div>
        </div>
    );
}
