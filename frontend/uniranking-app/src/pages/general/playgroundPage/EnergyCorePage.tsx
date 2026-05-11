import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import EnergyCore from './EnergyCore';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';

const EnergyCorePage = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const neonCyan = '#06b6d4';

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-700 bg-[var(--bg-main)]">
            <NavBar />

            <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl pointer-events-none">
                    <div
                        className="w-full h-full rounded-full blur-[120px] transition-opacity duration-700"
                        style={{
                            background: neonCyan,
                            opacity: isDarkMode ? 0.1 : 0.05
                        }}
                    />
                </div>

                <div className="absolute top-24 left-8 z-20">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/playground')}
                        className="text-[var(--text-primary)] opacity-40 hover:opacity-100 hover:bg-[var(--text-primary)]/5 gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Playground
                    </Button>
                </div>

                <div className="w-full h-[75vh] max-w-5xl relative z-10">
                    <EnergyCore />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-12 px-8 py-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-side)] backdrop-blur-md z-20 flex items-center gap-6 shadow-xl"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">System Status</span>
                        <span className="text-[var(--text-primary)] font-bold">CORE ONLINE</span>
                    </div>
                    <div className="w-px h-8 bg-[var(--border-color)]" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Containment</span>
                        <span className="text-[var(--text-primary)] font-bold">STABLE</span>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default EnergyCorePage;