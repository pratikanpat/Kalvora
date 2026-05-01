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
            <div className="absolute inset-0 bg-black/50" onClick={handleLater} />

            {/* Modal */}
            <div className="relative bg-[#F6F3EF] border border-[#E8E3DD] rounded-xl w-full max-w-md p-8 animate-fade-in">
                <button
                    onClick={handleLater}
                    className="absolute top-4 right-4 text-[#78716C] hover:text-[#1E1E1E] transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3E2F2B] mb-6">
                        <Building size={28} className="text-white" />
                    </div>

                    <h2 className="text-xl font-bold text-[#1E1E1E] tracking-tight mb-2">
                        Set Up Your Studio Profile
                    </h2>
                    <p className="text-[#6F6A66] text-sm leading-relaxed mb-2">
                        Add your studio name, logo, contact details, and default settings. This information will automatically appear on every proposal you create.
                    </p>
                    <p className="text-[#78716C] text-xs mb-8">
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
                            className="w-full py-2.5 text-sm text-[#78716C] hover:text-[#6F6A66] transition-colors font-medium"
                        >
                            I&apos;ll do this later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
