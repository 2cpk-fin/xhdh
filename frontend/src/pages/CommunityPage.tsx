import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Trophy, Heart, Share2, Shield, School, History, Sparkles } from 'lucide-react';
import SpaceBackground from '../components/SpaceBackground';

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
  // Standardizing the glass look
  const cardBg = isDark 
    ? 'bg-[#121212]/70 backdrop-blur-xl border-white/10 shadow-2xl' 
    : 'bg-white/80 backdrop-blur-md border-zinc-200 shadow-xl shadow-blue-500/5';
    
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="relative w-full max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Space Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SpaceBackground showPlanet={false} />
      </div>

      <div className="relative z-10 space-y-10">
        {/* Hero Section */}
        <div className={`${cardBg} rounded-[3rem] p-12 border-2 relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="p-6 bg-purple-600 rounded-[2.5rem] shadow-xl shadow-purple-500/20 rotate-3 group-hover:rotate-0 transition-transform">
              <Users className="w-14 h-14 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className={`text-6xl font-black tracking-tighter ${textColor} mb-2`}>
                Vietnam <span className="text-purple-500">Community</span>
              </h1>
              <p className={`${subTextColor} font-bold text-xl`}>Connect with fellow students and rank your institution.</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'VN Universities', val: '450+', icon: School, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Active Users', val: '12.8k', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Verified Students', val: '8.2k', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' }
          ].map((stat, i) => (
            <div key={i} className={`${cardBg} p-8 rounded-3xl border flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-default`}>
              <div className={`p-4 ${stat.bg} rounded-2xl ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className={`text-4xl font-black ${textColor}`}>{stat.val}</p>
                <p className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Discussion Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-4">
              <h3 className={`text-2xl font-black uppercase tracking-tight flex items-center gap-3 ${textColor}`}>
                <MessageSquare className="w-6 h-6 text-purple-500" />
                Discussion Feed
              </h3>
              <button className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all">
                New Post
              </button>
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((post) => (
                <div key={post} className={`${cardBg} p-8 rounded-[2.5rem] border hover:border-purple-500/40 transition-all group cursor-pointer`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                        S{post}
                      </div>
                      <div>
                        <p className={`font-black text-base ${textColor}`}>Student_Username_{post}</p>
                        <p className="text-[10px] opacity-50 font-black uppercase tracking-widest">Hanoi University of Science • {post}h ago</p>
                      </div>
                    </div>
                    <Share2 className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className={`text-base leading-relaxed ${subTextColor} font-medium italic mb-6`}>
                    "Does anyone have insights about the updated facility ranking criteria for the Summer 2026 event? My university recently upgraded the AI Lab..."
                  </p>
                  <div className="flex gap-8 pt-6 border-t border-white/5">
                    <button className="flex items-center gap-2 text-xs font-black opacity-40 hover:text-red-500 hover:opacity-100 transition-all">
                      <Heart className="w-5 h-5" /> 42
                    </button>
                    <button className="flex items-center gap-2 text-xs font-black opacity-40 hover:text-purple-500 hover:opacity-100 transition-all">
                      <MessageSquare className="w-5 h-5" /> 15
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className={`${cardBg} p-8 rounded-[2.5rem] border shadow-2xl`}>
              <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-7 h-7 text-yellow-500 drop-shadow-lg" />
                <h3 className={`text-xl font-black uppercase tracking-tighter ${textColor}`}>Top VN Unis</h3>
              </div>

              <div className="space-y-6">
                {[
                  { name: 'HUST', points: '2,450', color: 'bg-red-600' },
                  { name: 'FPTU', points: '2,380', color: 'bg-orange-600' },
                  { name: 'NEU', points: '2,310', color: 'bg-red-500' },
                  { name: 'UET', points: '2,290', color: 'bg-blue-600' } // Updated for your school!
                ].map((uni, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <span className={`font-black text-sm ${index === 0 ? 'text-yellow-500' : 'opacity-20'}`}>#0{index + 1}</span>
                      <div className={`w-10 h-10 rounded-xl ${uni.color} flex items-center justify-center text-[10px] font-black text-white shadow-lg`}>
                        {uni.name}
                      </div>
                      <span className={`font-black text-sm ${textColor}`}>{uni.name}</span>
                    </div>
                    <span className="text-[11px] font-black font-mono text-purple-500 uppercase tracking-widest">{uni.points}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/leaderboard"
                className="w-full py-4 mt-10 bg-purple-600 text-white flex items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-500 transition-all shadow-xl shadow-purple-500/20 active:scale-95"
              >
                View Leaderboard <History className="w-4 h-4" />
              </Link>
            </div>

            <div className={`${cardBg} p-8 rounded-[2.5rem] border overflow-hidden relative group`}>
              <Sparkles className="absolute top-4 right-4 w-5 h-5 text-blue-500 opacity-20 group-hover:animate-pulse" />
              <h4 className={`text-xs font-black uppercase tracking-widest text-blue-500 mb-4`}>Regional Tip</h4>
              <p className="text-[11px] font-bold leading-relaxed opacity-60 italic">
                Participating in local events increases your university's regional visibility and helps attract verified alumni to join the discussion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;