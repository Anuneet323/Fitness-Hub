import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: "created" | "pending" | "success" | "failed";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  receipt: string;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
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
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "pending", "success", "failed"],
      default: "created",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "pending",
    },
    receipt: { type: String, required: true },
    refundId: { type: String },
    refundAmount: { type: Number },
    refundReason: { type: String },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ status: 1 });

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
