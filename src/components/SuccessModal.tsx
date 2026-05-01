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
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 animate-fade-in" style={{ boxShadow: '0px 8px 24px rgba(0,0,0,0.08)' }}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#78716C] hover:text-[#1E1E1E] transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#EDF5F1] border border-[#D0E5DA] flex items-center justify-center">
                        <Check size={32} className="text-[#6A9C89]" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-center mb-2 text-[#1E1E1E]">Proposal Generated!</h3>
                <p className="text-[#6F6A66] text-center text-sm mb-8">
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

                    <button
                        onClick={handleWhatsAppShare}
                        className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-[10px] font-semibold text-sm transition-colors duration-150 hover:opacity-90"
                        style={{ background: '#3E2F2B', color: '#ffffff' }}
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
                                <Check size={18} className="text-[#6A9C89]" />
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
