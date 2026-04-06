'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

// ─── Module-level singleton subscription ───────────────────────────
// This prevents React Strict Mode (dev double-mount) from creating
// duplicate onAuthStateChange listeners, which was causing a token
// refresh loop → 429 rate limit → forced SIGNED_OUT.
type AuthCallback = (event: AuthChangeEvent, session: Session | null) => void;
let globalSubscription: { unsubscribe: () => void } | null = null;
let subscriberCount = 0;
const listeners = new Set<AuthCallback>();

function subscribeToAuth(cb: AuthCallback) {
    listeners.add(cb);
    subscriberCount++;

    // Only create the actual Supabase subscription once
    if (!globalSubscription) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // Fan out to all registered listeners
                listeners.forEach(fn => fn(event, session));
            }
        );
        globalSubscription = subscription;
    }

    // Return cleanup function
    return () => {
        listeners.delete(cb);
        subscriberCount--;
        if (subscriberCount <= 0 && globalSubscription) {
            globalSubscription.unsubscribe();
            globalSubscription = null;
            subscriberCount = 0;
        }
    };
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // 1. Get the initial session reliably from storage.
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            if (!mounted) return;
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setLoading(false);
        }).catch(() => {
            if (mounted) setLoading(false);
        });

        // 2. Listen for auth events via the singleton subscription.
        const unsubscribe = subscribeToAuth((event, newSession) => {
            if (!mounted) return;

            // Skip INITIAL_SESSION — getSession() above handles it.
            if (event === 'INITIAL_SESSION') return;

            if (event === 'SIGNED_OUT') {
                // Before clearing session, verify it's a genuine sign-out
                // and not a false one triggered by a 429 rate limit.
                supabase.auth.getSession().then(({ data: { session: checkSession } }) => {
                    if (!mounted) return;
                    if (checkSession) {
                        // Session still exists in storage — this was a false SIGNED_OUT
                        // from a failed token refresh. Keep the session.
                        setSession(checkSession);
                        setUser(checkSession.user);
                    } else {
                        // Genuinely signed out — clear everything.
                        setSession(null);
                        setUser(null);
                    }
                    setLoading(false);
                });
                return;
            }

            // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY
            if (newSession) {
                setSession(newSession);
                setUser(newSession.user);
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        // State will be cleared by the SIGNED_OUT event handler above.
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
