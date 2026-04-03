import { useState, useEffect } from 'react';
import { Trophy, Zap, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const DuelPage = () => {
  const [currentMatch, setCurrentMatch] = useState<MatchResponseDTO | null>(null);
  const [matchResult, setMatchResult] = useState<SoloMatchReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
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
  

  const MATCH_DURATION = 180; // 3 minutes
  const remainingSeconds = Math.max(0, MATCH_DURATION - seconds);
  const countdownMinutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const countdownSeconds = (remainingSeconds % 60).toString().padStart(2, '0');
  const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken'); // Grab this too!

    if (refreshToken) {
      // Ensure the keys match your LogoutRequest DTO in Java
      await api.post('/auth/logout', { 
        refreshToken: refreshToken,
        accessToken: accessToken 
      });
    }
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  }
};

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

  interface ApiError {
    response?: {
      data?: {
        message?: string;
      };
    };
  }

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
      // Keep currentMatch for result display, clear it on reset
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
  const bgClass = isDark ? 'bg-black text-white' : 'bg-white text-black';
  const cardClass = isDark ? 'bg-black/80 border border-purple-500/30' : 'bg-white border border-black/10';
  const titleColor = isDark ? 'text-yellow-500' : 'text-yellow-500';
  const subtitleColor = isDark ? 'text-purple-200' : 'text-purple-700';
  const textColor = isDark ? 'text-white' : 'text-black';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${bgClass}`}>
      <div className="max-w-4xl w-full">
        <Link to="/home" className={`flex items-center gap-2 mb-6 text-sm transition-colors ${isDark ? 'text-black-300 hover:text-purple-300' : 'text-black-700 hover:text-purple-700'}`}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${titleColor} mb-2 flex items-center justify-center gap-3`}>
            <Trophy className="w-10 h-10 text-black-400" />
            University Duel
          </h1>
          <p className={`${subtitleColor} text-lg`}>Choose the university you think will win!</p>
          <div className="mt-4">
              <span className={`${cardClass} px-3 py-1.5 rounded-full ${textColor}`}>
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
          <div className="text-center">
            <button
              onClick={startSoloDuel}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-6 px-12 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-900/20 mx-auto text-xl"
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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{currentMatch.title}</h2>
              <p className="text-slate-400">Pick your champion!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-6">
              {/* University 1 */}
              <div className={`${cardClass} p-8 rounded-3xl shadow-2xl hover:border-blue-500/50 transition-colors flex flex-col`}>
                <div className="text-center mb-6 flex-1">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{currentMatch.u1.name}</h3>
                  <p className="text-slate-400 text-lg mb-2">({currentMatch.u1.abbreviation})</p>
                  <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-white font-semibold">ELO: {currentMatch.u1.elo}</span>
                  </div>
                </div>
                <button
                  onClick={() => chooseUniversity(currentMatch.u1.id)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {loading ? 'Choosing...' : 'Choose This University'}
                </button>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="bg-slate-800 text-white px-6 py-3 rounded-full font-bold text-xl">
                  VS
                </div>
              </div>

              {/* University 2 */}
              <div className={`${cardClass} p-8 rounded-3xl shadow-2xl hover:border-red-500/50 transition-colors flex flex-col`}>
                <div className="text-center mb-6 flex-1">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{currentMatch.u2.name}</h3>
                  <p className="text-slate-400 text-lg mb-2">({currentMatch.u2.abbreviation})</p>
                  <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-white font-semibold">ELO: {currentMatch.u2.elo}</span>
                  </div>
                </div>
                <button
                  onClick={() => chooseUniversity(currentMatch.u2.id)}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {loading ? 'Choosing...' : 'Choose This University'}
                </button>
              </div>
            </div>
          </div>
        )}

        {matchResult && currentMatch && (
          <div className="text-center space-y-6">
            <div className={`${cardClass} p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto`}>
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Match Result</h3>
              
              {/* Winner and Loser Display */}
              <div className="space-y-4">
                {matchResult.winnerId === currentMatch.u1.id ? (
                  <>
                    {/* U1 Winner */}
                    <div className="bg-green-600/20 border border-green-500/50 p-6 rounded-xl">
                      <p className="text-lg font-semibold text-white mb-2">{currentMatch.u1.name}</p>
                      <p className="text-white text-xl font-bold">
                        {currentMatch.u1.elo + matchResult.eloChange}
                        <span className="text-green-400 ml-2">(+{matchResult.eloChange})</span>
                      </p>
                    </div>
                    {/* U2 Loser */}
                    <div className="bg-red-600/20 border border-red-500/50 p-6 rounded-xl">
                      <p className="text-lg font-semibold text-white mb-2">{currentMatch.u2.name}</p>
                      <p className="text-white text-xl font-bold">
                        {currentMatch.u2.elo - matchResult.eloChange}
                        <span className="text-red-400 ml-2">(-{matchResult.eloChange})</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* U2 Winner */}
                    <div className="bg-green-600/20 border border-green-500/50 p-6 rounded-xl">
                      <p className="text-lg font-semibold text-white mb-2">{currentMatch.u2.name}</p>
                      <p className="text-white text-xl font-bold">
                        {currentMatch.u2.elo + matchResult.eloChange}
                        <span className="text-green-400 ml-2">(+{matchResult.eloChange})</span>
                      </p>
                    </div>
                    {/* U1 Loser */}
                    <div className="bg-red-600/20 border border-red-500/50 p-6 rounded-xl">
                      <p className="text-lg font-semibold text-white mb-2">{currentMatch.u1.name}</p>
                      <p className="text-white text-xl font-bold">
                        {currentMatch.u1.elo - matchResult.eloChange}
                        <span className="text-red-400 ml-2">(-{matchResult.eloChange})</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={resetDuel}
              className="mx-auto mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 w-fit"
            >
              <Zap className="w-5 h-5" />
              Duel Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuelPage;