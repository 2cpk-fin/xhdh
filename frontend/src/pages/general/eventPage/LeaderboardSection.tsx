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
        return () => { cancelled = true }
    }, [publicMatchId])

    const handleVote = async (universityId: number) => {
        if (votedId === universityId || isProcessingVote) return;
        setError(null);
        setIsProcessingVote(true);
        const previousParticipants = [...participants];

        setParticipants(prev => {
            const updated = prev.map(p => {
                if (p.universityResponse.id === votedId) return { ...p, totalVotes: Math.max(0, p.totalVotes - 1) }
                if (p.universityResponse.id === universityId) return { ...p, totalVotes: p.totalVotes + 1 }
                return p;
            });
            updated.sort((a, b) => b.totalVotes - a.totalVotes);
            return updated.map((p, index) => ({ ...p, rank: index + 1 }));
        });

        try {
            await scheduleMatchApi.vote(publicMatchId, universityId);
            setVotedId(universityId);
            const freshData = await scheduleMatchApi.getLeaderboard(publicMatchId);
            setParticipants(freshData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setParticipants(previousParticipants);
            setError(err.response?.data || 'Vote failed.');
        } finally {
            setIsProcessingVote(false);
        }
    }

    if (loading) return <p className="text-sm font-medium text-[var(--text-primary)] opacity-40 py-8">Loading leaderboard…</p>
    if (error) return <p className="text-sm font-medium text-red-500 py-8">{error}</p>

    return (
        <section>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Live Leaderboard</h2>
                {votedId !== null && (
                    <span className="text-xs font-black tracking-wide text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                        ✓ Vote cast
                    </span>
                )}
            </div>

            <ul className="flex flex-col gap-3">
                {participants.map((p, i) => {
                    const uniId = p.universityResponse.id
                    const isVoted = votedId === uniId
                    let rankColor = 'text-[var(--text-primary)] opacity-20'
                    if (i === 0) rankColor = 'text-yellow-500'
                    else if (i === 1) rankColor = 'text-zinc-400'
                    else if (i === 2) rankColor = 'text-amber-600'

                    return (
                        <li
                            key={uniId}
                            className={`bg-[var(--bg-side)] border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm transition-all duration-200 
                                ${isVoted ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/5 shadow-[var(--accent-purple)]/10' : 'border-[var(--border-color)] hover:border-[var(--text-primary)]/20'}`}
                        >
                            <span className={`text-xl font-black w-8 flex-shrink-0 tabular-nums ${rankColor}`}>
                                #{p.rank}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-[var(--text-primary)] text-sm truncate">
                                    {p.universityResponse.name}
                                </p>
                            </div>
                            <span className="text-xs font-bold text-[var(--text-primary)] opacity-40 flex-shrink-0 tabular-nums">
                                {p.totalVotes.toLocaleString()} votes
                            </span>
                            <button
                                onClick={() => handleVote(uniId)}
                                disabled={isProcessingVote}
                                className={`flex-shrink-0 text-xs font-black tracking-wide px-4 py-1.5 rounded-xl border transition-all duration-200 min-w-[64px] text-center 
                                    ${isVoted ? 'border-green-500/50 bg-green-500/10 text-green-500 cursor-default' : isProcessingVote ? 'border-[var(--border-color)] text-[var(--text-primary)] opacity-20 cursor-not-allowed' : 'border-[var(--accent-purple)] text-[var(--accent-purple)] hover:bg-[var(--accent-purple)] hover:text-white active:scale-95'}`}
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