// src/pages/Trainer/TrainerOverview.jsx
import React, { useEffect, useState } from "react";
import { planService } from "../../services/planService";
import { subscriptionService } from "../../services/subscriptionService";
import { Dumbbell, Users, BarChart2, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function TrainerOverview() {
  const [stats, setStats] = useState({
    myPlans: 0,
    activeSubs: 0,
    totalClients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");

        const [plansRes, subsRes] = await Promise.all([
          planService.getMyPlans(),
          subscriptionService.getTrainerSubscriptions(),
        ]);

        const myPlans = plansRes.plans || plansRes || [];
        const subs = subsRes.subscriptions || subsRes || [];

        const activeSubs = subs.filter((s) => s.status === "active");
        const uniqueClientIds = new Set(
          activeSubs.map((s) => s.userId?._id || s.userId)
        );

        setStats({
          myPlans: myPlans.length,
          activeSubs: activeSubs.length,
          totalClients: uniqueClientIds.size,
        });
      } catch (err) {
        console.error(err);
        setApiError("Failed to load trainer overview.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm">
          <Dumbbell className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Trainer dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Manage your plans, clients, and see how your programs perform.
          </p>
        </div>
      </div>

      {apiError && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <KpiCard
              icon={Dumbbell}
              label="My plans"
              value={stats.myPlans}
              helper="Total published programs"
              to="/trainer-dashboard/plans"
            />
            <KpiCard
              icon={Users}
              label="Active subscriptions"
              value={stats.activeSubs}
              helper="Currently enrolled clients"
              to="/trainer-dashboard/subscriptions"
            />
            <KpiCard
              icon={BarChart2}
              label="Unique clients"
              value={stats.totalClients}
              helper="With at least one active plan"
              to="/trainer-dashboard/clients"
            />
          </div>

          {/* quick actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <QuickCard
              title="Create a new plan"
              description="Design a new workout or coaching program and publish it to the marketplace."
              actionLabel="Create plan"
              to="/trainer-dashboard/plans/create"
            />
            <QuickCard
              title="View all subscriptions"
              description="See which clients are on which plans, and manage renewals or support."
              actionLabel="View subscriptions"
              to="/trainer-dashboard/subscriptions"
            />
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, helper, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-orange-100 bg-white p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
    >
      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        <p className="text-[11px] text-slate-500">{helper}</p>
      </div>
    </Link>
  );
}

function QuickCard({ title, description, actionLabel, to }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-1">{title}</h2>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
      <div className="mt-3">
        <Link
          to={to}
          className="inline-flex text-xs font-semibold text-orange-600 hover:text-orange-700"
        >
          {actionLabel} →
        </Link>
      </div>
    </div>
  );
}
