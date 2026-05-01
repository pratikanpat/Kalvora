'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Mail, Lock, UserPlus, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { validateEmail } from '@/lib/validators';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Redirect if already logged in
    const { session: existingSession, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && existingSession) {
            router.replace('/');
        }
    }, [authLoading, existingSession, router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            setError(emailCheck.message!);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const { error: authError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    setError('This email is already registered. Try signing in instead.');
                } else {
                    setError(authError.message);
                }
                return;
            }

            // Supabase auto-signs-in after signup (if email confirmation is disabled)
            // Wait briefly for AuthProvider to process the SIGNED_IN event
            await new Promise(resolve => setTimeout(resolve, 100));
            router.replace('/');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
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
        <div className="min-h-screen bg-[#F6F3EF] flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Home link */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#78716C] hover:text-[#3E2F2B] transition-colors mb-8">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                {/* Logo */}
                <div className="text-center mb-12">
                    <h1 className="brand-wordmark text-4xl mb-3">Kalvora</h1>
                    <p className="text-[#6F6A66] text-sm">Create your account</p>
                </div>

                {/* Form */}
                <div className="bg-white border border-[#E8E3DD] rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(30,30,30,0.06)' }}>
                    <div className="h-1 bg-gradient-to-r from-[#C47A5A] to-[#3E2F2B]" />
                    <div className="p-8">
                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[10px] border border-[#E8E3DD] bg-white hover:bg-[#F0EBE6] text-[#1E1E1E] text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                    >
                        {googleLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        {googleLoading ? 'Connecting...' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#E8E3DD]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-[#6F6A66]">or sign up with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {error && (
                            <div className="bg-[#FDF2F2] border border-[#F5D0D0] rounded-[10px] px-4 py-3 text-[#B85C5C] text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="input-label">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
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
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    className="input-field pl-10 pr-10"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#6F6A66] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="input-field pl-10"
                                    autoComplete="new-password"
                                />
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
                                <UserPlus size={18} />
                            )}
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[#78716C] text-sm mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#3E2F2B] hover:text-[#2F2421] font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
