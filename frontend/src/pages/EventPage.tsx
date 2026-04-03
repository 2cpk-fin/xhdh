import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Sparkles, Calendar, Trophy, Timer, ArrowRight, Star } from 'lucide-react';

const EventPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  useEffect(() => {
    const onThemeChange = () => {
      const updated = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(updated);
    };

    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-10">
            
            <div className={`${cardBg} rounded-[2.5rem] p-10 shadow-2xl border relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-purple-500/10 rounded-2xl">
                    <Sparkles className="w-10 h-10 text-purple-500" />
                  </div>
                  <div>
                    <h1 className={`text-5xl font-black tracking-tight ${textColor}`}>Event Mode</h1>
                    <p className="text-purple-500 font-bold uppercase tracking-widest text-xs mt-1">Coming Soon • Summer 2026</p>
                  </div>
                </div>
                
                <p className={`${subTextColor} mb-12 text-xl leading-relaxed max-w-2xl`}>
                  Get ready for the next level of university evaluation. Join scheduled competitions, climb live leaderboards, and represent your institution in global tournament formats.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'} border ${isDark ? 'border-zinc-800' : 'border-zinc-200'} group/item hover:border-purple-500/40 transition-all duration-500`}>
                    <Calendar className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className={`font-black text-xl mb-3 ${textColor}`}>Tournament Schedule</h3>
                    <p className={`text-sm ${subTextColor} leading-relaxed`}>
                      Participate in university-led competitions and win exclusive scholarships and research grants.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-purple-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      VIEW CALENDAR <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'} border ${isDark ? 'border-zinc-800' : 'border-zinc-200'} group/item hover:border-green-500/40 transition-all duration-500`}>
                    <Trophy className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className={`font-black text-xl mb-3 ${textColor}`}>Seasonal Rewards</h3>
                    <p className={`text-sm ${subTextColor} leading-relaxed`}>
                      Earn institution-specific badges and climb the "Alumni of the Year" digital honor roll.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-green-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      BROWSE REWARDS <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Timer, title: "Countdown", desc: "14 Days Remaining", color: "text-blue-500" },
                { icon: Star, title: "Pre-register", desc: "Unlock Beta Badge", color: "text-yellow-500" },
                { icon: Trophy, title: "Grand Prize", desc: "Premium Access", color: "text-purple-500" }
              ].map((item, i) => (
                <div key={i} className={`${cardBg} p-6 rounded-2xl border flex items-center gap-4 shadow-sm`}>
                  <div className={`p-3 rounded-xl bg-zinc-500/5 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-sm font-black ${textColor}`}>{item.title}</p>
                    <p className="text-xs opacity-50 font-bold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventPage;