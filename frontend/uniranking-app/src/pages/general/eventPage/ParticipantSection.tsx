import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../../../api/scheduleMatchApi'
import type { ScheduleParticipantResponse } from '../../../types/scheduleMatch'

type Props = {
    matchId: number
    /** 'upcoming' shows rank as TBD; 'finished' shows final rank + votes prominently */
    mode: 'upcoming' | 'finished'
}

export default function ParticipantSection({ matchId, mode }: Props) {
    const [participants, setParticipants] = useState<ScheduleParticipantResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        scheduleMatchApi.getMatchParticipants(matchId)
            .then(setParticipants)
            .catch(() => setError('Failed to load participants.'))
            .finally(() => setLoading(false))
    }, [matchId])

    if (loading) return <p className="text-sm font-medium text-zinc-400 py-8">Loading participants…</p>
    if (error) return <p className="text-sm font-medium text-red-500 py-8">{error}</p>

    // Sort by rank for finished, keep insertion order for upcoming
    const sorted = mode === 'finished'
        ? [...participants].sort((a, b) => a.rank - b.rank)
        : participants

    return (
        <section>
            <h2 className="text-xl font-black text-zinc-800 tracking-tight mb-5">
                {mode === 'finished' ? 'Final Results' : 'Participants'}
            </h2>

            <ul className="flex flex-col gap-3">
                {sorted.map((p, i) => {
                    const isFirst = mode === 'finished' && p.rank === 1
                    const isSecond = mode === 'finished' && p.rank === 2
                    const isThird = mode === 'finished' && p.rank === 3

                    const medalColor = isFirst ? 'text-yellow-500'
                        : isSecond ? 'text-zinc-400'
                            : isThird ? 'text-amber-600'
                                : 'text-zinc-300'

                    const rowBorder = isFirst
                        ? 'border-yellow-200 bg-yellow-50/40'
                        : 'border-zinc-200 hover:border-zinc-300'

                    return (
                        <li
                            key={p.universityResponse.id}
                            className={`bg-white border rounded-2xl px-5 py-4
                                        flex items-center gap-4 shadow-sm transition-all duration-200
                                        ${rowBorder}`}
                        >
                            {/* Rank / index */}
                            <span className={`text-xl font-black w-8 flex-shrink-0 tabular-nums ${medalColor}`}>
                                {mode === 'finished' ? `#${p.rank}` : `${i + 1}`}
                            </span>

                            {/* University name */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-zinc-800 text-sm truncate">
                                    {p.universityResponse.name}
                                </p>
                                {mode === 'finished' && (
                                    <p className="text-xs font-medium text-zinc-400 mt-0.5">
                                        {p.totalVotes.toLocaleString()} votes
                                    </p>
                                )}
                            </div>

                            {/* Badge */}
                            {mode === 'finished' ? (
                                isFirst && (
                                    <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase
                                                     text-yellow-600 bg-yellow-50 border border-yellow-200
                                                     px-2.5 py-1 rounded-lg">
                                        Winner
                                    </span>
                                )
                            ) : (
                                <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase
                                                 text-purple-500 bg-purple-50 border border-purple-100
                                                 px-2.5 py-1 rounded-lg">
                                    Competing
                                </span>
                            )}
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}