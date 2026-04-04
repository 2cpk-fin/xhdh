import { useEffect, useState, useRef, useMemo } from 'react';
import { History, Globe, ShieldCheck, Calendar, ChevronDown, UserPlus, Vote, Trophy, ShieldAlert, Camera } from 'lucide-react';
import SettingsSidebar from '../components/SettingsSidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ActivityPage = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
    const [filter, setFilter] = useState('All Time');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const syncTheme = () => {
            const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
            setTheme(fromStorage);
            if (fromStorage === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        };
        window.addEventListener('themeChange', syncTheme);

        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) setIsFilterOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);

        syncTheme();
        setCurrentTime(Date.now());

        return () => {
            window.removeEventListener('themeChange', syncTheme);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isDark = theme === 'dark';
    const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
    const cardBg = isDark ? 'bg-[#000000] border-zinc-800' : 'bg-white border-zinc-200';
    const footerBg = isDark ? 'bg-[#0d0d0d] border-zinc-800' : 'bg-[#fcfcfc] border-zinc-200';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

    const rawActivities = useMemo(() => {
        const baseTime = Date.now();
        return [
            { id: 1, type: 'vote', icon: <Vote className="w-4 h-4 text-purple-500" />, content: "Tester cast a vote for Match #204", detail: "Supporting Team Alpha in the Quarter Finals", timestamp: baseTime - 2 * 60 * 60 * 1000 },
            { id: 2, type: 'event', icon: <Trophy className="w-4 h-4 text-purple-500" />, content: "Tester entered the Spring Match Tournament", detail: "Tournament ID: SM-2026-XP", timestamp: baseTime - 24 * 60 * 60 * 1000 },
            { id: 3, type: 'security', icon: <ShieldAlert className="w-4 h-4 text-purple-500" />, content: "Updated event notifications settings", detail: "Push notifications enabled for match results", timestamp: baseTime - 3 * 24 * 60 * 60 * 1000 },
            { id: 4, type: 'join', icon: <UserPlus className="w-4 h-4 text-purple-500" />, content: "Tester officially joined the platform", detail: "Account established and verified", timestamp: baseTime - 15 * 24 * 60 * 60 * 1000 },
        ];
    }, []);

    const filterOptions = [
        { name: 'All Time', days: 9999 },
        { name: 'Last Day', days: 1 },
        { name: 'Last 7 Days', days: 7 },
        { name: 'Last 30 Days', days: 30 },
    ];

    const filteredActivities = useMemo(() => {
        if (!currentTime) return [];
        return rawActivities.filter(item => {
            const selectedOption = filterOptions.find(opt => opt.name === filter);
            const diffDays = (currentTime - item.timestamp) / (1000 * 60 * 60 * 24);
            return diffDays <= (selectedOption?.days || 9999);
        });
    }, [filter, rawActivities, currentTime]);

    const formatTime = (timestamp: number) => {
        if (!currentTime) return "";
        const diff = currentTime - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
            <SettingsSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-[1200px] mx-auto space-y-6 text-left">
                        <header className="pb-4 border-b border-zinc-500/10 flex justify-between items-center">
                            <div className="space-y-1">
                                <h1 className={`text-4xl font-bold tracking-tight ${textColor}`}>Activity Feed</h1>
                                <p className={`text-base ${subTextColor}`}>Monitor recent actions and tournament events for Tester.</p>
                            </div>

                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all hover:border-purple-500 shadow-sm ${cardBg} ${textColor}`}
                                >
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    <span>{filter}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isFilterOpen && (
                                    <div className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-2xl z-50 overflow-hidden ${cardBg} animate-in fade-in zoom-in slide-in-from-top-2`}>
                                        {filterOptions.map((opt) => (
                                            <button
                                                key={opt.name}
                                                onClick={() => { setFilter(opt.name); setIsFilterOpen(false); }}
                                                className={`w-full text-left px-5 py-4 text-sm font-bold hover:bg-purple-500/10 transition-colors ${filter === opt.name ? 'text-purple-500 bg-purple-500/5' : textColor}`}
                                            >
                                                {opt.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </header>

                        <section className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                                        <History className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <h2 className={`text-xl font-bold ${textColor}`}>Recent Action Logs</h2>
                                </div>

                                <div className="space-y-1">
                                    {filteredActivities.length > 0 ? filteredActivities.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-500/5 transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="relative group/avatar">
                                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-500/20 group-hover:border-purple-500 transition-all shadow-xl bg-zinc-100 dark:bg-zinc-900">
                                                        <img
                                                            src={`https://ui-avatars.com/api/?name=Tester&background=6366f1&color=fff&size=128`}
                                                            className="w-full h-full object-cover"
                                                            alt="Tester"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                                            <Camera className="text-white w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="p-1 bg-purple-500/5 rounded-md">{item.icon}</span>
                                                        <p className={`text-base font-bold tracking-tight ${textColor}`}>{item.content}</p>
                                                    </div>
                                                    <p className={`text-sm ${subTextColor} font-medium ml-8`}>{item.detail}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-widest ${subTextColor} opacity-60`}>{formatTime(item.timestamp)}</span>
                                        </div>
                                    )) : (
                                        <div className={`text-center py-10 ${subTextColor} text-sm italic font-medium`}>
                                            No activity matches the selected time range.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`px-8 py-4 border-t flex justify-between items-center ${footerBg}`}>
                                <p className={`text-sm font-medium ${subTextColor} flex items-center gap-2`}>
                                    <Globe className="w-4 h-4 text-purple-500" /> Tracking global events.
                                </p>
                                <button className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                                    Expand History
                                </button>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                            <div className={`border rounded-2xl p-8 ${cardBg} shadow-sm space-y-4`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                                        <ShieldCheck className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <h3 className={`text-xl font-bold ${textColor}`}>Integrity Audit</h3>
                                </div>
                                <p className={`text-base font-medium leading-relaxed ${subTextColor}`}>
                                    All votes and entries are cryptographically signed to ensure tournament fairness and transparency.
                                </p>
                            </div>
                            <div className={`border rounded-2xl p-8 ${cardBg} shadow-sm space-y-4`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                                        <Globe className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <h3 className={`text-xl font-bold ${textColor}`}>Local Sync</h3>
                                </div>
                                <p className={`text-base font-medium leading-relaxed ${subTextColor}`}>
                                    Activity timestamps are automatically converted to your current timezone for accurate monitoring.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default ActivityPage;