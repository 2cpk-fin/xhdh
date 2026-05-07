import { useState } from 'react'
import { Plus } from 'lucide-react'
import UniversitySearchingBox from './UniversitySearchingBox'
import UniversityControllingBox from './UniversityControllingBox'
import type { UniversityResponse } from '../../types/university'

export default function UniversityControlPage() {
    const [selectedUniversity, setSelectedUniversity] = useState<UniversityResponse | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleSuccess = () => {
        setSelectedUniversity(null)
        setIsCreating(false)
        setRefreshKey(k => k + 1) // triggers re-fetch in UniversitySearchingBox
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">University Control</h1>
                    <p className="text-zinc-500 mt-1 font-medium">Manage universities, ELO ratings, and tags.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold shadow-sm hover:bg-purple-700 transition-all active:scale-95"
                >
                    <Plus size={20} className="mr-2" /> Create University
                </button>
            </div>

            {/* University List */}
            <div className="bg-zinc-50/50 border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <UniversitySearchingBox
                    key={refreshKey}
                    onSelect={setSelectedUniversity}
                />
            </div>

            {/* Edit Modal */}
            {selectedUniversity && (
                <UniversityControllingBox
                    university={selectedUniversity}
                    onClose={() => setSelectedUniversity(null)}
                    onSuccess={handleSuccess}
                />
            )}

            {/* Create Modal */}
            {isCreating && (
                <UniversityControllingBox
                    onClose={() => setIsCreating(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}