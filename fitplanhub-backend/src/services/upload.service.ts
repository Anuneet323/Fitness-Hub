// ========================================
// src/services/upload.service.ts - FIXED
// ========================================
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinaryUploadOptions,
} from "../config/cloudinary";
import fs from "fs";
import path from "path";

export const uploadService = {
  uploadAvatar: async (filePath: string) => {
    try {
      console.log("Uploading avatar from:", filePath);

      // Verify file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await uploadToCloudinary(
        filePath,
        cloudinaryUploadOptions.avatar
      );

      // Remove local file after successful upload
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }

      return result;
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  },

  uploadCoverImage: async (filePath: string) => {
    try {
      console.log("Uploading cover image from:", filePath);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await uploadToCloudinary(
        filePath,
        cloudinaryUploadOptions.coverImage
      );

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }

      return result;
    } catch (error) {
      console.error("Cover image upload error:", error);
      throw error;
    }
  },

  uploadPlanThumbnail: async (filePath: string) => {
    try {
      console.log("Uploading plan thumbnail from:", filePath);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await uploadToCloudinary(
        filePath,
        cloudinaryUploadOptions.planThumbnail
      );

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }

      return result;
    } catch (error) {
      console.error("Plan thumbnail upload error:", error);
      throw error;
    }
  },

  uploadPlanImage: async (filePath: string) => {
    try {
      console.log("Uploading plan image from:", filePath);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await uploadToCloudinary(
        filePath,
        cloudinaryUploadOptions.planImage
      );

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }

      return result;
    } catch (error) {
      console.error("Plan image upload error:", error);
      throw error;
    }
  },

  uploadPostMedia: async (filePath: string) => {
    try {
      console.log("Uploading post media from:", filePath);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await uploadToCloudinary(
        filePath,
        cloudinaryUploadOptions.postMedia
      );

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }

      return result;
    } catch (error) {
      console.error("Post media upload error:", error);
      throw error;
    }
  },

  uploadVideo: async (filePath: string) => {
    try {
      console.log("Uploading video from:", filePath);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await uploadToCloudinary(
        filePath,
        cloudinaryUploadOptions.video
      );

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }

      return result;
    } catch (error) {
      console.error("Video upload error:", error);
      throw error;
    }
  },

  deleteFile: async (
    publicId: string,
    resourceType: "image" | "video" = "image"
  ) => {
    try {
      console.log("Deleting file:", publicId);
      return await deleteFromCloudinary(publicId, resourceType);
    } catch (error) {
      console.error("File delete error:", error);
      throw error;
    }
  },
};
