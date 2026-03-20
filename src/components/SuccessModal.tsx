'use client';

import { X, Download, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getOrCreateShortCode, buildShortUrl } from '@/lib/shortcode';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    projectId: string;
    downloadFilename?: string;
    clientName?: string;
    projectType?: string;
}

export default function SuccessModal({ isOpen, onClose, pdfUrl, projectId, downloadFilename, clientName, projectType }: SuccessModalProps) {
    const [copied, setCopied] = useState(false);
    const [shortCode, setShortCode] = useState('');

    useEffect(() => {
        if (isOpen && projectId) {
            getOrCreateShortCode(projectId, 'view').then(code => setShortCode(code)).catch(() => {});
        }
    }, [isOpen, projectId]);

    if (!isOpen) return null;

    const shareableLink = buildShortUrl(window.location.origin, shortCode, 'view', projectId);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareableLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = shareableLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWhatsAppShare = () => {
        const name = clientName || 'there';
        const type = projectType || 'your project';
        const message = `Hi ${name}! Your ${type} proposal is ready. Please review and approve it here:\n${shareableLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass-card p-8 max-w-md w-full mx-4 animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#5a5a70] hover:text-[#f0f0f5] transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center animate-pulse-glow">
                        <Check size={32} className="text-green-400" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-center mb-2">Proposal Generated!</h3>
                <p className="text-[#8888a0] text-center text-sm mb-8">
                    Your PDF proposal is ready. Download, share, or send it to your client.
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={downloadFilename || true}
                        className="btn-primary w-full justify-center"
                    >
                        <Download size={18} />
                        Download PDF
                    </a>

                    {/* WhatsApp Share — authentic green */}
                    <button
                        onClick={handleWhatsAppShare}
                        className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                        style={{ background: '#25D366', color: '#ffffff' }}
                    >
                        <Share2 size={18} />
                        Share on WhatsApp
                    </button>

                    <button
                        onClick={handleCopyLink}
                        className="btn-secondary w-full justify-center"
                    >
                        {copied ? (
                            <>
                                <Check size={18} className="text-green-400" />
                                Link Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={18} />
                                Copy Shareable Link
                            </>
                        )}
                    </button>

                    <a
                        href={`/proposals/${projectId}`}
                        className="btn-secondary w-full justify-center"
                    >
                        <ExternalLink size={18} />
                        View Proposal
                    </a>
                </div>
            </div>
        </div>
    );
}
