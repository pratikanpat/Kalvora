'use client';

import { useRouter } from 'next/navigation';
import { Building, ArrowRight, X } from 'lucide-react';

interface ProfileSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileSetupModal({ isOpen, onClose }: ProfileSetupModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleSetup = () => {
        onClose();
        router.push('/profile');
    };

    const handleLater = () => {
        // Save dismissal to localStorage so we don't nag again
        localStorage.setItem('kalvora_profile_dismissed', 'true');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleLater} />

            {/* Modal */}
            <div className="relative glass-card w-full max-w-md p-8 animate-slide-up">
                <button
                    onClick={handleLater}
                    className="absolute top-4 right-4 text-[#5a5a70] hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 shadow-xl shadow-brand-700/30 mb-6">
                        <Building size={28} className="text-white" />
                    </div>

                    <h2 className="text-xl font-bold text-white tracking-tight mb-2">
                        Set Up Your Studio Profile
                    </h2>
                    <p className="text-[#8888a0] text-sm leading-relaxed mb-2">
                        Add your studio name, logo, contact details, and default settings. This information will automatically appear on every proposal you create.
                    </p>
                    <p className="text-[#5a5a70] text-xs mb-8">
                        You only need to do this once.
                    </p>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSetup}
                            className="btn-primary w-full justify-center py-3 text-sm font-semibold"
                        >
                            <ArrowRight size={18} />
                            Set Up Profile
                        </button>
                        <button
                            onClick={handleLater}
                            className="w-full py-2.5 text-sm text-[#5a5a70] hover:text-[#8888a0] transition-colors font-medium"
                        >
                            I&apos;ll do this later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
