import { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminMatchItem from './MatchItem';
import AdminMatchCreatingBox from './MatchCreatingBox';
import AdminMatchControllingBox from './MatchControllingBox';
import ControlNavBar from '../../../components/ControlNavBar';
import { scheduleMatchApi } from '../../../api/scheduleMatchApi';
import type { ScheduleMatchResponse } from '../../../types/scheduleMatch';
import type { Page } from '../../../types/general';

export default function MatchControlPage() {
    const [matchesData, setMatchesData] = useState<Page<ScheduleMatchResponse> | null>(null);
    const [page, setPage] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<ScheduleMatchResponse | null>(null);

    const fetchMatches = useCallback(async (targetPage: number) => {
        try {
            const data = await scheduleMatchApi.getAllMatches(targetPage, 10);
            setMatchesData(data);
        } catch (error) {
            console.error("Failed to load matches", error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMatches(page);
    }, [page, fetchMatches]);

    const handleSuccess = () => {
        setIsCreating(false);
        setSelectedMatch(null);
        fetchMatches(page);
    };

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[var(--bg-main)] dark:bg-[#030005]">
            <ControlNavBar />

            <main className="flex-1 flex flex-col pt-14">
                <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Matches Control</h1>
                            <p className="text-[var(--text-primary)] opacity-40 mt-1 font-medium">Manage and schedule university battles.</p>
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex items-center px-6 py-2.5 bg-[var(--accent-purple)] text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95"
                        >
                            <Plus size={20} className="mr-2" /> Create Match
                        </button>
                    </div>

                    <div className="bg-[var(--bg-side)] dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
                        {!matchesData || matchesData.content.length === 0 ? (
                            <div className="text-center py-16 text-[var(--text-primary)] opacity-40 font-bold">No matches found.</div>
                        ) : (
                            <div className="space-y-1">
                                {matchesData.content.map(match => (
                                    <AdminMatchItem
                                        key={match.id}
                                        match={match}
                                        onClick={() => setSelectedMatch(match)}
                                    />
                                ))}
                            </div>
                        )}

                        {matchesData && matchesData.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-[var(--border-color)] gap-4">
                                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30">
                                    Page {matchesData.number + 1} of {matchesData.totalPages}
                                </span>

                                <div className="flex gap-2 items-center">
                                    <button
                                        disabled={matchesData.first}
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        className="p-2.5 bg-[var(--bg-main)] dark:bg-[#030005] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] opacity-60 hover:opacity-100 disabled:opacity-20 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <div className="flex gap-1.5">
                                        {Array.from({ length: matchesData.totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i)}
                                                className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${page === i
                                                    ? 'bg-[var(--accent-purple)] text-white shadow-md'
                                                    : 'bg-[var(--bg-main)] dark:bg-[#030005] border border-[var(--border-color)] text-[var(--text-primary)] opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={matchesData.last}
                                        onClick={() => setPage(p => Math.min(matchesData.totalPages - 1, p + 1))}
                                        className="p-2.5 bg-[var(--bg-main)] dark:bg-[#030005] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] opacity-60 hover:opacity-100 disabled:opacity-20 transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {isCreating && (
                <AdminMatchCreatingBox onClose={() => setIsCreating(false)} onSuccess={handleSuccess} />
            )}

            {selectedMatch && (
                <AdminMatchControllingBox
                    match={selectedMatch}
                    onClose={() => setSelectedMatch(null)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}