'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/components/AuthProvider';
import {
    Building, Upload, Save, Palette, Loader2, User, Mail, Phone,
    Globe, Instagram, MapPin, FileText, CheckCircle, Pencil, X,
    CreditCard, Landmark, Receipt, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    validateEmail, validatePhone, validateGSTIN, validatePAN,
    validateIFSC, validateBankAccount, validateUpiId, validateHsnSac,
    validateNumericRange
} from '@/lib/validators';

interface ProfileSnapshot {
    studioName: string;
    designerName: string;
    logoUrl: string;
    email: string;
    phone: string;
    website: string;
    instagram: string;
    studioAddress: string;
    defaultAccentColor: string;
    defaultPaymentTerms: string;
    gstin: string;
    panNumber: string;
    hsnSacCode: string;
    invoiceDueDays: number;
    bankName: string;
    bankAccountNumber: string;
    bankIfsc: string;
    upiId: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Profile fields — original
    const [studioName, setStudioName] = useState('');
    const [designerName, setDesignerName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [instagram, setInstagram] = useState('');
    const [studioAddress, setStudioAddress] = useState('');
    const [defaultAccentColor, setDefaultAccentColor] = useState('#4263eb');
    const [defaultPaymentTerms, setDefaultPaymentTerms] = useState('');

    // Profile fields — new business/tax
    const [gstin, setGstin] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [hsnSacCode, setHsnSacCode] = useState('9971');
    const [invoiceDueDays, setInvoiceDueDays] = useState(7);

    // Profile fields — new bank/payment
    const [bankName, setBankName] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [bankIfsc, setBankIfsc] = useState('');
    const [upiId, setUpiId] = useState('');

    // Saved snapshot — used to revert on Cancel
    const [savedSnapshot, setSavedSnapshot] = useState<ProfileSnapshot | null>(null);

    const takeSnapshot = useCallback((): ProfileSnapshot => ({
        studioName, designerName, logoUrl, email, phone, website, instagram,
        studioAddress, defaultAccentColor, defaultPaymentTerms,
        gstin, panNumber, hsnSacCode, invoiceDueDays,
        bankName, bankAccountNumber, bankIfsc, upiId,
    }), [studioName, designerName, logoUrl, email, phone, website, instagram,
        studioAddress, defaultAccentColor, defaultPaymentTerms,
        gstin, panNumber, hsnSacCode, invoiceDueDays,
        bankName, bankAccountNumber, bankIfsc, upiId]);

    const restoreSnapshot = (snap: ProfileSnapshot) => {
        setStudioName(snap.studioName);
        setDesignerName(snap.designerName);
        setLogoUrl(snap.logoUrl);
        setEmail(snap.email);
        setPhone(snap.phone);
        setWebsite(snap.website);
        setInstagram(snap.instagram);
        setStudioAddress(snap.studioAddress);
        setDefaultAccentColor(snap.defaultAccentColor);
        setDefaultPaymentTerms(snap.defaultPaymentTerms);
        setGstin(snap.gstin);
        setPanNumber(snap.panNumber);
        setHsnSacCode(snap.hsnSacCode);
        setInvoiceDueDays(snap.invoiceDueDays);
        setBankName(snap.bankName);
        setBankAccountNumber(snap.bankAccountNumber);
        setBankIfsc(snap.bankIfsc);
        setUpiId(snap.upiId);
    };

    useEffect(() => {
        if (user) loadProfile();
    }, [user]);

    const loadProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('designer_profiles')
                .select('*')
                .eq('user_id', user!.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

            if (data) {
                setIsNew(false);
                const vals = {
                    studioName: data.studio_name || '',
                    designerName: data.designer_name || '',
                    logoUrl: data.logo_url || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    website: data.website || '',
                    instagram: data.instagram || '',
                    studioAddress: data.studio_address || '',
                    defaultAccentColor: data.default_accent_color || '#4263eb',
                    defaultPaymentTerms: data.default_payment_terms || '',
                    gstin: data.gstin || '',
                    panNumber: data.pan_number || '',
                    hsnSacCode: data.hsn_sac_code || '9971',
                    invoiceDueDays: data.invoice_due_days ?? 7,
                    bankName: data.bank_name || '',
                    bankAccountNumber: data.bank_account_number || '',
                    bankIfsc: data.bank_ifsc || '',
                    upiId: data.upi_id || '',
                };
                restoreSnapshot(vals);
                setSavedSnapshot(vals);
            } else {
                // Pre-fill email from auth
                setEmail(user?.email || '');
                // New profile — start in edit mode
                setIsEditing(true);
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (savedSnapshot) {
            restoreSnapshot(savedSnapshot);
        }
        setIsEditing(false);
    };

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

    const validateProfile = (): boolean => {
        const errs: Record<string, string> = {};

        if (!studioName.trim() && !designerName.trim()) {
            errs.studioName = 'Enter at least a studio name or designer name';
        }

        const emailRes = validateEmail(email);
        if (!emailRes.valid) errs.email = emailRes.message!;

        const phoneRes = validatePhone(phone);
        if (!phoneRes.valid) errs.phone = phoneRes.message!;

        const gstinRes = validateGSTIN(gstin);
        if (!gstinRes.valid) errs.gstin = gstinRes.message!;

        const panRes = validatePAN(panNumber);
        if (!panRes.valid) errs.panNumber = panRes.message!;

        const hsnRes = validateHsnSac(hsnSacCode);
        if (!hsnRes.valid) errs.hsnSacCode = hsnRes.message!;

        const dueRes = validateNumericRange(String(invoiceDueDays), 1, 365, 'Invoice due days');
        if (!dueRes.valid) errs.invoiceDueDays = dueRes.message!;

        const accountRes = validateBankAccount(bankAccountNumber);
        if (!accountRes.valid) errs.bankAccountNumber = accountRes.message!;

        const ifscRes = validateIFSC(bankIfsc);
        if (!ifscRes.valid) errs.bankIfsc = ifscRes.message!;

        const upiRes = validateUpiId(upiId);
        if (!upiRes.valid) errs.upiId = upiRes.message!;

        setValidationErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const saveProfile = async () => {
        if (!validateProfile()) {
            toast.error('Please fix the errors before saving');
            return;
        }

        setSaving(true);
        try {
            const profileData = {
                user_id: user!.id,
                studio_name: studioName.trim(),
                designer_name: designerName.trim(),
                logo_url: logoUrl,
                email: email.trim(),
                phone: phone.trim(),
                website: website.trim(),
                instagram: instagram.trim(),
                studio_address: studioAddress.trim(),
                default_accent_color: defaultAccentColor,
                default_payment_terms: defaultPaymentTerms.trim(),
                gstin: gstin.trim(),
                pan_number: panNumber.trim(),
                hsn_sac_code: hsnSacCode.trim(),
                invoice_due_days: invoiceDueDays,
                bank_name: bankName.trim(),
                bank_account_number: bankAccountNumber.trim(),
                bank_ifsc: bankIfsc.trim(),
                upi_id: upiId.trim(),
                updated_at: new Date().toISOString(),
            };

            if (isNew) {
                const { error } = await supabase
                    .from('designer_profiles')
                    .insert(profileData);
                if (error) throw error;
                setIsNew(false);
            } else {
                const { error } = await supabase
                    .from('designer_profiles')
                    .update(profileData)
                    .eq('user_id', user!.id);
                if (error) throw error;
            }

            toast.success('Profile saved successfully!');
            // Notify sidebar to re-check profile completeness
            window.dispatchEvent(new Event('profile-updated'));
            // Update saved snapshot to current values
            const newSnap = takeSnapshot();
            setSavedSnapshot(newSnap);
            // Exit edit mode after successful save
            setIsEditing(false);
            // Clear validation errors
            setValidationErrors({});
            // Scroll to top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Error saving profile:', err);
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingSpinner text="Loading profile..." />
            </DashboardLayout>
        );
    }

    const isProfileComplete = !!(studioName.trim() || designerName.trim()) && !!(email.trim());

    // Common readonly styling
    const inputReadonlyClass = !isEditing ? 'opacity-70 cursor-default bg-[#0d0d16]' : '';

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Studio Profile</h1>
                        <p className="text-[#5a5a70] text-sm mt-1.5">
                            Set up your studio identity. This information will be used automatically in every proposal and invoice you create.
                        </p>
                    </div>
                    {/* Edit / Cancel toggle button */}
                    {!isNew && (
                        <button
                            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 ${isEditing
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                    : 'bg-brand-700/15 text-brand-400 border border-brand-700/25 hover:bg-brand-700/25'
                                }`}
                        >
                            {isEditing ? <X size={16} /> : <Pencil size={16} />}
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    )}
                </div>

                {/* Status Banner */}
                {!isProfileComplete && (
                    <div className="glass-card border-amber-500/20 p-4 mb-6 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                                <FileText size={16} className="text-amber-400" />
                            </div>
                            <p className="text-amber-300/90 text-sm">
                                Complete your profile so it appears on every proposal you generate.
                            </p>
                        </div>
                    </div>
                )}

                {isProfileComplete && !isNew && !isEditing && (
                    <div className="glass-card border-emerald-500/20 p-4 mb-6 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                                <CheckCircle size={16} className="text-emerald-400" />
                            </div>
                            <p className="text-emerald-300/90 text-sm">
                                Your profile is set up. This info will be used in all your proposals and invoices.
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* ═══════════════════════════════════════════
                       STUDIO IDENTITY
                       ═══════════════════════════════════════════ */}
                    <div className="glass-card px-6 py-6 space-y-4 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700/20 to-brand-500/10 flex items-center justify-center border border-brand-700/15">
                                <Building size={16} className="text-brand-400" />
                            </div>
                            <h2 className="text-base font-bold text-white tracking-tight">Studio Identity</h2>
                        </div>

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
                                {isEditing && (
                                    <>
                                        <label className="btn-secondary cursor-pointer">
                                            <Upload size={16} />
                                            {uploading ? 'Uploading...' : 'Upload Logo'}
                                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
                                        </label>
                                        {logoUrl && (
                                            <button onClick={() => setLogoUrl('')} className="text-[#5a5a70] hover:text-red-400 text-xs transition-colors">
                                                Remove
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Studio Name</label>
                                <div className="relative">
                                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={studioName} onChange={(e) => setStudioName(e.target.value)} placeholder="e.g. Luxe Interiors Studio" className={`input-field pl-10 ${inputReadonlyClass}`} readOnly={!isEditing} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Designer Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={designerName} onChange={(e) => setDesignerName(e.target.value)} placeholder="Your full name" className={`input-field pl-10 ${inputReadonlyClass}`} readOnly={!isEditing} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" className={`input-field pl-10 ${inputReadonlyClass} ${validationErrors.email ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.email && <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>}
                            </div>
                            <div>
                                <label className="input-label">Phone</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={`input-field pl-10 ${inputReadonlyClass} ${validationErrors.phone ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.phone && <p className="text-red-400 text-xs mt-1">{validationErrors.phone}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════
                       ONLINE PRESENCE
                       ═══════════════════════════════════════════ */}
                    <div className="glass-card px-6 py-6 space-y-4 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700/20 to-brand-500/10 flex items-center justify-center border border-brand-700/15">
                                <Globe size={16} className="text-brand-400" />
                            </div>
                            <h2 className="text-base font-bold text-white tracking-tight">Online Presence <span className="text-[#5a5a70] font-normal text-sm">(Optional)</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Website</label>
                                <div className="relative">
                                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourstudio.com" className={`input-field pl-10 ${inputReadonlyClass}`} readOnly={!isEditing} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Instagram</label>
                                <div className="relative">
                                    <Instagram size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourstudio" className={`input-field pl-10 ${inputReadonlyClass}`} readOnly={!isEditing} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Studio Address <span className="text-[#5a5a70] font-normal">(Optional)</span></label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-3 text-[#5a5a70]" />
                                <textarea value={studioAddress} onChange={(e) => setStudioAddress(e.target.value)} placeholder="Full studio address" rows={2} className={`input-field pl-10 ${inputReadonlyClass}`} readOnly={!isEditing} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════
                       BUSINESS & TAX DETAILS
                       ═══════════════════════════════════════════ */}
                    <div className="glass-card px-6 py-6 space-y-4 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700/20 to-brand-500/10 flex items-center justify-center border border-brand-700/15">
                                <Receipt size={16} className="text-brand-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">Business & Tax Details</h2>
                                <p className="text-[#5a5a70] text-xs mt-0.5">Shown on invoices. Fill in if your studio is GST registered.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">GSTIN <span className="text-[#5a5a70] font-normal">(GST Number)</span></label>
                                <div className="relative">
                                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="e.g. 22AAAAA0000A1Z5" maxLength={15} className={`input-field pl-10 uppercase ${inputReadonlyClass} ${validationErrors.gstin ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.gstin && <p className="text-red-400 text-xs mt-1">{validationErrors.gstin}</p>}
                            </div>
                            <div>
                                <label className="input-label">PAN Number <span className="text-[#5a5a70] font-normal">(Optional)</span></label>
                                <div className="relative">
                                    <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} placeholder="e.g. ABCDE1234F" maxLength={10} className={`input-field pl-10 uppercase ${inputReadonlyClass} ${validationErrors.panNumber ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.panNumber && <p className="text-red-400 text-xs mt-1">{validationErrors.panNumber}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">HSN/SAC Code <span className="text-[#5a5a70] font-normal">(Default)</span></label>
                                <div className="relative">
                                    <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={hsnSacCode} onChange={(e) => setHsnSacCode(e.target.value)} placeholder="9971" className={`input-field pl-10 ${inputReadonlyClass} ${validationErrors.hsnSacCode ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.hsnSacCode ? <p className="text-red-400 text-xs mt-1">{validationErrors.hsnSacCode}</p> : <p className="text-[#5a5a70] text-xs mt-1">Interior design services are typically SAC 9971</p>}
                            </div>
                            <div>
                                <label className="input-label">Invoice Due Days <span className="text-[#5a5a70] font-normal">(Default)</span></label>
                                <div className="relative">
                                    <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="number" value={invoiceDueDays} onChange={(e) => setInvoiceDueDays(parseInt(e.target.value) || 7)} placeholder="7" min={1} max={365} className={`input-field pl-10 ${inputReadonlyClass} ${validationErrors.invoiceDueDays ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.invoiceDueDays ? <p className="text-red-400 text-xs mt-1">{validationErrors.invoiceDueDays}</p> : <p className="text-[#5a5a70] text-xs mt-1">Number of days after invoice creation until payment is due</p>}
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════
                       PAYMENT / BANK DETAILS
                       ═══════════════════════════════════════════ */}
                    <div className="glass-card px-6 py-6 space-y-4 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700/20 to-brand-500/10 flex items-center justify-center border border-brand-700/15">
                                <Landmark size={16} className="text-brand-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">Payment / Bank Details</h2>
                                <p className="text-[#5a5a70] text-xs mt-0.5">Shown on invoices so clients know where to pay.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Bank Name</label>
                                <div className="relative">
                                    <Landmark size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. HDFC Bank" className={`input-field pl-10 ${inputReadonlyClass}`} readOnly={!isEditing} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Account Number</label>
                                <div className="relative">
                                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} placeholder="e.g. 1234567890123" className={`input-field pl-10 ${inputReadonlyClass} ${validationErrors.bankAccountNumber ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.bankAccountNumber && <p className="text-red-400 text-xs mt-1">{validationErrors.bankAccountNumber}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">IFSC Code</label>
                                <div className="relative">
                                    <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value.toUpperCase())} placeholder="e.g. HDFC0001234" maxLength={11} className={`input-field pl-10 uppercase ${inputReadonlyClass} ${validationErrors.bankIfsc ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.bankIfsc && <p className="text-red-400 text-xs mt-1">{validationErrors.bankIfsc}</p>}
                            </div>
                            <div>
                                <label className="input-label">UPI ID</label>
                                <div className="relative">
                                    <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g. studio@upi" className={`input-field pl-10 ${inputReadonlyClass} ${validationErrors.upiId ? 'border-red-500' : ''}`} readOnly={!isEditing} />
                                </div>
                                {validationErrors.upiId && <p className="text-red-400 text-xs mt-1">{validationErrors.upiId}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════
                       DEFAULTS
                       ═══════════════════════════════════════════ */}
                    <div className="glass-card px-6 py-6 space-y-4 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700/20 to-brand-500/10 flex items-center justify-center border border-brand-700/15">
                                <Palette size={16} className="text-brand-400" />
                            </div>
                            <h2 className="text-base font-bold text-white tracking-tight">Defaults</h2>
                        </div>

                        <div>
                            <label className="input-label">Default Accent Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" value={defaultAccentColor} onChange={(e) => setDefaultAccentColor(e.target.value)} className="w-10 h-10 rounded-lg border border-[#2a2a40] cursor-pointer bg-transparent" disabled={!isEditing} />
                                <input type="text" value={defaultAccentColor} onChange={(e) => setDefaultAccentColor(e.target.value)} placeholder="#4263eb" className={`input-field w-32 ${inputReadonlyClass}`} readOnly={!isEditing} />
                                <span className="text-[#5a5a70] text-xs">Used as accent in all templates</span>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Default Payment Terms</label>
                            <textarea value={defaultPaymentTerms} onChange={(e) => setDefaultPaymentTerms(e.target.value)} placeholder="e.g. 50% advance, 25% on material delivery, 25% on completion" rows={3} className={`input-field ${inputReadonlyClass}`} readOnly={!isEditing} />
                            <p className="text-[#5a5a70] text-xs mt-1">Pre-filled in new proposals. You can always override per project.</p>
                        </div>
                    </div>
                </div>

                {/* Save Button — only visible when editing */}
                {isEditing && (
                    <div className="mt-8 pb-8 animate-fade-in">
                        <button
                            onClick={saveProfile}
                            disabled={saving}
                            className="btn-primary w-full justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
