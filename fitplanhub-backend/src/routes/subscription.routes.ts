// In your routes file - src/routes/subscription.routes.ts
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
// Use named import instead of default import
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Protected routes - use authenticate middleware
router.post("/create-order", authenticate, createOrder);
router.post("/verify-payment", authenticate, verifyPayment);
router.post("/", authenticate, createSubscription); // Legacy route
router.get("/my-subscriptions", authenticate, getMySubscriptions);
router.get("/check-subscription/:planId", authenticate, checkUserSubscription);
router.get("/:id", authenticate, getSubscriptionById);
router.put("/:id/cancel", authenticate, cancelSubscription);
router.get("/trainer-subscriptions", authenticate, getTrainerSubscriptions);
router.get("/payment-details/:orderId", authenticate, getPaymentDetails);

export default router;
