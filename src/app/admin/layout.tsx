'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import {
    BarChart3, MessageSquare, Users, ArrowLeft, Shield
} from 'lucide-react';

const adminNav = [
    { label: 'Overview', href: '/admin', icon: BarChart3 },
    { label: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    { label: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#0a0a0f] flex">
                {/* Admin Sidebar */}
                <aside className="hidden lg:flex flex-col w-[240px] border-r border-[#1a1a2e] bg-[#08080d]/80 backdrop-blur-sm fixed inset-y-0 left-0 z-40">
                    {/* Header */}
                    <div className="px-5 py-5 border-b border-[#1a1a2e]">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                            <div>
                                <span className="text-sm font-bold text-white tracking-tight">Admin Panel</span>
                                <p className="text-[10px] text-amber-500/70 uppercase tracking-wider font-medium">Kalvora</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {adminNav.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            : 'text-[#8888a0] hover:text-white hover:bg-[#1a1a2e]'
                                    }`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Back to Dashboard */}
                    <div className="px-3 py-4 border-t border-[#1a1a2e]">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#5a5a70] hover:text-white hover:bg-[#1a1a2e] transition-all duration-200"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </Link>
                    </div>
                </aside>

                {/* Mobile Header */}
                <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-[#08080d]/95 backdrop-blur-sm border-b border-[#1a1a2e]">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                <Shield size={14} className="text-white" />
                            </div>
                            <span className="text-sm font-bold text-white">Admin</span>
                        </div>
                        <Link href="/dashboard" className="text-xs text-[#5a5a70] hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft size={14} /> Dashboard
                        </Link>
                    </div>
                    <div className="flex gap-1 px-3 pb-2">
                        {adminNav.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                                        isActive
                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            : 'text-[#5a5a70] hover:text-white'
                                    }`}
                                >
                                    <item.icon size={14} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 lg:ml-[240px] pt-24 lg:pt-0">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
