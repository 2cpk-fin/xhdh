import { Trophy } from 'lucide-react'
import type { UniversityResponse } from '../types/university'

type Props = {
    university: UniversityResponse
}

export default function UniversityBox({ university }: Props) {
    return (
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-zinc-800 text-sm group-hover:text-purple-700 transition-colors truncate">
                        {university.name}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 shrink-0">
                        {university.abbreviation}
                    </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {university.tags.map(tag => (
                        <span
                            key={tag.id}
                            className="px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 text-xs font-bold"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-1.5 ml-4 shrink-0">
                <Trophy className="w-4 h-4 text-green-500" />
                <span className="text-lg font-black text-green-600">
                    {university.elo}
                </span>
            </div>
        </div>
    )
}