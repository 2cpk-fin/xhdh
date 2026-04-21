import { useEffect, useState, useMemo } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Shared Components ---
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Sub-components ---
import FilterSection from '../components/searching/FilterSection';
import UniversityItem from '../components/searching/UniversityItem';

// --- API & Types ---
import { universityAPI, tagAPI } from '../api/SearchingApi';
import type { UniversityResponse } from '../types/Searching';
import type { Page } from '../types/ScheduleMatch';

const SearchPage = () => {
    // --- Theme State ---
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

    // --- Search & Filter State ---
    const [query, setQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    // --- Data & Pagination State ---
    const [pageData, setPageData] = useState<Page<UniversityResponse> | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    // --- Effects ---
    useEffect(() => {
        const syncTheme = () => setTheme((localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
        window.addEventListener('themeChange', syncTheme);
        return () => window.removeEventListener('themeChange', syncTheme);
    }, []);

    // 1. Fetch Tags on Mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagResponses = await tagAPI.showAllTags();
                setTags(tagResponses.map(t => t.name));
            } catch (err) {
                console.error("Failed to fetch tags", err);
            }
        };
        void fetchTags();
    }, []);

    // 2. Fetch Paginated Universities
    useEffect(() => {
        const fetchUniversities = async () => {
            setLoading(true);
            try {
                const data = await universityAPI.getUniversityList(currentPage, 15, 'elo,desc');
                setPageData(data);
            } catch (error) {
                console.error("Failed to fetch universities", error);
            } finally {
                setLoading(false);
            }
        };
        void fetchUniversities();
    }, [currentPage]);

    // 3. Client-Side Search & Filter (Applies to the currently loaded page)
    const displayResults = useMemo(() => {
        if (!pageData) return [];

        return pageData.content.filter(uni => {
            // Search Match (Name or Abbreviation)
            const matchesSearch =
                uni.name.toLowerCase().includes(query.toLowerCase()) ||
                uni.abbreviation.toLowerCase().includes(query.toLowerCase());

            // Tag Match
            const matchesFilter = activeTag === null || uni.tags.includes(activeTag);

            return matchesSearch && matchesFilter;
        });
    }, [query, activeTag, pageData]);

    // --- Handlers ---
    const handleNextPage = () => {
        if (pageData && !pageData.last) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (pageData && !pageData.first) setCurrentPage(prev => prev - 1);
    };

    // --- Styling Variables ---
    const isDark = theme === 'dark';
    const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
    const inputBg = isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200 shadow-md';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen text-left">
                <Header />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-10">

                        {/* SEARCH & FILTER SECTION */}
                        <div className="space-y-6">

                            {/* Search Bar */}
                            <div className="relative group w-full">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                    {loading ?
                                        <Loader2 className="w-5 h-5 animate-spin text-purple-500" /> :
                                        <Search className={`w-5 h-5 ${isDark ? 'text-zinc-600' : 'text-zinc-400'} group-focus-within:text-purple-500 transition-all`} />
                                    }
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by university name or abbreviation..."
                                    className={`w-full py-4 pl-14 pr-6 rounded-2xl border-2 outline-none text-base font-bold transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 ${inputBg} ${textColor}`}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                            {/* Dynamic Tag Filters */}
                            <FilterSection
                                tags={tags}
                                activeTag={activeTag}
                                onSelectTag={setActiveTag}
                                isDark={isDark}
                            />
                        </div>

                        {/* DISCOVERY FEED */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2 border-b border-zinc-500/10 pb-4">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    Discovery Feed
                                </h3>
                                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">
                                    {displayResults.length} Universities Found
                                </span>
                            </div>

                            {/* List of Universities */}
                            <div className="grid gap-4">
                                {displayResults.map((uni) => (
                                    <UniversityItem
                                        key={uni.id}
                                        university={uni}
                                        isDark={isDark}
                                        // FIX: Added explicit string typing to 'id' to fix TS7006
                                        onViewProfile={(id: string) => console.log("Navigate to profile:", id)}
                                    />
                                ))}

                                {displayResults.length === 0 && !loading && (
                                    <div className="py-24 text-center space-y-4">
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${isDark ? 'bg-zinc-900 text-zinc-800' : 'bg-zinc-100 text-zinc-200'}`}>
                                            <Search className="w-10 h-10" />
                                        </div>
                                        <p className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                                            No data found
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {pageData && pageData.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-8 pt-4 px-2">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                        Page {pageData.number + 1} of {pageData.totalPages}
                                    </span>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={pageData.first || loading}
                                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'bg-white border-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Prev
                                        </button>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={pageData.last || loading}
                                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'bg-white border-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                                        >
                                            Next <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default SearchPage;