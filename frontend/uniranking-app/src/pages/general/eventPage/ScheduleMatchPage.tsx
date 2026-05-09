import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Header from '../../../components/Header'
import NavBar from '../../../components/NavBar'
import Footer from '../../../components/Footer'
import PendingMatchSection from './pendingSection/PendingMatchSection'
import UpcomingMatchSection from './upcomingSection/UpcomingMatchSection'
import FinishedMatchSection from './finishedSection/FinishedMatchSection'

export default function ScheduleMatchPage() {
    const [activeSection, setActiveSection] = useState<'pending' | 'upcoming' | 'finished' | null>(null);

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Header />

            <div className="flex flex-1">
                <NavBar />

                <main className="ml-64 flex-1 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="flex-1 px-8 py-10 max-w-5xl w-full mx-auto space-y-10">

                        {/* Back Arrow */}
                        <a href="/home" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-purple-600 transition-all hover:-translate-x-1 w-fit">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </a>

                        <PendingMatchSection
                            hidden={activeSection !== null && activeSection !== 'pending'}
                            onToggle={(isExpanded) => setActiveSection(isExpanded ? 'pending' : null)}
                        />

                        {activeSection === null && (
                            <div className="border-t border-zinc-200" />
                        )}

                        <div className={activeSection === null ? "grid grid-cols-1 md:grid-cols-2 gap-8" : ""}>
                            <UpcomingMatchSection
                                hidden={activeSection !== null && activeSection !== 'upcoming'}
                                onToggle={(isExpanded) => setActiveSection(isExpanded ? 'upcoming' : null)}
                            />
                            <FinishedMatchSection
                                hidden={activeSection !== null && activeSection !== 'finished'}
                                onToggle={(isExpanded) => setActiveSection(isExpanded ? 'finished' : null)}
                            />
                        </div>

                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}