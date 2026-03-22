'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import LoadingSpinner from '@/components/LoadingSpinner';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace('/login');
            return;
        }

        const email = user.email?.toLowerCase() || '';
        if (!ADMIN_EMAILS.includes(email)) {
            router.replace('/dashboard');
            return;
        }

        setAuthorized(true);
    }, [user, loading, router]);

    if (loading || !authorized) {
        return <LoadingSpinner />;
    }

    return <>{children}</>;
}
