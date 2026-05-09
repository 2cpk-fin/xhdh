/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { X, Trash2, Mail, Hash, ShieldAlert } from 'lucide-react'
import userApi from '../../../api/userApi'
import type { UserResponse } from '../../../types/user'

type Props = {
    user: UserResponse
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserControllingBox({ user, onClose, onSuccess }: Props) {
    const [error, setError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [imgError, setImgError] = useState(false)

    const initials = user.username.slice(0, 2).toUpperCase()
    const showImage = !!user.profileImage && !imgError

    const handleDelete = async () => {
        if (confirmText !== user.username) {
            return setError(`Type the username "${user.username}" exactly to confirm.`)
        }
        setIsDeleting(true)
        setError('')
        try {
            await userApi.deleteUser(user.id)
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data || 'Failed to delete user.')
            setIsDeleting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg shadow-2xl relative overflow-hidden rounded-[2rem] border transition-colors duration-300
                            bg-[var(--bg-main)] dark:bg-[#030005] border-[var(--border-color)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full shadow-sm z-10 transition-all
                               bg-[var(--bg-side)] text-[var(--text-primary)] opacity-40 hover:opacity-100 hover:text-red-500"
                >
                    <X size={20} />
                </button>

                <div className="p-8 flex flex-col gap-6 bg-[var(--bg-side)] dark:bg-[#0a0a0a]/50">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl shrink-0 overflow-hidden bg-zinc-900 border border-[var(--border-color)] flex items-center justify-center">
                            {showImage ? (
                                <img src={user.profileImage} alt={user.username} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-black text-white tracking-wide">{initials}</span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-2xl font-extrabold truncate text-[var(--text-primary)]">{user.username}</h2>
                            <p className="text-sm font-medium mt-0.5 truncate text-[var(--text-primary)] opacity-40">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-[var(--bg-main)] border-[var(--border-color)]">
                            <Hash size={16} className="text-[var(--accent-purple)] opacity-60 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30">Internal ID</p>
                                <p className="text-sm font-black font-mono text-[var(--text-primary)]">{user.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-[var(--bg-main)] border-[var(--border-color)]">
                            <Mail size={16} className="text-[var(--accent-purple)] opacity-60 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30">Email</p>
                                <p className="text-sm font-black truncate text-[var(--text-primary)]">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-[var(--border-color)] bg-[var(--bg-main)] dark:bg-[#030005]">
                    <div className="p-5 rounded-2xl border bg-red-500/5 border-red-500/20">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldAlert size={18} className="text-red-500 shrink-0" />
                            <h3 className="text-sm font-extrabold text-red-600 dark:text-red-400">Danger Zone</h3>
                        </div>
                        <p className="text-xs mb-3 leading-relaxed text-red-600 dark:text-red-400/80">
                            Type the username <span className="font-mono font-bold bg-red-500/10 px-1 rounded">@{user.username}</span> to confirm deletion.
                        </p>

                        {error && <div className="p-2.5 mb-3 text-xs rounded-xl font-bold bg-red-500/10 border border-red-500/20 text-red-500">{error}</div>}

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={confirmText}
                                onChange={e => setConfirmText(e.target.value)}
                                placeholder={`Confirm username...`}
                                className="flex-1 px-3 py-2 text-sm rounded-xl outline-none border [color-scheme:dark] bg-[var(--bg-main)] text-[var(--text-primary)] border-red-500/20 focus:ring-2 focus:ring-red-500/40"
                            />
                            <button onClick={handleDelete} disabled={isDeleting || confirmText !== user.username} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-40 transition-all shadow-sm">
                                <Trash2 size={16} />
                                {isDeleting ? '...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}