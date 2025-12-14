
import { Request, Response } from "express";
import { Subscription } from "../models/Subscription.model";
import { Plan } from "../models/Plan.model";
import {
  getrazorpayInstance,
  createRazorpayOrder,
  verifyRazorpaySignature,
  fetchPaymentDetails,
} from "../config/razorpay";

// Create Razorpay order
export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { planId, amount } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Use the getter function to get Razorpay instance
    const razorpayInstance = getrazorpayInstance();

    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: "Payment service is not configured",
      });
    }

    // Generate a short receipt ID (max 40 characters for Razorpay)
    const timestamp = Date.now().toString().slice(-10); // Last 10 digits
    const userIdShort = req.user.userId.toString().slice(-8); // Last 8 chars
    const receipt = `rcpt_${timestamp}_${userIdShort}`; // Total: ~24 chars

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: req.user.userId,
        planId: planId,
        planTitle: plan.title,
      },
    };

    // Use the createRazorpayOrder helper function with shortened receipt
    const order = await createRazorpayOrder(
      amount,
      "INR",
      receipt, // Use the shortened receipt
      options.notes
    );

    res.json({
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      planDetails: {
        title: plan.title,
        duration: `${plan.duration} ${plan.durationUnit}`,
      },
    });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message || "Unknown error",
    });
  }
};

// Verify payment and create subscription
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !planId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Use the config function for signature verification
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature",
      });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Check if user already has an active subscription for this plan
    const existingSubscription = await Subscription.findOne({
      userId: req.user.userId,
      planId: planId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription for this plan",
      });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();

    if (plan.durationUnit === "days") {
      endDate.setDate(endDate.getDate() + plan.duration);
    } else if (plan.durationUnit === "weeks") {
      endDate.setDate(endDate.getDate() + plan.duration * 7);
    } else if (plan.durationUnit === "months") {
      endDate.setMonth(endDate.getMonth() + plan.duration);
    }

    // Create subscription
    const subscription = await Subscription.create({
      userId: req.user.userId,
      planId,
      trainerId: plan.trainerId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: plan.discountPrice || plan.price,
      currency: "INR",
      status: "active",
      paymentStatus: "paid",
      startDate,
      endDate,
      autoRenew: false,
    });

    // Update plan subscribers count
    await Plan.findByIdAndUpdate(planId, { $inc: { totalSubscribers: 1 } });

    // Populate subscription details for response
    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate(
        "planId",
        "title thumbnail description duration durationUnit category difficultyLevel"
      )
      .populate("trainerId", "name avatarUrl email");

    res.json({
      success: true,
      message: "Payment verified and subscription created successfully",
      subscription: populatedSubscription,
      paymentDetails: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: plan.discountPrice || plan.price,
        date: startDate.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message || "Unknown error",
    });
  }
};

// Create subscription (legacy - keep for admin/backend use)
export const createSubscription = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { planId, paymentId, orderId, amount } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const startDate = new Date();
    const endDate = new Date();

    if (plan.durationUnit === "days") {
      endDate.setDate(endDate.getDate() + plan.duration);
    } else if (plan.durationUnit === "weeks") {
      endDate.setDate(endDate.getDate() + plan.duration * 7);
    } else if (plan.durationUnit === "months") {
      endDate.setMonth(endDate.getMonth() + plan.duration);
    }

    const subscription = await Subscription.create({
      userId: req.user.userId,
      planId,
      trainerId: plan.trainerId,
      paymentId,
      orderId,
      amount,
      status: "active",
      paymentStatus: "paid",
      startDate,
      endDate,
    });

    await Plan.findByIdAndUpdate(planId, { $inc: { totalSubscribers: 1 } });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || "Unknown error",
    });
  }
};

// Get payment details for a specific order
export const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { orderId } = req.params;

    // Use the getter function to check Razorpay configuration
    const razorpayInstance = getrazorpayInstance();

    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: "Payment service is not configured",
      });
    }

    try {
      // First, get the order to find payment ID
      const order = await razorpayInstance.orders.fetch(orderId);
      const payments = await razorpayInstance.orders.fetchPayments(orderId);

      let paymentDetails = null;

      if (payments.items && payments.items.length > 0) {
        const paymentId = payments.items[0].id;
        paymentDetails = await fetchPaymentDetails(paymentId);
      }

      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        paymentDetails: paymentDetails,
        payments: payments.items || [],
      });
    } catch (razorpayError: any) {
      console.error("Razorpay API error:", razorpayError);
      res.status(500).json({
        success: false,
        message: "Failed to fetch payment details from payment gateway",
        error: razorpayError.error?.description || razorpayError.message,
      });
    }
  } catch (error: any) {
    console.error("Get payment details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message || "Unknown error",
    });
  }
};

// Get my subscriptions
export const getMySubscriptions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const subscriptions = await Subscription.find({ userId: req.user.userId })
      .populate(
        "planId",
        "title thumbnail description duration durationUnit category difficultyLevel price discountPrice"
      )
      .populate("trainerId", "name avatarUrl email bio")
      .sort({ createdAt: -1 });

    // Filter out expired subscriptions from active count
    const now = new Date();
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "active" && sub.endDate > now
    );
    const expiredSubscriptions = subscriptions.filter(
      (sub) => sub.status === "active" && sub.endDate <= now
    );

    // Update status of expired subscriptions
    if (expiredSubscriptions.length > 0) {
      const expiredIds = expiredSubscriptions.map((sub) => sub._id);
      const expiredIdStrings = expiredSubscriptions.map((sub) =>
        sub._id.toString()
      );

      await Subscription.updateMany(
        { _id: { $in: expiredIds } },
        { $set: { status: "expired" } }
      );

      // Update the local array for response
      subscriptions.forEach((sub) => {
        if (expiredIdStrings.includes(sub._id.toString())) {
          sub.status = "expired";
        }
      });
    }

    res.json({
      success: true,
      subscriptions,
      summary: {
        total: subscriptions.length,
        active: activeSubscriptions.length,
        cancelled: subscriptions.filter((sub) => sub.status === "cancelled")
          .length,
        expired: expiredSubscriptions.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || "Unknown error",
    });
  }
};

// Get subscription by ID
export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const subscription = await Subscription.findById(id)
      .populate("planId")
      .populate("trainerId", "name avatarUrl bio email phone")
      .populate("userId", "name email avatarUrl");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Check authorization
    const isUser = subscription.userId._id.toString() === req.user.userId;
    const isTrainer = subscription.trainerId._id.toString() === req.user.userId;

    if (!isUser && !isTrainer) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if subscription has expired
    if (subscription.status === "active" && subscription.endDate < new Date()) {
      subscription.status = "expired";
      await subscription.save();
    }

    res.json({
      success: true,
      subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || "Unknown error",
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    if (subscription.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if subscription is already cancelled or expired
    if (subscription.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Subscription is already cancelled",
      });
    }

    if (subscription.status === "expired") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an expired subscription",
      });
    }

    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;
    await subscription.save();

    // Decrement plan subscribers count
    await Plan.findByIdAndUpdate(subscription.planId, {
      $inc: { totalSubscribers: -1 },
    });

    res.json({
      success: true,
      message: "Subscription cancelled successfully",
      subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || "Unknown error",
    });
  }
};

// Get trainer subscriptions
export const getTrainerSubscriptions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    if (req.user.role !== "trainer") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only trainers can access this endpoint",
      });
    }

    const trainerId = req.user.userId.toString();
    const mongoose = await import("mongoose");
    const isValidObjectId = mongoose.Types.ObjectId.isValid(trainerId);

    let query;
    if (isValidObjectId) {
      query = { trainerId: new mongoose.Types.ObjectId(trainerId) };
    } else {
      query = { trainerId: trainerId };
    }

    const subscriptions = await Subscription.find(query)
      .populate({
        path: "userId",
        select: "name email avatarUrl phone",
        model: "User",
      })
      .populate({
        path: "planId",
        select: "title thumbnail price duration durationUnit",
        model: "Plan",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!subscriptions || subscriptions.length === 0) {
      return res.json({
        success: true,
        subscriptions: [],
        summary: {
          total: 0,
          active: 0,
          cancelled: 0,
          expired: 0,
          totalRevenue: 0,
        },
        message: "No subscriptions found for this trainer",
      });
    }

    const now = new Date();
    const subscriptionUpdates = [];
    const updatedSubscriptions = [...subscriptions];

    for (let i = 0; i < updatedSubscriptions.length; i++) {
      const subscription = updatedSubscriptions[i];

      if (
        subscription.status === "active" &&
        new Date(subscription.endDate) <= now
      ) {
        subscriptionUpdates.push(subscription._id);
        updatedSubscriptions[i].status = "expired";
      }
    }

    if (subscriptionUpdates.length > 0) {
      try {
        await Subscription.updateMany(
          { _id: { $in: subscriptionUpdates } },
          { $set: { status: "expired" } }
        );
      } catch (updateError) {
        console.error("Error updating expired subscriptions:", updateError);
      }
    }

    const nowForStats = new Date();
    const activeSubscriptions = updatedSubscriptions.filter(
      (sub) => sub.status === "active" && new Date(sub.endDate) > nowForStats
    );
    const cancelledSubscriptions = updatedSubscriptions.filter(
      (sub) => sub.status === "cancelled"
    );
    const expiredSubscriptions = updatedSubscriptions.filter(
      (sub) => sub.status === "expired"
    );

    const totalRevenue = updatedSubscriptions
      .filter((sub) => sub.paymentStatus === "paid")
      .reduce((sum, sub) => sum + (sub.amount || 0), 0);

    res.json({
      success: true,
      subscriptions: updatedSubscriptions,
      summary: {
        total: updatedSubscriptions.length,
        active: activeSubscriptions.length,
        cancelled: cancelledSubscriptions.length,
        expired: expiredSubscriptions.length,
        totalRevenue: totalRevenue,
      },
    });
  } catch (error: any) {
    console.error("getTrainerSubscriptions ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Check if user is subscribed to a plan
export const checkUserSubscription = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { planId } = req.params;

    const subscription = await Subscription.findOne({
      userId: req.user.userId,
      planId: planId,
      status: "active",
      endDate: { $gt: new Date() },
    })
      .populate("planId", "title duration durationUnit")
      .populate("trainerId", "name");

    if (subscription) {
      res.json({
        success: true,
        isSubscribed: true,
        subscription,
        message: "User is subscribed to this plan",
      });
    } else {
      res.json({
        success: true,
        isSubscribed: false,
        message: "User is not subscribed to this plan",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || "Unknown error",
    });
  }
};
