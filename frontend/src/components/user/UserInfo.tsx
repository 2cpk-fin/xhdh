import React from 'react';
import type { UserResponse } from '../../types/User';

interface UserInfoProps {
    user: UserResponse;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    return (
        <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
                {/* Profile Image Logic */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {user.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt={user.username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;