'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { Sparkles, Menu, X, LayoutDashboard } from 'lucide-react';

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { session, loading } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isLoggedIn = !loading && !!session;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#2a2a40]/60 shadow-lg shadow-black/20'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-700/25 group-hover:shadow-brand-600/40 transition-shadow">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-[15px] font-bold text-white tracking-tight">
                            K A L V O R A
                        </span>
                    </Link>

                    {/* Desktop — 3 items max: Demo ghost link + primary CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className="btn-primary text-sm px-5 py-2"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/try"
                                    className="px-4 py-2 text-sm text-[#8888a0] hover:text-white transition-colors rounded-lg hover:bg-[#1a1a2e]/50"
                                >
                                    Try Demo
                                </Link>
                                <Link
                                    href="/signup"
                                    className="btn-primary text-sm px-5 py-2"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-[#8888a0] hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#0d0d16]/98 backdrop-blur-xl border-t border-[#2a2a40]/60 animate-fade-in">
                    <div className="px-4 py-4 space-y-1">
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm text-white bg-gradient-to-r from-brand-700 to-brand-600 rounded-xl font-semibold justify-center"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/try"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-sm text-[#8888a0] hover:text-white hover:bg-[#1a1a2e]/50 rounded-xl transition-colors"
                                >
                                    Try Demo
                                </Link>
                                <hr className="border-[#2a2a40] my-2" />
                                <Link
                                    href="/signup"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-sm text-white bg-gradient-to-r from-brand-700 to-brand-600 rounded-xl text-center font-semibold"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
