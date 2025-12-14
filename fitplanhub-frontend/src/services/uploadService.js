

// ============================================
// src/services/uploadService.js - File Uploads
// ============================================

import api from "./api";

export const uploadService = {
  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload cover image
  uploadCover: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/cover", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload plan media
  uploadPlanMedia: async (file, type = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const response = await api.post("/uploads/plan-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload post media
  uploadPostMedia: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/post-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete file
  deleteFile: async (publicId) => {
    const response = await api.delete(`/uploads/${publicId}`);
    return response.data;
  },
};
