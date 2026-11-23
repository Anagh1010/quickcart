'use client'
import React, { useState } from 'react'
import { ACTION_LABELS } from './AuditConstants'

export const StatCard = ({ label, value, sub }) => (
    <div className='bg-white border border-[#e6e4dc] rounded-2xl p-5 flex flex-col gap-1 shadow-2xs'>
        <p className='text-xs text-stone-400 font-semibold uppercase tracking-wider'>{label}</p>
        <p className='text-3xl font-extrabold text-stone-900'>{value?.toLocaleString() ?? '—'}</p>
        {sub && <p className='text-xs text-stone-500 font-medium'>{sub}</p>}
    </div>
)

export const MiniBar = ({ value, max }) => (
    <div className='h-1.5 bg-stone-100 rounded-full overflow-hidden w-full'>
        <div
            className='h-full bg-amber-500 rounded-full transition-all duration-500'
            style={{ width: max ? `${Math.round((value / max) * 100)}%` : '0%' }}
        />
    </div>
)

export const Sparkline = ({ data }) => {
    const [hovered, setHovered] = useState(null)
    if (!data?.length) return null

    const counts = data.map(d => d.count)
    const max = Math.max(...counts, 1)
    const w = 280, h = 60, pad = 6
    const coords = data.map((d, i) => ({
        x: pad + (i / (data.length - 1 || 1)) * (w - pad * 2),
        y: h - pad - ((d.count / max) * (h - pad * 2)),
        date: d._id,
        count: d.count,
    }))
    const pts = coords.map(c => `${c.x},${c.y}`).join(' ')
    const areaPts = `${coords[0].x},${h - pad} ${pts} ${coords[coords.length - 1].x},${h - pad}`
    const active = hovered !== null ? coords[hovered] : null

    return (
        <div className='relative'>
            <div className='mb-1 flex h-5 items-center justify-between text-[11px]'>
                {active ? (
                    <>
                        <span className='font-mono font-semibold text-stone-700'>{active.date}</span>
                        <span className='rounded-md bg-amber-50 px-1.5 py-0.5 font-mono font-bold text-amber-900 border border-amber-200'>
                            {active.count.toLocaleString()} events
                        </span>
                    </>
                ) : (
                    <span className='text-stone-400'>Hover a point to inspect daily volume</span>
                )}
            </div>
            <svg viewBox={`0 0 ${w} ${h}`} className='w-full h-16 overflow-visible' onMouseLeave={() => setHovered(null)}>
                <polygon fill='#f5c344' fillOpacity='0.14' points={areaPts} />
                <polyline fill='none' stroke='#f5c344' strokeWidth='2' strokeLinejoin='round' strokeLinecap='round' points={pts} />
                {coords.map((c, i) => (
                    <g key={c.date} onMouseEnter={() => setHovered(i)} className='cursor-pointer'>
                        <circle cx={c.x} cy={c.y} r='8' fill='transparent' />
                        <circle
                            cx={c.x}
                            cy={c.y}
                            r={hovered === i ? '4' : '2.5'}
                            fill={hovered === i ? '#141518' : '#e6b02e'}
                            stroke={hovered === i ? '#f5c344' : 'none'}
                            strokeWidth='1.5'
                        />
                    </g>
                ))}
            </svg>
        </div>
    )
}

export default function AuditStats({ summary, topActions, timeline, actionFilter, onFilterAction }) {
    const topMax = topActions[0]?.count || 1

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <StatCard label='Events Today' value={summary?.totalToday} sub='last 24 hours' />
                <StatCard label='Events This Week' value={summary?.total7d} sub='last 7 days' />
                <StatCard label='Events This Month' value={summary?.total30d} sub='last 30 days' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-white border border-[#e6e4dc] rounded-2xl p-6 shadow-2xs'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-sm font-bold text-stone-900 uppercase tracking-wider'>Top Features</h3>
                        <span className='text-[10px] text-stone-400 font-medium'>click to filter feed</span>
                    </div>
                    <div className='space-y-3'>
                        {topActions.map(({ _id, count }) => {
                            const meta = ACTION_LABELS[_id]
                            const active = actionFilter === _id
                            return (
                                <button
                                    key={_id}
                                    onClick={() => onFilterAction(_id)}
                                    className={`w-full text-left space-y-1 rounded-xl px-2 py-1.5 transition-colors cursor-pointer ${
                                        active ? 'bg-amber-50 ring-1 ring-amber-400' : 'hover:bg-stone-50'
                                    }`}
                                >
                                    <div className='flex items-center justify-between'>
                                        <span className='text-xs text-stone-700 font-medium flex items-center gap-1.5'>
                                            <span>{meta?.icon || '•'}</span>
                                            {meta?.label || _id}
                                        </span>
                                        <span className='text-xs font-bold text-stone-500 tabular-nums'>
                                            {count.toLocaleString()}
                                        </span>
                                    </div>
                                    <MiniBar value={count} max={topMax} />
                                </button>
                            )
                        })}
                        {topActions.length === 0 && <p className='text-xs text-stone-400'>No events recorded yet</p>}
                    </div>
                </div>

                <div className='bg-white border border-[#e6e4dc] rounded-2xl p-6 flex flex-col shadow-2xs'>
                    <h3 className='text-sm font-bold text-stone-900 uppercase tracking-wider mb-1'>Activity — Last 14 Days</h3>
                    <p className='text-xs text-stone-400 mb-4 font-medium'>Daily event volume</p>
                    <div className='flex-1 flex flex-col justify-end'>
                        <Sparkline data={timeline} />
                        {timeline.length > 0 && (
                            <div className='flex justify-between mt-1'>
                                <span className='text-[10px] text-stone-400 font-mono'>{timeline[0]?._id}</span>
                                <span className='text-[10px] text-stone-400 font-mono'>{timeline[timeline.length - 1]?._id}</span>
                            </div>
                        )}
                        {timeline.length === 0 && <p className='text-xs text-stone-400'>No data yet</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
