"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HackathonOverview,
  ExecutionMetrics,
  RiskIndicators,
  HackathonModal,
  DeleteConfirmModal,
} from "@/components/Dashboard";
import { FailuresByCategory, FailuresByPhase } from "@/components/Charts";
import { NextHackRules } from "@/components/Insights";
import { LoadingSpinner, EmptyState } from "@/components/Shared";
import {
  hackathonApi,
  type Hackathon,
  type Insight,
  type FailureAnalytics,
  type CreateHackathonInput,
} from "@/services/api";

const mockHackathon: Hackathon = {
  _id: "1",
  name: "AI Innovation Hackathon 2024",
  startDate: "2024-03-15T09:00:00Z",
  endDate: "2024-03-17T18:00:00Z",
  duration: 48,
  teamSize: 4,
  plannedFeatures: 8,
  completedFeatures: 5,
  riskScore: 65,
  riskiestPhase: "Final Hours",
};

const mockAnalytics: FailureAnalytics = {
  byCategory: [
    { category: "Scope", count: 4 },
    { category: "Time", count: 6 },
    { category: "Tech", count: 2 },
    { category: "Focus", count: 3 },
    { category: "Team", count: 1 },
  ],
  byPhase: [
    { phase: "Early", count: 3 },
    { phase: "Mid", count: 5 },
    { phase: "Final Hours", count: 8 },
  ],
};

const mockInsights: Insight[] = [
  {
    _id: "1",
    hackathonId: "1",
    rule: "Reduce initial scope by 30% - you consistently overestimate capacity",
    priority: "high",
    category: "Scope Management",
  },
  {
    _id: "2",
    hackathonId: "1",
    rule: "Freeze features by mid-hackathon to avoid last-minute chaos",
    priority: "high",
    category: "Time Management",
  },
  {
    _id: "3",
    hackathonId: "1",
    rule: "Prepare demo 12 hours earlier than you think you need",
    priority: "medium",
    category: "Presentation",
  },
  {
    _id: "4",
    hackathonId: "1",
    rule: "Test integrations early - tech debt compounds exponentially",
    priority: "medium",
    category: "Technical",
  },
  {
    _id: "5",
    hackathonId: "1",
    rule: "Schedule mandatory breaks to maintain focus quality",
    priority: "low",
    category: "Team Health",
  },
];

export default function DashboardPage() {
  const [allHackathons, setAllHackathons] = useState<Hackathon[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [analytics, setAnalytics] = useState<FailureAnalytics | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const hackathonsResponse = await hackathonApi.getAll();
      if (hackathonsResponse.data.length > 0) {
        setAllHackathons(hackathonsResponse.data);
        const latestHackathon = hackathonsResponse.data[selectedIndex] || hackathonsResponse.data[0];
        setHackathon(latestHackathon);

        const [analyticsRes, insightsRes] = await Promise.all([
          hackathonApi.getAnalytics(latestHackathon._id),
          hackathonApi.getInsights(latestHackathon._id),
        ]);

        setAnalytics(analyticsRes.data);
        setInsights(insightsRes.data);
        setUseMock(false);
        setError(null);
      } else {
        setAllHackathons([]);
        setHackathon(null);
      }
    } catch {
      setUseMock(true);
      setAllHackathons([mockHackathon]);
      setHackathon(mockHackathon);
      setAnalytics(mockAnalytics);
      setInsights(mockInsights);
      setError("Using demo data - backend not connected");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedIndex]);

  const handleSelectHackathon = async (index: number) => {
    setSelectedIndex(index);
    if (allHackathons[index]) {
      const selected = allHackathons[index];
      setHackathon(selected);

      try {
        const [analyticsRes, insightsRes] = await Promise.all([
          hackathonApi.getAnalytics(selected._id),
          hackathonApi.getInsights(selected._id),
        ]);
        setAnalytics(analyticsRes.data);
        setInsights(insightsRes.data);
      } catch {
        // Keep current data if fetch fails
      }
    }
  };

  const handleCreateHackathon = async (data: CreateHackathonInput) => {
    try {
      await hackathonApi.create(data);
      await fetchData();
    } catch {
      setUseMock(true);
      const newHackathon: Hackathon = {
        _id: Date.now().toString(),
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        duration: Math.round(
          (new Date(data.endDate).getTime() -
            new Date(data.startDate).getTime()) /
          (1000 * 60 * 60)
        ),
        teamSize: data.teamSize,
        plannedFeatures: data.plannedFeatures,
        completedFeatures: data.completedFeatures,
        riskScore: Math.round(
          100 - (data.completedFeatures / data.plannedFeatures) * 100
        ),
        riskiestPhase:
          data.failures.length > 0
            ? data.failures.reduce(
              (acc, f) => {
                acc[f.phase] = (acc[f.phase] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>
            )["Final Hours"]
              ? "Final Hours"
              : "Mid"
            : "Final Hours",
      };
      setHackathon(newHackathon);

      const categoryCount: Record<string, number> = {};
      const phaseCount: Record<string, number> = {};
      data.failures.forEach((f) => {
        categoryCount[f.category] = (categoryCount[f.category] || 0) + 1;
        phaseCount[f.phase] = (phaseCount[f.phase] || 0) + 1;
      });

      setAnalytics({
        byCategory: Object.entries(categoryCount).map(([category, count]) => ({
          category,
          count,
        })),
        byPhase: Object.entries(phaseCount).map(([phase, count]) => ({
          phase,
          count,
        })),
      });
    }
  };

  const handleUpdateHackathon = async (data: CreateHackathonInput) => {
    if (!hackathon) return;

    try {
      await hackathonApi.update(hackathon._id, data);
      await fetchData();
    } catch {
      const updatedHackathon: Hackathon = {
        ...hackathon,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        duration: Math.round(
          (new Date(data.endDate).getTime() -
            new Date(data.startDate).getTime()) /
          (1000 * 60 * 60)
        ),
        teamSize: data.teamSize,
        plannedFeatures: data.plannedFeatures,
        completedFeatures: data.completedFeatures,
        riskScore: Math.round(
          100 - (data.completedFeatures / data.plannedFeatures) * 100
        ),
      };
      setHackathon(updatedHackathon);
    }
  };

  const handleDeleteHackathon = async () => {
    if (!hackathon) return;

    setIsDeleting(true);
    try {
      await hackathonApi.delete(hackathon._id);
      setSelectedIndex(0); // Reset to first hackathon
      await fetchData(); // Refetch all hackathons
      setDeleteModalOpen(false);
    } catch {
      setHackathon(null);
      setAnalytics(null);
      setInsights([]);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = () => {
    setModalMode("edit");
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner message="Loading hackathon data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 bg-grid-pattern text-zinc-100">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center glow-emerald">
              <span className="text-sm font-bold">H</span>
            </div>
            <span className="font-mono text-sm text-zinc-400">HackLog</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-mono text-emerald-400">
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
              Execution Dashboard
            </h1>
            <p className="text-sm text-zinc-500">
              Analyze your hackathon performance and identify execution failures
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium text-white rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Hackathon
          </button>
        </div>

        {allHackathons.length > 1 && (
          <div className="mb-6 flex items-center gap-3">
            <label className="text-xs font-mono text-zinc-400">
              Select Hackathon:
            </label>
            <select
              value={selectedIndex}
              onChange={(e) => handleSelectHackathon(Number(e.target.value))}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
            >
              {allHackathons.map((h, index) => (
                <option key={h._id} value={index}>
                  {h.name} ({new Date(h.startDate).toLocaleDateString()})
                </option>
              ))}
            </select>
            <span className="text-xs text-zinc-600">
              {selectedIndex + 1} of {allHackathons.length}
            </span>
          </div>
        )}

        {error && useMock && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs font-mono text-amber-400">{error}</p>
          </div>
        )}

        {!hackathon ? (
          <EmptyState
            title="No hackathon data"
            description="Start logging your hackathon to see analytics"
          />
        ) : (
          <div className="space-y-6">
            <HackathonOverview
              hackathon={hackathon}
              onEdit={openEditModal}
              onDelete={() => setDeleteModalOpen(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExecutionMetrics
                plannedFeatures={hackathon.plannedFeatures}
                completedFeatures={hackathon.completedFeatures}
              />
              <RiskIndicators
                riskScore={hackathon.riskScore}
                riskiestPhase={hackathon.riskiestPhase}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FailuresByCategory data={analytics?.byCategory || []} />
              <FailuresByPhase data={analytics?.byPhase || []} />
            </div>

            <NextHackRules insights={insights} />
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-xs font-mono text-zinc-600 text-center">
            HackLog — Learn from every failure
          </p>
        </div>
      </footer>

      <HackathonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreateHackathon : handleUpdateHackathon}
        editData={modalMode === "edit" ? hackathon : null}
        mode={modalMode}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteHackathon}
        hackathonName={hackathon?.name || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
