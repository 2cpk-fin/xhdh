import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../../../api/scheduleMatchApi'
import type { ScheduleParticipantResponse } from '../../../types/scheduleMatch'

type Props = {
    publicMatchId: string
}

export default function LeaderboardSection({ publicMatchId }: Props) {
    const [participants, setParticipants] = useState<ScheduleParticipantResponse[]>([])
    const [loading, setLoading] = useState(true)

    const [isProcessingVote, setIsProcessingVote] = useState(false)
    const [votedId, setVotedId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchLeaderboard = async () => {
            try {
                const data = await scheduleMatchApi.getLeaderboard(publicMatchId)
                if (!cancelled) {
                    // Trusting the BE ZSET order directly
                    setParticipants(data)
                    setError(null)
                }
            } catch {
                if (!cancelled) setError('Failed to load leaderboard.')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchLeaderboard()

        return () => {
            cancelled = true
        }
    }, [publicMatchId])

    const handleVote = async (universityId: number) => {
        if (votedId === universityId || isProcessingVote) return;

        setError(null);
        setIsProcessingVote(true);

        const previousParticipants = [...participants];

        // Optimistic update: instantly -1 old vote, +1 new vote
        setParticipants(prev => {
            const updated = prev.map(p => {
                if (p.universityResponse.id === votedId) {
                    return { ...p, totalVotes: Math.max(0, p.totalVotes - 1) }
                }
                if (p.universityResponse.id === universityId) {
                    return { ...p, totalVotes: p.totalVotes + 1 }
                }
                return p;
            });

            // Local sort just to make the UI snap instantly without waiting for BE response
            updated.sort((a, b) => b.totalVotes - a.totalVotes);
            return updated.map((p, index) => ({ ...p, rank: index + 1 }));
        });

        try {
            await scheduleMatchApi.vote(publicMatchId, universityId);
            setVotedId(universityId);

            // Fetch fresh data from BE (which is guaranteed to be sorted via ZSET)
            const freshData = await scheduleMatchApi.getLeaderboard(publicMatchId);
            setParticipants(freshData);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setParticipants(previousParticipants);
            const errMsg = err.response?.data || 'Vote failed.';
            setError(errMsg);
        } finally {
            setIsProcessingVote(false);
        }
    }

    if (loading) return <p className="text-sm font-medium text-zinc-400 py-8">Loading leaderboard…</p>
    if (error) return <p className="text-sm font-medium text-red-500 py-8">{error}</p>

    return (
        <section>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-zinc-800 tracking-tight">Live Leaderboard</h2>
                {votedId !== null && (
                    <span className="text-xs font-black tracking-wide text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                        ✓ Vote cast
                    </span>
                )}
            </div>

            <ul className="flex flex-col gap-3">
                {participants.map((p, i) => {
                    const uniId = p.universityResponse.id
                    const isVoted = votedId === uniId

                    // Determine medal colors for top 3
                    let rankColor = 'text-zinc-300' // default
                    if (i === 0) rankColor = 'text-yellow-500' // Gold
                    else if (i === 1) rankColor = 'text-zinc-400' // Silver
                    else if (i === 2) rankColor = 'text-amber-600' // Copper/Bronze

                    return (
                        <li
                            key={uniId}
                            className={`bg-white border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm transition-all duration-200 ${isVoted ? 'border-purple-300 bg-purple-50/50 shadow-purple-100' : 'border-zinc-200 hover:border-zinc-300'}`}
                        >
                            <span className={`text-xl font-black w-8 flex-shrink-0 tabular-nums ${rankColor}`}>
                                #{p.rank}
                            </span>

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-zinc-800 text-sm truncate">
                                    {p.universityResponse.name}
                                </p>
                            </div>

                            <span className="text-xs font-bold text-zinc-400 flex-shrink-0 tabular-nums">
                                {p.totalVotes.toLocaleString()} votes
                            </span>

                            <button
                                onClick={() => handleVote(uniId)}
                                disabled={isProcessingVote}
                                className={`flex-shrink-0 text-xs font-black tracking-wide px-4 py-1.5 rounded-xl border transition-all duration-200 min-w-[64px] text-center ${isVoted ? 'border-green-300 bg-green-50 text-green-600 cursor-default' : isProcessingVote ? 'border-zinc-200 text-zinc-300 cursor-not-allowed' : 'border-purple-300 text-purple-600 hover:bg-purple-600 hover:text-white hover:shadow-md hover:shadow-purple-200 active:scale-95'}`}
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