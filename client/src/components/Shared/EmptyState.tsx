"use client";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-zinc-600">{icon}</div>}
      <h3 className="text-sm font-mono text-zinc-400 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-zinc-600 max-w-xs">{description}</p>
      )}
    </div>
  );
}
