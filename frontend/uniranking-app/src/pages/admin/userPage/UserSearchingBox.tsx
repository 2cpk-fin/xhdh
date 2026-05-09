import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import UserControlledItem from './UserControlledItem'
import userApi from '../../../api/userApi'
import type { UserResponse } from '../../../types/user'
import type { Page } from '../../../types/general'

type Props = {
    onSelect: (user: UserResponse) => void
}

export default function UserSearchingBox({ onSelect }: Props) {
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userPageData, setUserPageData] = useState<Page<UserResponse> | null>(null)
    const [page, setPage] = useState(0)

    const fetchUsers = useCallback(async (targetPage: number) => {
        setIsLoading(true)
        try {
            const res = await userApi.getAllUser(targetPage, 15)
            setUserPageData(res)
        } catch (error) {
            console.error('Failed to fetch users', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers(0)
    }, [fetchUsers])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Note: userApi.getUserByUsername returns a single user, not a page.
        // For now, filtering is done client-side on the fetched page.
        // If a server-side search endpoint is added later, replace this logic.
        setPage(0)
        fetchUsers(0)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        fetchUsers(newPage)
    }

    // Client-side filter by username/email against the current page
    const filtered = userPageData
        ? userPageData.content.filter(u =>
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
        )
        : []

    return (
        <div className="space-y-4">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Filter by username or email..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm transition"
                    />
                </div>
                <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-900 text-white text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                    Search
                </button>
            </form>

            {/* Results */}
            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center text-zinc-500 text-sm py-10">Loading users...</div>
                ) : filtered.length > 0 ? (
                    filtered.map(user => (
                        <UserControlledItem key={user.id} user={user} onClick={() => onSelect(user)} />
                    ))
                ) : (
                    <div className="text-center text-zinc-400 text-sm py-10">
                        No users found.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {userPageData && userPageData.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-200 gap-4">
                    <span className="text-sm font-medium text-zinc-500">
                        Page <span className="font-bold text-zinc-900">{userPageData.number + 1}</span> of{' '}
                        <span className="font-bold text-zinc-900">{userPageData.totalPages}</span>
                    </span>
                    <div className="flex gap-2 items-center">
                        <button
                            disabled={userPageData.first}
                            onClick={() => handlePageChange(page - 1)}
                            className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} className="text-zinc-600" />
                        </button>
                        <div className="hidden sm:flex gap-1.5">
                            {Array.from({ length: userPageData.totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i
                                        ? 'bg-zinc-900 text-white shadow-sm'
                                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-400'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={userPageData.last}
                            onClick={() => handlePageChange(page + 1)}
                            className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} className="text-zinc-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}