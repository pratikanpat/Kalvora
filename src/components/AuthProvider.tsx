'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

const DEBUG = process.env.NODE_ENV === 'development';

function authLog(msg: string, data?: unknown) {
    if (DEBUG) {
        console.log(`[Auth] ${msg}`, data !== undefined ? data : '');
    }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Keep track of last known good session so we can recover from
    // transient token-refresh failures.
    const lastGoodSession = useRef<Session | null>(null);

    // Track whether the user explicitly signed out (via our signOut function).
    const explicitSignOut = useRef(false);

    // ----- Apply session helpers -----
    const applySession = useCallback((s: Session | null) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s) {
            lastGoodSession.current = s;
        }
    }, []);

    // ----- Attempt to recover a lost session -----
    // When Supabase fires SIGNED_OUT due to a failed token refresh
    // (not an explicit user sign-out) we try to recover by calling
    // getSession() one more time. If there are tokens in storage
    // the SDK will try to refresh them again.
    const attemptRecovery = useCallback(async (): Promise<boolean> => {
        authLog('Attempting session recovery...');
        try {
            const { data: { session: recovered } } = await supabase.auth.getSession();
            if (recovered) {
                authLog('Recovery successful — session restored', recovered.user?.email);
                applySession(recovered);
                return true;
            }

            // Second attempt: if getSession failed, try refreshSession explicitly
            authLog('getSession returned null, trying refreshSession...');
            const { data: { session: refreshed } } = await supabase.auth.refreshSession();
            if (refreshed) {
                authLog('refreshSession successful', refreshed.user?.email);
                applySession(refreshed);
                return true;
            }
        } catch (err) {
            authLog('Recovery failed with error', err);
        }
        return false;
    }, [applySession]);

    useEffect(() => {
        let mounted = true;
        let recoveryTimer: ReturnType<typeof setTimeout> | null = null;

        // -------- 1. Bootstrap: get the current session --------
        const bootstrap = async () => {
            authLog('Bootstrapping auth state...');

            try {
                // First try getSession (reads from localStorage + auto-refreshes if expired)
                const { data: { session: initialSession }, error } = await supabase.auth.getSession();

                if (!mounted) return;

                if (error) {
                    authLog('getSession error', error.message);
                }

                if (initialSession) {
                    authLog('Bootstrap: found session', initialSession.user?.email);
                    applySession(initialSession);
                    setLoading(false);
                    return;
                }

                authLog('Bootstrap: no session found');
                setLoading(false);
            } catch (err) {
                authLog('Bootstrap error', err);
                if (mounted) setLoading(false);
            }
        };

        bootstrap();

        // -------- 2. Subscribe to auth changes --------
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, newSession: Session | null) => {
                if (!mounted) return;

                authLog(`Auth event: ${event}`, {
                    hasSession: !!newSession,
                    email: newSession?.user?.email,
                });

                switch (event) {
                    case 'SIGNED_IN':
                    case 'TOKEN_REFRESHED':
                    case 'USER_UPDATED':
                        // These are all "good" events — apply the new session.
                        if (newSession) {
                            applySession(newSession);
                        } else {
                            // TOKEN_REFRESHED with null session should NOT happen,
                            // but if it does, don't clear session — attempt recovery.
                            authLog(`WARNING: ${event} fired with null session — ignoring, attempting recovery`);
                            if (recoveryTimer) clearTimeout(recoveryTimer);
                            recoveryTimer = setTimeout(async () => {
                                if (!mounted) return;
                                const recovered = await attemptRecovery();
                                if (!recovered && mounted) {
                                    authLog('Recovery after bad TOKEN_REFRESHED failed — clearing session');
                                    applySession(null);
                                }
                            }, 1000);
                        }
                        setLoading(false);
                        break;

                    case 'SIGNED_OUT':
                        if (explicitSignOut.current) {
                            // User explicitly signed out via our signOut() function.
                            authLog('Explicit sign-out — clearing session');
                            applySession(null);
                            explicitSignOut.current = false;
                            setLoading(false);
                        } else {
                            // Supabase fired SIGNED_OUT on its own — likely a failed
                            // token refresh. DO NOT immediately clear session.
                            authLog('Unexpected SIGNED_OUT — attempting recovery before clearing');
                            if (recoveryTimer) clearTimeout(recoveryTimer);
                            recoveryTimer = setTimeout(async () => {
                                if (!mounted) return;
                                const recovered = await attemptRecovery();
                                if (!recovered && mounted) {
                                    authLog('Recovery failed — session truly expired, clearing');
                                    applySession(null);
                                }
                            }, 1500);
                        }
                        break;

                    case 'INITIAL_SESSION':
                        // INITIAL_SESSION fires once when onAuthStateChange is set up.
                        // Apply whatever session the SDK gives us.
                        applySession(newSession);
                        setLoading(false);
                        break;

                    case 'PASSWORD_RECOVERY':
                        // Password recovery — don't clear session
                        if (newSession) applySession(newSession);
                        setLoading(false);
                        break;

                    default:
                        authLog(`Unknown auth event: ${event}`);
                        if (newSession) applySession(newSession);
                        setLoading(false);
                        break;
                }
            }
        );

        return () => {
            mounted = false;
            if (recoveryTimer) clearTimeout(recoveryTimer);
            subscription.unsubscribe();
        };
    }, [applySession, attemptRecovery]);

    const signOut = useCallback(async () => {
        // Mark as explicit so the auth change handler knows this is intentional.
        explicitSignOut.current = true;
        authLog('Explicit sign-out initiated');
        await supabase.auth.signOut();
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
