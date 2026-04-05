'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute waits for auth to finish loading, then checks for a session.
 * If the session is temporarily lost (e.g. during a token refresh), we wait
 * up to GRACE_PERIOD_MS before redirecting. This prevents flicker-redirects
 * caused by transient token-refresh failures.
 */
const GRACE_PERIOD_MS = 3000;

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, loading } = useAuth();
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);
    const graceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hadSession = useRef(false);

    // Track whether we ever had a session in this mount cycle.
    useEffect(() => {
        if (session) {
            hadSession.current = true;
            // If we had started a redirect grace period, cancel it.
            if (graceTimer.current) {
                clearTimeout(graceTimer.current);
                graceTimer.current = null;
            }
            setRedirecting(false);
        }
    }, [session]);

    useEffect(() => {
        if (loading) return;

        if (!session) {
            if (hadSession.current) {
                // Session was lost AFTER we had one — this might be a transient
                // token refresh failure. Give the AuthProvider time to recover.
                if (!graceTimer.current) {
                    graceTimer.current = setTimeout(() => {
                        // After the grace period, if still no session, redirect.
                        setRedirecting(true);
                        router.replace('/login');
                    }, GRACE_PERIOD_MS);
                }
            } else {
                // Never had a session at all — redirect immediately.
                router.replace('/login');
            }
        }

        return () => {
            if (graceTimer.current) {
                clearTimeout(graceTimer.current);
                graceTimer.current = null;
            }
        };
    }, [loading, session, router]);

    if (loading || redirecting) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center">
                <LoadingSpinner text="Checking authentication..." />
            </div>
        );
    }

    if (!session) {
        // If we had a session before, show a loading state while the grace period runs.
        // If we never had a session, this will briefly flash before the redirect kicks in.
        return (
            <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center">
                <LoadingSpinner text={hadSession.current ? "Reconnecting session..." : "Redirecting to login..."} />
            </div>
        );
    }

    return <>{children}</>;
}
