"use client";

import { ReactNode } from "react";

interface DataCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  accent?: "default" | "success" | "warning" | "danger";
}

const accentColors = {
  default: "border-zinc-800",
  success: "border-emerald-500/50",
  warning: "border-amber-500/50",
  danger: "border-red-500/50",
};

export function DataCard({
  title,
  children,
  className = "",
  accent = "default",
}: DataCardProps) {
  return (
    <div
      className={`bg-zinc-900/80 border ${accentColors[accent]} rounded-lg p-5 backdrop-blur-sm ${className}`}
    >
      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
