'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import SuccessModal from '@/components/SuccessModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/components/AuthProvider';
import {
    User, Mail, Phone, MapPin, Building, Plus, Trash2,
    Save, Sparkles, ChevronDown,
    ChevronUp, IndianRupee, Calculator, StickyNote, LayoutTemplate,
    Loader2, FileText, Eye, Clock, CheckSquare, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import TemplatePreviewModal from '@/components/TemplatePreviewModal';

interface Room {
    id?: string;
    name: string;
    square_footage: string;
}

interface LineItem {
    id?: string;
    item_name: string;
    quantity: string;
    unit_price: string;
}

type Template = 'minimal' | 'luxury' | 'modern' | 'blueprint' | 'editorial' | 'highcontrast';

const templateOptions: { key: Template; name: string; desc: string; colors: string[] }[] = [
    { key: 'minimal', name: 'Minimal', desc: 'Clean white, Inter font, elegant blue accents', colors: ['#ffffff', '#2563EB', '#f8fafc'] },
    { key: 'luxury', name: 'Luxury', desc: 'Dark elegance with gold accents, serif fonts', colors: ['#1C1917', '#B8963E', '#FAF8F4'] },
    { key: 'modern', name: 'Professional', desc: 'Bold geometric, vibrant section dividers', colors: ['#4c6ef5', '#ffffff', '#f9fafb'] },
    { key: 'blueprint', name: 'Blueprint', desc: 'Technical grid, navy palette, engineering feel', colors: ['#1a365d', '#bee3f8', '#f7fafc'] },
    { key: 'editorial', name: 'Editorial', desc: 'Warm serif, magazine-style whitespace', colors: ['#FFFBF5', '#3d2b1f', '#e8dcc8'] },
    { key: 'highcontrast', name: 'High Contrast', desc: 'Bold contrast, indigo accent, SaaS-style', colors: ['#0f172a', '#6366f1', '#ffffff'] },
];

const templatePreviewData = [
    { name: 'Minimal', desc: 'Clean whites, Inter font, elegant simplicity.', colors: ['#ffffff', '#2563EB', '#f8fafc'], icon: '✦', badge: '⭐ Most Popular', previewImage: '/templates/minimal.png', stylePoints: ['Inter typography', 'Blue gradient accent', 'Stripe-inspired layout', 'Rounded card elements'] },
    { name: 'Luxury', desc: 'Gold & dark tones, serif typography, opulent feel.', colors: ['#1C1917', '#B8963E', '#FAF8F4'], icon: '✧', badge: 'Best for Luxury', previewImage: '/templates/luxury.png', stylePoints: ['Playfair Display headings', 'Gold accent on dark', 'Diamond ornament divider', 'Ivory background'] },
    { name: 'Professional', desc: 'Bold geometry, sharp type, corporate accents.', colors: ['#4c6ef5', '#ffffff', '#f9fafb'], icon: '◆', badge: 'Best for Corporate', previewImage: '/templates/professional.png', stylePoints: ['Full-width header bar', 'Inter bold headings', 'Bordered card sections', 'Corporate confidence'] },
    { name: 'Blueprint', desc: 'Technical grid, navy palette, engineering precision.', colors: ['#1a365d', '#bee3f8', '#f7fafc'], icon: '⊞', badge: 'Best for Architects', previewImage: '/templates/blueprint.png', stylePoints: ['Space Grotesk headings', 'Grid background', 'Section numbers', 'Engineering totals box'] },
    { name: 'Editorial', desc: 'Warm serif, magazine-style, generous whitespace.', colors: ['#FFFBF5', '#3d2b1f', '#e8dcc8'], icon: '❧', badge: 'Best for Creatives', previewImage: '/templates/editorial.png', stylePoints: ['Playfair Display headings', 'Warm off-white background', 'Italic title', 'Magazine whitespace'] },
    { name: 'High Contrast', desc: 'Bold contrast, indigo accent, SaaS-inspired.', colors: ['#0f172a', '#6366f1', '#ffffff'], icon: '▣', badge: 'Best for Modern', previewImage: '/templates/highcontrast.png', stylePoints: ['Dark header bar', 'Indigo highlights', 'Tabular numbers', 'Card-style sections'] },
];

const DEFAULT_SERVICES = [
    'Concept design',
    'Furniture layout',
    'Lighting plan',
    'Material selection',
    '3D visualization',
    'Site visits',
    'Vendor coordination',
];

export default function EditPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [pageLoading, setPageLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
        1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true,
    });

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [projectAddress, setProjectAddress] = useState('');
    const [projectType, setProjectType] = useState('Residential');
    const [projectSize, setProjectSize] = useState('');
    const [rooms, setRooms] = useState<Room[]>([{ name: '', square_footage: '' }]);
    const [servicesIncluded, setServicesIncluded] = useState<string[]>([]);
    const [customService, setCustomService] = useState('');
    const [lineItems, setLineItems] = useState<LineItem[]>([{ item_name: '', quantity: '1', unit_price: '' }]);
    const [taxRate, setTaxRate] = useState('0');
    const [estimatedStartDate, setEstimatedStartDate] = useState('');
    const [estimatedTimeline, setEstimatedTimeline] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [quotationValidity, setQuotationValidity] = useState('30');
    const [template, setTemplate] = useState<Template>('minimal');
    const [showModal, setShowModal] = useState(false);
    const [generatedPdfUrl, setGeneratedPdfUrl] = useState('');
    const [generatedFilename, setGeneratedFilename] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    const { user } = useAuth();

    useEffect(() => {
        if (user) loadProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, user]);

    const loadProject = async () => {
        try {
            const [projectResult, roomsResult, itemsResult] = await Promise.all([
                supabase.from('projects').select('*').eq('id', projectId).eq('user_id', user!.id).single(),
                supabase.from('rooms').select('*').eq('project_id', projectId),
                supabase.from('line_items').select('*').eq('project_id', projectId),
            ]);

            if (projectResult.error) throw projectResult.error;
            const project = projectResult.data;
            if (!project) throw new Error('Project not found');

            setClientName(project.client_name || '');
            setClientEmail(project.client_email || '');
            setClientPhone(project.client_phone || '');
            setProjectAddress(project.project_address || '');
            setProjectType(project.project_type || 'Residential');
            setProjectSize(project.project_size || '');
            setNotes(project.notes || '');
            setPaymentTerms(project.payment_terms || '');
            setTemplate((project.template as Template) || 'minimal');
            setTaxRate(String(project.tax_rate || 0));
            setQuotationValidity(String(project.quotation_validity || 30));
            setEstimatedStartDate(project.estimated_start_date || '');
            setEstimatedTimeline(project.estimated_timeline || '');
            setServicesIncluded(project.services_included || []);

            const roomData = roomsResult.data;
            if (roomData && roomData.length > 0) {
                setRooms(roomData.map((r) => ({ id: r.id, name: r.name, square_footage: String(r.square_footage || '') })));
            }

            const itemData = itemsResult.data;
            if (itemData && itemData.length > 0) {
                setLineItems(itemData.map((i) => ({ id: i.id, item_name: i.item_name, quantity: String(i.quantity || '1'), unit_price: String(i.unit_price || '') })));
            }
        } catch (err) {
            console.error('Error loading project:', err);
            toast.error('Failed to load project');
            router.push('/dashboard');
        } finally {
            setPageLoading(false);
        }
    };

    const toggleSection = (s: number) => setExpandedSections((prev) => ({ ...prev, [s]: !prev[s] }));
    const addRoom = () => setRooms([...rooms, { name: '', square_footage: '' }]);
    const removeRoom = (i: number) => setRooms(rooms.filter((_, idx) => idx !== i));
    const updateRoom = (i: number, f: keyof Room, v: string) => { const u = [...rooms]; u[i] = { ...u[i], [f]: v }; setRooms(u); };
    const addLineItem = () => setLineItems([...lineItems, { item_name: '', quantity: '1', unit_price: '' }]);
    const removeLineItem = (i: number) => setLineItems(lineItems.filter((_, idx) => idx !== i));
    const updateLineItem = (i: number, f: keyof LineItem, v: string) => { const u = [...lineItems]; u[i] = { ...u[i], [f]: v }; setLineItems(u); };
    const getSubtotal = (item: LineItem) => (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
    const totalBeforeTax = lineItems.reduce((sum, item) => sum + getSubtotal(item), 0);
    const taxAmount = totalBeforeTax * ((parseFloat(taxRate) || 0) / 100);
    const grandTotal = totalBeforeTax + taxAmount;
    const formatCurrency = (a: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(a);

    const toggleService = (service: string) => {
        setServicesIncluded(prev =>
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
    };
    const addCustomService = () => {
        const trimmed = customService.trim();
        if (trimmed && !servicesIncluded.includes(trimmed)) {
            setServicesIncluded(prev => [...prev, trimmed]);
            setCustomService('');
        }
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!clientName.trim()) errs.clientName = 'Client name is required';
        if (lineItems.filter((i) => i.item_name.trim()).length === 0) errs.lineItems = 'Add at least one line item';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const saveProject = async (andGenerate = false) => {
        if (!validate()) { toast.error('Please fix errors'); return; }
        andGenerate ? setGenerating(true) : setSaving(true);
        try {
            // Fetch designer profile
            const { data: profile } = await supabase
                .from('designer_profiles')
                .select('*')
                .eq('user_id', user!.id)
                .single();

            const { error: projectError } = await supabase.from('projects').update({
                client_name: clientName.trim(), client_email: clientEmail.trim(), client_phone: clientPhone.trim(),
                project_address: projectAddress.trim(), project_type: projectType, project_size: projectSize.trim(),
                designer_name: profile?.studio_name || profile?.designer_name || '',
                designer_email: profile?.email || '',
                designer_phone: profile?.phone || '',
                logo_url: profile?.logo_url || '',
                accent_color: profile?.default_accent_color || '#4263eb',
                notes: notes.trim(), payment_terms: paymentTerms.trim(), template,
                tax_rate: parseFloat(taxRate) || 0, updated_at: new Date().toISOString(),
                quotation_validity: parseInt(quotationValidity) || 30,
                estimated_start_date: estimatedStartDate.trim(),
                estimated_timeline: estimatedTimeline.trim(),
                services_included: servicesIncluded,
            }).eq('id', projectId);
            if (projectError) throw projectError;

            // Replace rooms and line items IN PARALLEL
            const validRooms = rooms.filter((r) => r.name.trim());
            const validItems = lineItems.filter((i) => i.item_name.trim());

            await Promise.all([
                supabase.from('rooms').delete().eq('project_id', projectId),
                supabase.from('line_items').delete().eq('project_id', projectId),
            ]);

            const insertOps = [];
            if (validRooms.length > 0) {
                insertOps.push(
                    supabase.from('rooms').insert(validRooms.map((r) => ({ project_id: projectId, name: r.name.trim(), square_footage: parseFloat(r.square_footage) || 0 })))
                );
            }
            if (validItems.length > 0) {
                insertOps.push(
                    supabase.from('line_items').insert(validItems.map((i) => ({ project_id: projectId, item_name: i.item_name.trim(), quantity: parseFloat(i.quantity) || 1, unit_price: parseFloat(i.unit_price) || 0 })))
                );
            }
            if (insertOps.length > 0) {
                await Promise.all(insertOps);
            }

            if (andGenerate) {
                const res = await fetch('/api/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: projectId }) });
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || 'PDF generation failed');
                setGeneratedPdfUrl(result.pdf_url);
                setGeneratedFilename(result.download_filename || '');
                setShowModal(true);
                toast.success('Proposal regenerated!');
            } else {
                toast.success('Project updated!');
                router.push(`/proposals/${projectId}`);
            }
        } catch (err) { console.error(err); toast.error(err instanceof Error ? err.message : 'Save failed'); }
        finally { setSaving(false); setGenerating(false); }
    };

    const SectionHeader = ({ number, icon: Icon, title }: { number: number; icon: React.ElementType; title: string }) => (
        <button onClick={() => toggleSection(number)} className="w-full flex items-center justify-between py-5 group">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700/20 to-brand-500/10 flex items-center justify-center border border-brand-700/15 group-hover:border-brand-500/30 transition-colors">
                    <Icon size={16} className="text-brand-400" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#12121a] flex items-center justify-center group-hover:bg-[#1a1a2e] transition-colors">
                {expandedSections[number] ? <ChevronUp size={16} className="text-[#5a5a70]" /> : <ChevronDown size={16} className="text-[#5a5a70]" />}
            </div>
        </button>
    );

    if (pageLoading) {
        return (
            <DashboardLayout>
                <LoadingSpinner text="Loading project..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Edit Proposal</h1>
                    <p className="text-[#5a5a70] text-sm mt-1">Update the project details and regenerate the proposal PDF.</p>
                </div>

                <div className="space-y-4">
                    {/* SECTION 1 — Client Info */}
                    <div className="glass-card px-6">
                        <SectionHeader number={1} icon={User} title="Client Information" />
                        {expandedSections[1] && (
                            <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                <div className="md:col-span-2">
                                    <label className="input-label">Client Full Name *</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Rahul Sharma" className={`input-field pl-10 ${errors.clientName ? 'border-red-500' : ''}`} />
                                    </div>
                                    {errors.clientName && <p className="text-red-400 text-xs mt-1">{errors.clientName}</p>}
                                </div>
                                <div><label className="input-label">Email</label><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" /><input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@email.com" className="input-field pl-10" /></div></div>
                                <div><label className="input-label">Phone</label><div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" /><input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+91 98765 43210" className="input-field pl-10" /></div></div>
                                <div className="md:col-span-2"><label className="input-label">Project Address</label><div className="relative"><MapPin size={16} className="absolute left-3 top-3 text-[#5a5a70]" /><textarea value={projectAddress} onChange={(e) => setProjectAddress(e.target.value)} placeholder="Full project address" rows={2} className="input-field pl-10" /></div></div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2 — Project Details */}
                    <div className="glass-card px-6">
                        <SectionHeader number={2} icon={Building} title="Project Details" />
                        {expandedSections[2] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Project Type *</label>
                                        <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="input-field">
                                            <option value="Residential">Residential</option>
                                            <option value="Commercial">Commercial</option>
                                            <option value="Office">Office</option>
                                            <option value="Retail">Retail</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="input-label">Project Size (sq.ft)</label>
                                        <input type="text" value={projectSize} onChange={(e) => setProjectSize(e.target.value)} placeholder="e.g. 1500" className="input-field" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 3 — Rooms / Areas */}
                    <div className="glass-card px-6">
                        <SectionHeader number={3} icon={MapPin} title="Rooms / Areas Covered" />
                        {expandedSections[3] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <label className="input-label mb-0">Rooms</label>
                                    <button onClick={addRoom} className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1"><Plus size={14} /> Add Room</button>
                                </div>
                                <div className="space-y-2">
                                    {rooms.map((room, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input type="text" value={room.name} onChange={(e) => updateRoom(i, 'name', e.target.value)} placeholder="Room name" className="input-field flex-1" />
                                            <input type="number" value={room.square_footage} onChange={(e) => updateRoom(i, 'square_footage', e.target.value)} placeholder="Sq.ft" className="input-field w-28" />
                                            {rooms.length > 1 && <button onClick={() => removeRoom(i)} className="text-[#5a5a70] hover:text-red-400 p-2"><Trash2 size={16} /></button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['Living Room', 'Kitchen', 'Master Bedroom', 'Guest Bedroom', 'Bathroom', 'Balcony'].map(roomName => (
                                        <button
                                            key={roomName}
                                            onClick={() => {
                                                const emptyIdx = rooms.findIndex(r => !r.name.trim());
                                                if (emptyIdx >= 0) { updateRoom(emptyIdx, 'name', roomName); } else { setRooms([...rooms, { name: roomName, square_footage: '' }]); }
                                            }}
                                            className="text-xs px-2.5 py-1.5 rounded-lg bg-[#12121a] border border-[#2a2a40] text-[#8888a0] hover:text-brand-400 hover:border-brand-700/30 transition-colors"
                                        >
                                            + {roomName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 4 — Services Included */}
                    <div className="glass-card px-6">
                        <SectionHeader number={4} icon={CheckSquare} title="Services Included" />
                        {expandedSections[4] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <p className="text-[#5a5a70] text-xs">Select the services included in this project.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {DEFAULT_SERVICES.map(service => (
                                        <button
                                            key={service}
                                            onClick={() => toggleService(service)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200 ${
                                                servicesIncluded.includes(service)
                                                    ? 'border-brand-500/50 bg-brand-700/10 text-brand-300'
                                                    : 'border-[#2a2a40] bg-[#12121a] text-[#8888a0] hover:border-[#3a3a55] hover:text-white'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                servicesIncluded.includes(service) ? 'border-brand-500 bg-brand-500' : 'border-[#3a3a55]'
                                            }`}>
                                                {servicesIncluded.includes(service) && (
                                                    <svg viewBox="0 0 12 12" className="w-3 h-3 text-white"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                )}
                                            </div>
                                            {service}
                                        </button>
                                    ))}
                                    {servicesIncluded.filter(s => !DEFAULT_SERVICES.includes(s)).map(service => (
                                        <button key={service} onClick={() => toggleService(service)} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-500/50 bg-brand-700/10 text-brand-300 text-left text-sm transition-all duration-200">
                                            <div className="w-5 h-5 rounded-md border-2 border-brand-500 bg-brand-500 flex items-center justify-center flex-shrink-0">
                                                <svg viewBox="0 0 12 12" className="w-3 h-3 text-white"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                            {service}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" value={customService} onChange={(e) => setCustomService(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustomService()} placeholder="Add custom service..." className="input-field flex-1" />
                                    <button onClick={addCustomService} className="btn-secondary whitespace-nowrap"><Plus size={16} /> Add</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 5 — Pricing */}
                    <div className="glass-card px-6">
                        <SectionHeader number={5} icon={IndianRupee} title="Pricing Table" />
                        {expandedSections[5] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div className="flex items-center justify-between"><label className="input-label mb-0">Line Items *</label><button onClick={addLineItem} className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1"><Plus size={14} /> Add Item</button></div>
                                {errors.lineItems && <p className="text-red-400 text-xs">{errors.lineItems}</p>}
                                <div className="hidden md:grid grid-cols-[1fr_100px_120px_120px_40px] gap-2 text-xs font-semibold text-[#5a5a70] uppercase tracking-wider px-1"><span>Item</span><span>Qty</span><span>Unit Price</span><span>Subtotal</span><span></span></div>
                                <div className="space-y-2">
                                    {lineItems.map((item, i) => (
                                        <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_100px_120px_120px_40px] gap-2 items-center">
                                            <input type="text" value={item.item_name} onChange={(e) => updateLineItem(i, 'item_name', e.target.value)} placeholder="Item name" className="input-field" />
                                            <input type="number" value={item.quantity} onChange={(e) => updateLineItem(i, 'quantity', e.target.value)} placeholder="1" className="input-field" />
                                            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70] text-sm">₹</span><input type="number" value={item.unit_price} onChange={(e) => updateLineItem(i, 'unit_price', e.target.value)} placeholder="0" className="input-field pl-7" /></div>
                                            <div className="text-[#8888a0] font-medium text-sm px-2">{formatCurrency(getSubtotal(item))}</div>
                                            {lineItems.length > 1 && <button onClick={() => removeLineItem(i)} className="text-[#5a5a70] hover:text-red-400 p-2"><Trash2 size={16} /></button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-[#2a2a40] pt-4 space-y-3">
                                    <div className="flex justify-between"><span className="text-[#8888a0] text-sm">Subtotal</span><span className="text-white font-medium">{formatCurrency(totalBeforeTax)}</span></div>
                                    <div className="flex justify-between gap-4"><span className="text-[#8888a0] text-sm flex items-center gap-2">Tax<input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="input-field w-20 text-center py-1" min="0" max="100" />%</span><span className="text-white font-medium">{formatCurrency(taxAmount)}</span></div>
                                    <div className="flex justify-between pt-3 border-t border-[#2a2a40]"><span className="text-white font-semibold flex items-center gap-2"><Calculator size={16} className="text-brand-400" />Grand Total</span><span className="text-xl font-bold text-brand-400">{formatCurrency(grandTotal)}</span></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 6 — Timeline */}
                    <div className="glass-card px-6">
                        <SectionHeader number={6} icon={Clock} title="Project Timeline" />
                        {expandedSections[6] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Estimated Start Date</label>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                            <input type="date" value={estimatedStartDate} onChange={(e) => setEstimatedStartDate(e.target.value)} className="input-field pl-10" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Estimated Timeline</label>
                                    <textarea value={estimatedTimeline} onChange={(e) => setEstimatedTimeline(e.target.value)} placeholder={"e.g.\nConcept design: 7 days\nFinal layout: 10 days\nExecution: 20 days"} rows={4} className="input-field" />
                                    <p className="text-[#5a5a70] text-xs mt-1">Break down the project phases and their estimated durations.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 7 — Notes */}
                    <div className="glass-card px-6">
                        <SectionHeader number={7} icon={StickyNote} title="Notes & Terms" />
                        {expandedSections[7] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div>
                                    <label className="input-label">Payment Terms</label>
                                    <textarea value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="e.g. 40% advance, 40% during handover, 20% after completion" rows={3} className="input-field" />
                                </div>
                                <div>
                                    <label className="input-label">Quotation Valid For (days)</label>
                                    <input type="number" value={quotationValidity} onChange={(e) => setQuotationValidity(e.target.value)} placeholder="30" min="1" className="input-field w-32" />
                                    <p className="text-[#5a5a70] text-xs mt-1">Number of days this quotation remains valid.</p>
                                </div>
                                <div>
                                    <label className="input-label">Additional Notes / Conditions</label>
                                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={"e.g.\nFurniture cost not included\nExecution charges separate\nMaterial prices subject to change"} rows={4} className="input-field" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 8 — Template */}
                    <div className="glass-card px-6">
                        <SectionHeader number={8} icon={LayoutTemplate} title="Template Style" />
                        {expandedSections[8] && (
                            <div className="pb-6 animate-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {templateOptions.map((opt, idx) => (
                                        <button key={opt.key} onClick={() => setTemplate(opt.key)} className={`relative p-4 rounded-xl border-2 text-left transition-all ${template === opt.key ? 'border-brand-500 bg-brand-700/10' : 'border-[#2a2a40] bg-[#12121a] hover:border-[#3a3a55]'}`}>
                                            {template === opt.key && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"><Sparkles size={12} className="text-white" /></div>}
                                            <div className="flex gap-1.5 mb-3">{opt.colors.map((c, i) => <div key={i} className="w-6 h-6 rounded-md border border-[#2a2a40]" style={{ backgroundColor: c }} />)}</div>
                                            <h3 className="text-white font-semibold text-sm">{opt.name}</h3>
                                            <p className="text-[#5a5a70] text-xs mt-1 mb-3">{opt.desc}</p>
                                            <button type="button" className="template-card-view-btn" onClick={(e) => { e.stopPropagation(); setPreviewIndex(idx); setPreviewOpen(true); }}>
                                                <Eye size={14} /> View Preview
                                            </button>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-8">
                    <button onClick={() => saveProject(false)} disabled={saving || generating} className="btn-secondary flex-1 justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Update Project'}
                    </button>
                    <button onClick={() => saveProject(true)} disabled={saving || generating} className="btn-primary flex-1 justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                        {generating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                        {generating ? 'Generating...' : 'Regenerate PDF'}
                    </button>
                </div>
            </div>

            <SuccessModal isOpen={showModal} onClose={() => { setShowModal(false); }} pdfUrl={generatedPdfUrl} projectId={projectId} downloadFilename={generatedFilename} />

            <TemplatePreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                templates={templatePreviewData}
                activeIndex={previewIndex}
                onNavigate={setPreviewIndex}
                onSelectTemplate={(idx) => {
                    setTemplate(templateOptions[idx].key);
                }}
            />
        </DashboardLayout>
    );
}
