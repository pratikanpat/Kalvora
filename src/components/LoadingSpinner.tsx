import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-lg animate-pulse-glow" />
                <Loader2 size={36} className="animate-spin text-brand-400 relative" />
            </div>
            <p className="text-[#6a6a80] text-sm font-medium">{text}</p>
        </div>
    );
}
