'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/components/AuthProvider';
import {
    Building, Upload, Save, Palette, Loader2, User, Mail, Phone,
    Globe, Instagram, MapPin, FileText, CheckCircle, Pencil, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Profile fields
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
                setStudioName(data.studio_name || '');
                setDesignerName(data.designer_name || '');
                setLogoUrl(data.logo_url || '');
                setEmail(data.email || '');
                setPhone(data.phone || '');
                setWebsite(data.website || '');
                setInstagram(data.instagram || '');
                setStudioAddress(data.studio_address || '');
                setDefaultAccentColor(data.default_accent_color || '#4263eb');
                setDefaultPaymentTerms(data.default_payment_terms || '');
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

    const saveProfile = async () => {
        if (!studioName.trim() && !designerName.trim()) {
            toast.error('Please enter at least a studio name or designer name');
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
            // Notify sidebar to re-check profile completeness (Issue 2 fix)
            window.dispatchEvent(new Event('profile-updated'));
            // Exit edit mode after successful save (Issue 3)
            setIsEditing(false);
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
                <div className="mb-8 animate-fade-in flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Studio Profile</h1>
                        <p className="text-[#5a5a70] text-sm mt-1.5">
                            Set up your studio identity. This information will be used automatically in every proposal you create.
                        </p>
                    </div>
                    {/* Edit / Cancel toggle button */}
                    {!isNew && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 ml-4 ${
                                isEditing
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
                                Your profile is set up. This info will be used in all your proposals.
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Studio Identity */}
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
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" className={`input-field pl-10 ${inputReadonlyClass}`} readOnly={!isEditing} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Phone</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={`input-field pl-10 ${inputReadonlyClass}`} readOnly={!isEditing} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Online Presence */}
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

                    {/* Defaults */}
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
