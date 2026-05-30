import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-inter',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-playfair',
});

export const metadata: Metadata = {
    title: 'Kalvora — Proposal & Invoice Software for Interior Designers',
    description: 'Create branded PDF proposals, get client approval, and auto-generate GST invoices in minutes. Built for Indian interior designers. 100+ designers use Kalvora. Built by Kalipr Labs.',
    keywords: 'Kalvora, proposal software interior designers, invoice software interior designers India, GST invoice generator, interior designer billing software, Kalipr Labs, Pratik Anpat',
    authors: [{ name: 'Kalipr Labs', url: 'https://kaliprlabs.in' }],
    openGraph: {
        title: 'Kalvora — Proposal & Invoice Software for Interior Designers',
        description: 'Create branded PDF proposals, get client approval, and auto-generate GST invoices in minutes. Used by 100+ interior designers across India.',
        url: 'https://kalvora.kaliprlabs.in',
        siteName: 'Kalvora',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kalvora — Proposal & Invoice Software for Interior Designers',
        description: 'Create branded proposals, collect approvals, and auto-generate GST invoices. Built for Indian interior designers.',
    },
    icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.png',
        apple: '/favicon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            name: "Kalvora",
                            url: "https://kalvora.kaliprlabs.in",
                            description:
                                "Proposal and invoice software for interior designers. Create branded PDF proposals, get client approval, and auto-generate GST invoices.",
                            applicationCategory: "BusinessApplication",
                            operatingSystem: "Web",
                            creator: {
                                "@type": "Organization",
                                name: "Kalipr Labs",
                                url: "https://kaliprlabs.in",
                            },
                            author: {
                                "@type": "Person",
                                name: "Pratik Anpat",
                            },
                            offers: {
                                "@type": "Offer",
                                priceCurrency: "INR",
                            },
                        }),
                    }}
                />
            </head>
            <body className="antialiased">
                <AuthProvider>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            className: 'toast-custom',
                            duration: 4000,
                            style: {
                                background: '#FFFFFF',
                                color: '#1E1E1E',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '14px',
                                boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
                                maxWidth: '320px',
                                padding: '14px 16px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#6A9C89',
                                    secondary: '#FFFFFF',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#B85C5C',
                                    secondary: '#FFFFFF',
                                },
                            },
                        }}
                    />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
