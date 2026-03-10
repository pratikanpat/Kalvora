'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import DashboardLayout from '@/components/DashboardLayout';

export default function CreateLoading() {
    return (
        <DashboardLayout>
            <LoadingSpinner text="Loading editor..." />
        </DashboardLayout>
    );
}
