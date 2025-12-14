// src/pages/Dashboard/ProgressOverview.jsx
import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import { progressService } from "../../services/progressService";
import { Loader2, AlertCircle, BarChart2, Dumbbell, Users } from "lucide-react";

export default function ProgressOverview() {
  const user = authService.getCurrentUser();
  const role = user?.role === "trainer" ? "trainer" : "user";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");

        // assuming backend returns different shape per role if you want;
        // for now, just call one endpoint
        const res = await progressService.getMyProgress();
        setData(res.progress || res || null);
      } catch (err) {
        console.error(err);
        setApiError("Failed to load progress.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white">
          <BarChart2 className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {role === "trainer" ? "Plan performance" : "Progress overview"}
          </h1>
          <p className="text-sm text-slate-600">
            {role === "trainer"
              ? "See how your plans and clients are performing."
              : "See how consistently you are following your plans."}
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
      ) : !data ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 text-sm text-slate-600">
          No progress data yet.
        </div>
      ) : role === "trainer" ? (
        <TrainerProgress data={data} />
      ) : (
        <UserProgress data={data} />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-500">{helper}</p>
    </div>
  );
}

function UserProgress({ data }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        icon={Dumbbell}
        label="Completed workouts"
        value={data.totalWorkouts || 0}
        helper="Total logged sessions"
      />
      <StatCard
        icon={Dumbbell}
        label="Active plans"
        value={data.activePlans || 0}
        helper="Currently running programs"
      />
      <StatCard
        icon={BarChart2}
        label="Consistency"
        value={
          data.consistencyPercent != null ? `${data.consistencyPercent}%` : "—"
        }
        helper="Last 30 days"
      />
    </div>
  );
}

function TrainerProgress({ data }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        icon={Dumbbell}
        label="Published plans"
        value={data.myPlans || data.publishedPlans || 0}
        helper="Total active programs"
      />
      <StatCard
        icon={Users}
        label="Active clients"
        value={data.activeClients || 0}
        helper="Unique clients with active plans"
      />
      <StatCard
        icon={BarChart2}
        label="Avg. plan rating"
        value={
          data.averageRating != null ? data.averageRating.toFixed(1) : "New"
        }
        helper="Across all rated plans"
      />
    </div>
  );
}
