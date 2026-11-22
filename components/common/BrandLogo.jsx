'use client'
import React from 'react'
import Link from 'next/link'

/**
 * Canonical QuickCart brand lockup.
 * @param {'light'|'dark'} variant - 'light' for light/ivory backgrounds, 'dark' for obsidian footers.
 * @param {'sm'|'md'|'lg'} size - Lockup sizing.
 * @param {string} [href] - Optional Link destination.
 * @param {function} [onClick] - Optional click handler.
 * @param {string} [className] - Additional wrapper class.
 */
export default function BrandLogo({
    variant = 'light',
    size = 'md',
    href,
    onClick,
    className = ''
}) {
    const isDark = variant === 'dark'

    const badgeSizes = {
        sm: 'size-8 text-xs rounded-lg',
        md: 'size-9 text-sm rounded-xl',
        lg: 'size-10 text-base rounded-xl',
    }

    const titleSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    }

    const subtitleSizes = {
        sm: 'text-[9px]',
        md: 'text-[10px]',
        lg: 'text-[11px]',
    }

    const content = (
        <div className={`flex items-center gap-3 select-none ${onClick || href ? 'cursor-pointer' : ''} ${className}`}>
            <div
                className={`flex shrink-0 items-center justify-center font-bold shadow-2xs ${badgeSizes[size] || badgeSizes.md} ${
                    isDark ? 'bg-white text-stone-900' : 'bg-stone-900 text-white'
                }`}
            >
                <span className="text-[#f5c344]">Q</span>C
            </div>
            <div className="flex flex-col">
                <span
                    className={`font-bold tracking-tight leading-tight ${titleSizes[size] || titleSizes.md} ${
                        isDark ? 'text-white' : 'text-stone-900'
                    }`}
                >
                    QuickCart
                </span>
                <span
                    className={`font-bold tracking-[0.2em] uppercase leading-none mt-0.5 ${
                        subtitleSizes[size] || subtitleSizes.md
                    } ${isDark ? 'text-stone-400' : 'text-stone-500'}`}
                >
                    PREMIUM TECH STORE
                </span>
            </div>
        </div>
    )

    if (href) {
        return (
            <Link href={href} onClick={onClick} className="inline-flex">
                {content}
            </Link>
        )
    }

    if (onClick) {
        return (
            <div onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick(e)}>
                {content}
            </div>
        )
    }

    return content
}
