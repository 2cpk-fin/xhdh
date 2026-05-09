import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../../../../api/scheduleMatchApi'
import type { ScheduleMatchResponse } from '../../../../types/scheduleMatch'
import PendingMatchItem from './PendingMatchItem'
import LeaderboardSection from '../LeaderboardSection'
import CommentSection from '../commentSection/CommentSection'
import { ArrowLeft, PlayCircle, StopCircle, Radio } from 'lucide-react'

type Props = {
    hidden?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}

export default function PendingMatchSection({ hidden, onToggle }: Props = {}) {
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

    if (hidden) return null;

    const handleSelect = (match: ScheduleMatchResponse) => {
        setSelected(match);
        if (onToggle) onToggle(true);
    };

    const handleBack = () => {
        setSelected(null);
        if (onToggle) onToggle(false);
    };

    // ── Detail view ──────────────────────────────────────────────────────────
    if (selected) {
        return (
            <div className="animate-fadeUp">
                <button
                    onClick={handleBack}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--text-primary)] opacity-40
                               hover:text-[var(--accent-purple)] hover:opacity-100 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="mb-8 pb-6 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-1">
                        <Radio className="w-4 h-4 text-green-500 animate-pulse" />
                        <span className="text-xs font-black tracking-widest uppercase text-green-600 dark:text-green-400">
                            Live
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-[var(--text-primary)] mb-2">{selected.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-[var(--text-primary)] opacity-40">
                        <span className="flex items-center gap-1.5">
                            <PlayCircle className="w-4 h-4" /> {new Date(selected.startTime).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <StopCircle className="w-4 h-4" /> {new Date(selected.endTime).toLocaleString()}
                        </span>
                    </div>
                </div>

                <LeaderboardSection publicMatchId={selected.publicMatchId} />

                <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
                    <CommentSection matchId={selected.id} />
                </div>
            </div>
        )
    }

    // ── List view ────────────────────────────────────────────────────────────
    return (
        <section>
            <div className="flex items-center gap-2 mb-6">
                <Radio className="w-6 h-6 text-green-500 animate-pulse" />
                <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Live Now</h2>
            </div>

            {loading && (
                <p className="text-sm font-medium text-[var(--text-primary)] opacity-40 py-8">Loading matches…</p>
            )}
            {error && (
                <p className="text-sm font-medium text-red-500 py-8">{error}</p>
            )}
            {!loading && !error && matches.length === 0 && (
                <div className="bg-[var(--bg-side)] border border-[var(--border-color)] rounded-2xl px-6 py-12 text-center shadow-sm">
                    <p className="text-sm font-bold text-[var(--text-primary)] opacity-40">No matches are live right now.</p>
                    <p className="text-xs text-[var(--text-primary)] opacity-20 mt-1">Check back soon!</p>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {matches.map(match => (
                    <PendingMatchItem
                        key={match.publicMatchId}
                        match={match}
                        onClick={handleSelect}
                    />
                ))}
            </div>
        </section>
    )
}