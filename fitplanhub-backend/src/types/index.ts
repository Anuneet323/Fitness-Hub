import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "user" | "trainer";
    email?: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export enum NotificationType {
  FOLLOW = "follow",
  LIKE = "like",
  COMMENT = "comment",
  SUBSCRIPTION = "subscription",
  REVIEW = "review",
  MESSAGE = "message",
  REMINDER = "reminder",
  SYSTEM = "system",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  PENDING = "pending",
}

export enum PaymentStatus {
  CREATED = "created",
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}
