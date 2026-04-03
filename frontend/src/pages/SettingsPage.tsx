import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ArrowLeft, Shield, Palette, Bell, Settings } from 'lucide-react';

const SettingsPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    window.dispatchEvent(new Event('themeChange'));
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen p-8 bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 flex items-center justify-center">
      <div className={`max-w-2xl w-full rounded-3xl p-10 shadow-2xl border backdrop-blur-xl transition-all duration-500 
        ${isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/90 border-zinc-200'}`}>
        
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-[var(--highlight)]" />
            <h1 className="text-4xl font-black tracking-tight">Settings</h1>
          </div>
          <p className="opacity-60 font-medium">Configure your terminal and interface preferences.</p>
        </header>

        {/* Theme Selection Section */}
        <section className="mb-10">
          <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50 mb-6">
            <Palette className="w-4 h-4" /> Interface Theme
          </label>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Light Mode Preview Card */}
            <button
              onClick={() => applyTheme('light')}
              className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all text-left
                ${!isDark ? 'border-[var(--highlight)] bg-white' : 'border-zinc-800 bg-zinc-950/50'}`}
            >
              <Sun className={`w-6 h-6 mb-4 ${!isDark ? 'text-[var(--highlight)]' : 'text-zinc-600'}`} />
              <div className="font-bold">Light Mode</div>
              <div className="text-xs opacity-50">Fresh & Clean</div>
              {!isDark && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--highlight)] shadow-[0_0_8px_var(--highlight)]" />}
            </button>

            {/* Dark Mode Preview Card */}
            <button
              onClick={() => applyTheme('dark')}
              className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all text-left
                ${isDark ? 'border-[var(--highlight)] bg-zinc-900' : 'border-zinc-200 bg-zinc-50'}`}
            >
              <Moon className={`w-6 h-6 mb-4 ${isDark ? 'text-[var(--highlight)]' : 'text-zinc-400'}`} />
              <div className="font-bold">Dark Mode</div>
              <div className="text-xs opacity-50">Deep Space</div>
              {isDark && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--highlight)] shadow-[0_0_8px_var(--highlight)]" />}
            </button>
          </div>
        </section>

        {/* Example of other settings */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-500/5 border border-[var(--divider)]">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[var(--accent-green)]" />
              <span className="font-medium">Push Notifications</span>
            </div>
            <div className="w-10 h-5 bg-zinc-700 rounded-full relative">
               <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-500/5 border border-[var(--divider)]">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Privacy Shield</span>
            </div>
            <span className="text-xs font-bold text-[var(--accent-green)]">ACTIVE</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/home')}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: 'var(--highlight)', boxShadow: '0 10px 20px -10px var(--highlight)' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Save & Return to Home Base
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;