import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Trash2, Edit2 } from 'lucide-react';
import { commentAPI } from '../api/eventService';
import type { CommentResponse, Page } from '../types/event';

interface CommentSectionProps {
    matchId: number;
    isDark: boolean;
}

const CommentSection = ({ matchId, isDark }: CommentSectionProps) => {
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

    const cardBg = isDark ? 'bg-[#121212] border-zinc-800' : 'bg-white border-zinc-200';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
    const inputBg = isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200';
    const hoverBg = isDark ? 'hover:bg-zinc-900/50' : 'hover:bg-zinc-50';

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const response = await commentAPI.getComments(matchId, 0, 20);
                setComments(response.data.content || []);
            } catch (err) {
                setError('Failed to load comments');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [matchId]);

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const userId = parseInt(localStorage.getItem('userId') || '0');
            const response = await commentAPI.createComment({
                userId,
                matchId,
                content: newComment,
            });

            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (err) {
            setError('Failed to create comment');
            console.error(err);
        }
    };

    const handleLikeComment = async (commentId: number) => {
        try {
            await commentAPI.likeComment(commentId);
            setComments(comments.map((c) =>
                c.matchId === commentId ? { ...c, likes: c.likes + 1 } : c
            ));
        } catch (err) {
            console.error('Failed to like comment', err);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await commentAPI.deleteComment(commentId);
            setComments(comments.filter((c) => c.matchId !== commentId));
        } catch (err) {
            console.error('Failed to delete comment', err);
        }
    };

    const toggleReplies = (commentId: number) => {
        const newExpanded = new Set(expandedReplies);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);
        }
        setExpandedReplies(newExpanded);
    };

    if (loading) {
        return (
            <div className={`${cardBg} rounded-2xl p-8 border`}>
                <div className="text-center py-8">
                    <p className={subTextColor}>Loading comments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${cardBg} rounded-2xl p-8 border space-y-6`}>
            <h2 className={`text-2xl font-black ${textColor}`}>Comments & Discussion</h2>

            {/* Create Comment Form */}
            <form onSubmit={handleCreateComment} className="space-y-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this match..."
                    maxLength={750}
                    className={`w-full p-4 rounded-xl border ${inputBg} ${textColor} placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    rows={4}
                />
                <div className="flex justify-between items-center">
                    <span className={`text-xs ${subTextColor}`}>{newComment.length}/750</span>
                    <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                    >
                        Post Comment
                    </button>
                </div>
            </form>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Comments List */}
            <div className="space-y-4 divide-y divide-zinc-700">
                {comments.length === 0 ? (
                    <p className={`py-8 text-center ${subTextColor}`}>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.publicCommentId} className={`py-4 ${hoverBg} p-4 rounded-lg transition-colors`}>
                            {/* Comment Header */}
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className={`font-bold ${textColor}`}>{comment.username}</p>
                                    <p className={`text-xs ${subTextColor}`}>
                                        {new Date(comment.commentDate).toLocaleDateString()} at{' '}
                                        {new Date(comment.commentDate).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteComment(comment.matchId)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Comment Content */}
                            <p className={`${textColor} mb-4 leading-relaxed`}>{comment.content}</p>

                            {/* Comment Actions */}
                            <div className="flex gap-4 text-sm">
                                <button
                                    onClick={() => handleLikeComment(comment.matchId)}
                                    className={`flex items-center gap-2 ${subTextColor} hover:text-red-500 transition-colors`}
                                >
                                    <Heart className="w-4 h-4" />
                                    {comment.likes}
                                </button>
                                <button
                                    onClick={() => toggleReplies(comment.matchId)}
                                    className={`flex items-center gap-2 ${subTextColor} hover:text-purple-500 transition-colors`}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Reply
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
