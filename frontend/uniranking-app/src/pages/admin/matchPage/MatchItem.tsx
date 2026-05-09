import { Swords, Activity, Hash, Clock } from 'lucide-react';
import type { ScheduleMatchResponse } from '../../../types/scheduleMatch';

type Props = {
    match: ScheduleMatchResponse;
    onClick: () => void;
};

export default function MatchItem({ match, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className="group flex items-center justify-between p-5 mb-4 bg-white border border-zinc-200 rounded-2xl cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${match.status === 'LIVE' ? 'bg-red-50 text-red-500' : match.status === 'COMPLETED' ? 'bg-green-50 text-green-500' : 'bg-zinc-100 text-zinc-500'}`}>
                    {match.status === 'LIVE' ? <Activity size={24} /> : <Swords size={24} />}
                </div>
                <div>
                    <h4 className="font-extrabold text-zinc-900 group-hover:text-purple-700 transition-colors">{match.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center text-xs font-bold text-zinc-500">
                            <Hash size={14} className="mr-1" /> ID: {match.id}
                        </span>
                        <span className="flex items-center text-xs font-bold text-zinc-500">
                            <Clock size={14} className="mr-1" />
                            {new Date(match.startTime).toLocaleDateString()} - {new Date(match.endTime).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${match.status === 'LIVE' ? 'border-red-200 text-red-600 bg-red-50' : match.status === 'COMPLETED' ? 'border-green-200 text-green-600 bg-green-50' : 'border-zinc-200 text-zinc-600 bg-zinc-50'}`}>
                    {match.status}
                </span>
            </div>
        </div>
    );
}