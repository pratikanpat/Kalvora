'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    FilePlus,
    PanelLeftClose,
    PanelLeft,
    Sparkles,
} from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/create', label: 'New Project', icon: FilePlus },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-30 lg:hidden bg-[#1a1a2e] border border-[#2a2a40] p-2.5 rounded-xl text-[#8888a0] hover:text-[#f0f0f5] transition-colors shadow-lg shadow-black/30"
                aria-label="Open menu"
            >
                <PanelLeft size={20} />
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen z-50
          bg-gradient-to-b from-[#0d0d16] to-[#0a0a12] border-r border-[#1a1a2e]
          flex flex-col transition-all duration-300 ease-out
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                {/* Logo */}
                <div className={`flex items-center h-[72px] px-5 border-b border-[#1a1a2e]/80 ${collapsed ? 'justify-center px-3' : 'gap-3'}`}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-700/25">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    {!collapsed && (
                        <div className="animate-fade-in">
                            <h1 className="text-[15px] font-bold text-white tracking-tight">K A L V O R A</h1>
                            <p className="text-[10px] text-[#5a5a70] font-medium tracking-[0.15em] uppercase">Design Studio</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-5 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${isActive
                                        ? 'bg-brand-700/15 text-brand-400 shadow-sm shadow-brand-700/10'
                                        : 'text-[#6a6a80] hover:text-[#f0f0f5] hover:bg-[#1a1a2e]/60'
                                    }
                  ${collapsed ? 'justify-center' : ''}
                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-r-full" />
                                )}
                                <Icon size={20} className="flex-shrink-0" />
                                {!collapsed && <span className="animate-fade-in">{item.label}</span>}
                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-xs text-[#f0f0f5] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl shadow-black/30">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <div className="p-3 border-t border-[#1a1a2e]/80 hidden lg:block">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#5a5a70] hover:text-[#8888a0] hover:bg-[#1a1a2e]/60 transition-all duration-200"
                    >
                        <PanelLeftClose
                            size={18}
                            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                        />
                        {!collapsed && <span>Collapse</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
