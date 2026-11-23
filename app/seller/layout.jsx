'use client'
import RoleNavbar from '@/components/common/RoleNavbar'
import Sidebar from '@/components/seller/Sidebar'
import AuthGate from '@/components/common/AuthGate'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <AuthGate
      requiredRole='seller'
      title='Sign in to Seller Dashboard'
      description='Sign in with a seller account to manage products, inventory, and orders.'
    >
      <div className='min-h-screen bg-canvas'>
        <RoleNavbar roleLabel='SELLER' />
        <div className='flex w-full'>
          <Sidebar />
          <main className='flex-1 overflow-auto bg-canvas'>
            {children}
          </main>
        </div>
      </div>
    </AuthGate>
  )
}

export default Layout
