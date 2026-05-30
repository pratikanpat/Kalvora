'use client';

import { useState } from 'react';
import DemoVideoModal from '@/components/DemoVideoModal';
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
    BarChart3, Play
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
    const [showDemo, setShowDemo] = useState(false);

    // ── Loading state: prevent flash of wrong content ──
    if (loading) {
        return <LoadingSpinner text="" />;
    }

    // ── State B: Logged-in users see the Closing Engine ──
    if (session) {
        return (
            <div className="min-h-screen bg-[#F6F3EF] flex flex-col">
                <LandingNavbar />
                <div className="flex-1">
                    <LoggedInHome />
                </div>
                <footer className="border-t border-[#E4E1DB] bg-[#F1EFEA]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9A9A9A]">
                            <p>© 2026 <span className="brand-wordmark-inline text-[#9A9A9A] text-xs">Kalvora</span> — Built by <a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#6B6B6B] transition-colors">Kalipr Labs</a></p>
                            <div className="flex items-center gap-3">
                                <span>Privacy</span>
                                <span className="text-[#E4E1DB]">·</span>
                                <span>Terms</span>
                                <span className="text-[#E4E1DB]">·</span>
                                <a href="mailto:hello@kaliprlabs.in" className="hover:text-[#6B6B6B] transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    // ── State A: Sales Landing Page ──
    return (
        <div className="min-h-screen bg-[#F6F3EF] relative">


            <LandingNavbar />

            {/* ═══════════════════════════════════════
                HERO — Editorial Typography
                Playfair Display headline · Clean hierarchy
                ═══════════════════════════════════════ */}
            <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="relative max-w-4xl mx-auto text-center">
                    {/* Trust badge */}
                    <div className="landing-proof-badge animate-fade-in">
                        <span className="landing-proof-dot" />
                        Free during Early Access · No credit card required
                    </div>

                    {/* Editorial Headline — Playfair Display */}
                    <h1 className="hero-editorial-title text-[34px] sm:text-[48px] lg:text-[62px] mb-7 animate-fade-in">
                        <span>Stop Sending Proposals</span>
                        <br />
                        <span>on WhatsApp </span>
                        <span className="hero-italic-accent">Like It&apos;s 2012.</span>
                    </h1>

                    <p className="text-[#6F6A66] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-12 animate-fade-in leading-relaxed">
                        Create professional interior design proposals,{' '}
                        <span className="text-[#1E1E1E] font-semibold">send a simple link</span>,{' '}
                        <span className="text-[#1E1E1E] font-semibold">track views</span>, and{' '}
                        <span className="text-[#1E1E1E] font-semibold">get approvals</span>{' '}
                        - all in{' '}
                        <span className="text-[#1E1E1E] font-semibold">one place</span>.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-7 animate-fade-in">
                        <Link href="/signup" className="landing-cta-primary" id="hero-cta-primary">
                            Create Account
                            <ArrowRight size={20} />
                        </Link>
                        <button
                            onClick={() => setShowDemo(true)}
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium text-[#6F6A66] bg-transparent border border-[#D9D1C9] hover:border-[#C4BBB2] hover:text-[#3E2F2B] transition-all duration-200 cursor-pointer"
                            id="hero-cta-demo"
                        >
                            <Play size={16} className="fill-current" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Trust strip */}
                    <p className="text-[#6F6A66] text-xs sm:text-sm animate-fade-in">
                        Trusted by 100+ interior designers across India
                    </p>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                DASHBOARD SHOWCASE — The Product Shot
                macOS-style browser chrome · lightdash.png
                ═══════════════════════════════════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 -mt-2 sm:mt-0">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full bg-[#3E2F2B]/[0.05] blur-[120px]" />
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="dashboard-showcase animate-fade-in">
                        <div className="dashboard-showcase-inner">
                            {/* macOS-style browser chrome */}
                            <div className="dashboard-showcase-chrome">
                                {/* Traffic light dots */}
                                <div className="flex items-center gap-[7px]">
                                    <span className="w-[11px] h-[11px] rounded-full bg-[#FF5F57] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.12)]" />
                                    <span className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.12)]" />
                                    <span className="w-[11px] h-[11px] rounded-full bg-[#28C840] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.12)]" />
                                </div>

                                {/* URL bar */}
                                <div className="dashboard-showcase-url-bar">
                                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="flex-shrink-0 opacity-50">
                                        <path d="M5 0C2.79 0 1 1.79 1 4v2H0v6h10V6H9V4c0-2.21-1.79-4-4-4zm3 6v4H2V6h6zM3 4c0-1.1.9-2 2-2s2 .9 2 2v2H3V4z" fill="#78716C"/>
                                    </svg>
                                    <span className="text-[10px] sm:text-xs text-[#78716C] font-medium tracking-wide">
                                        kalvora.kaliprlabs.in/dashboard
                                    </span>
                                </div>

                                {/* Spacer to balance layout */}
                                <div className="w-[46px]" />
                            </div>

                            {/* Dashboard screenshot */}
                            <img
                                src="/lightdash.png"
                                alt="Kalvora Dashboard — manage proposals, track client views, and auto-generate invoices"
                                className="w-full h-auto block"
                                loading="eager"
                            />
                        </div>

                        {/* Bottom fade-out */}
                        <div className="dashboard-showcase-fade" />

                        {/* Subtle reflection underneath */}
                        <div className="dashboard-showcase-reflection" aria-hidden="true" />
                    </div>
                </div>
            </section>

            {/* ═══ Section Divider ═══ */}
            <div className="section-divider" />

            {/* ═══════════════════════════════════════
                😤 PAIN SECTION — Hook them emotionally
                "Your current process is costing you projects"
                ═══════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 pt-10 sm:pt-14">
                <div className="max-w-3xl mx-auto">
                    <div className="landing-problem-card">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-6 text-center">
                            Your current process is{' '}
                            <span className="text-[#B85C5C] font-bold">costing you projects</span>
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

            {/* ═══ Section Divider ═══ */}
            <div className="section-divider-wide" style={{ margin: '16px auto' }} />

            {/* ═══════════════════════════════════════
                ⚡ BEFORE / AFTER — Visual Contrast
                Rewritten content — specific, punchy
                ═══════════════════════════════════════ */}
            <section className="landing-section pt-10 sm:pt-14 pb-10 sm:pb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {/* Before */}
                    <div className="landing-card p-6 sm:p-7 border-[#B85C5C]/15 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#B85C5C]/50" />
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] flex items-center justify-center">
                                <X size={16} className="text-[#B85C5C]" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-[#B85C5C]">Before Kalvora</h3>
                        </div>
                        <ul className="space-y-3.5 text-sm text-[#6F6A66]">
                            {[
                                'Messy Word/Excel proposals',
                                'Endless WhatsApp follow-ups',
                                'No idea if client saw it',
                                'Manual invoices after every approval',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <X size={14} className="text-[#B85C5C]/40 mt-0.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* After */}
                    <div className="landing-card p-6 sm:p-7 border-[#EDF5F1] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#6A9C89]" />
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-[#EDF5F1] flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-[#6A9C89]" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-[#6A9C89]">After Kalvora</h3>
                        </div>
                        <ul className="space-y-3.5 text-sm text-[#6F6A66]">
                            {[
                                'Clean proposals in minutes',
                                'Share with one link',
                                'Know when client views',
                                'One-click approval + Invoice ready instantly',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <Check size={14} className="text-[#6A9C89]/60 mt-0.5 flex-shrink-0" />
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
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1E1E]">
                        Everything You Need to{' '}
                        <span className="text-[#3E2F2B]">Close Faster</span>
                    </h2>
                    <p className="text-[#6F6A66] text-sm mt-3 max-w-md mx-auto">
                        Six powerful features that{' '}
                        <span className="text-[#6F6A66] font-medium">simplify</span>{' '}your workflow
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {[
                        {
                            icon: Zap,
                            title: 'Create Proposals in Minutes',
                            desc: 'No formatting. No design work. Just fill details and generate a clean, client-ready proposal instantly.',
                            accent: 'brand' as const,
                        },
                        {
                            icon: Share2,
                            title: 'Share Instantly on WhatsApp',
                            desc: 'Send a simple link your client can open anywhere - no bulky files, no confusion.',
                            accent: 'success' as const,
                        },
                        {
                            icon: Edit3,
                            title: 'Edit Without the Headache',
                            desc: 'Update pricing or details anytime without recreating the whole proposal.',
                            accent: 'amber' as const,
                        },
                        {
                            icon: FolderOpen,
                            title: 'All Your Proposals, One Place',
                            desc: 'Every past proposal is saved and easy to access whenever you need it.',
                            accent: 'brand' as const,
                        },
                        {
                            icon: Receipt,
                            title: 'Auto Invoice Generator',
                            desc: 'Once your client approves, your invoice is ready. No extra steps.',
                            accent: 'success' as const,
                        },
                        {
                            icon: BarChart3,
                            title: 'Track Every Project',
                            desc: 'See exactly where each client stands: Draft → Sent → Viewed → Approved → Paid → Completed.',
                            accent: 'amber' as const,
                        },
                    ].map((item, i) => {
                        const accentMap = {
                            brand: { bg: 'bg-[#3E2F2B]/12', border: 'border-[#3E2F2B]/20', text: 'text-[#3E2F2B]' },
                            success: { bg: 'bg-[#EDF5F1]', border: 'border-[#D0E5DA]', text: 'text-[#6A9C89]' },
                            amber: { bg: 'bg-[#F0EBE6]', border: 'border-[#D9D1C9]', text: 'text-[#C47A5A]' },
                        };
                        const a = accentMap[item.accent];
                        return (
                            <div key={i} className="feature-benefit-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${a.bg} border ${a.border}`}>
                                    <item.icon size={20} className={a.text} />
                                </div>
                                <h3 className="text-[15px] font-semibold text-[#1E1E1E] mb-2.5 leading-snug">{item.title}</h3>
                                <p className="text-[#6F6A66] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════
                🎯 POWER FEATURE — USP Spotlight
                "Client Viewed" is the killer feature
                ═══════════════════════════════════════ */}
            {/* ═══ Section Divider ═══ */}
            <div className="section-divider" />

            <section className="landing-section pt-10 sm:pt-14">
                <div className="max-w-3xl mx-auto">
                    <div className="power-feature-section text-center">
                        <div className="relative z-10">
                            <div className="power-feature-icon-ring mx-auto mb-6">
                                <Eye size={36} className="text-[#3E2F2B]" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-4">
                                Finally…{' '}
                                <span className="hero-italic-accent">Know When</span> Your Client{' '}
                                <span className="text-[#3E2F2B] font-bold">Sees Your Proposal</span>
                            </h2>
                            <p className="text-[#6F6A66] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-6">
                                No more guessing. No more awkward follow-ups.
                                <br />
                                Get clarity on when to follow up - and close faster.
                            </p>
                            {/* Mock notification */}
                            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#3E2F2B]/10 border border-[#3E2F2B]/15 ">
                                <Eye size={16} className="text-[#3E2F2B]" />
                                <span className="text-[#1E1E1E] text-sm font-medium">Rahul just viewed your proposal</span>
                                <span className="text-[#3E2F2B] text-xs">2m ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                🧑‍🎨 WHO IT'S FOR — Self-Identification
                Simplified list
                ═══════════════════════════════════════ */}
            {/* ═══ Section Divider ═══ */}
            <div className="section-divider-wide" style={{ margin: '0 auto' }} />

            <section className="landing-section pt-10 sm:pt-14">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1E1E]">
                        Built for{' '}
                        <span className="text-[#C47A5A]">Your</span>{' '}Studio
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
                            <div className="w-10 h-10 rounded-xl bg-[#3E2F2B]/10 border border-[#3E2F2B]/15 flex items-center justify-center mb-3">
                                <item.icon size={18} className="text-[#3E2F2B]" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#1E1E1E] mb-1">{item.title}</h3>
                            <p className="text-[#6F6A66] text-xs leading-relaxed">{item.desc}</p>
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
                        <div className="absolute inset-0 bg-[#F0EBE6]/30 pointer-events-none" />
                        <div className="relative">
                            <p className="text-[#3E2F2B] text-[10px] font-bold uppercase tracking-[0.25em] mb-5">Pricing</p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1E1E] mb-3">
                                <span className="hero-italic-accent">Simple</span> pricing.{' '}
                                <span className="text-[#3E2F2B] font-bold">No surprises.</span>
                            </h2>
                            <p className="text-[#6F6A66] text-base mb-7 leading-relaxed">
                                Every feature. Unlimited proposals. Zero credit card.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#C47A5A]/8 border border-[#C47A5A]/12 text-[#C47A5A] text-sm font-medium mb-8">
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
                        Common{' '}
                        <span className="text-[#C47A5A]">Questions</span>
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
                    <div className="absolute inset-0 bg-[#F0EBE6]" />
                    <div className="absolute inset-0 border border-[#3E2F2B]/15 rounded-3xl" />
                    <div className="relative px-8 py-14 sm:px-16 sm:py-16 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3E2F2B] mb-5">
                            <LayoutTemplate size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-3">
                            Your next proposal is{' '}
                            <span className="text-[#3E2F2B] font-bold">60 seconds</span> away.
                        </h2>
                        <p className="text-[#6F6A66] max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
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
                FOOTER — Premium Marketing Footer
                ═══════════════════════════════════════ */}
            <footer className="border-t border-[#E4E1DB] bg-[#F1EFEA]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

                    {/* Section 1 + 2: Brand + Link Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-10">

                        {/* Brand Strip */}
                        <div className="md:col-span-5">
                            <Link href="/" className="group inline-block">
                                <span className="brand-wordmark text-lg group-hover:opacity-80 transition-opacity">Kalvora</span>
                            </Link>
                            <p className="text-[#6B6B6B] text-sm mt-2.5 leading-relaxed max-w-xs">
                                Professional proposals for interior designers. Create, send, track, get paid.
                            </p>
                        </div>

                        {/* Link Columns */}
                        <div className="md:col-span-7 grid grid-cols-3 gap-6">
                            {/* Product */}
                            <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1E1E1E] mb-4">Product</h4>
                                <ul className="space-y-2.5">
                                    <li><Link href="/#pricing" className="text-[#6B6B6B] text-sm hover:text-[#1E1E1E] transition-colors">Features</Link></li>
                                    <li><Link href="/#pricing" className="text-[#6B6B6B] text-sm hover:text-[#1E1E1E] transition-colors">Pricing</Link></li>
                                    {/* <li><Link href="/try" className="text-[#6B6B6B] text-sm hover:text-[#1E1E1E] transition-colors">Try Demo</Link></li> */}
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1E1E1E] mb-4">Company</h4>
                                <ul className="space-y-2.5">
                                    <li><a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="text-[#6B6B6B] text-sm hover:text-[#1E1E1E] transition-colors">Kalipr Labs</a></li>
                                    <li><a href="https://pratik.kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="text-[#6B6B6B] text-sm hover:text-[#1E1E1E] transition-colors">Founder</a></li>
                                    <li><Link href="/public-feedback" className="text-[#6B6B6B] text-sm hover:text-[#1E1E1E] transition-colors">Feedback</Link></li>
                                    <li><a href="mailto:hello@kaliprlabs.in" className="text-[#6B6B6B] text-sm hover:text-[#1E1E1E] transition-colors">Contact</a></li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1E1E1E] mb-4">Legal</h4>
                                <ul className="space-y-2.5">
                                    <li><span className="text-[#6B6B6B] text-sm cursor-default">Privacy Policy</span></li>
                                    <li><span className="text-[#6B6B6B] text-sm cursor-default">Terms of Service</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Bottom Trust Strip */}
                    <div className="border-t border-[#E4E1DB] pt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9A9A9A]">
                            <p>© 2026 <span className="brand-wordmark-inline text-[#9A9A9A] text-xs">Kalvora</span> — Built by <a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#6B6B6B] transition-colors">Kalipr Labs</a> · Founded by <a href="https://pratik.kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#6B6B6B] transition-colors">Pratik Anpat</a></p>
                            <div className="flex items-center gap-3">
                                <span>Privacy</span>
                                <span className="text-[#E4E1DB]">·</span>
                                <span>Terms</span>
                                <span className="text-[#E4E1DB]">·</span>
                                <a href="mailto:hello@kaliprlabs.in" className="hover:text-[#6B6B6B] transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Demo Video Modal */}
            <DemoVideoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
        </div>
    );
}



/* ═══════════════════════════════════════
   FAQ — Accordion Component
   5 questions max — only objection-handlers.
   ═══════════════════════════════════════ */
const faqItems = [
    {
        q: 'Can I generate GST invoices with Kalvora?',
        a: 'Yes. Add your GSTIN and Kalvora auto-generates invoices with CGST/SGST breakdown, HSN/SAC codes, bank details, and UPI - the moment your client approves the proposal.',
    },
    {
        q: 'Is Kalvora built for Indian interior designers?',
        a: 'Yes. Kalvora is purpose-built for interior designers in India. Pricing is in INR, GST invoicing is built-in, and proposals are designed for the Indian market. 100+ designers across India already use it.',
    },
    {
        q: 'How does the proposal approval process work?',
        a: 'You create a proposal, share a link with your client (WhatsApp, email, anywhere). The client can view it, leave comments, and approve it with one click. Once approved, an invoice is auto-generated.',
    },
    {
        q: 'Can I add my logo and branding to proposals?',
        a: 'Yes. Upload your studio logo, set your accent color, add your payment terms. Every proposal and invoice carries your brand - not ours.',
    },
    {
        q: 'What does Kalvora cost?',
        a: 'Every feature is free during early access. No credit card, no time limit. When we launch Pro, early users get 50% off forever. Pro will be priced at ₹999/month.',
    },
    {
        q: 'Is it really free?',
        a: 'Yes. Every feature is free during early access. No credit card, no time limit, no catches.',
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
                        <span className="text-[#1E1E1E] text-sm font-medium pr-4 group-hover:text-[#2F2421] transition-colors">
                            {item.q}
                        </span>
                        <ChevronDown
                            size={18}
                            className={`text-[#78716C] flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-[#3E2F2B]' : ''
                                }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-colors duration-300 ease-in-out ${openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="px-5 sm:px-6 pb-4">
                            <p className="text-[#6F6A66] text-sm leading-relaxed">{item.a}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
