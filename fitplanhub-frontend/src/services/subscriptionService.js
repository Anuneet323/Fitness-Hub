// src/services/subscriptionService.js - Updated
import api from "./api";

export const subscriptionService = {
  // Create Razorpay order
  createOrder: async (planId, amount) => {
    try {
      const response = await api.post("/subscriptions/create-order", {
        planId,
        amount,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create order");
      }
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
      const response = await api.post(
        "/subscriptions/verify-payment",
        paymentData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Payment verification failed");
      }
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

  // Get my subscriptions
  getMySubscriptions: async (params = {}) => {
    try {
      const response = await api.get("/subscriptions/my-subscriptions", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Get subscriptions error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load subscriptions."
      );
    }
  },

  // Get subscription by ID
  getSubscriptionById: async (id) => {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      if (!response.data.success && response.status !== 404) {
        throw new Error(response.data.message || "Failed to load subscription");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Get subscription error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load subscription details."
      );
    }
  },

  // Cancel subscription
  cancelSubscription: async (id, reason) => {
    try {
      const response = await api.put(`/subscriptions/${id}/cancel`, { reason });
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to cancel subscription"
        );
      }
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

  // Get trainer subscriptions (trainer only)
  getTrainerSubscriptions: async (params = {}) => {
    try {
      const response = await api.get("/subscriptions/trainer-subscriptions", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Get trainer subscriptions error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load trainer subscriptions."
      );
    }
  },

  // Check if user is subscribed to a plan
  checkUserSubscription: async (planId) => {
    try {
      const response = await api.get(
        `/subscriptions/check-subscription/${planId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Check subscription error:",
        error.response?.data || error.message
      );
      // Don't throw error for this one - return default response
      return {
        success: false,
        isSubscribed: false,
        message: "Unable to check subscription status",
      };
    }
  },

  // Get payment details
  getPaymentDetails: async (orderId) => {
    try {
      const response = await api.get(
        `/subscriptions/payment-details/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Get payment details error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load payment details."
      );
    }
  },

  // Get subscription analytics (if available)
  getSubscriptionAnalytics: async () => {
    try {
      const response = await api.get("/subscriptions/analytics");
      return response.data;
    } catch (error) {
      console.error(
        "Get analytics error:",
        error.response?.data || error.message
      );
      // Optional endpoint - don't throw error
      return null;
    }
  },
};

// Utility functions
export const subscriptionUtils = {
  // Format currency
  formatCurrency: (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Calculate days remaining
  calculateDaysRemaining: (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  },

  // Get subscription status with styling
  getStatusInfo: (subscription) => {
    const now = new Date();
    const endDate = new Date(subscription.endDate);

    if (subscription.status === "cancelled") {
      return {
        label: "Cancelled",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-200",
      };
    }

    if (subscription.status === "expired" || endDate < now) {
      return {
        label: "Expired",
        color: "text-slate-600",
        bgColor: "bg-slate-100",
        borderColor: "border-slate-200",
      };
    }

    if (subscription.status === "pending") {
      return {
        label: "Pending",
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        borderColor: "border-amber-200",
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
      };
    }

    return {
      label: "Active",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-200",
    };
  },

  // Format date
  formatDate: (dateString, options = {}) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      ...options,
    });
  },

  // Calculate progress percentage
  calculateProgress: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (now >= end) return 100;
    if (now <= start) return 0;

    const totalDuration = end - start;
    const elapsedDuration = now - start;
    return Math.min(100, Math.round((elapsedDuration / totalDuration) * 100));
  },

  // Validate subscription is active
  isSubscriptionActive: (subscription) => {
    if (!subscription) return false;
    if (subscription.status !== "active") return false;

    const now = new Date();
    const endDate = new Date(subscription.endDate);
    return endDate > now;
  },
};

// Export both as default and named
export default subscriptionService;
