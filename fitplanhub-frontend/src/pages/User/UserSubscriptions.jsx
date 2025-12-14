// src/pages/User/UserSubscriptions.jsx
import React, { useEffect, useState } from "react";
import { subscriptionService } from "../../services/subscriptionService";
import {
  Loader2,
  AlertCircle,
  Dumbbell,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UserSubscriptions() {
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

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          My subscriptions
        </h1>
        <p className="text-sm text-slate-600">
          All plans you have subscribed to, with their status and duration.
        </p>
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
      ) : subs.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 text-sm text-slate-600">
          You do not have any subscriptions yet.{" "}
          <Link
            to="/user-dashboard/plans"
            className="text-orange-600 font-semibold"
          >
            Browse plans
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-3">
          {subs.map((sub) => (
            <SubscriptionRow key={sub._id} sub={sub} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubscriptionRow({ sub }) {
  const { planId: plan, trainerId: trainer, status, startDate, endDate } = sub;

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const statusLabel =
    status === "active"
      ? "Active"
      : status === "cancelled"
      ? "Cancelled"
      : status;

  const statusColor =
    status === "active"
      ? "bg-emerald-100 text-emerald-700"
      : status === "cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-700";

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 flex gap-3">
      <div className="w-14 h-14 rounded-xl bg-orange-50 overflow-hidden flex items-center justify-center">
        {plan?.thumbnail ? (
          <img
            src={plan.thumbnail}
            alt={plan.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Dumbbell className="w-6 h-6 text-orange-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {plan?.title}
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor}`}
          >
            {status === "active" && <CheckCircle2 className="w-3 h-3" />}
            {statusLabel}
          </span>
        </div>

        {trainer && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Trainer:{" "}
            <span className="font-medium text-slate-800">{trainer.name}</span>
          </p>
        )}

        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
          <CalendarClock className="w-3 h-3" />
          {start && end ? (
            <span>
              {start.toLocaleDateString()} – {end.toLocaleDateString()}
            </span>
          ) : (
            <span>Dates not available</span>
          )}
        </div>
      </div>
    </div>
  );
}
