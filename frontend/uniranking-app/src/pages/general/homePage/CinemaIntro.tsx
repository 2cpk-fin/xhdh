import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, useAnimate } from 'framer-motion';
import { Swords, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GamemodeBox from './GamemodeBox';
import Cup3D from './Cup3D';

interface CinemaIntroProps {
    onComplete: () => void;
}

const neonPurple = '#c026d3';
const neonCyan = '#06b6d4';

const renderTitle = (text: string) => {
    const prefix = 'Welcome to ';
    if (text.startsWith(prefix)) {
        return (
            <>
                <span className="text-white">{prefix}</span>
                <span style={{ color: neonPurple }}>{text.slice(prefix.length)}</span>
            </>
        );
    }
    return <span style={{ color: neonPurple }}>{text}</span>;
};

const CinemaIntro = ({ onComplete }: CinemaIntroProps) => {
    const [phase, setPhase] = useState<'cup_move' | 'text' | 'cards' | 'outro'>('cup_move');
    const [displayText, setDisplayText] = useState('');
    const [showCards, setShowCards] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const [visible, setVisible] = useState(true);
    const skipRef = useRef(false);

    const [scope, cupAnimate] = useAnimate();
    const cupScale = useMotionValue(0.15);
    const cupOpacity = useMotionValue(0);

    const finish = () => {
        setVisible(false);
        setTimeout(() => onComplete(), 650);
    };

    const skipIntro = () => {
        if (skipRef.current) return;
        skipRef.current = true;
        finish();
    };

    useEffect(() => {
        const sequence = async () => {
            if (skipRef.current) return;

            animate(cupOpacity, 1, { duration: 0.5 });
            animate(cupScale, 0.7, { duration: 0.8, ease: 'easeOut' });

            await cupAnimate(scope.current,
                {
                    x: [-500, 300, -200, 0],
                    y: [500, -300, -100, 0],
                },
                {
                    duration: 3.5,
                    ease: [0.25, 0.1, 0.25, 1],
                    times: [0, 0.4, 0.7, 1]
                }
            );

            animate(cupScale, 1, { duration: 0.5, ease: 'backOut' });

            if (!skipRef.current) setPhase('text');
        };

        sequence();
    }, [cupAnimate, cupOpacity, cupScale]);

    useEffect(() => {
        if (phase !== 'text') return;

        const fullLine = 'Welcome to UniRanking';
        let current = '';
        let deleting = false;
        let timer: ReturnType<typeof setTimeout>;

        const tick = () => {
            if (skipRef.current) return;

            if (!deleting && current.length < fullLine.length) {
                current = fullLine.slice(0, current.length + 1);
                setDisplayText(current);
                timer = setTimeout(tick, 40);
            } else if (!deleting && current.length === fullLine.length) {
                setShowCards(true);
                timer = setTimeout(() => { deleting = true; tick(); }, 1200);
            } else if (deleting && current.length > 'Welcome to '.length) {
                current = fullLine.slice(0, current.length - 1);
                setDisplayText(current);
                timer = setTimeout(tick, 30);
            } else {
                setPhase('outro');
                setTimeout(() => {
                    if (!skipRef.current) finish();
                }, 400);
            }
        };

        timer = setTimeout(tick, 100);
        return () => clearTimeout(timer);
    }, [phase]);

    useEffect(() => {
        const id = setInterval(() => setShowCursor(c => !c), 530);
        return () => clearInterval(id);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="cinema-overlay"
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
                    style={{ background: '#080810' }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
                >
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                            style={{ background: `radial-gradient(circle, ${neonPurple}14 0%, transparent 70%)` }}
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <div
                            className="absolute inset-0 opacity-[0.025]"
                            style={{
                                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
                                backgroundSize: '100% 3px',
                            }}
                        />
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipIntro}
                        className="absolute top-5 right-5 text-xs text-white/40 hover:text-white/80 hover:bg-white/5 z-10 tracking-widest uppercase font-bold"
                    >
                        Skip →
                    </Button>

                    <div className="relative flex flex-col items-center justify-center gap-6 w-full">
                        <AnimatePresence>
                            {phase !== 'cup_move' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-4xl md:text-5xl font-black tracking-tighter text-center select-none"
                                    style={{ textShadow: `0 0 40px ${neonPurple}55` }}
                                >
                                    {renderTitle(displayText)}
                                    <span
                                        className="ml-1 inline-block w-[3px] h-[38px] align-middle"
                                        style={{
                                            background: neonPurple,
                                            opacity: showCursor ? 1 : 0,
                                            transition: 'opacity 0.1s',
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            ref={scope}
                            style={{ scale: cupScale, opacity: cupOpacity }}
                            className="relative flex items-center justify-center w-48 h-48"
                        >
                            <motion.div
                                className="absolute w-36 h-36 rounded-full blur-2xl"
                                style={{ background: `${neonPurple}30` }}
                                animate={phase !== 'cup_move' ? { scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] } : {}}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            />
                            <Cup3D
                                className="relative z-10"
                                style={{
                                    filter: `drop-shadow(0 0 24px #facc1588) drop-shadow(0 0 48px ${neonPurple}44)`,
                                }}
                            />
                        </motion.div>

                        <AnimatePresence>
                            {showCards && (
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl px-8 mt-8"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: {},
                                        visible: { transition: { staggerChildren: 0.1 } },
                                    }}
                                >
                                    <motion.div
                                        variants={{
                                            hidden: { x: -300, opacity: 0 },
                                            visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
                                        }}
                                    >
                                        <GamemodeBox
                                            to="/solo"
                                            title="Solo Match Arena"
                                            description="Pit two universities in a high-stakes 1v1 duel. Every vote impacts their global Elo."
                                            icon={<Swords className="w-6 h-6" />}
                                            accent={neonPurple}
                                            badge="Active"
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={{
                                            hidden: { x: 300, opacity: 0 },
                                            visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
                                        }}
                                    >
                                        <GamemodeBox
                                            to="/schedule"
                                            title="Tournament Hub"
                                            description="Organize bracket competitions and schedule voting rounds for institutions."
                                            icon={<CalendarDays className="w-6 h-6" />}
                                            accent={neonCyan}
                                        />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CinemaIntro;