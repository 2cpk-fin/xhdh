import { useState } from 'react'
import { Plus } from 'lucide-react'
import UniversitySearchingBox from './UniversitySearchingBox'
import UniversityControllingBox from './UniversityControllingBox'
import Header from '../../../components/Header'
import NavBar from '../../../components/NavBar'
import Footer from '../../../components/Footer'
import type { UniversityResponse } from '../../../types/university'

export default function UniversityControlPage() {
    const [selectedUniversity, setSelectedUniversity] = useState<UniversityResponse | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleSuccess = () => {
        setSelectedUniversity(null)
        setIsCreating(false)
        setRefreshKey(k => k + 1)
    }

    return (
        /* The outermost container fills the entire width and height with the void color */
        <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[var(--bg-main)] dark:bg-[#030005]">
            <Header />
            <div className="flex flex-1">
                <NavBar />

                {/* ml-64 offset ensures the page content does not hide under the sidebar */}
                <main className="flex-1 ml-64 flex flex-col min-h-[calc(100vh-64px)]">

                    {/* This inner div handles the 6xl centered content width */}
                    <div className="flex-1 max-w-6xl w-full mx-auto px-8 py-10 space-y-10">

                        {/* Header Section */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">University Control</h1>
                                <p className="text-[var(--text-primary)] opacity-40 mt-1 font-medium">Manage universities, ELO ratings, and tags.</p>
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all active:scale-95"
                            >
                                <Plus size={20} className="mr-2" /> Create University
                            </button>
                        </div>

                        {/* Search and List Container */}
                        <div className="bg-[var(--bg-side)] dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm transition-all">
                            <UniversitySearchingBox
                                key={refreshKey}
                                onSelect={setSelectedUniversity}
                            />
                        </div>

                    </div>
                    <Footer />
                </main>
            </div>

            {/* Modals are rendered outside the main flow */}
            {selectedUniversity && (
                <UniversityControllingBox
                    university={selectedUniversity}
                    onClose={() => setSelectedUniversity(null)}
                    onSuccess={handleSuccess}
                />
            )}

            {isCreating && (
                <UniversityControllingBox
                    onClose={() => setIsCreating(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}