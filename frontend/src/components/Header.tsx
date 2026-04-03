import { useNavigate, Link } from 'react-router-dom';
import { Trophy, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Header = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
  const navigate = useNavigate();

  useEffect(() => {
    const onThemeChange = () => {
      const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(fromStorage);
    };
    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  const isDark = theme === 'dark';

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

  return (
    <header className={`border-b backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 ${isDark ? 'bg-black/80 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
      <div className="max-w-full mx-auto px-10 py-4 flex items-center justify-between">
        
        <Link to="/home" className="flex items-center gap-3 group cursor-pointer">
          <Trophy className="text-[var(--trophy-yellow)] w-6 h-6 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black text-purple-400 uppercase tracking-[0.15em] group-hover:text-purple-300 transition-colors">
            University Ranking
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-zinc-800 text-white hover:bg-red-500 transition-all duration-200 shadow-lg active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;