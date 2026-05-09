import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { soloMatchApi } from "../../../api/soloMatchApi";
import type { SoloMatchReport, SoloMatchResponse } from "../../../types/soloMatch";
import Header from "../../../components/Header";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Swords, ArrowLeft } from "lucide-react";

// Components
import { TimerRing } from "./TimerRing";
import { UniversityCard } from "./UniversityCard";
import { StartScreen } from "./StartScreen";
import { ResultScreen } from "./ResultScreen";

const MATCH_DURATION = 180;

const SoloMatchPage = () => {
    const [currentMatch, setCurrentMatch] = useState<SoloMatchResponse | null>(null);
    const [matchReport, setMatchReport] = useState<SoloMatchReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

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
        setMatchReport(null); // Instantly drops back to the 'finding opponents' screen
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
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Header />

            <div className="flex flex-1">
                <NavBar />

                <main className="flex-1 ml-64 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="flex-1 px-8 py-10 max-w-3xl w-full mx-auto">

                        {/* Back Arrow */}
                        <a href="/home" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-purple-600 transition-all hover:-translate-x-1 w-fit mb-8">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </a>

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
                            {currentMatch && !matchReport && (
                                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                        Match #{currentMatch.publicMatchId}
                                    </p>
                                    <TimerRing timeLeft={timeLeft} total={MATCH_DURATION} />
                                </div>
                            )}

                            <div className="p-6">
                                {!currentMatch && !matchReport && (
                                    <StartScreen onStart={handleStartMatch} loading={loading} />
                                )}

                                {currentMatch && !matchReport && (
                                    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                                        <UniversityCard
                                            university={currentMatch.university1}
                                            onPick={() => handleChooseWinner(currentMatch.university1.id)}
                                            disabled={loading}
                                            side="left"
                                        />

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

                                {matchReport && (
                                    <ResultScreen
                                        report={matchReport}
                                        onNextMatch={handleStartMatch}
                                        onStop={resetMatch}
                                    />
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