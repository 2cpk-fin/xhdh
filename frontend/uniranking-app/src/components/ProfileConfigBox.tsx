import React, { useState } from 'react';
import userApi from '../api/userApi';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import type { UserResponse } from '../types/user';

interface ConfigProps {
    user: UserResponse;
    onUserUpdate: (updatedUser: UserResponse) => void;
}

type FieldId = 'username' | 'email' | 'password';

const fields: { id: FieldId; label: string; placeholder: (user: UserResponse) => string; type: string }[] = [
    { id: 'username', label: 'Username', placeholder: (u) => u.username, type: 'text' },
    { id: 'email', label: 'Email Address', placeholder: (u) => u.email, type: 'email' },
    { id: 'password', label: 'New Password', placeholder: () => 'Enter new password...', type: 'password' },
];

const ProfileConfigBox = ({ user, onUserUpdate }: ConfigProps) => {
    const [inputs, setInputs] = useState<Record<FieldId, string>>({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState<FieldId | 'image' | null>(null);
    const [errors, setErrors] = useState<Partial<Record<FieldId | 'image', string>>>({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const setError = (key: FieldId | 'image', message: string) =>
        setErrors((prev) => ({ ...prev, [key]: message }));

    const clearError = (key: FieldId | 'image') =>
        setErrors((prev) => ({ ...prev, [key]: undefined }));

    const handleUpdate = async (type: FieldId) => {
        if (!inputs[type].trim()) {
            setError(type, `Please enter a value before saving.`);
            return;
        }

        setLoading(type);
        clearError(type);

        try {
            let res: UserResponse | undefined;
            if (type === 'username') res = await userApi.updateUsername(user.id, inputs.username);
            else if (type === 'email') res = await userApi.updateEmail(user.id, inputs.email);
            else if (type === 'password') res = await userApi.updatePassword(user.id, inputs.password);

            if (res) {
                onUserUpdate(res);
                setInputs((prev) => ({ ...prev, [type]: '' }));
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(type, axiosError.response?.data?.message || 'Update failed.');
        } finally {
            setLoading(null);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError('image', 'Image must be under 2MB.');
            e.target.value = '';
            return;
        }

        clearError('image');
        const reader = new FileReader();
        reader.onloadend = async () => {
            setLoading('image');
            try {
                const base64String = (reader.result as string).split(',')[1];
                const res = await userApi.updateProfileImage(user.id, base64String);
                if (res) onUserUpdate(res);
            } catch (err) {
                const axiosError = err as AxiosError<{ message: string }>;
                setError('image', axiosError.response?.data?.message || 'Image upload failed.');
            } finally {
                setLoading(null);
                e.target.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async () => {
        try {
            await userApi.deleteUser(user.id);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/register';
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError('image', axiosError.response?.data?.message || 'Delete failed.');
        }
    };

    return (
        <div className="w-full bg-white dark:bg-[#000000] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 sm:p-8 shadow-sm transition-all duration-300">
            <h3 className="font-black text-2xl mb-8 text-zinc-900 dark:text-white tracking-tight">Account Settings</h3>

            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 transition-colors">
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white">Profile Picture</h4>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Recommended: Square image, max 2MB.</p>
                        {errors.image && (
                            <p className="text-xs font-bold text-red-500 mt-2">{errors.image}</p>
                        )}
                    </div>
                    <label className={`cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-purple-600 dark:hover:bg-purple-500 font-bold text-sm rounded-2xl transition-all shadow-sm active:scale-95 ${loading === 'image' ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                        {loading === 'image' ? 'Uploading...' : 'Upload Photo'}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={loading !== null} />
                    </label>
                </div>

                <div className="space-y-6">
                    {fields.map((field) => (
                        <div key={field.id} className="flex flex-col gap-2 group">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                                {field.label}
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <input
                                        type={field.id === 'password' && showPassword ? 'text' : field.type}
                                        placeholder={field.placeholder(user)}
                                        className={`w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400/20 transition-all ${field.id === 'password' ? 'pr-12' : ''}`}
                                        value={inputs[field.id]}
                                        onChange={(e) => {
                                            setInputs((prev) => ({ ...prev, [field.id]: e.target.value }));
                                            clearError(field.id);
                                        }}
                                    />
                                    {field.id === 'password' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-purple-500 transition-colors p-1"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleUpdate(field.id)}
                                    disabled={loading !== null}
                                    className="px-8 py-3.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-black font-bold text-sm rounded-2xl transition-all border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm shrink-0"
                                >
                                    {loading === field.id ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                            {errors[field.id] && (
                                <p className="text-xs font-bold text-red-500 ml-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <h4 className="font-bold text-red-500 mb-2">Danger Zone</h4>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-6">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>

                    {!confirmDelete ? (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="px-6 py-3 bg-white dark:bg-transparent border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-bold text-sm rounded-2xl transition-all shadow-sm active:scale-95"
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-red-50 dark:bg-red-900/10 p-5 rounded-3xl border border-red-100 dark:border-red-900/30">
                            <span className="text-sm text-red-600 dark:text-red-400 font-bold">Are you sure? This cannot be undone.</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    disabled={loading !== null}
                                    className="px-6 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-6 py-2.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileConfigBox;