'use client';

const STEPS = ['Draft', 'Sent', 'Approved', 'Paid', 'Completed'] as const;

interface ProjectPipelineProps {
    status: string;
}

export default function ProjectPipeline({ status }: ProjectPipelineProps) {
    const currentIndex = STEPS.indexOf(status as typeof STEPS[number]);

    return (
        <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
                const isCompleted = i < currentIndex;
                const isCurrent = i === currentIndex;

                return (
                    <div key={step} className="flex items-center">
                        {/* Step dot + label */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`
                                    w-2.5 h-2.5 rounded-full transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]'
                                        : isCurrent
                                            ? 'bg-brand-400 shadow-[0_0_8px_rgba(99,102,241,0.5)] ring-2 ring-brand-400/30'
                                            : 'bg-[#2a2a40]'
                                    }
                                `}
                            />
                            <span
                                className={`
                                    text-[9px] mt-1 font-medium tracking-wide
                                    ${isCompleted
                                        ? 'text-emerald-400/80'
                                        : isCurrent
                                            ? 'text-brand-400'
                                            : 'text-[#3a3a50]'
                                    }
                                `}
                            >
                                {step}
                            </span>
                        </div>

                        {/* Connector line between dots */}
                        {i < STEPS.length - 1 && (
                            <div
                                className={`
                                    w-4 h-[2px] mx-0.5 mt-[-10px] rounded-full transition-all duration-300
                                    ${i < currentIndex
                                        ? 'bg-emerald-400/50'
                                        : 'bg-[#2a2a40]'
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
