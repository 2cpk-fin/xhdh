import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Gamepad2, Activity, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const PlayPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  useEffect(() => {
    const syncTheme = () => {
      const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(fromStorage);
    };
    window.addEventListener('themeChange', syncTheme);
    return () => window.removeEventListener('themeChange', syncTheme);
  }, []);

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
  const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className={`min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 ${bgMain}`}>
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-10">
          <header className="mb-8">
          <h1 className={`text-5xl font-black tracking-tight ${textColor}`}>Play</h1>
          <p className={`mt-2 text-lg font-medium ${subTextColor}`}>Choose one of the modes to continue.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            to="/duel"
            className={`group block rounded-2xl border p-8 transition-transform duration-200 hover:-translate-y-1 ${cardBg}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="h-6 w-6 text-purple-500" />
              <h2 className={`text-2xl font-bold ${textColor}`}>Duel Mode</h2>
            </div>
            <p className={`mb-4 ${subTextColor}`}>
              Face a challenger in one-on-one battles and improve your ranking with every win.
            </p>
            <span className="font-bold text-purple-500">Start Duel →</span>
          </Link>

          <Link
            to="/event"
            className={`group block rounded-2xl border p-8 transition-transform duration-200 hover:-translate-y-1 ${cardBg}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-green-500" />
              <h2 className={`text-2xl font-bold ${textColor}`}>Event Mode</h2>
            </div>
            <p className={`mb-4 ${subTextColor}`}>
              Unlock special tournaments and compete against the community for limited rewards.
            </p>
            <span className="font-bold text-green-500">Join Event →</span>
          </Link>
        </div>

        <div className="mt-10 px-6 py-4 rounded-xl border bg-white/5 text-sm text-zinc-400">
          <Activity className="inline-block align-middle mr-2 w-4 h-4" />
          Need practice first? Go to the <Link to="/home" className="text-purple-400">Home page</Link> and review the available training options.
        </div>
      </div>
      </main>
    </div>
  );
};

export default PlayPage;
