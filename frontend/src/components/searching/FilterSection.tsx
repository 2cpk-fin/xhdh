import React from 'react';
import { Filter } from 'lucide-react';

interface FilterSectionProps {
    tags: string[];
    activeTag: string | null;
    onSelectTag: (tag: string | null) => void;
    isDark: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ tags, activeTag, onSelectTag, isDark }) => {
    const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-200';
    const unselectedBg = isDark ? 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200' : 'bg-white text-zinc-500 hover:text-zinc-800';

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            {/* Scrollable container for smaller screens */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">

                {/* 'All Results' Button */}
                <button
                    onClick={() => onSelectTag(null)}
                    className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap border ${
                        activeTag === null
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
                            : `${unselectedBg} ${borderColor}`
                    }`}
                >
                    All Results
                </button>

                {/* Dynamic Tag Buttons */}
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => onSelectTag(tag)}
                        className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap border ${
                            activeTag === tag
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
                                : `${unselectedBg} ${borderColor}`
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Filter Icon Button (Right side) */}
            <button className={`p-2.5 rounded-full border transition-colors ${unselectedBg} ${borderColor} hidden md:block`}>
                <Filter className="w-4 h-4" />
            </button>
        </div>
    );
};

export default FilterSection;