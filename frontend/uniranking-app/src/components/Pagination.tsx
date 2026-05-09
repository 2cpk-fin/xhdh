import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
};

const Pagination = memo(({ currentPage, totalPages, onPageChange, disabled }: Props) => {
    if (totalPages <= 1) return null;

    const current = currentPage + 1;

    const getVisiblePages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', totalPages];
        if (current >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', current - 1, current, current + 1, '...', totalPages];
    };

    const navButtonClass = "p-2 rounded-xl transition-all duration-200 border border-[var(--border-color)] bg-[var(--bg-side)] text-[var(--text-primary)] opacity-80 hover:opacity-100 hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)] disabled:opacity-30 disabled:cursor-not-allowed";

    return (
        <div className="flex items-center justify-center gap-2 pt-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0 || disabled}
                className={navButtonClass}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {getVisiblePages().map((p, i) => {
                if (p === '...') {
                    return (
                        <span key={`ellipsis-${i}`} className="px-1 text-xs font-black tracking-widest text-[var(--text-primary)] opacity-40">
                            ...
                        </span>
                    );
                }

                const pageNumber = p as number;
                const isCurrent = pageNumber === current;

                return (
                    <button
                        key={pageNumber}
                        onClick={() => !isCurrent && onPageChange(pageNumber - 1)}
                        disabled={disabled}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-black transition-all duration-200 
                            ${isCurrent
                                ? 'bg-[var(--accent-purple)] text-white dark:text-[#e879f9] dark:bg-[var(--accent-purple)]/20 border border-[var(--accent-purple)] shadow-lg dark:shadow-[0_0_16px_rgba(192,38,211,0.25)]'
                                : 'bg-[var(--bg-side)] border border-[var(--border-color)] text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:border-[var(--accent-purple)]'
                            }`}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || disabled}
                className={navButtonClass}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
});

Pagination.displayName = 'Pagination';
export default Pagination;