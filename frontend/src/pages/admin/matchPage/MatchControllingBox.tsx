/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import AdminUniSearchingBox from './SearchingUniHelper';
import { scheduleMatchApi } from '../../../api/scheduleMatchApi';
import type { ScheduleMatchResponse } from '../../../types/scheduleMatch';

type Props = {
    match: ScheduleMatchResponse;
    onClose: () => void;
    onSuccess: () => void;
};

const toInputFormat = (isoString?: string) => isoString ? isoString.slice(0, 16) : '';
const toPayloadFormat = (value: string) => value.length === 16 ? `${value}:00` : value;

export default function MatchControllingBox({ match, onClose, onSuccess }: Props) {
    const existingIds = match.participants?.map(p => p.universityResponse.id).join(', ') || '';

    const [formData, setFormData] = useState({
        title: match.title,
        uniIds: existingIds,
        startTime: toInputFormat(match.startTime),
        endTime: toInputFormat(match.endTime)
    });
    const [error, setError] = useState('');

    const handleUpdate = async () => {
        try {
            const parsedIds = formData.uniIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            if (parsedIds.length < 2) return setError('Provide at least 2 valid University IDs.');

            await scheduleMatchApi.updateMatch(match.id, {
                title: formData.title,
                uniIds: parsedIds,
                startTime: toPayloadFormat(formData.startTime),
                endTime: toPayloadFormat(formData.endTime)
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data || 'Failed to update match');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete match #${match.id}?`)) return;
        try {
            await scheduleMatchApi.deleteMatch(match.id);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data || 'Failed to delete match');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[2rem] w-full max-w-5xl h-[600px] flex overflow-hidden shadow-2xl relative transition-colors duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-[var(--bg-side)] border border-[var(--border-color)] rounded-full text-[var(--text-primary)] opacity-40 hover:opacity-100 hover:text-red-500 shadow-sm z-10 transition-all"
                >
                    <X size={20} />
                </button>

                {/* Left Section (2/5): Match Stats & Control */}
                <div className="w-2/5 bg-[var(--bg-side)] p-8 overflow-y-auto flex flex-col border-r border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Control Match</h2>
                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${match.status === 'LIVE'
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'bg-[var(--text-primary)]/5 text-[var(--text-primary)]/60 border border-[var(--border-color)]'
                            }`}>
                            {match.status}
                        </span>
                    </div>

                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 flex-1 flex flex-col">
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60 mb-1">Match Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60 mb-1">University IDs</label>
                            <input
                                type="text"
                                value={formData.uniIds}
                                onChange={(e) => setFormData({ ...formData, uniIds: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60 mb-1">Start Time</label>
                            <input
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60 mb-1">End Time</label>
                            <input
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all [color-scheme:dark]"
                            />
                        </div>

                        <div className="mt-auto pt-6 flex gap-3">
                            <button
                                onClick={handleUpdate}
                                className="flex-1 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-main)] py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
                            >
                                <Edit size={18} className="mr-2" /> Update
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center justify-center bg-red-500/10 text-red-500 px-4 py-3 rounded-xl font-bold hover:bg-red-500/20 border border-red-500/20 transition-all shadow-sm active:scale-95"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section (3/5): Searching */}
                <div className="w-3/5 p-6 bg-[var(--bg-main)]/50">
                    <AdminUniSearchingBox />
                </div>
            </div>
        </div>
    );
}