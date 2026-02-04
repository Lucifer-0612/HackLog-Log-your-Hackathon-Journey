"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CreateTeamModal from './CreateTeamModal';

export default function TeamDashboard({ hackathonId }) {
    const router = useRouter();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [showTaskInput, setShowTaskInput] = useState(false);

    const fetchTeam = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/gamification/teams/${hackathonId}`);
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

    useEffect(() => {
        if (hackathonId) fetchTeam();
        const interval = setInterval(fetchTeam, 5000);
        return () => clearInterval(interval);
    }, [hackathonId]);

    const cycleStatus = async (memberId, currentStatus) => {
        const statuses = ['Coding', 'Debugging', 'Designing', 'Resting', 'Panic'];
        const currentIndex = statuses.indexOf(currentStatus);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/gamification/teams/${team._id}/members/${memberId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            if (res.ok) {
                const updated = await res.json();
                setTeam(updated);
            }
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const addTask = async () => {
        if (!newTask.trim()) return;

        const updatedTasks = [...(team.tasks || []), { title: newTask, status: 'todo' }];
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/gamification/teams/${team._id}/tasks`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: updatedTasks })
            });
            if (res.ok) {
                const updated = await res.json();
                setTeam(updated);
                setNewTask('');
                setShowTaskInput(false);
            }
        } catch (error) {
            console.error('Failed to add task', error);
        }
    };

    const panicMode = async () => {
        const updatedMembers = team.members.map(m => ({ ...m, status: 'Panic' }));
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/gamification/teams/${team._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ members: updatedMembers })
            });
            if (res.ok) fetchTeam();
        } catch (error) {
            console.error('Panic mode failed', error);
        }
    };

    if (loading) return <div className="text-center p-10 text-white">Loading War Room...</div>;

    if (!team) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        No War Room Found
                    </h1>
                    <p className="text-zinc-400 mb-6">Create a team to activate the War Room for this hackathon.</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-lg transition-all"
                    >
                        ⚔️ Create War Room
                    </button>
                </div>
                <CreateTeamModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    hackathonId={hackathonId}
                    onSuccess={(newTeam) => {
                        setTeam(newTeam);
                        router.refresh();
                    }}
                />
            </div>
        );
    }

    const panicCount = team.members.filter(m => m.status === 'Panic').length;

    return (
        <div className="p-6 space-y-8 bg-black min-h-screen text-white">
            <header className="flex justify-between items-center border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    WAR ROOM: {team.name}
                </h1>
                <div className="flex items-center gap-4">
                    <div className={`text-xl font-mono ${panicCount > 0 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                        🚨 PANIC: {panicCount}/{team.members.length}
                    </div>
                    <button
                        onClick={panicMode}
                        className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 font-bold rounded-lg transition-all animate-pulse"
                    >
                        🚨 PANIC MODE
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Members Section */}
                <section className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Squad Status</h2>
                    <div className="space-y-4">
                        {team.members.map(member => (
                            <motion.div
                                key={member._id}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center justify-between bg-black p-4 rounded-lg cursor-pointer"
                                onClick={() => cycleStatus(member._id, member.status)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold">{member.name}</p>
                                        <p className="text-xs text-gray-400">{member.role}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${member.status === 'Panic' ? 'bg-red-900 text-red-200 animate-bounce' :
                                    member.status === 'Coding' ? 'bg-green-900 text-green-200' :
                                        member.status === 'Debugging' ? 'bg-yellow-900 text-yellow-200' :
                                            member.status === 'Designing' ? 'bg-blue-900 text-blue-200' :
                                                'bg-gray-800 text-gray-400'
                                    }`}>
                                    {member.status}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">Click member to cycle status</p>
                </section>

                {/* Tasks Section */}
                <section className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Mission Board</h2>
                        <button
                            onClick={() => setShowTaskInput(!showTaskInput)}
                            className="text-sm text-emerald-500 hover:text-emerald-400"
                        >
                            + Add Task
                        </button>
                    </div>

                    {showTaskInput && (
                        <div className="mb-4 flex gap-2">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                placeholder="Build authentication..."
                                className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded text-sm focus:outline-none focus:border-emerald-500"
                            />
                            <button
                                onClick={addTask}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-bold"
                            >
                                Add
                            </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {(!team.tasks || team.tasks.length === 0) && <p className="text-gray-500 text-center py-8">No active missions.</p>}
                        {team.tasks?.map((task, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex justify-between p-3 bg-black rounded border-l-4 border-blue-500"
                            >
                                <span>{task.title}</span>
                                <span className="text-xs uppercase bg-blue-900 px-2 py-1 rounded">{task.status}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
