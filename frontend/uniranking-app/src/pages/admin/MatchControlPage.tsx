import { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminMatchItem from './AdminMatchItem';
import AdminMatchCreatingBox from './AdminMatchCreatingBox';
import AdminMatchControllingBox from './AdminMatchControllingBox';
import { scheduleMatchApi } from '../../api/scheduleMatchApi';
import type { ScheduleMatchResponse } from '../../types/scheduleMatch';
import type { Page } from '../../types/general';

export default function MatchControlPage() {
    const [matchesData, setMatchesData] = useState<Page<ScheduleMatchResponse> | null>(null);
    const [page, setPage] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<ScheduleMatchResponse | null>(null);

    // Wrapped in useCallback so it's stable as a dependency
    const fetchMatches = useCallback(async (targetPage: number) => {
        try {
            const data = await scheduleMatchApi.getAllMatches(targetPage, 10);
            setMatchesData(data);
        } catch (error) {
            console.error("Failed to load matches", error);
        }
    }, []);

    // Re-fetch whenever the page changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMatches(page);
    }, [page, fetchMatches]);

    const handleSuccess = () => {
        setIsCreating(false);
        setSelectedMatch(null);
        fetchMatches(page); // Reload current page data after an update/create/delete
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header & Create Button */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Matches Control</h1>
                    <p className="text-zinc-500 mt-1 font-medium">Manage and schedule all university battles.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold shadow-sm hover:bg-purple-700 transition-all active:scale-95"
                >
                    <Plus size={20} className="mr-2" /> Create Match
                </button>
            </div>

            {/* Matches List */}
            <div className="bg-zinc-50/50 border border-zinc-200 rounded-3xl p-6 shadow-sm">
                {matchesData?.content.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">No matches found.</div>
                ) : (
                    matchesData?.content.map(match => (
                        <AdminMatchItem
                            key={match.id}
                            match={match}
                            onClick={() => setSelectedMatch(match)}
                        />
                    ))
                )}

                {/* --- ADVANCED PAGINATION CONTROLS --- */}
                {matchesData && matchesData.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-zinc-200 gap-4">
                        <span className="text-sm font-medium text-zinc-500">
                            Showing page <span className="font-bold text-zinc-900">{matchesData.number + 1}</span> of <span className="font-bold text-zinc-900">{matchesData.totalPages}</span>
                        </span>

                        <div className="flex gap-2 items-center">
                            {/* Previous Page Button */}
                            <button
                                disabled={matchesData.first}
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} className="text-zinc-600" />
                            </button>

                            {/* Page Numbers */}
                            <div className="hidden sm:flex gap-1.5">
                                {Array.from({ length: matchesData.totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-purple-300'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Next Page Button */}
                            <button
                                disabled={matchesData.last}
                                onClick={() => setPage(p => Math.min(matchesData.totalPages - 1, p + 1))}
                                className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} className="text-zinc-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreating && (
                <AdminMatchCreatingBox onClose={() => setIsCreating(false)} onSuccess={handleSuccess} />
            )}

            {selectedMatch && (
                <AdminMatchControllingBox match={selectedMatch} onClose={() => setSelectedMatch(null)} onSuccess={handleSuccess} />
            )}
        </div>
    );
}