import React from 'react';
import { Trophy } from 'lucide-react';
import ParticipantItem from './ParticipantItem';
import type { ScheduleParticipantResponse } from '../../types/ScheduleMatch';

interface LeaderboardSectionProps {
    participants: ScheduleParticipantResponse[];
    isDark: boolean;
    onVote: (universityName: string) => void;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ participants, isDark, onVote }) => {
    const sectionBg = isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/80 border-zinc-200';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';

    return (
        <div className={`rounded-2xl p-6 border shadow-sm backdrop-blur-md ${sectionBg}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <h2 className={`text-xl font-bold tracking-tight ${textColor}`}>Live Leaderboard</h2>
            </div>

            <div className="space-y-3">
                {participants.length > 0 ? (
                    participants.map((p) => (
                        <ParticipantItem
                            key={p.universityName} // Using name as key since ID might be null from Redis
                            participant={p}
                            isDark={isDark}
                            onVote={onVote}
                        />
                    ))
                ) : (
                    <p className="text-center py-8 text-zinc-500 text-sm">No votes have been cast yet.</p>
                )}
            </div>
        </div>
    );
};

export default LeaderboardSection;