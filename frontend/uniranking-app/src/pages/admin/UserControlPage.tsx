import { useState } from 'react'
import UserSearchingBox from './UserSearchingBox'
import UserControllingBox from './UserControllingBox'
import type { UserResponse } from '../../types/user'

export default function UserControlPage() {
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleSuccess = () => {
        setSelectedUser(null)
        setRefreshKey(k => k + 1)
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">User Control</h1>
                    <p className="text-zinc-500 mt-1 font-medium">Review and moderate user accounts.</p>
                </div>
            </div>

            {/* User List */}
            <div className="bg-zinc-50/50 border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <UserSearchingBox
                    key={refreshKey}
                    onSelect={setSelectedUser}
                />
            </div>

            {/* Modal */}
            {selectedUser && (
                <UserControllingBox
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}