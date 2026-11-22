'use client'
import React, { useState } from 'react'
import { ACTION_LABELS } from './AuditConstants'

export const ActionBadge = ({ action }) => {
    const meta = ACTION_LABELS[action] || { label: action, icon: '•', color: 'bg-stone-100 text-stone-600' }
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
            <span>{meta.icon}</span> {meta.label}
        </span>
    )
}

export default function AuditFeedTable({ logs, loading, page, pages, onPageChange, onSelectUser }) {
    const [selectedLog, setSelectedLog] = useState(null)

    return (
        <div>
            {loading ? (
                <div className='space-y-3 p-6'>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className='h-11 bg-stone-100 rounded-xl animate-pulse' />
                    ))}
                </div>
            ) : logs.length === 0 ? (
                <div className='text-center py-16 text-stone-400 text-sm'>No audit events found</div>
            ) : (
                <div className='divide-y divide-stone-100'>
                    {logs.map(log => (
                        <button
                            key={log._id}
                            onClick={() => setSelectedLog(log)}
                            className='w-full text-left flex flex-wrap items-center gap-3 px-6 py-3.5 hover:bg-stone-50 transition-colors cursor-pointer'
                        >
                            <ActionBadge action={log.action} />
                            <span
                                className='text-xs text-stone-600 font-mono truncate max-w-[180px] hover:text-amber-700'
                                title={log.userId || 'anonymous'}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (log.userId && onSelectUser) onSelectUser(log.userId)
                                }}
                            >
                                {log.userId || <span className='text-stone-400 italic'>anonymous</span>}
                            </span>
                            {log.resourceId && (
                                <span className='text-[10px] text-stone-400 font-mono truncate max-w-[120px]' title={log.resourceId}>
                                    {log.resourceId}
                                </span>
                            )}
                            <span className='ml-auto text-[10px] text-stone-400 font-medium whitespace-nowrap'>
                                {new Date(log.createdAt).toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {pages > 1 && (
                <div className='flex justify-center items-center gap-2 py-4 border-t border-stone-100 bg-[#fcfbf7]'>
                    <button
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className='text-xs px-3 py-1.5 rounded-lg border border-[#e6e4dc] bg-white disabled:opacity-40 hover:bg-stone-50 cursor-pointer'
                    >
                        ← Prev
                    </button>
                    <span className='text-xs text-stone-500 font-medium px-2'>Page {page} of {pages}</span>
                    <button
                        onClick={() => onPageChange(Math.min(pages, page + 1))}
                        disabled={page === pages}
                        className='text-xs px-3 py-1.5 rounded-lg border border-[#e6e4dc] bg-white disabled:opacity-40 hover:bg-stone-50 cursor-pointer'
                    >
                        Next →
                    </button>
                </div>
            )}

            {selectedLog && (
                <div className='border-t border-[#e6e4dc] p-6 bg-stone-50'>
                    <div className='flex items-center justify-between gap-4 mb-3'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-stone-700'>Event Details</h4>
                        <button onClick={() => setSelectedLog(null)} className='text-xs text-stone-400 hover:text-stone-700 cursor-pointer font-bold'>
                            Close ✕
                        </button>
                    </div>
                    <pre className='text-xs text-stone-700 overflow-auto max-h-72 bg-white border border-[#e6e4dc] rounded-xl p-4'>
                        {JSON.stringify({
                            action: selectedLog.action,
                            category: selectedLog.category,
                            outcome: selectedLog.outcome,
                            actor: selectedLog.actor || { id: selectedLog.userId },
                            target: { resource: selectedLog.resource, id: selectedLog.resourceId, label: selectedLog.resourceLabel },
                            changes: selectedLog.changes,
                            metadata: selectedLog.metadata,
                            request: selectedLog.request,
                            occurredAt: selectedLog.createdAt
                        }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}
