// src/pages/Trainer/CreatePlan.jsx
import React, { useState } from "react";
import { planService } from "../../services/planService";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";

const initialState = {
  title: "",
  description: "",
  category: "",
  difficultyLevel: "beginner",
  price: "",
  discountPrice: "",
  duration: "",
  durationUnit: "days",
};

const categories = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "strength", label: "Strength" },
  { value: "endurance", label: "Endurance" },
];

const difficultyLevels = ["beginner", "intermediate", "advanced"];
const durationUnits = ["days", "weeks", "months"];

// simple validators
const validators = {
  title: (v) =>
    !v.trim()
      ? "Title is required."
      : v.trim().length < 4
      ? "Title must be at least 4 characters."
      : "",
  description: (v) =>
    !v.trim()
      ? "Description is required."
      : v.trim().length < 10
      ? "Description must be at least 10 characters."
      : "",
  category: (v) => (!v ? "Category is required." : ""),
  price: (v) => {
    if (!v) return "Price is required.";
    const n = Number(v);
    if (Number.isNaN(n)) return "Price must be a number.";
    if (n <= 0) return "Price must be greater than 0.";
    return "";
  },
  discountPrice: (v, all) => {
    if (!v) return "";
    const n = Number(v);
    if (Number.isNaN(n)) return "Discount price must be a number.";
    if (n <= 0) return "Discount price must be greater than 0.";
    if (all.price && n >= Number(all.price)) {
      return "Discount must be less than price.";
    }
    return "";
  },
  duration: (v) => {
    if (!v) return "Duration is required.";
    const n = Number(v);
    if (Number.isNaN(n)) return "Duration must be a number.";
    if (!Number.isInteger(n) || n <= 0)
      return "Duration must be a positive integer.";
    return "";
  },
};

export default function TrainerCreatePlan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const validateField = (name, value, data = formData) => {
    if (!validators[name]) return "";
    return validators[name](value, data);
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach((key) => {
      const msg = validateField(key, formData[key], formData);
      if (msg) newErrors[key] = msg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const nextValue =
      name === "price" || name === "discountPrice" || name === "duration"
        ? value.replace(/[^\d]/g, "")
        : value;

    const nextForm = { ...formData, [name]: nextValue };
    setFormData(nextForm);
    setApiError("");
    setSuccess("");

    // live validation for changed field
    if (validators[name]) {
      const msg = validateField(name, nextValue, nextForm);
      setErrors((prev) => ({
        ...prev,
        [name]: msg,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    const ok = validateAll();
    if (!ok) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      difficultyLevel: formData.difficultyLevel,
      price: Number(formData.price),
      discountPrice: formData.discountPrice
        ? Number(formData.discountPrice)
        : undefined,
      duration: Number(formData.duration),
      durationUnit: formData.durationUnit,
    };

    setLoading(true);
    try {
      await planService.createPlan(payload);
      setSuccess("Plan created successfully.");
      setTimeout(() => {
        navigate("/trainer-dashboard/plans");
      }, 800);
    } catch (error) {
      console.error("Create plan error:", error);
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Failed to create plan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Create new plan
          </h1>
          <p className="text-sm text-slate-500">
            Design a structured program your clients can subscribe to.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {apiError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {apiError}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white border border-orange-100 rounded-2xl p-4 md:p-6 shadow-sm"
        noValidate
      >
        {/* Title */}
        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Plan title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="30-Day Weight Loss Challenge"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/70 ${
              errors.title ? "border-red-400" : "border-slate-200"
            }`}
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Short description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Transform your body with daily guided workouts and nutrition tips."
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/70 ${
              errors.description ? "border-red-400" : "border-slate-200"
            }`}
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Category + Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70 ${
                errors.category ? "border-red-400" : "border-slate-200"
              }`}
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Difficulty level
            </label>
            <select
              name="difficultyLevel"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.difficultyLevel}
              onChange={handleChange}
              disabled={loading}
            >
              {difficultyLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price + Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Price (INR) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="price"
              inputMode="numeric"
              placeholder="999"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/70 ${
                errors.price ? "border-red-400" : "border-slate-200"
              }`}
              value={formData.price}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Discount price (optional)
            </label>
            <input
              type="text"
              name="discountPrice"
              inputMode="numeric"
              placeholder="799"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/70 ${
                errors.discountPrice ? "border-red-400" : "border-slate-200"
              }`}
              value={formData.discountPrice}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.discountPrice && (
              <p className="mt-1 text-xs text-red-600">
                {errors.discountPrice}
              </p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Duration value <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="duration"
              inputMode="numeric"
              placeholder="30"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/70 ${
                errors.duration ? "border-red-400" : "border-slate-200"
              }`}
              value={formData.duration}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.duration && (
              <p className="mt-1 text-xs text-red-600">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Duration unit
            </label>
            <select
              name="durationUnit"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.durationUnit}
              onChange={handleChange}
              disabled={loading}
            >
              {durationUnits.map((u) => (
                <option key={u} value={u}>
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-sm font-semibold text-white shadow-md disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create plan"}
          </button>
        </div>
      </form>
    </div>
  );
}
