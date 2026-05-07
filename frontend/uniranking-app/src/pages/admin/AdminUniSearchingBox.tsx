import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminUniItem from './AdminUniBox';
import { universityApi } from '../../api/universityApi';
import { tagApi } from '../../api/tagApi';
import type { UniversityResponse } from '../../types/university';
import type { TagResponse } from '../../types/tag';
import type { Page } from '../../types/general';

export default function AdminUniSearchingBox() {
    // --- State ---
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Pagination & Results State
    const [uniPageData, setUniPageData] = useState<Page<UniversityResponse> | null>(null);
    const [page, setPage] = useState(0);

    // Tag State
    const [tags, setTags] = useState<TagResponse[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    // Fetch tags on mount
    useEffect(() => {
        tagApi.getAllTags().then(setTags).catch(console.error);
    }, []);

    // Core Fetch Function
    const fetchUniversities = useCallback(async (targetPage: number, currentQuery: string, currentTags: number[]) => {
        setIsLoading(true);
        try {
            // Using size 10 to keep the modal UI clean
            const res = await universityApi.getUniversities(targetPage, 10, 'elo,desc', currentQuery, currentTags);
            setUniPageData(res);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load so it's not empty when opening the modal
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUniversities(0, '', []);
    }, [fetchUniversities]);

    // Handlers
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0); // Reset to first page on new search
        fetchUniversities(0, query, selectedTagIds);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchUniversities(newPage, query, selectedTagIds);
    };

    const toggleTag = (id: number) => {
        const newTags = selectedTagIds.includes(id)
            ? selectedTagIds.filter(i => i !== id)
            : [...selectedTagIds, id];

        setSelectedTagIds(newTags);
        // Optional: You could trigger a search immediately when a tag is clicked
        // setPage(0);
        // fetchUniversities(0, query, newTags);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl p-6 border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-800 mb-4 shrink-0">Find University IDs</h3>

            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 mb-4 shrink-0">
                {/* Search Input Box */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search universities..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <button type="submit" className="px-4 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all active:scale-95 shadow-sm">
                        Search
                    </button>
                </div>

                {/* Tag Selection Filters */}
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

            {/* Results List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pt-2 border-t border-zinc-100">
                {isLoading ? (
                    <div className="text-center text-zinc-500 text-sm mt-8">Loading universities...</div>
                ) : uniPageData && uniPageData.content.length > 0 ? (
                    uniPageData.content.map(uni => <AdminUniItem key={uni.id} uni={uni} />)
                ) : (
                    <div className="text-center text-zinc-400 text-sm mt-8">
                        No universities found. Try a different search.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {uniPageData && uniPageData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-100 shrink-0">
                    <button
                        type="button"
                        disabled={uniPageData.first}
                        onClick={() => handlePageChange(page - 1)}
                        className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={18} className="text-zinc-600" />
                    </button>

                    <span className="text-xs font-bold text-zinc-500">
                        Page {uniPageData.number + 1} of {uniPageData.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={uniPageData.last}
                        onClick={() => handlePageChange(page + 1)}
                        className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={18} className="text-zinc-600" />
                    </button>
                </div>
            )}
        </div>
    );
}