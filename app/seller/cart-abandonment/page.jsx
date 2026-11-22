'use client'
import React, { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import Footer from '@/components/seller/Footer'

const getRatingColor = (rate) => {
    if (rate >= 70) return 'bg-rose-500'
    if (rate >= 40) return 'bg-amber-500'
    return 'bg-emerald-500'
}

const getRatingLabel = (rate) => {
    if (rate >= 70) return { text: 'High Risk', cls: 'bg-rose-50 text-rose-700 border border-rose-200' }
    if (rate >= 40) return { text: 'Medium Risk', cls: 'bg-amber-50 text-amber-800 border border-amber-200' }
    return { text: 'Low Risk', cls: 'bg-emerald-50 text-emerald-800 border border-emerald-200' }
}

const today = new Date()
const defaultTo = today.toISOString().split('T')[0]
const defaultFrom = new Date(today - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

export default function CartAbandonmentPage() {
    const { getToken, currency } = useAppContext()
    const [from, setFrom] = useState(defaultFrom)
    const [to, setTo] = useState(defaultTo)
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    const analyse = async () => {
        if (!from || !to) return toast.error('Please select both dates')
        if (new Date(from) > new Date(to)) return toast.error('Start date must be before end date')
        setLoading(true)
        try {
            const token = await getToken()
            const { data } = await axios.get(`/api/seller/cart-abandonment?from=${from}&to=${to}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setResults(data.results)
                if (data.results.length === 0) toast('No products found', { icon: 'ℹ️' })
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error('[seller/cart-abandonment] Analysis failed:', err)
            toast.error('Failed to load analysis')
        } finally {
            setLoading(false)
        }
    }

    const totalAbandoned = results?.reduce((s, r) => s + r.abandonedCount, 0) ?? 0
    const totalInCart = results?.reduce((s, r) => s + r.inCartCount, 0) ?? 0
    const avgRate = totalInCart > 0 ? Math.round((totalAbandoned / totalInCart) * 100) : 0

    return (
        <div className='flex-1 min-h-screen flex flex-col justify-between bg-[#fbf9f4] text-stone-900'>
            <div className='w-full md:p-10 p-4 max-w-5xl mx-auto space-y-8'>

                <div>
                    <h2 className='text-2xl font-bold tracking-tight text-stone-950'>Cart Abandonment Analysis</h2>
                    <p className='text-xs text-stone-500 font-medium mt-1'>
                        See which of your products users have in their cart but haven't ordered in the selected period.
                    </p>
                </div>

                {/* Date Picker */}
                <div className='bg-white rounded-2xl border border-[#e6e4dc] shadow-2xs p-6'>
                    <h3 className='text-xs font-bold text-stone-400 uppercase tracking-wider mb-4'>Select Date Range</h3>
                    <div className='flex flex-wrap items-end gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[10px] font-bold text-stone-400 uppercase tracking-wider'>From</label>
                            <input
                                type='date'
                                value={from}
                                max={to}
                                onChange={e => setFrom(e.target.value)}
                                className='border border-[#e6e4dc] rounded-xl px-4 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-500 bg-white'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[10px] font-bold text-stone-400 uppercase tracking-wider'>To</label>
                            <input
                                type='date'
                                value={to}
                                min={from}
                                max={defaultTo}
                                onChange={e => setTo(e.target.value)}
                                className='border border-[#e6e4dc] rounded-xl px-4 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-500 bg-white'
                            />
                        </div>
                        <button
                            onClick={analyse}
                            disabled={loading}
                            className='bg-[#f5c344] hover:bg-[#e6b02e] text-stone-900 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs disabled:opacity-50 cursor-pointer'
                        >
                            {loading ? 'Analysing...' : 'Analyse'}
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                {results !== null && (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                            <div className='bg-white p-6 rounded-2xl border border-[#e6e4dc] shadow-2xs'>
                                <span className='text-[10px] font-bold text-stone-400 uppercase tracking-wider'>In Cart (currently)</span>
                                <div className='flex items-baseline gap-1.5 mt-3'>
                                    <span className='text-3xl font-extrabold text-stone-950'>{totalInCart}</span>
                                    <span className='text-xs text-stone-400 font-medium'>users</span>
                                </div>
                            </div>
                            <div className='bg-white p-6 rounded-2xl border border-[#e6e4dc] shadow-2xs'>
                                <span className='text-[10px] font-bold text-stone-400 uppercase tracking-wider'>Abandoned in Period</span>
                                <div className='flex items-baseline gap-1.5 mt-3'>
                                    <span className='text-3xl font-extrabold text-amber-800'>{totalAbandoned}</span>
                                    <span className='text-xs text-stone-400 font-medium'>users</span>
                                </div>
                            </div>
                            <div className='bg-white p-6 rounded-2xl border border-[#e6e4dc] shadow-2xs'>
                                <span className='text-[10px] font-bold text-stone-400 uppercase tracking-wider'>Avg Abandonment Rate</span>
                                <div className='flex items-baseline gap-1.5 mt-3'>
                                    <span className={`text-3xl font-extrabold ${avgRate >= 70 ? 'text-rose-600' : avgRate >= 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {avgRate}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Per-Product Table */}
                        {results.length === 0 ? (
                            <div className='bg-white rounded-2xl border border-[#e6e4dc] shadow-2xs p-12 text-center text-stone-400'>
                                <p className='text-3xl mb-2'>🛒</p>
                                <p className='font-medium text-stone-600'>None of your products are currently in any user's cart.</p>
                            </div>
                        ) : (
                            <div className='bg-white rounded-2xl border border-[#e6e4dc] shadow-2xs overflow-hidden'>
                                <div className='px-6 py-4 border-b border-stone-100 bg-[#fcfbf7]'>
                                    <h3 className='text-xs font-bold text-stone-900 uppercase tracking-wider'>Product-wise Breakdown</h3>
                                </div>
                                <div className='divide-y divide-stone-100'>
                                    {results.map(r => {
                                        const risk = getRatingLabel(r.abandonmentRate)
                                        return (
                                            <div key={r.productId} className='px-6 py-5 hover:bg-stone-50/60 transition-colors'>
                                                <div className='flex items-center gap-4 mb-3'>
                                                    <img
                                                        src={r.image}
                                                        alt={r.name}
                                                        className='size-12 rounded-xl object-contain border border-stone-200 bg-stone-50 p-1'
                                                        onError={e => e.target.style.display = 'none'}
                                                    />
                                                    <div className='flex-1 min-w-0'>
                                                        <div className='flex items-center gap-2 flex-wrap'>
                                                            <p className='text-stone-950 font-bold text-sm truncate'>{r.name}</p>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${risk.cls}`}>
                                                                {risk.text}
                                                            </span>
                                                        </div>
                                                        <p className='text-stone-500 text-xs mt-0.5 font-medium'>{currency}{r.price?.toLocaleString()}</p>
                                                    </div>
                                                    <div className='hidden sm:flex items-center gap-6 text-center'>
                                                        <div>
                                                            <p className='text-base font-extrabold text-stone-950'>{r.inCartCount}</p>
                                                            <p className='text-[10px] text-stone-400 uppercase tracking-wider font-bold'>In Cart</p>
                                                        </div>
                                                        <div>
                                                            <p className='text-base font-extrabold text-emerald-700'>{r.orderedCount}</p>
                                                            <p className='text-[10px] text-stone-400 uppercase tracking-wider font-bold'>Ordered</p>
                                                        </div>
                                                        <div>
                                                            <p className='text-base font-extrabold text-amber-800'>{r.abandonedCount}</p>
                                                            <p className='text-[10px] text-stone-400 uppercase tracking-wider font-bold'>Abandoned</p>
                                                        </div>
                                                        <div>
                                                            <p className={`text-base font-extrabold ${r.abandonmentRate >= 70 ? 'text-rose-600' : r.abandonmentRate >= 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                                {r.abandonmentRate}%
                                                            </p>
                                                            <p className='text-[10px] text-stone-400 uppercase tracking-wider font-bold'>Rate</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Abandonment rate bar */}
                                                <div className='w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200/50'>
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${getRatingColor(r.abandonmentRate)}`}
                                                        style={{ width: `${r.abandonmentRate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </div>
    )
}
