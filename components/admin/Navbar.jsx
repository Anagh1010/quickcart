'use client'
import React from 'react'
import BrandLogo from '@/components/common/BrandLogo'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {
  const { router } = useAppContext()

  return (
    <div className='flex items-center justify-between border-b border-[#e6e4dc] bg-[#fbf9f4] px-4 py-3 md:px-8'>
      <BrandLogo onClick={() => router.push('/')} size='sm' />
      <div className='flex items-center gap-3'>
        <button
          onClick={() => router.push('/')}
          className='hidden text-sm font-medium text-stone-600 transition hover:text-amber-800 sm:block'
        >
          ← Storefront
        </button>
        <span className='rounded-full border border-stone-800 bg-[#141518] px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-[#f5c344]'>
          ADMIN
        </span>
      </div>
    </div>
  )
}

export default Navbar
