import { useState } from 'react';
import type { CommentResponse } from '../types/comment';
import { Avatar } from './CommentItem';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface ReplyItemProps {
    reply: CommentResponse;
    currentUsername: string;
    onEdit: (id: number, content: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export default function ReplyItem({ reply, currentUsername, onEdit, onDelete }: ReplyItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(reply.content);
    const [showMenu, setShowMenu] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const normalizedCurrent = currentUsername?.trim().toLowerCase() || '';
    const normalizedOwner = reply.user.username?.trim().toLowerCase() || '';
    const isOwner = normalizedCurrent === normalizedOwner;

    const handleSave = async () => {
        if (!editContent.trim() || editContent === reply.content) {
            setIsEditing(false);
            return;
        }
        setIsSaving(true);
        await onEdit(reply.id, editContent);
        setIsSaving(false);
        setIsEditing(false);
    };

    return (
        <div className="flex gap-2.5 group/reply py-2">
            <Avatar username={reply.user.username} profileImage={reply.user.profileImage} size="sm" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-800 leading-none">{reply.user.username}</span>
                        <span className="text-[11px] text-zinc-400">
                            {new Date(reply.commentDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                    </div>

                    {isOwner && !isEditing && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(true)}
                                className="opacity-0 group-hover/reply:opacity-100 p-1 text-zinc-400 hover:text-zinc-600 rounded transition-opacity"
                            >
                                <MoreVertical className="w-3.5 h-3.5" />
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
                                            onClick={() => { onDelete(reply.id); setShowMenu(false); }}
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
                            className="w-full p-2.5 border border-zinc-200 bg-white focus:outline-none focus:border-violet-300 text-sm resize-y text-zinc-800 rounded-lg"
                            rows={2}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => { setIsEditing(false); setEditContent(reply.content); }}
                                disabled={isSaving}
                                className="px-3 py-1 text-xs font-bold text-zinc-500 hover:text-zinc-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !editContent.trim()}
                                className="px-3 py-1 bg-zinc-800 text-white text-xs font-bold rounded hover:bg-zinc-900 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-zinc-600 leading-relaxed break-words mt-0.5">
                        {reply.parent && (
                            <span className="text-violet-600 font-semibold mr-1">@{reply.parent.user.username}</span>
                        )}
                        {reply.content}
                    </p>
                )}
            </div>
        </div>
    );
}