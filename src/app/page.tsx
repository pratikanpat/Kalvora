'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import LandingNavbar from '@/components/LandingNavbar';
import { supabase } from '@/lib/supabase';
import {
    Sparkles, Zap, FileText, Palette, Share2, Layers, LayoutTemplate,
    ArrowRight, ChevronRight, Plus, ClipboardList, Send,
    Star, MessageSquare, Loader2, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LandingPage() {
    const router = useRouter();
    const { session } = useAuth();

    const handleGetStarted = () => {
        if (session) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <LandingNavbar />

            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-brand-600/[0.07] blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-brand-500/[0.05] blur-[100px]" />
                </div>

                <div className="relative max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-700/10 border border-brand-700/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
                        <Sparkles size={14} />
                        Built for Interior Design Professionals
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
                        <span className="text-white">Create Stunning Proposals</span>
                        <br />
                        <span className="landing-gradient-text">In Seconds, Not Hours</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[#8888a0] text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
                        Kalvora helps interior designers generate beautiful, branded PDF proposals.
                        Enter your project details, pick a template, and share with clients — instantly.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
                        {session ? (
                            <>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-xl shadow-brand-700/25"
                                >
                                    Go to Dashboard
                                    <ArrowRight size={20} />
                                </button>
                                <a
                                    href="#features"
                                    className="btn-secondary text-base px-8 py-3.5 rounded-xl"
                                >
                                    Explore Features
                                    <ChevronRight size={18} />
                                </a>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleGetStarted}
                                    className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-xl shadow-brand-700/25"
                                >
                                    Get Started
                                    <ArrowRight size={20} />
                                </button>
                                <a
                                    href="#features"
                                    className="btn-secondary text-base px-8 py-3.5 rounded-xl"
                                >
                                    Learn More
                                    <ChevronRight size={18} />
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="landing-section">
                <div className="text-center mb-16">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">Features</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything You Need</h2>
                    <p className="text-[#8888a0] max-w-xl mx-auto">
                        Powerful tools designed specifically for interior design professionals.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: Zap, title: 'Instant Proposals', desc: 'Create professional, client-ready proposals in seconds with just a few inputs.' },
                        { icon: Palette, title: 'Branded Templates', desc: 'Choose from Minimal, Luxury, or Modern PDF templates. Customize colors and upload your logo.' },
                        { icon: ClipboardList, title: 'Room & Pricing', desc: 'Add rooms with square footage and detailed line-item pricing with auto-calculated totals and tax.' },
                        { icon: Share2, title: 'Shareable Links', desc: 'Generate public links to share proposals with clients — no login required for them.' },
                        { icon: Layers, title: 'Multiple Versions', desc: 'Generate unlimited proposal versions per project. Track every PDF with smart file naming.' },
                        { icon: FileText, title: 'Draft Support', desc: 'Save projects as drafts and come back anytime to edit, regenerate, or share.' },
                    ].map((feature, i) => (
                        <div
                            key={feature.title}
                            className={`landing-card p-7 opacity-0 animate-scale-in stagger-${i + 1}`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-brand-700/15 border border-brand-700/25 flex items-center justify-center mb-5">
                                <feature.icon size={22} className="text-brand-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-[#8888a0] text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="landing-section relative">
                <div className="text-center mb-16">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">How It Works</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Three Simple Steps</h2>
                    <p className="text-[#8888a0] max-w-xl mx-auto">
                        From project details to a polished PDF — in under a minute.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-brand-600/30 to-transparent" />

                    {[
                        { step: '01', icon: Plus, title: 'Create Project', desc: 'Enter client details, project type, and designer info.' },
                        { step: '02', icon: ClipboardList, title: 'Add Rooms & Pricing', desc: 'Add rooms with dimensions and itemized pricing with tax.' },
                        { step: '03', icon: Send, title: 'Generate & Share', desc: 'Pick a template, generate a branded PDF, and share via link.' },
                    ].map((item, i) => (
                        <div key={item.step} className={`text-center relative opacity-0 animate-scale-in stagger-${i + 1}`}>
                            <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-2xl bg-[#1a1a2e] border border-[#2a2a40] mb-6 relative z-10">
                                <item.icon size={32} className="text-brand-400" />
                                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-[11px] font-bold text-white shadow-lg">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-[#8888a0] text-sm max-w-[280px] mx-auto leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== TEMPLATES PREVIEW ===== */}
            <section id="templates" className="landing-section">
                <div className="text-center mb-16">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">Templates</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Three Premium Styles</h2>
                    <p className="text-[#8888a0] max-w-xl mx-auto">
                        Each template is crafted for a different aesthetic. Pick the one that matches your brand.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            name: 'Minimal',
                            desc: 'Clean whites, Inter font, elegant simplicity. Perfect for modern studios.',
                            colors: ['#ffffff', '#1a1a1a', '#e5e5e5'],
                            icon: '✦',
                        },
                        {
                            name: 'Luxury',
                            desc: 'Gold & dark tones, serif typography, opulent feel. Ideal for high-end projects.',
                            colors: ['#1B1B1F', '#C5A55A', '#faf8f3'],
                            icon: '✧',
                        },
                        {
                            name: 'Modern',
                            desc: 'Bold geometry, sharp type, vibrant accents. Great for corporate interiors.',
                            colors: ['#4c6ef5', '#fafbfd', '#1a1a2e'],
                            icon: '◆',
                        },
                    ].map((template, i) => (
                        <div
                            key={template.name}
                            className={`landing-card overflow-hidden opacity-0 animate-scale-in stagger-${i + 1}`}
                        >
                            {/* Color bar */}
                            <div className="h-2 flex">
                                {template.colors.map((c, j) => (
                                    <div key={j} className="flex-1" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                            <div className="p-7">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{template.icon}</span>
                                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                                </div>
                                <p className="text-[#8888a0] text-sm leading-relaxed mb-5">{template.desc}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#5a5a70] uppercase tracking-wider">Colors:</span>
                                    {template.colors.map((c, j) => (
                                        <div
                                            key={j}
                                            className="w-6 h-6 rounded-lg border border-[#2a2a40]"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== PRICING (Placeholder) ===== */}
            <section id="pricing" className="landing-section">
                <div className="text-center">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">Pricing</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-700/10 border border-brand-700/20 text-brand-400 text-sm font-medium mt-4">
                        <Star size={16} />
                        Coming Soon — Currently Free During Beta
                    </div>
                    <p className="text-[#8888a0] max-w-lg mx-auto mt-6 leading-relaxed">
                        Kalvora is free to use while in beta. We&apos;ll announce pricing plans before any changes take effect.
                    </p>
                </div>
            </section>

            {/* ===== FEEDBACK ===== */}
            <section id="feedback" className="landing-section">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">Feedback</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">We&apos;d Love to Hear From You</h2>
                        <p className="text-[#8888a0]">
                            Share your thoughts, suggestions, or just say hello.
                        </p>
                    </div>
                    <FeedbackForm />
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
                <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-700/20 via-[#1a1a2e] to-brand-600/10" />
                    <div className="absolute inset-0 border border-brand-700/20 rounded-3xl" />
                    <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 shadow-xl shadow-brand-700/30 mb-6 animate-float">
                            <LayoutTemplate size={28} className="text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            Ready to Create Your First Proposal?
                        </h2>
                        <p className="text-[#8888a0] max-w-lg mx-auto mb-8">
                            Join designers who save hours every week with Kalvora&apos;s instant proposal generator.
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-xl shadow-brand-700/25"
                        >
                            Create Your First Proposal
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-[#1a1a2e] bg-[#08080d]/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <span className="text-sm font-bold text-white tracking-tight">K A L V O R A</span>
                            </div>
                            <p className="text-[#5a5a70] text-sm leading-relaxed">
                                Professional proposal generator for interior design studios.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-xs font-semibold text-[#8888a0] uppercase tracking-wider mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                {[
                                    { label: 'Login', href: '/login' },
                                    { label: 'Sign Up', href: '/signup' },
                                    { label: 'Dashboard', href: '/dashboard' },
                                ].map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="block text-sm text-[#5a5a70] hover:text-brand-400 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-xs font-semibold text-[#8888a0] uppercase tracking-wider mb-4">Product</h4>
                            <div className="space-y-2">
                                {[
                                    { label: 'Features', href: '#features' },
                                    { label: 'Templates', href: '#templates' },
                                    { label: 'Pricing', href: '#pricing' },
                                ].map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="block text-sm text-[#5a5a70] hover:text-brand-400 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#1a1a2e] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[#5a5a70] text-xs">
                            &copy; 2026 <span className="text-[#8888a0] font-medium">KALVORA</span>. All rights reserved.
                        </p>
                        <p className="text-[#3a3a50] text-xs">
                            Crafted with obsession by <span className="text-[#5a5a70]">Kalipr Labs</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* ===== Feedback Form Component ===== */
function FeedbackForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !message.trim()) {
            toast.error('Please enter your name and message.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('feedback').insert({
                name: name.trim(),
                email: email.trim() || null,
                message: message.trim(),
            });

            if (error) {
                toast.error('Failed to submit feedback. Please try again.');
                console.error('Feedback error:', error);
                return;
            }

            toast.success('Thank you for your feedback!');
            setName('');
            setEmail('');
            setMessage('');
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 4000);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8">
            {submitted ? (
                <div className="text-center py-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 mb-4">
                        <CheckCircle2 size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Thank You!</h3>
                    <p className="text-[#8888a0] text-sm">Your feedback has been submitted successfully.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="input-label">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="input-label">Email (optional)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="input-label">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Your thoughts, suggestions, or feedback..."
                            rows={4}
                            className="input-field resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <MessageSquare size={18} />
                        )}
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            )}
        </div>
    );
}
