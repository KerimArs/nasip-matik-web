import React from 'react';
import { motion } from 'framer-motion';

const Zikirmatik = ({ count, onClick, max = 100 }) => {
    const progress = Math.min((count / max) * 100, 100);
    const circumference = 2 * Math.PI * 120; // r=120
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Glow Element */}
                <div className="absolute inset-0 rounded-full bg-neon-pink/10 blur-3xl animate-pulse" />

                {/* SVG Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="160" cy="160" r="120" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                    <motion.circle
                        cx="160" cy="160" r="120"
                        stroke="var(--color-neon-pink)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    />
                </svg>

                {/* Middle Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-gray-400 text-sm tracking-widest uppercase">Maneviyat</span>
                    <motion.span
                        key={count}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-bold text-white font-mono"
                    >
                        {count}
                    </motion.span>
                </div>

                {/* Interaction Layer */}
                <button
                    onClick={onClick}
                    className="absolute inset-0 w-full h-full rounded-full cursor-pointer opacity-0"
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClick}
                className="mt-6 px-12 py-4 bg-neon-pink rounded-full font-bold text-white shadow-[0_0_20px_rgba(255,0,127,0.5)] hover:shadow-[0_0_40px_rgba(255,0,127,0.8)] transition-all"
            >
                ZİKİR ÇEK
            </motion.button>
        </div>
    );
};

export default Zikirmatik;
