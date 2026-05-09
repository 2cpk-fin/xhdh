import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../../../api/scheduleMatchApi'
import type { ScheduleParticipantResponse } from '../../../types/scheduleMatch'

type Props = {
    matchId: number
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

    if (loading) return <p className="text-sm font-medium text-[var(--text-primary)] opacity-40 py-8">Loading participants…</p>
    if (error) return <p className="text-sm font-medium text-red-500 py-8">{error}</p>

    const sorted = mode === 'finished' ? [...participants].sort((a, b) => a.rank - b.rank) : participants

    return (
        <section>
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-5">
                {mode === 'finished' ? 'Final Results' : 'Participants'}
            </h2>
            <ul className="flex flex-col gap-3">
                {sorted.map((p, i) => {
                    const isFirst = mode === 'finished' && p.rank === 1
                    const isSecond = mode === 'finished' && p.rank === 2
                    const isThird = mode === 'finished' && p.rank === 3
                    const medalColor = isFirst ? 'text-yellow-500' : isSecond ? 'text-zinc-400' : isThird ? 'text-amber-600' : 'text-[var(--text-primary)] opacity-20'
                    const rowBorder = isFirst ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-[var(--border-color)] hover:border-[var(--text-primary)]/20'

                    return (
                        <li key={p.universityResponse.id} className={`bg-[var(--bg-side)] border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm transition-all duration-200 ${rowBorder}`}>
                            <span className={`text-xl font-black w-8 flex-shrink-0 tabular-nums ${medalColor}`}>
                                {mode === 'finished' ? `#${p.rank}` : `${i + 1}`}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-[var(--text-primary)] text-sm truncate">{p.universityResponse.name}</p>
                                {mode === 'finished' && <p className="text-xs font-medium text-[var(--text-primary)] opacity-40 mt-0.5">{p.totalVotes.toLocaleString()} votes</p>}
                            </div>
                            {mode === 'finished' ? (
                                isFirst && <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-lg">Winner</span>
                            ) : (
                                <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase text-[var(--accent-purple)] dark:text-[#e879f9] bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/20 px-2.5 py-1 rounded-lg">Competing</span>
                            )}
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}