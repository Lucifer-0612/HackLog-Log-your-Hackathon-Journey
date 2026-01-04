"use client";

import type { Insight } from "@/services/api";
import { DataCard, EmptyState } from "@/components/Shared";

interface NextHackRulesProps {
  insights: Insight[];
}

const priorityConfig = {
  high: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: "!!",
  },
  medium: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    icon: "!",
  },
  low: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    icon: "·",
  },
};

export function NextHackRules({ insights }: NextHackRulesProps) {
  if (!insights || insights.length === 0) {
    return (
      <DataCard title="Next Hack Rules">
        <EmptyState
          title="No insights yet"
          description="Complete hackathons to generate actionable rules"
        />
      </DataCard>
    );
  }

  const sortedInsights = [...insights].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <DataCard title="Next Hack Rules">
      <p className="text-xs text-zinc-500 mb-4 font-mono">
        What HackLog learned from your failures
      </p>
      <div className="space-y-3">
        {sortedInsights.map((insight, index) => {
          const config = priorityConfig[insight.priority];
          return (
            <div
              key={insight._id || index}
              className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg} ${config.border}`}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${config.text} bg-zinc-900`}
              >
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 leading-relaxed">
                  {insight.rule}
                </p>
                {insight.category && (
                  <span className="inline-block mt-2 text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">
                    {insight.category}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DataCard>
  );
}
