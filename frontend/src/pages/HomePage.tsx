import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, Gamepad2, Newspaper, Users, UserCircle, Settings, Trophy, LogOut } from 'lucide-react';
import api from '../api/axios';

const HomePage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
  const navigate = useNavigate();

  useEffect(() => {
    const syncTheme = () => {
      const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(fromStorage);
    };
    window.addEventListener('themeChange', syncTheme);
    return () => window.removeEventListener('themeChange', syncTheme);
  }, []);

  const isDark = theme === 'dark';

  // Theme-based variables
  const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
  const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200';
  const sidebarBg = isDark ? 'bg-black border-white/10' : 'bg-[#1a1a1a] border-white/5';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

    const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken'); // Grab this too!

    if (refreshToken) {
      // Ensure the keys match your LogoutRequest DTO in Java
      await api.post('/auth/logout', { 
        refreshToken: refreshToken,
        accessToken: accessToken 
      });
    }
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  }
};

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`w-64 min-h-screen p-6 flex flex-col justify-between border-r transition-all duration-300 ${sidebarBg}`}>
        <div className="space-y-8">
          {/* Brand Logo Section */}
          <div className="flex items-center gap-3 px-3 py-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
            <Trophy className="text-[var(--trophy-yellow)] w-6 h-6 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] leading-tight">
              University <br /> Ranking
            </span>
          </div>
          
          {/* Main Navigation Links */}
          <nav className="space-y-1">
            {[
              { name: 'Home', icon: Home, path: '/home' },
              { name: 'Play', icon: Gamepad2, path: '/duel' },
              { name: 'News', icon: Newspaper, path: '/news' },
              { name: 'Community', icon: Users, path: '/community' },
            ].map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="group flex items-center gap-4 py-3 px-4 rounded-xl text-zinc-400 hover:text-white hover:bg-purple-500/10 transition-all duration-200"
              >
                <item.icon className="w-5 h-5 group-hover:text-[var(--highlight)] transition-colors" />
                <span className="font-medium">{item.name}</span>
                
                {/* Active Indicator Dot */}
                {window.location.pathname === item.path && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--highlight)] shadow-[0_0_8px_var(--highlight)]" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer (User & Settings) */}
        <div className="space-y-1 border-t border-zinc-800/50 pt-6">
          <Link to="/profile" className="group flex items-center gap-4 py-3 px-4 rounded-xl text-zinc-400 hover:text-[var(--accent-green)] hover:bg-green-500/5 transition-all">
            <UserCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">User</span>
          </Link>
          <Link to="/settings" className="group flex items-center gap-4 py-3 px-4 rounded-xl text-zinc-400 hover:text-[var(--accent-green)] hover:bg-green-500/5 transition-all">
            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            <span className="font-medium">Setting</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className={`max-w-5xl mx-auto p-10 rounded-3xl shadow-2xl border transition-all duration-300 ${cardBg}`}>
          
          {/* Content Header */}
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className={`text-5xl font-black mb-3 tracking-tight ${textColor}`}>Home Base</h1>
              <p className="text-purple-500 font-medium text-lg">Choose your mode to participate.</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-zinc-800 text-white hover:bg-red-500 transition-all duration-200 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </header>

          {/* Game Mode Selection Grid */}
          <div className="grid gap-8 sm:grid-cols-2">
            
            {/* Solo Mode Card */}
            <Link
              to="/duel"
              className={`group relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-purple-500/50' : 'bg-white border-zinc-200 hover:border-purple-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className={`text-2xl font-bold ${textColor}`}>Solo Mode</h2>
                <Trophy className="text-[var(--trophy-yellow)] opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
              </div>
              <p className={`mb-6 leading-relaxed ${subTextColor}`}>
                Decide your OWN winner in head-to-head university duels.
              </p>
              <span className="font-bold text-purple-500 flex items-center gap-2 group-hover:gap-4 transition-all">
                Enter Solo Mode <span>→</span>
              </span>
            </Link>

            {/* Event Mode Card */}
            <Link
              to="/event"
              className={`group relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-green-500/50' : 'bg-white border-zinc-200 hover:border-green-500'
              }`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Event Mode</h2>
              <p className={`mb-6 leading-relaxed ${subTextColor}`}>
                Join community vote events to give your favourite university for much higher elo increase.
              </p>
              <span className="font-bold text-green-500 flex items-center gap-2 group-hover:gap-4 transition-all">
                Go to Event Mode <span>→</span>
              </span>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;