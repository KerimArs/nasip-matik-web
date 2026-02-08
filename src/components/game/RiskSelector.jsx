import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Flame, Skull } from 'lucide-react';

const risks = [
    { id: 'EASY', label: 'GARANTİ', icon: Shield, color: 'text-green-400', border: 'border-green-400/50', multiplier: 'x1' },
    { id: 'NORMAL', label: 'NORMAL', icon: Zap, color: 'text-blue-400', border: 'border-blue-400/50', multiplier: 'x5' },
    { id: 'HARD', label: 'RİSKLİ', icon: Flame, color: 'text-orange-400', border: 'border-orange-400/50', multiplier: 'x15' },
    { id: 'INSANE', label: 'ÇILGIN', icon: Skull, color: 'text-red-500', border: 'border-red-500/50', multiplier: 'x50' },
];

const RiskSelector = ({ selectedRisk, onSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {risks.map((r) => (
                <motion.button
                    key={r.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(r.id)}
                    className={`relative p-4 rounded-xl border ${selectedRisk === r.id ? r.border + ' bg-white/10' : 'border-white/5 bg-white/5'} flex flex-col items-center gap-2 transition-all duration-300`}
                >
                    <r.icon className={`w-8 h-8 ${r.color}`} />
                    <span className={`font-bold ${r.color}`}>{r.label}</span>
                    <span className="text-xs text-gray-400">{r.multiplier} SC</span>

                    {selectedRisk === r.id && (
                        <motion.div
                            layoutId="risk-glow"
                            className={`absolute inset-0 rounded-xl border-2 ${r.border.replace('/50', '')} shadow-[0_0_15px_rgba(var(--color-neon),0.5)]`}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
};

export default RiskSelector;
