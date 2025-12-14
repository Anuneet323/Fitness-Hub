import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  trainerId: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpful: mongoose.Types.ObjectId[];
  helpfulCount: number;
  trainerResponse?: {
    text: string;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: { type: String, trim: true },
    comment: { type: String, required: true },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    helpful: [{ type: Schema.Types.ObjectId, ref: "User" }],
    helpfulCount: { type: Number, default: 0 },
    trainerResponse: {
      text: String,
      respondedAt: Date,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ planId: 1, userId: 1 }, { unique: true });
ReviewSchema.index({ planId: 1, rating: -1 });
ReviewSchema.index({ trainerId: 1 });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
