import { useState } from 'react';
import { Send, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { supportApi } from '../../../api/supportApi';

interface SupportSendingBoxProps {
    onSuccess?: () => void;
}

const SupportSendingBox = ({ onSuccess }: SupportSendingBoxProps) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Matches backend logic: split by whitespace to count words
    const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    const isOverLimit = wordCount > 250;

    const handleSend = async () => {
        if (!content.trim() || isOverLimit) return;

        setLoading(true);
        setError(null);
        try {
            await supportApi.createSupport({ content });
            setContent('');
            if (onSuccess) onSuccess();
            // Subtle feedback - could be replaced with a Toast
            alert("Message sent! The developer is now slightly more motivated.");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send. Is the server on strike?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-[var(--bg-side)] border border-[var(--border-color)] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)]">Send Support Message</h3>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest italic">Direct line to the intern's desk</p>
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bug reports, feature requests, or words of encouragement go here..."
                className="w-full h-40 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl p-6 text-[var(--text-primary)] focus:outline-none focus:border-[#c026d3] transition-all resize-none font-medium text-sm"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-tighter ${isOverLimit ? 'text-red-500' : 'text-[var(--text-primary)] opacity-40'}`}>
                    {isOverLimit ? <AlertCircle size={14} /> : null}
                    <span>{wordCount} / 250 words</span>
                </div>

                <button
                    onClick={handleSend}
                    disabled={loading || !content.trim() || isOverLimit}
                    className="flex items-center gap-3 px-8 py-4 bg-[#c026d3] text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-purple-500/20"
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            <span>Send Message</span>
                            <Send size={18} />
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                    {error}
                </div>
            )}
        </div>
    );
};

export default SupportSendingBox;