import { useEffect, useState } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { universityApi } from '../api/universityApi'
import type { UniversityResponse } from '../types/university'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import SearchBox from '../components/SearchBox'
import UniversityBox from '../components/UniversityBox'

const PAGE_SIZE = 15

export default function SearchPage() {
    const [universities, setUniversities] = useState<UniversityResponse[]>([])
    const [input, setInput] = useState('')
    const [tagIds, setTagIds] = useState<number[]>([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const run = async () => {
            setLoading(true)
            setError(null)
            try {
                const result = await universityApi.getUniversities(
                    page, PAGE_SIZE, 'elo,desc',
                    input || undefined,
                    tagIds.length ? tagIds : undefined
                )
                if (!cancelled) {
                    setUniversities(result.content)
                    setTotalPages(result.totalPages)
                    setTotalElements(result.totalElements)
                }
            } catch (e) {
                if (!cancelled) {
                    if (axios.isAxiosError(e)) {
                        const status = e.response?.status
                        if (status === 401) setError('Unauthorized. Please log in.')
                        else if (status === 403) setError('You do not have permission to view this.')
                        else if (status === 404) setError('Resource not found.')
                        else if (status === 500) setError('Server error. Please try again later.')
                        else setError(e.message || 'An unexpected error occurred.')
                    } else {
                        setError('An unexpected error occurred.')
                    }
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        run()
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, tagIds.join(','), page])

    const handleSearch = (newInput: string, newTagIds: number[]) => {
        setInput(newInput)
        setTagIds(newTagIds)
        setPage(0)
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Header />
            <div className="flex flex-1">
                <NavBar />

                {/* Main content — offset by navbar width */}
                <main className="flex-1 ml-64 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 space-y-6">

                        {/* Page title */}
                        <div>
                            <h1 className="text-2xl font-black text-zinc-800">University Rankings</h1>
                            <p className="text-sm text-zinc-400 font-medium mt-1">
                                Search and filter universities by name, abbreviation, or category
                            </p>
                        </div>

                        {/* Search box */}
                        <div className="bg-white/70 backdrop-blur-xl border border-zinc-200 rounded-2xl p-4 shadow-sm">
                            <SearchBox onSearch={handleSearch} />
                        </div>

                        {/* Result count */}
                        {!loading && !error && universities.length > 0 && (
                            <p className="text-xs font-bold text-zinc-400">
                                Showing {universities.length} of {totalElements} universities
                            </p>
                        )}

                        {/* States */}
                        {loading && (
                            <div className="flex flex-col gap-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-2xl bg-zinc-100 animate-pulse" />
                                ))}
                            </div>
                        )}

                        {error && (
                            <div className="px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold">
                                {error}
                            </div>
                        )}

                        {!loading && !error && universities.length === 0 && (
                            <div className="text-center py-16 text-zinc-400 font-bold text-sm">
                                No universities found.
                            </div>
                        )}

                        {/* List */}
                        {!loading && !error && (
                            <div className="flex flex-col gap-2">
                                {universities.map(u => (
                                    <UniversityBox key={u.id} university={u} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-2">
                                <button
                                    onClick={() => setPage(p => p - 1)}
                                    disabled={page === 0 || loading}
                                    className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-black text-zinc-600">
                                    {page + 1} <span className="text-zinc-300">/</span> {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page === totalPages - 1 || loading}
                                    className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    )
}