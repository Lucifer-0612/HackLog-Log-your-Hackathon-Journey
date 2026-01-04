"use client";

import { ProfileCard, TechStack } from "@/components/Profile";
import { LoadingSpinner } from "@/components/Shared";
import type { HackerProfile } from "@/services/api";
import { useState, useEffect } from "react";
import { profileApi } from "@/services/api";
import Link from "next/link";

const mockProfile: HackerProfile = {
  _id: "1",
  name: "Anonymous Hacker",
  experienceLevel: "Intermediate",
  techStack: ["React", "Node.js", "TypeScript", "MongoDB", "Python", "Docker"],
  totalHackathons: 12,
  averageCompletionRate: 68,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<HackerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await profileApi.get();
        setProfile(response.data);
      } catch {
        setUseMock(true);
        setProfile(mockProfile);
        setError("Using demo data - backend not connected");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">H</span>
            </div>
            <span className="font-mono text-sm text-zinc-400">HackLog</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-xs font-mono text-emerald-400"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
            Hacker Profile
          </h1>
          <p className="text-sm text-zinc-500">
            Your execution history and preferences
          </p>
        </div>

        {error && useMock && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs font-mono text-amber-400">{error}</p>
          </div>
        )}

        {profile && (
          <div className="space-y-6">
            <ProfileCard profile={profile} />
            <TechStack stack={profile.techStack} />
          </div>
        )}
      </main>
    </div>
  );
}
