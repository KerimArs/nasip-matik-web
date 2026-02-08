import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import AuroraBackground from './components/AuroraBackground';
import Dashboard from './components/game/Dashboard';
import Zikirmatik from './components/game/Zikirmatik';
import RiskSelector from './components/game/RiskSelector';
import GlassCard from './components/GlassCard';
import { Toaster, toast } from 'react-hot-toast';
import { ShoppingBag, Skull, Trophy, Shield, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const GameContent = () => {
  const { score, setScore, spirituality, setSpirituality, purchaseItem, reviveFromGraveyard, graveyard, addToGraveyard, useItem, inventory } = useGame();
  const [selectedRisk, setSelectedRisk] = useState('NORMAL');
  const [activeTab, setActiveTab] = useState('GAME');
  const [isGlitching, setIsGlitching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleZikirClick = () => {
    if (spirituality < 100) {
      setSpirituality(prev => Math.min(prev + 5, 100));
    }
  };

  const triggerWinConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff007f', '#00f3ff'],
      disableForReducedMotion: true
    });
  };

  const triggerLossGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 800);
  };

  const activeGame = async () => {
    if (spirituality < 10) {
      toast.error('Maneviyat yetersiz! Biraz zikir çek.');
      return;
    }

    // Gönül Gözü Logic
    if (inventory.gonul_gozu > 0) {
      // Chance to peek
      if (Math.random() < 0.4) {
        useItem('gonul_gozu');
        const activeWinChance = selectedRisk === 'EASY' ? 0.9 : selectedRisk === 'NORMAL' ? 0.5 : selectedRisk === 'HARD' ? 0.3 : 0.1;
        const willWin = Math.random() < activeWinChance;
        toast(willWin ? "İçine bir ferahlık doğuyor..." : "İçinde kötü bir his var...", {
          icon: <Eye className="text-blue-400" />,
          style: { background: '#1a1a2e', color: '#fff' },
          duration: 2000
        });
        // Wait a bit to let user see hint
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    setSpirituality(prev => Math.max(0, prev - 10));
    setIsLoading(true);

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const winChance = selectedRisk === 'EASY' ? 0.9 : selectedRisk === 'NORMAL' ? 0.5 : selectedRisk === 'HARD' ? 0.3 : 0.1;
        const reward = selectedRisk === 'EASY' ? 10 : selectedRisk === 'NORMAL' ? 50 : selectedRisk === 'HARD' ? 150 : 1000;

        if (Math.random() < winChance) {
          resolve(reward);
        } else {
          reject();
        }
      }, 1000);
    });

    toast.promise(promise, {
      loading: 'Kader belirleniyor...',
      success: (reward) => {
        setScore(prev => prev + reward);
        triggerWinConfetti();
        setIsLoading(false);
        return `KAZANDIN! +${reward} SC`;
      },
      error: () => {
        // Muska Logic
        if (inventory.muska > 0) {
          useItem('muska');
          setIsLoading(false);
          return "Muska seni korudu! (Kırıldı)";
        } else {
          addToGraveyard();
          triggerLossGlitch();
          setIsLoading(false);
          return 'DOSYA SİLİNDİ...';
        }
      },
    }, {
      style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' },
      success: { icon: '🎉', duration: 4000 },
      error: { icon: '💀', duration: 4000 }
    });
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-100 ${isGlitching ? 'invert grayscale scale-[1.02] translate-x-1' : ''}`}>
      {/* Glitch Overlay */}
      {isGlitching && (
        <div className="fixed inset-0 z-50 bg-red-500/20 pointer-events-none mix-blend-overlay animate-pulse flex items-center justify-center">
          <h1 className="text-9xl font-black text-red-600 tracking-tighter opacity-50">SİLİNDİ</h1>
        </div>
      )}

      {/* Left Panel */}
      <div className="w-1/4 min-w-[300px] p-6 z-10 glass-panel border-r border-white/10 relative">
        <Dashboard />
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 z-10 overflow-y-auto">
        <div className="flex gap-4 mb-8 justify-center">
          <NavButton active={activeTab === 'GAME'} onClick={() => setActiveTab('GAME')} icon={Trophy} label="OYUN" />
          <NavButton active={activeTab === 'SHOP'} onClick={() => setActiveTab('SHOP')} icon={ShoppingBag} label="ÇARŞI" />
          <NavButton active={activeTab === 'GRAVE'} onClick={() => setActiveTab('GRAVE')} icon={Skull} label="BERZAH" />
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'GAME' && (
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="flex flex-col items-center gap-8">
                  <Zikirmatik count={spirituality} onClick={handleZikirClick} />
                </div>
                <div className="space-y-8">
                  <GlassCard>
                    <h3 className="text-xl font-bold mb-4 text-gray-300">RİSK SEVİYESİ</h3>
                    <RiskSelector selectedRisk={selectedRisk} onSelect={setSelectedRisk} />
                  </GlassCard>

                  <button
                    onClick={activeGame}
                    disabled={isLoading}
                    className={`w-full py-6 rounded-2xl bg-gradient-to-r from-neon-gold to-orange-500 font-black text-2xl text-black shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:scale-105 active:scale-95 transition-transform relative overflow-hidden group ${isLoading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                  >
                    <span className="relative z-10">{isLoading ? 'BELİRLENİYOR...' : 'KADERİ BAŞLAT'}</span>
                    {!isLoading && <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'SHOP' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-2 gap-6"
              >
                <ShopItem name="MUSKA" price={150} desc="Bir kez silinmekten korur." icon={Shield} onBuy={() => purchaseItem('muska', 150)} />
                <ShopItem name="GÖNÜL GÖZÜ" price={75} desc="%40 ihtimalle sonucu gör." icon={Eye} onBuy={() => purchaseItem('gonul_gozu', 75)} />
                <ShopItem name="SADAKA KUTUSU" price={500} desc="Otomatik sevap kazan (5sn)." icon={ShoppingBag} onBuy={() => purchaseItem('sadaka_kutusu', 500)} />
                <ShopItem name="TÖVBE KAPISI" price={1000} desc="Silinen dosyayı geri getir." icon={Skull} onBuy={() => purchaseItem('tovbe_kapisi', 1000)} />
              </motion.div>
            )}

            {activeTab === 'GRAVE' && (
              <motion.div
                key="grave"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {graveyard.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20 font-mono">Mezarlık boş... Şimdilik.</div>
                ) : (
                  graveyard.map((g, i) => (
                    <GlassCard key={i} className="flex justify-between items-center bg-red-900/10 border-red-500/20 group hover:bg-red-900/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <Skull className="w-5 h-5 text-red-500" />
                        <div className="flex flex-col">
                          <span className="text-red-400 font-mono font-bold">Kayıp Dosya #{graveyard.length - i}</span>
                          <span className="text-xs text-red-300/50">Skor: {g.score}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{g.date} {g.time}</span>
                    </GlassCard>
                  ))
                )}
                {graveyard.length > 0 && (
                  <button onClick={() => {
                    if (reviveFromGraveyard()) toast.success("Ruh geri döndü!", { icon: '✨' });
                    else toast.error("Tövbe Kapısı veya ölü yok!", { icon: '❌' });
                  }} className="mt-4 px-6 py-4 bg-purple-600 rounded-xl w-full text-white font-bold opacity-80 hover:opacity-100 shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all">
                    TÖVBE KAPISINI KULLAN (1 Tövbe Gerekir)
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`px-8 py-3 rounded-full flex items-center gap-2 font-bold transition-all ${active ? 'bg-white text-black shadow-lg shadow-white/20 scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10'
      }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const ShopItem = ({ name, price, desc, onBuy, icon: Icon }) => (
  <GlassCard className="flex flex-col gap-3 hover:border-neon-cyan/50 transition-colors group" hoverEffect={true} onClick={onBuy}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-neon-cyan/10 rounded-lg group-hover:bg-neon-cyan/20 transition-colors">
          <Icon className="w-6 h-6 text-neon-cyan" />
        </div>
        <h4 className="font-bold text-lg text-neon-cyan">{name}</h4>
      </div>
      <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono border border-white/10">{price} SC</span>
    </div>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    <button className="mt-2 w-full py-2 rounded bg-neon-cyan/10 text-neon-cyan font-bold hover:bg-neon-cyan hover:text-black transition-all">
      SATIN AL
    </button>
  </GlassCard>
);

function App() {
  return (
    <GameProvider>
      <div className="relative min-h-screen text-white font-sans selection:bg-neon-pink selection:text-white overflow-hidden bg-[#050510]">
        <AuroraBackground />
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>
        <Toaster position="bottom-center" />
        <GameContent />
      </div>
    </GameProvider>
  );
}

export default App;
