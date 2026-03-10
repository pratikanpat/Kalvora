'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardLoading() {
    return (
        <DashboardLayout>
            <LoadingSpinner text="Loading your projects..." />
        </DashboardLayout>
    );
}
