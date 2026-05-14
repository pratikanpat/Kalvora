'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

// ─────────────────────────────────────────
// CustomSelect
//
// The dropdown panel is rendered via React Portal at document.body so it
// is NEVER clipped by a parent's overflow:hidden or stacking context.
// Position is calculated from the trigger button's getBoundingClientRect().
// ─────────────────────────────────────────
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
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Only render portal after hydration
    useEffect(() => { setMounted(true); }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder || '';

    // Calculate and set dropdown position from the trigger button's rect
    const positionDropdown = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 260; // max-h approximation

        // Decide if dropdown should open upward or downward
        const spaceBelow = viewportHeight - rect.bottom;
        const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

        setDropdownStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            minWidth: Math.max(rect.width, 180),
            zIndex: 99999,
            ...(openUpward
                ? { bottom: viewportHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }
            ),
        });
    }, []);

    const handleToggle = () => {
        if (disabled) return;
        if (!open) positionDropdown();
        setOpen(prev => !prev);
    };

    // Close on outside click or ESC
    useEffect(() => {
        if (!open) return;

        const handleClick = (e: MouseEvent) => {
            if (
                triggerRef.current?.contains(e.target as Node) ||
                dropdownRef.current?.contains(e.target as Node)
            ) return;
            setOpen(false);
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        // Re-position on scroll/resize so the panel tracks the trigger
        const handleReposition = () => {
            if (open) positionDropdown();
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleReposition, true);
        window.addEventListener('resize', handleReposition);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleReposition, true);
            window.removeEventListener('resize', handleReposition);
        };
    }, [open, positionDropdown]);

    return (
        <div className={`relative ${className}`}>
            {/* Trigger button */}
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
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

            {/* Dropdown panel — rendered via Portal so it's never clipped */}
            {mounted && open && createPortal(
                <div
                    ref={dropdownRef}
                    style={dropdownStyle}
                    className="
                        bg-white border border-[#E8E3DD] rounded-xl
                        shadow-[0px_8px_24px_rgba(0,0,0,0.12),0px_2px_8px_rgba(0,0,0,0.06)]
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
                </div>,
                document.body
            )}
        </div>
    );
}
