// src/pages/User/UserOverview.jsx
import React, { useEffect, useState } from "react";
import { subscriptionService } from "../../services/subscriptionService";
import { Loader2, AlertCircle, Dumbbell, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserOverview() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await subscriptionService.getMySubscriptions();
        setSubs(data.subscriptions || []);
      } catch (err) {
        console.error(err);
        setApiError("Failed to load your subscriptions.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Your dashboard
          </h1>
          <p className="text-sm text-slate-600">
            See your active plans and jump back into training.
          </p>
        </div>
        <Link
          to="/user-dashboard/plans"
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600"
        >
          Browse all plans
        </Link>
      </div>

      {apiError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}

      {subs.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 text-sm text-slate-600">
          You do not have any active subscriptions yet.{" "}
          <Link
            to="/user-dashboard/plans"
            className="text-orange-600 font-semibold"
          >
            Explore plans
          </Link>
          .
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subs.map((sub) => (
            <SubscriptionCard key={sub._id} sub={sub} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubscriptionCard({ sub }) {
  const { planId: plan, trainerId: trainer, status, startDate, endDate } = sub;

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 flex gap-3 shadow-sm">
      <div className="w-16 h-16 rounded-xl bg-orange-50 overflow-hidden flex items-center justify-center">
        {plan?.thumbnail ? (
          <img
            src={plan.thumbnail}
            alt={plan.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Dumbbell className="w-7 h-7 text-orange-400" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-500 mb-1">
          {status === "active" ? "Active plan" : status}
        </p>
        <p className="text-sm font-semibold text-slate-900 line-clamp-1">
          {plan?.title}
        </p>
        {trainer && (
          <p className="text-xs text-slate-500">
            Trainer:{" "}
            <span className="font-medium text-slate-800">{trainer.name}</span>
          </p>
        )}
        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
          <CalendarClock className="w-3 h-3" />
          {start && (
            <span>
              {start.toLocaleDateString()} – {end?.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
