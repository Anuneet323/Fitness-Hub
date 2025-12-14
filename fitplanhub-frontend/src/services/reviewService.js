

// ============================================
// src/services/reviewService.js - Reviews
// ============================================

import api from "./api";

export const reviewService = {
  // Create review
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  // Get plan reviews
  getPlanReviews: async (planId, params = {}) => {
    const response = await api.get(`/reviews/plan/${planId}`, { params });
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};