import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { soloMatchApi } from "../api/soloMatchApi";
import type { SoloMatchReport, SoloMatchResponse } from "../types/soloMatch";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Swords, Trophy, TrendingUp, TrendingDown, RefreshCw, Clock, Zap } from "lucide-react";

// ─── Timer Ring ──────────────────────────────────────────────────────────────

interface TimerRingProps {
    timeLeft: number;
    total: number;
}

const TimerRing = ({ timeLeft, total }: TimerRingProps) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / total;
    const dashOffset = circumference * (1 - progress);

    const color =
        progress > 0.5 ? "#9333ea" : progress > 0.25 ? "#f59e0b" : "#ef4444";

    const minutes = Math.floor(timeLeft / 60);
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    return (
        <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r={radius} fill="none" stroke="#e4e4e7" strokeWidth="5" />
                    <circle
                        cx="35"
                        cy="35"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
                    />
                </svg>
                <span className="text-xs font-black text-zinc-700 tabular-nums">
                    {minutes}:{seconds}
                </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-500">
                <Clock className="w-4 h-4" />
                Time Remaining
            </div>
        </div>
    );
};

// ─── University Card ──────────────────────────────────────────────────────────

interface UniversityCardProps {
    university: SoloMatchResponse["university1"];
    onPick: () => void;
    disabled: boolean;
    side: "left" | "right";
}

const UniversityCard = ({ university, onPick, disabled, side }: UniversityCardProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`
                relative flex-1 flex flex-col items-center gap-4 p-8 rounded-2xl border-2 cursor-pointer
                bg-white/60 backdrop-blur-sm transition-all duration-300
                ${hovered
                    ? "border-purple-400 shadow-xl shadow-purple-100 -translate-y-1 bg-white/80"
                    : "border-zinc-200 shadow-md"
                }
            `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Subtle gradient glow on hover */}
            <div
                className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${hovered ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    background:
                        side === "left"
                            ? "radial-gradient(circle at 30% 50%, rgba(147,51,234,0.06) 0%, transparent 70%)"
                            : "radial-gradient(circle at 70% 50%, rgba(147,51,234,0.06) 0%, transparent 70%)",
                }}
            />

            {/* Abbreviation badge */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-purple-700 tracking-tight">
                    {university.abbreviation}
                </span>
            </div>

            {/* University info */}
            <div className="text-center">
                <h3 className="text-base font-black text-zinc-800 leading-snug mb-1">
                    {university.name}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-zinc-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-zinc-600">{university.elo}</span>
                    <span>Elo</span>
                </div>
            </div>

            {/* Pick button */}
            <button
                onClick={onPick}
                disabled={disabled}
                className={`
                    w-full py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider
                    transition-all duration-200
                    ${disabled
                        ? "bg-zinc-100 text-zinc-300 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-purple-200 active:scale-95"
                    }
                `}
            >
                {disabled ? "Submitting…" : "Pick Winner"}
            </button>
        </div>
    );
};

// ─── Start Screen ─────────────────────────────────────────────────────────────

interface StartScreenProps {
    onStart: () => void;
    loading: boolean;
}

const StartScreen = ({ onStart, loading }: StartScreenProps) => (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 flex items-center justify-center shadow-lg">
            <Swords className="w-12 h-12 text-purple-600" />
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-black text-zinc-800 mb-2">Ready to Battle?</h2>
            <p className="text-zinc-500 font-medium max-w-sm">
                Two universities will go head-to-head. Pick the one you think deserves the top spot.
            </p>
        </div>
        <button
            onClick={onStart}
            disabled={loading}
            className="flex items-center gap-2.5 py-3.5 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-200 text-white disabled:text-zinc-400 font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-purple-200 active:scale-95"
        >
            <Swords className="w-4 h-4" />
            {loading ? "Finding Opponents…" : "Find Opponents"}
        </button>
    </div>
);

// ─── Result Screen ────────────────────────────────────────────────────────────

interface ResultScreenProps {
    report: SoloMatchReport;
    onReset: () => void;
}

const ResultScreen = ({ report, onReset }: ResultScreenProps) => (
    <div className="flex flex-col items-center gap-8 py-10">
        {/* Trophy */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-50 border border-amber-200 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-amber-500" />
        </div>

        <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-purple-500 mb-1">Match Complete</p>
            <h2 className="text-2xl font-black text-zinc-800">Results Are In</h2>
        </div>

        {/* Result cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Winner */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 flex flex-col gap-3">
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                        Winner
                    </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center">
                    <span className="text-sm font-black text-emerald-700">{report.winner.abbreviation}</span>
                </div>
                <div>
                    <p className="font-black text-zinc-800 text-base">{report.winner.name}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-black text-lg">+{report.winnerEloChange}</span>
                    <span className="text-zinc-400 text-sm font-bold">Elo</span>
                </div>
            </div>

            {/* Loser */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-6 flex flex-col gap-3">
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-zinc-400 text-white px-2.5 py-1 rounded-full">
                        Defeated
                    </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center">
                    <span className="text-sm font-black text-zinc-500">{report.loser.abbreviation}</span>
                </div>
                <div>
                    <p className="font-black text-zinc-600 text-base">{report.loser.name}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-red-500 font-black text-lg">-{report.loserEloChange}</span>
                    <span className="text-zinc-400 text-sm font-bold">Elo</span>
                </div>
            </div>
        </div>

        <button
            onClick={onReset}
            className="flex items-center gap-2.5 py-3 px-7 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-purple-200 active:scale-95"
        >
            <RefreshCw className="w-4 h-4" />
            Next Match
        </button>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const SoloMatchPage = () => {
    const [currentMatch, setCurrentMatch] = useState<SoloMatchResponse | null>(null);
    const [matchReport, setMatchReport] = useState<SoloMatchReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    const MATCH_DURATION = 180;

    useEffect(() => {
        if (!timerActive) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimerActive(false);
                    setCurrentMatch(null);
                    setError("Match time expired. Try another match!");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timerActive]);

    const handleStartMatch = async () => {
        setLoading(true);
        setError("");
        setMatchReport(null);
        try {
            const data = await soloMatchApi.startSoloMatch();
            setCurrentMatch(data);
            setTimeLeft(MATCH_DURATION);
            setTimerActive(true);
        } catch (err) {
            setError(
                isAxiosError(err)
                    ? err.response?.data?.message || err.message || "Failed to start match."
                    : "An unexpected error occurred while starting the match."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChooseWinner = async (winnerId: number) => {
        if (!currentMatch) return;
        setLoading(true);
        try {
            const report = await soloMatchApi.chooseWinner(currentMatch.publicMatchId, winnerId);
            setMatchReport(report);
            setTimerActive(false);
            setCurrentMatch(null);
        } catch (err) {
            setError(
                isAxiosError(err)
                    ? err.response?.data?.message || err.message || "Failed to submit choice."
                    : "An unexpected error occurred while submitting."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetMatch = () => {
        setCurrentMatch(null);
        setMatchReport(null);
        setError("");
        setTimeLeft(0);
        setTimerActive(false);
    };

    return (
        <div className="min-h-screen bg-zinc-50/80 flex flex-col">
            <Header />

            <div className="flex flex-1">
                <NavBar />

                {/* Main content — offset for sidebar */}
                <main className="flex-1 ml-64 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="flex-1 px-8 py-10 max-w-3xl w-full mx-auto">

                        {/* Page heading */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-1">
                                <Swords className="w-5 h-5 text-purple-500" />
                                <p className="text-xs font-black uppercase tracking-widest text-purple-500">Arena</p>
                            </div>
                            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Solo Match</h1>
                            <p className="text-sm text-zinc-500 font-medium mt-1">
                                Vote on university matchups and influence the global Elo rankings.
                            </p>
                        </div>

                        {/* Error banner */}
                        {error && (
                            <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                                <span className="text-sm font-bold">{error}</span>
                                <button
                                    onClick={() => setError("")}
                                    className="ml-auto text-red-400 hover:text-red-600 font-black text-lg leading-none"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {/* Card container */}
                        <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-zinc-200 shadow-sm overflow-hidden">

                            {/* Active match header strip */}
                            {currentMatch && !matchReport && (
                                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                        Match #{currentMatch.publicMatchId}
                                    </p>
                                    <TimerRing timeLeft={timeLeft} total={MATCH_DURATION} />
                                </div>
                            )}

                            <div className="p-6">
                                {/* State 1: Start */}
                                {!currentMatch && !matchReport && (
                                    <StartScreen onStart={handleStartMatch} loading={loading} />
                                )}

                                {/* State 2: Active Match */}
                                {currentMatch && !matchReport && (
                                    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                                        <UniversityCard
                                            university={currentMatch.university1}
                                            onPick={() => handleChooseWinner(currentMatch.university1.id)}
                                            disabled={loading}
                                            side="left"
                                        />

                                        {/* VS divider */}
                                        <div className="flex sm:flex-col items-center justify-center gap-2 py-2">
                                            <div className="hidden sm:block w-px flex-1 bg-zinc-200" />
                                            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                                                <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">vs</span>
                                            </div>
                                            <div className="hidden sm:block w-px flex-1 bg-zinc-200" />
                                        </div>

                                        <UniversityCard
                                            university={currentMatch.university2}
                                            onPick={() => handleChooseWinner(currentMatch.university2.id)}
                                            disabled={loading}
                                            side="right"
                                        />
                                    </div>
                                )}

                                {/* State 3: Result */}
                                {matchReport && (
                                    <ResultScreen report={matchReport} onReset={resetMatch} />
                                )}
                            </div>
                        </div>
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default SoloMatchPage;