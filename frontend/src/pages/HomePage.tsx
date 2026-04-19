import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trophy, Users, Vote, ArrowRight, ShieldCheck, School, Clock, History, Gamepad2, Zap } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

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

  // Adjusted background colors for transparency/glass effect
  const bgMain = isDark ? 'bg-[#121212]' : 'bg-[#f8fafc]';
  const cardBg = isDark
      ? 'bg-zinc-900/60 backdrop-blur-md border-zinc-800'
      : 'bg-white/80 backdrop-blur-md border-zinc-200';

  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const serverStats = [
    { label: 'Total Users', value: '12,840', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Votes', value: '85.2k', icon: Vote, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Universities', value: '450+', icon: School, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Duels', value: '124k', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
      <div className={`min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 antialiased`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className={`flex-1 p-8 md:p-10 overflow-y-auto ${bgMain}`}>
            <div className="max-w-6xl mx-auto space-y-8">

              <section className={`p-8 md:p-10 rounded-3xl shadow-sm border transition-all duration-300 ${cardBg}`}>
                <header className="mb-10">
                  <h1 className={`text-3xl md:text-4xl font-extrabold mb-2 tracking-tight ${textColor}`}>Home Base</h1>
                  <p className="text-purple-500 font-semibold text-base">Your dashboard for university evaluations.</p>
                </header>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Link to="/duel" className={`group relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-purple-500/40' : 'bg-white border-zinc-200 hover:border-purple-500'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h2 className={`text-xl font-bold ${textColor}`}>University Duel</h2>
                      <Zap className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
                    </div>
                    <p className={`mb-5 text-sm leading-relaxed ${subTextColor}`}>Compare universities head-to-head to update the global ELO rankings.</p>
                    <span className="font-bold text-sm text-purple-500 flex items-center gap-2 group-hover:gap-3 transition-all">Start Dueling <span>→</span></span>
                  </Link>

                  <Link to="/event" className={`group relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-green-500/40' : 'bg-white border-zinc-200 hover:border-green-500'}`}>
                    <h2 className={`text-xl font-bold mb-3 ${textColor}`}>Major Events</h2>
                    <p className={`mb-5 text-sm leading-relaxed ${subTextColor}`}>Participate in seasonal ranking events and represent your school.</p>
                    <span className="font-bold text-sm text-green-500 flex items-center gap-2 group-hover:gap-3 transition-all">Join Live Event <span>→</span></span>
                  </Link>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className={`lg:col-span-2 p-8 rounded-3xl border ${cardBg} shadow-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className={`text-lg font-bold uppercase tracking-tight ${textColor}`}>Top Universities</h3>
                    </div>
                    <Link to="/leaderboard" className="text-xs font-bold uppercase tracking-widest text-purple-500 hover:text-purple-400 transition-colors">Full Rankings</Link>
                  </div>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: 'Hanoi University of Science', elo: 2450, trend: '+12' },
                      { rank: 2, name: 'FPT University', elo: 2380, trend: '+8' },
                      { rank: 3, name: 'National Economics University', elo: 2310, trend: '-2' },
                    ].map((uni) => (
                        <div key={uni.rank} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-zinc-50'} border border-transparent hover:border-purple-500/20 transition-all`}>
                          <div className="flex items-center gap-4">
                            <span className={`text-base font-bold w-6 ${uni.rank === 1 ? 'text-yellow-500' : 'opacity-40'}`}>{uni.rank}</span>
                            <span className={`font-semibold text-sm ${textColor}`}>{uni.name}</span>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-sm ${textColor}`}>{uni.elo} <span className="text-xs text-green-500 ml-1">{uni.trend}</span></p>
                          </div>
                        </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  {serverStats.map((stat, index) => (
                      <div key={index} className={`p-5 rounded-3xl border ${cardBg} flex flex-col items-center justify-center text-center space-y-3 shadow-sm hover:scale-105 transition-transform`}>
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                          <span className={`block text-lg font-bold ${textColor}`}>{stat.value}</span>
                          <span className={`text-[10px] uppercase font-semibold tracking-widest opacity-60 ${subTextColor}`}>{stat.label}</span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              <section className={`p-8 rounded-3xl border ${cardBg} shadow-sm`}>
                <div className="flex justify-between items-end mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                      <History className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${textColor}`}>Recent Activity</h3>
                      <p className={`text-sm ${subTextColor}`}>Your personal history of ranking event contributions.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { target: 'FPT University', event: 'Summer Campus Battle 2026', time: 'Yesterday' },
                    { target: 'RMIT Vietnam', event: 'Academic Excellence Week', time: '4 days ago' },
                  ].map((item, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-zinc-50'} border border-transparent hover:border-green-500/20 transition-all`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${textColor}`}>Joined <span className="text-green-500">{item.event}</span></p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`text-xs font-semibold opacity-70 ${subTextColor}`}>Supporting: {item.target}</span>
                              <span className={`text-[10px] flex items-center gap-1 ${subTextColor}`}><Clock className="w-3 h-3" /> {item.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <ArrowRight className="w-4 h-4 opacity-30 text-zinc-400" />
                        </div>
                      </div>
                  ))}
                </div>
              </section>

              <section className="relative rounded-3xl p-8 overflow-hidden bg-purple-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="relative z-10 space-y-3 max-w-xl text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Represent your University</h2>
                  <p className="text-purple-100/90 text-sm md:text-base font-medium">Verify your student email to increase your voting weight and climb your university's internal leaderboard.</p>
                </div>
                <button className="relative z-10 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
                  Verify Identity <ArrowRight className="w-4 h-4" />
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