import { useEffect, useState, useMemo } from 'react';
import { Search, School, MapPin, ChevronRight, Loader2, Filter, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface University {
    id: string;
    name: string;
    abbreviation: string;
    elo: number;
    location: string;
    type: 'Public' | 'Private';
    category: 'Technical' | 'Economic' | 'General';
}

const SearchPage = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Results');
    const [results, setResults] = useState<University[]>([]);
    const [loading, setLoading] = useState(false);

    const mockData: University[] = [
        { id: '1', name: 'Hanoi University of Science and Technology', abbreviation: 'HUST', elo: 2450, location: 'Hanoi', type: 'Public', category: 'Technical' },
        { id: '2', name: 'FPT University', abbreviation: 'FPTU', elo: 2380, location: 'Hanoi/HCM', type: 'Private', category: 'Technical' },
        { id: '3', name: 'National Economics University', abbreviation: 'NEU', elo: 2310, location: 'Hanoi', type: 'Public', category: 'Economic' },
        { id: '4', name: 'Foreign Trade University', abbreviation: 'FTU', elo: 2290, location: 'Hanoi', type: 'Public', category: 'Economic' },
        { id: '5', name: 'Ho Chi Minh City University of Technology', abbreviation: 'HCMUT', elo: 2410, location: 'HCM', type: 'Public', category: 'Technical' },
    ];

    useEffect(() => {
        const syncTheme = () => setTheme((localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
        window.addEventListener('themeChange', syncTheme);
        return () => window.removeEventListener('themeChange', syncTheme);
    }, []);

    const displayResults = useMemo(() => {
        const source = results.length > 0 ? results : mockData;
        return source.filter(uni => {
            const matchesSearch = uni.name.toLowerCase().includes(query.toLowerCase()) ||
                uni.abbreviation.toLowerCase().includes(query.toLowerCase());
            const matchesFilter = activeFilter === 'All Results' ||
                uni.type === activeFilter ||
                uni.category === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [query, activeFilter, results]);

    useEffect(() => {
        const searchTimer = setTimeout(async () => {
            if (query.trim().length > 1) {
                setLoading(true);
                try {
                    const response = await api.get('/universities/search', { params: { name: query } });
                    setResults(response.data);
                } catch (error) {
                    console.error("Search API failed:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);
        return () => clearTimeout(searchTimer);
    }, [query]);

    const isDark = theme === 'dark';
    const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
    const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
    const inputBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-md';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';

    return (
        <div className={`min-h-screen flex bg-[var(--bg)] text-[var(--text)] font-sans antialiased`}>
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <Header />
                <main className={`flex-1 p-8 lg:p-12 overflow-y-auto ${bgMain}`}>
                    <div className="max-w-6xl mx-auto space-y-12">

                        <div className="space-y-6">
                            {/* Larger, cleaner Search Input */}
                            <div className="relative group w-full">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                    {loading ?
                                        <Loader2 className="w-6 h-6 animate-spin text-purple-500" /> :
                                        <Search className="w-6 h-6 opacity-30 group-focus-within:text-purple-500 group-focus-within:opacity-100 transition-all" />
                                    }
                                </div>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search by university name or abbreviation..."
                                    className={`w-full py-5 pl-16 pr-6 rounded-2xl border-2 outline-none text-lg font-semibold tracking-tight transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 ${inputBg} ${textColor}`}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                            {/* Prominent Filter Buttons */}
                            <div className="flex flex-wrap gap-3 px-1">
                                {['All Results', 'Public', 'Private', 'Technical', 'Economic'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all active:scale-95 ${
                                            activeFilter === f
                                                ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/30'
                                                : 'bg-transparent border-transparent opacity-50 hover:opacity-100 hover:bg-zinc-500/10'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                                <button className="ml-auto p-2 opacity-30 hover:opacity-100 transition-opacity">
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Results List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4 border-b border-zinc-500/10 pb-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Discovery Feed</h3>
                                <span className="text-xs font-black text-purple-500 uppercase tracking-widest">{displayResults.length} Universities Found</span>
                            </div>

                            <div className="grid gap-5">
                                {displayResults.map((uni) => (
                                    <div key={uni.id} className={`${cardBg} p-8 rounded-[2rem] border-2 transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 flex items-center justify-between group`}>
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center border-2 border-purple-500/5 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                                                <School className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4">
                                                    <h4 className={`text-2xl font-black tracking-tight ${textColor}`}>{uni.name}</h4>
                                                    <span className="px-3 py-1 bg-zinc-500/10 rounded-lg text-xs font-black uppercase tracking-widest opacity-50">{uni.abbreviation}</span>
                                                </div>
                                                <div className="flex items-center gap-6 text-sm font-bold opacity-50 uppercase tracking-wide">
                                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-500" /> {uni.location}</span>
                                                    <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> ELO Rating: {uni.elo}</span>
                                                    <span className="px-2 py-0.5 border border-zinc-500/20 rounded text-[10px]">{uni.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-500/5 group-hover:bg-purple-600 group-hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-sm">
                                            View Profile <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}

                                {displayResults.length === 0 && !loading && (
                                    <div className="py-32 text-center space-y-4">
                                        <div className="w-24 h-24 bg-zinc-500/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                                            <Search className="w-12 h-12" />
                                        </div>
                                        <p className="text-lg font-black uppercase tracking-widest opacity-30">No matches found for your search</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default SearchPage;