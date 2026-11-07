import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy — Kalvora',
    description: 'How Kalvora collects, uses, and protects your studio data.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen" style={{ background: '#FDFCFB', color: '#1A1512' }}>
            {/* Header bar */}
            <div className="border-b" style={{ borderColor: '#E8DDD0' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <Link href="/" className="brand-wordmark text-lg" style={{ color: '#C5A880', letterSpacing: '0.4em' }}>
                        KALVORA
                    </Link>
                    <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#78716C' }}>
                        Privacy Policy
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {/* Title block */}
                <div className="mb-14 space-y-4 border-b pb-10" style={{ borderColor: '#E8DDD0' }}>
                    <span className="text-[10px] font-bold tracking-widest uppercase font-mono" style={{ color: '#C87A53' }}>
                        Legal Documentation · Effective 1 January 2026
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-tight" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                        Privacy <span className="italic" style={{ color: '#C5A880' }}>Policy</span>
                    </h1>
                    <p className="text-sm font-light leading-relaxed" style={{ color: '#78716C', maxWidth: '540px' }}>
                        Kalvora is designed and engineered by Kalipr Labs. This document describes exactly
                        what personal and studio data we collect, how we use it, and the technical standards
                        we enforce to keep your practice information secure.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-12 text-sm font-light leading-relaxed" style={{ color: '#57534E' }}>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            1. Primary Data Collection
                        </h2>
                        <p className="mb-3">
                            Kalvora collects personal and studio information — including studio logos, billing details, and
                            GST registration numbers — strictly to calculate project design pitch totals and auto-generate
                            print-ready invoices. We collect only the fields you actively input.
                        </p>
                        <p>
                            When you create an account, we store your email address and studio name to authenticate your
                            workspace session and associate project records with your practice. We do not sell, rent, or
                            share this information with third-party advertising networks.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            2. Client View Tracking
                        </h2>
                        <p className="mb-3">
                            The platform tracks public endpoint access on unique short links (<span style={{ fontFamily: 'monospace', color: '#1A1512' }}>/p/KV-xxxx</span>).
                            When a client opens a design pitch link, Kalvora logs the event timestamp and updates your
                            pipeline dashboard in real time — from &ldquo;Sent&rdquo; to &ldquo;Viewed&rdquo;.
                        </p>
                        <p>
                            This view data is shared exclusively with the account holder who generated the link. We do not
                            inspect, store, or analyse client commentary notes for any advertising or profiling purpose.
                            Client IP addresses are not retained beyond the session.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            3. Asset Security Standards
                        </h2>
                        <p className="mb-3">
                            All material photographs, layout drafts, client project costs, pricing breakdowns, and
                            GST invoices are stored within encrypted cloud databases, protected by Supabase platform
                            access keys and row-level security policies.
                        </p>
                        <p>
                            Your studio&apos;s pricing structures, client contact data, and payment milestone records
                            are never accessible to other Kalvora accounts. Access is scoped entirely to your authenticated
                            workspace session.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            4. Cookies &amp; Analytics
                        </h2>
                        <p>
                            Kalvora uses minimal, anonymous analytics to understand which features are most useful to
                            design practices. These analytics do not track individual users or build personal profiles.
                            No cross-site tracking cookies are deployed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            5. Data Retention &amp; Deletion
                        </h2>
                        <p className="mb-3">
                            Your account data is retained for the lifetime of your workspace. You may request full
                            deletion of your studio data, project records, and personal information at any time by
                            writing to <a href="mailto:hello@kaliprlabs.in" style={{ color: '#C87A53', textDecoration: 'underline' }}>hello@kaliprlabs.in</a>.
                        </p>
                        <p>
                            Deletion requests are processed within 14 business days. Invoices already delivered to clients
                            via public links remain accessible until their expiry, as removing them would affect client records.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            6. Contact
                        </h2>
                        <p>
                            For any privacy-related inquiries, please contact the Kalipr Labs data team at{' '}
                            <a href="mailto:hello@kaliprlabs.in" style={{ color: '#C87A53', textDecoration: 'underline' }}>hello@kaliprlabs.in</a>.
                            We respond to all data-related enquiries within 2 business days.
                        </p>
                    </section>

                </div>

                {/* Back to home */}
                <div className="mt-16 pt-10 border-t" style={{ borderColor: '#E8DDD0' }}>
                    <Link href="/" className="text-xs font-mono uppercase tracking-widest hover:opacity-70 transition-opacity"
                        style={{ color: '#C87A53' }}>
                        ← Return to Kalvora
                    </Link>
                </div>
            </div>
        </main>
    );
}

