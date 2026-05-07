'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

// ─────────────────────────────────────────
// DEMO VIDEO MODAL
//
// Cinematic fullscreen modal with YouTube embed.
// Matches Editorial Luxury Minimal design system.
//
// ▸ UPDATE THIS when the YouTube video is ready:
export const DEMO_VIDEO_YOUTUBE_ID = 'YSFsgBdlBAE';
// ─────────────────────────────────────────

interface DemoVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DemoVideoModal({ isOpen, onClose }: DemoVideoModalProps) {

    // ── Close on ESC key ──
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${DEMO_VIDEO_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1&showinfo=0&color=white`;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Backdrop — click to close */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal container */}
            <div
                className="relative w-[94vw] max-w-5xl mx-auto animate-fade-in"
                style={{ animationDuration: '200ms' }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 sm:-top-14 sm:-right-2 z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium group"
                    aria-label="Close demo video"
                >
                    <span className="hidden sm:inline text-white/50 group-hover:text-white/80 transition-colors">
                        ESC
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <X size={18} />
                    </div>
                </button>

                {/* Video container with aspect ratio */}
                <div
                    className="relative w-full rounded-2xl overflow-hidden border border-white/10"
                    style={{
                        aspectRatio: '16 / 9',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                    }}
                >
                    {/* YouTube embed */}
                    <iframe
                        src={youtubeEmbedUrl}
                        title="Kalvora Demo Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 'none' }}
                    />
                </div>

                {/* Caption below video */}
                <p className="text-white/40 text-xs text-center mt-4 font-medium tracking-wide">
                    See how Kalvora helps interior designers create, send, and track proposals
                </p>
            </div>
        </div>
    );
}
