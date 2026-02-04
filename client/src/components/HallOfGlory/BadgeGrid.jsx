"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BadgeGrid() {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const fetchBadges = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gamification/badges`);
            const data = await res.json();
            setBadges(data);
        };
        fetchBadges();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
            {badges.map((badge, idx) => (
                <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative p-6 rounded-xl border flex flex-col items-center text-center transition-all ${badge.isUnlocked
                            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-yellow-500/50 shadow-lg shadow-yellow-900/20'
                            : 'bg-gray-950 border-gray-900 opacity-50 grayscale'
                        }`}
                >
                    <div className="text-4xl mb-3">{badge.icon}</div>
                    <h3 className="font-bold text-white mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-400">{badge.description}</p>

                    {badge.isUnlocked && (
                        <div className="mt-3 text-xs text-yellow-500 font-mono">
                            UNLOCKED {new Date(badge.unlockedAt).toLocaleDateString()}
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
