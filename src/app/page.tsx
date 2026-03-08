'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.replace('/dashboard');
            } else {
                router.replace('/login');
            }
            setLoading(false);
        });
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center">
                <LoadingSpinner text="Loading..." />
            </div>
        );
    }

    return null;
}
