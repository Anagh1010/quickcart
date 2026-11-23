'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/common/ConfirmDialog'

const StatCard = ({ label, value, sub, highlighted }) => (
    <div className={`flex flex-col justify-between rounded-2xl border p-6 ${highlighted ? 'border-dark-surface bg-dark-surface' : 'border-border-subtle bg-white'}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${highlighted ? 'text-stone-400' : 'text-stone-500'}`}>{label}</span>
        <div className='flex items-baseline gap-1.5 mt-3'>
            <span className={`text-3xl font-extrabold ${highlighted ? 'text-[#f5c344]' : 'text-dark-surface'}`}>{value ?? '—'}</span>
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
    const [clearingErrors, setClearingErrors] = useState(false)
    const [clearingAudits, setClearingAudits] = useState(false)
    const [confirmTarget, setConfirmTarget] = useState(null)

    const fetchStats = useCallback(async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setStats(data.stats)
        } finally {
            setLoading(false)
        }
    }, [getToken])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const executeClear = async () => {
        if (!confirmTarget) return
        const isErrors = confirmTarget === 'errors'
        if (isErrors) setClearingErrors(true)
        else setClearingAudits(true)

        try {
            const token = await getToken()
            const { data } = await axios.delete(
                isErrors ? '/api/admin/logs?all=true' : '/api/admin/audit?all=true',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                toast.success(
                    isErrors
                        ? `Cleared all error logs (${data.deleted} deleted)`
                        : `Cleared all audit logs (${data.deleted} deleted)`
                )
                if (isErrors) setStats(prev => prev ? { ...prev, recentErrors: [] } : prev)
            }
        } catch (err) {
            console.error(`[admin/dashboard] Failed to clear ${confirmTarget} logs:`, err)
            toast.error(`Failed to clear ${confirmTarget} logs`)
        } finally {
            if (isErrors) setClearingErrors(false)
            else setClearingAudits(false)
            setConfirmTarget(null)
        }
    }

    const handleClearErrorLogs = () => setConfirmTarget('errors')
    const handleClearAuditLogs = () => setConfirmTarget('audit')

    if (loading) {
        return (
            <div className='flex min-h-96 items-center justify-center bg-canvas'>
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
        <div className='min-h-screen flex-1 bg-canvas'>
            <div className='mx-auto w-full max-w-7xl space-y-8 p-4 md:p-10'>

                <div>
                    <p className='text-xs font-bold uppercase tracking-[0.2em] text-amber-800'>Admin console</p>
                    <h2 className='mt-2 text-3xl font-bold tracking-tight text-dark-surface'>Platform overview</h2>
                    <p className='mt-2 text-sm font-medium text-stone-500'>Users, sellers, orders, revenue, and system logs.</p>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                    {statCards.map(c => <StatCard key={c.label} {...c} />)}
                </div>

                {/* System Log Maintenance */}
                <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-white p-6'>
                    <div>
                        <h3 className='text-sm font-bold uppercase tracking-wider text-stone-900'>Log Maintenance</h3>
                        <p className='mt-1 text-xs text-stone-500'>Quick actions to purge stored error diagnostics and audit events.</p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2.5'>
                        <button
                            onClick={handleClearErrorLogs}
                            disabled={clearingErrors}
                            className='rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer'
                        >
                            {clearingErrors ? 'Clearing Errors…' : 'Clear All Error Logs'}
                        </button>
                        <button
                            onClick={handleClearAuditLogs}
                            disabled={clearingAudits}
                            className='rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100 disabled:opacity-50 cursor-pointer'
                        >
                            {clearingAudits ? 'Clearing Audits…' : 'Clear All Audit Logs'}
                        </button>
                    </div>
                </div>

                {/* Recent Errors */}
                <div className='overflow-hidden rounded-2xl border border-border-subtle bg-white'>
                    <div className='flex items-center justify-between border-b border-[#f0eee6] px-6 py-4'>
                        <h3 className='text-sm font-bold uppercase tracking-wider text-stone-900'>Recent Errors</h3>
                        <div className='flex items-center gap-3'>
                            {stats?.recentErrors?.length > 0 && (
                                <button
                                    onClick={handleClearErrorLogs}
                                    disabled={clearingErrors}
                                    className='rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50 cursor-pointer'
                                >
                                    {clearingErrors ? 'Clearing…' : 'Clear All'}
                                </button>
                            )}
                            <Link href='/admin/logs' className='text-sm font-semibold text-amber-800 hover:text-amber-900'>View all →</Link>
                        </div>
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

            <ConfirmDialog
                open={Boolean(confirmTarget)}
                title={confirmTarget === 'errors' ? 'Clear all error logs?' : 'Clear all audit logs?'}
                description={
                    confirmTarget === 'errors'
                        ? 'This will permanently delete every stored error log entry. This action cannot be undone.'
                        : 'This will permanently delete all audit log entries across the platform. This action cannot be undone.'
                }
                confirmLabel={confirmTarget === 'errors' ? 'Clear All Error Logs' : 'Clear All Audit Logs'}
                tone={confirmTarget === 'errors' ? 'danger' : 'warning'}
                loading={confirmTarget === 'errors' ? clearingErrors : clearingAudits}
                onConfirm={executeClear}
                onCancel={() => setConfirmTarget(null)}
            />
        </div>
    )
}
