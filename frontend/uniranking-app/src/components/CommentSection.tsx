import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { AxiosError } from 'axios';
import { commentApi } from '../api/commentApi';
import type { CommentResponse, CommentRequest } from '../types/comment';
import CommentItem from './CommentItem';
import { getCurrentUsernameFromToken } from '../utils/jwt-decode';

interface CommentSectionProps {
    matchId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ matchId }) => {
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<CommentResponse | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const currentUsername = getCurrentUsernameFromToken() || '';

    const loadComments = useCallback(async () => {
        try {
            const data = await commentApi.getAllComments(matchId);
            setComments(data.content);
        } catch (err) {
            const error = err as AxiosError;
            console.error('DEBUG - Load Comments Error:', error.message, error.response?.data);
        }
    }, [matchId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadComments();
    }, [loadComments]);

    const { rootComments, repliesMap } = useMemo(() => {
        const roots: CommentResponse[] = [];
        const map = new Map<number, CommentResponse[]>();
        const byId = new Map<number, CommentResponse>(comments.map(c => [c.id, c]));

        const getRootId = (c: CommentResponse): number => {
            let cur = c;
            while (cur.parent) {
                const parent = byId.get(cur.parent.id);
                if (!parent) break;
                cur = parent;
            }
            return cur.id;
        };

        for (const c of comments) {
            if (!c.parent) {
                roots.push(c);
            } else {
                const rootId = getRootId(c);
                if (!map.has(rootId)) map.set(rootId, []);
                map.get(rootId)!.push(c);
            }
        }

        return { rootComments: roots, repliesMap: map };
    }, [comments]);

    const handleReplyClick = (comment: CommentResponse) => {
        setReplyingTo(comment);
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    const handleEditComment = async (id: number, content: string) => {
        try {
            await commentApi.updateComment(id, { content });
            await loadComments();
        } catch (err) {
            const error = err as AxiosError;
            console.error('DEBUG - Edit Comment Error:', error.message, error.response?.data);
            alert('Failed to save changes. Please try again.');
        }
    };

    const handleDeleteComment = async (id: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
        if (!confirmDelete) return;

        try {
            await commentApi.deleteComment(id);
            await loadComments();
        } catch (err) {
            const error = err as AxiosError;
            console.error('DEBUG - Delete Comment Error:', error.message, error.response?.data);
            alert('Failed to delete comment. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedContent = newComment.trim();
        if (!trimmedContent) return;

        setLoading(true);

        const request: CommentRequest = {
            matchId,
            content: trimmedContent,
            parentId: replyingTo?.id,
        };

        try {
            await commentApi.createComment(request);
            setNewComment('');
            setReplyingTo(null);
            await loadComments();
        } catch (err) {
            const error = err as AxiosError<{ message: string } | string>;
            console.error('DEBUG - Submit Comment Error:', error.message, error.response?.data);

            const errorMessage =
                typeof error.response?.data === 'string'
                    ? error.response.data
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    : (error.response?.data as any)?.message || 'An unexpected error occurred';

            if (error.response?.status === 401) {
                alert(`Unauthorized: ${errorMessage}`);
            } else {
                alert(`Error: ${errorMessage}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const totalCount = comments.length;

    return (
        <section>
            <h2 className="text-xl font-black text-zinc-800 tracking-tight mb-5">
                Discussion
                {totalCount > 0 && (
                    <span className="ml-2 text-base font-semibold text-zinc-400">({totalCount})</span>
                )}
            </h2>

            <form onSubmit={handleSubmit} className="mb-8">
                {replyingTo && (
                    <div className="flex items-center justify-between bg-violet-50 text-violet-700 px-4 py-2 rounded-t-2xl border border-violet-200 border-b-0 text-sm">
                        <span className="font-bold">
                            Replying to{' '}
                            <span className="text-violet-900">@{replyingTo.user.username}</span>
                        </span>
                        <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="text-violet-400 hover:text-violet-700 font-bold text-xs px-2 py-1 rounded-md hover:bg-violet-100"
                        >
                            ✕ Cancel
                        </button>
                    </div>
                )}
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder={replyingTo ? 'Write your reply...' : 'Join the discussion...'}
                    disabled={loading}
                    rows={3}
                    className={`w-full p-4 border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 text-sm resize-y text-zinc-800 placeholder:text-zinc-400 ${replyingTo ? 'rounded-b-2xl rounded-t-none border-t-violet-200' : 'rounded-2xl'
                        }`}
                />
                <div className="flex justify-end mt-2.5">
                    <button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="px-6 py-2 bg-violet-600 text-white text-sm font-bold tracking-wide rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                        {loading ? 'Posting…' : replyingTo ? 'Post Reply' : 'Post Comment'}
                    </button>
                </div>
            </form>

            <div className="flex flex-col">
                {rootComments.length > 0 ? (
                    rootComments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            replies={repliesMap.get(comment.id) ?? []}
                            currentUsername={currentUsername}
                            onReply={handleReplyClick}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                        />
                    ))
                ) : (
                    <div className="bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-10 text-center">
                        <p className="text-sm font-bold text-zinc-400">No comments yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CommentSection;