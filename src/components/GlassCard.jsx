import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hoverEffect = false, onClick }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.3)" } : {}}
            whileTap={hoverEffect ? { scale: 0.98 } : {}}
            className={`relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`}
            onClick={onClick}
        >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-5">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
