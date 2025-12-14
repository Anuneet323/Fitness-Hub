
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type:
    | "like"
    | "comment"
    | "follow"
    | "subscription"
    | "message"
    | "review"
    | "plan_update"
    | "reminder"
    | "system";
  title: string;
  message: string;
  link?: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedModel?: string;
  fromUserId?: mongoose.Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "subscription",
        "message",
        "review",
        "plan_update",
        "reminder",
        "system",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    relatedId: { type: Schema.Types.ObjectId },
    relatedModel: { type: String },
    fromUserId: { type: Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
