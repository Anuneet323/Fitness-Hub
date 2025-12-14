// ============================================
// src/services/notificationService.js - Notifications
// ============================================

import api from "./api";

export const notificationService = {
  // Get notifications
  getNotifications: async (params = {}) => {
    const response = await api.get("/notifications", { params });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  // Get notifications by type
  getNotificationsByType: async (type, params = {}) => {
    const response = await api.get(`/notifications/type/${type}`, { params });
    return response.data;
  },

  // Mark as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.put("/notifications/mark-all-read");
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Delete all read notifications
  deleteAllRead: async () => {
    const response = await api.delete("/notifications/read/all");
    return response.data;
  },

  // Bulk delete notifications
  bulkDelete: async (notificationIds) => {
    const response = await api.post("/notifications/bulk-delete", {
      notificationIds,
    });
    return response.data;
  },
};
