import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import UniversityControlledItem from './UniversityControlledItem'
import { universityApi } from '../../api/universityApi'
import { tagApi } from '../../api/tagApi'
import type { UniversityResponse } from '../../types/university'
import type { TagResponse } from '../../types/tag'
import type { Page } from '../../types/general'

type Props = {
    onSelect: (university: UniversityResponse) => void
}

export default function UniversitySearchingBox({ onSelect }: Props) {
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [uniPageData, setUniPageData] = useState<Page<UniversityResponse> | null>(null)
    const [page, setPage] = useState(0)
    const [tags, setTags] = useState<TagResponse[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

    useEffect(() => {
        tagApi.getAllTags().then(setTags).catch(console.error)
    }, [])

    const fetchUniversities = useCallback(async (targetPage: number, currentQuery: string, currentTags: number[]) => {
        setIsLoading(true)
        try {
            const res = await universityApi.getUniversities(targetPage, 15, 'elo,desc', currentQuery, currentTags)
            setUniPageData(res)
        } catch (error) {
            console.error('Search failed', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUniversities(0, '', [])
    }, [fetchUniversities])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(0)
        fetchUniversities(0, query, selectedTagIds)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        fetchUniversities(newPage, query, selectedTagIds)
    }

    const toggleTag = (id: number) => {
        setSelectedTagIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    return (
        <div className="space-y-4">
            {/* Search Form */}
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

                {tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {tags.map(tag => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => toggleTag(tag.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${selectedTagIds.includes(tag.id)
                                    ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200'
                                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-purple-300 hover:text-purple-600'
                                    }`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                )}
            </form>

            {/* Results */}
            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center text-zinc-500 text-sm py-10">Loading universities...</div>
                ) : uniPageData && uniPageData.content.length > 0 ? (
                    uniPageData.content.map(uni => (
                        <UniversityControlledItem key={uni.id} university={uni} onClick={() => onSelect(uni)} />
                    ))
                ) : (
                    <div className="text-center text-zinc-400 text-sm py-10">
                        No universities found. Try a different search.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {uniPageData && uniPageData.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-200 gap-4">
                    <span className="text-sm font-medium text-zinc-500">
                        Page <span className="font-bold text-zinc-900">{uniPageData.number + 1}</span> of{' '}
                        <span className="font-bold text-zinc-900">{uniPageData.totalPages}</span>
                    </span>
                    <div className="flex gap-2 items-center">
                        <button
                            disabled={uniPageData.first}
                            onClick={() => handlePageChange(page - 1)}
                            className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} className="text-zinc-600" />
                        </button>
                        <div className="hidden sm:flex gap-1.5">
                            {Array.from({ length: uniPageData.totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i
                                        ? 'bg-purple-600 text-white shadow-sm'
                                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-purple-300'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={uniPageData.last}
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