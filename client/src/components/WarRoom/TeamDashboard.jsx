"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TeamDashboard({ hackathonId }) {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch for now or actual fetch
        const fetchTeam = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gamification/teams/${hackathonId}`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setTeam(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch team", error);
            } finally {
                setLoading(false);
            }
        };
        if (hackathonId) fetchTeam();

        // Polling for "Real-time" effect (simple solution vs websockets)
        const interval = setInterval(fetchTeam, 5000);
        return () => clearInterval(interval);
    }, [hackathonId]);

    if (loading) return <div className="text-center p-10">Loading War Room...</div>;
    if (!team) return <div className="text-center p-10">No Team Found. Create one!</div>;

    return (
        <div className="p-6 space-y-8 bg-black min-h-screen text-white">
            <header className="flex justify-between items-center border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    WAR ROOM: {team.name}
                </h1>
                <div className="text-xl font-mono text-red-500 animate-pulse">
                    🚨 PANIC LEVEL: LOW
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Members Section */}
                <section className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Squad Status</h2>
                    <div className="space-y-4">
                        {team.members.map(member => (
                            <div key={member._id} className="flex items-center justify-between bg-black p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold">{member.name}</p>
                                        <p className="text-xs text-gray-400">{member.role}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${member.status === 'Panic' ? 'bg-red-900 text-red-200 animate-bounce' :
                                        member.status === 'Coding' ? 'bg-green-900 text-green-200' :
                                            'bg-gray-800 text-gray-400'
                                    }`}>
                                    {member.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tasks Section */}
                <section className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Mission Board</h2>
                    <div className="space-y-2">
                        {team.tasks?.length === 0 && <p className="text-gray-500">No active missions.</p>}
                        {team.tasks?.map(task => (
                            <div key={task._id} className="flex justify-between p-3 bg-black rounded border-l-4 border-blue-500">
                                <span>{task.title}</span>
                                <span className="text-xs uppercase bg-blue-900 px-2 py-1 rounded">{task.status}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
