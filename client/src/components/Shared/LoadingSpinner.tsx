"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeClasses[size]} border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin`}
      />
      {message && (
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          {message}
        </p>
      )}
    </div>
  );
}
