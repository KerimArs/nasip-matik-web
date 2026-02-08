import React from 'react';
import { useGame } from '../../context/GameContext';
import GlassCard from '../GlassCard';
import { Star, Award, Briefcase } from 'lucide-react';

const Dashboard = () => {
    const { score, inventory } = useGame();

    const getRank = (sc) => {
        if (sc < 500) return "ÇIRAK";
        if (sc < 2000) return "KALFA";
        if (sc < 10000) return "USTA";
        return "EFSANE";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Star className="w-8 h-8 text-neon-gold animate-spin-slow" />
                <h2 className="text-3xl font-bold font-serif tracking-wider">KADER</h2>
            </div>

            <GlassCard className="border-neon-gold/30">
                <div className="flex flex-col items-center">
                    <span className="text-sm text-neon-gold font-bold tracking-widest">SEVAP PUANI</span>
                    <span className="text-5xl font-bold mt-2 text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                        {score.toLocaleString()}
                    </span>
                </div>
            </GlassCard>

            <GlassCard className="border-neon-cyan/30">
                <div className="flex flex-col items-center">
                    <span className="text-sm text-neon-cyan font-bold tracking-widest">RÜTBE</span>
                    <span className="text-3xl font-bold mt-2 text-white">
                        {getRank(score)}
                    </span>
                </div>
            </GlassCard>

            <div className="pt-8">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-bold text-sm">MANEVİ ÇANTA</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <InventoryItem label="Muska" count={inventory.muska} color="text-green-400" />
                    <InventoryItem label="Tövbe Kapısı" count={inventory.tovbe_kapisi} color="text-purple-400" />
                    <InventoryItem label="Gönül Gözü" count={inventory.gonul_gozu} color="text-blue-400" />
                    <InventoryItem label="Sadaka Kutusu" count={inventory.sadaka_kutusu} color="text-yellow-400" />
                </div>
            </div>
        </div>
    );
};

const InventoryItem = ({ label, count, color }) => (
    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
        <span className="text-sm text-gray-300">{label}</span>
        <span className={`font-mono font-bold ${color}`}>{count}</span>
    </div>
);

export default Dashboard;
