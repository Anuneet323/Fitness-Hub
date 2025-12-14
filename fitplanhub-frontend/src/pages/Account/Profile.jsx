// src/pages/Account/Profile.jsx
import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatarUrl: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await authService.getProfile();
        const user = data.user || data;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          avatarUrl: user.avatarUrl || "",
          bio: user.bio || "",
        });
      } catch (err) {
        console.error(err);
        setApiError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setApiError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setApiError("");
    setSuccess("");

    try {
      await authService.updateProfile(formData);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setApiError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">
        Account profile
      </h1>
      <p className="text-sm text-slate-600 mb-4">
        Update your basic information. This is visible to your trainer and
        community.
      </p>

      {apiError && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}
      {success && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-orange-100 bg-white p-4"
      >
        {/* name */}
        <div>
          <label className="block text-sm text-slate-700 mb-1">Full name</label>
          <input
            type="text"
            name="name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            value={formData.name}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        {/* email (read-only) */}
        <div>
          <label className="block text-sm text-slate-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            value={formData.email}
            disabled
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Email cannot be changed from here.
          </p>
        </div>

        {/* avatar url */}
        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            name="avatarUrl"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            value={formData.avatarUrl}
            onChange={handleChange}
            disabled={saving}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Paste a direct image URL. Used in navbar and community.
          </p>
        </div>

        {/* bio */}
        <div>
          <label className="block text-sm text-slate-700 mb-1">Bio</label>
          <textarea
            name="bio"
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            value={formData.bio}
            onChange={handleChange}
            disabled={saving}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            A short line about your goals or coaching style.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
