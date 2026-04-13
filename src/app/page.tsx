'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import LandingNavbar from '@/components/LandingNavbar';
import {
    ArrowRight, ChevronDown, X, Check, CheckCircle2,
    Zap, Share2, Eye, FileText, Receipt, Clock,
    Sparkles, LayoutTemplate, Users, Briefcase,
    Home as HomeIcon, PenTool
} from 'lucide-react';

// ─────────────────────────────────────────
// LANDING PAGE — Product Hunt Style
// Design philosophy: Clarity > Cleverness
// Every section answers exactly ONE question.
// Total reading time: <90 seconds.
// ─────────────────────────────────────────

export default function LandingPage() {
    const { session } = useAuth();

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <LandingNavbar />

            {/* ═══════════════════════════════════════
                HERO — The 5-Second Test
                Q: "What is this and why should I care?"
                Framework: Pain → Promise → Proof → CTA
                ═══════════════════════════════════════ */}
            <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Ambient background — subtle depth, not distracting */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-[8%] left-[12%] w-[600px] h-[600px] rounded-full bg-brand-600/[0.06] blur-[150px]" />
                    <div className="absolute bottom-[5%] right-[8%] w-[450px] h-[450px] rounded-full bg-indigo-500/[0.04] blur-[130px]" />
                    {/* Top center glow to draw eye to headline */}
                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-brand-500/[0.05] blur-[100px]" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    {/* Social proof badge — top of page, builds instant trust */}
                    <div className="landing-proof-badge animate-fade-in">
                        <span className="landing-proof-dot" />
                        Free during Early Access — No credit card required
                    </div>

                    {/* Headline — 8 words total. Pain (line 1) + Promise (line 2).
                        The gradient on line 2 draws the eye to the positive outcome. */}
                    <h1 className="text-[36px] sm:text-[48px] lg:text-[64px] font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in">
                        <span className="text-white">Stop Sending Word Docs.</span>
                        <br />
                        <span className="landing-gradient-text">Send Proposals That Close.</span>
                    </h1>

                    {/* Subheadline — WHO + WHAT + HOW FAST.
                        This is the "elevator pitch" — if they read nothing else,
                        they know exactly what Kalvora does and who it's for. */}
                    <p className="text-[#9090a8] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
                        Kalvora creates branded proposals and auto-generates GST invoices
                        for interior designers — <span className="text-white font-medium">in 60 seconds.</span>
                    </p>

                    {/* CTA Pair — One dominant action, one escape hatch.
                        The primary CTA is "Try" not "Sign Up" — removes all friction.
                        Psychology: loss aversion ("No Signup" = nothing to lose). */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-in">
                        {session ? (
                            <Link href="/dashboard" className="landing-cta-primary">
                                Go to Dashboard
                                <ArrowRight size={20} />
                            </Link>
                        ) : (
                            <>
                                <Link href="/try" className="landing-cta-primary" id="hero-cta-primary">
                                    Try It Free — No Signup
                                    <ArrowRight size={20} />
                                </Link>
                                <Link href="/signup" className="landing-cta-ghost" id="hero-cta-secondary">
                                    Create Account
                                    <ArrowRight size={16} />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Trust strip — compressed proof points.
                        These are "checkbox" items that remove objections at a glance. */}
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[#5a5a70] text-xs sm:text-sm animate-fade-in">
                        <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400/60" /> INR + GST</span>
                        <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400/60" /> WhatsApp Sharing</span>
                        <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400/60" /> 6 Premium Templates</span>
                        <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400/60" /> Zero Setup</span>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                PROBLEM — The "Aha" Moment
                Q: "Do they understand MY problem?"
                One sentence that forces emotional recognition.
                If they've ever sent a Word doc proposal,
                this line hits them in the gut.
                ═══════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10">
                <div className="max-w-3xl mx-auto">
                    <div className="landing-problem-card">
                        <p className="text-white text-base sm:text-lg lg:text-xl font-semibold leading-relaxed text-center max-w-2xl">
                            &ldquo;You lose deals because your Word doc looks unprofessional
                            <span className="text-[#9090a8] font-normal"> — compared to what your client expects from a designer.&rdquo;</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                BEFORE / AFTER — Visual Contrast
                Q: "What changes if I use this?"
                Two-column layout with color-coded cards.
                Red = pain (current state). Green = gain (desired state).
                Psychology: contrast effect + loss aversion.
                ═══════════════════════════════════════ */}
            <>
                <section className="landing-section pt-10 sm:pt-14 pb-10 sm:pb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                        {/* Before — Red accent = danger/pain */}
                        <div className="landing-card p-6 sm:p-7 border-red-500/15 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500/50 to-red-400/10" />
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                    <X size={16} className="text-red-400" />
                                </div>
                                <h3 className="text-[15px] font-semibold text-red-400">Without Kalvora</h3>
                            </div>
                            <ul className="space-y-3.5 text-sm text-[#9090a8]">
                                {[
                                    'Word doc proposals sent over WhatsApp',
                                    'Manual Excel invoicing after every approval',
                                    'No idea if the client even opened it',
                                    'Chase payments with 10 follow-up messages',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <X size={14} className="text-red-400/40 mt-0.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* After — Green accent = success/gain */}
                        <div className="landing-card p-6 sm:p-7 border-emerald-500/15 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500/50 to-emerald-400/10" />
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                </div>
                                <h3 className="text-[15px] font-semibold text-emerald-400">With Kalvora</h3>
                            </div>
                            <ul className="space-y-3.5 text-sm text-[#9090a8]">
                                {[
                                    'Branded PDF proposal in 60 seconds',
                                    'Client approves online — invoice auto-created',
                                    'Know exactly when they view your proposal',
                                    'Payment milestones tracked automatically',
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
            </>

            {/* ═══════════════════════════════════════
                HOW IT WORKS — 3-Step Flow
                Q: "How hard is this to use?"
                Reduced to 3 steps (was 4) — simpler = more trustworthy.
                Each step is ONE sentence. No paragraphs.
                ═══════════════════════════════════════ */}
            <>
                <section className="landing-section pt-10 sm:pt-14">
                    <div className="text-center mb-12 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 max-w-4xl mx-auto relative">
                        {/* Connecting line — desktop only, shows flow left→right */}
                        <div className="hidden md:block absolute top-[44px] left-[20%] right-[20%] h-[2px] landing-step-line" />

                        {[
                            {
                                step: '1',
                                icon: FileText,
                                title: 'Fill Details',
                                desc: 'Client info, rooms, pricing — smart presets do the heavy lifting.'
                            },
                            {
                                step: '2',
                                icon: Share2,
                                title: 'Share Link',
                                desc: 'Send a branded proposal on WhatsApp. Track when they open it.'
                            },
                            {
                                step: '3',
                                icon: Receipt,
                                title: 'Get Paid',
                                desc: 'Client approves online. Invoice + payment milestones — instantly.'
                            },
                        ].map((item, i) => (
                            <div key={item.step} className="text-center relative px-4">
                                <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-[#14142a] border border-[#2a2a40] mb-5 relative z-10 transition-all duration-300 hover:border-brand-600/30 hover:bg-[#181836]">
                                    <item.icon size={26} className="text-brand-400" />
                                    <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-[12px] font-bold text-white shadow-lg shadow-brand-700/30">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-[#8888a0] text-sm max-w-[240px] mx-auto leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </>

            {/* ═══════════════════════════════════════
                WHY KALVORA — 3 Power Statements
                Q: "What can it actually do for me?"
                Not features — outcomes. Each card answers
                "so what?" with a specific, measurable claim.
                Color-coded icons for visual variety.
                ═══════════════════════════════════════ */}
            <>
                <section className="landing-section pt-10 sm:pt-14">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {[
                            {
                                icon: Zap,
                                statement: 'Branded PDF in 60 seconds.',
                                detail: '6 premium templates. Your logo, your colors. Clients see a professional — not a freelancer with a Word doc.',
                                accent: 'brand',
                            },
                            {
                                icon: Clock,
                                statement: 'Client approves. Invoice auto-created.',
                                detail: 'One-click approval via magic link. GST invoice with CGST/SGST, bank details, and UPI — generated instantly.',
                                accent: 'emerald',
                            },
                            {
                                icon: Eye,
                                statement: 'Know when they read it. Chase less.',
                                detail: 'Real-time view tracking. Your dashboard shows who opened, who approved, and who needs a nudge.',
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
                                <div key={i} className="landing-card p-7">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${a.bg} border ${a.border}`}>
                                        <item.icon size={20} className={a.text} />
                                    </div>
                                    <h3 className="text-[15px] font-semibold text-white mb-2.5 leading-snug">{item.statement}</h3>
                                    <p className="text-[#7a7a95] text-sm leading-relaxed">{item.detail}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </>

            {/* ═══════════════════════════════════════
                WHO IT'S FOR — Self-Identification
                Q: "Is this for someone like me?"
                4 personas with punchy, specific 1-liners.
                Psychology: people buy when they see themselves.
                ═══════════════════════════════════════ */}
            <>
                <section className="landing-section pt-10 sm:pt-14">
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                            Built for Your Studio
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { icon: PenTool, title: 'Freelance Designers', desc: 'Stop looking amateur with Word docs.' },
                            { icon: Briefcase, title: 'Small Studios', desc: 'Brand consistency in every proposal.' },
                            { icon: HomeIcon, title: 'Architects', desc: 'GST-compliant quotes, no Excel.' },
                            { icon: Users, title: 'Home Staging', desc: 'Close deals with instant approvals.' },
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
            </>

            {/* ═══════════════════════════════════════
                PRICING — Remove "How Much?" Anxiety
                Q: "Can I afford this?"
                Answer: It's free. No mystery, no "Contact Sales."
                The amber urgency badge creates FOMO without being sleazy.
                ═══════════════════════════════════════ */}
            <>
                <section className="landing-section pt-10 sm:pt-14" id="pricing">
                    <div className="max-w-xl mx-auto">
                        <div className="landing-card p-8 sm:p-10 text-center relative overflow-hidden">
                            {/* Subtle gradient overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-700/6 via-transparent to-emerald-500/4 pointer-events-none" />
                            <div className="relative">
                                <p className="text-brand-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-5">Pricing</p>
                                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Free. Right Now.</h2>
                                <p className="text-[#9090a8] text-base mb-7 leading-relaxed">
                                    Every feature. Unlimited proposals. Zero credit card.
                                </p>
                                {/* Urgency badge — amber = scarcity signal */}
                                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500/8 border border-amber-500/12 text-amber-400 text-sm font-medium mb-8">
                                    <Sparkles size={14} />
                                    Pro at ₹999/mo — Early users lock in 50% off forever
                                </div>
                                <div>
                                    <Link
                                        href={session ? '/dashboard' : '/signup'}
                                        className="landing-cta-primary inline-flex"
                                        id="pricing-cta"
                                    >
                                        {session ? 'Go to Dashboard' : 'Claim Early Access'}
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>

            {/* ═══════════════════════════════════════
                FAQ — Objection Handling, Not Education
                Q: "What's the catch?"
                Only questions that block purchase decisions.
                No "How do I reset my password?" — that's help docs.
                ═══════════════════════════════════════ */}
            <>
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
            </>

            {/* ═══════════════════════════════════════
                FINAL CTA — The Closer
                Q: "Should I do this now?"
                Last chance. One sentence. One button.
                The copy reframes the decision as inevitable,
                not optional: "Your next proposal IS 60 seconds away."
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
                            Join designers who closed projects faster — the moment they stopped sending Word docs.
                        </p>
                        <Link
                            href={session ? '/dashboard' : '/try'}
                            className="landing-cta-primary inline-flex"
                            id="final-cta"
                        >
                            Start Free — No Signup
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FOOTER — Minimal, Functional
                3 links. No walls of text. No social icons
                nobody clicks. Just what matters.
                ═══════════════════════════════════════ */}
            <footer className="border-t border-[#1a1a2e] bg-[#08080d]/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <Link href="/" className="group">
                            <span className="brand-wordmark text-lg group-hover:opacity-80 transition-opacity">Kalvora</span>
                        </Link>

                        <div className="flex items-center gap-6 text-sm text-[#5a5a70]">
                            <Link href="/try" className="hover:text-brand-400 transition-colors">Demo</Link>
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
   Smooth height animation via max-height trick.
   ═══════════════════════════════════════ */
const faqItems = [
    {
        q: 'Is it really free?',
        a: 'Yes. Every feature is free during early access. No credit card, no time limit, no catches. When we launch Pro, early users get 50% off forever.',
    },
    {
        q: 'Does it support GST invoices?',
        a: 'Yes. Add your GSTIN and Kalvora auto-generates invoices with CGST/SGST breakdown, HSN/SAC codes, bank details, and UPI — after every client approval.',
    },
    {
        q: 'Can I try it without signing up?',
        a: 'Absolutely. Click "Try It Free" to create a sample proposal instantly. No account needed. Sign up only when you\'re ready to save and share with real clients.',
    },
    {
        q: 'What happens when the client approves?',
        a: 'The invoice is auto-generated with payment milestones (advance / mid-project / final). You get an email notification. The client gets a payment schedule.',
    },
    {
        q: 'Can I use my own branding?',
        a: 'Yes. Upload your studio logo, set your accent color, add your payment terms. Every proposal and invoice carries your brand — not ours.',
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
