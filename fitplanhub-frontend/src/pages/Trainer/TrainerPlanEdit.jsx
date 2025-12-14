// src/pages/Trainer/TrainerPlanEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { planService } from "../../services/planService";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function TrainerPlanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficultyLevel: "",
    price: "",
    discountPrice: "",
    duration: "",
    durationUnit: "weeks",
    thumbnail: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await planService.getPlanById(id);
        const p = data.plan || data;

        setForm({
          title: p.title || "",
          description: p.description || "",
          category: p.category || "",
          difficultyLevel: p.difficultyLevel || "",
          price: p.price ?? "",
          discountPrice: p.discountPrice ?? "",
          duration: p.duration ?? "",
          durationUnit: p.durationUnit || "weeks",
          thumbnail: p.thumbnail || "",
        });
      } catch (err) {
        console.error(err);
        setApiError("Failed to load plan.");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setApiError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setApiError("");
    setSuccess("");

    try {
      // you must have an update endpoint like: PUT /plans/:id
      await planService.updatePlan(id, {
        ...form,
        price: Number(form.price) || 0,
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        duration: Number(form.duration) || 0,
      });
      setSuccess("Plan updated successfully.");
      // optional: navigate back to plans list
      // navigate("/trainer-dashboard/plans");
    } catch (err) {
      console.error(err);
      setApiError("Failed to update plan. Please try again.");
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

  if (apiError && !form.title) {
    return (
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError || "Plan not found."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Edit plan</h1>
      <p className="text-sm text-slate-600 mb-4">
        Update details for this training program.
      </p>

      {apiError && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}
      {success && (
        <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-orange-100 bg-white p-4"
      >
        {/* title */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Plan title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
          />
        </div>

        {/* description */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
          />
        </div>

        {/* category & difficulty */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. strength, fat-loss"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Difficulty level
            </label>
            <select
              name="difficultyLevel"
              value={form.difficultyLevel}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* price */}
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Discount price (₹)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={form.discountPrice}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Duration
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              />
              <select
                name="durationUnit"
                value={form.durationUnit}
                onChange={handleChange}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* thumbnail */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Thumbnail URL
          </label>
          <input
            type="url"
            name="thumbnail"
            value={form.thumbnail}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Used on cards across the app.
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
