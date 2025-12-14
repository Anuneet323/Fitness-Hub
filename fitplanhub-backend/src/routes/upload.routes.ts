// ========================================
// src/routes/upload.routes.ts
// ========================================
import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";
import { authenticate, authorizeTrainer } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { uploadLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

// Apply rate limiting to all upload routes
router.use(uploadLimiter);

// User uploads
router.post(
  "/avatar",
  authenticate,
  upload.single("file"),
  uploadController.uploadAvatar
);

router.post(
  "/cover",
  authenticate,
  upload.single("file"),
  uploadController.uploadCoverImage
);

// Trainer uploads
router.post(
  "/plan-thumbnail",
  authenticate,
  authorizeTrainer,
  upload.single("file"),
  uploadController.uploadPlanThumbnail
);

router.post(
  "/plan-image",
  authenticate,
  authorizeTrainer,
  upload.single("file"),
  uploadController.uploadPlanImage
);

// Generic plan-media route that handles both
router.post(
  "/plan-media",
  authenticate,
  authorizeTrainer,
  upload.single("file"),
  uploadController.uploadPlanImage
);

// Post uploads
router.post(
  "/post-media",
  authenticate,
  upload.single("file"),
  uploadController.uploadPostMedia
);

router.post(
  "/multiple",
  authenticate,
  upload.array("files", 5),
  uploadController.uploadMultiple
);

// Video uploads
router.post(
  "/video",
  authenticate,
  upload.single("file"),
  uploadController.uploadVideo
);

// Delete file
router.delete("/:publicId", authenticate, uploadController.deleteFile);

export default router;
