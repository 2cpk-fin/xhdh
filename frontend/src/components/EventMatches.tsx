import { useEffect, useState } from 'react';
import { Trophy, Users, ChevronDown } from 'lucide-react';
import { eventMatchAPI } from '../api/eventService.ts';
import type { ScheduleMatchResponse } from '../types/event.ts';
import CommentSection from './CommentSection';

interface EventMatchesProps {
    isDark: boolean;
}

const EventMatches = ({ isDark }: EventMatchesProps) => {
    const [matches, setMatches] = useState<ScheduleMatchResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<ScheduleMatchResponse | null>(null);
    const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

    const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
    const hoverBg = isDark ? 'hover:bg-zinc-900/80' : 'hover:bg-zinc-50';

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const response = await eventMatchAPI.getAllMatches();
                setMatches(response.data || []);
                if (response.data && response.data.length > 0) {
                    setSelectedMatch(response.data[0]);
                }
            } catch (err) {
                setError('Failed to load event matches');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NOT_STARTED':
                return 'text-blue-500 bg-blue-500/10';
            case 'PENDING':
                return 'text-yellow-500 bg-yellow-500/10';
            case 'FINISHED':
                return 'text-green-500 bg-green-500/10';
            default:
                return 'text-gray-500 bg-gray-500/10';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'NOT_STARTED':
                return 'Not Started';
            case 'PENDING':
                return 'In Progress';
            case 'FINISHED':
                return 'Finished';
            default:
                return status;
        }
    };

    const formatDateTime = (dateTime: string) => {
        try {
            return new Date(dateTime).toLocaleString();
        } catch {
            return dateTime;
        }
    };

    if (loading) {
        return (
            <div className={`${cardBg} rounded-2xl p-8 border`}>
                <div className="text-center py-8">
                    <p className={subTextColor}>Loading event matches...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${cardBg} rounded-2xl p-8 border`}>
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className={`${cardBg} rounded-2xl p-8 border`}>
                <div className="text-center py-8">
                    <p className={subTextColor}>No event matches available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Matches List */}
            <div className={`${cardBg} rounded-2xl p-8 border space-y-4`}>
                <h2 className={`text-2xl font-black ${textColor} mb-6`}>Scheduled Matches</h2>

                <div className="space-y-3">
                    {matches.map((match) => (
                        <div
                            key={match.publicMatchId}
                            className={`${cardBg} border rounded-xl p-6 cursor-pointer transition-all ${hoverBg}`}
                            onClick={() => {
                                setSelectedMatch(match);
                                setExpandedMatch(expandedMatch === match.publicMatchId ? null : match.publicMatchId);
                            }}
                        >
                            {/* Match Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className={`text-xl font-black ${textColor}`}>{match.title}</h3>
                                    <p className={`text-sm ${subTextColor} mt-1`}>
                                        {formatDateTime(match.startTime)} to {formatDateTime(match.endTime)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-lg font-bold text-sm ${getStatusColor(match.status)}`}>
                                        {getStatusLabel(match.status)}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${expandedMatch === match.publicMatchId ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Participants Summary */}
                            <div className="flex items-center gap-2 text-sm mb-4">
                                <Users className="w-4 h-4 text-purple-500" />
                                <span className={subTextColor}>{match.participants.length} universities competing</span>
                            </div>

                            {/* Expanded Details */}
                            {expandedMatch === match.publicMatchId && (
                                <div className={`mt-6 pt-6 border-t ${isDark ? 'border-zinc-700' : 'border-zinc-200'} space-y-4`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {match.participants.map((participant) => (
                                            <div
                                                key={participant.publicUniversityId}
                                                className={`p-4 rounded-lg ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'} flex items-start justify-between`}
                                            >
                                                <div>
                                                    <p className={`font-bold ${textColor}`}>{participant.universityName}</p>
                                                    <p className={`text-sm ${subTextColor}`}>Rank #{participant.rank}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                                    <span className={`font-bold ${textColor}`}>{participant.totalVotes} votes</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Comments Section for Selected Match */}
            {selectedMatch && (
                <div>
                    <CommentSection matchId={selectedMatch.matchId} isDark={isDark} />
                </div>
            )}
        </div>
    );
};

export default EventMatches;