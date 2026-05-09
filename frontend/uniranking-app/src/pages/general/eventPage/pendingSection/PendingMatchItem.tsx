import type { ScheduleMatchResponse } from '../../../../types/scheduleMatch'
import { Radio, ChevronRight, PlayCircle, StopCircle } from 'lucide-react'

type Props = {
    match: ScheduleMatchResponse
    onClick: (match: ScheduleMatchResponse) => void
}

export default function PendingMatchItem({ match, onClick }: Props) {
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
            {/* Live icon */}
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                <Radio className="w-5 h-5 text-green-500 animate-pulse" />
            </span>

            {/* Body */}
            <div className="flex-1 min-w-0">
                <p className="font-black text-[var(--text-primary)] text-base truncate group-hover:text-[var(--accent-purple)] transition-colors">
                    {match.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-[var(--text-primary)] opacity-40">
                    <span className="flex items-center gap-1">
                        <PlayCircle className="w-3.5 h-3.5" />
                        {fmt(match.startTime)}
                    </span>
                    <span className="opacity-40">—</span>
                    <span className="flex items-center gap-1">
                        <StopCircle className="w-3.5 h-3.5" />
                        {fmt(match.endTime)}
                    </span>
                </div>
            </div>

            {/* LIVE badge */}
            <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase
                             text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20
                             px-2.5 py-1 rounded-lg">
                Live
            </span>

            {/* Arrow */}
            <span className="flex-shrink-0 text-[var(--text-primary)] opacity-20 group-hover:text-[var(--accent-purple)] group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
            </span>
        </button>
    )
}