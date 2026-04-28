import React from 'react';
import type { CommentResponse } from '../types/comment';

interface CommentItemProps {
    comment: CommentResponse;
    onReply?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
    return (
        <div className="border-l-2 border-zinc-200 pl-4 py-1 my-2 transition-colors hover:border-purple-300 group">
            <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-sm text-zinc-800 group-hover:text-purple-600 transition-colors">
                    {comment.username}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                    {new Date(comment.commentDate).toLocaleString()}
                </span>

                {onReply && (
                    <button
                        onClick={onReply}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-zinc-400 hover:text-purple-600 flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                    </button>
                )}
            </div>

            <div className="text-sm text-zinc-600 leading-relaxed">
                {comment.parent && (
                    <span className="text-purple-600 font-bold mr-1.5 bg-purple-50 px-1.5 py-0.5 rounded-md text-xs tracking-wide">
                        @{comment.parent.username}
                    </span>
                )}
                {comment.content}
            </div>
        </div>
    );
};

export default CommentItem;