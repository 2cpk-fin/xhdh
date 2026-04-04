import { Newspaper, TrendingUp, Mail, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NewsPage = () => {
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
  const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200 shadow-xl shadow-blue-500/5';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const newsItems = [
    { type: 'EVENT_START', title: 'Global University Championship 2026', desc: 'The wait is over. Official matches for the 2026 season have officially started.', time: 'Just now', status: 'Live' },
    { type: 'PATCH_NOTE', title: 'System Update v1.2.0', desc: 'Added new university comparison radar and enhanced ELO calculation algorithm.', time: '2 hours ago', status: 'Update' },
    { type: 'EVENT_END', title: 'Spring Campus Battle', desc: 'The event has concluded. Final rankings are being verified for reward distribution.', time: 'Yesterday', status: 'Finished' },
    { type: 'EVENT_UPCOMING', title: 'National Alumni Tournament', desc: 'Registration starts in 3 days. Prepare your university alumni community.', time: '2 days ago', status: 'Upcoming' },
  ];

  return (
      <div className={`min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className={`flex-1 p-10 flex justify-center overflow-y-auto ${bgMain}`}>
            <div className="max-w-6xl w-full space-y-10">

              {/* Feature News Card */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-purple-600 p-10 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 mb-4 px-3 py-1 bg-white/20 w-fit rounded-full text-[10px] font-black uppercase tracking-widest">
                    <TrendingUp className="w-4 h-4" /> Priority Notice
                  </div>
                  <h2 className="text-5xl font-black mb-4 leading-tight tracking-tighter">System Upgrade & Seasonal Reset</h2>
                  <p className="text-purple-100 mb-8 text-lg opacity-90 font-medium leading-relaxed">All ELO rankings will be recalibrated for the new semester. Review the updated fair-play guidelines for 2026.</p>
                  <button className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95">
                    View Patch Notes <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Feed: Event Timeline & Updates */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl">
                      <Newspaper className="w-6 h-6 text-purple-500" />
                    </div>
                    <h1 className={`text-3xl font-black uppercase tracking-tighter ${textColor}`}>Broadcast Center</h1>
                  </div>

                  <div className="space-y-4">
                    {newsItems.map((item, i) => (
                        <div key={i} className={`group p-6 rounded-[2rem] border transition-all duration-300 hover:border-purple-500/50 ${cardBg}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                item.status === 'Live' ? 'bg-emerald-500/10 text-emerald-500' :
                                    item.status === 'Update' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-500/10 opacity-50'
                            }`}>
                              {item.status === 'Live' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                              {item.status}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase opacity-40">
                              <Clock className="w-3 h-3" /> {item.time}
                            </div>
                          </div>
                          <h3 className={`text-xl font-black mb-2 transition-colors ${textColor}`}>{item.title}</h3>
                          <p className={`text-sm leading-relaxed mb-4 ${subTextColor} font-medium`}>{item.desc}</p>
                          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 flex items-center gap-1 hover:gap-3 transition-all">
                            View Details <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar: Event Status & Subscription */}
                <div className="space-y-8">
                  <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
                    <h3 className="text-sm font-black mb-8 uppercase tracking-[0.2em] text-purple-500">Live Event Status</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'Registration', status: 'Closed', active: false },
                        { label: 'Qualifiers', status: 'Running', active: true },
                        { label: 'Finals', status: 'Upcoming', active: false },
                      ].map((step, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${step.active ? 'bg-emerald-500 animate-ping' : 'bg-zinc-500/30'}`} />
                              <span className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{step.label}</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-emerald-500' : 'opacity-30'}`}>{step.status}</span>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-white/5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                        <Mail className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">Stay Synced</h3>
                      <p className="text-xs opacity-80 font-medium">Get real-time patch notes and event notifications directly.</p>
                    </div>
                    <div className="space-y-3 relative z-10">
                      <input
                          type="email"
                          placeholder="academic@email.com"
                          className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 placeholder:text-white/40 text-sm focus:outline-none focus:bg-white/20 transition-all text-center font-bold"
                      />
                      <button className="w-full py-4 bg-white text-purple-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-900/20">
                        Subscribe Now
                      </button>
                    </div>
                  </div>

                  <div className={`p-6 rounded-[2rem] border border-dashed border-zinc-500/20 flex flex-col items-center gap-3 text-center`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500/40" />
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">All data verified by <br /> academic council 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
  );
};

export default NewsPage;