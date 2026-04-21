import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, Search, Moon, Sun, Bell, Mail, Users, ArrowLeft, Activity, Cpu, ShieldCheck, Smile, HelpCircle, LogOut, ExternalLink, Languages } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';

const SettingsSidebar = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
    const [lang, setLang] = useState<'EN' | 'VI'>(() => (localStorage.getItem('lang') as 'EN' | 'VI') ?? 'EN');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);

 const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      if (refreshToken) {
        await api.post('/auth/logout', {
          refreshToken: refreshToken,
          accessToken: accessToken,
        });
      }
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

    useEffect(() => {
        const syncTheme = () => {
            const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
            setTheme(fromStorage);
            if (fromStorage === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        window.addEventListener('themeChange', syncTheme);
        syncTheme();

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('themeChange', syncTheme);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleTheme = (newTheme: 'light' | 'dark') => {
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        window.dispatchEvent(new Event('themeChange'));
    };

    const toggleLang = (newLang: 'EN' | 'VI') => {
        localStorage.setItem('lang', newLang);
        setLang(newLang);
    };

    const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken, accessToken });
      }
    } catch (err) {
      console.error('Server-side logout failed', err);
    } finally {
      // CLEAR EVERYTHING
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token'); // Clear the old key just in case
      navigate('/login');
    }
};

    const isDark = theme === 'dark';
    const sidebarBg = isDark ? 'bg-black border-white/10' : 'bg-white border-zinc-200 shadow-[0_2px_18px_rgba(0,0,0,0.05)]';
    const sidebarText = isDark ? 'text-zinc-100' : 'text-zinc-700';
    const popoverBg = isDark ? 'bg-[#121212] border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-2xl';
    const searchBg = isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-100 border-zinc-200';

    const settingsLinks = [
        { name: 'Back', icon: ArrowLeft, path: '/home', isBack: true },
        { name: 'General', icon: Settings, path: '/settings/general' },
        { name: 'Activity', icon: Activity, path: '/settings/activity' },
        { name: 'System', icon: Cpu, path: '/settings/system' },
        { name: 'Authentication', icon: ShieldCheck, path: '/settings/auth' },
    ];

    return (
        <aside className={`w-64 h-screen sticky top-0 p-6 flex flex-col border-r transition-all duration-300 z-[100] ${sidebarBg}`}>
            <div className="relative mb-8 group text-left">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-purple-500' : 'text-zinc-400 group-focus-within:text-purple-500'}`} />
                <input
                    type="text"
                    placeholder="Find settings..."
                    className={`w-full py-2.5 pl-10 pr-4 rounded-xl border text-xs font-bold outline-none transition-all focus:ring-2 focus:ring-purple-500/20 ${searchBg} ${isDark ? 'text-white' : 'text-zinc-900'}`}
                />
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                {settingsLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`group flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'text-white bg-purple-500/20 shadow-inner'
                                    : item.isBack
                                        ? 'text-purple-500 hover:bg-purple-500/10 mb-4 border border-purple-500/20'
                                        : sidebarText + ' hover:text-purple-500 hover:bg-purple-500/10'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : item.isBack ? 'text-purple-500' : 'group-hover:text-purple-400'} transition-colors`} />
                            <span className="font-bold text-sm">{item.name}</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-zinc-800/50 pt-6 space-y-4">
                <Link
                    to="/profile"
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 group ${
                        isDark ? 'bg-white/5 border-zinc-800 hover:border-emerald-500/40' : 'bg-zinc-50 border-zinc-200 hover:shadow-lg'
                    }`}
                >
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/20 group-hover:border-emerald-500 transition-colors">
                        <img
                            src={`https://ui-avatars.com/api/?name=Tester&background=6366f1&color=fff&size=128`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                        <p className={`text-xs font-black truncate tracking-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                            Tester
                        </p>
                        <p className={`text-[10px] font-medium truncate italic ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Online</p>
                    </div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </Link>

                <div className="flex items-center justify-between px-1 relative" ref={menuRef}>
                    <button className="p-2 text-zinc-500 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-all"><Users className="w-5 h-5" /></button>
                    <button className="p-2 text-zinc-500 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-all"><Mail className="w-5 h-5" /></button>
                    <button className="p-2 text-zinc-500 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-all"><Bell className="w-5 h-5" /></button>

                    <div className="static">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-lg transition-all ${isMenuOpen ? 'text-purple-500 bg-purple-500/10' : 'text-zinc-500 hover:text-purple-500 hover:bg-purple-500/10'}`}
                        >
                            <Settings className={`w-5 h-5 ${isMenuOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
                        </button>

                        {isMenuOpen && (
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 rounded-2xl border shadow-2xl z-[110] animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 ${popoverBg}`}>
                                <div className="p-2 space-y-1 text-left">
                                    <button
                                        onClick={() => navigate('/settings/general')}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-purple-500/10 rounded-xl transition-all text-purple-500"
                                    >
                                        <span className="flex items-center gap-3"><Settings className="w-4 h-4" /> ALL SETTINGS</span>
                                        <ExternalLink className="w-3 h-3 opacity-50" />
                                    </button>

                                    <div className="h-px bg-zinc-500/10 mx-2 my-1" />

                                    <div className="flex items-center justify-between px-3 py-2">
                                        <span className={`flex items-center gap-3 text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-600'}`}>
                                            {isDark ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
                                            Theme
                                        </span>
                                        <div className="flex bg-zinc-500/10 p-1 rounded-lg gap-1">
                                            <button onClick={() => toggleTheme('light')} className={`p-1 rounded-md transition-all ${!isDark ? 'bg-white shadow-sm' : ''}`}><Sun className="w-3 h-3 text-orange-500" /></button>
                                            <button onClick={() => toggleTheme('dark')} className={`p-1 rounded-md transition-all ${isDark ? 'bg-zinc-800 shadow-sm' : ''}`}><Moon className="w-3 h-3 text-purple-400" /></button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between px-3 py-2">
                                        <span className={`flex items-center gap-3 text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-600'}`}>
                                            <Languages className="w-4 h-4 text-blue-500" />
                                            Language
                                        </span>
                                        <div className="flex bg-zinc-500/10 p-1 rounded-lg gap-1">
                                            <button onClick={() => toggleLang('EN')} className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all ${lang === 'EN' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-500'}`}>EN</button>
                                            <button onClick={() => toggleLang('VI')} className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all ${lang === 'VI' ? 'bg-white text-red-600 shadow-sm' : 'text-zinc-500'}`}>VI</button>
                                        </div>
                                    </div>

                                    <button className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all ${isDark ? 'text-zinc-200 hover:bg-zinc-500/10' : 'text-zinc-600 hover:bg-zinc-500/10'}`}>
                                        <Smile className="w-4 h-4 text-yellow-500" /> Feedback
                                    </button>
                                    <button className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all ${isDark ? 'text-zinc-200 hover:bg-zinc-500/10' : 'text-zinc-600 hover:bg-zinc-500/10'}`}>
                                        <HelpCircle className="w-4 h-4 text-blue-500" /> Help Center
                                    </button>
                                </div>

                                <div className="p-2 border-t border-zinc-500/10 bg-zinc-500/5 rounded-b-2xl">
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-black text-red-500 hover:bg-red-500/20 rounded-xl transition-all"><LogOut className="w-4 h-4" /> Log Out</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SettingsSidebar;
