'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import {
    Home, LayoutDashboard, FilePlus, FileText, MessageSquare,
    PanelLeftClose, PanelLeft, LogOut, User, Building, CheckSquare,
} from 'lucide-react';
import LogoutFeedbackModal from './LogoutFeedbackModal';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/completed', label: 'Completed Projects', icon: CheckSquare },
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
    const [showLogoutModal, setShowLogoutModal] = useState(false);

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
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-30 lg:hidden bg-[#F0EBE6] border border-[#E8E3DD] p-2.5 rounded-[10px] text-[#78716C] hover:text-[#1E1E1E] transition-colors"
                aria-label="Open menu"
            >
                <PanelLeft size={20} />
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen z-50
          bg-[#F6F3EF] border-r border-[#E8E3DD]
          flex flex-col transition-colors duration-200 ease-out
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                {/* Logo */}
                <Link href="/" className={`flex items-center h-[72px] px-5 border-b border-[#E8E3DD] hover:bg-[#F0EBE6] transition-colors ${collapsed ? 'justify-center px-3' : ''}`}>
                    {collapsed ? (
                        <span className="brand-wordmark text-lg">K</span>
                    ) : (
                        <h1 className="brand-wordmark text-[22px]">Kalvora</h1>
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
                  flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium
                  transition-all duration-150 group relative
                  ${isActive
                                        ? 'bg-[#F0EBE6] text-[#3E2F2B]'
                                        : 'text-[#6F6A66] hover:text-[#1E1E1E] hover:bg-[#F6F3EF]'
                                    }
                  ${collapsed ? 'justify-center' : ''}
                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#C47A5A] rounded-r-full" />
                                )}
                                <Icon size={20} className="flex-shrink-0 relative" />
                                {/* Red dot for incomplete profile */}
                                {item.href === '/profile' && profileIncomplete && (
                                    <div className="absolute top-1.5 left-7 w-2 h-2 rounded-full bg-[#B85C5C] ring-2 ring-[#F6F3EF]" />
                                )}
                                {!collapsed && <span>{item.label}</span>}
                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-white rounded-lg text-xs text-[#1E1E1E] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50" style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' }}>
                                        {item.label}
                                        {item.href === '/profile' && profileIncomplete && (
                                            <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#B85C5C]" />
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info & Logout */}
                <div className="border-t border-[#E8E3DD] p-3 space-y-1">
                    {/* User email */}
                    {user && (
                        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] ${collapsed ? 'justify-center' : ''}`}>
                            <div className="w-7 h-7 rounded-lg bg-[#F0EBE6] border border-[#D9D1C9] flex items-center justify-center flex-shrink-0">
                                <User size={14} className="text-[#3E2F2B]" />
                            </div>
                            {!collapsed && (
                                <span className="text-[#6F6A66] text-xs font-medium truncate" title={userEmail}>
                                    {truncatedEmail}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Logout */}
                    <button
                        onClick={() => { setMobileOpen(false); setShowLogoutModal(true); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-[10px] text-sm text-[#78716C] hover:text-[#B85C5C] hover:bg-[#FDF2F2] transition-all duration-150 group relative ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        {!collapsed && <span>Log out</span>}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-2.5 py-1 bg-white rounded-lg text-xs text-[#1E1E1E] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50" style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' }}>
                                Log out
                            </div>
                        )}
                    </button>

                    {/* Collapse toggle - desktop only */}
                    <div className="hidden lg:block">
                        <button
                            onClick={onToggleCollapse}
                            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-[10px] text-sm text-[#78716C] hover:text-[#6F6A66] hover:bg-[#F0EBE6] transition-all duration-150"
                        >
                            <PanelLeftClose
                                size={18}
                                className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
                            />
                            {!collapsed && <span>Collapse</span>}
                        </button>
                    </div>
                </div>
            </aside>

            <LogoutFeedbackModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirmLogout={() => {
                    setShowLogoutModal(false);
                    signOut();
                }}
                userId={user?.id}
            />
        </>
    );
}
