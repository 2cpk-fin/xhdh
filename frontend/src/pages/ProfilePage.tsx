import { Link } from 'react-router-dom';
import { UserCircle, Trophy, Medal, Star, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <main className="flex-1 p-10 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-[var(--bg)] border border-[var(--divider)] rounded-3xl p-10 shadow-2xl">
          <header className="flex items-center gap-6 mb-10">
            <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/20">
              <UserCircle className="w-20 h-20 text-[var(--highlight)]" />
            </div>
            <div>
              <h1 className="text-4xl font-black">User Profile</h1>
              <p className="text-purple-500 font-medium">Rank: Grandmaster</p>
            </div>
          </header>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-zinc-500/5 border border-[var(--divider)] text-center">
              <Trophy className="w-8 h-8 text-[var(--trophy-yellow)] mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs uppercase opacity-50">Wins</div>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-500/5 border border-[var(--divider)] text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">2,450</div>
              <div className="text-xs uppercase opacity-50">XP Points</div>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-500/5 border border-[var(--divider)] text-center">
              <Medal className="w-8 h-8 text-[var(--accent-green)] mx-auto mb-2" />
              <div className="text-2xl font-bold">#4</div>
              <div className="text-xs uppercase opacity-50">Global Rank</div>
            </div>
          </div>

          <Link to="/home" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--highlight)] text-white rounded-xl font-bold hover:opacity-90 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;