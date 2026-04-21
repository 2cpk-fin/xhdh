import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import type { CommentResponse, Page } from '../../types/ScheduleMatch';

interface CommentSectionProps {
    commentsPage: Page<CommentResponse> | null;
    isDark: boolean;
    onSubmitComment: (content: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ commentsPage, isDark, onSubmitComment }) => {
    const [newComment, setNewComment] = useState('');

    const sectionBg = isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/80 border-zinc-200';
    const inputBg = isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

    const handlePost = () => {
        if (newComment.trim().length > 0) {
            onSubmitComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className={`rounded-2xl p-6 border shadow-sm backdrop-blur-md mt-6 ${sectionBg}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className={`text-xl font-bold tracking-tight ${textColor}`}>Discussion</h2>
                {commentsPage && (
                    <span className={`text-sm font-medium ${subTextColor}`}>
            ({commentsPage.totalElements} comments)
          </span>
                )}
            </div>

            {/* Comment Input */}
            <div className="flex gap-3 mb-8">
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this match..."
            className={`flex-1 min-h-[80px] p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-colors ${inputBg}`}
            maxLength={4500} // Enforcing backend limits
        />
                <button
                    onClick={handlePost}
                    disabled={!newComment.trim()}
                    className="self-end p-3 rounded-xl bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors shadow-sm"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            {/* Comment List */}
            <div className="space-y-4">
                {commentsPage?.content.map((comment) => (
                    <div key={comment.id} className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold text-sm ${textColor}`}>{comment.username}</span>
                            <span className={`text-xs ${subTextColor}`}>
                {new Date(comment.commentDate).toLocaleDateString()}
              </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {comment.content}
                        </p>
                    </div>
                ))}

                {(!commentsPage || commentsPage.content.length === 0) && (
                    <div className="text-center py-8">
                        <p className={`text-sm ${subTextColor}`}>Be the first to start the discussion!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;