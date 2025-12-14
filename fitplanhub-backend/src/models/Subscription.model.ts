import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  trainerId: mongoose.Types.ObjectId;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "active" | "expired" | "cancelled" | "pending";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
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
      index: true,
    },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "pending",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, planId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ endDate: 1 });

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);
