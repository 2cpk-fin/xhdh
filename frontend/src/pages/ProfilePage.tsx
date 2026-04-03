import { useEffect, useState } from 'react';
import { UserCircle, MessageSquare, Star, GraduationCap, MapPin, Calendar, ThumbsUp, Quote, Award, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ProfilePage = () => {
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

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 p-8 md:p-12 overflow-y-auto ${bgMain}`}>
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className={`${cardBg} rounded-[2.5rem] p-8 md:p-12 shadow-xl border relative overflow-hidden`}>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-500/20 p-2">
                  <div className="w-full h-full bg-zinc-500/10 rounded-full flex items-center justify-center">
                    <UserCircle className="w-24 h-24 md:w-32 md:h-32 text-purple-500" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <h1 className={`text-4xl font-black ${textColor}`}>Alex Nguyen</h1>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-widest rounded-full w-fit mx-auto md:mx-0">Verified Student</span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                    <div className="flex items-center gap-2 opacity-70">
                      <GraduationCap className="w-4 h-4 text-purple-500" />
                      <span>Hanoi University of Science and Technology</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-70">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>Hanoi, Vietnam</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-70">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>Joined April 2024</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="p-4 rounded-2xl bg-zinc-500/5 text-center">
                    <p className="text-2xl font-black text-purple-500">24</p>
                    <p className="text-[10px] uppercase font-black opacity-50">Reviews</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-500/5 text-center">
                    <p className="text-2xl font-black text-purple-500">156</p>
                    <p className="text-[10px] uppercase font-black opacity-50">Helpfuls</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-2xl font-black ${textColor} flex items-center gap-3`}>
                      <Quote className="w-6 h-6 text-purple-500" /> Recent Reviews
                    </h3>
                  </div>

                  {[1, 2].map((i) => (
                    <div key={i} className={`${cardBg} rounded-3xl p-6 border shadow-sm space-y-4 hover:border-purple-500/30 transition-all`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center font-bold text-purple-500 text-xs">HUST</div>
                          <div>
                            <h4 className="font-bold text-sm">Hanoi University of Science and Technology</h4>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-yellow-500 fill-yellow-500' : 'opacity-20'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold opacity-40 uppercase">2 days ago</span>
                      </div>
                      
                      <p className={`text-sm leading-relaxed opacity-80 italic`}>
                        "Môi trường học tập cực kỳ năng động nhưng áp lực học tập cũng rất lớn. Cơ sở vật chất đang ngày càng được cải thiện tốt hơn. Thích nhất là không khí tại thư viện Tạ Quang Bửu..."
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-500/10">
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1 text-xs opacity-50 hover:text-purple-500 transition-colors">
                            <ThumbsUp className="w-3 h-3" /> Helpful (12)
                          </button>
                          <button className="flex items-center gap-1 text-xs opacity-50 hover:text-purple-500 transition-colors">
                            <MessageSquare className="w-3 h-3" /> Comments (3)
                          </button>
                        </div>
                        <button className="text-[10px] font-black uppercase text-purple-500 flex items-center gap-1">
                          Full Review <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="space-y-6">
                  <h3 className={`text-2xl font-black ${textColor} flex items-center gap-3`}>
                    <MessageSquare className="w-6 h-6 text-purple-500" /> Community Comments
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((c) => (
                      <div key={c} className="p-5 rounded-2xl bg-zinc-500/5 border border-transparent hover:border-zinc-500/20 transition-all">
                        <p className="text-xs opacity-50 mb-2">Replied to <span className="font-bold text-purple-500">Top 10 Engineering Schools</span></p>
                        <p className="text-sm font-medium opacity-80">"Hoàn toàn đồng ý với bảng xếp hạng này, tuy nhiên mình nghĩ nên xem xét thêm về tiêu chí đầu ra việc làm..."</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section className={`${cardBg} rounded-[2rem] p-8 border shadow-sm`}>
                  <h3 className="font-black text-lg mb-6 uppercase tracking-widest text-purple-500">Badges</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Award, label: 'Top Reviewer', color: 'text-yellow-500' },
                      { icon: Star, label: 'Trusted', color: 'text-blue-500' },
                      { icon: MessageSquare, label: 'Helper', color: 'text-green-500' },
                    ].map((badge, i) => (
                      <div key={i} className="aspect-square bg-zinc-500/5 rounded-2xl flex items-center justify-center group relative cursor-help">
                        <badge.icon className={`w-8 h-8 ${badge.color}`} />
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                          {badge.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className={`${cardBg} rounded-[2rem] p-8 border shadow-sm`}>
                  <h3 className="font-black text-lg mb-6 uppercase tracking-widest text-purple-500">Following Schools</h3>
                  <div className="space-y-4">
                    {['National Economics University', 'FPT University', 'RMIT Vietnam'].map((uni) => (
                      <div key={uni} className="flex items-center gap-3 p-2 hover:bg-zinc-500/5 rounded-xl transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-zinc-500/20 flex-shrink-0" />
                        <span className="text-xs font-bold truncate">{uni}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;