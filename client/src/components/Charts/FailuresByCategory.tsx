"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { DataCard } from "@/components/Shared";
import { EmptyState } from "@/components/Shared";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FailuresByCategoryProps {
  data: { category: string; count: number }[];
}

const categoryColors: Record<string, string> = {
  Scope: "rgba(239, 68, 68, 0.8)",
  Time: "rgba(245, 158, 11, 0.8)",
  Tech: "rgba(59, 130, 246, 0.8)",
  Focus: "rgba(168, 85, 247, 0.8)",
  Team: "rgba(20, 184, 166, 0.8)",
};

export function FailuresByCategory({ data }: FailuresByCategoryProps) {
  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!data || data.length === 0) {
    return (
      <DataCard title="Failures by Category">
        <EmptyState
          title="No failure data"
          description="Complete a hackathon to see failure patterns"
        />
      </DataCard>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        label: "Failures",
        data: data.map((d) => d.count),
        backgroundColor: data.map(
          (d) => categoryColors[d.category] || "rgba(113, 113, 122, 0.8)"
        ),
        borderColor: data.map(
          (d) =>
            categoryColors[d.category]?.replace("0.8", "1") ||
            "rgba(113, 113, 122, 1)"
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#71717a",
          font: {
            family: "monospace",
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(63, 63, 70, 0.3)",
        },
        ticks: {
          color: "#71717a",
          font: {
            family: "monospace",
            size: 11,
          },
          stepSize: 1,
        },
      },
    },
  };

  return (
    <DataCard title="Failures by Category">
      <div className="h-64">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </DataCard>
  );
}
