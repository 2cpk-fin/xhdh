/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Swords, Users, CalendarPlus, CalendarMinus, Hash, AlertTriangle } from 'lucide-react';
import { scheduleMatchApi } from '../api/scheduleMatchApi';

const MatchControlPage = () => {
    // --- State Management ---
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [matchId, setMatchId] = useState('');

    // State explicitly matching the ScheduleMatchRequest DTO
    const [formData, setFormData] = useState({
        title: '',
        uniIds: '', // We use a string for the input field (e.g., "1, 2, 3")
        startTime: '',
        endTime: ''
    });

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // datetime-local gives "2026-06-01T10:00" but BE needs "2026-06-01T10:00:00"
    const formatDateTime = (value: string): string => {
        if (!value) return value;
        return value.length === 16 ? `${value}:00` : value;
    };

    const buildPayload = () => {
        // Parse the comma-separated string into an array of numbers
        const parsedIds = formData.uniIds
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        return {
            title: formData.title,
            uniIds: parsedIds,
            startTime: formatDateTime(formData.startTime),
            endTime: formatDateTime(formData.endTime)
        };
    };

    const handleCreate = async (e: React.MouseEvent) => {
        e.preventDefault();
        const payload = buildPayload();

        if (payload.uniIds.length < 2) {
            return setStatusMsg({ type: 'error', text: 'You must provide at least 2 University IDs.' });
        }

        try {
            await scheduleMatchApi.createMatch(payload);
            setStatusMsg({ type: 'success', text: 'Match successfully created!' });
            setFormData({ title: '', uniIds: '', startTime: '', endTime: '' }); // Reset
        } catch (error: any) {
            setStatusMsg({ type: 'error', text: error.response?.data || 'Failed to create match' });
        }
    };

    const handleUpdate = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!matchId) return setStatusMsg({ type: 'error', text: 'Match ID is required for update' });

        const payload = buildPayload();

        if (payload.uniIds.length < 2) {
            return setStatusMsg({ type: 'error', text: 'You must provide at least 2 University IDs.' });
        }

        try {
            await scheduleMatchApi.updateMatch(Number(matchId), payload);
            setStatusMsg({ type: 'success', text: `Match #${matchId} successfully updated!` });
        } catch (error: any) {
            setStatusMsg({ type: 'error', text: error.response?.data || 'Failed to update match' });
        }
    };

    const handleDelete = async () => {
        if (!matchId) return setStatusMsg({ type: 'error', text: 'Match ID is required for deletion' });
        if (!window.confirm(`Are you absolutely sure you want to delete match #${matchId}?`)) return;

        try {
            await scheduleMatchApi.deleteMatch(Number(matchId));
            setStatusMsg({ type: 'success', text: `Match #${matchId} deleted successfully` });
            setMatchId('');
        } catch (error: any) {
            setStatusMsg({ type: 'error', text: error.response?.data || 'Failed to delete match' });
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 px-4 pb-16">

            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Match Management</h2>
                <p className="text-zinc-500 text-sm mt-1">Schedule new battles between universities.</p>
            </div>

            {/* Status Alert */}
            {statusMsg.text && (
                <div className={`p-4 mb-6 rounded-2xl text-sm font-bold flex items-center ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {statusMsg.type === 'error' && <AlertTriangle size={18} className="mr-2 shrink-0" />}
                    {statusMsg.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- MAIN FORM (CREATE / UPDATE) --- */}
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-zinc-800 mb-6">Match Parameters</h3>

                    <form className="space-y-5">
                        {/* Target ID */}
                        <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl mb-6">
                            <label className="flex items-center text-sm font-bold text-purple-900 mb-2">
                                <Hash size={16} className="mr-1.5" /> Target Match ID (For Updates)
                            </label>
                            <input
                                type="number"
                                value={matchId}
                                onChange={(e) => setMatchId(e.target.value)}
                                placeholder="Leave blank if creating a new match"
                                className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-zinc-400"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-2">Match Title</label>
                            <div className="relative">
                                <Swords size={18} className="absolute left-3 top-3 text-zinc-400" />
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Global Tech University vs. State College"
                                    maxLength={150}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Participant IDs */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-2">Participant University IDs</label>
                            <div className="relative">
                                <Users size={18} className="absolute left-3 top-3 text-zinc-400" />
                                <input
                                    type="text"
                                    name="uniIds"
                                    value={formData.uniIds}
                                    onChange={handleInputChange}
                                    placeholder="Comma-separated IDs (e.g., 1, 2)"
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>
                            <p className="text-xs text-zinc-500 mt-1.5">Must provide at least 2 IDs corresponding to the universities.</p>
                        </div>

                        {/* Time Configuration */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2">Start Time</label>
                                <div className="relative">
                                    <CalendarPlus size={18} className="absolute left-3 top-3 text-zinc-400" />
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2">End Time</label>
                                <div className="relative">
                                    <CalendarMinus size={18} className="absolute left-3 top-3 text-zinc-400" />
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons — type="button" prevents form submit on click */}
                        <div className="pt-6 flex flex-col sm:flex-row gap-3">
                            <button type="button" onClick={handleCreate} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all active:scale-[0.98] shadow-sm">
                                Create New Match
                            </button>
                            <button type="button" onClick={handleUpdate} className="flex-1 bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm">
                                Update Existing
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- SIDEBAR: DANGER ZONE --- */}
                <div className="lg:col-span-1">
                    <div className="bg-red-50/50 border border-red-100 rounded-3xl p-6 shadow-sm sticky top-24">
                        <div className="flex items-center space-x-2 text-red-700 mb-4">
                            <AlertTriangle size={20} />
                            <h3 className="text-lg font-bold">Danger Zone</h3>
                        </div>
                        <p className="text-sm text-red-600/80 mb-6 font-medium">
                            Deleting a match permanently removes it from the database and Redis cache. This action cannot be reversed.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-red-800 mb-2">Target Match ID</label>
                                <input
                                    type="number"
                                    value={matchId}
                                    onChange={(e) => setMatchId(e.target.value)}
                                    placeholder="Enter ID to delete"
                                    className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-red-900 placeholder:text-red-300 font-mono"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all active:scale-[0.98] shadow-sm flex justify-center items-center"
                            >
                                Delete Match
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MatchControlPage;