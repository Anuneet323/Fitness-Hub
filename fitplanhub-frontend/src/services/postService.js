
// ============================================
// src/services/postService.js - Social Posts
// ============================================

import api from "./api";

export const postService = {
  // Create post
  createPost: async (postData) => {
    const response = await api.post("/posts", postData);
    return response.data;
  },

  // Get feed posts
  getFeedPosts: async (params = {}) => {
    const response = await api.get("/posts/feed", { params });
    return response.data;
  },

  // Get user posts
  getUserPosts: async (userId, params = {}) => {
    const response = await api.get(`/posts/user/${userId}`, { params });
    return response.data;
  },

  // Like/unlike post
  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Comment on post
  addComment: async (postId, text) => {
    const response = await api.post(`/posts/${postId}/comment`, { text });
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Get post by ID
  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },
};