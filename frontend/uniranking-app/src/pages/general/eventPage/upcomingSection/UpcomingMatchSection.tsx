import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../../../../api/scheduleMatchApi'
import type { ScheduleMatchResponse } from '../../../../types/scheduleMatch'
import UpcomingMatchItem from './UpcomingMatchItem'
import ParticipantSection from '../ParticipantSection'
import CommentSection from '../commentSection/CommentSection'
import { ArrowLeft, PlayCircle, StopCircle, CalendarClock } from 'lucide-react'

type Props = {
    hidden?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}

export default function UpcomingMatchSection({ hidden, onToggle }: Props = {}) {
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

    if (hidden) return null;

    const handleSelect = (match: ScheduleMatchResponse) => {
        setSelected(match);
        if (onToggle) onToggle(true);
    };

    const handleBack = () => {
        setSelected(null);
        if (onToggle) onToggle(false);
    };

    if (selected) {
        return (
            <div className="animate-fadeUp">
                <button
                    onClick={handleBack}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold
                               text-zinc-400 hover:text-purple-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="mb-8 pb-6 border-b border-zinc-200">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black tracking-widest uppercase text-purple-500">
                            Upcoming
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-zinc-800 mb-2">{selected.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <PlayCircle className="w-4 h-4" /> Starts {new Date(selected.startTime).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <StopCircle className="w-4 h-4" /> Ends {new Date(selected.endTime).toLocaleString()}
                        </span>
                    </div>
                </div>

                <ParticipantSection matchId={selected.id} mode="upcoming" />

                <div className="mt-10 pt-8 border-t border-zinc-200">
                    <CommentSection matchId={selected.id} />
                </div>
            </div>
        )
    }

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="w-5 h-5 text-purple-500" />
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
                        onClick={handleSelect}
                    />
                ))}
            </div>
        </section>
    )
}