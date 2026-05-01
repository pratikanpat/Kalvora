/**
 * Skeleton Loader — Clean, layout-matching shimmer
 *
 * Two modes:
 * - fullScreen (default when no text): Full-page skeleton layout
 * - inline (when text provided or explicit): Compact skeleton rows
 */

export default function LoadingSpinner({
    text = '',
    fullScreen,
}: {
    text?: string;
    fullScreen?: boolean;
}) {
    const isFullScreen = fullScreen ?? (text === '');

    if (isFullScreen) {
        return (
            <div className="min-h-screen bg-[#F6F3EF] flex items-center justify-center">
                <div className="w-full max-w-lg px-6">
                    {/* Skeleton card */}
                    <div className="bg-[#F0EBE6] border border-[#E8E3DD] rounded-xl p-8">
                        {/* Title skeleton */}
                        <div className="skeleton skeleton-title w-[45%] mb-6" />
                        {/* Content rows */}
                        <div className="space-y-3">
                            <div className="skeleton skeleton-text w-full" />
                            <div className="skeleton skeleton-text w-[85%]" />
                            <div className="skeleton skeleton-text w-[70%]" />
                        </div>
                        {/* Action skeleton */}
                        <div className="skeleton w-[120px] h-[36px] rounded-[10px] mt-8" />
                    </div>
                </div>
            </div>
        );
    }

    // Inline mode — compact skeleton rows
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-full max-w-sm space-y-3">
                <div className="skeleton skeleton-text w-[60%] mx-auto" />
                <div className="skeleton skeleton-text w-full" />
                <div className="skeleton skeleton-text w-[80%]" />
            </div>
            {text && (
                <p className="text-[#78716C] text-sm font-medium mt-2">{text}</p>
            )}
        </div>
    );
}
