'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { MessageSquare, Send, Loader2, CheckCircle2, User, Mail, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedbackPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter your name.');
            return;
        }

        if (!message.trim()) {
            toast.error('Please enter your message.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('feedback').insert({
                name: name.trim(),
                email: email.trim() || null,
                message: message.trim(),
            });

            if (error) {
                toast.error('Failed to submit feedback. Please try again.');
                console.error('Feedback error:', error);
                return;
            }

            toast.success('Thank you for your feedback!');
            setName('');
            setEmail('');
            setMessage('');
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-brand-700/15 border border-brand-700/25 flex items-center justify-center">
                            <MessageSquare size={20} className="text-brand-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Feedback</h1>
                            <p className="text-[#5a5a70] text-sm">Share your thoughts and help us improve Kalvora</p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-card p-8">
                    {submitted ? (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 mb-6 animate-pulse-glow">
                                <CheckCircle2 size={40} className="text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-[#8888a0] text-sm mb-6">
                                Your feedback has been submitted successfully. We appreciate your input!
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="btn-secondary text-sm"
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="input-label">Name</label>
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

                            {/* Email */}
                            <div>
                                <label className="input-label">Email (optional)</label>
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

                            {/* Message */}
                            <div>
                                <label className="input-label">Message</label>
                                <div className="relative">
                                    <FileText size={16} className="absolute left-3.5 top-4 text-[#5a5a70]" />
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Your thoughts, suggestions, or feedback..."
                                        rows={5}
                                        className="input-field pl-10 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full justify-center py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                                {loading ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
