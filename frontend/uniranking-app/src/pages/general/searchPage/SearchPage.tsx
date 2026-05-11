/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { universityApi } from '../../../api/universityApi'
import type { UniversityResponse } from '../../../types/university'
import NavBar from '../../../components/NavBar'
import Footer from '../../../components/Footer'
import ServerErrorBox from '../../../components/ServerErrorBox'
import Pagination from '../../../components/Pagination'
import SearchBox from './SearchBox'
import UniversityBox from './UniversityBox'

const PAGE_SIZE = 15

export default function SearchPage() {
    const [allUniversities, setAllUniversities] = useState<UniversityResponse[]>([])
    const [input, setInput] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [sortField, setSortField] = useState<'elo' | 'name'>('elo')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const processApiResult = (result: any): UniversityResponse[] => {
        if (result && !Array.isArray(result) && Array.isArray(result.content)) {
            localStorage.removeItem('universities')
            return result.content
        }
        if (!Array.isArray(result)) {
            localStorage.removeItem('universities')
            return []
        }
        return result
    }

    useEffect(() => {
        let isMounted = true
        const fetchUniversities = async () => {
            setLoading(true)
            setError(null)
            try {
                const rawResult = await universityApi.getAllUniversities()
                if (isMounted) {
                    setAllUniversities(processApiResult(rawResult))
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
    }, [])

    useEffect(() => {
        let isMounted = true
        const intervalId = setInterval(async () => {
            try {
                const rawResult = await universityApi.getAllUniversities()
                if (isMounted) {
                    setAllUniversities(processApiResult(rawResult))
                }
            } catch (e) {
                console.error("Background refetch failed", e)
            }
        }, 5 * 60 * 1000 + 1000)
        return () => {
            isMounted = false
            clearInterval(intervalId)
        }
    }, [])

    const handleSort = (field: 'elo' | 'name') => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection(field === 'elo' ? 'desc' : 'asc')
        }
        setPage(0)
    }

    const filteredUniversities = useMemo(() => {
        if (!Array.isArray(allUniversities)) return []
        let result = allUniversities
        if (input) {
            const lowerInput = input.toLowerCase()
            result = result.filter((u: any) =>
                u.name?.toLowerCase().includes(lowerInput) ||
                u.abbreviation?.toLowerCase().includes(lowerInput)
            )
        }
        if (selectedTags.length > 0) {
            result = result.filter((u: any) => {
                if (Array.isArray(u.tags)) {
                    return selectedTags.some(tag => u.tags.includes(tag))
                }
                return false
            })
        }
        return [...result].sort((a: any, b: any) => {
            if (sortField === 'name') {
                const nameA = a.name?.toLowerCase() || ''
                const nameB = b.name?.toLowerCase() || ''
                return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
            } else {
                const eloA = a.elo || 0
                const eloB = b.elo || 0
                return sortDirection === 'asc' ? eloA - eloB : eloB - eloA
            }
        })
    }, [allUniversities, input, selectedTags, sortField, sortDirection])

    const totalElements = filteredUniversities.length
    const totalPages = Math.ceil(totalElements / PAGE_SIZE)
    const displayedUniversities = filteredUniversities.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const handleSearch = useCallback((newInput: string, newTags: string[]) => {
        setInput(newInput)
        setSelectedTags(newTags)
        setPage(0)
    }, [])

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex flex-col relative transition-colors duration-300">
            <div className="flex flex-1">
                <NavBar />
                <main className="flex-1 ml-64 flex flex-col pt-14 min-h-screen">
                    <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-primary)]">University Rankings</h1>
                            <p className="text-sm text-[var(--text-primary)] opacity-40 font-medium mt-1">
                                Search and filter universities by name, abbreviation, or category
                            </p>
                        </div>
                        <div className="bg-[var(--bg-side)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-4 shadow-sm">
                            <SearchBox onSearch={handleSearch} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="h-6 flex items-center">
                                {!loading && !error && displayedUniversities.length > 0 && (
                                    <p className="text-xs font-bold text-[var(--text-primary)] opacity-40">
                                        Showing {displayedUniversities.length} of {totalElements} universities
                                    </p>
                                )}
                            </div>
                            {!loading && !error && totalElements > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSort('elo')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${sortField === 'elo'
                                            ? 'bg-[var(--accent-purple)]/10 border-[var(--accent-purple)]/30 text-[var(--accent-purple)]'
                                            : 'bg-[var(--bg-side)] border-[var(--border-color)] text-[var(--text-primary)] opacity-60 hover:opacity-100 hover:border-[var(--text-primary)]/20'
                                            }`}
                                    >
                                        Rank/Elo
                                        {sortField === 'elo'
                                            ? (sortDirection === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />)
                                            : <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                                        }
                                    </button>
                                    <button
                                        onClick={() => handleSort('name')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${sortField === 'name'
                                            ? 'bg-[var(--accent-purple)]/10 border-[var(--accent-purple)]/30 text-[var(--accent-purple)]'
                                            : 'bg-[var(--bg-side)] border-[var(--border-color)] text-[var(--text-primary)] opacity-60 hover:opacity-100 hover:border-[var(--text-primary)]/20'
                                            }`}
                                    >
                                        Name
                                        {sortField === 'name'
                                            ? (sortDirection === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />)
                                            : <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                                        }
                                    </button>
                                </div>
                            )}
                        </div>
                        {loading && (
                            <div className="flex flex-col gap-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-2xl bg-[var(--text-primary)]/5 animate-pulse" />
                                ))}
                            </div>
                        )}
                        {!loading && !error && displayedUniversities.length === 0 && (
                            <div className="text-center py-16 text-[var(--text-primary)] opacity-40 font-bold text-sm">
                                No universities found.
                            </div>
                        )}
                        {!loading && !error && (
                            <div className="flex flex-col gap-2">
                                {displayedUniversities.map((u, index) => (
                                    <UniversityBox key={u.id} university={u} rank={page * PAGE_SIZE + index + 1} />
                                ))}
                            </div>
                        )}
                        {totalPages > 1 && (
                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} disabled={loading} />
                        )}
                    </div>
                    <Footer />
                </main>
            </div>
            {error && <ServerErrorBox message={error} onClose={() => setError(null)} />}
        </div>
    )
}