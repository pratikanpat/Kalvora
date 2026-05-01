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

                    {/* Footer — minimal per spec */}
                    <footer className="lg:ml-0 border-t border-[#E8E3DD] mt-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex flex-col items-center text-center gap-3">
                                <p className="text-[#78716C] text-xs">
                                    &copy; 2026 <span className="brand-wordmark-inline text-[#78716C] text-xs">Kalvora</span>. All rights reserved.
                                </p>
                                <div className="flex items-center gap-2 text-[#78716C] text-xs">
                                    <span className="hover:text-[#6F6A66] cursor-pointer transition-colors">Privacy</span>
                                    <span className="text-[#E8E3DD]">·</span>
                                    <span className="hover:text-[#6F6A66] cursor-pointer transition-colors">Terms</span>
                                    <span className="text-[#E8E3DD]">·</span>
                                    <span className="hover:text-[#6F6A66] cursor-pointer transition-colors">Contact</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </ProtectedRoute>
    );
}
