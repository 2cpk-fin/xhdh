import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../api/scheduleMatchApi'
import type { ScheduleMatchResponse } from '../types/scheduleMatch'
import UpcomingMatchItem from './UpcomingMatchItem'
import ParticipantSection from './ParticipantSection'

export default function UpcomingMatchSection() {
    const [matches, setMatches] = useState<ScheduleMatchResponse[]>([])
    const [selected, setSelected] = useState<ScheduleMatchResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        scheduleMatchApi.getScheduledMatchesNotStarted()
            .then(setMatches)
            .catch(() => setError('Failed to load upcoming matches.'))
            .finally(() => setLoading(false))
    }, [])

    if (selected) {
        return (
            <div>
                <button
                    onClick={() => setSelected(null)}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold
                               text-zinc-400 hover:text-purple-600 transition-colors"
                >
                    ← Back
                </button>

                <div className="mb-8 pb-6 border-b border-zinc-200">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black tracking-widest uppercase text-purple-500">
                            Upcoming
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-zinc-800 mb-2">{selected.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
                        <span>▶ Starts {new Date(selected.startTime).toLocaleString()}</span>
                        <span>⏹ Ends {new Date(selected.endTime).toLocaleString()}</span>
                    </div>
                </div>

                <ParticipantSection matchId={selected.id} mode="upcoming" />
            </div>
        )
    }

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 flex-shrink-0" />
                <h2 className="text-lg font-black text-zinc-800 tracking-tight">Upcoming</h2>
            </div>

            {loading && <p className="text-sm font-medium text-zinc-400 py-4">Loading…</p>}
            {error && <p className="text-sm font-medium text-red-500 py-4">{error}</p>}
            {!loading && !error && matches.length === 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-8 text-center shadow-sm">
                    <p className="text-sm font-bold text-zinc-400">No upcoming matches.</p>
                </div>
            )}

            <div className="flex flex-col gap-2.5">
                {matches.map(match => (
                    <UpcomingMatchItem
                        key={match.publicMatchId}
                        match={match}
                        onClick={setSelected}
                    />
                ))}
            </div>
        </section>
    )
}