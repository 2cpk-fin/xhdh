import { Link } from 'react-router-dom';
import { Home, Gamepad2, Newspaper, Users, UserCircle, Settings, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = () => {
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
  const sidebarBg = isDark ? 'bg-black border-white/10' : 'bg-white border-zinc-200 shadow-[0_2px_18px_rgba(0,0,0,0.05)]';
  const sidebarText = isDark ? 'text-zinc-400' : 'text-zinc-700';

  const links = [
    { name: 'Home', icon: Home, path: '/home' },
    { name: 'Play', icon: Gamepad2, path: '/play' },
    { name: 'News', icon: Newspaper, path: '/news' },
    { name: 'Community', icon: Users, path: '/community' },
  ];

  const currentPath = window.location.pathname;

  return (
    <aside className={`w-64 sticky top-0 h-screen p-6 flex flex-col justify-between border-r transition-all duration-300 ${sidebarBg}`}>
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-3 py-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
          <Trophy className="text-[var(--trophy-yellow)] w-6 h-6 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] leading-tight">
            University <br /> Ranking
          </span>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center gap-4 py-3 px-4 rounded-xl ${isActive ? 'text-white bg-purple-500/20' : sidebarText + ' hover:text-purple-500 hover:bg-purple-500/10'} transition-all duration-200`}
              >
                <Icon className="w-5 h-5 group-hover:text-[var(--highlight)] transition-colors" />
                <span className="font-medium">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--highlight)] shadow-[0_0_8px_var(--highlight)]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 border-t border-zinc-800/50 pt-6">
        <Link to="/profile" className={`group flex items-center gap-4 py-3 px-4 rounded-xl ${sidebarText} hover:text-[var(--accent-green)] hover:bg-green-500/5 transition-all`}>
          <UserCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">User</span>
        </Link>
        <Link to="/settings" className={`group flex items-center gap-4 py-3 px-4 rounded-xl ${sidebarText} hover:text-[var(--accent-green)] hover:bg-green-500/5 transition-all`}>
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-medium">Setting</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
