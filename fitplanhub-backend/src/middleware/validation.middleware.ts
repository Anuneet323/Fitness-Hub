// ========================================
// src/middleware/validation.middleware.ts
// ========================================
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// Validation schemas
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "trainer"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createPlanSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "weight-loss",
    "muscle-gain",
    "strength",
    "cardio",
    "yoga",
    "flexibility",
    "sports",
    "general-fitness",
  ]),
  difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().min(0, "Price must be positive"),
  duration: z.number().min(1, "Duration must be at least 1"),
  durationUnit: z.enum(["days", "weeks", "months"]),
});

export const createReviewSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  title: z.string().optional(),
});

export const progressSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
  date: z.string().datetime(),
  weight: z.number().optional(),
  calories: z.number().optional(),
  workoutsDone: z.number().optional(),
});

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
