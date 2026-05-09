import type { ScheduleMatchResponse } from '../../../../types/scheduleMatch'
import { Trophy, ChevronRight } from 'lucide-react'

type Props = {
    match: ScheduleMatchResponse
    onClick: (match: ScheduleMatchResponse) => void
}

export default function FinishedMatchItem({ match, onClick }: Props) {
    const fmt = (iso: string) =>
        new Date(iso).toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })

    return (
        <button
            onClick={() => onClick(match)}
            className="w-full text-left bg-[var(--bg-side)] border border-[var(--border-color)] rounded-2xl px-5 py-4
                       flex items-center gap-4 shadow-sm
                       hover:border-[var(--accent-purple)] hover:shadow-md hover:bg-[var(--text-primary)]/5
                       active:scale-[0.99] transition-all duration-200 group"
        >
            {/* Trophy icon */}
            <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]
                             flex items-center justify-center text-[var(--text-primary)] opacity-40">
                <Trophy className="w-4 h-4" />
            </span>

            <div className="flex-1 min-w-0">
                <p className="font-black text-[var(--text-primary)] opacity-60 text-sm truncate group-hover:opacity-100 transition-opacity">
                    {match.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-[var(--text-primary)] opacity-30">
                    <span>Ended {fmt(match.endTime)}</span>
                </div>
            </div>

            <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase
                             text-[var(--text-primary)] opacity-40 bg-[var(--bg-main)] border border-[var(--border-color)]
                             px-2.5 py-1 rounded-lg">
                Ended
            </span>

            <span className="flex-shrink-0 text-[var(--text-primary)] opacity-20 group-hover:opacity-60 group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
            </span>
        </button>
    )
}