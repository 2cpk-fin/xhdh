import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { soloMatchApi } from "../api/soloMatchApi";
import type { SoloMatchReport, SoloMatchResponse } from "../types/soloMatch";

const SoloMatchPage = () => {
    const [currentMatch, setCurrentMatch] = useState<SoloMatchResponse | null>(null);
    const [matchReport, setMatchReport] = useState<SoloMatchReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    const MATCH_DURATION = 180; // 3 minutes

    // --- Timer & Timeout Logic ---
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

    // --- API Interactions ---
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
            if (isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || "Failed to start match.");
            } else {
                setError("An unexpected error occurred while starting the match.");
            }
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
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || "Failed to submit choice.");
            } else {
                setError("An unexpected error occurred while submitting.");
            }
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
        <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Solo Match Arena</h1>

            {error && (
                <div style={{ border: "1px solid red", color: "red", padding: "10px", marginBottom: "20px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* State 1: Start Match */}
            {!currentMatch && !matchReport && (
                <div>
                    <p>Ready to start a new match?</p>
                    <button onClick={handleStartMatch} disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
                        {loading ? "Loading..." : "Find Opponents"}
                    </button>
                </div>
            )}

            {/* State 2: Active Match */}
            {currentMatch && !matchReport && (
                <div>
                    <div style={{ marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>
                        Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>

                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        {/* University 1 */}
                        <div style={{ border: "1px solid black", padding: "20px", flex: 1, textAlign: "center" }}>
                            <h3>{currentMatch.university1.name}</h3>
                            <p><strong>{currentMatch.university1.abbreviation}</strong></p>
                            <p>Elo: {currentMatch.university1.elo}</p>
                            <button
                                onClick={() => handleChooseWinner(currentMatch.university1.id)}
                                disabled={loading}
                                style={{ padding: "10px", marginTop: "10px", cursor: "pointer", width: "100%" }}
                            >
                                Pick this University
                            </button>
                        </div>

                        <div>
                            <h2>VS</h2>
                        </div>

                        {/* University 2 */}
                        <div style={{ border: "1px solid black", padding: "20px", flex: 1, textAlign: "center" }}>
                            <h3>{currentMatch.university2.name}</h3>
                            <p><strong>{currentMatch.university2.abbreviation}</strong></p>
                            <p>Elo: {currentMatch.university2.elo}</p>
                            <button
                                onClick={() => handleChooseWinner(currentMatch.university2.id)}
                                disabled={loading}
                                style={{ padding: "10px", marginTop: "10px", cursor: "pointer", width: "100%" }}
                            >
                                Pick this University
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* State 3: Match Result */}
            {matchReport && (
                <div style={{ border: "1px solid black", padding: "30px", textAlign: "center" }}>
                    <h2>Match Finished!</h2>
                    <div style={{ margin: "20px 0", textAlign: "left", display: "inline-block", fontSize: "1.1rem" }}>
                        <p style={{ marginBottom: "10px" }}>
                            <strong>Winner:</strong> {matchReport.winner.name}
                            <span style={{ color: "green", fontWeight: "bold", marginLeft: "10px" }}>
                                +{matchReport.winnerEloChange} Elo
                            </span>
                        </p>
                        <p>
                            <strong>Loser:</strong> {matchReport.loser.name}
                            <span style={{ color: "red", fontWeight: "bold", marginLeft: "10px" }}>
                                -{matchReport.loserEloChange} Elo
                            </span>
                        </p>
                    </div>
                    <br />
                    <button onClick={resetMatch} style={{ padding: "10px 20px", cursor: "pointer", marginTop: "20px" }}>
                        Queue for Next Match
                    </button>
                </div>
            )}
        </div>
    );
};

export default SoloMatchPage;