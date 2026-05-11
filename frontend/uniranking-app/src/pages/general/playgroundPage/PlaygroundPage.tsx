import { motion } from 'framer-motion';
import { Beaker, Zap, Cpu, Activity, Palette } from 'lucide-react';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import PlayBox from './PlayBox';

const PlaygroundPage = () => {
    const neonCyan = '#06b6d4';
    const neonPurple = '#c026d3';
    const neonGreen = '#22c55e';
    const neonYellow = '#facc15';

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-700 bg-[var(--bg-main)]">
            <div className="flex flex-col flex-1">
                <NavBar />

                <main className="flex-1 flex flex-col pt-14">
                    <motion.div
                        className="flex-1 max-w-6xl w-full mx-auto px-8 py-12 space-y-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-cyan-500/10 rounded-2xl">
                                    <Beaker size={28} style={{ color: neonCyan }} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[var(--text-primary)]">
                                    Playground
                                </h1>
                            </div>
                            <p className="text-base font-medium text-[var(--text-primary)] opacity-60 leading-relaxed">
                                Welcome to the experimental zone. Discover interactive UI elements, physics simulations, and hidden features that test the limits of the platform.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <PlayBox
                                to="/energy-core"
                                title="Energy Core"
                                description="Step inside the containment chamber. Interact with the core, adjust stabilization, and observe the reaction."
                                icon={<Zap size={24} />}
                                accent={neonCyan}
                                badge="v1.0.0"
                            />

                            <PlayBox
                                to="/electron-field"
                                title="Electron Field"
                                description="Enter a high-energy field of free-roaming electrons. Drag, throw, and trigger chain reactions in this physics-based simulation."
                                icon={<Cpu size={24} />}
                                accent={neonPurple}
                                badge="v1.0.0"
                            />

                            <PlayBox
                                to="/electric-circuit"
                                title="Electric Circuit"
                                description="A visualization of high-speed electron flow across complex conductive paths. Optimized for maximum neon luminance."
                                icon={<Activity size={24} />}
                                accent={neonGreen}
                                badge="v1.1.0"
                            />

                            <PlayBox
                                to="/paint-field"
                                title="Paint Canvas"
                                description="Release your creativity on a digital blank slate. A simple drawing environment featuring neon palettes and precise brush control."
                                icon={<Palette size={24} />}
                                accent={neonYellow}
                                badge="v1.0.0"
                            />
                        </div>
                    </motion.div>

                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default PlaygroundPage;