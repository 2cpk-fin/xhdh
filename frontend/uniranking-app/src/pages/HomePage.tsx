import { Link } from 'react-router-dom';
import { Swords, CalendarDays, Trophy, TrendingUp, Users, ArrowRight, Zap } from 'lucide-react';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavBoxProps {
    title: string;
    description: string;
    to: string;
    icon: React.ReactNode;
    accent: string;
    badge?: string;
}

// ─── NavBox Card ──────────────────────────────────────────────────────────────

const NavBox = ({ title, description, to, icon, accent, badge }: NavBoxProps) => {
    return (
        <Link
            to={to}
            className="group relative flex flex-col gap-4 p-6 bg-white/70 backdrop-blur-sm border border-zinc-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-zinc-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
        >
            {/* Subtle hover glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 20% 50%, ${accent}10 0%, transparent 65%)` }}
            />

            <div className="flex items-start justify-between">
                {/* Icon */}
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm border"
                    style={{ background: `${accent}15`, borderColor: `${accent}30`, color: accent }}
                >
                    {icon}
                </div>

                {badge && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border"
                        style={{ color: accent, background: `${accent}10`, borderColor: `${accent}25` }}>
                        {badge}
                    </span>
                )}
            </div>

            <div className="flex-1">
                <h3 className="text-base font-black text-zinc-900 mb-1.5 group-hover:text-zinc-700 transition-colors">
                    {title}
                </h3>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider transition-all duration-200"
                style={{ color: accent }}>
                <span>Go to {title}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
        </Link>
    );
};

// ─── Stat Pill ────────────────────────────────────────────────────────────────

const StatPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/70 backdrop-blur-sm border border-zinc-200 rounded-xl shadow-sm">
        <div className="text-purple-500">{icon}</div>
        <div>
            <p className="text-base font-black text-zinc-900 leading-none">{value}</p>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">{label}</p>
        </div>
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50/80 antialiased">
            <Header />

            <div className="flex flex-1">
                <NavBar />

                <main className="flex-1 ml-64 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="flex-grow px-8 py-10 max-w-5xl w-full mx-auto">

                        {/* ── Hero ─────────────────────────────────────── */}
                        <div className="mb-10">
                            {/* Label */}
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-purple-500">
                                    Dashboard
                                </span>
                            </div>

                            <h1 className="text-4xl font-black tracking-tight text-zinc-900 leading-tight mb-3">
                                Welcome to{' '}
                                <span className="text-purple-600">UniRanking</span>
                            </h1>
                            <p className="text-sm font-medium text-zinc-500 max-w-lg leading-relaxed">
                                The competitive platform where universities battle for supremacy. Vote, rank, and watch the global leaderboard shift in real time.
                            </p>

                            {/* Stats row */}
                            <div className="flex flex-wrap gap-3 mt-6">
                                <StatPill icon={<Trophy className="w-4 h-4" />} value="2,400+" label="Universities" />
                                <StatPill icon={<TrendingUp className="w-4 h-4" />} value="18K" label="Matches Played" />
                                <StatPill icon={<Users className="w-4 h-4" />} value="5.2K" label="Active Voters" />
                            </div>
                        </div>

                        {/* ── Divider ───────────────────────────────────── */}
                        <div className="flex items-center gap-3 mb-6">
                            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Quick Access</p>
                            <div className="flex-1 h-px bg-zinc-200" />
                        </div>

                        {/* ── Feature Grid ─────────────────────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <NavBox
                                to="/solo"
                                title="Solo Match Arena"
                                description="Pit two universities against each other in a 1v1 duel and vote for the winner to shift their Elo ratings."
                                icon={<Swords className="w-5 h-5" />}
                                accent="#9333ea"
                                badge="Live"
                            />
                            <NavBox
                                to="/schedule"
                                title="Schedule Match"
                                description="Set up voting rounds for multiple universities and manage bracket-style competitions."
                                icon={<CalendarDays className="w-5 h-5" />}
                                accent="#0ea5e9"
                            />
                        </div>

                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default HomePage;