'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import AuditStats from '@/components/admin/audit/AuditStats'
import AuditFeedFilters from '@/components/admin/audit/AuditFeedFilters'
import AuditFeedTable from '@/components/admin/audit/AuditFeedTable'
import ConfirmDialog from '@/components/common/ConfirmDialog'

function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(t)
    }, [value, delay])
    return debounced
}

export default function AdminAuditPage() {
    const { getToken } = useAppContext()

    // Summary state
    const [summary, setSummary] = useState(null)
    const [topActions, setTopActions] = useState([])
    const [topUsers, setTopUsers] = useState([])
    const [timeline, setTimeline] = useState([])
    const [loadingSum, setLoadingSum] = useState(true)

    // Feed state
    const [logs, setLogs] = useState([])
    const [feedTotal, setFeedTotal] = useState(0)
    const [pages, setPages] = useState(1)
    const [loadingFeed, setLoadingFeed] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [confirmAction, setConfirmAction] = useState(null)

    // Filters
    const [actionFilter, setActionFilter] = useState('')
    const [resourceFilter, setResourceFilter] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [outcomeFilter, setOutcomeFilter] = useState('')
    const [resourceIdInput, setResourceIdInput] = useState('')
    const [userIdInput, setUserIdInput] = useState('')
    const [page, setPage] = useState(1)

    const debouncedUserId = useDebounce(userIdInput, 400)
    const debouncedResourceId = useDebounce(resourceIdInput, 400)

    const fetchSummary = useCallback(async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/audit?view=summary', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setSummary(data.summary)
                setTopActions(data.topActions)
                setTopUsers(data.topUsers)
                setTimeline(data.timeline)
            }
        } catch (err) {
            console.error('[admin/audit] Failed to load summary:', err)
            toast.error('Failed to load audit summary')
        } finally {
            setLoadingSum(false)
        }
    }, [getToken])

    useEffect(() => {
        fetchSummary()
    }, [fetchSummary])

    const fetchFeed = useCallback(async () => {
        setLoadingFeed(true)
        try {
            const token = await getToken()
            const params = new URLSearchParams({
                view: 'feed', page, limit: 50,
                ...(actionFilter && { action: actionFilter }),
                ...(resourceFilter && { resource: resourceFilter }),
                ...(categoryFilter && { category: categoryFilter }),
                ...(outcomeFilter && { outcome: outcomeFilter }),
                ...(debouncedUserId && { userId: debouncedUserId }),
                ...(debouncedResourceId && { resourceId: debouncedResourceId }),
            })
            const { data } = await axios.get(`/api/admin/audit?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setLogs(data.logs)
                setFeedTotal(data.total)
                setPages(data.pages)
            }
        } catch (err) {
            console.error('[admin/audit] Failed to load feed:', err)
            toast.error('Failed to load activity feed')
        } finally {
            setLoadingFeed(false)
        }
    }, [actionFilter, resourceFilter, categoryFilter, outcomeFilter, debouncedUserId, debouncedResourceId, page, getToken])

    useEffect(() => { fetchFeed() }, [fetchFeed])

    const handleFilterChange = (key, value) => {
        setPage(1)
        if (key === 'action') setActionFilter(value)
        if (key === 'resource') setResourceFilter(value)
        if (key === 'category') setCategoryFilter(value)
        if (key === 'outcome') setOutcomeFilter(value)
        if (key === 'resourceId') setResourceIdInput(value)
        if (key === 'userId') setUserIdInput(value)
    }

    const clearFilters = () => {
        setActionFilter('')
        setResourceFilter('')
        setCategoryFilter('')
        setOutcomeFilter('')
        setResourceIdInput('')
        setUserIdInput('')
        setPage(1)
    }

    const isFiltered = Boolean(actionFilter || resourceFilter || categoryFilter || outcomeFilter || debouncedUserId || debouncedResourceId)

    const executeDelete = async () => {
        if (!confirmAction) return
        setDeleting(true)
        try {
            const token = await getToken()
            const url = confirmAction.type === 'all'
                ? '/api/admin/audit?all=true'
                : `/api/admin/audit?days=${confirmAction.days}`
            const { data } = await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(
                    confirmAction.type === 'all'
                        ? `Cleared all audit logs (${data.deleted} deleted)`
                        : `Deleted ${data.deleted} audit log entries`
                )
                fetchFeed()
                fetchSummary()
            }
        } catch (err) {
            console.error('[admin/audit] Failed to delete audit logs:', err)
            toast.error('Failed to delete audit logs')
        } finally {
            setDeleting(false)
            setConfirmAction(null)
        }
    }

    const handleClearAll = () => setConfirmAction({ type: 'all' })
    const handleClearOld = (days = 30) => setConfirmAction({ type: 'old', days })

    return (
        <div className='flex-1 min-h-screen bg-canvas text-stone-900'>
            <div className='w-full md:p-10 p-4 max-w-7xl mx-auto space-y-8'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight text-stone-950'>Audit Logs</h2>
                        <p className='text-xs text-stone-500 font-medium mt-1'>
                            {isFiltered
                                ? <>{feedTotal.toLocaleString()} matching events <span className='text-amber-600 font-bold'>(filtered)</span></>
                                : <>{feedTotal.toLocaleString()} events in feed · system activity ledger</>
                            }
                        </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <button
                            onClick={() => handleClearOld(30)}
                            disabled={deleting}
                            className='rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50 cursor-pointer shadow-2xs'
                        >
                            {deleting ? 'Clearing…' : 'Clear > 30 days'}
                        </button>
                        <button
                            onClick={handleClearAll}
                            disabled={deleting || (feedTotal === 0 && (!summary?.total30d || summary.total30d === 0))}
                            className='rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50 cursor-pointer shadow-2xs'
                        >
                            {deleting ? 'Clearing…' : 'Clear All Audit Logs'}
                        </button>
                        <button
                            onClick={() => { fetchFeed(); fetchSummary(); }}
                            className='rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs text-stone-600 transition-colors hover:border-amber-400 cursor-pointer shadow-2xs'
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {!loadingSum && (
                    <AuditStats
                        summary={summary}
                        topActions={topActions}
                        timeline={timeline}
                        actionFilter={actionFilter}
                        onFilterAction={(action) => handleFilterChange('action', actionFilter === action ? '' : action)}
                    />
                )}

                <div className='bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-2xs'>
                    <AuditFeedFilters
                        actionFilter={actionFilter}
                        resourceFilter={resourceFilter}
                        categoryFilter={categoryFilter}
                        outcomeFilter={outcomeFilter}
                        userIdInput={userIdInput}
                        resourceIdInput={resourceIdInput}
                        isFiltered={isFiltered}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                    />

                    <AuditFeedTable
                        logs={logs}
                        loading={loadingFeed}
                        page={page}
                        pages={pages}
                        onPageChange={setPage}
                        onSelectUser={(uid) => handleFilterChange('userId', uid)}
                    />
                </div>
            </div>

            <ConfirmDialog
                open={Boolean(confirmAction)}
                title={confirmAction?.type === 'all' ? 'Clear all audit logs?' : `Clear audit logs older than ${confirmAction?.days} days?`}
                description={
                    confirmAction?.type === 'all'
                        ? 'This will permanently delete the entire audit history and reset activity metrics. This action cannot be undone.'
                        : `All audit log entries created more than ${confirmAction?.days} days ago will be permanently deleted.`
                }
                confirmLabel={confirmAction?.type === 'all' ? 'Clear All Audit Logs' : `Delete > ${confirmAction?.days} days`}
                loading={deleting}
                onConfirm={executeDelete}
                onCancel={() => setConfirmAction(null)}
            />
        </div>
    )
}
