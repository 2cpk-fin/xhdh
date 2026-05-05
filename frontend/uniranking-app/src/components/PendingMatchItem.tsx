import type { ScheduleMatchResponse } from '../types/scheduleMatch'
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
            className="w-full text-left bg-white border border-zinc-200 rounded-2xl px-5 py-4
                       flex items-center gap-4 shadow-sm
                       hover:border-purple-300 hover:shadow-md hover:bg-purple-50/40
                       active:scale-[0.99] transition-all duration-200 group"
        >
            {/* Live icon */}
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                <Radio className="w-5 h-5 text-green-500 animate-pulse" />
            </span>

            {/* Body */}
            <div className="flex-1 min-w-0">
                <p className="font-black text-zinc-800 text-base truncate group-hover:text-purple-700 transition-colors">
                    {match.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-zinc-400">
                    <span className="flex items-center gap-1">
                        <PlayCircle className="w-3.5 h-3.5" />
                        {fmt(match.startTime)}
                    </span>
                    <span className="text-zinc-300">—</span>
                    <span className="flex items-center gap-1">
                        <StopCircle className="w-3.5 h-3.5" />
                        {fmt(match.endTime)}
                    </span>
                </div>
            </div>

            {/* LIVE badge */}
            <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase
                             text-green-600 bg-green-50 border border-green-200
                             px-2.5 py-1 rounded-lg">
                Live
            </span>

            {/* Arrow */}
            <span className="flex-shrink-0 text-zinc-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
            </span>
        </button>
    )
}