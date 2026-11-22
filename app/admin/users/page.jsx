'use client'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const ROLES = ['user', 'seller', 'admin']

const roleColors = {
    admin: 'bg-rose-50 text-rose-700 border border-rose-200',
    seller: 'bg-amber-50 text-amber-800 border border-amber-200',
    user: 'bg-stone-100 text-stone-600 border border-stone-200'
}

export default function AdminUsersPage() {
    const { getToken } = useAppContext()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [updating, setUpdating] = useState(null)

    const fetchUsers = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) setUsers(data.users)
        } catch (err) {
            console.error('[admin/users] Failed to load users:', err)
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    const handleRoleChange = async (userId, newRole) => {
        setUpdating(userId)
        try {
            const token = await getToken()
            const { data } = await axios.patch(
                `/api/admin/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u))
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error('[admin/users] Failed to update role:', err)
            toast.error('Failed to update role')
        } finally {
            setUpdating(null)
        }
    }

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='flex-1 min-h-screen bg-[#fbf9f4] text-stone-900'>
            <div className='w-full md:p-10 p-4 max-w-5xl mx-auto space-y-6'>

                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight text-stone-950'>All Users</h2>
                        <p className='text-xs text-stone-500 font-medium mt-1'>{users.length} registered accounts</p>
                    </div>
                    <input
                        type='text'
                        placeholder='Search by name or email...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className='border border-[#e6e4dc] bg-white text-stone-800 placeholder-stone-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 w-full sm:w-72 shadow-2xs'
                    />
                </div>

                <div className='bg-white rounded-2xl border border-[#e6e4dc] shadow-2xs overflow-hidden'>
                    {loading ? (
                        <div className='flex items-center justify-center h-64'>
                            <div className='animate-spin size-8 border-2 border-amber-500 border-t-transparent rounded-full' />
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-stone-100 bg-[#fcfbf7] text-stone-400 text-xs uppercase tracking-wider'>
                                        <th className='text-left px-6 py-4 font-bold'>User</th>
                                        <th className='text-left px-6 py-4 font-bold'>Email</th>
                                        <th className='text-left px-6 py-4 font-bold'>Role</th>
                                        <th className='text-left px-6 py-4 font-bold'>Change Role</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-stone-100'>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className='text-center py-12 text-stone-400'>No users found</td>
                                        </tr>
                                    ) : filtered.map(user => (
                                        <tr key={user._id} className='hover:bg-stone-50 transition-colors'>
                                            <td className='px-6 py-4'>
                                                <div className='flex items-center gap-3'>
                                                    {user.imageUrl ? (
                                                        <img
                                                            src={user.imageUrl}
                                                            alt={user.name}
                                                            className='size-8 rounded-full object-cover border border-stone-200'
                                                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        style={{ display: user.imageUrl ? 'none' : 'flex' }}
                                                        className='size-8 rounded-full bg-amber-100 items-center justify-center text-amber-800 font-bold text-xs'
                                                    >
                                                        {user.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <span className='text-stone-900 font-semibold text-xs'>{user.name}</span>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 text-stone-500 text-xs'>{user.email}</td>
                                            <td className='px-6 py-4'>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleColors[user.role] || roleColors.user}`}>
                                                    {user.role || 'user'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <div className='flex items-center gap-2'>
                                                    {ROLES.map(role => (
                                                        <button
                                                            key={role}
                                                            disabled={user.role === role || updating === user._id}
                                                            onClick={() => handleRoleChange(user._id, role)}
                                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                                                                user.role === role
                                                                    ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                                                                    : 'bg-white hover:bg-[#f5c344] hover:text-stone-900 hover:border-amber-400 text-stone-700 border-[#e6e4dc] cursor-pointer'
                                                            } ${updating === user._id ? 'opacity-50' : ''}`}
                                                        >
                                                            {updating === user._id ? '...' : role}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
