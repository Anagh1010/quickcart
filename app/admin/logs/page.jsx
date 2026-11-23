'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import LogToolbar from '@/components/admin/logs/LogToolbar'
import LogResults from '@/components/admin/logs/LogResults'
import ConfirmDialog from '@/components/common/ConfirmDialog'

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminLogsPage() {
    const { getToken } = useAppContext()
    const [logs, setLogs]     = useState([])
    const [total, setTotal]   = useState(0)
    const [pages, setPages]   = useState(1)
    const [loading, setLoading]   = useState(true)
    const [expanded, setExpanded] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [confirmAction, setConfirmAction] = useState(null)
    const [filters, setFilters] = useState({ level: 'all', category: 'all', statusCode: 'all', route: '', page: 1 })
    const [ttlDays, setTtlDays]           = useState(90)
    const [ttlInput, setTtlInput]         = useState(90)
    const [savingTtl, setSavingTtl]       = useState(false)
    const [loggingEnabled, setLoggingEnabled] = useState(true)
    const [togglingLog, setTogglingLog]   = useState(false)

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        try {
            const token = await getToken()
            const params = new URLSearchParams({
                page: filters.page,
                limit: 50,
                ...(filters.level      !== 'all' && { level:      filters.level }),
                ...(filters.category   !== 'all' && { category:   filters.category }),
                ...(filters.statusCode !== 'all' && { statusCode: filters.statusCode }),
                ...(filters.route               && { route:       filters.route })
            })
            const { data } = await axios.get(`/api/admin/logs?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setLogs(data.logs)
                setTotal(data.total)
                setPages(data.pages)
            }
        } catch {
            toast.error('Failed to load logs')
        } finally {
            setLoading(false)
        }
    }, [filters, getToken])

    useEffect(() => { fetchLogs() }, [fetchLogs])

    // Fetch current TTL setting on mount
    useEffect(() => {
        (async () => {
            try {
                const token = await getToken()
                const { data } = await axios.get('/api/admin/logs/settings', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (data.success) {
                    setTtlDays(data.ttlDays)
                    setTtlInput(data.ttlDays)
                    setLoggingEnabled(data.loggingEnabled)
                }
            } catch { /* non-critical */ }
        })()
    }, [getToken])

    const handleSaveTtl = async () => {
        const days = parseInt(ttlInput)
        if (isNaN(days) || days < 1 || days > 365) return toast.error('TTL must be between 1 and 365 days')
        setSavingTtl(true)
        try {
            const token = await getToken()
            const { data } = await axios.patch('/api/admin/logs/settings', { ttlDays: days }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setTtlDays(data.ttlDays)
                setTtlInput(data.ttlDays)
                toast.success(`Auto-purge set to ${data.ttlDays} days`)
            }
        } catch {
            toast.error('Failed to update TTL')
        } finally {
            setSavingTtl(false)
        }
    }

    const handleToggleLogging = async () => {
        setTogglingLog(true)
        try {
            const token = await getToken()
            const { data } = await axios.patch('/api/admin/logs/settings',
                { loggingEnabled: !loggingEnabled },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                setLoggingEnabled(data.loggingEnabled)
                toast.success(data.loggingEnabled ? 'Error logging enabled' : 'Error logging disabled')
            }
        } catch {
            toast.error('Failed to update logging state')
        } finally {
            setTogglingLog(false)
        }
    }

    const executeDelete = async () => {
        if (!confirmAction) return
        setDeleting(true)
        try {
            const token = await getToken()
            const url = confirmAction.type === 'all'
                ? '/api/admin/logs?all=true'
                : `/api/admin/logs?days=${confirmAction.days}`
            const { data } = await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(
                    confirmAction.type === 'all'
                        ? `Cleared all error logs (${data.deleted} deleted)`
                        : `Deleted ${data.deleted} old log entries`
                )
                fetchLogs()
            }
        } catch (err) {
            console.error('[admin/logs] Failed to delete logs:', err)
            toast.error('Failed to delete logs')
        } finally {
            setDeleting(false)
            setConfirmAction(null)
        }
    }

    const handleClearOld = (days) => setConfirmAction({ type: 'old', days })
    const handleClearAll = () => setConfirmAction({ type: 'all' })

    const fireTestLog = async (level, category = 'api', statusCode = null) => {
        try {
            const token = await getToken()
            const params = new URLSearchParams({ level, category, ...(statusCode && { statusCode }) })
            const { data } = await axios.get(`/api/admin/logs/test?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
                setTimeout(fetchLogs, 500)
            }
        } catch {
            toast.error('Failed to fire test log')
        }
    }

    return (
        <div className='min-h-screen flex-1 bg-canvas'>
            <div className='mx-auto w-full max-w-7xl space-y-6 p-4 md:p-10'>
                <LogToolbar
                    total={total}
                    ttlDays={ttlDays}
                    ttlInput={ttlInput}
                    setTtlInput={setTtlInput}
                    savingTtl={savingTtl}
                    handleSaveTtl={handleSaveTtl}
                    loggingEnabled={loggingEnabled}
                    togglingLog={togglingLog}
                    handleToggleLogging={handleToggleLogging}
                    fireTestLog={fireTestLog}
                    deleting={deleting}
                    handleClearOld={handleClearOld}
                    handleClearAll={handleClearAll}
                    filters={filters}
                    setFilters={setFilters}
                    fetchLogs={fetchLogs}
                />
                <LogResults
                    logs={logs}
                    loading={loading}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    pages={pages}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            <ConfirmDialog
                open={Boolean(confirmAction)}
                title={confirmAction?.type === 'all' ? 'Clear all error logs?' : `Clear error logs older than ${confirmAction?.days} days?`}
                description={
                    confirmAction?.type === 'all'
                        ? 'This will permanently delete every stored error log entry. This action cannot be undone.'
                        : `All error log entries created more than ${confirmAction?.days} days ago will be permanently deleted.`
                }
                confirmLabel={confirmAction?.type === 'all' ? 'Clear All Error Logs' : `Delete > ${confirmAction?.days} days`}
                loading={deleting}
                onConfirm={executeDelete}
                onCancel={() => setConfirmAction(null)}
            />
        </div>
    )
}
