import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Gamepad2, Sparkles, Zap, ChevronRight, BarChart3, Quote, ThumbsUp } from 'lucide-react';
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
                <p className={`mt-2 text-lg font-medium ${subTextColor}`}>Engage with the community and compare top-tier institutions.</p>
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

              <section className="grid md:grid-cols-3 gap-8">
                <div className={`md:col-span-2 p-8 rounded-3xl border ${cardBg} shadow-xl`}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-6 h-6 text-blue-500" />
                      <h3 className={`text-xl font-bold ${textColor}`}>Top Reviews Today</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Live Updates</span>
                  </div>

                  <div className="space-y-6">
                    {[
                      { author: "Academic_Pro", school: "Hanoi University of Science", likes: 124, text: "The new research lab facilities are absolutely world-class..." },
                      { author: "Student_Reviewer_2", school: "FPT University", likes: 89, text: "Industry connections here provide a huge advantage for internships..." },
                      { author: "Uni_Explorer", school: "NEU", likes: 56, text: "The vibrant campus life makes every day an adventure..." }
                    ].map((review, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-zinc-800' : 'bg-zinc-50 border-zinc-100'} hover:border-purple-500/20 transition-all`}>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <Quote className="w-4 h-4 text-purple-500" />
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${textColor}`}>{review.author}</p>
                                <p className="text-[10px] font-medium text-purple-500 uppercase">{review.school}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-lg">
                              <ThumbsUp className="w-3 h-3 text-green-500" />
                              <span className="text-[10px] font-black text-green-500">{review.likes}</span>
                            </div>
                          </div>
                          <p className={`text-xs leading-relaxed ${subTextColor} italic line-clamp-2`}>
                            "{review.text}"
                          </p>
                        </div>
                    ))}
                  </div>
                </div>

                <div className={`p-8 rounded-3xl border ${cardBg} bg-gradient-to-br from-purple-500/5 to-transparent h-fit`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <h3 className={`text-xl font-bold ${textColor}`}>Quick Guide</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="text-sm opacity-70 leading-relaxed">• Use Duel Mode to decide between two similar universities.</li>
                    <li className="text-sm opacity-70 leading-relaxed">• High-quality reviews boost your community standing.</li>
                    <li className="text-sm opacity-70 leading-relaxed">• Participating in events earns you exclusive profile badges.</li>
                  </ul>
                  <button className="mt-8 w-full py-3 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
                    Full Community Guide <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </section>

            </div>
          </main>
          <Footer />
        </div>
      </div>
  );
};

export default PlayPage;