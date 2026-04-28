import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../api/scheduleMatchApi'
import type { ScheduleMatchResponse } from '../types/scheduleMatch'
import PendingMatchItem from './PendingMatchItem'
import LeaderboardSection from './LeaderboardSection'
import CommentSection from './CommentSection'

export default function PendingMatchSection() {
    const [matches, setMatches] = useState<ScheduleMatchResponse[]>([])
    const [selected, setSelected] = useState<ScheduleMatchResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        scheduleMatchApi.getScheduledPendingMatches()
            .then(setMatches)
            .catch(() => setError('Failed to load matches.'))
            .finally(() => setLoading(false))
    }, [])

    // ── Detail view ──────────────────────────────────────────────────────────
    if (selected) {
        return (
            <div className="animate-fadeUp">
                <button
                    onClick={() => setSelected(null)}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-zinc-400
                               hover:text-purple-600 transition-colors"
                >
                    ← Back
                </button>

                <div className="mb-8 pb-6 border-b border-zinc-200">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="relative flex-shrink-0">
                            <span className="block w-2.5 h-2.5 rounded-full bg-green-500" />
                            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
                        </span>
                        <span className="text-xs font-black tracking-widest uppercase text-green-600">
                            Live
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-800 mb-2">{selected.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
                        <span>▶ {new Date(selected.startTime).toLocaleString()}</span>
                        <span>⏹ {new Date(selected.endTime).toLocaleString()}</span>
                    </div>
                </div>

                <LeaderboardSection publicMatchId={selected.publicMatchId} />

                {/* Comments integrated below Leaderboard */}
                <div className="mt-10 pt-8 border-t border-zinc-200">
                    {/* Assuming selected has an 'id' property of type number for CommentSection */}
                    <CommentSection matchId={selected.id} />
                </div>
            </div>
        )
    }

    // ── List view ────────────────────────────────────────────────────────────
    return (
        <section>
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-6">
                <span className="relative flex-shrink-0">
                    <span className="block w-3 h-3 rounded-full bg-green-500" />
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
                </span>
                <h2 className="text-2xl font-black text-zinc-800 tracking-tight">Live Now</h2>
            </div>

            {loading && (
                <p className="text-sm font-medium text-zinc-400 py-8">Loading matches…</p>
            )}
            {error && (
                <p className="text-sm font-medium text-red-500 py-8">{error}</p>
            )}
            {!loading && !error && matches.length === 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl px-6 py-12 text-center shadow-sm">
                    <p className="text-sm font-bold text-zinc-400">No matches are live right now.</p>
                    <p className="text-xs text-zinc-300 mt-1">Check back soon!</p>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {matches.map(match => (
                    <PendingMatchItem
                        key={match.publicMatchId}
                        match={match}
                        onClick={setSelected}
                    />
                ))}
            </div>
        </section>
    )
}