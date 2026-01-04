"use client";

import type { HackerProfile } from "@/services/api";
import { DataCard } from "@/components/Shared";

interface ProfileCardProps {
  profile: HackerProfile;
}

const experienceColors = {
  Beginner: "bg-emerald-500/20 text-emerald-400",
  Intermediate: "bg-blue-500/20 text-blue-400",
  Advanced: "bg-purple-500/20 text-purple-400",
  Expert: "bg-amber-500/20 text-amber-400",
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {profile.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">{profile.name}</h2>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-mono ${
              experienceColors[profile.experienceLevel]
            }`}
          >
            {profile.experienceLevel}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DataCard title="Hackathons">
          <p className="text-2xl font-bold text-zinc-100">
            {profile.totalHackathons}
          </p>
          <p className="text-xs text-zinc-500 mt-1">completed</p>
        </DataCard>
        <DataCard title="Avg Completion">
          <p className="text-2xl font-bold text-emerald-400">
            {profile.averageCompletionRate}%
          </p>
          <p className="text-xs text-zinc-500 mt-1">success rate</p>
        </DataCard>
      </div>
    </div>
  );
}
