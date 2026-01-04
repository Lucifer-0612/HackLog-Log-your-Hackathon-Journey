"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { DataCard, EmptyState } from "@/components/Shared";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FailuresByPhaseProps {
  data: { phase: string; count: number }[];
}

const phaseColors: Record<string, string> = {
  Early: "rgba(34, 197, 94, 0.8)",
  Mid: "rgba(245, 158, 11, 0.8)",
  "Final Hours": "rgba(239, 68, 68, 0.8)",
};

export function FailuresByPhase({ data }: FailuresByPhaseProps) {
  const chartRef = useRef<ChartJS<"doughnut"> | null>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!data || data.length === 0) {
    return (
      <DataCard title="Failures by Phase">
        <EmptyState
          title="No phase data"
          description="Track failures across hackathon phases"
        />
      </DataCard>
    );
  }

  const chartData = {
    labels: data.map((d) => d.phase),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map(
          (d) => phaseColors[d.phase] || "rgba(113, 113, 122, 0.8)"
        ),
        borderColor: "rgba(24, 24, 27, 1)",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#a1a1aa",
          padding: 16,
          font: {
            family: "monospace",
            size: 11,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(24, 24, 27, 0.95)",
        titleColor: "#fafafa",
        bodyColor: "#a1a1aa",
        borderColor: "rgba(63, 63, 70, 0.5)",
        borderWidth: 1,
        padding: 12,
        titleFont: {
          family: "monospace",
          size: 12,
        },
        bodyFont: {
          family: "monospace",
          size: 11,
        },
      },
    },
  };

  const totalFailures = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <DataCard title="Failures by Phase">
      <div className="relative h-64">
        <Doughnut ref={chartRef} data={chartData} options={options} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center -mt-8">
            <p className="text-2xl font-bold text-zinc-100">{totalFailures}</p>
            <p className="text-xs text-zinc-500">total</p>
          </div>
        </div>
      </div>
    </DataCard>
  );
}
