import { useEffect, useState, useMemo } from 'react';
import { Trophy, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, FilterX } from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Tag {
    id: number;
    name: string;
}

interface University {
    name: string;
    abbreviation: string;
    elo: number;
    tagNames: string[]; 
}

const LeaderboardPage = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch for tags and university metadata
                const [tagsRes, unisRes] = await Promise.all([
                    api.get('/tags/all'),
                    api.get('/universities/all') // Hits UniversityLeaderboardController
                ]);
                setTags(tagsRes.data);
                setUniversities(unisRes.data);
                // setLastUpdated(new Date());
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // client-side filtering and sorting
    const filteredUniversities = useMemo(() => {
        let result = [...universities];

        // OR logic: Show university if it has ANY of the selected tags
        if (selectedTags.length > 0) {
            result = result.filter(uni =>
                selectedTags.some(selected => uni.tagNames.includes(selected))
            );
        }

        // Sort by Elo descending
        return result.sort((a, b) => b.elo - a.elo);
    }, [universities, selectedTags]);

    const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
    
    const paginatedUniversities = useMemo(() => {
        return filteredUniversities.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredUniversities, currentPage]);

    const handleTagChange = (tagName: string) => {
        setSelectedTags(prev =>
            prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName]
        );
        setCurrentPage(1); 
    };

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[var(--text)] mb-4 flex items-center gap-3">
                                <Trophy className="text-[var(--trophy-yellow)] w-8 h-8" />
                                University Leaderboard
                            </h1>
                            <p className="text-[var(--text-secondary)]">
                                Updated every 3 minutes!
                            </p>
                        </div>

                        {/* Tag Filters */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-semibold text-[var(--text)]">Filter by Categories</h2>
                                {selectedTags.length > 0 && (
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-500 transition-colors"
                                    >
                                        <FilterX className="w-4 h-4" />
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        onClick={() => handleTagChange(tag.name)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            selectedTags.includes(tag.name)
                                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                                                : 'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--bg)] border border-[var(--border)]'
                                        }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        {filteredUniversities.length === 0 ? (
                            <div className="text-center py-20 bg-[var(--card-bg)] rounded-xl border border-dashed border-[var(--border)]">
                                <p className="text-xl text-[var(--text-secondary)]">No universities found for these tags.</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Rank</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">University</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Abbr.</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Elo Rating</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Tags</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--border)]">
                                                {paginatedUniversities.map((uni, index) => (
                                                    <tr key={uni.abbreviation} className="hover:bg-purple-500/5 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-bold text-[var(--text)]">
                                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-[var(--text)]">
                                                            {uni.name}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                                            {uni.abbreviation}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-bold text-[var(--trophy-yellow)]">
                                                            {uni.elo}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {uni.tagNames.map(t => (
                                                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]">
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 disabled:opacity-30"><ChevronsLeft /></button>
                                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 disabled:opacity-30"><ChevronLeft /></button>
                                        <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-30"><ChevronRight /></button>
                                        <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-30"><ChevronsRight /></button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default LeaderboardPage;