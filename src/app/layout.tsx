import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Kalvora - Proposals & Invoicing for Interior Designers',
    description: 'Create branded PDF proposals, get client approval, and auto-generate GST invoices in minutes. Built for Indian interior designers.',
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
        <html lang="en" className={inter.variable}>
            <body className="antialiased">
                <AuthProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            className: 'toast-custom',
                            style: {
                                background: '#1a1a2e',
                                color: '#f0f0f5',
                                border: '1px solid #2a2a40',
                                borderRadius: '12px',
                                fontSize: '14px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#40c057',
                                    secondary: '#1a1a2e',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#fa5252',
                                    secondary: '#1a1a2e',
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
