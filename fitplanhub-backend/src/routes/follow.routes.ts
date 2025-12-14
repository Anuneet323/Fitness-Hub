// Follow routes
import { Router } from "express";
import * as followController from "../controllers/follow.controller";
import { authenticate, optionalAuth } from "../middleware/auth.middleware";

const router = Router();

// Follow/unfollow
router.post("/:userId/follow", authenticate, followController.followUser);
router.delete("/:userId/unfollow", authenticate, followController.unfollowUser);

// Lists
router.get("/:userId/followers", optionalAuth, followController.getFollowers);
router.get("/:userId/following", optionalAuth, followController.getFollowing);

// Check status
router.get("/:userId/check", optionalAuth, followController.checkFollowStatus);

// Trainers
router.get("/trainers", optionalAuth, followController.getAllTrainers);
router.get(
  "/trainers/:userId",
  optionalAuth,
  followController.getTrainerProfile
);

export default router;
