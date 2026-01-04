"use client";

import { useState, useEffect } from "react";
import type { CreateHackathonInput, Hackathon } from "@/services/api";

interface HackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHackathonInput) => Promise<void>;
  editData?: Hackathon | null;
  mode: "create" | "edit";
}

interface FailureEntry {
  category: "Scope" | "Time" | "Tech" | "Focus" | "Team";
  phase: "Early" | "Mid" | "Final Hours";
  description: string;
}

const categories = ["Scope", "Time", "Tech", "Focus", "Team"] as const;
const phases = ["Early", "Mid", "Final Hours"] as const;

const formatDateTimeLocal = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 16);
};

export function HackathonModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
  mode,
}: HackathonModalProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    teamSize: 1,
    plannedFeatures: 1,
    completedFeatures: 0,
  });
  const [failures, setFailures] = useState<FailureEntry[]>([]);
  const [newFailure, setNewFailure] = useState<FailureEntry>({
    category: "Scope",
    phase: "Early",
    description: "",
  });

  useEffect(() => {
    if (isOpen && mode === "edit" && editData) {
      setFormData({
        name: editData.name,
        startDate: formatDateTimeLocal(editData.startDate),
        endDate: formatDateTimeLocal(editData.endDate),
        teamSize: editData.teamSize,
        plannedFeatures: editData.plannedFeatures,
        completedFeatures: editData.completedFeatures,
      });
      setFailures([]);
    } else if (isOpen && mode === "create") {
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        teamSize: 1,
        plannedFeatures: 1,
        completedFeatures: 0,
      });
      setFailures([]);
    }
    setStep(1);
  }, [isOpen, mode, editData]);

  if (!isOpen) return null;

  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const addFailure = () => {
    if (newFailure.description.trim()) {
      setFailures((prev) => [...prev, { ...newFailure }]);
      setNewFailure({ category: "Scope", phase: "Early", description: "" });
    }
  };

  const removeFailure = (index: number) => {
    setFailures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({ ...formData, failures });
      setStep(1);
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        teamSize: 1,
        plannedFeatures: 1,
        completedFeatures: 0,
      });
      setFailures([]);
      onClose();
    } catch {
      // Error handling done in parent
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid =
    formData.name && formData.startDate && formData.endDate && formData.teamSize > 0;

  const title = mode === "edit" ? "Edit Hackathon" : "Log Hackathon Experience";
  const submitLabel = mode === "edit" ? "Update Hackathon" : "Save Hackathon";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl mx-4">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Step {step} of 3 —{" "}
              {step === 1
                ? "Basic Info"
                : step === 2
                ? "Execution Results"
                : "Failures & Learnings"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-2">
                  Hackathon Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleBasicChange}
                  placeholder="e.g., ETHGlobal NYC 2024"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-2">
                  Team Size
                </label>
                <input
                  type="number"
                  name="teamSize"
                  min={1}
                  max={10}
                  value={formData.teamSize}
                  onChange={handleBasicChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-2">
                  Planned Features
                </label>
                <input
                  type="number"
                  name="plannedFeatures"
                  min={1}
                  value={formData.plannedFeatures}
                  onChange={handleBasicChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
                <p className="text-xs text-zinc-600 mt-1">
                  How many features did you plan to build?
                </p>
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-2">
                  Completed Features
                </label>
                <input
                  type="number"
                  name="completedFeatures"
                  min={0}
                  max={formData.plannedFeatures}
                  value={formData.completedFeatures}
                  onChange={handleBasicChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
                <p className="text-xs text-zinc-600 mt-1">
                  How many did you actually finish?
                </p>
              </div>
              <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg">
                <p className="text-xs font-mono text-zinc-500 mb-2">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formData.plannedFeatures > 0
                    ? Math.round(
                        (formData.completedFeatures / formData.plannedFeatures) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 mb-4">
                Document what went wrong to generate actionable insights for your
                next hackathon.
              </p>
              <div className="p-4 bg-zinc-800/50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Category
                    </label>
                    <select
                      value={newFailure.category}
                      onChange={(e) =>
                        setNewFailure((prev) => ({
                          ...prev,
                          category: e.target.value as FailureEntry["category"],
                        }))
                      }
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Phase
                    </label>
                    <select
                      value={newFailure.phase}
                      onChange={(e) =>
                        setNewFailure((prev) => ({
                          ...prev,
                          phase: e.target.value as FailureEntry["phase"],
                        }))
                      }
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                    >
                      {phases.map((phase) => (
                        <option key={phase} value={phase}>
                          {phase}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-2">
                    What went wrong?
                  </label>
                  <input
                    type="text"
                    value={newFailure.description}
                    onChange={(e) =>
                      setNewFailure((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="e.g., Underestimated API integration complexity"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                    onKeyDown={(e) => e.key === "Enter" && addFailure()}
                  />
                </div>
                <button
                  type="button"
                  onClick={addFailure}
                  disabled={!newFailure.description.trim()}
                  className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-zinc-200 rounded-lg transition-colors"
                >
                  + Add Failure
                </button>
              </div>

              {failures.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-mono text-zinc-400">
                    Logged Failures ({failures.length})
                  </p>
                  {failures.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-zinc-800/30 border border-zinc-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                            {f.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded">
                            {f.phase}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300">{f.description}</p>
                      </div>
                      <button
                        onClick={() => removeFailure(i)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-5 border-t border-zinc-800 bg-zinc-900/50">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full ${
                  s === step
                    ? "bg-emerald-500"
                    : s < step
                    ? "bg-emerald-500/50"
                    : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !isStep1Valid}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white rounded-lg transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
