import { Users, MessageSquare, Trophy, Heart, Share2, Shield, Globe, GraduationCap } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const CommunityPage = () => (
  <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
    <Sidebar />
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-10 flex justify-center overflow-y-auto">
        <div className="max-w-5xl w-full space-y-10">
          
          <div className="bg-[var(--bg)] border border-[var(--divider)] rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-green-500/10 rounded-2xl">
                <Users className="w-10 h-10 text-[var(--accent-green)]" />
              </div>
              <div>
                <h1 className="text-4xl font-black">Community</h1>
                <p className="opacity-60 font-medium">Connect, compete, and grow with students worldwide.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group p-8 rounded-3xl bg-purple-500/5 border border-purple-500/20 text-center hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Global Chat</h3>
                <p className="text-sm opacity-60 mb-6 px-4">Join real-time conversations with other competitive students.</p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-xs font-black uppercase tracking-widest">
                  Coming Soon
                </div>
              </div>
              
              <div className="group p-8 rounded-3xl bg-yellow-500/5 border border-yellow-500/20 text-center hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8 text-[var(--trophy-yellow)]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Leaderboards</h3>
                <p className="text-sm opacity-60 mb-6 px-4">Track your university's progress on the global stage.</p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 text-[var(--trophy-yellow)] text-xs font-black uppercase tracking-widest">
                  View Top 100
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border border-[var(--divider)] bg-zinc-500/5 flex items-center gap-4`}>
              <Globe className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-black">142</p>
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Countries</p>
              </div>
            </div>
            <div className={`p-6 rounded-2xl border border-[var(--divider)] bg-zinc-500/5 flex items-center gap-4`}>
              <GraduationCap className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-black">2,840</p>
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Universities</p>
              </div>
            </div>
            <div className={`p-6 rounded-2xl border border-[var(--divider)] bg-zinc-500/5 flex items-center gap-4`}>
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-black">50k+</p>
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Verified Students</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-500" />
                Discussion Feed
              </h3>
              {[1, 2].map((post) => (
                <div key={post} className="p-6 rounded-3xl border border-[var(--divider)] bg-[var(--bg)] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                    <div>
                      <p className="font-bold text-sm">Alex_Academic_{post}</p>
                      <p className="text-[10px] opacity-40 uppercase font-black">Stanford University • 2h ago</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed opacity-80">
                    Does anyone have tips for the upcoming Logic & Algorithm event? I've been practicing Solo Mode but I'm struggling with the time constraints.
                  </p>
                  <div className="flex gap-6 pt-2">
                    <button className="flex items-center gap-2 text-xs font-bold opacity-60 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" /> 24
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold opacity-60 hover:text-purple-500 transition-colors">
                      <MessageSquare className="w-4 h-4" /> 12
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold opacity-60 hover:text-blue-500 transition-colors ml-auto">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight">Top Unis</h3>
              <div className="p-6 rounded-3xl border border-[var(--divider)] bg-zinc-500/5 space-y-6">
                {[
                  { name: 'MIT', points: '12,450', color: 'bg-red-500' },
                  { name: 'Oxford', points: '11,820', color: 'bg-blue-800' },
                  { name: 'Stanford', points: '11,200', color: 'bg-red-800' },
                  { name: 'Harvard', points: '10,950', color: 'bg-red-900' }
                ].map((uni, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-black opacity-20 w-4">{index + 1}</span>
                      <div className={`w-8 h-8 rounded-lg ${uni.color} flex items-center justify-center text-[10px] font-black text-white`}>
                        {uni.name.substring(0, 2)}
                      </div>
                      <span className="font-bold text-sm">{uni.name}</span>
                    </div>
                    <span className="text-xs font-mono font-black opacity-60">{uni.points}</span>
                  </div>
                ))}
                <button className="w-full py-3 mt-4 border border-purple-500/20 rounded-xl text-xs font-black uppercase tracking-widest text-purple-500 hover:bg-purple-500/5 transition-colors">
                  View Ranking
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
);

export default CommunityPage;