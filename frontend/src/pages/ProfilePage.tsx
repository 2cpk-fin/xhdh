import { useEffect, useState } from 'react';
import {
  MessageSquare, Star, GraduationCap, MapPin, Calendar,
  ThumbsUp, Quote, Award, ChevronRight, Camera,
  Link as LinkIcon, Globe, Trophy, User, ShieldCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = () => {
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
  const cardBg = isDark ? 'bg-[#000000] border-zinc-800' : 'bg-white border-zinc-200';
  const footerBg = isDark ? 'bg-[#0d0d0d] border-zinc-800' : 'bg-[#fcfcfc] border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
      <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen text-left">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto space-y-6">

              {/* Header Profile Section */}
              <section className={`border rounded-[2rem] overflow-hidden shadow-sm ${cardBg}`}>
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="relative group">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-4 border-purple-500/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                        <img
                            src={`https://ui-avatars.com/api/?name=Tester&background=6366f1&color=fff&size=256`}
                            className="w-full h-full object-cover"
                            alt="Avatar"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white w-8 h-8" />
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-2xl text-white shadow-lg border-4 border-black dark:border-black">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <div className="space-y-1">
                        <h1 className={`text-4xl font-black tracking-tight ${textColor}`}>Tester</h1>
                        <p className="text-purple-500 font-bold flex items-center justify-center md:justify-start gap-2">
                          <LinkIcon className="w-4 h-4" /> @testing1909
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm font-medium">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <GraduationCap className="w-4 h-4 text-purple-500" />
                          <span>Hanoi University of Science and Technology</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span>Hanoi, Vietnam</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span>Joined April 2026</span>
                        </div>
                      </div>

                      <div className="flex justify-center md:justify-start gap-3 pt-2">
                        <button className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/20">
                          Follow
                        </button>
                        <button className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${isDark ? 'border-zinc-800 hover:bg-zinc-900' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                          Message
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-6 rounded-3xl ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'} text-center border border-zinc-500/5`}>
                        <p className="text-3xl font-black text-purple-500">24</p>
                        <p className="text-[10px] uppercase font-black opacity-40 tracking-tighter">Reviews</p>
                      </div>
                      <div className={`p-6 rounded-3xl ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'} text-center border border-zinc-500/5`}>
                        <p className="text-3xl font-black text-purple-500">156</p>
                        <p className="text-[10px] uppercase font-black opacity-40 tracking-tighter">Helpful</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`px-10 py-4 border-t flex items-center gap-6 ${footerBg}`}>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider opacity-60">
                    <Globe className="w-3.5 h-3.5" /> Public Profile
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Online
                  </div>
                </div>
              </section>

              <div className="grid lg:grid-cols-12 gap-6">
                {/* Main Content - Reviews */}
                <div className="lg:col-span-8 space-y-6">
                  <section className={`border rounded-[2rem] p-8 shadow-sm ${cardBg}`}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                          <Quote className="w-5 h-5" />
                        </div>
                        <h2 className={`text-xl font-bold ${textColor}`}>Recent Reviews</h2>
                      </div>
                      <button className="text-xs font-bold text-purple-500 hover:underline">View All</button>
                    </div>

                    <div className="space-y-6">
                      {[1, 2].map((i) => (
                          <div key={i} className={`p-6 rounded-3xl border transition-all ${isDark ? 'bg-zinc-900/20 border-zinc-800' : 'bg-zinc-50 border-zinc-100'} hover:border-purple-500/30`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center font-black text-purple-500 text-xs">HUST</div>
                                <div>
                                  <h4 className={`font-bold text-sm ${textColor}`}>Hanoi University of Science and Technology</h4>
                                  <div className="flex gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-300'}`} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold uppercase ${subTextColor} opacity-60`}>2 days ago</span>
                            </div>
                            <p className={`text-sm leading-relaxed ${subTextColor} italic`}>
                              "The academic environment is extremely dynamic, but the pressure is also significant. Facilities are improving daily, especially the Ta Quang Buu library..."
                            </p>
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-500/10">
                              <div className="flex gap-6">
                                <button className="flex items-center gap-2 text-xs font-bold opacity-60 hover:text-purple-500 transition-colors">
                                  <ThumbsUp className="w-4 h-4" /> 12
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold opacity-60 hover:text-purple-500 transition-colors">
                                  <MessageSquare className="w-4 h-4" /> 3
                                </button>
                              </div>
                              <button className="text-[11px] font-black uppercase text-purple-500 flex items-center gap-1 group">
                                Details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar Content - Badges & Following */}
                <div className="lg:col-span-4 space-y-6">
                  <section className={`border rounded-[2rem] p-8 shadow-sm ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <h3 className={`font-bold ${textColor}`}>Achievements</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: Award, label: 'Top Contributor', color: 'text-yellow-500' },
                        { icon: ShieldCheck, label: 'Verified', color: 'text-blue-500' },
                        { icon: User, label: 'Early Adopter', color: 'text-emerald-500' },
                      ].map((badge, i) => (
                          <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center group relative cursor-help border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                            <badge.icon className={`w-8 h-8 ${badge.color}`} />
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-xl border border-white/10">
                              {badge.label}
                            </div>
                          </div>
                      ))}
                    </div>
                  </section>

                  <section className={`border rounded-[2rem] p-8 shadow-sm ${cardBg}`}>
                    <h3 className={`font-bold ${textColor} mb-6`}>Following Schools</h3>
                    <div className="space-y-3">
                      {['NEU - Economics', 'FPT University', 'RMIT Vietnam'].map((uni) => (
                          <div key={uni} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer ${isDark ? 'bg-zinc-900/30 border-zinc-800 hover:border-purple-500/50' : 'bg-zinc-50 border-zinc-100 hover:border-purple-500/30'}`}>
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center font-bold text-purple-500 text-[10px]">UNI</div>
                            <span className={`text-xs font-bold truncate ${textColor}`}>{uni}</span>
                          </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-zinc-500/30 text-xs font-bold opacity-60 hover:opacity-100 transition-all">
                      Find more schools
                    </button>
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

export default ProfilePage;