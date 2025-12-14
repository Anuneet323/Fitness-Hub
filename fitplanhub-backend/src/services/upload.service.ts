// Upload service for Cloudinary
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinaryUploadOptions,
} from "../config/cloudinary";
import fs from "fs";

const uploadFile = async (filePath: string, options: any) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const result = await uploadToCloudinary(filePath, options);

  // Cleanup local file
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("Local file delete failed:", err);
  }

  return result;
};

export const uploadService = {
  uploadAvatar: async (filePath: string) => {
    console.log("Uploading avatar:", filePath);
    return await uploadFile(filePath, cloudinaryUploadOptions.avatar);
  },

  uploadCoverImage: async (filePath: string) => {
    console.log("Uploading cover:", filePath);
    return await uploadFile(filePath, cloudinaryUploadOptions.coverImage);
  },

  // Use document for thumbnails (from your cloudinary config)
  uploadPlanThumbnail: async (filePath: string) => {
    console.log("Uploading plan thumbnail:", filePath);
    return await uploadFile(filePath, cloudinaryUploadOptions.document);
  },

  // Use document for plan images
  uploadPlanImage: async (filePath: string) => {
    console.log("Uploading plan image:", filePath);
    return await uploadFile(filePath, cloudinaryUploadOptions.document);
  },

  // Generic upload for post media
  uploadPostMedia: async (filePath: string) => {
    console.log("Uploading post media:", filePath);
    return await uploadFile(filePath, {});
  },

  // Generic upload for video
  uploadVideo: async (filePath: string) => {
    console.log("Uploading video:", filePath);
    return await uploadFile(filePath, { resource_type: "video" });
  },

  deleteFile: async (
    publicId: string,
    resourceType: "image" | "video" = "image"
  ) => {
    console.log("Deleting file:", publicId);
    return await deleteFromCloudinary(publicId, resourceType);
  },
};
