import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import UniversityControlledItem from './UniversityItem'
import Pagination from '../../../components/Pagination'
import { universityApi } from '../../../api/universityApi'
import type { UniversityResponse } from '../../../types/university'
import type { Page } from '../../../types/general'

type Props = {
    onSelect: (university: UniversityResponse) => void
}

const formatTag = (tag: string) => {
    return tag
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export default function UniversitySearchingBox({ onSelect }: Props) {
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [uniPageData, setUniPageData] = useState<Page<UniversityResponse> | null>(null)
    const [page, setPage] = useState(0)

    const [availableTags, setAvailableTags] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    useEffect(() => {
        universityApi.getAllTags()
            .then(setAvailableTags)
            .catch(err => console.error('Failed to fetch tags', err))
    }, [])

    const fetchUniversities = useCallback(async (targetPage: number, currentQuery: string, currentTags: string[]) => {
        setIsLoading(true)
        try {
            const res = await universityApi.getUniversities(
                targetPage,
                15,
                'elo,desc',
                currentQuery,
                currentTags
            )
            setUniPageData(res)
        } catch (error) {
            console.error('Search failed', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUniversities(0, '', [])
    }, [fetchUniversities])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(0)
        fetchUniversities(0, query, selectedTags)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        fetchUniversities(newPage, query, selectedTags)
    }

    const toggleTag = (tagName: string) => {
        setSelectedTags(prev =>
            prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName]
        )
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search universities..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                        Search
                    </button>
                </div>

                {availableTags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {availableTags.map(tagName => (
                            <button
                                key={tagName}
                                type="button"
                                onClick={() => toggleTag(tagName)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${selectedTags.includes(tagName)
                                    ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200'
                                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-purple-300 hover:text-purple-600'
                                    }`}
                            >
                                {formatTag(tagName)}
                            </button>
                        ))}
                    </div>
                )}
            </form>

            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center text-zinc-500 text-sm py-10">Loading universities...</div>
                ) : uniPageData && uniPageData.content.length > 0 ? (
                    uniPageData.content.map(uni => (
                        <UniversityControlledItem
                            key={uni.id}
                            university={uni}
                            onClick={() => onSelect(uni)}
                        />
                    ))
                ) : (
                    <div className="text-center text-zinc-400 text-sm py-10">
                        No universities found. Try a different search.
                    </div>
                )}
            </div>

            {uniPageData && uniPageData.totalPages > 1 && (
                <div className="pt-4 border-t border-zinc-200 mt-2">
                    <Pagination
                        currentPage={page}
                        totalPages={uniPageData.totalPages}
                        onPageChange={handlePageChange}
                        disabled={isLoading}
                    />
                </div>
            )}
        </div>
    )
}