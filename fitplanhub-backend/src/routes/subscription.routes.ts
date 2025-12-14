// Subscription routes
import express from "express";
import {
  createOrder,
  verifyPayment,
  createSubscription,
  getMySubscriptions,
  getSubscriptionById,
  cancelSubscription,
  getTrainerSubscriptions,
  getPaymentDetails,
  checkUserSubscription,
} from "../controllers/subscription.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// POST routes
router.post("/create-order", authenticate, createOrder);
router.post("/verify-payment", authenticate, verifyPayment);
router.post("/", authenticate, createSubscription);

// GET routes - specific first
router.get("/my-subscriptions", authenticate, getMySubscriptions);
router.get("/trainer-subscriptions", authenticate, getTrainerSubscriptions);
router.get("/check-subscription/:planId", authenticate, checkUserSubscription);
router.get("/payment-details/:orderId", authenticate, getPaymentDetails);

// PUT routes
router.put("/:id/cancel", authenticate, cancelSubscription);

// Generic route last
router.get("/:id", authenticate, getSubscriptionById);

export default router;
