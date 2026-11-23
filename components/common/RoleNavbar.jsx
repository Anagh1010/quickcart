'use client'
import React from 'react'
import BrandLogo from '@/components/common/BrandLogo'
import { useAppContext } from '@/context/AppContext'

export default function RoleNavbar({ roleLabel }) {
  const { router } = useAppContext()

  return (
    <div className='flex items-center justify-between border-b border-border-subtle bg-canvas px-4 py-3 md:px-8'>
      <BrandLogo onClick={() => router.push('/')} size='sm' />
      <div className='flex items-center gap-4'>
        <button
          onClick={() => router.push('/')}
          className='hidden text-sm font-medium text-stone-600 transition hover:text-amber-800 sm:block'
        >
          ← Storefront
        </button>
        <span className='rounded-full border border-stone-800 bg-dark-surface px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-[#f5c344]'>
          {roleLabel}
        </span>
      </div>
    </div>
  )
}
