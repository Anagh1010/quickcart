'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import LogToolbar from '@/components/admin/logs/LogToolbar'
import LogResults from '@/components/admin/logs/LogResults'

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminLogsPage() {
    const { getToken } = useAppContext()
    const [logs, setLogs]     = useState([])
    const [total, setTotal]   = useState(0)
    const [pages, setPages]   = useState(1)
    const [loading, setLoading]   = useState(true)
    const [expanded, setExpanded] = useState(null)
    const [deleting, setDeleting] = useState(false)
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

    const handleClearOld = async (days) => {
        if (!confirm(`Delete all logs older than ${days} days?`)) return
        setDeleting(true)
        try {
            const token = await getToken()
            const { data } = await axios.delete(`/api/admin/logs?days=${days}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(`Deleted ${data.deleted} old log entries`)
                fetchLogs()
            }
        } catch (err) {
            console.error('[admin/logs] Failed to delete logs:', err)
            toast.error('Failed to delete logs')
        } finally {
            setDeleting(false)
        }
    }

    const handleClearAll = async () => {
        if (!confirm('Are you sure you want to delete ALL error logs? This cannot be undone.')) return
        setDeleting(true)
        try {
            const token = await getToken()
            const { data } = await axios.delete('/api/admin/logs?all=true', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(`Cleared all error logs (${data.deleted} deleted)`)
                fetchLogs()
            }
        } catch (err) {
            console.error('[admin/logs] Failed to clear all logs:', err)
            toast.error('Failed to clear logs')
        } finally {
            setDeleting(false)
        }
    }

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

    const [migrating, setMigrating] = useState(false)
    const handleMigrate = async () => {
        if (!confirm('Tag all existing logs with inferred category + status code?\nThis is safe to run multiple times.')) return
        setMigrating(true)
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/admin/logs/migrate', {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
                fetchLogs()
            }
        } catch {
            toast.error('Migration failed')
        } finally {
            setMigrating(false)
        }
    }

    return (
        <div className='min-h-screen flex-1 bg-[#fbf9f4]'>
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
                    migrating={migrating}
                    handleMigrate={handleMigrate}
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
        </div>
    )
}
