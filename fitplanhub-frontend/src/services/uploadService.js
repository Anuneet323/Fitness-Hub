// ============================================
// src/services/uploadService.js - File Uploads (UPDATED)
// ============================================

import api from "./api";

export const uploadService = {
  // Upload avatar -> /uploads/avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { success, url, publicId, ... }
  },

  // Upload cover image -> /uploads/cover-image (if your route is /uploads/cover use that)
  uploadCoverImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/cover-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload plan thumbnail -> /uploads/plan-thumbnail
  uploadPlanThumbnail: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/plan-thumbnail", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload plan image -> /uploads/plan-image
  uploadPlanImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/plan-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload plan media (generic wrapper: thumbnail / image)
  uploadPlanMedia: async (file, type = "image") => {
    if (type === "thumbnail") {
      return uploadService.uploadPlanThumbnail(file);
    }
    return uploadService.uploadPlanImage(file);
  },

  // Upload post media -> /uploads/post-media
  uploadPostMedia: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/post-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload video -> /uploads/video
  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload multiple files -> /uploads/multiple
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await api.post("/uploads/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { files: [...] }
  },

  // Delete file -> DELETE /uploads/:publicId with body { resourceType }
  deleteFile: async (publicId, resourceType = "image") => {
    const response = await api.delete(`/uploads/${publicId}`, {
      data: { resourceType },
    });
    return response.data;
  },
};
