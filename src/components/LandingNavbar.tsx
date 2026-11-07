'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import DemoVideoModal from './DemoVideoModal';
import { Menu, X, LayoutDashboard, Play } from 'lucide-react';

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [demoOpen, setDemoOpen] = useState(false);
    const { session, loading } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isLoggedIn = !loading && !!session;

    return (
        <>
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'lp-nav border-b border-[#E4E0DB]'
                    : isLoggedIn ? 'bg-[#F6F3EF]' : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">
                    {/* Logo */}
                    <Link href="/" className="group">
                        <span className={`brand-wordmark text-[26px] mt-1 inline-block group-hover:opacity-75 transition-opacity ${
                            !isLoggedIn && !scrolled ? 'text-[#1A1512]' : ''
                        }`}>
                            Kalvora
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => setDemoOpen(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm text-[#6F6A66] hover:text-[#1E1E1E] transition-colors rounded-[10px] hover:bg-[#F0EBE6]"
                                >
                                    <Play size={14} className="fill-current" />
                                    Demo
                                </button>
                                <Link
                                    href="/create"
                                    className="px-4 py-2 text-sm text-[#6F6A66] hover:text-[#1E1E1E] transition-colors rounded-[10px] hover:bg-[#F0EBE6]"
                                >
                                    Create Proposal
                                </Link>
                                <Link
                                    href="/profile"
                                    className="px-4 py-2 text-sm text-[#6F6A66] hover:text-[#1E1E1E] transition-colors rounded-[10px] hover:bg-[#F0EBE6]"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="btn-primary text-sm px-5 py-2"
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <a
                                    href="#pipeline"
                                    className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#78716C] hover:text-[#1A1512] hover:bg-[#F5F2EE] transition-all duration-300 rounded-lg"
                                >
                                    How It Works
                                </a>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#78716C] hover:text-[#1A1512] hover:bg-[#F5F2EE] transition-all duration-300 rounded-lg"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="lp-btn-primary text-[11px] px-5 py-2.5"
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-[#6F6A66] hover:text-[#1E1E1E] transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#FAF8F5] border-t border-[#E4E0DB] animate-fade-in">
                    <div className="px-4 py-4 space-y-1">
                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => { setMobileOpen(false); setDemoOpen(true); }}
                                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#6F6A66] hover:text-[#1E1E1E] hover:bg-[#F0EBE6] rounded-[10px] transition-colors"
                                >
                                    <Play size={14} className="fill-current" />
                                    Watch Demo
                                </button>
                                <Link
                                    href="/create"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-sm text-[#6F6A66] hover:text-[#1E1E1E] hover:bg-[#F0EBE6] rounded-[10px] transition-colors"
                                >
                                    Create Proposal
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-sm text-[#6F6A66] hover:text-[#1E1E1E] hover:bg-[#F0EBE6] rounded-[10px] transition-colors"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 text-sm text-white bg-[#3E2F2B] rounded-[10px] font-semibold justify-center"
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <a
                                    href="#pipeline"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-sm text-[#6F6A66] hover:text-[#1E1E1E] hover:bg-[#F5F3F0] rounded-[10px] transition-colors font-medium"
                                >
                                    How It Works
                                </a>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-sm text-[#6F6A66] hover:text-[#1E1E1E] hover:bg-[#F5F3F0] rounded-[10px] transition-colors font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-sm text-white bg-[#1A1512] rounded-[10px] text-center font-semibold tracking-wide"
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>

            {/* Demo Video Modal */}
            <DemoVideoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
        </>
    );
}
