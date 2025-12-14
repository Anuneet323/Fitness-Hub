// src/pages/Account/Notifications.jsx
import React, { useEffect, useState } from "react";
import { notificationService } from "../../services/notificationService";
import { Loader2, AlertCircle, Bell, CheckCircle2, Clock } from "lucide-react";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [marking, setMarking] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setApiError("");

      // uses notificationService.getNotifications
      const data = await notificationService.getNotifications();
      const list = Array.isArray(data) ? data : data.notifications || [];

      setItems(list);
    } catch (err) {
      console.error(err);
      setApiError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      setMarking(true);
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (err) {
      console.error(err);
      setApiError("Failed to mark notifications as read.");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Notifications
          </h1>
          <p className="text-sm text-slate-600">
            Stay up to date with new plans, subscriptions, and community
            activity.
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={marking}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        )}
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
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <span>No notifications yet.</span>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <NotificationRow key={n._id || n.id} n={n} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NotificationRow({ n }) {
  const isUnread = !n.read && !n.isRead;
  const createdAt = n.createdAt ? new Date(n.createdAt) : null;

  return (
    <li
      className={`rounded-2xl border px-4 py-3 bg-white flex gap-3 ${
        isUnread ? "border-orange-200 bg-orange-50/60" : "border-slate-200"
      }`}
    >
      <div className="mt-1">
        <span
          className={`inline-flex h-2 w-2 rounded-full ${
            isUnread ? "bg-orange-500" : "bg-slate-300"
          }`}
        />
      </div>

      <div className="flex-1">
        <p className="text-sm text-slate-900">
          {n.title || n.type || "Notification"}
        </p>
        {n.message && (
          <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
        )}

        {createdAt && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{createdAt.toLocaleString()}</span>
          </div>
        )}
      </div>
    </li>
  );
}
