import React, { useState } from 'react';
import type { CommentResponse } from '../../../../types/comment';
import ReplyItem from './ReplyItem';
import { Reply, ChevronRight, ChevronDown, MoreVertical, Pencil, Trash2 } from 'lucide-react';

const REPLIES_PAGE_SIZE = 10;

interface CommentItemProps {
    comment: CommentResponse;
    replies?: CommentResponse[];
    currentUsername: string;
    onReply: (comment: CommentResponse) => void;
    onEdit: (id: number, content: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export const Avatar: React.FC<{ username: string; profileImage?: string; size?: 'sm' | 'md' }> = ({ username, profileImage, size = 'md' }) => {
    const [imgError, setImgError] = useState(false);
    const sizeClass = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';

    const imageSrc = profileImage && !imgError
        ? (profileImage.startsWith('data:') || profileImage.startsWith('http')
            ? profileImage
            : `data:image/jpeg;base64,${profileImage}`)
        : null;

    if (imageSrc) {
        return (
            <img
                src={imageSrc}
                alt={username}
                onError={() => setImgError(true)}
                className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
            />
        );
    }

    const initials = username.slice(0, 2).toUpperCase();
    const colors = [
        'bg-violet-500', 'bg-indigo-500', 'bg-sky-500',
        'bg-teal-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
    ];
    const color = colors[username.charCodeAt(0) % colors.length];
    const fontSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

    return (
        <div className={`${sizeClass} ${color} ${fontSize} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 select-none`}>
            {initials}
        </div>
    );
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, replies = [], currentUsername, onReply, onEdit, onDelete }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [visibleCount, setVisibleCount] = useState(REPLIES_PAGE_SIZE);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const totalReplies = replies.length;
    const visibleReplies = replies.slice(0, visibleCount);
    const hasMore = visibleCount < totalReplies;

    const normalizedCurrent = currentUsername?.trim().toLowerCase() || '';
    const normalizedOwner = comment.user.username?.trim().toLowerCase() || '';
    const isOwner = normalizedCurrent === normalizedOwner;

    const handleShowMore = () => setVisibleCount(prev => prev + REPLIES_PAGE_SIZE);
    const handleToggleReplies = () => {
        setShowReplies(prev => !prev);
        if (!showReplies) setVisibleCount(REPLIES_PAGE_SIZE);
    };

    const handleSave = async () => {
        if (!editContent.trim() || editContent === comment.content) {
            setIsEditing(false);
            return;
        }
        setIsSaving(true);
        await onEdit(comment.id, editContent);
        setIsSaving(false);
        setIsEditing(false);
    };

    return (
        <div className="group/root">
            <div className="flex gap-3 py-3">
                <Avatar username={comment.user.username} profileImage={comment.user.profileImage} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-zinc-900">{comment.user.username}</span>
                            <span className="text-[11px] text-zinc-400">
                                {new Date(comment.commentDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                            {!isEditing && (
                                <button
                                    onClick={() => onReply(comment)}
                                    className="opacity-0 group-hover/root:opacity-100 text-[11px] font-semibold text-violet-500 hover:text-violet-700 flex items-center gap-1 transition-opacity"
                                >
                                    <Reply className="w-3 h-3" /> Reply
                                </button>
                            )}
                        </div>

                        {isOwner && !isEditing && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(true)}
                                    className="opacity-0 group-hover/root:opacity-100 p-1 text-zinc-400 hover:text-zinc-600 rounded transition-opacity"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                                {showMenu && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                        <div className="absolute right-0 mt-1 w-32 bg-white border border-zinc-200 rounded-lg shadow-sm z-20 py-1">
                                            <button
                                                onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                                className="w-full text-left px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2"
                                            >
                                                <Pencil className="w-3 h-3" /> Edit
                                            </button>
                                            <button
                                                onClick={() => { onDelete(comment.id); setShowMenu(false); }}
                                                className="w-full text-left px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-1.5">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                disabled={isSaving}
                                className="w-full p-3 border border-zinc-200 bg-white focus:outline-none focus:border-violet-300 text-sm resize-y text-zinc-800 rounded-xl"
                                rows={3}
                            />
                            <div className="flex justify-end gap-2 mt-2.5">
                                <button
                                    onClick={() => { setIsEditing(false); setEditContent(comment.content); }}
                                    disabled={isSaving}
                                    className="px-4 py-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !editContent.trim()}
                                    className="px-4 py-1.5 bg-zinc-800 text-white text-xs font-bold rounded-lg hover:bg-zinc-900 disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-700 leading-relaxed break-words">{comment.content}</p>
                    )}

                    {totalReplies > 0 && (
                        <button
                            onClick={handleToggleReplies}
                            className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-violet-600 hover:text-violet-800"
                        >
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showReplies ? 'rotate-90' : ''}`} />
                            {showReplies ? 'Hide replies' : `Show ${totalReplies} ${totalReplies === 1 ? 'reply' : 'replies'}`}
                        </button>
                    )}
                </div>
            </div>

            {showReplies && totalReplies > 0 && (
                <div className="ml-11 pl-4 border-l-2 border-zinc-100">
                    {visibleReplies.map(reply => (
                        <ReplyItem
                            key={reply.id}
                            reply={reply}
                            currentUsername={currentUsername}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}

                    {hasMore && (
                        <button
                            onClick={handleShowMore}
                            className="mt-1 mb-2 text-[12px] font-semibold text-zinc-500 hover:text-violet-600 flex items-center gap-1"
                        >
                            <ChevronDown className="w-3.5 h-3.5" />
                            Show {Math.min(REPLIES_PAGE_SIZE, totalReplies - visibleCount)} more replies
                        </button>
                    )}
                </div>
            )}

            <div className="border-b border-zinc-100 last:border-0" />
        </div>
    );
};

export default CommentItem;