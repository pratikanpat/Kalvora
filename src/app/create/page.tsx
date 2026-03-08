'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, checkSupabaseConfig } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import SuccessModal from '@/components/SuccessModal';
import {
    User, Mail, Phone, MapPin, Building, Plus, Trash2,
    Palette, Upload, FileText, Save, Sparkles, ChevronDown,
    ChevronUp, DollarSign, Calculator, StickyNote, LayoutTemplate,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Room {
    name: string;
    square_footage: string;
}

interface LineItem {
    item_name: string;
    quantity: string;
    unit_price: string;
}

type Template = 'minimal' | 'luxury' | 'modern';

const templateOptions: { key: Template; name: string; desc: string; colors: string[] }[] = [
    {
        key: 'minimal',
        name: 'Minimal',
        desc: 'Clean whites, Inter font, elegant simplicity',
        colors: ['#ffffff', '#1f2937', '#e5e7eb'],
    },
    {
        key: 'luxury',
        name: 'Luxury',
        desc: 'Gold & dark, serif typography, luxurious feel',
        colors: ['#1B1B1F', '#C5A55A', '#faf8f3'],
    },
    {
        key: 'modern',
        name: 'Professional',
        desc: 'Bold geometry, sharp type, corporate grade',
        colors: ['#4c6ef5', '#fafbfd', '#1a1a2e'],
    },
];

export default function CreatePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
        1: true, 2: true, 3: true, 4: true, 5: true, 6: true,
    });

    // Section 1 - Client Info
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [projectAddress, setProjectAddress] = useState('');

    // Section 2 - Project Details
    const [projectType, setProjectType] = useState('Residential');
    const [rooms, setRooms] = useState<Room[]>([{ name: '', square_footage: '' }]);

    // Section 3 - Pricing
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { item_name: '', quantity: '1', unit_price: '' },
    ]);
    const [taxRate, setTaxRate] = useState('0');

    // Section 4 - Brand Settings
    const [logoUrl, setLogoUrl] = useState('');
    const [accentColor, setAccentColor] = useState('#4263eb');
    const [designerName, setDesignerName] = useState('');
    const [designerEmail, setDesignerEmail] = useState('');
    const [designerPhone, setDesignerPhone] = useState('');
    const [uploading, setUploading] = useState(false);

    // Section 5 - Notes
    const [notes, setNotes] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');

    // Section 6 - Template
    const [template, setTemplate] = useState<Template>('minimal');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [generatedPdfUrl, setGeneratedPdfUrl] = useState('');
    const [generatedProjectId, setGeneratedProjectId] = useState('');
    const [generatedFilename, setGeneratedFilename] = useState('');

    // Errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    const toggleSection = (section: number) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Rooms
    const addRoom = () => setRooms([...rooms, { name: '', square_footage: '' }]);
    const removeRoom = (index: number) => setRooms(rooms.filter((_, i) => i !== index));
    const updateRoom = (index: number, field: keyof Room, value: string) => {
        const updated = [...rooms];
        updated[index] = { ...updated[index], [field]: value };
        setRooms(updated);
    };

    // Line Items
    const addLineItem = () =>
        setLineItems([...lineItems, { item_name: '', quantity: '1', unit_price: '' }]);
    const removeLineItem = (index: number) =>
        setLineItems(lineItems.filter((_, i) => i !== index));
    const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
        const updated = [...lineItems];
        updated[index] = { ...updated[index], [field]: value };
        setLineItems(updated);
    };

    // Calculations
    const getSubtotal = (item: LineItem) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unit_price) || 0;
        return qty * price;
    };

    const totalBeforeTax = lineItems.reduce((sum, item) => sum + getSubtotal(item), 0);
    const taxAmount = totalBeforeTax * ((parseFloat(taxRate) || 0) / 100);
    const grandTotal = totalBeforeTax + taxAmount;

    // Logo upload — converts to base64 so it embeds directly in PDF HTML
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Logo must be under 2MB');
            return;
        }

        // Check if file looks like an image (by extension as fallback)
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const imageExts = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'bmp'];
        const isImage = file.type.startsWith('image/') || imageExts.includes(ext);
        if (!isImage) {
            toast.error('Please upload an image file (PNG, JPG, SVG, WebP)');
            return;
        }

        setUploading(true);
        // Convert to base64 data URL — embeds directly in HTML
        // so it works in PDF generation without needing storage access
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            setLogoUrl(dataUrl);
            toast.success('Logo uploaded!');
            setUploading(false);
        };
        reader.onerror = (err) => {
            console.error('FileReader error:', err);
            toast.error('Failed to read logo file. Try a different image.');
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    // Validation
    const validate = () => {
        const errs: Record<string, string> = {};
        if (!clientName.trim()) errs.clientName = 'Client name is required';
        if (!projectType) errs.projectType = 'Select a project type';

        const validRooms = rooms.filter((r) => r.name.trim());
        if (validRooms.length === 0) errs.rooms = 'Add at least one room';

        const validItems = lineItems.filter((i) => i.item_name.trim());
        if (validItems.length === 0) errs.lineItems = 'Add at least one line item';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Save
    const saveProject = async (andGenerate = false) => {
        const { configured, message } = checkSupabaseConfig();
        if (!configured) {
            toast.error('Supabase is not configured. Please set up your .env.local file and restart the server.', { duration: 6000 });
            return;
        }

        if (!validate()) {
            toast.error('Please fix the errors before saving');
            return;
        }

        if (andGenerate) {
            setGenerating(true);
        } else {
            setSaving(true);
        }

        try {
            // 1. Create project
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .insert({
                    client_name: clientName.trim(),
                    client_email: clientEmail.trim(),
                    client_phone: clientPhone.trim(),
                    project_address: projectAddress.trim(),
                    project_type: projectType,
                    designer_name: designerName.trim(),
                    designer_email: designerEmail.trim(),
                    designer_phone: designerPhone.trim(),
                    logo_url: logoUrl,
                    accent_color: accentColor,
                    notes: notes.trim(),
                    payment_terms: paymentTerms.trim(),
                    template,
                    tax_rate: parseFloat(taxRate) || 0,
                    status: andGenerate ? 'Sent' : 'Draft',
                })
                .select()
                .single();

            if (projectError) throw projectError;

            // 2. Insert rooms
            const validRooms = rooms.filter((r) => r.name.trim());
            if (validRooms.length > 0) {
                const { error: roomError } = await supabase.from('rooms').insert(
                    validRooms.map((r) => ({
                        project_id: project.id,
                        name: r.name.trim(),
                        square_footage: parseFloat(r.square_footage) || 0,
                    }))
                );
                if (roomError) throw roomError;
            }

            // 3. Insert line items
            const validItems = lineItems.filter((i) => i.item_name.trim());
            if (validItems.length > 0) {
                const { error: itemError } = await supabase.from('line_items').insert(
                    validItems.map((i) => ({
                        project_id: project.id,
                        item_name: i.item_name.trim(),
                        quantity: parseFloat(i.quantity) || 1,
                        unit_price: parseFloat(i.unit_price) || 0,
                    }))
                );
                if (itemError) throw itemError;
            }

            if (andGenerate) {
                // 4. Generate PDF
                const res = await fetch('/api/generate-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ project_id: project.id }),
                });

                const result = await res.json();
                if (!res.ok) throw new Error(result.error || 'PDF generation failed');

                setGeneratedPdfUrl(result.pdf_url);
                setGeneratedFilename(result.download_filename || '');
                setGeneratedProjectId(project.id);
                setShowModal(true);
                toast.success('Proposal generated successfully!');
            } else {
                toast.success('Project saved as draft!');
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Save error:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to save project');
        } finally {
            setSaving(false);
            setGenerating(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    const SectionHeader = ({
        number,
        icon: Icon,
        title,
    }: {
        number: number;
        icon: React.ElementType;
        title: string;
    }) => (
        <button
            onClick={() => toggleSection(number)}
            className="w-full flex items-center justify-between py-5 group"
        >
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700/20 to-brand-500/10 flex items-center justify-center border border-brand-700/15 group-hover:border-brand-500/30 transition-colors">
                    <Icon size={16} className="text-brand-400" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#12121a] flex items-center justify-center group-hover:bg-[#1a1a2e] transition-colors">
                {expandedSections[number] ? (
                    <ChevronUp size={16} className="text-[#5a5a70]" />
                ) : (
                    <ChevronDown size={16} className="text-[#5a5a70]" />
                )}
            </div>
        </button>
    );

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create New Proposal</h1>
                    <p className="text-[#5a5a70] text-sm mt-1.5">
                        Fill in the details below to generate a professional proposal for your client.
                    </p>
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
                                        <input
                                            type="text"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            placeholder="e.g. Rahul Sharma"
                                            className={`input-field pl-10 ${errors.clientName ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.clientName && (
                                        <p className="text-red-400 text-xs mt-1">{errors.clientName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="input-label">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                        <input
                                            type="email"
                                            value={clientEmail}
                                            onChange={(e) => setClientEmail(e.target.value)}
                                            placeholder="client@email.com"
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Phone</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                        <input
                                            type="tel"
                                            value={clientPhone}
                                            onChange={(e) => setClientPhone(e.target.value)}
                                            placeholder="+91 98765 43210"
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="input-label">Project Address</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-3 text-[#5a5a70]" />
                                        <textarea
                                            value={projectAddress}
                                            onChange={(e) => setProjectAddress(e.target.value)}
                                            placeholder="Full project address"
                                            rows={2}
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2 — Project Details */}
                    <div className="glass-card px-6">
                        <SectionHeader number={2} icon={Building} title="Project Details" />
                        {expandedSections[2] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div>
                                    <label className="input-label">Project Type *</label>
                                    <select
                                        value={projectType}
                                        onChange={(e) => setProjectType(e.target.value)}
                                        className={`input-field ${errors.projectType ? 'border-red-500' : ''}`}
                                    >
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="input-label mb-0">Rooms *</label>
                                        <button onClick={addRoom} className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1 transition-colors">
                                            <Plus size={14} /> Add Room
                                        </button>
                                    </div>
                                    {errors.rooms && (
                                        <p className="text-red-400 text-xs mb-2">{errors.rooms}</p>
                                    )}
                                    <div className="space-y-2">
                                        {rooms.map((room, i) => (
                                            <div key={i} className="flex items-center gap-2 animate-fade-in">
                                                <input
                                                    type="text"
                                                    value={room.name}
                                                    onChange={(e) => updateRoom(i, 'name', e.target.value)}
                                                    placeholder="Room name (e.g. Living Room)"
                                                    className="input-field flex-1"
                                                />
                                                <input
                                                    type="number"
                                                    value={room.square_footage}
                                                    onChange={(e) => updateRoom(i, 'square_footage', e.target.value)}
                                                    placeholder="Sq.ft"
                                                    className="input-field w-28"
                                                />
                                                {rooms.length > 1 && (
                                                    <button
                                                        onClick={() => removeRoom(i)}
                                                        className="text-[#5a5a70] hover:text-red-400 p-2 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 3 — Pricing Table */}
                    <div className="glass-card px-6">
                        <SectionHeader number={3} icon={DollarSign} title="Pricing Table" />
                        {expandedSections[3] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <label className="input-label mb-0">Line Items *</label>
                                    <button onClick={addLineItem} className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1 transition-colors">
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>
                                {errors.lineItems && (
                                    <p className="text-red-400 text-xs">{errors.lineItems}</p>
                                )}

                                {/* Table header */}
                                <div className="hidden md:grid grid-cols-[1fr_100px_120px_120px_40px] gap-2 text-xs font-semibold text-[#5a5a70] uppercase tracking-wider px-1">
                                    <span>Item</span>
                                    <span>Qty</span>
                                    <span>Unit Price</span>
                                    <span>Subtotal</span>
                                    <span></span>
                                </div>

                                <div className="space-y-2">
                                    {lineItems.map((item, i) => (
                                        <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_100px_120px_120px_40px] gap-2 items-center animate-fade-in">
                                            <input
                                                type="text"
                                                value={item.item_name}
                                                onChange={(e) => updateLineItem(i, 'item_name', e.target.value)}
                                                placeholder="Item name"
                                                className="input-field"
                                            />
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateLineItem(i, 'quantity', e.target.value)}
                                                placeholder="1"
                                                min="1"
                                                className="input-field"
                                            />
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70] text-sm">₹</span>
                                                <input
                                                    type="number"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateLineItem(i, 'unit_price', e.target.value)}
                                                    placeholder="0"
                                                    className="input-field pl-7"
                                                />
                                            </div>
                                            <div className="flex items-center text-[#8888a0] font-medium text-sm px-2">
                                                {formatCurrency(getSubtotal(item))}
                                            </div>
                                            {lineItems.length > 1 && (
                                                <button
                                                    onClick={() => removeLineItem(i)}
                                                    className="text-[#5a5a70] hover:text-red-400 p-2 transition-colors justify-self-center"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-[#2a2a40] pt-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#8888a0] text-sm">Subtotal</span>
                                        <span className="text-white font-medium">{formatCurrency(totalBeforeTax)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-[#8888a0] text-sm flex items-center gap-2">
                                            Tax
                                            <input
                                                type="number"
                                                value={taxRate}
                                                onChange={(e) => setTaxRate(e.target.value)}
                                                className="input-field w-20 text-center py-1"
                                                min="0"
                                                max="100"
                                            />
                                            %
                                        </span>
                                        <span className="text-white font-medium">{formatCurrency(taxAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-[#2a2a40]">
                                        <span className="text-white font-semibold flex items-center gap-2">
                                            <Calculator size={16} className="text-brand-400" />
                                            Grand Total
                                        </span>
                                        <span className="text-xl font-bold text-brand-400">{formatCurrency(grandTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 4 — Brand Settings */}
                    <div className="glass-card px-6">
                        <SectionHeader number={4} icon={Palette} title="Brand Settings" />
                        {expandedSections[4] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                {/* Logo upload */}
                                <div>
                                    <label className="input-label">Logo</label>
                                    <div className="flex items-center gap-4">
                                        {logoUrl ? (
                                            <div className="w-16 h-16 rounded-xl border border-[#2a2a40] overflow-hidden bg-white flex items-center justify-center">
                                                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl border border-dashed border-[#2a2a40] flex items-center justify-center bg-[#12121a]">
                                                <Upload size={20} className="text-[#5a5a70]" />
                                            </div>
                                        )}
                                        <label className="btn-secondary cursor-pointer">
                                            <Upload size={16} />
                                            {uploading ? 'Uploading...' : 'Upload Logo'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Accent color */}
                                <div>
                                    <label className="input-label">Accent Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={accentColor}
                                            onChange={(e) => setAccentColor(e.target.value)}
                                            className="w-10 h-10 rounded-lg border border-[#2a2a40] cursor-pointer bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={accentColor}
                                            onChange={(e) => setAccentColor(e.target.value)}
                                            placeholder="#4263eb"
                                            className="input-field w-32"
                                        />
                                    </div>
                                </div>

                                {/* Designer info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="md:col-span-2">
                                        <label className="input-label">Designer Name</label>
                                        <input
                                            type="text"
                                            value={designerName}
                                            onChange={(e) => setDesignerName(e.target.value)}
                                            placeholder="Your full name"
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Designer Email</label>
                                        <input
                                            type="email"
                                            value={designerEmail}
                                            onChange={(e) => setDesignerEmail(e.target.value)}
                                            placeholder="you@studio.com"
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Designer Phone</label>
                                        <input
                                            type="tel"
                                            value={designerPhone}
                                            onChange={(e) => setDesignerPhone(e.target.value)}
                                            placeholder="+91 98765 43210"
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 5 — Notes & Terms */}
                    <div className="glass-card px-6">
                        <SectionHeader number={5} icon={StickyNote} title="Notes & Terms" />
                        {expandedSections[5] && (
                            <div className="pb-6 space-y-4 animate-fade-in">
                                <div>
                                    <label className="input-label">Project Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any special notes for the client about the project scope, timeline, etc."
                                        rows={4}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Payment Terms</label>
                                    <textarea
                                        value={paymentTerms}
                                        onChange={(e) => setPaymentTerms(e.target.value)}
                                        placeholder="e.g. 50% advance, 25% on material delivery, 25% on completion"
                                        rows={3}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 6 — Template Picker */}
                    <div className="glass-card px-6">
                        <SectionHeader number={6} icon={LayoutTemplate} title="Template Style" />
                        {expandedSections[6] && (
                            <div className="pb-6 animate-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {templateOptions.map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => setTemplate(opt.key)}
                                            className={`
                        relative p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${template === opt.key
                                                    ? 'border-brand-500 bg-brand-700/10'
                                                    : 'border-[#2a2a40] bg-[#12121a] hover:border-[#3a3a55]'
                                                }
                      `}
                                        >
                                            {template === opt.key && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                                                    <Sparkles size={12} className="text-white" />
                                                </div>
                                            )}
                                            <div className="flex gap-1.5 mb-3">
                                                {opt.colors.map((c, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-6 h-6 rounded-md border border-[#2a2a40]"
                                                        style={{ backgroundColor: c }}
                                                    />
                                                ))}
                                            </div>
                                            <h3 className="text-white font-semibold text-sm">{opt.name}</h3>
                                            <p className="text-[#5a5a70] text-xs mt-1">{opt.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-8">
                    <button
                        onClick={() => saveProject(false)}
                        disabled={saving || generating}
                        className="btn-secondary flex-1 justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => saveProject(true)}
                        disabled={saving || generating}
                        className="btn-primary flex-1 justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Sparkles size={18} />
                        )}
                        {generating ? 'Generating PDF...' : 'Generate Proposal'}
                    </button>
                </div>
            </div>

            <SuccessModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                pdfUrl={generatedPdfUrl}
                projectId={generatedProjectId}
                downloadFilename={generatedFilename}
            />
        </DashboardLayout>
    );
}
