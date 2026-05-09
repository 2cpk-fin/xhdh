import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { universityApi } from '../../../api/universityApi'
import type { UniversityResponse } from '../../../types/university'
import Header from '../../../components/Header'
import NavBar from '../../../components/NavBar'
import Footer from '../../../components/Footer'
import ServerErrorBox from '../../../components/ServerErrorBox'
import Pagination from '../../../components/Pagination'
import SearchBox from './SearchBox'
import UniversityBox from './UniversityBox'

const PAGE_SIZE = 15

export default function SearchPage() {
    const [universities, setUniversities] = useState<UniversityResponse[]>([])
    const [input, setInput] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const fetchUniversities = async () => {
            setLoading(true)
            setError(null)
            try {
                const result = await universityApi.getUniversities(
                    page,
                    PAGE_SIZE,
                    'elo,desc',
                    input || undefined,
                    selectedTags.length ? selectedTags : undefined
                )
                if (isMounted) {
                    setUniversities(result.content)
                    setTotalPages(result.totalPages)
                    setTotalElements(result.totalElements)
                }
            } catch (e) {
                if (isMounted) {
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
                if (isMounted) setLoading(false)
            }
        }

        fetchUniversities()
        return () => { isMounted = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, selectedTags.join(','), page])

    const handleSearch = useCallback((newInput: string, newTags: string[]) => {
        setInput(newInput)
        setSelectedTags(newTags)
        setPage(0)
    }, [])

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col relative">
            <Header />
            <div className="flex flex-1">
                <NavBar />

                <main className="flex-1 ml-64 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-6">

                        <div>
                            <h1 className="text-3xl font-black text-zinc-800">University Rankings</h1>
                            <p className="text-sm text-zinc-400 font-medium mt-1">
                                Search and filter universities by name, abbreviation, or category
                            </p>
                        </div>

                        <div className="bg-white/70 backdrop-blur-xl border border-zinc-200 rounded-2xl p-4 shadow-sm">
                            <SearchBox onSearch={handleSearch} />
                        </div>

                        {!loading && !error && universities.length > 0 && (
                            <p className="text-xs font-bold text-zinc-400">
                                Showing {universities.length} of {totalElements} universities
                            </p>
                        )}

                        {loading && (
                            <div className="flex flex-col gap-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-2xl bg-zinc-200" />
                                ))}
                            </div>
                        )}

                        {!loading && !error && universities.length === 0 && (
                            <div className="text-center py-16 text-zinc-400 font-bold text-sm">
                                No universities found.
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="flex flex-col gap-2">
                                {universities.map((u, index) => (
                                    <UniversityBox
                                        key={u.id}
                                        university={u}
                                        rank={page * PAGE_SIZE + index + 1}
                                    />
                                ))}
                            </div>
                        )}

                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            disabled={loading}
                        />

                    </div>

                    <Footer />
                </main>
            </div>

            {error && (
                <ServerErrorBox
                    message={error}
                    onClose={() => setError(null)}
                />
            )}
        </div>
    )
}