import { useState } from 'react'
import UserSearchingBox from './UserSearchingBox'
import UserControllingBox from './UserControllingBox'
import ControlNavBar from '../../../components/ControlNavBar'
import type { UserResponse } from '../../../types/user'

export default function UserControlPage() {
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleSuccess = () => {
        setSelectedUser(null)
        setRefreshKey(k => k + 1)
    }

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[var(--bg-main)] dark:bg-[#030005]">
            <ControlNavBar />

            <main className="flex-1 flex flex-col pt-14">
                <div className="flex-1 max-w-6xl w-full mx-auto px-8 py-10 space-y-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">User Control</h1>
                        <p className="text-[var(--text-primary)] opacity-40 mt-1 font-medium italic">Review and moderate user accounts.</p>
                    </div>

                    <div className="bg-[var(--bg-side)] dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
                        <UserSearchingBox
                            key={refreshKey}
                            onSelect={setSelectedUser}
                        />
                    </div>
                </div>
            </main>

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