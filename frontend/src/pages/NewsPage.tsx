import { Link } from 'react-router-dom';
import { Newspaper, Bell, ArrowLeft } from 'lucide-react';

const NewsPage = () => (
  <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
    <main className="flex-1 p-10 flex justify-center">
      <div className="max-w-4xl w-full bg-[var(--bg)] border border-[var(--divider)] rounded-3xl p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Newspaper className="w-10 h-10 text-purple-500" />
          <h1 className="text-4xl font-black">Latest News</h1>
        </div>

        <div className="space-y-4 mb-10">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-zinc-500/5 border border-[var(--divider)] hover:border-purple-500/50 transition-all cursor-pointer">
              <div className="flex items-center gap-2 text-[var(--accent-green)] text-xs font-bold uppercase mb-2">
                <Bell className="w-3 h-3" /> Update v1.0.{i}
              </div>
              <h3 className="text-xl font-bold mb-1">New Tournament Season Starting!</h3>
              <p className="opacity-60 text-sm">Get ready to compete for the gold trophy this weekend.</p>
            </div>
          ))}
        </div>

        <Link to="/home" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--highlight)] text-white rounded-xl font-bold hover:opacity-90">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </main>
  </div>
);

export default NewsPage;