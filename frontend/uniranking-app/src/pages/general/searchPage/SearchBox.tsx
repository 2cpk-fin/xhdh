import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { universityApi } from '../../../api/universityApi'

type Props = {
    onSearch: (input: string, tags: string[]) => void
}

// Helper to format tags: SOCIAL_MEDIA -> Social Media
const formatTag = (tag: string) => {
    return tag
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export default function SearchBox({ onSearch }: Props) {
    const [value, setValue] = useState('')
    const [availableTags, setAvailableTags] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    useEffect(() => {
        universityApi.getAllTags().then(setAvailableTags).catch(console.error)
    }, [])

    const toggleTag = (tagName: string) => {
        setSelectedTags(prev =>
            prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(value.trim(), selectedTags)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)] opacity-40" />
                    <input
                        type="text"
                        placeholder="Search universities..."
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-color)] 
                        bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-primary)]/40 
                        focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]/50 transition"
                    />
                </div>
                <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-[var(--accent-purple)] hover:opacity-90 text-white text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                    Search
                </button>
            </div>

            {availableTags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${selectedTags.includes(tag)
                                    ? 'bg-green-500 border-green-500 text-white dark:bg-green-600'
                                    : 'bg-[var(--bg-side)] border-[var(--border-color)] text-[var(--text-primary)] opacity-60 hover:border-[var(--accent-purple)]'
                                }`}
                        >
                            {formatTag(tag)}
                        </button>
                    ))}
                </div>
            )}
        </form>
    )
}