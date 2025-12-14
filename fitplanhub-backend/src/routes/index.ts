// ========================================
// src/routes/index.ts
// ========================================
import { Router } from "express";
import authRoutes from "./auth.routes";
import planRoutes from "./plan.routes";
import subscriptionRoutes from "./subscription.routes";
import followRoutes from "./follow.routes";
import postRoutes from "./post.routes";
import reviewRoutes from "./review.routes";
import progressRoutes from "./progress.routes";
import notificationRoutes from "./notification.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

// Mount all routes
router.use("/auth", authRoutes);
router.use("/plans", planRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/follow", followRoutes);
router.use("/posts", postRoutes);
router.use("/reviews", reviewRoutes);
router.use("/progress", progressRoutes);
router.use("/notifications", notificationRoutes);
router.use("/uploads", uploadRoutes);

// Root API endpoint
router.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "🎯 FitPlanHub API v1.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: {
      auth: "/api/auth",
      plans: "/api/plans",
      subscriptions: "/api/subscriptions",
      follow: "/api/follow",
      posts: "/api/posts",
      reviews: "/api/reviews",
      progress: "/api/progress",
      notifications: "/api/notifications",
      uploads: "/api/uploads",
      health: "/api/health",
    },
  });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "FitPlanHub API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
