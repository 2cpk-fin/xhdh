import { Link } from 'react-router-dom';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// You can extract this into its own file in your components folder later if you want to reuse it elsewhere!
const NavBox = ({ title, description, to }: { title: string; description: string; to: string }) => {
    return (
        <Link
            to={to}
            className="block p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all active:scale-[0.98] group"
        >
            <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-black transition-colors">
                {title}
            </h3>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                {description}
            </p>
        </Link>
    );
};

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans antialiased">
            <Header />

            <div className="flex flex-1">
                <NavBar />

                {/* ml-64 to offset the NavBar, mt-16 to offset the Header */}
                <main className="flex-1 ml-64 mt-16 p-8 md:p-12 flex flex-col">
                    <div className="flex-grow max-w-7xl w-full mx-auto">

                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-3">
                            Welcome to UniRanking
                        </h1>
                        <p className="text-sm font-medium text-zinc-500 mb-10">
                            Select a category from the sidebar to start exploring university rankings and community updates.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* The new NavBox component replacing the text */}
                            <NavBox
                                to="/solo"
                                title="Solo Match Arena"
                                description="Pit two universities against each other in a 1v1 duel and vote for the winner."
                            />

                            {/* You can easily add more boxes here later like this: */}
                            {/* <NavBox to="/leaderboard" title="Global Rankings" description="View the top universities..." /> */}
                        </div>

                    </div>

                    {/* Keeps footer pushed to the bottom of the flex container */}
                    <div className="mt-12">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;