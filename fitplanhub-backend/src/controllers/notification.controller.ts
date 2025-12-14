// ========================================
// src/controllers/notification.controller.ts
// ========================================
import { Request, Response } from "express";
import { Notification } from "../models/Notification.model";

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { page = 1, limit = 20, isRead } = req.query;
    const query: any = { userId: req.user.userId };

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const notifications = await Notification.find(query)
      .populate("fromUserId", "name avatarUrl role")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    });

    res.json({
      notifications,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Notification.updateMany(
      { userId: req.user.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Notification.findByIdAndDelete(id);

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteAllRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Notification.deleteMany({
      userId: req.user.userId,
      isRead: true,
    });

    res.json({
      message: "All read notifications deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const count = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createNotification = async (notificationData: {
  userId: string;
  type:
    | "follow"
    | "like"
    | "comment"
    | "subscription"
    | "review"
    | "message"
    | "reminder"
    | "system";
  title: string;
  message: string;
  link?: string;
  fromUserId?: string;
  relatedId?: string;
}) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const getNotificationsByType = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const validTypes = [
      "follow",
      "like",
      "comment",
      "subscription",
      "review",
      "message",
      "reminder",
      "system",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid notification type" });
    }

    const notifications = await Notification.find({
      userId: req.user.userId,
      type,
    })
      .populate("fromUserId", "name avatarUrl role")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Notification.countDocuments({
      userId: req.user.userId,
      type,
    });

    res.json({
      notifications,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const bulkDeleteNotifications = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ message: "Invalid notification IDs" });
    }

    const result = await Notification.deleteMany({
      _id: { $in: notificationIds },
      userId: req.user.userId,
    });

    res.json({
      message: "Notifications deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getNotificationSettings = async (req: Request, res: Response) => {
  try {
    const settings = {
      email: {
        follow: true,
        like: false,
        comment: true,
        subscription: true,
        review: true,
        message: true,
        reminder: true,
        system: true,
      },
      push: {
        follow: true,
        like: true,
        comment: true,
        subscription: true,
        review: true,
        message: true,
        reminder: true,
        system: true,
      },
    };

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateNotificationSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const { settings } = req.body;

    res.json({
      message: "Notification settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
