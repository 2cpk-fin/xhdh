import React, { useState } from 'react';
import userApi from '../apis/userApi';
import { AxiosError } from 'axios';
import type { UserResponse } from '../types/user';

interface ConfigProps {
    user: UserResponse;
    onUserUpdate: (updatedUser: UserResponse) => void;
}

const ProfileConfigBox = ({ user, onUserUpdate }: ConfigProps) => {
    const [inputs, setInputs] = useState({ username: '', email: '', password: '' });

    // Handle text updates
    const handleUpdate = async (type: 'username' | 'email' | 'password') => {
        if (!inputs[type].trim()) {
            alert(`Please enter a value for ${type} before saving.`);
            return;
        }

        try {
            let res: UserResponse | undefined;
            if (type === 'username') res = await userApi.updateUsername(user.id, inputs.username);
            else if (type === 'email') res = await userApi.updateEmail(user.id, inputs.email);
            else if (type === 'password') res = await userApi.updatePassword(user.id, inputs.password);

            if (res) {
                onUserUpdate(res);
                setInputs({ ...inputs, [type]: '' });
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            alert(axiosError.response?.data?.message || `Update failed.`);
        }
    };

    // Handle File to Base64 string conversion
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64String = (reader.result as string).split(',')[1];
                const res = await userApi.updateProfileImage(user.id, base64String);
                if (res) {
                    onUserUpdate(res);
                }
            } catch (err) {
                const axiosError = err as AxiosError<{ message: string }>;
                alert(axiosError.response?.data?.message || `Image upload failed.`);
            }
            e.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async () => {
        if (!confirm("Permanently delete account?")) return;
        try {
            await userApi.deleteUser(user.id);
            localStorage.clear();
            window.location.href = '/register';
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            alert(axiosError.response?.data?.message || "Delete failed.");
        }
    };

    return (
        <div className="bg-white dark:bg-[#000000] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm transition-colors duration-300">
            <h3 className="font-bold text-xl mb-8 text-zinc-900 dark:text-white tracking-tight">Account Settings</h3>

            <div className="space-y-8">
                {/* Clean Avatar Upload Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 transition-colors">
                    <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white">Profile Picture</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Recommended: Square image, max 2MB.</p>
                    </div>
                    <label className="cursor-pointer inline-flex items-center justify-center px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-purple-600 dark:hover:bg-purple-500 font-medium text-sm rounded-xl transition-all shadow-sm">
                        Upload Photo
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>

                {/* Form Inputs Grid */}
                <div className="space-y-6">
                    {[
                        { id: 'username', label: 'Username', placeholder: user.username, type: 'text' },
                        { id: 'email', label: 'Email Address', placeholder: user.email, type: 'email' },
                        { id: 'password', label: 'New Password', placeholder: 'Enter new password...', type: 'password' }
                    ].map((field) => (
                        <div key={field.id} className="flex flex-col gap-2 group">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {field.label}
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    value={inputs[field.id as keyof typeof inputs]}
                                    onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
                                />
                                <button
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onClick={() => handleUpdate(field.id as any)}
                                    className="px-8 py-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-black font-semibold text-sm rounded-xl transition-all border border-zinc-200 dark:border-zinc-800"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Danger Zone */}
                <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <h4 className="font-semibold text-red-500 mb-2">Danger Zone</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">Once you delete your account, there is no going back. Please be certain.</p>
                    <button
                        onClick={handleDelete}
                        className="px-6 py-2.5 bg-transparent border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-semibold text-sm rounded-xl transition-all"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileConfigBox;