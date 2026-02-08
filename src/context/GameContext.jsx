import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [score, setScore] = useState(0);
    const [spirituality, setSpirituality] = useState(0); // Maneviyat (0-100)
    const [inventory, setInventory] = useState({
        muska: 0,
        tovbe_kapisi: 0,
        gonul_gozu: 0,
        sadaka_kutusu: 0,
    });
    const [graveyard, setGraveyard] = useState([]);
    const [achievements, setAchievements] = useState([]);

    // Load initial data
    useEffect(() => {
        const saved = localStorage.getItem('nasip_data_v1');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setScore(data.score || 0);
                setInventory(data.inventory || { muska: 0, tovbe_kapisi: 0, gonul_gozu: 0, sadaka_kutusu: 0 });
                setGraveyard(data.graveyard || []);
                setAchievements(data.achievements || []);
            } catch (e) {
                console.error("Save load error", e);
            }
        }
    }, []);

    // Auto-save on change
    useEffect(() => {
        const data = { score, inventory, graveyard, achievements };
        localStorage.setItem('nasip_data_v1', JSON.stringify(data));
    }, [score, inventory, graveyard, achievements]);

    // Passive income (Sadaka Kutusu)
    useEffect(() => {
        if (inventory.sadaka_kutusu > 0) {
            const interval = setInterval(() => {
                setScore(prev => prev + (inventory.sadaka_kutusu * 5));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [inventory.sadaka_kutusu]);

    const addScore = (amount) => setScore(prev => prev + amount);

    const purchaseItem = (itemKey, cost) => {
        if (score >= cost) {
            setScore(prev => prev - cost);
            setInventory(prev => ({ ...prev, [itemKey]: prev[itemKey] + 1 }));
            return true;
        }
        return false;
    };

    const useItem = (itemKey) => {
        if (inventory[itemKey] > 0) {
            setInventory(prev => ({ ...prev, [itemKey]: prev[itemKey] - 1 }));
            return true;
        }
        return false;
    };

    const addToGraveyard = () => {
        const entry = { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), score: score };
        setGraveyard(prev => [entry, ...prev]); // Add to top
        setScore(0); // Reset score on death
    };

    const reviveFromGraveyard = () => {
        if (graveyard.length > 0 && inventory.tovbe_kapisi > 0) {
            const lastEntry = graveyard[0];
            setInventory(prev => ({ ...prev, tovbe_kapisi: prev.tovbe_kapisi - 1 }));
            setGraveyard(prev => prev.slice(1));
            setScore(lastEntry.score); // Restore score
            return true;
        }
        return false;
    };

    return (
        <GameContext.Provider value={{
            score, setScore,
            spirituality, setSpirituality,
            inventory, purchaseItem, useItem,
            graveyard, addToGraveyard, reviveFromGraveyard,
            addScore
        }}>
            {children}
        </GameContext.Provider>
    );
};
