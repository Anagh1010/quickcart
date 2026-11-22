'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React, { useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'

const Layout = ({ children }) => {
  const { isSeller, router, user } = useAppContext()

  useEffect(() => {
    if (user !== undefined && !isSeller) {
      router.push('/')
    }
  }, [user, isSeller, router])

  if (!isSeller) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#fbf9f4]'>
        <div className='text-stone-500 font-medium text-sm'>Checking permissions...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#fbf9f4]'>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        <main className='flex-1 overflow-auto bg-[#fbf9f4]'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
