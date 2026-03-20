'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import LandingNavbar from '@/components/LandingNavbar';
import { supabase } from '@/lib/supabase';
import {
    Sparkles, Zap, FileText, Palette, Share2, Layers, LayoutTemplate,
    ArrowRight, ChevronRight, Plus, ClipboardList, Send,
    Star, MessageSquare, Loader2, CheckCircle2, Eye, ChevronDown,
    X, Check, Receipt, IndianRupee, Users, Briefcase, Home as HomeIcon
} from 'lucide-react';
import TemplatePreviewModal from '@/components/TemplatePreviewModal';
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
                        Built for Indian Interior Design Professionals
                    </div>

                    {/* Headline — Pain-first */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
                        <span className="text-white">Stop Chasing Clients on</span>
                        <br />
                        <span className="landing-gradient-text">WhatsApp With Word Docs</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[#8888a0] text-lg sm:text-xl max-w-2xl mx-auto mb-4 animate-fade-in leading-relaxed">
                        Create branded proposals, get client approval, and auto-generate invoices - in one place.
                        Built for Indian interior designers.
                    </p>

                    {/* Trust strip */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[#5a5a70] text-xs sm:text-sm mb-10 animate-fade-in">
                        <span className="flex items-center gap-1.5">🇮🇳 Made for India</span>
                        <span className="hidden sm:inline text-[#2a2a40]">•</span>
                        <span className="flex items-center gap-1.5"><IndianRupee size={12} /> INR + GST</span>
                        <span className="hidden sm:inline text-[#2a2a40]">•</span>
                        <span className="flex items-center gap-1.5"><Share2 size={12} /> WhatsApp Sharing</span>
                        <span className="hidden sm:inline text-[#2a2a40]">•</span>
                        <span className="flex items-center gap-1.5"><Palette size={12} /> 6 Premium Templates</span>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-xl shadow-brand-700/25"
                                >
                                    Go to Dashboard
                                    <ArrowRight size={20} />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="btn-secondary text-base px-8 py-3.5 rounded-xl"
                                >
                                    See How It Works
                                    <ChevronRight size={18} />
                                </a>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-xl shadow-brand-700/25"
                                >
                                    Start Free
                                    <ArrowRight size={20} />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="btn-secondary text-base px-8 py-3.5 rounded-xl"
                                >
                                    See How It Works
                                    <ChevronRight size={18} />
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== BEFORE → AFTER ===== */}
            <section className="landing-section">
                <div className="text-center mb-16">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">The Difference</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Before vs. After Kalvora</h2>
                    <p className="text-[#8888a0] max-w-xl mx-auto">See what your workflow looks like with and without Kalvora.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Before */}
                    <div className="landing-card p-7 border-red-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/60 to-red-400/30" />
                        <div className="flex items-center gap-2 mb-5">
                            <X size={20} className="text-red-400" />
                            <h3 className="text-lg font-semibold text-red-400">Before Kalvora</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-[#8888a0]">
                            <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 flex-shrink-0" /> Word doc proposal over WhatsApp</li>
                            <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 flex-shrink-0" /> &quot;Bhai thoda change karo&quot; - endless back and forth</li>
                            <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 flex-shrink-0" /> Manual Excel invoice after approval</li>
                            <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 flex-shrink-0" /> Chase payments with 10 follow-up messages</li>
                            <li className="flex items-start gap-2"><X size={14} className="text-red-400/60 mt-0.5 flex-shrink-0" /> No idea if client even opened the doc</li>
                        </ul>
                    </div>

                    {/* After */}
                    <div className="landing-card p-7 border-emerald-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/60 to-emerald-400/30" />
                        <div className="flex items-center gap-2 mb-5">
                            <CheckCircle2 size={20} className="text-emerald-400" />
                            <h3 className="text-lg font-semibold text-emerald-400">After Kalvora</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-[#8888a0]">
                            <li className="flex items-start gap-2"><Check size={14} className="text-emerald-400/80 mt-0.5 flex-shrink-0" /> Branded PDF proposal in 60 seconds</li>
                            <li className="flex items-start gap-2"><Check size={14} className="text-emerald-400/80 mt-0.5 flex-shrink-0" /> Client approves online with one click</li>
                            <li className="flex items-start gap-2"><Check size={14} className="text-emerald-400/80 mt-0.5 flex-shrink-0" /> Invoice auto-generated after approval</li>
                            <li className="flex items-start gap-2"><Check size={14} className="text-emerald-400/80 mt-0.5 flex-shrink-0" /> Payment milestones tracked automatically</li>
                            <li className="flex items-start gap-2"><Check size={14} className="text-emerald-400/80 mt-0.5 flex-shrink-0" /> Know exactly when client views your proposal</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS (4 steps) ===== */}
            <section id="how-it-works" className="landing-section relative">
                <div className="text-center mb-16">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">How It Works</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Four Simple Steps</h2>
                    <p className="text-[#8888a0] max-w-xl mx-auto">
                        From project details to tracked payment - in under a minute.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting line (desktop only) */}
                    <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-brand-600/30 to-transparent" />

                    {[
                        { step: '01', icon: Plus, title: 'Fill Details', desc: 'Enter client info, rooms, and pricing with smart presets.' },
                        { step: '02', icon: Palette, title: 'Pick a Template', desc: 'Choose from 6 premium PDF templates. Add your brand.' },
                        { step: '03', icon: Share2, title: 'Share on WhatsApp', desc: 'Send client a magic link. Know when they view it.' },
                        { step: '04', icon: Receipt, title: 'Auto Invoice', desc: 'Client approves → invoice auto-generated → payment tracked.' },
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
                        { icon: Share2, title: 'WhatsApp Sharing', desc: 'Share proposals directly on WhatsApp with pre-filled messages. Know when clients view them.' },
                        { icon: Receipt, title: 'GST Invoicing', desc: 'Auto-generate GST-compliant invoices with CGST/SGST breakdown, bank details, and UPI.' },
                        { icon: FileText, title: 'Client Approval', desc: 'Clients approve with one click from the magic link. You get notified instantly via email.' },
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

            {/* ===== TEMPLATES PREVIEW ===== */}
            <TemplatesShowcase />

            {/* ===== WHO IT'S FOR ===== */}
            <section className="landing-section">
                <div className="text-center mb-16">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">Who It&apos;s For</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for Your Studio</h2>
                    <p className="text-[#8888a0] max-w-xl mx-auto">
                        Whether you&apos;re solo or a small team, Kalvora fits your workflow.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {[
                        { icon: Users, title: 'Freelance Designers', desc: 'Solo designers handling 3-10 active projects' },
                        { icon: Briefcase, title: 'Small Studios', desc: 'Design studios with 2-5 team members' },
                        { icon: HomeIcon, title: 'Architects', desc: 'Architects offering interior services' },
                        { icon: Layers, title: 'Home Staging', desc: 'Home staging and decor businesses' },
                    ].map((item, i) => (
                        <div key={item.title} className={`landing-card p-6 text-center opacity-0 animate-scale-in stagger-${i + 1}`}>
                            <div className="w-12 h-12 rounded-xl bg-brand-700/15 border border-brand-700/25 flex items-center justify-center mb-4 mx-auto">
                                <item.icon size={22} className="text-brand-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                            <p className="text-[#8888a0] text-xs leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="pricing" className="landing-section">
                <div className="text-center">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">Pricing</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Free During Early Access</h2>
                    <p className="text-[#8888a0] max-w-lg mx-auto leading-relaxed mb-6">
                        No credit card required. Use every feature, create unlimited proposals.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-700/10 border border-brand-700/20 text-brand-400 text-sm font-medium">
                        <Star size={16} />
                        Launching Pro at ₹999/mo - Early users lock in 50% off forever
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="landing-section">
                <div className="text-center mb-16">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">FAQ</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                </div>
                <div className="max-w-2xl mx-auto">
                    <FAQSection />
                </div>
            </section>

            {/* ===== FEEDBACK CTA ===== */}
            <section id="feedback" className="landing-section">
                <div className="max-w-3xl mx-auto">
                    <div className="landing-card p-8 sm:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/10 via-transparent to-brand-600/5" />
                        <div className="relative">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-700/15 border border-brand-700/25 mb-6">
                                <MessageSquare size={24} className="text-brand-400" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Help Us Build What You Need</h2>
                            <p className="text-[#8888a0] max-w-lg mx-auto mb-8 leading-relaxed">
                                We are building Kalvora with real designers like you. Take 2 minutes to share what is working, what is not, and what features you need most.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/feedback" className="btn-primary text-sm px-8 py-3 rounded-xl shadow-xl shadow-brand-700/25">
                                    <MessageSquare size={16} />
                                    Share Your Feedback
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                            <p className="text-[#5a5a70] text-xs mt-5">Your input directly shapes our roadmap</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA BANNER ===== */}
            <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
                <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-700/20 via-[#1a1a2e] to-brand-600/10" />
                    <div className="absolute inset-0 border border-brand-700/20 rounded-3xl" />
                    <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 shadow-xl shadow-brand-700/30 mb-6 animate-float">
                            <LayoutTemplate size={28} className="text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            Your Next Proposal Is 60 Seconds Away
                        </h2>
                        <p className="text-[#8888a0] max-w-lg mx-auto mb-8">
                            Stop sending proposals in Word docs. Start closing projects faster with Kalvora.
                        </p>
                        <Link
                            href={session ? '/dashboard' : '/login'}
                            className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-xl shadow-brand-700/25"
                        >
                            Start Creating - It&apos;s Free
                            <ArrowRight size={20} />
                        </Link>
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
                                Close projects faster - professional proposals, client approval, and GST invoicing for interior designers.
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

/* ===== FAQ Section Component ===== */
const faqItems = [
    { q: 'Is Kalvora only for interior designers?', a: 'Kalvora is primarily built for interior designers, but architects, home stagers, and design consultants also use it for client proposals and invoicing.' },
    { q: 'Can I add my studio logo and branding?', a: 'Absolutely! Upload your studio logo, set your brand accent color, and it appears on every proposal and invoice you generate.' },
    { q: 'Can I share proposals on WhatsApp?', a: 'Yes! One-click WhatsApp sharing with a pre-filled message and your proposal link. Clients view it in their browser - no app needed.' },
    { q: 'Does it support GST invoices?', a: 'Yes. Add your GSTIN and Kalvora automatically generates invoices with CGST/SGST breakdown, HSN/SAC codes, bank details, and UPI info.' },
    { q: 'Is my data secure?', a: 'Your data is stored securely on Supabase (PostgreSQL) with row-level security. Each designer can only access their own data.' },
];

function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <div className="space-y-3">
            {faqItems.map((item, i) => (
                <div key={i} className="glass-card overflow-hidden">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left"
                    >
                        <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                        <ChevronDown size={18} className={`text-[#5a5a70] flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === i && (
                        <div className="px-6 pb-4 animate-fade-in">
                            <p className="text-[#8888a0] text-sm leading-relaxed">{item.a}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ===== Templates Showcase Component ===== */
const landingTemplates = [
    {
        name: 'Minimal',
        desc: 'Clean whites, Inter font, elegant simplicity. Perfect for modern studios that prefer understated sophistication.',
        colors: ['#ffffff', '#2563EB', '#f8fafc'],
        icon: '✦',
        badge: '⭐ Most Popular',
        badgeColor: '',
        previewImage: '/templates/minimal.png',
        stylePoints: ['Inter typography throughout', 'Blue gradient accent', 'Stripe-inspired clean layout', 'Rounded card elements'],
    },
    {
        name: 'Luxury',
        desc: 'Gold & dark tones, serif typography, opulent feel. Ideal for high-end residential and boutique projects.',
        colors: ['#1C1917', '#B8963E', '#FAF8F4'],
        icon: '✧',
        badge: 'Best for Luxury',
        badgeColor: '',
        previewImage: '/templates/luxury.png',
        stylePoints: ['Playfair Display serif headings', 'Gold accent on dark palette', 'Diamond ornament divider', 'Ivory textured background'],
    },
    {
        name: 'Professional',
        desc: 'Bold geometry, sharp type, vibrant accents. Great for corporate & commercial interior projects.',
        colors: ['#4c6ef5', '#ffffff', '#f9fafb'],
        icon: '◆',
        badge: 'Best for Corporate',
        badgeColor: '',
        previewImage: '/templates/professional.png',
        stylePoints: ['Full-width colored header bar', 'Inter bold headings', 'Bordered card sections', 'Corporate confidence'],
    },
    {
        name: 'Blueprint',
        desc: 'Technical grid background, navy palette, engineering precision. Built for architects and contractors.',
        colors: ['#1a365d', '#bee3f8', '#f7fafc'],
        icon: '⊞',
        badge: 'Best for Architects',
        badgeColor: '',
        previewImage: '/templates/blueprint.png',
        stylePoints: ['Space Grotesk headings', 'Subtle grid background', 'Section numbers (01, 02, 03)', 'Engineering-spec totals box'],
    },
    {
        name: 'Editorial',
        desc: 'Warm serif, magazine-style layout with generous whitespace. Perfect for creative design studios.',
        colors: ['#FFFBF5', '#3d2b1f', '#e8dcc8'],
        icon: '❧',
        badge: 'Best for Creatives',
        badgeColor: '',
        previewImage: '/templates/editorial.png',
        stylePoints: ['Playfair Display headings', 'Warm off-white background', 'Italic document title', 'Magazine-style whitespace'],
    },
    {
        name: 'High Contrast',
        desc: 'Bold contrast blocks, indigo accent, SaaS-inspired. Ideal for modern design firms.',
        colors: ['#0f172a', '#6366f1', '#ffffff'],
        icon: '▣',
        badge: 'Best for Modern',
        badgeColor: '',
        previewImage: '/templates/highcontrast.png',
        stylePoints: ['Dark header bar', 'Indigo accent highlights', 'Tabular number styling', 'Card-style sections'],
    },
];

function TemplatesShowcase() {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const openPreview = (index: number) => {
        setActiveIndex(index);
        setModalOpen(true);
    };

    return (
        <>
            <section id="templates" className="landing-section">
                <div className="text-center mb-16">
                    <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">Templates</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Six Premium Styles</h2>
                    <p className="text-[#8888a0] max-w-xl mx-auto">
                        Each template is crafted for a different aesthetic. Click preview to see the output.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {landingTemplates.map((template, i) => (
                        <div
                            key={template.name}
                            className={`template-card opacity-0 animate-scale-in stagger-${i + 1}`}
                            onClick={() => openPreview(i)}
                        >
                            {/* Badge */}
                            {template.badge && (
                                <span
                                    className="template-card-badge"
                                    style={{ background: 'rgba(129, 140, 248, 0.12)', color: '#818cf8' }}
                                >
                                    {template.badge}
                                </span>
                            )}

                            {/* Color bar */}
                            <div className="h-2 flex">
                                {template.colors.map((c, j) => (
                                    <div key={j} className="flex-1" style={{ backgroundColor: c }} />
                                ))}
                            </div>

                            <div className="p-7">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{template.icon}</span>
                                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                                </div>
                                <p className="text-[#8888a0] text-sm leading-relaxed mb-5">{template.desc}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#5a5a70] uppercase tracking-wider">Colors:</span>
                                        {template.colors.map((c, j) => (
                                            <div
                                                key={j}
                                                className="w-5 h-5 rounded-md border border-[#2a2a40]"
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className="template-card-view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openPreview(i);
                                        }}
                                    >
                                        <Eye size={14} />
                                        View Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <TemplatePreviewModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                templates={landingTemplates}
                activeIndex={activeIndex}
                onNavigate={setActiveIndex}
            />
        </>
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
