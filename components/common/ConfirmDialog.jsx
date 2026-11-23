'use client'
import React, { useEffect } from 'react'

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    tone = 'danger',
    loading = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return
        const onKeyDown = (e) => {
            if (e.key === 'Escape' && !loading) onCancel?.()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [open, loading, onCancel])

    if (!open) return null

    const confirmStyles = tone === 'warning'
        ? 'bg-[#f5c344] text-stone-950 hover:bg-[#e6b02e]'
        : 'bg-rose-600 text-white hover:bg-rose-700'

    return (
        <div
            className='fixed inset-0 z-[70] flex items-center justify-center p-4'
            role='dialog'
            aria-modal='true'
            aria-labelledby='confirm-dialog-title'
        >
            <div
                className='absolute inset-0 bg-stone-950/50 backdrop-blur-xs'
                onClick={() => !loading && onCancel?.()}
            />
            <div className='relative w-full max-w-md rounded-2xl border border-border-subtle bg-canvas p-6 shadow-xl'>
                <h3 id='confirm-dialog-title' className='text-base font-bold text-stone-950'>
                    {title}
                </h3>
                {description && (
                    <p className='mt-2 text-sm leading-relaxed text-stone-600'>
                        {description}
                    </p>
                )}
                <div className='mt-6 flex items-center justify-end gap-2.5'>
                    <button
                        type='button'
                        onClick={onCancel}
                        disabled={loading}
                        className='rounded-xl border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50'
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type='button'
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${confirmStyles}`}
                    >
                        {loading ? 'Processing…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
