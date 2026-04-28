import type { ScheduleMatchResponse } from '../types/scheduleMatch'

type Props = {
    match: ScheduleMatchResponse
    onClick: (match: ScheduleMatchResponse) => void
}

export default function UpcomingMatchItem({ match, onClick }: Props) {
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
            {/* Clock icon indicator */}
            <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-purple-50 border border-purple-100
                             flex items-center justify-center text-purple-500 text-sm font-black">
                ⏰
            </span>

            <div className="flex-1 min-w-0">
                <p className="font-black text-zinc-800 text-sm truncate group-hover:text-purple-700 transition-colors">
                    {match.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-zinc-400">
                    <span>Starts {fmt(match.startTime)}</span>
                </div>
            </div>

            <span className="flex-shrink-0 text-[10px] font-black tracking-widest uppercase
                             text-purple-600 bg-purple-50 border border-purple-200
                             px-2.5 py-1 rounded-lg">
                Soon
            </span>

            <span className="flex-shrink-0 text-zinc-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all text-lg">
                →
            </span>
        </button>
    )
}