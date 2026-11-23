'use client'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function AdminSellersPage() {
    const { getToken } = useAppContext()
    const [sellers, setSellers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = await getToken()
                const { data } = await axios.get('/api/admin/sellers', { headers: { Authorization: `Bearer ${token}` } })
                if (data.success) setSellers(data.sellers)
            } catch (err) {
                console.error('[admin/sellers] Failed to load sellers:', err)
                toast.error('Failed to load sellers')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [getToken])

    const filtered = sellers.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='flex-1 min-h-screen bg-canvas text-stone-900'>
            <div className='w-full md:p-10 p-4 max-w-5xl mx-auto space-y-6'>

                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight text-stone-950'>Sellers</h2>
                        <p className='text-xs text-stone-500 font-medium mt-1'>{sellers.length} active sellers on the platform</p>
                    </div>
                    <input
                        type='text'
                        placeholder='Search sellers...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className='border border-border-subtle bg-white text-stone-800 placeholder-stone-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 w-full sm:w-72 shadow-2xs'
                    />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
                    {loading ? (
                        <div className='col-span-3 flex items-center justify-center h-64'>
                            <div className='animate-spin size-8 border-2 border-amber-500 border-t-transparent rounded-full' />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className='col-span-3 text-center py-16 text-stone-400 font-medium text-sm'>No sellers found</div>
                    ) : filtered.map(seller => (
                        <div key={seller._id} className='bg-white p-6 rounded-2xl border border-border-subtle shadow-2xs hover:border-amber-400 transition-colors'>
                            <div className='flex items-center gap-3 mb-4'>
                                {seller.imageUrl ? (
                                    <img
                                        src={seller.imageUrl}
                                        alt={seller.name}
                                        className='size-12 rounded-full object-cover ring-2 ring-amber-100 border border-stone-200'
                                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                    />
                                ) : null}
                                <div
                                    style={{ display: seller.imageUrl ? 'none' : 'flex' }}
                                    className='size-12 rounded-full bg-amber-100 items-center justify-center text-amber-800 font-bold text-lg'
                                >
                                    {seller.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className='text-stone-950 font-bold text-sm'>{seller.name}</p>
                                    <p className='text-stone-400 text-xs'>{seller.email}</p>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-3 mb-4'>
                                <div className='bg-[#fcfbf7] rounded-xl p-3 text-center border border-border-subtle'>
                                    <p className='text-2xl font-extrabold text-amber-800'>{seller.productCount}</p>
                                    <p className='text-stone-400 text-[10px] mt-0.5 uppercase tracking-wider font-bold'>Products</p>
                                </div>
                                <div className='bg-[#fcfbf7] rounded-xl p-3 text-center border border-border-subtle'>
                                    <p className='text-2xl font-extrabold text-stone-900'>{seller.orderCount}</p>
                                    <p className='text-stone-400 text-[10px] mt-0.5 uppercase tracking-wider font-bold'>Orders</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border ${
                                seller.role === 'admin'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                                <span className={`size-1.5 rounded-full ${seller.role === 'admin' ? 'bg-rose-600' : 'bg-amber-600'}`} />
                                {seller.role === 'admin' ? 'Admin & Seller' : 'Active Seller'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
