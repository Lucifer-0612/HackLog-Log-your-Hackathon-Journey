"use client";

import { DataCard } from "@/components/Shared";

interface RiskIndicatorsProps {
  riskScore: number;
  riskiestPhase: "Early" | "Mid" | "Final Hours";
}

export function RiskIndicators({
  riskScore,
  riskiestPhase,
}: RiskIndicatorsProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: "HIGH", color: "text-red-400", bg: "bg-red-500/20" };
    if (score >= 40) return { label: "MEDIUM", color: "text-amber-400", bg: "bg-amber-500/20" };
    return { label: "LOW", color: "text-emerald-400", bg: "bg-emerald-500/20" };
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "Early":
        return "🌅";
      case "Mid":
        return "☀️";
      case "Final Hours":
        return "🌙";
      default:
        return "⏱";
    }
  };

  const risk = getRiskLevel(riskScore);

  return (
    <DataCard
      title="Risk Analysis"
      accent={riskScore >= 70 ? "danger" : riskScore >= 40 ? "warning" : "success"}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${risk.color}`}>
              {riskScore}
            </span>
            <span className="text-xs text-zinc-500">/100</span>
          </div>
          <div
            className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-mono ${risk.bg} ${risk.color}`}
          >
            {risk.label} RISK
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 mb-1">Riskiest Phase</p>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-lg">{getPhaseIcon(riskiestPhase)}</span>
            <span className="text-sm font-mono text-zinc-300">
              {riskiestPhase}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              riskScore >= 70
                ? "bg-red-500"
                : riskScore >= 40
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>
    </DataCard>
  );
}
