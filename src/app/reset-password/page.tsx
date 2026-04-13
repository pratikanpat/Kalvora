'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Lock, Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [sessionChecked, setSessionChecked] = useState(false);

    // Supabase sends the user here with an access_token in the URL hash.
    // The onAuthStateChange listener in AuthProvider will pick it up automatically.
    useEffect(() => {
        // Give Supabase a moment to process the recovery token from the URL
        const timer = setTimeout(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (!session) {
                    setError('Invalid or expired reset link. Please request a new one.');
                }
                setSessionChecked(true);
            });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess(true);
            setTimeout(() => router.replace('/dashboard'), 2500);
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
                    <h2 className="text-lg font-semibold text-white mb-1">Set New Password</h2>
                    <p className="text-[#5a5a70] text-sm">Choose a strong password for your account</p>
                </div>

                <div className="glass-card p-8">
                    {success ? (
                        /* Success State */
                        <div className="text-center py-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                                <CheckCircle2 size={32} className="text-emerald-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Password Updated!</h3>
                            <p className="text-[#8888a0] text-sm">
                                Redirecting you to the dashboard...
                            </p>
                        </div>
                    ) : !sessionChecked ? (
                        <div className="text-center py-8">
                            <Loader2 size={24} className="animate-spin text-brand-400 mx-auto mb-3" />
                            <p className="text-[#5a5a70] text-sm">Verifying your reset link...</p>
                        </div>
                    ) : (
                        /* Password Form */
                        <form onSubmit={handleReset} className="space-y-5">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm animate-fade-in">
                                    {error}
                                    {error.includes('expired') && (
                                        <Link href="/forgot-password" className="block mt-2 text-brand-400 hover:text-brand-300 font-medium">
                                            Request a new link →
                                        </Link>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="input-label">New Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        className="input-field pl-10 pr-10"
                                        autoComplete="new-password"
                                        autoFocus
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

                            <div>
                                <label className="input-label">Confirm New Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
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
                                    <Lock size={18} />
                                )}
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
