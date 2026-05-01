'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    className?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    placeholder?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    className = '',
    disabled = false,
    icon,
    placeholder,
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder || '';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => !disabled && setOpen(!open)}
                disabled={disabled}
                className={`
                    w-full bg-white border border-[#E8E3DD] rounded-[10px] px-3.5 py-3 text-sm
                    text-left transition-all duration-150 outline-none cursor-pointer
                    flex items-center justify-between gap-2
                    hover:border-[#D9D1C9]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${open ? 'border-[#3E2F2B] shadow-[0_0_0_3px_rgba(62,47,43,0.08)]' : ''}
                    ${icon ? 'pl-10' : ''}
                `}
            >
                {icon && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none">
                        {icon}
                    </span>
                )}
                <span className={value ? 'text-[#1E1E1E]' : 'text-[#78716C]'}>
                    {selectedLabel}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-[#78716C] flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    className="
                        absolute z-[9999] mt-1.5 w-full min-w-[180px]
                        bg-white border border-[#E8E3DD] rounded-xl
                        shadow-[0px_8px_24px_rgba(0,0,0,0.08)]
                        py-1.5 max-h-[240px] overflow-y-auto
                        animate-scale-in origin-top
                    "
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className={`
                                w-full text-left px-3.5 py-2.5 text-sm transition-colors duration-100
                                flex items-center justify-between gap-2
                                ${value === option.value
                                    ? 'bg-[#F0EBE6] text-[#3E2F2B] font-semibold'
                                    : 'text-[#1E1E1E] hover:bg-[#F5EFEA]'
                                }
                            `}
                        >
                            <span>{option.label}</span>
                            {value === option.value && (
                                <Check size={14} className="text-[#3E2F2B] flex-shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
