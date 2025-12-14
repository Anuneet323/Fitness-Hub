// Request validation schemas
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
  role: z.enum(["user", "trainer"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export const createPlanSchema = z.object({
  title: z.string().min(3, "Title too short"),
  description: z.string().min(10, "Description too short"),
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
  duration: z.number().min(1, "Duration required"),
  durationUnit: z.enum(["days", "weeks", "months"]),
});

export const createReviewSchema = z.object({
  planId: z.string().min(1, "Plan ID required"),
  rating: z.number().min(1).max(5, "Rating 1-5 only"),
  comment: z.string().min(10, "Comment too short"),
  title: z.string().optional(),
});

export const progressSchema = z.object({
  planId: z.string().min(1, "Plan ID required"),
  date: z.string().datetime(),
  weight: z.number().optional(),
  calories: z.number().optional(),
  workoutsDone: z.number().optional(),
});

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
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
