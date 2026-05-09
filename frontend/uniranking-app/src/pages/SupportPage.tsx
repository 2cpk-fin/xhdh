import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Coins, HeartCrack, Rocket, Ghost, Search, ArrowLeft } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const SupportPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { isDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const neonPurple = '#c026d3';

    return (
        <div className="min-h-screen antialiased transition-colors duration-700 bg-[var(--bg-main)] pt-24 px-6 pb-20 flex flex-col items-center relative">

            {/* Back Button - Top Left */}
            <button
                onClick={() => navigate('/home')}
                className="fixed top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 active:scale-95 z-50
                bg-[var(--bg-side)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#c026d3] group shadow-lg shadow-black/5"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-black uppercase tracking-widest">Back</span>
            </button>

            {/* Hero Section */}
            <div className="max-w-3xl w-full text-center mb-16 relative">
                {isDarkMode && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/10 blur-[100px] pointer-events-none" />
                )}

                <div className="inline-flex p-4 rounded-3xl mb-6 animate-bounce border"
                    style={{
                        background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                        borderColor: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444'
                    }}>
                    <HeartCrack size={40} />
                </div>

                <h1 className="text-5xl font-black text-[var(--text-primary)] tracking-tighter mb-4">
                    Support <span style={{ color: neonPurple, textShadow: isDarkMode ? `0 0 20px ${neonPurple}66` : 'none' }}>Me?</span>
                </h1>
                <p className="text-[var(--text-primary)] opacity-70 text-lg font-medium max-w-xl mx-auto">
                    Honestly, the developer is currently running on instant noodles and pure hope.
                    Your support is my only chance to survive this internship.
                </p>
            </div>

            {/* Search Section */}
            <div className="w-full max-w-2xl mb-16">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for answers we don't have..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-6 pl-14 rounded-[2rem] text-sm font-bold border transition-all
                        bg-[var(--bg-side)] border-[var(--border-color)] text-[var(--text-primary)]
                        focus:outline-none focus:border-[#c026d3] shadow-sm"
                    />
                    <Search className="absolute left-6 top-6 opacity-40 text-[var(--text-primary)]" />

                    {searchQuery && (
                        <div className="mt-4 p-6 rounded-3xl text-sm font-bold flex items-center gap-3 border
                            bg-[var(--bg-side)] border-[var(--border-color)] text-[var(--text-primary)] opacity-80">
                            <Ghost className="text-[#c026d3]" />
                            <span>"404 Hope Not Found. Stop searching and start donating."</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Grid */}
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                <div className="p-8 rounded-[2.5rem] border bg-[var(--bg-side)] border-[var(--border-color)] transition-all hover:scale-[1.02]">
                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Rocket className="text-blue-500" /> Fast Rankings?
                    </h3>
                    <p className="text-sm font-medium text-[var(--text-primary)] opacity-70 leading-relaxed">
                        If you want the global rankings to update faster, understand that server electricity isn't free. My bank account is currently $0.02.
                    </p>
                </div>

                <div className="p-8 rounded-[2.5rem] border bg-[var(--bg-side)] border-[var(--border-color)] transition-all hover:scale-[1.02]">
                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Coffee className="text-amber-600" /> Bug Report?
                    </h3>
                    <p className="text-sm font-medium text-[var(--text-primary)] opacity-70 leading-relaxed">
                        I call them "Surprise Features". If you hate them, 1 cup of coffee = 1 bug fixed (maybe).
                    </p>
                </div>
            </div>

            {/* Donation Card */}
            <div className="w-full max-w-2xl p-px rounded-[3rem] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-2xl">
                <div className="bg-[var(--bg-main)] rounded-[2.9rem] p-10 text-center">
                    <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2">Emergency Fund</h2>
                    <p className="text-[var(--text-primary)] opacity-60 font-bold mb-8">
                        Current Hunger Level: <span className="text-red-500 animate-pulse">CRITICAL</span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {[5, 10, 50, 100].map(amount => (
                            <button
                                key={amount}
                                onClick={() => alert("My bank account is waiting for you!")}
                                className="px-6 py-3 rounded-2xl font-black border transition-all active:scale-95
                                bg-[var(--bg-side)] border-[var(--border-color)] text-[var(--text-primary)]
                                hover:border-[#c026d3]"
                            >
                                ${amount}
                            </button>
                        ))}
                    </div>

                    <button
                        className="w-full py-5 text-white text-lg font-black rounded-3xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-purple-500/20"
                        style={{ background: '#c026d3' }}
                    >
                        <Coins size={24} />
                        PLS DONATE ME (I'M BROKE)
                    </button>
                    <p className="mt-6 text-[10px] text-[var(--text-primary)] opacity-40 font-bold uppercase tracking-widest">
                        By clicking, you accept that you won't get your money back. Ever.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;