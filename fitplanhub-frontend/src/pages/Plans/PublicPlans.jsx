// src/pages/Plans/PublicPlans.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { planService } from "../../services/planService";
import { Dumbbell, Star, Users, Loader2, AlertCircle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function PublicPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await planService.getPlans({ limit: 12, page: 1 });
        setPlans(data.plans || []);
      } catch (error) {
        console.error("Fetch plans error:", error);
        setApiError("Failed to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100/60">
      <motion.div
        className="max-w-6xl mx-auto px-4 py-10 md:py-14"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl bg-orange-500 shadow-md flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-orange-500/30 blur-md" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Explore training plans
              </h1>
              <p className="text-sm text-slate-600">
                Curated programs from verified trainers to match your goals.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Error state */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <AlertCircle className="w-4 h-4" />
              <span>{apiError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-slate-700 font-medium">
              No plans are available yet.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Check back soon for new training programs.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {plans.map((plan) => (
              <PlanCard key={plan._id} plan={plan} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function PlanCard({ plan }) {
  const navigate = useNavigate();
  const {
    _id,
    title,
    description,
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
  } = plan;

  const finalPrice = discountPrice || price;

  const handleViewDetails = () => {
    navigate(`/plans/${_id}`);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="group h-full rounded-2xl border border-orange-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden bg-orange-50">
        {thumbnail ? (
          <motion.img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-orange-400">
            <Dumbbell className="w-8 h-8" />
          </div>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-orange-600 shadow-sm">
          <span className="capitalize">
            {category?.replace("-", " ") || "General"}
          </span>
        </div>
        <div className="absolute top-3 right-3 inline-flex items-center rounded-full bg-slate-900/85 px-2 py-1 text-[11px] font-medium text-orange-100">
          <span className="capitalize">{difficultyLevel}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title + trainer */}
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {title}
          </h2>
          {trainerId && (
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              By{" "}
              <span className="font-medium text-slate-700">
                {trainerId.name}
              </span>
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-3 mb-3">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>
              {averageRating ? averageRating.toFixed(1) : "New"}
              {totalReviews ? ` · ${totalReviews} reviews` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>{totalSubscribers || 0} enrolled</span>
          </div>
        </div>

        {/* Price + duration */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-slate-900">
                ₹{finalPrice}
              </span>
              {discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{price}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {duration} {durationUnit}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            View details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
