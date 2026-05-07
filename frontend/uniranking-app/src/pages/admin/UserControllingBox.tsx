import { useState } from 'react'
import { X, Trash2, Mail, Hash, ShieldAlert } from 'lucide-react'
import userApi from '../../api/userApi'
import type { UserResponse } from '../../types/user'

type Props = {
    user: UserResponse
    onClose: () => void
    onSuccess: () => void
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
            <div className="bg-zinc-100 rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full text-zinc-400 hover:text-red-500 shadow-sm z-10 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="bg-white p-8 flex flex-col gap-6">
                    {/* Avatar & Header */}
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl shrink-0 overflow-hidden bg-zinc-900 flex items-center justify-center">
                            {showImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.username}
                                    onError={() => setImgError(true)}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-black text-white tracking-wide">{initials}</span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-2xl font-extrabold text-zinc-900 truncate">{user.username}</h2>
                            <p className="text-sm text-zinc-400 font-medium mt-0.5 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Stat Chips */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-200">
                            <Hash size={16} className="text-zinc-400 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Internal ID</p>
                                <p className="text-sm font-black text-zinc-800 font-mono">{user.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-200">
                            <Hash size={16} className="text-zinc-400 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Public ID</p>
                                <p className="text-sm font-black text-zinc-800 font-mono truncate">{user.publicUserId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-200">
                            <Mail size={16} className="text-zinc-400 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Email</p>
                                <p className="text-sm font-black text-zinc-800 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="p-8 bg-white border-t border-zinc-100">
                    <div className="p-5 rounded-2xl bg-red-50 border border-red-200">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldAlert size={18} className="text-red-500 shrink-0" />
                            <h3 className="text-sm font-extrabold text-red-700">Danger Zone — Delete Account</h3>
                        </div>
                        <p className="text-xs text-red-500 mb-3 leading-relaxed">
                            This action is <span className="font-bold">permanent and irreversible</span>. Type the username{' '}
                            <span className="font-mono font-bold bg-red-100 px-1 rounded">{user.username}</span> below to confirm.
                        </p>

                        {error && (
                            <div className="p-2.5 mb-3 text-xs text-red-600 bg-white border border-red-200 rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={confirmText}
                                onChange={e => setConfirmText(e.target.value)}
                                placeholder={`Type "${user.username}" to confirm`}
                                className="flex-1 px-3 py-2 bg-white border border-red-200 rounded-xl text-sm focus:ring-2 focus:ring-red-400 outline-none placeholder-red-300"
                            />
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting || confirmText !== user.username}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <Trash2 size={16} />
                                {isDeleting ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}