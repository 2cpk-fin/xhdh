import { useEffect, useState } from 'react';
import { Sun, Moon, Shield, Palette, Bell, Settings, Zap, Volume2, Eye, User, Lock, Globe, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SettingsPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    window.dispatchEvent(new Event('themeChange'));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
  const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 p-10 overflow-y-auto ${bgMain}`}>
          <div className="max-w-5xl mx-auto space-y-8">
            
            <header className="flex justify-between items-end pb-4">
              <div>
                <h1 className={`text-5xl font-black tracking-tight ${textColor} mb-2`}>Settings</h1>
                <p className={`${subTextColor} font-medium`}>Manage your account preferences and system configuration.</p>
              </div>
              {isSaved && (
                <div className="flex items-center gap-2 text-green-500 font-bold animate-bounce">
                  <CheckCircle2 className="w-5 h-5" /> Changes Saved
                </div>
              )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-8">
                
                <section className={`${cardBg} rounded-[2rem] p-8 shadow-xl border`}>
                  <div className="flex items-center gap-3 mb-8 text-purple-500">
                    <Palette className="w-6 h-6" />
                    <h2 className="text-xl font-black uppercase tracking-widest">Appearance</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button
                      onClick={() => applyTheme('light')}
                      className={`group relative rounded-2xl p-6 border-2 transition-all duration-300 ${
                        !isDark ? 'border-purple-500 bg-purple-50/50' : 'border-zinc-800 bg-zinc-900/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Sun className={`w-8 h-8 ${!isDark ? 'text-purple-500' : 'text-zinc-500'}`} />
                        {!isDark && <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />}
                      </div>
                      <div className={`text-lg font-bold ${!isDark ? 'text-zinc-900' : 'text-zinc-400'}`}>Light Mode</div>
                      <p className="text-xs opacity-50 mt-1">Clean and high contrast</p>
                    </button>

                    <button
                      onClick={() => applyTheme('dark')}
                      className={`group relative rounded-2xl p-6 border-2 transition-all duration-300 ${
                        isDark ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-200 bg-zinc-50 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Moon className={`w-8 h-8 ${isDark ? 'text-purple-500' : 'text-zinc-400'}`} />
                        {isDark && <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />}
                      </div>
                      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Dark Mode</div>
                      <p className="text-xs opacity-50 mt-1">Easier on the eyes at night</p>
                    </button>
                  </div>
                </section>

                <section className={`${cardBg} rounded-[2rem] p-8 shadow-xl border`}>
                  <div className="flex items-center gap-3 mb-8 text-purple-500">
                    <Bell className="w-6 h-6" />
                    <h2 className="text-xl font-black uppercase tracking-widest">System Preferences</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'notif', icon: Bell, title: 'Push Notifications', desc: 'Get updates on university rankings', state: notifications, toggle: setNotifications, color: 'text-blue-500' },
                      { id: 'sound', icon: Volume2, title: 'Sound Effects', desc: 'Interactive audio feedback', state: soundEnabled, toggle: setSoundEnabled, color: 'text-green-500' },
                    ].map((item) => (
                      <div key={item.id} className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-100'} flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                          <div>
                            <div className={`font-bold ${textColor}`}>{item.title}</div>
                            <div className={`text-xs ${subTextColor}`}>{item.desc}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => item.toggle(!item.state)}
                          className={`w-14 h-8 rounded-full transition-all relative ${item.state ? 'bg-purple-500' : 'bg-zinc-400'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${item.state ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section className={`${cardBg} rounded-[2rem] p-8 shadow-xl border`}>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-500 mb-6">Account</h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-500/5 transition-colors">
                      <User className="w-5 h-5 opacity-50" />
                      <span className="text-sm font-bold">Profile Details</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-500/5 transition-colors text-red-500">
                      <Lock className="w-5 h-5 opacity-50" />
                      <span className="text-sm font-bold">Privacy & Security</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-500/5 transition-colors">
                      <Globe className="w-5 h-5 opacity-50" />
                      <span className="text-sm font-bold">Language: English</span>
                    </button>
                  </div>
                </section>

                <section className={`${cardBg} rounded-[2rem] p-8 shadow-xl border bg-gradient-to-br from-purple-500/5 to-transparent`}>
                  <Shield className="w-10 h-10 text-cyan-500 mb-4" />
                  <h3 className={`font-black text-lg ${textColor} mb-2`}>Data Privacy</h3>
                  <p className="text-xs opacity-50 leading-relaxed mb-6">
                    Your data is encrypted and never shared with third parties. You can request a data export at any time.
                  </p>
                  <button className="text-xs font-black uppercase text-purple-500 hover:underline">Manage Data</button>
                </section>
              </div>
            </div>

            <div className="flex justify-center pt-10">
              <button 
                onClick={handleSave}
                className="group relative px-12 py-5 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2 text-lg">
                  Save Configuration
                </span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SettingsPage;