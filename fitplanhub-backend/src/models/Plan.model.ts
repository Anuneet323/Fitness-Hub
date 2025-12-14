// ========================================
// src/models/Plan.model.ts
// ========================================

import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  trainerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  detailedDescription?: string;
  category: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  price: number;
  discountPrice?: number;
  duration: number;
  durationUnit: "days" | "weeks" | "months";
  thumbnail?: string;
  images?: string[];
  videoUrl?: string;
  features?: string[];
  workoutSchedule?: Array<{
    day: number;
    title: string;
    exercises: Array<{
      name: string;
      sets?: number;
      reps?: number;
      duration?: number;
      restTime?: number;
    }>;
  }>;
  nutritionPlan?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    meals?: Array<{
      name: string;
      time: string;
      items: string[];
    }>;
  };
  tags?: string[];
  requirements?: string[];
  isActive: boolean;
  isFeatured: boolean;
  totalSubscribers: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    detailedDescription: { type: String },
    category: {
      type: String,
      required: true,
      enum: [
        "weight-loss",
        "muscle-gain",
        "strength",
        "cardio",
        "yoga",
        "flexibility",
        "sports",
        "general-fitness",
      ],
    },
    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    durationUnit: {
      type: String,
      enum: ["days", "weeks", "months"],
      default: "days",
    },
    thumbnail: { type: String },
    images: [{ type: String }],
    videoUrl: { type: String },
    features: [{ type: String }],
    workoutSchedule: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        exercises: [
          {
            name: { type: String, required: true },
            sets: Number,
            reps: Number,
            duration: Number,
            restTime: Number,
          },
        ],
      },
    ],
    nutritionPlan: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fats: Number,
      meals: [
        {
          name: String,
          time: String,
          items: [String],
        },
      ],
    },
    tags: [{ type: String }],
    requirements: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    totalSubscribers: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PlanSchema.index({ trainerId: 1 });
PlanSchema.index({ category: 1 });
PlanSchema.index({ isActive: 1 });
PlanSchema.index({ averageRating: -1 });

export const Plan = mongoose.model<IPlan>("Plan", PlanSchema);
