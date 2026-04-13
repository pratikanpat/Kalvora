'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                setError(resetError.message);
                return;
            }

            setSent(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] page-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Back link */}
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#5a5a70] hover:text-brand-400 transition-colors mb-8">
                    <ArrowLeft size={16} />
                    Back to Sign In
                </Link>

                {/* Logo */}
                <div className="text-center mb-12">
                    <h1 className="brand-wordmark text-4xl mb-3">Kalvora</h1>
                    <h2 className="text-lg font-semibold text-white mb-1">Reset Password</h2>
                    <p className="text-[#5a5a70] text-sm">
                        {sent ? 'Check your email for the reset link' : 'Enter your email to receive a reset link'}
                    </p>
                </div>

                <div className="glass-card p-8">
                    {sent ? (
                        /* Success State */
                        <div className="text-center py-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                                <CheckCircle2 size={32} className="text-emerald-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Email Sent!</h3>
                            <p className="text-[#8888a0] text-sm mb-1">
                                We&apos;ve sent a password reset link to:
                            </p>
                            <p className="text-brand-400 font-medium text-sm mb-6">{email}</p>
                            <p className="text-[#5a5a70] text-xs leading-relaxed">
                                Didn&apos;t receive it? Check your spam folder, or{' '}
                                <button
                                    onClick={() => { setSent(false); setEmail(''); }}
                                    className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                                >
                                    try again
                                </button>.
                            </p>
                        </div>
                    ) : (
                        /* Email Form */
                        <form onSubmit={handleSubmit} className="space-y-5">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Mail size={18} />
                                )}
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-[#5a5a70] text-sm mt-6">
                    Remember your password?{' '}
                    <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
