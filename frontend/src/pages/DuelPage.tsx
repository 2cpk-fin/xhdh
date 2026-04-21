import { useState, useEffect } from 'react';
import { Trophy, Zap, Star, Loader2, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { soloMatchAPI } from '../api/SoloMatchApi';
import type { MatchResponseDTO, SoloMatchReport } from '../types/SoloMatch';

const DuelPage = () => {
  const [currentMatch, setCurrentMatch] = useState<MatchResponseDTO | null>(null);
  const [matchResult, setMatchResult] = useState<SoloMatchReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  const MATCH_DURATION = 180;

  // --- Theme Sync ---
  useEffect(() => {
    const onThemeChange = () => setTheme((localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (timerActive && seconds >= MATCH_DURATION) {
      setTimerActive(false);
      setCurrentMatch(null);
      setError('Match time expired. Try another duel!');
    }
  }, [seconds, timerActive]);

  // --- [CREATE]: Start Duel ---
  const handleStartDuel = async () => {
    setLoading(true);
    setError('');
    setMatchResult(null);
    setSeconds(0);
    try {
      const data = await soloMatchAPI.startDuel();
      setCurrentMatch(data);
      setTimerActive(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initialize duel');
    } finally {
      setLoading(false);
    }
  };

  // --- [CREATE/UPDATE]: Make Choice ---
  const handleChoose = async (universityId: string) => {
    if (!currentMatch) return;
    setLoading(true);
    try {
      const result = await soloMatchAPI.chooseWinner({
        matchUUID: currentMatch.matchId,
        universityUUID: universityId
      });
      setMatchResult(result);
      setTimerActive(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Selection failed');
    } finally {
      setLoading(false);
    }
  };

  // --- UI Helpers ---
  const remaining = Math.max(0, MATCH_DURATION - seconds);
  const formatTime = () => {
    const m = Math.floor(remaining / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
  const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
      <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className={`flex-1 p-6 md:p-10 overflow-y-auto ${bgMain}`}>
            <div className="max-w-4xl mx-auto">

              {/* Timer & Header */}
              <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center gap-3">
                  <Trophy className="w-10 h-10 text-purple-500" />
                  Solo Arena
                </h1>
                <div className="flex justify-center">
                  <div className={`${cardBg} px-6 py-2 rounded-2xl border shadow-sm font-mono text-xl font-bold flex items-center gap-3`}>
                    <span className="text-zinc-500 text-sm uppercase tracking-widest">Time Remaining</span>
                    <span className={remaining < 30 ? 'text-red-500 animate-pulse' : 'text-purple-500'}>
                    {formatTime()}
                  </span>
                  </div>
                </div>
              </div>

              {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center font-bold mb-6 animate-shake">
                    {error}
                  </div>
              )}

              {/* State 1: Start Button */}
              {!currentMatch && !matchResult && (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="p-6 bg-purple-500/10 rounded-full">
                      <Zap className="w-16 h-16 text-purple-500 animate-pulse" />
                    </div>
                    <button
                        onClick={handleStartDuel}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-black py-5 px-12 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <Zap />}
                      Find Opponents
                    </button>
                  </div>
              )}

              {/* State 2: Active Duel */}
              {currentMatch && !matchResult && (
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 animate-in fade-in slide-in-from-bottom-8">
                    {[currentMatch.u1, currentMatch.u2].map((uni, idx) => (
                        <div key={uni.id} className={`${cardBg} p-8 rounded-[2rem] border-2 shadow-xl flex flex-col items-center text-center space-y-6 hover:border-purple-500/40 transition-colors`}>
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${idx === 0 ? 'from-blue-600 to-indigo-600' : 'from-pink-600 to-rose-600'} flex items-center justify-center shadow-lg shadow-purple-500/20`}>
                            <Star className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h3 className={`text-2xl font-black ${textColor}`}>{uni.name}</h3>
                            <p className={`text-sm font-bold tracking-widest ${subTextColor} uppercase`}>{uni.abbreviation}</p>
                          </div>
                          <div className="bg-zinc-900/40 px-4 py-2 rounded-xl border border-zinc-800">
                            <span className="text-yellow-500 font-black">ELO {uni.elo}</span>
                          </div>
                          <button
                              onClick={() => handleChoose(uni.id)}
                              disabled={loading}
                              className={`w-full py-4 rounded-xl font-black text-white transition-all active:scale-95 ${idx === 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                          >
                            Pick {uni.abbreviation}
                          </button>
                        </div>
                    ))}
                    <div className="hidden md:flex flex-col items-center">
                      <div className="h-20 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
                      <div className={`${cardBg} p-4 rounded-full border-2 font-black text-purple-500 z-10`}>VS</div>
                      <div className="h-20 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
                    </div>
                  </div>
              )}

              {/* State 3: Result */}
              {matchResult && currentMatch && (
                  <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
                    <div className={`${cardBg} p-10 rounded-[2.5rem] border-t-4 border-t-green-500 shadow-2xl text-center`}>
                      <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Duel Results</h2>

                      <div className="space-y-4">
                        {[currentMatch.u1, currentMatch.u2].map(uni => {
                          const isWinner = uni.id === matchResult.winnerId;
                          return (
                              <div key={uni.id} className={`p-6 rounded-2xl border-2 flex justify-between items-center ${isWinner ? 'bg-green-500/10 border-green-500/50' : 'bg-zinc-900/20 border-zinc-800 opacity-60'}`}>
                                <div className="text-left">
                                  <p className="font-black text-lg">{uni.name}</p>
                                  <p className="text-xs font-bold uppercase text-zinc-500">{isWinner ? 'Victory' : 'Defeat'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-black">
                                    {isWinner ? uni.elo + matchResult.eloChange : uni.elo - matchResult.eloChange}
                                  </p>
                                  <p className={`text-xs font-bold ${isWinner ? 'text-green-500' : 'text-red-500'}`}>
                                    {isWinner ? `+${matchResult.eloChange}` : `-${matchResult.eloChange}`} ELO
                                  </p>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                    </div>
                    <button
                        onClick={() => { setCurrentMatch(null); setMatchResult(null); }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5 rounded-2xl font-black text-white flex items-center justify-center gap-2 shadow-xl hover:opacity-90 transition-all"
                    >
                      <RefreshCw className="w-5 h-5" /> Queue for Next Duel
                    </button>
                  </div>
              )}
            </div>
          </main>
        </div>
      </div>
  );
};

export default DuelPage;