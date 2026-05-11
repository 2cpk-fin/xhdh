import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity } from 'lucide-react';
import NavBar from '../../../components/NavBar';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';

const ElectricCircuitPage = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();

    const neonGreen = '#22c55e';
    const softGreen = '#4ade80';

    const circuitData = useMemo(() => ({
        paths: [
            "M 0 150 H 1400", "M 0 350 H 1400", "M 0 550 H 1400", "M 0 750 H 1400",
            "M 250 0 V 800", "M 650 0 V 800", "M 1050 0 V 800",
            "M 150 150 L 350 350 L 550 150", "M 750 550 L 950 750 L 1150 550",
            "M 450 350 L 650 550 L 850 350"
        ],
        nodes: [
            { x: 250, y: 150 }, { x: 650, y: 350 }, { x: 1050, y: 550 },
            { x: 350, y: 350 }, { x: 950, y: 750 }, { x: 650, y: 550 }
        ]
    }), []);

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-700 bg-[var(--bg-main)] overflow-hidden">
            <NavBar />

            <main className="flex-1 relative flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <svg width="100%" height="100%" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <filter id="circuitGlow">
                                <feGaussianBlur stdDeviation="3.5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {circuitData.paths.map((d, i) => (
                            <motion.path
                                key={`bg-path-${i}`}
                                d={d}
                                fill="none"
                                stroke={isDarkMode ? "rgba(34, 197, 94, 0.18)" : "rgba(22, 163, 74, 0.12)"}
                                strokeWidth="2.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 2.5, ease: "easeInOut", delay: i * 0.1 }}
                            />
                        ))}

                        <g filter="url(#circuitGlow)">
                            {circuitData.paths.map((path, i) => (
                                <React.Fragment key={`electron-group-${i}`}>
                                    <motion.circle
                                        r="4"
                                        fill={softGreen}
                                        animate={{
                                            offsetDistance: ["0%", "100%"]
                                        }}
                                        transition={{
                                            duration: 2.5 + (i % 4),
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: i * 0.5
                                        }}
                                        style={{ offsetPath: `path("${path}")` }}
                                    />
                                    <motion.circle
                                        r="2.5"
                                        fill={softGreen}
                                        opacity={0.5}
                                        animate={{
                                            offsetDistance: ["0%", "100%"]
                                        }}
                                        transition={{
                                            duration: 2.5 + (i % 4),
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: i * 0.5 + 0.25
                                        }}
                                        style={{ offsetPath: `path("${path}")` }}
                                    />
                                </React.Fragment>
                            ))}
                        </g>

                        {circuitData.nodes.map((node, i) => (
                            <motion.circle
                                key={`node-${i}`}
                                cx={node.x}
                                cy={node.y}
                                r={7}
                                fill={neonGreen}
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.6, 1, 0.6]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.4
                                }}
                            />
                        ))}
                    </svg>
                </div>

                <div className="absolute top-24 left-8 z-20">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/playground')}
                        className="text-[var(--text-primary)] opacity-40 hover:opacity-100 gap-2 font-bold tracking-tight"
                    >
                        <ArrowLeft size={16} /> Back to Playground
                    </Button>
                </div>

                <div className="absolute bottom-12 right-12 z-10 text-right pointer-events-none select-none">
                    <motion.div
                        className="flex items-center gap-3 justify-end mb-2"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Activity className="text-green-500" size={26} />
                        <h2 className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">POWER GRID</h2>
                    </motion.div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-primary)] opacity-30">
                        Signal: Synchronized • Potential: 220kV • Status: Active
                    </p>
                </div>

                <motion.div
                    className="z-10 bg-[var(--bg-side)]/45 backdrop-blur-2xl border border-[var(--border-color)] p-12 rounded-[3rem] shadow-2xl max-w-lg text-center"
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)] mb-4">Electric Field</h1>
                    <p className="text-base font-medium text-[var(--text-primary)] opacity-65 leading-relaxed">
                        Visualizing energy propagation across complex logic matrices. The electron flow follows predefined synchronized paths managed by the central containment grid.
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

export default ElectricCircuitPage;