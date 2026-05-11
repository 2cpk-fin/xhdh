// PaintPage.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eraser, Trash2, Download, Palette } from 'lucide-react';
import NavBar from '../../../components/NavBar';
import { Button } from '@/components/ui/button';
import ColorPicker from './ColorPicker';

const PaintPage = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#facc15');
    const [brushSize, setBrushSize] = useState(5);
    const neonYellow = '#facc15';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
        setIsDrawing(false);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = brushSize;
        ctx.strokeStyle = color;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'masterpiece.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-700 bg-[var(--bg-main)]">
            <NavBar />

            <main className="flex-1 relative flex flex-col pt-14">
                <div className="absolute top-24 left-8 z-20">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/playground')}
                        className="text-[var(--text-primary)] opacity-40 hover:opacity-100 gap-2 font-bold"
                    >
                        <ArrowLeft size={16} /> Back to Playground
                    </Button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-5xl bg-[var(--bg-side)] border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        <div className="p-6 border-b md:border-b-0 md:border-r border-[var(--border-color)] bg-[var(--bg-side)]/50 backdrop-blur-xl flex flex-col gap-8 w-full md:w-64">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Palette size={18} style={{ color: neonYellow }} />
                                    <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] opacity-40">Brush Settings</span>
                                </div>
                                <ColorPicker currentColor={color} onChange={setColor} />
                            </div>

                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-40 block mb-4">Brush Size: {brushSize}px</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                    className="w-full accent-[#facc15]"
                                />
                            </div>

                            <div className="mt-auto space-y-3">
                                <Button variant="outline" className="w-full justify-start gap-3 rounded-2xl" onClick={() => setColor('var(--bg-side)')}>
                                    <Eraser size={16} /> Eraser
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-3 rounded-2xl text-red-500 hover:text-red-500 hover:bg-red-500/10" onClick={clearCanvas}>
                                    <Trash2 size={16} /> Clear Canvas
                                </Button>
                                <Button className="w-full justify-start gap-3 rounded-2xl bg-[#facc15] text-black hover:bg-[#facc15]/90 font-bold" onClick={downloadImage}>
                                    <Download size={16} /> Save Art
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 bg-white dark:bg-zinc-950 relative cursor-crosshair h-[60vh] md:h-auto">
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="w-full h-full"
                            />
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default PaintPage;