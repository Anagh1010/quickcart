'use client'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import Link from 'next/link'

const StatCard = ({ label, value, sub, highlighted }) => (
    <div className={`flex flex-col justify-between rounded-2xl border p-6 ${highlighted ? 'border-[#141518] bg-[#141518]' : 'border-[#e6e4dc] bg-white'}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${highlighted ? 'text-stone-400' : 'text-stone-500'}`}>{label}</span>
        <div className='flex items-baseline gap-1.5 mt-3'>
            <span className={`text-3xl font-extrabold ${highlighted ? 'text-[#f5c344]' : 'text-[#141518]'}`}>{value ?? '—'}</span>
            {sub && <span className={`text-xs font-medium ${highlighted ? 'text-stone-400' : 'text-stone-500'}`}>{sub}</span>}
        </div>
    </div>
)

const LevelBadge = ({ level }) => {
    const styles = {
        error: 'bg-rose-50 text-rose-700 border border-rose-200',
        warn: 'bg-amber-50 text-amber-800 border border-amber-200',
        info: 'bg-stone-100 text-stone-600 border border-stone-200'
    }
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[level] || styles.info}`}>
            {level?.toUpperCase()}
        </span>
    )
}

export default function AdminDashboard() {
    const { getToken, currency } = useAppContext()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = await getToken()
                const { data } = await axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
                if (data.success) setStats(data.stats)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    if (loading) {
        return (
            <div className='flex min-h-96 items-center justify-center bg-[#fbf9f4]'>
                <div className='animate-spin w-8 h-8 border-2 border-[#f5c344] border-t-transparent rounded-full' />
            </div>
        )
    }

    const cur = currency || '₹'

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers, sub: 'Registered accounts' },
        { label: 'Active Sellers', value: stats?.totalSellers, sub: 'Sellers & admins' },
        { label: 'Total Orders', value: stats?.totalOrders, sub: 'Transactions' },
        { label: 'Total Products', value: stats?.totalProducts, sub: 'Active listings' },
        { label: 'Total Revenue', value: stats?.totalRevenue ? `${cur}${stats.totalRevenue.toLocaleString()}` : `${cur}0`, sub: 'Paid & confirmed', highlighted: true },
    ]

    return (
        <div className='min-h-screen flex-1 bg-[#fbf9f4]'>
            <div className='mx-auto w-full max-w-7xl space-y-8 p-4 md:p-10'>

                <div>
                    <p className='text-xs font-bold uppercase tracking-[0.2em] text-amber-800'>Admin console</p>
                    <h2 className='mt-2 text-3xl font-bold tracking-tight text-[#141518]'>Platform overview</h2>
                    <p className='mt-2 text-sm font-medium text-stone-500'>Users, sellers, orders, revenue, and recent errors.</p>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                    {statCards.map(c => <StatCard key={c.label} {...c} />)}
                </div>

                {/* Recent Errors */}
                <div className='overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white'>
                    <div className='flex items-center justify-between border-b border-[#f0eee6] px-6 py-4'>
                        <h3 className='text-sm font-bold uppercase tracking-wider text-stone-900'>Recent Errors</h3>
                        <Link href='/admin/logs' className='text-sm font-semibold text-amber-800 hover:text-amber-900'>View all →</Link>
                    </div>
                    {stats?.recentErrors?.length > 0 ? (
                        <div className='divide-y divide-[#f0eee6]'>
                            {stats.recentErrors.map((log) => (
                                <div key={log._id} className='flex items-start gap-4 px-6 py-4'>
                                    <LevelBadge level={log.level} />
                                    <div className='flex-1 min-w-0'>
                                        <p className='truncate text-sm font-medium text-stone-800'>{log.message}</p>
                                        <p className='mt-0.5 text-xs text-stone-400'>{log.route} · {new Date(log.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='px-6 py-10 text-center text-sm text-stone-500'>
                            No recent errors to review.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
