import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Gamepad2, Sparkles, Trophy, Target, Zap, ChevronRight, BookOpen, BarChart3, Star } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 p-10 overflow-y-auto ${bgMain}`}>
          <div className="max-w-5xl mx-auto space-y-12">
            
            <header>
              <h1 className={`text-5xl font-black tracking-tight ${textColor}`}>Play & Evaluate</h1>
              <p className={`mt-2 text-lg font-medium ${subTextColor}`}>Compare universities and test your academic knowledge.</p>
            </header>

            <div className="grid gap-8 sm:grid-cols-2">
              <Link
                to="/duel"
                className={`group rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-2 ${cardBg} hover:border-purple-500/50`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Gamepad2 className="h-6 w-6 text-purple-500" />
                  <h2 className={`text-2xl font-bold ${textColor}`}>Duel Mode</h2>
                </div>
                <p className={`mb-4 ${subTextColor}`}>
                  Compare two universities head-to-head based on real student data and rankings.
                </p>
                <span className="font-bold text-purple-500 flex items-center gap-2 group-hover:gap-4 transition-all">
                  Start Duel <span>→</span>
                </span>
              </Link>

              <Link
                to="/event"
                className={`group rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-2 ${cardBg} hover:border-green-500/50`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-6 w-6 text-green-500" />
                  <h2 className={`text-2xl font-bold ${textColor}`}>Event Mode</h2>
                </div>
                <p className={`mb-4 ${subTextColor}`}>
                  Join special scholarship quizzes and community-wide university evaluation events.
                </p>
                <span className="font-bold text-green-500 flex items-center gap-2 group-hover:gap-4 transition-all">
                  Join Event <span>→</span>
                </span>
              </Link>
            </div>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-2xl font-black ${textColor} flex items-center gap-2`}>
                   <BookOpen className="w-6 h-6 text-purple-500" /> Featured Quests
                </h3>
              </div>
              <div className="grid gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className={`flex items-center justify-between p-6 rounded-2xl border ${cardBg} hover:border-purple-500/30 transition-colors`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-xl">
                        <Target className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${textColor}`}>University Expert Quiz {i}</h4>
                        <p className="text-sm opacity-60">Identify top-tier schools by their campus photos and alumni.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-yellow-500">+100 Karma</div>
                      <div className="text-xs opacity-50">15 Questions</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8">
              <div className={`md:col-span-2 p-8 rounded-3xl border ${cardBg}`}>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h3 className={`text-xl font-bold ${textColor}`}>Top Contributors</h3>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((rank) => (
                    <div key={rank} className="flex items-center justify-between py-2 border-b border-zinc-500/10 last:border-0">
                      <div className="flex items-center gap-4">
                        <span className={`w-6 text-lg font-black ${rank === 1 ? 'text-yellow-500' : 'opacity-30'}`}>{rank}</span>
                        <div className="w-8 h-8 rounded-full bg-zinc-500/20" />
                        <div>
                          <p className="font-bold text-sm">Student_Reviewer_{rank}</p>
                          <p className="text-[10px] opacity-50 uppercase">Hanoi University of Science</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                         <Star className="w-3 h-3 text-purple-500 fill-purple-500" />
                         <span className="font-mono text-sm font-bold">{(4 - rank) * 12} Reviews</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-8 rounded-3xl border ${cardBg} bg-gradient-to-br from-purple-500/5 to-transparent`}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <h3 className={`text-xl font-bold ${textColor}`}>Quick Guide</h3>
                </div>
                <ul className="space-y-4">
                  <li className="text-sm opacity-70 leading-relaxed">• Use Duel Mode to decide between two similar universities.</li>
                  <li className="text-sm opacity-70 leading-relaxed">• Completing Quests unlocks exclusive verified student reviews.</li>
                  <li className="text-sm opacity-70 leading-relaxed">• Top contributors receive special badges on their profile.</li>
                </ul>
                <button className="mt-8 w-full py-3 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
                  Learn More <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default PlayPage;