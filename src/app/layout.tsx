import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
    title: 'K A L V O R A — Interior Design Proposal Generator',
    description: 'Create beautiful, branded PDF proposals for your interior design clients. Free, fast, professional.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
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
