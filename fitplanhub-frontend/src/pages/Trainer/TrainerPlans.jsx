// src/pages/Trainer/TrainerPlans.jsx
import React, { useEffect, useState } from "react";
import { planService } from "../../services/planService";
import {
  Dumbbell,
  Loader2,
  AlertCircle,
  Edit3,
  Users,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function TrainerPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        // backend: /plans/my-plans
        const data = await planService.getMyPlans();
        setPlans(data.plans || data || []);
      } catch (err) {
        console.error(err);
        setApiError("Failed to load your plans.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My plans</h1>
            <p className="text-sm text-slate-600">
              Manage the training programs you offer to clients.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/trainer-dashboard/plans/create")}
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-orange-600"
        >
          <Dumbbell className="w-4 h-4" />
          Create new plan
        </button>
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
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 text-sm text-slate-600">
          You have not created any plans yet.{" "}
          <button
            type="button"
            onClick={() => navigate("/trainer-dashboard/plans/create")}
            className="text-orange-600 font-semibold"
          >
            Create your first plan
          </button>
          .
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <PlanRow key={plan._id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanRow({ plan }) {
  const {
    _id,
    title,
    description,
    thumbnail,
    price,
    discountPrice,
    duration,
    durationUnit,
    totalSubscribers,
    difficultyLevel,
  } = plan;

  const finalPrice = discountPrice || price;

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 flex gap-3">
      <div className="w-16 h-16 rounded-xl bg-orange-50 overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Dumbbell className="w-7 h-7 text-orange-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-orange-500 mb-0.5">
              {difficultyLevel || "Plan"}
            </p>
            <h2 className="text-sm font-semibold text-slate-900 truncate">
              {title}
            </h2>
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
              {description}
            </p>
          </div>
          <Link
            to={`/trainer-dashboard/plans/${_id}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700"
          >
            <Edit3 className="w-3 h-3" />
            Edit
          </Link>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>{totalSubscribers || 0} subscribers</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>
              {duration} {durationUnit}
            </span>
          </div>
          <div className="ml-auto flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-slate-900">
              ₹{finalPrice}
            </span>
            {discountPrice && (
              <span className="text-[11px] text-slate-400 line-through">
                ₹{price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
