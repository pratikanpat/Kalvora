'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
    MessageSquare, Send, Loader2, CheckCircle2, ArrowLeft,
    Sparkles, User, Mail
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const BLOCKER_OPTIONS = [
    'Didn\'t understand what it does',
    'Looks too basic for my needs',
    'I already use another tool',
    'No pricing clarity',
    'Need more features first',
    'Just browsing',
];

export default function PublicFeedbackPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [blockers, setBlockers] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const toggleBlocker = (blocker: string) => {
        setBlockers(prev =>
            prev.includes(blocker) ? prev.filter(b => b !== blocker) : [...prev, blocker]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (blockers.length === 0 && !message.trim()) {
            toast.error('Please select at least one option or leave a message.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('feedback').insert({
                name: name.trim() || 'Anonymous Visitor',
                email: email.trim() || null,
                message: message.trim() || null,
                prior_tools: blockers,
                feedback_type: 'public_landing',
                user_id: null,
            });

            if (error) {
                toast.error('Failed to submit. Please try again.');
                console.error('Public feedback error:', error);
                return;
            }

            toast.success('Thank you for your feedback!');
            setSubmitted(true);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
            <Toaster position="top-center" />

            {/* Minimal nav */}
            <nav className="px-4 sm:px-6 lg:px-8 py-4">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#8888a0] hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    Back to Kalvora
                </Link>
            </nav>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-4 pb-16">
                <div className="max-w-lg w-full animate-fade-in">

                    {submitted ? (
                        /* ══════ SUCCESS ══════ */
                        <div className="glass-card p-8 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 mb-6">
                                <CheckCircle2 size={40} className="text-green-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Thank You!</h2>
                            <p className="text-[#8888a0] text-sm mb-6 max-w-sm mx-auto">
                                Your feedback is incredibly valuable. Every response is read personally by our team.
                            </p>
                            <Link href="/" className="btn-primary text-sm px-6 py-2.5 rounded-xl">
                                Explore Kalvora
                            </Link>
                        </div>
                    ) : (
                        /* ══════ FORM ══════ */
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-700/15 border border-brand-700/25 mb-5">
                                    <Sparkles size={24} className="text-brand-400" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    Help Us Build Better
                                </h1>
                                <p className="text-[#8888a0] text-sm max-w-md mx-auto">
                                    What almost stopped you from trying Kalvora today? Your honest answer helps us improve.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Quick select blockers */}
                                <div className="glass-card p-6">
                                    <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                                        <MessageSquare size={14} className="text-brand-400" />
                                        What held you back? *
                                    </h3>
                                    <p className="text-[#5a5a70] text-xs mb-4">Select all that apply</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {BLOCKER_OPTIONS.map(opt => (
                                            <button
                                                type="button"
                                                key={opt}
                                                onClick={() => toggleBlocker(opt)}
                                                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200 ${blockers.includes(opt)
                                                    ? 'border-brand-500/50 bg-brand-700/10 text-brand-300'
                                                    : 'border-[#2a2a40] bg-[#12121a] text-[#8888a0] hover:border-[#3a3a55] hover:text-white'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${blockers.includes(opt) ? 'border-brand-500 bg-brand-500' : 'border-[#3a3a55]'}`}>
                                                    {blockers.includes(opt) && (
                                                        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    )}
                                                </div>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Open message */}
                                <div className="glass-card p-6">
                                    <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                                        <MessageSquare size={14} className="text-[#5a5a70]" />
                                        Anything else you want to tell us?
                                    </h3>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Your thoughts, suggestions, or what would make you sign up..."
                                        rows={3}
                                        className="input-field resize-none"
                                    />
                                </div>

                                {/* Optional identity */}
                                <div className="glass-card p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="input-label">Name <span className="text-[#5a5a70]">(optional)</span></label>
                                            <div className="relative">
                                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Your name"
                                                    className="input-field pl-10"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="input-label">Email <span className="text-[#5a5a70]">(optional)</span></label>
                                            <div className="relative">
                                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a70]" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    className="input-field pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full justify-center py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                    {loading ? 'Submitting...' : 'Submit Feedback'}
                                </button>

                                <p className="text-center text-[#5a5a70] text-xs">
                                    Your input directly shapes our roadmap
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
