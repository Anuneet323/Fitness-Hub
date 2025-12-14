// ============================================
// src/services/followService.js - Follow System
// ============================================

import api from "./api";

export const followService = {
  // Follow user
  followUser: async (userId) => {
    const response = await api.post(`/follow/${userId}/follow`);
    return response.data;
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    const response = await api.delete(`/follow/${userId}/unfollow`);
    return response.data;
  },

  // Get followers
  getFollowers: async (userId) => {
    const response = await api.get(`/follow/${userId}/followers`);
    return response.data;
  },

  // Get following
  getFollowing: async (userId) => {
    const response = await api.get(`/follow/${userId}/following`);
    return response.data;
  },
};
