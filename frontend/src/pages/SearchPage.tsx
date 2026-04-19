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
                    console.error(error);
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
    const cardBg = isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
    const inputBg = isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200 shadow-md';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen text-left">
                <Header />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-10">
                        <div className="space-y-6">
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

                            <div className="flex flex-wrap gap-2.5 px-1">
                                {['All Results', 'Public', 'Private', 'Technical', 'Economic'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all active:scale-95 ${activeFilter === f
                                                ? 'bg-purple-600 border-purple-600 text-white shadow-lg'
                                                : isDark
                                                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                                                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                                <button className={`ml-auto p-2 rounded-lg transition-colors ${isDark ? 'text-zinc-600 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2 border-b border-zinc-500/10 pb-4">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Discovery Feed</h3>
                                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{displayResults.length} Universities Found</span>
                            </div>

                            <div className="grid gap-4">
                                {displayResults.map((uni) => (
                                    <div key={uni.id} className={`${cardBg} p-6 rounded-[2rem] border-2 transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl flex flex-col md:flex-row md:items-center justify-between group gap-6`}>
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-500 ${isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white' : 'bg-purple-50 border-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'}`}>
                                                <School className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className={`text-xl font-black tracking-tight ${textColor}`}>{uni.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>{uni.abbreviation}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-bold uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5 text-zinc-500"><MapPin className="w-3.5 h-3.5 text-purple-500" /> {uni.location}</span>
                                                    <span className="flex items-center gap-1.5 text-zinc-500"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> ELO: {uni.elo}</span>
                                                    <span className={`px-1.5 py-0.5 border rounded text-[9px] ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-zinc-200 text-zinc-400'}`}>{uni.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${isDark ? 'bg-zinc-800 text-white hover:bg-purple-600' : 'bg-zinc-900 text-white hover:bg-purple-600'}`}>
                                            View Profile <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {displayResults.length === 0 && !loading && (
                                    <div className="py-24 text-center space-y-4">
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${isDark ? 'bg-zinc-900 text-zinc-800' : 'bg-zinc-100 text-zinc-200'}`}>
                                            <Search className="w-10 h-10" />
                                        </div>
                                        <p className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>No matches found</p>
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