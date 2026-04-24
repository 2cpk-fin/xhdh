import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { tagApi } from '../apis/tagApi'
import type { TagResponse } from '../types/tag'

type Props = {
    onSearch: (input: string, tagIds: number[]) => void
}

export default function SearchBox({ onSearch }: Props) {
    const [value, setValue] = useState('')
    const [tags, setTags] = useState<TagResponse[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

    useEffect(() => {
        tagApi.getAllTags().then(setTags).catch(console.error)
    }, [])

    const toggleTag = (id: number) => {
        setSelectedTagIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(value.trim(), selectedTagIds)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search universities..."
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm transition"
                    />
                </div>
                <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                    Search
                </button>
            </div>

            {tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {tags.map(tag => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${selectedTagIds.includes(tag.id)
                                    ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200'
                                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-purple-300 hover:text-purple-600'
                                }`}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            )}
        </form>
    )
}