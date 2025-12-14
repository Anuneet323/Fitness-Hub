// src/pages/User/UserPlans.jsx
import React, { useEffect, useState } from "react";
import { planService } from "../../services/planService";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Dumbbell, Star, Users } from "lucide-react";

export default function UserPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await planService.getPlans({ limit: 20, page: 1 });
        setPlans(data.plans || []);
      } catch (err) {
        console.error(err);
        setApiError("Failed to load plans.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Browse plans
        </h1>
        <p className="text-sm text-slate-600">
          Choose a plan that matches your goals and subscribe.
        </p>
      </div>

      {apiError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <p className="text-sm text-slate-600">No plans are available yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <UserPlanCard key={plan._id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserPlanCard({ plan }) {
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
    averageRating,
    totalReviews,
    totalSubscribers,
    thumbnail,
  } = plan;

  const finalPrice = discountPrice || price;

  return (
    <button
      type="button"
      onClick={() => navigate(`/user-dashboard/plans/${_id}`)}
      className="group text-left rounded-2xl border border-orange-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div className="relative h-32 w-full overflow-hidden bg-orange-50">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-orange-400">
            <Dumbbell className="w-7 h-7" />
          </div>
        )}
        <div className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-orange-600">
          {category?.replace("-", " ") || "General"}
        </div>
        <div className="absolute top-2 right-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-orange-100 capitalize">
          {difficultyLevel}
        </div>
      </div>

      <div className="flex-1 p-3.5 flex flex-col">
        <h2 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1.5">
          {title}
        </h2>
        <p className="text-xs text-slate-500 line-clamp-2 mb-2">
          {description}
        </p>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>
              {averageRating ? averageRating.toFixed(1) : "New"}
              {totalReviews ? ` · ${totalReviews}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>{totalSubscribers || 0} enrolled</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-slate-900">
                ₹{finalPrice}
              </span>
              {discountPrice && (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{price}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {duration} {durationUnit}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-orange-600 group-hover:text-orange-700">
            View details
          </span>
        </div>
      </div>
    </button>
  );
}
