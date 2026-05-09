import type { UniversityResponse } from '../../../types/university'

type Props = {
    university: UniversityResponse
    rank: number
}

const rankStyle: Record<number, { badge: string; border: string; text: string }> = {
    1: {
        badge: 'bg-yellow-400 text-yellow-900 shadow-sm shadow-yellow-200',
        border: 'border-yellow-300 hover:border-yellow-400',
        text: 'group-hover:text-yellow-600',
    },
    2: {
        badge: 'bg-zinc-300 text-zinc-700 shadow-sm shadow-zinc-200',
        border: 'border-zinc-300 hover:border-zinc-400',
        text: 'group-hover:text-zinc-500',
    },
    3: {
        badge: 'bg-amber-600 text-amber-100 shadow-sm shadow-amber-200',
        border: 'border-amber-400 hover:border-amber-500',
        text: 'group-hover:text-amber-700',
    },
}

// Helper to format tags: SOCIAL_MEDIA -> Social Media
const formatTag = (tag: string) => {
    return tag
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export default function UniversityBox({ university, rank }: Props) {
    const style = rankStyle[rank]

    return (
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all group ${style?.border ?? 'border-zinc-200 hover:border-purple-300'}`}>
            <div className="flex items-center gap-4 min-w-0">
                <span className={`text-xs font-black w-7 shrink-0 tabular-nums text-center rounded-lg px-1.5 py-0.5 ${style?.badge ?? 'text-zinc-400'}`}>
                    #{rank}
                </span>
                <div className="min-w-0">
                    <p className={`text-sm font-black text-zinc-800 truncate transition-colors ${style?.text ?? 'group-hover:text-purple-700'}`}>
                        {university.name}
                    </p>
                    <p className="text-xs text-zinc-400 font-medium">{university.abbreviation}</p>
                </div>
                {university.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap ml-2">
                        {university.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 text-xs font-bold"
                            >
                                {formatTag(tag)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
                <span className="text-lg font-black text-zinc-700">{university.elo}</span>
                <span className="text-xs text-zinc-400 font-medium">ELO</span>
            </div>
        </div>
    )
}