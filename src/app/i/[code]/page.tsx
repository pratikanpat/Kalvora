'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { resolveShortCode } from '@/lib/shortcode';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ShortInvoiceRedirect() {
    const params = useParams();
    const router = useRouter();
    const code = params.code as string;
    const [error, setError] = useState(false);

    useEffect(() => {
        async function resolve() {
            const result = await resolveShortCode(code);
            if (result) {
                router.replace(`/invoice/${result.projectId}`);
            } else {
                setError(true);
            }
        }
        resolve();
    }, [code, router]);

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-2xl font-bold text-white mb-2">Link Not Found</h1>
                    <p className="text-[#5a5a70]">This invoice link is invalid or has expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <LoadingSpinner text="Opening invoice..." />
        </div>
    );
}
