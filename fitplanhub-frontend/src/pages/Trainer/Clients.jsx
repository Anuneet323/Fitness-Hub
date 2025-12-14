// src/pages/Trainer/Clients.jsx
import React, { useEffect, useState } from "react";
import { subscriptionService } from "../../services/subscriptionService";
import { Loader2, AlertCircle, Users, Dumbbell, Mail } from "lucide-react";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await subscriptionService.getTrainerSubscriptions();
        const subs = data.subscriptions || data || [];

        // group by userId to get unique clients + some stats
        const map = new Map();
        subs.forEach((sub) => {
          const u = sub.userId;
          if (!u) return;
          const key = u._id || u.id || String(u);
          if (!map.has(key)) {
            map.set(key, {
              user: u,
              totalSubscriptions: 0,
              activeSubscriptions: 0,
            });
          }
          const entry = map.get(key);
          entry.totalSubscriptions += 1;
          if (sub.status === "active") entry.activeSubscriptions += 1;
        });

        setClients(Array.from(map.values()));
      } catch (err) {
        console.error(err);
        setApiError("Failed to load clients.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My clients</h1>
          <p className="text-sm text-slate-600">
            People currently or previously subscribed to your plans.
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
      ) : clients.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 text-sm text-slate-600">
          No clients yet. Once users subscribe to your plans, they will appear
          here.
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map((c) => (
            <ClientRow key={c.user._id || c.user.id} entry={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function ClientRow({ entry }) {
  const { user, totalSubscriptions, activeSubscriptions } = entry;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 flex gap-3 items-center">
      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-xs font-semibold text-white shadow">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">
          {user.name}
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
          <Mail className="w-3 h-3 text-slate-400" />
          <span>{user.email}</span>
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Dumbbell className="w-3 h-3 text-orange-400" />
            <span>{activeSubscriptions} active plans</span>
          </span>
          <span>{totalSubscriptions} total subscriptions</span>
        </div>
      </div>
    </div>
  );
}
