// src/pages/User/UserProgress.jsx
import React, { useEffect, useState } from "react";
import { progressService } from "../../services/progressService";
import { Loader2, AlertCircle, BarChart2, Dumbbell } from "lucide-react";

export default function UserProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await progressService.getMyProgress();
        // adjust if backend shape differs
        setProgress(data.progress || data || null);
      } catch (err) {
        console.error(err);
        setApiError("Failed to load your progress.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white">
          <BarChart2 className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Progress overview
          </h1>
          <p className="text-sm text-slate-600">
            See how consistently you are following your plans.
          </p>
        </div>
      </div>

      {apiError && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      ) : !progress ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 text-sm text-slate-600">
          No progress data yet. Start a plan and log your workouts.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <ProgressCard
            label="Completed workouts"
            value={progress.totalWorkouts || 0}
            helper="Total logged sessions"
          />
          <ProgressCard
            label="Active plans"
            value={progress.activePlans || 0}
            helper="Currently running programs"
          />
          <ProgressCard
            label="Consistency"
            value={
              progress.consistencyPercent != null
                ? `${progress.consistencyPercent}%`
                : "—"
            }
            helper="Last 30 days"
          />
        </div>
      )}
    </div>
  );
}

function ProgressCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 flex flex-col gap-1">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900 flex items-center gap-1">
        {typeof value === "number" && value === 0 ? (
          <>
            <Dumbbell className="w-4 h-4 text-orange-400" />
            <span>{value}</span>
          </>
        ) : (
          value
        )}
      </p>
      <p className="text-[11px] text-slate-500">{helper}</p>
    </div>
  );
}
