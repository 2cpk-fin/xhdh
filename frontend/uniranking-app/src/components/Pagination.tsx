import { memo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
    currentPage: number // 0-indexed to match your API
    totalPages: number
    onPageChange: (page: number) => void
    disabled?: boolean
}

const Pagination = memo(({ currentPage, totalPages, onPageChange, disabled }: Props) => {
    if (totalPages <= 1) return null

    // Convert to 1-indexed for the UI logic
    const current = currentPage + 1

    const getVisiblePages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // Near the beginning
        if (current <= 3) {
            return [1, 2, 3, 4, '...', totalPages]
        }

        // Near the end
        if (current >= totalPages - 2) {
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        }

        // In the middle
        return [1, '...', current - 1, current, current + 1, '...', totalPages]
    }

    return (
        <div className="flex items-center justify-center gap-2 pt-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0 || disabled}
                className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {getVisiblePages().map((p, i) => {
                if (p === '...') {
                    return (
                        <span key={`ellipsis-${i}`} className="px-1 text-zinc-400 font-black tracking-widest">
                            ...
                        </span>
                    )
                }

                const pageNumber = p as number
                const isCurrent = pageNumber === current

                return (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber - 1)}
                        disabled={disabled}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-black border transition-all shadow-sm ${isCurrent
                                ? 'bg-purple-600 border-purple-600 text-white'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed'
                            }`}
                    >
                        {pageNumber}
                    </button>
                )
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || disabled}
                className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    )
})

Pagination.displayName = 'Pagination'
export default Pagination