'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ProtectedRoute from './ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#0a0a0f] page-bg flex flex-col">
                <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
                <main
                    className={`transition-all duration-300 flex-1 flex flex-col ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8 flex-1 w-full">
                        {children}
                    </div>

                    {/* Footer */}
                    <footer className="lg:ml-0 border-t border-[#1a1a2e] bg-[#08080d]/80 backdrop-blur-sm mt-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex flex-col items-center text-center gap-4">
                                <p className="text-[#5a5a70] text-sm">
                                    &copy; 2026 <span className="brand-wordmark-inline text-[#8888a0] text-sm">Kalvora</span>. All rights reserved.
                                </p>
                                <p className="text-[#5a5a70] text-sm">
                                    Crafted with obsession by{' '}
                                    <span className="text-[#8888a0] font-medium">Kalipr Labs</span>
                                </p>
                                <div className="flex items-center gap-2 text-[#5a5a70] text-xs">
                                    <span className="hover:text-[#8888a0] cursor-pointer transition-colors">Privacy Policy</span>
                                    <span className="text-[#2a2a40]">·</span>
                                    <span className="hover:text-[#8888a0] cursor-pointer transition-colors">Terms of Service</span>
                                    <span className="text-[#2a2a40]">·</span>
                                    <span className="hover:text-[#8888a0] cursor-pointer transition-colors">Contact</span>
                                </div>
                                <div className="text-[#3a3a50] text-xs space-y-1">
                                    <p><span className="brand-wordmark-inline">Kalvora</span> is a product of Kalipr Labs.</p>
                                    <p>Designed for interior design professionals.</p>
                                </div>
                                <p className="text-[#2a2a40] text-[10px] uppercase tracking-widest font-medium">
                                    Version 1.0.0
                                </p>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </ProtectedRoute>
    );
}
