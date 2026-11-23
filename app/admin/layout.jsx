'use client'
import RoleNavbar from '@/components/common/RoleNavbar'
import AdminSidebar from '@/components/admin/Sidebar'
import AuthGate from '@/components/common/AuthGate'

export default function AdminLayout({ children }) {
    return (
        <AuthGate
            requiredRole='admin'
            title='Sign in to Admin Console'
            description='Sign in with an administrator account to access platform controls and logs.'
        >
            <div className='min-h-screen bg-canvas'>
                <RoleNavbar roleLabel='ADMIN' />
                <div className='flex w-full'>
                    <AdminSidebar />
                    <main className='flex-1 overflow-auto bg-canvas'>
                        {children}
                    </main>
                </div>
            </div>
        </AuthGate>
    )
}
