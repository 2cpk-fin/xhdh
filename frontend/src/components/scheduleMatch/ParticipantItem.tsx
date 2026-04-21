import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { ScheduleParticipantResponse } from '../../types/ScheduleMatch';

interface ParticipantItemProps {
    participant: ScheduleParticipantResponse;
    isDark: boolean;
    onVote: (universityName: string) => void;
}

const ParticipantItem: React.FC<ParticipantItemProps> = ({ participant, isDark, onVote }) => {
    const itemBg = isDark ? 'bg-zinc-800/40 border-zinc-700' : 'bg-white border-zinc-200';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';

    // Determine medal colors for top 3
    const getRankBadge = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'; // Gold
            case 2: return 'bg-slate-400/20 text-slate-500 border-slate-400/30'; // Silver
            case 3: return 'bg-orange-700/20 text-orange-700 border-orange-700/30'; // Bronze
            default: return isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-500 border-zinc-200';
        }
    };

    return (
        <div className={`flex items-center justify-between p-4 rounded-lg border shadow-sm transition-all hover:scale-[1.01] ${itemBg}`}>
            <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold ${getRankBadge(participant.rank)}`}>
                    {participant.rank}
                </div>
                <div>
                    <h4 className={`font-semibold ${textColor}`}>{participant.universityName}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-purple-500 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        <span>{participant.totalVotes.toLocaleString()} votes</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onVote(participant.universityName)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow transition-colors active:scale-95"
            >
                Vote
            </button>
        </div>
    );
};

export default ParticipantItem;