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
    Zap, Eye, FileText, Receipt,
    Sparkles, Layers, Send, CheckCircle2,
    X, ExternalLink, Clock, Star
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// LANDING PAGE - Auth-State-Aware Entry Point
//
// State A (no session): Sales Machine - convince, educate, convert
// State B (session):    Closing Engine - action-driven command center
//
// Both render at "/" - no redirects.
// ─────────────────────────────────────────────────────────

// ── Reusable scroll-reveal hook (Batch B upgrade) ──
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
                            <p>&copy; 2026 <span className="brand-wordmark-inline text-[#9A9A9A] text-xs">Kalvora</span> &mdash; Product of <a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#6B6B6B] transition-colors">Kalipr Labs</a></p>
                            <div className="flex items-center gap-3">
                                <span>Privacy</span>
                                <span className="text-[#E4E1DB]">&middot;</span>
                                <span>Terms</span>
                                <span className="text-[#E4E1DB]">&middot;</span>
                                <a href="mailto:hello@kaliprlabs.in" className="hover:text-[#6B6B6B] transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    // ── State A: Premium Sales Landing Page ──
    return (
        <div className="min-h-screen lp-font-ui" style={{ background: 'var(--lp-canvas)', color: 'var(--lp-text)' }}>
            <LandingNavbar />
            <HeroSection />
            <PainContrastSection />
            <LifecycleSection />
            <TemplateShowroom />
            <TryoutGateway />
            <FAQSection />
            <DarkFooter />
            <DemoVideoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  LAYER 1 - HERO ARCHITECTURE
// ═══════════════════════════════════════════════════════
const heroMessages = [
    'Sent to client via magic link',
    'Tejas opened proposal link (Just Now)',
    'Tejas is adding line-item comments...',
    'Proposal Approved by Client! 50% Advance Invoice Ready ✓',
];

function HeroSection() {
    const [pulseIdx, setPulseIdx] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timers = [
            setTimeout(() => advance(1), 2500),
            setTimeout(() => advance(2), 5200),
            setTimeout(() => advance(3), 8400),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    function advance(idx: number) {
        setFading(true);
        setTimeout(() => { setPulseIdx(idx); setFading(false); }, 320);
    }

    const isApproved = pulseIdx === 3;

    // Status dot color: 0=grey, 1=amber, 2=amber, 3=olive
    const dotColors = ['#A8A29E', '#D97706', '#D97706', '#556B2F'];
    const dotIsAmber = pulseIdx === 1 || pulseIdx === 2;
    const dotIsOlive = pulseIdx === 3;

    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(197,168,128,0.07) 0%, transparent 70%)' }} />
            </div>

            <div className="relative max-w-4xl mx-auto text-center space-y-8">

                {/* Pre-header badge */}
                <div className="lp-badge lp-animate-entry mx-auto w-fit">
                    <Sparkles size={12} className="text-[#C5A880]" />
                    <span>&#10022; Platform Build Version 14 &mdash; Designed for Premium Design Studios</span>
                </div>

                {/* Headline */}
                <h1 className="lp-animate-entry lp-delay-1 lp-font-display text-[38px] sm:text-[58px] lg:text-[70px] font-light leading-[1.08] tracking-tight"
                    style={{ color: 'var(--lp-text)' }}>
                    Stop Sending Proposals<br />
                    on WhatsApp{' '}
                    <span className="font-normal italic" style={{ color: '#C5A880' }}>Like It&apos;s 2012.</span>
                </h1>

                {/* Sub-copy */}
                <p className="lp-animate-entry lp-delay-2 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light"
                    style={{ color: 'var(--lp-text-muted)' }}>
                    Transform scattered spreadsheets and manual layout tables into organised, digital scopes.
                    Track client interactions, capture specific line-item notes, and secure structural
                    down payments smoothly.
                </p>

                {/* CTAs */}
                <div className="lp-animate-entry lp-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Link href="/signup" className="lp-btn-primary group">
                        Build a Proposal
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/try" className="lp-btn-ghost">
                        Test Sandbox View
                    </Link>
                </div>

                {/* Trust strip */}
                <p className="lp-animate-entry lp-delay-4 text-xs" style={{ color: 'var(--lp-text-subtle)' }}>
                    Free during Early Access &middot; No credit card required &middot; Trusted by 100+ designers across India
                </p>

                {/* Live activity widget */}
                <div className="lp-animate-entry lp-delay-5 pt-6 max-w-2xl mx-auto">
                    <div className="lp-activity-widget">
                        <div className="lp-activity-widget-bar" />
                        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl border transition-all duration-500 ${isApproved
                                    ? 'bg-green-50 border-green-200'
                                    : 'border-[#E8DDD0]'
                                }`} style={!isApproved ? { background: 'var(--lp-gold-bg)' } : {}}>
                                    <Layers
                                        size={20}
                                        className={`transition-colors duration-500 ${isApproved ? 'text-green-600' : 'text-[#C5A880]'}`}
                                        style={{ animation: 'spin 6s linear infinite' }}
                                    />
                                </div>
                                <div>
                                    <span className="block text-[9px] font-mono font-bold tracking-widest uppercase mb-1 flex items-center gap-2"
                                        style={{ color: 'var(--lp-text-subtle)' }}>
                                        {/* Status dot */}
                                        <span
                                            className="inline-block w-2 h-2 rounded-full shrink-0"
                                            style={{
                                                background: dotColors[pulseIdx],
                                                animation: dotIsAmber ? 'pulse 1s ease-in-out infinite' : dotIsOlive ? 'lp-pulse-glow 1.8s ease-in-out infinite' : 'none',
                                            }}
                                        />
                                        Live Pipeline Activity Log
                                    </span>
                                    <p className={`text-sm font-semibold transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'} ${isApproved ? 'text-green-700' : ''}`}
                                        style={!isApproved ? { color: 'var(--lp-text)' } : {
                                            transform: fading ? 'translateY(4px)' : 'translateY(0)',
                                            transition: 'opacity 300ms ease, transform 300ms ease',
                                        }}>
                                        {heroMessages[pulseIdx]}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right font-mono text-[10px] px-3 py-1.5 rounded-lg border shrink-0"
                                style={{ color: 'var(--lp-text-subtle)', background: '#F5F3F0', borderColor: 'var(--lp-stone-border)' }}>
                                KV-8721 // Gargi Reddy Office
                            </div>
                        </div>
                        <div className="px-5 sm:px-6 pb-4 flex items-center gap-2 border-t" style={{ borderColor: 'var(--lp-stone-border)' }}>
                            <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: 'var(--lp-text-subtle)' }}>
                                Status
                            </span>
                            <span className="text-[9px] font-mono font-bold" style={{ color: isApproved ? '#556B2F' : '#D97706' }}>
                                {isApproved ? 'APPROVED' : pulseIdx === 0 ? 'SENT' : pulseIdx === 1 ? 'VIEWED' : 'ENGAGING'}
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
    'Manually formatting spacing in Excel tables',
    'Uploading massive files that clutter chat histories',
    'Following up repeatedly to see if a quote was read',
    'Calculating milestone breakdowns by hand',
];
const afterItems = [
    'Guided multi-step forms built for space planning',
    'Fast, responsive short tracking links (/p/KV-xxx)',
    'Direct alerts the second a client views a proposal',
    'Automatic invoice generation with local GST fields',
];

function PainContrastSection() {
    const ref = useScrollReveal();
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-5xl mx-auto">
            <div ref={ref} className="reveal-on-scroll text-center mb-14">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono mb-3 block" style={{ color: 'var(--lp-gold)' }}>
                    The Real Cost of Chaos
                </span>
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    Your current process is{' '}
                    <span className="italic" style={{ color: '#C5A880' }}>costing you projects</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Before */}
                <div className="lp-contrast-col">
                    <div className="lp-contrast-col-bar" style={{ background: '#E57373' }} />
                    <div className="p-6 sm:p-7">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2' }}>
                                <X size={15} className="text-red-500" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#B91C1C' }}>The Fragmented Routine</h3>
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

                {/* After */}
                <div className="lp-contrast-col">
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
//  LAYER 3A - 6-STEP PIPELINE TRACKER (Batch E)
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
        headline: 'The proposal begins as a structured workspace.',
        body: 'Fill in client details, project scope, and room configurations. The 8-section guided form is built around real interior design workflows — not generic invoice templates.',
        terminal: [
            { key: 'proposal_status', val: '"DRAFT"' },
            { key: 'client_ref', val: '"Gargi Reddy — Corporate Suite"' },
            { key: 'area_sqft', val: '2400' },
            { key: 'sections_complete', val: '0 / 8' },
        ],
    },
    {
        tag: 'SENT',
        tagStyle: { background: '#FEF3E2', color: '#C08A5D', border: '1px solid #F5DFC0' },
        label: 'Sent',
        headline: 'Share a single magic link. No attachments, no PDFs.',
        body: 'The proposal compiles into a lightweight, mobile-first presentation page at /p/KV-xxxxx. Send it via WhatsApp, email, or any channel your client prefers — it loads instantly.',
        terminal: [
            { key: 'short_link', val: '"kaliprlabs.in/p/KV-89271"' },
            { key: 'proposal_status', val: '"SENT"', green: true },
            { key: 'link_encrypted', val: 'true' },
            { key: 'delivery_channel', val: '"WhatsApp + Email"' },
        ],
    },
    {
        tag: 'VIEWED',
        tagStyle: { background: '#FEF3E2', color: '#D97706', border: '1px solid #FDE68A' },
        label: 'Viewed',
        headline: 'Know the exact second your client opens it.',
        body: 'The platform logs every client view event in real time. Your dashboard flips from Sent to Viewed the moment they open the link — giving you a precise window to follow up while engagement is highest.',
        terminal: [
            { key: 'event', val: '"CLIENT_VIEW_LOGGED"', green: true },
            { key: 'timestamp_utc', val: `"${new Date().toISOString()}"` },
            { key: 'pipeline_status', val: '"SENT → VIEWED"', green: true },
            { key: 'webhook', val: '"Resend API → studio@email.in"' },
        ],
    },
    {
        tag: 'FEEDBACK',
        tagStyle: { background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE' },
        label: 'Feedback',
        headline: 'Clients annotate line items directly — no back and forth.',
        body: 'Clients can drop comments on specific scope items, quantities, or service inclusions without leaving the proposal view. All feedback is captured structurally inside your project record.',
        terminal: [
            { key: 'comment_thread', val: '"Line 3 — Lighting Design"' },
            { key: 'client_note', val: '"Can we add smart lighting?"' },
            { key: 'interaction_count', val: '3' },
            { key: 'schematics_reviewed', val: 'true', green: true },
        ],
    },
    {
        tag: 'APPROVED',
        tagStyle: { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
        label: 'Approved',
        headline: 'One-click sign-off. Pricing locked. Milestone created.',
        body: 'The client approves the quote directly on the proposal page. The platform immediately locks the scope, generates a GST-ready invoice, and creates the first milestone payment link.',
        terminal: [
            { key: 'approval_status', val: '"APPROVED"', green: true },
            { key: 'project_total_inr', val: '₹8,00,000.00' },
            { key: 'gst_18_pct', val: '₹1,44,000.00' },
            { key: 'milestone_advance', val: '₹4,72,000.00', green: true },
        ],
    },
    {
        tag: 'PAID',
        tagStyle: { background: '#F0FDF4', color: '#556B2F', border: '1px solid #A3E635' },
        label: 'Paid',
        headline: 'Advance collected. Project begins. Full audit trail saved.',
        body: 'Once the advance milestone is paid, the full project record — scope, approvals, invoices, and payment receipts — is archived in one place. Your studio stays protected and organised.',
        terminal: [
            { key: 'invoice_status', val: '"PAID"', green: true },
            { key: 'advance_received', val: '₹4,72,000.00', green: true },
            { key: 'gstin_applied', val: 'true' },
            { key: 'project_phase', val: '"EXECUTION_STARTED"', green: true },
        ],
    },
];

function PipelineTracker() {
    const [activeNode, setActiveNode] = useState(1);
    const step = trackerSteps[activeNode];
    const progressPct = activeNode === 0 ? 0 : (activeNode / (trackerSteps.length - 1)) * 100;

    return (
        <div className="mb-20">
            {/* Section header */}
            <div className="text-center mb-12 space-y-3">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-olive)' }}>
                    Studio Workflow Interface
                </span>
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    From first quote to final payment &mdash;{' '}
                    <span className="italic" style={{ color: '#C5A880' }}>every step, one place.</span>
                </h2>
                <p className="text-sm font-light max-w-2xl mx-auto" style={{ color: 'var(--lp-text-muted)' }}>
                    Click each stage to see exactly what Kalvora handles for your studio &mdash; from initial scope draft to advance payment collected.
                </p>
            </div>

            {/* Tracker bar */}
            <div className="relative flex items-center mb-10">
                <div className="lp-tracker-bar flex-1">
                    <div className="lp-tracker-fill" style={{ width: `${progressPct}%` }} />
                </div>
                {/* Overlay nodes */}
                <div className="absolute inset-0 flex items-center">
                    {trackerSteps.map((s, idx) => {
                        const dotClass = idx < activeNode
                            ? 'lp-tracker-dot-complete'
                            : idx === activeNode
                                ? 'lp-tracker-dot-active'
                                : 'lp-tracker-dot-future';
                        const labelColor = idx <= activeNode ? 'var(--lp-text)' : 'var(--lp-text-subtle)';
                        return (
                            <button
                                key={idx}
                                className="lp-tracker-node"
                                onClick={() => setActiveNode(idx)}
                                aria-label={`Stage: ${s.label}`}
                            >
                                <span
                                    className="text-[8px] font-bold font-mono tracking-widest uppercase mb-1"
                                    style={{ color: labelColor }}
                                >
                                    {s.label}
                                </span>
                                <span className={`lp-tracker-dot ${dotClass}`} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content card */}
            <div key={activeNode} className="lp-tracker-card lp-tracker-card-anim">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="flex-1 space-y-4">
                        <span
                            className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                            style={step.tagStyle}
                        >
                            {step.tag}
                        </span>
                        <h3 className="lp-font-display text-xl sm:text-2xl font-light leading-snug" style={{ color: 'var(--lp-text)' }}>
                            {step.headline}
                        </h3>
                        <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--lp-text-muted)' }}>
                            {step.body}
                        </p>
                    </div>
                    <div className="sm:w-[320px] shrink-0">
                        <div className="lp-terminal">
                            <div className="lp-terminal-header">
                                &#11035; SCHEMA CORE ENGINE &nbsp;&middot;&nbsp; STAGE {activeNode + 1} / {trackerSteps.length}
                            </div>
                            {step.terminal.map((line, i) => (
                                <div key={i}>
                                    <span className="lp-terminal-dim">{'>'} </span>
                                    <span className="lp-terminal-key">{line.key}</span>
                                    <span className="lp-terminal-dim">: </span>
                                    <span className={line.green ? 'lp-terminal-green' : 'lp-terminal-val'}>{line.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Stage nav pills */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t" style={{ borderColor: 'var(--lp-stone-border)' }}>
                    <button
                        onClick={() => setActiveNode(Math.max(0, activeNode - 1))}
                        disabled={activeNode === 0}
                        className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all"
                        style={{
                            borderColor: activeNode === 0 ? 'var(--lp-sand)' : 'var(--lp-stone-border)',
                            color: activeNode === 0 ? 'var(--lp-text-subtle)' : 'var(--lp-text-muted)',
                            background: 'transparent',
                        }}
                    >
                        &larr; Prev
                    </button>
                    <div className="flex gap-1.5">
                        {trackerSteps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveNode(idx)}
                                className="rounded-full transition-all"
                                style={{
                                    width: idx === activeNode ? '20px' : '6px',
                                    height: '6px',
                                    background: idx === activeNode ? '#1A1512' : idx < activeNode ? '#556B2F' : '#EFEBE4',
                                }}
                                aria-label={`Go to stage ${idx + 1}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setActiveNode(Math.min(trackerSteps.length - 1, activeNode + 1))}
                        disabled={activeNode === trackerSteps.length - 1}
                        className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all"
                        style={{
                            borderColor: activeNode === trackerSteps.length - 1 ? 'var(--lp-sand)' : 'var(--lp-stone-border)',
                            color: activeNode === trackerSteps.length - 1 ? 'var(--lp-text-subtle)' : 'var(--lp-text-muted)',
                            background: 'transparent',
                        }}
                    >
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
const pipelineSteps = [
    {
        title: '1. The Guided Studio Worksheet',
        tag: 'STRUCTURE',
        icon: FileText,
        heading: 'An 8-section builder form structured around real design projects.',
        desc: 'Input client specifications, total square footage, and room layouts. Toggle custom services like 3D visualisations, material sourcing packages, or electrical schematics &mdash; without touching a spreadsheet.',
        terminal: [
            { key: 'client_context_name', val: '"Gargi Reddy"' },
            { key: 'area_dimension_sqft', val: '2400' },
            { key: 'room_nodes_allocated', val: '["Boutique Cabin", "Conference Room", "Server Hub"]' },
            { key: 'active_service_hooks', val: '["3D_Visualization", "Lighting_Design"]' },
        ],
    },
    {
        title: '2. The Magic Short-Link',
        tag: 'DELIVERY',
        icon: Send,
        heading: 'Ditch heavy file attachments. Share via one elegant link.',
        desc: 'Compile detailed estimates into short tracking links (/p/KV-xxxxx). These optimised presentation sheets are lightweight, responsive, secure, and load instantly on client mobile devices over WhatsApp.',
        terminal: [
            { key: 'generation_token', val: '"KV-89271-PROPOSAL"' },
            { key: 'redirect_mask_path', val: '"/view/proposal_id_secure"' },
            { key: 'encrypted_short_route', val: '"kaliprlabs.in/p/KV-89271"' },
            { key: 'link_status', val: '"ACTIVE"' },
        ],
    },
    {
        title: '3. Real-Time Tracking Alerts',
        tag: 'ENGAGEMENT',
        icon: Eye,
        heading: 'Know the exact second a client reviews your quotation.',
        desc: 'Receive instant project dashboard notifications the moment a client opens their link. This precise insight lets you pick up the phone, resolve questions, and close deals when engagement is highest.',
        terminal: [
            { key: 'event_type', val: '"CLIENT_VIEW_LOGGED"', green: true },
            { key: 'timestamp_utc', val: '"2026-11-07T20:14:33Z"' },
            { key: 'webhook_dispatch', val: '"Resend API \u2192 studio@email.in"' },
            { key: 'pipeline_status_update', val: '"draft \u2192 viewed"', green: true },
        ],
    },
    {
        title: '4. One-Click Milestone Checkout',
        tag: 'CASH FLOW',
        icon: CheckCircle2,
        heading: 'Frictionless sign-offs that launch milestone payments automatically.',
        desc: 'Clients review project costs, add specific feedback notes, and authorise quotes instantly. Once approved, the platform locks pricing, generates payment milestones, and creates print-ready GST invoices.',
        terminal: [
            { key: 'project_total_gross_inr', val: '\u20B98,00,000.00' },
            { key: 'local_tax_gst_18', val: '\u20B91,44,000.00' },
            { key: 'milestone_advance_50pct', val: '\u20B94,72,000.00', green: true },
            { key: 'invoice_status', val: '"GENERATED \u2014 Awaiting Checkout"', green: true },
        ],
    },
];

function LifecycleSection() {
    const [activeStep, setActiveStep] = useState(0);
    const [visible, setVisible] = useState(true);
    const [visibleLines, setVisibleLines] = useState<number[]>([0, 1, 2, 3]);
    const ref = useScrollReveal();

    const handleStep = useCallback((idx: number) => {
        if (idx === activeStep) return;
        setVisible(false);
        setVisibleLines([]);
        setTimeout(() => {
            setActiveStep(idx);
            setVisible(true);
            // Stagger terminal lines
            [0, 1, 2, 3].forEach((lineIdx) => {
                setTimeout(() => setVisibleLines(prev => [...prev, lineIdx]), lineIdx * 80 + 60);
            });
        }, 280);
    }, [activeStep]);

    const step = pipelineSteps[activeStep];

    return (
        <section id="pipeline" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-6xl mx-auto border-t"
            style={{ borderColor: 'var(--lp-stone-border)' }}>
            <div ref={ref} className="reveal-on-scroll">
                {/* Pipeline Tracker (Batch E) */}
                <PipelineTracker />

                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-gold)' }}>
                        Platform Workflow Architecture
                    </span>
                    <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                        How Kalvora coordinates your business
                    </h2>
                    <p className="text-sm font-light" style={{ color: 'var(--lp-text-muted)' }}>
                        Click through the architectural phases to see exactly how Kalvora manages client interactions &mdash; from structural pitch to final invoice.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left - Tab triggers */}
                    <div className="lg:col-span-5 relative">
                        {/* Sliding capsule background */}
                        <div
                            className="lp-tab-capsule"
                            style={{ top: `${activeStep * 79}px` }}
                        />
                        <div className="space-y-3 relative">
                            {pipelineSteps.map((s, idx) => {
                                const Icon = s.icon;
                                const isActive = activeStep === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleStep(idx)}
                                        className={`lp-tab-trigger relative z-10 ${isActive ? 'active' : ''}`}
                                    >
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

                    {/* Right - Adaptive panel */}
                    <div className="lg:col-span-7">
                        <div className={`lp-tab-panel ${visible ? 'visible' : 'entering'}`}>
                            <div className="lp-card p-7 space-y-5">
                                {/* Context label */}
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

                                {/* Terminal block with typing effect */}
                                <div className="lp-terminal">
                                    <div className="lp-terminal-header">
                                        &#11035; SCHEMA CORE ENGINE &nbsp;&middot;&nbsp; LIVE SIMULATOR ACTIVE
                                    </div>
                                    {step.terminal.map((line, i) => (
                                        visibleLines.includes(i) ? (
                                            <div key={i} style={{ animation: 'fadeIn 200ms ease-out forwards' }}>
                                                <span className="lp-terminal-dim">{'>'} </span>
                                                <span className="lp-terminal-key">{line.key}</span>
                                                <span className="lp-terminal-dim">: </span>
                                                <span className={line.green ? 'lp-terminal-green' : 'lp-terminal-val'}>{line.val}</span>
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

    return (
        <section id="showroom" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-6xl mx-auto border-t"
            style={{ borderColor: 'var(--lp-stone-border)' }}>
            <div ref={ref} className="reveal-on-scroll text-center max-w-3xl mx-auto mb-14 space-y-3">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-gold)' }}>
                    Branding Customisation
                </span>
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    Complement your studio&apos;s stylistic profile
                </h2>
                <p className="text-sm font-light" style={{ color: 'var(--lp-text-muted)' }}>
                    Switch template layouts natively. Kalvora updates font pairings and border alignments smoothly across custom themes.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left - Theme selectors */}
                <div className="lg:col-span-4 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest font-mono mb-4"
                        style={{ color: 'var(--lp-text-subtle)' }}>Select Live Style</p>
                    {themes.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTheme(t.key)}
                            className={`lp-theme-trigger ${theme === t.key ? 'active' : ''}`}
                        >
                            <div className="text-left">
                                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--lp-text)' }}>{t.label}</p>
                                <p className="text-xs font-light" style={{ color: 'var(--lp-text-muted)' }}>{t.sub}</p>
                            </div>
                            <span className="lp-theme-dot shrink-0" />
                        </button>
                    ))}
                </div>

                {/* Right - Single canvas div, class-driven theming */}
                <div className={`lg:col-span-8 theme-${theme}`}>
                    <div className="lp-proposal-canvas">
                        {/* Accent bar */}
                        <div className="lp-proposal-accent h-[3px] rounded-full mb-6" />

                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="lp-proposal-title">KALIPR STUDIO</p>
                                <p className="lp-proposal-ref mt-1">Project Proposal Specification</p>
                            </div>
                            <div className="text-right">
                                <p className="lp-proposal-ref">Ref Date: Nov 07, 2026</p>
                                <p className="lp-proposal-ref">Design Area: 2,400 sq.ft Office</p>
                            </div>
                        </div>

                        {/* Client block */}
                        <div className="lp-proposal-row">
                            <p className="lp-proposal-label mb-1">Target Client Reference</p>
                            <p className="lp-proposal-value">Gargi Reddy &mdash; CEO Corporate Suite Layout</p>
                        </div>

                        {/* Line items */}
                        <div className="lp-proposal-row">
                            <div className="flex justify-between items-baseline gap-4">
                                <p className="lp-proposal-value flex-1">Premium Partition Architecture &amp; Soundproof Glazing</p>
                                <p className="lp-proposal-value shrink-0 font-semibold">&#8377;5,00,000.00</p>
                            </div>
                        </div>
                        <div className="lp-proposal-row">
                            <div className="flex justify-between items-baseline gap-4">
                                <p className="lp-proposal-value flex-1">Integrated Acoustic Ceiling Grid &amp; Diffuse Lighting</p>
                                <p className="lp-proposal-value shrink-0 font-semibold">&#8377;3,00,000.00</p>
                            </div>
                        </div>

                        {/* Totals */}
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
                    Zero-Auth Onboarding Sandbox
                </span>
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    Your next proposal is{' '}
                    <span className="italic" style={{ color: '#C5A880' }}>60 seconds away.</span>
                </h2>
                <p className="text-sm font-light" style={{ color: 'var(--lp-text-muted)' }}>
                    Experience the layout configuration interface instantly before creating an account.
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="lp-tryout-card">
                    <p className="text-xs font-bold uppercase tracking-widest font-mono mb-6"
                        style={{ color: 'var(--lp-text-subtle)' }}>
                        Test the Proposal Builder in 15 Seconds
                    </p>

                    <div className="space-y-4">
                        {/* Project Scale */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                                style={{ color: 'var(--lp-text-muted)' }}>
                                Project Scale
                            </label>
                            <CustomSelect
                                value={scale}
                                onChange={setScale}
                                options={projectScaleOptions}
                                placeholder="Select project type..."
                            />
                        </div>

                        {/* Budget Tier */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                                style={{ color: 'var(--lp-text-muted)' }}>
                                Target Budget Tier
                            </label>
                            <CustomSelect
                                value={tier}
                                onChange={setTier}
                                options={budgetTierOptions}
                                placeholder="Select finish level..."
                            />
                        </div>

                        {/* Client name */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                                style={{ color: 'var(--lp-text-muted)' }}>
                                Client Baseline Header
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. Gargi Reddy"
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                            />
                        </div>

                        <Link
                            href="/try"
                            className="lp-btn-primary w-full mt-2 group"
                            style={{ justifyContent: 'center' }}
                        >
                            Launch Dynamic Demo Space
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
        q: 'Can I structure localised tax fields and down payment formats?',
        a: 'Yes. Kalvora is built to calculate structured project breakdowns, including options for localised GST itemisation and customised advance payment milestones &mdash; for example, locking a 50% initial deposit before work begins.',
    },
    {
        q: 'How do client view alerts keep me updated in real-time?',
        a: 'The application tracks client access on unique short links (/p/KV-xxxx). The second a client opens the document page, the platform logs the entry and updates your pipeline view status dynamically to "Viewed" &mdash; no polling, no delays.',
    },
    {
        q: 'Can I generate GST invoices with Kalvora?',
        a: 'Yes. Add your GSTIN and Kalvora auto-generates invoices with CGST/SGST breakdown, HSN/SAC codes, bank details, and UPI &mdash; the moment your client approves the proposal.',
    },
    {
        q: 'Can I add my logo and branding to proposals?',
        a: 'Yes. Upload your studio logo, set your accent colour, and add your payment terms. Every proposal and invoice carries your brand &mdash; not ours.',
    },
    {
        q: 'What does Kalvora cost?',
        a: 'Every feature is free during early access. No credit card, no time limit. When we launch Pro, early users get 50% off forever. Pro will be priced at &#8377;999/month.',
    },
];

function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const ref = useScrollReveal();

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24 max-w-3xl mx-auto">
            <div ref={ref} className="reveal-on-scroll text-center mb-12 space-y-3">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: 'var(--lp-gold)' }}>
                    Platform Operational Inquiries
                </span>
                <h2 className="lp-font-display text-3xl sm:text-4xl font-light tracking-tight" style={{ color: 'var(--lp-text)' }}>
                    Common <span className="italic" style={{ color: '#C5A880' }}>Questions</span>
                </h2>
            </div>

            <div className="space-y-3">
                {faqItems.map((item, i) => (
                    <div key={i} className="lp-faq-item">
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left group"
                            aria-expanded={openIndex === i}
                        >
                            <span className="text-sm font-medium pr-4 transition-colors"
                                style={{ color: openIndex === i ? 'var(--lp-text)' : '#57534E' }}>
                                {item.q}
                            </span>
                            <ChevronDown
                                size={17}
                                className={`flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                                style={{ color: 'var(--lp-text-muted)' }}
                            />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-5 sm:px-6 pb-5">
                                <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--lp-text-muted)' }} dangerouslySetInnerHTML={{ __html: item.a }} />
                            </div>
                        </div>
                    </div>
                ))}
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
                    {/* Brand strip */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-block mb-4">
                            <span className="brand-wordmark text-xl" style={{ color: '#C5A880', letterSpacing: '0.4em' }}>
                                KALVORA
                            </span>
                        </Link>
                        <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: '#78716C' }}>
                            Structured proposal tracking, automated invoicing, and milestone management workflows designed for premium interior design studios.
                        </p>
                    </div>

                    {/* Nav columns */}
                    <div className="md:col-span-7 grid grid-cols-3 gap-6">
                        <div>
                            <p className="lp-footer-col-label">Product</p>
                            <a href="#pipeline" className="lp-footer-link">Pipeline Workflow</a>
                            <a href="#showroom" className="lp-footer-link">Studio Showroom</a>
                            <a href="#sandbox" className="lp-footer-link">Sandbox Space</a>
                            <Link href="/#pricing" className="lp-footer-link">Pricing</Link>
                        </div>
                        <div>
                            <p className="lp-footer-col-label">Studio Pipeline</p>
                            <Link href="/signup" className="lp-footer-link">Create Account</Link>
                            <Link href="/login" className="lp-footer-link">Sign In</Link>
                            <a href="https://kaliprlabs.in" target="_blank" rel="noopener noreferrer" className="lp-footer-link">Kalipr Labs</a>
                            <Link href="/public-feedback" className="lp-footer-link">Give Feedback</Link>
                        </div>
                        <div>
                            <p className="lp-footer-col-label">Legal Documentation</p>
                            <span className="lp-footer-link cursor-default">Privacy Policy</span>
                            <span className="lp-footer-link cursor-default">Terms of Service</span>
                            <a href="mailto:hello@kaliprlabs.in" className="lp-footer-link">Contact</a>
                        </div>
                    </div>
                </div>

                {/* Bottom strip */}
                <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs" style={{ color: '#57534E' }}>
                            &copy; 2026 <span style={{ color: '#78716C' }}>KALVORA</span> &middot; Architecture Design Concept Snapshot.
                        </p>
                        <p className="text-xs italic" style={{ color: '#57534E' }}>
                            Designed by Kalipr Labs &middot; Engineered for Creative Professionals.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
