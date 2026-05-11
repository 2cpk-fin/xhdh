// ColorPicker.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
    currentColor: string;
    onChange: (color: string) => void;
}

const COLORS = [
    '#facc15', // Neon Yellow
    '#22c55e', // Neon Green
    '#06b6d4', // Neon Cyan
    '#c026d3', // Neon Purple
    '#ef4444', // Red
    '#ffffff', // White
    '#000000', // Black
];

const ColorPicker = ({ currentColor, onChange }: ColorPickerProps) => {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {COLORS.map((color) => (
                <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onChange(color)}
                    className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        currentColor === color ? "border-white scale-110 shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    );
};

export default ColorPicker;