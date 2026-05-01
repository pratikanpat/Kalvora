'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ProtectedRoute from './ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F6F3EF] flex flex-col">
                <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
                <main
                    className={`transition-colors duration-200 flex-1 flex flex-col ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8 flex-1 w-full">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
