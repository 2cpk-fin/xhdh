import React, { useEffect, useState, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';
import { commentApi } from '../api/commentApi';
import type { CommentResponse, CommentRequest } from '../types/comment';
import CommentItem from './CommentItem';

interface CommentSectionProps {
    matchId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ matchId }) => {
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<CommentResponse | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const loadComments = useCallback(async () => {
        try {
            const data = await commentApi.getAllComments(matchId);
            setComments(data.content);
        } catch (err) {
            const error = err as AxiosError;
            console.error("Failed to fetch comments:", error.message);
        }
    }, [matchId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadComments();
    }, [loadComments]);

    const handleReplyClick = (comment: CommentResponse) => {
        setReplyingTo(comment);
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedContent = newComment.trim();
        if (!trimmedContent) return;

        setLoading(true);
        const request: CommentRequest = {
            matchId: matchId,
            content: trimmedContent,
            parentId: replyingTo?.id
        };

        try {
            await commentApi.createComment(request);
            setNewComment('');
            setReplyingTo(null);
            await loadComments();
        } catch (err) {
            const error = err as AxiosError<{ message: string } | string>;

            const errorMessage = typeof error.response?.data === 'string'
                ? error.response.data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                : (error.response?.data as any)?.message || "An unexpected error occurred";

            if (error.response?.status === 401) {
                alert(`Unauthorized: ${errorMessage}`);
            } else {
                alert(`Error: ${errorMessage}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="comment-section">
            <h2 className="text-xl font-black text-zinc-800 tracking-tight mb-5">
                Discussion ({comments.length})
            </h2>

            <form onSubmit={handleSubmit} className="mb-8 relative">
                {replyingTo && (
                    <div className="flex items-center justify-between bg-purple-50 text-purple-700 px-4 py-2 rounded-t-2xl border border-purple-200 border-b-0 text-sm transition-all">
                        <span className="font-bold">
                            Replying to @{replyingTo.username}
                        </span>
                        <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="text-purple-500 hover:text-purple-800 font-bold text-xs px-2 py-1 rounded-md hover:bg-purple-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={replyingTo ? "Write your reply..." : "Join the discussion..."}
                    disabled={loading}
                    className={`w-full min-h-[100px] p-4 border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 transition-all text-sm resize-y text-zinc-800 placeholder:text-zinc-400 ${replyingTo ? 'rounded-b-2xl rounded-t-none border-t-purple-200' : 'rounded-2xl'}`}
                />
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="px-6 py-2 bg-purple-600 text-white text-sm font-black tracking-wide rounded-xl hover:bg-purple-700 hover:shadow-md hover:shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {loading ? 'Posting...' : replyingTo ? 'Post Reply' : 'Post Comment'}
                    </button>
                </div>
            </form>

            <div className="flex flex-col gap-2">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={() => handleReplyClick(comment)}
                        />
                    ))
                ) : (
                    <div className="bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-8 text-center shadow-sm">
                        <p className="text-sm font-bold text-zinc-400">No comments yet.</p>
                        <p className="text-xs text-zinc-300 mt-1">Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CommentSection;