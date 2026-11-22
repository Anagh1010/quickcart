'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import AuditStats from '@/components/admin/audit/AuditStats'
import AuditFeedFilters from '@/components/admin/audit/AuditFeedFilters'
import AuditFeedTable from '@/components/admin/audit/AuditFeedTable'

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

    useEffect(() => {
        (async () => {
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
        })()
    }, [getToken])

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

    return (
        <div className='flex-1 min-h-screen bg-[#fbf9f4] text-stone-900'>
            <div className='w-full md:p-10 p-4 max-w-5xl mx-auto space-y-8'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight text-stone-950'>Audit Logs</h2>
                        <p className='text-xs text-stone-500 font-medium mt-1'>
                            {isFiltered
                                ? <>{feedTotal.toLocaleString()} matching events <span className='text-amber-600 font-bold'>(filtered)</span></>
                                : <>{feedTotal.toLocaleString()} events in feed · immutable system activity ledger</>
                            }
                        </p>
                    </div>
                    <span className='text-xs text-stone-500 font-semibold border border-[#e6e4dc] bg-white px-3 py-1.5 rounded-xl shadow-2xs'>
                        Append-only history
                    </span>
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

                <div className='bg-white border border-[#e6e4dc] rounded-2xl overflow-hidden shadow-2xs'>
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
        </div>
    )
}
