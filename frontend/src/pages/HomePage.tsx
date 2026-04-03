import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trophy, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar';

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
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <div className={`max-w-5xl mx-auto p-10 rounded-3xl shadow-2xl border transition-all duration-300 ${cardBg}`}>
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className={`text-5xl font-black mb-3 tracking-tight ${textColor}`}>Home Base</h1>
              <p className="text-purple-500 font-medium text-lg">Choose your mode to begin competing.</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-zinc-800 text-white hover:bg-red-500 transition-all duration-200 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </header>

          <div className="grid gap-8 sm:grid-cols-2">
            <Link
              to="/duel"
              className={`group relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-purple-500/50' : 'bg-white border-zinc-200 hover:border-purple-500'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className={`text-2xl font-bold ${textColor}`}>Solo Mode</h2>
                <Trophy className="text-[var(--trophy-yellow)] opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
              </div>
              <p className={`mb-6 leading-relaxed ${subTextColor}`}>Practice and duel AI or recorded opponents one-on-one to sharpen your skills.</p>
              <span className="font-bold text-purple-500 flex items-center gap-2 group-hover:gap-4 transition-all">Enter Solo Mode <span>→</span></span>
            </Link>

            <Link
              to="/event"
              className={`group relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-green-500/50' : 'bg-white border-zinc-200 hover:border-green-500'}`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Event Mode</h2>
              <p className={`mb-6 leading-relaxed ${subTextColor}`}>Join the next live event and compete with other players for exclusive rewards.</p>
              <span className="font-bold text-green-500 flex items-center gap-2 group-hover:gap-4 transition-all">Go to Event Mode <span>→</span></span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;