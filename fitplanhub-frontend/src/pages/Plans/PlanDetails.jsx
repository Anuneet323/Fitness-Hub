// src/pages/Plans/PlanDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Loader2,
  AlertCircle,
  Star,
  Users,
  ArrowLeft,
} from "lucide-react";
import { planService } from "../../services/planService";

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await planService.getPlanById(id);
        setPlan(data.plan || null);
      } catch (error) {
        console.error("Fetch plan error:", error);
        setApiError("Failed to load plan. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (apiError || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{apiError || "Plan not found."}</span>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    detailedDescription,
    category,
    difficultyLevel,
    price,
    discountPrice,
    duration,
    durationUnit,
    thumbnail,
    averageRating,
    totalReviews,
    totalSubscribers,
    trainerId,
    features,
    workoutSchedule,
    nutritionPlan,
  } = plan;

  const finalPrice = discountPrice || price;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100/60">
      <motion.div
        className="max-w-5xl mx-auto px-4 py-10 md:py-14"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-orange-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Top section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Image */}
          <motion.div
            className="w-full md:w-1/3 rounded-2xl overflow-hidden bg-orange-50 border border-orange-100 shadow-sm"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-orange-400">
                <Dumbbell className="w-10 h-10" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div className="inline-flex flex-wrap items-center gap-2 mb-3 text-[11px]">
              <span className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-700 capitalize">
                {category?.replace("-", " ") || "General"}
              </span>
              <span className="rounded-full bg-slate-900 text-orange-100 px-2 py-0.5 font-medium capitalize">
                {difficultyLevel}
              </span>
              <span className="text-slate-500">
                {duration} {durationUnit}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
              {title}
            </h1>

            {trainerId && (
              <p className="text-sm text-slate-600 mb-3">
                By{" "}
                <span className="font-semibold text-slate-900">
                  {trainerId.name}
                </span>
              </p>
            )}

            {/* Rating + enroll */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="font-medium">
                  {averageRating ? averageRating.toFixed(1) : "New"}
                </span>
                {totalReviews ? (
                  <span className="text-slate-500">
                    ({totalReviews} reviews)
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{totalSubscribers || 0} enrolled</span>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-slate-900">
                    ₹{finalPrice}
                  </span>
                  {discountPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{price}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  One-time payment · Full program access
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
              >
                Start this plan
              </button>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          className="rounded-2xl border border-orange-100 bg-white p-4 md:p-5 mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-sm font-semibold text-slate-900 mb-2">
            About this plan
          </h2>
          <p className="text-sm text-slate-600 mb-2">{description}</p>
          {detailedDescription && (
            <p className="text-sm text-slate-600 whitespace-pre-line">
              {detailedDescription}
            </p>
          )}
        </motion.div>

        {/* Features + structure */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-orange-100 bg-white p-4 md:p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              What you&apos;ll get
            </h3>
            {Array.isArray(features) && features.length > 0 ? (
              <ul className="space-y-1.5 text-sm text-slate-600">
                {features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                Structured workouts, coach guidance, and progress tracking.
              </p>
            )}
          </motion.div>

          <motion.div
            className="rounded-2xl border border-orange-100 bg-white p-4 md:p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Workout structure
            </h3>
            {Array.isArray(workoutSchedule) && workoutSchedule.length > 0 ? (
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 text-sm text-slate-600">
                {workoutSchedule.slice(0, 7).map((day) => (
                  <li key={day.day} className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-orange-600 mt-0.5">
                      Day {day.day}
                    </span>
                    <span className="flex-1">{day.title || "Workout day"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                Program includes progressive weekly workouts focusing on your
                primary goal.
              </p>
            )}
          </motion.div>
        </div>

        {/* Nutrition (if available) */}
        {nutritionPlan && (
          <motion.div
            className="mt-4 rounded-2xl border border-orange-100 bg-white p-4 md:p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Nutrition overview
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {"calories" in nutritionPlan && (
                <div>
                  <p className="text-xs text-slate-500">Calories</p>
                  <p className="font-semibold">{nutritionPlan.calories} kcal</p>
                </div>
              )}
              {"protein" in nutritionPlan && (
                <div>
                  <p className="text-xs text-slate-500">Protein</p>
                  <p className="font-semibold">{nutritionPlan.protein} g</p>
                </div>
              )}
              {"carbs" in nutritionPlan && (
                <div>
                  <p className="text-xs text-slate-500">Carbs</p>
                  <p className="font-semibold">{nutritionPlan.carbs} g</p>
                </div>
              )}
              {"fats" in nutritionPlan && (
                <div>
                  <p className="text-xs text-slate-500">Fats</p>
                  <p className="font-semibold">{nutritionPlan.fats} g</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
