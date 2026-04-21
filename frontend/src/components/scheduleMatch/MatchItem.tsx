import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import type { ScheduleMatchResponse } from '../../types/ScheduleMatch';

interface MatchItemProps {
    match: ScheduleMatchResponse;
    isDark: boolean;
    onClick: (matchId: string) => void;
}

const MatchItem: React.FC<MatchItemProps> = ({ match, isDark, onClick }) => {
    const cardBg = isDark ? 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80' : 'bg-white border-zinc-200 hover:bg-zinc-50';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

    // Format date to look clean (e.g., "Oct 24, 2026")
    const startDate = new Date(match.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div
            onClick={() => onClick(match.publicMatchId)}
            className={`p-5 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-200 group flex items-center justify-between shadow-sm ${cardBg}`}
        >
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            {match.status}
          </span>
                    <span className={`text-xs font-medium ${subTextColor}`}>ID: {match.publicMatchId.substring(0, 8)}...</span>
                </div>

                <h3 className={`text-lg font-bold tracking-tight ${textColor}`}>
                    {match.title}
                </h3>

                <div className={`flex items-center gap-4 text-sm ${subTextColor}`}>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{startDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Ends: {new Date(match.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>

            <div className={`p-2 rounded-full transition-colors ${isDark ? 'group-hover:bg-zinc-700' : 'group-hover:bg-zinc-200'}`}>
                <ChevronRight className={`w-5 h-5 ${subTextColor} group-hover:text-purple-500 transition-colors`} />
            </div>
        </div>
    );
};

export default MatchItem;