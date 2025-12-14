// Upload routes
import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";
import { authenticate, authorizeTrainer } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { uploadLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

// Rate limit all uploads
router.use(uploadLimiter);

// User profile uploads
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

// Trainer plan uploads
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
router.post(
  "/plan-media",
  authenticate,
  authorizeTrainer,
  upload.single("file"),
  uploadController.uploadPlanImage
);

// Post/media uploads
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
router.post(
  "/video",
  authenticate,
  upload.single("file"),
  uploadController.uploadVideo
);

// Delete files
router.delete("/:publicId", authenticate, uploadController.deleteFile);

export default router;
