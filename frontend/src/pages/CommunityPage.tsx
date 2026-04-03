import { Link } from 'react-router-dom';
import { Users, MessageSquare, Trophy, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const CommunityPage = () => (
  <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
    <Sidebar />
    <main className="flex-1 p-10 flex justify-center">
      <div className="max-w-4xl w-full bg-[var(--bg)] border border-[var(--divider)] rounded-3xl p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Users className="w-10 h-10 text-[var(--accent-green)]" />
          <h1 className="text-4xl font-black">Community</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-8 rounded-3xl bg-purple-500/5 border border-purple-500/20 text-center">
            <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Global Chat</h3>
            <p className="text-sm opacity-60 mb-4">Connect with other players worldwide.</p>
            <span className="text-xs font-black text-purple-500 uppercase">Coming Soon</span>
          </div>
          
          <div className="p-8 rounded-3xl bg-yellow-500/5 border border-yellow-500/20 text-center">
            <Trophy className="w-12 h-12 text-[var(--trophy-yellow)] mx-auto mb-4" />
            <h3 className="text-xl font-bold">Leaderboards</h3>
            <p className="text-sm opacity-60 mb-4">See who is dominating the rankings.</p>
            <span className="text-xs font-black text-[var(--trophy-yellow)] uppercase">View Top 100</span>
          </div>
        </div>

        <Link to="/home" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--highlight)] text-white rounded-xl font-bold hover:opacity-90">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </main>
  </div>
);

export default CommunityPage;