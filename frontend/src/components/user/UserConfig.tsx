import React, { useState } from 'react';
import UserApi from '../../api/UserApi';

interface UserConfigProps {
    userId: number;
    currentUser: {
        username: string;
        email: string;
    };
}

const UserConfig: React.FC<UserConfigProps> = ({ userId, currentUser }) => {
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleEmailUpdate = async () => {
        try {
            await UserApi.updateEmail(userId, email);
            alert('Email updated!');
        } catch (err) {
            console.error(err);
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            await UserApi.updatePassword(userId, password);
            alert('Password updated!');
            setPassword('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpdate = async () => {
        try {
            await UserApi.updateProfileImage(userId, imageUrl);
            alert('Image URL updated!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg border border-gray-200 mt-4 space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">User Settings</h3>

            {/* Email Section */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Update Email</label>
                <div className="flex space-x-2">
                    <input
                        className="border p-2 rounded flex-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleEmailUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                </div>
            </div>

            {/* Password Section */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="flex space-x-2">
                    <input
                        type="password"
                        className="border p-2 rounded flex-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handlePasswordUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                </div>
            </div>

            {/* Profile Image Section */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Profile Image URL</label>
                <div className="flex space-x-2">
                    <input
                        className="border p-2 rounded flex-1"
                        placeholder="https://..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <button onClick={handleImageUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Apply</button>
                </div>
            </div>
        </div>
    );
};

export default UserConfig;