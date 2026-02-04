"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateTeamModal({ isOpen, onClose, hackathonId, onSuccess }) {
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState([{ name: '', role: 'Fullstack' }]);
    const [loading, setLoading] = useState(false);

    const roles = ['Frontend', 'Backend', 'Fullstack', 'Design', 'Mobile', 'Lead'];

    const addMember = () => {
        setMembers([...members, { name: '', role: 'Fullstack' }]);
    };

    const removeMember = (index) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const updateMember = (index, field, value) => {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/gamification/teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: teamName,
                    hackathonId,
                    members: members.filter(m => m.name.trim())
                })
            });

            if (res.ok) {
                const team = await res.json();
                onSuccess(team);
                onClose();
            }
        } catch (error) {
            console.error('Failed to create team', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                ⚔️ Create War Room
                            </h2>
                            <button onClick={onClose} className="text-zinc-500 hover:text-white">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-mono text-zinc-400 mb-2">Team Name</label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="The A-Team"
                                    required
                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-mono text-zinc-400">Squad Members</label>
                                    <button
                                        type="button"
                                        onClick={addMember}
                                        className="text-xs text-emerald-500 hover:text-emerald-400"
                                    >
                                        + Add Member
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {members.map((member, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => updateMember(idx, 'name', e.target.value)}
                                                placeholder="Name"
                                                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:border-emerald-500"
                                            />
                                            <select
                                                value={member.role}
                                                onChange={(e) => updateMember(idx, 'role', e.target.value)}
                                                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:border-emerald-500"
                                            >
                                                {roles.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            {members.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMember(idx)}
                                                    className="px-2 text-red-500 hover:text-red-400"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Deploy War Room'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
