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
        setPage(0)
        fetchUsers(0)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        fetchUsers(newPage)
    }

    const filtered = userPageData
        ? userPageData.content.filter(u =>
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
        )
        : []

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)] opacity-30" />
                    <input
                        type="text"
                        placeholder="Filter by username or email..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 shadow-sm transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-main)] text-sm font-bold shadow-md transition-all hover:opacity-90 active:scale-95"
                >
                    Search
                </button>
            </form>

            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center text-[var(--text-primary)] opacity-40 text-sm py-10 font-bold animate-pulse">Scanning records...</div>
                ) : filtered.length > 0 ? (
                    filtered.map(user => (
                        <UserControlledItem key={user.id} user={user} onClick={() => onSelect(user)} />
                    ))
                ) : (
                    <div className="text-center text-[var(--text-primary)] opacity-30 text-sm py-10 font-medium">
                        No users found.
                    </div>
                )}
            </div>

            {userPageData && userPageData.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[var(--border-color)] gap-4">
                    <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30">
                        Page {userPageData.number + 1} of {userPageData.totalPages}
                    </span>
                    <div className="flex gap-2 items-center">
                        <button
                            disabled={userPageData.first}
                            onClick={() => handlePageChange(page - 1)}
                            className="p-2.5 bg-[var(--bg-main)] dark:bg-[#030005] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] opacity-60 hover:opacity-100 disabled:opacity-20 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="hidden sm:flex gap-1.5">
                            {Array.from({ length: userPageData.totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${page === i
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'bg-[var(--bg-main)] dark:bg-[#030005] border border-[var(--border-color)] text-[var(--text-primary)] opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={userPageData.last}
                            onClick={() => handlePageChange(page + 1)}
                            className="p-2.5 bg-[var(--bg-main)] dark:bg-[#030005] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] opacity-60 hover:opacity-100 disabled:opacity-20 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}