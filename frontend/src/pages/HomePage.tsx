import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trophy, Users, Vote, ArrowRight, ShieldCheck, School, Clock, History, Gamepad2, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const HomePage = () => {
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

  const serverStats = [
    { label: 'Total Users', value: '12,840', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Votes', value: '85.2k', icon: Vote, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Universities', value: '450+', icon: School, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Duels', value: '124k', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
      <div className={`min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className={`flex-1 p-10 overflow-y-auto ${bgMain}`}>
            <div className="max-w-6xl mx-auto space-y-10">

              <section className={`p-10 rounded-3xl shadow-2xl border transition-all duration-300 ${cardBg}`}>
                <header className="mb-12">
                  <h1 className={`text-5xl font-black mb-3 tracking-tight ${textColor}`}>Home Base</h1>
                  <p className="text-purple-500 font-medium text-lg">Your dashboard for university evaluations.</p>
                </header>

                <div className="grid gap-8 sm:grid-cols-2">
                  <Link to="/duel" className={`group relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-purple-500/50' : 'bg-white border-zinc-200 hover:border-purple-500'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className={`text-2xl font-bold ${textColor}`}>University Duel</h2>
                      <Zap className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
                    </div>
                    <p className={`mb-6 leading-relaxed ${subTextColor}`}>Compare universities head-to-head to update the global ELO rankings.</p>
                    <span className="font-bold text-purple-500 flex items-center gap-2 group-hover:gap-4 transition-all">Start Dueling <span>→</span></span>
                  </Link>

                  <Link to="/event" className={`group relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-green-500/50' : 'bg-white border-zinc-200 hover:border-green-500'}`}>
                    <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Major Events</h2>
                    <p className={`mb-6 leading-relaxed ${subTextColor}`}>Participate in seasonal ranking events and represent your school.</p>
                    <span className="font-bold text-green-500 flex items-center gap-2 group-hover:gap-4 transition-all">Join Live Event <span>→</span></span>
                  </Link>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className={`lg:col-span-2 p-8 rounded-3xl border ${cardBg} shadow-xl`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <h3 className={`text-xl font-black uppercase tracking-tight ${textColor}`}>Top Universities</h3>
                    </div>
                    <Link to="/leaderboard" className="text-xs font-black uppercase tracking-widest text-purple-500 hover:text-purple-400 transition-colors">Full Rankings</Link>
                  </div>
                  <div className="space-y-4">
                    {[
                      { rank: 1, name: 'Hanoi University of Science', elo: 2450, trend: '+12' },
                      { rank: 2, name: 'FPT University', elo: 2380, trend: '+8' },
                      { rank: 3, name: 'National Economics University', elo: 2310, trend: '-2' },
                    ].map((uni) => (
                        <div key={uni.rank} className={`flex items-center justify-between p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-zinc-50'} border border-transparent hover:border-purple-500/20 transition-all`}>
                          <div className="flex items-center gap-4">
                            <span className={`text-lg font-black w-6 ${uni.rank === 1 ? 'text-yellow-500' : 'opacity-30'}`}>{uni.rank}</span>
                            <span className={`font-bold text-sm ${textColor}`}>{uni.name}</span>
                          </div>
                          <div className="text-right">
                            <p className={`font-black text-sm ${textColor}`}>{uni.elo} <span className="text-[10px] text-green-500 ml-1">{uni.trend}</span></p>
                          </div>
                        </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  {serverStats.map((stat, index) => (
                      <div key={index} className={`p-6 rounded-3xl border ${cardBg} flex flex-col items-center justify-center text-center space-y-3 shadow-lg hover:scale-[1.02] transition-transform`}>
                        <div className={`p-3 rounded-2xl ${stat.bg}`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                          <span className={`block text-xl font-black ${textColor}`}>{stat.value}</span>
                          <span className={`text-[10px] uppercase font-bold tracking-widest opacity-50`}>{stat.label}</span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              <section className={`p-8 rounded-3xl border ${cardBg} shadow-xl`}>
                <div className="flex justify-between items-end mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <History className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-black ${textColor}`}>Recent Event Participation</h3>
                      <p className={subTextColor}>Your personal history of ranking event contributions.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { target: 'FPT University', event: 'Summer Campus Battle 2026', time: 'Yesterday' },
                    { target: 'RMIT Vietnam', event: 'Academic Excellence Week', time: '4 days ago' },
                  ].map((item, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-zinc-50'} border border-transparent hover:border-green-500/20 transition-all`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <p className={`font-bold ${textColor}`}>Joined <span className="text-green-500">{item.event}</span></p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Supporting: {item.target}</span>
                              <span className="text-[10px] opacity-40 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <ArrowRight className="w-4 h-4 opacity-20" />
                        </div>
                      </div>
                  ))}
                </div>
              </section>

              <section className="relative rounded-3xl p-10 overflow-hidden bg-purple-600 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
                  <h2 className="text-4xl font-black leading-tight">Represent your University</h2>
                  <p className="text-purple-100 opacity-90">Verify your student email to increase your voting weight and climb your university's internal leaderboard.</p>
                </div>
                <button className="relative z-10 px-8 py-4 bg-white text-purple-600 rounded-2xl font-black text-lg hover:scale-105 transition-transform flex items-center gap-3 shadow-xl">
                  Verify Identity <ArrowRight className="w-5 h-5" />
                </button>
              </section>

            </div>
          </main>
          <Footer />
        </div>
      </div>
  );
};

export default HomePage;