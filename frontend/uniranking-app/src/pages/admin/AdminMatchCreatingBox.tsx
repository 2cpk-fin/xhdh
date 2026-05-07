import { useState } from 'react';
import { X } from 'lucide-react';
import AdminUniSearchingBox from './AdminUniSearchingBox';
import { scheduleMatchApi } from '../../api/scheduleMatchApi';
import type { ScheduleMatchRequest } from '../../types/scheduleMatch';

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

const toPayloadFormat = (value: string) => value.length === 16 ? `${value}:00` : value;

export default function AdminMatchCreatingBox({ onClose, onSuccess }: Props) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
            <div className="bg-zinc-100 rounded-[2rem] w-full max-w-5xl h-[600px] flex overflow-hidden shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full text-zinc-400 hover:text-red-500 shadow-sm z-10 transition-colors">
                    <X size={20} />
                </button>

                {/* Left Section (2/5): Match Stats */}
                <div className="w-2/5 bg-white p-8 overflow-y-auto flex flex-col border-r border-zinc-200">
                    <h2 className="text-2xl font-extrabold text-zinc-900 mb-6">Create Match</h2>
                    {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">{error}</div>}

                    <form onSubmit={handleCreate} className="space-y-4 flex-1 flex flex-col">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Match Title</label>
                            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">University IDs</label>
                            <input type="text" value={formData.uniIds} onChange={(e) => setFormData({ ...formData, uniIds: e.target.value })} placeholder="e.g., 1, 2" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Start Time</label>
                            <input type="datetime-local" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">End Time</label>
                            <input type="datetime-local" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                        </div>
                        <div className="mt-auto pt-6">
                            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-sm">
                                Create Match
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Section (3/5): Searching */}
                <div className="w-3/5 p-6 bg-zinc-50/50">
                    <AdminUniSearchingBox />
                </div>
            </div>
        </div>
    );
}