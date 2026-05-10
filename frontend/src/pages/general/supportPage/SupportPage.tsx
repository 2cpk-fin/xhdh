import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Coins, HeartCrack, Rocket, ArrowLeft, History, X } from 'lucide-react';
import { useDarkMode } from '../../../hooks/useDarkMode';

// Components
import SupportSendingBox from './SupportSendingBox';
import SupportStorage from './SupportStorage';

// Assets
import QR_HUNG from "../../../assets/b053c3413f57be09e746.jpg";
import QR_KHANH from "../../../assets/f6143619ca0f4b51121e.jpg";

const SupportPage = () => {
    const [showQRs, setShowQRs] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const { isDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const neonPurple = '#c026d3';

    return (
        <div className="min-h-screen antialiased transition-colors duration-700 bg-[var(--bg-main)] pt-24 px-6 pb-20 flex flex-col items-center relative overflow-x-hidden">

            {/* Back Button */}
            <button
                onClick={() => navigate('/home')}
                className="fixed top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 active:scale-95 z-50
                bg-[var(--bg-side)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#c026d3] group shadow-lg shadow-black/5"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-black uppercase tracking-widest">Back</span>
            </button>

            {/* Hero Section */}
            <div className="max-w-3xl w-full text-center mb-12 relative">
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
                    The developer is currently running on instant noodles and hope.
                    Your support helps keep the servers (and me) alive.
                </p>
            </div>

            {/* Support Interaction Section */}
            <div className="w-full flex flex-col items-center gap-6 mb-16">
                <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-side)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:border-[#c026d3] hover:text-[#c026d3] transition-all shadow-sm active:scale-95"
                >
                    <History size={14} />
                    View My History
                </button>

                <SupportSendingBox onSuccess={() => {/* Optional: Refresh history count here */ }} />
            </div>

            {/* Donation Card */}
            <div className="w-full max-w-2xl p-px rounded-[3rem] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-2xl mb-16 transition-all hover:shadow-purple-500/20">
                <div className="bg-[var(--bg-main)] rounded-[2.9rem] p-10 text-center relative overflow-hidden">
                    <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2">Emergency Fund</h2>
                    <p className="text-[var(--text-primary)] opacity-60 font-bold mb-8 uppercase text-xs tracking-widest">
                        Current Hunger Level: <span className="text-red-500 animate-pulse">CRITICAL</span>
                    </p>

                    {!showQRs ? (
                        <button
                            onClick={() => setShowQRs(true)}
                            className="w-full py-5 text-white text-lg font-black rounded-3xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-purple-500/20"
                            style={{ background: '#c026d3' }}
                        >
                            <Coins size={24} />
                            REVEAL DONATION QR
                        </button>
                    ) : (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3 group">
                                    <div className="p-3 bg-white rounded-3xl shadow-xl transition-transform group-hover:scale-[1.02]">
                                        <img src={QR_HUNG} alt="QR Hung" className="w-full h-auto rounded-2xl" />
                                    </div>
                                    <p className="text-[10px] font-black text-[var(--text-primary)] opacity-60 uppercase tracking-tighter">
                                        TRAN VU DUY HUNG <br /> <span className="opacity-100 text-[#c026d3]">1705 2007 66</span>
                                    </p>
                                </div>
                                <div className="space-y-3 group">
                                    <div className="p-3 bg-white rounded-3xl shadow-xl transition-transform group-hover:scale-[1.02]">
                                        <img src={QR_KHANH} alt="QR Khanh" className="w-full h-auto rounded-2xl" />
                                    </div>
                                    <p className="text-[10px] font-black text-[var(--text-primary)] opacity-60 uppercase tracking-tighter">
                                        VU LONG KHANH <br /> <span className="opacity-100 text-[#c026d3]">8816 1909 07</span>
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowQRs(false)}
                                className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-[var(--text-primary)] opacity-40 hover:opacity-100 transition-opacity text-xs font-bold"
                            >
                                <X size={14} /> Hide QRs
                            </button>
                        </div>
                    )}

                    <p className="mt-8 text-[10px] text-[var(--text-primary)] opacity-30 font-bold uppercase tracking-[0.2em]">
                        Your kindness is non-refundable. Dev thanks you.
                    </p>
                </div>
            </div>

            {/* Search and Info Grid (Footer) */}
            <div className="w-full max-w-4xl space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2.5rem] border bg-[var(--bg-side)] border-[var(--border-color)] transition-all hover:scale-[1.01]">
                        <h3 className="text-xl font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Rocket className="text-blue-500" /> Fast Rankings?
                        </h3>
                        <p className="text-sm font-medium text-[var(--text-primary)] opacity-70 leading-relaxed">
                            Server electricity isn't free. My bank account is currently $0.02. Donating keeps the rankings fresh.
                        </p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border bg-[var(--bg-side)] border-[var(--border-color)] transition-all hover:scale-[1.01]">
                        <h3 className="text-xl font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Coffee className="text-amber-600" /> Bug Report?
                        </h3>
                        <p className="text-sm font-medium text-[var(--text-primary)] opacity-70 leading-relaxed">
                            I call them "Surprise Features". If you hate them, 1 cup of coffee = 1 bug fixed (maybe).
                        </p>
                    </div>
                </div>
            </div>

            {/* History Sidebar Modal */}
            <SupportStorage
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </div>
    );
};

export default SupportPage;