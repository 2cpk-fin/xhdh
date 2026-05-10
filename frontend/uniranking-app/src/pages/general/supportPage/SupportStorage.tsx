/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { X, Trash2, Edit3, Save, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { supportApi } from '../../../api/supportApi';
import type { SupportResponse } from '../../../types/support';

interface SupportStorageProps {
    isOpen: boolean;
    onClose: () => void;
}

const SupportStorage = ({ isOpen, onClose }: SupportStorageProps) => {
    const [supports, setSupports] = useState<SupportResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');

    const fetchMySupports = async () => {
        setLoading(true);
        try {
            const data = await supportApi.getMySupports(0); // Slice 0
            setSupports(data.content);
        } catch (err) {
            console.error("Failed to load supports", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isOpen) fetchMySupports();
    }, [isOpen]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this message? The dev might cry.")) return;
        try {
            await supportApi.deleteSupport(id);
            setSupports(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            alert("Delete failed.");
        }
    };

    const handleUpdate = async (id: number) => {
        const wordCount = editContent.trim().split(/\s+/).length;
        if (wordCount > 250) return alert("Still too many words! Limit is 250.");

        try {
            const updated = await supportApi.updateSupport(id, { content: editContent });
            setSupports(prev => prev.map(s => s.id === id ? updated : s));
            setEditingId(null);
        } catch (err) {
            alert("Update failed.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-lg h-full bg-[var(--bg-main)] border-l border-[var(--border-color)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-side)]">
                    <div>
                        <h2 className="text-xl font-black text-[var(--text-primary)]">Your Messages</h2>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-widest">History & Edits</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[var(--text-primary)]">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-[#c026d3]" size={32} />
                        </div>
                    ) : supports.length === 0 ? (
                        <div className="text-center py-20 opacity-40">
                            <AlertCircle className="mx-auto mb-2" />
                            <p className="font-bold">No messages found. Send some hope!</p>
                        </div>
                    ) : (
                        supports.map((s) => (
                            <div key={s.id} className="p-5 rounded-3xl bg-[var(--bg-side)] border border-[var(--border-color)] space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 opacity-50 text-[10px] font-black uppercase">
                                        <Clock size={12} />
                                        {new Date(s.createTime).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingId(s.id); setEditContent(s.content); }}
                                            className="p-2 hover:text-blue-500 transition-colors"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className="p-2 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {editingId === s.id ? (
                                    <div className="space-y-3">
                                        <textarea
                                            className="w-full bg-[var(--bg-main)] p-3 rounded-xl border border-[#c026d3] text-sm focus:outline-none"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleUpdate(s.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#c026d3] text-white rounded-xl text-xs font-bold"
                                        >
                                            <Save size={14} /> Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium leading-relaxed text-[var(--text-primary)]">
                                        {s.content}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportStorage;