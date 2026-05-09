import { useEffect, useState } from 'react'
import { scheduleMatchApi } from '../../../../api/scheduleMatchApi'
import type { ScheduleMatchResponse } from '../../../../types/scheduleMatch'
import FinishedMatchItem from './FinishedMatchItem'
import ParticipantSection from '../ParticipantSection'
import CommentSection from '../commentSection/CommentSection'
import { ArrowLeft, PlayCircle, StopCircle, Trophy } from 'lucide-react'

type Props = {
    hidden?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}

export default function FinishedMatchSection({ hidden, onToggle }: Props = {}) {
    const [matches, setMatches] = useState<ScheduleMatchResponse[]>([])
    const [selected, setSelected] = useState<ScheduleMatchResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        scheduleMatchApi.getScheduledFinishedMatches()
            .then(setMatches)
            .catch(() => setError('Failed to load finished matches.'))
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
                               text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="mb-8 pb-6 border-b border-zinc-200">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black tracking-widest uppercase text-zinc-400">
                            Finished
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-zinc-800 mb-2">{selected.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <PlayCircle className="w-4 h-4" /> Started {new Date(selected.startTime).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <StopCircle className="w-4 h-4" /> Ended {new Date(selected.endTime).toLocaleString()}
                        </span>
                    </div>
                </div>

                <ParticipantSection matchId={selected.id} mode="finished" />

                <div className="mt-10 pt-8 border-t border-zinc-200">
                    <CommentSection matchId={selected.id} />
                </div>
            </div>
        )
    }

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-zinc-400" />
                <h2 className="text-lg font-black text-zinc-800 tracking-tight">Recent Results</h2>
            </div>

            {loading && <p className="text-sm font-medium text-zinc-400 py-4">Loading…</p>}
            {error && <p className="text-sm font-medium text-red-500 py-4">{error}</p>}
            {!loading && !error && matches.length === 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-8 text-center shadow-sm">
                    <p className="text-sm font-bold text-zinc-400">No finished matches yet.</p>
                </div>
            )}

            <div className="flex flex-col gap-2.5">
                {matches.map(match => (
                    <FinishedMatchItem
                        key={match.publicMatchId}
                        match={match}
                        onClick={handleSelect}
                    />
                ))}
            </div>
        </section>
    )
}