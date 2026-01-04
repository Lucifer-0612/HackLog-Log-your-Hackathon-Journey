"use client";

import { DataCard } from "@/components/Shared";

interface TechStackProps {
  stack: string[];
}

export function TechStack({ stack }: TechStackProps) {
  if (!stack || stack.length === 0) {
    return (
      <DataCard title="Tech Stack">
        <p className="text-sm text-zinc-500">No tech stack configured</p>
      </DataCard>
    );
  }

  return (
    <DataCard title="Tech Stack">
      <div className="flex flex-wrap gap-2">
        {stack.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-zinc-800/80 border border-zinc-700 rounded-md text-sm font-mono text-zinc-300 hover:bg-zinc-700/80 hover:border-zinc-600 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </DataCard>
  );
}
