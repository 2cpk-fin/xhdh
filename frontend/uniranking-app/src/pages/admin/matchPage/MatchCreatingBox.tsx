import { useState } from 'react';
import { X } from 'lucide-react';
import AdminUniSearchingBox from './SearchingUniHelper';
import { scheduleMatchApi } from '../../../api/scheduleMatchApi';
import type { ScheduleMatchRequest } from '../../../types/scheduleMatch';

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

const toPayloadFormat = (value: string) => value.length === 16 ? `${value}:00` : value;

export default function MatchCreatingBox({ onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState({ title: '', uniIds: '', startTime: '', endTime: '' });
    const [error, setError] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsedIds = formData.uniIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            if (parsedIds.length < 2) return setError('Provide at least 2 valid University IDs.');

            const payload: ScheduleMatchRequest = {
                title: formData.title,
                uniIds: parsedIds,
                startTime: toPayloadFormat(formData.startTime),
                endTime: toPayloadFormat(formData.endTime)
            };

            await scheduleMatchApi.createMatch(payload);
            onSuccess();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data || 'Failed to create match');
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

                {/* Left Section (2/5): Match Stats */}
                <div className="w-2/5 bg-[var(--bg-side)] p-8 overflow-y-auto flex flex-col border-r border-[var(--border-color)]">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight">Create Match</h2>
                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="space-y-4 flex-1 flex flex-col">
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60 mb-1">Match Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60 mb-1">University IDs</label>
                            <input
                                type="text"
                                value={formData.uniIds}
                                onChange={(e) => setFormData({ ...formData, uniIds: e.target.value })}
                                placeholder="e.g., 1, 2"
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60 mb-1">Start Time</label>
                            <input
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all [color-scheme:dark]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60 mb-1">End Time</label>
                            <input
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all [color-scheme:dark]"
                                required
                            />
                        </div>
                        <div className="mt-auto pt-6">
                            <button
                                type="submit"
                                className="w-full bg-[var(--accent-purple)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
                            >
                                Create Match
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Section (3/5): Searching */}
                <div className="w-3/5 p-6 bg-[var(--bg-main)]/50">
                    <AdminUniSearchingBox />
                </div>
            </div>
        </div>
    );
}