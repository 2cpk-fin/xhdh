import { Swords, Activity, Hash, Clock } from 'lucide-react';
import type { ScheduleMatchResponse } from '../../../types/scheduleMatch';

export default function MatchItem({ match, onClick }: { match: ScheduleMatchResponse; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="group flex items-center justify-between p-5 mb-4 rounded-2xl cursor-pointer transition-all border
                       bg-[var(--bg-side)] dark:bg-[#0d0d0d]/40 border-[var(--border-color)] hover:border-[var(--accent-purple)] hover:shadow-lg active:scale-[0.99]"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${match.status === 'LIVE' ? 'bg-red-500/10 text-red-500' :
                        match.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                            'bg-[var(--text-primary)]/5 text-[var(--text-primary)]/40'
                    }`}>
                    {match.status === 'LIVE' ? <Activity size={24} /> : <Swords size={24} />}
                </div>
                <div>
                    <h4 className="font-extrabold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors">
                        {match.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30">
                            <Hash size={12} className="mr-1" /> ID: {match.id}
                        </span>
                        <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30">
                            <Clock size={12} className="mr-1" />
                            {new Date(match.startTime).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${match.status === 'LIVE' ? 'border-red-500/30 text-red-500 bg-red-500/5' :
                    match.status === 'COMPLETED' ? 'border-green-500/30 text-green-500 bg-green-500/5' :
                        'border-[var(--border-color)] text-[var(--text-primary)] opacity-40'
                }`}>
                {match.status}
            </span>
        </div>
    );
}