import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

const Header = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  useEffect(() => {
    const onThemeChange = () => {
      const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(fromStorage);
    };
    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  const isDark = theme === 'dark';

  return (
      <header className={`border-b backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 ${isDark ? 'bg-black/80 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
        <div className="max-w-full mx-auto px-10 py-4 flex items-center justify-between">

          <Link to="/home" className="flex items-center gap-3 group cursor-pointer">
            <Trophy className="text-[var(--trophy-yellow)] w-6 h-6 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black text-purple-400 uppercase tracking-[0.15em] group-hover:text-purple-300 transition-colors">
            University Ranking
          </span>
          </Link>

        </div>
      </header>
  );
};

export default Header;