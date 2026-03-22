'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { generateDemoData, PROJECT_TYPES } from '@/lib/demoData';
import { minimalTemplate, luxuryTemplate, modernTemplate, blueprintTemplate } from '@/lib/templates';
import {
    Sparkles, ArrowRight, IndianRupee, User, Building2, RotateCcw,
    Palette, FileText, Loader2, CheckCircle2, ChevronDown, Eye
} from 'lucide-react';

const TEMPLATES = [
    { id: 'minimal', label: 'Modern Minimal', fn: minimalTemplate },
    { id: 'luxury', label: 'Luxury Studio', fn: luxuryTemplate },
    { id: 'corporate', label: 'Corporate Pro', fn: modernTemplate },
    { id: 'blueprint', label: 'Blueprint', fn: blueprintTemplate },
];

export default function TryPage() {
    const [clientName, setClientName] = useState('');
    const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
    const [budget, setBudget] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        if (!clientName.trim() || !budget) return;
        setGenerating(true);
        // Small delay for dramatic effect
        setTimeout(() => {
            setShowPreview(true);
            setGenerating(false);
        }, 800);
    };

    const previewHtml = useMemo(() => {
        if (!showPreview) return '';
        const data = generateDemoData(clientName, projectType, Number(budget));
        return TEMPLATES[selectedTemplate].fn(data);
    }, [showPreview, clientName, projectType, budget, selectedTemplate]);

    const budgetNum = Number(budget) || 0;
    const isValid = clientName.trim().length > 0 && budgetNum >= 10000;

    return (
        <div className="min-h-screen bg-[#0a0a0f] page-bg">
            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-[#08080d]/90 backdrop-blur-xl border-b border-[#1a1a2e]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">KALVORA</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="text-sm text-[#8888a0] hover:text-white transition-colors hidden sm:block">
                            Sign In
                        </Link>
                        <Link href="/signup" className="btn-primary text-xs sm:text-sm py-2 px-4">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-20 pb-12 px-4 sm:px-6">
                {!showPreview ? (
                    /* ============ STEP 1: INPUT FORM ============ */
                    <div className="max-w-xl mx-auto animate-fade-in">
                        {/* Hero Text */}
                        <div className="text-center mb-10 mt-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-5">
                                <Eye size={14} />
                                Live Demo - No signup needed
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                                See your proposal
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600"> in 10 seconds</span>
                            </h1>
                            <p className="text-[#5a5a70] text-sm sm:text-base max-w-md mx-auto">
                                Enter your client&apos;s details below. We&apos;ll generate a professional, branded proposal instantly.
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="glass-card p-6 sm:p-8 space-y-5">
                            {/* Client Name */}
                            <div>
                                <label className="input-label">Client Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={e => setClientName(e.target.value)}
                                        placeholder="e.g. Priya Sharma"
                                        className="input-field pl-10"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Project Type */}
                            <div>
                                <label className="input-label">Project Type</label>
                                <div className="relative">
                                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <select
                                        value={projectType}
                                        onChange={e => setProjectType(e.target.value)}
                                        className="input-field pl-10 appearance-none cursor-pointer"
                                    >
                                        {PROJECT_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70] pointer-events-none" />
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="input-label">Estimated Budget</label>
                                <div className="relative">
                                    <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input
                                        type="number"
                                        value={budget}
                                        onChange={e => setBudget(e.target.value)}
                                        placeholder="e.g. 500000"
                                        className="input-field pl-10"
                                        min={10000}
                                    />
                                </div>
                                {budgetNum > 0 && (
                                    <p className="text-xs text-[#5a5a70] mt-1.5">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(budgetNum)}
                                    </p>
                                )}
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={!isValid || generating}
                                className="btn-primary w-full justify-center py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate Proposal Preview
                                    </>
                                )}
                            </button>

                            {!isValid && clientName.length > 0 && (
                                <p className="text-xs text-center text-[#5a5a70]">
                                    Enter a budget of at least ₹10,000
                                </p>
                            )}
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-[#3a3a50] text-xs">
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500/50" /> No signup required</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500/50" /> Real template preview</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500/50" /> 100% free</span>
                        </div>
                    </div>
                ) : (
                    /* ============ STEP 2: PREVIEW ============ */
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        {/* Top bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">
                                    Proposal for {clientName}
                                </h2>
                                <p className="text-[#5a5a70] text-sm">
                                    {projectType} · {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(budgetNum)} budget
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowPreview(false); }}
                                className="flex items-center gap-2 text-sm text-[#8888a0] hover:text-white transition-colors"
                            >
                                <RotateCcw size={14} /> Try different details
                            </button>
                        </div>

                        {/* Template Switcher */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {TEMPLATES.map((t, i) => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(i)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        selectedTemplate === i
                                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                                            : 'bg-[#12121a] text-[#5a5a70] border border-[#1a1a2e] hover:text-white hover:border-[#3a3a55]'
                                    }`}
                                >
                                    <Palette size={12} />
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Preview iframe */}
                        <div className="glass-card overflow-hidden" style={{ padding: 0 }}>
                            <div className="bg-[#1a1a2e]/50 px-4 py-2.5 border-b border-[#1a1a2e] flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                </div>
                                <span className="text-[10px] text-[#5a5a70] ml-2 font-mono">proposal-preview.pdf</span>
                            </div>
                            <div className="bg-[#e8e8e8] p-4 sm:p-8 flex justify-center overflow-auto" style={{ maxHeight: '75vh' }}>
                                <iframe
                                    srcDoc={previewHtml}
                                    className="bg-white shadow-2xl"
                                    style={{
                                        width: '210mm',
                                        minHeight: '297mm',
                                        border: 'none',
                                        transform: 'scale(0.65)',
                                        transformOrigin: 'top center',
                                    }}
                                    title="Proposal Preview"
                                />
                            </div>
                        </div>

                        {/* CTA Bar */}
                        <div className="mt-6 glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-white font-semibold text-base mb-1">Love how this looks?</h3>
                                <p className="text-[#5a5a70] text-sm">Sign up free and send this to your client in 60 seconds.</p>
                            </div>
                            <Link
                                href="/signup"
                                className="btn-primary py-3 px-6 text-sm font-semibold whitespace-nowrap"
                            >
                                Create Your Free Account <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Features tease */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                            {[
                                { icon: FileText, title: 'Send as PDF', desc: 'Share via WhatsApp or email' },
                                { icon: CheckCircle2, title: 'Client Approval', desc: 'Clients approve online, no calls' },
                                { icon: IndianRupee, title: 'Auto Invoice', desc: 'Invoice generated on approval' },
                            ].map((feat, i) => (
                                <div key={i} className="glass-card p-4 flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                                        <feat.icon size={16} className="text-brand-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{feat.title}</p>
                                        <p className="text-xs text-[#5a5a70]">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
