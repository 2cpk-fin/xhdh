import { Newspaper, Bell, TrendingUp, Mail, ArrowRight, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NewsPage = () => (
  <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
    <Sidebar />
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-10 flex justify-center overflow-y-auto">
        <div className="max-w-5xl w-full space-y-10">
          
          <div className="relative overflow-hidden rounded-3xl bg-purple-600 p-10 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4 px-3 py-1 bg-white/20 w-fit rounded-full text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="w-4 h-4" /> Top News
              </div>
              <h2 className="text-4xl font-black mb-4 leading-tight">The 2026 Global University Championships Begin Next Month</h2>
              <p className="text-purple-100 mb-6 text-lg opacity-90">Registration is now open for all verified students. Win scholarships and international recognition.</p>
              <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-transform">
                Read Full Article <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <Newspaper className="w-8 h-8 text-purple-500" />
                <h1 className="text-3xl font-black uppercase tracking-tight">Recent Updates</h1>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-zinc-500/5 border border-[var(--divider)] hover:border-purple-500/50 transition-all cursor-pointer hover:-translate-y-1 duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-[var(--accent-green)] text-xs font-bold uppercase">
                        <Bell className="w-3 h-3" /> Update v1.0.{i}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] opacity-40 font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3" /> April {i}, 2026
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-500 transition-colors">New Tournament Season Starting!</h3>
                    <p className="opacity-60 text-sm leading-relaxed">Prepare your team for the upcoming regional qualifiers starting this weekend. Exclusive rewards await the top 10 universities.</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-8 rounded-3xl border border-[var(--divider)] bg-zinc-500/5">
                <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-purple-500">Trending Topics</h3>
                <ul className="space-y-6">
                  {['#Rankings2026', '#DuelMasterTips', '#UniversityPride', '#PatchNotes'].map((tag, idx) => (
                    <li key={idx} className="flex flex-col gap-1 cursor-pointer hover:translate-x-1 transition-transform">
                      <span className="font-bold text-sm">{tag}</span>
                      <span className="text-[10px] opacity-40 uppercase font-black">{idx * 1.2 + 2}k posts today</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-center space-y-4 shadow-xl">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Newsletter</h3>
                <p className="text-xs opacity-80">Get the latest news and patch notes directly in your inbox.</p>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/50 text-sm focus:outline-none focus:bg-white/20"
                />
                <button className="w-full py-3 bg-white text-purple-600 rounded-xl font-black text-sm hover:shadow-lg transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </div>
);

export default NewsPage;