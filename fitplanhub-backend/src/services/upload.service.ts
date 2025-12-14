
// ========================================
// src/services/upload.service.ts
// ========================================
import { uploadToCloudinary, deleteFromCloudinary, cloudinaryUploadOptions } from '../config/cloudinary';
import fs from 'fs';

export const uploadService = {
  uploadAvatar: async (filePath: string) => {
    const result = await uploadToCloudinary(filePath, cloudinaryUploadOptions.avatar);
    fs.unlinkSync(filePath); // Remove local file
    return result;
  },

  uploadCoverImage: async (filePath: string) => {
    const result = await uploadToCloudinary(filePath, cloudinaryUploadOptions.coverImage);
    fs.unlinkSync(filePath);
    return result;
  },

  uploadPlanThumbnail: async (filePath: string) => {
    const result = await uploadToCloudinary(filePath, cloudinaryUploadOptions.planThumbnail);
    fs.unlinkSync(filePath);
    return result;
  },

  uploadPlanImage: async (filePath: string) => {
    const result = await uploadToCloudinary(filePath, cloudinaryUploadOptions.planImage);
    fs.unlinkSync(filePath);
    return result;
  },

  uploadPostMedia: async (filePath: string) => {
    const result = await uploadToCloudinary(filePath, cloudinaryUploadOptions.postMedia);
    fs.unlinkSync(filePath);
    return result;
  },

  uploadVideo: async (filePath: string) => {
    const result = await uploadToCloudinary(filePath, cloudinaryUploadOptions.video);
    fs.unlinkSync(filePath);
    return result;
  },

  deleteFile: async (publicId: string, resourceType: 'image' | 'video' = 'image') => {
    return await deleteFromCloudinary(publicId, resourceType);
  }
};
