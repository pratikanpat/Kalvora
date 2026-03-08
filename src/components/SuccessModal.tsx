'use client';

import { X, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    projectId: string;
    downloadFilename?: string;
}

export default function SuccessModal({ isOpen, onClose, pdfUrl, projectId, downloadFilename }: SuccessModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareableLink = `${window.location.origin}/view/${projectId}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareableLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
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
                    Your PDF proposal is ready to download and share with your client.
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
