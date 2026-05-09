import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import AdminUniItem from './ParticipantBox';
import Pagination from '../../../components/Pagination';
import { universityApi } from '../../../api/universityApi';
import type { UniversityResponse } from '../../../types/university';
import type { Page } from '../../../types/general';

const formatTag = (tag: string) => {
    return tag
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default function SearchingUniHelper() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uniPageData, setUniPageData] = useState<Page<UniversityResponse> | null>(null);
    const [page, setPage] = useState(0);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;
        universityApi.getAllTags()
            .then(tags => {
                if (isMounted) setAvailableTags(tags);
            })
            .catch(console.error);

        return () => { isMounted = false; };
    }, []);

    const fetchUniversities = useCallback(async (targetPage: number, currentQuery: string, currentTags: string[]) => {
        setIsLoading(true);
        try {
            const res = await universityApi.getUniversities(
                targetPage,
                10,
                'elo,desc',
                currentQuery || undefined,
                currentTags.length ? currentTags : undefined
            );
            setUniPageData(res);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUniversities(0, '', []);
    }, [fetchUniversities]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchUniversities(0, query, selectedTags);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchUniversities(newPage, query, selectedTags);
    };

    const toggleTag = (tag: string) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        setSelectedTags(newTags);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl p-6 border border-zinc-200 transition-all">
            <h3 className="text-lg font-bold text-zinc-800 mb-4 shrink-0">Find University IDs</h3>

            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 mb-4 shrink-0">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search universities..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:ring-2 focus:ring-green-400 outline-none text-zinc-800 transition-all"
                        />
                    </div>
                    <button type="submit" className="px-4 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all hover:scale-105 active:scale-95 shadow-sm">
                        Search
                    </button>
                </div>

                {availableTags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${selectedTags.includes(tag)
                                    ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200'
                                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-green-300 hover:text-green-600'
                                    }`}
                            >
                                {formatTag(tag)}
                            </button>
                        ))}
                    </div>
                )}
            </form>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pt-2 border-t border-zinc-100">
                {isLoading ? (
                    <div className="flex flex-col gap-2 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-[68px] rounded-xl bg-zinc-100 animate-pulse border border-zinc-200" />
                        ))}
                    </div>
                ) : uniPageData && uniPageData.content.length > 0 ? (
                    uniPageData.content.map(uni => <AdminUniItem key={uni.id} uni={uni} />)
                ) : (
                    <div className="text-center text-zinc-400 text-sm mt-8 font-medium">
                        No universities found. Try a different search.
                    </div>
                )}
            </div>

            {uniPageData && uniPageData.totalPages > 1 && (
                <div className="pt-4 mt-2 border-t border-zinc-100 shrink-0">
                    <Pagination
                        currentPage={page}
                        totalPages={uniPageData.totalPages}
                        onPageChange={handlePageChange}
                        disabled={isLoading}
                    />
                </div>
            )}
        </div>
    );
}