import type { UniversityResponse } from '../../../types/university'

type Props = {
    university: UniversityResponse
    rank: number
}

const formatTag = (tag: string) => {
    return tag
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

const rankStyle: Record<number, { badge: string; border: string; text: string }> = {
    1: {
        badge: 'bg-yellow-400 dark:bg-yellow-500/20 text-yellow-900 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/40',
        border: 'border-yellow-300 dark:border-yellow-500/30 hover:border-yellow-400',
        text: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400',
    },
    2: {
        badge: 'bg-zinc-300 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/40',
        border: 'border-zinc-300 dark:border-zinc-500/30 hover:border-zinc-400',
        text: 'group-hover:text-zinc-500 dark:group-hover:text-zinc-400',
    },
    3: {
        badge: 'bg-amber-600 dark:bg-amber-500/20 text-white dark:text-amber-400 border border-amber-500/40',
        border: 'border-amber-400 dark:border-amber-500/30 hover:border-amber-500',
        text: 'group-hover:text-amber-700 dark:group-hover:text-amber-400',
    },
}

export default function UniversityBox({ university, rank }: Props) {
    const style = rankStyle[rank]

    return (
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[var(--bg-side)] border transition-all group 
            ${style?.border ?? 'border-[var(--border-color)] hover:border-[var(--accent-purple)]'}`}>
            <div className="flex items-center gap-4 min-w-0">
                <span className={`text-xs font-black w-7 shrink-0 tabular-nums text-center rounded-lg px-1.5 py-0.5 
                    ${style?.badge ?? 'text-[var(--text-primary)] opacity-40 bg-[var(--text-primary)]/5'}`}>
                    #{rank}
                </span>
                <div className="min-w-0">
                    <p className={`text-sm font-black text-[var(--text-primary)] truncate transition-colors 
                        ${style?.text ?? 'group-hover:text-[var(--accent-purple)]'}`}>
                        {university.name}
                    </p>
                    <p className="text-xs text-[var(--text-primary)] opacity-40 font-medium">{university.abbreviation}</p>
                </div>
                {university.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap ml-2">
                        {university.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-lg bg-[var(--accent-purple)]/5 border border-[var(--accent-purple)]/20 text-[var(--accent-purple)] text-xs font-bold"
                            >
                                {formatTag(tag)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
                <span className="text-lg font-black text-[var(--text-primary)]">{university.elo}</span>
                <span className="text-xs text-[var(--text-primary)] opacity-40 font-medium">ELO</span>
            </div>
        </div>
    )
}