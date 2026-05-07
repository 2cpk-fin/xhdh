import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../api/scheduleMatchApi'
import type { ScheduleParticipantResponse } from '../types/scheduleMatch'

type Props = {
    publicMatchId: string
}

export default function LeaderboardSection({ publicMatchId }: Props) {
    const [participants, setParticipants] = useState<ScheduleParticipantResponse[]>([])
    const [loading, setLoading] = useState(true)

    // The "Lock" state: Prevents the race condition that caused negative votes
    const [isProcessingVote, setIsProcessingVote] = useState(false)
    const [votedId, setVotedId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchLeaderboard = async () => {
            try {
                // Ensure your scheduleMatchApi uses the path: /api/schedule/match/leaderboard/{publicMatchId}
                const data = await scheduleMatchApi.getLeaderboard(publicMatchId)
                if (!cancelled) {
                    setParticipants(data)
                    setError(null)
                }
            } catch {
                if (!cancelled) setError('Failed to load leaderboard.')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        // Fetch exactly ONCE on load.
        fetchLeaderboard()

        // Notice: No setInterval! The network is now completely silent.

        return () => {
            cancelled = true
        }
    }, [publicMatchId])

    const handleVote = async (universityId: number) => {
        // If they already voted for this, OR if a vote is currently processing, do nothing.
        if (votedId === universityId || isProcessingVote) return;

        setError(null);
        setIsProcessingVote(true); // Lock the entire UI instantly

        const previousParticipants = [...participants];

        // Optimistic update: instantly show the new vote locally
        setParticipants(prev => {
            const updated = prev.map(p => {
                // If changing vote, subtract from the old one (preventing negative numbers)
                if (p.universityResponse.id === votedId) {
                    return { ...p, totalVotes: Math.max(0, p.totalVotes - 1) }
                }
                // Add to the newly clicked one
                if (p.universityResponse.id === universityId) {
                    return { ...p, totalVotes: p.totalVotes + 1 }
                }
                return p;
            });

            // Re-sort so the UI updates the ranking visually
            updated.sort((a, b) => b.totalVotes - a.totalVotes);
            return updated.map((p, index) => ({ ...p, rank: index + 1 }));
        });

        try {
            await scheduleMatchApi.vote(publicMatchId, universityId);
            setVotedId(universityId);

            // Fetch fresh data immediately to ensure we are perfectly in sync with the backend
            const freshData = await scheduleMatchApi.getLeaderboard(publicMatchId);
            setParticipants(freshData);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            // Rollback if the API fails
            setParticipants(previousParticipants);
            const errMsg = err.response?.data || 'Vote failed.';
            setError(errMsg);
        } finally {
            // Unlock the UI
            setIsProcessingVote(false);
        }
    }

    const maxVotes = Math.max(...participants.map(p => p.totalVotes), 1)

    if (loading) return <p className="text-sm font-medium text-zinc-400 py-8">Loading leaderboard…</p>
    if (error) return <p className="text-sm font-medium text-red-500 py-8">{error}</p>

    return (
        <section>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-zinc-800 tracking-tight">Live Leaderboard</h2>
                {votedId !== null && (
                    <span className="text-xs font-black tracking-wide text-green-600
                                     bg-green-50 border border-green-200 rounded-full px-3 py-1">
                        ✓ Vote cast
                    </span>
                )}
            </div>

            {/* Rows */}
            <ul className="flex flex-col gap-3">
                {participants.map((p, i) => {
                    const uniId = p.universityResponse.id
                    const pct = Math.round((p.totalVotes / maxVotes) * 100)
                    const isVoted = votedId === uniId
                    const isFirst = i === 0

                    return (
                        <li
                            key={uniId}
                            className={`bg-white border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm
                                        transition-all duration-200
                                        ${isVoted
                                    ? 'border-purple-300 bg-purple-50/50 shadow-purple-100'
                                    : 'border-zinc-200 hover:border-zinc-300'}`}
                        >
                            {/* Rank */}
                            <span className={`text-xl font-black w-8 flex-shrink-0 tabular-nums
                                             ${isFirst ? 'text-purple-600' : 'text-zinc-300'}`}>
                                #{p.rank}
                            </span>

                            {/* Name + bar */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-zinc-800 text-sm truncate mb-1.5">
                                    {p.universityResponse.name}
                                </p>
                                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-green-400 transition-all duration-700"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>

                            {/* Vote count */}
                            <span className="text-xs font-bold text-zinc-400 flex-shrink-0 tabular-nums">
                                {p.totalVotes.toLocaleString()} votes
                            </span>

                            {/* Vote button */}
                            <button
                                onClick={() => handleVote(uniId)}
                                // Disable ALL buttons if ANY vote is processing
                                disabled={isProcessingVote}
                                className={`flex-shrink-0 text-xs font-black tracking-wide px-4 py-1.5 rounded-xl
                                            border transition-all duration-200 min-w-[64px] text-center
                                            ${isVoted
                                        ? 'border-green-300 bg-green-50 text-green-600 cursor-default'
                                        : isProcessingVote
                                            ? 'border-zinc-200 text-zinc-300 cursor-not-allowed'
                                            : 'border-purple-300 text-purple-600 hover:bg-purple-600 hover:text-white hover:shadow-md hover:shadow-purple-200 active:scale-95'
                                    }`}
                            >
                                {isProcessingVote && !isVoted ? '…' : isVoted ? '✓' : 'Vote'}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}