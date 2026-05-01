'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, X, LogOut } from 'lucide-react';

interface LogoutFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmLogout: () => void;
    userId?: string;
}

export default function LogoutFeedbackModal({ isOpen, onClose, onConfirmLogout, userId }: LogoutFeedbackModalProps) {
    const [answer, setAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmitAndLogout = async () => {
        if (answer.trim()) {
            setSubmitting(true);
            try {
                await supabase.from('feedback').insert({
                    name: 'Logout feedback',
                    message: answer.trim(),
                    feedback_type: 'logout_trigger',
                    user_id: userId || null,
                });
            } catch {
                // Silently fail — don't block logout
            }
            setSubmitting(false);
        }
        onConfirmLogout();
    };

    const handleSkipAndLogout = () => {
        onConfirmLogout();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
            <div className="bg-[#F6F3EF] border border-[#E8E3DD] rounded-xl w-full max-w-md p-6 relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#78716C] hover:text-[#1E1E1E] transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-[10px] bg-[#F0EBE6] border border-[#D9D1C9] flex items-center justify-center">
                        <LogOut size={18} className="text-[#C47A5A]" />
                    </div>
                    <div>
                        <h3 className="text-[#1E1E1E] font-bold text-base">Before you go...</h3>
                        <p className="text-[#78716C] text-xs">One quick question (optional)</p>
                    </div>
                </div>

                <label className="block text-sm font-medium text-[#1E1E1E] mb-2.5">
                    What almost stopped you from creating a proposal today?
                </label>
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="e.g. Couldn't find a template I liked, too many fields, pricing was confusing..."
                    rows={3}
                    className="input-field resize-none mb-4"
                    autoFocus
                />

                <div className="flex gap-3">
                    <button
                        onClick={handleSkipAndLogout}
                        className="btn-secondary flex-1 justify-center text-sm py-2.5"
                    >
                        Skip & Log out
                    </button>
                    <button
                        onClick={handleSubmitAndLogout}
                        disabled={submitting}
                        className="btn-primary flex-1 justify-center text-sm py-2.5 disabled:opacity-50"
                    >
                        {submitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <LogOut size={16} />
                        )}
                        {submitting ? 'Sending...' : 'Submit & Log out'}
                    </button>
                </div>
            </div>
        </div>
    );
}
