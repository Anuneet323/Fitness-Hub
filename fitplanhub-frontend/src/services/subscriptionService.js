// src/services/subscriptionService.js - COMPLETELY UPDATED & FIXED
import api from "./api";

export const subscriptionService = {
  // Create Razorpay order
  createOrder: async (planId, amount) => {
    try {
      console.log("Creating order for plan:", planId, "amount:", amount);
      const response = await api.post("/subscriptions/create-order", {
        planId,
        amount,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create order");
      }

      console.log("Order created successfully:", response.data.orderId);
      return response.data;
    } catch (error) {
      console.error(
        "Create order error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create payment order. Please try again."
      );
    }
  },

  // Verify and create subscription
  verifyPayment: async (paymentData) => {
    try {
      console.log("Verifying payment:", paymentData.razorpay_order_id);
      const response = await api.post(
        "/subscriptions/verify-payment",
        paymentData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Payment verification failed");
      }

      console.log("Payment verified successfully");
      return response.data;
    } catch (error) {
      console.error(
        "Verify payment error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Payment verification failed. Please contact support."
      );
    }
  },

  // Create subscription (for admin/backend use)
  createSubscription: async (subscriptionData) => {
    try {
      console.log("Creating subscription:", subscriptionData.planId);
      const response = await api.post("/subscriptions", subscriptionData);
      return response.data;
    } catch (error) {
      console.error(
        "Create subscription error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create subscription."
      );
    }
  },

  // Get my subscriptions (for users)
  getMySubscriptions: async (params = {}) => {
    try {
      console.log("Fetching my subscriptions");
      const response = await api.get("/subscriptions/my-subscriptions", {
        params,
      });

      if (!response.data.success && response.status !== 404) {
        throw new Error(
          response.data.message || "Failed to load subscriptions"
        );
      }

      console.log(
        "My subscriptions loaded:",
        response.data.subscriptions?.length || 0
      );
      return response.data;
    } catch (error) {
      console.error(
        "Get subscriptions error:",
        error.response?.data || error.message
      );

      // For my-subscriptions, return empty array instead of throwing
      return {
        success: false,
        subscriptions: [],
        summary: {
          total: 0,
          active: 0,
          cancelled: 0,
          expired: 0,
        },
        message: "Failed to load subscriptions",
      };
    }
  },

  // Get subscription by ID - FIXED: Add validation for ID
  getSubscriptionById: async (id) => {
    try {
      // Validate that ID is provided and not empty
      if (!id || id.trim() === "") {
        throw new Error("Subscription ID is required");
      }

      // Validate that ID is not a route path
      if (id.includes("-") && !id.match(/^[0-9a-fA-F]{24}$/)) {
        console.warn("Warning: ID might be incorrect:", id);
        // Still try, but log the warning
      }

      console.log("Fetching subscription by ID:", id);
      const response = await api.get(`/subscriptions/${id}`);

      if (!response.data.success && response.status !== 404) {
        throw new Error(response.data.message || "Failed to load subscription");
      }

      return response.data;
    } catch (error) {
      console.error(
        "Get subscription by ID error:",
        error.response?.data || error.message
      );

      // Return empty subscription instead of throwing
      return {
        success: false,
        subscription: null,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to load subscription details.",
      };
    }
  },

  // Cancel subscription
  cancelSubscription: async (id, reason) => {
    try {
      if (!id) {
        throw new Error("Subscription ID is required");
      }

      if (!reason || reason.trim() === "") {
        throw new Error("Cancellation reason is required");
      }

      console.log("Cancelling subscription:", id, "reason:", reason);
      const response = await api.put(`/subscriptions/${id}/cancel`, { reason });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to cancel subscription"
        );
      }

      console.log("Subscription cancelled successfully");
      return response.data;
    } catch (error) {
      console.error(
        "Cancel subscription error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to cancel subscription."
      );
    }
  },

  // Get trainer subscriptions (trainer only) - FIXED: This should NOT take an ID parameter
  getTrainerSubscriptions: async (params = {}) => {
    try {
      console.log("Fetching trainer subscriptions");
      const response = await api.get("/subscriptions/trainer-subscriptions", {
        params,
      });

      if (!response.data.success && response.status !== 404) {
        throw new Error(
          response.data.message || "Failed to load trainer subscriptions"
        );
      }

      console.log(
        "Trainer subscriptions loaded:",
        response.data.subscriptions?.length || 0
      );
      return response.data;
    } catch (error) {
      console.error(
        "Get trainer subscriptions error:",
        error.response?.data || error.message
      );

      // For trainer subscriptions, return empty with proper structure
      return {
        success: false,
        subscriptions: [],
        summary: {
          total: 0,
          active: 0,
          cancelled: 0,
          expired: 0,
          totalRevenue: 0,
        },
        message: "Failed to load trainer subscriptions",
      };
    }
  },

  // Check if user is subscribed to a plan
  checkUserSubscription: async (planId) => {
    try {
      if (!planId) {
        return {
          success: false,
          isSubscribed: false,
          message: "Plan ID is required",
        };
      }

      console.log("Checking subscription for plan:", planId);
      const response = await api.get(
        `/subscriptions/check-subscription/${planId}`
      );

      return response.data;
    } catch (error) {
      console.error(
        "Check subscription error:",
        error.response?.data || error.message
      );

      // Return default response instead of throwing
      return {
        success: false,
        isSubscribed: false,
        message: "Unable to check subscription status",
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Get payment details
  getPaymentDetails: async (orderId) => {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      console.log("Fetching payment details for order:", orderId);
      const response = await api.get(
        `/subscriptions/payment-details/${orderId}`
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get payment details error:",
        error.response?.data || error.message
      );

      // Return error response instead of throwing
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to load payment details.",
        error: error.message,
      };
    }
  },

  // Get subscription analytics (if available)
  getSubscriptionAnalytics: async () => {
    try {
      console.log("Fetching subscription analytics");
      const response = await api.get("/subscriptions/analytics");
      return response.data;
    } catch (error) {
      console.error(
        "Get analytics error:",
        error.response?.data || error.message
      );

      // Optional endpoint - return default analytics
      return {
        success: false,
        analytics: {},
        message: "Analytics not available",
      };
    }
  },
};

// Utility functions
export const subscriptionUtils = {
  // Format currency
  formatCurrency: (amount, currency = "INR") => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "₹0";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Calculate days remaining
  calculateDaysRemaining: (endDate) => {
    if (!endDate) return 0;

    try {
      const now = new Date();
      const end = new Date(endDate);

      if (isNaN(end.getTime())) return 0;

      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return 0;
    }
  },

  // Get subscription status with styling
  getStatusInfo: (subscription) => {
    if (!subscription) {
      return {
        label: "Unknown",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-200",
        badgeClass: "bg-gray-100 text-gray-800",
      };
    }

    const now = new Date();
    const endDate = new Date(subscription.endDate);

    if (subscription.status === "cancelled") {
      return {
        label: "Cancelled",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-200",
        badgeClass: "bg-red-100 text-red-800",
      };
    }

    if (subscription.status === "expired" || endDate < now) {
      return {
        label: "Expired",
        color: "text-slate-600",
        bgColor: "bg-slate-100",
        borderColor: "border-slate-200",
        badgeClass: "bg-slate-100 text-slate-800",
      };
    }

    if (subscription.status === "pending") {
      return {
        label: "Pending",
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        borderColor: "border-amber-200",
        badgeClass: "bg-amber-100 text-amber-800",
      };
    }

    const daysLeft = subscriptionUtils.calculateDaysRemaining(
      subscription.endDate
    );

    if (daysLeft <= 7) {
      return {
        label: `Expiring in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        borderColor: "border-amber-200",
        badgeClass: "bg-amber-100 text-amber-800",
      };
    }

    return {
      label: "Active",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-200",
      badgeClass: "bg-emerald-100 text-emerald-800",
    };
  },

  // Format date
  formatDate: (dateString, options = {}) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...options,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  },

  // Format date and time
  formatDateTime: (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting datetime:", error);
      return "Invalid Date";
    }
  },

  // Calculate progress percentage
  calculateProgress: (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
      if (now >= end) return 100;
      if (now <= start) return 0;

      const totalDuration = end - start;
      const elapsedDuration = now - start;
      return Math.min(100, Math.round((elapsedDuration / totalDuration) * 100));
    } catch (error) {
      console.error("Error calculating progress:", error);
      return 0;
    }
  },

  // Validate subscription is active
  isSubscriptionActive: (subscription) => {
    if (!subscription) return false;
    if (subscription.status !== "active") return false;

    try {
      const now = new Date();
      const endDate = new Date(subscription.endDate);

      if (isNaN(endDate.getTime())) return false;

      return endDate > now;
    } catch (error) {
      console.error("Error checking subscription active status:", error);
      return false;
    }
  },

  // Get duration text
  getDurationText: (duration, durationUnit) => {
    if (!duration || !durationUnit) return "N/A";

    const unitMap = {
      days: "day",
      weeks: "week",
      months: "month",
    };

    const unit = unitMap[durationUnit] || durationUnit;
    return `${duration} ${unit}${duration > 1 ? "s" : ""}`;
  },

  // Validate MongoDB ObjectId
  isValidObjectId: (id) => {
    if (!id || typeof id !== "string") return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
  },
};

// Export both as default and named
export default subscriptionService;
