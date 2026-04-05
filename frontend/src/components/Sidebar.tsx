import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Newspaper, Users, UserCircle, Settings, Trophy, Search, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
    const location = useLocation();

    useEffect(() => {
        const onThemeChange = () => {
            const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
            setTheme(fromStorage);
        };
        window.addEventListener('themeChange', onThemeChange);
        return () => window.removeEventListener('themeChange', onThemeChange);
    }, []);

    const isDark = theme === 'dark';
    const sidebarBg = isDark ? 'bg-black border-white/10' : 'bg-white border-zinc-200 shadow-[0_2px_18px_rgba(0,0,0,0.05)]';
    const sidebarText = isDark ? 'text-zinc-400' : 'text-zinc-700';

    const links = [
        { name: 'Home', icon: Home, path: '/home' },
        { name: 'Leaderboard', icon: BarChart3, path: '/leaderboard' },
        { name: 'Search', icon: Search, path: '/search' },
        { name: 'Play', icon: Gamepad2, path: '/play' },
        { name: 'News', icon: Newspaper, path: '/news' },
        { name: 'Community', icon: Users, path: '/community' },
    ];

    return (
        <aside className={`w-64 h-screen sticky top-0 p-6 flex flex-col border-r transition-all duration-300 z-[100] ${sidebarBg}`}>
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-3 px-3 py-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-8 group">
                <Trophy className="text-[var(--trophy-yellow)] w-6 h-6 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] leading-tight">
                    University <br /> Ranking
                </span>
            </Link>

            {/* Main Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                {links.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`group flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'text-white bg-purple-500/20 shadow-inner'
                                    : sidebarText + ' hover:text-purple-500 hover:bg-purple-500/10'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400'} transition-colors`} />
                            <span className="font-bold text-sm">{item.name}</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Nav with Greenish Hover */}
            <div className="space-y-1 border-t border-zinc-800/50 pt-6 mt-6">
                <Link
                    to="/profile"
                    className={`group flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-300 ${sidebarText} hover:text-emerald-500 hover:bg-emerald-500/10`}
                >
                    <UserCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">User</span>
                </Link>
                <Link
                    to="/settings"
                    className={`group flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-300 ${sidebarText} hover:text-emerald-500 hover:bg-emerald-500/10`}
                >
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                    <span className="font-bold text-sm">Setting</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;