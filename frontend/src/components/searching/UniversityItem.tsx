import React from 'react';
import { School, TrendingUp, ChevronRight, Hash } from 'lucide-react';
import type { UniversityResponse } from '../../types/Searching'; // Adjust path if needed

interface UniversityItemProps {
    university: UniversityResponse;
    isDark: boolean;
    onViewProfile?: (id: string) => void;
}

const UniversityItem: React.FC<UniversityItemProps> = ({ university, isDark, onViewProfile }) => {
    const cardBg = isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

    const iconBg = isDark ? 'bg-purple-500/10' : 'bg-purple-50';
    const iconColor = 'text-purple-600';

    return (
        <div className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${cardBg}`}>

            {/* Left side: Icon & Info */}
            <div className="flex items-center gap-5">

                {/* University Logo / Icon Placeholder */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    <School className={`w-7 h-7 ${iconColor}`} />
                </div>

                {/* Text Info */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-lg font-extrabold tracking-tight ${textColor}`}>
                            {university.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
              {university.abbreviation}
            </span>
                    </div>

                    {/* Sub-info row (ELO & Tags) */}
                    <div className="flex items-center gap-4 text-xs font-semibold">
                        {/* ELO Score */}
                        <div className={`flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>ELO: {university.elo}</span>
                        </div>

                        {/* Display first 2 tags as pills */}
                        <div className="flex items-center gap-2">
                            {university.tags.slice(0, 2).map((tag, idx) => (
                                <div key={idx} className={`flex items-center px-2 py-0.5 rounded border uppercase text-[10px] tracking-wider ${isDark ? 'border-zinc-700 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                                    <Hash className="w-3 h-3 mr-0.5 opacity-70" />
                                    {tag}
                                </div>
                            ))}
                            {university.tags.length > 2 && (
                                <span className={`text-[10px] ${subTextColor}`}>+{university.tags.length - 2}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: View Profile Button */}
            <button
                onClick={() => onViewProfile && onViewProfile(university.id)}
                className={`w-full md:w-auto px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                    isDark
                        ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
            >
                View Profile
                <ChevronRight className="w-4 h-4" />
            </button>

        </div>
    );
};

export default UniversityItem;