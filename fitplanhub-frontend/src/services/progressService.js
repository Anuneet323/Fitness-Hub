

// ============================================
// src/services/progressService.js - Progress Tracking
// ============================================

import api from "./api";

export const progressService = {
  // Log progress
  logProgress: async (progressData) => {
    const response = await api.post("/progress", progressData);
    return response.data;
  },

  // Get my progress
  getMyProgress: async (params = {}) => {
    const response = await api.get("/progress/my-progress", { params });
    return response.data;
  },

  // Get progress stats
  getProgressStats: async (planId) => {
    const response = await api.get(`/progress/stats/${planId}`);
    return response.data;
  },

  // Update progress entry
  updateProgress: async (id, progressData) => {
    const response = await api.put(`/progress/${id}`, progressData);
    return response.data;
  },

  // Delete progress entry
  deleteProgress: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  },
};
