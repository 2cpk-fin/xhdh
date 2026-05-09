import { useState, useEffect } from 'react';
import userApi from '../../../api/userApi';
import { Loader2, UserX, LayoutDashboard, History, MessageSquare, Settings } from 'lucide-react';
import type { UserResponse } from '../../../types/user';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import NavBar from '../../../components/NavBar';
import ProfileBox from './ProfileBox';
import ProfileConfigBox from './ProfileConfigBox';

// Mock data placeholders for your upcoming features
const MOCK_STATS = { totalVotes: 1240, rank: 42, points: 8900 };

const ProfilePage = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'comments' | 'settings'>('overview');

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem('refreshToken');
            if (!token) { window.location.href = '/login'; return; }
            try {
                const data = await userApi.getUserByRefreshToken(token);
                setUser(data);
            } catch (err) { window.location.href = '/login'; } finally { setLoading(false); }
        };
        loadProfile();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-300">
            <Header />
            <div className="flex flex-1">
                <NavBar />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-purple)]" />
                </main>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex flex-col font-sans antialiased text-[var(--text-primary)] transition-colors duration-300">
            <Header />
            <div className="flex flex-1">
                <NavBar />
                <main className="flex-grow ml-64 p-8">
                    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {user ? (
                            <>
                                {/* Public Header */}
                                <ProfileBox user={user} />

                                {/* Tab Navigation */}
                                <div className="flex items-center gap-2 p-1 bg-[var(--bg-side)] border border-[var(--border-color)] rounded-2xl w-fit">
                                    <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} label="Overview" />
                                    <TabBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={18} />} label="Voting History" />
                                    <TabBtn active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} icon={<MessageSquare size={18} />} label="Comments" />
                                    <TabBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Settings" />
                                </div>

                                {/* Content Area */}
                                <div className="min-h-[400px]">
                                    {activeTab === 'overview' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <StatCard label="Total Votes" value={MOCK_STATS.totalVotes} color="#c026d3" />
                                            <StatCard label="Global Rank" value={`#${MOCK_STATS.rank}`} color="#06b6d4" />
                                            <StatCard label="Reputation" value={MOCK_STATS.points} color="#10b981" />
                                            <div className="md:col-span-3 h-64 bg-[var(--bg-side)] border border-[var(--border-color)] rounded-[2.5rem] flex items-center justify-center opacity-30 italic">
                                                Voting Trend Graph Coming Soon...
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'history' && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-black">Recent Matches</h3>
                                            <div className="bg-[var(--bg-side)] border border-[var(--border-color)] rounded-3xl p-10 text-center opacity-40">
                                                No voting history found.
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'comments' && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-black">Comment Thread</h3>
                                            <div className="bg-[var(--bg-side)] border border-[var(--border-color)] rounded-3xl p-10 text-center opacity-40">
                                                You haven't commented on any universities yet.
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'settings' && (
                                        <ProfileConfigBox user={user} onUserUpdate={setUser} />
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center mt-20"><UserX size={48} className="text-red-500 opacity-20" /></div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

// Sub-components for a cleaner layout
const TabBtn = ({ active, onClick, icon, label }: any) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-lg' : 'hover:bg-[var(--text-primary)]/5 opacity-50 hover:opacity-100'}`}>
        {icon} <span>{label}</span>
    </button>
);

const StatCard = ({ label, value, color }: any) => (
    <div className="bg-[var(--bg-side)] border border-[var(--border-color)] p-6 rounded-[2rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:scale-150 transition-transform duration-700" style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />
        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-2">{label}</p>
        <p className="text-4xl font-black" style={{ color }}>{value}</p>
    </div>
);

export default ProfilePage;