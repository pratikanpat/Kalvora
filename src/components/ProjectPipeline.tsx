'use client';

const STEPS = ['Draft', 'Sent', 'Viewed', 'Approved', 'Paid', 'Completed'] as const;

interface ProjectPipelineProps {
    status: string;
    clientViewedAt?: string | null;
}

export default function ProjectPipeline({ status, clientViewedAt }: ProjectPipelineProps) {
    let effectiveStatus = status;
    if (status === 'Sent' && clientViewedAt) {
        effectiveStatus = 'Viewed';
    }

    const currentIndex = STEPS.indexOf(effectiveStatus as typeof STEPS[number]);

    return (
        <div className="flex items-center w-full">
            {STEPS.map((step, i) => {
                const isCompleted = i < currentIndex;
                const isCurrent = i === currentIndex;

                return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                        {/* Step */}
                        <div className="flex flex-col items-center">
                            {/* Circle */}
                            <div
                                className={`
                                    rounded-full transition-all duration-300 ease-out
                                    ${isCompleted
                                        ? 'w-[10px] h-[10px] bg-[#3E2F2B] opacity-80'
                                        : isCurrent
                                            ? 'w-[10px] h-[10px] border-2 border-[#3E2F2B] bg-[#3E2F2B] scale-[1.15]'
                                            : 'w-[10px] h-[10px] bg-[#E8E3DD]'
                                    }
                                `}
                            >
                                {isCurrent && (
                                    <div className="w-full h-full rounded-full ring-[3px] ring-[#3E2F2B]/20" />
                                )}
                            </div>
                            {/* Label */}
                            <span
                                className={`
                                    text-[9px] sm:text-[10px] mt-1.5 tracking-wide whitespace-nowrap transition-all duration-300
                                    ${isCompleted
                                        ? 'text-[#3E2F2B] opacity-80 font-normal'
                                        : isCurrent
                                            ? 'text-[#3E2F2B] font-semibold'
                                            : 'text-[#78716C] font-normal'
                                    }
                                `}
                            >
                                {step}
                            </span>
                        </div>

                        {/* Connecting line */}
                        {i < STEPS.length - 1 && (
                            <div
                                className={`
                                    flex-1 h-[2px] mx-1 sm:mx-1.5 mt-[-12px] sm:mt-[-14px] rounded-full transition-all duration-300
                                    ${i < currentIndex
                                        ? 'bg-[#3E2F2B] opacity-80'
                                        : 'bg-[#E8E3DD]'
                                    }
                                `}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
