'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, LogIn, Sparkles, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (authError) {
                if (authError.message.includes('Invalid login credentials')) {
                    setError('Invalid email or password. Please try again.');
                } else if (authError.message.includes('Email not confirmed')) {
                    setError('Please confirm your email address before logging in.');
                } else {
                    setError(authError.message);
                }
                return;
            }

            router.replace('/dashboard');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                },
            });
            if (authError) {
                setError(authError.message);
                setGoogleLoading(false);
            }
        } catch {
            setError('Failed to connect to Google. Please try again.');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Home link */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#5a5a70] hover:text-brand-400 transition-colors mb-8">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 shadow-xl shadow-brand-700/30 mb-5">
                        <Sparkles size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">K A L V O R A</h1>
                    <p className="text-[#5a5a70] text-sm mt-1.5">Sign in to your account</p>
                </div>

                {/* Form */}
                <div className="glass-card p-8">
                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#2a2a40] bg-[#12121a] hover:bg-[#1a1a2e] text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                    >
                        {googleLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        )}
                        {googleLoading ? 'Connecting...' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#2a2a40]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-[#12121a] text-[#5a5a70]">or sign in with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="input-label">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="input-field pl-10"
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="input-label mb-0">Password</label>
                                <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input-field pl-10 pr-10"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70] hover:text-[#8888a0] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <LogIn size={18} />
                            )}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[#5a5a70] text-sm mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
