'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, loading } = useAuth();
    const router = useRouter();
    // Track if we ever rendered children (had a valid session).
    // Once authenticated, don't redirect even if session briefly flickers.
    const wasAuthenticated = useRef(false);

    if (session) {
        wasAuthenticated.current = true;
    }

    useEffect(() => {
        // Only redirect if:
        // 1. Auth state finished loading
        // 2. No session exists
        // 3. We never had a session in this component's lifetime
        //    (prevents redirect from transient session drops)
        if (!loading && !session && !wasAuthenticated.current) {
            router.replace('/login');
        }
    }, [loading, session, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center">
                <LoadingSpinner text="Checking authentication..." />
            </div>
        );
    }

    if (!session && !wasAuthenticated.current) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center">
                <LoadingSpinner text="Redirecting to login..." />
            </div>
        );
    }

    return <>{children}</>;
}
