"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BadgeGrid() {
    const [badges, setBadges] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchBadges = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/gamification/badges`);
            const data = await res.json();
            setBadges(data);
        };
        fetchBadges();
    }, []);

    const categories = ['All', 'Milestone', 'Skill', 'Endurance', 'Social'];
    const filtered = filter === 'All' ? badges : badges.filter(b => b.category === filter);
    const unlockedCount = badges.filter(b => b.isUnlocked).length;

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                    <span className="text-yellow-500 font-bold text-2xl">{unlockedCount}</span>
                    <span className="text-gray-500"> / {badges.length} Unlocked</span>
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${filter === cat
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filtered.map((badge, idx) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: badge.isUnlocked ? 1.05 : 1 }}
                        className={`group relative p-6 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${badge.isUnlocked
                            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-yellow-500/50 shadow-lg shadow-yellow-900/20'
                            : 'bg-gray-950 border-gray-900 opacity-60'
                            }`}
                    >
                        {/* Badge Icon */}
                        <div className={`text-5xl mb-3 transition-all ${!badge.isUnlocked && 'grayscale'}`}>
                            {badge.icon}
                        </div>

                        {/* Badge Name */}
                        <h3 className="font-bold text-white mb-1">{badge.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">{badge.description}</p>

                        {/* Category Tag */}
                        <div className={`text-xs px-2 py-1 rounded-full ${badge.category === 'Milestone' ? 'bg-blue-900/50 text-blue-300' :
                            badge.category === 'Skill' ? 'bg-green-900/50 text-green-300' :
                                badge.category === 'Endurance' ? 'bg-red-900/50 text-red-300' :
                                    'bg-orange-900/50 text-orange-300'
                            }`}>
                            {badge.category}
                        </div>

                        {/* Unlocked Date */}
                        {badge.isUnlocked && (
                            <div className="mt-3 text-xs text-yellow-500 font-mono">
                                ✓ {new Date(badge.unlockedAt).toLocaleDateString()}
                            </div>
                        )}

                        {/* Tooltip on Hover */}
                        {!badge.isUnlocked && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-gray-700 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 z-10">
                                <p className="text-xs text-gray-300">
                                    <span className="text-yellow-500 font-bold">How to unlock:</span><br />
                                    {badge.criteria || badge.description}
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No badges in this category yet.
                </div>
            )}
        </div>
    );
}
