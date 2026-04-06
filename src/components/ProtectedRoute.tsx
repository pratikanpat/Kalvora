'use client';

import { useAuth } from './AuthProvider';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center">
                <LoadingSpinner text="Checking authentication..." />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center">
                <LoadingSpinner text="Redirecting to login..." />
            </div>
        );
    }

    return <>{children}</>;
}
