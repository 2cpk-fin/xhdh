import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trophy, Zap, Vote, ArrowRight, ShieldCheck, School, Clock, History } from 'lucide-react';
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

  const stats = [
    { label: 'Your Votes', value: '42', icon: Vote, color: 'text-blue-500' },
    { label: 'Karma Points', value: '850', icon: Zap, color: 'text-yellow-500' },
    { label: 'Rank Level', value: 'Gold', icon: Trophy, color: 'text-purple-500' },
    { label: 'Uni Impact', value: 'Top 5%', icon: ShieldCheck, color: 'text-green-500' },
  ];

  return (
    <div className={`min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 p-10 overflow-y-auto ${bgMain}`}>
          <div className="max-w-5xl mx-auto space-y-10">
            
            <section className={`p-10 rounded-3xl shadow-2xl border transition-all duration-300 ${cardBg}`}>
              <header className="mb-12">
                <h1 className={`text-5xl font-black mb-3 tracking-tight ${textColor}`}>Home Base</h1>
                <p className="text-purple-500 font-medium text-lg">Your dashboard for university evaluations.</p>
              </header>

              <div className="grid gap-8 sm:grid-cols-2">
                <Link
                  to="/duel"
                  className={`group relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-purple-500/50' : 'bg-white border-zinc-200 hover:border-purple-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className={`text-2xl font-bold ${textColor}`}>University Duel</h2>
                    <Zap className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
                  </div>
                  <p className={`mb-6 leading-relaxed ${subTextColor}`}>
                    Continue comparing universities to help the community build a better global ranking.
                  </p>
                  <span className="font-bold text-purple-500 flex items-center gap-2 group-hover:gap-4 transition-all">
                    Start Dueling <span>→</span>
                  </span>
                </Link>

                <Link
                  to="/event"
                  className={`group relative overflow-hidden rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-green-500/50' : 'bg-white border-zinc-200 hover:border-green-500'
                  }`}
                >
                  <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Major Events</h2>
                  <p className={`mb-6 leading-relaxed ${subTextColor}`}>
                    Check out seasonal ranking events you've participated in and see live results.
                  </p>
                  <span className="font-bold text-green-500 flex items-center gap-2 group-hover:gap-4 transition-all">
                    Join Live Event <span>→</span>
                  </span>
                </Link>
              </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className={`p-6 rounded-2xl border ${cardBg} flex flex-col items-center text-center space-y-2`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  <span className={`text-2xl font-black ${textColor}`}>{stat.value}</span>
                  <span className={`text-[10px] uppercase font-black tracking-widest opacity-60`}>{stat.label}</span>
                </div>
              ))}
            </section>

            <section className={`p-8 rounded-3xl border ${cardBg}`}>
              <div className="flex justify-between items-end mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <History className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black ${textColor}`}>Your Recent Activity</h3>
                    <p className={subTextColor}>Your history and contribution</p>
                  </div>
                </div>
                <button className="text-xs font-black uppercase tracking-widest text-purple-500 hover:underline">Full History</button>
              </div>

              <div className="space-y-3">
                {[
                  { target: 'Hanoi University of Science', type: 'Duel Vote', time: '2 hours ago', impact: '+15 Karma' },
                  { target: 'FPT University', type: 'Event Participation', time: 'Yesterday', impact: '+50 Karma' },
                  { target: 'National Economics University', type: 'Duel Vote', time: '3 days ago', impact: '+12 Karma' },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-zinc-50'} border border-transparent hover:border-purple-500/20 transition-all`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <School className="w-6 h-6" />
                      </div>
                      <div>
                        <p className={`font-bold ${textColor}`}>You voted for <span className="text-purple-500">{item.target}</span></p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-zinc-500/10 rounded opacity-60 tracking-widest">{item.type}</span>
                          <span className="text-[10px] opacity-40 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-500 font-black text-sm">{item.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative rounded-3xl p-10 overflow-hidden bg-purple-600 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
                <h2 className="text-4xl font-black leading-tight">Represent your University</h2>
                <p className="text-purple-100 opacity-90">Verify your student email to make your votes count more and climb your university's internal contributor leaderboard.</p>
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