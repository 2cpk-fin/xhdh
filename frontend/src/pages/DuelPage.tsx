import { useState, useEffect } from 'react';
import { Trophy, Zap, Star } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/axios';

interface UniversityDTO {
  id: string;
  name: string;
  abbreviation: string;
  elo: number;
}

interface MatchResponseDTO {
  matchId: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  u1: UniversityDTO;
  u2: UniversityDTO;
  ownerUUID: string;
}

interface SoloMatchReport {
  winnerId: string;
  loserId: string;
  eloChange: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const DuelPage = () => {
  const [currentMatch, setCurrentMatch] = useState<MatchResponseDTO | null>(null);
  const [matchResult, setMatchResult] = useState<SoloMatchReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const storedTheme = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
    setTheme(storedTheme);

    const onThemeChange = () => {
      const updatedTheme = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(updatedTheme);
    };

    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  const MATCH_DURATION = 180;
  const remainingSeconds = Math.max(0, MATCH_DURATION - seconds);
  const countdownMinutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const countdownSeconds = (remainingSeconds % 60).toString().padStart(2, '0');

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (!timerActive || !currentMatch) return;
    if (remainingSeconds <= 0) {
      setTimerActive(false);
      setCurrentMatch(null);
      setError('Match time expired. Start a new duel.');
    }
  }, [remainingSeconds, timerActive, currentMatch]);

  const startSoloDuel = async () => {
    setLoading(true);
    setError('');
    setMatchResult(null);
    setSeconds(0);
    setTimerActive(true);
    try {
      const response = await api.post('/matches/solo/start');
      setCurrentMatch(response.data);
    } catch (err: unknown) {
      const maybeError = err as ApiError;
      const message = maybeError.response?.data?.message ?? 'Failed to start duel';
      setError(message);
      setTimerActive(false);
    } finally {
      setLoading(false);
    }
  };

  const chooseUniversity = async (universityId: string) => {
    if (!currentMatch) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/matches/solo/choose', {
        matchUUID: currentMatch.matchId,
        universityUUID: universityId
      });
      setMatchResult(response.data);
      setTimerActive(false);
    } catch (err: unknown) {
      const maybeError = err as ApiError;
      const message = maybeError.response?.data?.message ?? 'Failed to make choice';
      setError(message);
      setTimerActive(false);
    } finally {
      setLoading(false);
    }
  };

  const resetDuel = () => {
    setCurrentMatch(null);
    setMatchResult(null);
    setError('');
    setTimerActive(false);
    setSeconds(0);
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
        <main className={`flex-1 p-10 overflow-y-auto ${bgMain}`}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className={`text-5xl font-bold text-purple-500 mb-3 flex items-center justify-center gap-3`}>
                <Trophy className="w-12 h-12" />
                University Duel
              </h1>
              <p className={`${subTextColor} text-lg`}>Choose the university you think will win!</p>
              <div className="mt-4">
                <span className={`${cardBg} px-4 py-2 rounded-full inline-block font-bold border`}>
                  Match ends in: {countdownMinutes}:{countdownSeconds}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-center font-medium mb-6">
                {error}
              </div>
            )}

            {!currentMatch && !matchResult && (
              <div className="text-center py-20">
                <button
                  onClick={startSoloDuel}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 text-white font-bold py-6 px-12 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg mx-auto text-xl transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Starting Duel...
                    </>
                  ) : (
                    <>
                      <Zap className="w-7 h-7" />
                      Start Solo Duel
                    </>
                  )}
                </button>
              </div>
            )}

            {currentMatch && !matchResult && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className={`text-3xl font-bold ${textColor} mb-2`}>{currentMatch.title}</h2>
                  <p className={subTextColor}>Pick your champion!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-8">
                  <div className={`${cardBg} p-8 rounded-3xl shadow-2xl hover:border-purple-500/50 border transition-all duration-300 flex flex-col`}>
                    <div className="text-center mb-8 flex-1">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="w-12 h-12 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{currentMatch.u1.name}</h3>
                      <p className={`${subTextColor} text-lg mb-4`}>({currentMatch.u1.abbreviation})</p>
                      <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'} px-4 py-2 rounded-full`}>
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">ELO: {currentMatch.u1.elo}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => chooseUniversity(currentMatch.u1.id)}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
                    >
                      {loading ? 'Choosing...' : 'Choose This University'}
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className={`${cardBg} text-purple-500 px-6 py-3 rounded-full font-bold text-2xl border shadow-lg`}>
                      VS
                    </div>
                  </div>

                  <div className={`${cardBg} p-8 rounded-3xl shadow-2xl hover:border-pink-500/50 border transition-all duration-300 flex flex-col`}>
                    <div className="text-center mb-8 flex-1">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="w-12 h-12 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{currentMatch.u2.name}</h3>
                      <p className={`${subTextColor} text-lg mb-4`}>({currentMatch.u2.abbreviation})</p>
                      <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'} px-4 py-2 rounded-full`}>
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">ELO: {currentMatch.u2.elo}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => chooseUniversity(currentMatch.u2.id)}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
                    >
                      {loading ? 'Choosing...' : 'Choose This University'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {matchResult && currentMatch && (
              <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className={`${cardBg} p-10 rounded-3xl shadow-2xl border`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-3xl font-bold ${textColor} mb-8`}>Match Result</h3>
                  
                  <div className="space-y-4">
                    {matchResult.winnerId === currentMatch.u1.id ? (
                      <>
                        <div className="bg-green-600/10 border border-green-500/30 p-8 rounded-2xl">
                          <p className={`text-lg font-semibold ${textColor} mb-3`}>{currentMatch.u1.name}</p>
                          <p className={`${textColor} text-3xl font-bold`}>
                            {currentMatch.u1.elo + matchResult.eloChange}
                            <span className="text-green-500 ml-2">(+{matchResult.eloChange})</span>
                          </p>
                          <p className="text-green-500 text-xs font-bold uppercase mt-2 tracking-widest">Winner</p>
                        </div>
                        <div className="bg-red-600/10 border border-red-500/30 p-8 rounded-2xl opacity-70">
                          <p className={`text-lg font-semibold ${textColor} mb-3`}>{currentMatch.u2.name}</p>
                          <p className={`${textColor} text-3xl font-bold`}>
                            {currentMatch.u2.elo - matchResult.eloChange}
                            <span className="text-red-500 ml-2">(-{matchResult.eloChange})</span>
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-green-600/10 border border-green-500/30 p-8 rounded-2xl">
                          <p className={`text-lg font-semibold ${textColor} mb-3`}>{currentMatch.u2.name}</p>
                          <p className={`${textColor} text-3xl font-bold`}>
                            {currentMatch.u2.elo + matchResult.eloChange}
                            <span className="text-green-500 ml-2">(+{matchResult.eloChange})</span>
                          </p>
                          <p className="text-green-500 text-xs font-bold uppercase mt-2 tracking-widest">Winner</p>
                        </div>
                        <div className="bg-red-600/10 border border-red-500/30 p-8 rounded-2xl opacity-70">
                          <p className={`text-lg font-semibold ${textColor} mb-3`}>{currentMatch.u1.name}</p>
                          <p className={`${textColor} text-3xl font-bold`}>
                            {currentMatch.u1.elo - matchResult.eloChange}
                            <span className="text-red-500 ml-2">(-{matchResult.eloChange})</span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={resetDuel}
                  className="mx-auto mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-bold py-4 px-12 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 transform hover:scale-105"
                >
                  <Zap className="w-5 h-5" />
                  Duel Again
                </button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DuelPage;