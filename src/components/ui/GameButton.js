/**
 * Gaming Button Component
 * Pixel-perfect game-themed button with SVG effects and animations
 */

'use client';

import { useState } from 'react';

export default function GameButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    icon: Icon,
    active = false,
}) {
    const [isPressed, setIsPressed] = useState(false);

    const variants = {
        primary: `
      bg-gradient-to-b from-yellow-neo to-yellow-electric
      text-bg-primary font-bold
      shadow-[0_4px_0_0_#B8860B,0_8px_12px_0_rgba(255,194,26,0.4)]
      hover:shadow-[0_4px_0_0_#B8860B,0_12px_16px_0_rgba(255,194,26,0.6)]
      active:shadow-[0_2px_0_0_#B8860B,0_4px_8px_0_rgba(255,194,26,0.3)]
      active:translate-y-[2px]
    `,
        secondary: `
      bg-gradient-to-b from-bg-hover to-bg-panel
      text-text-primary font-semibold border-2 border-border-divider
      shadow-[0_4px_0_0_#1a1a1a,0_8px_12px_0_rgba(0,0,0,0.4)]
      hover:border-yellow-neo/50 hover:text-yellow-neo
      hover:shadow-[0_4px_0_0_#1a1a1a,0_12px_16px_0_rgba(255,194,26,0.2)]
      active:shadow-[0_2px_0_0_#1a1a1a]
      active:translate-y-[2px]
    `,
        ghost: `
      text-text-secondary font-medium
      hover:bg-bg-hover hover:text-text-primary
      active:bg-bg-panel
    `,
        nav: active ? `
      bg-gradient-to-r from-yellow-neo/20 to-yellow-electric/20
      text-yellow-neo font-semibold border-l-4 border-yellow-neo
      shadow-[inset_0_0_20px_rgba(255,194,26,0.1)]
    ` : `
      text-text-secondary font-medium
      hover:bg-gradient-to-r hover:from-yellow-neo/10 hover:to-transparent
      hover:text-text-primary hover:border-l-4 hover:border-yellow-neo/50
    `,
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className={`
        relative group
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
        ${isPressed && variant !== 'ghost' && variant !== 'nav' ? 'scale-[0.98]' : ''}
      `}
        >
            {/* Shine effect */}
            {variant === 'primary' && (
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </div>
            )}

            {/* Icon */}
            {Icon && (
                <Icon className={`
          ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}
          ${variant === 'primary' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : ''}
        `} />
            )}

            {/* Content */}
            <span className="relative z-10">
                {children}
            </span>

            {/* Pixel corners (for primary variant) */}
            {variant === 'primary' && (
                <>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-electric" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-electric" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-neo" style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }} />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-neo" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
                </>
            )}
        </button>
    );
}
