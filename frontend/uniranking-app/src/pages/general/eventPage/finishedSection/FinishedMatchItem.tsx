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
            className="w-full text-left bg-white border border-zinc-200 rounded-2xl px-5 py-4
                       flex items-center gap-4 shadow-sm
                       hover:border-zinc-300 hover:shadow-md hover:bg-zinc-50
                       active:scale-[0.99] transition-all duration-200 group"
        >
            {/* Trophy icon */}
            <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200
                             flex items-center justify-center text-zinc-500">
                <Trophy className="w-4 h-4" />
            </span>

            <div className="flex-1 min-w-0">
                <p className="font-black text-zinc-600 text-sm truncate group-hover:text-zinc-800 transition-colors">
                    {match.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-zinc-400">
                    <span>Ended {fmt(match.endTime)}</span>
                </div>
            </div>

            <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase
                             text-zinc-400 bg-zinc-100 border border-zinc-200
                             px-2.5 py-1 rounded-lg">
                Ended
            </span>

            <span className="flex-shrink-0 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
            </span>
        </button>
    )
}