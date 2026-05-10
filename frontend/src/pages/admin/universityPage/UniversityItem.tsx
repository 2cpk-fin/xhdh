import { Trophy, Settings } from 'lucide-react'
import type { UniversityResponse } from '../../../types/university'

type Props = {
    university: UniversityResponse
    onClick: () => void
}

const formatTag = (tag: string) => {
    return tag
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export default function UniversityControlledItem({ university, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-[var(--bg-side)] border border-[var(--border-color)] shadow-sm hover:shadow-md hover:border-[var(--accent-purple)] cursor-pointer transition-all active:scale-[0.99]"
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-[var(--text-primary)] text-sm group-hover:text-[var(--accent-purple)] transition-colors truncate">
                        {university.name}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] opacity-30 shrink-0">
                        {university.abbreviation}
                    </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {university.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded-lg bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/20 text-[var(--accent-purple)] dark:text-[#e879f9] text-xs font-bold"
                        >
                            {formatTag(tag)}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-3 ml-4 shrink-0">
                <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span className="text-lg font-black text-green-600">{university.elo}</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--bg-main)] text-[var(--text-primary)] opacity-40 group-hover:bg-[var(--accent-purple)]/10 group-hover:text-[var(--accent-purple)] transition-colors">
                    <Settings size={16} />
                </div>
            </div>
        </div>
    )
}