import Header from '../components/Header'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import PendingMatchSection from '../components/PendingMatchSection'
import UpcomingMatchSection from '../components/UpcomingMatchSection'
import FinishedMatchSection from '../components/FinishedMatchSection'

export default function ScheduleMatchPage() {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Header />

            <div className="flex flex-1">
                <NavBar />

                <main className="ml-64 flex-1 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="flex-1 px-8 py-10 max-w-5xl w-full mx-auto space-y-10">

                        {/* Live matches — full width */}
                        <PendingMatchSection />

                        {/* Divider */}
                        <div className="border-t border-zinc-200" />

                        {/* Upcoming | Finished — side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <UpcomingMatchSection />
                            <FinishedMatchSection />
                        </div>

                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}