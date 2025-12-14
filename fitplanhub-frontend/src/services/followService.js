// ============================================
// src/services/followService.js - Follow System (UPDATED)
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
  getFollowers: async (userId, params = {}) => {
    const response = await api.get(`/follow/${userId}/followers`, { params });
    return response.data;
  },

  // Get following
  getFollowing: async (userId, params = {}) => {
    const response = await api.get(`/follow/${userId}/following`, { params });
    return response.data;
  },

  // Check follow status
  checkFollowStatus: async (userId) => {
    const response = await api.get(`/follow/${userId}/check`);
    return response.data;
  },

  // Get all trainers (browse trainers)
  getAllTrainers: async (params = {}) => {
    const response = await api.get("/follow/trainers", { params });
    return response.data;
  },

  // Get trainer profile with details
  getTrainerProfile: async (userId) => {
    const response = await api.get(`/follow/trainers/${userId}`);
    return response.data;
  },

  // Search trainers
  searchTrainers: async (query, params = {}) => {
    const response = await api.get("/follow/trainers", {
      params: { search: query, ...params },
    });
    return response.data;
  },

  // Get trainers by specialization
  getTrainersBySpecialization: async (specialization, params = {}) => {
    const response = await api.get("/follow/trainers", {
      params: { specialization, ...params },
    });
    return response.data;
  },

  // Get popular trainers (sorted by followers)
  getPopularTrainers: async (params = {}) => {
    const response = await api.get("/follow/trainers", {
      params: { sortBy: "followers", ...params },
    });
    return response.data;
  },

  // Get experienced trainers (sorted by experience)
  getExperiencedTrainers: async (params = {}) => {
    const response = await api.get("/follow/trainers", {
      params: { sortBy: "experience", ...params },
    });
    return response.data;
  },
};

// Utility functions for follow service
export const followUtils = {
  // Format follower count
  formatFollowerCount: (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  },

  // Get follow button text
  getFollowButtonText: (isFollowing) => {
    return isFollowing ? "Following" : "Follow";
  },

  // Get follow button style classes
  getFollowButtonClasses: (isFollowing) => {
    if (isFollowing) {
      return "bg-slate-200 text-slate-700 hover:bg-slate-300";
    }
    return "bg-indigo-600 text-white hover:bg-indigo-700";
  },
};

export default followService;
