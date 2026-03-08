'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import SuccessModal from '@/components/SuccessModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
    User, Mail, Phone, MapPin, Building, Plus, Trash2,
    Palette, Upload, Save, Sparkles, ChevronDown,
    ChevronUp, DollarSign, Calculator, StickyNote, LayoutTemplate,
    Loader2, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

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

type Template = 'minimal' | 'luxury' | 'modern';

const templateOptions: { key: Template; name: string; desc: string; colors: string[] }[] = [
    { key: 'minimal', name: 'Minimal', desc: 'Clean white, black typography, thin borders', colors: ['#ffffff', '#1a1a1a', '#e5e5e5'] },
    { key: 'luxury', name: 'Luxury', desc: 'Dark elegance with gold accents, serif fonts', colors: ['#1a1a2e', '#C9A96E', '#2a2a3e'] },
    { key: 'modern', name: 'Modern', desc: 'Bold geometric, vibrant section dividers', colors: ['#4c6ef5', '#f8f9fa', '#1a1a2e'] },
];

export default function EditPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [pageLoading, setPageLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
        1: true, 2: true, 3: true, 4: true, 5: true, 6: true,
    });

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [projectAddress, setProjectAddress] = useState('');
    const [projectType, setProjectType] = useState('Residential');
    const [rooms, setRooms] = useState<Room[]>([{ name: '', square_footage: '' }]);
    const [lineItems, setLineItems] = useState<LineItem[]>([{ item_name: '', quantity: '1', unit_price: '' }]);
    const [taxRate, setTaxRate] = useState('0');
    const [logoUrl, setLogoUrl] = useState('');
    const [accentColor, setAccentColor] = useState('#4263eb');
    const [designerName, setDesignerName] = useState('');
    const [designerEmail, setDesignerEmail] = useState('');
    const [designerPhone, setDesignerPhone] = useState('');
    const [uploading, setUploading] = useState(false);
    const [notes, setNotes] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [template, setTemplate] = useState<Template>('minimal');
    const [showModal, setShowModal] = useState(false);
    const [generatedPdfUrl, setGeneratedPdfUrl] = useState('');
    const [generatedFilename, setGeneratedFilename] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const loadProject = async () => {
        try {
            const { data: project, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (error) throw error;
            if (!project) throw new Error('Project not found');

            setClientName(project.client_name || '');
            setClientEmail(project.client_email || '');
            setClientPhone(project.client_phone || '');
            setProjectAddress(project.project_address || '');
            setProjectType(project.project_type || 'Residential');
            setLogoUrl(project.logo_url || '');
            setAccentColor(project.accent_color || '#4263eb');
            setDesignerName(project.designer_name || '');
            setDesignerEmail(project.designer_email || '');
            setDesignerPhone(project.designer_phone || '');
            setNotes(project.notes || '');
            setPaymentTerms(project.payment_terms || '');
            setTemplate((project.template as Template) || 'minimal');
            setTaxRate(String(project.tax_rate || 0));

            // Load rooms
            const { data: roomData } = await supabase.from('rooms').select('*').eq('project_id', projectId);
            if (roomData && roomData.length > 0) {
                setRooms(roomData.map((r) => ({ id: r.id, name: r.name, square_footage: String(r.square_footage || '') })));
            }

            // Load line items
            const { data: itemData } = await supabase.from('line_items').select('*').eq('project_id', projectId);
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

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast.error('Logo must be under 2MB'); return; }
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const imageExts = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'bmp'];
        const isImage = file.type.startsWith('image/') || imageExts.includes(ext);
        if (!isImage) { toast.error('Please upload an image file'); return; }
        setUploading(true);
        const reader = new FileReader();
        reader.onload = () => { setLogoUrl(reader.result as string); toast.success('Logo uploaded!'); setUploading(false); };
        reader.onerror = () => { toast.error('Failed to read logo file'); setUploading(false); };
        reader.readAsDataURL(file);
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!clientName.trim()) errs.clientName = 'Client name is required';
        if (rooms.filter((r) => r.name.trim()).length === 0) errs.rooms = 'Add at least one room';
        if (lineItems.filter((i) => i.item_name.trim()).length === 0) errs.lineItems = 'Add at least one line item';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const saveProject = async (andGenerate = false) => {
        if (!validate()) { toast.error('Please fix errors'); return; }
        andGenerate ? setGenerating(true) : setSaving(true);
        try {
            const { error: projectError } = await supabase.from('projects').update({
                client_name: clientName.trim(), client_email: clientEmail.trim(), client_phone: clientPhone.trim(),
                project_address: projectAddress.trim(), project_type: projectType, designer_name: designerName.trim(),
                designer_email: designerEmail.trim(), designer_phone: designerPhone.trim(), logo_url: logoUrl,
                accent_color: accentColor, notes: notes.trim(), payment_terms: paymentTerms.trim(), template,
                tax_rate: parseFloat(taxRate) || 0, updated_at: new Date().toISOString(),
            }).eq('id', projectId);
            if (projectError) throw projectError;

            // Replace rooms
            await supabase.from('rooms').delete().eq('project_id', projectId);
            const validRooms = rooms.filter((r) => r.name.trim());
            if (validRooms.length > 0) {
                await supabase.from('rooms').insert(validRooms.map((r) => ({ project_id: projectId, name: r.name.trim(), square_footage: parseFloat(r.square_footage) || 0 })));
            }

            // Replace line items
            await supabase.from('line_items').delete().eq('project_id', projectId);
            const validItems = lineItems.filter((i) => i.item_name.trim());
            if (validItems.length > 0) {
                await supabase.from('line_items').insert(validItems.map((i) => ({ project_id: projectId, item_name: i.item_name.trim(), quantity: parseFloat(i.quantity) || 1, unit_price: parseFloat(i.unit_price) || 0 })));
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
                router.push('/dashboard');
            }
        } catch (err) { console.error(err); toast.error(err instanceof Error ? err.message : 'Save failed'); }
        finally { setSaving(false); setGenerating(false); }
    };

    const SectionHeader = ({ number, icon: Icon, title }: { number: number; icon: React.ElementType; title: string }) => (
        <button onClick={() => toggleSection(number)} className="w-full flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-700/15 flex items-center justify-center">
                    <Icon size={16} className="text-brand-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>
            {expandedSections[number] ? <ChevronUp size={18} className="text-[#5a5a70]" /> : <ChevronDown size={18} className="text-[#5a5a70]" />}
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
                                <div><label className="input-label">Project Type *</label><select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="input-field"><option value="Residential">Residential</option><option value="Commercial">Commercial</option></select></div>
                                <div>
                                    <div className="flex items-center justify-between mb-3"><label className="input-label mb-0">Rooms *</label><button onClick={addRoom} className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1"><Plus size={14} /> Add Room</button></div>
                                    {errors.rooms && <p className="text-red-400 text-xs mb-2">{errors.rooms}</p>}
                                    <div className="space-y-2">
                                        {rooms.map((room, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input type="text" value={room.name} onChange={(e) => updateRoom(i, 'name', e.target.value)} placeholder="Room name" className="input-field flex-1" />
                                                <input type="number" value={room.square_footage} onChange={(e) => updateRoom(i, 'square_footage', e.target.value)} placeholder="Sq.ft" className="input-field w-28" />
                                                {rooms.length > 1 && <button onClick={() => removeRoom(i)} className="text-[#5a5a70] hover:text-red-400 p-2"><Trash2 size={16} /></button>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 3 — Pricing */}
                    <div className="glass-card px-6">
                        <SectionHeader number={3} icon={DollarSign} title="Pricing Table" />
                        {expandedSections[3] && (
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

                    {/* SECTION 4 — Brand */}
                    <div className="glass-card px-6">
                        <SectionHeader number={4} icon={Palette} title="Brand Settings" />
                        {expandedSections[4] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div><label className="input-label">Logo</label><div className="flex items-center gap-4">{logoUrl ? <div className="w-16 h-16 rounded-xl border border-[#2a2a40] overflow-hidden bg-white flex items-center justify-center"><img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" /></div> : <div className="w-16 h-16 rounded-xl border border-dashed border-[#2a2a40] flex items-center justify-center bg-[#12121a]"><Upload size={20} className="text-[#5a5a70]" /></div>}<label className="btn-secondary cursor-pointer"><Upload size={16} />{uploading ? 'Uploading...' : 'Upload Logo'}<input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} /></label></div></div>
                                <div><label className="input-label">Accent Color</label><div className="flex items-center gap-3"><input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded-lg border border-[#2a2a40] cursor-pointer bg-transparent" /><input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="input-field w-32" /></div></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"><div className="md:col-span-2"><label className="input-label">Designer Name</label><input type="text" value={designerName} onChange={(e) => setDesignerName(e.target.value)} className="input-field" /></div><div><label className="input-label">Designer Email</label><input type="email" value={designerEmail} onChange={(e) => setDesignerEmail(e.target.value)} className="input-field" /></div><div><label className="input-label">Designer Phone</label><input type="tel" value={designerPhone} onChange={(e) => setDesignerPhone(e.target.value)} className="input-field" /></div></div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 5 — Notes */}
                    <div className="glass-card px-6">
                        <SectionHeader number={5} icon={StickyNote} title="Notes & Terms" />
                        {expandedSections[5] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div><label className="input-label">Project Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="input-field" /></div>
                                <div><label className="input-label">Payment Terms</label><textarea value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} rows={3} className="input-field" /></div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 6 — Template */}
                    <div className="glass-card px-6">
                        <SectionHeader number={6} icon={LayoutTemplate} title="Template Style" />
                        {expandedSections[6] && (
                            <div className="pb-6 animate-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {templateOptions.map((opt) => (
                                        <button key={opt.key} onClick={() => setTemplate(opt.key)} className={`relative p-4 rounded-xl border-2 text-left transition-all ${template === opt.key ? 'border-brand-500 bg-brand-700/10' : 'border-[#2a2a40] bg-[#12121a] hover:border-[#3a3a55]'}`}>
                                            {template === opt.key && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"><Sparkles size={12} className="text-white" /></div>}
                                            <div className="flex gap-1.5 mb-3">{opt.colors.map((c, i) => <div key={i} className="w-6 h-6 rounded-md border border-[#2a2a40]" style={{ backgroundColor: c }} />)}</div>
                                            <h3 className="text-white font-semibold text-sm">{opt.name}</h3>
                                            <p className="text-[#5a5a70] text-xs mt-1">{opt.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-8">
                    <button onClick={() => saveProject(false)} disabled={saving || generating} className="btn-secondary flex-1 justify-center">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Update Project'}
                    </button>
                    <button onClick={() => saveProject(true)} disabled={saving || generating} className="btn-primary flex-1 justify-center">
                        {generating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                        {generating ? 'Generating...' : 'Regenerate PDF'}
                    </button>
                </div>
            </div>

            <SuccessModal isOpen={showModal} onClose={() => { setShowModal(false); }} pdfUrl={generatedPdfUrl} projectId={projectId} downloadFilename={generatedFilename} />
        </DashboardLayout>
    );
}
