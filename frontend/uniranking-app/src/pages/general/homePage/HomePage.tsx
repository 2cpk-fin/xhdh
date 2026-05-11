// HomePage.tsx
import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import GamemodeBox from './GamemodeBox';
import CinemaIntro from './CinemaIntro';
import { useDarkMode } from '@/hooks/useDarkMode';

const StatPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-4 px-5 py-3 rounded-xl border transition-all duration-300
        bg-[var(--bg-side)] border-[var(--border-color)] shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="text-[var(--accent-purple)] dark:text-[#d946ef]">{icon}</div>
        <div>
            <p className="text-lg font-black leading-none text-[var(--text-primary)]">{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-[var(--text-primary)] opacity-50">{label}</p>
        </div>
    </div>
);

const HomePage = () => {
    const { isDarkMode } = useDarkMode();
    const neonPurple = '#c026d3';
    const neonCyan = '#06b6d4';

    const [showIntro] = useState(() => {
        const should = sessionStorage.getItem('playIntro') === 'true';
        if (should) sessionStorage.removeItem('playIntro');
        return should;
    });

    const [introComplete, setIntroComplete] = useState(!showIntro);

    const fullText = 'UniRanking';
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        if (!introComplete) return;
        const handleTyping = () => {
            if (!isDeleting && displayText.length < fullText.length) {
                setDisplayText(fullText.substring(0, displayText.length + 1));
                setTypingSpeed(150);
            } else if (isDeleting && displayText.length > 0) {
                setDisplayText(fullText.substring(0, displayText.length - 1));
                setTypingSpeed(100);
            } else if (!isDeleting && displayText.length === fullText.length) {
                setIsDeleting(true);
                setTypingSpeed(2000);
            } else if (isDeleting && displayText.length === 0) {
                setIsDeleting(false);
                setTypingSpeed(500);
            }
        };
        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, typingSpeed, introComplete]);

    return (
        <div className="flex flex-col min-h-screen antialiased transition-colors duration-700 bg-[var(--bg-main)]">
            {showIntro && <CinemaIntro onComplete={() => setIntroComplete(true)} />}

            {introComplete && (
                <>
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <NavBar />
                    </motion.div>

                    <main className="flex flex-col flex-1 pt-14">
                        <motion.div
                            className="flex-grow px-8 py-12 max-w-6xl w-full mx-auto"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <div className="mb-14 relative">
                                {isDarkMode && (
                                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />
                                )}

                                <div className="flex items-center gap-2 mb-4">
                                    <Lucide.Zap className="w-5 h-5 text-amber-500 dark:text-[#06b6d4]" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--accent-purple)] dark:text-[#d946ef]">
                                        Dashboard
                                    </span>
                                </div>

                                <h1 className="text-5xl font-black tracking-tighter leading-none mb-4 text-[var(--text-primary)]">
                                    Welcome to{' '}
                                    <span
                                        className="relative inline-block min-w-[300px]"
                                        style={{
                                            color: neonPurple,
                                            textShadow: isDarkMode ? `0 0 20px ${neonPurple}66` : 'none',
                                        }}
                                    >
                                        {displayText}
                                        <span className="ml-1 w-[3px] h-[40px] bg-purple-500 inline-block animate-pulse align-middle" />
                                    </span>
                                </h1>

                                <p className="text-base font-medium max-w-xl leading-relaxed mb-8 text-[var(--text-primary)] opacity-70">
                                    The competitive platform where universities battle for supremacy. Vote, rank, and watch the global leaderboard shift in real time.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <StatPill icon={<Lucide.Trophy className="w-5 h-5" />} value="2,400+" label="Universities" />
                                    <StatPill icon={<Lucide.TrendingUp className="w-5 h-5" />} value="18,420" label="Matches Played" />
                                    <StatPill icon={<Lucide.Users className="w-5 h-5" />} value="5,200" label="Active Voters" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-40">
                                    Gamemodes
                                </p>
                                <div className="flex-1 h-px bg-[var(--border-color)] opacity-50" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GamemodeBox
                                    to="/solo"
                                    title="Solo Match Arena"
                                    description="Pit two universities against each other in a high-stakes 1v1 duel. Every vote directly impacts their global Elo rating."
                                    icon={<Lucide.Swords className="w-6 h-6" />}
                                    accent={neonPurple}
                                    badge="Active"
                                />
                                <GamemodeBox
                                    to="/schedule"
                                    title="Tournament Hub"
                                    description="Organize large-scale bracket competitions or schedule future voting rounds for your favorite institutions."
                                    icon={<Lucide.CalendarDays className="w-6 h-6" />}
                                    accent={neonCyan}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        >
                            <Footer />
                        </motion.div>
                    </main>
                </>
            )}
        </div>
    );
};

export default HomePage;