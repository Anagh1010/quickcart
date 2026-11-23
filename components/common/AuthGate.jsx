'use client'
import React, { useEffect, useRef } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import BrandLogo from '@/components/common/BrandLogo'

export default function AuthGate({
    children,
    requiredRole = null,
    title = 'Sign in required',
    description = 'Please sign in to your QuickCart account to continue.',
}) {
    const { isLoaded, isSignedIn, user } = useUser()
    const { openSignIn } = useClerk()
    const router = useRouter()
    const promptedRef = useRef(false)

    const role = user?.publicMetadata?.role
    const hasRole = !requiredRole
        || (requiredRole === 'admin' && role === 'admin')
        || (requiredRole === 'seller' && (role === 'seller' || role === 'admin'))

    useEffect(() => {
        if (isLoaded && !isSignedIn && !promptedRef.current) {
            promptedRef.current = true
            openSignIn()
        }
        if (isSignedIn) {
            promptedRef.current = false
        }
    }, [isLoaded, isSignedIn, openSignIn])

    if (!isLoaded) {
        return (
            <div className='min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-canvas'>
                <div className='size-8 animate-spin rounded-full border-2 border-[#f5c344] border-t-transparent' />
                <p className='text-xs font-medium text-stone-500'>Checking session…</p>
            </div>
        )
    }

    if (!isSignedIn) {
        return (
            <div className='min-h-[70vh] flex items-center justify-center bg-canvas px-4 py-12'>
                <div className='w-full max-w-md rounded-2xl border border-border-subtle bg-white p-8 text-center shadow-2xs'>
                    <div className='flex justify-center mb-5'>
                        <BrandLogo size='sm' />
                    </div>
                    <h2 className='text-lg font-bold text-stone-950'>{title}</h2>
                    <p className='mt-2 text-sm text-stone-500'>{description}</p>
                    <div className='mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5'>
                        <button
                            type='button'
                            onClick={() => openSignIn()}
                            className='w-full sm:w-auto rounded-xl bg-[#f5c344] hover:bg-[#e6b02e] px-5 py-2.5 text-sm font-bold text-stone-950 transition shadow-2xs'
                        >
                            Sign in
                        </button>
                        <button
                            type='button'
                            onClick={() => router.push('/')}
                            className='w-full sm:w-auto rounded-xl border border-border-subtle bg-white hover:bg-stone-50 px-5 py-2.5 text-sm font-semibold text-stone-700 transition'
                        >
                            ← Back to Storefront
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!hasRole) {
        return (
            <div className='min-h-[70vh] flex items-center justify-center bg-canvas px-4 py-12'>
                <div className='w-full max-w-md rounded-2xl border border-border-subtle bg-white p-8 text-center shadow-2xs'>
                    <h2 className='text-lg font-bold text-stone-950'>Access restricted</h2>
                    <p className='mt-2 text-sm text-stone-500'>
                        Your account does not have {requiredRole} permissions for this area.
                    </p>
                    <button
                        type='button'
                        onClick={() => router.push('/')}
                        className='mt-6 rounded-xl bg-stone-900 hover:bg-stone-800 px-5 py-2.5 text-sm font-semibold text-white transition'
                    >
                        ← Return to Storefront
                    </button>
                </div>
            </div>
        )
    }

    return children
}
