'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import DemoVideoModal from '@/components/DemoVideoModal';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import LandingNavbar from '@/components/LandingNavbar';
import LoggedInHome from '@/components/LoggedInHome';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomSelect, { SelectOption } from '@/components/CustomSelect';
import {
    ArrowRight, ChevronDown, Check,
    Eye, FileText,
    Sparkles, Layers, Send, CheckCircle2,
    X, ExternalLink, Star
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// LANDING PAGE - Auth-State-Aware Entry Point
// ─────────────────────────────────────────────────────────

function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('active'); obs.disconnect(); } },
            { threshold: 0.10 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return ref;
}

export default function LandingPage() {
    const { session, loading } = useAuth();
    const [showDemo, setShowDemo] = useState(false);

    if (loading) return <LoadingSpinner text="" />;

    if (session) {
        return (
            <div className="min-h-screen bg-[#F6F3EF] flex flex-col">
                <LandingNavbar />
                <div className="flex-1"><LoggedInHome /></div>
                <footer className="border-t border-[#E4E1DB] bg-[#F1EFEA]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9A9A9A]">
                            <p>&copy; 2026 <span className="brand-wordmark-inline text-[#9A9A9A] text-xs">Kalvora</span> &mdash; Product of <a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#6B6B6B] transition-colors">Kalipr Labs</a></p>
                            <div className="flex items-center gap-3">
                                <span>Privacy</span><span className="text-[#E4E1DB]">&middot;</span>
                                <span>Terms</span><span className="text-[#E4E1DB]">&middot;</span>
                                <a href="mailto:hello@kaliprlabs.in" className="hover:text-[#6B6B6B] transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen lp-font-ui" style={{ background: 'var(--lp-canvas)', color: 'var(--lp-text)' }}>
            <LandingNavbar />
            <HeroSection />
            <PainContrastSection />
            <LifecycleSection />
            <TemplateShowroom />
            <SocialProofSection />
            <TryoutGateway />
            <FAQSection />
            <StudioContactForm />
            <DarkFooter />
            <DemoVideoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 1 - HERO ARCHITECTURE
// ═══════════════════════════════════════════════════════

// FIX 1: Updated names (Gargi → Namita, Tejas → Client)
const heroMessages = [
    'Design Pitch sent to client via magic link',
    'Client opened proposal link (Just Now)',
    'Client is adding line-item comments...',
    'Design Pitch Approved! 50% Studio Advance Invoice Ready ✓',
];

function HeroSection() {
    const [pulseIdx, setPulseIdx] = useState(0);
    const [fading, setFading] = useState(false);

    // FIX 1: Continuous looping — restarts from 0 after reaching end
    useEffect(() => {
        let idx = 0;
        const delays = [2800, 2800, 2800, 3200];

        function scheduleNext() {
            const delay = delays[idx % delays.length];
            const timer = setTimeout(() => {
                const next = (idx + 1) % heroMessages.length;
                setFading(true);
                setTimeout(() => { setPulseIdx(next); setFading(false); idx = next; scheduleNext(); }, 320);
            }, delay);
            return timer;
        }

        const t = scheduleNext();
        return () => clearTimeout(t);
    }, []);

    const isApproved = pulseIdx === 3;
    const dotColors = ['#A8A29E', '#D97706', '#D97706', '#556B2F'];
    const dotIsAmber = pulseIdx === 1 || pulseIdx === 2;
    const dotIsOlive = pulseIdx === 3;

    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(197,168,128,0.07) 0%, transparent 70%)' }} />
            </div>

            <div className="relative max-w-4xl mx-auto text-center space-y-8">
                <div className="lp-animate-entry mx-auto w-fit flex items-center gap-3 px-5 py-2.5 border-l-2 rounded-sm"
                    style={{ borderLeftColor: 'var(--lp-terracotta)', background: 'rgba(200,122,83,0.06)' }}>
                    <span className="font-mono font-bold text-[11px] uppercase tracking-widest"
                        style={{ color: 'var(--lp-terracotta)' }}>✦ VOL. 14</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest"
                        style={{ color: 'var(--lp-text-subtle)' }}>//&nbsp;SPECIFICATION ENGINE</span>
                    <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest"
                        style={{ color: 'var(--lp-text-subtle)' }}>&mdash;&nbsp;Built for Premium Practices</span>
                </div>

                {/* FIX 4: Updated headline copy with designer vocabulary */}
                <h1 className="lp-animate-entry lp-delay-1 lp-font-display text-[38px] sm:text-[58px] lg:text-[70px] font-light leading-[1.08] tracking-tight"
                    style={{ color: 'var(--lp-text)' }}>
                    Stop Sending Design Pitches<br />
                    on WhatsApp{' '}
                    <span className="font-normal italic" style={{ color: '#C5A880' }}>Like It&apos;s 2012.</span>
                </h1>

                {/* FIX 4: Emotional hook copy */}
                <p className="lp-animate-entry lp-delay-2 lp-hero-subtitle text-base sm:text-lg leading-relaxed font-light"
                    style={{ color: 'var(--lp-text-muted)' }}>
                    You spend weeks perfecting a material selection palette. Don&apos;t ruin the experience
                    by sending a messy price breakdown over WhatsApp. Present your studio fees
                    clearly &mdash; so clients feel confident authorising your advance.
                </p>

                <div className="lp-animate-entry lp-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Link href="/signup" className="lp-btn-primary group">
                        Start Your Studio Pipeline
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/try" className="lp-btn-ghost">
                        Preview a Design Pitch
                    </Link>
                </div>

                <p className="lp-animate-entry lp-delay-4 text-xs" style={{ color: 'var(--lp-text-subtle)' }}>
                    Free during Early Access &middot; No credit card required &middot; Trusted by 100+ design studios across India
                </p>

                {/* Activity widget — continuous loop */}
                <div className="lp-animate-entry lp-delay-5 pt-6 max-w-2xl mx-auto">
                    <div className="lp-activity-widget">
                        <div className="lp-activity-widget-bar" />
                        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl border transition-all duration-500 ${isApproved ? 'bg-green-50 border-green-200' : 'border-[#E8DDD0]'}`}
                                    style={!isApproved ? { background: 'var(--lp-gold-bg)' } : {}}>
                                    <Layers size={20}
                                        className={`transition-colors duration-500 ${isApproved ? 'text-green-600' : 'text-[#C5A880]'}`}
                                        style={{ animation: 'spin 6s linear infinite' }}
                                    />
                                </div>
                                <div>
                                    <span className="block text-[9px] font-mono font-bold tracking-widest uppercase mb-1 flex items-center gap-2"
                                        style={{ color: 'var(--lp-text-subtle)' }}>
                                        <span className="inline-block w-2 h-2 rounded-full shrink-0"
                                            style={{
                                                background: dotColors[pulseIdx],
                                                animation: dotIsAmber ? 'pulse 1s ease-in-out infinite' : dotIsOlive ? 'lp-pulse-glow 1.8s ease-in-out infinite' : 'none',
                                            }} />
                                        Studio Pipeline Activity
                                    </span>
                                    <p className={`text-sm font-semibold transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'} ${isApproved ? 'text-green-700' : ''}`}
                                        style={!isApproved ? { color: 'var(--lp-text)', transition: 'opacity 300ms ease, transform 300ms ease', transform: fading ? 'translateY(4px)' : 'translateY(0)' } : {}}>
                                        {heroMessages[pulseIdx]}
                                    </p>
                                </div>
                            </div>
                            {/* FIX 1: Namita Sharma */}
                            <div className="text-right font-mono text-[10px] px-3 py-1.5 rounded-lg border shrink-0"
                                style={{ color: 'var(--lp-text-subtle)', background: '#F5F3F0', borderColor: 'var(--lp-stone-border)' }}>
                                KV-8721 // Namita Sharma
                            </div>
                        </div>
                        <div className="hidden sm:flex px-5 sm:px-6 pb-4 items-center gap-2 border-t" style={{ borderColor: 'var(--lp-stone-border)' }}>
                            <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: 'var(--lp-text-subtle)' }}>Status</span>
                            <span className="text-[9px] font-mono font-bold" style={{ color: isApproved ? '#556B2F' : '#D97706' }}>
                                {isApproved ? 'ADVANCE COLLECTED' : pulseIdx === 0 ? 'PITCH SENT' : pulseIdx === 1 ? 'CLIENT VIEWING' : 'IN DISCUSSION'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 2 - RE-FRAMING OPERATIONAL PAIN
// ═══════════════════════════════════════════════════════
const beforeItems = [
    'Manually formatting spacing in Excel rate cards',
    'Sending full PDF BOQs over WhatsApp group chats',
    'Following up repeatedly to see if a quote was opened',
    'Calculating GST milestone breakdowns by hand',
];
const afterItems = [
    'Guided spatial program forms built for room layouts',
    'Fast, responsive design pitch links (/p/KV-xxx)',
    'Instant alerts the second a client views your pitch',
    'Auto-generated GST invoices with UPI payment links',
];

function PainContrastSection() {
    const headingRef = useScrollReveal();
    const bentoRef = useScrollReveal();

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-5xl mx-auto">
            <div ref={headingRef} className="reveal-on-scroll text-center mb-14">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono mb-3 block" style={{ color: 'var(--lp-gold)' }}>
                    The Real Cost of Chaos
                </span>
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    Your current process is{' '}
                    <span className="italic" style={{ color: '#C5A880' }}>costing you projects</span>
                </h2>
            </div>

            <div ref={bentoRef} className="reveal-on-scroll lp-pain-bento grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="lp-contrast-col lp-contrast-col-before" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <div className="lp-contrast-col-bar" style={{ background: '#E57373' }} />
                    <div className="p-6 sm:p-7">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2' }}>
                                <X size={15} className="text-red-500" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#B91C1C' }}>The Fragmented Studio</h3>
                        </div>
                        <div className="space-y-1">
                            {beforeItems.map((item, i) => (
                                <div key={i} className="lp-contrast-row" style={{ color: 'var(--lp-text-muted)' }}>
                                    <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-[13.5px]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lp-contrast-col lp-contrast-col-after" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <div className="lp-contrast-col-bar" style={{ background: '#4ADE80' }} />
                    <div className="p-6 sm:p-7">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F0FDF4' }}>
                                <Check size={15} style={{ color: '#15803D' }} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#15803D' }}>The Structured Pipeline</h3>
                        </div>
                        <div className="space-y-1">
                            {afterItems.map((item, i) => (
                                <div key={i} className="lp-contrast-row" style={{ color: 'var(--lp-text-muted)' }}>
                                    <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                    <span className="text-[13.5px]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 3A - 6-STEP PIPELINE TRACKER
// ═══════════════════════════════════════════════════════
interface TrackerStep {
    tag: string;
    tagStyle: React.CSSProperties;
    label: string;
    headline: string;
    body: string;
    terminal: { key: string; val: string; green?: boolean }[];
}

const trackerSteps: TrackerStep[] = [
    {
        tag: 'DRAFT',
        tagStyle: { background: '#F7F5F2', color: '#78716C', border: '1px solid #E4E0DB' },
        label: 'Draft',
        headline: 'The spatial program begins as a guided spec sheet.',
        body: 'Fill in client design briefs, carpet areas, and room configurations. The 8-section guided form is built around real interior design workflows — not generic invoice templates.',
        terminal: [
            { key: 'pitch_status', val: '"SPATIAL_DRAFT"' },
            { key: 'client_ref', val: '"Namita Sharma — Residential Suite"' },
            { key: 'carpet_area_sqft', val: '2400' },
            { key: 'program_sections_complete', val: '0 / 8' },
        ],
    },
    {
        tag: 'SENT',
        tagStyle: { background: '#FEF3E2', color: '#C08A5D', border: '1px solid #F5DFC0' },
        label: 'Sent',
        headline: 'Share a single magic link. No attachments, no PDFs.',
        body: 'The design pitch compiles into a lightweight, mobile-first presentation page at /p/KV-xxxxx. Send it via WhatsApp, email, or any channel your client prefers — it loads instantly on mobile.',
        terminal: [
            { key: 'pitch_link', val: '"kaliprlabs.in/p/KV-89271"' },
            { key: 'delivery_status', val: '"PITCH_SENT"', green: true },
            { key: 'link_encrypted', val: 'true' },
            { key: 'delivery_channel', val: '"WhatsApp + Email"' },
        ],
    },
    {
        tag: 'VIEWED',
        tagStyle: { background: '#FEF3E2', color: '#D97706', border: '1px solid #FDE68A' },
        label: 'Viewed',
        headline: 'Know the exact second your client reviews your pitch.',
        body: 'The platform logs every client view event in real time. Your dashboard flips from Sent to Viewed the moment they open the link — giving you a precise window to follow up while engagement is highest.',
        terminal: [
            { key: 'event', val: '"CLIENT_VIEW_LOGGED"', green: true },
            { key: 'timestamp_utc', val: `"${new Date().toISOString()}"` },
            { key: 'pipeline_status', val: '"PITCH_SENT \u2192 CLIENT_VIEWING"', green: true },
            { key: 'webhook', val: '"Resend API \u2192 studio@email.in"' },
        ],
    },
    {
        tag: 'FEEDBACK',
        tagStyle: { background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE' },
        label: 'Feedback',
        headline: 'Clients annotate line items directly — no back and forth.',
        body: 'Clients drop comments on specific scope items, quantities, or service inclusions without leaving the pitch view. All notes are captured structurally inside your project record.',
        terminal: [
            { key: 'comment_thread', val: '"Line 3 — Lighting Schema"' },
            { key: 'client_note', val: '"Can we add smart lighting nodes?"' },
            { key: 'interaction_count', val: '3' },
            { key: 'mep_schematics_reviewed', val: 'true', green: true },
        ],
    },
    {
        tag: 'APPROVED',
        tagStyle: { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
        label: 'Approved',
        headline: 'One-click sign-off. Pricing locked. Advance milestone created.',
        body: 'The client approves the design pitch directly on the page. The platform immediately locks the spatial program, generates a GST-ready invoice, and creates the first advance payment link.',
        terminal: [
            { key: 'approval_status', val: '"SPATIAL_PROGRAM_APPROVED"', green: true },
            { key: 'project_total_inr', val: '\u20B98,00,000.00' },
            { key: 'procurement_ledger', val: '"GST_18_Itemized_Calculations"' },
            { key: 'billing_pipeline_state', val: '"50_PERCENT_DEPOSIT_AWAITING"', green: true },
        ],
    },
    {
        tag: 'PAID',
        tagStyle: { background: '#F0FDF4', color: '#556B2F', border: '1px solid #A3E635' },
        label: 'Paid',
        headline: 'Studio advance collected. Execution begins. Full audit trail saved.',
        body: 'Once the advance milestone is paid, the full project record — spatial program, approvals, invoices, and payment receipts — is archived in one place. Your studio stays protected and organised.',
        terminal: [
            { key: 'invoice_status', val: '"STUDIO_ADVANCE_PAID"', green: true },
            { key: 'billing_pipeline_state', val: '"50_PERCENT_DEPOSIT_COLLECTED"', green: true },
            { key: 'gstin_applied', val: 'true' },
            { key: 'project_phase', val: '"SITE_EXECUTION_STARTED"', green: true },
        ],
    },
];

function PipelineTracker() {
    const [activeNode, setActiveNode] = useState(1);
    const step = trackerSteps[activeNode];
    const progressPct = activeNode === 0 ? 0 : (activeNode / (trackerSteps.length - 1)) * 100;

    return (
        <div className="mb-20">
            <div className="text-center mb-12 space-y-3">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-olive)' }}>
                    Studio Workflow Interface
                </span>
                {/* FIX 4: Updated section header vocabulary */}
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    From Initial Brief to Site Handover:{' '}
                    <span className="italic" style={{ color: '#C5A880' }}>The Studio Pipeline.</span>
                </h2>
                <p className="text-sm font-light max-w-2xl mx-auto" style={{ color: 'var(--lp-text-muted)' }}>
                    Click each stage to see exactly what Kalvora handles for your studio.
                </p>
            </div>

            {/* Tracker bar + nodes */}
            <div className="relative mb-2" style={{ paddingTop: '28px' }}>
                <div className="flex mb-3">
                    {trackerSteps.map((s, idx) => (
                        <button key={idx} className="lp-tracker-node" onClick={() => setActiveNode(idx)} aria-label={`Stage: ${s.label}`}>
                            <span className="lp-tracker-label" style={{
                                color: idx <= activeNode ? 'var(--lp-text)' : 'var(--lp-text-subtle)',
                                fontWeight: idx === activeNode ? 800 : 700,
                            }}>
                                {s.label}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="lp-tracker-bar flex-1 mx-5">
                    <div className="lp-tracker-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="absolute inset-x-5 flex items-center" style={{ top: '28px + 20px', bottom: 0 }}>
                    <div className="w-full flex items-center" style={{ marginTop: '-1px' }}>
                        {trackerSteps.map((_, idx) => {
                            const dotClass = idx < activeNode ? 'lp-tracker-dot-complete' : idx === activeNode ? 'lp-tracker-dot-active' : 'lp-tracker-dot-future';
                            return (
                                <button key={idx} className="lp-tracker-node" onClick={() => setActiveNode(idx)} style={{ padding: 0 }}>
                                    <span className={`lp-tracker-dot ${dotClass}`} style={{ marginTop: 0 }} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <p className="sm:hidden text-center text-xs mt-4 mb-2" style={{ color: 'var(--lp-text-subtle)' }}>
                Stage {activeNode + 1} of {trackerSteps.length} &mdash; {trackerSteps[activeNode].label}
            </p>

            <div key={activeNode} className="lp-tracker-card lp-tracker-card-anim mt-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="flex-1 space-y-4">
                        <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full" style={step.tagStyle}>
                            {step.tag}
                        </span>
                        <h3 className="lp-font-display text-xl sm:text-2xl font-light leading-snug" style={{ color: 'var(--lp-text)' }}>
                            {step.headline}
                        </h3>
                        <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--lp-text-muted)' }}>
                            {step.body}
                        </p>
                    </div>
                    <div className="sm:w-[300px] shrink-0">
                        <div className="lp-terminal">
                            <div className="lp-terminal-header">
                                &#11035; STUDIO ENGINE &nbsp;&middot;&nbsp; STAGE {activeNode + 1} / {trackerSteps.length}
                            </div>
                            {step.terminal.map((line, i) => (
                                <div key={i}>
                                    <span className="lp-terminal-dim">{'>'} </span>
                                    <span className="lp-terminal-key">{line.key}</span>
                                    <span className="lp-terminal-dim">: </span>
                                    <span className={(line as {key:string;val:string;green?:boolean}).green ? 'lp-terminal-green' : 'lp-terminal-val'}>{line.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-5 border-t" style={{ borderColor: 'var(--lp-stone-border)' }}>
                    <button onClick={() => setActiveNode(Math.max(0, activeNode - 1))} disabled={activeNode === 0}
                        className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all"
                        style={{ borderColor: activeNode === 0 ? 'var(--lp-sand)' : 'var(--lp-stone-border)', color: activeNode === 0 ? 'var(--lp-text-subtle)' : 'var(--lp-text-muted)', background: 'transparent' }}>
                        &larr; Prev
                    </button>
                    <div className="flex gap-1.5">
                        {trackerSteps.map((_, idx) => (
                            <button key={idx} onClick={() => setActiveNode(idx)} className="rounded-full transition-all"
                                style={{ width: idx === activeNode ? '20px' : '6px', height: '6px', background: idx === activeNode ? '#1A1512' : idx < activeNode ? '#556B2F' : '#EFEBE4' }}
                                aria-label={`Go to stage ${idx + 1}`} />
                        ))}
                    </div>
                    <button onClick={() => setActiveNode(Math.min(trackerSteps.length - 1, activeNode + 1))} disabled={activeNode === trackerSteps.length - 1}
                        className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all"
                        style={{ borderColor: activeNode === trackerSteps.length - 1 ? 'var(--lp-sand)' : 'var(--lp-stone-border)', color: activeNode === trackerSteps.length - 1 ? 'var(--lp-text-subtle)' : 'var(--lp-text-muted)', background: 'transparent' }}>
                        Next &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 3 - THE LIFECYCLE INTERACTION
// ═══════════════════════════════════════════════════════

// FIX 4: Updated tab titles + body copy with designer vocabulary
const pipelineSteps = [
    {
        title: '1. The Digital Space Program',
        tag: 'BILL OF QUANTITIES',
        icon: FileText,
        heading: 'A guided architectural spec sheet built for real room layouts.',
        desc: 'Input client design briefs, carpet areas, and custom mood board directions. Toggle precise line items like 3D photorealistic renders, MEP electrical schemas, and custom loose furniture layouts — without breaking an Excel cell formula.',
        terminal: [
            { key: 'active_space_program', val: '["Master Suite Layout", "Modular Kitchen Layout"]' },
            { key: 'carpet_area_sqft', val: '2400' },
            { key: 'mood_board_ref', val: '"Client Brief v3 — Japandi Minimal"' },
            { key: 'active_service_hooks', val: '["3D_Renders", "MEP_Electrical_Schema"]' },
        ],
    },
    {
        title: '2. The Design Pitch Link',
        tag: 'CLIENT DELIVERY',
        icon: Send,
        heading: 'Ditch heavy PDFs. Share your design pitch via one elegant link.',
        body: '',
        desc: 'Compile your spatial program and BOQ into short tracking links (/p/KV-xxxxx). These optimised presentation sheets are lightweight, responsive, and load instantly on a client\'s mobile over WhatsApp.',
        terminal: [
            { key: 'pitch_token', val: '"KV-89271-DESIGN-PITCH"' },
            { key: 'redirect_mask_path', val: '"/view/pitch_id_secure"' },
            { key: 'encrypted_short_route', val: '"kaliprlabs.in/p/KV-89271"' },
            { key: 'pitch_status', val: '"ACTIVE"' },
        ],
    },
    {
        title: '3. Real-Time Client Tracking',
        tag: 'ENGAGEMENT',
        icon: Eye,
        heading: 'Know the exact second a client reviews your design pitch.',
        desc: 'Receive instant project dashboard notifications the moment a client opens their link. This precise insight lets you call at the right time, resolve spatial queries, and close the brief while engagement is highest.',
        terminal: [
            { key: 'event_type', val: '"CLIENT_VIEW_LOGGED"', green: true },
            { key: 'timestamp_utc', val: '"2026-11-07T20:14:33Z"' },
            { key: 'webhook_dispatch', val: '"Resend API \u2192 studio@email.in"' },
            { key: 'pipeline_status_update', val: '"PITCH_SENT \u2192 CLIENT_VIEWING"', green: true },
        ],
    },
    {
        title: '4. Studio Advance Checkout',
        tag: 'CASH FLOW',
        icon: CheckCircle2,
        heading: 'Frictionless sign-offs that launch your advance milestone automatically.',
        desc: 'Clients review design fees, add specific scope notes, and authorise the pitch instantly. Once approved, the platform locks the spatial program, generates a GST invoice, and creates your advance payment link.',
        terminal: [
            { key: 'procurement_ledger', val: '"GST_18_Itemized_Calculations"' },
            { key: 'project_total_inr', val: '\u20B98,00,000.00' },
            { key: 'studio_advance_50pct', val: '\u20B94,72,000.00', green: true },
            { key: 'billing_pipeline_state', val: '"50_PERCENT_DEPOSIT_AWAITING"', green: true },
        ],
    },
];

function LifecycleSection() {
    const [activeStep, setActiveStep] = useState(0);
    const [visible, setVisible] = useState(true);
    const [visibleLines, setVisibleLines] = useState<number[]>([0, 1, 2, 3]);
    const ref = useScrollReveal();
    const ruleRef = useScrollReveal();

    const handleStep = useCallback((idx: number) => {
        if (idx === activeStep) return;
        setVisible(false);
        setVisibleLines([]);
        setTimeout(() => {
            setActiveStep(idx);
            setVisible(true);
            [0, 1, 2, 3].forEach((lineIdx) => {
                setTimeout(() => setVisibleLines(prev => [...prev, lineIdx]), lineIdx * 80 + 60);
            });
        }, 280);
    }, [activeStep]);

    const step = pipelineSteps[activeStep];

    return (
        <>
            <div ref={ruleRef} className="reveal-on-scroll lp-section-rule mx-auto max-w-6xl" />
            <section id="pipeline" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-6xl mx-auto">
                <div ref={ref} className="reveal-on-scroll">
                    <PipelineTracker />

                    {/* FIX 4: Updated section header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-gold)' }}>
                            Architectural Workflow
                        </span>
                        <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                            From Initial Brief to Site Handover:{' '}
                            <span className="italic" style={{ color: '#C5A880' }}>The Studio Pipeline</span>
                        </h2>
                        <p className="text-sm font-light" style={{ color: 'var(--lp-text-muted)' }}>
                            Click through each architectural phase to see how Kalvora manages your studio &mdash; from spatial pitch to advance payment collected.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-5 relative">
                            <div className="lp-tab-capsule" style={{ top: `${activeStep * 79}px` }} />
                            <div className="space-y-3 relative">
                                {pipelineSteps.map((s, idx) => {
                                    const Icon = s.icon;
                                    const isActive = activeStep === idx;
                                    return (
                                        <button key={idx} onClick={() => handleStep(idx)}
                                            className={`lp-tab-trigger relative z-10 ${isActive ? 'active' : ''}`}>
                                            <div className="lp-tab-icon-wrap">
                                                <Icon size={18} style={{ color: 'var(--lp-gold)' }} />
                                            </div>
                                            <div className="space-y-1 text-left">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-bold" style={{ color: 'var(--lp-text)' }}>{s.title}</span>
                                                    <span className="text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full"
                                                        style={{ background: '#F0EDE9', color: 'var(--lp-text-muted)' }}>
                                                        {s.tag}
                                                    </span>
                                                </div>
                                                {isActive && (
                                                    <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--lp-text-muted)' }}>
                                                        {s.heading}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className={`lp-tab-panel ${visible ? 'visible' : 'entering'}`}>
                                <div className="lp-card p-7 space-y-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border"
                                            style={{ background: 'var(--lp-gold-bg)', borderColor: 'var(--lp-gold-border)', color: '#92714A' }}>
                                            {step.tag}
                                        </span>
                                    </div>
                                    <h3 className="lp-font-display text-xl sm:text-2xl font-light leading-snug" style={{ color: 'var(--lp-text)' }}>
                                        {step.heading}
                                    </h3>
                                    <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--lp-text-muted)' }}>
                                        {step.desc}
                                    </p>
                                    <div className="lp-terminal">
                                        <div className="lp-terminal-header">
                                            &#11035; STUDIO ENGINE &nbsp;&middot;&nbsp; LIVE SIMULATOR ACTIVE
                                        </div>
                                        {step.terminal.map((line, i) => (
                                            visibleLines.includes(i) ? (
                                                <div key={i} style={{ animation: 'fadeIn 200ms ease-out forwards' }}>
                                                    <span className="lp-terminal-dim">{'>'} </span>
                                                    <span className="lp-terminal-key">{line.key}</span>
                                                    <span className="lp-terminal-dim">: </span>
                                                    <span className={(line as {key:string;val:string;green?:boolean}).green ? 'lp-terminal-green' : 'lp-terminal-val'}>{line.val}</span>
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 4 - THE LIVE TEMPLATE SHOWROOM
// ═══════════════════════════════════════════════════════
type ThemeKey = 'minimal' | 'luxury' | 'blueprint';

const themes: { key: ThemeKey; label: string; sub: string }[] = [
    { key: 'minimal', label: 'Minimalist Architecture', sub: 'Clean layout, sans-serif, thin structural lines.' },
    { key: 'luxury',  label: 'Luxury Editorial Format', sub: 'Elegant serif display, soft margins, gold accents.' },
    { key: 'blueprint', label: 'Blueprint Production Layout', sub: 'Technical grid structure, monospaced engineering detail.' },
];

function TemplateShowroom() {
    const [theme, setTheme] = useState<ThemeKey>('minimal');
    const ref = useScrollReveal();
    const ruleRef = useScrollReveal();

    return (
        <>
            <div ref={ruleRef} className="reveal-on-scroll lp-section-rule mx-auto max-w-6xl" />
            <section id="showroom" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-6xl mx-auto">
                <div ref={ref} className="reveal-on-scroll text-center max-w-3xl mx-auto mb-14 space-y-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-gold)' }}>
                        Studio Branding Customisation
                    </span>
                    <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                        Complement your studio&apos;s stylistic profile
                    </h2>
                    <p className="text-sm font-light" style={{ color: 'var(--lp-text-muted)' }}>
                        Switch pitch layouts natively. Kalvora updates font pairings and border alignments smoothly across custom presentation themes.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest font-mono mb-4"
                            style={{ color: 'var(--lp-text-subtle)' }}>Select Presentation Style</p>
                        <div className="lp-theme-selector-row lg:flex lg:flex-col lg:space-y-3 lg:overflow-visible">
                            {themes.map((t) => (
                                <button key={t.key} onClick={() => setTheme(t.key)}
                                    className={`lp-theme-trigger ${theme === t.key ? 'active' : ''}`}>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--lp-text)' }}>{t.label}</p>
                                        <p className="text-xs font-light" style={{ color: 'var(--lp-text-muted)' }}>{t.sub}</p>
                                    </div>
                                    <span className="lp-theme-dot shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`lg:col-span-8 theme-${theme}`}>
                        <div key={theme} className="lp-proposal-canvas animate-fade-in">
                            <div className="lp-proposal-accent h-[3px] rounded-full mb-6" />
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="lp-proposal-title">KALIPR STUDIO</p>
                                    <p className="lp-proposal-ref mt-1">Design Pitch &amp; Spatial Program</p>
                                </div>
                                <div className="text-right">
                                    <p className="lp-proposal-ref">Ref Date: Nov 07, 2026</p>
                                    {/* FIX 1: Namita Sharma */}
                                    <p className="lp-proposal-ref">Client: Namita Sharma</p>
                                </div>
                            </div>
                            <div className="lp-proposal-row">
                                <p className="lp-proposal-label mb-1">Spatial Program Reference</p>
                                <p className="lp-proposal-value">Namita Sharma &mdash; Corporate Office Suite, 2400 sq.ft</p>
                            </div>
                            <div className="lp-proposal-row">
                                <div className="flex justify-between items-baseline gap-4">
                                    <p className="lp-proposal-value flex-1">Premium Partition Architecture &amp; Soundproof Glazing</p>
                                    <p className="lp-proposal-value shrink-0 font-semibold">&#8377;5,00,000.00</p>
                                </div>
                            </div>
                            <div className="lp-proposal-row">
                                <div className="flex justify-between items-baseline gap-4">
                                    <p className="lp-proposal-value flex-1">Integrated Acoustic Ceiling Grid &amp; Diffuse Lighting Schema</p>
                                    <p className="lp-proposal-value shrink-0 font-semibold">&#8377;3,00,000.00</p>
                                </div>
                            </div>
                            <div className="lp-proposal-total mt-5 space-y-2">
                                <div className="flex justify-between">
                                    <span className="lp-proposal-total-label">Subtotal Base Fee</span>
                                    <span className="lp-proposal-value">&#8377;8,00,000.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="lp-proposal-total-label">GST (18%)</span>
                                    <span className="lp-proposal-value">&#8377;1,44,000.00</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                                    <span className="lp-proposal-total-label">Grand Aggregate Fee</span>
                                    <span className="lp-proposal-total-val">&#8377;9,44,000.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 1.5 — SOCIAL PROOF (FIX 3: moved above TryoutGateway)
//  Continuous marquee ticker + material sample cards
// ═══════════════════════════════════════════════════════
// ── DUAL-AXIS RUNWAY DATA ────────────────────────────────────────────────────
const westAxisStudios = [
    'Studio Canvas Architecture', 'Mati Design Collective', 'The Brick & Mortar Lab',
    'Atelier Shunya', 'Spade & Trowel Studios', 'Svarupa Space Designers',
    'Form & Function Lounge', 'The Charcoal Grid', 'Koriv Studio',
    'Tattva Spatial Studio', 'Ananta Design Partners', 'Prana Habitat Group',
];
const eastAxisStudios = [
    'Vinyasa Design House', 'The Minimalist Archetype', 'Akasha Living Spaces',
    'Atelier Ochre', 'The Teak & Terrazzo Co.', 'Dhruva Space Curators',
    'Kala & Karma Labs', 'The Mudroom Collective', 'Sutra Interior Architects',
    'Bhumika Spatial Curation', 'Sthapatya Design Group', 'The Ochre Envelope',
];
// Doubled for seamless infinite scroll
const westSet  = [...westAxisStudios,  ...westAxisStudios];
const eastSet  = [...eastAxisStudios, ...eastAxisStudios];

const testimonials = [
    {
        initials: 'TK',
        color: '#7C6B5A',
        name: 'Tanvi Kulkarni',
        role: 'Principal Architect',
        city: 'Erandwane, Pune',
        studio: 'Studio Svara',
        quote: 'We used to spend hours aligning clean spacing tables in Microsoft Word, only to export a generic file that looked messy when opened on a client\'s phone over WhatsApp. Kalvora completely protected our visual presentation. Now, clients review our design proposals on beautiful digital pages, and our design fees are authorized without any awkward back-and-forth arguments.',
    },
    {
        initials: 'RH',
        color: '#5A6B7C',
        name: 'Rohan Hegde',
        role: 'Luxury Residential Consultant',
        city: 'Koramangala, Bangalore',
        studio: 'The Minimalist Archetype',
        quote: 'Interior design is an emotionally driven business, but chasing down initial deposits is incredibly exhausting. The automated milestone tracking engine in Kalvora completely stabilized our studio\'s cash flows. Our 50% down payments are calculated, itemized with local GST fields, and settled before our rendering team even loads up their 3D visualization software tools.',
    },
    {
        initials: 'MD',
        color: '#8A6B52',
        name: 'Meera Deshmukh',
        role: 'Independent Interior Stylist',
        city: 'Prabhadevi, Mumbai',
        studio: 'Mati Design Collective',
        quote: 'Clients always used to haggle over specific line items when looking at raw Excel spreadsheets. Toggling active room nodes and material scope parameters inside the Kalvora worksheet gives the client clear ownership over their budget tiers. They don\'t ask for generic discounts anymore because they can clearly see how custom millwork changes the aggregate fee.',
    },
    {
        initials: 'AG',
        color: '#6B7C5A',
        name: 'Amit Gokhale',
        role: 'Commercial Project Director',
        city: 'Kalyani Nagar, Pune',
        studio: 'The Charcoal Grid',
        quote: 'Managing client variations during site handovers used to be an administrative disaster. Having a secure, public feedback discussion space on the quote link itself means every comment is permanently logged. The second a corporate client approves an upgrade, Kalvora locks the pricing structures and builds a print-ready invoice instantly.',
    },
    {
        initials: 'GR',
        color: '#7C5A6B',
        name: 'Gargi Reddy',
        role: 'Founder',
        city: 'Pune',
        studio: 'Koriv Studio',
        quote: 'As an independent consultant, I worried that using a corporate invoicing app would look cold to my clients. Kalvora\'s Luxury Editorial theme template feels like a premium print lookbook designed exactly for creatives. It makes my practice look highly organized and established, which helps me confidently pitch to premium bungalow builders.',
    },
    {
        initials: 'NR',
        color: '#5A7C6B',
        name: 'Nandan R.',
        role: 'Founding Partner',
        city: 'College Road, Nashik',
        studio: 'Atelier Ochre',
        quote: 'The real-time view alerts completely changed how we handle follow-ups. Stop guessing if the decision-maker read your text link. Knowing the exact second a client opens their custom project proposal sheet gives us the perfect context to pick up the phone, address lingering questions, and close the deal while engagement is highest.',
    },
];

function SocialProofSection() {
    const gridRef = useScrollReveal();

    return (
        <section className="lp-proof-section py-14 sm:py-16">
            {/* Section label */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-[10px] font-bold tracking-widest uppercase font-mono mb-8"
                    style={{ color: 'var(--lp-text-subtle)' }}>
                    Design Studios Across India Trust Kalvora
                </p>
            </div>

            {/* ── DUAL-AXIS INTERLOCKING RUNWAY ── */}
            <div className="lp-runway-outer py-4 mb-14" style={{ background: '#FAF8F5' }}>
                {/* West Axis — moves left at 25s */}
                <div className="lp-runway-row lp-runway-row-left">
                    {westSet.map((name, i) => (
                        <span key={i} className="lp-runway-name">
                            {name}
                            <span className="lp-runway-sep">&nbsp;·&nbsp;</span>
                        </span>
                    ))}
                </div>
                {/* East Axis — moves right at 32s */}
                <div className="lp-runway-row lp-runway-row-right">
                    {eastSet.map((name, i) => (
                        <span key={i} className="lp-runway-name">
                            {name}
                            <span className="lp-runway-sep">&nbsp;·&nbsp;</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* ── TESTIMONIAL THEATRE — 6 cards, 2-row horizontal scroll on mobile, 3-col grid on desktop ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={gridRef} className="reveal-on-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {testimonials.map((d, i) => (
                        <div key={i} className={`lp-testimonial-card lp-animate-entry lp-delay-${Math.min(i + 1, 5)}`}>
                            {/* Giant terracotta quote mark */}
                            <div className="lp-testimonial-quotemark">&ldquo;</div>

                            {/* Star rating */}
                            <div className="flex items-center gap-0.5 mb-4">
                                {[...Array(5)].map((_, si) => (
                                    <Star key={si} size={11} className="fill-current" style={{ color: '#D4AF37' }} />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-[13px] font-light leading-relaxed mb-5" style={{ color: 'var(--lp-text)' }}>
                                &ldquo;{d.quote}&rdquo;
                            </p>

                            {/* Badge */}
                            <div className="lp-testimonial-badge mb-4">
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--lp-terracotta)' }} />
                                Active on Kalvora Studio Platform
                            </div>

                            {/* Designer identity */}
                            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--lp-panel-border)' }}>
                                <div className="lp-designer-avatar" style={{ background: d.color, width: '36px', height: '36px', fontSize: '13px' }}>
                                    {d.initials}
                                </div>
                                <div>
                                    <p className="text-sm font-bold leading-tight" style={{ color: 'var(--lp-text)' }}>{d.name}</p>
                                    <p className="text-[10px]" style={{ color: 'var(--lp-text-subtle)' }}>{d.role} &middot; {d.studio}</p>
                                    <p className="text-[10px]" style={{ color: 'var(--lp-text-subtle)', opacity: 0.7 }}>{d.city}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 5 - ZERO-AUTH TRYOUT GATEWAY
// ═══════════════════════════════════════════════════════
const projectScaleOptions: SelectOption[] = [
    { value: '2bhk', label: '2BHK Apartment' },
    { value: '3bhk', label: '3BHK Residence' },
    { value: 'villa', label: 'Premium Commercial Villa' },
];
const budgetTierOptions: SelectOption[] = [
    { value: 'standard', label: 'Standard Finish' },
    { value: 'luxury', label: 'Premium Luxury Spec' },
];

function TryoutGateway() {
    const [scale, setScale] = useState('');
    const [tier, setTier]   = useState('');
    const [client, setClient] = useState('');
    const ref = useScrollReveal();

    return (
        <section id="sandbox" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-5xl mx-auto border-t"
            style={{ borderColor: 'var(--lp-stone-border)' }}>
            <div ref={ref} className="reveal-on-scroll text-center max-w-2xl mx-auto mb-12 space-y-3">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-gold)' }}>
                    Zero-Auth Studio Sandbox
                </span>
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    Your next design pitch is{' '}
                    <span className="italic" style={{ color: '#C5A880' }}>60 seconds away.</span>
                </h2>
                <p className="text-sm font-light" style={{ color: 'var(--lp-text-muted)' }}>
                    Experience the spatial program builder instantly before creating an account.
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="lp-tryout-card">
                    <p className="text-xs font-bold uppercase tracking-widest font-mono mb-6"
                        style={{ color: 'var(--lp-text-subtle)' }}>
                        Configure a Design Pitch in 15 Seconds
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--lp-text-muted)' }}>
                                Project Scale
                            </label>
                            <CustomSelect value={scale} onChange={setScale} options={projectScaleOptions} placeholder="Select project type..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--lp-text-muted)' }}>
                                Finish Specification Tier
                            </label>
                            <CustomSelect value={tier} onChange={setTier} options={budgetTierOptions} placeholder="Select finish level..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--lp-text-muted)' }}>
                                Client Name
                            </label>
                            <input type="text" className="input-field" placeholder="e.g. Namita Sharma"
                                value={client} onChange={(e) => setClient(e.target.value)} />
                        </div>
                        <Link href="/try" className="lp-btn-primary w-full mt-2 group justify-center">
                            Launch Studio Demo Space
                            <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                        <p className="text-center text-xs" style={{ color: 'var(--lp-text-subtle)' }}>
                            No account required &middot; Full template switcher unlocked
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 6A - LOCALIZED FAQ
// ═══════════════════════════════════════════════════════
const faqItems = [
    {
        q: 'Can I structure localised GST fields and advance payment milestones?',
        a: 'Yes. Kalvora calculates structured project breakdowns, including GST itemisation and customised advance payment milestones &mdash; for example, locking a 50% studio advance before work begins.',
    },
    {
        q: 'How do client view alerts keep me updated in real-time?',
        a: 'The application tracks client access on unique short links (/p/KV-xxxx). The second a client opens the design pitch, the platform logs the entry and updates your pipeline view status dynamically to &ldquo;Viewed&rdquo; &mdash; no polling, no delays.',
    },
    {
        q: 'Can I generate GST invoices with Kalvora?',
        a: 'Yes. Add your GSTIN and Kalvora auto-generates invoices with CGST/SGST breakdown, HSN/SAC codes, bank details, and UPI &mdash; the moment your client approves the design pitch.',
    },
    {
        q: 'Can I add my studio logo and branding?',
        a: 'Yes. Upload your studio logo, set your accent colour, and add your payment terms. Every design pitch and invoice carries your brand &mdash; not ours.',
    },
    {
        q: 'What does Kalvora cost?',
        a: 'Every feature is free during early access. No credit card, no time limit. When we launch Pro, early users get 50% off forever. Pro will be priced at &#8377;999/month.',
    },
    {
        q: 'Who builds and maintains Kalvora?',
        a: 'Kalvora is designed and engineered by <a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer" style="color:var(--lp-gold);text-decoration:underline">Kalipr Labs</a> &mdash; a dedicated product architecture studio focused on building high-performance, secure software tools. Using clean Next.js architecture and highly secure database pipelines, we ensure your studio data, pricing structures, and client proposals stay encrypted, fast, and private.',
    },
];

function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const ref = useScrollReveal();

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24 max-w-3xl mx-auto">
            <div ref={ref} className="reveal-on-scroll text-center mb-12 space-y-3">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-gold)' }}>
                    Studio Operational Inquiries
                </span>
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    Common <span className="italic" style={{ color: '#C5A880' }}>Questions</span>
                </h2>
            </div>

            <div className="space-y-3">
                {faqItems.map((item, i) => (
                    <div key={i} className="lp-faq-item">
                        <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left group"
                            aria-expanded={openIndex === i}>
                            <span className="text-sm font-medium pr-4 transition-colors"
                                style={{ color: openIndex === i ? 'var(--lp-text)' : '#57534E' }}>
                                {item.q}
                            </span>
                            <ChevronDown size={17}
                                className={`flex-shrink-0 transition-transform duration-500 ${openIndex === i ? 'rotate-180' : ''}`}
                                style={{ color: 'var(--lp-text-muted)' }} />
                        </button>
                        <div className={`overflow-hidden transition-[max-height,opacity] duration-500 ${openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}>
                            <div className="px-5 sm:px-6 pb-5">
                                <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--lp-text-muted)' }}
                                    dangerouslySetInnerHTML={{ __html: item.a }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 6B-CONTACT - CONVERSATIONAL STUDIO CONTACT FORM
// ═══════════════════════════════════════════════════════
const spatialOptions: SelectOption[] = [
    { value: 'residential', label: 'Residential Bungalows' },
    { value: 'corporate', label: 'Corporate Workspaces' },
    { value: 'retail', label: 'Boutique Retail' },
    { value: 'consultancy', label: 'Independent Consultancy' },
];
const scopeOptions: SelectOption[] = [
    { value: 'small', label: 'Under 1,500 sq.ft' },
    { value: 'medium', label: '1,500 – 4,000 sq.ft' },
    { value: 'large', label: '4,000+ sq.ft' },
];

function StudioContactForm() {
    const [cName, setCName] = useState('');
    const [cFirm, setCFirm] = useState('');
    const [cSpatial, setCSpacial] = useState('');
    const [cScope, setCScope] = useState('');
    const [cEmail, setCEmail] = useState('');
    const [cPhone, setCPhone] = useState('');
    const [cNotes, setCNotes] = useState('');
    const [sent, setSent] = useState(false);
    const ref = useScrollReveal();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const body = encodeURIComponent(
            `Name: ${cName}\nFirm: ${cFirm}\nSpatial Focus: ${cSpatial}\nScope: ${cScope}\nEmail: ${cEmail}\nPhone: ${cPhone}\nNotes: ${cNotes}`
        );
        window.location.href = `mailto:hello@kaliprlabs.in?subject=Studio Enquiry — ${cFirm}&body=${body}`;
        setSent(true);
    };

    const inlineInput = {
        borderBottom: '1px solid var(--lp-terracotta)',
        outline: 'none',
        background: 'transparent',
        color: 'var(--lp-text)',
        fontSize: '0.875rem',
        padding: '0 4px',
        margin: '0 4px',
    };

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t"
            style={{ borderColor: 'var(--lp-stone-border)', background: '#FAF8F5' }}>
            <div className="max-w-3xl mx-auto">
                <div ref={ref} className="reveal-on-scroll text-center mb-12 space-y-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-mono"
                        style={{ color: 'var(--lp-terracotta)' }}>
                        Studio Relations
                    </span>
                    <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight"
                        style={{ color: 'var(--lp-text)' }}>
                        {"Let's build a more "}
                        <span className="italic" style={{ color: '#C5A880' }}>profitable practice.</span>
                    </h2>
                    <p className="text-sm font-light leading-relaxed"
                        style={{ color: 'var(--lp-text-muted)', maxWidth: '480px', margin: '0 auto' }}>
                        We know you are busy running site handovers. Drop your project brief variables below
                        and a studio relations lead will set up your personalised workspace within 24 hours.
                    </p>
                </div>

                {sent ? (
                    <div className="text-center py-16 space-y-4">
                        <div className="text-4xl" style={{ color: 'var(--lp-terracotta)' }}>✦</div>
                        <p className="text-sm font-light" style={{ color: 'var(--lp-text)' }}>
                            Brief received. A studio relations lead will reach out within 24 hours.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mad-lib conversational block */}
                        <div className="p-6 sm:p-8 rounded-xl border"
                            style={{
                                background: '#FFFFFF',
                                borderColor: 'var(--lp-panel-border)',
                                borderLeft: '3px solid var(--lp-terracotta)',
                            }}>
                            <p className="text-sm sm:text-[15px] font-light leading-loose"
                                style={{ color: 'var(--lp-text)' }}>
                                Hello Kalvora, my name is
                                <input type="text" value={cName} onChange={e => setCName(e.target.value)}
                                    placeholder="Your Name" required style={{ ...inlineInput, width: '130px' }} />
                                and I direct
                                <input type="text" value={cFirm} onChange={e => setCFirm(e.target.value)}
                                    placeholder="Studio or Firm" required style={{ ...inlineInput, width: '155px' }} />
                                . We are looking to organise our spatial pipelines for
                                <span className="inline-block align-middle mx-1" style={{ verticalAlign: 'middle' }}>
                                    <CustomSelect value={cSpatial} onChange={setCSpacial}
                                        options={spatialOptions} placeholder="project type…" />
                                </span>
                                . Our average project scope sits around
                                <span className="inline-block align-middle mx-1" style={{ verticalAlign: 'middle' }}>
                                    <CustomSelect value={cScope} onChange={setCScope}
                                        options={scopeOptions} placeholder="scope scale…" />
                                </span>
                                . Reach our design team at
                                <input type="email" value={cEmail} onChange={e => setCEmail(e.target.value)}
                                    placeholder="work@studio.in" required style={{ ...inlineInput, width: '170px' }} />
                                or call at
                                <input type="tel" value={cPhone} onChange={e => setCPhone(e.target.value)}
                                    placeholder="+91 98XXX XXXXX" style={{ ...inlineInput, width: '155px' }} />.
                            </p>
                        </div>

                        {/* Operational notes */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                                style={{ color: 'var(--lp-text-muted)' }}>
                                Any existing operational friction?
                                <span className="font-light normal-case ml-1"
                                    style={{ letterSpacing: 0 }}>
                                    (How do you currently send quotes or format invoice milestones?)
                                </span>
                            </label>
                            <textarea value={cNotes} onChange={e => setCNotes(e.target.value)}
                                rows={4}
                                placeholder="Tell us about your current workflow…"
                                className="w-full rounded-lg px-4 py-3 text-sm font-light resize-none border outline-none transition"
                                style={{
                                    background: '#FFFFFF',
                                    borderColor: 'var(--lp-panel-border)',
                                    color: 'var(--lp-text)',
                                }} />
                        </div>

                        {/* CTA */}
                        <button type="submit" className="lp-btn-primary w-full justify-center group">
                            Authenticate Studio Space &rarr;
                        </button>
                        <p className="text-center text-xs" style={{ color: 'var(--lp-text-subtle)' }}>
                            Response within 24 hours &middot; No spam, ever
                        </p>
                    </form>
                )}
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 6B - DARK PREMIUM FOOTER
// ═══════════════════════════════════════════════════════
function DarkFooter() {
    return (
        <footer className="lp-footer">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-block mb-4">
                            <span className="brand-wordmark text-xl" style={{ color: '#C5A880', letterSpacing: '0.4em' }}>KALVORA</span>
                        </Link>
                        <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: '#78716C' }}>
                            Structured design pitch tracking, automated invoicing, and milestone management workflows built for premium interior design studios.
                        </p>
                    </div>
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="lp-footer-col-label">Studio Tools</p>
                            <a href="#pipeline" className="lp-footer-link">Pipeline Workflow</a>
                            <a href="#showroom" className="lp-footer-link">Pitch Showroom</a>
                            <a href="#sandbox" className="lp-footer-link">Sandbox Space</a>
                            <Link href="/#pricing" className="lp-footer-link">Pricing</Link>
                        </div>
                        <div>
                            <p className="lp-footer-col-label">Studio Pipeline</p>
                            <Link href="/signup" className="lp-footer-link">Create Account</Link>
                            <Link href="/login" className="lp-footer-link">Sign In</Link>
                            <Link href="/public-feedback" className="lp-footer-link">Give Feedback</Link>
                        </div>
                        <div>
                            <p className="lp-footer-col-label">From the Lab</p>
                            <a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="lp-footer-link">Engineering Studio ↗</a>
                        </div>
                        <div>
                            <p className="lp-footer-col-label">Legal</p>
                            <Link href="/privacy" className="lp-footer-link">Privacy Policy</Link>
                            <Link href="/terms" className="lp-footer-link">Terms of Service</Link>
                            <a href="mailto:hello@kaliprlabs.in" className="lp-footer-link">Contact</a>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs" style={{ color: '#57534E' }}>
                            &copy; 2026 <span style={{ color: '#78716C' }}>KALVORA</span> &middot; Built for Indian Design Studios.
                        </p>
                        <p className="text-xs" style={{ color: '#57534E' }}>
                            An architectural production of{' '}
                            <a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer"
                                className="italic hover:opacity-80 transition-opacity"
                                style={{ color: '#78716C' }}>Kalipr Labs</a>.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
