import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service — Kalvora',
    description: 'Terms and conditions for using the Kalvora studio management platform.',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen" style={{ background: '#FDFCFB', color: '#1A1512' }}>
            {/* Header bar */}
            <div className="border-b" style={{ borderColor: '#E8DDD0' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <Link href="/" className="brand-wordmark text-lg" style={{ color: '#C5A880', letterSpacing: '0.4em' }}>
                        KALVORA
                    </Link>
                    <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#78716C' }}>
                        Terms of Service
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
                        Terms of <span className="italic" style={{ color: '#C5A880' }}>Service</span>
                    </h1>
                    <p className="text-sm font-light leading-relaxed" style={{ color: '#78716C', maxWidth: '540px' }}>
                        These Terms of Service govern your access to and use of the Kalvora platform,
                        engineered by Kalipr Labs. By creating a workspace, you agree to these terms.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-12 text-sm font-light leading-relaxed" style={{ color: '#57534E' }}>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            1. Workspace Use
                        </h2>
                        <p className="mb-3">
                            Kalvora grants active accounts a personal, non-transferable, limited licence to access the
                            spatial program builder, generate design pitch documents, and download client-ready contract
                            proposals and GST invoices.
                        </p>
                        <p>
                            Your workspace is for professional studio use only. You may not use Kalvora to generate
                            fraudulent invoices, misrepresent project costs to clients, or reproduce the platform interface
                            for commercial resale.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            2. Pricing Calculations &amp; Tax Accountability
                        </h2>
                        <p className="mb-3">
                            The platform calculates project totals based on metrics entered directly by the design studio.
                            The studio remains fully accountable for validating all itemised tax rules, GST classifications,
                            currency parameters, and payment timeline schedules before delivering a digital pitch link to their client.
                        </p>
                        <p>
                            Kalvora provides calculation tools and invoice templates as a convenience. We do not provide
                            chartered accountancy, legal, or tax advisory services. All financial decisions remain the
                            sole responsibility of the account holder.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            3. Service Availability
                        </h2>
                        <p className="mb-3">
                            Kalvora is an optimisation pipeline engine for interior design studios. The platform is not
                            responsible for any client payment disputes, project delays, scope disagreements, or contract
                            cancellations that occur after a client clicks the digital authorisation block.
                        </p>
                        <p>
                            We target 99.5% uptime on a rolling monthly basis. Scheduled maintenance windows are communicated
                            via the platform dashboard. Emergency patches may be applied without notice to maintain data security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            4. Early Access Terms
                        </h2>
                        <p className="mb-3">
                            During the Early Access period, all Kalvora features are provided free of charge with no credit
                            card requirement. Early Access accounts will receive a minimum 50% lifetime discount when Pro
                            pricing is introduced.
                        </p>
                        <p>
                            Kalipr Labs reserves the right to modify platform features, pricing structures, and access tiers
                            with reasonable notice communicated to registered accounts via email.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            5. Intellectual Property
                        </h2>
                        <p className="mb-3">
                            All design pitch documents, invoices, and project records you create within Kalvora remain
                            the intellectual property of your studio. Kalipr Labs does not claim ownership over any content
                            you generate using the platform.
                        </p>
                        <p>
                            The Kalvora platform, interface, design system, and underlying engineering architecture are
                            the exclusive property of Kalipr Labs. You may not reverse-engineer, copy, or redistribute
                            any part of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold mb-4 uppercase tracking-widest text-xs font-mono" style={{ color: '#1A1512' }}>
                            6. Governing Law
                        </h2>
                        <p>
                            These terms are governed by the laws of India. Any disputes arising from your use of the Kalvora
                            platform shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.
                            For questions, contact us at{' '}
                            <a href="mailto:hello@kaliprlabs.in" style={{ color: '#C87A53', textDecoration: 'underline' }}>hello@kaliprlabs.in</a>.
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

