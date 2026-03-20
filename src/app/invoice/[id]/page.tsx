'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FileText, Download, Building, User, Mail, Phone, MapPin, Calendar, Hash, Landmark, CreditCard, Clock } from 'lucide-react';

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
    updated_at: string;
    payment_terms: string;
    logo_url: string;
    status: string;
    rooms: { name: string; square_footage: number }[];
    line_items: { item_name: string; quantity: number; unit_price: number }[];
}

interface PaymentMilestone {
    id: string;
    label: string;
    amount: number;
    due_date: string | null;
    paid_at: string | null;
}

interface DesignerProfile {
    studio_name: string;
    studio_address: string;
    email: string;
    phone: string;
    gstin: string;
    pan_number: string;
    hsn_sac_code: string;
    invoice_due_days: number;
    bank_name: string;
    bank_account_number: string;
    bank_ifsc: string;
    upi_id: string;
}

export default function InvoicePage() {
    const params = useParams();
    const projectId = params.id as string;
    const [project, setProject] = useState<ProjectData | null>(null);
    const [designerProfile, setDesignerProfile] = useState<DesignerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [milestones, setMilestones] = useState<PaymentMilestone[]>([]);

    useEffect(() => {
        loadInvoice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const loadInvoice = async () => {
        try {
            const { data: proj, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();
            if (error || !proj) { setNotFound(true); return; }

            const [roomsRes, itemsRes, milestonesRes] = await Promise.all([
                supabase.from('rooms').select('*').eq('project_id', projectId),
                supabase.from('line_items').select('*').eq('project_id', projectId),
                supabase.from('payment_milestones').select('*').eq('project_id', projectId).order('created_at', { ascending: true }),
            ]);
            setMilestones(milestonesRes.data || []);

            // Fetch designer profile for GST, bank, and other details
            if (proj.user_id) {
                const { data: profile } = await supabase
                    .from('designer_profiles')
                    .select('studio_name, studio_address, email, phone, gstin, pan_number, hsn_sac_code, invoice_due_days, bank_name, bank_account_number, bank_ifsc, upi_id')
                    .eq('user_id', proj.user_id)
                    .single();
                if (profile) setDesignerProfile(profile);
            }

            setProject({
                ...proj,
                rooms: roomsRes.data || [],
                line_items: itemsRes.data || [],
            });
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (a: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(a);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <LoadingSpinner text="Loading invoice..." />
        </div>
    );

    if (notFound || !project) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="text-center px-4">
                <h1 className="text-2xl font-bold text-white mb-2">Invoice Not Found</h1>
                <p className="text-[#5a5a70]">This invoice may not exist or the link is invalid.</p>
            </div>
        </div>
    );

    const subtotal = project.line_items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const taxAmount = subtotal * (project.tax_rate / 100);
    const grandTotal = subtotal + taxAmount;

    // GST split — assume intra-state (CGST + SGST, 50/50)
    const halfTax = taxAmount / 2;
    const halfRate = project.tax_rate / 2;

    // Generate invoice number from the creation date + last 4 chars of ID
    const invoiceDate = project.updated_at || project.created_at;
    const datePrefix = new Date(invoiceDate).toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNumber = `INV-${datePrefix}-${project.id.slice(-4).toUpperCase()}`;

    // Due date calculation
    const dueDays = designerProfile?.invoice_due_days ?? 7;
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + dueDays);

    // HSN/SAC code from designer profile
    const hsnSac = designerProfile?.hsn_sac_code || '';

    // Check if bank details exist
    const hasBankDetails = designerProfile?.bank_name || designerProfile?.bank_account_number || designerProfile?.bank_ifsc;
    const hasUpi = designerProfile?.upi_id;
    const hasPaymentInfo = hasBankDetails || hasUpi;

    return (
        <>
            {/* Print-specific styles */}
            <style jsx global>{`
                @media print {
                    body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .print-container { 
                        background: white !important; 
                        padding: 0 !important; 
                        max-width: 100% !important; 
                        margin: 0 !important;
                    }
                    .invoice-card {
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                    }
                    .print-dark-text { color: #111 !important; }
                    .print-gray-text { color: #555 !important; }
                    .print-border { border-color: #e5e7eb !important; }
                }
            `}</style>

            <div className="min-h-screen bg-[#0a0a0f]">
                {/* Top Bar — Print / Download */}
                <div className="no-print bg-[#12121a]/95 backdrop-blur-xl border-b border-[#2a2a40] sticky top-0 z-40">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText size={20} className="text-brand-400" />
                            <span className="text-white font-semibold text-sm sm:text-base">Invoice</span>
                            <span className="text-[#5a5a70] text-xs sm:text-sm">#{invoiceNumber}</span>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-xl py-2.5 px-5 text-sm transition-all duration-200"
                        >
                            <Download size={16} />
                            Print / Save as PDF
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="print-container max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <div className="invoice-card glass-card p-6 sm:p-10 space-y-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between gap-6">
                            <div>
                                {project.logo_url && (
                                    <img
                                        src={project.logo_url}
                                        alt="Studio Logo"
                                        className="h-12 sm:h-14 object-contain mb-3"
                                    />
                                )}
                                <h1 className="text-2xl sm:text-3xl font-bold text-white print-dark-text">INVOICE</h1>
                                <p className="text-[#5a5a70] print-gray-text text-sm mt-1">{invoiceNumber}</p>
                            </div>
                            <div className="text-left sm:text-right space-y-1.5">
                                <div className="flex items-center gap-2 sm:justify-end">
                                    <Calendar size={14} className="text-[#5a5a70]" />
                                    <span className="text-[#8888a0] print-gray-text text-sm">
                                        Invoice Date: <span className="text-white print-dark-text font-medium">{formatDate(invoiceDate)}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 sm:justify-end">
                                    <Clock size={14} className="text-[#5a5a70]" />
                                    <span className="text-[#8888a0] print-gray-text text-sm">
                                        Due Date: <span className="text-white print-dark-text font-medium">{formatDate(dueDate.toISOString())}</span>
                                    </span>
                                </div>
                                {/* Status */}
                                <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                                    ◉ Unpaid
                                </div>
                            </div>
                        </div>

                        {/* From / To */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-[#1a1a2e] print-border py-6">
                            {/* From */}
                            <div>
                                <h3 className="text-xs font-semibold text-[#5a5a70] uppercase tracking-wider mb-3">From</h3>
                                <div className="space-y-2">
                                    {project.designer_name && (
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-[#5a5a70]" />
                                            <span className="text-white print-dark-text text-sm font-medium">{project.designer_name}</span>
                                        </div>
                                    )}
                                    {(designerProfile?.studio_name) && (
                                        <div className="flex items-center gap-2">
                                            <Building size={14} className="text-[#5a5a70]" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">{designerProfile.studio_name}</span>
                                        </div>
                                    )}
                                    {project.designer_email && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-[#5a5a70]" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">{project.designer_email}</span>
                                        </div>
                                    )}
                                    {project.designer_phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-[#5a5a70]" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">{project.designer_phone}</span>
                                        </div>
                                    )}
                                    {designerProfile?.studio_address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin size={14} className="text-[#5a5a70] mt-0.5" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">{designerProfile.studio_address}</span>
                                        </div>
                                    )}
                                    {designerProfile?.gstin && (
                                        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-[#1a1a2e] print-border">
                                            <Hash size={14} className="text-[#5a5a70]" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">GSTIN: <span className="text-white print-dark-text font-mono font-medium">{designerProfile.gstin}</span></span>
                                        </div>
                                    )}
                                    {designerProfile?.pan_number && !designerProfile?.gstin && (
                                        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-[#1a1a2e] print-border">
                                            <CreditCard size={14} className="text-[#5a5a70]" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">PAN: <span className="text-white print-dark-text font-mono font-medium">{designerProfile.pan_number}</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* To */}
                            <div>
                                <h3 className="text-xs font-semibold text-[#5a5a70] uppercase tracking-wider mb-3">Bill To</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-[#5a5a70]" />
                                        <span className="text-white print-dark-text text-sm font-medium">{project.client_name}</span>
                                    </div>
                                    {project.client_email && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-[#5a5a70]" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">{project.client_email}</span>
                                        </div>
                                    )}
                                    {project.client_phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-[#5a5a70]" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">{project.client_phone}</span>
                                        </div>
                                    )}
                                    {project.project_address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin size={14} className="text-[#5a5a70] mt-0.5" />
                                            <span className="text-[#8888a0] print-gray-text text-sm">{project.project_address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div>
                            <h3 className="text-xs font-semibold text-[#5a5a70] uppercase tracking-wider mb-3">Project Details</h3>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="text-[#8888a0] print-gray-text">Type: <span className="text-white print-dark-text">{project.project_type}</span></span>
                                {project.rooms.length > 0 && (
                                    <span className="text-[#8888a0] print-gray-text">Rooms: <span className="text-white print-dark-text">{project.rooms.map(r => r.name).join(', ')}</span></span>
                                )}
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div>
                            <h3 className="text-xs font-semibold text-[#5a5a70] uppercase tracking-wider mb-3">Line Items</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#2a2a40] print-border">
                                            <th className="text-left py-3 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">#</th>
                                            <th className="text-left py-3 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">Description</th>
                                            {hsnSac && (
                                                <th className="text-center py-3 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">HSN/SAC</th>
                                            )}
                                            <th className="text-center py-3 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">Qty</th>
                                            <th className="text-right py-3 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">Unit Price</th>
                                            <th className="text-right py-3 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {project.line_items.map((item, i) => (
                                            <tr key={i} className="border-b border-[#1a1a2e] print-border">
                                                <td className="py-3 text-[#5a5a70]">{i + 1}</td>
                                                <td className="py-3 text-white print-dark-text">{item.item_name}</td>
                                                {hsnSac && (
                                                    <td className="py-3 text-center text-[#5a5a70] font-mono text-xs">{hsnSac}</td>
                                                )}
                                                <td className="py-3 text-center text-[#8888a0] print-gray-text">{item.quantity}</td>
                                                <td className="py-3 text-right text-[#8888a0] print-gray-text">{formatCurrency(item.unit_price)}</td>
                                                <td className="py-3 text-right text-white print-dark-text font-medium">{formatCurrency(item.quantity * item.unit_price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals with GST Breakdown */}
                        <div className="flex justify-end">
                            <div className="w-full sm:w-80 space-y-2 text-sm">
                                <div className="flex justify-between py-2">
                                    <span className="text-[#8888a0] print-gray-text">Subtotal</span>
                                    <span className="text-white print-dark-text">{formatCurrency(subtotal)}</span>
                                </div>
                                {designerProfile?.gstin ? (
                                    <>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-[#8888a0] print-gray-text">CGST ({halfRate}%)</span>
                                            <span className="text-white print-dark-text">{formatCurrency(halfTax)}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-[#8888a0] print-gray-text">SGST ({halfRate}%)</span>
                                            <span className="text-white print-dark-text">{formatCurrency(halfTax)}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between py-2">
                                        <span className="text-[#8888a0] print-gray-text">Tax ({project.tax_rate}%)</span>
                                        <span className="text-white print-dark-text">{formatCurrency(taxAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 border-t border-[#2a2a40] print-border">
                                    <span className="text-white print-dark-text font-bold text-base">Grand Total</span>
                                    <span className="text-xl font-bold" style={{ color: project.accent_color || '#4f46e5' }}>
                                        {formatCurrency(grandTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Schedule (Milestones) */}
                        {milestones.length > 0 && (
                            <div className="border-t border-[#1a1a2e] print-border pt-6">
                                <h3 className="text-xs font-semibold text-[#5a5a70] uppercase tracking-wider mb-3">Payment Schedule</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[#2a2a40] print-border">
                                                <th className="text-left py-2 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">Milestone</th>
                                                <th className="text-right py-2 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">Amount</th>
                                                <th className="text-center py-2 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">Due Date</th>
                                                <th className="text-center py-2 text-[#5a5a70] font-semibold uppercase text-xs tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {milestones.map((m) => (
                                                <tr key={m.id} className="border-b border-[#1a1a2e] print-border">
                                                    <td className="py-2.5 text-white print-dark-text">{m.label}</td>
                                                    <td className="py-2.5 text-right text-white print-dark-text font-medium">{formatCurrency(Number(m.amount))}</td>
                                                    <td className="py-2.5 text-center text-[#8888a0] print-gray-text">
                                                        {m.due_date ? new Date(m.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                    </td>
                                                    <td className="py-2.5 text-center">
                                                        {m.paid_at ? (
                                                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">✓ Paid</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">◉ Unpaid</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Payment Details */}
                        {hasPaymentInfo && (
                            <div className="border-t border-[#1a1a2e] print-border pt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Landmark size={16} className="text-brand-400" />
                                    <h3 className="text-xs font-semibold text-[#5a5a70] uppercase tracking-wider">Payment Details</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {hasBankDetails && (
                                        <div className="space-y-2">
                                            <p className="text-[#5a5a70] text-xs font-semibold uppercase tracking-wider">Bank Transfer</p>
                                            {designerProfile?.bank_name && (
                                                <p className="text-[#8888a0] print-gray-text text-sm">Bank: <span className="text-white print-dark-text">{designerProfile.bank_name}</span></p>
                                            )}
                                            {designerProfile?.bank_account_number && (
                                                <p className="text-[#8888a0] print-gray-text text-sm">A/C No: <span className="text-white print-dark-text font-mono">{designerProfile.bank_account_number}</span></p>
                                            )}
                                            {designerProfile?.bank_ifsc && (
                                                <p className="text-[#8888a0] print-gray-text text-sm">IFSC: <span className="text-white print-dark-text font-mono">{designerProfile.bank_ifsc}</span></p>
                                            )}
                                        </div>
                                    )}
                                    {hasUpi && (
                                        <div className="space-y-2">
                                            <p className="text-[#5a5a70] text-xs font-semibold uppercase tracking-wider">UPI</p>
                                            <p className="text-[#8888a0] print-gray-text text-sm">UPI ID: <span className="text-white print-dark-text font-mono">{designerProfile!.upi_id}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Payment Terms */}
                        {project.payment_terms && (
                            <div className="border-t border-[#1a1a2e] print-border pt-6">
                                <h3 className="text-xs font-semibold text-[#5a5a70] uppercase tracking-wider mb-3">Payment Terms</h3>
                                <p className="text-[#8888a0] print-gray-text text-sm whitespace-pre-wrap leading-relaxed">{project.payment_terms}</p>
                            </div>
                        )}

                        {/* Powered by Kalvora — Viral CTA */}
                        <div className="border-t border-[#1a1a2e] print-border pt-6 text-center">
                            <a
                                href="https://kalvora.kaliprlabs.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-700/10 border border-brand-700/20 hover:bg-brand-700/20 hover:border-brand-700/30 transition-all duration-200 group"
                            >
                                <span className="text-[#5a5a70] text-xs">This proposal was created with</span>
                                <span className="text-brand-400 text-xs font-bold tracking-wider">KALVORA</span>
                                <span className="text-[#5a5a70] text-xs hidden sm:inline">-</span>
                                <span className="text-brand-400 text-xs font-medium hidden sm:inline group-hover:underline">Create yours in 60 seconds →</span>
                            </a>
                            <p className="hidden print:block text-[#5a5a70] text-xs">
                                Generated with KALVORA • Professional Interior Design Proposals
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
