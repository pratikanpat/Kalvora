'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import LandingNavbar from '@/components/LandingNavbar';
import LoggedInHome from '@/components/LoggedInHome';
import SocialProof from '@/components/SocialProof';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
    ArrowRight, ChevronDown, X, Check, CheckCircle2,
    Zap, Share2, Eye, FileText, Receipt, Clock,
    Sparkles, LayoutTemplate, Users, Briefcase,
    Home as HomeIcon, PenTool, Edit3, FolderOpen,
    BarChart3
} from 'lucide-react';

// ─────────────────────────────────────────
// LANDING PAGE — Auth-State-Aware Entry Point
//
// State A (no session): Sales Machine — convince, educate, convert
// State B (session):    Closing Engine — action-driven command center
//
// Both render at "/" — no redirects.
// ─────────────────────────────────────────

export default function LandingPage() {
    const { session, loading } = useAuth();

    // ── Loading state: prevent flash of wrong content ──
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <LoadingSpinner text="" />
            </div>
        );
    }

    // ── State B: Logged-in users see the Closing Engine ──
    if (session) {
        return (
            <div className="min-h-screen bg-[#0a0a0f]">
                <LandingNavbar />
                <LoggedInHome />
            </div>
        );
    }

    // ── State A: Sales Landing Page ──
    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <LandingNavbar />

            {/* ═══════════════════════════════════════
                HERO — The 5-Second Test
                Headline: Pain-driven opening
                Subheadline: Highlighter effect on key phrases
                ═══════════════════════════════════════ */}
            <section className="relative pt-24 pb-12 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Ambient background */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-[8%] left-[12%] w-[600px] h-[600px] rounded-full bg-brand-600/[0.06] blur-[150px]" />
                    <div className="absolute bottom-[5%] right-[8%] w-[450px] h-[450px] rounded-full bg-indigo-500/[0.04] blur-[130px]" />
                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-brand-500/[0.05] blur-[100px]" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    {/* Trust badge */}
                    <div className="landing-proof-badge animate-fade-in">
                        <span className="landing-proof-dot" />
                        Free during Early Access · No credit card required
                    </div>

                    {/* Headline */}
                    <h1 className="text-[32px] sm:text-[44px] lg:text-[58px] font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in">
                        <span className="text-white">Stop Sending Proposals</span>
                        <br />
                        <span className="text-white">on WhatsApp </span>
                        <span className="landing-gradient-text">Like It&apos;s 2012.</span>
                    </h1>

                    {/* Subheadline with highlighter effect */}
                    <p className="text-[#9090a8] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
                        Create professional interior design proposals,{' '}
                        <span className="highlighter-mark text-white font-medium">send a simple link</span>,{' '}
                        <span className="highlighter-mark text-white font-medium">track views</span>, and{' '}
                        <span className="highlighter-mark text-white font-medium">get approvals</span>{' '}
                        - all in one place.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-in">
                        <Link href="/signup" className="landing-cta-primary" id="hero-cta-primary">
                            Create Account
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Trust strip */}
                    <p className="text-[#5a5a70] text-xs sm:text-sm animate-fade-in">
                        Used by interior designers to close projects faster
                    </p>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                DASHBOARD SHOWCASE — The Product Shot
                Unchanged — perspective tilt + ambient glow
                ═══════════════════════════════════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 -mt-2 sm:mt-0">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full bg-brand-600/[0.07] blur-[120px]" />
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="dashboard-showcase animate-fade-in">
                        <div className="dashboard-showcase-inner">
                            <div className="dashboard-showcase-chrome">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                                    <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                                    <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
                                </div>
                                <span className="text-[10px] sm:text-xs text-[#5a5a70] font-medium tracking-wide">kalvora.in/dashboard</span>
                                <div className="w-[46px]" />
                            </div>
                            <img
                                src="/dash.png"
                                alt="Kalvora Dashboard — manage proposals, track client views, and auto-generate invoices"
                                className="w-full h-auto block"
                                loading="eager"
                            />
                        </div>
                        <div className="dashboard-showcase-fade" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                😤 PAIN SECTION — Hook them emotionally
                "Your current process is costing you projects"
                ═══════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10">
                <div className="max-w-3xl mx-auto">
                    <div className="landing-problem-card">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
                            Your current process is costing you projects
                        </h2>

                        <div className="max-w-lg mx-auto space-y-1">
                            {[
                                'You create proposals in Word or Excel',
                                'Convert to PDF',
                                'Send it on WhatsApp',
                                'Then wait… and follow up… again… and again',
                                "Half the time, you don't even know if the client opened it",
                            ].map((step, i) => (
                                <div key={i} className="pain-step" style={{ animationDelay: `${i * 120}ms` }}>
                                    <span className="pain-step-number">{i + 1}</span>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <span className="pain-punchline">That&apos;s not a system. That&apos;s chaos.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                ⚡ BEFORE / AFTER — Visual Contrast
                Rewritten content — specific, punchy
                ═══════════════════════════════════════ */}
            <section className="landing-section pt-10 sm:pt-14 pb-10 sm:pb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {/* Before */}
                    <div className="landing-card p-6 sm:p-7 border-red-500/15 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500/50 to-red-400/10" />
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <X size={16} className="text-red-400" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-red-400">Before Kalvora</h3>
                        </div>
                        <ul className="space-y-3.5 text-sm text-[#9090a8]">
                            {[
                                'Messy Word/Excel proposals',
                                'Endless WhatsApp follow-ups',
                                'No idea if client saw it',
                                'Manual invoices after every approval',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <X size={14} className="text-red-400/40 mt-0.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* After */}
                    <div className="landing-card p-6 sm:p-7 border-emerald-500/15 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500/50 to-emerald-400/10" />
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-emerald-400">After Kalvora</h3>
                        </div>
                        <ul className="space-y-3.5 text-sm text-[#9090a8]">
                            {[
                                'Clean proposals in minutes',
                                'Share with one link',
                                'Know when client views',
                                'One-click approval + Invoice ready instantly',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <Check size={14} className="text-emerald-400/60 mt-0.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                🧩 CORE FEATURES — 6 benefits, human language
                Not features — outcomes.
                ═══════════════════════════════════════ */}
            <section className="landing-section pt-10 sm:pt-14">
                <div className="text-center mb-12 sm:mb-14">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                        Everything You Need to Close Faster
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {[
                        {
                            icon: Zap,
                            title: 'Create Proposals in Minutes',
                            desc: 'No formatting. No design work. Just fill details and generate a clean, client-ready proposal instantly.',
                            accent: 'brand',
                        },
                        {
                            icon: Share2,
                            title: 'Share Instantly on WhatsApp',
                            desc: 'Send a simple link your client can open anywhere — no bulky files, no confusion.',
                            accent: 'emerald',
                        },
                        {
                            icon: Edit3,
                            title: 'Edit Without the Headache',
                            desc: 'Update pricing or details anytime without recreating the whole proposal.',
                            accent: 'amber',
                        },
                        {
                            icon: FolderOpen,
                            title: 'All Your Proposals, One Place',
                            desc: 'Every past proposal is saved and easy to access whenever you need it.',
                            accent: 'brand',
                        },
                        {
                            icon: Receipt,
                            title: 'Auto Invoice Generator',
                            desc: 'Once your client approves, your invoice is ready. No extra steps.',
                            accent: 'emerald',
                        },
                        {
                            icon: BarChart3,
                            title: 'Track Every Project',
                            desc: 'See exactly where each client stands: Draft → Sent → Viewed → Approved → Paid → Completed.',
                            accent: 'amber',
                        },
                    ].map((item, i) => {
                        const accentMap = {
                            brand: { bg: 'bg-brand-700/12', border: 'border-brand-700/20', text: 'text-brand-400' },
                            emerald: { bg: 'bg-emerald-500/8', border: 'border-emerald-500/15', text: 'text-emerald-400' },
                            amber: { bg: 'bg-amber-500/8', border: 'border-amber-500/15', text: 'text-amber-400' },
                        };
                        const a = accentMap[item.accent as keyof typeof accentMap];
                        return (
                            <div key={i} className="feature-benefit-card">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${a.bg} border ${a.border}`}>
                                    <item.icon size={20} className={a.text} />
                                </div>
                                <h3 className="text-[15px] font-semibold text-white mb-2.5 leading-snug">{item.title}</h3>
                                <p className="text-[#7a7a95] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════
                🎯 POWER FEATURE — USP Spotlight
                "Client Viewed" is the killer feature
                ═══════════════════════════════════════ */}
            <section className="landing-section pt-10 sm:pt-14">
                <div className="max-w-3xl mx-auto">
                    <div className="power-feature-section text-center">
                        <div className="relative z-10">
                            <div className="power-feature-icon-ring mx-auto mb-6">
                                <Eye size={36} className="text-brand-400" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                Finally… Know When Your Client Sees Your Proposal
                            </h2>
                            <p className="text-[#9090a8] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-6">
                                No more guessing. No more awkward follow-ups.
                                <br />
                                Get clarity on when to follow up - and close faster.
                            </p>
                            {/* Mock notification */}
                            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-brand-700/10 border border-brand-700/15 animate-float">
                                <Eye size={16} className="text-brand-400" />
                                <span className="text-white text-sm font-medium">Rahul just viewed your proposal</span>
                                <span className="text-brand-400 text-xs">2m ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                🧑‍🎨 WHO IT'S FOR — Self-Identification
                Simplified list
                ═══════════════════════════════════════ */}
            <section className="landing-section pt-10 sm:pt-14">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                        Built for Your Studio
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { icon: PenTool, title: 'Interior Designers', desc: 'Stop looking amateur with Word docs.' },
                        { icon: Briefcase, title: 'Freelancers', desc: 'Close deals with professional proposals.' },
                        { icon: HomeIcon, title: 'Small Design Studios', desc: 'Brand consistency in every proposal.' },
                        { icon: Users, title: 'Tired of Chasing?', desc: 'Track views, get approvals, move faster.' },
                    ].map((item) => (
                        <div key={item.title} className="landing-persona-card">
                            <div className="w-10 h-10 rounded-xl bg-brand-700/10 border border-brand-700/15 flex items-center justify-center mb-3">
                                <item.icon size={18} className="text-brand-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                            <p className="text-[#7a7a95] text-xs leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════
                ⭐ DESIGNER REVIEWS — Social Proof
                TEMPORARILY HIDDEN — uncomment to re-enable
                ═══════════════════════════════════════ */}
            {/* <SocialProof /> */}

            {/* ═══════════════════════════════════════
                💰 PRICING — Simple, No Surprises
                ═══════════════════════════════════════ */}
            <section className="landing-section pt-10 sm:pt-14" id="pricing">
                <div className="max-w-xl mx-auto">
                    <div className="landing-card p-8 sm:p-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/6 via-transparent to-emerald-500/4 pointer-events-none" />
                        <div className="relative">
                            <p className="text-brand-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-5">Pricing</p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                                Simple pricing. No surprises.
                            </h2>
                            <p className="text-[#9090a8] text-base mb-7 leading-relaxed">
                                Every feature. Unlimited proposals. Zero credit card.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500/8 border border-amber-500/12 text-amber-400 text-sm font-medium mb-8">
                                <Sparkles size={14} />
                                Pro at ₹999/mo · Early users lock in 50% off forever
                            </div>
                            <div>
                                <Link
                                    href="/signup"
                                    className="landing-cta-primary inline-flex"
                                    id="pricing-cta"
                                >
                                    Claim Early Access
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FAQ — Objection Handling
                ═══════════════════════════════════════ */}
            <section className="landing-section pt-10 sm:pt-14">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Common Questions
                    </h2>
                </div>
                <div className="max-w-2xl mx-auto">
                    <FAQSection />
                </div>
            </section>

            {/* ═══════════════════════════════════════
                🔥 FINAL CTA — The Closer
                "Stop chasing clients. Start closing them."
                ═══════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
                <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-700/15 via-[#14142a] to-brand-600/8" />
                    <div className="absolute inset-0 border border-brand-700/15 rounded-3xl" />
                    <div className="relative px-8 py-14 sm:px-16 sm:py-16 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 shadow-xl shadow-brand-700/25 mb-5 animate-float">
                            <LayoutTemplate size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Your next proposal is 60 seconds away.
                        </h2>
                        <p className="text-[#8888a0] max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                            Stop chasing clients. Start closing them.
                        </p>
                        <Link
                            href="/signup"
                            className="landing-cta-primary inline-flex"
                            id="final-cta"
                        >
                            Get Started
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FOOTER
                ═══════════════════════════════════════ */}
            <footer className="border-t border-[#1a1a2e] bg-[#08080d]/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <Link href="/" className="group">
                            <span className="brand-wordmark text-lg group-hover:opacity-80 transition-opacity">Kalvora</span>
                        </Link>

                        <div className="flex items-center gap-6 text-sm text-[#5a5a70]">
                            <Link href="/login" className="hover:text-brand-400 transition-colors">Login</Link>
                            <Link href="/public-feedback" className="hover:text-brand-400 transition-colors">Feedback</Link>
                        </div>

                        <p className="text-[#3a3a50] text-xs">
                            © 2026 <span className="brand-wordmark-inline text-[#5a5a70] text-xs">Kalvora</span> · Kalipr Labs
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}



/* ═══════════════════════════════════════
   FAQ — Accordion Component
   5 questions max — only objection-handlers.
   ═══════════════════════════════════════ */
const faqItems = [
    {
        q: 'Is it really free?',
        a: 'Yes. Every feature is free during early access. No credit card, no time limit, no catches. When we launch Pro, early users get 50% off forever.',
    },
    {
        q: 'Does it support GST invoices?',
        a: 'Yes. Add your GSTIN and Kalvora auto-generates invoices with CGST/SGST breakdown, HSN/SAC codes, bank details, and UPI - after every client approval.',
    },
    {
        q: 'Can I try it without signing up?',
        a: 'Absolutely. Click "Try demo" to create a sample proposal instantly. No account needed. Sign up only when you\'re ready to save and share with real clients. [Right now this feature is disabled]',
    },
    {
        q: 'What happens when the client approves?',
        a: 'The invoice is auto-generated with payment milestones (advance / mid-project / final). You get an email notification. The client gets a payment schedule.',
    },
    {
        q: 'Can I use my own branding?',
        a: 'Yes. Upload your studio logo, set your accent color, add your payment terms. Every proposal and invoice carries your brand - not ours.',
    },
];

function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {faqItems.map((item, i) => (
                <div key={i} className="landing-faq-item">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left group"
                        aria-expanded={openIndex === i}
                    >
                        <span className="text-white text-sm font-medium pr-4 group-hover:text-brand-300 transition-colors">
                            {item.q}
                        </span>
                        <ChevronDown
                            size={18}
                            className={`text-[#5a5a70] flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-brand-400' : ''
                                }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="px-5 sm:px-6 pb-4">
                            <p className="text-[#8888a0] text-sm leading-relaxed">{item.a}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
