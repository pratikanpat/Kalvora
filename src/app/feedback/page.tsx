'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/components/AuthProvider';
import {
    MessageSquare, Send, Loader2, CheckCircle2, User, Mail,
    Star, ThumbsUp, Lightbulb, AlertCircle, ChevronRight, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const PRIOR_TOOLS = ['Word / Google Docs', 'Excel / Google Sheets', 'Manual templates / PDF', 'Other software'];

const PMF_OPTIONS = [
    { value: 'very_disappointed', label: 'Very disappointed', emoji: '😫', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/15' },
    { value: 'somewhat_disappointed', label: 'Somewhat disappointed', emoji: '😕', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15' },
    { value: 'not_disappointed', label: 'Not disappointed', emoji: '😐', color: 'text-[#8888a0]', bg: 'bg-[#12121a] border-[#2a2a40] hover:bg-[#1a1a2e]' },
];

export default function FeedbackPage() {
    const { user } = useAuth();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [priorTools, setPriorTools] = useState<string[]>([]);
    const [otherTool, setOtherTool] = useState('');
    const [easeRating, setEaseRating] = useState(0);
    const [bestFeature, setBestFeature] = useState('');
    const [frustrations, setFrustrations] = useState('');
    const [featureWish, setFeatureWish] = useState('');
    const [pmfAnswer, setPmfAnswer] = useState('');
    const [additionalThoughts, setAdditionalThoughts] = useState('');

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const togglePriorTool = (tool: string) => {
        setPriorTools(prev =>
            prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter your name.');
            return;
        }
        if (easeRating === 0) {
            toast.error('Please rate how easy it was to create a proposal.');
            return;
        }
        if (!pmfAnswer) {
            toast.error('Please answer the disappointment question.');
            return;
        }

        setLoading(true);
        try {
            const tools = [...priorTools];
            if (priorTools.includes('Other software') && otherTool.trim()) {
                tools[tools.indexOf('Other software')] = `Other: ${otherTool.trim()}`;
            }

            const { error } = await supabase.from('feedback').insert({
                name: name.trim(),
                email: email.trim() || null,
                message: additionalThoughts.trim() || null,
                prior_tools: tools,
                ease_rating: easeRating,
                best_feature: bestFeature.trim() || null,
                frustrations: frustrations.trim() || null,
                feature_wish: featureWish.trim() || null,
                pmf_answer: pmfAnswer,
                feedback_type: 'structured',
                user_id: user?.id || null,
            });

            if (error) {
                toast.error('Failed to submit feedback. Please try again.');
                console.error('Feedback error:', error);
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

    const resetForm = () => {
        setName('');
        setEmail('');
        setPriorTools([]);
        setOtherTool('');
        setEaseRating(0);
        setBestFeature('');
        setFrustrations('');
        setFeatureWish('');
        setPmfAnswer('');
        setAdditionalThoughts('');
        setSubmitted(false);
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
                            <p className="text-[#5a5a70] text-sm">Help us build what matters most to you</p>
                        </div>
                    </div>
                </div>

                {submitted ? (
                    /* ══════════════ SUCCESS STATE ══════════════ */
                    <div className="glass-card p-8">
                        <div className="text-center py-12 animate-fade-in">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 mb-6 animate-pulse-glow">
                                <CheckCircle2 size={40} className="text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-[#8888a0] text-sm mb-6 max-w-sm mx-auto">
                                Your feedback helps us build a better Kalvora. Every response is read personally.
                            </p>
                            <button onClick={resetForm} className="btn-secondary text-sm">
                                Send Another
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ══════════════ STRUCTURED FORM ══════════════ */
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* ── Name & Email ── */}
                        <div className="glass-card p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Name *</label>
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

                        {/* ── Prior Tools ── */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                                <ChevronRight size={14} className="text-brand-400" />
                                What did you use before Kalvora?
                            </h3>
                            <p className="text-[#5a5a70] text-xs mb-4">Select all that apply</p>
                            <div className="grid grid-cols-2 gap-2">
                                {PRIOR_TOOLS.map(tool => (
                                    <button
                                        type="button"
                                        key={tool}
                                        onClick={() => togglePriorTool(tool)}
                                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200 ${priorTools.includes(tool)
                                            ? 'border-brand-500/50 bg-brand-700/10 text-brand-300'
                                            : 'border-[#2a2a40] bg-[#12121a] text-[#8888a0] hover:border-[#3a3a55] hover:text-white'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${priorTools.includes(tool) ? 'border-brand-500 bg-brand-500' : 'border-[#3a3a55]'}`}>
                                            {priorTools.includes(tool) && (
                                                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            )}
                                        </div>
                                        {tool}
                                    </button>
                                ))}
                            </div>
                            {priorTools.includes('Other software') && (
                                <input
                                    type="text"
                                    value={otherTool}
                                    onChange={(e) => setOtherTool(e.target.value)}
                                    placeholder="Which software?"
                                    className="input-field mt-3"
                                />
                            )}
                        </div>

                        {/* ── Ease Rating ── */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                                <Star size={14} className="text-brand-400" />
                                How easy was it to create a proposal? *
                            </h3>
                            <p className="text-[#5a5a70] text-xs mb-4">1 = Very difficult, 5 = Very easy</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button
                                        type="button"
                                        key={n}
                                        onClick={() => setEaseRating(n)}
                                        className={`
                                            flex-1 py-3.5 rounded-xl border-2 text-center font-bold text-lg transition-all duration-200
                                            ${easeRating === n
                                                ? n <= 2
                                                    ? 'border-red-500/60 bg-red-500/15 text-red-400 shadow-lg shadow-red-500/10'
                                                    : n === 3
                                                        ? 'border-amber-500/60 bg-amber-500/15 text-amber-400 shadow-lg shadow-amber-500/10'
                                                        : 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                                : 'border-[#2a2a40] bg-[#12121a] text-[#5a5a70] hover:border-[#3a3a55] hover:text-white'
                                            }
                                        `}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-[#5a5a70] mt-2 px-1">
                                <span>Very difficult</span>
                                <span>Very easy</span>
                            </div>
                        </div>

                        {/* ── Open-ended Questions ── */}
                        <div className="glass-card p-6 space-y-5">
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                                    <ThumbsUp size={14} className="text-emerald-400" />
                                    What feature did you like the most?
                                </h3>
                                <textarea
                                    value={bestFeature}
                                    onChange={(e) => setBestFeature(e.target.value)}
                                    placeholder="e.g. PDF templates, shareable links, auto-invoicing..."
                                    rows={2}
                                    className="input-field resize-none"
                                />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                                    <AlertCircle size={14} className="text-amber-400" />
                                    What was confusing or frustrating?
                                </h3>
                                <textarea
                                    value={frustrations}
                                    onChange={(e) => setFrustrations(e.target.value)}
                                    placeholder="Anything that felt slow, unclear, or broken..."
                                    rows={2}
                                    className="input-field resize-none"
                                />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                                    <Lightbulb size={14} className="text-brand-400" />
                                    What feature would make Kalvora much better?
                                </h3>
                                <textarea
                                    value={featureWish}
                                    onChange={(e) => setFeatureWish(e.target.value)}
                                    placeholder="Your dream feature — no idea is too big..."
                                    rows={2}
                                    className="input-field resize-none"
                                />
                            </div>
                        </div>

                        {/* ── PMF Question ── */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                                <Sparkles size={14} className="text-brand-400" />
                                How disappointed would you be if Kalvora disappeared? *
                            </h3>
                            <p className="text-[#5a5a70] text-xs mb-4">This helps us understand how useful Kalvora is to you</p>
                            <div className="space-y-2">
                                {PMF_OPTIONS.map(opt => (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => setPmfAnswer(opt.value)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm transition-all duration-200 ${pmfAnswer === opt.value
                                            ? opt.bg.replace('hover:', '') + ' ' + opt.color
                                            : 'border-[#2a2a40] bg-[#12121a] text-[#8888a0] hover:border-[#3a3a55] hover:text-white'
                                            }`}
                                    >
                                        <span className="text-lg">{opt.emoji}</span>
                                        <span className="font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Additional Thoughts ── */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                                <MessageSquare size={14} className="text-[#5a5a70]" />
                                Additional thoughts
                            </h3>
                            <textarea
                                value={additionalThoughts}
                                onChange={(e) => setAdditionalThoughts(e.target.value)}
                                placeholder="Anything else you'd like to share..."
                                rows={3}
                                className="input-field resize-none"
                            />
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
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
}
