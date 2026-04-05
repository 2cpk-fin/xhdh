import { useEffect, useState } from 'react';
import {
  MessageCircle, Trophy, TrendingUp,
  ChevronRight, Hash, ShieldCheck,
  Flame, Zap
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CommunityPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

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

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
  const cardBg = isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const communities = [
    { name: 'Engineering & Tech', members: '12.4k', icon: Zap, color: 'text-blue-500' },
    { name: 'Economics & Business', members: '8.1k', icon: TrendingUp, color: 'text-emerald-500' },
    { name: 'HUST Official', members: '5.2k', icon: ShieldCheck, color: 'text-red-500' },
    { name: 'UET Community', members: '3.9k', icon: Hash, color: 'text-purple-500' },
  ];

  return (
      <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen text-left">
          <Header />
          <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto space-y-8">
              <header className="space-y-2">
                <h1 className={`text-4xl font-black tracking-tight ${textColor}`}>Community</h1>
                <p className={`text-base ${subTextColor}`}>Connect with peers from top universities across the globe.</p>
              </header>

              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  <section className={`border rounded-[2rem] p-8 ${cardBg} relative overflow-hidden group`}>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <h2 className={`text-2xl font-black ${textColor}`}>Global Discussion</h2>
                      </div>
                      <p className={`${subTextColor} font-medium leading-relaxed max-w-lg`}>
                        Real-time interaction with thousands of students. Share insights, ask questions, and grow together.
                      </p>
                      <button className="px-8 py-3 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-105 transition-all active:scale-95">
                        COMING SOON
                      </button>
                    </div>
                    <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                      <MessageCircle className="w-48 h-48 text-purple-500" />
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Recommended Groups</h3>
                      <button className="text-[10px] font-black text-purple-500 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {communities.map((group, i) => (
                          <div key={i} className={`p-6 rounded-[2rem] border-2 transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl cursor-pointer ${cardBg}`}>
                            <div className="flex items-start justify-between">
                              <div className="space-y-4">
                                <div className={`p-3 bg-zinc-500/5 rounded-2xl w-fit ${group.color}`}>
                                  <group.icon className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className={`font-bold text-sm ${textColor}`}>{group.name}</h4>
                                  <p className="text-[10px] font-black text-zinc-500 uppercase mt-1">{group.members} Members</p>
                                </div>
                              </div>
                              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`} />
                            </div>
                          </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <section className={`border rounded-[2rem] p-6 ${cardBg} bg-gradient-to-br from-amber-500/5 to-transparent`}>
                    <div className="flex items-center gap-3 mb-6">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <h3 className={`font-bold ${textColor}`}>Leaderboards</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { rank: 1, name: 'HUST', elo: 2450 },
                        { rank: 2, name: 'FTU', elo: 2380 },
                        { rank: 3, name: 'NEU', elo: 2310 }
                      ].map((uni, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-500/5 border border-zinc-500/5">
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-black ${i === 0 ? 'text-amber-500' : 'text-zinc-500'}`}>#{uni.rank}</span>
                              <span className={`text-xs font-bold ${textColor}`}>{uni.name}</span>
                            </div>
                            <span className="text-[10px] font-black text-purple-500 uppercase">{uni.elo} ELO</span>
                          </div>
                      ))}
                    </div>
                    <button className={`w-full mt-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
                      View Top 100
                    </button>
                  </section>

                  <section className={`border rounded-[2rem] p-6 ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <h3 className={`font-bold ${textColor}`}>Trending Topics</h3>
                    </div>
                    <div className="space-y-2">
                      {['#AcademicReview2026', '#EngineeringHackathon', '#UniversityELO'].map((tag) => (
                          <div key={tag} className={`text-xs font-bold py-2 px-3 rounded-lg hover:bg-purple-500/10 hover:text-purple-500 transition-all cursor-pointer ${subTextColor}`}>
                            {tag}
                          </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
  );
};

export default CommunityPage;