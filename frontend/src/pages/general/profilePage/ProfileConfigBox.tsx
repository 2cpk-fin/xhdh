import { useState, type ChangeEvent } from 'react';
import userApi from '../../../api/userApi';
import { AxiosError } from 'axios';
import { Eye, EyeOff, Camera } from 'lucide-react';
import type { UserResponse } from '../../../types/user';

const ProfileConfigBox = ({ user, onUserUpdate }: { user: UserResponse; onUserUpdate: (u: UserResponse) => void }) => {
    const [inputs, setInputs] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [, setConfirmDelete] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleUpdate = async (type: 'username' | 'email' | 'password') => {
        if (!inputs[type].trim()) return;
        setLoading(type);
        setError(null);
        try {
            let res;
            if (type === 'username') res = await userApi.updateUsername(user.id, inputs.username);
            else if (type === 'email') res = await userApi.updateEmail(user.id, inputs.email);
            else res = await userApi.updatePassword(user.id, inputs.password);

            if (res) {
                onUserUpdate(res);
                setInputs(p => ({ ...p, [type]: '' }));
            }
        } catch (err) {
            const ae = err as AxiosError<{ message: string }>;
            setError(ae.response?.data?.message || 'Update failed');
        } finally {
            setLoading(null);
        }
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: Ensure it's under 5MB to avoid payload size issues
        if (file.size > 5 * 1024 * 1024) {
            setError("Image too large (max 5MB)");
            return;
        }

        setLoading('image');
        setError(null);

        const reader = new FileReader();

        // Convert file to Base64 string
        reader.readAsDataURL(file);

        reader.onload = async () => {
            try {
                const base64String = reader.result as string;

                // Send the string to your "perfect" API
                const res = await userApi.updateProfileImage(user.id, base64String);

                if (res) {
                    onUserUpdate(res);
                }
            } catch (err) {
                const ae = err as AxiosError<{ message: string }>;
                setError(ae.response?.data?.message || 'Image upload failed');
            } finally {
                setLoading(null);
            }
        };

        reader.onerror = () => {
            setError("Failed to read file");
            setLoading(null);
        };
    };

    return (
        <div className="w-full bg-[var(--bg-side)] border border-[var(--border-color)] rounded-[2.5rem] p-6 sm:p-8 shadow-sm transition-all duration-300">
            <h3 className="font-black text-2xl mb-8 text-[var(--text-primary)] tracking-tight">Account Settings</h3>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-2xl">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                {/* Image Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl bg-[var(--text-primary)]/5 border border-[var(--border-color)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[var(--accent-purple)]/10 rounded-2xl text-[var(--accent-purple)]">
                            <Camera size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[var(--text-primary)]">Profile Picture</h4>
                            <p className="text-xs font-medium text-[var(--text-primary)] opacity-50 mt-1">Recommended: Square image, max 5MB.</p>
                        </div>
                    </div>
                    <label className={`cursor-pointer px-6 py-3 font-bold text-sm rounded-2xl transition-all active:scale-95 flex items-center justify-center min-w-[140px]
                        ${loading === 'image'
                            ? 'bg-[var(--text-primary)]/10 text-[var(--text-primary)] opacity-50 cursor-not-allowed'
                            : 'bg-[var(--text-primary)] text-[var(--bg-side)] hover:bg-[var(--accent-purple)] hover:text-white'}`}>
                        {loading === 'image' ? 'Uploading...' : 'Upload Photo'}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={loading === 'image'}
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>

                {/* Fields */}
                <div className="space-y-6">
                    {(['username', 'email', 'password'] as const).map((id) => (
                        <div key={id} className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-[var(--text-primary)] opacity-70 ml-1 capitalize">{id}</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <input
                                        type={id === 'password' && !showPassword ? 'password' : 'text'}
                                        placeholder={`Update ${id}...`}
                                        className="w-full px-5 py-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]/20 transition-all"
                                        value={inputs[id]}
                                        onChange={e => setInputs(p => ({ ...p, [id]: e.target.value }))}
                                    />
                                    {id === 'password' && (
                                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 p-1">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleUpdate(id)}
                                    disabled={loading === id}
                                    className="px-8 py-3.5 bg-[var(--text-primary)]/5 text-[var(--text-primary)] hover:bg-blue-600 hover:text-white font-bold text-sm rounded-2xl border border-[var(--border-color)] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading === id ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Danger Zone */}
                <div className="pt-8 mt-8 border-t border-[var(--border-color)]">
                    <h4 className="font-bold text-red-500 mb-2">Danger Zone</h4>
                    <p className="text-sm font-medium text-[var(--text-primary)] opacity-40 mb-6">Account deletion is permanent.</p>
                    <button onClick={() => setConfirmDelete(true)} className="px-6 py-3 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white font-bold text-sm rounded-2xl transition-all">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileConfigBox;