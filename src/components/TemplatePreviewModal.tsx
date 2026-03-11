'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

interface TemplateInfo {
    name: string;
    desc: string;
    colors: string[];
    icon: string;
    badge?: string;
    badgeColor?: string;
    previewImage: string;
    stylePoints: string[];
}

interface TemplatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: TemplateInfo[];
    activeIndex: number;
    onNavigate: (index: number) => void;
}

export default function TemplatePreviewModal({
    isOpen,
    onClose,
    templates,
    activeIndex,
    onNavigate,
}: TemplatePreviewModalProps) {
    const router = useRouter();
    const { session } = useAuth();

    const handlePrev = useCallback(() => {
        onNavigate(activeIndex > 0 ? activeIndex - 1 : templates.length - 1);
    }, [activeIndex, onNavigate, templates.length]);

    const handleNext = useCallback(() => {
        onNavigate(activeIndex < templates.length - 1 ? activeIndex + 1 : 0);
    }, [activeIndex, onNavigate, templates.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose, handlePrev, handleNext]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const t = templates[activeIndex];

    const handleCTA = () => {
        onClose();
        if (session) {
            router.push('/create');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="template-modal-overlay" onClick={onClose}>
            <div className="template-modal" onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button onClick={onClose} className="template-modal-close" aria-label="Close preview">
                    <X size={20} />
                </button>

                {/* Left: Preview Image */}
                <div className="template-modal-preview">
                    <img
                        src={t.previewImage}
                        alt={`${t.name} template preview`}
                        className="template-modal-image"
                    />

                    {/* Navigation arrows */}
                    <button
                        onClick={handlePrev}
                        className="template-modal-nav template-modal-nav-prev"
                        aria-label="Previous template"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="template-modal-nav template-modal-nav-next"
                        aria-label="Next template"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Dot indicators */}
                    <div className="template-modal-dots">
                        {templates.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => onNavigate(i)}
                                className={`template-modal-dot ${i === activeIndex ? 'active' : ''}`}
                                aria-label={`Go to template ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Info Panel */}
                <div className="template-modal-info">
                    {/* Badge */}
                    {t.badge && (
                        <span
                            className="template-modal-badge"
                            style={{ background: t.badgeColor || 'rgba(99,102,241,0.15)', color: t.badgeColor ? '#fff' : '#818cf8' }}
                        >
                            {t.badge}
                        </span>
                    )}

                    {/* Template icon + name */}
                    <div className="template-modal-header">
                        <span className="template-modal-icon">{t.icon}</span>
                        <h3 className="template-modal-name">{t.name}</h3>
                    </div>

                    {/* Description */}
                    <p className="template-modal-desc">{t.desc}</p>

                    {/* Colors */}
                    <div className="template-modal-colors">
                        <span className="template-modal-colors-label">Color Palette</span>
                        <div className="template-modal-color-swatches">
                            {t.colors.map((c, i) => (
                                <div
                                    key={i}
                                    className="template-modal-swatch"
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Style Points */}
                    <div className="template-modal-points">
                        {t.stylePoints.map((point, i) => (
                            <div key={i} className="template-modal-point">
                                <div className="template-modal-point-dot" />
                                <span>{point}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <button onClick={handleCTA} className="template-modal-cta">
                        Create Proposal With This Style
                        <ArrowRight size={18} />
                    </button>

                    {/* Social proof */}
                    <p className="template-modal-proof">
                        Used by interior designers to create professional client proposals in seconds.
                    </p>
                </div>
            </div>
        </div>
    );
}
