'use client'
import React from 'react'
import { ACTION_LABELS, ALL_ACTIONS, ALL_RESOURCES, ALL_CATEGORIES, ALL_OUTCOMES } from './AuditConstants'

export default function AuditFeedFilters({
    actionFilter,
    resourceFilter,
    categoryFilter,
    outcomeFilter,
    userIdInput,
    resourceIdInput,
    isFiltered,
    onFilterChange,
    onClearFilters
}) {
    return (
        <div className='px-6 py-4 border-b border-stone-100 flex flex-wrap gap-3 items-center bg-[#fcfbf7]'>
            <div className='mr-auto flex items-center gap-2'>
                <h3 className='text-sm font-bold text-stone-900 uppercase tracking-wider'>Activity Feed</h3>
                {isFiltered && (
                    <button
                        onClick={onClearFilters}
                        className='text-[11px] text-amber-700 font-semibold hover:underline cursor-pointer'
                    >
                        clear filters ×
                    </button>
                )}
            </div>

            <select
                value={actionFilter}
                onChange={e => onFilterChange('action', e.target.value)}
                className='border border-border-subtle bg-white text-stone-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer'
            >
                <option value=''>All Actions</option>
                {ALL_ACTIONS.map(a => (
                    <option key={a} value={a}>{ACTION_LABELS[a]?.icon} {ACTION_LABELS[a]?.label}</option>
                ))}
            </select>

            <select
                value={categoryFilter}
                onChange={e => onFilterChange('category', e.target.value)}
                className='border border-border-subtle bg-white text-stone-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer'
            >
                <option value=''>All Categories</option>
                {ALL_CATEGORIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            <select
                value={outcomeFilter}
                onChange={e => onFilterChange('outcome', e.target.value)}
                className='border border-border-subtle bg-white text-stone-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer'
            >
                <option value=''>All Outcomes</option>
                {ALL_OUTCOMES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            <select
                value={resourceFilter}
                onChange={e => onFilterChange('resource', e.target.value)}
                className='border border-border-subtle bg-white text-stone-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer'
            >
                <option value=''>All Resources</option>
                {ALL_RESOURCES.map(r => (
                    <option key={r} value={r}>{r}</option>
                ))}
            </select>

            <input
                type='text'
                placeholder='Filter by User ID…'
                value={userIdInput}
                onChange={e => onFilterChange('userId', e.target.value)}
                className='border border-border-subtle bg-white rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-500 w-40'
            />
            <input
                type='text'
                placeholder='Target ID…'
                value={resourceIdInput}
                onChange={e => onFilterChange('resourceId', e.target.value)}
                className='border border-border-subtle bg-white rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-500 w-32'
            />
        </div>
    )
}
