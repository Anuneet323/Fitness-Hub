import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  validate,
  signupSchema,
  loginSchema,
} from "../middleware/validation.middleware";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.post(
  "/signup",
  authLimiter,
  validate(signupSchema),
  authController.signup
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
