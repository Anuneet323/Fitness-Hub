
// ============================================
// src/services/messageService.js - Messages
// ============================================

import api from "./api";

export const messageService = {
  // Get conversation
  getConversation: async (userId, params = {}) => {
    const response = await api.get(`/messages/conversation/${userId}`, {
      params,
    });
    return response.data;
  },

  // Get all conversations
  getConversations: async () => {
    const response = await api.get("/messages/conversations");
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },

  // Search messages
  searchMessages: async (query) => {
    const response = await api.get("/messages/search", {
      params: { q: query },
    });
    return response.data;
  },
};
