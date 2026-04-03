import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Trophy, Heart, Share2, Shield, School, History } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CommunityPage = () => {
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

  return (
      <div className={`min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className={`flex-1 p-10 flex justify-center overflow-y-auto ${bgMain}`}>
            <div className="max-w-6xl w-full space-y-10">

              {/* Hero Section */}
              <div className={`${cardBg} rounded-[2.5rem] p-10 border relative overflow-hidden`}>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="p-5 bg-purple-500/10 rounded-[2rem] border border-purple-500/20">
                    <Users className="w-12 h-12 text-purple-500" />
                  </div>
                  <div>
                    <h1 className={`text-5xl font-black tracking-tighter ${textColor}`}>Vietnam Community</h1>
                    <p className={`${subTextColor} font-medium text-lg mt-2`}>Connect with fellow students across the nation and rank your institution.</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats: VN Focused */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${cardBg} p-8 rounded-3xl border flex items-center gap-5 shadow-lg`}>
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                    <School className="w-8 h-8" />
                  </div>
                  <div>
                    <p className={`text-3xl font-black ${textColor}`}>450+</p>
                    <p className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em]">VN Universities</p>
                  </div>
                </div>
                <div className={`${cardBg} p-8 rounded-3xl border flex items-center gap-5 shadow-lg`}>
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <p className={`text-3xl font-black ${textColor}`}>12.8k</p>
                    <p className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em]">Active Users</p>
                  </div>
                </div>
                <div className={`${cardBg} p-8 rounded-3xl border flex items-center gap-5 shadow-lg`}>
                  <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <p className={`text-3xl font-black ${textColor}`}>8.2k</p>
                    <p className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em]">Verified Students</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Discussion Feed */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-2xl font-black uppercase tracking-tight flex items-center gap-3 ${textColor}`}>
                      <MessageSquare className="w-6 h-6 text-purple-500" />
                      Discussion Feed
                    </h3>
                    <button className="text-xs font-black uppercase tracking-widest text-purple-500 hover:underline">New Post</button>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((post) => (
                        <div key={post} className={`${cardBg} p-8 rounded-[2rem] border hover:border-purple-500/30 transition-all group cursor-pointer`}>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black">
                                S{post}
                              </div>
                              <div>
                                <p className={`font-black text-sm ${textColor}`}>Student_Username_{post}</p>
                                <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Hanoi University of Science • {post}h ago</p>
                              </div>
                            </div>
                            <Share2 className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className={`text-sm leading-relaxed ${subTextColor} font-medium italic`}>
                            "Does anyone have insights about the updated facility ranking criteria for the Summer 2026 event? My university recently upgraded the AI Lab..."
                          </p>
                          <div className="flex gap-6 pt-6 mt-6 border-t border-zinc-500/10">
                            <button className="flex items-center gap-2 text-xs font-black opacity-40 hover:text-red-500 hover:opacity-100 transition-all">
                              <Heart className="w-4 h-4" /> 42
                            </button>
                            <button className="flex items-center gap-2 text-xs font-black opacity-40 hover:text-purple-500 hover:opacity-100 transition-all">
                              <MessageSquare className="w-4 h-4" /> 15
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar: Top VN Unis & Leaderboard Link */}
                <div className="space-y-8">
                  <div className={`${cardBg} p-8 rounded-[2rem] border shadow-xl`}>
                    <div className="flex items-center gap-3 mb-8">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <h3 className={`text-xl font-black uppercase tracking-tighter ${textColor}`}>Top VN Unis</h3>
                    </div>

                    <div className="space-y-6">
                      {[
                        { name: 'HUST', points: '2,450', color: 'bg-blue-600' },
                        { name: 'FPTU', points: '2,380', color: 'bg-orange-600' },
                        { name: 'NEU', points: '2,310', color: 'bg-red-600' },
                        { name: 'RMIT', points: '2,290', color: 'bg-red-800' }
                      ].map((uni, index) => (
                          <div key={index} className="flex items-center justify-between group cursor-help">
                            <div className="flex items-center gap-4">
                              <span className={`font-black w-4 text-xs ${index === 0 ? 'text-yellow-500' : 'opacity-20'}`}>0{index + 1}</span>
                              <div className={`w-10 h-10 rounded-xl ${uni.color} flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-black/5`}>
                                {uni.name}
                              </div>
                              <span className={`font-bold text-sm ${textColor}`}>{uni.name}</span>
                            </div>
                            <span className="text-[10px] font-black font-mono opacity-50 uppercase tracking-widest">{uni.points} ELO</span>
                          </div>
                      ))}
                    </div>

                    <Link
                        to="/leaderboard"
                        className="w-full py-4 mt-10 bg-purple-500 text-white flex items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-xl shadow-purple-500/20 active:scale-95"
                    >
                      View Leaderboard <History className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className={`${cardBg} p-8 rounded-[2rem] border bg-gradient-to-br from-blue-500/5 to-transparent`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest text-blue-500 mb-4`}>Regional Tip</h4>
                    <p className="text-[10px] font-medium leading-relaxed opacity-60">
                      Participating in local events increases your university's regional visibility and helps attracted verified alumni to join the discussion.
                    </p>
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

export default CommunityPage;