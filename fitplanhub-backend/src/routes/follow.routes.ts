
// ========================================
// src/routes/follow.routes.ts - UPDATED
// ========================================
import { Router } from "express";
import * as followController from "../controllers/follow.controller";
import { authenticate, optionalAuth } from "../middleware/auth.middleware";

const router = Router();

// Follow/Unfollow actions
router.post("/:userId/follow", authenticate, followController.followUser);
router.delete("/:userId/unfollow", authenticate, followController.unfollowUser);

// Get followers/following lists
router.get("/:userId/followers", optionalAuth, followController.getFollowers);
router.get("/:userId/following", optionalAuth, followController.getFollowing);

// Check follow status
router.get("/:userId/check", optionalAuth, followController.checkFollowStatus);

// Get all trainers (browse trainers)
router.get("/trainers", optionalAuth, followController.getAllTrainers);

// Get trainer profile with details
router.get("/trainers/:userId", optionalAuth, followController.getTrainerProfile);

export default router;