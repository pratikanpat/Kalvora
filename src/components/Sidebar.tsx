'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import {
    Home,
    LayoutDashboard,
    FilePlus,
    FileText,
    MessageSquare,
    PanelLeftClose,
    PanelLeft,
    Sparkles,
    LogOut,
    User,
    Building,
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/create', label: 'Create Proposal', icon: FilePlus },
    { href: '/profile', label: 'Studio Profile', icon: Building },
    { href: '/feedback', label: 'Feedback', icon: MessageSquare },
];

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, signOut } = useAuth();
    const [profileIncomplete, setProfileIncomplete] = useState(false);

    const userEmail = user?.email || '';
    const truncatedEmail = userEmail.length > 22 ? userEmail.slice(0, 20) + '…' : userEmail;

    // Check profile completeness
    useEffect(() => {
        if (!user) return;

        const checkProfile = () => {
            supabase
                .from('designer_profiles')
                .select('studio_name, designer_name, email')
                .eq('user_id', user.id)
                .single()
                .then(({ data, error }) => {
                    if (error || !data) {
                        setProfileIncomplete(true);
                    } else {
                        const hasName = !!(data.studio_name || data.designer_name);
                        const hasEmail = !!data.email;
                        setProfileIncomplete(!hasName || !hasEmail);
                    }
                });
        };

        checkProfile();

        // Listen for profile-updated event (fired from profile page after save)
        window.addEventListener('profile-updated', checkProfile);
        return () => window.removeEventListener('profile-updated', checkProfile);
    }, [user, pathname]);

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
                <Link href="/" className={`flex items-center h-[72px] px-5 border-b border-[#1a1a2e]/80 hover:bg-[#1a1a2e]/30 transition-colors ${collapsed ? 'justify-center px-3' : 'gap-3'}`}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-700/25">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    {!collapsed && (
                        <div className="animate-fade-in">
                            <h1 className="text-[15px] font-bold text-white tracking-tight">K A L V O R A</h1>
                            <p className="text-[10px] text-[#5a5a70] font-medium tracking-[0.15em] uppercase">Design Studio</p>
                        </div>
                    )}
                </Link>

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
                                <Icon size={20} className="flex-shrink-0 relative" />
                                {/* Red dot for incomplete profile */}
                                {item.href === '/profile' && profileIncomplete && (
                                    <div className="absolute top-1.5 left-7 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0d0d16] animate-pulse" />
                                )}
                                {!collapsed && <span className="animate-fade-in">{item.label}</span>}
                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-xs text-[#f0f0f5] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl shadow-black/30">
                                        {item.label}
                                        {item.href === '/profile' && profileIncomplete && (
                                            <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info & Logout */}
                <div className="border-t border-[#1a1a2e]/80 p-3 space-y-1">
                    {/* User email */}
                    {user && (
                        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
                            <div className="w-7 h-7 rounded-lg bg-brand-700/20 border border-brand-700/30 flex items-center justify-center flex-shrink-0">
                                <User size={14} className="text-brand-400" />
                            </div>
                            {!collapsed && (
                                <span className="text-[#8888a0] text-xs font-medium truncate animate-fade-in" title={userEmail}>
                                    {truncatedEmail}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Logout */}
                    <button
                        onClick={() => { setMobileOpen(false); signOut(); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#5a5a70] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group relative ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        {!collapsed && <span className="animate-fade-in">Log out</span>}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-xs text-[#f0f0f5] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl shadow-black/30">
                                Log out
                            </div>
                        )}
                    </button>

                    {/* Collapse toggle - desktop only */}
                    <div className="hidden lg:block">
                        <button
                            onClick={onToggleCollapse}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#5a5a70] hover:text-[#8888a0] hover:bg-[#1a1a2e]/60 transition-all duration-200"
                        >
                            <PanelLeftClose
                                size={18}
                                className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                            />
                            {!collapsed && <span>Collapse</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
