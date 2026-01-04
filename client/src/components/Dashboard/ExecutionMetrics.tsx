"use client";

import { DataCard } from "@/components/Shared";

interface ExecutionMetricsProps {
  plannedFeatures: number;
  completedFeatures: number;
}

export function ExecutionMetrics({
  plannedFeatures,
  completedFeatures,
}: ExecutionMetricsProps) {
  const completionRate =
    plannedFeatures > 0
      ? Math.round((completedFeatures / plannedFeatures) * 100)
      : 0;

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-400";
    if (rate >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getAccent = (rate: number): "success" | "warning" | "danger" => {
    if (rate >= 80) return "success";
    if (rate >= 50) return "warning";
    return "danger";
  };

  return (
    <DataCard title="Execution Metrics" accent={getAccent(completionRate)}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-bold text-zinc-100">{plannedFeatures}</p>
          <p className="text-xs text-zinc-500 mt-1">Planned</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-100">
            {completedFeatures}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Completed</p>
        </div>
        <div>
          <p className={`text-2xl font-bold ${getCompletionColor(completionRate)}`}>
            {completionRate}%
          </p>
          <p className="text-xs text-zinc-500 mt-1">Rate</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              completionRate >= 80
                ? "bg-emerald-500"
                : completionRate >= 50
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </DataCard>
  );
}
