import { useEffect, useState } from 'react';
import {
  Sun, Moon, Palette, Bell, Volume2, Globe, CheckCircle2,
  Cpu, RefreshCw, Eye, Monitor, ShieldCheck, AlertCircle
} from 'lucide-react';
import SettingsSidebar from '../components/SettingsSidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SystemSettings = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
  const [lang, setLang] = useState<'EN' | 'VI'>(() => (localStorage.getItem('lang') as 'EN' | 'VI') ?? 'EN');

  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });
  const [progress, setProgress] = useState(100);

  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    hardwareAccel: true,
    reducedMotion: false
  });

  useEffect(() => {
    const syncTheme = () => {
      const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(fromStorage);
      if (fromStorage === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    window.addEventListener('themeChange', syncTheme);
    syncTheme();
    return () => window.removeEventListener('themeChange', syncTheme);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setProgress(100);
    const duration = 3000;
    const interval = 10;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setToast(prev => ({ ...prev, show: false }));
          return 0;
        }
        return prev - step;
      });
    }, interval);
  };

  const applyTheme = (newTheme: 'light' | 'dark') => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    window.dispatchEvent(new Event('themeChange'));
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
  const cardBg = isDark ? 'bg-[#000000] border-zinc-800' : 'bg-white border-zinc-200';
  const footerBg = isDark ? 'bg-[#0d0d0d] border-zinc-800' : 'bg-[#fcfcfc] border-zinc-200';
  const itemBg = isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-100';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
      <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
        <SettingsSidebar />
        <div className="flex-1 flex flex-col min-h-screen text-left">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto space-y-6">
              <header className="pb-4 border-b border-zinc-500/10">
                <h1 className={`text-4xl font-bold tracking-tight ${textColor}`}>System Settings</h1>
                <p className={`text-base ${subTextColor} mt-1`}>Configure core environment behavior, aesthetics, and performance.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                  <section className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}>
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
                          <Palette className="w-5 h-5" />
                        </div>
                        <h2 className={`text-xl font-bold ${textColor}`}>Aesthetics</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => applyTheme('light')} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-200 dark:border-zinc-800 opacity-60'}`}>
                          <div className="p-3 bg-white shadow-md rounded-xl text-orange-500"><Sun className="w-6 h-6" /></div>
                          <div className="text-left">
                            <p className={`font-bold ${textColor}`}>Light Mode</p>
                            <p className={`text-xs ${subTextColor}`}>Optimized for daylight</p>
                          </div>
                        </button>
                        <button onClick={() => applyTheme('dark')} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-200 dark:border-zinc-800 opacity-60'}`}>
                          <div className="p-3 bg-zinc-900 shadow-md rounded-xl text-purple-400"><Moon className="w-6 h-6" /></div>
                          <div className="text-left">
                            <p className={`font-bold ${textColor}`}>Dark Mode</p>
                            <p className={`text-xs ${subTextColor}`}>Easier on the eyes</p>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className={`px-8 py-4 border-t flex justify-between items-center ${footerBg}`}>
                      <p className={`text-sm font-medium ${subTextColor}`}>Visual themes sync across your devices.</p>
                      <button onClick={() => showNotification('success', 'Aesthetics updated')} className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                        Apply Theme
                      </button>
                    </div>
                  </section>

                  <section className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}>
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                          <Monitor className="w-5 h-5" />
                        </div>
                        <h2 className={`text-xl font-bold ${textColor}`}>Environment Controls</h2>
                      </div>

                      <div className="space-y-3">
                        {[
                          { id: 'notifications', icon: Bell, title: 'Global Notifications', desc: 'System alerts and tournament updates', color: 'text-blue-500' },
                          { id: 'soundEffects', icon: Volume2, title: 'Interface Sounds', desc: 'Audio feedback for interaction events', color: 'text-emerald-500' },
                          { id: 'hardwareAccel', icon: Cpu, title: 'Hardware Acceleration', desc: 'Use GPU for smoother transitions', color: 'text-purple-500' },
                          { id: 'reducedMotion', icon: Eye, title: 'Reduced Motion', desc: 'Minimize animation intensity', color: 'text-amber-500' },
                        ].map((item) => (
                            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${itemBg}`}>
                              <div className="flex items-center gap-4">
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                <div>
                                  <p className={`text-sm font-bold ${textColor}`}>{item.title}</p>
                                  <p className={`text-xs ${subTextColor}`}>{item.desc}</p>
                                </div>
                              </div>
                              <button
                                  onClick={() => handleToggle(item.id as never)}
                                  className={`w-12 h-6 rounded-full transition-all relative ${settings[item.id as keyof typeof settings] ? 'bg-purple-500' : 'bg-zinc-400'}`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.id as keyof typeof settings] ? 'left-7' : 'left-1'}`} />
                              </button>
                            </div>
                        ))}
                      </div>
                    </div>
                    <div className={`px-8 py-4 border-t flex justify-between items-center ${footerBg}`}>
                      <p className={`text-sm font-medium ${subTextColor}`}>Managed by system administrator.</p>
                      <button onClick={() => showNotification('success', 'Environment settings saved')} className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                        Save Changes
                      </button>
                    </div>
                  </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <section className={`border rounded-2xl p-6 shadow-sm ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <Globe className="w-5 h-5 text-indigo-500" />
                      <h3 className={`font-bold ${textColor}`}>Language</h3>
                    </div>
                    <div className="flex gap-2">
                      {['EN', 'VI'].map((l) => (
                          <button
                              key={l}
                              onClick={() => { setLang(l as never); localStorage.setItem('lang', l); }}
                              className={`flex-1 py-2 rounded-xl border font-bold text-xs transition-all ${lang === l ? 'bg-purple-500 border-purple-500 text-white shadow-lg' : 'border-zinc-200 dark:border-zinc-800'}`}
                          >
                            {l === 'EN' ? 'English' : 'Vietnamese'}
                          </button>
                      ))}
                    </div>
                  </section>

                  <section className={`border rounded-2xl p-6 shadow-sm ${cardBg} bg-gradient-to-br from-blue-500/5 to-transparent`}>
                    <div className="flex items-center gap-3 mb-4 text-blue-500">
                      <ShieldCheck className="w-5 h-5" />
                      <h3 className={`font-bold ${textColor}`}>System Status</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className={subTextColor}>Backend Latency</span>
                        <span className="text-emerald-500 font-bold">24ms</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className={subTextColor}>Storage Usage</span>
                        <span className={textColor}>1.2 / 5 GB</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[24%]" />
                      </div>
                    </div>
                  </section>

                  <section className={`border rounded-2xl p-6 shadow-sm ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <RefreshCw className="w-5 h-5 text-purple-500" />
                      <h3 className={`font-bold ${textColor}`}>Version Control</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 mb-4">
                      <p className={`text-xs font-bold ${textColor}`}>Version 2.4.0-stable</p>
                      <p className={`text-[10px] ${subTextColor}`}>Updated: April 2026</p>
                    </div>
                    <button
                        onClick={() => showNotification('success', 'System is up to date')}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}
                    >
                      Check Update
                    </button>
                  </section>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                    onClick={() => showNotification('success', 'System configuration synchronized')}
                    className="group relative px-16 py-4 rounded-2xl font-black text-white bg-purple-600 shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
                >
                  <span className="relative z-10">SAVE CONFIGURATION</span>
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>

        <div className={`fixed top-8 right-8 z-[300] w-80 overflow-hidden rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'} ${toast.type === 'success' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-white/10' : 'bg-red-600 text-white border-red-400 shadow-[0_20px_50px_rgba(220,38,38,0.3)]'}`}>
          <div className="flex items-center gap-4 px-6 py-5">
            <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-white/20'}`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
            </div>
            <div className="text-left">
              <p className="font-bold text-xs uppercase tracking-widest">{toast.type === 'success' ? 'Saved' : 'Error'}</p>
              <p className="text-[11px] font-medium opacity-90">{toast.message}</p>
            </div>
          </div>
          <div className={`h-1 w-full ${toast.type === 'success' ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-red-800'}`}>
            <div className={`h-full transition-all ease-linear ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-white'}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
  );
};

export default SystemSettings;