// src/pages/User/UserPlanDetails.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { planService } from "../../services/planService";
import { subscriptionService } from "../../services/subscriptionService";
import { loadRazorpayScript, initializeRazorpay } from "../../utils/razorpay";
import {
  Loader2,
  AlertCircle,
  Dumbbell,
  Star,
  Users,
  ArrowLeft,
  CreditCard,
} from "lucide-react";

export default function UserPlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subSuccess, setSubSuccess] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await planService.getPlanById(id);
        setPlan(data.plan || null);
      } catch (err) {
        console.error(err);
        setApiError("Failed to load plan.");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Load Razorpay script once
  useEffect(() => {
    const loadRazorpay = async () => {
      try {
        const loaded = await loadRazorpayScript();
        setRazorpayLoaded(loaded);
      } catch (error) {
        console.error("Failed to load Razorpay:", error);
      }
    };
    loadRazorpay();
  }, []);

  const handleSubscribe = async () => {
    if (!plan || !razorpayLoaded) return;

    setSubmitting(true);
    setApiError("");
    setSubSuccess("");

    try {
      // Step 1: Create Razorpay order
      const amount = (plan.discountPrice || plan.price) ?? 0;
      const orderData = await subscriptionService.createOrder(plan._id, amount);

      if (!orderData.orderId) {
        throw new Error("Failed to create payment order");
      }

      // Step 2: Open Razorpay checkout
      const paymentResponse = await initializeRazorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Fitness Plan Subscription",
        description: `Subscribe to ${orderData.planDetails.title}`,
        order_id: orderData.orderId,
        prefill: {
          name: "User", // You can get this from user context
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f97316", // orange-500
        },
        handler: async (response) => {
          // Step 3: Verify payment on backend
          const verifyData = await subscriptionService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId: plan._id,
          });

          if (verifyData.success) {
            setSubSuccess("Subscription created successfully! 🎉");
            // Optionally refresh plan data or navigate
            setTimeout(() => {
              navigate("/user-dashboard");
            }, 2000);
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled");
            setSubmitting(false);
          },
        },
      });

      // This won't be reached as handler manages the flow
    } catch (error) {
      console.error("Subscription error:", error);
      setApiError(error.message || "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (apiError || !plan) {
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

  const {
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

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {apiError && (
        <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}

      {subSuccess && (
        <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {subSuccess}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-[2fr,1.3fr]">
        {/* Left content - unchanged */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-orange-50 border border-orange-100 shrink-0">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-orange-400">
                  <Dumbbell className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="inline-flex flex-wrap items-center gap-2 mb-2 text-[11px]">
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

              <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">
                {title}
              </h1>
              {trainerId && (
                <p className="text-xs text-slate-600 mb-2">
                  Trainer:{" "}
                  <span className="font-medium text-slate-900">
                    {trainerId.name}
                  </span>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>
                    {averageRating ? averageRating.toFixed(1) : "New"}
                    {totalReviews ? ` · ${totalReviews} reviews` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{totalSubscribers || 0} enrolled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              About this plan
            </h2>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        </div>

        {/* Right price + subscribe */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Subscription
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-semibold text-slate-900">
                ₹{finalPrice}
              </span>
              {discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{price}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Secure payment · Full access for {duration} {durationUnit}
            </p>
            {!razorpayLoaded && (
              <div className="text-xs text-orange-600 flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                Loading payment...
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubscribe}
            disabled={submitting || !razorpayLoaded}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{razorpayLoaded ? "Pay & Subscribe" : "Loading..."}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
